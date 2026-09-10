// 为真实 React / 原生 dialog 回归提供隔离页面，不加载宿主或用户配置。
import { build } from 'tsdown'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const directory = await mkdtemp(join(tmpdir(), 'agency-browser-'))
await build({
  config: false,
  entry: { fixture: 'test/browser/fixture.tsx' },
  outDir: directory,
  platform: 'browser', format: 'esm', dts: false,
  deps: { alwaysBundle: () => true },
  define: { 'process.env.NODE_ENV': JSON.stringify('development') }
})
const bundle = await readFile(join(directory, 'fixture.js'))
await rm(directory, { recursive: true, force: true })
const server = createServer((request, response) => {
  if (request.url === '/fixture.js') {
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    response.end(bundle)
  } else {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.end('<!doctype html><html lang="zh"><meta charset="utf-8"><title>弹窗回归</title><div id="root"></div><script type="module" src="/fixture.js"></script></html>')
  }
})
server.listen(18769, '127.0.0.1')
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  server.close(() => process.exit(0))
})
