## 中文说明

本补丁已准备发行，实际发布状态以 npm 和 GitHub Releases 为准。

- 提示词回退改为稳定错误码，仅译文文件不存在时回退英文；读取失败不再被误判为缺少译文。
- 补齐更新器错误及请求拒绝的国际化，去重包文件清单，发布检查新增 README 版本一致性校验。
- 使用真实 DSH 工具注册器和面向模型的提示组装验证语言切换，并通过本机安装的 0.1.6-alpha.2 运行时验证；不代表真实模型质量或历史宿主矩阵验收。

- 图标改用 ESM 入口，仅打包实际引用的图标；图标包移至开发依赖。发布检查新增客户端体积、整库误打包及图标运行时外部引用护栏。
- 保存并启用或启用专家团时，保留原始专家启用记录，包括暂时冲突或不可用的专家；继续使用修订号校验与原子写入。
- 标签输入保留分隔符，保存时解析；标签和自定义主理人提示词超限时明确指出字段并聚焦。切换语言及冲突核对保留标签草稿。
- 补齐团队服务、递归委派门禁及专家提示词错误的国际化；已注册团队工具及参数说明跟随宿主语言变化。
- 失败委派报告移除已成功删除的任务编号，清理失败时保留编号供排查；旧版远程服务不注册不可用的团队候选源，恢复专家名称冲突悬停提示。
- 清理编辑分区死参数、无用样式及重复注入；完善异步、成员上限、国际化和浏览器回归测试，使用真实更新弹窗并从名册推导测试数量。
- 中英文 README 更新专家列表、专家团列表、团队详情及原生 Agent Team 面板截图。

---

## English

This patch is prepared for release; publication is confirmed only by npm and GitHub Releases.

- Replace translated-message comparisons with stable persona error codes. Fall back to the English persona only when the translated file is absent, not when reading it fails.
- Localize updater errors and request rejections, remove duplicate package file entries, and validate README version consistency before release.
- Verify language switching through the real DSH tool registry and model-facing prompt assembly, including the locally installed 0.1.6-alpha.2 runtime. This does not claim live model quality or historical-host matrix acceptance.

- Bundle only the referenced Tabler icons through the ESM entry and move the icon package to development dependencies. Add release checks for client size, accidental full-library bundling, and external icon imports.
- Preserve raw expert enablement records when saving or enabling a team, including temporarily conflicting or unavailable experts. Keep revision checks and atomic writes.
- Preserve separators while typing tags; validate tags and custom coordinator prompts with actionable field errors and focus. Keep unsaved tag input through language changes and conflict review.
- Localize team service, delegation guard, and expert prompt errors. Refresh registered team tool descriptions and parameter descriptions with the host language.
- Remove deleted task IDs from failed dispatch reports while retaining IDs when cleanup fails. Guard team mention registration on older remote services and restore expert conflict tooltips.
- Remove unused editor section parameters, unused styles, and duplicate team style injection. Strengthen asynchronous, member-limit, locale, and browser regression tests; exercise the real update dialog and derive fixture counts from the roster.
- Refresh both README screenshot galleries with the expert list, team list, team details, and native Agent Team panel.
