import { useTeamLocale, localizeTeam, localizedExperts } from './team-locale.js';
import { LibraryEditorFooter } from './library-ui.js';
import React from 'react';
import { effectiveCoordinator, BUILTIN_TEAMS, TEAM_PROMPTS, teamInputSchema, type TeamInput, type TeamSnapshot, } from '../team-contract.js';
import type { ExpertSummary } from '../expert-contract.js';
import { Button, Input } from './antd-ui.js';
import { CategorySelect } from './category-select.js';
import { EN_DIVISION, ZH_DIVISION } from '../names.js';
import { TeamDialog, TeamConfirm, Avatar, IconPlus, IconTrash, IconRefresh, IconSearch, } from './team-shared.js';
import { TeamDetails } from './team-ui.js';

const PICKER_ROW = 72

/** 只挂载可见行。一次渲染三百多位专家会把打开弹窗卡住。 */
function MemberPicker(props: {
    experts: readonly ExpertSummary[]
    locale: 'zh' | 'en'
    query: string
    source: 'all' | 'base' | 'custom'
    division: string
    taken: readonly { expertSlug: string }[]
    replacing: number
    tx(key: string): string
    onQuery(value: string): void
    onSource(value: 'all' | 'base' | 'custom'): void
    onDivision(value: string): void
    onPick(expert: ExpertSummary): void
    close(): void
}) {
    const names = props.locale === 'en' ? EN_DIVISION : ZH_DIVISION
    const options = React.useMemo(() => {
        const values = [...new Set(props.experts.map((expert) => expert.division))]
        values.sort((left, right) => (names[left] ?? left).localeCompare(names[right] ?? right, props.locale))
        return [{ value: '', label: props.tx("全部分类") }, ...values.map((value) => ({ value, label: names[value] ?? value }))]
    }, [props.experts, props.locale, names, props.tx])
    const needle = props.query.trim().toLowerCase()
    const matches = props.experts.filter((expert) => !expert.conflict
        && !props.taken.some((member, index) => member.expertSlug === expert.slug && index !== props.replacing)
        && (props.source === 'all' || expert.custom === (props.source === 'custom'))
        && (props.division === '' || expert.division === props.division)
        && (needle === '' || `${expert.name} ${expert.nameEn} ${expert.description}`.toLowerCase().includes(needle)))
    const scroller = React.useRef<HTMLDivElement>(null)
    const [top, setTop] = React.useState(0)
    const [height, setHeight] = React.useState(360)
    React.useLayoutEffect(() => {
        const node = scroller.current
        if (node === null) return
        const measure = () => setHeight(node.clientHeight)
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(node)
        return () => observer.disconnect()
    }, [matches.length])
    React.useEffect(() => {
        scroller.current?.scrollTo({ top: 0 })
        setTop(0)
    }, [props.query, props.source, props.division])
    const start = Math.max(0, Math.floor(top / PICKER_ROW) - 4)
    const count = Math.ceil(height / PICKER_ROW) + 8
    const slice = matches.slice(start, start + count)
    return (<TeamDialog title={props.tx("选择团队成员")} close={props.close} className="agt-picker">
      <div className="aag-filters aag-card-filters agt-picker-tools">
        <div className="aag-field aag-field-source">
          <CategorySelect id="agt-picker-source" value={props.source} label={props.tx("来源")} onChange={(value) => props.onSource(value === 'base' || value === 'custom' ? value : 'all')} options={[
            { value: 'all', label: props.tx("全部来源") },
            { value: 'base', label: props.tx("内置") },
            { value: 'custom', label: props.tx("自定义") },
          ]}/>
        </div>
        <div className="aag-field aag-field-category">
          <CategorySelect id="agt-picker-category" value={props.division} label={props.tx("分类")} onChange={props.onDivision} options={options}/>
        </div>
        <div className="aag-field aag-field-search">
          <div className="aag-search-wrap">
            <Input className="aag-search" aria-label={props.tx("搜索团队成员")} autoFocus autoComplete="off" spellCheck={false} allowClear={{ clearIcon: <span aria-label={props.tx("清除搜索")}/> }} placeholder={props.tx("搜索专家、职责或领域")} prefix={<IconSearch size={16}/>} value={props.query} onChange={(event) => props.onQuery(event.target.value)}/>
          </div>
        </div>
      </div>
      <div className="agt-picker-list" ref={scroller} onScroll={(event) => setTop(event.currentTarget.scrollTop)}>
        {matches.length === 0 ? <p className="agt-help">{props.tx("没有匹配的专家")}</p> : <div style={{ height: matches.length * PICKER_ROW, position: 'relative' }}>
          {slice.map((expert, index) => (<button type="button" key={expert.slug} style={{ position: 'absolute', top: (start + index) * PICKER_ROW, left: 0, right: 0, height: PICKER_ROW }} onClick={() => props.onPick(expert)}>
            <Avatar expert={expert} size={40}/>
            <span>
              <strong>{expert.name}</strong>
              <small>{names[expert.division] ?? expert.division} · {expert.description}</small>
            </span>
          </button>))}
        </div>}
      </div>
    </TeamDialog>)
}

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
    const [pickerSource, setPickerSource] = React.useState<'all' | 'base' | 'custom'>('all');
    const [pickerDivision, setPickerDivision] = React.useState('');
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
            form.current?.querySelector<HTMLElement>('[name="tags"]')?.focus();
            return;
        }
        if (draft.coordinatorMode === 'custom' && (!draft.coordinatorPrompt.trim() || Array.from(draft.coordinatorPrompt).length > 12000)) {
            setError(tx("主理人提示词：请填写 1～12000 个字符。"));
            form.current?.querySelector<HTMLElement>('[name="coordinatorPrompt"]')?.focus();
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
      {multi ? (<Input.TextArea aria-label={label} name={key} value={draft[key]} maxLength={max} onChange={(e) => patch({ [key]: e.target.value })} rows={key === 'description' ? 2 : 3} required={key !== 'constraints'}/>) : (<Input aria-label={label} name={key} value={draft[key]} maxLength={max} required={key !== 'constraints'} onChange={(e) => patch({ [key]: e.target.value })}/>)}
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
                    <Input aria-label={tx("场景标签")} name="tags" value={tagsInput} placeholder={tx("最多 3 个，用逗号分隔")} onChange={(e) => setTagsInput(e.target.value)}/>
                    <small>{tx("场景标签：最多 3 个，每个标签最多 16 个字符。")}</small>
                  </label>
                  <p className="agt-help">{tx("团队头像由成员头像自动组成。")}</p>
                  <Button onClick={() => setPreview(true)}>{tx("预览")}</Button>
                </>)}
              {section(tx("团队成员"), <>
                  <div className="agt-row">
                    <span>{draft.members.length} / 8</span>
                    <Button disabled={draft.members.length >= 8} onClick={() => {
                setQuery('');
                setPickerSource('all');
                setPickerDivision('');
                setPicker(-1);
            }}>
                      <IconPlus />{tx("添加成员")}</Button>
                  </div>
                  {draft.members.map((m, i) => (<div className="agt-edit-member" key={m.expertSlug}>
                      <div className="agt-row">
                        <Avatar expert={props.experts.find((e) => e.slug === m.expertSlug)}/>
                        <strong>
                          {props.experts.find((e) => e.slug === m.expertSlug)
                    ?.name ?? tx("成员已失效")}
                        </strong>
                        <Button onClick={() => {
                    setQuery('');
                    setPickerSource('all');
                    setPickerDivision('');
                    setPicker(i);
                }}>
                          <IconRefresh />{tx("替换")}</Button>
                        <Button aria-label={tx("删除成员 {0}", [i + 1])} onClick={() => patch({
                    members: draft.members.filter((_, n) => n !== i),
                })}>
                          <IconTrash />
                        </Button>
                      </div>
                      <label className="aag-custom-field">
                        <span>{tx("职责摘要")}</span>
                        <Input aria-label={tx("职责摘要")} value={m.duty} maxLength={100} onChange={(e) => patch({
                    members: draft.members.map((v, n) => n === i ? { ...v, duty: e.target.value } : v),
                })}/>
                      </label>
                      <details>
                        <summary>{tx("展开详细分工")}</summary>
                        <label className="aag-custom-field">
                          <span>{tx("详细分工")}</span>
                          <Input.TextArea aria-label={tx("详细分工")} value={m.instructions} maxLength={2000} rows={3} onChange={(e) => patch({
                    members: draft.members.map((v, n) => n === i
                        ? { ...v, instructions: e.target.value }
                        : v),
                })}/>
                        </label>
                        <div className="agt-row">
                          <Button disabled={i === 0} onClick={() => {
                    const members = [...draft.members];
                    [members[i - 1], members[i]] = [
                        members[i],
                        members[i - 1],
                    ];
                    patch({ members });
                }}>{tx("上移")}</Button>
                          <Button disabled={i === draft.members.length - 1} onClick={() => {
                    const members = [...draft.members];
                    [members[i + 1], members[i]] = [
                        members[i],
                        members[i + 1],
                    ];
                    patch({ members });
                }}>{tx("下移")}</Button>
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
                      <Button type={draft.coordinatorMode === 'template' ? 'primary' : 'default'} aria-pressed={draft.coordinatorMode === 'template'} onClick={() => patch({ coordinatorMode: 'template' })}>{tx("团队模板")}</Button>
                      <Button type={draft.coordinatorMode === 'custom' ? 'primary' : 'default'} aria-pressed={draft.coordinatorMode === 'custom'} onClick={() => patch({
                coordinatorMode: 'custom',
                coordinatorPrompt: draft.coordinatorPrompt ||
                    effectiveCoordinator(draft, locale),
            })}>{tx("自定义")}</Button>
                    </div>
                    <Button onClick={() => setConfirm('restore')}>
                      <IconRefresh />{tx("恢复团队模板")}</Button>
                  </div>
                  <Input.TextArea name="coordinatorPrompt" className="agt-prompt" aria-label={tx("主理人提示词正文")} readOnly={draft.coordinatorMode === 'template'} value={effectiveCoordinator(draft, locale)} onChange={(e) => patch({ coordinatorPrompt: e.target.value })}/>
                  <p className="agt-help">{tx("目标、约束、成员分工和交付要求会自动加入，无需重复填写。")}<span className="agt-count">
                      {Array.from(effectiveCoordinator(draft, locale)).length} / 12000
                    </span>
                  </p>
                </>)}
              {section(tx("任务示例"), <>
                  {draft.examples.map((example, i) => (<label key={i} className="aag-custom-field">
                      <span>{tx("任务示例")}{i + 1}</span>
                      <Input.TextArea aria-label={`${tx("任务示例")}${i + 1}`} value={example} maxLength={1000} rows={2} onChange={(e) => patch({
                    examples: draft.examples.map((v, n) => n === i ? e.target.value : v),
                })}/>
                      <Button disabled={draft.examples.length <= 1} onClick={() => patch({
                    examples: draft.examples.filter((_, n) => n !== i),
                })}>{tx("移除此示例")}</Button>
                    </label>))}
                  <Button disabled={draft.examples.length >= 3} onClick={() => patch({ examples: [...draft.examples, ''] })}>
                    <IconPlus />{tx("添加示例")}</Button>
                </>)}
            </fieldset>
            {error && (<div className="aag-error" role="alert">
                {error}
              </div>)}
            {needsReview && (<section className="aag-custom-review">
                <Button disabled={busy} onClick={() => {
                setBusy(true);
                void props
                    .refresh()
                    .then(setReview)
                    .catch((cause) => setError(cause instanceof Error ? tx(cause.message) : tx("刷新失败。")))
                    .finally(() => setBusy(false));
            }}>{tx("读取最新配置")}</Button>
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
                        <Input.TextArea aria-label={tx("最新主理人提示词")} readOnly value={effectiveCoordinator(latestTeam, locale)} rows={8}/>
                      </>) : (<p>{tx("该专家团已被删除，保留草稿将另存为新团队。")}</p>)}
                    <p>{tx("请核对差异，再选择保留草稿或采用最新配置。")}</p>
                    <div className="aag-custom-review-actions">
                      <Button onClick={() => continueReview(false)}>{tx("保留我的草稿")}</Button>
                      {review.teams.some((team) => team.id === draft.id) && (<Button onClick={() => continueReview(true)}>{tx("使用最新内容")}</Button>)}
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
      {picker !== null && (<MemberPicker experts={props.experts} locale={locale} query={query} source={pickerSource} division={pickerDivision} taken={draft.members} replacing={picker} tx={tx} onQuery={setQuery} onSource={setPickerSource} onDivision={setPickerDivision} close={() => setPicker(null)} onPick={(expert) => {
            const member = {
                expertSlug: expert.slug,
                duty: expert.description.slice(0, 100) || tx("提供本专业分析"),
                instructions: expert.description || tx("从自身专业角度分析任务，给出结论、依据和建议。"),
            };
            patch({
                members: picker === -1
                    ? [...draft.members, member]
                    : draft.members.map((value, index) => index === picker ? { ...value, expertSlug: expert.slug } : value),
            });
            setPicker(null);
        }}/>)}
      {preview && (<TeamDetails team={{ ...draft, tags, id: draft.id ?? 'team-preview', builtin: false }} experts={props.experts} close={() => setPreview(false)}/>)}
    </TeamDialog>);
}
