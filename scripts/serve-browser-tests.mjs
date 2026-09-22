// 为真实 React / 原生 dialog 回归提供隔离页面，不加载宿主或用户配置。
import { build } from 'tsdown'
import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function cssModulesPlugin() {
  return {
    name: 'identity-css-modules',
    enforce: 'pre',
    /** @param {string} source @param {string | undefined} importer */
    resolveId(source, importer) {
      if (!source.endsWith('.css') || importer === undefined) return
      const from = importer.startsWith('file:') ? fileURLToPath(importer) : importer
      return `\0style:${Buffer.from(resolve(dirname(from), source)).toString('base64')}`
    },
    /** @param {string} id */
    load(id) {
      if (!id.startsWith('\0style:')) return
      const file = Buffer.from(id.slice('\0style:'.length), 'base64').toString()
      if (!existsSync(file)) return 'export default {}'
      const css = readFileSync(file, 'utf8')
      const names = [...new Set([...css.matchAll(/\.([_a-zA-Z][\w-]*)/g)].map((match) => match[1]))]
      const fields = names.map((name) => `${JSON.stringify(name)}:${JSON.stringify(name)}`).join(',')
      return `const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style); export default {${fields}}`
    },
  }
}

const directory = await mkdtemp(join(tmpdir(), 'agency-browser-'))
let bundle
try {
  await build({
  config: false,
  entry: { fixture: 'test/browser/fixture.tsx' },
  outDir: directory,
  platform: 'browser', format: 'esm', dts: false,
  plugins: [cssModulesPlugin()],
  deps: { alwaysBundle: () => true },
  define: { 'process.env.NODE_ENV': JSON.stringify('development') }
  })
  bundle = await readFile(join(directory, 'fixture.js'))
} finally {
  // 构建或读取失败也清理，避免测试启动失败留下临时目录。
  await rm(directory, { recursive: true, force: true })
}
const server = createServer((request, response) => {
  if (request.url === '/fixture.js') {
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    response.end(bundle)
  } else {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.end('<!doctype html><html lang="zh"><meta charset="utf-8"><title>弹窗回归</title><div id="root"></div><script type="module" src="/fixture.js"></script></html>')
  }
})
server.listen(Number(process.env.AGENCY_BROWSER_TEST_PORT ?? 18769), '127.0.0.1')
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  server.close(() => process.exit(0))
})
