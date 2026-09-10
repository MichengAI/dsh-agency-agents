import React from "react";

/** 原生预览弹窗约束焦点，并让 Escape 只关闭当前层。 */
export function PromptDialog(props: {
  readonly value: { name: string; prompt: string };
  readonly title: string;
  readonly closeLabel: string;
  readonly returnFocus: HTMLElement;
  readonly onClose: () => void;
}): React.ReactElement {
  const dialog = React.useRef<HTMLDialogElement | null>(null);
  React.useEffect(() => {
    const node = dialog.current;
    // 异步读取和 autoFocus 会改变 activeElement，恢复目标由打开按钮提供。
    const previous = props.returnFocus;
    node?.showModal();
    return () => {
      node?.close();
      if (previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [props.returnFocus]);
  return React.createElement("dialog", {
    ref: dialog,
    className: "aag-prompt-modal",
    role: "dialog",
    "aria-modal": true,
    "aria-label": props.title,
    onCancel: (event: React.SyntheticEvent) => {
      event.preventDefault(); event.stopPropagation(); props.onClose();
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault(); event.stopPropagation(); props.onClose();
    },
    onMouseDown: (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) props.onClose();
    },
  },
    React.createElement("div", { className: "aag-modal-head" },
      React.createElement("h3", { className: "aag-modal-title" }, props.title),
      React.createElement("button", { type: "button", className: "aag-modal-close", autoFocus: true, onClick: props.onClose }, props.closeLabel),
    ),
    React.createElement("pre", { className: "aag-prompt-content" }, props.value.prompt),
  );
}
