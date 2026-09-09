import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'
import { z } from 'zod'
import { catalogSnapshotSchema, customExpertInputSchema, expertEditSchema } from './expert-contract.js'

const enabledArraySchema = z.array(z.string())
const enabledStateSchema = z.object({
  enabled: enabledArraySchema,
  revision: z.number().int().min(0),
})
const expertPromptSchema = z.object({
  prompt: z.string(),
})

/** 新接口仍沿用宿主 Typert 严格参数校验与既有鉴权入口。 */
function catalogMethod(method: string, parameters: InvocationDescriptor['parameters']): InvocationDescriptor {
  return {
    id: `@michengai/dsh-agency-agents#agencyAgents/${method}`,
    service: 'agencyAgents', namespace: 'agencyAgents', method,
    invocation: { kind: 'direct' }, parameters,
    result: { mode: 'strict', typeSymbol: 'AgencyAgentsCatalog', schema: catalogSnapshotSchema },
  }
}
const revisionParameter = { name: 'expectedRevision', wire: 'expectedRevision', source: 'json', codec: { mode: 'strict', typeSymbol: 'number', schema: z.number().int().min(0) } } as const
const customSlugParameter = { name: 'slug', wire: 'slug', source: 'json', codec: { mode: 'strict', typeSymbol: 'string', schema: z.string().regex(/^custom-[0-9a-f-]{36}$/u) } } as const

/** Host 与 Client 共用的专家启用状态 Remote 严格契约。 */
export const AGENCY_AGENTS_DESCRIPTORS = [
  catalogMethod('getCatalog', []),
  catalogMethod('saveCustomExpert', [
    { name: 'expert', wire: 'expert', source: 'json', codec: { mode: 'strict', typeSymbol: 'CustomExpertInput', schema: customExpertInputSchema } },
    { name: 'enabled', wire: 'enabled', source: 'json', codec: { mode: 'strict', typeSymbol: 'boolean', schema: z.boolean() } },
    revisionParameter,
  ]),
  catalogMethod('deleteCustomExpert', [customSlugParameter, revisionParameter]),
  catalogMethod('restoreCustomExpert', [customSlugParameter, revisionParameter]),
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/getCustomExpert',
    service: 'agencyAgents', namespace: 'agencyAgents', method: 'getCustomExpert',
    invocation: { kind: 'direct' }, parameters: [customSlugParameter],
    result: { mode: 'strict', typeSymbol: 'CustomExpertInput', schema: expertEditSchema },
  },
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/getEnabled',
    service: 'agencyAgents',
    namespace: 'agencyAgents',
    method: 'getEnabled',
    invocation: { kind: 'direct' },
    parameters: [],
    result: { mode: 'strict', typeSymbol: 'AgencyAgentsEnabledState', schema: enabledStateSchema },
  },
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/setEnabled',
    service: 'agencyAgents',
    namespace: 'agencyAgents',
    method: 'setEnabled',
    invocation: { kind: 'direct' },
    parameters: [
      { name: 'enabled', wire: 'enabled', source: 'json', codec: { mode: 'strict', typeSymbol: 'string[]', schema: enabledArraySchema } },
      { name: 'expectedRevision', wire: 'expectedRevision', source: 'json', codec: { mode: 'strict', typeSymbol: 'number', schema: z.number().int().min(0) } },
    ],
    result: { mode: 'strict', typeSymbol: 'AgencyAgentsEnabledState', schema: enabledStateSchema },
  },
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/getPrompt',
    service: 'agencyAgents',
    namespace: 'agencyAgents',
    method: 'getPrompt',
    invocation: { kind: 'direct' },
    parameters: [
      { name: 'slug', wire: 'slug', source: 'json', codec: { mode: 'strict', typeSymbol: 'string', schema: z.string().min(1).max(128) } },
      { name: 'division', wire: 'division', source: 'json', codec: { mode: 'strict', typeSymbol: 'string', schema: z.string().min(1).max(64) } },
    ],
    result: { mode: 'strict', typeSymbol: 'AgencyAgentsPrompt', schema: expertPromptSchema },
  },
] as const satisfies readonly InvocationDescriptor[]
