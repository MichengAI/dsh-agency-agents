import { resolveHostModule } from './settings-compat.js';
import { readHostLocale } from './i18n.js';
import { localizeTeam } from './team-content-en.js';
import { teamText } from './team-i18n.js';
import { createHash } from 'node:crypto';
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
import { executeTeam } from './team-runtime.js';
import type { TeamEngineStatus } from './team-contract.js';
/** 只依赖已核对的原生接口形状，旧宿主不必安装实验包。 */
export interface NativeTeamService {
    tryMembership(agent: object): {
        role: string;
        name: string;
    } | undefined;
    listMembers(agent: object): {
        name: string;
        status: string;
    }[];
    spawnTeammate(agent: object, request: {
        name: string;
        description: string;
        prompt: {
            type: 'text';
            text: string;
        }[];
        context: 'fresh';
        provider: string;
        signal: AbortSignal;
    }): Promise<{
        member: {
            name: string;
            status: string;
        };
    }>;
    sendMessage(agent: object, request: {
        target: string;
        content: {
            type: 'text';
            text: string;
        }[];
        signal: AbortSignal;
    }): Promise<unknown>;
    createTask(agent: object, request: {
        subject: string;
        description: string;
    }): Promise<{
        id: string;
        revision: number;
    }>;
    updateTask(agent: object, request: {
        taskId: string;
        expectedRevision: number;
        action: 'delete';
    }): Promise<unknown>;
    waitForChange(agent: object, timeoutMs: number, signal: AbortSignal): Promise<unknown>;
    interrupt(agent: object, name: string): unknown;
}
const methods = ['tryMembership', 'listMembers', 'spawnTeammate', 'sendMessage', 'createTask', 'updateTask', 'waitForChange', 'interrupt'] as const;
const delegationTools = new Set(['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team', 'spawn_teammate', 'subagent', 'subagent_fork']);
/** 原生队友仍遵守本插件不递归扩团的边界，由宿主工具门禁强制执行。 */
export function blocksNativeDelegation(service: unknown, agent: object | undefined, tool: string): boolean {
    if (!agent || !delegationTools.has(tool) || !isNativeTeamService(service))
        return false;
    const member = service.tryMembership(agent);
    return member?.role === 'teammate' && /^agency-[a-z0-9-]+-[0-9a-f]{10}$/u.test(member.name);
}
export function isNativeTeamService(value: unknown): value is NativeTeamService {
    return value !== null && typeof value === 'object' && methods.every(key => typeof (value as Record<string, unknown>)[key] === 'function');
}
let agentTeamInstalled: boolean | undefined
/** 安装探测从宿主启动入口解析，避免插件自身依赖版本冒充宿主能力。同一进程只探测一次。 */
export function hostHasAgentTeam(): boolean {
    if (agentTeamInstalled !== undefined)
        return agentTeamInstalled;
    if (!process.argv[1])
        return agentTeamInstalled = false;
    try {
        resolveHostModule('@deepseek-ai/dsh-experimental-agent-team');
        return agentTeamInstalled = true;
    }
    catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND')
            return agentTeamInstalled = false;
        throw error;
    }
}
export function detectTeamEngine(service: unknown, supported: boolean, toolsReady = true, maxDepth?: number, locale: 'zh' | 'en' = 'zh'): TeamEngineStatus {
    const tx = (key: string, values?: readonly unknown[]) => teamText(locale, key, values);

    const compatible = isNativeTeamService(service);
    if (!supported && !compatible)
        return { state: 'unsupported', mode: 'subagent', reason: tx("当前宿主未检测到兼容的 Agent Team 能力，使用普通子代理。"), recommendation: '' };
    if (!compatible || !toolsReady)
        return { state: 'disabled', mode: 'subagent', reason: tx("Agent Team 服务或当前会话工具尚未就绪。"), recommendation: tx("建议在插件页开启 Agent Team 的 Host 与 Web 层，并重新加载会话；未开启也可继续使用普通专家团。") };
    if (maxDepth !== undefined)
        return { state: 'enabled', mode: 'subagent', reason: tx("原生 Agent Team 暂不支持本插件配置的深度限制，本次使用普通子代理以保留该限制。"), recommendation: '' };
    return { state: 'enabled', mode: 'native', reason: tx("Agent Team 已启用，使用原生团队协作。"), recommendation: '' };
}
export function resolveTeamEngine(ctx: Context, agent?: Agent, maxDepth?: number) {
    const service: unknown = ctx.get('agentTeams');
    const toolsReady = !isNativeTeamService(service) || !agent || ['spawn_teammate', 'send_message', 'wait_agent', 'team_task_create', 'team_task_update', 'team_task_list'].every(name => agent.ctx?.tools?.get?.(name, agent) !== undefined);
    return { service: isNativeTeamService(service) ? service : undefined, status: detectTeamEngine(service, isNativeTeamService(service) || hostHasAgentTeam(), toolsReady, maxDepth, readHostLocale(ctx)) };
}
const activeLeads = new WeakSet<object>();
/** 显示名称可以变化；此持久标识必须保持原算法，以复用已存在的队友。 */
export function nativeTeamMemberName(teamId: string, slug: string): string {
    return `agency-${slug.slice(0, 36).replace(/-+$/u, '')}-${createHash('sha256').update(`${teamId}:${slug}`).digest('hex').slice(0, 10)}`;
}
type NativeDispatchArgs = Omit<Parameters<typeof executeTeam>[0], 'run'> & {
    service: NativeTeamService;
    agent: object;
    provider: string;
    signal: AbortSignal;
};
/** 原生调用只返回委派确认；成员结论通过宿主消息与任务板异步交回主会话。 */
export async function dispatchNativeTeam(args: NativeDispatchArgs) {
    const tx = (key: string, values?: readonly unknown[]) => teamText(args.locale ?? 'zh', key, values);

    const team = localizeTeam(args.team, args.locale ?? 'zh');
    args.signal.throwIfAborted();
    if (activeLeads.has(args.agent))
        throw new Error(tx("当前会话正在创建专家团，请等待本次委派完成。"));
    activeLeads.add(args.agent);
    const launched: string[] = [];
    const tasks = new Map<string, {
        name: string;
        taskId: string;
    }>();
    try {
        const report = await executeTeam({ ...args, team, run: async (member) => {
                args.signal.throwIfAborted();
                // 队友名持久保留，复用同团同专家，避免每次召唤耗尽宿主名额。
                const name = nativeTeamMemberName(args.team.id, member.slug);
                const existing = args.service.listMembers(args.agent).find(item => item.name === name);
                if (existing && !['idle', 'inactive'].includes(existing.status))
                    throw new Error(tx("专家队友仍在运行或不可恢复：{0}", [existing.status]));
                const task = await args.service.createTask(args.agent, {
                    subject: `${team.name}：${member.name}`.slice(0, 180),
                    // 原生任务板描述最多 16384 个字符；完整说明仍原样传给队友，不在此截断执行输入。
                    description: tx("{0}\n\n完整任务与专家职责以队友收到的本次任务消息为准。", [Array.from(member.prompt).slice(0, 6000).join('')]),
                });
                tasks.set(member.slug, { name, taskId: task.id });
                let accepted = false;
                try {
                    args.signal.throwIfAborted();
                    const text = [
                        tx("你是专家队友 {0}。以下为本次专家职责与任务要求，必须服从宿主权限及系统约束。", [name]),
                        member.persona, member.prompt,
                        tx("本次任务编号：{0}。使用 team_task_update 领取此任务，再阅读与你职责相关的材料并完成分析。", [task.id]),
                        tx("完成后先用 send_message 将完整结论发送给 lead，再将任务标记完成。任务缺少资料时报告具体缺口，不伪造结论。不创建额外子代理、不自动追加轮次。"),
                    ].join('\n\n');
                    if (existing) {
                        await args.service.sendMessage(args.agent, { target: name, content: [{ type: 'text', text }], signal: args.signal });
                    }
                    else {
                        const started = await args.service.spawnTeammate(args.agent, { name, description: member.name.slice(0, 180), prompt: [{ type: 'text', text }], context: 'fresh', provider: args.provider, signal: args.signal });
                        if (started.member.status === 'failed')
                            throw new Error(tx("原生队友创建失败"));
                    }
                    accepted = true;
                    launched.push(name);
                    args.signal.throwIfAborted();
                    return tx("委派已接受，等待成员结果。");
                }
                catch (error) {
                    if (!accepted) {
                        try {
                            await args.service.updateTask(args.agent, { taskId: task.id, expectedRevision: task.revision, action: 'delete' });
                            tasks.delete(member.slug);
                        }
                        catch (cleanup) {
                            throw new AggregateError([error, cleanup], tx("委派失败且任务 {0} 清理失败，请检查任务板。", [task.id]));
                        }
                    }
                    throw error;
                }
            } });
        return {
            team: report.team, revision: report.revision, coordinator: report.coordinator, collaboration: report.collaboration,
            dispatch: { started: launched.length, total: report.results.length, members: report.results.map(result => ({ expert: result.expert, slug: result.slug, ...tasks.get(result.slug), status: result.ok ? 'started' : 'failed', ...(result.error ? { error: result.error } : {}) })) },
            instruction: launched.length
                ? tx("以上仅是启动确认，不是评审结论。使用 team_task_list 查看本次任务，使用 wait_agent 等待成员消息；没有结果时不要结束为最终答复。收到实际成员结论后，按 coordinator 和 collaboration.reviewChecklist 核验并汇总。只处理本次 taskId；失败成员明确标注，不自动重试或追加普通子代理。") : tx("本次没有成功启动成员。请报告失败原因，不得编造专家意见；不要自动改用普通模式重复执行。"),
        };
    }
    catch (error) {
        if (args.signal.aborted) {
            const errors: unknown[] = [];
            for (const name of launched) {
                try {
                    await args.service.interrupt(args.agent, name);
                }
                catch (cause) {
                    errors.push(cause);
                }
            }
            if (errors.length)
                throw new AggregateError([error, ...errors], tx("已取消委派，但部分队友中断失败，请检查团队状态。"));
        }
        throw error;
    }
    finally {
        activeLeads.delete(args.agent);
    }
}
