window.__ModuleLoader__.load({
	id: "@michengai/dsh-agency-agents",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		//#region src/names.ts
		/** 分区目录名 → 中文分区名。 */
		const ZH_DIVISION = {
			academic: "学术",
			design: "设计",
			engineering: "工程",
			finance: "金融",
			"game-development": "游戏开发",
			gis: "地理信息",
			healthcare: "医疗健康",
			marketing: "市场营销",
			"paid-media": "付费媒体",
			product: "产品",
			"project-management": "项目管理",
			sales: "销售",
			security: "安全",
			"spatial-computing": "空间计算",
			specialized: "专业",
			support: "支持",
			testing: "测试"
		};
		/** 智能体 slug（文件名去 .md）→ 中文名（现实岗位）。缺省时回退英文 frontmatter name。 */
		const ZH_NAME = {
			"academic-anthropologist": "人类学家",
			"academic-geographer": "地理学家",
			"academic-historian": "历史学家",
			"academic-narratologist": "叙事学家",
			"academic-psychologist": "心理学家",
			"academic-statistician": "统计学家",
			"design-brand-guardian": "品牌视觉设计师",
			"design-image-prompt-engineer": "AI 图像设计师",
			"design-inclusive-visuals-specialist": "无障碍设计师",
			"design-persona-walkthrough": "用户体验设计师",
			"design-ui-designer": "UI 设计师",
			"design-ui-finish-gate-reviewer": "UI 视觉验收设计师",
			"design-ux-architect": "UX 架构师",
			"design-ux-researcher": "UX 研究员",
			"design-visual-storyteller": "视觉传达设计师",
			"design-whimsy-injector": "创意设计师",
			"engineering-ai-data-remediation-engineer": "AI 数据治理工程师",
			"engineering-ai-engineer": "AI 工程师",
			"engineering-api-platform-engineer": "API 平台工程师",
			"engineering-autonomous-optimization-architect": "自动化优化架构师",
			"engineering-backend-architect": "后端架构师",
			"engineering-cms-developer": "CMS 开发者",
			"engineering-code-reviewer": "代码审查工程师",
			"engineering-codebase-onboarding-engineer": "工程效率工程师",
			"engineering-data-engineer": "数据工程师",
			"engineering-data-visualization-engineer": "数据可视化工程师",
			"engineering-database-optimizer": "数据库性能工程师",
			"engineering-database-reliability-engineer": "数据库可靠性工程师",
			"engineering-desktop-app-engineer": "桌面应用工程师",
			"engineering-developer-tooling-engineer": "开发者工具工程师",
			"engineering-devops-automator": "DevOps 自动化工程师",
			"engineering-drupal-performance": "Drupal 性能工程师",
			"engineering-drupal-shopping-cart": "Drupal 购物车工程师",
			"engineering-email-intelligence-engineer": "邮件系统工程师",
			"engineering-embedded-firmware-engineer": "嵌入式固件工程师",
			"engineering-feishu-integration-developer": "飞书集成开发工程师",
			"engineering-filament-optimization-specialist": "Filament 后台优化专家",
			"engineering-finops-engineer": "FinOps 工程师",
			"engineering-frontend-developer": "前端开发者",
			"engineering-gaussdb-expert": "GaussDB 专家工程师",
			"engineering-git-workflow-master": "Git 工作流工程师",
			"engineering-i18n-engineer": "国际化工程师",
			"engineering-identity-access-engineer": "身份与访问管理工程师",
			"engineering-incident-response-commander": "故障应急工程师",
			"engineering-iot-fleet-engineer": "物联网设备工程师",
			"engineering-it-service-manager": "IT 服务经理",
			"engineering-llm-post-training-engineer": "LLM 后训练工程师",
			"engineering-minimal-change-engineer": "低风险变更工程师",
			"engineering-mobile-app-builder": "移动应用开发工程师",
			"engineering-mobile-release-engineer": "移动发布工程师",
			"engineering-multi-agent-systems-architect": "多智能体系统架构师",
			"engineering-network-engineer": "网络工程师",
			"engineering-orgscript-engineer": "OrgScript 工程师",
			"engineering-payments-billing-engineer": "支付计费工程师",
			"engineering-privacy-engineer": "隐私工程师",
			"engineering-prompt-engineer": "提示词工程师",
			"engineering-rag-pipeline-engineer": "RAG 管线工程师",
			"engineering-rapid-prototyper": "快速原型工程师",
			"engineering-realtime-collaboration-engineer": "实时协作工程师",
			"engineering-rust-refactoring-specialist": "Rust 重构工程师",
			"engineering-search-relevance-engineer": "搜索相关性工程师",
			"engineering-section-508-specialist": "无障碍合规工程师",
			"engineering-senior-developer": "高级开发者",
			"engineering-software-architect": "软件架构师",
			"engineering-solidity-smart-contract-engineer": "Solidity 智能合约工程师",
			"engineering-sre": "SRE（站点可靠性工程师）",
			"engineering-technical-writer": "技术文档工程师",
			"engineering-uswds-developer": "USWDS 开发者",
			"engineering-video-streaming-engineer": "视频流工程师",
			"engineering-voice-ai-integration-engineer": "语音 AI 集成工程师",
			"engineering-webassembly-engineer": "WebAssembly 工程师",
			"engineering-wechat-mini-program-developer": "微信小程序开发者",
			"engineering-wordpress-performance": "WordPress 性能工程师",
			"engineering-wordpress-shopping-cart": "WordPress 购物车工程师",
			"finance-bookkeeper-controller": "财务会计主管",
			"finance-financial-analyst": "财务分析师",
			"finance-fpa-analyst": "财务计划分析师",
			"finance-investment-researcher": "投资研究员",
			"finance-tax-strategist": "税务筹划师",
			"economy-designer": "经济系统设计师",
			"game-audio-engineer": "游戏音频工程师",
			"game-designer": "游戏设计师",
			"level-designer": "关卡设计师",
			"narrative-designer": "叙事设计师",
			"technical-artist": "技术美术",
			"gis-3d-scene-developer": "3D 场景开发者",
			"gis-analyst": "GIS 分析师",
			"gis-bim-specialist": "BIM/GIS 专家",
			"gis-cartography-designer": "制图设计师",
			"gis-drone-reality-mapping": "无人机/实景测绘专家",
			"gis-geoai-ml-engineer": "地理 AI/ML 工程师",
			"gis-geoprocessing-specialist": "地理处理专家",
			"gis-qa-engineer": "GIS QA 工程师",
			"gis-solution-engineer": "解决方案工程师",
			"gis-spatial-data-engineer": "空间数据工程师",
			"gis-spatial-data-scientist": "空间数据科学家",
			"gis-technical-consultant": "技术顾问",
			"gis-web-gis-developer": "Web GIS 开发者",
			"healthcare-clinical-evidence-agent": "循证医学研究员",
			"healthcare-innovation-strategist": "医疗创新战略顾问",
			"healthcare-sovereign-health-systems-agent": "医疗系统治理顾问",
			"marketing-aeo-foundations": "AEO 搜索优化师",
			"marketing-agentic-search-optimizer": "AI 搜索优化师",
			"marketing-ai-citation-strategist": "AI 引用优化师",
			"marketing-app-store-optimizer": "应用商店优化师",
			"marketing-baidu-seo-specialist": "百度 SEO 专家",
			"marketing-bilibili-content-strategist": "B站内容运营专家",
			"marketing-book-co-author": "图书策划编辑",
			"marketing-carousel-growth-engine": "内容增长运营专家",
			"marketing-china-ecommerce-operator": "中国电商运营",
			"marketing-china-market-localization-strategist": "中国市场本地化专家",
			"marketing-content-creator": "内容创作者",
			"marketing-cross-border-ecommerce": "跨境电商专家",
			"marketing-douyin-strategist": "抖音运营专家",
			"marketing-email-strategist": "邮件营销专家",
			"marketing-global-podcast-strategist": "播客运营专家",
			"marketing-growth-hacker": "增长营销专家",
			"marketing-instagram-curator": "Instagram 运营",
			"marketing-kuaishou-strategist": "快手运营专家",
			"marketing-linkedin-content-creator": "LinkedIn 内容创作者",
			"marketing-livestream-commerce-coach": "直播电商运营专家",
			"marketing-multi-platform-publisher": "多平台内容运营专家",
			"marketing-podcast-strategist": "播客运营专家",
			"marketing-pr-communications-manager": "公关传播经理",
			"marketing-private-domain-operator": "私域运营",
			"marketing-reddit-community-builder": "Reddit 社区运营",
			"marketing-seo-specialist": "SEO 专家",
			"marketing-short-video-editing-coach": "短视频剪辑师",
			"marketing-social-media-strategist": "社媒运营专家",
			"marketing-tiktok-strategist": "TikTok 运营专家",
			"marketing-twitter-engager": "Twitter 互动运营",
			"marketing-video-optimization-specialist": "视频优化专家",
			"marketing-wechat-official-account": "公众号运营",
			"marketing-weibo-strategist": "微博运营专家",
			"marketing-x-twitter-intelligence-analyst": "X/Twitter 舆情分析师",
			"marketing-xiaohongshu-specialist": "小红书运营专家",
			"marketing-zhihu-strategist": "知乎运营专家",
			"paid-media-auditor": "广告投放审计师",
			"paid-media-creative-strategist": "广告创意策划师",
			"paid-media-paid-social-strategist": "付费社媒投放专家",
			"paid-media-ppc-strategist": "PPC 投放优化师",
			"paid-media-programmatic-buyer": "程序化广告投放师",
			"paid-media-search-query-analyst": "搜索词分析师",
			"paid-media-tracking-specialist": "广告归因分析师",
			"product-behavioral-nudge-engine": "增长产品经理",
			"product-feedback-synthesizer": "用户反馈研究员",
			"product-manager": "产品经理",
			"product-sprint-prioritizer": "需求优先级分析师",
			"product-trend-researcher": "趋势研究员",
			"project-management-experiment-tracker": "实验项目运营",
			"project-management-jira-workflow-steward": "Jira 流程管理员",
			"project-management-meeting-notes-specialist": "项目记录专员",
			"project-management-project-shepherd": "项目推进专员",
			"project-management-studio-operations": "工作室运营",
			"project-management-studio-producer": "工作室制片人",
			"project-manager-senior": "高级项目经理",
			"sales-account-strategist": "大客户经理",
			"sales-coach": "销售培训师",
			"sales-deal-strategist": "商务谈判顾问",
			"sales-discovery-coach": "售前需求顾问",
			"sales-engineer": "销售工程师",
			"sales-offer-lead-gen-strategist": "销售获客专员",
			"sales-outbound-strategist": "外呼销售专员",
			"sales-pipeline-analyst": "销售管线分析师",
			"sales-proposal-strategist": "方案提案顾问",
			"security-ai-generated-code-auditor": "AI 生成代码安全审计师",
			"security-appsec-engineer": "应用安全工程师",
			"security-architect": "安全架构师",
			"security-blockchain-security-auditor": "区块链安全审计师",
			"security-cloud-security-architect": "云安全架构师",
			"security-compliance-auditor": "合规审计师",
			"security-incident-responder": "应急响应工程师",
			"security-penetration-tester": "渗透测试工程师",
			"security-secrets-credential-engineer": "密钥与凭据治理工程师",
			"security-senior-secops": "高级安全运营工程师",
			"security-threat-detection-engineer": "威胁检测工程师",
			"security-threat-intelligence-analyst": "威胁情报分析师",
			"macos-spatial-metal-engineer": "macOS 空间/Metal 工程师",
			"terminal-integration-specialist": "终端集成专家",
			"visionos-spatial-engineer": "visionOS 空间工程师",
			"xr-cockpit-interaction-specialist": "XR 座舱交互专家",
			"xr-immersive-developer": "XR 沉浸式开发者",
			"xr-interface-architect": "XR 界面架构师",
			"accounts-payable-agent": "应付账款会计",
			"agentic-identity-trust": "身份与信任架构师",
			"agents-orchestrator": "AI 流程编排师",
			"automation-governance-architect": "自动化治理架构师",
			"business-strategist": "商业策略顾问",
			"change-management-consultant": "变革管理顾问",
			"chief-financial-officer": "首席财务官",
			"corporate-training-designer": "企业培训师",
			"customer-service": "客户服务",
			"customer-success-manager": "客户成功经理",
			"data-consolidation-agent": "数据整合专员",
			"data-privacy-officer": "数据隐私官",
			"esg-sustainability-officer": "ESG 与可持续发展官",
			"government-digital-presales-consultant": "政务数字化售前顾问",
			"grant-writer": "基金申报专员",
			"healthcare-aging-parent-care-companion": "老年照护顾问",
			"healthcare-customer-service": "医疗客服",
			"healthcare-marketing-compliance": "医疗营销合规专家",
			"hospitality-guest-services": "酒店宾客服务",
			"hr-onboarding": "HR 入职专员",
			"identity-graph-operator": "身份图谱运营",
			"language-translator": "翻译专员",
			"legal-billing-time-tracking": "法务计费专员",
			"legal-client-intake": "法务客户接待专员",
			"legal-document-review": "法务文档审核员",
			"loan-officer-assistant": "信贷专员助理",
			"lsp-index-engineer": "LSP/索引工程师",
			"ma-integration-manager": "并购整合经理",
			"medical-billing-coding-specialist": "医疗计费编码专家",
			"operations-manager": "运营经理",
			"organizational-psychologist": "组织心理学家",
			"personal-growth-mentor": "职业发展导师",
			"real-estate-buyer-seller": "房产买卖顾问",
			"recruitment-specialist": "招聘专员",
			"report-distribution-agent": "报告分发专员",
			"resume-tailor": "简历优化顾问",
			"retail-customer-returns": "零售售后客服",
			"sales-data-extraction-agent": "销售数据专员",
			"sales-outreach": "销售拓展专员",
			"specialized-chief-of-staff": "幕僚长",
			"specialized-civil-engineer": "土木工程师",
			"specialized-codebase-archaeologist": "遗留系统工程师",
			"specialized-cultural-intelligence-strategist": "跨文化咨询顾问",
			"specialized-developer-advocate": "开发者布道师",
			"specialized-document-generator": "文档工程师",
			"specialized-fedramp-rmf-compliance": "FedRAMP 与 RMF 合规工程师",
			"specialized-french-consulting-market": "法国市场咨询顾问",
			"specialized-korean-business-navigator": "韩国市场咨询顾问",
			"specialized-mcp-builder": "MCP 集成工程师",
			"specialized-model-qa": "模型质量评估工程师",
			"specialized-pricing-analyst": "定价分析师",
			"specialized-salesforce-architect": "Salesforce 架构师",
			"specialized-strategy-duel-agent": "竞争战略分析师",
			"specialized-workflow-architect": "工作流架构师",
			"study-abroad-advisor": "留学顾问",
			"supply-chain-strategist": "供应链规划师",
			"zk-steward": "零知识证明工程师",
			"support-analytics-reporter": "分析报表专员",
			"support-executive-summary-generator": "管理报告专员",
			"support-finance-tracker": "财务跟踪专员",
			"support-infrastructure-maintainer": "基础设施运维工程师",
			"support-legal-compliance-checker": "合规检查专员",
			"support-support-responder": "客服响应专员",
			"testing-accessibility-auditor": "无障碍测试工程师",
			"testing-api-tester": "API 测试工程师",
			"testing-evidence-collector": "质量记录专员",
			"testing-performance-benchmarker": "性能基准测试工程师",
			"testing-reality-checker": "验收测试工程师",
			"testing-test-automation-engineer": "测试自动化工程师",
			"testing-test-results-analyzer": "测试结果分析师",
			"testing-tool-evaluator": "测试工具评估工程师",
			"testing-workflow-optimizer": "测试流程优化工程师",
			"blender-addon-engineer": "Blender 插件工程师",
			"godot-gameplay-scripter": "Godot 玩法脚本工程师",
			"godot-multiplayer-engineer": "Godot 多人联机工程师",
			"godot-shader-developer": "Godot 着色器开发者",
			"roblox-avatar-creator": "Roblox 虚拟形象创作者",
			"roblox-experience-designer": "Roblox 体验设计师",
			"roblox-systems-scripter": "Roblox 系统脚本工程师",
			"unity-architect": "Unity 架构师",
			"unity-editor-tool-developer": "Unity 编辑器工具开发者",
			"unity-multiplayer-engineer": "Unity 多人联机工程师",
			"unity-shader-graph-artist": "Unity 着色器美术",
			"unreal-multiplayer-architect": "Unreal 多人联机架构师",
			"unreal-systems-engineer": "Unreal 系统工程师",
			"unreal-technical-artist": "Unreal 技术美术",
			"unreal-world-builder": "Unreal 世界构建师",
			"backend-architect-with-memory": "资深后端架构师"
		};
		//#endregion
		//#region src/client/roster.ts
		const ROSTER = [
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
		];
		//#endregion
		//#region src/client/locales.ts
		/**
		* Agency 客户端词条字典。zh 为 key 集真相源；en 用 satisfies 校验 key 与 zh
		* 完全一致（缺 key 或多余 key 均为编译错误）。模板占位符使用平台约定的
		* {word} 形式（locale 服务 translate 以 /\{(\w+)\}/g 替换）。
		*/
		/** 简体中文词条（key 集真相源）。 */
		const zh = {
			"settings.nav": "专家",
			"settings.intro": "选择对话里可以召唤的专家。停用后不会出现在 @ 菜单中。",
			"settings.loading": "正在加载专家…",
			"settings.enabled": "已启用",
			"settings.disabled": "已停用",
			"error.conflict": "配置已被其他窗口修改。",
			"error.conflict.refreshed": "配置已被其他窗口修改，已为您刷新。",
			"error.conflict.refreshFailed": "配置已被其他窗口修改，但刷新失败，请手动刷新。",
			"btn.refresh": "刷新",
			"btn.enable": "启用",
			"btn.disable": "停用",
			"summary.total.one": "位专家",
			"summary.total.other": "位专家",
			"summary.enabled.one": "位已启用",
			"summary.enabled.other": "位已启用",
			"summary.group": "{count} 个",
			"button.title": "召唤专家",
			"menu.empty": "暂无可召唤的专家",
			"group.count": "{division}（{count}）",
			"summon.instruction": "召唤专家「{name}」（{slug}）处理以下任务：",
			"summon.instruction.withTask": "召唤专家「{name}」（{slug}）处理以下任务：\n{task}",
			"division.academic": ZH_DIVISION.academic,
			"division.design": ZH_DIVISION.design,
			"division.engineering": ZH_DIVISION.engineering,
			"division.finance": ZH_DIVISION.finance,
			"division.game-development": ZH_DIVISION["game-development"],
			"division.gis": ZH_DIVISION.gis,
			"division.healthcare": ZH_DIVISION.healthcare,
			"division.marketing": ZH_DIVISION.marketing,
			"division.paid-media": ZH_DIVISION["paid-media"],
			"division.product": ZH_DIVISION.product,
			"division.project-management": ZH_DIVISION["project-management"],
			"division.sales": ZH_DIVISION.sales,
			"division.security": ZH_DIVISION.security,
			"division.spatial-computing": ZH_DIVISION["spatial-computing"],
			"division.specialized": ZH_DIVISION.specialized,
			"division.support": ZH_DIVISION.support,
			"division.testing": ZH_DIVISION.testing
		};
		/** 英文词条，key 完整性由 satisfies 在编译期保证。 */
		const en = {
			"settings.nav": "Experts",
			"settings.intro": "Choose which experts can be summoned in chat. Disabled experts stay out of the @ menu.",
			"settings.loading": "Loading experts…",
			"settings.enabled": "Enabled",
			"settings.disabled": "Disabled",
			"error.conflict": "Settings were changed in another window.",
			"error.conflict.refreshed": "Settings were changed in another window and have been refreshed.",
			"error.conflict.refreshFailed": "Settings were changed in another window, but refresh failed. Please refresh manually.",
			"btn.refresh": "Refresh",
			"btn.enable": "Enable",
			"btn.disable": "Disable",
			"summary.total.one": "expert",
			"summary.total.other": "experts",
			"summary.enabled.one": "enabled",
			"summary.enabled.other": "enabled",
			"summary.group": "{count} items",
			"button.title": "Summon expert",
			"menu.empty": "No experts available yet",
			"group.count": "{division} ({count})",
			"summon.instruction": "Summon expert \"{name}\" ({slug}) to handle the following task:",
			"summon.instruction.withTask": "Summon expert \"{name}\" ({slug}) to handle the following task:\n{task}",
			"division.academic": "Academic",
			"division.design": "Design",
			"division.engineering": "Engineering",
			"division.finance": "Finance",
			"division.game-development": "Game Development",
			"division.gis": "GIS",
			"division.healthcare": "Healthcare",
			"division.marketing": "Marketing",
			"division.paid-media": "Paid Media",
			"division.product": "Product",
			"division.project-management": "Project Management",
			"division.sales": "Sales",
			"division.security": "Security",
			"division.spatial-computing": "Spatial Computing",
			"division.specialized": "Specialized",
			"division.support": "Support",
			"division.testing": "Testing"
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) {
					if (def.inclusive) bag.maximum = def.value;
					else bag.exclusiveMaximum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) {
					if (def.inclusive) bag.minimum = def.value;
					else bag.exclusiveMinimum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/remote-contract.ts
		const enabledArraySchema = array(string());
		const enabledStateSchema = object({
			enabled: enabledArraySchema,
			revision: number().int().min(0)
		});
		//#endregion
		//#region src/client/remote.ts
		const TYPERT_REMOTE = {
			package: "@michengai/dsh-agency-agents",
			descriptors: [{
				id: "@michengai/dsh-agency-agents#agencyAgents/getEnabled",
				service: "agencyAgents",
				namespace: "agencyAgents",
				method: "getEnabled",
				invocation: { kind: "direct" },
				parameters: [],
				result: {
					mode: "strict",
					typeSymbol: "AgencyAgentsEnabledState",
					schema: enabledStateSchema
				}
			}, {
				id: "@michengai/dsh-agency-agents#agencyAgents/setEnabled",
				service: "agencyAgents",
				namespace: "agencyAgents",
				method: "setEnabled",
				invocation: { kind: "direct" },
				parameters: [{
					name: "enabled",
					wire: "enabled",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "string[]",
						schema: enabledArraySchema
					}
				}, {
					name: "expectedRevision",
					wire: "expectedRevision",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "number",
						schema: number().int().min(0)
					}
				}],
				result: {
					mode: "strict",
					typeSymbol: "AgencyAgentsEnabledState",
					schema: enabledStateSchema
				}
			}]
		};
		//#endregion
		//#region src/client/index.ts
		const PLUGIN_ID = "@michengai/dsh-agency-agents";
		/** 本插件客户端词条字典命名空间。 */
		const NS = "agency";
		const DIVISION_ORDER = [
			"academic",
			"design",
			"engineering",
			"finance",
			"game-development",
			"gis",
			"healthcare",
			"marketing",
			"paid-media",
			"product",
			"project-management",
			"sales",
			"security",
			"spatial-computing",
			"specialized",
			"support",
			"testing"
		];
		const EXPERTS = ROSTER.map((e) => ({
			slug: e.slug,
			name: ZH_NAME[e.slug] ?? e.nameEn,
			nameEn: e.nameEn,
			emoji: e.emoji,
			division: e.division,
			divisionZh: ZH_DIVISION[e.division] ?? e.division,
			description: e.description,
			descriptionEn: e.descriptionEn
		})).sort((a, b) => a.division.localeCompare(b.division) || a.slug.localeCompare(b.slug));
		function groupByDivision(list) {
			const groups = /* @__PURE__ */ new Map();
			for (const e of list) {
				const arr = groups.get(e.division) ?? [];
				arr.push(e);
				groups.set(e.division, arr);
			}
			return DIVISION_ORDER.filter((d) => groups.has(d)).map((d) => ({
				division: d,
				divisionZh: ZH_DIVISION[d] ?? d,
				experts: (groups.get(d) ?? []).slice().sort((a, b) => a.name.localeCompare(b.name, "zh"))
			}));
		}
		/** 按当前 locale 取专家显示名：en 用花名册英文名，其余用中文名。 */
		function displayName(e, active) {
			return active === "en" ? e.nameEn : e.name;
		}
		/** 按当前 locale 取专家简介：en 用原始英文描述（缺失时回退中文），其余用中文描述。 */
		function displayDescription(e, active) {
			return active === "en" && e.descriptionEn !== "" ? e.descriptionEn : e.description;
		}
		const CSS = ".aag-btn-wrap{position:relative;order:1;margin-right:-8px}.aag-btn{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;font-weight:500;cursor:pointer}.aag-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aag-menu{position:absolute;bottom:calc(100% + 4px);left:0;box-sizing:border-box;padding:4px;display:flex;flex-direction:column;gap:0;width:300px;max-width:360px;max-height:calc(100vh - 24px);overflow-y:auto;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);z-index:10000}.aag-menu-title{padding:8px 10px;font-size:12px;line-height:16px;color:var(--dsw-alias-label-tertiary)}.aag-menu-item{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;padding:8px 10px;border:none;border-radius:10px;background:transparent;cursor:pointer;text-align:left;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);box-sizing:border-box}.aag-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover)}.aag-emoji{flex:0 0 auto;font-size:16px}.aag-menu-empty{padding:8px 10px;color:var(--dsw-alias-label-secondary);font-size:13px}[data-composer-card] :has(> button[aria-haspopup=\"listbox\"]) > :nth-child(2){order:2}\n.aag-section{box-sizing:border-box;display:flex;min-width:0;max-width:760px;width:100%;margin:0 auto;flex-direction:column;gap:16px;padding:0 0 32px;color:var(--dsw-alias-label-primary)}\n.aag-toolbar{display:flex;align-items:flex-start;gap:16px;padding-bottom:12px}\n.aag-title{margin:0;font-size:20px;line-height:28px;font-weight:650;letter-spacing:-.2px}\n.aag-desc{margin:4px 0 0;max-width:42em;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}\n.aag-actions{display:flex;align-items:center;gap:8px;margin-left:auto}\n.aag-action{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 12px;border:1px solid transparent;border-radius:8px;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:13px;font-weight:550;cursor:pointer;transition:opacity 180ms ease,background 180ms ease,border-color 180ms ease}\n.aag-action:hover:not(:disabled){opacity:.9}.aag-action:disabled{opacity:.5;cursor:default}\n.aag-action-secondary{background:transparent;border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}\n.aag-action:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}\n.aag-summary{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2)}\n.aag-summary-count{font-size:18px;font-weight:650}.aag-summary-label{color:var(--dsw-alias-label-secondary);font-size:12px}.aag-summary-separator{width:1px;height:24px;background:var(--dsw-alias-border-l2)}\n.aag-group{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-2)}\n.aag-group-head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--dsw-alias-border-l1)}\n.aag-group-title{margin:0;font-size:14px;font-weight:600}.aag-count{color:var(--dsw-alias-label-tertiary);font-size:12px}\n.aag-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--dsw-alias-border-l1)}\n.aag-row:last-child{border-bottom:0}\n.aag-row-main{display:flex;min-width:0;flex:1;flex-direction:column;gap:3px}\n.aag-row-id{display:flex;align-items:center;gap:7px;min-width:0}\n.aag-row-name{overflow:hidden;font-size:13px;font-weight:500;line-height:20px;text-overflow:ellipsis;white-space:nowrap}\n.aag-tag{flex:none;padding:1px 6px;border:1px solid var(--dsw-alias-border-l3);border-radius:4px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}\n.aag-tag-on{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}\n.aag-tag-off{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}\n.aag-note{overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;text-overflow:ellipsis;white-space:nowrap}\n.aag-error{color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}\n@media (max-width:560px){.aag-toolbar{flex-wrap:wrap}.aag-actions{margin-left:0}.aag-row{align-items:flex-start;flex-wrap:wrap}.aag-row>.aag-action{margin-left:auto}}\n@media (prefers-reduced-motion:reduce){.aag-action{transition:none}}\n" + DIVISION_ORDER.map((d) => `[role="listbox"] div[data-source="division.${d}"] ~ button span:last-child`).join(",") + "{flex:1 1 auto;max-width:none;min-width:0}";
		/** 将写失败映射到 agency 词条；非冲突错误返回 null，由调用方展示原始消息。 */
		function writeErrorKey(error, options) {
			if (error instanceof Error && error.message.includes("changed since it was read")) {
				if (options?.refreshed === true) return "error.conflict.refreshed";
				if (options?.refreshed === false) return "error.conflict.refreshFailed";
				return "error.conflict";
			}
			return null;
		}
		/** 写失败时的用户可见文案。冲突场景必须显式传入 refreshed；传入 t 时按当前语言翻译。 */
		function writeErrorMessage(error, options) {
			const key = writeErrorKey(error, options);
			if (key !== null) return (options?.t ?? ((item) => zh[item]))(key);
			return error instanceof Error ? error.message : String(error);
		}
		async function readEnabled(remote) {
			const result = await remote.getEnabled();
			if (!result.ok) throw new Error(result.error.message);
			return {
				enabled: new Set(result.value.enabled),
				revision: result.value.revision
			};
		}
		async function writeEnabled(remote, enabled, expectedRevision) {
			const result = await remote.setEnabled([...enabled], expectedRevision);
			if (!result.ok) throw new Error(result.error.message);
			return {
				enabled: new Set(result.value.enabled),
				revision: result.value.revision
			};
		}
		function expertIcon() {
			return react.default.createElement("svg", {
				viewBox: "0 0 16 16",
				width: 14,
				height: 14,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": true
			}, react.default.createElement("path", { d: "M8 2.5l1.15 2.35 2.35 1.15-2.35 1.15L8 9.5l-1.15-2.35L4.5 6l2.35-1.15z" }), react.default.createElement("path", { d: "M12.75 10.25l.55 1.2 1.2.55-1.2.55-.55 1.2-.55-1.2-1.2-.55 1.2-.55z" }));
		}
		function menuItem(e, pick, getActive) {
			return react.default.createElement("button", {
				key: e.slug,
				type: "button",
				className: "aag-menu-item",
				onMouseDown: (ev) => {
					ev.preventDefault();
					pick(e.slug);
				}
			}, react.default.createElement("span", { className: "aag-emoji" }, e.emoji), react.default.createElement("span", null, displayName(e, getActive())));
		}
		function menuGroup(g, pick, t, getActive) {
			return react.default.createElement("div", { key: g.division }, react.default.createElement("div", { className: "aag-menu-title" }, t(`division.${g.division}`)), g.experts.map((e) => menuItem(e, pick, getActive)));
		}
		function openAgentSettings(t) {
			if (document.querySelector("[role=\"dialog\"]") === null) {
				const trigger = document.querySelector("button[aria-haspopup=\"dialog\"]");
				if (trigger instanceof HTMLElement) trigger.click();
			}
			const select = () => {
				const buttons = document.querySelectorAll("[role=\"dialog\"] nav button");
				for (const button of buttons) if (button.textContent !== null && button.textContent.trim() === t("settings.nav")) {
					button.click();
					return;
				}
			};
			window.requestAnimationFrame(() => {
				window.requestAnimationFrame(select);
			});
		}
		/** 根据当前草稿生成召唤指令。有内容时把原草稿包进 withTask 模板。 */
		function buildSummonInstruction(t, name, slug, draft) {
			return t(draft.trim().length > 0 ? "summon.instruction.withTask" : "summon.instruction", {
				name,
				slug,
				task: draft
			});
		}
		/** 将召唤指令写入输入框。有草稿时也不自动发送，留给用户确认后再提交。 */
		function applyExpertSummon(options) {
			if (options.inputActions !== void 0) options.inputActions.setDraft(options.instruction);
		}
		function AgentsButton(props) {
			const [open, setOpen] = react.default.useState(false);
			const [enabled, setEnabled] = react.default.useState(/* @__PURE__ */ new Set());
			react.default.useEffect(() => {
				if (!open) return;
				const onPointerDown = (ev) => {
					const target = ev.target;
					if (target instanceof Element && (target.closest(".aag-menu") !== null || target.closest(".aag-btn-wrap") !== null)) return;
					setOpen(false);
				};
				document.addEventListener("pointerdown", onPointerDown);
				return () => document.removeEventListener("pointerdown", onPointerDown);
			}, [open]);
			const onClick = () => {
				readEnabled(props.remote).then((current) => {
					setEnabled(current.enabled);
					if (current.enabled.size === 0) {
						openAgentSettings(props.t);
						return;
					}
					setOpen((prev) => !prev);
				}).catch(() => {
					setOpen((prev) => !prev);
				});
			};
			const pick = (slug) => {
				const expert = EXPERTS.find((e) => e.slug === slug);
				const name = expert === void 0 ? slug : displayName(expert, props.getActive());
				const draft = props.input !== void 0 && typeof props.input.draft === "string" ? props.input.draft : "";
				applyExpertSummon({
					inputActions: props.inputActions,
					instruction: buildSummonInstruction(props.t, name, slug, draft)
				});
				setOpen(false);
			};
			const groups = groupByDivision(EXPERTS.filter((e) => enabled.has(e.slug)));
			const menu = open ? react.default.createElement("div", { className: "aag-menu" }, groups.length === 0 ? react.default.createElement("div", { className: "aag-menu-empty" }, props.t("menu.empty")) : groups.map((g) => menuGroup(g, pick, props.t, props.getActive))) : null;
			return react.default.createElement("div", { className: "aag-btn-wrap" }, react.default.createElement("button", {
				type: "button",
				className: "aag-btn",
				title: props.t("button.title"),
				onClick
			}, expertIcon(), react.default.createElement("span", null, props.t("settings.nav"))), menu);
		}
		function AgentsSettings(props) {
			const [state, setState] = react.default.useState(null);
			const [error, setError] = react.default.useState(null);
			const saving = react.default.useRef(false);
			const [isSaving, setIsSaving] = react.default.useState(false);
			const load = react.default.useCallback(() => {
				readEnabled(props.remote).then((current) => {
					setState(current);
					setError(null);
				}).catch((err) => {
					setError(err instanceof Error ? err.message : String(err));
				});
			}, [props.remote]);
			react.default.useEffect(() => {
				let alive = true;
				readEnabled(props.remote).then((current) => {
					if (!alive) return;
					setState(current);
				}).catch((err) => {
					if (alive) setError(err instanceof Error ? err.message : String(err));
				});
				return () => {
					alive = false;
				};
			}, [props.remote]);
			const toggle = (slug) => {
				if (state === null || saving.current) return;
				const previous = state;
				const next = new Set(state.enabled);
				if (next.has(slug)) next.delete(slug);
				else next.add(slug);
				saving.current = true;
				setIsSaving(true);
				setState({
					enabled: next,
					revision: state.revision
				});
				writeEnabled(props.remote, next, state.revision).then((current) => {
					setState(current);
					setError(null);
				}).catch(async (err) => {
					try {
						setState(await readEnabled(props.remote));
						setError(writeErrorMessage(err, {
							refreshed: true,
							t: props.t
						}));
					} catch {
						setState(previous);
						setError(writeErrorMessage(err, {
							refreshed: false,
							t: props.t
						}));
					}
				}).finally(() => {
					saving.current = false;
					setIsSaving(false);
				});
			};
			const nodes = [];
			if (error !== null) nodes.push(react.default.createElement("div", {
				key: "error",
				className: "aag-error",
				role: "alert"
			}, error));
			if (state === null) nodes.push(react.default.createElement("div", {
				key: "loading",
				className: "aag-note"
			}, props.t("settings.loading")));
			else {
				const groups = groupByDivision(EXPERTS);
				const enabledCount = [...state.enabled].filter((slug) => EXPERTS.some((e) => e.slug === slug)).length;
				const total = EXPERTS.length;
				nodes.push(react.default.createElement("div", {
					key: "toolbar",
					className: "aag-toolbar"
				}, react.default.createElement("div", null, react.default.createElement("h2", { className: "aag-title" }, props.t("settings.nav")), react.default.createElement("p", { className: "aag-desc" }, props.t("settings.intro"))), react.default.createElement("div", { className: "aag-actions" }, react.default.createElement("button", {
					type: "button",
					className: "aag-action aag-action-secondary",
					disabled: isSaving,
					onClick: load
				}, props.t("btn.refresh")))));
				nodes.push(react.default.createElement("div", {
					key: "summary",
					className: "aag-summary"
				}, react.default.createElement("span", { className: "aag-summary-count" }, total), react.default.createElement("span", { className: "aag-summary-label" }, props.t(total === 1 ? "summary.total.one" : "summary.total.other", { count: total })), react.default.createElement("span", { className: "aag-summary-separator" }), react.default.createElement("span", { className: "aag-summary-count" }, enabledCount), react.default.createElement("span", { className: "aag-summary-label" }, props.t(enabledCount === 1 ? "summary.enabled.one" : "summary.enabled.other", { count: enabledCount }))));
				for (const g of groups) nodes.push(react.default.createElement("div", {
					key: g.division,
					className: "aag-group"
				}, react.default.createElement("div", { className: "aag-group-head" }, react.default.createElement("h3", { className: "aag-group-title" }, props.t(`division.${g.division}`)), react.default.createElement("span", { className: "aag-count" }, props.t("summary.group", { count: g.experts.length }))), g.experts.map((e) => {
					const on = state.enabled.has(e.slug);
					return react.default.createElement("div", {
						key: e.slug,
						className: "aag-row"
					}, react.default.createElement("div", { className: "aag-row-main" }, react.default.createElement("div", { className: "aag-row-id" }, react.default.createElement("span", { className: "aag-row-name" }, displayName(e, props.getActive())), react.default.createElement("span", { className: "aag-tag" }, e.slug), react.default.createElement("span", { className: `aag-tag ${on ? "aag-tag-on" : "aag-tag-off"}` }, props.t(on ? "settings.enabled" : "settings.disabled"))), react.default.createElement("div", {
						className: "aag-note",
						title: displayDescription(e, props.getActive())
					}, displayDescription(e, props.getActive()))), react.default.createElement("button", {
						type: "button",
						className: "aag-action aag-action-secondary",
						disabled: isSaving,
						onClick: () => toggle(e.slug)
					}, props.t(on ? "btn.disable" : "btn.enable")));
				})));
			}
			return react.default.createElement("section", { className: "aag-section" }, nodes);
		}
		const inject = [
			"slots",
			"inputTriggers",
			"locale",
			"remote"
		];
		async function apply(ctx) {
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = PLUGIN_ID;
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => {
					tag.remove();
				};
			}, "agency-agents: style");
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "agency-agents: dictionaries");
			const t = ctx.locale.bind(NS);
			const getActive = () => ctx.locale.getSnapshot().active;
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			const remote = ctx.get("remote.agencyAgents");
			if (remote === void 0) throw new Error("agency-agents Remote 挂载后不可用");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "agency-agents",
				order: 16,
				label: () => t("settings.nav"),
				locale: NS,
				icon: "expert"
			}, (props) => react.default.createElement(AgentsSettings, {
				...props,
				remote,
				getActive
			})));
			ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
				name: "conversation.input.left",
				id: "agency-agents",
				order: 0,
				locale: NS
			}, (props) => react.default.createElement(AgentsButton, {
				...props,
				remote,
				getActive
			})));
			for (const [i, div] of DIVISION_ORDER.entries()) {
				const source = {
					trigger: "@",
					name: `division.${div}`,
					order: 100 + i,
					candidates: async (_session, req) => {
						const enabled = await readEnabled(remote).then((state) => state.enabled).catch(() => /* @__PURE__ */ new Set());
						const q = String(req.query ?? "").toLowerCase();
						return EXPERTS.filter((e) => e.division === div && enabled.has(e.slug) && (q === "" || e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q) || e.slug.includes(q))).map((e) => ({
							name: displayName(e, ctx.locale.getSnapshot().active),
							icon: e.emoji,
							hint: e.slug
						}));
					},
					onPick: (pick) => ({ text: t("summon.instruction", {
						name: pick.candidate.name,
						slug: pick.candidate.hint ?? ""
					}) })
				};
				ctx.effect(() => ctx.inputTriggers.registerSource(source), `agency-agents: @${div}`);
			}
			return () => {
				disposeRemote();
			};
		}
		//#endregion
		exports.apply = apply;
		exports.applyExpertSummon = applyExpertSummon;
		exports.buildSummonInstruction = buildSummonInstruction;
		exports.inject = inject;
		exports.writeErrorKey = writeErrorKey;
		exports.writeErrorMessage = writeErrorMessage;
		return module.exports;
	}
});
