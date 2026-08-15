import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'
import { z } from 'zod'

const enabledArraySchema = z.array(z.string())
const enabledStateSchema = z.object({
  enabled: enabledArraySchema,
  revision: z.number().int().min(0),
})

/** Host 与 Client 共用的专家启用状态 Remote 严格契约。 */
export const AGENCY_AGENTS_DESCRIPTORS = [
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
] as const satisfies readonly InvocationDescriptor[]
