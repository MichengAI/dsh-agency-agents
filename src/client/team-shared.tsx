import { useTeamLocale } from './team-locale.js';
import { LibraryConfirm, useLibraryDialog } from './library-ui.js';
import React from 'react';
import { IconX, IconUsers, IconUser, IconFileText, IconChevronDown, IconPlus, IconArrowRight, IconBulb, IconCopy, IconSend, IconSearch, IconEye, IconCheck, IconTrash, IconRefresh, IconGripVertical, } from '@tabler/icons-react';
export { IconUsers, IconUser, IconFileText, IconChevronDown, IconPlus, IconArrowRight, IconBulb, IconCopy, IconSend, IconSearch, IconEye, IconCheck, IconTrash, IconRefresh, IconGripVertical, };
import type { ExpertSummary } from '../expert-contract.js';
import type { ExpertTeam, TeamInput } from '../team-contract.js';
import { EXPERT_AVATAR_URLS } from './avatars.js';
import { expertAvatarIndexForDivision } from './index.js';
export function Avatar({ expert, size = 40, }: {
    expert?: ExpertSummary;
    size?: number;
}) {
    return (<img className="agt-avatar" src={EXPERT_AVATAR_URLS[expert?.custom
            ? (expert.avatar ?? 0)
            : expert
                ? expertAvatarIndexForDivision(expert.slug, expert.division)
                : 0]} width={size} height={size} alt=""/>);
}
export function TeamAvatars({ team, experts, large = false, }: {
    team: TeamInput;
    experts: readonly ExpertSummary[];
    large?: boolean;
}) {
    return (<div className={`agt-stack ${large ? 'agt-stack-large' : ''}`} aria-hidden="true">
      {team.members.slice(0, 3).map((member) => (<Avatar key={member.expertSlug} expert={experts.find((e) => e.slug === member.expertSlug)} size={large ? 80 : 54}/>))}
    </div>);
}
/** 原生 dialog 负责焦点圈定；卸载后恢复到打开它的控件。 */
export function TeamDialog({ title, children, close, className = '', }: {
    title: string;
    children: React.ReactNode;
    close(): void;
    className?: string;
}) {
    const { locale, tx } = useTeamLocale();

    const ref = React.useRef<HTMLDialogElement>(null);
    useLibraryDialog(ref);
    const editor = className === 'agt-editor';
    return (<dialog ref={ref} className={`${editor ? 'aag-custom-dialog' : 'aag-prompt-modal'} agt-dialog ${className}`} aria-label={title} onMouseDown={(event) => {
            if (editor || event.target !== event.currentTarget)
                return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom) {
                event.preventDefault();
                close();
            }
        }} onCancel={(e) => {
            e.preventDefault();
            e.stopPropagation();
            close();
        }} onKeyDown={(e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                close();
            }
        }}>
      <header className={editor ? 'aag-custom-head' : 'aag-modal-head'}>
        <h3 className="aag-modal-title">{title}</h3>
        <button type="button" className={editor ? 'aag-action' : 'aag-modal-close'} aria-label={tx("关闭{0}", [title])} onClick={close}>{tx("关闭")}</button>
      </header>{' '}
      {children}
    </dialog>);
}
export function TeamConfirm({ title, children, label, onCancel, onConfirm, busy = false, cancelLabel, error, }: {
    cancelLabel?: string;
    title: string;
    children: React.ReactNode;
    label: string;
    onCancel(): void;
    onConfirm(): void;
    busy?: boolean;
    error?: string;
}) {
    const { locale, tx } = useTeamLocale();

    return (<LibraryConfirm title={title} busy={busy} error={error} cancelLabel={cancelLabel ?? tx("取消")} confirmLabel={busy ? tx("正在处理…") : label} close={onCancel} confirm={onConfirm}>
      {children}
    </LibraryConfirm>);
}
export function MemberList({ team, experts, }: {
    team: TeamInput;
    experts: readonly ExpertSummary[];
}) {
    const { locale, tx } = useTeamLocale();

    return (<div className="agt-member-list">
      {team.members.map((member) => {
            const expert = experts.find((e) => e.slug === member.expertSlug);
            return (<div key={member.expertSlug} className="agt-member">
            <Avatar expert={expert}/>
            <div>
              <strong>{(locale === 'en' ? expert?.nameEn : expert?.name) ?? tx("成员已失效")}</strong>
              <small>{member.duty}</small>
            </div>
          </div>);
        })}
    </div>);
}
export const teamIssue = (team: ExpertTeam, experts: readonly ExpertSummary[], enabled: readonly string[]): string | undefined => {
    if (team.members.some((m) => !experts.some((e) => e.slug === m.expertSlug && !e.conflict)))
        return "成员失效，需替换";
    if (team.members.some((m) => !enabled.includes(m.expertSlug)))
        return "有成员未启用";
    return undefined;
};
