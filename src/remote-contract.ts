import { teamInputSchema, teamSnapshotSchema } from './team-contract.js'
import type { InvocationDescriptor, InvocationParameterDescriptor, TypertCodec } from '@deepseek-ai/dsh-typert-protocol'
import { z } from 'zod'
import { CUSTOM_EXPERT_SLUG, catalogSnapshotSchema, customExpertInputSchema, expertEditSchema } from './expert-contract.js'

const enabledArraySchema = z.array(z.string())
const enabledStateSchema = z.object({
  enabled: enabledArraySchema,
  revision: z.number().int().min(0),
})
const expertPromptSchema = z.object({
  prompt: z.string(),
})

type BoundarySchema = { parse(value: unknown): unknown }

/**
 * alpha.1 及更早宿主读 `codec.schema.parse`；alpha.2 只接受 `codec.create()`。
 * 两套字段一起带上，才能在同一 peer 范围内挂载 Remote。
 */
function strictCodec(typeSymbol: string, schema: BoundarySchema): TypertCodec {
  return { mode: 'strict', typeSymbol, create: () => schema, schema } as TypertCodec
}

function jsonParameter(name: string, typeSymbol: string, schema: BoundarySchema): InvocationParameterDescriptor {
  return { name, wire: name, source: 'json', codec: strictCodec(typeSymbol, schema) }
}

/** 新接口仍沿用宿主 Typert 严格参数校验与既有鉴权入口。 */
function catalogMethod(method: string, parameters: InvocationDescriptor['parameters']): InvocationDescriptor {
  return {
    id: `@michengai/dsh-agency-agents#agencyAgents/${method}`,
    service: 'agencyAgents', namespace: 'agencyAgents', method,
    invocation: { kind: 'direct' }, parameters,
    result: strictCodec('AgencyAgentsCatalog', catalogSnapshotSchema),
  }
}
const revisionParameter = jsonParameter('expectedRevision', 'number', z.number().int().min(0))
const customSlugParameter = jsonParameter('slug', 'string', z.string().regex(CUSTOM_EXPERT_SLUG))

/** Host 与 Client 共用的专家启用状态 Remote 严格契约。 */
export const AGENCY_AGENTS_DESCRIPTORS = [
  ...[
    { method: 'getTeams', parameters: [] },
    { method: 'saveTeam', parameters: [jsonParameter('team', 'ExpertTeamInput', teamInputSchema), jsonParameter('enabled', 'boolean', z.boolean()), revisionParameter] },
    { method: 'setTeamEnabled', parameters: [jsonParameter('id', 'string', z.string().min(1).max(128)), jsonParameter('enabled', 'boolean', z.boolean()), revisionParameter] },
    { method: 'deleteTeam', parameters: [jsonParameter('id', 'string', z.string().min(1).max(128)), revisionParameter] },
  ].map(({ method, parameters }): InvocationDescriptor => ({
    id: `@michengai/dsh-agency-agents#agencyAgents/${method}`, service: 'agencyAgents', namespace: 'agencyAgents', method,
    invocation: { kind: 'direct' }, parameters, result: strictCodec('AgencyTeamsSnapshot', teamSnapshotSchema),
  })),
  catalogMethod('getCatalog', []),
  catalogMethod('saveCustomExpert', [
    jsonParameter('expert', 'CustomExpertInput', customExpertInputSchema),
    jsonParameter('enabled', 'boolean', z.boolean()),
    revisionParameter,
  ]),
  catalogMethod('deleteCustomExpert', [customSlugParameter, revisionParameter]),
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/getCustomExpert',
    service: 'agencyAgents', namespace: 'agencyAgents', method: 'getCustomExpert',
    invocation: { kind: 'direct' }, parameters: [customSlugParameter],
    result: strictCodec('CustomExpertInput', expertEditSchema),
  },
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/getEnabled',
    service: 'agencyAgents',
    namespace: 'agencyAgents',
    method: 'getEnabled',
    invocation: { kind: 'direct' },
    parameters: [],
    result: strictCodec('AgencyAgentsEnabledState', enabledStateSchema),
  },
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/setEnabled',
    service: 'agencyAgents',
    namespace: 'agencyAgents',
    method: 'setEnabled',
    invocation: { kind: 'direct' },
    parameters: [
      jsonParameter('enabled', 'string[]', enabledArraySchema),
      jsonParameter('expectedRevision', 'number', z.number().int().min(0)),
    ],
    result: strictCodec('AgencyAgentsEnabledState', enabledStateSchema),
  },
  {
    id: '@michengai/dsh-agency-agents#agencyAgents/getPrompt',
    service: 'agencyAgents',
    namespace: 'agencyAgents',
    method: 'getPrompt',
    invocation: { kind: 'direct' },
    parameters: [
      jsonParameter('slug', 'string', z.string().min(1).max(128)),
      jsonParameter('division', 'string', z.string().min(1).max(64)),
    ],
    result: strictCodec('AgencyAgentsPrompt', expertPromptSchema),
  },
] as const satisfies readonly InvocationDescriptor[]
