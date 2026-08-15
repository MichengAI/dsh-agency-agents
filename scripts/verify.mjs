import { access, readFile } from 'node:fs/promises'
import z from '@deepseek-ai/schemastery'

let failures = 0

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`通过：${label}`)
    return
  }
  failures += 1
  console.error(`失败：${label}${detail === '' ? '' : `（${detail}）`}`)
}

const packageUrl = new URL('../package.json', import.meta.url)
const packageJson = JSON.parse(await readFile(packageUrl, 'utf8'))

check('DSH bundle 指向 Cordis patch', packageJson.dsh?.bundle?.patch === './cordis.patch.yml')
check(
  '发布文件包含运行代码、智能体资产、patch、双语说明和授权文件',
  ['lib', 'assets/agency-agents', 'cordis.patch.yml', 'README.md', 'README.zh-CN.md', 'LICENSE', 'NOTICE', 'docs']
    .every((entry) => packageJson.files?.includes(entry)),
)
check('包许可证为 Apache-2.0', packageJson.license === 'Apache-2.0')

for (const file of ['../lib/index.js', '../cordis.patch.yml', '../LICENSE', '../NOTICE', '../README.zh-CN.md', '../assets/agency-agents/LICENSE', '../docs/04-Agent运行体系/01-内置智能体清单/00-清单索引.md']) {
  try {
    await access(new URL(file, import.meta.url))
    check(`发布文件存在：${file.slice(3)}`, true)
  } catch {
    check(`发布文件存在：${file.slice(3)}`, false)
  }
}

const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
check('Cordis patch 挂载当前包名', patch.includes(`name: '${packageJson.name}'`))

const license = await readFile(new URL('../LICENSE', import.meta.url), 'utf8')
check('根许可证为 Apache License 2.0 正文', license.startsWith('Apache License\n                           Version 2.0'))

const plugin = await import(new URL('../lib/index.js', import.meta.url).href)
check('编译入口导出 DSH 插件约定', ['name', 'Config', 'apply'].every((key) => key in plugin))

const defaultConfig = z.resolve({}, plugin.Config)[0]
const bundledExperts = await plugin.loadCatalog(plugin.resolveCatalogRoot(''), defaultConfig.divisions)
check('内置智能体总数为 271', bundledExperts.size === 271, `实际为 ${bundledExperts.size}`)
const bundledDivisions = new Set([...bundledExperts.values()].map((expert) => expert.division))
check('17 个标准分区均包含内置智能体', defaultConfig.divisions.every((division) => bundledDivisions.has(division)))

if (failures > 0) {
  console.error(`\n${failures} 项验证失败`)
  process.exit(1)
}

console.log('\n全部发布验证通过')
