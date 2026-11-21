import type { AgencyLocale } from './agency-locale.js'

export type DraftKind = 'expert' | 'team'

const COPY = {
  zh: {
    positive: "✅ 立即打开编辑窗口反显写入",
    negative: "✏️ 留在当前对话继续修改调整",
    expertHeader: "专家草案确认",
    teamHeader: "专家团队配置确认",
    question: "您已审阅{draft}的草案。是否现在打开编辑窗口进行最终核对并保存？",
    expertSubject: "专家「{name}」",
    teamSubject: "专家团队「{name}」（共 {count} 位专家）",
    positiveHint: "回填全部字段，供您核对并保存。",
    negativeHint: "不打开窗口，继续在对话中修改草案。",
    missing: "没有待确认的草案。请先生成或更新草案。",
    declined: "没有打开编辑窗口。您可以继续在对话中调整草案。",
    unavailable: "确认卡片不可用。您仍可以使用预览链接核对草案。",
    confirmed: "已确认「{name}」。请在编辑窗口核对后点击「保存并启用」。",
    expertPreview: "专家草案预览",
    teamPreview: "专家团队草案预览",
    division: "所属分类",
    summary: "一句话简介",
    prompt: "查看完整系统提示词（点击展开）",
    description: "定位简介",
    goal: "团队目标",
    delivery: "交付要求",
    constraints: "通用约束",
    members: "团队成员阵容",
    reason: "入选理由",
    assignment: "分工",
    previewLink: "点击直接在弹窗中核对并保存草案",
    previewHelp: "请先核对草案。如需修改，请在对话中说明；满意后请说「**确认**」以显示确认卡片。",
    invalid: "草案校验失败",
    example: "任务示例",
    reference: "草案参考",
  },
  en: {
    positive: "✅ Open editor now",
    negative: "✏️ Keep editing in chat",
    expertHeader: "Expert draft confirmation",
    teamHeader: "Team draft confirmation",
    question: "You reviewed the draft for {draft}. Open the prefilled editor now to review and save it?",
    expertSubject: "expert “{name}”",
    teamSubject: "team “{name}” ({count} experts)",
    positiveHint: "Prefill all fields for review and saving.",
    negativeHint: "Keep refining the draft in chat without opening the editor.",
    missing: "There is no draft to confirm. Create or revise a draft first.",
    declined: "The editor did not open. You can keep refining the draft in chat.",
    unavailable: "The confirmation card is unavailable. You can still review the draft using its preview link.",
    confirmed: "Confirmed “{name}”. Review the prefilled editor, then choose “Save and enable”.",
    expertPreview: "Expert draft preview",
    teamPreview: "Team draft preview",
    division: "Division",
    summary: "Summary",
    prompt: "View full system prompt",
    description: "Description",
    goal: "Team goal",
    delivery: "Deliverables",
    constraints: "Constraints",
    members: "Team members",
    reason: "Why selected",
    assignment: "Assignment",
    previewLink: "Review and save draft in the editor",
    previewHelp: "Review the draft first. Request changes in chat or say **confirm** to show the confirmation card.",
    invalid: "Invalid draft",
    example: "Example task",
    reference: "Draft reference",
  },
  pt: {
    positive: "✅ Abrir editor agora",
    negative: "✏️ Continuar editando na conversa",
    expertHeader: "Confirmação do rascunho do especialista",
    teamHeader: "Confirmação do rascunho da equipe",
    question: "Você revisou o rascunho de {draft}. Quer abrir o editor preenchido para revisar e salvar?",
    expertSubject: "especialista “{name}”",
    teamSubject: "equipe “{name}” ({count} especialistas)",
    positiveHint: "Preenche todos os campos para revisão e salvamento.",
    negativeHint: "Não abre o editor; continue ajustando o rascunho na conversa.",
    missing: "Não há rascunho para confirmar. Crie ou revise um rascunho primeiro.",
    declined: "O editor não foi aberto. Você pode continuar ajustando o rascunho na conversa.",
    unavailable: "O cartão de confirmação não está disponível. Você ainda pode revisar o rascunho pelo link da prévia.",
    confirmed: "“{name}” confirmado. Revise no editor e escolha “Guardar e ativar”.",
    expertPreview: "Prévia do rascunho do especialista",
    teamPreview: "Prévia do rascunho da equipe",
    division: "Área",
    summary: "Resumo",
    prompt: "Ver o prompt de sistema completo",
    description: "Descrição",
    goal: "Objetivo da equipe",
    delivery: "Entregas",
    constraints: "Restrições",
    members: "Membros da equipe",
    reason: "Motivo da escolha",
    assignment: "Atribuição",
    previewLink: "Revisar e salvar rascunho no editor",
    previewHelp: "Revise o rascunho. Peça mudanças na conversa ou diga **confirmo** para exibir o cartão de confirmação.",
    invalid: "Rascunho inválido",
    example: "Exemplo de tarefa",
    reference: "Referência do rascunho",
  },
  es: {
    positive: "✅ Abrir el editor ahora",
    negative: "✏️ Seguir editando en la conversación",
    expertHeader: "Confirmación del borrador del experto",
    teamHeader: "Confirmación del borrador del equipo",
    question: "Has revisado el borrador de {draft}. ¿Quieres abrir el editor con los datos del borrador para revisar y guardar?",
    expertSubject: "experto «{name}»",
    teamSubject: "equipo «{name}» ({count} expertos)",
    positiveHint: "Rellena todos los campos para revisar y guardar.",
    negativeHint: "No abre el editor; sigue ajustando el borrador en la conversación.",
    missing: "No hay ningún borrador para confirmar. Crea o revisa un borrador primero.",
    declined: "El editor no se abrió. Puedes seguir ajustando el borrador en la conversación.",
    unavailable: "La tarjeta de confirmación no está disponible. Aún puedes revisar el borrador mediante el enlace de vista previa.",
    confirmed: "«{name}» confirmado. Revisa en el editor y elige «Guardar y habilitar».",
    expertPreview: "Vista previa del borrador del experto",
    teamPreview: "Vista previa del borrador del equipo",
    division: "Área",
    summary: "Resumen",
    prompt: "Ver la instrucción de sistema completa",
    description: "Descripción",
    goal: "Objetivo del equipo",
    delivery: "Entregables",
    constraints: "Restricciones",
    members: "Miembros del equipo",
    reason: "Motivo de la selección",
    assignment: "Responsabilidad",
    previewLink: "Revisar y guardar el borrador en el editor",
    previewHelp: "Revisa el borrador. Pide cambios en la conversación o di **confirmo** para mostrar la tarjeta de confirmación.",
    invalid: "Borrador inválido",
    example: "Ejemplo de tarea",
    reference: "Referencia del borrador",
  },
} satisfies Record<AgencyLocale, Record<string, string>>

export function draftCopy(locale: AgencyLocale) { return COPY[locale] }

export function isPositiveDraftLabel(label: string | null | undefined): boolean {
  return Object.values(COPY).some(copy => copy.positive === label)
}

export function formatDraft(template: string, data: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => Object.hasOwn(data, key) ? String(data[key]) : token)
}

// Non-HTTP absolute action: the host Markdown renderer keeps it as a native anchor,
// without its external-link delegate. The Agency client consumes it locally.
const DRAFT_ACTION = 'dsh-agency:apply-draft?id='
export function draftActionLink(id: string): string { return DRAFT_ACTION + id }
export function parseDraftAction(href: string): string | undefined {
  if (!href.startsWith(DRAFT_ACTION)) return
  const id = href.slice(DRAFT_ACTION.length)
  if (/^prop-[A-Za-z0-9_-]{22}$/u.test(id)) return id
}

// The host renders question detail as Markdown but does not expose the caller’s question id in the DOM.
export function draftMarker(kind: DraftKind, id: string): string { return `Agency:${kind}:${id}` }

export function parseDraftMarker(text: string): { kind: DraftKind; id: string } | undefined {
  const match = /^Agency:(expert|team):(prop-[A-Za-z0-9_-]{22})$/u.exec(text)
  if (match) return { kind: match[1] as DraftKind, id: match[2] }
}
