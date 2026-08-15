/**
 * 手写的 Typert Remote 贡献（等价 generator 的 typert.remote-client 产物）。
 * 本插件只有 getEnabled/setEnabled 两个简单方法，手写可避免依赖 monorepo
 * 专用 generator；host 端由 gateway 的 SRC 自动发现（@Remote markers），这里
 * 只提供 client 端 $mount 所需的 strict descriptor 与 ctx.remote.agencyAgents
 * 的类型声明。
 */
import { z } from 'zod'
import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$agencyAgents {
    getEnabled: () => Promise<RemoteResult<string[]>>
    setEnabled: (enabled: string[]) => Promise<RemoteResult<undefined>>
  }
  interface TypertRemoteMap {
    'agencyAgents/getEnabled': () => Promise<RemoteResult<string[]>>
    'agencyAgents/setEnabled': (enabled: string[]) => Promise<RemoteResult<undefined>>
  }
  interface TypertRemoteNamespaceMap {
    'agencyAgents': TypertRemoteNamespace$agencyAgents
  }
}

const enabledArraySchema = z.array(z.string())

export const TYPERT_REMOTE: TypertRemoteContribution = {
  package: '@michengai/dsh-agency-agents',
  descriptors: [
    {
      id: '@michengai/dsh-agency-agents#agencyAgents/getEnabled',
      service: 'agencyAgents',
      namespace: 'agencyAgents',
      method: 'getEnabled',
      invocation: { kind: 'direct' },
      parameters: [],
      result: { mode: 'strict', typeSymbol: 'string[]', schema: enabledArraySchema },
    },
    {
      id: '@michengai/dsh-agency-agents#agencyAgents/setEnabled',
      service: 'agencyAgents',
      namespace: 'agencyAgents',
      method: 'setEnabled',
      invocation: { kind: 'direct' },
      parameters: [
        { name: 'enabled', wire: 'enabled', source: 'json', codec: { mode: 'strict', typeSymbol: 'string[]', schema: enabledArraySchema } },
      ],
      result: { mode: 'strict', typeSymbol: 'undefined', schema: z.undefined() },
    },
  ],
}
export default TYPERT_REMOTE
