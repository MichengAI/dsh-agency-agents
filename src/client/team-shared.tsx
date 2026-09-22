import { useTeamLocale } from './team-locale.js';
import { LibraryConfirm } from './library-ui.js';
import { Drawer, List, Modal } from './antd-ui.js';
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
/** 编辑走右侧抽屉，详情和成员选择走默认弹窗。 */
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
    if (editor) {
        return (<Drawer classNames={{ body: `agt-dialog agt-editor ${className}` }} rootClassName="aag-editor-drawer" keyboard={false} styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 } }} title={title} open placement="right" size="min(560px, 100vw)" destroyOnHidden onClose={close}>
          {children}
        </Drawer>);
    }
    const picker = className.split(/\s+/u).includes('agt-picker');
    return (<Modal className={`agt-dialog ${className}`} title={title} open zIndex={1200} keyboard={false} width="min(760px, calc(100vw - 32px))" footer={null} destroyOnHidden styles={{ body: { display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 160px)', overflow: picker ? 'hidden' : 'auto' } }} onCancel={close}>
      {children}
    </Modal>);
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

    return (<List className="agt-member-list" grid={{ gutter: 16, column: 2 }} dataSource={[...team.members]} rowKey={(member) => member.expertSlug} renderItem={(member) => {
            const expert = experts.find((e) => e.slug === member.expertSlug);
            return (<List.Item>
              <List.Item.Meta avatar={<Avatar expert={expert} size={40}/>} title={(locale === 'en' ? expert?.nameEn : expert?.name) ?? tx("成员已失效")} description={member.duty}/>
            </List.Item>);
        }}/>);
}
export const teamIssue = (team: ExpertTeam, experts: readonly ExpertSummary[], enabled: readonly string[]): string | undefined => {
    if (team.members.some((m) => !experts.some((e) => e.slug === m.expertSlug && !e.conflict)))
        return "成员失效，需替换";
    if (team.members.some((m) => !enabled.includes(m.expertSlug)))
        return "有成员未启用";
    return undefined;
};
