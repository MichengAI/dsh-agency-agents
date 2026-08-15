import ts from 'typescript'
import { defineConfig } from 'vitest/config'

const decoratorSyntax = /^\s*@[A-Za-z_$][\w$]*/m

/**
 * 在 Vite 默认解析前降级标准 TypeScript 装饰器（@Remote 等 stage-3 语法）。
 * 复刻自 DSH 的 vitest.shared.ts#standardDecoratorPlugin（构建侧同步逻辑见
 * tsdown.config.ts）：esbuild 不解析
 * stage-3 装饰器，先用 tsc 的 transpileModule 降级为 __esDecorate 调用。
 */
function standardDecoratorPlugin() {
  return {
    name: 'standard-decorators',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const file = id.split('?', 1)[0]!
      if (!/\.[cm]?tsx?$/.test(file) || !decoratorSyntax.test(code)) return
      const result = ts.transpileModule(code, {
        fileName: file,
        compilerOptions: {
          target: ts.ScriptTarget.ES2024,
          module: ts.ModuleKind.ESNext,
          jsx: file.endsWith('x') ? ts.JsxEmit.ReactJSX : undefined,
          sourceMap: true,
        },
      })
      return {
        code: result.outputText.replace(/\n?\/\/# sourceMappingURL=.*$/u, '\n'),
        map: result.sourceMapText,
      }
    },
  }
}

export default defineConfig({
  plugins: [standardDecoratorPlugin()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
