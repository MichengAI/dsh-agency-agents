import { BUILTIN_TEAMS, type ExpertTeam } from './team-contract.js'

/** 内置内容的英文版本与稳定标识分离；不得用于翻译用户自定义内容。 */
type Content = Pick<ExpertTeam, 'name' | 'description' | 'goal' | 'tags' | 'examples' | 'deliveryRequirements'> & {
  assignments: readonly (readonly [string, string])[]
}
export const TEAM_CONTENT_EN: Record<string, Content> = {
  'team-product': {
    name: 'Product Review Team',
    description: 'Review requirements, compare options and plan iterations. Balance user value, usability and implementation cost to define scope, priorities and next steps.',
    goal: 'Evaluate the value, usability and feasibility of a product proposal.',
    tags: ['Requirements', 'Comparison', 'Planning'],
    deliveryRequirements: 'Prioritized decisions and an action checklist',
    examples: ['Review these requirements and separate essential first-release features from work that can wait.', 'Compare these product options and explain the trade-offs in value, usability and cost.', 'Plan the next iteration using existing features and user feedback.'],
    assignments: [
      ['Requirement value and priority', 'Check target users, core problems and scope. For each requirement, identify essential, recommended and deferred work with value evidence and success metrics. Separate feedback from assumptions. Hand off missing usability evidence and unknown costs for the coordinator to reconcile; do not make decisions on behalf of other experts.'],
      ['User needs and usability barriers', 'Trace the steps users take to complete their task. Identify affected users, available feedback and unverified assumptions. Propose inexpensive validation and acceptance signals for each barrier. Hand off findings that may change priorities; do not substitute for product scheduling or technical estimates.'],
      ['Implementation cost and constraints', 'For each requirement, assess scope, existing capabilities, dependencies and technical constraints. Propose a minimal delivery path and alternatives. State evidence and unknowns behind cost judgments without inventing schedules. Hand off constraints that could change scope or user flows.'],
    ],
  },
  'team-technical': {
    name: 'Technical Review Team',
    description: 'Review architecture, security and delivery readiness. Identify risks, minimal fixes and executable acceptance criteria.',
    goal: 'Review architecture, security risks and acceptance boundaries.',
    tags: ['Architecture', 'Security', 'Acceptance'],
    deliveryRequirements: 'Risk register and acceptance checklist',
    examples: ['Review this technical proposal and identify delivery blockers with minimal fixes.', 'Check interface and authorization design and list missing validation.', 'Create a clear, executable acceptance checklist for this change.'],
    assignments: [
      ['Architecture and extensibility', 'Trace components, interfaces and data flows to review responsibilities, dependencies, compatibility and maintainability. Give a location, trigger, impact and minimal fix for each finding. Flag changes for the coordinator to reconcile with security findings and regression cases. Never claim unexecuted tests passed.'],
      ['Authorization and security', 'Trace input entry points, authorization checks and sensitive data flows. Identify locations, attack prerequisites, impact and minimal remediation. Distinguish verified vulnerabilities, design risks and missing materials. Hand off release-blocking conditions and required validation scenarios.'],
      ['Acceptance boundaries and quality', 'Independently specify normal, exceptional, boundary, compatibility and rollback scenarios with prerequisites, actions and expected results. Distinguish executed results from proposed tests. Hand off coverage to reconcile with architecture and security findings; do not assume access to other members’ reports.'],
    ],
  },
  'team-content': {
    name: 'Content Planning Team',
    description: 'Plan topics around audience needs, platform behavior and available evidence. Get headlines, outlines and a list of missing source material.',
    goal: 'Find topics worth writing about and appropriate ways to reach the audience.',
    tags: ['Topics', 'Distribution', 'Fact checks'],
    deliveryRequirements: 'Recommended topics and content outlines',
    examples: ['Suggest three worthwhile topics based on the account positioning and available material.', 'Rank these content directions by audience value and available evidence.', 'Turn this topic into an outline for the target platform and identify missing material.'],
    assignments: [
      ['Topic angles and expression', 'Use the shared topic and candidate directions to propose distinct angles, headlines, outlines and openings based on audience value. Link each core claim to material or mark it as missing. Hand off facts requiring verification and platform-specific expression for review. Do not invent examples.'],
      ['Audience and distribution', 'Assess target audiences, platform contexts and reasons to click or share. Recommend presentation and observable metrics, stating evidence and platform limits. Do not promise traffic. Hand off exaggerated headlines and unsupported material for the coordinator to review.'],
      ['Sources and evidence gaps', 'Build a claim-to-source table for supplied topics, material and claims. Check source, date, context and scope. Separate supported, unverified and unusable claims and identify evidence to gather. Do not claim to have checked new headlines or outlines you have not received.'],
    ],
  },
  'team-data': {
    name: 'Data Analysis Team',
    description: 'Review metrics and investigate anomalies. Check data quality and definitions, explain business changes, recommend charts and flag open questions.',
    goal: 'Verify metric definitions, identify problems and explain results.',
    tags: ['Data quality', 'Analysis', 'Charts'],
    deliveryRequirements: 'Analysis findings and visualization recommendations',
    examples: ['Analyze this data: verify definitions first, then explain the main anomalies.', 'Compare these reporting periods and distinguish real change from definition differences.', 'Suggest charts for these fields and explain which conclusions they can support.'],
    assignments: [
      ['Data quality and metric definitions', 'Check fields, time windows, units, samples, missing values, duplicate records and denominators. Provide definitions and quality findings for reconciliation. Explain affected metrics and invalid comparisons. List missing fields rather than inventing cleaning or query results.'],
      ['Business metrics and anomalies', 'Analyze metrics and anomalies in relation to the business question. Attach source, time, unit, denominator and calculation to every key number. State quality assumptions and alternative explanations. Do not confuse correlation with causation. Hand off definitions requiring verification and keep conclusions conditional until checked.'],
      ['Charts and communication', 'Recommend charts using available fields and the business question. Specify axes, units, aggregation, baselines and annotations. Explain misleading scales or samples. Without verified numbers, provide a chart plan rather than invented values. Hand off dependencies on metric definitions.'],
    ],
  },
  'team-research': {
    name: 'Research Team',
    description: 'Research topics, assess trends and compare options. Connect credible evidence and trade-offs to recommendations with explicit uncertainty and conditions.',
    goal: 'Organize evidence, trends and trade-offs between alternatives.',
    tags: ['Evidence', 'Trends', 'Comparison'],
    deliveryRequirements: 'Research conclusions with supporting sources',
    examples: ['Organize credible evidence for this question and distinguish confirmed findings from disputed claims.', 'Compare these solutions and explain their applicable conditions and trade-offs.', 'Analyze trends and drivers in this field, including evidence that could overturn the conclusions.'],
    assignments: [
      ['Evidence credibility and sources', 'Build a claim-source-date-scope table, preferring primary sources. Distinguish independent evidence from repeated reporting. Identify conflicts, outdated information and unsupported judgments. Hand off evidence boundaries for trend analysis and option comparisons. State available material when search is unavailable.'],
      ['Changes and drivers', 'Analyze changes, drivers and alternative explanations within the requested period and region. Distinguish facts, trend inferences and scenarios. Link each judgment to evidence and possible disconfirmation or failure conditions. Hand off timing and definition questions; repeated reports from one source do not increase confidence.'],
      ['Alternatives and trade-offs', 'Compare alternatives against consistent criteria grounded in the decision goal. Explain conditions, benefits, costs, risks and reversibility. Recommend an option and evidence that could overturn it without invented precise scores. Hand off key assumptions for reconciliation with source and trend findings.'],
    ],
  },
}

export function localizeTeam(team: ExpertTeam, locale: 'zh' | 'en'): ExpertTeam {
  if (locale === 'zh' && team.builtin && team.name === TEAM_CONTENT_EN[team.id]?.name) {
    const original = BUILTIN_TEAMS.find(item => item.id === team.id)
    if (original) return { ...team, name: original.name, description: original.description, goal: original.goal, constraints: original.constraints,
      tags: original.tags, examples: original.examples, deliveryRequirements: original.deliveryRequirements,
      members: team.members.map(member => {
        const translated = original.members.find(item => item.expertSlug === member.expertSlug)
        return translated ? { ...member, duty: translated.duty, instructions: translated.instructions } : member
      }) }
  }
  const content = locale === 'en' && team.builtin ? TEAM_CONTENT_EN[team.id] : undefined
  if (!content) return team
  const { assignments, ...fields } = content
  const original = BUILTIN_TEAMS.find(item => item.id === team.id)
  return { ...team, ...fields, constraints: 'Analyze and review only. State insufficient evidence explicitly; do not modify or publish without authorization.',
    members: team.members.map(member => {
      const index = original?.members.findIndex(item => item.expertSlug === member.expertSlug) ?? -1
      return { ...member, duty: assignments[index]?.[0] ?? member.duty, instructions: assignments[index]?.[1] ?? member.instructions }
    }) }
}
