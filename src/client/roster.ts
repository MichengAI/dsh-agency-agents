// 由 scripts/generate-roster.mjs 生成，勿手改。
export interface RosterEntry {
  readonly slug: string
  readonly nameEn: string
  readonly emoji: string
  readonly division: string
  readonly description: string
  readonly descriptionEn: string
}

export const ROSTER: ReadonlyArray<RosterEntry> = [
  {
    "slug": "academic-anthropologist",
    "nameEn": "Anthropologist",
    "emoji": "🌍",
    "division": "academic",
    "description": "开展田野调查与参与式观察，研究群体文化、亲属制度、仪式和信仰，撰写民族志报告，为跨文化业务提供文化背景判断。",
    "descriptionEn": "Expert in cultural systems, rituals, kinship, belief systems, and ethnographic method — builds culturally coherent societies that feel lived-in rather than invented"
  },
  {
    "slug": "academic-geographer",
    "nameEn": "Geographer",
    "emoji": "🗺️",
    "division": "academic",
    "description": "研究地形、气候、资源与人口分布的相互关系，做空间分析与制图，输出区域研究报告，支撑选址、规划和灾害风险评估。",
    "descriptionEn": "Expert in physical and human geography, climate systems, cartography, and spatial analysis — builds geographically coherent worlds where terrain, climate, resources, and settlement patterns make scientific sense"
  },
  {
    "slug": "academic-historian",
    "nameEn": "Historian",
    "emoji": "📚",
    "division": "academic",
    "description": "查阅档案和一手文献，核查史实、梳理历史分期，撰写研究论著，为出版物、影视与公共叙事提供史实把关。",
    "descriptionEn": "Expert in historical analysis, periodization, material culture, and historiography — validates historical coherence and enriches settings with authentic period detail grounded in primary and secondary sources"
  },
  {
    "slug": "academic-narratologist",
    "nameEn": "Narratologist",
    "emoji": "📜",
    "division": "academic",
    "description": "分析故事结构、人物弧线与叙述视角，运用叙事理论评审小说和剧本，为创作提供结构设计与修改建议。",
    "descriptionEn": "Expert in narrative theory, story structure, character arcs, and literary analysis — grounds advice in established frameworks from Propp to Campbell to modern narratology"
  },
  {
    "slug": "academic-psychologist",
    "nameEn": "Psychologist",
    "emoji": "🧠",
    "division": "academic",
    "description": "研究人的行为、人格、动机与认知规律，开展测评和访谈，输出行为分析结论，支撑产品设计与组织管理。",
    "descriptionEn": "Expert in human behavior, personality theory, motivation, and cognitive patterns — builds psychologically credible characters and interactions grounded in clinical and research frameworks"
  },
  {
    "slug": "academic-statistician",
    "nameEn": "Statistician",
    "emoji": "📊",
    "division": "academic",
    "description": "设计实验方案，处理调查和试验数据，做统计推断与显著性检验，出具分析报告，区分真实信号与随机噪声。",
    "descriptionEn": "Expert in quantitative research methodology, experimental design, and statistical inference — pressure-tests claims, designs sound studies, and separates real signal from noise, chance, and bias"
  },
  {
    "slug": "accounts-payable-agent",
    "nameEn": "Accounts Payable Agent",
    "emoji": "💸",
    "division": "specialized",
    "description": "处理供应商付款、承包商发票与周期性账单，支持多种支付渠道，确保付款准确及时，并跟进对账。",
    "descriptionEn": "Autonomous payment processing specialist that executes vendor payments, contractor invoices, and recurring bills across any payment rail — crypto, fiat, stablecoins. Integrates with AI agent workflows via tool calls."
  },
  {
    "slug": "agentic-identity-trust",
    "nameEn": "Agentic Identity & Trust Architect",
    "emoji": "🔐",
    "division": "specialized",
    "description": "为多智能体系统设计身份认证与信任校验体系，让智能体的身份、权限和操作记录都可验证。",
    "descriptionEn": "Designs identity, authentication, and trust verification systems for autonomous AI agents operating in multi-agent environments. Ensures agents can prove who they are, what they're authorized to do, and what they actually did."
  },
  {
    "slug": "agents-orchestrator",
    "nameEn": "Agents Orchestrator",
    "emoji": "🎛️",
    "division": "specialized",
    "description": "拆解开发任务，编排各环节流程，协调成员推进，把控进度与交付质量。",
    "descriptionEn": "Autonomous pipeline manager that orchestrates the entire development workflow. You are the leader of this process."
  },
  {
    "slug": "automation-governance-architect",
    "nameEn": "Automation Governance Architect",
    "emoji": "⚙️",
    "division": "specialized",
    "description": "审计自动化流程的价值、风险与可维护性，制定治理规范，评审后再上线实施。",
    "descriptionEn": "Governance-first architect for business automations (n8n-first) who audits value, risk, and maintainability before implementation."
  },
  {
    "slug": "backend-architect-with-memory",
    "nameEn": "Backend Architect",
    "emoji": "💾",
    "division": "engineering",
    "description": "负责服务端系统架构设计，规划数据库与微服务拆分，搭建云基础设施，交付高并发、高可用的后端服务。",
    "descriptionEn": "Senior backend architect specializing in scalable system design, database architecture, API development, and cloud infrastructure. Builds robust, secure, performant server-side applications and microservices"
  },
  {
    "slug": "blender-addon-engineer",
    "nameEn": "Blender Add-on Engineer",
    "emoji": "🧩",
    "division": "game-development",
    "description": "用 Python 为 Blender 开发插件，包括资产校验、导出器和管线自动化，把重复的 DCC 操作变成一键流程，供美术团队日常使用。",
    "descriptionEn": "Blender tooling specialist - Builds Python add-ons, asset validators, exporters, and pipeline automations that turn repetitive DCC work into reliable one-click workflows"
  },
  {
    "slug": "business-strategist",
    "nameEn": "Business Strategist",
    "emoji": "♟️",
    "division": "specialized",
    "description": "分析竞争格局与市场机会，设计商业模式，制定增长与进入策略，输出可执行的决策建议。",
    "descriptionEn": "Senior management consulting specialist for competitive analysis, market entry strategy, business model design, growth planning, organizational strategy, and strategic decision-making — translating complex market dynamics into clear, actionable strategies that create sustainable competitive advantage"
  },
  {
    "slug": "change-management-consultant",
    "nameEn": "Change Management Consultant",
    "emoji": "🔄",
    "division": "specialized",
    "description": "运用成熟框架推进组织变革，管理抵触与采纳过程，确保新制度在落地后持续生效。",
    "descriptionEn": "Expert change management specialist using ADKAR, Kotter, and Prosci frameworks to guide organizations through technology implementations, restructuring, culture transformation, and M&A integration — managing resistance, building adoption, and ensuring changes stick long after go-live"
  },
  {
    "slug": "chief-financial-officer",
    "nameEn": "Chief Financial Officer",
    "emoji": "💼",
    "division": "specialized",
    "description": "统筹资金调度、财务规划与投融资事项，向董事会汇报财务状况，支撑重大经营决策。",
    "descriptionEn": "Strategic finance executive who governs capital allocation, treasury operations, financial planning, M&A finance, investor relations, and board reporting — translating financial complexity into clear decisions that drive business performance and stakeholder confidence."
  },
  {
    "slug": "corporate-training-designer",
    "nameEn": "Corporate Training Designer",
    "emoji": "📚",
    "division": "specialized",
    "description": "做培训需求调研，设计课程体系与培养方案，组织授课并评估培训效果，持续迭代。",
    "descriptionEn": "Expert in enterprise training system design and curriculum development — proficient in training needs analysis, instructional design methodology, blended learning program design, internal trainer development, leadership programs, and training effectiveness evaluation and continuous optimization."
  },
  {
    "slug": "customer-service",
    "nameEn": "Customer Service",
    "emoji": "🎧",
    "division": "specialized",
    "description": "解答咨询、处理投诉与账户问题，跟进工单并按规定升级，维护客户满意度。",
    "descriptionEn": "Friendly, professional customer service specialist for any industry — handling inquiries, complaints, account support, FAQs, and seamless escalation with warmth, efficiency, and a genuine commitment to customer satisfaction"
  },
  {
    "slug": "customer-success-manager",
    "nameEn": "Customer Success Manager",
    "emoji": "🌟",
    "division": "specialized",
    "description": "负责客户上线与使用辅导，跟踪健康度，组织季度回顾，推动续约与增购，降低流失。",
    "descriptionEn": "Strategic customer success specialist for onboarding, health scoring, QBR facilitation, churn prevention, expansion identification, and renewal management — driving net revenue retention by turning customers into long-term partners who achieve measurable outcomes"
  },
  {
    "slug": "data-consolidation-agent",
    "nameEn": "Data Consolidation Agent",
    "emoji": "🗄️",
    "division": "specialized",
    "description": "汇总各渠道销售数据，按区域、人员与管线维度整理，维护实时报表看板。",
    "descriptionEn": "AI agent that consolidates extracted sales data into live reporting dashboards with territory, rep, and pipeline summaries"
  },
  {
    "slug": "data-privacy-officer",
    "nameEn": "Data Privacy Officer",
    "emoji": "🔐",
    "division": "specialized",
    "description": "搭建数据隐私合规体系，开展数据映射与影响评估，处理泄露事件，对接监管要求。",
    "descriptionEn": "Corporate data privacy specialist and DPO who builds GDPR, CCPA, and global privacy compliance programs — covering data mapping, privacy impact assessments, consent management, breach response, vendor due diligence, and regulatory engagement."
  },
  {
    "slug": "design-brand-guardian",
    "nameEn": "Brand Guardian",
    "emoji": "🎨",
    "division": "design",
    "description": "负责品牌识别系统的开发与落地，统一各渠道的视觉规范，确保品牌形象在物料和产品中保持一致。",
    "descriptionEn": "Expert brand strategist and guardian specializing in brand identity development, consistency maintenance, and strategic brand positioning"
  },
  {
    "slug": "design-image-prompt-engineer",
    "nameEn": "Image Prompt Engineer",
    "emoji": "📷",
    "division": "design",
    "description": "为 AI 图像生成工具撰写提示词，把创意构想转成精确的视觉描述，产出专业级摄影与图像素材。",
    "descriptionEn": "Expert photography prompt engineer specializing in crafting detailed, evocative prompts for AI image generation. Masters the art of translating visual concepts into precise language that produces stunning, professional-quality photography through generative AI tools."
  },
  {
    "slug": "design-inclusive-visuals-specialist",
    "nameEn": "Inclusive Visuals Specialist",
    "emoji": "🌈",
    "division": "design",
    "description": "排查并纠正 AI 生成内容中的刻板印象与偏见，产出文化准确、符合多元人群的图片和视频素材。",
    "descriptionEn": "Representation expert who defeats systemic AI biases to generate culturally accurate, affirming, and non-stereotypical images and video."
  },
  {
    "slug": "design-persona-walkthrough",
    "nameEn": "Persona Walkthrough Specialist",
    "emoji": "🎭",
    "division": "design",
    "description": "按目标用户画像逐屏走查网页，记录每屏的情感与理性反应，输出带优化建议的转化率改进报告。",
    "descriptionEn": "Simulate cognitive walkthroughs of web pages from a defined persona's psychological perspective — captures emotional reactions and rational thought at each scroll position, then delivers structured CRO reports grounded in LIFT, Cialdini, and Fogg frameworks"
  },
  {
    "slug": "design-ui-designer",
    "nameEn": "UI Designer",
    "emoji": "🎨",
    "division": "design",
    "description": "搭建视觉设计系统和组件库，绘制符合品牌规范的界面，交付可复用的高保真设计稿。",
    "descriptionEn": "Expert UI designer specializing in visual design systems, component libraries, and pixel-perfect interface creation. Creates beautiful, consistent, accessible user interfaces that enhance UX and reflect brand identity"
  },
  {
    "slug": "design-ui-finish-gate-reviewer",
    "nameEn": "UI Finish-Gate Reviewer",
    "emoji": "🧱",
    "division": "design",
    "description": "依据设计契约对照线上界面逐项验收，在发布前拦截通用、雷同的界面，输出整改清单。",
    "descriptionEn": "Product-interface reviewer who catches generic, interchangeable UI before it ships by grounding critique in real product evidence, a written design contract, and a hard implementation finish gate."
  },
  {
    "slug": "design-ux-architect",
    "nameEn": "UX Architect",
    "emoji": "📐",
    "division": "design",
    "description": "为开发团队梳理信息架构与交互流程，制定 CSS 系统规范，输出可直接落地的界面实现指引。",
    "descriptionEn": "Technical architecture and UX specialist who provides developers with solid foundations, CSS systems, and clear implementation guidance"
  },
  {
    "slug": "design-ux-researcher",
    "nameEn": "UX Researcher",
    "emoji": "🔬",
    "division": "design",
    "description": "开展用户访谈与可用性测试，分析行为数据，把发现整理成可执行的设计改进建议。",
    "descriptionEn": "Expert user experience researcher specializing in user behavior analysis, usability testing, and data-driven design insights. Provides actionable research findings that improve product usability and user satisfaction"
  },
  {
    "slug": "design-visual-storyteller",
    "nameEn": "Visual Storyteller",
    "emoji": "🎬",
    "division": "design",
    "description": "把复杂信息转成图表、插画与动态素材，用视觉语言讲清品牌故事，产出传播与发布用的设计内容。",
    "descriptionEn": "Expert visual communication specialist focused on creating compelling visual narratives, multimedia content, and brand storytelling through design. Specializes in transforming complex information into engaging visual stories that connect with audiences and drive emotional engagement."
  },
  {
    "slug": "design-whimsy-injector",
    "nameEn": "Whimsy Injector",
    "emoji": "✨",
    "division": "design",
    "description": "在品牌触点中加入趣味与惊喜元素，设计让人记住的互动细节和活动物料，提升品牌辨识度。",
    "descriptionEn": "Expert creative specialist focused on adding personality, delight, and playful elements to brand experiences. Creates memorable, joyful interactions that differentiate brands through unexpected moments of whimsy"
  },
  {
    "slug": "economy-designer",
    "nameEn": "Economy Designer",
    "emoji": "💰",
    "division": "game-development",
    "description": "设计游戏内的货币、产出与消耗系统，制定数值回收规则，根据玩家数据调整经济平衡，控制通胀并支撑商业化。",
    "descriptionEn": "Virtual economy architect - Masters currency systems, sources and sinks, monetization modeling, inflation control, and data-driven economic balancing for live games"
  },
  {
    "slug": "engineering-ai-data-remediation-engineer",
    "nameEn": "AI Data Remediation Engineer",
    "emoji": "🧬",
    "division": "engineering",
    "description": "负责检测并修复数据管道中的异常数据，用本地模型和聚类手段自动分类问题数据，保证修复过程零丢失。",
    "descriptionEn": "Specialist in self-healing data pipelines — uses air-gapped local SLMs and semantic clustering to automatically detect, classify, and fix data anomalies at scale. Focuses exclusively on the remediation layer: intercepting bad data, generating deterministic fix logic via Ollama, and guaranteeing zero data loss. Not a general data engineer — a surgical specialist for when your data is broken and the pipeline can't stop."
  },
  {
    "slug": "engineering-ai-engineer",
    "nameEn": "AI Engineer",
    "emoji": "🤖",
    "division": "engineering",
    "description": "负责机器学习模型的开发与部署，把模型接入生产系统，建设数据管线，交付可用的 AI 功能。",
    "descriptionEn": "Expert AI/ML engineer specializing in machine learning model development, deployment, and integration into production systems. Focused on building intelligent features, data pipelines, and AI-powered applications with emphasis on practical, scalable solutions."
  },
  {
    "slug": "engineering-api-platform-engineer",
    "nameEn": "API Platform Engineer",
    "emoji": "🔌",
    "division": "engineering",
    "description": "负责对外 API 的设计与治理，制定 OpenAPI/gRPC 契约、版本与下线策略，维护网关鉴权和限流，输出 SDK 与开发者文档。",
    "descriptionEn": "Expert API platform engineer for public and partner APIs — contract-first design (OpenAPI/gRPC), versioning and deprecation policy, SDK generation, API gateway concerns (auth, rate limiting, quotas), and developer-portal DX."
  },
  {
    "slug": "engineering-autonomous-optimization-architect",
    "nameEn": "Autonomous Optimization Architect",
    "emoji": "⚡",
    "division": "engineering",
    "description": "负责给线上 API 做性能压测与调优，建立成本和安全护栏，防止系统因优化失控超支。",
    "descriptionEn": "Intelligent system governor that continuously shadow-tests APIs for performance while enforcing strict financial and security guardrails against runaway costs."
  },
  {
    "slug": "engineering-backend-architect",
    "nameEn": "Backend Architect",
    "emoji": "🏗️",
    "division": "engineering",
    "description": "负责后端系统架构设计与技术选型，规划数据库、API 与云资源，保证服务稳定、安全、可扩展。",
    "descriptionEn": "Senior backend architect specializing in scalable system design, database architecture, API development, and cloud infrastructure. Builds robust, secure, performant server-side applications and microservices"
  },
  {
    "slug": "engineering-cms-developer",
    "nameEn": "CMS Developer",
    "emoji": "🧱",
    "division": "engineering",
    "description": "负责基于 Drupal 和 WordPress 开发主题、插件与内容结构，用代码方式搭建和维护 CMS 站点。",
    "descriptionEn": "Drupal and WordPress specialist for theme development, custom plugins/modules, content architecture, and code-first CMS implementation"
  },
  {
    "slug": "engineering-code-reviewer",
    "nameEn": "Code Reviewer",
    "emoji": "👁️",
    "division": "engineering",
    "description": "负责审查代码的正确性、可维护性与安全性，给出可执行的修改意见，不纠结个人风格偏好。",
    "descriptionEn": "Expert code reviewer who provides constructive, actionable feedback focused on correctness, maintainability, security, and performance — not style preferences."
  },
  {
    "slug": "engineering-codebase-onboarding-engineer",
    "nameEn": "Codebase Onboarding Engineer",
    "emoji": "🧭",
    "division": "engineering",
    "description": "负责帮新同事快速上手陌生代码库，通过读源码、追调用链给出有据可查的代码说明。",
    "descriptionEn": "Expert developer onboarding specialist who helps new engineers understand unfamiliar codebases fast by reading source code, tracing code paths, and stating only facts grounded in the code."
  },
  {
    "slug": "engineering-data-engineer",
    "nameEn": "Data Engineer",
    "emoji": "🔧",
    "division": "engineering",
    "description": "负责搭建 ETL/ELT 数据管道和湖仓架构，用 Spark、dbt 等工具把原始数据加工成可用的分析数据。",
    "descriptionEn": "Expert data engineer specializing in building reliable data pipelines, lakehouse architectures, and scalable data infrastructure. Masters ETL/ELT, Apache Spark, dbt, streaming systems, and cloud data platforms to turn raw data into trusted, analytics-ready assets."
  },
  {
    "slug": "engineering-data-visualization-engineer",
    "nameEn": "Data Visualization Engineer",
    "emoji": "📈",
    "division": "engineering",
    "description": "负责设计图表与数据可视化方案，按数据特点选图表类型，用 D3、Vega 实现交互图表并保证大数据量渲染流畅。",
    "descriptionEn": "Expert data visualization engineer — chart-type selection by data and question, perceptually honest encodings, colorblind-safe data palettes, accessible and interactive charts, and rendering large datasets performantly with D3, Vega, and charting libraries."
  },
  {
    "slug": "engineering-database-optimizer",
    "nameEn": "Database Optimizer",
    "emoji": "🗄️",
    "division": "engineering",
    "description": "负责数据库表结构与索引设计，优化慢查询，调 PostgreSQL、MySQL 等数据库性能。",
    "descriptionEn": "Expert database specialist focusing on schema design, query optimization, indexing strategies, and performance tuning for PostgreSQL, MySQL, and modern databases like Supabase and PlanetScale."
  },
  {
    "slug": "engineering-database-reliability-engineer",
    "nameEn": "Database Reliability Engineer",
    "emoji": "⚓",
    "division": "engineering",
    "description": "负责数据库高可用与容灾，做主从复制、自动切换、备份恢复与无停机变更，保证数据不丢、服务不停。",
    "descriptionEn": "Expert database reliability engineer (DBRE) — high availability and replication, automated failover, backup and point-in-time recovery, zero-downtime online schema migrations, connection pooling, and disaster-recovery drills. Focused on keeping data safe and available, not query tuning."
  },
  {
    "slug": "engineering-desktop-app-engineer",
    "nameEn": "Desktop App Engineer",
    "emoji": "💻",
    "division": "engineering",
    "description": "负责用 Electron 和 Tauri 开发桌面应用，处理进程隔离、签名公证、自动更新与系统原生集成。",
    "descriptionEn": "Expert desktop application engineer for Electron and Tauri — secure IPC and process isolation, code signing and notarization, auto-update pipelines, native OS integration, and resource-footprint discipline."
  },
  {
    "slug": "engineering-developer-tooling-engineer",
    "nameEn": "Developer Tooling Engineer",
    "emoji": "🛠️",
    "division": "engineering",
    "description": "负责开发命令行工具与内部研发平台，设计易用的命令交互、补全提示与跨平台分发，提升开发效率。",
    "descriptionEn": "Expert developer-tooling and CLI engineer — building command-line tools and internal developer platforms with great DX: intuitive command design, helpful errors, shell completions, fast startup, cross-platform distribution, and scriptable, composable interfaces."
  },
  {
    "slug": "engineering-devops-automator",
    "nameEn": "DevOps Automator",
    "emoji": "⚙️",
    "division": "engineering",
    "description": "负责基础设施自动化与 CI/CD 流水线建设，维护云上环境的部署与日常运维。",
    "descriptionEn": "Expert DevOps engineer specializing in infrastructure automation, CI/CD pipeline development, and cloud operations"
  },
  {
    "slug": "engineering-drupal-performance",
    "nameEn": "Drupal Performance Engineer",
    "emoji": "⚡",
    "division": "engineering",
    "description": "负责 Drupal 站点性能优化，调缓存、BigPipe、Views 查询与 PHP-FPM 参数，让页面通过性能审计。",
    "descriptionEn": "Expert Drupal 10/11 performance engineer specializing in Core Web Vitals, render and dynamic page caching, BigPipe, cache tags and contexts, database query and Views optimization, CSS/JS aggregation, responsive images and lazy loading, CDN integration, and opcache/PHP-FPM tuning for fast, audit-passing sites"
  },
  {
    "slug": "engineering-drupal-shopping-cart",
    "nameEn": "Drupal Shopping Cart Engineer",
    "emoji": "🛒",
    "division": "engineering",
    "description": "负责用 Drupal Commerce 搭建商城，配置商品、支付网关、结算流程与促销规则，交付高可用的线上店铺。",
    "descriptionEn": "Expert Drupal e-commerce engineer specializing in Drupal Commerce for product catalog management, payment gateway integration, checkout workflow design, order management, tax and promotion configuration, and high-reliability storefront delivery on Drupal 10/11"
  },
  {
    "slug": "engineering-email-intelligence-engineer",
    "nameEn": "Email Intelligence Engineer",
    "emoji": "📧",
    "division": "engineering",
    "description": "负责从邮件往来中抽取结构化信息，把原始邮件整理成可供 AI 与自动化系统使用的数据。",
    "descriptionEn": "Expert in extracting structured, reasoning-ready data from raw email threads for AI agents and automation systems"
  },
  {
    "slug": "engineering-embedded-firmware-engineer",
    "nameEn": "Embedded Firmware Engineer",
    "emoji": "🔩",
    "division": "engineering",
    "description": "负责嵌入式设备固件开发，基于 ESP32、STM32 等平台编写裸机或 RTOS 程序，完成驱动与通信功能。",
    "descriptionEn": "Specialist in bare-metal and RTOS firmware - ESP32/ESP-IDF, PlatformIO, Arduino, ARM Cortex-M, STM32 HAL/LL, Nordic nRF5/nRF Connect SDK, FreeRTOS, Zephyr"
  },
  {
    "slug": "engineering-feishu-integration-developer",
    "nameEn": "Feishu Integration Developer",
    "emoji": "🔗",
    "division": "engineering",
    "description": "负责基于飞书开放平台做集成开发，实现机器人、审批流、多维表格与消息卡片，打通企业内部协作流程。",
    "descriptionEn": "Full-stack integration expert specializing in the Feishu (Lark) Open Platform — proficient in Feishu bots, mini programs, approval workflows, Bitable (multidimensional spreadsheets), interactive message cards, Webhooks, SSO authentication, and workflow automation, building enterprise-grade collaboration and automation solutions within the Feishu ecosystem."
  },
  {
    "slug": "engineering-filament-optimization-specialist",
    "nameEn": "Filament Optimization Specialist",
    "emoji": "🔧",
    "division": "engineering",
    "description": "负责重构和优化 Filament 管理后台，调整页面结构与交互流程，提升后台易用性和操作效率。",
    "descriptionEn": "Expert in restructuring and optimizing Filament PHP admin interfaces for maximum usability and efficiency. Focuses on impactful structural changes — not just cosmetic tweaks."
  },
  {
    "slug": "engineering-finops-engineer",
    "nameEn": "FinOps Engineer",
    "emoji": "💰",
    "division": "engineering",
    "description": "负责云成本管控，做资源标签与费用拆分，优化实例规格和存储用量，建立成本看板跟踪支出。",
    "descriptionEn": "Expert cloud cost engineer for AWS/GCP/Azure — cost allocation and tagging, rightsizing, commitment planning (reserved instances/savings plans), egress and storage optimization, and unit-economics dashboards that tie spend to business value."
  },
  {
    "slug": "engineering-frontend-developer",
    "nameEn": "Frontend Developer",
    "emoji": "🖥️",
    "division": "engineering",
    "description": "负责 Web 前端开发，用 React、Vue 等框架实现页面与交互，处理兼容性和性能问题。",
    "descriptionEn": "Expert frontend developer specializing in modern web technologies, React/Vue/Angular frameworks, UI implementation, and performance optimization"
  },
  {
    "slug": "engineering-gaussdb-expert",
    "nameEn": "GaussDB Expert Engineer",
    "emoji": "🗄️",
    "division": "engineering",
    "description": "负责 GaussDB OLTP 数据库的架构与调优，设计分布式表结构、优化查询和索引，保障集中式与分布式部署的性能。",
    "descriptionEn": "Expert database specialist focusing on GaussDB OLTP — Huawei's self-developed enterprise-grade relational database (NOT GaussDB(DWS) OLAP, NOT GaussDB(for openGauss) cloud service, NOT GaussDB(for MySQL)). Covers schema design, distributed table design, query optimization, indexing, Ustore engine, and performance tuning for both distributed and centralized deployments."
  },
  {
    "slug": "engineering-git-workflow-master",
    "nameEn": "Git Workflow Master",
    "emoji": "🌿",
    "division": "engineering",
    "description": "负责制定和维护 Git 分支策略与提交规范，处理变基、工作树等协作流程，保证版本管理清晰可控。",
    "descriptionEn": "Expert in Git workflows, branching strategies, and version control best practices including conventional commits, rebasing, worktrees, and CI-friendly branch management."
  },
  {
    "slug": "engineering-i18n-engineer",
    "nameEn": "Internationalization Engineer",
    "emoji": "🌍",
    "division": "engineering",
    "description": "负责产品的国际化改造，处理多语言文案、复数规则、RTL 布局与本地化格式，搭建字符串提取和伪翻译测试流程。",
    "descriptionEn": "Expert i18n engineer for ICU MessageFormat, CLDR plural rules, RTL and bidirectional layouts, locale-aware date/number/currency formatting, string extraction pipelines, and pseudo-localization testing."
  },
  {
    "slug": "engineering-identity-access-engineer",
    "nameEn": "Identity & Access Engineer",
    "emoji": "🔐",
    "division": "engineering",
    "description": "负责身份认证与权限体系，实现 OAuth/OIDC 登录、企业 SSO、SCIM 同步和 RBAC/ABAC 权限模型。",
    "descriptionEn": "Expert identity engineer for OAuth 2.0/OIDC flows, enterprise SSO (SAML/OIDC) and SCIM provisioning, passkeys/WebAuthn, session architecture, and multi-tenant authorization with RBAC/ABAC."
  },
  {
    "slug": "engineering-incident-response-commander",
    "nameEn": "Incident Response Commander",
    "emoji": "🚨",
    "division": "engineering",
    "description": "负责线上故障应急指挥，组织排查与恢复，跟进事后复盘，维护 SLO/SLI 指标和值班机制。",
    "descriptionEn": "Expert incident commander specializing in production incident management, structured response coordination, post-mortem facilitation, SLO/SLI tracking, and on-call process design for reliable engineering organizations."
  },
  {
    "slug": "engineering-iot-fleet-engineer",
    "nameEn": "IoT Fleet Engineer",
    "emoji": "📡",
    "division": "engineering",
    "description": "负责物联网设备接入与运维，做设备注册、MQTT 数据采集、OTA 升级回滚和边缘计算，保证大规模设备稳定在线。",
    "descriptionEn": "Expert IoT and edge fleet engineer — device provisioning and identity, MQTT/telemetry pipelines, staged over-the-air (OTA) firmware updates with rollback, edge compute, and observability across fleets of unreliable, intermittently-connected devices."
  },
  {
    "slug": "engineering-it-service-manager",
    "nameEn": "IT Service Manager",
    "emoji": "🖥️",
    "division": "engineering",
    "description": "负责 IT 服务流程管理，按 ITIL 规范建设服务目录、事件与变更流程，维护 SLA 和配置库，保证服务质量可衡量。",
    "descriptionEn": "Expert IT service management specialist using ITIL 4 framework for service catalog design, incident and problem management, change control, SLA governance, CMDB maintenance, and continual service improvement — ensuring IT delivers reliable, measurable business value across any organization size"
  },
  {
    "slug": "engineering-llm-post-training-engineer",
    "nameEn": "LLM Post-Training Engineer",
    "emoji": "🧪",
    "division": "engineering",
    "description": "负责大模型后训练，做 SFT、偏好优化和强化学习微调，把控模型发布门槛，交付可上线的新版本。",
    "descriptionEn": "Evidence-driven owner for SFT, preference optimization, RLHF/RLVR, MoE post-training, and the release gates that turn a checkpoint into a defensible model change."
  },
  {
    "slug": "engineering-minimal-change-engineer",
    "nameEn": "Minimal Change Engineer",
    "emoji": "✂️",
    "division": "engineering",
    "description": "负责做最小范围的代码改动，只修复明确提出的问题，拒绝无关重构，把变更风险和回归面压到最低。",
    "descriptionEn": "Engineering specialist focused on minimum-viable diffs — fixes only what was asked, refuses scope creep, prefers three similar lines over a premature abstraction. The discipline that prevents bug-fix PRs from becoming refactor avalanches."
  },
  {
    "slug": "engineering-mobile-app-builder",
    "nameEn": "Mobile App Builder",
    "emoji": "📲",
    "division": "engineering",
    "description": "负责移动应用开发，用原生或跨平台框架实现 iOS、Android 客户端功能并跟进发布。",
    "descriptionEn": "Specialized mobile application developer with expertise in native iOS/Android development and cross-platform frameworks"
  },
  {
    "slug": "engineering-mobile-release-engineer",
    "nameEn": "Mobile Release Engineer",
    "emoji": "🚀",
    "division": "engineering",
    "description": "负责 iOS、Android 应用的打包与发布，管理签名证书、fastlane 流水线、应用商店提审和分批放量。",
    "descriptionEn": "Expert mobile release and distribution engineer for iOS and Android — code signing, provisioning, fastlane pipelines, App Store Connect and Play Console submission, phased rollouts, and crash-triaged release health."
  },
  {
    "slug": "engineering-multi-agent-systems-architect",
    "nameEn": "Multi-Agent Systems Architect",
    "emoji": "🕸️",
    "division": "engineering",
    "description": "负责多智能体系统的架构设计，规划智能体拓扑、上下文与信任机制，实现故障恢复和人工介入节点，保证系统可观测。",
    "descriptionEn": "Systems architect specializing in the design, coordination, and governance of multi-agent AI pipelines — covering topology selection, context management, inter-agent trust, failure recovery, human-in-the-loop gating, and observability for production-grade agent systems."
  },
  {
    "slug": "engineering-network-engineer",
    "nameEn": "Network Engineer",
    "emoji": "🌐",
    "division": "engineering",
    "description": "负责网络设备配置与排障，维护 Cisco、Juniper、Palo Alto 的路由交换和防火墙规则，保障网络稳定。",
    "descriptionEn": "Expert network engineer for Cisco IOS/IOS-XE, Cisco ASA/FTD, Juniper Junos, and Palo Alto PAN-OS routing, switching, firewalling, and troubleshooting."
  },
  {
    "slug": "engineering-orgscript-engineer",
    "nameEn": "OrgScript Engineer",
    "emoji": "📜",
    "division": "engineering",
    "description": "负责 OrgScript 语言的设计与实现，编写语法解析、AST 校验和业务规则定义，交付可运行的脚本引擎。",
    "descriptionEn": "Expert in designing, parsing, and implementing OrgScript grammar, AST validation, and business logic definitions."
  },
  {
    "slug": "engineering-payments-billing-engineer",
    "nameEn": "Payments & Billing Engineer",
    "emoji": "💳",
    "division": "engineering",
    "description": "负责支付与计费系统开发，对接 Stripe、Adyen 等支付渠道，处理幂等支付、回调、订阅计费和财务对账。",
    "descriptionEn": "Expert payments engineer for PSP integrations (Stripe, Adyen, Braintree, PayPal), idempotent payment flows, webhook processing, subscription billing, SCA/3DS, PCI scope reduction, and financial reconciliation."
  },
  {
    "slug": "engineering-privacy-engineer",
    "nameEn": "Privacy Engineer",
    "emoji": "🕵️",
    "division": "engineering",
    "description": "负责把隐私要求落到代码里，做敏感数据识别、最小化采集、删除请求自动处理和数据留存策略。",
    "descriptionEn": "Expert privacy engineer who implements privacy in code — PII discovery and classification, data minimization, consent enforcement at the API layer, automated DSAR and deletion across services, pseudonymization/tokenization, and retention automation. Builds the technical controls a privacy policy only promises."
  },
  {
    "slug": "engineering-prompt-engineer",
    "nameEn": "Prompt Engineer",
    "emoji": "🧬",
    "division": "engineering",
    "description": "负责编写和调优大模型提示词，通过测试迭代把模糊需求变成稳定可用的 AI 行为。",
    "descriptionEn": "Specialist in crafting, testing, and systematically optimizing prompts for LLMs — turning vague instructions into reliable, production-grade AI behaviors."
  },
  {
    "slug": "engineering-rag-pipeline-engineer",
    "nameEn": "RAG Pipeline Engineer",
    "emoji": "🔍",
    "division": "engineering",
    "description": "负责搭建和优化 RAG 检索管线，设计分块策略、混合检索与重排，用评测数据持续提升召回质量。",
    "descriptionEn": "Production RAG specialist focused on chunking strategy, retrieval quality, hybrid search, re-ranking, and eval-driven iteration. Builds pipelines that actually retrieve the right context — not just pipelines that run."
  },
  {
    "slug": "engineering-rapid-prototyper",
    "nameEn": "Rapid Prototyper",
    "emoji": "⚡",
    "division": "engineering",
    "description": "负责快速做技术验证和 MVP，用现成框架在短时间内搭建可演示的原型。",
    "descriptionEn": "Specialized in ultra-fast proof-of-concept development and MVP creation using efficient tools and frameworks"
  },
  {
    "slug": "engineering-realtime-collaboration-engineer",
    "nameEn": "Realtime Collaboration Engineer",
    "emoji": "🤝",
    "division": "engineering",
    "description": "负责实时协作功能开发，搭建 WebSocket 消息通道、在线状态和协同编辑，实现断网重连后的数据同步。",
    "descriptionEn": "Expert realtime systems engineer for WebSocket/SSE infrastructure, presence, CRDT and OT-based collaborative editing, offline-first sync engines, and fan-out scaling with reconnect-safe protocols."
  },
  {
    "slug": "engineering-rust-refactoring-specialist",
    "nameEn": "Rust Refactoring Specialist",
    "emoji": "🦀",
    "division": "engineering",
    "description": "负责 Rust 代码库的大规模重构，做模块拆分、重复代码清理、错误处理加固和 Clippy 告警修复，保证改动安全。",
    "descriptionEn": "Expert Rust engineer for repository-scale refactoring, safe renames, module restructuring, duplication removal, panic hardening, ownership improvements, and compiler or Clippy remediation."
  },
  {
    "slug": "engineering-search-relevance-engineer",
    "nameEn": "Search Relevance Engineer",
    "emoji": "🔎",
    "division": "engineering",
    "description": "负责搜索系统的相关性优化，设计索引与分析器，调 BM25 与混合检索参数，用 nDCG 和线上实验评估效果。",
    "descriptionEn": "Expert search engineer for Elasticsearch and OpenSearch — index and analyzer design, BM25 query tuning, hybrid lexical+vector retrieval, and judgment-based relevance evaluation with nDCG and online experiments."
  },
  {
    "slug": "engineering-section-508-specialist",
    "nameEn": "Section 508 Accessibility Specialist",
    "emoji": "♿",
    "division": "engineering",
    "description": "负责网站无障碍改造与合规审计，落实 WCAG 标准、ARIA 和键盘操作，编写 VPAT 报告并通过自动与人工检查。",
    "descriptionEn": "Expert U.S. federal Section 508 accessibility engineer (the 508 legal baseline is WCAG 2.0 Level AA; WCAG 2.1/2.2 AA are recommended best practice, and ADA Title II requires WCAG 2.1 AA for state/local government) specializing in accessible web development, ARIA implementation, screen reader testing (JAWS/NVDA/VoiceOver), keyboard navigation, color contrast, accessible forms and PDFs, VPAT/ACR authoring, automated and manual auditing (axe/WAVE/Lighthouse), and remediation for government and enterprise sites"
  },
  {
    "slug": "engineering-senior-developer",
    "nameEn": "Senior Developer",
    "emoji": "💎",
    "division": "engineering",
    "description": "负责核心功能开发，用 Laravel、Livewire 写业务代码，处理复杂 CSS 和 Three.js 三维交互。",
    "descriptionEn": "Premium implementation specialist - Masters Laravel/Livewire/FluxUI, advanced CSS, Three.js integration"
  },
  {
    "slug": "engineering-software-architect",
    "nameEn": "Software Architect",
    "emoji": "🏛️",
    "division": "engineering",
    "description": "负责系统架构设计与技术决策，用领域驱动设计和常用架构模式拆分模块，保证系统可扩展、可维护。",
    "descriptionEn": "Expert software architect specializing in system design, domain-driven design, architectural patterns, and technical decision-making for scalable, maintainable systems."
  },
  {
    "slug": "engineering-solidity-smart-contract-engineer",
    "nameEn": "Solidity Smart Contract Engineer",
    "emoji": "⛓️",
    "division": "engineering",
    "description": "负责编写和审计 Solidity 智能合约，优化 Gas 消耗，设计可升级代理与 DeFi 协议，保证合约安全上线。",
    "descriptionEn": "Expert Solidity developer specializing in EVM smart contract architecture, gas optimization, upgradeable proxy patterns, DeFi protocol development, and security-first contract design across Ethereum and L2 chains."
  },
  {
    "slug": "engineering-sre",
    "nameEn": "SRE (Site Reliability Engineer)",
    "emoji": "🛡️",
    "division": "engineering",
    "description": "负责系统稳定性保障，制定 SLO 与错误预算，建设监控可观测性，做故障演练并减少重复运维工作。",
    "descriptionEn": "Expert site reliability engineer specializing in SLOs, error budgets, observability, chaos engineering, and toil reduction for production systems at scale."
  },
  {
    "slug": "engineering-technical-writer",
    "nameEn": "Technical Writer",
    "emoji": "📚",
    "division": "engineering",
    "description": "负责编写开发文档、API 参考和教程，把复杂技术讲清楚，保证文档准确、开发者愿意读。",
    "descriptionEn": "Expert technical writer specializing in developer documentation, API references, README files, and tutorials. Transforms complex engineering concepts into clear, accurate, and engaging docs that developers actually read and use."
  },
  {
    "slug": "engineering-uswds-developer",
    "nameEn": "USWDS Developer",
    "emoji": "🏛️",
    "division": "engineering",
    "description": "负责用美国联邦设计系统 USWDS 开发政府网站前端，落地组件、设计令牌与无障碍模式，并接入 CMS。",
    "descriptionEn": "Expert U.S. Web Design System frontend developer specializing in USWDS components and design tokens, accessible-by-default patterns, responsive government UI, Sass settings/theming, the federal design language, integration into CMS platforms (Drupal/WordPress), and compliance with 21st Century IDEA and the Federal Website Standards"
  },
  {
    "slug": "engineering-video-streaming-engineer",
    "nameEn": "Video Streaming Engineer",
    "emoji": "🎬",
    "division": "engineering",
    "description": "负责视频点播与直播链路，做 HLS/DASH 封装、转码阶梯、DRM 加密和 CDN 分发，按播放质量调优。",
    "descriptionEn": "Expert video streaming engineer for adaptive bitrate delivery — HLS/DASH packaging, ffmpeg transcode ladders, CMAF low-latency, DRM, CDN delivery, and QoE-driven player tuning."
  },
  {
    "slug": "engineering-voice-ai-integration-engineer",
    "nameEn": "Voice AI Integration Engineer",
    "emoji": "🎙️",
    "division": "engineering",
    "description": "负责语音转写管线建设，用 Whisper 或云 ASR 做音频处理、字幕生成与说话人分离，并把结果接入业务系统。",
    "descriptionEn": "Expert in building end-to-end speech transcription pipelines using Whisper-style models and cloud ASR services — from raw audio ingestion through preprocessing, transcript cleanup, subtitle generation, speaker diarization, and structured downstream integration into apps, APIs, and CMS platforms."
  },
  {
    "slug": "engineering-webassembly-engineer",
    "nameEn": "WebAssembly Engineer",
    "emoji": "🧩",
    "division": "engineering",
    "description": "负责把 Rust、C++ 代码编译成 WebAssembly 并在浏览器运行，处理与 JS 的边界开销，优化执行性能。",
    "descriptionEn": "Expert WebAssembly engineer — compiling Rust/C++/Go to Wasm, JS interop and the boundary marshalling cost, WASI and server-side runtimes (Wasmtime/Wasmer), the component model, and near-native performance tuning."
  },
  {
    "slug": "engineering-wechat-mini-program-developer",
    "nameEn": "WeChat Mini Program Developer",
    "emoji": "💬",
    "division": "engineering",
    "description": "负责微信小程序开发，用 WXML、WXSS 实现页面，接入支付、订阅消息等微信能力并完成上线。",
    "descriptionEn": "Expert WeChat Mini Program developer specializing in 小程序 development with WXML/WXSS/WXS, WeChat API integration, payment systems, subscription messaging, and the full WeChat ecosystem."
  },
  {
    "slug": "engineering-wordpress-performance",
    "nameEn": "WordPress Performance Engineer",
    "emoji": "⚡",
    "division": "engineering",
    "description": "负责 WordPress 站点性能优化，配置对象缓存与页面缓存，优化数据库查询和静态资源，让页面通过性能审计。",
    "descriptionEn": "Expert WordPress performance engineer specializing in Core Web Vitals, object caching (Redis/Memcached), page caching, database and WP_Query optimization, the Transients API, asset minification/deferral/critical CSS, image optimization and lazy loading, CDN integration, plugin performance auditing, and PHP-FPM/opcache tuning for fast, audit-passing sites"
  },
  {
    "slug": "engineering-wordpress-shopping-cart",
    "nameEn": "WordPress Shopping Cart Engineer",
    "emoji": "🛍️",
    "division": "engineering",
    "description": "负责用 WooCommerce 搭建商城，配置商品、支付网关与结算流程，定制购物车和优惠券，交付转化友好的店铺。",
    "descriptionEn": "Expert WordPress e-commerce engineer specializing in WooCommerce for product catalog management, payment gateway integration, checkout customization, order management, tax and coupon configuration, and conversion-optimized storefront delivery on WordPress"
  },
  {
    "slug": "esg-sustainability-officer",
    "nameEn": "ESG & Sustainability Officer",
    "emoji": "🌱",
    "division": "specialized",
    "description": "搭建 ESG 管理体系，编制披露报告，推进减排项目，对接利益相关方与监管要求。",
    "descriptionEn": "Corporate sustainability strategist and ESG reporting specialist who builds environmental, social, and governance programs, manages disclosures, drives decarbonization initiatives, and aligns business strategy with stakeholder and regulatory expectations."
  },
  {
    "slug": "finance-bookkeeper-controller",
    "nameEn": "Bookkeeper & Controller",
    "emoji": "📒",
    "division": "finance",
    "description": "负责日常账务、银行对账和月度结账，编制财务报表，维护内部控制，确保账目准确、符合会计准则并随时可审计。",
    "descriptionEn": "Expert bookkeeper and controller specializing in day-to-day accounting operations, financial reconciliations, month-end close processes, and internal controls. Ensures the accuracy, completeness, and timeliness of financial records while maintaining GAAP compliance and audit readiness at all times."
  },
  {
    "slug": "finance-financial-analyst",
    "nameEn": "Financial Analyst",
    "emoji": "📊",
    "division": "finance",
    "description": "搭建财务模型，做预测和情景分析，把报表数据整理成经营建议，供战略规划和投资决策使用。",
    "descriptionEn": "Expert financial analyst specializing in financial modeling, forecasting, scenario analysis, and data-driven decision support. Transforms raw financial data into actionable business intelligence that drives strategic planning, investment decisions, and operational optimization."
  },
  {
    "slug": "finance-fpa-analyst",
    "nameEn": "FP&A Analyst",
    "emoji": "📈",
    "division": "finance",
    "description": "编制年度预算和滚动预测，跟踪执行差异并分析原因，向管理层解释数字背后的业务情况。",
    "descriptionEn": "Expert Financial Planning & Analysis (FP&A) analyst specializing in budgeting, variance analysis, financial planning, rolling forecasts, and strategic decision support. Bridges the gap between the numbers and the business narrative to drive operational performance and strategic resource allocation."
  },
  {
    "slug": "finance-investment-researcher",
    "nameEn": "Investment Researcher",
    "emoji": "🔍",
    "division": "finance",
    "description": "研究行业和公司，做尽职调查与估值分析，评估投资风险，输出投资建议支持投资决策。",
    "descriptionEn": "Expert investment researcher specializing in market research, due diligence, portfolio analysis, and asset valuation. Conducts rigorous fundamental and quantitative analysis to identify investment opportunities, assess risks, and support data-driven portfolio decisions across public equities, private markets, and alternative assets."
  },
  {
    "slug": "finance-tax-strategist",
    "nameEn": "Tax Strategist",
    "emoji": "🏛️",
    "division": "finance",
    "description": "制定税务筹划方案，处理跨地区申报和转让定价，在合规前提下合理降低企业税负。",
    "descriptionEn": "Expert tax strategist specializing in tax optimization, multi-jurisdictional compliance, transfer pricing, and strategic tax planning. Navigates complex tax codes to minimize liability while ensuring full regulatory compliance across local, state, federal, and international tax regimes."
  },
  {
    "slug": "game-audio-engineer",
    "nameEn": "Game Audio Engineer",
    "emoji": "🎵",
    "division": "game-development",
    "description": "负责游戏音频方案，集成 FMOD/Wwise 中间件，搭建自适应音乐与空间音效，控制音频性能开销，保证各平台流畅。",
    "descriptionEn": "Interactive audio specialist - Masters FMOD/Wwise integration, adaptive music systems, spatial audio, and audio performance budgeting across all game engines"
  },
  {
    "slug": "game-designer",
    "nameEn": "Game Designer",
    "emoji": "🎮",
    "division": "game-development",
    "description": "编写游戏设计文档，设计核心玩法循环与系统机制，结合玩家心理调整数值和体验，推动玩法落地到项目各阶段。",
    "descriptionEn": "Systems and mechanics architect - Masters GDD authorship, player psychology, economy balancing, and gameplay loop design across all engines and genres"
  },
  {
    "slug": "gis-3d-scene-developer",
    "nameEn": "3D & Scene Developer",
    "emoji": "🏔️",
    "division": "gis",
    "description": "用 Cesium、ArcGIS Scene Viewer 等引擎搭建 Web 端三维场景，制作地形模型与点云可视化，交付可交互的在线三维地图。",
    "descriptionEn": "Web 3D visualization specialist who creates immersive 3D scenes, terrain models, point cloud visualizations, and interactive web experiences using Cesium, ArcGIS Scene Viewer, and modern 3D web frameworks."
  },
  {
    "slug": "gis-analyst",
    "nameEn": "GIS Analyst",
    "emoji": "🖥️",
    "division": "gis",
    "description": "日常制图出图、管理图层、执行空间查询，维护桌面端与 Web 端地理数据的准确性。",
    "descriptionEn": "Day-to-day GIS operator who creates maps, manages layers, performs spatial queries, and maintains geospatial data integrity across desktop and web environments."
  },
  {
    "slug": "gis-bim-specialist",
    "nameEn": "BIM/GIS Specialist",
    "emoji": "🏗️",
    "division": "gis",
    "description": "负责 Revit、IFC 建筑数据与地理信息的转换对接，搭建室内地图与数字孪生模型，支撑设施管理应用。",
    "descriptionEn": "Integration specialist who bridges Building Information Modeling and Geographic Information Systems — Revit/IFC data conversion, indoor mapping, digital twin architecture, and facility management data models."
  },
  {
    "slug": "gis-cartography-designer",
    "nameEn": "Cartography Designer",
    "emoji": "🎨",
    "division": "gis",
    "description": "设计印刷地图与 Web 地图版式，处理配色、字体和注记位置，输出清晰易读的地图成品。",
    "descriptionEn": "Map aesthetics specialist who designs beautiful, readable, and effective maps — color theory, typography, label placement, basemap selection, and visual hierarchy for both print and web."
  },
  {
    "slug": "gis-drone-reality-mapping",
    "nameEn": "Drone/Reality Mapping Specialist",
    "emoji": "🛸",
    "division": "gis",
    "description": "将无人机航拍影像处理成正射影像、数字地形模型、点云和三维网格，产出可直接入库的测绘成果。",
    "descriptionEn": "Photogrammetry and reality capture expert who processes drone imagery into orthomosaics, digital terrain models, point clouds, and 3D meshes — bridging field capture and GIS-ready products."
  },
  {
    "slug": "gis-geoai-ml-engineer",
    "nameEn": "GeoAI/ML Engineer",
    "emoji": "🤖",
    "division": "gis",
    "description": "基于卫星和航拍影像训练机器学习模型，完成目标检测、图像分割与土地覆盖分类，交付解译成果。",
    "descriptionEn": "Geospatial machine learning specialist who builds models for feature extraction, object detection, image segmentation, and land cover classification from satellite and aerial imagery."
  },
  {
    "slug": "gis-geoprocessing-specialist",
    "nameEn": "Geoprocessing Specialist",
    "emoji": "⚙️",
    "division": "gis",
    "description": "用 ArcPy 与 Python 编写地理处理脚本，搭建批处理流程和自定义工具箱，把 ArcGIS Pro 的重复操作自动化。",
    "descriptionEn": "ArcPy and Python toolbox expert who automates spatial workflows — builds .pyt toolboxes, Model Builder processes, batch geoprocessing automation, and custom analysis scripts for ArcGIS Pro."
  },
  {
    "slug": "gis-qa-engineer",
    "nameEn": "GIS QA Engineer",
    "emoji": "✅",
    "division": "gis",
    "description": "核查地理数据的拓扑关系、坐标系一致性与元数据，开展精度评估和合规检查，把关入库数据质量。",
    "descriptionEn": "Quality assurance specialist who validates geospatial data integrity — topology checks, metadata audits, CRS consistency, accuracy assessment, and compliance verification."
  },
  {
    "slug": "gis-solution-engineer",
    "nameEn": "Solution Engineer",
    "emoji": "🔧",
    "division": "gis",
    "description": "将方案设计落地为可演示的原型与概念验证，在 Esri 和开源技术栈上验证可行性，支撑售前交付。",
    "descriptionEn": "Hands-on GIS prototype builder who takes strategy from Technical Consultant and turns it into working demos, proof-of-concepts, and technical validations across the full Esri and open-source stack."
  },
  {
    "slug": "gis-spatial-data-engineer",
    "nameEn": "Spatial Data Engineer",
    "emoji": "📦",
    "division": "gis",
    "description": "负责地理空间数据的抽取、转换与加载，统一坐标系和属性格式，搭建自动化管线，输出标准化数据集。",
    "descriptionEn": "ETL specialist who transforms messy geospatial data from any source into clean, standardized, production-ready datasets — format conversion, CRS reprojection, attribute normalization, and automated pipelines."
  },
  {
    "slug": "gis-spatial-data-scientist",
    "nameEn": "Spatial Data Scientist",
    "emoji": "📊",
    "division": "gis",
    "description": "对地理空间数据做统计建模、聚类和预测分析，找出地图上不易察觉的规律，输出分析结论与报告。",
    "descriptionEn": "Advanced spatial analytics specialist who applies statistical modeling, spatial econometrics, clustering, and predictive analytics to geospatial data — finding patterns that aren't visible on a map."
  },
  {
    "slug": "gis-technical-consultant",
    "nameEn": "Technical Consultant",
    "emoji": "🧠",
    "division": "gis",
    "description": "分析客户业务需求，评估现有系统差距，制定 GIS 技术路线图，编写方案与投标文件，推动改造落地。",
    "descriptionEn": "Strategic GIS advisor who translates business problems into geospatial solutions — gap analysis, technology roadmaps, RFP responses, and digital transformation strategy across Esri and open-source ecosystems."
  },
  {
    "slug": "gis-web-gis-developer",
    "nameEn": "Web GIS Developer",
    "emoji": "🌐",
    "division": "gis",
    "description": "用 MapLibre GL JS、ArcGIS JS API、Leaflet 开发交互式地图应用，对接地理信息服务接口，交付实时数据面板。",
    "descriptionEn": "Full-stack web GIS engineer who builds interactive mapping applications — MapLibre GL JS, ArcGIS JS API, Leaflet, real-time dashboards, REST API integration, and geospatial web services."
  },
  {
    "slug": "godot-gameplay-scripter",
    "nameEn": "Godot Gameplay Scripter",
    "emoji": "🎯",
    "division": "game-development",
    "description": "用 GDScript 和 C# 实现 Godot 4 的玩法逻辑，设计节点架构与信号通信，保证代码类型安全、模块清晰可维护。",
    "descriptionEn": "Composition and signal integrity specialist - Masters GDScript 2.0, C# integration, node-based architecture, and type-safe signal design for Godot 4 projects"
  },
  {
    "slug": "godot-multiplayer-engineer",
    "nameEn": "Godot Multiplayer Engineer",
    "emoji": "🌐",
    "division": "game-development",
    "description": "搭建 Godot 4 实时联机框架，配置场景同步、RPC 与权威模型，处理 ENet/WebRTC 传输，保障多人对战的稳定性。",
    "descriptionEn": "Godot 4 networking specialist - Masters the MultiplayerAPI, scene replication, ENet/WebRTC transport, RPCs, and authority models for real-time multiplayer games"
  },
  {
    "slug": "godot-shader-developer",
    "nameEn": "Godot Shader Developer",
    "emoji": "💎",
    "division": "game-development",
    "description": "用 Godot 着色语言编写 2D/3D 特效与后处理效果，优化着色器性能，确保美术效果在目标设备上流畅运行。",
    "descriptionEn": "Godot 4 visual effects specialist - Masters the Godot Shading Language (GLSL-like), VisualShader editor, CanvasItem and Spatial shaders, post-processing, and performance optimization for 2D/3D effects"
  },
  {
    "slug": "government-digital-presales-consultant",
    "nameEn": "Government Digital Presales Consultant",
    "emoji": "🏛️",
    "division": "specialized",
    "description": "解读政务政策与合规要求，设计解决方案，撰写投标文件，组织 POC 验证，支撑项目中标。",
    "descriptionEn": "Presales expert for China's government digital transformation market (ToG), proficient in policy interpretation, solution design, bid document preparation, POC validation, compliance requirements (classified protection/cryptographic assessment/Xinchuang domestic IT), and stakeholder management — helping technical teams efficiently win government IT projects."
  },
  {
    "slug": "grant-writer",
    "nameEn": "Grant Writer",
    "emoji": "📝",
    "division": "specialized",
    "description": "调研资助机会，撰写申报书与预算说明，跟进评审，完成后提交结项报告。",
    "descriptionEn": "Expert grant writing specialist for nonprofits, research institutions, and social enterprises — covering prospect research, letter of inquiry writing, full proposal development, budget narratives, federal and foundation grants, and post-award reporting to maximize funding success"
  },
  {
    "slug": "healthcare-aging-parent-care-companion",
    "nameEn": "Aging Parent Care Companion",
    "emoji": "🧡",
    "division": "specialized",
    "description": "协助家属安排老人就医与用药，协调照护团队沟通，同时关注家属自身状态。",
    "descriptionEn": "Compassionate, HIPAA-aligned care coordination and decision-support agent for family caregivers managing an aging parent's appointments, medications, care team communication, and their own caregiver wellbeing"
  },
  {
    "slug": "healthcare-clinical-evidence-agent",
    "nameEn": "Clinical Evidence Agent",
    "emoji": "🩺",
    "division": "healthcare",
    "description": "检索和评价临床研究文献，按证据等级整理证据，撰写系统评价报告，为临床决策和诊疗指南提供依据。",
    "descriptionEn": "Evidence standards and clinical credibility framework for AI agents"
  },
  {
    "slug": "healthcare-customer-service",
    "nameEn": "Healthcare Customer Service",
    "emoji": "🏥",
    "division": "specialized",
    "description": "处理患者咨询、预约与账单问题，解答保险疑问，投诉及时转交临床或行政处理。",
    "descriptionEn": "Empathetic healthcare customer service specialist for patient support, billing inquiries, appointment management, insurance questions, complaint resolution, and seamless escalation to clinical or administrative staff"
  },
  {
    "slug": "healthcare-innovation-strategist",
    "nameEn": "Healthcare Innovation Strategist",
    "emoji": "🧭",
    "division": "healthcare",
    "description": "为医疗健康企业提供战略咨询，分析市场、政策与竞争格局，梳理商业模式，制定产品上市与扩张路径。",
    "descriptionEn": "Strategic narrative architect for healthcare founders operating at"
  },
  {
    "slug": "healthcare-marketing-compliance",
    "nameEn": "Healthcare Marketing Compliance Specialist",
    "emoji": "⚕️",
    "division": "specialized",
    "description": "审核医药、器械、医美等营销内容，对照广告法与平台规则把控风险，保护患者隐私。",
    "descriptionEn": "Expert in healthcare marketing compliance in China, proficient in the Advertising Law, Medical Advertisement Management Measures, Drug Administration Law, and related regulations — covering pharmaceuticals, medical devices, medical aesthetics, health supplements, and internet healthcare across content review, risk control, platform rule interpretation, and patient privacy protection, helping enterprises conduct effective health marketing within legal boundaries."
  },
  {
    "slug": "healthcare-sovereign-health-systems-agent",
    "nameEn": "Sovereign Health Systems Agent",
    "emoji": "🌍",
    "division": "healthcare",
    "description": "为政府卫生部门提供政策与治理咨询，设计医疗资源配置和分级诊疗方案，评估公共卫生项目实施效果。",
    "descriptionEn": "Government health mandate engagement framework for AI agents"
  },
  {
    "slug": "hospitality-guest-services",
    "nameEn": "Hospitality Guest Services",
    "emoji": "🏨",
    "division": "specialized",
    "description": "办理预订与入住退房，提供礼宾服务，处理客诉，维护会员体系并跟进住后回访。",
    "descriptionEn": "Comprehensive hospitality guest services specialist for hotels, resorts, restaurants, and event venues — covering reservations, check-in/check-out, concierge services, guest complaint resolution, loyalty program management, and post-stay follow-up to deliver exceptional guest experiences that drive loyalty and revenue"
  },
  {
    "slug": "hr-onboarding",
    "nameEn": "HR Onboarding",
    "emoji": "🤝",
    "division": "specialized",
    "description": "组织新员工入职培训与材料签署，办理福利参保，跟进试用期适应，保障顺利转正。",
    "descriptionEn": "Comprehensive HR onboarding specialist for employee orientation, documentation management, compliance tracking, benefits enrollment, culture integration, and new hire support — delivering a seamless first-day-to-first-year experience that drives retention and productivity"
  },
  {
    "slug": "identity-graph-operator",
    "nameEn": "Identity Graph Operator",
    "emoji": "🕸️",
    "division": "specialized",
    "description": "维护多智能体共享的身份图谱，统一实体身份判定结果，保证并发写入下数据一致。",
    "descriptionEn": "Operates a shared identity graph that multiple AI agents resolve against. Ensures every agent in a multi-agent system gets the same canonical answer for \"who is this entity?\" - deterministically, even under concurrent writes."
  },
  {
    "slug": "language-translator",
    "nameEn": "Language Translator",
    "emoji": "🌐",
    "division": "specialized",
    "description": "提供西英双向实时翻译，兼顾文化语境、方言差异与场合语气，确保沟通准确得体。",
    "descriptionEn": "Real-time Spanish ↔ English translation specialist with cultural context, regional dialect awareness, travel phrase guidance, and tone-appropriate communication for everyday, business, and emergency situations"
  },
  {
    "slug": "legal-billing-time-tracking",
    "nameEn": "Legal Billing & Time Tracking",
    "emoji": "⏱️",
    "division": "specialized",
    "description": "记录工时、生成账单与计费说明，跟进回款，管理托管账户合规，输出计费分析。",
    "descriptionEn": "Comprehensive legal billing and time tracking specialist for accurate time capture, invoice generation, billing narrative writing, collections management, trust account compliance, and billing analysis — maximizing revenue recovery while maintaining client relationships and ethical compliance across any firm size or billing model"
  },
  {
    "slug": "legal-client-intake",
    "nameEn": "Legal Client Intake",
    "emoji": "📋",
    "division": "specialized",
    "description": "筛选潜在客户，收集案件信息，安排咨询时间，做利益冲突排查，输出接案摘要。",
    "descriptionEn": "Comprehensive legal client intake specialist for qualifying prospects, collecting case information, scheduling consultations, managing conflict checks, and delivering attorney-ready intake summaries across any practice area and firm size"
  },
  {
    "slug": "legal-document-review",
    "nameEn": "Legal Document Review",
    "emoji": "⚖️",
    "division": "specialized",
    "description": "审阅合同与诉讼文书，提炼要点、标注风险条款，比对版本差异并核查合规性。",
    "descriptionEn": "Comprehensive legal document review specialist for contracts, litigation documents, and real estate agreements — summarizing documents, flagging risk clauses, comparing contract versions, and checking compliance across any law firm size or practice area"
  },
  {
    "slug": "level-designer",
    "nameEn": "Level Designer",
    "emoji": "🗺️",
    "division": "game-development",
    "description": "设计关卡布局与节奏，安排战斗遭遇和环境叙事，通过白盒搭建和反复测试打磨关卡体验与难度曲线。",
    "descriptionEn": "Spatial storytelling and flow specialist - Masters layout theory, pacing architecture, encounter design, and environmental narrative across all game engines"
  },
  {
    "slug": "loan-officer-assistant",
    "nameEn": "Loan Officer Assistant",
    "emoji": "🏦",
    "division": "specialized",
    "description": "收集借款人资料，做初步资质判断，跟进贷款流程，报价并协调签约与放款。",
    "descriptionEn": "Comprehensive loan officer assistant for mortgage and lending professionals — covering borrower intake, pre-qualification, document collection, pipeline management, compliance tracking, rate quoting, and closing coordination across residential, commercial, and consumer lending"
  },
  {
    "slug": "lsp-index-engineer",
    "nameEn": "LSP/Index Engineer",
    "emoji": "🔎",
    "division": "specialized",
    "description": "基于语言服务器协议搭建代码智能系统，编排 LSP 客户端，维护语义索引。",
    "descriptionEn": "Language Server Protocol specialist building unified code intelligence systems through LSP client orchestration and semantic indexing"
  },
  {
    "slug": "ma-integration-manager",
    "nameEn": "M&A Integration Manager",
    "emoji": "🤝",
    "division": "specialized",
    "description": "制定并购后整合方案，协调各业务线落地，跟踪协同效应，管理过渡期服务协议。",
    "descriptionEn": "Mergers and acquisitions integration specialist who designs and executes post-merger integration programs — covering Day 1 readiness, 100-day planning, synergy tracking, cultural integration, functional workstream coordination, and transition service agreement management."
  },
  {
    "slug": "macos-spatial-metal-engineer",
    "nameEn": "macOS Spatial/Metal Engineer",
    "emoji": "🍎",
    "division": "spatial-computing",
    "description": "用 Swift 和 Metal 开发 macOS 与 Vision Pro 上的高性能 3D 渲染系统，负责渲染管线搭建、性能调优和空间计算应用的落地交付。",
    "descriptionEn": "Native Swift and Metal specialist building high-performance 3D rendering systems and spatial computing experiences for macOS and Vision Pro"
  },
  {
    "slug": "marketing-aeo-foundations",
    "nameEn": "AEO Foundations Architect",
    "emoji": "🏗️",
    "division": "marketing",
    "description": "部署 llms.txt、robots.txt 和结构化 Markdown 等站点文件，让 AI 爬虫与引用引擎能抓取并解析网站内容，提升站点在 AI 搜索中的可见度。",
    "descriptionEn": "Expert in AI Engine Optimization infrastructure — implements llms.txt, AI-aware robots.txt, token-budgeted content, structured Markdown availability, and agent discovery files so AI crawlers, citation engines, and browsing agents can find, parse, and act on your site"
  },
  {
    "slug": "marketing-agentic-search-optimizer",
    "nameEn": "Agentic Search Optimizer",
    "emoji": "🤖",
    "division": "marketing",
    "description": "审计 AI 智能体能否在网站上完成预订、购买、注册等任务，落地 WebMCP 声明式与命令式模式，统计任务完成率并持续改进。",
    "descriptionEn": "Expert in WebMCP readiness and agentic task completion — audits whether AI agents can actually accomplish tasks on your site (book, buy, register, subscribe), implements WebMCP declarative and imperative patterns, and measures task completion rates across AI browsing agents"
  },
  {
    "slug": "marketing-ai-citation-strategist",
    "nameEn": "AI Citation Strategist",
    "emoji": "🔮",
    "division": "marketing",
    "description": "排查品牌在 ChatGPT、Claude 等 AI 产品中的被提及情况，分析竞品被引用的原因，输出内容修改方案，提升品牌在 AI 回答中的引用率。",
    "descriptionEn": "Expert in AI recommendation engine optimization (AEO/GEO) — audits brand visibility across ChatGPT, Claude, Gemini, and Perplexity, identifies why competitors get cited instead, and delivers content fixes that improve AI citations"
  },
  {
    "slug": "marketing-app-store-optimizer",
    "nameEn": "App Store Optimizer",
    "emoji": "📱",
    "division": "marketing",
    "description": "负责应用商店的 ASO 优化，调整标题、关键词、截图与评分策略，提升应用在商店内的曝光量和下载转化率。",
    "descriptionEn": "Expert app store marketing specialist focused on App Store Optimization (ASO), conversion rate optimization, and app discoverability"
  },
  {
    "slug": "marketing-baidu-seo-specialist",
    "nameEn": "Baidu SEO Specialist",
    "emoji": "🔍",
    "division": "marketing",
    "description": "负责百度搜索排名优化，完成中文关键词研究、站点移动端适配与 ICP 备案合规，提升品牌在百度搜索的自然流量。",
    "descriptionEn": "Expert Baidu search optimization specialist focused on Chinese search engine ranking, Baidu ecosystem integration, ICP compliance, Chinese keyword research, and mobile-first indexing for the China market."
  },
  {
    "slug": "marketing-bilibili-content-strategist",
    "nameEn": "Bilibili Content Strategist",
    "emoji": "🎬",
    "division": "marketing",
    "description": "运营 B 站账号内容，策划选题、对接 UP 主合作，按平台算法优化视频与弹幕互动，提升播放量和粉丝增长。",
    "descriptionEn": "Expert Bilibili marketing specialist focused on UP主 growth, danmaku culture mastery, B站 algorithm optimization, community building, and branded content strategy for China's leading video community platform."
  },
  {
    "slug": "marketing-book-co-author",
    "nameEn": "Book Co-Author",
    "emoji": "📘",
    "division": "marketing",
    "description": "把创始人、专家的语音笔记和零散素材整理成结构化的第一人称章节，规划全书定位与目录，完成出版级书稿。",
    "descriptionEn": "Strategic thought-leadership book collaborator for founders, experts, and operators turning voice notes, fragments, and positioning into structured first-person chapters."
  },
  {
    "slug": "marketing-carousel-growth-engine",
    "nameEn": "Carousel Growth Engine",
    "emoji": "🎠",
    "division": "marketing",
    "description": "抓取网站内容自动生成六页轮播图，直接发布到 TikTok 和 Instagram 信息流，跟踪播放数据并持续迭代内容策略。",
    "descriptionEn": "Autonomous TikTok and Instagram carousel generation specialist. Analyzes any website URL with Playwright, generates viral 6-slide carousels via Gemini image generation, publishes directly to feed via Upload-Post API with auto trending music, fetches analytics, and iteratively improves through a data-driven learning loop."
  },
  {
    "slug": "marketing-china-ecommerce-operator",
    "nameEn": "China E-Commerce Operator",
    "emoji": "🛒",
    "division": "marketing",
    "description": "运营淘宝、天猫、拼多多、京东等平台店铺，优化商品详情与价格策略，组织 618、双 11 大促和直播带货活动。",
    "descriptionEn": "Expert China e-commerce operations specialist covering Taobao, Tmall, Pinduoduo, and JD ecosystems with deep expertise in product listing optimization, live commerce, store operations, 618/Double 11 campaigns, and cross-platform strategy."
  },
  {
    "slug": "marketing-china-market-localization-strategist",
    "nameEn": "China Market Localization Strategist",
    "emoji": "🌏",
    "division": "marketing",
    "description": "分析抖音、小红书、微信、B 站等平台的实时趋势，把品牌内容和产品话术本地化，制定可执行的中国市场进入方案。",
    "descriptionEn": "Full-stack China market localization expert who transforms real-time trend signals into executable go-to-market strategies across Douyin, Xiaohongshu, WeChat, Bilibili, and beyond"
  },
  {
    "slug": "marketing-content-creator",
    "nameEn": "Content Creator",
    "emoji": "✍️",
    "division": "marketing",
    "description": "制定各平台内容日历，撰写文案与选题，维护品牌故事调性，根据互动数据调整内容方向与发布节奏。",
    "descriptionEn": "Expert content strategist and creator for multi-platform campaigns. Develops editorial calendars, creates compelling copy, manages brand storytelling, and optimizes content for engagement across all digital channels."
  },
  {
    "slug": "marketing-cross-border-ecommerce",
    "nameEn": "Cross-Border E-Commerce Specialist",
    "emoji": "🌏",
    "division": "marketing",
    "description": "运营 Amazon、Shopee、Temu 等海外平台店铺，处理跨境物流、合规税务和多语言商品信息，建设品牌独立站。",
    "descriptionEn": "Full-funnel cross-border e-commerce strategist covering Amazon, Shopee, Lazada, AliExpress, Temu, and TikTok Shop operations, international logistics and overseas warehousing, compliance and taxation, multilingual listing optimization, brand globalization, and DTC independent site development."
  },
  {
    "slug": "marketing-douyin-strategist",
    "nameEn": "Douyin Strategist",
    "emoji": "🎵",
    "division": "marketing",
    "description": "策划抖音短视频选题与脚本，按推荐算法优化发布，运营直播带货，用内容矩阵带动品牌流量和销量增长。",
    "descriptionEn": "Short-video marketing expert specializing in the Douyin platform, with deep expertise in recommendation algorithm mechanics, viral video planning, livestream commerce workflows, and full-funnel brand growth through content matrix strategies."
  },
  {
    "slug": "marketing-email-strategist",
    "nameEn": "Email Marketing Strategist",
    "emoji": "📧",
    "division": "marketing",
    "description": "搭建欢迎、召回、复购等自动化邮件序列，做用户分群与触达策略，监控送达率，按打开和转化数据迭代活动。",
    "descriptionEn": "Expert email marketing strategist for CRM-driven campaigns, lifecycle automation, segmentation architecture, and deliverability. Designs sequences (welcome, nurture, reactivation, win-back, review, referral) grounded in 2025-2026 benchmarks, AI-driven personalization, and post-Apple MPP measurement."
  },
  {
    "slug": "marketing-global-podcast-strategist",
    "nameEn": "Global Podcast Strategist",
    "emoji": "🎙️",
    "division": "marketing",
    "description": "负责播客定位与内容策划，运营 Spotify、Apple Podcasts 等分发渠道，设计广告与会员变现方式，跟踪收听数据。",
    "descriptionEn": "Expert podcast growth specialist focused on show positioning, audience development, content strategy, and monetisation. Transforms raw ideas into authoritative audio brands that compound listeners and revenue over time on Spotify, Apple Podcasts, and YouTube."
  },
  {
    "slug": "marketing-growth-hacker",
    "nameEn": "Growth Hacker",
    "emoji": "🚀",
    "division": "marketing",
    "description": "通过小规模实验测试增长渠道，设计裂变机制与转化漏斗，用数据判断投入方向，实现低成本获客。",
    "descriptionEn": "Expert growth strategist specializing in rapid user acquisition through data-driven experimentation. Develops viral loops, optimizes conversion funnels, and finds scalable growth channels for exponential business growth."
  },
  {
    "slug": "marketing-instagram-curator",
    "nameEn": "Instagram Curator",
    "emoji": "📸",
    "division": "marketing",
    "description": "维护 Instagram 账号的视觉风格，策划图文、Reels 等格式内容，管理评论区与粉丝社群，提升互动率。",
    "descriptionEn": "Expert Instagram marketing specialist focused on visual storytelling, community building, and multi-format content optimization. Masters aesthetic development and drives meaningful engagement."
  },
  {
    "slug": "marketing-kuaishou-strategist",
    "nameEn": "Kuaishou Strategist",
    "emoji": "🎥",
    "division": "marketing",
    "description": "面向下沉市场策划快手短视频内容，运营直播带货，通过真实内容建立社区信任，带动粉丝与销量增长。",
    "descriptionEn": "Expert Kuaishou marketing strategist specializing in short-video content for China's lower-tier city markets, live commerce operations, community trust building, and grassroots audience growth on 快手."
  },
  {
    "slug": "marketing-linkedin-content-creator",
    "nameEn": "LinkedIn Content Creator",
    "emoji": "💼",
    "division": "marketing",
    "description": "为创始人、求职者撰写 LinkedIn 帖文，规划个人品牌内容，按平台算法安排发布节奏，带来询盘与商务机会。",
    "descriptionEn": "Expert LinkedIn content strategist focused on thought leadership, personal brand building, and high-engagement professional content. Masters LinkedIn's algorithm and culture to drive inbound opportunities for founders, job seekers, developers, and anyone building a professional presence."
  },
  {
    "slug": "marketing-livestream-commerce-coach",
    "nameEn": "Livestream Commerce Coach",
    "emoji": "🎙️",
    "division": "marketing",
    "description": "培训主播话术与控场技巧，设计直播脚本和商品顺序，调配付费与自然流量，按实时数据优化成交转化。",
    "descriptionEn": "Veteran livestream e-commerce coach specializing in host training and live room operations across Douyin, Kuaishou, Taobao Live, and Channels, covering script design, product sequencing, paid-vs-organic traffic balancing, conversion closing techniques, and real-time data-driven optimization."
  },
  {
    "slug": "marketing-multi-platform-publisher",
    "nameEn": "Multi-Platform Publisher",
    "emoji": "📡",
    "division": "marketing",
    "description": "把一篇文章按平台规则适配后分发到知乎、小红书、公众号等渠道，先出草稿供人工审核，控制频率规避风险。",
    "descriptionEn": "Expert orchestrator for one-click Chinese blog publishing. Routes a single article to 知乎 / 小红书 / CSDN / B站 / 公众号 / 掘金 via Wechatsync (main channel) with xhs-mcp and biliup as specialized fallbacks. Handles per-platform content adaptation, draft-first publishing, rate control, and risk-avoidance. Does NOT auto-publish — always stops at draft for human review."
  },
  {
    "slug": "marketing-podcast-strategist",
    "nameEn": "Podcast Strategist",
    "emoji": "🎧",
    "division": "marketing",
    "description": "负责中文播客的定位与内容制作，运营小宇宙、喜马拉雅等音频平台，规划涨粉路径与会员、广告变现方式。",
    "descriptionEn": "Content strategy and operations expert for the Chinese podcast market, with deep expertise in Xiaoyuzhou, Ximalaya, and other major audio platforms, covering show positioning, audio production, audience growth, multi-platform distribution, and monetization to help podcast creators build sticky audio content brands."
  },
  {
    "slug": "marketing-pr-communications-manager",
    "nameEn": "PR & Communications Manager",
    "emoji": "📣",
    "division": "marketing",
    "description": "维护媒体关系，撰写新闻稿，处理负面舆情与危机公关，策划高管对外发声，维护品牌声誉。",
    "descriptionEn": "Strategic public relations and communications specialist for media relations, press releases, crisis communications, executive thought leadership, brand reputation management, and integrated communications planning — building and protecting reputations through earned media, storytelling, and proactive narrative control"
  },
  {
    "slug": "marketing-private-domain-operator",
    "nameEn": "Private Domain Operator",
    "emoji": "🔒",
    "division": "marketing",
    "description": "搭建企业微信私域用户池，做用户分层、社群运营和生命周期管理，对接小程序商城，推动复购与转化。",
    "descriptionEn": "Expert in building enterprise WeChat (WeCom) private domain ecosystems, with deep expertise in SCRM systems, segmented community operations, Mini Program commerce integration, user lifecycle management, and full-funnel conversion optimization."
  },
  {
    "slug": "marketing-reddit-community-builder",
    "nameEn": "Reddit Community Builder",
    "emoji": "💬",
    "division": "marketing",
    "description": "以真实身份参与 Reddit 相关版块讨论，发布有价值的内容而非硬广，经营社区关系，沉淀口碑。",
    "descriptionEn": "Expert Reddit marketing specialist focused on authentic community engagement, value-driven content creation, and long-term relationship building. Masters Reddit culture navigation."
  },
  {
    "slug": "marketing-seo-specialist",
    "nameEn": "SEO Specialist",
    "emoji": "🔍",
    "division": "marketing",
    "description": "负责网站技术 SEO 与内容优化，建设高质量外链，监测关键词排名，持续提升自然搜索流量。",
    "descriptionEn": "Expert search engine optimization strategist specializing in technical SEO, content optimization, link authority building, and organic search growth. Drives sustainable traffic through data-driven search strategies."
  },
  {
    "slug": "marketing-short-video-editing-coach",
    "nameEn": "Short-Video Editing Coach",
    "emoji": "🎬",
    "division": "marketing",
    "description": "用剪映、Premiere、达芬奇等工具完成短视频剪辑，处理调色、字幕、音效与动效，按平台规格导出成片。",
    "descriptionEn": "Hands-on short-video editing coach covering the full post-production pipeline, with mastery of CapCut Pro, Premiere Pro, DaVinci Resolve, and Final Cut Pro across composition and camera language, color grading, audio engineering, motion graphics and VFX, subtitle design, multi-platform export optimization, editing workflow efficiency, and AI-assisted editing."
  },
  {
    "slug": "marketing-social-media-strategist",
    "nameEn": "Social Media Strategist",
    "emoji": "📣",
    "division": "marketing",
    "description": "在 LinkedIn、Twitter 等平台策划跨平台活动，运营社群并处理实时互动，制定个人品牌发声策略。",
    "descriptionEn": "Expert social media strategist for LinkedIn, Twitter, and professional platforms. Creates cross-platform campaigns, builds communities, manages real-time engagement, and develops thought leadership strategies."
  },
  {
    "slug": "marketing-tiktok-strategist",
    "nameEn": "TikTok Strategist",
    "emoji": "🎵",
    "division": "marketing",
    "description": "策划 TikTok 短视频选题与拍摄，跟踪平台算法和流行趋势，运营账号与粉丝社群，带动品牌曝光增长。",
    "descriptionEn": "Expert TikTok marketing specialist focused on viral content creation, algorithm optimization, and community building. Masters TikTok's unique culture and features for brand growth."
  },
  {
    "slug": "marketing-twitter-engager",
    "nameEn": "Twitter Engager",
    "emoji": "🐦",
    "division": "marketing",
    "description": "参与平台实时话题讨论，撰写有传播力的推文串，与行业账号互动互转，建立品牌话语权。",
    "descriptionEn": "Expert Twitter marketing specialist focused on real-time engagement, thought leadership building, and community-driven growth. Builds brand authority through authentic conversation participation and viral thread creation."
  },
  {
    "slug": "marketing-video-optimization-specialist",
    "nameEn": "Video Optimization Specialist",
    "emoji": "🎬",
    "division": "marketing",
    "description": "优化 YouTube 视频标题、缩略图与章节，分析完播率与留存，把视频同步分发到其他平台放大流量。",
    "descriptionEn": "Video marketing strategist specializing in YouTube algorithm optimization, audience retention, chaptering, thumbnail concepts, and cross-platform video syndication."
  },
  {
    "slug": "marketing-wechat-official-account",
    "nameEn": "WeChat Official Account Manager",
    "emoji": "📱",
    "division": "marketing",
    "description": "运营公众号内容，策划图文与视频选题，维护粉丝社群，通过内容引导关注、互动与付费转化。",
    "descriptionEn": "Expert WeChat Official Account (OA) strategist specializing in content marketing, subscriber engagement, and conversion optimization. Masters multi-format content and builds loyal communities through consistent value delivery."
  },
  {
    "slug": "marketing-weibo-strategist",
    "nameEn": "Weibo Strategist",
    "emoji": "🔥",
    "division": "marketing",
    "description": "运营微博账号，跟进热搜话题、管理超话社区，监测舆论风向，策划粉丝活动与微博广告投放。",
    "descriptionEn": "Full-spectrum operations expert for Sina Weibo, with deep expertise in trending topic mechanics, Super Topic community management, public sentiment monitoring, fan economy strategies, and Weibo advertising, helping brands achieve viral reach and sustained growth on China's leading public discourse platform."
  },
  {
    "slug": "marketing-x-twitter-intelligence-analyst",
    "nameEn": "X/Twitter Intelligence Analyst",
    "emoji": "🛰️",
    "division": "marketing",
    "description": "监测 X/Twitter 上与品牌相关的话题与账号动态，识别趋势和风险信号，输出有数据支撑的舆情报告。",
    "descriptionEn": "Social intelligence specialist for X/Twitter research, trend detection, account monitoring, and evidence-backed audience insights using public signals and structured data workflows."
  },
  {
    "slug": "marketing-xiaohongshu-specialist",
    "nameEn": "Xiaohongshu Specialist",
    "emoji": "🌸",
    "division": "marketing",
    "description": "运营小红书账号，策划生活方式类笔记选题，跟踪平台热点，经营评论区与私信，带动种草和转化。",
    "descriptionEn": "Expert Xiaohongshu marketing specialist focused on lifestyle content, trend-driven strategies, and authentic community engagement. Masters micro-content creation and drives viral growth through aesthetic storytelling."
  },
  {
    "slug": "marketing-zhihu-strategist",
    "nameEn": "Zhihu Strategist",
    "emoji": "🧠",
    "division": "marketing",
    "description": "运营知乎账号，通过回答问题输出专业内容，经营主页与专栏，参与圆桌讨论，建立专业可信度。",
    "descriptionEn": "Expert Zhihu marketing specialist focused on thought leadership, community credibility, and knowledge-driven engagement. Masters question-answering strategy and builds brand authority through authentic expertise sharing."
  },
  {
    "slug": "medical-billing-coding-specialist",
    "nameEn": "Medical Billing & Coding Specialist",
    "emoji": "🏥",
    "division": "specialized",
    "description": "按 ICD 与 CPT 规范编码，提交理赔申请，处理拒赔，优化收入周期并做合规审计。",
    "descriptionEn": "Expert medical billing and coding specialist for ICD-10-CM/PCS, CPT, and HCPCS coding, claim submission, denial management, revenue cycle optimization, compliance auditing, and payer contract analysis — maximizing clean claim rates and revenue recovery for healthcare providers of all sizes"
  },
  {
    "slug": "narrative-designer",
    "nameEn": "Narrative Designer",
    "emoji": "📖",
    "division": "game-development",
    "description": "编写剧情与分支对话，搭建任务和叙事系统，保证剧情与玩法设计文档一致，用环境细节传递故事信息。",
    "descriptionEn": "Story systems and dialogue architect - Masters GDD-aligned narrative design, branching dialogue, lore architecture, and environmental storytelling across all game engines"
  },
  {
    "slug": "operations-manager",
    "nameEn": "Operations Manager",
    "emoji": "⚙️",
    "division": "specialized",
    "description": "梳理业务流程，制定产能计划与考核指标，管理供应商，用精益方法持续降本提效。",
    "descriptionEn": "Business operations specialist who applies Lean, Six Sigma, and systems thinking to process mapping, capacity planning, KPI governance, vendor management, and organizational efficiency — turning operational complexity into repeatable, measurable performance."
  },
  {
    "slug": "organizational-psychologist",
    "nameEn": "Organizational Psychologist",
    "emoji": "🧠",
    "division": "specialized",
    "description": "诊断团队协作、心理安全与倦怠风险，评估组织氛围，向管理层提出改善方案。",
    "descriptionEn": "Applied organizational psychologist who diagnoses team dynamics, psychological safety, burnout risk, and culture health — using evidence-based frameworks to help leaders build high-performing, resilient, and psychologically safe organizations."
  },
  {
    "slug": "paid-media-auditor",
    "nameEn": "Paid Media Auditor",
    "emoji": "📋",
    "division": "paid-media",
    "description": "逐项核查 Google Ads、微软广告、Meta 账户的结构、追踪、出价与素材，输出按优先级排序的优化建议和预估影响报告。",
    "descriptionEn": "Comprehensive paid media auditor who systematically evaluates Google Ads, Microsoft Ads, and Meta accounts across 200+ checkpoints spanning account structure, tracking, bidding, creative, audiences, and competitive positioning. Produces actionable audit reports with prioritized recommendations and projected impact."
  },
  {
    "slug": "paid-media-creative-strategist",
    "nameEn": "Ad Creative Strategist",
    "emoji": "✍️",
    "division": "paid-media",
    "description": "负责撰写广告文案、优化自适应搜索广告和素材组，设计创意测试方案，把投放数据转化为有说服力的广告素材。",
    "descriptionEn": "Paid media creative specialist focused on ad copywriting, RSA optimization, asset group design, and creative testing frameworks across Google, Meta, Microsoft, and programmatic platforms. Bridges the gap between performance data and persuasive messaging."
  },
  {
    "slug": "paid-media-paid-social-strategist",
    "nameEn": "Paid Social Strategist",
    "emoji": "📱",
    "division": "paid-media",
    "description": "负责 Meta、LinkedIn、TikTok 等平台的付费社媒投放，按平台特点设计拉新和再营销的全漏斗广告方案与受众策略。",
    "descriptionEn": "Cross-platform paid social advertising specialist covering Meta (Facebook/Instagram), LinkedIn, TikTok, Pinterest, X, and Snapchat. Designs full-funnel social ad programs from prospecting through retargeting with platform-specific creative and audience strategies."
  },
  {
    "slug": "paid-media-ppc-strategist",
    "nameEn": "PPC Campaign Strategist",
    "emoji": "💰",
    "division": "paid-media",
    "description": "负责 Google、微软、亚马逊平台搜索、购物与效果最大化广告的账户搭建、预算分配和出价策略，管理大规模月度投放预算。",
    "descriptionEn": "Senior paid media strategist specializing in large-scale search, shopping, and performance max campaign architecture across Google, Microsoft, and Amazon ad platforms. Designs account structures, budget allocation frameworks, and bidding strategies that scale from $10K to $10M+ monthly spend."
  },
  {
    "slug": "paid-media-programmatic-buyer",
    "nameEn": "Programmatic & Display Buyer",
    "emoji": "📺",
    "division": "paid-media",
    "description": "负责展示广告与程序化媒体采买，管理 DV360、Google 展示广告网络等平台的广告位和预算，执行 ABM 定向投放策略。",
    "descriptionEn": "Display advertising and programmatic media buying specialist covering managed placements, Google Display Network, DV360, trade desk platforms, partner media (newsletters, sponsored content), and ABM display strategies via platforms like Demandbase and 6Sense."
  },
  {
    "slug": "paid-media-search-query-analyst",
    "nameEn": "Search Query Analyst",
    "emoji": "🔍",
    "division": "paid-media",
    "description": "分析搜索词报告，搭建否定关键词体系，把搜索词映射到用户意图，减少无效点击、放大高意向流量。",
    "descriptionEn": "Specialist in search term analysis, negative keyword architecture, and query-to-intent mapping. Turns raw search query data into actionable optimizations that eliminate waste and amplify high-intent traffic across paid search accounts."
  },
  {
    "slug": "paid-media-tracking-specialist",
    "nameEn": "Tracking & Measurement Specialist",
    "emoji": "📡",
    "division": "paid-media",
    "description": "负责转化追踪架构、标签管理与归因建模，搭建 GTM、GA4、Meta CAPI 等追踪方案，确保转化数据准确、投放效果可衡量。",
    "descriptionEn": "Expert in conversion tracking architecture, tag management, and attribution modeling across Google Tag Manager, GA4, Google Ads, Meta CAPI, LinkedIn Insight Tag, and server-side implementations. Ensures every conversion is counted correctly and every dollar of ad spend is measurable."
  },
  {
    "slug": "personal-growth-mentor",
    "nameEn": "Personal Growth Mentor",
    "emoji": "🌱",
    "division": "specialized",
    "description": "帮助梳理目标、设计习惯与行动计划，定期跟进进度，督促执行并复盘调整。",
    "descriptionEn": "Cross-domain personal development mentor for goal clarity, habit design, strategic decisions, and accountability without motivational fluff."
  },
  {
    "slug": "product-behavioral-nudge-engine",
    "nameEn": "Behavioral Nudge Engine",
    "emoji": "🧠",
    "division": "product",
    "description": "研究用户心理与行为规律，调整产品交互节奏和引导方式，提升用户使用动机与完成率，负责增长相关实验的设计与落地。",
    "descriptionEn": "Behavioral psychology specialist that adapts software interaction cadences and styles to maximize user motivation and success."
  },
  {
    "slug": "product-feedback-synthesizer",
    "nameEn": "Feedback Synthesizer",
    "emoji": "🔍",
    "division": "product",
    "description": "收集各渠道用户反馈，归类分析后提炼改进点，把定性意见整理成可执行的需求优先级，输出给产品团队。",
    "descriptionEn": "Expert in collecting, analyzing, and synthesizing user feedback from multiple channels to extract actionable product insights. Transforms qualitative feedback into quantitative priorities and strategic recommendations."
  },
  {
    "slug": "product-manager",
    "nameEn": "Product Manager",
    "emoji": "🧭",
    "division": "product",
    "description": "负责产品从调研、规划到上线运营的全流程，定义需求与路线图，协调研发、设计、运营推进落地，跟踪上线效果并迭代。",
    "descriptionEn": "Holistic product leader who owns the full product lifecycle — from discovery and strategy through roadmap, stakeholder alignment, go-to-market, and outcome measurement. Bridges business goals, user needs, and technical reality to ship the right thing at the right time."
  },
  {
    "slug": "product-sprint-prioritizer",
    "nameEn": "Sprint Prioritizer",
    "emoji": "🎯",
    "division": "product",
    "description": "负责迭代计划与需求排期，按价值和成本评估需求优先级，合理分配资源，保证每轮迭代交付最重要的功能。",
    "descriptionEn": "Expert product manager specializing in agile sprint planning, feature prioritization, and resource allocation. Focused on maximizing team velocity and business value delivery through data-driven prioritization frameworks."
  },
  {
    "slug": "product-trend-researcher",
    "nameEn": "Trend Researcher",
    "emoji": "🔭",
    "division": "product",
    "description": "跟踪行业动态与竞品变化，识别新兴趋势和机会点，输出市场分析报告，为产品方向和立项决策提供依据。",
    "descriptionEn": "Expert market intelligence analyst specializing in identifying emerging trends, competitive analysis, and opportunity assessment. Focused on providing actionable insights that drive product strategy and innovation decisions."
  },
  {
    "slug": "project-management-experiment-tracker",
    "nameEn": "Experiment Tracker",
    "emoji": "🧪",
    "division": "project-management",
    "description": "负责实验项目全流程管理。设计 A/B 测试方案，跟踪实验执行进度，用数据验证假设，输出结果报告供产品决策。",
    "descriptionEn": "Expert project manager specializing in experiment design, execution tracking, and data-driven decision making. Focused on managing A/B tests, feature experiments, and hypothesis validation through systematic experimentation and rigorous analysis."
  },
  {
    "slug": "project-management-jira-workflow-steward",
    "nameEn": "Jira Workflow Steward",
    "emoji": "📋",
    "division": "project-management",
    "description": "维护 Jira 项目配置与流程规范，确保每个 Git 提交和拉取请求都能追溯到对应任务，分支管理符合发布安全要求。",
    "descriptionEn": "Expert delivery operations specialist who enforces Jira-linked Git workflows, traceable commits, structured pull requests, and release-safe branch strategy across software teams."
  },
  {
    "slug": "project-management-meeting-notes-specialist",
    "nameEn": "Meeting Notes Specialist",
    "emoji": "📋",
    "division": "project-management",
    "description": "把会议录音或零散笔记整理成结构化纪要，提炼决策、行动项和未决问题，输出摘要并跟进事项落地。",
    "descriptionEn": "Extract structured decisions, action items, and open questions from meeting transcripts or rough notes into a clean 4-section summary."
  },
  {
    "slug": "project-management-project-shepherd",
    "nameEn": "Project Shepherd",
    "emoji": "🐑",
    "division": "project-management",
    "description": "负责项目从启动到交付的全周期推进。协调跨部门资源和进度，管理时间线与风险，同步各方信息，确保按计划交付。",
    "descriptionEn": "Expert project manager specializing in cross-functional project coordination, timeline management, and stakeholder alignment. Focused on shepherding projects from conception to completion while managing resources, risks, and communications across multiple teams and departments."
  },
  {
    "slug": "project-management-studio-operations",
    "nameEn": "Studio Operations",
    "emoji": "🏭",
    "division": "project-management",
    "description": "负责工作室日常运营。优化工作流程和资源调配，维护团队协作工具与制度，保障各项目正常运转、产出稳定。",
    "descriptionEn": "Expert operations manager specializing in day-to-day studio efficiency, process optimization, and resource coordination. Focused on ensuring smooth operations, maintaining productivity standards, and supporting all teams with the tools and processes needed for success."
  },
  {
    "slug": "project-management-studio-producer",
    "nameEn": "Studio Producer",
    "emoji": "🎬",
    "division": "project-management",
    "description": "统筹工作室全部项目的排期与交付。分配人力和资源，管理多项目优先级，对齐创意方向与业务目标，保证按时保质完成。",
    "descriptionEn": "Senior strategic leader specializing in high-level creative and technical project orchestration, resource allocation, and multi-project portfolio management. Focused on aligning creative vision with business objectives while managing complex cross-functional initiatives and ensuring optimal studio operations."
  },
  {
    "slug": "project-manager-senior",
    "nameEn": "Senior Project Manager",
    "emoji": "📝",
    "division": "project-management",
    "description": "把需求规格拆解为可执行任务，参考历史项目经验估算排期。严格管理范围，拒绝无关需求，按规格要求交付。",
    "descriptionEn": "Converts specs to tasks and remembers previous projects. Focused on realistic scope, no background processes, exact spec requirements"
  },
  {
    "slug": "real-estate-buyer-seller",
    "nameEn": "Real Estate Buyer & Seller",
    "emoji": "🏠",
    "division": "specialized",
    "description": "服务买卖双方，管理房源信息，协助谈判与交易手续，跟进过户直到交房。",
    "descriptionEn": "Comprehensive real estate agent assistant for buyer representation, seller representation, listing management, offer negotiation, transaction coordination, and closing support — delivering a world-class client experience from first showing to final closing across residential and investment real estate"
  },
  {
    "slug": "recruitment-specialist",
    "nameEn": "Recruitment Specialist",
    "emoji": "🎯",
    "division": "specialized",
    "description": "使用主流招聘平台寻访候选人，组织面试评估，把控流程合规，维护雇主品牌。",
    "descriptionEn": "Expert recruitment operations and talent acquisition specialist — skilled in China's major hiring platforms, talent assessment frameworks, and labor law compliance. Helps companies efficiently attract, screen, and retain top talent while building a competitive employer brand."
  },
  {
    "slug": "report-distribution-agent",
    "nameEn": "Report Distribution Agent",
    "emoji": "📤",
    "division": "specialized",
    "description": "按区域参数配置分发名单，自动向对应人员推送销售报告，维护分发任务与送达状态。",
    "descriptionEn": "AI agent that automates distribution of consolidated sales reports to representatives based on territorial parameters"
  },
  {
    "slug": "resume-tailor",
    "nameEn": "Resume Tailor",
    "emoji": "🧾",
    "division": "specialized",
    "description": "分析岗位要求，匹配候选人经历，优化关键词与表述，不虚构任何经历与能力。",
    "descriptionEn": "Candidate-side resume optimization specialist who analyzes job descriptions, maps real experience to role requirements, improves ATS keyword alignment, and rewrites bullets without fabricating qualifications."
  },
  {
    "slug": "retail-customer-returns",
    "nameEn": "Retail Customer Returns",
    "emoji": "🛒",
    "division": "specialized",
    "description": "处理线上线下的退换货与退款，执行售后政策，识别欺诈，分析退货数据并优化流程。",
    "descriptionEn": "Comprehensive retail customer returns specialist for processing returns, exchanges, and refunds across in-store, online, and omnichannel retail — handling policy enforcement, fraud prevention, customer retention, vendor returns, and returns analytics to maximize recovery while preserving customer loyalty"
  },
  {
    "slug": "roblox-avatar-creator",
    "nameEn": "Roblox Avatar Creator",
    "emoji": "👤",
    "division": "game-development",
    "description": "制作 Roblox 虚拟形象与 UGC 物品，完成配件绑定和贴图标准检查，按 Creator Marketplace 要求提交审核并上架。",
    "descriptionEn": "Roblox UGC and avatar pipeline specialist - Masters Roblox's avatar system, UGC item creation, accessory rigging, texture standards, and the Creator Marketplace submission pipeline"
  },
  {
    "slug": "roblox-experience-designer",
    "nameEn": "Roblox Experience Designer",
    "emoji": "🎪",
    "division": "game-development",
    "description": "设计 Roblox 游戏的玩法循环与成长系统，配置通行证和开发者商品等变现功能，根据留存数据迭代体验。",
    "descriptionEn": "Roblox platform UX and monetization specialist - Masters engagement loop design, DataStore-driven progression, Roblox monetization systems (Passes, Developer Products, UGC), and player retention for Roblox experiences"
  },
  {
    "slug": "roblox-systems-scripter",
    "nameEn": "Roblox Systems Scripter",
    "emoji": "🔧",
    "division": "game-development",
    "description": "用 Luau 开发 Roblox 服务端与客户端系统，设计 RemoteEvent 通信和数据存储，按安全模型防止作弊，支撑规模扩展。",
    "descriptionEn": "Roblox platform engineering specialist - Masters Luau, the client-server security model, RemoteEvents/RemoteFunctions, DataStore, and module architecture for scalable Roblox experiences"
  },
  {
    "slug": "sales-account-strategist",
    "nameEn": "Account Strategist",
    "emoji": "🗺️",
    "division": "sales",
    "description": "成交后的大客户经营。负责老客户扩容，梳理关键决策人，组织季度业务回顾，提升净收入留存，把已成交客户做成长期合作关系。",
    "descriptionEn": "Expert post-sale account strategist specializing in land-and-expand execution, stakeholder mapping, QBR facilitation, and net revenue retention. Turns closed deals into long-term platform relationships through systematic expansion planning and multi-threaded account development."
  },
  {
    "slug": "sales-coach",
    "nameEn": "Sales Coach",
    "emoji": "🏋️",
    "division": "sales",
    "description": "负责销售团队能力培养。陪访一线销售，复盘商机和丢单案例，拆解大单策略，校准销售预测，用结构化反馈提升每个销售的成交产出。",
    "descriptionEn": "Expert sales coaching specialist focused on rep development, pipeline review facilitation, call coaching, deal strategy, and forecast accuracy. Makes every rep and every deal better through structured coaching methodology and behavioral feedback."
  },
  {
    "slug": "sales-data-extraction-agent",
    "nameEn": "Sales Data Extraction Agent",
    "emoji": "📊",
    "division": "specialized",
    "description": "监控 Excel 销售数据文件，提取当月、累计与年末指标，供内部实时报表使用。",
    "descriptionEn": "AI agent specialized in monitoring Excel files and extracting key sales metrics (MTD, YTD, Year End) for internal live reporting"
  },
  {
    "slug": "sales-deal-strategist",
    "nameEn": "Deal Strategist",
    "emoji": "♟️",
    "division": "sales",
    "description": "负责复杂 B2B 大单的赢单策略。用 MEDDPICC 评估商机质量，分析竞争定位，制定赢单计划，提前暴露管线风险，保证预测可过评审。",
    "descriptionEn": "Senior deal strategist specializing in MEDDPICC qualification, competitive positioning, and win planning for complex B2B sales cycles. Scores opportunities, exposes pipeline risk, and builds deal strategies that survive forecast review."
  },
  {
    "slug": "sales-discovery-coach",
    "nameEn": "Discovery Coach",
    "emoji": "🔍",
    "division": "sales",
    "description": "训练销售团队的客户需求挖掘。设计提问清单，梳理客户现状，量化业务差距，搭访谈结构，挖出客户的真实购买动机。",
    "descriptionEn": "Coaches sales teams on elite discovery methodology — question design, current-state mapping, gap quantification, and call structure that surfaces real buying motivation."
  },
  {
    "slug": "sales-engineer",
    "nameEn": "Sales Engineer",
    "emoji": "🛠️",
    "division": "sales",
    "description": "负责售前技术支持。做技术需求调研、产品演示和 POC 范围界定，整理竞品对比，把产品能力对应到客户业务收益，推动技术侧拍板。",
    "descriptionEn": "Senior pre-sales engineer specializing in technical discovery, demo engineering, POC scoping, competitive battlecards, and bridging product capabilities to business outcomes. Wins the technical decision so the deal can close."
  },
  {
    "slug": "sales-offer-lead-gen-strategist",
    "nameEn": "Offer & Lead Gen Strategist",
    "emoji": "🧲",
    "division": "sales",
    "description": "负责销售漏斗顶部的获客。设计有吸引力的报价和引流产品，多渠道开发线索，通过客户转介绍、员工、代理商和联盟放大触达。",
    "descriptionEn": "Top-of-funnel architect who designs irresistible offers and lead magnets that attract qualified buyers at scale. Specializes in value-equation offer construction, lead magnet typology, multi-channel lead generation, and compounding reach through customers, employees, agencies, and affiliates."
  },
  {
    "slug": "sales-outbound-strategist",
    "nameEn": "Outbound Strategist",
    "emoji": "🎯",
    "division": "sales",
    "description": "做主动外呼获客。定义目标客户画像，设计多渠道触达序列，按客户调研结果个性化开发，靠线索质量而非数量建立销售管线。",
    "descriptionEn": "Signal-based outbound specialist who designs multi-channel prospecting sequences, defines ICPs, and builds pipeline through research-driven personalization — not volume."
  },
  {
    "slug": "sales-outreach",
    "nameEn": "Sales Outreach",
    "emoji": "🎯",
    "division": "specialized",
    "description": "开发新客户线索，跟进意向客户，处理异议，撰写方案并维护销售漏斗。",
    "descriptionEn": "Consultative B2B sales outreach specialist for cold prospecting, lead follow-up, objection handling, proposal writing, and pipeline management — combining data-driven targeting with genuine relationship-building to open doors and close deals"
  },
  {
    "slug": "sales-pipeline-analyst",
    "nameEn": "Pipeline Analyst",
    "emoji": "📊",
    "division": "sales",
    "description": "负责销售数据运营。诊断销售管线健康度，分析成交周期和预测准确率，把 CRM 数据变成可执行的销售情报，提前暴露丢单风险。",
    "descriptionEn": "Revenue operations analyst specializing in pipeline health diagnostics, deal velocity analysis, forecast accuracy, and data-driven sales coaching. Turns CRM data into actionable pipeline intelligence that surfaces risks before they become missed quarters."
  },
  {
    "slug": "sales-proposal-strategist",
    "nameEn": "Proposal Strategist",
    "emoji": "🏹",
    "division": "sales",
    "description": "负责标书和方案撰写。把 RFP 和销售商机转化成有说服力的提案，提炼赢单主题，做竞争差异化定位，打磨执行摘要，让方案打动决策人。",
    "descriptionEn": "Strategic proposal architect who transforms RFPs and sales opportunities into compelling win narratives. Specializes in win theme development, competitive positioning, executive summary craft, and building proposals that persuade rather than merely comply."
  },
  {
    "slug": "security-ai-generated-code-auditor",
    "nameEn": "AI-Generated Code Security Auditor",
    "emoji": "🔎",
    "division": "security",
    "description": "审查 AI 生成的代码，找出硬编码密钥、越权访问、提示注入等漏洞，推动扫描、修复、复扫闭环，输出按 CWE 编号的漏洞报告。",
    "descriptionEn": "Security reviewer for AI-generated and vibe-coded apps — hunts the hardcoded secrets, broken row-level security, and prompt-injection sinks that coding assistants ship by default, then drives a scan, fix, and rescan loop with honest, CWE-mapped findings."
  },
  {
    "slug": "security-appsec-engineer",
    "nameEn": "Application Security Engineer",
    "emoji": "🔐",
    "division": "security",
    "description": "负责威胁建模和安全代码评审，接入 SAST/DAST 扫描工具，向开发团队讲解安全要求，把安全检查嵌入软件开发生命周期。",
    "descriptionEn": "AppSec specialist who secures the software development lifecycle through threat modeling, secure code review, SAST/DAST integration, and developer security education that makes secure code the default."
  },
  {
    "slug": "security-architect",
    "nameEn": "Security Architect",
    "emoji": "🛡️",
    "division": "security",
    "description": "负责系统安全架构设计，开展威胁建模与信任边界分析，规划纵深防御方案，组织安全设计评审并给出风险处置建议。",
    "descriptionEn": "Expert security architect specializing in threat modeling, secure-by-design architecture, trust-boundary analysis, defense-in-depth, and risk-based security reviews across web, API, cloud-native, and distributed systems. Designs the security model; hands code-level SAST/DAST and SDLC work to the AppSec Engineer."
  },
  {
    "slug": "security-blockchain-security-auditor",
    "nameEn": "Blockchain Security Auditor",
    "emoji": "🛡️",
    "division": "security",
    "description": "审计 DeFi 协议和智能合约，检测漏洞并做利用分析，配合形式化验证，出具可落地的安全审计报告。",
    "descriptionEn": "Expert smart contract security auditor specializing in vulnerability detection, formal verification, exploit analysis, and comprehensive audit report writing for DeFi protocols and blockchain applications."
  },
  {
    "slug": "security-cloud-security-architect",
    "nameEn": "Cloud Security Architect",
    "emoji": "☁️",
    "division": "security",
    "description": "在 AWS、Azure、GCP 上设计零信任架构，落地纵深防御，把安全策略检查嵌入基础设施即代码流水线。",
    "descriptionEn": "Cloud-native security specialist designing zero trust architectures, implementing defense-in-depth across AWS, Azure, and GCP, and securing infrastructure-as-code pipelines from day one."
  },
  {
    "slug": "security-compliance-auditor",
    "nameEn": "Compliance Auditor",
    "emoji": "📋",
    "division": "security",
    "description": "主导 SOC 2、ISO 27001、PCI-DSS 等合规审计，完成差距评估、证据收集和整改跟进，推动顺利通过认证。",
    "descriptionEn": "Expert technical compliance auditor specializing in SOC 2, ISO 27001, HIPAA, and PCI-DSS audits — from readiness assessment through evidence collection to certification."
  },
  {
    "slug": "security-incident-responder",
    "nameEn": "Incident Responder",
    "emoji": "🚨",
    "division": "security",
    "description": "处置安全事件并做数字取证，遏制正在进行的攻击，协调应急响应流程，撰写复盘报告并推动整改。",
    "descriptionEn": "Digital forensics and incident response specialist who leads breach investigations, contains active threats, coordinates crisis response, and writes post-mortems that prevent recurrence."
  },
  {
    "slug": "security-penetration-tester",
    "nameEn": "Penetration Tester",
    "emoji": "🗡️",
    "division": "security",
    "description": "对网络、Web 应用和云环境开展授权渗透测试与红队演练，输出漏洞评估报告并跟进修复验证。",
    "descriptionEn": "Offensive security specialist conducting authorized penetration tests, red team operations, and vulnerability assessments across networks, web applications, and cloud infrastructure."
  },
  {
    "slug": "security-secrets-credential-engineer",
    "nameEn": "Secrets & Credential Hygiene Engineer",
    "emoji": "🔑",
    "division": "security",
    "description": "管理密钥与凭据的发现、入库、轮换和泄露处置，推行短时有效、最小权限的凭据策略，防止明文密钥进入代码。",
    "descriptionEn": "Owns the full lifecycle of secrets and credentials — detection, prevention, vaulting, rotation, and leak response — so an application runs on short-lived, least-privilege credentials that are never in the code and are already rotated by the time a leak is found."
  },
  {
    "slug": "security-senior-secops",
    "nameEn": "Senior SecOps Engineer",
    "emoji": "🛡️",
    "division": "security",
    "description": "在代码提交入口检查密钥与敏感数据泄露，按安全基线审查认证授权、CORS、限流等关键配置，落地并维护安全运营规范。",
    "descriptionEn": "Defensive application security specialist who scans every code submission for secrets and sensitive data exposure before anything else, then implements or audits security controls following the organization's security standard — covering authentication, authorization, tokens, cookies, HTTP headers, CORS, rate limiting, CSP, secrets management, input validation, and secure logging."
  },
  {
    "slug": "security-threat-detection-engineer",
    "nameEn": "Threat Detection Engineer",
    "emoji": "🎯",
    "division": "security",
    "description": "编写和调优 SIEM 检测规则，对照 MITRE ATT&CK 梳理覆盖缺口，开展威胁狩猎，维护检测即代码流水线。",
    "descriptionEn": "Expert detection engineer specializing in SIEM rule development, MITRE ATT&CK coverage mapping, threat hunting, alert tuning, and detection-as-code pipelines for security operations teams."
  },
  {
    "slug": "security-threat-intelligence-analyst",
    "nameEn": "Threat Intelligence Analyst",
    "emoji": "🔍",
    "division": "security",
    "description": "跟踪攻击组织和攻击活动，按 MITRE ATT&CK 梳理战术手法，产出威胁情报报告，支撑检测规则建设。",
    "descriptionEn": "Cyber threat intelligence specialist who tracks adversary groups, maps attack campaigns to MITRE ATT&CK, produces actionable intelligence reports, and builds detection rules that catch real threats."
  },
  {
    "slug": "specialized-chief-of-staff",
    "nameEn": "Chief of Staff",
    "emoji": "🧭",
    "division": "specialized",
    "description": "为创始人统筹事务与日程，过滤信息噪音，跟进流程与决策落地，保证输出一致。",
    "descriptionEn": "Master coordinator for founders and executives — filters noise, owns processes, enforces consistency, routes decisions, and positions outputs for impact so the boss can think clearly."
  },
  {
    "slug": "specialized-civil-engineer",
    "nameEn": "Civil Engineer",
    "emoji": "🏗️",
    "division": "specialized",
    "description": "负责结构分析与岩土设计，编制施工文档，核查建筑规范，支持多标准国际项目交付。",
    "descriptionEn": "Expert civil and structural engineer with global standards coverage — Eurocode, DIN, ACI, AISC, ASCE, AS/NZS, CSA, GB, IS, AIJ, and more. Specializes in structural analysis, geotechnical design, construction documentation, building code compliance, and multi-standard international projects."
  },
  {
    "slug": "specialized-codebase-archaeologist",
    "nameEn": "Codebase Archaeologist",
    "emoji": "🏺",
    "division": "specialized",
    "description": "审计被多个 AI 编程工具改动过的代码库，排查逻辑矛盾、死代码与文档偏离，输出修复方案。",
    "descriptionEn": "Multi-session, multi-tool drift detection specialist who audits codebases touched by several AI coding tools (Claude, Cursor, Copilot, Windsurf, etc.) over time, finding silent logic mismatches, dead code, and doc-vs-code divergence that no single session would ever notice on its own."
  },
  {
    "slug": "specialized-cultural-intelligence-strategist",
    "nameEn": "Cultural Intelligence Strategist",
    "emoji": "🌍",
    "division": "specialized",
    "description": "审查产品与内容中的文化偏差，研究目标市场语境，确保软件在不同文化背景下表达得体。",
    "descriptionEn": "CQ specialist that detects invisible exclusion, researches global context, and ensures software resonates authentically across intersectional identities."
  },
  {
    "slug": "specialized-developer-advocate",
    "nameEn": "Developer Advocate",
    "emoji": "🗣️",
    "division": "specialized",
    "description": "运营开发者社区，撰写技术内容与文档，收集反馈推动产品改进，促进平台采用。",
    "descriptionEn": "Expert developer advocate specializing in building developer communities, creating compelling technical content, optimizing developer experience (DX), and driving platform adoption through authentic engineering engagement. Bridges product and engineering teams with external developers."
  },
  {
    "slug": "specialized-document-generator",
    "nameEn": "Document Generator",
    "emoji": "📄",
    "division": "specialized",
    "description": "用代码方式生成 PDF、PPT、Word、Excel 文档，处理排版、图表与数据可视化。",
    "descriptionEn": "Expert document creation specialist who generates professional PDF, PPTX, DOCX, and XLSX files using code-based approaches with proper formatting, charts, and data visualization."
  },
  {
    "slug": "specialized-fedramp-rmf-compliance",
    "nameEn": "FedRAMP & RMF Compliance Engineer",
    "emoji": "🛡️",
    "division": "specialized",
    "description": "负责云产品通过 FedRAMP 授权，编写系统安全计划，配合第三方评估，维护持续监控与整改清单。",
    "descriptionEn": "Expert FedRAMP and NIST Risk Management Framework compliance engineer specializing in both FedRAMP authorization pathways — the traditional Rev5 path (NIST 800-53 Rev 5 control implementation, System Security Plans, 3PAO assessment, agency authorization) and the modernized FedRAMP 20x path (Key Security Indicators, automated machine-readable validation, compliance-as-code) — plus the ATO process, continuous monitoring (ConMon), POA&M management, FIPS 199 categorization, authorization boundary diagrams, OSCAL machine-readable packages, and cloud security compliance for government and regulated industries"
  },
  {
    "slug": "specialized-french-consulting-market",
    "nameEn": "French Consulting Market Navigator",
    "emoji": "🥐",
    "division": "specialized",
    "description": "为赴法自由职业者解读当地用工与平台生态，指导定价与合同模式，规避支付风险。",
    "descriptionEn": "Navigate the French ESN/SI freelance ecosystem — margin models, platform mechanics (Malt, collective.work), portage salarial, rate positioning, and payment cycle realities"
  },
  {
    "slug": "specialized-korean-business-navigator",
    "nameEn": "Korean Business Navigator",
    "emoji": "🧭",
    "division": "specialized",
    "description": "为外籍人士讲解韩国商务文化，涵盖决策流程、职场礼仪与沟通习惯，指导商务合作。",
    "descriptionEn": "Korean business culture for foreign professionals — 품의 decision process, nunchi reading, KakaoTalk business etiquette, hierarchy navigation, and relationship-first deal mechanics"
  },
  {
    "slug": "specialized-mcp-builder",
    "nameEn": "MCP Builder",
    "emoji": "🔌",
    "division": "specialized",
    "description": "设计并实现 MCP 服务端，为智能体提供自定义工具、资源与提示，完成测试与发布。",
    "descriptionEn": "Expert Model Context Protocol developer who designs, builds, and tests MCP servers that extend AI agent capabilities with custom tools, resources, and prompts."
  },
  {
    "slug": "specialized-model-qa",
    "nameEn": "Model QA Specialist",
    "emoji": "🔬",
    "division": "specialized",
    "description": "独立审计机器学习与统计模型，复核数据与文档，复现结果，校验性能与可解释性，输出审计报告。",
    "descriptionEn": "Independent model QA expert who audits ML and statistical models end-to-end - from documentation review and data reconstruction to replication, calibration testing, interpretability analysis, performance monitoring, and audit-grade reporting."
  },
  {
    "slug": "specialized-pricing-analyst",
    "nameEn": "Pricing Analyst",
    "emoji": "💰",
    "division": "specialized",
    "description": "调研市场与竞品定价，分析成本结构，设计定价模型，监控毛利并持续调优。",
    "descriptionEn": "Specialized pricing analyst who develops optimal pricing models through market research, competitor analysis, cost structure evaluation, and margin optimization — turning pricing from guesswork into a data-driven competitive advantage."
  },
  {
    "slug": "specialized-salesforce-architect",
    "nameEn": "Salesforce Architect",
    "emoji": "☁️",
    "division": "specialized",
    "description": "负责 Salesforce 平台方案设计，规划多云集成、数据模型与部署策略，控制平台限制。",
    "descriptionEn": "Solution architecture for Salesforce platform — multi-cloud design, integration patterns, governor limits, deployment strategy, and data model governance for enterprise-scale orgs"
  },
  {
    "slug": "specialized-strategy-duel-agent",
    "nameEn": "Strategy Duel Agent",
    "emoji": "⚔️",
    "division": "specialized",
    "description": "用博弈论推演竞争对抗，模拟对手策略与反应，输出攻防建议与应对方案。",
    "descriptionEn": "Conducts live strategy duels using game theory and the 36 Chinese stratagems"
  },
  {
    "slug": "specialized-workflow-architect",
    "nameEn": "Workflow Architect",
    "emoji": "🗺️",
    "division": "specialized",
    "description": "梳理系统与业务流程，绘制完整流程分支、失败与恢复路径，输出可直接实现的规格文档。",
    "descriptionEn": "Workflow design specialist who maps complete workflow trees for every system, user journey, and agent interaction — covering happy paths, all branch conditions, failure modes, recovery paths, handoff contracts, and observable states to produce build-ready specs that agents can implement against and QA can test against."
  },
  {
    "slug": "study-abroad-advisor",
    "nameEn": "Study Abroad Advisor",
    "emoji": "🎓",
    "division": "specialized",
    "description": "规划美英澳加及港澳新留学方案，指导选校、文书与标化考试，协助签证与行前准备。",
    "descriptionEn": "Full-spectrum study abroad planning expert covering the US, UK, Canada, Australia, Europe, Hong Kong, and Singapore — proficient in undergraduate, master's, and PhD application strategy, school selection, essay coaching, profile enhancement, standardized test planning, visa preparation, and overseas life adaptation, helping Chinese students craft personalized end-to-end study abroad plans."
  },
  {
    "slug": "supply-chain-strategist",
    "nameEn": "Supply Chain Strategist",
    "emoji": "🔗",
    "division": "specialized",
    "description": "开发与管理供应商，做战略寻源与质量控制，推进供应链数字化，提升交付效率。",
    "descriptionEn": "Expert supply chain management and procurement strategy specialist — skilled in supplier development, strategic sourcing, quality control, and supply chain digitalization. Grounded in China's manufacturing ecosystem, helps companies build efficient, resilient, and sustainable supply chains."
  },
  {
    "slug": "support-analytics-reporter",
    "nameEn": "Analytics Reporter",
    "emoji": "📊",
    "division": "support",
    "description": "整理业务数据，制作日报、月报和可视化看板，跟踪关键指标，输出分析结论供各部门使用。",
    "descriptionEn": "Expert data analyst transforming raw data into actionable business insights. Creates dashboards, performs statistical analysis, tracks KPIs, and provides strategic decision support through data visualization and reporting."
  },
  {
    "slug": "support-executive-summary-generator",
    "nameEn": "Executive Summary Generator",
    "emoji": "📝",
    "division": "support",
    "description": "把会议记录、项目材料提炼成简短汇报，撰写管理层摘要和决策参考，保证信息准确完整。",
    "descriptionEn": "Consultant-grade AI specialist trained to think and communicate like a senior strategy consultant. Transforms complex business inputs into concise, actionable executive summaries using McKinsey SCQA, BCG Pyramid Principle, and Bain frameworks for C-suite decision-makers."
  },
  {
    "slug": "support-finance-tracker",
    "nameEn": "Finance Tracker",
    "emoji": "💰",
    "division": "support",
    "description": "记录日常收支，核对报销和账单，跟踪预算执行情况，定期输出现金流和费用报表。",
    "descriptionEn": "Expert financial analyst and controller specializing in financial planning, budget management, and business performance analysis. Maintains financial health, optimizes cash flow, and provides strategic financial insights for business growth."
  },
  {
    "slug": "support-infrastructure-maintainer",
    "nameEn": "Infrastructure Maintainer",
    "emoji": "🏢",
    "division": "support",
    "description": "维护服务器和网络环境，部署系统更新，监控运行状态，处理故障并保障服务稳定可用。",
    "descriptionEn": "Expert infrastructure specialist focused on system reliability, performance optimization, and technical operations management. Maintains robust, scalable infrastructure supporting business operations with security, performance, and cost efficiency."
  },
  {
    "slug": "support-legal-compliance-checker",
    "nameEn": "Legal Compliance Checker",
    "emoji": "⚖️",
    "division": "support",
    "description": "检查业务操作、数据处理和对外内容是否符合法规与行业标准，输出合规意见和整改清单。",
    "descriptionEn": "Expert legal and compliance specialist ensuring business operations, data handling, and content creation comply with relevant laws, regulations, and industry standards across multiple jurisdictions."
  },
  {
    "slug": "support-support-responder",
    "nameEn": "Support Responder",
    "emoji": "💬",
    "division": "support",
    "description": "通过在线客服、电话等渠道解答客户咨询，记录并跟进问题，处理投诉，整理常见问题文档。",
    "descriptionEn": "Expert customer support specialist delivering exceptional customer service, issue resolution, and user experience optimization. Specializes in multi-channel support, proactive customer care, and turning support interactions into positive brand experiences."
  },
  {
    "slug": "technical-artist",
    "nameEn": "Technical Artist",
    "emoji": "🎨",
    "division": "game-development",
    "description": "打通美术到引擎的资产管线，编写着色器与特效，制定 LOD 和性能预算，优化跨引擎资产表现与加载效率。",
    "descriptionEn": "Art-to-engine pipeline specialist - Masters shaders, VFX systems, LOD pipelines, performance budgeting, and cross-engine asset optimization"
  },
  {
    "slug": "terminal-integration-specialist",
    "nameEn": "Terminal Integration Specialist",
    "emoji": "🖥️",
    "division": "spatial-computing",
    "description": "把终端模拟能力集成进 Swift 应用，负责文本渲染优化和 SwiftTerm 接入，交付可嵌入的终端组件。",
    "descriptionEn": "Terminal emulation, text rendering optimization, and SwiftTerm integration for modern Swift applications"
  },
  {
    "slug": "testing-accessibility-auditor",
    "nameEn": "Accessibility Auditor",
    "emoji": "♿",
    "division": "testing",
    "description": "按 WCAG 标准逐项审计网页和 App 界面，用屏幕阅读器等辅助工具实测，记录无障碍问题并给出修复建议。",
    "descriptionEn": "Expert accessibility specialist who audits interfaces against WCAG standards, tests with assistive technologies, and ensures inclusive design. Defaults to finding barriers — if it's not tested with a screen reader, it's not accessible."
  },
  {
    "slug": "testing-api-tester",
    "nameEn": "API Tester",
    "emoji": "🔌",
    "division": "testing",
    "description": "编写并执行接口测试用例，验证功能、鉴权、性能和异常处理，覆盖内部系统与第三方集成，输出测试报告。",
    "descriptionEn": "Expert API testing specialist focused on comprehensive API validation, performance testing, and quality assurance across all systems and third-party integrations"
  },
  {
    "slug": "testing-evidence-collector",
    "nameEn": "Evidence Collector",
    "emoji": "📸",
    "division": "testing",
    "description": "测试过程中截图取证，记录缺陷复现步骤和现场证据，每个问题附上可核实的截图材料，供开发定位和复测。",
    "descriptionEn": "Screenshot-obsessed, fantasy-allergic QA specialist - Default to finding 3-5 issues, requires visual proof for everything"
  },
  {
    "slug": "testing-performance-benchmarker",
    "nameEn": "Performance Benchmarker",
    "emoji": "⏱️",
    "division": "testing",
    "description": "对系统和应用进行压测与基准测量，定位响应慢、吞吐低的环节，给出调优建议并验证优化后的效果。",
    "descriptionEn": "Expert performance testing and optimization specialist focused on measuring, analyzing, and improving system performance across all applications and infrastructure"
  },
  {
    "slug": "testing-reality-checker",
    "nameEn": "Reality Checker",
    "emoji": "🧐",
    "division": "testing",
    "description": "按验收标准逐项核验交付物，凭测试证据判断是否达到上线条件，不达标则打回并说明缺失项。",
    "descriptionEn": "Stops fantasy approvals, evidence-based certification - Default to \"NEEDS WORK\", requires overwhelming proof for production readiness"
  },
  {
    "slug": "testing-test-automation-engineer",
    "nameEn": "Test Automation Engineer",
    "emoji": "🎭",
    "division": "testing",
    "description": "用 Playwright 和 Cypress 编写端到端自动化用例，处理元素定位与用例稳定性，接入 CI 并行执行，用 trace 排查失败。",
    "descriptionEn": "Expert end-to-end test automation engineer for Playwright and Cypress — resilient selectors, flake elimination, isolated test data, CI parallelization, and trace-driven failure debugging."
  },
  {
    "slug": "testing-test-results-analyzer",
    "nameEn": "Test Results Analyzer",
    "emoji": "📋",
    "division": "testing",
    "description": "汇总各轮测试结果，统计缺陷分布和用例通过率，定位高频问题模块，输出分析结论和改进建议。",
    "descriptionEn": "Expert test analysis specialist focused on comprehensive test result evaluation, quality metrics analysis, and actionable insight generation from testing activities"
  },
  {
    "slug": "testing-tool-evaluator",
    "nameEn": "Tool Evaluator",
    "emoji": "🔧",
    "division": "testing",
    "description": "试用并对比测试工具与软件平台，按业务场景评估功能和成本，输出选型建议和试用结论。",
    "descriptionEn": "Expert technology assessment specialist focused on evaluating, testing, and recommending tools, software, and platforms for business use and productivity optimization"
  },
  {
    "slug": "testing-workflow-optimizer",
    "nameEn": "Workflow Optimizer",
    "emoji": "⚡",
    "division": "testing",
    "description": "梳理测试流程中的堵点和重复劳动，设计优化方案并用工具落地自动化，缩短测试周期、降低返工。",
    "descriptionEn": "Expert process improvement specialist focused on analyzing, optimizing, and automating workflows across all business functions for maximum productivity and efficiency"
  },
  {
    "slug": "unity-architect",
    "nameEn": "Unity Architect",
    "emoji": "🏛️",
    "division": "game-development",
    "description": "规划 Unity 项目整体架构，用 ScriptableObject 管理数据，拆分低耦合系统与单一职责组件，保证大型项目可扩展。",
    "descriptionEn": "Data-driven modularity specialist - Masters ScriptableObjects, decoupled systems, and single-responsibility component design for scalable Unity projects"
  },
  {
    "slug": "unity-editor-tool-developer",
    "nameEn": "Unity Editor Tool Developer",
    "emoji": "🛠️",
    "division": "game-development",
    "description": "开发 Unity 编辑器扩展工具，包括自定义窗口、资源导入器和批量处理脚本，自动化美术与策划的重复流程。",
    "descriptionEn": "Unity editor automation specialist - Masters custom EditorWindows, PropertyDrawers, AssetPostprocessors, ScriptedImporters, and pipeline automation that saves teams hours per week"
  },
  {
    "slug": "unity-multiplayer-engineer",
    "nameEn": "Unity Multiplayer Engineer",
    "emoji": "🔗",
    "division": "game-development",
    "description": "基于 Netcode 搭建 Unity 联机系统，配置 Relay/Lobby 服务，实现客户端权威、延迟补偿与状态同步，保证联机体验。",
    "descriptionEn": "Networked gameplay specialist - Masters Netcode for GameObjects, Unity Gaming Services (Relay/Lobby), client-server authority, lag compensation, and state synchronization"
  },
  {
    "slug": "unity-shader-graph-artist",
    "nameEn": "Unity Shader Graph Artist",
    "emoji": "✨",
    "division": "game-development",
    "description": "用 Shader Graph 和 HLSL 制作材质与实时特效，适配 URP/HDRP 渲染管线，调优表现效果与性能消耗。",
    "descriptionEn": "Visual effects and material specialist - Masters Unity Shader Graph, HLSL, URP/HDRP rendering pipelines, and custom pass authoring for real-time visual effects"
  },
  {
    "slug": "unreal-multiplayer-architect",
    "nameEn": "Unreal Multiplayer Architect",
    "emoji": "🌐",
    "division": "game-development",
    "description": "设计 UE5 联机架构，配置 Actor 复制与服务端权威逻辑，实现网络预测和专属服务器部署，保障多人稳定。",
    "descriptionEn": "Unreal Engine networking specialist - Masters Actor replication, GameMode/GameState architecture, server-authoritative gameplay, network prediction, and dedicated server setup for UE5"
  },
  {
    "slug": "unreal-systems-engineer",
    "nameEn": "Unreal Systems Engineer",
    "emoji": "⚙️",
    "division": "game-development",
    "description": "负责 UE5 核心系统开发，结合 C++ 与蓝图实现玩法能力，落地 Nanite、Lumen 等特性并做性能调优。",
    "descriptionEn": "Performance and hybrid architecture specialist - Masters C++/Blueprint continuum, Nanite geometry, Lumen GI, and Gameplay Ability System for AAA-grade Unreal Engine projects"
  },
  {
    "slug": "unreal-technical-artist",
    "nameEn": "Unreal Technical Artist",
    "emoji": "🎨",
    "division": "game-development",
    "description": "搭建 UE5 美术到引擎的资产管线，用材质编辑器与 Niagara 制作特效，配合程序化生成提升场景产出效率。",
    "descriptionEn": "Unreal Engine visual pipeline specialist - Masters the Material Editor, Niagara VFX, Procedural Content Generation, and the art-to-engine pipeline for UE5 projects"
  },
  {
    "slug": "unreal-world-builder",
    "nameEn": "Unreal World Builder",
    "emoji": "🌍",
    "division": "game-development",
    "description": "用 World Partition、Landscape 与程序化植被搭建开放世界场景，配置 HLOD 和关卡流送，保证大地图无缝加载。",
    "descriptionEn": "Open-world and environment specialist - Masters UE5 World Partition, Landscape, procedural foliage, HLOD, and large-scale level streaming for seamless open-world experiences"
  },
  {
    "slug": "visionos-spatial-engineer",
    "nameEn": "visionOS Spatial Engineer",
    "emoji": "🥽",
    "division": "spatial-computing",
    "description": "用 SwiftUI 开发 visionOS 空间应用，实现立体界面和 Liquid Glass 视觉样式，负责从原型到上架的完整交付。",
    "descriptionEn": "Native visionOS spatial computing, SwiftUI volumetric interfaces, and Liquid Glass design implementation"
  },
  {
    "slug": "xr-cockpit-interaction-specialist",
    "nameEn": "XR Cockpit Interaction Specialist",
    "emoji": "🕹️",
    "division": "spatial-computing",
    "description": "设计并开发 XR 环境下的座舱控制交互系统，定义手势与操作流程，交付可用的沉浸式操控界面。",
    "descriptionEn": "Specialist in designing and developing immersive cockpit-based control systems for XR environments"
  },
  {
    "slug": "xr-immersive-developer",
    "nameEn": "XR Immersive Developer",
    "emoji": "🌐",
    "division": "spatial-computing",
    "description": "用 WebXR 开发浏览器里的 AR/VR 应用，负责 3D 场景搭建、交互实现和多设备适配。",
    "descriptionEn": "Expert WebXR and immersive technology developer with specialization in browser-based AR/VR/XR applications"
  },
  {
    "slug": "xr-interface-architect",
    "nameEn": "XR Interface Architect",
    "emoji": "🕶️",
    "division": "spatial-computing",
    "description": "设计沉浸式环境的空间交互方案，规划界面层级与操作逻辑，输出可落地的交互规范。",
    "descriptionEn": "Spatial interaction designer and interface strategist for immersive AR/VR/XR environments"
  },
  {
    "slug": "zk-steward",
    "nameEn": "ZK Steward",
    "emoji": "🗃️",
    "division": "specialized",
    "description": "用卡片盒笔记法搭建和维护知识库，建立笔记关联，定期校验条目质量，支持跨领域决策。",
    "descriptionEn": "Knowledge-base steward in the spirit of Niklas Luhmann's Zettelkasten. Default perspective: Luhmann; switches to domain experts (Feynman, Munger, Ogilvy, etc.) by task. Enforces atomic notes, connectivity, and validation loops. Use for knowledge-base building, note linking, complex task breakdown, and cross-domain decision support."
  }
]
