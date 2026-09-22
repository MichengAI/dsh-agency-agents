import { catalogState } from './catalog.js';
import { acceptTeams, refreshTeams, subscribeTeams, teamState } from './team-cache.js';
import { useTeamLocale, localizeTeam, localizedExperts } from './team-locale.js';
import { LibraryCard } from './library-ui.js';
import { CategorySelect } from './category-select.js';
import { IconX } from '@tabler/icons-react/dist/esm/tabler-icons-react.mjs';
import React from 'react';
import { effectiveCoordinator, type ExpertTeam, type TeamInput, type TeamSnapshot, } from '../team-contract.js';
import type { ExpertSummary } from '../expert-contract.js';
import type { AgencyCatalogRemote, AgencyTeamsRemote } from './remote.js';
import { TeamEditor } from './team-editor.js';
import { TeamDialog, TeamConfirm, TeamAvatars, MemberList, Avatar, teamIssue, IconUsers, IconFileText, IconPlus, IconArrowRight, IconBulb, IconCopy, IconSend, IconSearch, IconEye, IconRefresh, } from './team-shared.js';
export { TEAM_CSS } from './team-style.js';
export type TeamRemote = AgencyCatalogRemote & AgencyTeamsRemote;
export async function unwrap<T>(promise: Promise<{
    ok: true;
    value: T;
} | {
    ok: false;
    error: {
        message: string;
    };
}>): Promise<T> {
    const result = await promise;
    if (!result.ok)
        throw new Error(result.error.message);
    return result.value;
}
export function TeamDetails(props: {
    team: ExpertTeam;
    experts: readonly ExpertSummary[];
    close(): void;
    onSelect?(example?: string): void;
    onCopy?(): void;
    onEdit?(): void;
    onDelete?(): void;
}) {
    const { locale, tx } = useTeamLocale();

    props = { ...props, team: localizeTeam(props.team, locale), experts: localizedExperts(props.experts, locale) };
    const [prompt, setPrompt] = React.useState(false);
    return (<TeamDialog title={tx("{0}详情", [props.team.name])} close={props.close} className="agt-detail">
      <header className="agt-detail-head">
        <TeamAvatars team={props.team} experts={props.experts} large/>
        <div>
          <h2>{props.team.name}</h2>
          <p>
            {props.team.builtin ? tx("内置专家团") : tx("我的专家团")} ·{' '}
            {props.team.members.length}{tx("位专家")}</p>
          <div className="agt-row">
            {props.onSelect && (<button type="button" className="agt-primary" onClick={() => props.onSelect?.()}>
                <IconSend />{tx("召唤专家团")}</button>)}
            {props.onCopy && (<button type="button" onClick={props.onCopy}>
                <IconCopy />{tx("复制并自定义")}</button>)}
            {props.onEdit && (<button type="button" onClick={props.onEdit}>{tx("编辑专家团")}</button>)}
          </div>
        </div>
      </header>
      <p className="agt-description">{props.team.description}</p>
      <div className="agt-tags">
        {props.team.tags.map((tag) => (<span className="agt-tag" key={tag}>
            {tag}
          </span>))}
      </div>
      <section>
        <h3>
          <IconBulb />{tx("团队帮你做")}</h3>
        <div className="agt-examples">
          {props.team.examples.map((example, i) => (<button type="button" key={i} disabled={!props.onSelect} onClick={() => props.onSelect?.(example)}>
              <span>“{example}”</span>
              <IconSend />
            </button>))}
        </div>
        <p className="agt-help">{tx("选择后填入聊天草稿，由你确认发送。")}</p>
      </section>
      <section>
        <h3>
          <IconUsers />{tx("团队成员")}</h3>
        <MemberList team={props.team} experts={props.experts}/>
        <p className="agt-help">{tx("由当前会话协调，成员分别分析后统一汇总。")}</p>
        <details>
          <summary>{tx("查看成员完整分工")}</summary>
          {props.team.members.map((member) => (<p key={member.expertSlug}>
              <strong>
                {props.experts.find((e) => e.slug === member.expertSlug)
                ?.name ?? tx("成员失效")}
                ：
              </strong>
              {member.instructions}
            </p>))}
        </details>
      </section>
      <section>
        <h3>
          <IconFileText />{tx("你将获得")}</h3>
        <p>{props.team.deliveryRequirements}</p>
        <button type="button" className="agt-link" onClick={() => setPrompt(!prompt)} aria-expanded={prompt}>{tx("查看主理人提示词")}</button>
        {prompt && (<pre className="agt-read-prompt">
            {effectiveCoordinator(props.team, locale)}
          </pre>)}
      </section>
      {props.onDelete && (<button type="button" className="agt-danger" onClick={props.onDelete}>{tx("删除专家团")}</button>)}
    </TeamDialog>);
}
export function TeamsPanel(props: {
    remote: TeamRemote;
    prepareSelect?(): (team: ExpertTeam, example?: string) => boolean | Promise<boolean>;
    onSelect?(team: ExpertTeam, example?: string): boolean | Promise<boolean>;
    onExpertsChanged?(): void;
    headerLinks?: React.ReactNode;
    sharedHeader?: boolean;
    onSummary?: (value: {
        total: number;
        enabled: number;
    }) => void;
    title?: string;
}) {
    const { locale, tx } = useTeamLocale();

    const [snapshot, setSnapshot] = React.useState<TeamSnapshot | null>(() => teamState(props.remote));
    React.useEffect(() => {
        props.onSummary?.({ total: snapshot?.teams.length ?? 0, enabled: snapshot?.enabledTeams.length ?? 0 });
    }, [snapshot?.teams.length, snapshot?.enabledTeams.length, props.onSummary]);
    const [rawExperts, setExperts] = React.useState<ExpertSummary[]>(() => {
        const catalog = catalogState(props.remote);
        return catalog.revision < 0 ? [] : [...catalog.experts];
    });
    const experts = localizedExperts(rawExperts, locale);
    const [query, setQuery] = React.useState('');
    const [filter, setFilter] = React.useState('all');
    const [status, setStatus] = React.useState('');
    const [copied, setCopied] = React.useState('');
    const copiedTimer = React.useRef<ReturnType<typeof setTimeout>>();
    React.useEffect(() => () => clearTimeout(copiedTimer.current), []);
    const [error, setError] = React.useState('');
    const [notice, setNotice] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [details, setDetails] = React.useState<ExpertTeam | null>(null);
    const [editor, setEditor] = React.useState<{
        value?: TeamInput;
        enabled: boolean;
        revision: number;
    } | null>(null);
    const [confirm, setConfirm] = React.useState<{
        team: ExpertTeam;
        action: 'enable' | 'delete' | 'select';
        example?: string;
    } | null>(null);
    const alive = React.useRef(true);
    const sequence = React.useRef(0);
    React.useEffect(() => {
        alive.current = true;
        void load();
        const unsubscribe = subscribeTeams(props.remote, () => {
            if (!alive.current)
                return;
            const next = teamState(props.remote);
            if (!next)
                return;
            sequence.current++;
            setSnapshot(next);
        });
        return () => {
            alive.current = false;
            sequence.current++;
            unsubscribe();
        };
    }, [props.remote]);
    const load = async () => {
        const generation = ++sequence.current;
        try {
            const teams = await refreshTeams(props.remote);
            if (!alive.current || generation !== sequence.current)
                return;
            setSnapshot(teams);
            const known = catalogState(props.remote);
            if (known.revision >= 0)
                setExperts([...known.experts]);
            else {
                const catalog = await unwrap(props.remote.getCatalog());
                if (!alive.current || generation !== sequence.current)
                    return;
                setExperts(catalog.experts);
            }
            setError('');
        }
        catch (cause) {
            if (alive.current)
                setError(cause instanceof Error ? tx(cause.message) : tx("加载失败。"));
        }
    };
    const accept = (value: TeamSnapshot) => {
        if (!alive.current)
            return;
        sequence.current++;
        const next = { ...value, engine: value.engine ?? snapshot?.engine };
        acceptTeams(props.remote, next);
        setSnapshot(next);
        props.onExpertsChanged?.();
    };
    const change = async (team: ExpertTeam, action: 'enable' | 'delete' | 'select', example?: string, confirmed = false) => {
        if (busy || !snapshot)
            return;
        const enabling = action !== 'delete' &&
            (action === 'select' || !snapshot.enabledTeams.includes(team.id));
        const missing = team.members.filter((m) => !snapshot.enabledExperts.includes(m.expertSlug));
        if (!confirmed && (action === 'delete' || (enabling && missing.length))) {
            setConfirm({ team, action, example });
            setError('');
            return;
        }
        const insert = props.prepareSelect?.() ?? props.onSelect;
        setBusy(true);
        setError('');
        try {
            if (action === 'delete') {
                accept(await unwrap(props.remote.deleteTeam(team.id, snapshot.revision)));
                setDetails(null);
                setNotice(tx("专家团已删除，成员与历史会话保留。"));
            }
            else {
                if (action === 'enable' ||
                    !snapshot.enabledTeams.includes(team.id) ||
                    missing.length)
                    accept(await unwrap(props.remote.setTeamEnabled(team.id, enabling, snapshot.revision)));
                if (!alive.current)
                    return;
                if (action === 'select') {
                    if (!insert || !(await insert(team, example))) {
                        setError(tx("团队已启用，但无法写入当前聊天草稿。请关闭设置后，在聊天的专家团入口选择。"));
                        return;
                    }
                    setDetails(null);
                    setNotice(tx("专家团已加入草稿，确认需求后发送。"));
                }
            }
            setConfirm(null);
        }
        catch (cause) {
            setError(cause instanceof Error ? tx(cause.message) : tx("操作失败。"));
        }
        finally {
            setBusy(false);
        }
    };
    const copy = (team: ExpertTeam) => {
        setDetails(null);
        const { id: _id, builtin: _builtin, ...value } = team;
        setEditor({
            value: {
                ...structuredClone(value),
                name: tx("{0}副本", [team.name]).slice(0, 40),
            },
            enabled: false,
            revision: snapshot!.revision,
        });
    };
    const filtered = snapshot?.teams.map(team => localizeTeam(team, locale)).filter((team) => (filter === 'all' ||
        (filter === 'builtin' ? team.builtin : !team.builtin)) &&
        (!status ||
            snapshot.enabledTeams.includes(team.id) === (status === 'enabled')) &&
        `${team.name} ${team.description} ${team.members.map((m) => experts.find((e) => e.slug === m.expertSlug)?.name ?? '').join(' ')}`
            .toLowerCase()
            .includes(query.toLowerCase())) ?? [];
    const edit = (team: ExpertTeam) => setEditor({
        value: team,
        enabled: snapshot!.enabledTeams.includes(team.id),
        revision: snapshot!.revision,
    });
    const copyPrompt = async (team: ExpertTeam) => {
        try {
            await navigator.clipboard.writeText([
                effectiveCoordinator(team, locale),
                tx("团队目标：{0}", [team.goal]),
                tx("共同约束：{0}", [team.constraints]),
                tx("交付要求：{0}", [team.deliveryRequirements]),
                ...team.members.map((member) => `${experts.find((expert) => expert.slug === member.expertSlug)?.name ?? member.expertSlug}：${member.duty}\n${member.instructions}`),
            ].join('\n\n'));
            setCopied(team.id);
            clearTimeout(copiedTimer.current);
            copiedTimer.current = setTimeout(() => setCopied(''), 2000);
        }
        catch (cause) {
            setError(cause instanceof Error ? tx(cause.message) : tx("复制失败，请重试。"));
        }
    };
    return (<section className="aag-section aag-team-library">
      <div className="aag-toolbar">
        {!props.sharedHeader && <div className="aag-title-row">
          {!props.sharedHeader && <h2 className="aag-title">{props.title ?? tx("专家团")}</h2>}
          {!props.sharedHeader && props.headerLinks}
          <span className="aag-header-stat">
            <strong>{snapshot?.teams.length ?? 0}</strong>{tx("个专家团")}</span>
          <span className="aag-header-stat">{tx("已启用")}<strong>{snapshot?.enabledTeams.length ?? 0}</strong>
          </span>
        </div>}
        <div className="aag-actions">
          <button type="button" className="aag-action aag-custom-primary" disabled={!snapshot || busy} onClick={() => setEditor({ enabled: false, revision: snapshot!.revision })}>{tx("新建专家团")}</button>
          <button type="button" className="aag-refresh-button" aria-label={tx("刷新")} title={tx("刷新")} disabled={busy} onClick={() => void load()}>
            <IconRefresh size={20}/>
          </button>
        </div>
      </div>

      <div className="aag-custom-tabs" role="group" aria-label={tx("来源")}>
        {[
            ['all', tx("全部")],
            ['builtin', tx("内置")],
            ['custom', tx("自定义")],
        ].map(([value, label]) => (<button type="button" className="aag-action" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>))}
      </div>
      <div className="aag-filters aag-card-filters">
        <div className="aag-field aag-field-status">
          <label className="aag-label" htmlFor="aag-team-status">{tx("状态")}</label>
          <CategorySelect id="aag-team-status" value={status} onChange={setStatus} options={[
            { value: '', label: tx("全部状态") },
            { value: 'enabled', label: tx("已启用") },
            { value: 'disabled', label: tx("已停用") },
        ]}/>
        </div>
        <div className="aag-field aag-field-search">
          <label className="aag-label" htmlFor="aag-team-search">{tx("搜索")}</label>
          <div className="aag-search-wrap">
            <IconSearch className="aag-search-icon" size={24}/>
            <input id="aag-team-search" className="aag-control aag-search" type="search" aria-label={tx("搜索专家团")} placeholder={tx("搜索团队、用途或成员")} value={query} autoComplete="off" spellCheck={false} onChange={(event) => setQuery(event.target.value)}/>
            {query && (<button type="button" className="aag-search-clear" aria-label={tx("清除搜索")} onClick={() => setQuery('')}>
                <IconX size={18}/>
              </button>)}
          </div>
        </div>
      </div>
      {error && (<div className="aag-error" role="alert">
          {error}
          <button type="button" onClick={() => void load()}>{tx("刷新重试")}</button>
        </div>)}
      {snapshot?.engine?.state === 'disabled' && (<p className="aag-note" role="note">{tx(snapshot.engine.recommendation)}</p>)}
      {notice && (<p role="status" className="aag-custom-notice">
          {notice}
        </p>)}
      {!snapshot && !error && <p role="status">{tx("正在加载专家团…")}</p>}
      <div className="aag-expert-grid aag-team-grid">
        {filtered.map((team) => {
            const issue = teamIssue(team, experts, snapshot!.enabledExperts);
            const enabled = snapshot!.enabledTeams.includes(team.id);
            return (<LibraryCard key={team.id} testId="team-card" name={team.name} avatar={<div className="aag-team-avatar">
                  <TeamAvatars team={team} experts={experts}/>
                </div>} metadata={tx("{0} 位专家", [team.members.length])} description={enabled && issue
                    ? `${team.description} ${tx(issue)}`
                    : team.description} enabled={enabled} disabled={busy} enabledLabel={tx("已启用")} disabledLabel={tx("已停用")} toggle={() => void change(team, 'enable')} moreLabel={tx("更多")} more={<>
                  <button type="button" disabled={busy} onClick={() => (team.builtin ? copy(team) : edit(team))}>
                    {team.builtin ? tx("复制并自定义") : tx("编辑专家团")}
                  </button>
                  {!team.builtin && (<button type="button" className="aag-custom-danger" disabled={busy} onClick={() => void change(team, 'delete')}>{tx("删除专家团")}</button>)}
                </>} actions={<>
                  <button type="button" className="aag-card-action" aria-haspopup="dialog" onClick={() => setDetails(team)}>
                    <IconEye size={18}/>{tx("查看详情")}</button>
                  <button type="button" className="aag-card-action" onClick={() => void copyPrompt(team)}>
                    <IconCopy size={18}/>
                    {copied === team.id ? tx("已复制") : tx("复制提示词")}
                  </button>
                </>}/>);
        })}
      </div>{' '}
      {snapshot && !filtered.length && (<div className="aag-empty">
          <IconUsers size={40}/>
          <h3>{tx("没有找到专家团")}</h3>
          <p>{tx("换个关键词，或创建自己的专家团。")}</p>
          <button type="button" onClick={() => {
                setQuery('');
                setFilter('all');
            }}>{tx("清除筛选")}</button>
        </div>)}
      {details && (<TeamDetails team={details} experts={experts} close={() => setDetails(null)} onCopy={() => copy(details)} onSelect={(example) => void change(details, 'select', example)} onEdit={!details.builtin
                ? () => {
                    setEditor({
                        value: details,
                        enabled: snapshot!.enabledTeams.includes(details.id),
                        revision: snapshot!.revision,
                    });
                    setDetails(null);
                }
                : undefined} onDelete={!details.builtin ? () => void change(details, 'delete') : undefined}/>)}
      {editor && (<TeamEditor initial={editor.value} experts={experts} enabled={editor.enabled} enabledExperts={snapshot!.enabledExperts} close={() => setEditor(null)} refresh={async () => {
                const latest = await unwrap(props.remote.getTeams());
                accept(latest);
                const catalog = await unwrap(props.remote.getCatalog());
                setExperts(catalog.experts);
                return latest;
            }} save={async (value, enabled, revision) => {
                const next = await unwrap(props.remote.saveTeam(value, enabled, revision ?? editor.revision));
                accept(next);
                setEditor(null);
                setNotice(tx("专家团配置已保存。"));
            }}/>)}
      {confirm && (<TeamConfirm title={confirm.action === 'delete' ? tx("删除专家团？") : tx("启用团队成员")} label={confirm.action === 'delete' ? tx("确认删除") : tx("启用团队及所需成员")} busy={busy} error={error} onCancel={() => setConfirm(null)} onConfirm={() => {
                const current = confirm;
                void change(current.team, current.action, current.example, true);
            }}>
          <p>
            {confirm.action === 'delete'
                ? tx("删除“{0}”的配置，保留成员专家和历史会话。", [confirm.team.name]) : tx("同时启用：{0}。停用团队时不会停用成员。", [confirm.team.members
                    .filter((m) => !snapshot!.enabledExperts.includes(m.expertSlug))
                    .map((m) => experts.find((e) => e.slug === m.expertSlug)?.name ?? tx("失效成员"))
                    .join(locale === 'en' ? ', ' : '、')])}
          </p>
        </TeamConfirm>)}
    </section>);
}
