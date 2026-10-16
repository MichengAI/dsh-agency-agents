## 中文说明

- 全面接入宿主官方 `@deepseek-ai/dsh-client-ui-primitives` 原生 `Menu` 与 `Button` 原语，彻底移除 Ant Design Select 依赖及自绘下拉逻辑。
- 卡片、弹窗和控件改用宿主圆角阶梯与语义背景变量，毛玻璃主题下不再被硬编码实心色挡住。
- 下拉浮层全面采用原生半透明毛玻璃材质（`blur(16px)` / `blur(20px)`）、细腻发丝线边框与柔和投影，对齐插件市场官方质感。
- 专家与专家团卡片底部操作栏收敛为 32px 紧凑高度，全面升级为纯矢量图标按钮（查看、复制并自定义、编辑、删除），并移除冗余的独立复制提示词按钮。
- 卡片分类采用轻量微胶囊徽标（Badge Pill）承托，重构标题流式排版彻底消除单行短名称下方的空白断层。
- 二次确认弹窗全面对齐轻量 Outline 红色发丝线描边规范，优化说明文案消除标题复读。
- 确认弹窗按钮恢复可见的键盘焦点环；删除、放弃按钮悬停时保持红色，不再变成灰底。

---

## English

- Adopt official host `@deepseek-ai/dsh-client-ui-primitives` `Menu` and `Button` primitives, completely eliminating custom select/dropdown logic and Ant Design Select dependencies.
- Cards, dialogs, and controls use the host radius scale and semantic background tokens, so frosted-glass themes are no longer blocked by hardcoded solid fills.
- Elevate dropdown visual fidelity with native frosted glass (`blur(16px)` / `blur(20px)`), prominent shadows, and fine hairline borders.
- Streamline card action footer into compact 32px height with icon-only controls (View, Copy & Customize, Edit, Delete), eliminating visual clutter and redundant prompt copy actions.
- Wrap card division categories in refined pill badges and eliminate vertical empty holes on single-line titles.
- Unify confirmation modal button styling with lightweight hairline outline danger feedback and enhanced dialog copy.
- Keep a visible keyboard focus ring on confirmation dialog buttons, and keep delete or discard buttons red on hover.
