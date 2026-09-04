/**
 * 手写的 Typert Remote 贡献（等价 generator 的 typert.remote-client 产物）。
 * 本插件只有 getEnabled/setEnabled 两个简单方法，手写可避免依赖 monorepo
 * 专用 generator；严格 descriptor 与 host 共用同一来源，避免两侧契约漂移。
 */
import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import { AGENCY_AGENTS_DESCRIPTORS } from '../remote-contract.js'

export interface AgencyAgentsEnabledState {
  readonly enabled: string[]
  readonly revision: number
}

export interface AgencyAgentsPrompt {
  readonly prompt: string
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$agencyAgents {
    getEnabled: () => Promise<RemoteResult<AgencyAgentsEnabledState>>
    setEnabled: (enabled: string[], expectedRevision: number) => Promise<RemoteResult<AgencyAgentsEnabledState>>
    getPrompt: (slug: string, division: string) => Promise<RemoteResult<AgencyAgentsPrompt>>
  }
  interface TypertRemoteMap {
    'agencyAgents/getEnabled': () => Promise<RemoteResult<AgencyAgentsEnabledState>>
    'agencyAgents/setEnabled': (enabled: string[], expectedRevision: number) => Promise<RemoteResult<AgencyAgentsEnabledState>>
    'agencyAgents/getPrompt': (slug: string, division: string) => Promise<RemoteResult<AgencyAgentsPrompt>>
  }
  interface TypertRemoteNamespaceMap {
    'agencyAgents': TypertRemoteNamespace$agencyAgents
  }
}

export const TYPERT_REMOTE: TypertRemoteContribution = {
  package: '@michengai/dsh-agency-agents',
  descriptors: AGENCY_AGENTS_DESCRIPTORS,
}
export default TYPERT_REMOTE
