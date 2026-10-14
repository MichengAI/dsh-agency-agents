## 中文说明

- 支持 DSH `0.2.1-alpha.3`，继续兼容既有已支持版本；开发依赖中的 `@deepseek-ai/dsh*` 对齐宿主 `0.2.1-alpha.3`，Cordis 对齐 `4.0.5-alpha.2`。
- 从开发依赖中移除宿主已删除的 `@deepseek-ai/dsh-invariants`（自 alpha.1 起不再提供）。
- 适配子 Agent 破坏性变更：DSH 0.2.1-alpha.3+ 已移除启动期 `persona` / `toolFilter`；改走 `startActivation`（`delivery: 'caller'`），并在子 Agent `agent/created` 时以 scoped persona 与 `tools.restrict` 恢复专家人格与委派工具黑名单。仍提供 `ctx.subagents.start` 的旧宿主保持原启动期字段。
- Agent Team 仍通过 `sendMessage` 直投。

---

## English

- Support DSH `0.2.1-alpha.3` while retaining all existing supported versions; pin development `@deepseek-ai/dsh*` dependencies to host `0.2.1-alpha.3` and Cordis to `4.0.5-alpha.2`.
- Drop removed host package `@deepseek-ai/dsh-invariants` from development dependencies (gone since alpha.1).
- Adapt the subagent breaking change: start-time `persona` / `toolFilter` are gone on DSH 0.2.1-alpha.3+; use `startActivation` with `delivery: 'caller'`, and restore expert persona plus delegated-tool denylist on the child's `agent/created` via a scoped persona section and `tools.restrict`. Older hosts that still expose `ctx.subagents.start` keep the previous start-time fields.
- Agent Team continues to use `sendMessage` direct delivery.
