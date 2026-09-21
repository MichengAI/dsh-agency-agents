import { useTeamLocale, localizeTeam, localizedExperts } from './team-locale.js';
import { LibraryEditorFooter } from './library-ui.js';
import React from 'react';
import { effectiveCoordinator, BUILTIN_TEAMS, TEAM_PROMPTS, teamInputSchema, type TeamInput, type TeamSnapshot, } from '../team-contract.js';
import type { ExpertSummary } from '../expert-contract.js';
import { TeamDialog, TeamConfirm, Avatar, IconChevronDown, IconPlus, IconTrash, IconRefresh, } from './team-shared.js';
import { TeamDetails } from './team-ui.js';
const fresh = (tx: (key: string) => string): TeamInput => ({
    name: '',
    description: '',
    tags: [],
    goal: '',
    constraints: '',
    deliveryRequirements: tx("总体结论、主要依据、关键分歧、优先级行动清单及待确认事项。"),
    members: [],
    examples: [tx("请根据我提供的资料，给出有依据的结论与下一步建议。")],
    coordinatorMode: 'template',
    coordinatorTemplateId: 'general',
    coordinatorTemplateVersion: 1,
    coordinatorPrompt: '',
});
export function TeamEditor(props: {
    initial?: TeamInput;
    experts: readonly ExpertSummary[];
    enabled: boolean;
    enabledExperts: readonly string[];
    save(value: TeamInput, enabled: boolean, revision?: number): Promise<void>;
    close(): void;
    refresh(): Promise<TeamSnapshot>;
}) {
    const { locale, tx } = useTeamLocale();

    props = { ...props, experts: localizedExperts(props.experts, locale) };
    const [draft, setDraft] = React.useState<TeamInput>(() => structuredClone(props.initial ?? fresh(tx)));
    const [tagsInput, setTagsInput] = React.useState(() => draft.tags.join('，'));
    const tags = tagsInput.split(/[,，]/u).map(value => value.trim()).filter(Boolean);
    const tagsField = React.useRef<HTMLInputElement>(null);
    const promptField = React.useRef<HTMLTextAreaElement>(null);
    const original = React.useRef(JSON.stringify(draft));
    const form = React.useRef<HTMLFormElement>(null);
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState('');
    const [needsReview, setNeedsReview] = React.useState(false);
    const [review, setReview] = React.useState<TeamSnapshot | null>(null);
    const [reviewedRevision, setReviewedRevision] = React.useState<number>();
    const [currentEnabled, setCurrentEnabled] = React.useState(props.enabled);
    const latestTeam = review?.teams.find((team) => team.id === draft.id);
    const [picker, setPicker] = React.useState<number | null>(null);
    const [query, setQuery] = React.useState('');
    const [confirm, setConfirm] = React.useState<'discard' | 'restore' | 'enable' | null>(null);
    const [preview, setPreview] = React.useState(false);
    const patch = (next: Partial<TeamInput>) => setDraft((value) => ({ ...value, ...next }));
    const close = () => {
        if (busy)
            return;
        if (JSON.stringify(draft) !== original.current || tagsInput !== draft.tags.join('，'))
            setConfirm('discard');
        else
            props.close();
    };
    const missing = props.experts.filter((e) => draft.members.some((m) => m.expertSlug === e.slug) &&
        !props.enabledExperts.includes(e.slug));
    const submit = async (enabled: boolean, confirmed = false) => {
        if (busy || needsReview)
            return;
        if (form.current?.reportValidity() === false)
            return;
        if (tags.length > 3 || tags.some(tag => Array.from(tag).length > 16)) {
            setError(tx("场景标签：最多 3 个，每个标签最多 16 个字符。"));
            tagsField.current?.focus();
            return;
        }
        if (draft.coordinatorMode === 'custom' && (!draft.coordinatorPrompt.trim() || Array.from(draft.coordinatorPrompt).length > 12000)) {
            setError(tx("主理人提示词：请填写 1～12000 个字符。"));
            promptField.current?.focus();
            return;
        }
        const parsed = teamInputSchema.safeParse({ ...draft, tags });
        if (!parsed.success) {
            const labels: Record<string, string> = { name: tx("团队名称"), description: tx("一句话简介"), goal: tx("团队目标"), constraints: tx("通用约束（选填）"), deliveryRequirements: tx("交付要求"), members: tx("团队成员"), examples: tx("任务示例"), coordinatorPrompt: tx("主理人提示词") };
            const key = String(parsed.error.issues[0]?.path[0] ?? 'members');
            setError(tx("请检查字段：{0}。", [labels[key] ?? key]));
            form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
            return;
        }
        if (enabled && missing.length && !confirmed) {
            setConfirm('enable');
            return;
        }
        setError('');
        setBusy(true);
        try {
            await props.save(parsed.data, enabled, reviewedRevision);
        }
        catch (cause) {
            const message = cause instanceof Error ? tx(cause.message) : tx("保存失败，请重试。");
            setError(message);
            if (/changed since it was read|其他窗口|another window|配置已更新|修订/iu.test(message)) {
                setNeedsReview(true);
                setReview(null);
                setConfirm(null);
            }
        }
        finally {
            setBusy(false);
        }
    };
    const continueReview = (useLatest: boolean) => {
        if (!review)
            return;
        const latest = review.teams.find((team) => team.id === draft.id);
        if (useLatest && latest) {
            setDraft(structuredClone(latest));
            setTagsInput(latest.tags.join('，'));
            original.current = JSON.stringify(latest);
        }
        else if (draft.id && !latest) {
            const { id: _id, builtin: _builtin, ...copy } = draft;
            setDraft(copy);
        }
        setCurrentEnabled(latest ? review.enabledTeams.includes(latest.id) : false);
        setReviewedRevision(review.revision);
        setNeedsReview(false);
        setReview(null);
        setError('');
    };
    const section = (title: string, children: React.ReactNode) => (<section className="agt-section" aria-label={title}>
      <h4>{title}</h4>
      <div className="agt-section-content">{children}</div>
    </section>);
    const field = (label: string, key: 'name' | 'description' | 'goal' | 'constraints' | 'deliveryRequirements', max: number, multi = false) => (<label className="aag-custom-field">
      <span>{label}{key !== 'constraints' && <small>{tx("必填")}</small>}</span>
      {multi ? (<textarea aria-label={label} name={key} className="aag-control" value={draft[key]} maxLength={max} onChange={(e) => patch({ [key]: e.target.value })} rows={key === 'description' ? 2 : 3} required={key !== 'constraints'}/>) : (<input aria-label={label} name={key} className="aag-control" value={draft[key]} maxLength={max} required={key !== 'constraints'} onChange={(e) => patch({ [key]: e.target.value })}/>)}
    </label>);
    return (<TeamDialog title={props.initial?.id ? tx("编辑专家团") : tx("新建专家团")} close={close} className="agt-editor">
      <form ref={form} onSubmit={(e) => {
            e.preventDefault();
            void submit(currentEnabled);
        }}>
        <div className="aag-custom-body agt-editor-scroll">
          <div className="agt-editor-fields">
            <fieldset disabled={busy}>
              {section(tx("团队名片"), <>
                  {field(tx("团队名称"), 'name', 40)}
                  {field(tx("一句话简介"), 'description', 160, true)}
                  <label className="aag-custom-field">
                    <span>{tx("场景标签")}</span>
                    <input ref={tagsField} aria-label={tx("场景标签")} name="tags" className="aag-control" value={tagsInput} placeholder={tx("最多 3 个，用逗号分隔")} onChange={(e) => setTagsInput(e.target.value)}/>
                    <small>{tx("场景标签：最多 3 个，每个标签最多 16 个字符。")}</small>
                  </label>
                  <p className="agt-help">{tx("团队头像由成员头像自动组成。")}</p>
                  <button type="button" onClick={() => setPreview(true)}>{tx("预览")}</button>
                </>)}
              {section(tx("团队成员"), <>
                  <div className="agt-row">
                    <span>{draft.members.length} / 8</span>
                    <button type="button" disabled={draft.members.length >= 8} onClick={() => {
                setQuery('');
                setPicker(-1);
            }}>
                      <IconPlus />{tx("添加成员")}</button>
                  </div>
                  {draft.members.map((m, i) => (<div className="agt-edit-member" key={m.expertSlug}>
                      <div className="agt-row">
                        <Avatar expert={props.experts.find((e) => e.slug === m.expertSlug)}/>
                        <strong>
                          {props.experts.find((e) => e.slug === m.expertSlug)
                    ?.name ?? tx("成员已失效")}
                        </strong>
                        <button type="button" onClick={() => {
                    setQuery('');
                    setPicker(i);
                }}>
                          <IconRefresh />{tx("替换")}</button>
                        <button type="button" aria-label={tx("删除成员 {0}", [i + 1])} onClick={() => patch({
                    members: draft.members.filter((_, n) => n !== i),
                })}>
                          <IconTrash />
                        </button>
                      </div>
                      <label className="aag-custom-field">
                        <span>{tx("职责摘要")}</span>
                        <input className="aag-control" value={m.duty} maxLength={100} onChange={(e) => patch({
                    members: draft.members.map((v, n) => n === i ? { ...v, duty: e.target.value } : v),
                })}/>
                      </label>
                      <details>
                        <summary>{tx("展开详细分工")}</summary>
                        <label className="aag-custom-field">
                          <span>{tx("详细分工")}</span>
                          <textarea className="aag-control" value={m.instructions} maxLength={2000} rows={3} onChange={(e) => patch({
                    members: draft.members.map((v, n) => n === i
                        ? { ...v, instructions: e.target.value }
                        : v),
                })}/>
                        </label>
                        <div className="agt-row">
                          <button type="button" disabled={i === 0} onClick={() => {
                    const members = [...draft.members];
                    [members[i - 1], members[i]] = [
                        members[i],
                        members[i - 1],
                    ];
                    patch({ members });
                }}>{tx("上移")}</button>
                          <button type="button" disabled={i === draft.members.length - 1} onClick={() => {
                    const members = [...draft.members];
                    [members[i + 1], members[i]] = [
                        members[i],
                        members[i + 1],
                    ];
                    patch({ members });
                }}>{tx("下移")}</button>
                        </div>
                      </details>
                    </div>))}
                </>)}
              {section(tx("协作与交付"), <>
                  {field(tx("团队目标"), 'goal', 2000, true)}
                  {field(tx("交付要求"), 'deliveryRequirements', 2000, true)}
                  {field(tx("通用约束（选填）"), 'constraints', 2000, true)}
                </>)}
              {section(tx("主理人提示词"), <>
                  <p className="agt-help">{tx("定义如何分配任务、处理分歧并汇总专家结果")}</p>
                  <div className="agt-row">
                    <div className="agt-segment">
                      <button type="button" aria-pressed={draft.coordinatorMode === 'template'} onClick={() => patch({ coordinatorMode: 'template' })}>{tx("团队模板")}</button>
                      <button type="button" aria-pressed={draft.coordinatorMode === 'custom'} onClick={() => patch({
                coordinatorMode: 'custom',
                coordinatorPrompt: draft.coordinatorPrompt ||
                    effectiveCoordinator(draft, locale),
            })}>{tx("自定义")}</button>
                    </div>
                    <button type="button" onClick={() => setConfirm('restore')}>
                      <IconRefresh />{tx("恢复团队模板")}</button>
                  </div>
                  <textarea ref={promptField} name="coordinatorPrompt" className="aag-control agt-prompt" aria-label={tx("主理人提示词正文")} readOnly={draft.coordinatorMode === 'template'} value={effectiveCoordinator(draft, locale)} onChange={(e) => patch({ coordinatorPrompt: e.target.value })}/>
                  <p className="agt-help">{tx("目标、约束、成员分工和交付要求会自动加入，无需重复填写。")}<span className="agt-count">
                      {Array.from(effectiveCoordinator(draft, locale)).length} / 12000
                    </span>
                  </p>
                </>)}
              {section(tx("任务示例"), <>
                  {draft.examples.map((example, i) => (<label key={i} className="aag-custom-field">
                      <span>{tx("任务示例")}{i + 1}</span>
                      <textarea className="aag-control" value={example} maxLength={1000} rows={2} onChange={(e) => patch({
                    examples: draft.examples.map((v, n) => n === i ? e.target.value : v),
                })}/>
                      <button type="button" disabled={draft.examples.length <= 1} onClick={() => patch({
                    examples: draft.examples.filter((_, n) => n !== i),
                })}>{tx("移除此示例")}</button>
                    </label>))}
                  <button type="button" disabled={draft.examples.length >= 3} onClick={() => patch({ examples: [...draft.examples, ''] })}>
                    <IconPlus />{tx("添加示例")}</button>
                </>)}
            </fieldset>
            {error && (<div className="aag-error" role="alert">
                {error}
              </div>)}
            {needsReview && (<section className="aag-custom-review">
                <button type="button" disabled={busy} onClick={() => {
                setBusy(true);
                void props
                    .refresh()
                    .then(setReview)
                    .catch((cause) => setError(cause instanceof Error ? tx(cause.message) : tx("刷新失败。")))
                    .finally(() => setBusy(false));
            }}>{tx("读取最新配置")}</button>
                {review && (<>
                    <h4>{tx("最新内容")}</h4>
                    {latestTeam ? (<>
                        <p>
                          <strong>{latestTeam.name}</strong> ·{' '}
                          {review.enabledTeams.includes(latestTeam.id)
                        ? tx("已启用") : tx("已停用")}
                        </p>
                        <p>{latestTeam.description}</p>
                        <p>{tx("目标：")}{latestTeam.goal}</p>
                        <p>{tx("共同约束：")}{latestTeam.constraints || tx("未设置")}</p>
                        <p>{tx("交付要求：")}{latestTeam.deliveryRequirements}</p>
                        {latestTeam.members.map((member) => (<p key={member.expertSlug}>
                            {props.experts.find((expert) => expert.slug === member.expertSlug)?.name ?? tx("成员已失效")}
                            ：{member.duty}。{member.instructions}
                          </p>))}
                        <textarea className="aag-control" aria-label={tx("最新主理人提示词")} readOnly value={effectiveCoordinator(latestTeam, locale)} rows={8}/>
                      </>) : (<p>{tx("该专家团已被删除，保留草稿将另存为新团队。")}</p>)}
                    <p>{tx("请核对差异，再选择保留草稿或采用最新配置。")}</p>
                    <div className="aag-custom-review-actions">
                      <button type="button" onClick={() => continueReview(false)}>{tx("保留我的草稿")}</button>
                      {review.teams.some((team) => team.id === draft.id) && (<button type="button" onClick={() => continueReview(true)}>{tx("使用最新内容")}</button>)}
                    </div>
                  </>)}
              </section>)}{' '}
          </div>
        </div>
        <LibraryEditorFooter editing={!!draft.id} busy={busy} blocked={needsReview} help={tx("保存配置不会发送任务。")} cancelLabel={tx("取消")} saveLabel={tx("保存")} primaryLabel={busy ? tx("正在保存…") : draft.id ? tx("保存修改") : tx("保存并启用")} close={close} save={() => void submit(false)} primary={() => void submit(draft.id ? currentEnabled : true)}/>{' '}
      </form>
      {confirm && (<TeamConfirm busy={busy} error={error} cancelLabel={confirm === 'discard' ? tx("继续编辑") : tx("取消")} title={confirm === 'discard'
                ? tx("放弃未保存修改？") : confirm === 'restore'
                ? tx("恢复团队模板？") : tx("启用团队成员")} label={confirm === 'discard'
                ? tx("放弃修改") : confirm === 'restore'
                ? tx("确认恢复") : tx("启用团队及所需成员")} onCancel={() => setConfirm(null)} onConfirm={() => {
                const action = confirm;
                if (action !== 'enable')
                    setConfirm(null);
                if (action === 'discard')
                    props.close();
                else if (action === 'restore')
                    patch({ coordinatorMode: 'template', coordinatorPrompt: '' });
                else
                    void submit(true, true);
            }}>
          <p>
            {confirm === 'enable'
                ? tx("同时启用：{0}。停用团队时不会停用这些专家。", [missing.map((e) => e.name).join(locale === 'en' ? ', ' : '、')]) : confirm === 'restore'
                ? tx("只恢复主理人规则，不修改成员分工、目标或交付要求。") : tx("未保存的表单改动将丢弃。")}
          </p>
        </TeamConfirm>)}
      {picker !== null && (<TeamDialog title={tx("选择团队成员")} close={() => setPicker(null)} className="agt-picker">
          <h2>{tx("选择团队成员")}</h2>
          <input className="aag-control" aria-label={tx("搜索团队成员")} autoFocus placeholder={tx("搜索专家名称或领域")} value={query} onChange={(e) => setQuery(e.target.value)}/>
          <div className="agt-picker-list">
            {props.experts
                .filter((e) => !e.conflict &&
                !draft.members.some((m, i) => m.expertSlug === e.slug && i !== picker) &&
                `${e.name} ${e.nameEn} ${e.description}`
                    .toLowerCase()
                    .includes(query.toLowerCase()))
                .map((e) => (<button type="button" key={e.slug} onClick={() => {
                    const m = {
                        expertSlug: e.slug,
                        duty: e.description.slice(0, 100) || tx("提供本专业分析"),
                        instructions: e.description || tx("从自身专业角度分析任务，给出结论、依据和建议。"),
                    };
                    patch({
                        members: picker === -1
                            ? [...draft.members, m]
                            : draft.members.map((v, i) => i === picker ? { ...v, expertSlug: e.slug } : v),
                    });
                    setPicker(null);
                }}>
                  <Avatar expert={e}/>
                  <span>
                    <strong>{e.name}</strong>
                    <small>{e.description}</small>
                  </span>
                </button>))}
          </div>
        </TeamDialog>)}
      {preview && (<TeamDetails team={{ ...draft, tags, id: draft.id ?? 'team-preview', builtin: false }} experts={props.experts} close={() => setPreview(false)}/>)}
    </TeamDialog>);
}
