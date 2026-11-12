import { resolveHostModule } from './settings-compat.js';
import { readHostLocale } from './i18n.js';
import { localizeTeam } from './team-content-en.js';
import { teamText } from './team-i18n.js';
import { createHash, randomUUID } from 'node:crypto';
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
import { SessionId } from '@deepseek-ai/dsh-session';
import { recordSubagentConfig, forgetSubagentConfig } from './subagent-registry.js';
import { executeTeam } from './team-runtime.js';
import type { TeamEngineStatus } from './team-contract.js';
/** 只依赖已核对的原生接口形状。未安装实验包时回退普通子代理，不要求每个 0.2.x 宿主都启用 Agent Team。 */
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

export const EXPERT_TOOL_DENY = [
    'summon_expert',
    'summon_experts',
    'list_experts',
    'list_expert_teams',
    'get_expert_team',
    'summon_expert_team',
] as const;

export const AGENCY_TEAMMATE_NAME_PATTERN = /^agency-[a-z0-9-]+-[0-9a-f]{10}$/u;

export function isAgencyTeammateName(name: string): boolean {
    return AGENCY_TEAMMATE_NAME_PATTERN.test(name);
}

export interface NativeTeammateSetup {
    toolFilter?: { deny: string[] };
}
const MAX_NATIVE_SETUPS = 128;
const nativeTeammateSetups = new Map<string, NativeTeammateSetup>();
export function registerNativeTeammateSetup(name: string, setup: NativeTeammateSetup): void {
    if (nativeTeammateSetups.size >= MAX_NATIVE_SETUPS) {
        const oldest = nativeTeammateSetups.keys().next().value;
        if (oldest !== undefined) nativeTeammateSetups.delete(oldest);
    }
    nativeTeammateSetups.set(name, setup);
}
export function getNativeTeammateSetup(name: string): NativeTeammateSetup | undefined {
    return nativeTeammateSetups.get(name);
}

/** 0.2.2-rc.2+ 正式内置 Agent Team 服务接口（共享任务板与会话模式开关）。 */
export interface V2TeamService {
    isEnabled(caller: object): boolean;
    createTask(agent: object, request: {
        subject: string;
        description: string;
    }, signal?: AbortSignal): Promise<{
        id: string;
        revision: number;
    }>;
    getTask(caller: object, id: string): unknown;
    listTasks(caller: object): unknown[];
    updateTask(agent: object, request: {
        taskId: string;
        expectedRevision: number;
        action: 'delete';
    }, signal?: AbortSignal): Promise<unknown>;
}
/** 0.2.2-rc.2+ 承载队友创建、命名、消息与中断的 SubagentRuntime 接口。 */
export interface V2SubagentTeamRuntime {
    startActivation(spec: {
        provider: string;
        label: string;
        name?: string;
        childId?: ReturnType<typeof SessionId>;
        parent: object;
        prompt: {
            type: 'text';
            text: string;
        }[];
        signal: AbortSignal;
        delivery: 'parent' | 'caller';
    }): Promise<{
        childId: string;
        name: string;
    }>;
    rootOf(caller: object): {
        id: string;
    };
    namesOf(agent: object): {
        self: string;
        parent?: string;
    };
    listDescendants(rootSessionId: string, signal?: AbortSignal): Promise<Array<{
        id: string;
        mode?: string;
        path?: string;
    }>>;
    sendMessage(sender: object, targetId: string, content: {
        type: 'text';
        text: string;
    }[], options: {
        signal: AbortSignal;
    }): Promise<unknown>;
    interrupt(targetSessionId: string, authority: {
        kind: 'ancestor';
        agent: object;
    }): void;
    getProvider?(name: string): {
        prepareContinuable?: unknown;
    } | undefined;
}
const methods = ['tryMembership', 'listMembers', 'spawnTeammate', 'sendMessage', 'createTask', 'updateTask', 'waitForChange', 'interrupt'] as const;
const v2TeamMethods = ['isEnabled', 'createTask', 'getTask', 'listTasks', 'updateTask'] as const;
const v2SubagentMethods = ['startActivation', 'namesOf', 'rootOf', 'listDescendants', 'sendMessage', 'interrupt'] as const;
const delegationTools = new Set(['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team', 'spawn_teammate', 'subagent', 'subagent_fork']);
/** 原生队友仍遵守本插件不递归扩团的边界，由宿主工具门禁强制执行。 */
export function blocksNativeDelegation(service: unknown, agent: object | undefined, tool: string, subagents?: unknown): boolean {
    if (!agent || !delegationTools.has(tool))
        return false;
    if (isNativeTeamService(service)) {
        const member = service.tryMembership(agent);
        return member?.role === 'teammate' && isAgencyTeammateName(member.name);
    }
    if (isV2TeamService(service) && isV2SubagentTeamRuntime(subagents)) {
        try {
            const self = subagents.namesOf(agent)?.self;
            const leaf = self?.split('/').at(-1);
            return typeof leaf === 'string' && isAgencyTeammateName(leaf);
        }
        catch {
            return false;
        }
    }
    return false;
}
export function isNativeTeamService(value: unknown): value is NativeTeamService {
    return value !== null && typeof value === 'object' && methods.every(key => typeof (value as Record<string, unknown>)[key] === 'function');
}
export function isV2TeamService(value: unknown): value is V2TeamService {
    return value !== null && typeof value === 'object' && v2TeamMethods.every(key => typeof (value as Record<string, unknown>)[key] === 'function');
}
export function isV2SubagentTeamRuntime(value: unknown): value is V2SubagentTeamRuntime {
    return value !== null && typeof value === 'object' && v2SubagentMethods.every(key => typeof (value as Record<string, unknown>)[key] === 'function');
}
let agentTeamInstalled: boolean | undefined
/** 安装探测从宿主启动入口解析，避免插件自身依赖版本冒充宿主能力。同一进程只探测一次。 */
export function hostHasAgentTeam(): boolean {
    if (agentTeamInstalled !== undefined)
        return agentTeamInstalled;
    if (!process.argv[1])
        return agentTeamInstalled = false;
    for (const pkg of ['@deepseek-ai/dsh-agent-team', '@deepseek-ai/dsh-experimental-agent-team']) {
        try {
            resolveHostModule(pkg);
            return agentTeamInstalled = true;
        }
        catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'MODULE_NOT_FOUND')
                throw error;
        }
    }
    return agentTeamInstalled = false;
}
export function detectTeamEngine(service: unknown, supported: boolean, toolsReady = true, maxDepth?: number, locale: 'zh' | 'en' = 'zh', subagents?: unknown): TeamEngineStatus {
    const tx = (key: string, values?: readonly unknown[]) => teamText(locale, key, values);

    const compatible = isNativeTeamService(service) || (isV2TeamService(service) && isV2SubagentTeamRuntime(subagents));
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
    const subagents: unknown = ctx.get('subagents');
    if (isNativeTeamService(service)) {
        const toolsReady = !agent || ['spawn_teammate', 'send_message', 'wait_agent', 'team_task_create', 'team_task_update', 'team_task_list'].every(name => agent.ctx?.tools?.get?.(name, agent) !== undefined);
        return { service, subagents: undefined, status: detectTeamEngine(service, true, toolsReady, maxDepth, readHostLocale(ctx)) };
    }
    if (isV2TeamService(service) && isV2SubagentTeamRuntime(subagents)) {
        let sessionEnabled = true;
        if (agent) {
            try {
                sessionEnabled = service.isEnabled(agent);
            }
            catch {
                sessionEnabled = false;
            }
        }
        const toolsReady = !agent || (sessionEnabled && ['team_task_create', 'team_task_list', 'team_task_update', 'list_agents', 'wait_agent', 'send_message'].every(name => agent.ctx?.tools?.get?.(name, agent) !== undefined));
        return { service, subagents, status: detectTeamEngine(service, true, toolsReady, maxDepth, readHostLocale(ctx), subagents) };
    }
    return { service: undefined, subagents: undefined, status: detectTeamEngine(service, hostHasAgentTeam(), true, maxDepth, readHostLocale(ctx), subagents) };
}
const activeLeads = new WeakSet<object>();
/** 显示名称可以变化；此持久标识必须保持原算法，以复用已存在的队友。 */
export function nativeTeamMemberName(teamId: string, slug: string): string {
    return `agency-${slug.slice(0, 36).replace(/-+$/u, '')}-${createHash('sha256').update(`${teamId}:${slug}`).digest('hex').slice(0, 10)}`;
}
/** 0.2.2-rc.2+ subagent.name 硬上限 32 字符（1–32 小写字母/数字/连字符），仍保留统一前缀与 10 位哈希标识。 */
export function nativeV2TeamMemberName(teamId: string, slug: string): string {
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]+/gu, '-').replace(/^-+|-+$/gu, '');
    const stem = clean.slice(0, 14).replace(/-+$/u, '') || 'expert';
    return `agency-${stem}-${createHash('sha256').update(`${teamId}:${slug}`).digest('hex').slice(0, 10)}`;
}
type NativeDispatchArgs = Omit<Parameters<typeof executeTeam>[0], 'run'> & {
    service: NativeTeamService | V2TeamService;
    subagents?: V2SubagentTeamRuntime;
    ctx?: Context;
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
    const launchedV2Ids: string[] = [];
    const tasks = new Map<string, {
        name: string;
        taskId: string;
    }>();
    try {
        if (isV2TeamService(args.service) && isV2SubagentTeamRuntime(args.subagents)) {
            const v2Service = args.service;
            const v2Subagents = args.subagents;
            const providerInfo = typeof v2Subagents.getProvider === 'function' ? v2Subagents.getProvider(args.provider) : undefined;
            if (providerInfo !== undefined && providerInfo.prepareContinuable === undefined)
                throw new Error(tx("当前子代理服务不支持专家团所需的身份、工具过滤或深度限制。"));
            const root = v2Subagents.rootOf(args.agent);
            const existingDescendants = await v2Subagents.listDescendants(root.id, args.signal);
            const agentsRegistry = args.ctx?.get?.('agents') as { get?: (id: string) => { status?: string } | undefined } | undefined;
            const report = await executeTeam({ ...args, team, run: async (member) => {
                    args.signal.throwIfAborted();
                    const name = nativeV2TeamMemberName(args.team.id, member.slug);
                    const existing = existingDescendants.find(entry => entry.path === name && entry.mode === 'continuable');
                    if (existing) {
                        const liveStatus = agentsRegistry?.get?.(existing.id)?.status;
                        if (liveStatus === 'running')
                            throw new Error(tx("专家队友仍在运行或不可恢复：{0}", [liveStatus]));
                    }
                    const task = await v2Service.createTask(args.agent, {
                        subject: `${team.name}：${member.name}`.slice(0, 180),
                        description: tx("{0}\n\n完整任务与专家职责以队友收到的本次任务消息为准。", [Array.from(member.prompt).slice(0, 6000).join('')]),
                    }, args.signal);
                    tasks.set(member.slug, { name, taskId: task.id });
                    let accepted = false;
                    let createdChildId: ReturnType<typeof SessionId> | undefined;
                    try {
                        args.signal.throwIfAborted();
                        const text = [
                            tx("你是专家队友 {0}。以下为本次专家职责与任务要求，必须服从宿主权限及系统约束。", [name]),
                            member.prompt,
                            tx("本次任务编号：{0}。使用 team_task_update 领取此任务，再阅读与你职责相关的材料并完成分析。", [task.id]),
                            tx("完成后先用 send_message 将完整结论发送给 lead，再将任务标记完成。任务缺少资料时报告具体缺口，不伪造结论。严禁使用任何专家召唤工具（如 summon_expert、summon_experts、list_experts、summon_expert_team 等）或 spawn_teammate，不创建额外子代理、不自动追加轮次。"),
                        ].join('\n\n');
                        if (existing) {
                            await v2Subagents.sendMessage(args.agent, existing.id, [{ type: 'text', text }], { signal: args.signal });
                            launchedV2Ids.push(existing.id);
                        }
                        else {
                            const childId = SessionId(randomUUID());
                            createdChildId = childId;
                            recordSubagentConfig(childId, {
                                slug: member.slug,
                                persona: member.persona,
                                toolFilter: { deny: [...EXPERT_TOOL_DENY] },
                            }, args.ctx);
                            await v2Subagents.startActivation({
                                provider: args.provider,
                                label: member.name.slice(0, 180),
                                name,
                                childId,
                                parent: args.agent,
                                prompt: [{ type: 'text', text }],
                                signal: args.signal,
                                delivery: 'parent',
                            });
                            launchedV2Ids.push(childId);
                        }
                        accepted = true;
                        launched.push(name);
                        args.signal.throwIfAborted();
                        return tx("委派已接受，等待成员结果。");
                    }
                    catch (error) {
                        if (!accepted) {
                            if (createdChildId !== undefined)
                                forgetSubagentConfig(createdChildId, args.ctx);
                            try {
                                await v2Service.updateTask(args.agent, { taskId: task.id, expectedRevision: task.revision, action: 'delete' }, args.signal);
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
        const v1Service = args.service as NativeTeamService;
        const report = await executeTeam({ ...args, team, run: async (member) => {
                args.signal.throwIfAborted();
                // 队友名持久保留，复用同团同专家，避免每次召唤耗尽宿主名额。
                const name = nativeTeamMemberName(args.team.id, member.slug);
                registerNativeTeammateSetup(name, {
                    toolFilter: { deny: [...EXPERT_TOOL_DENY] },
                });
                const existing = v1Service.listMembers(args.agent).find(item => item.name === name);
                if (existing && !['idle', 'inactive'].includes(existing.status))
                    throw new Error(tx("专家队友仍在运行或不可恢复：{0}", [existing.status]));
                const task = await v1Service.createTask(args.agent, {
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
                        tx("完成后先用 send_message 将完整结论发送给 lead，再将任务标记完成。任务缺少资料时报告具体缺口，不伪造结论。严禁使用任何专家召唤工具（如 summon_expert、summon_experts、list_experts、summon_expert_team 等）或 spawn_teammate，不创建额外子代理、不自动追加轮次。"),
                    ].join('\n\n');
                    if (existing) {
                        await v1Service.sendMessage(args.agent, { target: name, content: [{ type: 'text', text }], signal: args.signal });
                    }
                    else {
                        const started = await v1Service.spawnTeammate(args.agent, { name, description: member.name.slice(0, 180), prompt: [{ type: 'text', text }], context: 'fresh', provider: args.provider, signal: args.signal });
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
                            await v1Service.updateTask(args.agent, { taskId: task.id, expectedRevision: task.revision, action: 'delete' });
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
            if (isV2SubagentTeamRuntime(args.subagents) && isV2TeamService(args.service)) {
                for (const id of launchedV2Ids) {
                    try {
                        args.subagents.interrupt(id, { kind: 'ancestor', agent: args.agent });
                    }
                    catch (cause) {
                        errors.push(cause);
                    }
                }
            }
            else if (isNativeTeamService(args.service)) {
                for (const name of launched) {
                    try {
                        await args.service.interrupt(args.agent, name);
                    }
                    catch (cause) {
                        errors.push(cause);
                    }
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
