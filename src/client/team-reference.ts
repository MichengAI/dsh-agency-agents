import { teamText, type TeamLocale } from '../team-i18n.js';
import { confirmTeamAction } from './team-confirmation.js';
import type { ReferenceInsert, TokenSpan, } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { ExpertTeam } from '../team-contract.js';
import { expertDetectText, insertExpertReference, type ReferenceInsertionTarget, } from './index.js';
export const TEAM_REFERENCE_SOURCE = 'agency-agents:teams';
export const teamReference = (team: ExpertTeam, locale: TeamLocale = 'zh'): ReferenceInsert => ({
    source: TEAM_REFERENCE_SOURCE,
    ref: team.id,
    label: team.name,
    clipboardText: teamText(locale, "@专家团：{0}\u00A0", [team.name]),
    ...{ appearance: 'session' },
});
/** 团队只保留一个原生标签；替换需要明确操作，正文和附件不清空。 */
export async function insertTeamReference(target: ReferenceInsertionTarget | undefined, team: ExpertTeam, example?: string, triggerSpan?: TokenSpan, locale: TeamLocale = 'zh', confirm = confirmTeamAction): Promise<boolean> {
    const tx = (key: string, values?: readonly unknown[]) => teamText(locale, key, values);
    if (!target)
        return false;
    const state = target.state.getSnapshot();
    const existing = (state.occurrences ?? []).filter((o) => o.source === TEAM_REFERENCE_SOURCE);
    let span = triggerSpan;
    if (existing.length) {
        if (triggerSpan) {
            target.notify?.('error', tx("草稿已有专家团，请先移除原团队再通过 @ 选择。"));
            return false;
        }
        if (!await confirm(tx("草稿已有专家团，是否替换为当前团队？正文和附件将保留。"), locale))
            return false;
        const old = existing[0];
        const reduction = (state.occurrences ?? [])
            .filter((o) => o.offset < old.offset)
            .reduce((n, o) => n + (o.length ?? 1) - 1, 0);
        span = {
            start: old.offset - reduction,
            end: old.offset - reduction + 1,
            draftRev: state.draftRev,
        };
    }
    const detect = expertDetectText(state);
    // 触发词会被标签替换，不属于用户任务正文。
    const body = (triggerSpan
        ? detect.slice(0, triggerSpan.start) + detect.slice(triggerSpan.end)
        : detect)
        .replace(/\uFFFC/gu, '')
        .trim();
    const append = example !== undefined &&
        body !== '' &&
        await confirm(tx("草稿已有正文，是否保留正文并追加所选示例？取消则仅选择团队。"), locale);
    // 确认窗口打开期间可能收到新的草稿，不能使用旧坐标覆盖用户输入。
    if (target.state.getSnapshot().draftRev !== state.draftRev) {
        target.notify?.('error', tx('草稿已变化，请重新选择专家团。'));
        return false;
    }
    const selected = insertExpertReference(target, teamReference(team, locale), body === '' ? (example ?? team.examples[0]) : undefined, span, tx("专家团已选择，但示例填入失败，请补充任务。"));
    if (selected && append) {
        setTimeout(() => {
            try {
                const current = target.state.getSnapshot();
                const text = expertDetectText(current);
                if (!target.insertText?.(`\n\n${example}`, {
                    start: text.length,
                    end: text.length,
                    draftRev: current.draftRev,
                }))
                    target.notify?.('error', tx("示例追加失败，草稿已保留。"));
            }
            catch {
                target.notify?.('error', tx("示例追加失败，草稿已保留。"));
            }
        }, 0);
    }
    return selected;
}
