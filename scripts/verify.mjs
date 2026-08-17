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
  ['lib', 'assets/agency-agents', 'cordis.patch.yml', 'README.md', 'README.zh-CN.md', 'LICENSE', 'NOTICE']
    .every((entry) => packageJson.files?.includes(entry)),
)
check('包许可证为 Apache-2.0', packageJson.license === 'Apache-2.0')
check(
  '包仓库元数据与发布溯源仓库一致',
  packageJson.repository?.type === 'git' && packageJson.repository?.url === 'https://github.com/MichengAI/dsh-agency-agents.git',
)

for (const file of ['../lib/index.js', '../lib/remote.js', '../lib/client.js', '../cordis.patch.yml', '../LICENSE', '../NOTICE', '../README.zh-CN.md', '../assets/agency-agents/LICENSE']) {
  try {
    await access(new URL(file, import.meta.url))
    check(`发布文件存在：${file.slice(3)}`, true)
  } catch {
    check(`发布文件存在：${file.slice(3)}`, false)
  }
}

try {
  const workflow = await readFile(new URL('../.github/workflows/publish.yml', import.meta.url), 'utf8')
  check('npm 受信发布工作流存在', true)
  check('npm 受信发布仅由 v 标签触发', workflow.includes("tags:\n      - 'v*'"))
  check('npm 受信发布申请 OIDC 权限', workflow.includes('id-token: write'))
  check('npm 受信发布先执行发布门禁', workflow.includes('pnpm prepublishOnly'))
  check('npm 受信发布使用官方发布命令', workflow.includes('npm publish'))
  check('npm 受信发布不注入令牌式 registry 配置', !workflow.includes('registry-url'))
  check('npm 受信发布不缓存依赖', !workflow.includes('cache:'))
  check('npm 受信发布隔离 Node 校验脚本避免 shell 插值', workflow.includes("<<'NODE'"))
} catch {
  check('npm 受信发布工作流存在', false)
}

const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
check('Cordis patch 挂载当前包名', patch.includes(`name: '${packageJson.name}'`))
check('Cordis patch 挂载顶层 Remote 服务', patch.includes(`name: '${packageJson.name}/remote'`))

const license = await readFile(new URL('../LICENSE', import.meta.url), 'utf8')
check('根许可证为 Apache License 2.0 正文', license.startsWith('Apache License\n                           Version 2.0'))


function collectExportTypes(exportsValue) {
  if (exportsValue === null || typeof exportsValue !== 'object') return []
  const paths = []
  for (const value of Object.values(exportsValue)) {
    if (value === null || typeof value !== 'object') continue
    if (typeof value.types === 'string' && value.types.startsWith('./')) paths.push(value.types)
  }
  return paths
}

for (const typesPath of collectExportTypes(packageJson.exports)) {
  try {
    await access(new URL(typesPath, packageUrl))
    check(`导出 types 路径存在：${typesPath.slice(2)}`, true)
  } catch {
    check(`导出 types 路径存在：${typesPath.slice(2)}`, false)
  }
}
const plugin = await import(new URL('../lib/index.js', import.meta.url).href)
check('编译入口导出 DSH 插件约定', ['name', 'Config', 'apply'].every((key) => key in plugin))

const defaultConfig = z.resolve({}, plugin.Config)[0]
const bundledExperts = await plugin.loadCatalog(plugin.resolveCatalogRoot(''), defaultConfig.divisions)
check('内置智能体总数为 271', bundledExperts.size === 271, `实际为 ${bundledExperts.size}`)
const bundledDivisions = new Set([...bundledExperts.values()].map((expert) => expert.division))
check('17 个标准分区均包含内置智能体', defaultConfig.divisions.every((division) => bundledDivisions.has(division)))
const missingZh = [...bundledExperts.keys()].filter((slug) => plugin.ZH_NAME?.[slug] === undefined)
check('内置智能体均有中文名', missingZh.length === 0, missingZh.slice(0, 8).join(', '))


if (failures > 0) {
  console.error(`\n${failures} 项验证失败`)
  process.exit(1)
}

console.log('\n全部发布验证通过')
