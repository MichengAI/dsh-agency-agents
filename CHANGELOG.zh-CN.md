# 更新日志

[English](CHANGELOG.md)

以下记录最近发布的五个版本。

## 0.1.25 — 2026-09-01

- 修复 DSH `0.1.2-alpha.3` 将候选 `icon` 限制为内置引用图标名称后，专家 emoji 消失的问题。
- 将 emoji 合并到可见候选名称，并在选中时通过 slug 还原纯专家名，确保召唤指令保持不变。
- 新增中英文候选名称、纯专家名还原和未知专家回退行为的回归测试。

发布包：[`@michengai/dsh-agency-agents@0.1.25`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.25)。

## 0.1.24 — 2026-09-01

- 修复中文界面中 `@` 专家菜单分组标题显示 `division.design`、`division.engineering` 等原始英文键的问题。
- 修复 Windows 下专家 emoji 图标只占位但不可见的问题，为专家菜单定向补充彩色 emoji 字体栈。
- 分组标题现在跟随界面语言显示，并在语言切换后自动刷新；新增中英文与未知分区回退测试。

发布包：[`@michengai/dsh-agency-agents@0.1.24`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.24)。

## 0.1.23 — 2026-08-31

- 新增 DSH 设置 API 兼容适配层，同时兼容旧 RC 运行时与 `@deepseek-ai/dsh@0.1.2-alpha.2`。
- 新增两种设置 API 形态的回归测试，并重新构建发布产物。

发布包：[`@michengai/dsh-agency-agents@0.1.23`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.23)。

## 0.1.22 — 2026-08-28

- 在 README 标准头部导航中加入更新日志入口，位置位于语言切换与 Apache-2.0 许可证链接之间。

发布包：[`@michengai/dsh-agency-agents@0.1.22`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.22)。

## 0.1.21 — 2026-08-23

- 新增中英文更新日志，展示最近五个发布版本。
- 在中英文 README 中加入更新日志入口，并将日志纳入 npm 包。

发布包：[`@michengai/dsh-agency-agents@0.1.21`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.21)。
