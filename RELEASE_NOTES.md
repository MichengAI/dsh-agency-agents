## 中文说明

### 体验优化

- 支持 DSH 0.1.7-alpha.1，并保留此前已支持的版本。专家和专家团设置跟随宿主的实时配置；若旧数据留在 `settings.yaml.imported`，会在配置仍为空时补写一次。
- 专家和专家团的选择菜单改为显示头像。新建自定义专家不再要求填写召唤图标。
- 专家团列表会缓存，并在聊天菜单和设置页之间保持同步。
- 设置页改用宿主的按钮、开关、菜单和页签。专家与专家团的数量写在页签上，启用开关保持绿色。更早的宿主如果没有对应组件，会使用同款的本地实现。

### 问题修复

- 菜单同时使用宿主的半透明底色和背景模糊，背后的文字不再透出来。
- 是否仍使用旧设置接口，改为看当前宿主，而不是本包里可能更旧的依赖。

---

## English

### Improvements

- Support DSH 0.1.7-alpha.1 while keeping previously supported versions. Expert and team settings follow the host's live configuration, and a one-time import recovers data left in `settings.yaml.imported`.
- Expert and team pickers show avatars. Custom experts no longer ask for a summon emoji.
- Team lists stay cached and update across the composer and settings when a team changes.
- Settings use the host's buttons, switches, menus, and tabs. Expert and team counts sit on those tabs, and the enable switch stays green. Hosts older than the tab or switch components get a local copy of the same control.

### Fixes

- Menus use the host's translucent surface together with its backdrop blur, so text behind them is not readable through the panel.
- Detect the legacy settings API from the running host, not from this package's own older dependency.
