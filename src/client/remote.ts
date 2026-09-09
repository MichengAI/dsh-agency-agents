/**
 * 手写的 Typert Remote 贡献（等价 generator 的 typert.remote-client 产物）。
 * 本插件的名册、管理及启停方法采用手写贡献，避免依赖 monorepo
 * 专用 generator；严格 descriptor 与 host 共用同一来源，避免两侧契约漂移。
 */
import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import { AGENCY_AGENTS_DESCRIPTORS } from '../remote-contract.js'
import type { CatalogSnapshot, CustomExpertInput } from '../expert-contract.js'

export interface AgencyCatalogRemote {
  getCatalog(): Promise<RemoteResult<CatalogSnapshot>>
  getCustomExpert(slug: string): Promise<RemoteResult<CustomExpertInput>>
  saveCustomExpert(expert: CustomExpertInput, enabled: boolean, expectedRevision: number): Promise<RemoteResult<CatalogSnapshot>>
  deleteCustomExpert(slug: string, expectedRevision: number): Promise<RemoteResult<CatalogSnapshot>>
  restoreCustomExpert(slug: string, expectedRevision: number): Promise<RemoteResult<CatalogSnapshot>>
}

export interface AgencyAgentsEnabledState {
  readonly enabled: string[]
  readonly revision: number
}

export interface AgencyAgentsPrompt {
  readonly prompt: string
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$agencyAgents extends AgencyCatalogRemote {
    getEnabled: () => Promise<RemoteResult<AgencyAgentsEnabledState>>
    setEnabled: (enabled: string[], expectedRevision: number) => Promise<RemoteResult<AgencyAgentsEnabledState>>
    getPrompt: (slug: string, division: string) => Promise<RemoteResult<AgencyAgentsPrompt>>
  }
  interface TypertRemoteMap {
    'agencyAgents/getCatalog': AgencyCatalogRemote['getCatalog']
    'agencyAgents/getCustomExpert': AgencyCatalogRemote['getCustomExpert']
    'agencyAgents/saveCustomExpert': AgencyCatalogRemote['saveCustomExpert']
    'agencyAgents/deleteCustomExpert': AgencyCatalogRemote['deleteCustomExpert']
    'agencyAgents/restoreCustomExpert': AgencyCatalogRemote['restoreCustomExpert']
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
