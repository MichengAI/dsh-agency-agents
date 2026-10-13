## 中文说明

- 原生团队成员卡片会显示专家的本地化名称，并兼容宿主当前和上一版卡片结构。任务标题和 Owner 标识保持原样。
- lead 卡片会在任务标题与专家团名称精确匹配时显示该团队名。无法匹配或对应多个团队时，仍显示 `lead`。
- 停止父会话时，本插件启动的子代理会立即结束，不再等到子代理自己跑完。
- 兼容宿主新的子代理启动接口，同时保留旧接口。

---

## English

- Native team member cards show each expert's localized name on both the current and previous host card layouts. Task titles and owner identifiers stay unchanged.
- The lead card shows the expert team name when a task title exactly matches that team. If the match is missing or ambiguous, the card stays `lead`.
- Stopping the parent session now stops subagents started by this plugin instead of waiting for them to finish.
- The plugin supports the host's newer subagent start API and still works with the previous API.


