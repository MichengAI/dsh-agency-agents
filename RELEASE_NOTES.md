## 中文说明

### 体验优化

- 支持 DSH 0.1.7-alpha.1，并保留此前已支持的版本。专家和专家团设置跟随宿主的实时配置；若旧数据留在 `settings.yaml.imported`，会在配置仍为空时补写一次。
- 专家和专家团的选择菜单改为显示头像。新建自定义专家不再要求填写召唤图标。
- 专家团列表会缓存，并在聊天菜单和设置页之间保持同步。
- 设置页控件改为随插件打包的 Ant Design。亮暗跟随宿主，按钮主色保持 Ant Design 默认蓝。专家与专家团的数量写在页签上。聊天入口仍是原来的工具栏按钮。客户端因此超过 1 MB；发布包会压缩，校验上限为 1.5 MB。
- 专家团卡片不再提供「复制提示词」。团队提示词只在详情里查看，不能单独复制到剪贴板。

### 问题修复

- 菜单同时使用宿主的半透明底色和背景模糊，背后的文字不再透出来。
- 是否仍使用旧设置接口，改为看当前宿主，而不是本包里可能更旧的依赖。

---

## English

### Improvements

- Support DSH 0.1.7-alpha.1 while keeping previously supported versions. Expert and team settings follow the host's live configuration, and a one-time import recovers data left in `settings.yaml.imported`.
- Expert and team pickers show avatars. Custom experts no longer ask for a summon emoji.
- Team lists stay cached and update across the composer and settings when a team changes.
- Settings controls now use Ant Design bundled with the plugin. Light and dark follow the host. Buttons keep Ant Design's default blue. Expert and team counts sit on the tabs. The chat entry stays the original toolbar button. The client bundle is therefore larger than 1 MB; the published file is minified, and the check allows up to 1.5 MB.
- Team cards no longer offer “Copy prompt”. The coordinator prompt stays in team details and is not copied to the clipboard.

### Fixes

- Menus use the host's translucent surface together with its backdrop blur, so text behind them is not readable through the panel.
- Detect the legacy settings API from the running host, not from this package's own older dependency.
