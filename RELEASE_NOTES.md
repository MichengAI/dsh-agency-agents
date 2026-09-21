## 中文说明

从 0.1.44 升级到首个 1.0 正式版本，将单专家助手扩展为可配置的专家团协作。保留原安装包名、321 位基础专家、22 个分区和既有个人专家功能；以下为本轮完整变更。

### 保留的单专家能力与工具接口

- 321 位内置专家、22 个分区；查看与复制专家提示词，按分类、状态与中英文关键词筛选，启停后通过聊天工具栏或 @ 选择。
- 最多 200 位自定义专家，支持新建、复制、头像与召唤 Emoji、编辑、保存并启用、停用和永久删除；名称冲突与多窗口修订检查继续生效。
- 保留 list_experts、summon_expert、summon_experts；新增 list_expert_teams、get_expert_team、summon_expert_team，支持先读取团队规则再调用与汇总。
- 保留设置页版本展示、检查更新与更新反馈，以及可信外部 root、provider、divisions、maxDepth 配置。界面不新增“外部”来源页签。
### 五个内置专家团与自定义团队

- 新增产品方案评审团、技术方案评审团、内容选题策划团、数据分析诊断团和专题研究专家团。每团提供三位成员的独立职责、共同目标、交付要求、任务示例和专用主理人模板。
- 支持创建自定义团、复制内置团后修改、查看详情、编辑、启用、停用和删除；每团 2～8 位不重复专家，最多 100 个自定义团。
- 可配置团队名称、简介、最多三个标签、成员分工与补充指令、共同目标、约束、交付要求和 1～3 条示例；主理人正文最多 12000 字符。
- 主理人可使用团队模板、自定义提示词或恢复模板；规则涵盖准备、分工、证据核验、分歧处理、异常说明与最终交付。主理人由当前主会话承担，不额外创建团长子代理。
- 启用团队时确认并同步启用所需专家；停用或删除团队不连带停用成员，也不删除历史会话。

### 专家与专家团统一管理

- 在原「设置 → 专家」内新增下划线「专家团」页签，共用标题、版本及链接；保留专家的全部／内置／自定义来源选项、分类、状态和搜索。
- 切换页签保留专家筛选状态；数量显示在页签右侧，来源选项与新建、刷新同行。团队支持相同的来源与状态筛选、搜索、空态、刷新和更多菜单。
- 复用卡片、编辑抽屉、保存底栏、提示词预览及确认弹窗；删除和未保存离开均需确认。多窗口修订冲突保留草稿，核对最新配置后再保存，已删除专家可作为新专家继续。
- 卡片去掉重复来源标识，扩充五团用途描述；团队简介按内容展开，避免英文截断，底部操作保持紧凑。
- 对照归档插件统一按钮、输入、下拉菜单和焦点状态：紧凑控件、统一圆角、官方主题背景与边框。启用开关为绿色，停用为灰色，保留文字状态，适配深浅主题与窄屏。

### 聊天选择、示例与草稿保护

- 聊天「专家」入口支持切换专家团，搜索、查看详情、启用并选择；@ 支持专家团原生引用，显示当前语言的简短名称。
- 选择团队或示例只更新草稿，不自动发送。原有正文、附件及引用受到保护；替换团队或追加示例通过主题弹窗确认。
- 异步确认后核对草稿修订；期间输入发生变化则停止插入并提示重新选择，避免覆盖新内容。
- 保留个人专家全名册搜索、未启用专家的启用选择、八位代表性专家的双语任务示例、冲突提示和失败重试行为。

### 普通子代理与原生 Agent Team

- 分别检测宿主是否支持 Agent Team、功能与当前 Agent 作用域工具是否可用；不修改用户的宿主配置。
- 不支持时使用普通子代理；支持但未启用时建议开启并继续普通调用；服务和工具就绪后使用原生 Agent Team。显式配置 maxDepth 时继续普通模式以维持深度约束。
- 普通模式一次并行分析，最多四位专家同时运行；执行前冻结团队、成员与任务配置，防止运行中编辑改变分工。
- 原生模式接入成员、共享任务板、任务领取、消息回传和异步等待；空闲或离线的同团同专家可复用，忙碌或失败成员不重复派发。
- 原生委派接受仅表示任务启动；主会话等待本次任务的真实成员结果后核验汇总，不把启动确认当作专家意见。中途失败不自动切换普通模式，避免重复执行。
- 两种模式的新子会话使用本地化专家名。原生成员卡片适配显示名，同时保留稳定技术标识、消息路由与队友复用；不改写旧普通会话标题或宿主模型标签。

### 协作质量与异常处理

- 五团分别使用任务简报、职责边界、结构化成员回报、主理人核验清单和交接规则，合并重复发现并呈现证据、分歧与待确认事项。
- 普通模式返回职责覆盖与成员成功／失败信息，部分失败保留已完成结果；身份读取异常单独报告，空白结果不视为成功，不自动追加模型轮次或重试。
- 取消后不启动排队任务，等待在途启动收敛并中断本次原生成员；清理失败明确反馈。
- 保留子会话工具隔离和递归门禁，专家不继续召唤专家或组建新一轮团队。

### 完整双语、文档与发布材料

- 补齐团队列表、详情、编辑、确认、错误、工具说明、运行提示，以及五团名称、简介、标签、成员职责、示例和主理人规则的中英文。
- 切换语言保留自定义内容与未保存草稿；仅系统预设参与本地化，内置团中英文名称均参与冲突校验，稳定 ID 不变。
- 重制中文与英文 3:1 WebP 横幅，不带版本号；移除 README 的 Node 徽章，改为 DSH 支持版本徽章。重写双语功能说明与升级边界。
- 版本基线提升至 1.0.0，双语发行说明由对应更新日志自动生成，避免功能清单不同步。

- 编译产物 `lib` 不再提交到 GitHub，由发布门禁构建并作为已验证产物交给 npm 发布任务；npm 包保留运行所需的 `lib`。

### 升级、兼容与验证边界

- 仍支持 DSH 0.1.0-rc.8、0.1.1-rc.2、0.1.2-rc.1、0.1.5-rc.1、0.1.5-rc.2、0.1.6-alpha.1 和 0.1.6-alpha.2；不表示其间所有版本或未来版本均已验证。原生 Team 还取决于实际安装与启用状态。
- 原有专家启用状态与自定义专家保存在宿主 agency-agents 设置命名空间；新团队配置使用同一命名空间，无需搬迁专家文件。回退旧插件前备份设置，旧版不具备团队功能，不能保证旧版写入保留团队字段。
- 工程回归基线为 199 项单元／宿主集成测试和 40 项浏览器测试通过，包含按需视觉验收；修正旧视觉夹具缺少主题却仍通过的问题。类型检查、构建与包验证通过。
- 浏览器使用真实组件与模拟 Remote，模型 provider 使用替身；不等于真实模型汇总质量或全部宿主版本的端到端验收。原生 Team 的模型标签由宿主提供，可能仍显示创建时的模型。

---

## English

The first 1.0 release expands individual specialists into configurable expert-team collaboration. It retains the package name, 321 bundled specialists, 22 divisions, and existing individual-expert workflows. The following covers the changes since 0.1.44.

### Retained individual-expert capabilities and tools

- Retain 321 bundled experts across 22 divisions, prompt viewing/copying, category/status/localized keyword filters, enablement, and selection through the composer or @.
- Retain up to 200 custom experts with creation, copying, avatars and summon emoji, editing, save-and-enable, disabling, and permanent deletion; preserve name-conflict and concurrent-revision checks.
- Keep list_experts, summon_expert, and summon_experts; add list_expert_teams, get_expert_team, and summon_expert_team for reading team rules before delegation and final synthesis.
- Preserve the settings version display, update checking/feedback, and trusted external root, provider, divisions, and maxDepth configuration. Do not add an External source tab.
### Five built-in teams and custom teams

- Add Product Review Team, Technical Review Team, Content Planning Team, Data Analysis Team, and Research Team. Each includes three independent expert roles, a shared goal, delivery requirements, task examples, and a dedicated coordinator template.
- Create custom teams, copy built-in teams, inspect details, edit, enable, disable, and delete. Each team contains 2–8 distinct experts; up to 100 custom teams are supported.
- Configure a name, description, up to three tags, member duties and instructions, shared goal, constraints, delivery requirements, and 1–3 examples. Custom coordinator prompts allow up to 12,000 characters.
- Use the team coordinator template, customize it, or restore it. Rules cover preparation, delegation, evidence checks, disagreements, failures, and final delivery. The existing main conversation coordinates; no extra leader subagent is created.
- Confirm and enable required experts when enabling a team. Disabling or deleting a team does not disable its members or delete historical conversations.

### Unified expert and team management

- Add an underlined Expert teams tab inside Settings → Experts, sharing the title, version, and links. Preserve individual experts' All/Built-in/Custom source filters, categories, status, and search.
- Preserve expert filters across tab switches. Place counts at the right of the tabs, with source filters and create/refresh actions on one row. Teams gain equivalent source/status filters, search, empty states, refresh, and more menus.
- Share cards, editor drawers, save footers, prompt previews, and confirmation dialogs. Confirm deletion and discarding unsaved changes. Retain drafts on revision conflicts, review current settings before saving, and allow deleted experts to continue as new experts.
- Remove redundant source badges and expand all five team descriptions. Team descriptions grow with their content to avoid truncating English, while card actions remain compact.
- Align buttons, inputs, dropdowns, and focus states with Archive Manager using compact sizing and official theme backgrounds/borders. Enabled switches are green, disabled switches gray, with text labels; support dark/light themes and narrow layouts.

### Chat selection, examples, and draft protection

- Switch to teams in the Experts composer picker, search, inspect details, enable, and select. The @ picker supports native team references with short localized names.
- Selecting a team or example updates the draft without sending it. Protect existing text, attachments, and references; confirm team replacement or example insertion in a themed dialog.
- Recheck the draft revision after asynchronous confirmation. If the draft changed meanwhile, stop insertion and ask the user to select again rather than overwriting new input.
- Preserve full-roster individual-expert search, enable-and-select, bilingual examples for eight representative specialists, conflict feedback, and retry behavior.

### Ordinary subagents and native Agent Team

- Check host capability separately from service enablement and tool availability in the current Agent scope, without modifying host settings.
- Use ordinary subagents when unsupported. Recommend enabling Team when supported but disabled, while allowing ordinary execution. Use native Agent Team when services and tools are ready. Explicit maxDepth continues through ordinary mode to enforce depth limits.
- Ordinary mode performs one parallel analysis with up to four concurrent experts. Freeze team, member, and task settings before execution so later edits cannot change the running assignment.
- Native mode integrates members, shared tasks, task claiming, result messages, and asynchronous waiting. Reuse idle or offline members for the same team/expert; do not redispatch busy or failed members.
- Accepted native dispatch means started, not completed. The main conversation waits for actual results for the current tasks before verifying and summarizing. Mid-dispatch failures do not automatically switch to ordinary mode and duplicate work.
- Localize new child-session expert names in both modes. Adapt native roster display names while retaining stable identities, message routing, and reuse. Do not rewrite old ordinary-session titles or host model labels.

### Collaboration quality and failure handling

- Provide team-specific briefs, role boundaries, structured member reports, coordinator checklists, and handoff rules. Consolidate duplicate findings while preserving evidence, disagreements, and open questions.
- Ordinary mode reports responsibility coverage and member success/failure, preserving completed results when others fail. Isolate persona-read failures, reject empty results, and do not automatically add model rounds or retries.
- Cancellation prevents queued work from starting, settles in-flight launches, and interrupts native members started by this invocation. Report cleanup failures explicitly.
- Preserve child-tool isolation and recursion guards; experts cannot summon more experts or start another team round.

### Complete localization, documentation, and release assets

- Complete Chinese/English UI, details, editors, confirmations, errors, tool descriptions, and runtime feedback, plus all five teams' names, descriptions, tags, duties, examples, and coordinator rules.
- Language changes preserve custom content and unsaved drafts. Only system presets are localized; both built-in Chinese and English names participate in collision checks, and stable IDs remain unchanged.
- Regenerate separate Chinese and English 3:1 WebP banners without version numbers. Replace the Node README badge with supported DSH versions, and refresh bilingual feature and upgrade documentation.
- Set the version baseline to 1.0.0. Generate bilingual release notes from the matching changelog entries to keep feature lists aligned.

- Stop tracking compiled `lib` in Git. The release gate builds and transfers verified artifacts to npm publishing; npm packages retain the runtime `lib` files.

### Upgrade, compatibility, and validation limits

- Retain support for DSH 0.1.0-rc.8, 0.1.1-rc.2, 0.1.2-rc.1, 0.1.5-rc.1, 0.1.5-rc.2, 0.1.6-alpha.1, and 0.1.6-alpha.2. This does not claim coverage of every intervening or future version. Native Team also depends on installation and enablement.
- Existing expert enablement and custom experts remain in the host agency-agents settings namespace; team settings use that namespace too. No expert-file migration is required. Back up settings before downgrading: old versions lack teams and may not preserve team fields on writes.
- The engineering regression baseline passes 199 unit/host-integration tests and 40 browser tests, including opt-in visual validation. Fix the old visual fixture that passed despite missing theme variables. Type checks, builds, and package validation pass.
- Browser tests use real components with mocked Remote services, and model providers are test doubles. These results do not validate real-model summary quality or every supported host end to end. Native model labels remain host-owned and may show creation-time models.
