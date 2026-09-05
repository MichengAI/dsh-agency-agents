<div align="center">
  <img src="assets/branding/banner.png" alt="DSH Agency Agents" width="100%">
</div>

<div align="center">

  # DSH Agency Agents

  **为 DeepSeek Harness 提供 321 名可召唤的专业智能体**

  [English](README.md) · [专家列表](#专家列表) · [安装](#安装) · [更新日志](CHANGELOG.zh-CN.md) · [Apache-2.0](LICENSE)

  [![许可证：Apache-2.0](https://img.shields.io/badge/许可证-Apache--2.0-blue.svg)](LICENSE)
  [![内置智能体](https://img.shields.io/badge/内置智能体-321-0f766e.svg)](#专家列表)
  [![npm package](https://img.shields.io/npm/v/%40michengai%2Fdsh-agency-agents.svg?label=npm%20package)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![npm 下载量](https://img.shields.io/npm/dt/%40michengai%2Fdsh-agency-agents.svg?label=npm%20%E4%B8%8B%E8%BD%BD%E9%87%8F)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/MichengAI/dsh-agency-agents)
  [![Node.js 22 or later](https://img.shields.io/badge/Node.js-22%20or%20later-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
</div>

> DSH Agency Agents 是社区维护的 DeepSeek Harness（DSH）插件，并非 DeepSeek AI 官方产品。

## 功能概览

- 在「设置 → 专家」中按分类筛选或搜索，再启用或停用内置专家。
- 在输入框的「专家」中按当前语言的名称召唤已启用的专家处理完整任务。
- 提供 `list_experts` 与 `summon_expert` 工具，分别用于发现专家和启动一次性子代理。
- 内置 321 份 persona，无需额外下载；也可接入自行同步的专家目录。
- 可把一句话复制到 DSH、Codex 或 WorkBuddy，让对方代装到本机 DSH。

主会话保留任务上下文、判断和最终交付；专家子代理只提供专业视角，不能继续召唤专家，避免递归委派。

## 界面预览

在「设置 → 专家」中按分类筛选或搜索，再启用需要的专家：

![DSH 专家面板](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/agent-roster.png)

在输入框用 `@` 或「专家」选择已启用的专家：

![专家选择器](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/expert-picker.png)

回填当前语言的专家名称标签后，写出完整任务：

![召唤专家的输入方式](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/summon-prompt.png)

## DSH 产品生态

本产品既可以独立安装，也可以随桌面端或 Web 套件一起使用。它们共享同一个 DSH 核心，但面向不同的使用方式：

| 产品 | 与本产品的关系 |
| --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | 本产品的运行宿主，提供模型、会话、工具和插件系统 |
| [DSH Codex Desktop](https://github.com/MichengAI/dsh-codex-desktop) | 下载安装即用的桌面产品，已内置本产品和其他 5 个功能产品 |
| 6 个功能产品 | [Codex UI](https://github.com/MichengAI/dsh-codex-ui) · [IM Connect](https://github.com/MichengAI/dsh-im-connect) · [Automation](https://github.com/MichengAI/dsh-automation) · [Skills Manager](https://github.com/MichengAI/dsh-skills-manager) · [Archive Manager](https://github.com/MichengAI/dsh-archive-manager) · [Agency Agents](https://github.com/MichengAI/dsh-agency-agents) |

## 前置条件

- 已可正常运行 DeepSeek Harness Web，且可在 PowerShell 中使用 `dsh`。
- 以下示例使用 `web` profile；请替换为实际目标 profile。
- 从源码安装或二次开发需要 Node.js 22+ 与 pnpm；仅从 npm 安装无需单独执行 `pnpm install`。

## 安装

`dsh plugin add` 会转发到 profile 目录里的 `pnpm add`。不写版本、不指定官方源时，本机镜像和最短发布间隔可能让你停在旧版。

### 交给其他 Agent 一句话安装

本插件运行在 DeepSeek Harness Web 里。把下面其中一句复制到 DSH、Codex 或 WorkBuddy，让它代你安装到本机 `web` profile。

从 npm 安装：

```text
请把 DSH 插件 @michengai/dsh-agency-agents 最新版装进本机 web profile，使用官方 npm 源执行：dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/。装完执行 dsh --profile web --dump-config，确认已挂载 agency-agents，并提醒我重启 DSH Web 后硬刷新浏览器。
```

从源码安装：

```text
请从源码安装 DSH 插件 https://github.com/MichengAI/dsh-agency-agents：克隆到本机后执行 pnpm install --frozen-lockfile 和 pnpm build，再用 dsh plugin --profile web add . 把当前目录装进 web profile。不要只复制 lib。装完执行 dsh --profile web --dump-config，确认已挂载 agency-agents，并提醒我重启 DSH Web 后硬刷新浏览器。
```

| 产品 | 怎么用 |
| --- | --- |
| DSH | 把上面其中一句发给当前会话。 |
| Codex | 把上面其中一句发给 Codex，让它在本机执行安装。 |
| WorkBuddy | 把上面其中一句发给 WorkBuddy；源码安装也可同时粘贴仓库地址 `https://github.com/MichengAI/dsh-agency-agents`。 |

Codex 和 WorkBuddy 只负责代装；装好后仍要打开 DSH Web 使用「设置 → 专家」。

也可以自己执行同一条 npm 命令：

```powershell
dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/
```

未把 `dsh` 装进 PATH 时，把开头的 `dsh` 换成 `npx --yes @deepseek-ai/dsh`。

### 从官方 npm 安装最新版

在任意 PowerShell 目录执行：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

需要钉死某一版时，把 `@latest` 换成具体版本，例如 `@0.1.17`。

配置输出中应包含 `agency-agents` 与 `agency-agents-remote`。安装后重启 DSH Web 并在浏览器硬刷新；请勿手工复制客户端文件，否则设置页所需的 Remote 服务不会被挂载。

### 从源码安装

适用于调试或使用未发布改动。克隆后的本地路径就是插件安装路径：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location D:\Repository\deepseek-harness-plugin
git clone https://github.com/MichengAI/dsh-agency-agents.git
Set-Location .\dsh-agency-agents
pnpm install --frozen-lockfile
pnpm build
dsh plugin --profile web add .
dsh --profile web --dump-config
```

完成后重启 DSH Web 并硬刷新浏览器。`dsh plugin ... add .` 会读取当前目录的包信息和 `cordis.patch.yml`；不要改为直接复制 `lib` 目录。

## 使用

1. 打开「设置 → 专家」，启用需要的专家。
2. 在对话输入框用 `@` 或点击「专家」，选择已启用的专家。
3. 当前语言的专家名称会以短标签写入输入框；在其后补充完整任务。例如：

```text
代码审查工程师

审查当前工作区的改动，按严重程度列出可复现的问题。
```

也可由主会话先调用 `list_experts(division?)` 查找专家，再使用 `summon_expert(expert, task)` 按专家名称委派任务。内置名册会校验中英文名称唯一。

## 专家列表

内置 **321 名专家，覆盖 22 个分类**。点击专家名称查看中文角色定义；名称与「设置 → 专家」中的中文显示保持一致。

### 分类导航

| 分类 | 专家数 |
| --- | ---: |
| [学术](#experts-academic) | 7 |
| [公司经营](#experts-company) | 6 |
| [设计](#experts-design) | 11 |
| [工程](#experts-engineering) | 68 |
| [金融](#experts-finance) | 9 |
| [游戏开发](#experts-game-development) | 21 |
| [地理信息](#experts-gis) | 13 |
| [医疗健康](#experts-healthcare) | 3 |
| [人力资源](#experts-hr) | 2 |
| [法务](#experts-legal) | 2 |
| [市场营销](#experts-marketing) | 43 |
| [付费媒体](#experts-paid-media) | 7 |
| [产品](#experts-product) | 5 |
| [项目管理](#experts-project-management) | 7 |
| [研究](#experts-research) | 1 |
| [销售](#experts-sales) | 9 |
| [安全](#experts-security) | 12 |
| [空间计算](#experts-spatial-computing) | 6 |
| [专业](#experts-specialized) | 68 |
| [支持](#experts-support) | 7 |
| [供应链](#experts-supply-chain) | 4 |
| [测试](#experts-testing) | 10 |

<a id="experts-academic"></a>

### 学术

共 7 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [人类学家](assets/agency-agents-zh/academic/academic-anthropologist.md) | 开展田野调查与参与式观察，研究群体文化、亲属制度、仪式和信仰，撰写民族志报告，为跨文化业务提供文化背景判断。 |
| [地理学家](assets/agency-agents-zh/academic/academic-geographer.md) | 研究地形、气候、资源与人口分布的相互关系，做空间分析与制图，输出区域研究报告，支撑选址、规划和灾害风险评估。 |
| [历史学家](assets/agency-agents-zh/academic/academic-historian.md) | 查阅档案和一手文献，核查史实、梳理历史分期，撰写研究论著，为出版物、影视与公共叙事提供史实把关。 |
| [叙事学家](assets/agency-agents-zh/academic/academic-narratologist.md) | 分析故事结构、人物弧线与叙述视角，运用叙事理论评审小说和剧本，为创作提供结构设计与修改建议。 |
| [心理学家](assets/agency-agents-zh/academic/academic-psychologist.md) | 研究人的行为、人格、动机与认知规律，开展测评和访谈，输出行为分析结论，支撑产品设计与组织管理。 |
| [统计学家](assets/agency-agents-zh/academic/academic-statistician.md) | 设计实验方案，处理调查和试验数据，做统计推断与显著性检验，出具分析报告，区分真实信号与随机噪声。 |
| [学习规划师](assets/agency-agents-zh/academic/academic-study-planner.md) | 面向中国考生和终身学习者的个性化学习规划专家，精通考研、考公、司法考试、CPA 等重大考试的备考策略，擅长运用费曼学习法、艾宾浩斯遗忘曲线、番茄钟等科学方法，帮助学习者制定高效的学习计划并持续优化。 |

<a id="experts-company"></a>

### 公司经营

共 6 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [首席执行官（CEO）](assets/agency-agents-zh/company/chief-executive-officer.md) | 企业最高决策者，掌管战略方向、资源配置、组织节奏与对外叙事——在信息不完备时做出可逆性分级的决策，对结果负最终责任，把愿景翻译成组织能执行的优先级。 |
| [首席营销官（CMO）](assets/agency-agents-zh/company/chief-marketing-officer.md) | 增长与品牌最高负责人，掌管定位、渠道组合、营销预算与品牌资产——用可归因的数字管增长，用不可量化的耐心管品牌，绝不让两者互相冒充。 |
| [幕僚长（Chief of Staff）](assets/agency-agents-zh/company/chief-of-staff.md) | 创始人和高管的首席协调者——过滤噪音、掌控流程、确保一致性、路由决策、将产出定位到最大影响处，让老板能清晰思考。 |
| [首席运营官（COO）](assets/agency-agents-zh/company/chief-operating-officer.md) | 运营最高负责人，把战略翻译成流程、指标与执行节奏——消灭组织里的摩擦与例外，让正确的事成为默认发生的事，对"计划与现实的差距"负责。 |
| [首席产品官（CPO）](assets/agency-agents-zh/company/chief-product-officer.md) | 产品最高负责人，掌管产品战略、路线图取舍与产品组织——对"做什么、不做什么、按什么顺序做"负责，用用户价值与商业价值的交集裁决一切需求之争。 |
| [首席技术官（CTO）](assets/agency-agents-zh/company/chief-technology-officer.md) | 技术最高负责人，掌管技术路线、架构决策、研发组织与技术债务——在业务速度与工程质量之间做显式权衡，让技术成为业务的杠杆而不是瓶颈。 |

<a id="experts-design"></a>

### 设计

共 11 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [品牌视觉设计师](assets/agency-agents-zh/design/design-brand-guardian.md) | 负责品牌识别系统的开发与落地，统一各渠道的视觉规范，确保品牌形象在物料和产品中保持一致。 |
| [AI 图像设计师](assets/agency-agents-zh/design/design-image-prompt-engineer.md) | 为 AI 图像生成工具撰写提示词，把创意构想转成精确的视觉描述，产出专业级摄影与图像素材。 |
| [无障碍设计师](assets/agency-agents-zh/design/design-inclusive-visuals-specialist.md) | 排查并纠正 AI 生成内容中的刻板印象与偏见，产出文化准确、符合多元人群的图片和视频素材。 |
| [用户体验设计师](assets/agency-agents-zh/design/design-persona-walkthrough.md) | 按目标用户画像逐屏走查网页，记录每屏的情感与理性反应，输出带优化建议的转化率改进报告。 |
| [UI 设计师](assets/agency-agents-zh/design/design-ui-designer.md) | 搭建视觉设计系统和组件库，绘制符合品牌规范的界面，交付可复用的高保真设计稿。 |
| [UI 视觉验收设计师](assets/agency-agents-zh/design/design-ui-finish-gate-reviewer.md) | 依据设计契约对照线上界面逐项验收，在发布前拦截通用、雷同的界面，输出整改清单。 |
| [UX 架构师](assets/agency-agents-zh/design/design-ux-architect.md) | 为开发团队梳理信息架构与交互流程，制定 CSS 系统规范，输出可直接落地的界面实现指引。 |
| [UX 研究员](assets/agency-agents-zh/design/design-ux-researcher.md) | 开展用户访谈与可用性测试，分析行为数据，把发现整理成可执行的设计改进建议。 |
| [视频提示词工程师](assets/agency-agents-zh/design/design-video-prompt-engineer.md) | 精通 AI 文生视频提示词的专家，用 5 段式结构把一句创意写成可直接投喂 Sora / 可灵 / Veo / Seedance / MiniMax 的电影感提示词，含运镜、瑕疵、声音与负面提示词，并对“这条要花多少钱”负责。 |
| [视觉传达设计师](assets/agency-agents-zh/design/design-visual-storyteller.md) | 把复杂信息转成图表、插画与动态素材，用视觉语言讲清品牌故事，产出传播与发布用的设计内容。 |
| [创意设计师](assets/agency-agents-zh/design/design-whimsy-injector.md) | 在品牌触点中加入趣味与惊喜元素，设计让人记住的互动细节和活动物料，提升品牌辨识度。 |

<a id="experts-engineering"></a>

### 工程

共 68 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [AI 数据治理工程师](assets/agency-agents-zh/engineering/engineering-ai-data-remediation-engineer.md) | 负责检测并修复数据管道中的异常数据，用本地模型和聚类手段自动分类问题数据，保证修复过程零丢失。 |
| [AI 工程师](assets/agency-agents-zh/engineering/engineering-ai-engineer.md) | 负责机器学习模型的开发与部署，把模型接入生产系统，建设数据管线，交付可用的 AI 功能。 |
| [API 平台工程师](assets/agency-agents-zh/engineering/engineering-api-platform-engineer.md) | 负责对外 API 的设计与治理，制定 OpenAPI/gRPC 契约、版本与下线策略，维护网关鉴权和限流，输出 SDK 与开发者文档。 |
| [自动化优化架构师](assets/agency-agents-zh/engineering/engineering-autonomous-optimization-architect.md) | 负责给线上 API 做性能压测与调优，建立成本和安全护栏，防止系统因优化失控超支。 |
| [后端架构师](assets/agency-agents-zh/engineering/engineering-backend-architect.md) | 负责后端系统架构设计与技术选型，规划数据库、API 与云资源，保证服务稳定、安全、可扩展。 |
| [CMS 开发者](assets/agency-agents-zh/engineering/engineering-cms-developer.md) | 负责基于 Drupal 和 WordPress 开发主题、插件与内容结构，用代码方式搭建和维护 CMS 站点。 |
| [代码审查工程师](assets/agency-agents-zh/engineering/engineering-code-reviewer.md) | 负责审查代码的正确性、可维护性与安全性，给出可执行的修改意见，不纠结个人风格偏好。 |
| [工程效率工程师](assets/agency-agents-zh/engineering/engineering-codebase-onboarding-engineer.md) | 负责帮新同事快速上手陌生代码库，通过读源码、追调用链给出有据可查的代码说明。 |
| [数据工程师](assets/agency-agents-zh/engineering/engineering-data-engineer.md) | 负责搭建 ETL/ELT 数据管道和湖仓架构，用 Spark、dbt 等工具把原始数据加工成可用的分析数据。 |
| [数据可视化工程师](assets/agency-agents-zh/engineering/engineering-data-visualization-engineer.md) | 负责设计图表与数据可视化方案，按数据特点选图表类型，用 D3、Vega 实现交互图表并保证大数据量渲染流畅。 |
| [数据库性能工程师](assets/agency-agents-zh/engineering/engineering-database-optimizer.md) | 负责数据库表结构与索引设计，优化慢查询，调 PostgreSQL、MySQL 等数据库性能。 |
| [数据库可靠性工程师](assets/agency-agents-zh/engineering/engineering-database-reliability-engineer.md) | 负责数据库高可用与容灾，做主从复制、自动切换、备份恢复与无停机变更，保证数据不丢、服务不停。 |
| [桌面应用工程师](assets/agency-agents-zh/engineering/engineering-desktop-app-engineer.md) | 负责用 Electron 和 Tauri 开发桌面应用，处理进程隔离、签名公证、自动更新与系统原生集成。 |
| [开发者工具工程师](assets/agency-agents-zh/engineering/engineering-developer-tooling-engineer.md) | 负责开发命令行工具与内部研发平台，设计易用的命令交互、补全提示与跨平台分发，提升开发效率。 |
| [DevOps 自动化工程师](assets/agency-agents-zh/engineering/engineering-devops-automator.md) | 负责基础设施自动化与 CI/CD 流水线建设，维护云上环境的部署与日常运维。 |
| [钉钉集成开发工程师](assets/agency-agents-zh/engineering/engineering-dingtalk-integration-developer.md) | 专注钉钉开放平台全栈集成开发的工程专家，精通钉钉机器人、酷应用、审批流自动化、连接器低代码集成、钉钉小程序、宜搭平台对接及与阿里云生态的深度集成，擅长构建企业级协作与业务自动化解决方案。 |
| [Drupal 性能工程师](assets/agency-agents-zh/engineering/engineering-drupal-performance.md) | 负责 Drupal 站点性能优化，调缓存、BigPipe、Views 查询与 PHP-FPM 参数，让页面通过性能审计。 |
| [Drupal 购物车工程师](assets/agency-agents-zh/engineering/engineering-drupal-shopping-cart.md) | 负责用 Drupal Commerce 搭建商城，配置商品、支付网关、结算流程与促销规则，交付高可用的线上店铺。 |
| [邮件系统工程师](assets/agency-agents-zh/engineering/engineering-email-intelligence-engineer.md) | 负责从邮件往来中抽取结构化信息，把原始邮件整理成可供 AI 与自动化系统使用的数据。 |
| [嵌入式固件工程师](assets/agency-agents-zh/engineering/engineering-embedded-firmware-engineer.md) | 负责嵌入式设备固件开发，基于 ESP32、STM32 等平台编写裸机或 RTOS 程序，完成驱动与通信功能。 |
| [嵌入式 Linux 驱动工程师](assets/agency-agents-zh/engineering/engineering-embedded-linux-driver-engineer.md) | 嵌入式 Linux 内核驱动与 BSP 开发专家——精通 Linux 内核模块、设备树、Platform/I2C/SPI/USB 驱动框架、DMA、中断子系统、Yocto/Buildroot、U-Boot、交叉编译工具链。 |
| [飞书集成开发工程师](assets/agency-agents-zh/engineering/engineering-feishu-integration-developer.md) | 负责基于飞书开放平台做集成开发，实现机器人、审批流、多维表格与消息卡片，打通企业内部协作流程。 |
| [Filament 后台优化专家](assets/agency-agents-zh/engineering/engineering-filament-optimization-specialist.md) | 负责重构和优化 Filament 管理后台，调整页面结构与交互流程，提升后台易用性和操作效率。 |
| [FinOps 工程师](assets/agency-agents-zh/engineering/engineering-finops-engineer.md) | 负责云成本管控，做资源标签与费用拆分，优化实例规格和存储用量，建立成本看板跟踪支出。 |
| [FPGA/ASIC 数字设计工程师](assets/agency-agents-zh/engineering/engineering-fpga-digital-design-engineer.md) | FPGA 与 ASIC 数字前端设计专家——精通 Verilog/SystemVerilog、VHDL、Vivado/Quartus、AXI/AHB 总线、时序收敛、Zynq/Intel SoC FPGA、高层次综合（HLS）。 |
| [前端开发者](assets/agency-agents-zh/engineering/engineering-frontend-developer.md) | 负责 Web 前端开发，用 React、Vue 等框架实现页面与交互，处理兼容性和性能问题。 |
| [GaussDB 专家工程师](assets/agency-agents-zh/engineering/engineering-gaussdb-expert.md) | 负责 GaussDB OLTP 数据库的架构与调优，设计分布式表结构、优化查询和索引，保障集中式与分布式部署的性能。 |
| [Git 工作流工程师](assets/agency-agents-zh/engineering/engineering-git-workflow-master.md) | 负责制定和维护 Git 分支策略与提交规范，处理变基、工作树等协作流程，保证版本管理清晰可控。 |
| [国际化工程师](assets/agency-agents-zh/engineering/engineering-i18n-engineer.md) | 负责产品的国际化改造，处理多语言文案、复数规则、RTL 布局与本地化格式，搭建字符串提取和伪翻译测试流程。 |
| [身份与访问管理工程师](assets/agency-agents-zh/engineering/engineering-identity-access-engineer.md) | 负责身份认证与权限体系，实现 OAuth/OIDC 登录、企业 SSO、SCIM 同步和 RBAC/ABAC 权限模型。 |
| [故障应急工程师](assets/agency-agents-zh/engineering/engineering-incident-response-commander.md) | 负责线上故障应急指挥，组织排查与恢复，跟进事后复盘，维护 SLO/SLI 指标和值班机制。 |
| [物联网设备工程师](assets/agency-agents-zh/engineering/engineering-iot-fleet-engineer.md) | 负责物联网设备接入与运维，做设备注册、MQTT 数据采集、OTA 升级回滚和边缘计算，保证大规模设备稳定在线。 |
| [IoT 方案架构师](assets/agency-agents-zh/engineering/engineering-iot-solution-architect.md) | 物联网端到端方案设计专家——精通设备接入（MQTT/CoAP/LwM2M）、边缘计算、云平台（AWS IoT/Azure IoT/阿里云 IoT）、OTA、设备管理、数据管道和安全体系。 |
| [IT 服务经理](assets/agency-agents-zh/engineering/engineering-it-service-manager.md) | 负责 IT 服务流程管理，按 ITIL 规范建设服务目录、事件与变更流程，维护 SLA 和配置库，保证服务质量可衡量。 |
| [知识图谱工程师](assets/agency-agents-zh/engineering/engineering-knowledge-graph-engineer.md) | 将信息与能力建模为相互连接的实体和关系，支持动态上下文导航、模块化能力组合，并降低 token 成本与模型幻觉。 |
| [LLM 后训练工程师](assets/agency-agents-zh/engineering/engineering-llm-post-training-engineer.md) | 负责大模型后训练，做 SFT、偏好优化和强化学习微调，把控模型发布门槛，交付可上线的新版本。 |
| [机械设计工程师](assets/agency-agents-zh/engineering/engineering-mechanical-design-engineer.md) | 通用机械产品设计专家——精通方案选型、传动/机构/结构件/连接设计、强度刚度疲劳振动校核、DFMA 与标准件选型，遵循 GB/ISO/JIS 国家标准，输出可制造可装配的工程图与 BOM。 |
| [低风险变更工程师](assets/agency-agents-zh/engineering/engineering-minimal-change-engineer.md) | 负责做最小范围的代码改动，只修复明确提出的问题，拒绝无关重构，把变更风险和回归面压到最低。 |
| [移动应用开发工程师](assets/agency-agents-zh/engineering/engineering-mobile-app-builder.md) | 负责移动应用开发，用原生或跨平台框架实现 iOS、Android 客户端功能并跟进发布。 |
| [移动发布工程师](assets/agency-agents-zh/engineering/engineering-mobile-release-engineer.md) | 负责 iOS、Android 应用的打包与发布，管理签名证书、fastlane 流水线、应用商店提审和分批放量。 |
| [多智能体系统架构师](assets/agency-agents-zh/engineering/engineering-multi-agent-systems-architect.md) | 负责多智能体系统的架构设计，规划智能体拓扑、上下文与信任机制，实现故障恢复和人工介入节点，保证系统可观测。 |
| [网络工程师](assets/agency-agents-zh/engineering/engineering-network-engineer.md) | 负责网络设备配置与排障，维护 Cisco、Juniper、Palo Alto 的路由交换和防火墙规则，保障网络稳定。 |
| [国内网络工程师](assets/agency-agents-zh/engineering/engineering-network-engineer-china.md) | 面向国产网络设备的企业网工程专家——精通华为 VRP、华三 Comware、锐捷 RGOS，覆盖园区网/数据中心/广域网的 VLAN、STP、OSPF、IS-IS、BGP、MPLS、VXLAN、SDN 设计与排障，熟悉信创国产化替代与等保 2.0 合规组网。 |
| [OrgScript 工程师](assets/agency-agents-zh/engineering/engineering-orgscript-engineer.md) | 负责 OrgScript 语言的设计与实现，编写语法解析、AST 校验和业务规则定义，交付可运行的脚本引擎。 |
| [支付计费工程师](assets/agency-agents-zh/engineering/engineering-payments-billing-engineer.md) | 负责支付与计费系统开发，对接 Stripe、Adyen 等支付渠道，处理幂等支付、回调、订阅计费和财务对账。 |
| [上位机工程师](assets/agency-agents-zh/engineering/engineering-pc-host-engineer.md) | Qt/QML 桌面上位机开发专家——精通 Qt Widgets/Quick、QSerialPort 串口、Modbus/CAN/TCP 工业协议、QChart/QCustomPlot 实时数据可视化，以及与 STM32/ESP32 等下位机的协议对接和跨平台打包部署。 |
| [隐私工程师](assets/agency-agents-zh/engineering/engineering-privacy-engineer.md) | 负责把隐私要求落到代码里，做敏感数据识别、最小化采集、删除请求自动处理和数据留存策略。 |
| [提示词工程师](assets/agency-agents-zh/engineering/engineering-prompt-engineer.md) | 负责编写和调优大模型提示词，通过测试迭代把模糊需求变成稳定可用的 AI 行为。 |
| [RAG 管线工程师](assets/agency-agents-zh/engineering/engineering-rag-pipeline-engineer.md) | 负责搭建和优化 RAG 检索管线，设计分块策略、混合检索与重排，用评测数据持续提升召回质量。 |
| [快速原型工程师](assets/agency-agents-zh/engineering/engineering-rapid-prototyper.md) | 负责快速做技术验证和 MVP，用现成框架在短时间内搭建可演示的原型。 |
| [实时协作工程师](assets/agency-agents-zh/engineering/engineering-realtime-collaboration-engineer.md) | 负责实时协作功能开发，搭建 WebSocket 消息通道、在线状态和协同编辑，实现断网重连后的数据同步。 |
| [Rust 重构工程师](assets/agency-agents-zh/engineering/engineering-rust-refactoring-specialist.md) | 负责 Rust 代码库的大规模重构，做模块拆分、重复代码清理、错误处理加固和 Clippy 告警修复，保证改动安全。 |
| [搜索相关性工程师](assets/agency-agents-zh/engineering/engineering-search-relevance-engineer.md) | 负责搜索系统的相关性优化，设计索引与分析器，调 BM25 与混合检索参数，用 nDCG 和线上实验评估效果。 |
| [无障碍合规工程师](assets/agency-agents-zh/engineering/engineering-section-508-specialist.md) | 负责网站无障碍改造与合规审计，落实 WCAG 标准、ARIA 和键盘操作，编写 VPAT 报告并通过自动与人工检查。 |
| [安全工程师](assets/agency-agents-zh/engineering/engineering-security-engineer.md) | 专业应用安全工程师，专注于威胁建模、漏洞评估、安全代码审查、安全架构设计和事件响应，服务于现代 Web、API 和云原生应用。 |
| [高级开发者](assets/agency-agents-zh/engineering/engineering-senior-developer.md) | 负责核心功能开发，用 Laravel、Livewire 写业务代码，处理复杂 CSS 和 Three.js 三维交互。 |
| [软件架构师](assets/agency-agents-zh/engineering/engineering-software-architect.md) | 负责系统架构设计与技术决策，用领域驱动设计和常用架构模式拆分模块，保证系统可扩展、可维护。 |
| [Solidity 智能合约工程师](assets/agency-agents-zh/engineering/engineering-solidity-smart-contract-engineer.md) | 负责编写和审计 Solidity 智能合约，优化 Gas 消耗，设计可升级代理与 DeFi 协议，保证合约安全上线。 |
| [SRE（站点可靠性工程师）](assets/agency-agents-zh/engineering/engineering-sre.md) | 负责系统稳定性保障，制定 SLO 与错误预算，建设监控可观测性，做故障演练并减少重复运维工作。 |
| [技术文档工程师](assets/agency-agents-zh/engineering/engineering-technical-writer.md) | 负责编写开发文档、API 参考和教程，把复杂技术讲清楚，保证文档准确、开发者愿意读。 |
| [威胁检测工程师（工程侧）](assets/agency-agents-zh/engineering/engineering-threat-detection-engineer.md) | 专精于 SIEM 规则开发、MITRE ATT&amp;CK 覆盖度映射、威胁狩猎、告警调优和检测即代码流水线的安全运营检测工程专家。 |
| [USWDS 开发者](assets/agency-agents-zh/engineering/engineering-uswds-developer.md) | 负责用美国联邦设计系统 USWDS 开发政府网站前端，落地组件、设计令牌与无障碍模式，并接入 CMS。 |
| [视频流工程师](assets/agency-agents-zh/engineering/engineering-video-streaming-engineer.md) | 负责视频点播与直播链路，做 HLS/DASH 封装、转码阶梯、DRM 加密和 CDN 分发，按播放质量调优。 |
| [语音 AI 集成工程师](assets/agency-agents-zh/engineering/engineering-voice-ai-integration-engineer.md) | 负责语音转写管线建设，用 Whisper 或云 ASR 做音频处理、字幕生成与说话人分离，并把结果接入业务系统。 |
| [WebAssembly 工程师](assets/agency-agents-zh/engineering/engineering-webassembly-engineer.md) | 负责把 Rust、C++ 代码编译成 WebAssembly 并在浏览器运行，处理与 JS 的边界开销，优化执行性能。 |
| [微信小程序开发者](assets/agency-agents-zh/engineering/engineering-wechat-mini-program-developer.md) | 负责微信小程序开发，用 WXML、WXSS 实现页面，接入支付、订阅消息等微信能力并完成上线。 |
| [WordPress 性能工程师](assets/agency-agents-zh/engineering/engineering-wordpress-performance.md) | 负责 WordPress 站点性能优化，配置对象缓存与页面缓存，优化数据库查询和静态资源，让页面通过性能审计。 |
| [WordPress 购物车工程师](assets/agency-agents-zh/engineering/engineering-wordpress-shopping-cart.md) | 负责用 WooCommerce 搭建商城，配置商品、支付网关与结算流程，定制购物车和优惠券，交付转化友好的店铺。 |

<a id="experts-finance"></a>

### 金融

共 9 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [财务会计主管](assets/agency-agents-zh/finance/finance-bookkeeper-controller.md) | 负责日常账务、银行对账和月度结账，编制财务报表，维护内部控制，确保账目准确、符合会计准则并随时可审计。 |
| [财务分析师](assets/agency-agents-zh/finance/finance-financial-analyst.md) | 搭建财务模型，做预测和情景分析，把报表数据整理成经营建议，供战略规划和投资决策使用。 |
| [财务预测分析师](assets/agency-agents-zh/finance/finance-financial-forecaster.md) | 专注企业财务预测与场景建模的分析专家，精通收入预测、现金流管理、烧钱率分析和融资对接，帮助创业公司和成长型企业在不确定环境中做出有数据支撑的财务决策。 |
| [财务计划分析师](assets/agency-agents-zh/finance/finance-fpa-analyst.md) | 编制年度预算和滚动预测，跟踪执行差异并分析原因，向管理层解释数字背后的业务情况。 |
| [金融风控分析师](assets/agency-agents-zh/finance/finance-fraud-detector.md) | 专注交易欺诈检测与金融风险防控的分析专家，精通支付宝/微信支付/银联渠道的风控策略、反洗钱合规、电信诈骗识别、央行征信应用和互联网金融风控体系搭建，帮助企业守住资金安全底线。 |
| [香港股市合规审查专家](assets/agency-agents-zh/finance/finance-hk-stock-compliance-reviewer.md) | 资深香港股市合规审查专家，精通HKEX上市规则、SFC监管条例、公司条例及证券及期货条例。提供上市申请合规审查、持续责任监督、关联交易合规、披露义务审核及企业管治顾问服务。 |
| [投资研究员](assets/agency-agents-zh/finance/finance-investment-researcher.md) | 研究行业和公司，做尽职调查与估值分析，评估投资风险，输出投资建议支持投资决策。 |
| [发票管理专家](assets/agency-agents-zh/finance/finance-invoice-manager.md) | 专注中国企业发票全生命周期管理的财税专家，精通增值税专用发票与普通发票管理、金税系统操作、电子发票推广、三单匹配、报销审批和税务合规，帮助企业实现发票管理的规范化和数字化。 |
| [税务筹划师](assets/agency-agents-zh/finance/finance-tax-strategist.md) | 制定税务筹划方案，处理跨地区申报和转让定价，在合规前提下合理降低企业税负。 |

<a id="experts-game-development"></a>

### 游戏开发

共 21 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [Blender 插件工程师](assets/agency-agents-zh/game-development/blender-addon-engineer.md) | 用 Python 为 Blender 开发插件，包括资产校验、导出器和管线自动化，把重复的 DCC 操作变成一键流程，供美术团队日常使用。 |
| [经济系统设计师](assets/agency-agents-zh/game-development/economy-designer.md) | 设计游戏内的货币、产出与消耗系统，制定数值回收规则，根据玩家数据调整经济平衡，控制通胀并支撑商业化。 |
| [游戏音频工程师](assets/agency-agents-zh/game-development/game-audio-engineer.md) | 负责游戏音频方案，集成 FMOD/Wwise 中间件，搭建自适应音乐与空间音效，控制音频性能开销，保证各平台流畅。 |
| [游戏设计师](assets/agency-agents-zh/game-development/game-designer.md) | 编写游戏设计文档，设计核心玩法循环与系统机制，结合玩家心理调整数值和体验，推动玩法落地到项目各阶段。 |
| [Godot 玩法脚本工程师](assets/agency-agents-zh/game-development/godot-gameplay-scripter.md) | 用 GDScript 和 C# 实现 Godot 4 的玩法逻辑，设计节点架构与信号通信，保证代码类型安全、模块清晰可维护。 |
| [Godot 多人联机工程师](assets/agency-agents-zh/game-development/godot-multiplayer-engineer.md) | 搭建 Godot 4 实时联机框架，配置场景同步、RPC 与权威模型，处理 ENet/WebRTC 传输，保障多人对战的稳定性。 |
| [Godot 着色器开发者](assets/agency-agents-zh/game-development/godot-shader-developer.md) | 用 Godot 着色语言编写 2D/3D 特效与后处理效果，优化着色器性能，确保美术效果在目标设备上流畅运行。 |
| [关卡设计师](assets/agency-agents-zh/game-development/level-designer.md) | 设计关卡布局与节奏，安排战斗遭遇和环境叙事，通过白盒搭建和反复测试打磨关卡体验与难度曲线。 |
| [叙事设计师](assets/agency-agents-zh/game-development/narrative-designer.md) | 编写剧情与分支对话，搭建任务和叙事系统，保证剧情与玩法设计文档一致，用环境细节传递故事信息。 |
| [Roblox 虚拟形象创作者](assets/agency-agents-zh/game-development/roblox-avatar-creator.md) | 制作 Roblox 虚拟形象与 UGC 物品，完成配件绑定和贴图标准检查，按 Creator Marketplace 要求提交审核并上架。 |
| [Roblox 体验设计师](assets/agency-agents-zh/game-development/roblox-experience-designer.md) | 设计 Roblox 游戏的玩法循环与成长系统，配置通行证和开发者商品等变现功能，根据留存数据迭代体验。 |
| [Roblox 系统脚本工程师](assets/agency-agents-zh/game-development/roblox-systems-scripter.md) | 用 Luau 开发 Roblox 服务端与客户端系统，设计 RemoteEvent 通信和数据存储，按安全模型防止作弊，支撑规模扩展。 |
| [技术美术](assets/agency-agents-zh/game-development/technical-artist.md) | 打通美术到引擎的资产管线，编写着色器与特效，制定 LOD 和性能预算，优化跨引擎资产表现与加载效率。 |
| [Unity 架构师](assets/agency-agents-zh/game-development/unity-architect.md) | 规划 Unity 项目整体架构，用 ScriptableObject 管理数据，拆分低耦合系统与单一职责组件，保证大型项目可扩展。 |
| [Unity 编辑器工具开发者](assets/agency-agents-zh/game-development/unity-editor-tool-developer.md) | 开发 Unity 编辑器扩展工具，包括自定义窗口、资源导入器和批量处理脚本，自动化美术与策划的重复流程。 |
| [Unity 多人联机工程师](assets/agency-agents-zh/game-development/unity-multiplayer-engineer.md) | 基于 Netcode 搭建 Unity 联机系统，配置 Relay/Lobby 服务，实现客户端权威、延迟补偿与状态同步，保证联机体验。 |
| [Unity 着色器美术](assets/agency-agents-zh/game-development/unity-shader-graph-artist.md) | 用 Shader Graph 和 HLSL 制作材质与实时特效，适配 URP/HDRP 渲染管线，调优表现效果与性能消耗。 |
| [Unreal 多人联机架构师](assets/agency-agents-zh/game-development/unreal-multiplayer-architect.md) | 设计 UE5 联机架构，配置 Actor 复制与服务端权威逻辑，实现网络预测和专属服务器部署，保障多人稳定。 |
| [Unreal 系统工程师](assets/agency-agents-zh/game-development/unreal-systems-engineer.md) | 负责 UE5 核心系统开发，结合 C++ 与蓝图实现玩法能力，落地 Nanite、Lumen 等特性并做性能调优。 |
| [Unreal 技术美术](assets/agency-agents-zh/game-development/unreal-technical-artist.md) | 搭建 UE5 美术到引擎的资产管线，用材质编辑器与 Niagara 制作特效，配合程序化生成提升场景产出效率。 |
| [Unreal 世界构建师](assets/agency-agents-zh/game-development/unreal-world-builder.md) | 用 World Partition、Landscape 与程序化植被搭建开放世界场景，配置 HLOD 和关卡流送，保证大地图无缝加载。 |

<a id="experts-gis"></a>

### 地理信息

共 13 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [3D 场景开发者](assets/agency-agents-zh/gis/gis-3d-scene-developer.md) | 用 Cesium、ArcGIS Scene Viewer 等引擎搭建 Web 端三维场景，制作地形模型与点云可视化，交付可交互的在线三维地图。 |
| [GIS 分析师](assets/agency-agents-zh/gis/gis-analyst.md) | 日常制图出图、管理图层、执行空间查询，维护桌面端与 Web 端地理数据的准确性。 |
| [BIM/GIS 专家](assets/agency-agents-zh/gis/gis-bim-specialist.md) | 负责 Revit、IFC 建筑数据与地理信息的转换对接，搭建室内地图与数字孪生模型，支撑设施管理应用。 |
| [制图设计师](assets/agency-agents-zh/gis/gis-cartography-designer.md) | 设计印刷地图与 Web 地图版式，处理配色、字体和注记位置，输出清晰易读的地图成品。 |
| [无人机/实景测绘专家](assets/agency-agents-zh/gis/gis-drone-reality-mapping.md) | 将无人机航拍影像处理成正射影像、数字地形模型、点云和三维网格，产出可直接入库的测绘成果。 |
| [地理 AI/ML 工程师](assets/agency-agents-zh/gis/gis-geoai-ml-engineer.md) | 基于卫星和航拍影像训练机器学习模型，完成目标检测、图像分割与土地覆盖分类，交付解译成果。 |
| [地理处理专家](assets/agency-agents-zh/gis/gis-geoprocessing-specialist.md) | 用 ArcPy 与 Python 编写地理处理脚本，搭建批处理流程和自定义工具箱，把 ArcGIS Pro 的重复操作自动化。 |
| [GIS QA 工程师](assets/agency-agents-zh/gis/gis-qa-engineer.md) | 核查地理数据的拓扑关系、坐标系一致性与元数据，开展精度评估和合规检查，把关入库数据质量。 |
| [解决方案工程师](assets/agency-agents-zh/gis/gis-solution-engineer.md) | 将方案设计落地为可演示的原型与概念验证，在 Esri 和开源技术栈上验证可行性，支撑售前交付。 |
| [空间数据工程师](assets/agency-agents-zh/gis/gis-spatial-data-engineer.md) | 负责地理空间数据的抽取、转换与加载，统一坐标系和属性格式，搭建自动化管线，输出标准化数据集。 |
| [空间数据科学家](assets/agency-agents-zh/gis/gis-spatial-data-scientist.md) | 对地理空间数据做统计建模、聚类和预测分析，找出地图上不易察觉的规律，输出分析结论与报告。 |
| [技术顾问](assets/agency-agents-zh/gis/gis-technical-consultant.md) | 分析客户业务需求，评估现有系统差距，制定 GIS 技术路线图，编写方案与投标文件，推动改造落地。 |
| [Web GIS 开发者](assets/agency-agents-zh/gis/gis-web-gis-developer.md) | 用 MapLibre GL JS、ArcGIS JS API、Leaflet 开发交互式地图应用，对接地理信息服务接口，交付实时数据面板。 |

<a id="experts-healthcare"></a>

### 医疗健康

共 3 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [循证医学研究员](assets/agency-agents-zh/healthcare/healthcare-clinical-evidence-agent.md) | 检索和评价临床研究文献，按证据等级整理证据，撰写系统评价报告，为临床决策和诊疗指南提供依据。 |
| [医疗创新战略顾问](assets/agency-agents-zh/healthcare/healthcare-innovation-strategist.md) | 为医疗健康企业提供战略咨询，分析市场、政策与竞争格局，梳理商业模式，制定产品上市与扩张路径。 |
| [医疗系统治理顾问](assets/agency-agents-zh/healthcare/healthcare-sovereign-health-systems-agent.md) | 为政府卫生部门提供政策与治理咨询，设计医疗资源配置和分级诊疗方案，评估公共卫生项目实施效果。 |

<a id="experts-hr"></a>

### 人力资源

共 2 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [绩效管理专家](assets/agency-agents-zh/hr/hr-performance-reviewer.md) | 深耕中国企业绩效管理体系的实战专家，精通 OKR/KPI 双轨制、360 度反馈、绩效校准会、PIP 改进计划等全流程绩效管理，帮助企业建立科学公正的绩效评估与人才发展机制。 |
| [招聘专家（HR 全流程）](assets/agency-agents-zh/hr/hr-recruiter.md) | 深耕中国人才市场的全流程招聘专家，精通 Boss 直聘、猎聘、拉勾等主流招聘渠道运营，擅长简历筛选、面试协调、人才管线管理、校招社招全链路操盘，帮助企业高效精准地完成人才获取与入职闭环。 |

<a id="experts-legal"></a>

### 法务

共 2 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [合同审查专家](assets/agency-agents-zh/legal/legal-contract-reviewer.md) | 精通中国《民法典》合同编及商业合同实务的法律专家，擅长合同风险识别、条款审查与修改建议，熟悉电子签章、争议解决机制、违约金条款设计，帮助企业在商业交易中有效防控法律风险。 |
| [制度文件撰写专家](assets/agency-agents-zh/legal/legal-policy-writer.md) | 精通中国数据合规法律体系的企业制度文件撰写专家，擅长内部管理制度、隐私政策、用户协议等法律文书起草，深谙《个人信息保护法》《数据安全法》《网络安全法》三法合规要求，帮助企业构建完整的合规制度体系。 |

<a id="experts-marketing"></a>

### 市场营销

共 43 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [AEO 搜索优化师](assets/agency-agents-zh/marketing/marketing-aeo-foundations.md) | 部署 llms.txt、robots.txt 和结构化 Markdown 等站点文件，让 AI 爬虫与引用引擎能抓取并解析网站内容，提升站点在 AI 搜索中的可见度。 |
| [AI 搜索优化师](assets/agency-agents-zh/marketing/marketing-agentic-search-optimizer.md) | 审计 AI 智能体能否在网站上完成预订、购买、注册等任务，落地 WebMCP 声明式与命令式模式，统计任务完成率并持续改进。 |
| [AI 引用优化师](assets/agency-agents-zh/marketing/marketing-ai-citation-strategist.md) | 排查品牌在 ChatGPT、Claude 等 AI 产品中的被提及情况，分析竞品被引用的原因，输出内容修改方案，提升品牌在 AI 回答中的引用率。 |
| [应用商店优化师](assets/agency-agents-zh/marketing/marketing-app-store-optimizer.md) | 负责应用商店的 ASO 优化，调整标题、关键词、截图与评分策略，提升应用在商店内的曝光量和下载转化率。 |
| [百度 SEO 专家](assets/agency-agents-zh/marketing/marketing-baidu-seo-specialist.md) | 负责百度搜索排名优化，完成中文关键词研究、站点移动端适配与 ICP 备案合规，提升品牌在百度搜索的自然流量。 |
| [B站内容运营专家](assets/agency-agents-zh/marketing/marketing-bilibili-content-strategist.md) | 运营 B 站账号内容，策划选题、对接 UP 主合作，按平台算法优化视频与弹幕互动，提升播放量和粉丝增长。 |
| [B站内容策略师](assets/agency-agents-zh/marketing/marketing-bilibili-strategist.md) | 专注B站（哔哩哔哩）平台的中长视频内容策略专家，精通UP主运营、弹幕文化、社区生态、品牌合作、推荐算法，以及通过优质内容实现长期粉丝增长与商业变现。 |
| [图书策划编辑](assets/agency-agents-zh/marketing/marketing-book-co-author.md) | 把创始人、专家的语音笔记和零散素材整理成结构化的第一人称章节，规划全书定位与目录，完成出版级书稿。 |
| [内容增长运营专家](assets/agency-agents-zh/marketing/marketing-carousel-growth-engine.md) | 抓取网站内容自动生成六页轮播图，直接发布到 TikTok 和 Instagram 信息流，跟踪播放数据并持续迭代内容策略。 |
| [中国电商运营](assets/agency-agents-zh/marketing/marketing-china-ecommerce-operator.md) | 运营淘宝、天猫、拼多多、京东等平台店铺，优化商品详情与价格策略，组织 618、双 11 大促和直播带货活动。 |
| [中国市场本地化专家](assets/agency-agents-zh/marketing/marketing-china-market-localization-strategist.md) | 分析抖音、小红书、微信、B 站等平台的实时趋势，把品牌内容和产品话术本地化，制定可执行的中国市场进入方案。 |
| [内容创作者](assets/agency-agents-zh/marketing/marketing-content-creator.md) | 制定各平台内容日历，撰写文案与选题，维护品牌故事调性，根据互动数据调整内容方向与发布节奏。 |
| [跨境电商专家](assets/agency-agents-zh/marketing/marketing-cross-border-ecommerce.md) | 运营 Amazon、Shopee、Temu 等海外平台店铺，处理跨境物流、合规税务和多语言商品信息，建设品牌独立站。 |
| [新闻情报官](assets/agency-agents-zh/marketing/marketing-daily-news-briefing.md) | 国内外多源新闻实时采集与结构化简报生成，为内容创作团队提供高质量新闻素材。支持按类型（科技/财经/社会/国际等）筛选，交叉验证信源，输出下游 agent 可直接使用的结构化简报。 |
| [抖音运营专家](assets/agency-agents-zh/marketing/marketing-douyin-strategist.md) | 策划抖音短视频选题与脚本，按推荐算法优化发布，运营直播带货，用内容矩阵带动品牌流量和销量增长。 |
| [电商运营师](assets/agency-agents-zh/marketing/marketing-ecommerce-operator.md) | 专注中国电商平台全链路运营的策略专家，精通淘宝/天猫/拼多多/京东的店铺运营、商品优化、直播带货、大促策划（618/双十一），以及跨平台差异化运营策略。 |
| [邮件营销专家](assets/agency-agents-zh/marketing/marketing-email-strategist.md) | 搭建欢迎、召回、复购等自动化邮件序列，做用户分群与触达策略，监控送达率，按打开和转化数据迭代活动。 |
| [全球播客增长策略专家](assets/agency-agents-zh/marketing/marketing-global-podcast-strategist.md) | 负责播客定位与内容策划，运营 Spotify、Apple Podcasts 等分发渠道，设计广告与会员变现方式，跟踪收听数据。 |
| [增长营销专家](assets/agency-agents-zh/marketing/marketing-growth-hacker.md) | 通过小规模实验测试增长渠道，设计裂变机制与转化漏斗，用数据判断投入方向，实现低成本获客。 |
| [Instagram 运营](assets/agency-agents-zh/marketing/marketing-instagram-curator.md) | 维护 Instagram 账号的视觉风格，策划图文、Reels 等格式内容，管理评论区与粉丝社群，提升互动率。 |
| [知识付费产品策划师](assets/agency-agents-zh/marketing/marketing-knowledge-commerce-strategist.md) | 专注中国知识付费生态的产品设计与商业化专家，精通得到、知识星球、小报童、小鹅通、千聊等平台运营，擅长知识产品定义、内容定价策略、用户运营、IP打造、分销体系设计和全链路数据分析。 |
| [快手运营专家](assets/agency-agents-zh/marketing/marketing-kuaishou-strategist.md) | 面向下沉市场策划快手短视频内容，运营直播带货，通过真实内容建立社区信任，带动粉丝与销量增长。 |
| [LinkedIn 内容创作者](assets/agency-agents-zh/marketing/marketing-linkedin-content-creator.md) | 为创始人、求职者撰写 LinkedIn 帖文，规划个人品牌内容，按平台算法安排发布节奏，带来询盘与商务机会。 |
| [直播电商运营专家](assets/agency-agents-zh/marketing/marketing-livestream-commerce-coach.md) | 培训主播话术与控场技巧，设计直播脚本和商品顺序，调配付费与自然流量，按实时数据优化成交转化。 |
| [多平台内容运营专家](assets/agency-agents-zh/marketing/marketing-multi-platform-publisher.md) | 把一篇文章按平台规则适配后分发到知乎、小红书、公众号等渠道，先出草稿供人工审核，控制频率规避风险。 |
| [中国播客运营策略专家](assets/agency-agents-zh/marketing/marketing-podcast-strategist.md) | 负责中文播客的定位与内容制作，运营小宇宙、喜马拉雅等音频平台，规划涨粉路径与会员、广告变现方式。 |
| [公关传播经理](assets/agency-agents-zh/marketing/marketing-pr-communications-manager.md) | 维护媒体关系，撰写新闻稿，处理负面舆情与危机公关，策划高管对外发声，维护品牌声誉。 |
| [私域运营](assets/agency-agents-zh/marketing/marketing-private-domain-operator.md) | 搭建企业微信私域用户池，做用户分层、社群运营和生命周期管理，对接小程序商城，推动复购与转化。 |
| [Reddit 社区运营](assets/agency-agents-zh/marketing/marketing-reddit-community-builder.md) | 以真实身份参与 Reddit 相关版块讨论，发布有价值的内容而非硬广，经营社区关系，沉淀口碑。 |
| [SEO 专家](assets/agency-agents-zh/marketing/marketing-seo-specialist.md) | 负责网站技术 SEO 与内容优化，建设高质量外链，监测关键词排名，持续提升自然搜索流量。 |
| [短视频剪辑师](assets/agency-agents-zh/marketing/marketing-short-video-editing-coach.md) | 用剪映、Premiere、达芬奇等工具完成短视频剪辑，处理调色、字幕、音效与动效，按平台规格导出成片。 |
| [社媒运营专家](assets/agency-agents-zh/marketing/marketing-social-media-strategist.md) | 在 LinkedIn、Twitter 等平台策划跨平台活动，运营社群并处理实时互动，制定个人品牌发声策略。 |
| [TikTok 运营专家](assets/agency-agents-zh/marketing/marketing-tiktok-strategist.md) | 策划 TikTok 短视频选题与拍摄，跟踪平台算法和流行趋势，运营账号与粉丝社群，带动品牌曝光增长。 |
| [Twitter 互动运营](assets/agency-agents-zh/marketing/marketing-twitter-engager.md) | 参与平台实时话题讨论，撰写有传播力的推文串，与行业账号互动互转，建立品牌话语权。 |
| [视频优化专家](assets/agency-agents-zh/marketing/marketing-video-optimization-specialist.md) | 优化 YouTube 视频标题、缩略图与章节，分析完播率与留存，把视频同步分发到其他平台放大流量。 |
| [公众号运营](assets/agency-agents-zh/marketing/marketing-wechat-official-account.md) | 运营公众号内容，策划图文与视频选题，维护粉丝社群，通过内容引导关注、互动与付费转化。 |
| [微信公众号运营](assets/agency-agents-zh/marketing/marketing-wechat-operator.md) | 专注微信生态的内容运营专家，精通公众号内容策略、社群运营、裂变增长、私域流量搭建和微信小程序运营。 |
| [微博运营专家](assets/agency-agents-zh/marketing/marketing-weibo-strategist.md) | 运营微博账号，跟进热搜话题、管理超话社区，监测舆论风向，策划粉丝活动与微博广告投放。 |
| [微信视频号运营策略师](assets/agency-agents-zh/marketing/marketing-weixin-channels-strategist.md) | 专注微信视频号生态的内容策略与增长运营专家，精通社交推荐机制、公众号/朋友圈/小程序/企微生态联动、视频号直播带货、短视频内容策划、私域引流闭环和创作者数据分析。 |
| [X/Twitter 舆情分析师](assets/agency-agents-zh/marketing/marketing-x-twitter-intelligence-analyst.md) | 监测 X/Twitter 上与品牌相关的话题与账号动态，识别趋势和风险信号，输出有数据支撑的舆情报告。 |
| [小红书增长运营专家](assets/agency-agents-zh/marketing/marketing-xiaohongshu-operator.md) | 专注小红书平台的内容运营专家，擅长种草笔记创作、达人合作策略、爆款内容公式、以及通过数据驱动实现品牌在小红书的高效获客和口碑建设。 |
| [小红书运营专家](assets/agency-agents-zh/marketing/marketing-xiaohongshu-specialist.md) | 运营小红书账号，策划生活方式类笔记选题，跟踪平台热点，经营评论区与私信，带动种草和转化。 |
| [知乎运营专家](assets/agency-agents-zh/marketing/marketing-zhihu-strategist.md) | 运营知乎账号，通过回答问题输出专业内容，经营主页与专栏，参与圆桌讨论，建立专业可信度。 |

<a id="experts-paid-media"></a>

### 付费媒体

共 7 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [广告投放审计师](assets/agency-agents-zh/paid-media/paid-media-auditor.md) | 逐项核查 Google Ads、微软广告、Meta 账户的结构、追踪、出价与素材，输出按优先级排序的优化建议和预估影响报告。 |
| [广告创意策划师](assets/agency-agents-zh/paid-media/paid-media-creative-strategist.md) | 负责撰写广告文案、优化自适应搜索广告和素材组，设计创意测试方案，把投放数据转化为有说服力的广告素材。 |
| [付费社媒投放专家](assets/agency-agents-zh/paid-media/paid-media-paid-social-strategist.md) | 负责 Meta、LinkedIn、TikTok 等平台的付费社媒投放，按平台特点设计拉新和再营销的全漏斗广告方案与受众策略。 |
| [PPC 投放优化师](assets/agency-agents-zh/paid-media/paid-media-ppc-strategist.md) | 负责 Google、微软、亚马逊平台搜索、购物与效果最大化广告的账户搭建、预算分配和出价策略，管理大规模月度投放预算。 |
| [程序化广告投放师](assets/agency-agents-zh/paid-media/paid-media-programmatic-buyer.md) | 负责展示广告与程序化媒体采买，管理 DV360、Google 展示广告网络等平台的广告位和预算，执行 ABM 定向投放策略。 |
| [搜索词分析师](assets/agency-agents-zh/paid-media/paid-media-search-query-analyst.md) | 分析搜索词报告，搭建否定关键词体系，把搜索词映射到用户意图，减少无效点击、放大高意向流量。 |
| [广告归因分析师](assets/agency-agents-zh/paid-media/paid-media-tracking-specialist.md) | 负责转化追踪架构、标签管理与归因建模，搭建 GTM、GA4、Meta CAPI 等追踪方案，确保转化数据准确、投放效果可衡量。 |

<a id="experts-product"></a>

### 产品

共 5 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [增长产品经理](assets/agency-agents-zh/product/product-behavioral-nudge-engine.md) | 研究用户心理与行为规律，调整产品交互节奏和引导方式，提升用户使用动机与完成率，负责增长相关实验的设计与落地。 |
| [用户反馈研究员](assets/agency-agents-zh/product/product-feedback-synthesizer.md) | 收集各渠道用户反馈，归类分析后提炼改进点，把定性意见整理成可执行的需求优先级，输出给产品团队。 |
| [产品经理](assets/agency-agents-zh/product/product-manager.md) | 负责产品从调研、规划到上线运营的全流程，定义需求与路线图，协调研发、设计、运营推进落地，跟踪上线效果并迭代。 |
| [需求优先级分析师](assets/agency-agents-zh/product/product-sprint-prioritizer.md) | 负责迭代计划与需求排期，按价值和成本评估需求优先级，合理分配资源，保证每轮迭代交付最重要的功能。 |
| [趋势研究员](assets/agency-agents-zh/product/product-trend-researcher.md) | 跟踪行业动态与竞品变化，识别新兴趋势和机会点，输出市场分析报告，为产品方向和立项决策提供依据。 |

<a id="experts-project-management"></a>

### 项目管理

共 7 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [实验项目运营](assets/agency-agents-zh/project-management/project-management-experiment-tracker.md) | 负责实验项目全流程管理。设计 A/B 测试方案，跟踪实验执行进度，用数据验证假设，输出结果报告供产品决策。 |
| [Jira 流程管理员](assets/agency-agents-zh/project-management/project-management-jira-workflow-steward.md) | 维护 Jira 项目配置与流程规范，确保每个 Git 提交和拉取请求都能追溯到对应任务，分支管理符合发布安全要求。 |
| [项目记录专员](assets/agency-agents-zh/project-management/project-management-meeting-notes-specialist.md) | 把会议录音或零散笔记整理成结构化纪要，提炼决策、行动项和未决问题，输出摘要并跟进事项落地。 |
| [项目推进专员](assets/agency-agents-zh/project-management/project-management-project-shepherd.md) | 负责项目从启动到交付的全周期推进。协调跨部门资源和进度，管理时间线与风险，同步各方信息，确保按计划交付。 |
| [工作室运营](assets/agency-agents-zh/project-management/project-management-studio-operations.md) | 负责工作室日常运营。优化工作流程和资源调配，维护团队协作工具与制度，保障各项目正常运转、产出稳定。 |
| [工作室制片人](assets/agency-agents-zh/project-management/project-management-studio-producer.md) | 统筹工作室全部项目的排期与交付。分配人力和资源，管理多项目优先级，对齐创意方向与业务目标，保证按时保质完成。 |
| [高级项目经理](assets/agency-agents-zh/project-management/project-manager-senior.md) | 把需求规格拆解为可执行任务，参考历史项目经验估算排期。严格管理范围，拒绝无关需求，按规格要求交付。 |

<a id="experts-research"></a>

### 研究

共 1 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [研究证据综合专家](assets/agency-agents-zh/research/research-synthesist.md) | 开展文献检索、信源评价与证据综合，将分散材料整理为结构清晰、权重诚实的研究结论。 |

<a id="experts-sales"></a>

### 销售

共 9 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [大客户经理](assets/agency-agents-zh/sales/sales-account-strategist.md) | 成交后的大客户经营。负责老客户扩容，梳理关键决策人，组织季度业务回顾，提升净收入留存，把已成交客户做成长期合作关系。 |
| [销售培训师](assets/agency-agents-zh/sales/sales-coach.md) | 负责销售团队能力培养。陪访一线销售，复盘商机和丢单案例，拆解大单策略，校准销售预测，用结构化反馈提升每个销售的成交产出。 |
| [商务谈判顾问](assets/agency-agents-zh/sales/sales-deal-strategist.md) | 负责复杂 B2B 大单的赢单策略。用 MEDDPICC 评估商机质量，分析竞争定位，制定赢单计划，提前暴露管线风险，保证预测可过评审。 |
| [售前需求顾问](assets/agency-agents-zh/sales/sales-discovery-coach.md) | 训练销售团队的客户需求挖掘。设计提问清单，梳理客户现状，量化业务差距，搭访谈结构，挖出客户的真实购买动机。 |
| [销售工程师](assets/agency-agents-zh/sales/sales-engineer.md) | 负责售前技术支持。做技术需求调研、产品演示和 POC 范围界定，整理竞品对比，把产品能力对应到客户业务收益，推动技术侧拍板。 |
| [销售获客专员](assets/agency-agents-zh/sales/sales-offer-lead-gen-strategist.md) | 负责销售漏斗顶部的获客。设计有吸引力的报价和引流产品，多渠道开发线索，通过客户转介绍、员工、代理商和联盟放大触达。 |
| [外呼销售专员](assets/agency-agents-zh/sales/sales-outbound-strategist.md) | 做主动外呼获客。定义目标客户画像，设计多渠道触达序列，按客户调研结果个性化开发，靠线索质量而非数量建立销售管线。 |
| [销售管线分析师](assets/agency-agents-zh/sales/sales-pipeline-analyst.md) | 负责销售数据运营。诊断销售管线健康度，分析成交周期和预测准确率，把 CRM 数据变成可执行的销售情报，提前暴露丢单风险。 |
| [方案提案顾问](assets/agency-agents-zh/sales/sales-proposal-strategist.md) | 负责标书和方案撰写。把 RFP 和销售商机转化成有说服力的提案，提炼赢单主题，做竞争差异化定位，打磨执行摘要，让方案打动决策人。 |

<a id="experts-security"></a>

### 安全

共 12 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [AI 生成代码安全审计师](assets/agency-agents-zh/security/security-ai-generated-code-auditor.md) | 审查 AI 生成的代码，找出硬编码密钥、越权访问、提示注入等漏洞，推动扫描、修复、复扫闭环，输出按 CWE 编号的漏洞报告。 |
| [应用安全工程师](assets/agency-agents-zh/security/security-appsec-engineer.md) | 负责威胁建模和安全代码评审，接入 SAST/DAST 扫描工具，向开发团队讲解安全要求，把安全检查嵌入软件开发生命周期。 |
| [安全架构师](assets/agency-agents-zh/security/security-architect.md) | 负责系统安全架构设计，开展威胁建模与信任边界分析，规划纵深防御方案，组织安全设计评审并给出风险处置建议。 |
| [区块链安全审计师](assets/agency-agents-zh/security/security-blockchain-security-auditor.md) | 审计 DeFi 协议和智能合约，检测漏洞并做利用分析，配合形式化验证，出具可落地的安全审计报告。 |
| [云安全架构师](assets/agency-agents-zh/security/security-cloud-security-architect.md) | 在 AWS、Azure、GCP 上设计零信任架构，落地纵深防御，把安全策略检查嵌入基础设施即代码流水线。 |
| [合规审计师](assets/agency-agents-zh/security/security-compliance-auditor.md) | 主导 SOC 2、ISO 27001、PCI-DSS 等合规审计，完成差距评估、证据收集和整改跟进，推动顺利通过认证。 |
| [应急响应工程师](assets/agency-agents-zh/security/security-incident-responder.md) | 处置安全事件并做数字取证，遏制正在进行的攻击，协调应急响应流程，撰写复盘报告并推动整改。 |
| [渗透测试工程师](assets/agency-agents-zh/security/security-penetration-tester.md) | 对网络、Web 应用和云环境开展授权渗透测试与红队演练，输出漏洞评估报告并跟进修复验证。 |
| [密钥与凭据治理工程师](assets/agency-agents-zh/security/security-secrets-credential-engineer.md) | 管理密钥与凭据的发现、入库、轮换和泄露处置，推行短时有效、最小权限的凭据策略，防止明文密钥进入代码。 |
| [高级安全运营工程师](assets/agency-agents-zh/security/security-senior-secops.md) | 在代码提交入口检查密钥与敏感数据泄露，按安全基线审查认证授权、CORS、限流等关键配置，落地并维护安全运营规范。 |
| [威胁检测工程师](assets/agency-agents-zh/security/security-threat-detection-engineer.md) | 编写和调优 SIEM 检测规则，对照 MITRE ATT&amp;CK 梳理覆盖缺口，开展威胁狩猎，维护检测即代码流水线。 |
| [威胁情报分析师](assets/agency-agents-zh/security/security-threat-intelligence-analyst.md) | 跟踪攻击组织和攻击活动，按 MITRE ATT&amp;CK 梳理战术手法，产出威胁情报报告，支撑检测规则建设。 |

<a id="experts-spatial-computing"></a>

### 空间计算

共 6 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [macOS 空间/Metal 工程师](assets/agency-agents-zh/spatial-computing/macos-spatial-metal-engineer.md) | 用 Swift 和 Metal 开发 macOS 与 Vision Pro 上的高性能 3D 渲染系统，负责渲染管线搭建、性能调优和空间计算应用的落地交付。 |
| [终端集成专家](assets/agency-agents-zh/spatial-computing/terminal-integration-specialist.md) | 把终端模拟能力集成进 Swift 应用，负责文本渲染优化和 SwiftTerm 接入，交付可嵌入的终端组件。 |
| [visionOS 空间工程师](assets/agency-agents-zh/spatial-computing/visionos-spatial-engineer.md) | 用 SwiftUI 开发 visionOS 空间应用，实现立体界面和 Liquid Glass 视觉样式，负责从原型到上架的完整交付。 |
| [XR 座舱交互专家](assets/agency-agents-zh/spatial-computing/xr-cockpit-interaction-specialist.md) | 设计并开发 XR 环境下的座舱控制交互系统，定义手势与操作流程，交付可用的沉浸式操控界面。 |
| [XR 沉浸式开发者](assets/agency-agents-zh/spatial-computing/xr-immersive-developer.md) | 用 WebXR 开发浏览器里的 AR/VR 应用，负责 3D 场景搭建、交互实现和多设备适配。 |
| [XR 界面架构师](assets/agency-agents-zh/spatial-computing/xr-interface-architect.md) | 设计沉浸式环境的空间交互方案，规划界面层级与操作逻辑，输出可落地的交互规范。 |

<a id="experts-specialized"></a>

### 专业

共 68 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [应付账款会计](assets/agency-agents-zh/specialized/accounts-payable-agent.md) | 处理供应商付款、承包商发票与周期性账单，支持多种支付渠道，确保付款准确及时，并跟进对账。 |
| [身份与信任架构师](assets/agency-agents-zh/specialized/agentic-identity-trust.md) | 为多智能体系统设计身份认证与信任校验体系，让智能体的身份、权限和操作记录都可验证。 |
| [AI 流程编排师](assets/agency-agents-zh/specialized/agents-orchestrator.md) | 拆解开发任务，编排各环节流程，协调成员推进，把控进度与交付质量。 |
| [鉴定评估师](assets/agency-agents-zh/specialized/authenticity-appraiser.md) | 二手与收藏品鉴定评估专家，覆盖奢侈品箱包腕表、球鞋潮玩、文玩收藏的真伪要点讲解、行情估值框架与交易避坑——教你怎么看、去哪验、按什么逻辑出价，并明确线上鉴定的能力边界。 |
| [自动化治理架构师](assets/agency-agents-zh/specialized/automation-governance-architect.md) | 审计自动化流程的价值、风险与可维护性，制定治理规范，评审后再上线实施。 |
| [商业策略顾问](assets/agency-agents-zh/specialized/business-strategist.md) | 分析竞争格局与市场机会，设计商业模式，制定增长与进入策略，输出可执行的决策建议。 |
| [变革管理顾问](assets/agency-agents-zh/specialized/change-management-consultant.md) | 运用成熟框架推进组织变革，管理抵触与采纳过程，确保新制度在落地后持续生效。 |
| [首席财务官](assets/agency-agents-zh/specialized/chief-financial-officer.md) | 统筹资金调度、财务规划与投融资事项，向董事会汇报财务状况，支撑重大经营决策。 |
| [企业培训师](assets/agency-agents-zh/specialized/corporate-training-designer.md) | 做培训需求调研，设计课程体系与培养方案，组织授课并评估培训效果，持续迭代。 |
| [客户服务](assets/agency-agents-zh/specialized/customer-service.md) | 解答咨询、处理投诉与账户问题，跟进工单并按规定升级，维护客户满意度。 |
| [客户成功经理](assets/agency-agents-zh/specialized/customer-success-manager.md) | 负责客户上线与使用辅导，跟踪健康度，组织季度回顾，推动续约与增购，降低流失。 |
| [数据整合专员](assets/agency-agents-zh/specialized/data-consolidation-agent.md) | 汇总各渠道销售数据，按区域、人员与管线维度整理，维护实时报表看板。 |
| [数据隐私官](assets/agency-agents-zh/specialized/data-privacy-officer.md) | 搭建数据隐私合规体系，开展数据映射与影响评估，处理泄露事件，对接监管要求。 |
| [ESG 与可持续发展官](assets/agency-agents-zh/specialized/esg-sustainability-officer.md) | 搭建 ESG 管理体系，编制披露报告，推进减排项目，对接利益相关方与监管要求。 |
| [高考志愿填报顾问](assets/agency-agents-zh/specialized/gaokao-college-advisor.md) | 中国高考志愿填报策略专家，精通平行志愿与院校专业组填报规则、位次法与等位分析、新高考选科组合与专业限选、提前批与专项计划、院校层次定位、冲稳保策略，帮助考生和家长制定科学的志愿填报方案。 |
| [政务数字化售前顾问](assets/agency-agents-zh/specialized/government-digital-presales-consultant.md) | 解读政务政策与合规要求，设计解决方案，撰写投标文件，组织 POC 验证，支撑项目中标。 |
| [基金申报专员](assets/agency-agents-zh/specialized/grant-writer.md) | 调研资助机会，撰写申报书与预算说明，跟进评审，完成后提交结项报告。 |
| [老年照护顾问](assets/agency-agents-zh/specialized/healthcare-aging-parent-care-companion.md) | 协助家属安排老人就医与用药，协调照护团队沟通，同时关注家属自身状态。 |
| [医疗客服](assets/agency-agents-zh/specialized/healthcare-customer-service.md) | 处理患者咨询、预约与账单问题，解答保险疑问，投诉及时转交临床或行政处理。 |
| [医疗营销合规专家](assets/agency-agents-zh/specialized/healthcare-marketing-compliance.md) | 审核医药、器械、医美等营销内容，对照广告法与平台规则把控风险，保护患者隐私。 |
| [酒店宾客服务](assets/agency-agents-zh/specialized/hospitality-guest-services.md) | 办理预订与入住退房，提供礼宾服务，处理客诉，维护会员体系并跟进住后回访。 |
| [HR 入职专员](assets/agency-agents-zh/specialized/hr-onboarding.md) | 组织新员工入职培训与材料签署，办理福利参保，跟进试用期适应，保障顺利转正。 |
| [身份图谱运营](assets/agency-agents-zh/specialized/identity-graph-operator.md) | 维护多智能体共享的身份图谱，统一实体身份判定结果，保证并发写入下数据一致。 |
| [翻译专员](assets/agency-agents-zh/specialized/language-translator.md) | 提供西英双向实时翻译，兼顾文化语境、方言差异与场合语气，确保沟通准确得体。 |
| [法务计费专员](assets/agency-agents-zh/specialized/legal-billing-time-tracking.md) | 记录工时、生成账单与计费说明，跟进回款，管理托管账户合规，输出计费分析。 |
| [法务客户接待专员](assets/agency-agents-zh/specialized/legal-client-intake.md) | 筛选潜在客户，收集案件信息，安排咨询时间，做利益冲突排查，输出接案摘要。 |
| [法务文档审核员](assets/agency-agents-zh/specialized/legal-document-review.md) | 审阅合同与诉讼文书，提炼要点、标注风险条款，比对版本差异并核查合规性。 |
| [养殖档案核对员](assets/agency-agents-zh/specialized/livestock-archive-auditor.md) | 核对畜禽养殖档案 Excel 与生产日报，按子表独立审计兽药、饲料、诊疗、免疫、生产记录等错填漏填，FIFO 复核批号，输出可直接整改的中文问题表述。 |
| [信贷专员助理](assets/agency-agents-zh/specialized/loan-officer-assistant.md) | 收集借款人资料，做初步资质判断，跟进贷款流程，报价并协调签约与放款。 |
| [LSP/索引工程师](assets/agency-agents-zh/specialized/lsp-index-engineer.md) | 基于语言服务器协议搭建代码智能系统，编排 LSP 客户端，维护语义索引。 |
| [并购整合经理](assets/agency-agents-zh/specialized/ma-integration-manager.md) | 制定并购后整合方案，协调各业务线落地，跟踪协同效应，管理过渡期服务协议。 |
| [医疗计费编码专家](assets/agency-agents-zh/specialized/medical-billing-coding-specialist.md) | 按 ICD 与 CPT 规范编码，提交理赔申请，处理拒赔，优化收入周期并做合规审计。 |
| [运营经理](assets/agency-agents-zh/specialized/operations-manager.md) | 梳理业务流程，制定产能计划与考核指标，管理供应商，用精益方法持续降本提效。 |
| [组织心理学家](assets/agency-agents-zh/specialized/organizational-psychologist.md) | 诊断团队协作、心理安全与倦怠风险，评估组织氛围，向管理层提出改善方案。 |
| [职业发展导师](assets/agency-agents-zh/specialized/personal-growth-mentor.md) | 帮助梳理目标、设计习惯与行动计划，定期跟进进度，督促执行并复盘调整。 |
| [通用提示词工程师](assets/agency-agents-zh/specialized/prompt-engineer.md) | 专注大语言模型提示词设计与优化的专家，精通系统提示词架构、思维链设计、少样本学习策略、以及提示词效果评测和迭代方法论。 |
| [房产买卖顾问](assets/agency-agents-zh/specialized/real-estate-buyer-seller.md) | 服务买卖双方，管理房源信息，协助谈判与交易手续，跟进过户直到交房。 |
| [招聘专员](assets/agency-agents-zh/specialized/recruitment-specialist.md) | 使用主流招聘平台寻访候选人，组织面试评估，把控流程合规，维护雇主品牌。 |
| [报告分发专员](assets/agency-agents-zh/specialized/report-distribution-agent.md) | 按区域参数配置分发名单，自动向对应人员推送销售报告，维护分发任务与送达状态。 |
| [简历优化顾问](assets/agency-agents-zh/specialized/resume-tailor.md) | 分析岗位要求，匹配候选人经历，优化关键词与表述，不虚构任何经历与能力。 |
| [零售售后客服](assets/agency-agents-zh/specialized/retail-customer-returns.md) | 处理线上线下的退换货与退款，执行售后政策，识别欺诈，分析退货数据并优化流程。 |
| [销售数据专员](assets/agency-agents-zh/specialized/sales-data-extraction-agent.md) | 监控 Excel 销售数据文件，提取当月、累计与年末指标，供内部实时报表使用。 |
| [销售拓展专员](assets/agency-agents-zh/specialized/sales-outreach.md) | 开发新客户线索，跟进意向客户，处理异议，撰写方案并维护销售漏斗。 |
| [AI 治理政策专家](assets/agency-agents-zh/specialized/specialized-ai-policy-writer.md) | 面向中国企业和机构的 AI 治理与合规专家，精通《生成式 AI 管理办法》、算法备案制度、深度合成管理规定、大模型安全评估流程及 AI 伦理审查机制，帮助组织构建符合中国监管要求的 AI 治理框架并落地执行。 |
| [幕僚长](assets/agency-agents-zh/specialized/specialized-chief-of-staff.md) | 为创始人统筹事务与日程，过滤信息噪音，跟进流程与决策落地，保证输出一致。 |
| [土木工程师](assets/agency-agents-zh/specialized/specialized-civil-engineer.md) | 负责结构分析与岩土设计，编制施工文档，核查建筑规范，支持多标准国际项目交付。 |
| [遗留系统工程师](assets/agency-agents-zh/specialized/specialized-codebase-archaeologist.md) | 审计被多个 AI 编程工具改动过的代码库，排查逻辑矛盾、死代码与文档偏离，输出修复方案。 |
| [跨文化咨询顾问](assets/agency-agents-zh/specialized/specialized-cultural-intelligence-strategist.md) | 审查产品与内容中的文化偏差，研究目标市场语境，确保软件在不同文化背景下表达得体。 |
| [开发者布道师](assets/agency-agents-zh/specialized/specialized-developer-advocate.md) | 运营开发者社区，撰写技术内容与文档，收集反馈推动产品改进，促进平台采用。 |
| [文档工程师](assets/agency-agents-zh/specialized/specialized-document-generator.md) | 用代码方式生成 PDF、PPT、Word、Excel 文档，处理排版、图表与数据可视化。 |
| [FedRAMP 与 RMF 合规工程师](assets/agency-agents-zh/specialized/specialized-fedramp-rmf-compliance.md) | 负责云产品通过 FedRAMP 授权，编写系统安全计划，配合第三方评估，维护持续监控与整改清单。 |
| [法国市场咨询顾问](assets/agency-agents-zh/specialized/specialized-french-consulting-market.md) | 为赴法自由职业者解读当地用工与平台生态，指导定价与合同模式，规避支付风险。 |
| [韩国市场咨询顾问](assets/agency-agents-zh/specialized/specialized-korean-business-navigator.md) | 为外籍人士讲解韩国商务文化，涵盖决策流程、职场礼仪与沟通习惯，指导商务合作。 |
| [总体规划架构师](assets/agency-agents-zh/specialized/specialized-master-plan-architect.md) | 负责总体方案规划、技术讲解与风险审查，编写完整、可执行的 Markdown 实施计划，不直接执行代码。 |
| [MCP 集成工程师](assets/agency-agents-zh/specialized/specialized-mcp-builder.md) | 设计并实现 MCP 服务端，为智能体提供自定义工具、资源与提示，完成测试与发布。 |
| [会议效率专家](assets/agency-agents-zh/specialized/specialized-meeting-assistant.md) | 面向中国企业的会议管理与效率提升专家，精通飞书、钉钉、腾讯会议等协作平台，擅长会议纪要撰写、行动项追踪、议程设计、OKR 周会组织及跨时区会议协调，帮助团队将会议从“时间黑洞”变为“决策引擎”。 |
| [模型质量评估工程师](assets/agency-agents-zh/specialized/specialized-model-qa.md) | 独立审计机器学习与统计模型，复核数据与文档，复现结果，校验性能与可解释性，输出审计报告。 |
| [定价分析师](assets/agency-agents-zh/specialized/specialized-pricing-analyst.md) | 调研市场与竞品定价，分析成本结构，设计定价模型，监控毛利并持续调优。 |
| [动态定价策略师](assets/agency-agents-zh/specialized/specialized-pricing-optimizer.md) | 专注电商动态定价与促销策略的价格优化专家，精通淘宝、京东、拼多多等平台的价格机制、大促定价规则、竞品价格监控和利润最大化策略，帮助商家在激烈的价格战中实现利润与销量的最优平衡。 |
| [企业风险评估师](assets/agency-agents-zh/specialized/specialized-risk-assessor.md) | 面向中国企业的全面风险管理专家，精通国企风控体系建设、内控合规（COSO 框架本土化）、审计整改、ESG 风险管理及供应链风险评估，帮助企业构建系统化的风险识别、评估与应对机制，提升组织韧性。 |
| [Salesforce 架构师](assets/agency-agents-zh/specialized/specialized-salesforce-architect.md) | 负责 Salesforce 平台方案设计，规划多云集成、数据模型与部署策略，控制平台限制。 |
| [竞争战略分析师](assets/agency-agents-zh/specialized/specialized-strategy-duel-agent.md) | 用博弈论推演竞争对抗，模拟对手策略与反应，输出攻防建议与应对方案。 |
| [工作流架构师](assets/agency-agents-zh/specialized/specialized-workflow-architect.md) | 梳理系统与业务流程，绘制完整流程分支、失败与恢复路径，输出可直接实现的规格文档。 |
| [留学顾问](assets/agency-agents-zh/specialized/study-abroad-advisor.md) | 规划美英澳加及港澳新留学方案，指导选校、文书与标化考试，协助签证与行前准备。 |
| [供应链规划师](assets/agency-agents-zh/specialized/supply-chain-strategist.md) | 开发与管理供应商，做战略寻源与质量控制，推进供应链数字化，提升交付效率。 |
| [技术翻译专家](assets/agency-agents-zh/specialized/technical-translator-agent.md) | 专注于技术领域的中英文双向翻译，精通编程、AI、云计算等技术术语，确保技术文档的准确性和专业性 |
| [旅行规划师](assets/agency-agents-zh/specialized/travel-planner.md) | 面向中国旅行者的行程规划专家，精通国内游与出境游的路线设计、交通住宿组合、签证与证件准备、预算控制和旺季避坑——产出可直接照着走的逐日行程，而非景点清单的堆砌。 |
| [零知识证明工程师](assets/agency-agents-zh/specialized/zk-steward.md) | 用卡片盒笔记法搭建和维护知识库，建立笔记关联，定期校验条目质量，支持跨领域决策。 |

<a id="experts-support"></a>

### 支持

共 7 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [分析报表专员](assets/agency-agents-zh/support/support-analytics-reporter.md) | 整理业务数据，制作日报、月报和可视化看板，跟踪关键指标，输出分析结论供各部门使用。 |
| [管理报告专员](assets/agency-agents-zh/support/support-executive-summary-generator.md) | 把会议记录、项目材料提炼成简短汇报，撰写管理层摘要和决策参考，保证信息准确完整。 |
| [财务跟踪专员](assets/agency-agents-zh/support/support-finance-tracker.md) | 记录日常收支，核对报销和账单，跟踪预算执行情况，定期输出现金流和费用报表。 |
| [基础设施运维工程师](assets/agency-agents-zh/support/support-infrastructure-maintainer.md) | 维护服务器和网络环境，部署系统更新，监控运行状态，处理故障并保障服务稳定可用。 |
| [合规检查专员](assets/agency-agents-zh/support/support-legal-compliance-checker.md) | 检查业务操作、数据处理和对外内容是否符合法规与行业标准，输出合规意见和整改清单。 |
| [招聘运营专家](assets/agency-agents-zh/support/support-recruitment-specialist.md) | 专业的招聘运营与人才获取专家，精通中国主流招聘渠道运营、人才评估体系搭建和劳动法合规管理。帮助企业高效吸引、筛选和留住优秀人才，打造有竞争力的雇主品牌。 |
| [客服响应专员](assets/agency-agents-zh/support/support-support-responder.md) | 通过在线客服、电话等渠道解答客户咨询，记录并跟进问题，处理投诉，整理常见问题文档。 |

<a id="experts-supply-chain"></a>

### 供应链

共 4 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [服装工厂规划工程师](assets/agency-agents-zh/supply-chain/supply-chain-garment-factory-planning-engineer.md) | 全球多基地服装工厂规划专家——精通牛仔/羽绒服/无痕内衣/针织产线全流程设计，覆盖场地规划、产能测算、设备选型、精益优化与多国合规，支持中文/英文/法语/柬埔寨语 |
| [库存预测专家](assets/agency-agents-zh/supply-chain/supply-chain-inventory-forecaster.md) | 专注需求预测与库存管理的供应链专家，擅长基于历史销售数据和市场趋势的精准需求预测、安全库存计算、补货策略优化，帮助企业在中国电商大促节奏下实现"不断货、不积压"的库存平衡。 |
| [物流路线优化师](assets/agency-agents-zh/supply-chain/supply-chain-route-optimizer.md) | 专注物流配送路线规划与成本优化的供应链专家，精通中国快递物流体系、同城配送网络、冷链运输和跨境物流方案，帮助企业在保障时效的前提下实现物流成本最优。 |
| [供应商评估专家](assets/agency-agents-zh/supply-chain/supply-chain-vendor-evaluator.md) | 专注供应商全生命周期管理的采购策略专家，擅长供应商筛选与评分、验厂审核、质量管理体系搭建、账期与成本谈判，帮助企业在1688等采购平台上建立稳定可靠的供应商体系。 |

<a id="experts-testing"></a>

### 测试

共 10 名专家。

| 专家 | 专长与适用场景 |
| --- | --- |
| [无障碍测试工程师](assets/agency-agents-zh/testing/testing-accessibility-auditor.md) | 按 WCAG 标准逐项审计网页和 App 界面，用屏幕阅读器等辅助工具实测，记录无障碍问题并给出修复建议。 |
| [API 测试工程师](assets/agency-agents-zh/testing/testing-api-tester.md) | 编写并执行接口测试用例，验证功能、鉴权、性能和异常处理，覆盖内部系统与第三方集成，输出测试报告。 |
| [嵌入式测试工程师](assets/agency-agents-zh/testing/testing-embedded-qa-engineer.md) | 嵌入式系统质量保障专家——精通硬件在环测试（HIL）、固件自动化测试、OTA 回归、EMC/ESD 测试规划、量产测试夹具设计、故障注入与可靠性验证。 |
| [质量记录专员](assets/agency-agents-zh/testing/testing-evidence-collector.md) | 测试过程中截图取证，记录缺陷复现步骤和现场证据，每个问题附上可核实的截图材料，供开发定位和复测。 |
| [性能基准测试工程师](assets/agency-agents-zh/testing/testing-performance-benchmarker.md) | 对系统和应用进行压测与基准测量，定位响应慢、吞吐低的环节，给出调优建议并验证优化后的效果。 |
| [验收测试工程师](assets/agency-agents-zh/testing/testing-reality-checker.md) | 按验收标准逐项核验交付物，凭测试证据判断是否达到上线条件，不达标则打回并说明缺失项。 |
| [测试自动化工程师](assets/agency-agents-zh/testing/testing-test-automation-engineer.md) | 用 Playwright 和 Cypress 编写端到端自动化用例，处理元素定位与用例稳定性，接入 CI 并行执行，用 trace 排查失败。 |
| [测试结果分析师](assets/agency-agents-zh/testing/testing-test-results-analyzer.md) | 汇总各轮测试结果，统计缺陷分布和用例通过率，定位高频问题模块，输出分析结论和改进建议。 |
| [测试工具评估工程师](assets/agency-agents-zh/testing/testing-tool-evaluator.md) | 试用并对比测试工具与软件平台，按业务场景评估功能和成本，输出选型建议和试用结论。 |
| [测试流程优化工程师](assets/agency-agents-zh/testing/testing-workflow-optimizer.md) | 梳理测试流程中的堵点和重复劳动，设计优化方案并用工具落地自动化，缩短测试周期、降低返工。 |

## 配置与边界

| 配置项 | 默认值 | 作用 |
| --- | --- | --- |
| `root` | 包内专家资产 | 外部专家根目录；显式配置优先。 |
| `provider` | `spawn` | DSH 子代理 provider，可使用支持 persona 与工具过滤的 `fork`。 |
| `divisions` | 22 个标准分区 | 需要扫描的顶层分区。 |
| `maxDepth` | 未设置 | 正整数形式的绝对子代理深度上限。 |

也可设置 `AGENCY_AGENTS_ROOT` 环境变量指定外部专家目录。外部目录里的 persona 正文会注入为子代理系统提示，只应从可信来源加载。子代理 provider 必须支持 persona 和工具过滤能力。`summon_experts` 一次最多 8 名专家，并发 4，部分失败仍返回成功结果。

## 二次开发

- Host 端入口：[src\index.ts](src/index.ts)，负责加载专家目录、注册工具和设置项。
- Remote 契约与实现：[src\remote-contract.ts](src/remote-contract.ts)、[src\remote.ts](src/remote.ts)。
- 客户端入口：[src\client\index.ts](src/client/index.ts)，负责设置页、输入框按钮与 `@` 触发器。
- 内置 persona 位于 `assets\agency-agents`；保留其中的 MIT 许可证和 [NOTICE](NOTICE) 归属说明。

修改 `src` 或 `assets` 后，重新构建并以本地目录安装验证：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
pnpm verify
dsh plugin --profile web add .
```

交接与迭代文档只保留在本机 `docs` 目录，不纳入 Git；克隆仓库后不会得到交接入口。

发布包只包含 `lib`、`assets`、补丁和根目录说明/许可证；不要将 `node_modules` 或本地开发文件加入发布内容。

## 验证

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
pnpm verify
```

`prepublishOnly` 会在发布前依次执行上述构建、测试和包完整性检查。

## 许可证与归属

本项目 TypeScript 源码、构建脚本和文档采用 [Apache License 2.0](LICENSE)。内置专家 persona 源自 [The Agency](https://github.com/msitarzewski/agency-agents)，仍采用 MIT，许可证位于 [assets\agency-agents\LICENSE](assets/agency-agents/LICENSE)。

## 更新日志

最近五个发布版本见 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)。
