import { teamText } from './team-i18n.js';
import type { ExpertSummary } from './expert-contract.js';
import { localizeTeam } from './team-content-en.js';
import { localizedExpertName, type LocaleId } from './i18n.js';
import { teamCollaboration } from './team-collaboration.js';
import { effectiveCoordinator, teamSchema, type ExpertTeam, } from './team-contract.js';
export interface TeamMemberRun {
    slug: string;
    name: string;
    prompt: string;
    persona: string;
}
/** 在任何异步执行前冻结配置；排队任务取消后不再启动。 */
export async function executeTeam(args: {
    team: ExpertTeam;
    experts: readonly ExpertSummary[];
    enabled: readonly string[];
    task: string;
    revision: number;
    locale?: LocaleId;
    signal?: AbortSignal;
    readPersona(expert: ExpertSummary): Promise<string>;
    run(member: TeamMemberRun): Promise<string>;
}) {
    const tx = (key: string, values?: readonly unknown[]) => teamText(args.locale ?? 'zh', key, values);

    const team = structuredClone(teamSchema.parse(localizeTeam(args.team, args.locale ?? 'zh')));
    const experts = structuredClone(args.experts).map(expert => ({ ...expert, name: localizedExpertName(expert, args.locale ?? 'zh') }));
    const task = args.task.trim();
    if (!task || Array.from(task).length > 24000)
        throw new Error(tx("团队任务必须为 1～24000 字。"));
    args.signal?.throwIfAborted();
    const selected = team.members.map((member) => {
        const expert = experts.find((e) => e.slug === member.expertSlug && !e.conflict);
        if (!expert || !args.enabled.includes(expert.slug))
            throw new Error(tx("团队成员不存在、冲突或已停用，请修复后重新召唤。"));
        return { member, expert };
    });
    const collaboration = teamCollaboration(team, args.locale);
    const results: {
        expert: string;
        slug: string;
        ok: boolean;
        answer: string;
        error?: string;
    }[] = Array(selected.length);
    const prepared = await Promise.all(selected.map(async ({ member, expert }, current) => {
        try {
            const persona = await args.readPersona(expert);
            args.signal?.throwIfAborted();
            return {
                slug: expert.slug,
                name: expert.name,
                persona,
                prompt: [
                    tx("专家团：{0}\n共同目标：{1}\n共同约束：{2}", [team.name, team.goal, team.constraints]),
                    tx("任务简报：\n{0}", [task]),
                    tx("共同交付要求：{0}", [team.deliveryRequirements]),
                    tx("职责边界：\n{0}", [selected.map((peer) => `${peer.expert.name}（${peer.expert.slug}）：${peer.member.duty}`).join('\n')]),
                    tx("你的分工：{0}\n{1}", [member.duty, member.instructions]),
                    tx("本次为独立并行分析，不得假设已经收到其他成员的结果。需要交叉核验的事项交给主理人，不自行召唤其他专家或启动新一轮。"),
                    tx("回传格式：\n{0}", [collaboration.memberOutput.join('\n')]),
                    tx("验收重点：\n{0}", [collaboration.reviewChecklist.join('\n')]),
                ].join('\n\n'),
            };
        }
        catch (cause) {
            args.signal?.throwIfAborted();
            results[current] = {
                expert: expert.name,
                slug: expert.slug,
                ok: false,
                answer: '',
                error: cause instanceof Error ? cause.message : tx("身份读取失败"),
            };
            return undefined;
        }
    }));
    args.signal?.throwIfAborted();
    let index = 0;
    await Promise.allSettled(Array.from({ length: Math.min(4, prepared.length) }, async () => {
        while (index < prepared.length) {
            args.signal?.throwIfAborted();
            const current = index++;
            const member = prepared[current];
            if (!member)
                continue;
            try {
                const answer = await args.run(member);
                if (!answer.trim())
                    throw new Error(tx("成员未返回有效分析内容"));
                results[current] = {
                    expert: member.name,
                    slug: member.slug,
                    ok: true,
                    answer,
                };
            }
            catch (cause) {
                args.signal?.throwIfAborted();
                results[current] = {
                    expert: member.name,
                    slug: member.slug,
                    ok: false,
                    answer: '',
                    error: cause instanceof Error ? cause.message : tx("成员执行失败"),
                };
            }
        }
    }));
    args.signal?.throwIfAborted();
    const completed = results.filter((result) => result.ok).length;
    const coverage = {
        status: completed === results.length
            ? 'complete'
            : completed
                ? 'partial'
                : 'failed',
        completed,
        total: results.length,
        missing: results.flatMap((result, current) => result.ok
            ? []
            : [
                {
                    slug: result.slug,
                    duty: selected[current].member.duty,
                    error: result.error,
                },
            ]),
    };
    return {
        team,
        revision: args.revision,
        coordinator: effectiveCoordinator(team, args.locale),
        results,
        collaboration,
        coverage,
        instruction: tx("{0}由当前主会话按本次主理人规则、协作验收清单和交付要求综合结果：{1}。逐项核对证据、口径、交接问题及分歧；无法核实的内容标为待验证。标明失败成员及职责覆盖缺口；不自动重试或新增轮次，不编造意见。", [completed ? tx("成员返回成功不代表结论已通过验证。") : tx("没有可用的成员结果，不得据此编造实质性汇总结论。"), team.deliveryRequirements]),
    };
}
