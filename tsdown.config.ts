import type { UserConfig } from 'tsdown'
import ts from 'typescript'

const decoratorSyntax = /^\s*@[A-Za-z_$][\w$]*/m

/** 将标准装饰器降级，避免 Node 直接解析 @Remote 语法；Vitest 同步逻辑见 vitest.config.ts。 */
function standardDecoratorPlugin() {
  return {
    name: 'standard-decorators',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const file = id.split('?', 1)[0]!
      if (!/\.[cm]?tsx?$/.test(file) || !decoratorSyntax.test(code)) return
      const result = ts.transpileModule(code, {
        fileName: file,
        compilerOptions: { target: ts.ScriptTarget.ES2024, module: ts.ModuleKind.ESNext },
      })
      return { code: result.outputText.replace(/\n?\/\/# sourceMappingURL=.*$/u, '\n'), map: result.sourceMapText }
    },
  }
}

/**
 * Client-bundle 构建（简化版）：产出 node 半 lib/index.js(+d.ts) 与浏览器半
 * lib/client.js。client 半是 CJS + window.__ModuleLoader__.load banner，
 * externals 命中平台冻结模块表（react / cordis / slots / primitives / …），
 * 其余依赖一律内联。client 代码只用 React.createElement + 手动注入 <style>，
 * 因此这里省略了 monorepo 里的 CSS Modules（lightningcss）与 purity gate。
 */

/** 平台冻结模块表（与 harness packages/client/web/src/platform.ts 一致）。 */
const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
] as const

/** 运行时 store 豁免（与 harness tsdown.client.ts 的 RUNTIME_STORE_EXEMPTION 一致）。 */
const RUNTIME_STORE_EXEMPTION = '@deepseek-ai/dsh-client-runtime/client'

const CLIENT_EXTERNALS: readonly string[] = [...PLATFORM_MODULES, RUNTIME_STORE_EXEMPTION]

const ID = '@michengai/dsh-agency-agents'

const node: UserConfig = {
  name: ID,
  entry: { index: 'src/index.ts', remote: 'src/remote.ts' },
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  plugins: [standardDecoratorPlugin()],
  dts: true,
  fixedExtension: false,
  clean: true,
}

const client: UserConfig = {
  name: `${ID}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  clean: false,
  deps: {
    neverBundle: [...CLIENT_EXTERNALS],
    alwaysBundle: (id: string) => !CLIENT_EXTERNALS.includes(id),
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [node, client]
