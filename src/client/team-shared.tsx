import { useTeamLocale } from './team-locale.js';
import { LibraryConfirm } from './library-ui.js';
import { Modal } from './plugin-ui.js';
import { useEscapeLayer } from './escape-layer.js';
import React from 'react';
import { IconX, IconUsers, IconUser, IconFileText, IconChevronDown, IconPlus, IconArrowRight, IconBulb, IconCopy, IconSend, IconSearch, IconEye, IconCheck, IconTrash, IconRefresh, IconGripVertical, } from '@tabler/icons-react/dist/esm/tabler-icons-react.mjs';
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
/** 统一采用宿主官方原生居中模态窗口，彻底告别侧边抽屉。 */
export function TeamDialog({ title, children, close, className = '', }: {
    title: string;
    children: React.ReactNode;
    close(): void;
    className?: string;
}) {
    useEscapeLayer(true, close);
    const editor = className === 'agt-editor';
    const opener = React.useRef<HTMLElement | null>(typeof document !== 'undefined' && document.activeElement instanceof HTMLElement ? document.activeElement : null);
    React.useEffect(() => () => {
        const node = opener.current;
        queueMicrotask(() => { if (node?.isConnected) node.focus({ preventScroll: true }); });
    }, []);
    return (
        <Modal
            className={`agt-dialog ${className} ${editor ? 'agt-editor-modal' : ''}`}
            title={title}
            open
            zIndex={1200}
            width={editor ? "min(680px, calc(100vw - 32px))" : "min(760px, calc(100vw - 32px))"}
            footer={null}
            onCancel={close}
            onClose={close}
        >
            {children}
        </Modal>
    );
}
export function TeamConfirm({ title, children, label, onCancel, onConfirm, busy = false, cancelLabel, danger, error, }: {
    cancelLabel?: string;
    title: string;
    children: React.ReactNode;
    label: string;
    onCancel(): void;
    onConfirm(): void;
    busy?: boolean;
    danger?: boolean;
    error?: string;
}) {
    const { locale, tx } = useTeamLocale();

    return (<LibraryConfirm title={title} danger={danger} busy={busy} error={error} cancelLabel={cancelLabel ?? tx("取消")} confirmLabel={busy ? tx("正在处理…") : label} close={onCancel} confirm={onConfirm}>
      {children}
    </LibraryConfirm>);
}
export function MemberList({ team, experts, }: {
    team: TeamInput;
    experts: readonly ExpertSummary[];
}) {
    const { locale, tx } = useTeamLocale();

    return (<ul className="agt-member-list">
      {team.members.map((member) => {
        const expert = experts.find((e) => e.slug === member.expertSlug);
        return (<li key={member.expertSlug}>
          <Avatar expert={expert} size={40}/>
          <span>
            <strong>{(locale === 'en' ? expert?.nameEn : expert?.name) ?? tx("成员已失效")}</strong>
            <small>{member.duty}</small>
          </span>
        </li>);
      })}
    </ul>);
}
export const teamIssue = (team: ExpertTeam, experts: readonly ExpertSummary[], enabled: readonly string[]): string | undefined => {
    if (team.members.some((m) => !experts.some((e) => e.slug === m.expertSlug && !e.conflict)))
        return "成员失效，需替换";
    if (team.members.some((m) => !enabled.includes(m.expertSlug)))
        return "有成员未启用";
    return undefined;
};
