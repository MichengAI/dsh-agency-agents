/** 英文协作规范与中文规范保持相同职责和验收边界。 */
export const TEAM_METHODS_EN = {
  general: {
    preparation: ['Problem and final decision', 'Available material and accessible locations', 'Scope, constraints, output format and unknowns'],
    reviewChecklist: ['Conclusions answer the user goal with traceable evidence', 'Facts, assumptions, recommendations and uncovered scope are distinguished', 'Actions specify priority, prerequisites and acceptance criteria'],
    synthesis: 'Deliver the overall conclusion, evidence and limitations, material disagreements, prioritized actions and open questions.',
  },
  product: {
    preparation: ['Target users, core scenarios and problems', 'Existing proposals, user feedback and requirement evidence', 'First-release scope, resource constraints and success metrics'],
    reviewChecklist: ['Essential, recommended and deferred work is justified by value and constraints', 'Usability issues map to specific user steps, with feedback separated from assumptions', 'The recommendation defines an acceptable minimal delivery and flags unknown costs'],
    synthesis: 'Align value, usability and feasibility by requirement. Deliver a scope table with requirements, priorities, evidence, costs and acceptance metrics, explaining inclusion and deferral. Validate high-value work with unknown costs before planning; do not invent schedules.',
  },
  technical: {
    preparation: ['Change goals, architecture, interfaces and data flows', 'Deployment environment, authorization boundaries and dependencies', 'Compatibility, performance goals and executable test conditions'],
    reviewChecklist: ['Every risk has a location, trigger, impact and verification method', 'Reproduced issues, potential risks and unverified items are distinguished', 'Every blocker has a minimal fix and a matching regression case'],
    synthesis: 'Connect architecture, security and acceptance by component or interface. Deliver risks with severity, location, triggers, impact, remediation and verification, plus release conditions. Unexecuted tests remain plans.',
  },
  content: {
    preparation: ['Audience, platform, account positioning and content goals', 'Topic, known facts, available material and sources', 'Length, format, style, period and excluded content'],
    reviewChecklist: ['Every topic has audience value, a distinct angle and usable evidence', 'Headlines and core claims are supported, with gaps marked', 'Recommendations include platform fit, executable outlines and observable metrics'],
    synthesis: 'Align angle, distribution rationale and evidence by topic. Deliver ranked topics, recommended headlines and outlines, missing material and post-publication metrics. Reach is not fact checking; do not promise traffic.',
  },
  data: {
    preparation: ['Business question, data sources and readable files or tables', 'Fields, units, time windows, samples, deduplication and denominators', 'Baselines, known quality issues and expected deliverables'],
    reviewChecklist: ['Comparisons use consistent periods, units, samples and denominators', 'Key numbers can be verified from sources, calculations or queries', 'Charts use verified fields and values, stating quality limits and correlation boundaries'],
    synthesis: 'Reconcile quality and definitions before adopting findings and chart recommendations. Do not average or merge incompatible metrics. Deliver definitions, key metrics and anomalies, reproducible evidence, chart plans and actions. With insufficient data, provide an analysis plan only.',
  },
  research: {
    preparation: ['Research question, decision use and alternatives', 'Region, period, comparison criteria and available sources', 'Existing judgments, key assumptions and desired counterevidence'],
    reviewChecklist: ['Sources are traceable, dates and definitions fit, repeated reporting is deduplicated', 'Trend inferences have drivers, counterevidence and applicable conditions', 'Options use consistent criteria, with costs and conditions that could overturn the recommendation'],
    synthesis: 'Map sources to claims before reconciling trends and options. Deliver core conclusions, an evidence table, comparisons, counterevidence and open questions. Repeated reporting is not independent validation; avoid false precision.',
  },
} as const
export const MEMBER_HANDOFF_EN = [
  'Conclusion: answer your assigned question only; make a clear recommendation when a decision is needed.',
  'Evidence and location: provide paths, passages, sources or calculations. State when searches or tests were not executed.',
  'Risks and conditions: explain impact, triggers, assumptions and evidence that could overturn the conclusion.',
  'Actions and acceptance: propose executable actions, priorities and completion criteria.',
  'Handoff: list specific issues to reconcile with other roles, missing material and uncovered scope; explicitly state when there are none.',
] as const
