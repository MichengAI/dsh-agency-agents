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
			company: "公司经营",
			design: "设计",
			engineering: "工程",
			finance: "金融",
			"game-development": "游戏开发",
			gis: "地理信息",
			healthcare: "医疗健康",
			hr: "人力资源",
			legal: "法务",
			marketing: "市场营销",
			"paid-media": "付费媒体",
			product: "产品",
			"project-management": "项目管理",
			research: "研究",
			sales: "销售",
			security: "安全",
			"spatial-computing": "空间计算",
			specialized: "专业",
			support: "支持",
			"supply-chain": "供应链",
			testing: "测试"
		};
		/** 分区目录名 → 英文分区名。 */
		const EN_DIVISION = {
			academic: "Academic",
			company: "Company Leadership",
			design: "Design",
			engineering: "Engineering",
			finance: "Finance",
			"game-development": "Game Development",
			gis: "GIS",
			healthcare: "Healthcare",
			hr: "Human Resources",
			legal: "Legal",
			marketing: "Marketing",
			"paid-media": "Paid Media",
			product: "Product",
			"project-management": "Project Management",
			research: "Research",
			sales: "Sales",
			security: "Security",
			"spatial-computing": "Spatial Computing",
			specialized: "Specialized",
			support: "Support",
			"supply-chain": "Supply Chain",
			testing: "Testing"
		};
		/** 智能体 slug（文件名去 .md）→ 中文名（现实岗位）。缺省时回退英文 frontmatter name。 */
		const ZH_NAME = {
			"chief-executive-officer": "首席执行官（CEO）",
			"chief-marketing-officer": "首席营销官（CMO）",
			"chief-of-staff": "幕僚长（Chief of Staff）",
			"chief-operating-officer": "首席运营官（COO）",
			"chief-product-officer": "首席产品官（CPO）",
			"chief-technology-officer": "首席技术官（CTO）",
			"hr-performance-reviewer": "绩效管理专家",
			"hr-recruiter": "招聘专家（HR 全流程）",
			"legal-contract-reviewer": "合同审查专家",
			"legal-policy-writer": "制度文件撰写专家",
			"authenticity-appraiser": "鉴定评估师",
			"livestock-archive-auditor": "养殖档案核对员",
			"supply-chain-garment-factory-planning-engineer": "服装工厂规划工程师",
			"supply-chain-inventory-forecaster": "库存预测专家",
			"supply-chain-route-optimizer": "物流路线优化师",
			"supply-chain-vendor-evaluator": "供应商评估专家",
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
			"engineering-knowledge-graph-engineer": "知识图谱工程师",
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
			"marketing-global-podcast-strategist": "全球播客增长策略专家",
			"marketing-growth-hacker": "增长营销专家",
			"marketing-instagram-curator": "Instagram 运营",
			"marketing-kuaishou-strategist": "快手运营专家",
			"marketing-linkedin-content-creator": "LinkedIn 内容创作者",
			"marketing-livestream-commerce-coach": "直播电商运营专家",
			"marketing-multi-platform-publisher": "多平台内容运营专家",
			"marketing-podcast-strategist": "中国播客运营策略专家",
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
			"research-synthesist": "研究证据综合专家",
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
			"specialized-master-plan-architect": "总体规划架构师",
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
			"academic-study-planner": "学习规划师",
			"design-video-prompt-engineer": "视频提示词工程师",
			"engineering-dingtalk-integration-developer": "钉钉集成开发工程师",
			"engineering-embedded-linux-driver-engineer": "嵌入式 Linux 驱动工程师",
			"engineering-fpga-digital-design-engineer": "FPGA/ASIC 数字设计工程师",
			"engineering-iot-solution-architect": "IoT 方案架构师",
			"engineering-mechanical-design-engineer": "机械设计工程师",
			"engineering-network-engineer-china": "国内网络工程师",
			"engineering-pc-host-engineer": "上位机工程师",
			"engineering-security-engineer": "安全工程师",
			"engineering-threat-detection-engineer": "威胁检测工程师（工程侧）",
			"finance-financial-forecaster": "财务预测分析师",
			"finance-fraud-detector": "金融风控分析师",
			"finance-hk-stock-compliance-reviewer": "香港股市合规审查专家",
			"finance-invoice-manager": "发票管理专家",
			"marketing-bilibili-strategist": "B站内容策略师",
			"marketing-daily-news-briefing": "新闻情报官",
			"marketing-ecommerce-operator": "电商运营师",
			"marketing-knowledge-commerce-strategist": "知识付费产品策划师",
			"marketing-wechat-operator": "微信公众号运营",
			"marketing-weixin-channels-strategist": "微信视频号运营策略师",
			"marketing-xiaohongshu-operator": "小红书增长运营专家",
			"gaokao-college-advisor": "高考志愿填报顾问",
			"prompt-engineer": "通用提示词工程师",
			"specialized-ai-policy-writer": "AI 治理政策专家",
			"specialized-meeting-assistant": "会议效率专家",
			"specialized-pricing-optimizer": "动态定价策略师",
			"specialized-risk-assessor": "企业风险评估师",
			"technical-translator-agent": "技术翻译专家",
			"travel-planner": "旅行规划师",
			"support-recruitment-specialist": "招聘运营专家",
			"testing-embedded-qa-engineer": "嵌入式测试工程师"
		};
		//#endregion
		//#region src/client/avatars.ts
		/** 三十六张原创轻量卡通立绘，按五大分类复用于完整专家库。 */
		const EXPERT_AVATAR_URLS = [
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCACGAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD17TdJ0w6RZE6ZZEm3jJJtk5+Qe1WP7J0ztplj/wCAsf8AhTtO/wCQTY8/8u0X/oAqx3qTziqNI0z/AKBdj/4Cx/4Uf2Tpf/QLsf8AwFT/AAq5Sd6AuVP7J0z/AKBdj/4Cp/hR/ZOl/wDQLsf/AAFT/CreOeKzNX8S6HoGBresWNgx5CXE6q5+i5z+lArtk/8AZOmf9Aux/wDAVP8ACmnSdMz/AMgyx/8AAVP8KwoPid4JuZxDH4nsFcnA81mjB/FgB+tdNG6SxLLC6yRuNyujBlYeoI4NAnzLcrHSdM/6Blj/AOAqf4UHSdM/6Bdj/wCAqf4VbzTTVEXKn9k6Z0/sux/8BY/8KQ6Vpn/QMsf/AAFT/CrTOEUsxwBUP2qP3/KmJyHW+j6W0ZJ0ux6/8+yf4UVNbXcflnluv92ijUnm8yLTf+QTZf8AXtF/6AKtVX03jSLL/r2i/wDQBVj61BuwzUN5eW2nWM97fzx21rboZJZpDhUUdSTU2a8O+Lfix9X8Qf8ACP2coWx06UCXJ+We6xk7vVYgRx3c/wCzQXSg6kuVEHjP4t6lqztbaHJPpWmnhTGdl1cj+8zf8sVPYD5j3I6V5uZmVneMBGY5Yp99j7sfmJ+pqW4jDHzolYxsSNzHLOR1b6VSuLmO1g8x8nJwqqMliegA9am9z1oQjTVoivJKwO6MsD1BfJNbXg/x9rHge9dNGaKawuAfMsLssIkf+8oHKN9ODnntWFHpXim8USwaTfIhGQFs2xj6sMmqwSZr8R39s1tOgw8cqFdxHcA0lJX0Y5w5laS0PevDXxysb66S28UWCaT5hCpewSmW3BP9/IDIPfkepFep5GM5BBGQQc5r5BhgR5PLARA/B3dD7V7F8F/Fk0sE/hXUpGZ7FPNsi5yfIzho/fYSMf7LD0rRM83E4dQXPHY9Vujm3b6j+dVlTcgJBz+NW3UOpQ9DVc2ak/eNWee1qPt5IwhAG7n1xRU9rZKYj87feop3RnaQab/yCLI/9O0X/oAqxkmq+m/8giy/69o//QBVgmsjrZn6/q8fh/w3qOsTAFbG2efaf4iB8o/E4H418oTzSu5+0yeZKCWlcn78jEs7fixJr3v426p9i8CRWSsN2oXkaMvrHHmVv1RR+NfO0koYtvYBF5kYnj6VLPQwkbRci6t28Klw4VVXkt0C9fyr034X+DX2f29qcRSadcW6OPmhiPOfZ36+y4Hc1wOi6NqL30F7d6RBJZKBLCuo30VpFMf4WbedxUYztA54zxwfZPCvibWNT1BbG/0WwSAqSLzTdViuUBAzhlB3c+ozzXDipScbR+Z7OF5FO8t+mn4nWR28UQwiKPfGT+dZ3iDw7YeJNJksdSt1ljYfKejKexU9j6GtYLlsVwGo+OfEdvfyxQaHo1pDG5C/2lrkMcsgHfaD8uffNedThKT909KpVjBe91PIdTsbrRNUvNGviGkt3B3lceYh+449Mjg+4NWPCesNo/jPRtULFRHdrFNk/wDLOQ+W+f8AvrP4Cup+IUMviTw7H4sj08WV5pjeVewR3MdwskLfxo6EhlB56AjJrzWVy9ncmI8gFlPvjI/WvbpTcopvc8KvCN3FbM+xoz8mD1U4NKTVHSbsX2l2t2pytzbxzA/7yg/1q9XUfNLYs22fLP1opbXHlH/eooC5W07/AJBNl/17R/8AoAqzVfTv+QRZf9e0X/oAqcmszVng3x31VrvxVa6bDJhdPtAWA/56TNuP5JGv/fVeaQ+F7nUvC+qav9pWKDTMeUrxki5k43IpzgbQwOTkk/Suk+J1w0vxI19nP3b7yxn0WKNRVvwb4h0e48E6t4V1e6hsbkefNZyzkLHOXG4KWPAYOBjPUHjpWNWUoq8T3MNCDgoy7fidavh6x0rwDBqOiaRpMNrBpUV7c6nPZLe3czsBvCo+OmSxJbGBgDuMbwlFb+NfAerazrmiaXbfYhMLXVLCAWkyvGgcNhfqOQcZBBHeut0OTX9K0Kz/ALJ0uDWdFngW4stt0IZ4EkG/ymDAqwUsQDkcYBqW5tPEPie0/si60mDQNInwt232kSzSR5yY0VAFXd0JyeCeK4pVd0++9/0PQhQvaS7bW/U5QaP4nn0bw9e+IvF9/dafq11aw6lZA+Vtjlx8u5eR2U9PvVX+It//AMIbqVhpmh+HdFs47t1+zxJpMdw86birEu3RgQMJgkhgSw6V6LJY2XiXw1faTM727yyOGVVKvaur5QjP93ahB6HFU/7R8WWoSLUvDVrqk0XS7s7xY1c/3tjrlCe+CaiFfuvlsaTw19rrbXc4n4r+FLTSfCk1zPpmlW2p29/HbQXmlp5SXkbA53Rj7p9QS3KnBxXLeLfBEHhCCwksNQlv7K8ZoWeaMIyyKoPGOqkZx9O9d14yi1DVI9Ok8XCy0iw+2xRW9v8AaN+GZhvllkICjEYcAD+8ea4/4leL7HxFqltY6LKLiw0ze5uQMLPM/BK/7KqMA98ntW9Kc5NJba3MKtOEE299Lfqz2P4Wah9v+G+iSMcvDbm1f6xMU/korsCcmvLvgbcM/gy6hY/LDqcgX2DIjfzJr1E16aPlJrlqSj5ly0/1R/3qKS1/1R/3qKCCtpp/4lFl/wBe0f8A6AKsVn6ddxf2TZ/N/wAu8f8A6AKtpOsmdtTsaM+dvjbpL6Z49nuipEGpol3E3YsoWOQfUFUP/Aq8yvQEuF3DKyfzxX1x428H2Pjfw8+m3jeRMh8y1ulXLQSYxnHdSOCO49wK+Y/FnhPWPDEpsfEFqbZ1OYLsZME2OhV+nPocEelS11PSw9VSjyvdHr3wW8TQ6r4QGhzSD7dpGVVCeXt2bKMPXaSVPphfWu9vvtwhVtN+zmRT8yXAbDj0BH3T74NfJOm6rd6Re2+p6bcyWN1C58qdeMHoVyeGHYjkEV794N+KkGt6It34htDpwWQwtfxAtau4AzkjJizkfe+X3rysTh2pc8ep72ExC5eSXQ6Vb7xDI3lrptnG3957liv5BM/yrWtEuBbIt9JFLPyXaJCi9egBJOB05NUJ/EPh6ztzez6vpqRMMiUXCMX+mCSx9hmvMPib8TtTt7aGw0W3m0u1vkYi+uRsmlQYB2IeUBz1b5vYVzQpSqPlSsdtSvCC5jF+M/iiHWfEEOjWTrJbaaS0zDkGYjG3/gIzn3OO1efxDEGO8jYH0qmJYlk8vdhhyc9Tn69Sa9G8DfC3VPE93Fea5by6dowwW8wFJbhf7iKeQD3Y9uma9qnT5IqKPn6+IV3Umz1D4Naa9l8PreeVSrajcy3agj+AkKh/FUB/GvQy6g4ZgPxqGzgjgiRIo1jijUJGiDAVQMAAegHFVW2szgoCd5O7NdCR87Kbbcu5tWskflH51+960Vm20f7s8D71FOxnzlOwP/EqswP+feP/ANBFaFrnPPPP9BUNhZxppdkGeUE20Z+6P7oq3FEEcCMs3UksMUrm/I4vUnPFMmgjuYGguYkmhfho5FDK31B4Nc1d+N7ZpJYfD1nLrcsTFJJonEVrEw6hp24JHogY1hX97rOpqy6nrJgjbpaaOGgj+jTH94//AAHZRZsTaj8TNi+u/A/hYyaZeT6RpqSOJJrXyV2qxwA0iqpC54GWxVDw/pFrLp17dQ2v2KDUL6W6tY1iERWAhUQlMDG4JuxjOGFchLZr9hSG0WKyktLhbiJViDJ9oHQmM/6wEE5LEkg9QRkdLa/EGKLMfiXT7mxnUZknto2ubdvcMoLL9GUfU1x42FRw5Yq6PWyevh41XOUrS8yceFoLS6NxaafZiU/8tooUV/zxmqN4ttoPiWw1nxBFEmnG3ltJLidA6WzlkdGbg7QdrLu9SB3rS/4WF4S2bhrtuT/dCuW/7525/SsnWPHP2+zktfD1hJIkyFXvr+3KQoh4LLE3zSnB6EBfUnpXn4eFZVE1Fnv47EYaWHlCpNJM6fQZfCmv3c2oaA+mXd7ndNLDConB9WyA/wCNdB5Q3ZYlj6mvCYvDtrbrawWjypPbL+7uUkKuo671dcFST2HHtiujsfFnizRMCWeHXrVf4Lz93Pj2lUYP/AlP1r33Bo+DVanJ9vU9XFUFkEbSDcVyx5GfX61j6D4+0fXLlLJ/O03UX+7Z3oCmQ+kbglZPwOfauge3idizKMnrUmrTdrC28ziM7ZpCM9+KKsWtpD5R+XvRRoZOMiLTgp0uyYq+RbRj73+wK5LxxfzahdvoFoWW2gtxd6phyDMjEiK2BGCN+1mbHO1QP4q6/TFJ0uxHrbxD/wAcFecWd19vhu9WySdWvprpc/8APJD5MI+myPP/AAI0ktTqqVGotkouBNDEIgqQKgEMUahUROwVRwBTHfj2zUMQMSMnG0MShH908gfqRQ7evFbWPLuQzosjq+Ssi8K69R/iKpNHcRRMuFlZn3MynaTz6HjtjrV0n8jULNwc9RVIzbK5uJxcmQwylWULjcODk+/vUapcbEU7Ywh4bO5v8OlWGOASaZuABqiBIo0gXZGMDqT3NOJPX16e1NLdPb9aTPf/ACKBFTUbGG7tHimhEoYgBDx82eCD2IPORyK7f4eeIrnUrK50jV5zPqGmFVNw/wB64hbPlyH34ZWPque9ckwLTR/3Uy2fU9B/WnaLdf2Z8Q9LuAdsd8HsJPfeN6H8HTH/AAKomrq504ebT5e57Taj90f96io7Nt0GfeisDsMPV9SbR/h3daih+e20ovH/AL/lYX/x4iuOFsum2Vtp6nizt4rcH/cQA/qDW94sbzPBOk2J6ahdWNuw9UBWR/8Ax2M1zdxMZZmkY5LsW/M1UETiZWikU59Q8vXrSxx8s8EshPoUK/4mrLOD3rAv5MeMdJft++iPvmLd/wCy1sk1qcUrWT/rdis/HWombig8EEUwkYpkXEbnNMIyOlKT70EnBwaogUAEYpB1/nSY4pHby43b0FMCrp199tN3gYEFy8K/QYqtr0rWtiL6M/PZSR3SkdvLdX/kDVbwud0N63/PS7mb8pCP6Vp6hAtxYywvysilD/wIEf1qd0a3UKl+zPa7OZTCWjOUY7l+hAxRWF4DvW1HwDot1IcyPZxhz/tKoVv1U0VzHa207GX4qSQt4QgBAAt57r8UtljH/o4n8KwmgfPUUUVpDYyxb95en6s5rWUaPWtMlyMrqMacejqyf+zVvtA3qKKK06nM37qGGBwRyKa1u3qOaKKZncYYGwRlaDAw4JFFFMVw8hwBgryaq3yspSPI+Y5P4UUU1uFzI8JRM2k2zggGZHkP1Zy39a3prZzA5yvAz+RoopdEaVPjl6s7j4RQmTwRJbseLPULmBfp5hYf+hUUUVjZHdLVn//Z",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCACGAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0Kx07TzplpnTrMn7PHkm2T+6Papxpmnf9A6y/8Bk/wp2nj/iV2f8A17x/+gipycV1HMV/7N07/oG2X/gMn+FJ/ZmnZ/5Btl/4DJ/hU+TTl5NAEP8AZmndf7Nsv/AZP8KP7N04n/kG2X/gMn+FWgMnA5rkNZ+KHhbRJ3tmvXv7mM4aGwj83afQtwo/Ok2luCTex0n9mad/0DbL/wABk/woOmacP+YbZf8AgMn+FcHB8bNBeYLc6Xq1vHn/AFnlxyY+oV8/zrudI1fT/EGmrf6Ndx3lsxxvj/hPdWB5U+x5pJp7DcZR3Hf2bp//AEDrL/wGT/Cj+zdP/wCgdZf+Ayf4VZpG4WqEVP7N0/P/ACDrL/wGT/CkOm6f/wBA6y/8Bk/wqzRTEJbaXpxjOdNsjz/z7J/hRVu2/wBWfrRQBn2B/wCJZZ/9e8f/AKCKn69abp8BOl2fI/494/8A0AVM0JUZzmkMaBmncIpZiFUDJJOAB6mgDFeefGLxE+neH4NDtZNk+rFhOV6rbLjf/wB9EhfpupSdlcaXM7I43x78RbnxNcS6do0z2+iKSpkjJV73HUk9RH6Dv1PpXDhNiBY1UAcAAYAq4RHMRDEdqJ8sY6AAdWNaHh/wTqnjNpBp9wtpZRSeXJcOpZnbqVRR1wMZORjOK4J1PtSZ6dOk/hgrs5/zMvsE8TP/AHOn9adZ6nd6bO7WF7dWUu4FnguWiLY6ZwcNj1NeoL+zxZm3+XXbiKYjvAhXP0GP51yXijwNrXg9RJqaR3NkSF+3W+duTwN6nlc+vIz3qI1YSfusuVCcV7y/U7r4d/Eu5v7+HQvFEyyzTnbZ32Apkb/nnIBxuPZhjPQ84z6iR2NfLksSLb5RzGTgxOv3o3HKsPxH4EV9GeDtdPibwfp2qygfaJo9two7SqSr/wDjwJ/Gu2lO6szzq1NRd0a4TJAqcQJ3FR524NO84+grYwLltboYzwevrRTbWY+Uen3qKAMrT5X/ALLs+f8Al3j/APQRVkyMRgmqmn8aXaf9e8f/AKCKsgUDFArwD4o351D4kX6g5SxiitEHoQu9v1f9K+glXJA9a+YPEFybzxbrVz187UZz+AcqP0UVjVfum9BXncpRW015cw2dnj7RcyCGLd0DN3PsOSfYGvpTwlpemaLoNvp2lXEFx9mjCO8UiuSe5OD1JyT7mvH/AIdeGINRW41zVNFl1q2jf7LYWUaBvPnP3nOSFCqAQWY4Hze1dX8Ntf8ACnjDXZ5NL8GxaVfaaN63UAUoAcqMsoHXnGQQfWvMrJyWmyPXoyUHbq/yPUaz9Q/snVYJtJvri0lFwhje3aVSzAjBG3OavSxJPE8Mqho5FKOp6EEYIrx+PXfCK+Op/CFj8NkmmgLh8RxCdti7mKIeWO0Egbgx+vFc8IOex0VKiha55tq+lz+H/EN9od4WaaxlKB2/5aJ1RvxUj8c16x8ELwvoOsWJPFverKo9BJGM/qhqh8UvBNzr+v8Ah5PClupum0+QFJpPLxDGU27mfnP7zaM884pvwQZ4ta8RWkyPFIkUHmROMMjq8iMCPUHivTw8+Zpnk4qPKmj109BSU/rQyAH5Tmu484s2v+qP1opLX/VH/eooEZ2ngf2XZ5H/AC7x/wDoIqxmm6dGh0qz4/5d4/8A0AVM6ADIpDILi5SztJrqQ4SCNpWPsoJ/pXyTeX8lzBLNEMSzB5nI/wCWeSTn6ntX094wc/8ACL3Fupw148dpn2kcK3/ju6vmSJE/s5mRceYhY++RWFXodVBaM+i/AKR6NDqWlWDIsdrcR3EPknK+XNCjDB7jcH/WtTwz4S0PwvJevoNgtm184echmbdjOAMngDJ4HHNeD/BvxZa+FvFbW2pSLDp+qRrC8rHCxSA5Rj6A5ZSe24GvpG5WcWziyaJZ8fIZVLL+OCO1ePVjKErX0Z7dGcKkbtaoS1keXzvMBBWZlCkYwo6fXI5/GsceFNFtvGMniiCxC6zIhRrne3ddpO3OASvGcZxUyzeInk2eTYRD/no29gB9OP51d1XUrHRtKn1LVrhLe0tk3yytxgegHcnoB3NZJy2ibzjFO8kjk9U1GytvFWp6tq94lrYaTp8MErs3O6R2kKqO7ELHge4ri/hHqcmpfEfxDfTJ5T6jbPdGP+7mfIH1AcCvK/EGrv4o8WXusTxlDe3G9Izz5acKi/UKAPzr0D4QTeV8Soos8XFhcR/iCj/+ymvUw9NQkn1PIxNV1INdEe8ClAOKkEXvS7D616J5RLaj90f96in2ykRkY79qKCWZ2nyj+yrPg/8AHvH/AOgCpt28gdqqWH/IKs/+veP/ANBFWVJByKCzH8Wpus9MUDCnUogfqVcL/wCPEV8w2Y/0eBT0MABr6t1azOqaXNaBxFIwDRS4z5cikMjfgwBr5g1HTLzRtYutN1O3+zXlrM2+LORsYkqVPdSCMGueqjpw76HNBPlKMOmVI/SvZfhH4n8Sjw/dRxumrWNhMsKWc77JUQrn93KeOP7jcehFeXJpsU1/O1w5ECjzSi8Fh359Mj9a9++EvhSTSvA5l1SGKObVJFu1jix+7jKKIxkd8cn61yYhWpX7nXhZKVfk103NiTxv5keyw8P6vLdnjyrmEQRof9qUkrj/AHdx9BXivxe1PWrnxFZ2mtagssf2cXCWlupSCFizL8oPLnA+83PPAA4r36XRGz+6mGP9sc15Z8YfCEqzaZrGIri2b/QroEYZCSWjK9+pYHHtXJhneqlax6GMUIUHNO7X5Hjtmu67jHoc13vw3k8n4n6ER/HLLGfoYX/wrj3sTpE7Szbmt2+VHI5Qns3+Ndv8J7RtT+JFhPBiSGwilupXXkL8hRQfTJf9DXpqMlNJnjKpCpScos+iKWovNOelIZWPTiuo4y/auqxEMcHNFV7bmMk8/NRTE2Z2n86VZj/p3j/9AFYfi3xna+FBbwm2kvL26VmigRwgCrgF3Y/dXJA6EkngVt6d/wAgqz/694//AEEV494/uWv/AB9qozlbOCG0T2IXzG/WQflTWuhNSfJByHal408UauCsmoppcJ/5Y6au1sehlbLfltrj9TsobieKFNzXc77pLh3LyBB95ixJJ7AZPethG3oG9RmsjVFjlu1Fr5zX6rhTA+3Yp5+c9APY59hVuKscEas5S1ZTu9FkhRpUnLBEYAHHOR0r6O8Lzzv4Q0WTyFZHsLcgxvyB5a9iBXhNpbTCGMX8qzzAYZ1Xav4D+tfQXww0631X4WaBceZLFItoIX2NxmMlDwc91rgxlHniuXQ9fLMTyzn7R32LzsVjYhS5A4Veprz34t3Mo8MadHNEkSS6nFnMmT8qO3pjt6163/wjgzzey49kX/CvJ/jhbQWV54csIZJJGZrm5kEjZ4VVQcdOshrkoYeaqRbPSxeKpuhNLseYXMC3VrJBIcBxgH+6exH0ODUOmMxAvIJZbLUFPlzTWkhicOvXJXGR35z1pmoW18Il/s6YqgPzxrgMR/sseB9P1FO0oWq28i2hkLb8zCbPmB/9rPOeK9t6s+TTcY3TOv074heJtL2i6mt9Yt1+8t0nlS49pEGCfqtejeF/E9n4r0yS7sopbeSCTyp7abBeJsAjkcEEEEEf0rxS4yYSv94hfzNdf8Lrr7P4zv7POEvrASBf9uJ8f+gyfpUyjbVHTQrSlLlkew2n+pP+9RS2n+qP+9RUHUzM00btNsh6wRj/AMdFeEXVz9v1rVb7OftOo3Dg/wCyHKr+iivcbe4W08PxXTnCwWSyk+yx5/pXgWlg/wBk2pf7zRK7fVuT+pqobnPin7iRPbcQhT1UlfyNUZv9E1yOXpHeL5T+gkXJU/iMj8quRyA3U0QGNm1s+uR/9amala/bLGSJTtk4aNv7rjkH860ZwxdnqWc/LXtvwJvRN4GvLEsC1hqUyBfRXxKP/Rh/KvCbC7F7ZJNjax4dP7rjhh+den/AvURbeL9Z0puBe2kd2mf70bFG/R0/KsqqvG514N8tXlZ7nXzz8Yr4XvxSeFTkadp0UJHo8jNIf02V9DV8p6/qQ1nxjruqK29LnUJRG3rHH+6T9I8/jWNJXkdmLlalbuUJGVI2dztVQSSewHWqGkB5YJL2UEPdv5gB/hQcIPy/nTdWf7S8WmxuFaf55ST0iU8/mcD86smVlU7ZYBgcKP5da692eTtH1JJPmmjX0yx/Dj+tbHhC4+yfELQpM4Esstsf+BxNj9VFYkMwlupV2gGIKCe+SMkfyq1BcCy1fSrzOPs+o20hPoPMVT+jGlLYqi7VEfRVr/qj/vUU63XajD0Y0VkemzivFlybP4U6lMpw39leWv1dAg/Vq8lRBHGsa9FAUfhXpHxDn8v4XW8Pe6ksoMeo3Kx/RDXnI7mrgcmLeyKKvt12RD/HACP+An/7Kr/asi8k8nWreboPMEbfRhj+eK03coUHZmxVo43sjPyNO1jni3vmx7JKBx/30OPqBXU+DdWGhfELQdRc4i+1fZJiTgBJhs5+j7D+FYV7ape2kkEmcOOo6qexFUoZZb7T7i0mYLfQjYxH97qjj2JAP1BqZK6aNacrSU+x9ZeNNb/4RvwRrGrg4e0tJHj95MYQfixAr5XiVNO0xBO+Ft4h5jn2HJ/nXqnxH8ZDxB8KPC6xNiTXJI551B6LCu9wf+2oQV5BdE6jqK2S821uQ9wf7zdVT+p/CsqKsmzrxcuaSj0Wo/TIGlWS9uk/fXRDBWGfLQfdX8ufqTV2QxxRs5UAAZ4FOY7EY+gzWbqF0BG2T8sa7n+oGcVvsjz23Ji6O5la7lPJeY8/QY/pVjVcjSbl1+9GnmL9V+YfyqroKlLIBvvFQzfU8n+daVxEJrSaI/xxsv5gijdFXtO59HWcontlmXkSgOD9QD/WisvwVc/bvA2i3JOTLYwEn38tQf1orFHqvc4X4mq6eGPCluSNs9wsh/4BbMR/6FXDeUwHUUUVpT2ODFP316GNeadJqmoCzjlETNvlD+nlQvL+vl4rTcGS0SYYG4LIB6ZwaKKa+Jmcv4UX5v8AQl8tvaszVoGtANUhIEluv7xf+ekfdfr3HvRRVS2M4P3kV7nUbuEeV5gkit8RWCMOIvtDGRs/8C9PTFadlpwsbVYEbcRlmdurseSTRRUxRrVbaX9dELeKyWrkEZPH61lJpzardWumCQRm/uYrXf8A3fMcKT+RNFFOezIpfxI+pPoKvJagkjPlrn8OK1hE24cjrRRTWxE/iZ7T8JYJLj4W6Mcr+7SSHn0SRlH8qKKK5z2D/9k=",
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCACGAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDprLT7H+zrVmsbU/uU5MCc/KPapvsFh/0D7T/wHT/CltP+Qdaj/pgn/oIqauQ4CD7BYf8APhaf+A6f4UfYLAf8uFp/4Dp/hU/FHWgCD7BY/wDPhaf+A6f4U37BY/8APhaf+A6f4Ut/e2+l2E97fyiG2gTfI7AnA+g5POB+NchqnxO0yCBP7Hhe+lYZfzcwpD7PkZ3d8AdOc00myoxlLY6/7BYj/lwtP/AdP8KPsFj/AM+Fp/4Dp/hXD6V8U45bgJrFikMJPM9pI0nl+7IQCR7jP0rUh+JXh+S58uY3ltHnH2ie32oPc4JKj3IFFmU6c1ujpPsNj/z4Wn/gOn+FH2Cx/wCgfaf+A6f4VYG11DIwIYZBByCPUGkpGZD/AGfYf8+Fp/4Dp/hSf2dY/wDPhaf+A6f4VPS0AJBptgYzmwtOv/Pun+FFWrfmM/WilqK5Qs/+Qda/9cI//QRU2Oahsv8AkH2v/XBP/QRU9MYVh+MdZk0LwxcXVrJGl05SGAvjhnYLuweuM5x7VuKMkA/pXz9q+q3Wq6m+oXbbribJy3PlJk4Rf7oA9OpyTTSua0oc7K8kkl3dtO+6aQNuaaeQszHPVmJ9e3T2pgVpIWyxIj6KB696iuJ/Id4Y1BjLZBzycd/1qC2ulmDFmAKtitDv0RYbcACrBcdzUYlKttbCsO4P60kem6lq7tJZ2sksCkqpVgoJHXvzzUN5YX2mskeoWssRY7VZgCD36ilzRva+pbhO3NZ2O38GePrjRPKtdVkmudLSAxwwwxKWgbdkckgkY3Dv2A6V63YX9rqunxX2nzLNbzDKOOPYjB5BByCD0NfO0b25iKxKQ2ASS33fX6ivSPhdrkxuptCdAbcpJdQtj5kbcu8E9wdwI7jB60pLqcVakkuZHpNFJSioOUs2/wDqz9aKW2/1Z+tFIChZf8g61/64R/8AoIqbgVDZH/iXWv8A1wj/APQRUvemA4YyCK+evF0N7YeKtTtp4Fgf7TJNEqjCmN2JUj2P8819CV5R8XrQwazpupKuVntngJ7FkbcP0c/lVR3NqLtKxymjeE73WtPF6LkRLJIy7Nm7aF4yCSK6r/hB9Ja1t4poyXhQIXDEFx7kYzSXFjrmn6VZaV4bWJdqb57yVhwxOSADnqST06YptnP4rsr+GPWDZT2hbEkijDAeowBk/hXnzqTnqpadD6inSpwSi4NvS7tdHQ2VnBYWywWkYjjUYAUYqrrWi2+t2XkXWRg5R1OCp9RVq7meGwmmtwryKhKBjwxxxn2zXKLB44v4/OS+s7dT0RFAB/Haa54Jt3vY6qkkly8rfocz4h0P+wdRjghmklSSDeSxHXcQegHoK7P4PWd5LqmpamWAtFiFs2eryZDgD0AHX1yPSqHiOyvLnw3BfarDHFqNo/lyGJsrIjEDI9OcHHsa7b4W2f2bwLFMVIN5cyz59Ru2D9Er1KU+anq9dj5zHx9nJpKyZ2GKBTjQPYVR5RYt/wDVn60Utv8A6s8d6KkDOsv+Qfa/9cE/9BFTCobL/kH2v/XCP/0EVMKoBs8621tNcOpZYo2kYDuAM4/SvINWtG8QWAbUHebUbyJZorl5mCQO4yqKvRUAO3p7mvYiFYEMAykYIPcelea3djH4euY7LVJzbRQPmxvpB+7liB4Rm6B1Hy4PUYI9sa3OleJ6mW+yc5RqdVobtvZ2d3eC31O4MFv5b+oVpNvyByOQm7BOOvTpmuU8JaXcRwatNqsMtiDOgtrMzGRejeYckn5fu4bufatyzvBqum21+ihRcRh9qnIB6EZ+oNSSRs9u6KQGZSAfSvPVWUYunY+idGM5qqmxsQWazTKDay/d7Y7VlTaKk/xO0pxCf7ETbJeXks7gumweYhUH5XDBtuwDqp7VowXFwRDCbExBfldzIMYHcetWmGaIVHSd0h1aMaySbaMzxDYfb9Ens4Lhym9T5s3DGNXBycfxbR270zw9dJpGqWB0qJ7SxnuUtZbTzSyMsmQrYP3WDYPHUE5qTVNSi002yTypClzI0bSucCMBCd35gDn1q54X0sajqNtdwxt/ZNi3mxTOpBupsFVKg/wICTnucY6GtqHO2uxx490Y0pc29refkd3jLYpeQfakU5NOzXefKE8H3D9aKIPuH60UgM+yH/Eutf8ArhH/AOgipaisj/xLrX/rhH/6CKmxVAFBwRggEHsaKKAOJaD7Bq9/pz/KfOe7tx/ehkO4kf7shcH0yvrREkcV9FPLE11AufNtTO8QkB7hl5DDt1HYjuNbxrbRt4Vvb8Ax3WnwvcW1wvDROB2PoRwQeCOtclbeJIkxHrQSzlzhZx/qJfcH+A/7J/AmuCtTcZ88ep9NgMQq1H2c+mlztZNU8HfZiLfwpfNc44WfU2CA+5WQnH0Fc/HCEZ5CMO7l9qsxVM/wruJO0Y7k+tQvf6fEhne6tVXGTIZF/nXN634hub3Tro6KzQW0cbM14ww0mB0jB7f7R/CsryqaWsdyjCjd3bfrc7HwzH/aXime+i+a106B7YP2adypcD12qoB92xXY5J71Bp1na6fpVta6fCkNskYEaR9PUn3JPJPc1OvXmvRjFRioo+SxFZ16jqPqLyFNOX0opG46VRgTwH5D9aKLcfuz9aKQGfZ/8g+1/wCuEf8A6CKnzxUFngabbMTgC3QknsNo5rBvfHGnRF4tJjk1aZTgm3IEKH/alPy/lk+1UVGMpO0Vc6XvWPrnifT9DXypZFnv34hsIpB5sh+n8I7ljwAK4zUdf1fUgy3d/wDZoT/y7acSgx6NMfmP/Adtc3p0EUs730UKRREFLcKOWTPLsTySxHU9gPWo50d9PAybXO7D/GWpalrCx/a/9LnuH8uO1g3GKAYJ+Rf4m6ZdvwwK6G80zcGMKhlPBjPP/wCusiG1vbvxHpcOk232y7DSuLYOFaRQmSFzxuxnAOM9K6O3vILt5I4H/exHbLA6lJYm9GQ8qfqK48Q5NJ9D3MJGnBuMfuObGlWaS5FhAsgPUQKD/KrtzpU1zpV2rKQzwOqJ3Y7Tj6Vu7WJ6HNQGd7i8Gn6ZC9/qTqSlpb/M/wBWPRF9WbArBOUmras7JckIu+iOK8JeJNV8PKslgN8TEifT5chCQcZX/nm3HUceor13Q/FWk+IY1FjdIl1j95ZysFmibupXvj1GRXlmkrts2EuzzvOlMmw5AbzGzg9x70y5iigvleeGOW1uWCSh1zsk6I4PUZ+7kf7Nelz6tM+fq4SNRKSdme3ZIPvRkmvMtP1/VtMwtpfmaIf8u2o5lUD0WQfOv47hXUWHjjT5SserRSaTKx2h5iHgc+0o4/762mqTT2PPqYarT3V0ddb/AOrP1opLf/V9epzRQc1zzLxbfNdSW+nFi1pZWEMssO4hZpXHyhwOoCKTg8ZaskyNIqgn5APlUDCqPYDgU0XH243F2TkXMxK/7iKIl/RCfxptt/x7oD1X5T+HFZTd5H0OGgoUku46Vo44meZlVAMsWOAB71k6dBcfaM2LyRaaQcLMOT6eWDyq/X8BV/U7Y3Wmzwj7zodp9COR+oFPsbr7bYw3PeRAWHoe4/PNJbGz1ka3hRvsvj/w7IjFCbxo9w5PzROOfWveNc8MaN4gYHxFoNrqMijC3KoBIPowIcfgTXz1ZTfZdf0i4z/qtSt2J9AXCn9Gr6gjO5FPqAauOxx1175xK/C/wWG+bRb+Vf8AnnJd3LL+RfFbJ0+y8OeG7xNF0u00i1jiZ2EMaqWwO4Xv7kmt+uV+Jl79g+GuuSqcMbV0U+7AgfqRVa7GTbe587adFv0q1Zsq7Rhyw65bk/zqlJFJDqHnayzywq+YXQfuo/TevY/7RyPcVsxxKkSxdlULj6DFUNXz9lSzjdi124iwTyE6tz9P51mnqd7Vo+hoDB5657+tMlkaGJ/LONw27TyGzxyO9SBAqgL0AwKik+aWNPfcfw/+vipNB8XibXvDMYs/D8Yayk/fLGy7hCTwyrnoMrux/tGirNvM0MZUAHnPNFWqttLHJLB05ScipaxCGyt4R0jhRfxxz+uaIjtklT0bd+Y/xzT4P+PeIn+4v8qrBz/bDpngw5A9wR/jUbs6tki2eVrL0s/Z7y8sj0V/OjH+y3X9f51qe1ZWpf6HqFrfDhQ3lSn/AGW4z+BwfwprsKXctamxi0+WZOGhxKPqjBv6V9T6fMJ9PglU5DoCK+XrmLz7aWE/xoyfmMV9B/D2/OpfD7RrknLPaRbvrsGf1zVR2OautUzpulec/Gq68vwRHaZ5u7uGLHqN4Y/ohr0YnivHfjVd+ZqWiWIPAlknI/3I8D9Zaq5jFXkkeej1rMhP2zXppusdovlJ/vHlj/IfhVu/uhZWMs5GSi/KPVjwB+ZFUdPtY7ayRZb195+Z9rgZY8k8DNZrY7nvY1utRJ810x/uKB+fP9BVcRxF0MPmOwYHexYjGeetPs5DJPdHOQsu0ewAFIq5ejGQfrRSxn5fxoqSyOCJvssXI/1a/wAqzyrDxCgyOVZf/HQf6UUVRD2RpeU3PIqtf2YubKWKTGGU5oopFNEWkSSXOlwySEGRMxuf7xU7c/jivcvgsJJvh9FDkYtp5oBk9llfH6YoorRbs5K3wRZ6D9lk7sv514D8T3kuPiIInIxbaeGH1klbP6Riiim9jGjrNHBahGbrWLSxbGxR57/7RzhR/M/lWsINv3Qo+lFFZvZHfHdiGJs9RVDSEZ4p3yPmmY/qaKKXQb3RqRxNt6jrRRRUXLP/2Q==",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCACGAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwB1raWZsbfNnbk+UnJhX+6PapvsVn/z523/AH5X/Ci0H+g2/wD1xT/0EVNW55N2Q/Y7P/nztv8Avyv+FL9jtCP+PK2/78r/AIVNSZp2Fch+xWn/AD523/flf8KPsVp/z523/flf8Kjv9SstLt/P1G6jto+xkbBb2A6k/Sudu/HKL/x46bLInaW7kECn6Ly5/IUtEVGM5bI6b7Haf8+dt/35X/Cj7FZ/8+dt/wB+V/wriT491ANn7JpxH90Sy/z2/wBKv2Pj+xkkWLVbd9PLHAm3eZDn3YAFfxGKV0W6VRa2On+x2f8Az523/flf8KPsdn/z523/AH5X/CpQQQCCCDyCO9OqjK5D9is/+fO2/wC/K/4UfY7T/nztv+/K/wCFX47NmUF22k9sU42I/wCeh/KkOzKsFnZ7D/oVr1/54L/hRWlBZDyz856+lFPQLSMy0tv9Atz5qf6lP/QRSyRtEQGGQehHeizP+g2//XFP/QRU84xaqD1LZApFOKK/aub8aalfadpkX9k3kNvdTOVWNk3PL67SeFwMksRgV0oGTjpXkWu6tNfa1ey38U1s6N5SRyqVKRdVUD3+8T3yPShvQqjDmlr0IJLg/aPPeV3uHAV7hy0jk98Ny2PoB9KHmsrVg1y9zk/xNAVB/wC+qbpces6zK1r4etJGC8SPGAoXP95zwPpmujg+EviuaPzPtsG7rsLySD89uK5p1qcHaUrHr08PVqK8I6HLnVri2kLwmG4hPAzGobH4VBPcoNk8QBgmO14+wPsO3uK6ZPhD4wN2yJZW+w8+Z52E/LGf0qxcfBnxbBZSOBZShMy+Uk53MfQZGKn6zR/mRX1Wv/Kyt4V8bppOlxabqVtczpCxEc8RDbY+wKk5OOenbFej6deW2owW91ZTJPby4KSIeCP89q8Zt5v7LvHstQtJ7K4B2yeYxwD6Mp4wfWuo+HWqJH4km06JgLe7QzxxZ+5IpAb81P8A47XSmebWopXktz1aVikTMvUetU/tUvdh+VWrj/j3f6VTWYqoUKhx6iqRyyepctLsxwbdobB65opIZCYgdq8+1FArspWt0wsbcIqACFMcf7Ipsjs7hnOTRaND9ht8xH/Up/F/sinSFGI2Jtx75oBsZ2ry/wAaactx4vvCSQXSF/wKbf5pXqB4rg/G3lx+JrQLMizXVqYyNw3KVfKnH0dvypS2NqD989D+EOg2tn4GiuCgdri5lcZHAAbYP/Qa9AxXK63oPiaGwstG8DX9ho1jbRBJLiaMyTZB6KuCuD1JPJJ7d4NC0vx9ZalbtqvibS9X07dicfZNkmMfwsoxnPrXzNRKpJzutT6+EnCKhZ6HY4oxQ+7admN2Dt3dM9s159c+H/ibeMDJ430ywdvuxWtiMH6Fhk/rWcIqW7sazm47K5znxr0KF9R0m7jAjaWOaNsDqQVI/ma5v4a2RttV1WR1QvHHCqtjpkuePSvSPFGk6vc/DO9/4S57K41PTf39tdWYKh8Y5ZSBtJBIIHHeuL+H/lPZanPFKjtJebSFYEqqKFGR2yd2K9zBSvT5ex8/mSabk+tjvldLiI+/3h6U37NB/db/AL6qkMqcqSD61ILib1B+orvseNc0be3h8s/K/X+9RVSGaVkJ3nr2ooFzLsUbSOT7Db/u2/1Sdv8AZFS+VJ/zzb8qt2J/4l1sf+mKf+girGaV2VymWQVb5lOfQ96o6ZokGtfDextvIt1uNYRLt75kzMboybgSeu1SAm3stbl0AYC3deQayNH1OPw4JNP1S3uZtIadrizubWNpHs3ZtzRsi/MU3ZYEA4yQe1ceMjUlBOnumejls6MKrVXZo9I1jSrLVy1vqSSS2+W3QrIVVyRwWA+9jqAeM9RXH/Dv4ey+CjqEt1qC3U93KCq2ymKFEAP/ACz6ZJOeOmMA8muk8M6vJ4g8K6Zq0+3zrq3Vpgi7QJBlX47fMp47VqHkEZxx19K8R1JwTp9D6KNOE3Gp1IopfOhD4ABJA9wCR/SuE1v4Yw618RNO1+4ulksIGEl1aTKXkmYfwh+yHjj+HnHWuxsBexRJb3UMISIFRJG5O4djj19au1NOpKm7xNatKFTSRia7oY1HwdfaJbXEkS3EDRJLM7Ssik56nlsDgZ54FcZ4itLW2t9Cv7GxtrKSO+isovIXa0kDo25Hx97AVWz2INdV4y8Qx6Bb6aJmYRX14IJtkTSP5IRmfaqgnPAGR0zXJXFzJ4g1W0uhayWel6eGFhbTDEsjsNrTSD+H5eFU8gEk4ziuzCU6sqkZLbc4MdVoU6M4v4mrIuDLDAGTUggc9gPxqZVWCPPU9zT98f8Az1X8694+Vt3CC3fYfu9fWipYZVCkA7ueoooFZGdaOn2G2+aT/Up/6CKmDpkfNIKLNJ/sFtiZf9Sn8P8AsipGjmcAPIpGc9KRQ+f/AI9n+lZ4z24rQuP+Pd/pWeMAU0TI0fA+qx6bfXHhy8YR+fPJd6YzdJQ/zSwj/aVtzAd1bjoa6vULA36R7L27spIm3JJbSBTnGMEEFWHsQa8i8Y3tvFoVzbZ82/MTS2sUZ/eoyKWEo5yoXaW3dsV2Nj4o1XQ4kg8SW9xqdsEUrqNrDumXIziaIcn/AH0znuB1rxcbQUZ88XufTZbXlUpOMlpE2hp2rySeVL4hvwn95LOBD/31tP6CtWztY7CyWBJZpETJMlxKZHOTkksf/wBQ7Vzp+I/hjb+7u7qZ+0Uen3Bc+2Nlcf461rW9d8K6nMol0XTIYCyW+R9puj0/eEHEac/dBJPcjpXEoSk0paHp3ik3HWxd1DVU8UeLRqFm27S9Mie2tZR0nlcjzZF9VAUID3O6rUQxOtZuj6np+oWK/wBmlEWEBHthhWtyONjKPu4xj0rSh5nWvo6VNU4KC6HxletKtVc5dS4MY+YZFL5Lf88xQMHrS1ZBNCoVCCoBz6UU6ADYfrRTFYyrS8UWFsNh/wBSn/oIqb7Yv9w/nWM1/BZWNkspd5p0RIIIkLyzNtHyog5J/wAmrcWjeItQwbpoPD1uf+euLm7I9kB2J+Jb6UtBxjOWxJqGpQW1q015NHawL96SVwo/M1k22oza7qMem6Ik8PmR+fJqNxbMIooc43oGwZGJ4XsTk5wDXSWXhrR9MmF3HaSajfoMi81FxPLn/YB+RP8AgIFVPDmq211bXV1d3YbVZ5PNvoZciSAjhItp52oOBjgkse9K50Ropay1KM+gaZFrq6ZFC5SXSrj7RcSNumnMrrGzu/c7QQAMAA4AFdR4fvI9ZtP7J1jamsWCBXK/L58Y4WZPVT3H8LZHpnmtR1D7N4901biPyxfWEsMWTyGV1YA+554qvrd3Nc6xbWOkhU1K3HnC9D7WtM9Ap7lgD8p4IHIORWtXAxxeGSWkk3YdHHTwmJv9lo7mbQpgSI7gMv8At5FcX4nRr2eXQrUpPCmP7TkTkRjgiEHu7cZ/ur7kVe1HxpfXfg7TltJVt9Uu3lgupYxjyjDxIV67SxKYPOA/HQVneG7mJ7BrRLdLWa1fbNCrFhluRJk8kN1yec5zyK4Msyxyqe0rbJ2t3aPVzPN5Kn7Kk9Wt+yZgWuiPeajqd1Zu1tdRXZ8m5jxld0aFlI6MpJ5U+vY1o2XiZLWeaDX4JLKW0cRz3Kxs1sSRlSHGdoYcjdjuMnFW/DVzHc2V5qEIza3d9M8cg7KuEBI9Ds6066vYYPFVidMn869kH2e7t4fmzAeQ7kcDYeRnqGYd676rvNtd2eTGmnBKW9jZiuIZ4VmgmjlicZV43DKR7EU/zB/eH51lz+GNNeZp7FZdJumOTPpzCMOfV4jlG/IH3qs0evad/wAfFrHrMA6zaeuycD1aBjz/AMAY/SszOVKS21OlgkHln5h19aKy9KvbbUrL7RYyrNHuKkgYKkdVIPII9DzRTOdysVPCsbT32r6gmd9rZ2+nwMOqkp50mPQnMYP0rq0YOodejAEfjXP+AkK+DYblx899czXR9137F/8AHYxW3anEJj/55sU/AHj9CKg9GKskiHWL86Xo9zfLEJTAm7aTgdQMk+gzk+wNVrPRFj1AanqUq3uphSiz7NqRKeqxr/CPc5Y9zWlcQxXNtJbzruimQxup7qRg/oazvDs8kuixw3LFrizZrSYnqWjO3P4rtb8aBsw/GtibvV9EEcnlTN56QyEZ8uQBHRvzT8s1a0rR1sraQ3TLc3dyxkuZtvDueuB2A4AHoBUvi4bI9Kuh/wAsNRjBPoHVk/mwq+p+Yexr18FZwv5nlYy6nbyOc0fToH1jU9QjBMLyeRCrHIynEjgdssAPfYDUmtaNLczfbNPuRaTtGYLhyMiSE/eHsw6g9uaseGth8K6f8p3shctnrkk9PqaXxDcNbeG9Qkj++YGRP95vlX9WFdSt7O79f1Odt89l6foL4ShW28Hab5cewND5wRR03kvgfnVW4ii0CGfVdGKLA8oNxYsvErswGUPVHJPTofQda6G3t1tLWK2QYWGNYx9FAH9KxtU/4mHiOw04fNHb/wCmXH1GVjH57j+ArwD3bG9gdOtQ3PyRgDqzBQfqf8M1KDg9aglO+7jXsilz9TwP60wPOvHum6zJ4na60eZ41uolkm2HG6QZTP8A3yq0V6SkMcoJkQMQcc0VNhWXYTRYPsXhvSrUjBhsoUI99gJ/UmlFzGuqy227940Szbcds7SfzAptrKWsbY55MKH/AMdFZV1MY/GNgc8S28sLfXhx/wCgmixR0IfPesdH+w+LpIzxFqcAkX0E0Qw35oQf+AVoh8Vk+JEkbTBeWq7rmwkW6iH97b95fxUkfjTsId4vVpPCGoMgy8CC4X6xsH/9lqzDKssKSKch1DA1IHg1PTv3bB7e7h4Pqrr/AIGsLwxctJ4XtfNP7yCMxPn+8mVP6ivRwL1lE8/Gx0jIl8NH/il9N/691/lSa2fPn0mxH/Lzfxsw9UjBlb/0Bfzo8OOp8JaWAgDfZ0O7P+z0qONvtXjhO6afYlvo8zYH/jsZ/OumtLlw/wAjnox5q/zOjaRURpJGCqoLMx7Ack1ymhavp7/atVu763jmv5N4jMgLJGBhFwP9kD8Sat+J7mWS1h0u1UyTX77XQNtPkrgvz2zwv/Aqsxf2hFGqW9hZ26qMDdOT+ir/AFrxj2CeHWLKeZIoZmZpDhD5ThScZxkjHQGnWtxHcT3Txtny5fJb2KgZ/U1AYLySeGe/ng2W7GRY4Y2GW2leWJ9z2qn4Vcy6L5zfenmkmP8AwJif5YoA6KDlD9aKICPLP1ooGQWUDnTbXBHMKf8AoIrF1tHh1axmyMxXkA/76Ow/+h0UUITOhMDjuKaYGYEHbg8GiihDMbw3HJbtf6TkFdPn/dHP/LOTLKv4HcPpiqenxNb6j4gs1I2xXLSrjoBIgfH5saKK7MH/ABjjxn8L5k3hyFv+EW0s5GPskZ/8dFJ4Wt3up9YvyRumvjCAeyxKFA/MsfxoorfF/wAGPy/I58L/ABZf11F0eF9R1zUNScjEchtYVP8ACqEg/m24/l6VvfZ3PQrRRXmHplDWxJa6PcygglY2P5An+lV/Ddm0WjwxKRhI4x/46KKKfQGb1vbP5Z5XrRRRSJP/2Q==",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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",
			"data:image/jpeg;base64,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"
		];
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
				"slug": "academic-study-planner",
				"nameEn": "学习规划师",
				"emoji": "📚",
				"division": "academic",
				"description": "面向中国考生和终身学习者的个性化学习规划专家，精通考研、考公、司法考试、CPA 等重大考试的备考策略，擅长运用费曼学习法、艾宾浩斯遗忘曲线、番茄钟等科学方法，帮助学习者制定高效的学习计划并持续优化。",
				"descriptionEn": ""
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
				"slug": "authenticity-appraiser",
				"nameEn": "Authenticity Appraiser",
				"emoji": "🔍",
				"division": "specialized",
				"description": "二手与收藏品鉴定评估专家，覆盖奢侈品箱包腕表、球鞋潮玩、文玩收藏的真伪要点讲解、行情估值框架与交易避坑——教你怎么看、去哪验、按什么逻辑出价，并明确线上鉴定的能力边界。",
				"descriptionEn": "Authentication and valuation specialist for luxury goods, watches, sneakers, collectibles, market pricing, transaction risk, and the limits of remote appraisal."
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
				"slug": "chief-executive-officer",
				"nameEn": "Chief Executive Officer (CEO)",
				"emoji": "👔",
				"division": "company",
				"description": "企业最高决策者，掌管战略方向、资源配置、组织节奏与对外叙事——在信息不完备时做出可逆性分级的决策，对结果负最终责任，把愿景翻译成组织能执行的优先级。",
				"descriptionEn": "The company's ultimate decision-maker, accountable for strategy, resource allocation, operating cadence, executive alignment, and turning vision into executable priorities."
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
				"slug": "chief-marketing-officer",
				"nameEn": "Chief Marketing Officer (CMO)",
				"emoji": "📣",
				"division": "company",
				"description": "增长与品牌最高负责人，掌管定位、渠道组合、营销预算与品牌资产——用可归因的数字管增长，用不可量化的耐心管品牌，绝不让两者互相冒充。",
				"descriptionEn": "Executive owner of growth and brand, responsible for positioning, channel mix, marketing investment, attribution, and long-term brand equity."
			},
			{
				"slug": "chief-of-staff",
				"nameEn": "Executive Chief of Staff",
				"emoji": "👔",
				"division": "company",
				"description": "创始人和高管的首席协调者——过滤噪音、掌控流程、确保一致性、路由决策、将产出定位到最大影响处，让老板能清晰思考。",
				"descriptionEn": "Executive coordination leader who filters noise, aligns stakeholders, routes decisions, and keeps leadership focused on the highest-impact work."
			},
			{
				"slug": "chief-operating-officer",
				"nameEn": "Chief Operating Officer (COO)",
				"emoji": "⚙️",
				"division": "company",
				"description": "运营最高负责人，把战略翻译成流程、指标与执行节奏——消灭组织里的摩擦与例外，让正确的事成为默认发生的事，对\"计划与现实的差距\"负责。",
				"descriptionEn": "Executive owner of operations who translates strategy into processes, metrics, accountability, and a reliable execution cadence."
			},
			{
				"slug": "chief-product-officer",
				"nameEn": "Chief Product Officer (CPO)",
				"emoji": "🧭",
				"division": "company",
				"description": "产品最高负责人，掌管产品战略、路线图取舍与产品组织——对\"做什么、不做什么、按什么顺序做\"负责，用用户价值与商业价值的交集裁决一切需求之争。",
				"descriptionEn": "Executive owner of product strategy, roadmap trade-offs, and product organization, balancing user value with business outcomes."
			},
			{
				"slug": "chief-technology-officer",
				"nameEn": "Chief Technology Officer (CTO)",
				"emoji": "🛠️",
				"division": "company",
				"description": "技术最高负责人，掌管技术路线、架构决策、研发组织与技术债务——在业务速度与工程质量之间做显式权衡，让技术成为业务的杠杆而不是瓶颈。",
				"descriptionEn": "Executive owner of technology strategy, architecture, engineering organization, and technical debt, balancing delivery speed with engineering quality."
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
				"slug": "design-video-prompt-engineer",
				"nameEn": "视频提示词工程师",
				"emoji": "🎬",
				"division": "design",
				"description": "精通 AI 文生视频提示词的专家，用 5 段式结构把一句创意写成可直接投喂 Sora / 可灵 / Veo / Seedance / MiniMax 的电影感提示词，含运镜、瑕疵、声音与负面提示词，并对\"这条要花多少钱\"负责。",
				"descriptionEn": ""
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
				"slug": "engineering-dingtalk-integration-developer",
				"nameEn": "钉钉集成开发工程师",
				"emoji": "🔗",
				"division": "engineering",
				"description": "专注钉钉开放平台全栈集成开发的工程专家，精通钉钉机器人、酷应用、审批流自动化、连接器低代码集成、钉钉小程序、宜搭平台对接及与阿里云生态的深度集成，擅长构建企业级协作与业务自动化解决方案。",
				"descriptionEn": ""
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
				"slug": "engineering-embedded-linux-driver-engineer",
				"nameEn": "嵌入式 Linux 驱动工程师",
				"emoji": "🔌",
				"division": "engineering",
				"description": "嵌入式 Linux 内核驱动与 BSP 开发专家——精通 Linux 内核模块、设备树、Platform/I2C/SPI/USB 驱动框架、DMA、中断子系统、Yocto/Buildroot、U-Boot、交叉编译工具链。",
				"descriptionEn": ""
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
				"slug": "engineering-fpga-digital-design-engineer",
				"nameEn": "FPGA/ASIC 数字设计工程师",
				"emoji": "🔬",
				"division": "engineering",
				"description": "FPGA 与 ASIC 数字前端设计专家——精通 Verilog/SystemVerilog、VHDL、Vivado/Quartus、AXI/AHB 总线、时序收敛、Zynq/Intel SoC FPGA、高层次综合（HLS）。",
				"descriptionEn": ""
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
				"slug": "engineering-iot-solution-architect",
				"nameEn": "IoT 方案架构师",
				"emoji": "📡",
				"division": "engineering",
				"description": "物联网端到端方案设计专家——精通设备接入（MQTT/CoAP/LwM2M）、边缘计算、云平台（AWS IoT/Azure IoT/阿里云 IoT）、OTA、设备管理、数据管道和安全体系。",
				"descriptionEn": ""
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
				"slug": "engineering-knowledge-graph-engineer",
				"nameEn": "Knowledge Graph Engineer",
				"emoji": "🧠",
				"division": "engineering",
				"description": "Structures information and capabilities into interconnected nodes (entities) and edges (relationships) — enabling dynamic context navigation, modular competency chaining, lower token costs, and hallucination reduction.",
				"descriptionEn": ""
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
				"slug": "engineering-mechanical-design-engineer",
				"nameEn": "机械设计工程师",
				"emoji": "⚙️",
				"division": "engineering",
				"description": "通用机械产品设计专家——精通方案选型、传动/机构/结构件/连接设计、强度刚度疲劳振动校核、DFMA 与标准件选型，遵循 GB/ISO/JIS 国家标准，输出可制造可装配的工程图与 BOM。",
				"descriptionEn": ""
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
				"slug": "engineering-network-engineer-china",
				"nameEn": "国内网络工程师",
				"emoji": "🌐",
				"division": "engineering",
				"description": "面向国产网络设备的企业网工程专家——精通华为 VRP、华三 Comware、锐捷 RGOS，覆盖园区网/数据中心/广域网的 VLAN、STP、OSPF、IS-IS、BGP、MPLS、VXLAN、SDN 设计与排障，熟悉信创国产化替代与等保 2.0 合规组网。",
				"descriptionEn": ""
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
				"slug": "engineering-pc-host-engineer",
				"nameEn": "上位机工程师",
				"emoji": "🖥️",
				"division": "engineering",
				"description": "Qt/QML 桌面上位机开发专家——精通 Qt Widgets/Quick、QSerialPort 串口、Modbus/CAN/TCP 工业协议、QChart/QCustomPlot 实时数据可视化，以及与 STM32/ESP32 等下位机的协议对接和跨平台打包部署。",
				"descriptionEn": ""
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
				"slug": "engineering-security-engineer",
				"nameEn": "安全工程师",
				"emoji": "🔒",
				"division": "engineering",
				"description": "专业应用安全工程师，专注于威胁建模、漏洞评估、安全代码审查、安全架构设计和事件响应，服务于现代 Web、API 和云原生应用。",
				"descriptionEn": ""
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
				"slug": "engineering-threat-detection-engineer",
				"nameEn": "威胁检测工程师（工程侧）",
				"emoji": "🛡️",
				"division": "engineering",
				"description": "专精于 SIEM 规则开发、MITRE ATT&CK 覆盖度映射、威胁狩猎、告警调优和检测即代码流水线的安全运营检测工程专家。",
				"descriptionEn": ""
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
				"slug": "finance-financial-forecaster",
				"nameEn": "财务预测分析师",
				"emoji": "🔮",
				"division": "finance",
				"description": "专注企业财务预测与场景建模的分析专家，精通收入预测、现金流管理、烧钱率分析和融资对接，帮助创业公司和成长型企业在不确定环境中做出有数据支撑的财务决策。",
				"descriptionEn": ""
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
				"slug": "finance-fraud-detector",
				"nameEn": "金融风控分析师",
				"emoji": "🕵️",
				"division": "finance",
				"description": "专注交易欺诈检测与金融风险防控的分析专家，精通支付宝/微信支付/银联渠道的风控策略、反洗钱合规、电信诈骗识别、央行征信应用和互联网金融风控体系搭建，帮助企业守住资金安全底线。",
				"descriptionEn": ""
			},
			{
				"slug": "finance-hk-stock-compliance-reviewer",
				"nameEn": "香港股市合规审查专家",
				"emoji": "⚖️",
				"division": "finance",
				"description": "资深香港股市合规审查专家，精通HKEX上市规则、SFC监管条例、公司条例及证券及期货条例。提供上市申请合规审查、持续责任监督、关联交易合规、披露义务审核及企业管治顾问服务。",
				"descriptionEn": ""
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
				"slug": "finance-invoice-manager",
				"nameEn": "发票管理专家",
				"emoji": "🧾",
				"division": "finance",
				"description": "专注中国企业发票全生命周期管理的财税专家，精通增值税专用发票与普通发票管理、金税系统操作、电子发票推广、三单匹配、报销审批和税务合规，帮助企业实现发票管理的规范化和数字化。",
				"descriptionEn": ""
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
				"slug": "gaokao-college-advisor",
				"nameEn": "高考志愿填报顾问",
				"emoji": "🎓",
				"division": "specialized",
				"description": "中国高考志愿填报策略专家，精通平行志愿与院校专业组填报规则、位次法与等位分析、新高考选科组合与专业限选、提前批与专项计划、院校层次定位、冲稳保策略，帮助考生和家长制定科学的志愿填报方案。",
				"descriptionEn": ""
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
				"slug": "hr-performance-reviewer",
				"nameEn": "Performance Management Specialist",
				"emoji": "📋",
				"division": "hr",
				"description": "深耕中国企业绩效管理体系的实战专家，精通 OKR/KPI 双轨制、360 度反馈、绩效校准会、PIP 改进计划等全流程绩效管理，帮助企业建立科学公正的绩效评估与人才发展机制。",
				"descriptionEn": "China-focused performance management specialist covering OKRs, KPIs, 360-degree feedback, calibration sessions, performance improvement plans, and talent development."
			},
			{
				"slug": "hr-recruiter",
				"nameEn": "Full-Cycle Recruiter",
				"emoji": "🎯",
				"division": "hr",
				"description": "深耕中国人才市场的全流程招聘专家，精通 Boss 直聘、猎聘、拉勾等主流招聘渠道运营，擅长简历筛选、面试协调、人才管线管理、校招社招全链路操盘，帮助企业高效精准地完成人才获取与入职闭环。",
				"descriptionEn": "Full-cycle recruiting specialist for the Chinese talent market, covering sourcing channels, resume screening, interview coordination, pipeline management, offers, and onboarding."
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
				"slug": "legal-contract-reviewer",
				"nameEn": "Contract Review Specialist",
				"emoji": "📑",
				"division": "legal",
				"description": "精通中国《民法典》合同编及商业合同实务的法律专家，擅长合同风险识别、条款审查与修改建议，熟悉电子签章、争议解决机制、违约金条款设计，帮助企业在商业交易中有效防控法律风险。",
				"descriptionEn": "China-focused commercial contract specialist covering risk identification, clause review, redlines, electronic signatures, dispute resolution, and liquidated damages."
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
				"slug": "legal-policy-writer",
				"nameEn": "Legal Policy Writer",
				"emoji": "📜",
				"division": "legal",
				"description": "精通中国数据合规法律体系的企业制度文件撰写专家，擅长内部管理制度、隐私政策、用户协议等法律文书起草，深谙《个人信息保护法》《数据安全法》《网络安全法》三法合规要求，帮助企业构建完整的合规制度体系。",
				"descriptionEn": "China-focused legal policy writer for internal policies, privacy notices, terms of service, and compliance under PIPL, the Data Security Law, and the Cybersecurity Law."
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
				"slug": "livestock-archive-auditor",
				"nameEn": "Livestock Records Auditor",
				"emoji": "🐄",
				"division": "specialized",
				"description": "核对畜禽养殖档案 Excel 与生产日报，按子表独立审计兽药、饲料、诊疗、免疫、生产记录等错填漏填，FIFO 复核批号，输出可直接整改的中文问题表述。",
				"descriptionEn": "Audits livestock records and production reports for omissions and inconsistencies across medication, feed, treatment, immunization, production, and FIFO batch tracking."
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
				"slug": "marketing-bilibili-strategist",
				"nameEn": "B站内容策略师",
				"emoji": "📺",
				"division": "marketing",
				"description": "专注B站（哔哩哔哩）平台的中长视频内容策略专家，精通UP主运营、弹幕文化、社区生态、品牌合作、推荐算法，以及通过优质内容实现长期粉丝增长与商业变现。",
				"descriptionEn": ""
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
				"slug": "marketing-daily-news-briefing",
				"nameEn": "新闻情报官",
				"emoji": "📰",
				"division": "marketing",
				"description": "国内外多源新闻实时采集与结构化简报生成，为内容创作团队提供高质量新闻素材。支持按类型（科技/财经/社会/国际等）筛选，交叉验证信源，输出下游 agent 可直接使用的结构化简报。",
				"descriptionEn": ""
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
				"slug": "marketing-ecommerce-operator",
				"nameEn": "电商运营师",
				"emoji": "🛒",
				"division": "marketing",
				"description": "专注中国电商平台全链路运营的策略专家，精通淘宝/天猫/拼多多/京东的店铺运营、商品优化、直播带货、大促策划（618/双十一），以及跨平台差异化运营策略。",
				"descriptionEn": ""
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
				"slug": "marketing-knowledge-commerce-strategist",
				"nameEn": "知识付费产品策划师",
				"emoji": "🎓",
				"division": "marketing",
				"description": "专注中国知识付费生态的产品设计与商业化专家，精通得到、知识星球、小报童、小鹅通、千聊等平台运营，擅长知识产品定义、内容定价策略、用户运营、IP打造、分销体系设计和全链路数据分析。",
				"descriptionEn": ""
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
				"slug": "marketing-wechat-operator",
				"nameEn": "微信公众号运营",
				"emoji": "💬",
				"division": "marketing",
				"description": "专注微信生态的内容运营专家，精通公众号内容策略、社群运营、裂变增长、私域流量搭建和微信小程序运营。",
				"descriptionEn": ""
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
				"slug": "marketing-weixin-channels-strategist",
				"nameEn": "微信视频号运营策略师",
				"emoji": "📹",
				"division": "marketing",
				"description": "专注微信视频号生态的内容策略与增长运营专家，精通社交推荐机制、公众号/朋友圈/小程序/企微生态联动、视频号直播带货、短视频内容策划、私域引流闭环和创作者数据分析。",
				"descriptionEn": ""
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
				"slug": "marketing-xiaohongshu-operator",
				"nameEn": "小红书增长运营专家",
				"emoji": "📕",
				"division": "marketing",
				"description": "专注小红书平台的内容运营专家，擅长种草笔记创作、达人合作策略、爆款内容公式、以及通过数据驱动实现品牌在小红书的高效获客和口碑建设。",
				"descriptionEn": ""
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
				"slug": "prompt-engineer",
				"nameEn": "通用提示词工程师",
				"emoji": "🧠",
				"division": "specialized",
				"description": "专注大语言模型提示词设计与优化的专家，精通系统提示词架构、思维链设计、少样本学习策略、以及提示词效果评测和迭代方法论。",
				"descriptionEn": ""
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
				"slug": "research-synthesist",
				"nameEn": "Research Synthesist",
				"emoji": "🔍",
				"division": "research",
				"description": "Expert in literature review, source evaluation, and evidence synthesis — turns a scattered pile of sources into a structured, honestly-weighted map of what the evidence actually supports",
				"descriptionEn": ""
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
				"slug": "specialized-ai-policy-writer",
				"nameEn": "AI 治理政策专家",
				"emoji": "📜",
				"division": "specialized",
				"description": "面向中国企业和机构的 AI 治理与合规专家，精通《生成式 AI 管理办法》、算法备案制度、深度合成管理规定、大模型安全评估流程及 AI 伦理审查机制，帮助组织构建符合中国监管要求的 AI 治理框架并落地执行。",
				"descriptionEn": ""
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
				"slug": "specialized-master-plan-architect",
				"nameEn": "Master Plan Architect",
				"emoji": "🏛️",
				"division": "specialized",
				"description": "Master planning architect, technical educator, and ruthless plan critic who specializes in deep architectural teaching, Red Teaming / risk critique, and crafting comprehensive Implementation Plans in Markdown with ZERO code execution.",
				"descriptionEn": ""
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
				"slug": "specialized-meeting-assistant",
				"nameEn": "会议效率专家",
				"emoji": "📅",
				"division": "specialized",
				"description": "面向中国企业的会议管理与效率提升专家，精通飞书、钉钉、腾讯会议等协作平台，擅长会议纪要撰写、行动项追踪、议程设计、OKR 周会组织及跨时区会议协调，帮助团队将会议从\"时间黑洞\"变为\"决策引擎\"。",
				"descriptionEn": ""
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
				"slug": "specialized-pricing-optimizer",
				"nameEn": "动态定价策略师",
				"emoji": "💲",
				"division": "specialized",
				"description": "专注电商动态定价与促销策略的价格优化专家，精通淘宝、京东、拼多多等平台的价格机制、大促定价规则、竞品价格监控和利润最大化策略，帮助商家在激烈的价格战中实现利润与销量的最优平衡。",
				"descriptionEn": ""
			},
			{
				"slug": "specialized-risk-assessor",
				"nameEn": "企业风险评估师",
				"emoji": "⚖️",
				"division": "specialized",
				"description": "面向中国企业的全面风险管理专家，精通国企风控体系建设、内控合规（COSO 框架本土化）、审计整改、ESG 风险管理及供应链风险评估，帮助企业构建系统化的风险识别、评估与应对机制，提升组织韧性。",
				"descriptionEn": ""
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
				"slug": "supply-chain-garment-factory-planning-engineer",
				"nameEn": "Garment Factory Planning Engineer",
				"emoji": "🏭",
				"division": "supply-chain",
				"description": "全球多基地服装工厂规划专家——精通牛仔/羽绒服/无痕内衣/针织产线全流程设计，覆盖场地规划、产能测算、设备选型、精益优化与多国合规，支持中文/英文/法语/柬埔寨语",
				"descriptionEn": "Multi-site garment factory planning specialist covering plant layout, capacity modeling, equipment selection, lean optimization, and multinational compliance across major apparel production lines."
			},
			{
				"slug": "supply-chain-inventory-forecaster",
				"nameEn": "Inventory Forecasting Specialist",
				"emoji": "📦",
				"division": "supply-chain",
				"description": "专注需求预测与库存管理的供应链专家，擅长基于历史销售数据和市场趋势的精准需求预测、安全库存计算、补货策略优化，帮助企业在中国电商大促节奏下实现\"不断货、不积压\"的库存平衡。",
				"descriptionEn": "Supply chain specialist for demand forecasting, safety stock, replenishment optimization, and inventory balance under Chinese e-commerce promotion cycles."
			},
			{
				"slug": "supply-chain-route-optimizer",
				"nameEn": "Logistics Route Optimizer",
				"emoji": "🗺️",
				"division": "supply-chain",
				"description": "专注物流配送路线规划与成本优化的供应链专家，精通中国快递物流体系、同城配送网络、冷链运输和跨境物流方案，帮助企业在保障时效的前提下实现物流成本最优。",
				"descriptionEn": "Supply chain specialist for route planning and logistics cost optimization across Chinese parcel networks, local delivery, cold chain, and cross-border shipping."
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
				"slug": "supply-chain-vendor-evaluator",
				"nameEn": "Vendor Evaluation Specialist",
				"emoji": "🔍",
				"division": "supply-chain",
				"description": "专注供应商全生命周期管理的采购策略专家，擅长供应商筛选与评分、验厂审核、质量管理体系搭建、账期与成本谈判，帮助企业在1688等采购平台上建立稳定可靠的供应商体系。",
				"descriptionEn": "Procurement specialist for supplier screening, scoring, factory audits, quality systems, payment terms, cost negotiation, and lifecycle management."
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
				"slug": "support-recruitment-specialist",
				"nameEn": "招聘运营专家",
				"emoji": "🎯",
				"division": "support",
				"description": "专业的招聘运营与人才获取专家，精通中国主流招聘渠道运营、人才评估体系搭建和劳动法合规管理。帮助企业高效吸引、筛选和留住优秀人才，打造有竞争力的雇主品牌。",
				"descriptionEn": ""
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
				"slug": "technical-translator-agent",
				"nameEn": "技术翻译专家",
				"emoji": "🌐",
				"division": "specialized",
				"description": "专注于技术领域的中英文双向翻译，精通编程、AI、云计算等技术术语，确保技术文档的准确性和专业性",
				"descriptionEn": ""
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
				"slug": "testing-embedded-qa-engineer",
				"nameEn": "嵌入式测试工程师",
				"emoji": "🔌",
				"division": "testing",
				"description": "嵌入式系统质量保障专家——精通硬件在环测试（HIL）、固件自动化测试、OTA 回归、EMC/ESD 测试规划、量产测试夹具设计、故障注入与可靠性验证。",
				"descriptionEn": ""
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
				"slug": "travel-planner",
				"nameEn": "旅行规划师",
				"emoji": "🧳",
				"division": "specialized",
				"description": "面向中国旅行者的行程规划专家，精通国内游与出境游的路线设计、交通住宿组合、签证与证件准备、预算控制和旺季避坑——产出可直接照着走的逐日行程，而非景点清单的堆砌。",
				"descriptionEn": ""
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
			"settings.title": "专家库",
			"settings.intro": "选择对话里可以召唤的专家。停用后不会出现在 @ 菜单中。",
			"settings.loading": "正在加载专家…",
			"settings.viewProject": "GitHub",
			"settings.feedback": "问题反馈",
			"settings.enabled": "已启用",
			"settings.disabled": "已停用",
			"settings.filter.category": "分类",
			"settings.filter.all": "全部",
			"settings.filter.option": "{name}（{count}）",
			"settings.filter.showing.one": "显示 {count} 位",
			"settings.filter.showing.other": "显示 {count} 位",
			"settings.search": "搜索",
			"settings.search.placeholder": "搜索专家、职责或领域",
			"settings.search.clear": "清除搜索",
			"settings.viewPrompt": "查看提示词",
			"settings.copyPrompt": "复制提示词",
			"settings.copySuccess": "已复制",
			"settings.promptTitle": "{name} 的提示词",
			"settings.promptClose": "关闭",
			"settings.promptLoading": "正在读取提示词…",
			"error.promptCopy": "无法复制提示词，请检查浏览器剪贴板权限。",
			"settings.empty": "没有匹配的专家。试试其他关键词，或切换到「{all}」。",
			"settings.empty.reset": "清除筛选",
			"error.conflict": "配置已被其他窗口修改。",
			"error.conflict.refreshed": "配置已被其他窗口修改，已为您刷新。",
			"error.conflict.refreshFailed": "配置已被其他窗口修改，但刷新失败，请手动刷新。",
			"error.insertFailed": "未能插入专家标签，请重试。",
			"btn.refresh": "刷新",
			"btn.enable": "启用",
			"btn.disable": "停用",
			"summary.total.one": "位专家",
			"summary.total.other": "位专家",
			"summary.enabled.one": "位已启用",
			"summary.enabled.other": "位已启用",
			"summary.enabledPrefix": "已启用",
			"summary.group": "{count} 个",
			"button.title": "召唤专家",
			"menu.empty": "暂无可召唤的专家。请先在设置里启用。",
			"division.academic": ZH_DIVISION.academic,
			"division.company": ZH_DIVISION.company,
			"division.design": ZH_DIVISION.design,
			"division.engineering": ZH_DIVISION.engineering,
			"division.finance": ZH_DIVISION.finance,
			"division.game-development": ZH_DIVISION["game-development"],
			"division.gis": ZH_DIVISION.gis,
			"division.healthcare": ZH_DIVISION.healthcare,
			"division.hr": ZH_DIVISION.hr,
			"division.legal": ZH_DIVISION.legal,
			"division.marketing": ZH_DIVISION.marketing,
			"division.paid-media": ZH_DIVISION["paid-media"],
			"division.product": ZH_DIVISION.product,
			"division.project-management": ZH_DIVISION["project-management"],
			"division.research": ZH_DIVISION.research,
			"division.sales": ZH_DIVISION.sales,
			"division.security": ZH_DIVISION.security,
			"division.spatial-computing": ZH_DIVISION["spatial-computing"],
			"division.specialized": ZH_DIVISION.specialized,
			"division.support": ZH_DIVISION.support,
			"division.supply-chain": ZH_DIVISION["supply-chain"],
			"division.testing": ZH_DIVISION.testing
		};
		/** 英文词条，key 完整性由 satisfies 在编译期保证。 */
		const en = {
			"settings.nav": "Experts",
			"settings.title": "Expert Library",
			"settings.intro": "Choose which experts can be summoned in chat. Disabled experts stay out of the @ menu.",
			"settings.loading": "Loading experts…",
			"settings.viewProject": "GitHub",
			"settings.feedback": "Issues",
			"settings.enabled": "Enabled",
			"settings.disabled": "Disabled",
			"settings.filter.category": "Category",
			"settings.filter.all": "All",
			"settings.filter.option": "{name} ({count})",
			"settings.filter.showing.one": "Showing {count} expert",
			"settings.filter.showing.other": "Showing {count} experts",
			"settings.search": "Search",
			"settings.search.placeholder": "Search experts, roles, or domains",
			"settings.search.clear": "Clear search",
			"settings.viewPrompt": "View prompt",
			"settings.copyPrompt": "Copy prompt",
			"settings.copySuccess": "Copied",
			"settings.promptTitle": "Prompt for {name}",
			"settings.promptClose": "Close",
			"settings.promptLoading": "Loading prompt…",
			"error.promptCopy": "Could not copy the prompt. Check browser clipboard permissions.",
			"settings.empty": "No matching experts. Try another keyword, or switch to {all}.",
			"settings.empty.reset": "Clear filters",
			"error.conflict": "Settings were changed in another window.",
			"error.conflict.refreshed": "Settings were changed in another window and have been refreshed.",
			"error.conflict.refreshFailed": "Settings were changed in another window, but refresh failed. Please refresh manually.",
			"error.insertFailed": "The expert reference could not be inserted. Please try again.",
			"btn.refresh": "Refresh",
			"btn.enable": "Enable",
			"btn.disable": "Disable",
			"summary.total.one": "expert",
			"summary.total.other": "experts",
			"summary.enabled.one": "enabled",
			"summary.enabled.other": "enabled",
			"summary.enabledPrefix": "Enabled",
			"summary.group": "{count} items",
			"button.title": "Summon expert",
			"menu.empty": "No experts available yet. Enable some in Settings first.",
			"division.academic": EN_DIVISION.academic,
			"division.company": EN_DIVISION.company,
			"division.design": EN_DIVISION.design,
			"division.engineering": EN_DIVISION.engineering,
			"division.finance": EN_DIVISION.finance,
			"division.game-development": EN_DIVISION["game-development"],
			"division.gis": EN_DIVISION.gis,
			"division.healthcare": EN_DIVISION.healthcare,
			"division.hr": EN_DIVISION.hr,
			"division.legal": EN_DIVISION.legal,
			"division.marketing": EN_DIVISION.marketing,
			"division.paid-media": EN_DIVISION["paid-media"],
			"division.product": EN_DIVISION.product,
			"division.project-management": EN_DIVISION["project-management"],
			"division.research": EN_DIVISION.research,
			"division.sales": EN_DIVISION.sales,
			"division.security": EN_DIVISION.security,
			"division.spatial-computing": EN_DIVISION["spatial-computing"],
			"division.specialized": EN_DIVISION.specialized,
			"division.support": EN_DIVISION.support,
			"division.supply-chain": EN_DIVISION["supply-chain"],
			"division.testing": EN_DIVISION.testing
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
		const expertPromptSchema = object({ prompt: string() });
		//#endregion
		//#region src/client/remote.ts
		const TYPERT_REMOTE = {
			package: "@michengai/dsh-agency-agents",
			descriptors: [
				{
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
				},
				{
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
				},
				{
					id: "@michengai/dsh-agency-agents#agencyAgents/getPrompt",
					service: "agencyAgents",
					namespace: "agencyAgents",
					method: "getPrompt",
					invocation: { kind: "direct" },
					parameters: [{
						name: "slug",
						wire: "slug",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "string",
							schema: string().min(1).max(128)
						}
					}, {
						name: "division",
						wire: "division",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "string",
							schema: string().min(1).max(64)
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "AgencyAgentsPrompt",
						schema: expertPromptSchema
					}
				}
			]
		};
		//#endregion
		//#region src/client/index.ts
		const PLUGIN_ID = "@michengai/dsh-agency-agents";
		/** 本插件客户端词条字典命名空间。 */
		const NS = "agency";
		const COPY_PROMPT_FEEDBACK_MS = 1600;
		function lineIcon(props, ...children) {
			const { size = 24, strokeWidth = 2, ...rest } = props;
			return react.default.createElement("svg", {
				...rest,
				viewBox: "0 0 24 24",
				width: size,
				height: size,
				fill: "none",
				stroke: "currentColor",
				strokeWidth,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				focusable: false
			}, ...children);
		}
		function Copy(props) {
			return lineIcon(props, react.default.createElement("rect", {
				x: 9,
				y: 9,
				width: 13,
				height: 13,
				rx: 2
			}), react.default.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }));
		}
		function Eye(props) {
			return lineIcon(props, react.default.createElement("path", { d: "M2.06 12a10.7 10.7 0 0 1 19.88 0 10.7 10.7 0 0 1-19.88 0" }), react.default.createElement("circle", {
				cx: 12,
				cy: 12,
				r: 3
			}));
		}
		function RefreshCw(props) {
			return lineIcon(props, react.default.createElement("path", { d: "M21 12a9 9 0 0 0-15.17-6.53L3 8" }), react.default.createElement("path", { d: "M3 3v5h5" }), react.default.createElement("path", { d: "M3 12a9 9 0 0 0 15.17 6.53L21 16" }), react.default.createElement("path", { d: "M16 16h5v5" }));
		}
		function Search(props) {
			return lineIcon(props, react.default.createElement("circle", {
				cx: 11,
				cy: 11,
				r: 8
			}), react.default.createElement("path", { d: "m21 21-4.3-4.3" }));
		}
		function X(props) {
			return lineIcon(props, react.default.createElement("path", { d: "M18 6 6 18" }), react.default.createElement("path", { d: "m6 6 12 12" }));
		}
		/** 设置页标题旁的公开项目入口，和归档管理器保持一致。 */
		const SETTINGS_GITHUB_LINKS = [{
			href: "https://github.com/MichengAI/dsh-agency-agents",
			labelKey: "settings.viewProject",
			icon: "github"
		}, {
			href: "https://github.com/MichengAI/dsh-agency-agents/issues",
			labelKey: "settings.feedback",
			icon: "feedback"
		}];
		const DIVISION_ORDER = [
			"company",
			"design",
			"engineering",
			"finance",
			"game-development",
			"gis",
			"healthcare",
			"hr",
			"legal",
			"marketing",
			"paid-media",
			"product",
			"project-management",
			"research",
			"sales",
			"security",
			"spatial-computing",
			"specialized",
			"support",
			"testing",
			"supply-chain",
			"academic"
		];
		/** 头像只按视觉领域分池，设置页筛选始终使用完整的 22 个原始分区。 */
		const AVATAR_CATEGORY_DIVISIONS = {
			development: /* @__PURE__ */ new Set([
				"engineering",
				"game-development",
				"gis",
				"security",
				"spatial-computing",
				"testing"
			]),
			design: /* @__PURE__ */ new Set(["design"]),
			product: /* @__PURE__ */ new Set([
				"company",
				"hr",
				"product",
				"project-management",
				"sales",
				"supply-chain",
				"support"
			]),
			research: /* @__PURE__ */ new Set([
				"academic",
				"finance",
				"healthcare",
				"legal",
				"research"
			]),
			writing: /* @__PURE__ */ new Set([
				"marketing",
				"paid-media",
				"specialized"
			])
		};
		const EXPERTS = ROSTER.map((e) => ({
			slug: e.slug,
			name: ZH_NAME[e.slug] ?? e.nameEn,
			nameEn: e.nameEn,
			emoji: e.emoji,
			division: e.division,
			divisionZh: ZH_DIVISION[e.division] ?? e.division,
			divisionEn: EN_DIVISION[e.division] ?? e.division,
			description: e.description,
			descriptionEn: e.descriptionEn
		})).sort((a, b) => a.division.localeCompare(b.division) || a.slug.localeCompare(b.slug));
		/** 按当前语言比较专家显示名，供设置页和菜单分组排序。 */
		function compareExpertName(a, b, active) {
			const left = active === "en" ? a.nameEn : a.name;
			const right = active === "en" ? b.nameEn : b.name;
			return left.localeCompare(right, active === "en" ? "en" : "zh");
		}
		function groupByDivision(list, active) {
			const groups = /* @__PURE__ */ new Map();
			for (const e of list) {
				const arr = groups.get(e.division) ?? [];
				arr.push(e);
				groups.set(e.division, arr);
			}
			return DIVISION_ORDER.filter((d) => groups.has(d)).map((d) => ({
				division: d,
				divisionZh: ZH_DIVISION[d] ?? d,
				experts: (groups.get(d) ?? []).slice().sort((a, b) => compareExpertName(a, b, active))
			}));
		}
		/** 规范化检索词：兼容全角字符，合并空白并转小写，便于中英文统一匹配。 */
		function normalizeExpertQuery(query) {
			return query.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();
		}
		/** 按标识、名称、分区或简介做多关键词包含匹配；空检索视为全部命中。 */
		function matchExpertQuery(expert, query) {
			const q = normalizeExpertQuery(query);
			if (q === "") return true;
			const fields = [
				expert.slug,
				expert.name,
				expert.nameEn,
				expert.division,
				expert.divisionZh,
				expert.divisionEn,
				expert.description,
				expert.descriptionEn
			].map(normalizeExpertQuery);
			return q.split(" ").every((term) => fields.some((field) => field.includes(term)));
		}
		/** 先按分区收窄，再按检索词过滤。division 为空表示全部分类。 */
		function filterExperts(list, options) {
			const division = options.division ?? "";
			return list.filter((expert) => (division === "" || expert.division === division) && matchExpertQuery(expert, options.query ?? ""));
		}
		/** 设置页分类筛选值：空值表示全部，其余完整保留所有原始分区。 */
		function expertDivisionFilterValues() {
			return ["", ...DIVISION_ORDER];
		}
		/** 将已启用专家稳定地移到前面，两组内部顺序不变且不修改输入数组。 */
		function sortExpertsByEnabled(list, enabled) {
			const active = [];
			const inactive = [];
			for (const expert of list) if (enabled.has(expert.slug)) active.push(expert);
			else inactive.push(expert);
			return [...active, ...inactive];
		}
		const DIVISION_COUNTS = Object.fromEntries(DIVISION_ORDER.map((division) => [division, EXPERTS.filter((expert) => expert.division === division).length]));
		/** 根据 slug 稳定分配复用头像；空头像池安全回退为第 0 项。 */
		function expertAvatarIndex(slug, avatarCount) {
			if (avatarCount <= 0) return 0;
			let hash = 2166136261;
			for (let index = 0; index < slug.length; index += 1) hash = Math.imul(hash ^ slug.charCodeAt(index), 16777619);
			return (hash >>> 0) % avatarCount;
		}
		/** 五大业务分类各自使用独立头像池，降低同屏重复并保持专家形象稳定。 */
		const EXPERT_AVATAR_POOL_INDEXES = {
			development: [
				1,
				5,
				9,
				10,
				11,
				12,
				13,
				14,
				15,
				16,
				17,
				18
			],
			writing: [
				3,
				7,
				19,
				20,
				21,
				22,
				23,
				24
			],
			product: [
				0,
				8,
				25,
				26,
				27,
				28
			],
			research: [
				2,
				4,
				29,
				30,
				31,
				32
			],
			design: [
				6,
				33,
				34,
				35
			]
		};
		const ALL_EXPERT_AVATAR_INDEXES = Object.values(EXPERT_AVATAR_POOL_INDEXES).flat();
		function expertCategoryForDivision(division) {
			return Object.entries(AVATAR_CATEGORY_DIVISIONS).find(([, divisions]) => divisions.has(division))?.[0];
		}
		function expertAvatarKey(slug, division) {
			return `${division}\u0000${slug}`;
		}
		/**
		* 对当前花名册做分类内轮转分配，确保全部头像都被使用，且复用次数差不超过 1。
		* 排序和映射只在模块加载时计算一次，不增加卡片渲染开销。
		*/
		const EXPERT_AVATAR_INDEX_BY_KEY = /* @__PURE__ */ new Map();
		for (const [category, pool] of Object.entries(EXPERT_AVATAR_POOL_INDEXES)) EXPERTS.filter((expert) => AVATAR_CATEGORY_DIVISIONS[category].has(expert.division)).slice().sort((left, right) => left.slug.localeCompare(right.slug, "en")).forEach((expert, index) => {
			EXPERT_AVATAR_INDEX_BY_KEY.set(expertAvatarKey(expert.slug, expert.division), pool[index % pool.length] ?? 0);
		});
		/** 当前花名册使用均衡映射；未知专家或分区安全回退为稳定哈希。 */
		function expertAvatarIndexForDivision(slug, division) {
			const mapped = EXPERT_AVATAR_INDEX_BY_KEY.get(expertAvatarKey(slug, division));
			if (mapped !== void 0) return mapped;
			const category = expertCategoryForDivision(division);
			const pool = category === void 0 ? ALL_EXPERT_AVATAR_INDEXES : EXPERT_AVATAR_POOL_INDEXES[category];
			return pool[expertAvatarIndex(slug, pool.length)] ?? 0;
		}
		/** 按当前 locale 取专家显示名：en 用花名册英文名，其余用中文名。 */
		function displayName(e, active) {
			return active === "en" ? e.nameEn : e.name;
		}
		/** 把 emoji 放进宿主稳定渲染的名称节点，避免依赖可能丢失文本的独立图标槽。 */
		function inputTriggerCandidateName(expert, active) {
			const name = active === "en" ? expert.nameEn : expert.name;
			return expert.emoji === "" ? name : `${expert.emoji} ${name}`;
		}
		/** 选中候选后按内部标识还原纯专家名，防止展示用 emoji 进入召唤标签。 */
		function inputTriggerPickName(slug, fallbackName, active) {
			const expert = EXPERTS.find((item) => item.slug === slug);
			return expert === void 0 ? fallbackName : displayName(expert, active);
		}
		/** 统一生成宿主可识别的专家提及文本，避免重复 @ 或将展示 emoji 写入草稿。 */
		function formatExpertMention(name) {
			return `@${name.trim().replace(/^@+/, "")}`;
		}
		/** 使用不换行空格分隔专家引用，避免消息渲染层折叠相邻 chip 的普通空格。 */
		function formatExpertMentionInsertion(name) {
			return `${formatExpertMention(name)}\u00A0`;
		}
		/** 仅公开已启用专家的本地化名称，供宿主扫描并装饰 @名称 纯文本引用。 */
		function buildExpertMentionLexicon(experts, enabled, active) {
			return experts.filter((expert) => enabled.has(expert.slug)).map((expert) => active === "en" ? expert.nameEn : expert.name);
		}
		/** 按当前 locale 取 @ 菜单分组标题；未知分区保留原值，便于扩展来源安全降级。 */
		function inputTriggerSourceName(division, active) {
			return (active === "en" ? EN_DIVISION : ZH_DIVISION)[division] ?? division;
		}
		/** 引用所有者必须跨语言稳定，避免草稿中的 chip 在切换界面语言后失去序列化器。 */
		function inputTriggerSourceId(division) {
			return `${PLUGIN_ID}:${division}`;
		}
		/** 将专家投影为宿主的原子引用；slug 仅作为内部 ref，不进入标签、剪贴板或模型文本。 */
		function buildExpertReference(expert, active) {
			const name = active === "en" ? expert.nameEn : expert.name;
			return {
				source: inputTriggerSourceId(expert.division),
				ref: expert.slug,
				label: name,
				appearance: "session",
				clipboardText: formatExpertMentionInsertion(name)
			};
		}
		/** 名册更新后仍可发送旧草稿，但不向用户或模型泄露已失效的内部标识。 */
		function expertMentionFromReference(slug, active) {
			const expert = EXPERTS.find((item) => item.slug === slug);
			if (expert === void 0) return active === "en" ? "@Removed expert (please reselect)\xA0" : "@已移除专家（请重新选择）\xA0";
			return formatExpertMentionInsertion(displayName(expert, active));
		}
		/** 按当前 locale 取专家简介：en 用原始英文描述（缺失时回退中文），其余用中文描述。 */
		function displayDescription(e, active) {
			return active === "en" && e.descriptionEn !== "" ? e.descriptionEn : e.description;
		}
		const MENU_NAME_OVERRIDE = DIVISION_ORDER.map((division) => inputTriggerSourceId(division)).map((name) => `[role="listbox"] div[data-source=${JSON.stringify(name)}] ~ button`).map((selector) => `${selector} span:last-child`).join(",");
		/** Windows 优先使用彩色 emoji 字体，名称中的普通文字由后续字体安全回退。 */
		const EXPERT_MENU_NAME_STYLE = "flex:1 1 auto;max-width:none;min-width:0;font-family:\"Segoe UI Emoji\",\"Apple Color Emoji\",\"Noto Color Emoji\",sans-serif!important;font-variant-emoji:emoji!important";
		const COMPOSER_CSS = ".aag-btn-wrap{position:relative;order:1;margin-right:-8px}.aag-btn{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;font-weight:500;cursor:pointer}.aag-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aag-menu{position:absolute;bottom:calc(100% + 4px);left:0;box-sizing:border-box;padding:4px;display:flex;flex-direction:column;gap:0;width:300px;max-width:360px;max-height:calc(100vh - 24px);overflow-y:auto;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);z-index:10000}.aag-menu-title{padding:8px 10px;font-size:12px;line-height:16px;color:var(--dsw-alias-label-tertiary)}.aag-menu-item{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;padding:8px 10px;border:none;border-radius:10px;background:transparent;cursor:pointer;text-align:left;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);box-sizing:border-box}.aag-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover)}.aag-emoji{flex:0 0 auto;font-size:16px}.aag-menu-empty{padding:8px 10px;color:var(--dsw-alias-label-secondary);font-size:13px}[data-composer-card] :has(> button[aria-haspopup=\"listbox\"]) > :nth-child(2){order:2}";
		const SETTINGS_CSS = `
.aag-section{box-sizing:border-box;display:flex;min-width:0;max-width:760px;width:100%;margin:0 auto;flex-direction:column;gap:16px;padding:0 0 32px;color:var(--dsw-alias-label-primary)}
.aag-toolbar{display:flex;align-items:flex-start;gap:16px;padding-bottom:12px}
.aag-title-row{display:flex;align-items:center;gap:8px;min-width:0}.aag-settings-links{display:flex;align-items:center;gap:4px}.aag-settings-link{display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500;line-height:18px;text-decoration:none;white-space:nowrap}.aag-settings-link:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aag-settings-link:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}.aag-settings-link svg{flex:none}
.aag-title{margin:0;font-size:20px;line-height:28px;font-weight:650;letter-spacing:-.2px}
.aag-desc{margin:4px 0 0;max-width:42em;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}
.aag-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.aag-action{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 12px;border:1px solid transparent;border-radius:8px;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:13px;font-weight:550;cursor:pointer;transition:opacity 180ms ease,background 180ms ease,border-color 180ms ease}
.aag-action:hover:not(:disabled){opacity:.9}.aag-action:disabled{opacity:.5;cursor:default}
.aag-action-secondary{background:transparent;border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.aag-action:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-note{overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;text-overflow:ellipsis;white-space:nowrap}
.aag-error{color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}
.aag-filters{display:flex;align-items:flex-end;gap:10px}
.aag-field{display:flex;min-width:0;flex:1;flex-direction:column;gap:6px}
.aag-field-category{flex:0 1 220px}
.aag-field-search{flex:1 1 240px}
.aag-label{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px}
.aag-control{box-sizing:border-box;width:100%;min-height:32px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.aag-control:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-select{position:relative}
.aag-select-trigger{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:32px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.aag-select-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}
.aag-select-trigger:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-select-trigger[aria-expanded="true"]{border-color:var(--dsw-alias-state-success-primary)}
.aag-select-value{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aag-select-caret{flex:none;width:12px;height:12px;color:var(--dsw-alias-label-tertiary)}
.aag-select-menu{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:30;box-sizing:border-box;max-height:280px;overflow:auto;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2));box-shadow:var(--dsw-shadow-lv3)}
.aag-select-option{box-sizing:border-box;display:flex;align-items:center;width:100%;min-height:32px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.aag-select-option:hover,.aag-select-option[data-active="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.aag-select-option[aria-selected="true"]{color:var(--dsw-alias-state-success-primary)}
.aag-search-wrap{position:relative;display:flex;align-items:center}
.aag-search{padding-right:32px}.aag-search::-webkit-search-cancel-button,.aag-search::-webkit-search-decoration{-webkit-appearance:none;appearance:none}
.aag-search-clear{position:absolute;right:4px;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:16px;line-height:1;cursor:pointer}
.aag-search-clear:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.aag-search-clear:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-empty{display:flex;flex-direction:column;align-items:center;gap:12px;padding:28px 16px;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;text-align:center}
@media (max-width:560px){.aag-toolbar,.aag-title-row{flex-wrap:wrap}.aag-actions{margin-left:0}.aag-filters{flex-direction:column;align-items:stretch}.aag-field-category,.aag-field-search{flex:none}}
@media (prefers-reduced-motion:reduce){.aag-action{transition:none}}
`;
		const CARD_SETTINGS_CSS = `
.aag-section{container-type:inline-size}
.aag-toolbar{display:flex;align-items:center;gap:16px;min-height:44px;padding:0}
.aag-title-row{display:flex;align-items:baseline;gap:16px;min-width:0;flex-wrap:wrap}
.aag-title{font-size:22px;line-height:30px;font-weight:700;letter-spacing:0}
.aag-header-stat{display:inline-flex;align-items:baseline;gap:5px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;white-space:nowrap}
.aag-header-stat strong{color:var(--dsw-alias-label-primary);font-weight:500}
.aag-actions{margin-left:auto}
.aag-refresh-button{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:transparent;color:var(--dsw-alias-label-primary);cursor:pointer}
.aag-refresh-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.aag-refresh-button:disabled{opacity:.5;cursor:default}
.aag-refresh-button:focus-visible,.aag-card-action:focus-visible,.aag-switch-input:focus-visible+.aag-switch-track,.aag-modal-close:focus-visible,.aag-search:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-card-filters{align-items:flex-end;gap:12px}
.aag-card-filters .aag-field-category,.aag-card-filters .aag-field-search{flex:1 1 0}
.aag-card-filters .aag-select-trigger{min-height:46px}
.aag-search-wrap{position:relative;display:flex;align-items:center}
.aag-search-icon{position:absolute;left:14px;z-index:1;color:var(--dsw-alias-label-secondary);pointer-events:none}
.aag-search{height:46px;padding:0 46px;border-color:var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);font-size:14px;line-height:22px}
.aag-search::placeholder{color:var(--dsw-alias-label-tertiary)}
.aag-search-clear{right:2px;width:44px;height:44px}
.aag-expert-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px;margin-top:2px}
.aag-expert-card{display:grid;min-width:0;min-height:190px;overflow:hidden;grid-template-rows:minmax(141px,1fr) 48px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-2)}
.aag-expert-card:hover{border-color:var(--dsw-alias-border-l3)}
.aag-card-body{position:relative;display:grid;min-width:0;grid-template-columns:44px minmax(0,1fr);column-gap:10px;row-gap:9px;padding:12px}
.aag-expert-avatar{display:block;width:44px;height:44px;border:0;border-radius:50%;background:var(--dsw-alias-bg-layer-3);object-fit:cover;object-position:center 20%}
.aag-card-identity{display:flex;min-width:0;flex-direction:column;padding-right:48px}
.aag-card-name{display:-webkit-box;overflow:hidden;font-size:16px;font-weight:650;line-height:22px;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.aag-card-division{margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px}
.aag-card-description{grid-column:1/-1;display:-webkit-box;min-height:60px;margin:0;overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:20px;-webkit-box-orient:vertical;-webkit-line-clamp:3}
.aag-card-actions{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--dsw-alias-border-l2)}
.aag-card-action{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:0;min-height:48px;padding:0 10px;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:14px;line-height:20px;cursor:pointer}
.aag-card-action+.aag-card-action{border-left:1px solid var(--dsw-alias-border-l2)}
.aag-card-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.aag-card-action:disabled{opacity:.5;cursor:default}
.aag-card-action-primary{color:var(--dsw-alias-label-secondary)}
.aag-switch{position:absolute;top:12px;right:12px;display:flex;align-items:center;flex-direction:column;gap:3px;cursor:pointer}
.aag-switch-input{position:absolute;width:1px;height:1px;opacity:0}
.aag-switch-track{position:relative;display:block;width:42px;height:24px;border:1px solid var(--dsw-alias-border-l3);border-radius:12px;background:var(--dsw-alias-bg-layer-3);transition:background 160ms ease,border-color 160ms ease}
.aag-switch-track::after{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-secondary);content:"";transition:transform 160ms ease,background 160ms ease}
.aag-switch-input:checked+.aag-switch-track{border-color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 32%,transparent)}
.aag-switch-input:checked+.aag-switch-track::after{transform:translateX(18px);background:var(--dsw-alias-label-primary)}
.aag-switch-input:disabled+.aag-switch-track{opacity:.5;cursor:default}
.aag-switch-state{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;white-space:nowrap}
.aag-prompt-backdrop{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.56)}
.aag-prompt-modal{display:flex;box-sizing:border-box;width:min(760px,100%);max-height:min(720px,calc(100vh - 40px));flex-direction:column;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2));box-shadow:var(--dsw-shadow-lv3)}
.aag-modal-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.aag-modal-title{margin:0;font-size:15px;line-height:22px}
.aag-modal-close{min-height:32px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}
.aag-prompt-content{margin:0;overflow:auto;padding:16px;white-space:pre-wrap;color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:1.65}
@container (max-width:519px){.aag-expert-grid{grid-template-columns:1fr}.aag-title-row{gap:8px 12px}.aag-title{width:100%}}
@container (max-width:430px){.aag-card-body{grid-template-columns:40px minmax(0,1fr);column-gap:10px}.aag-expert-avatar{width:40px;height:40px}.aag-card-name{font-size:16px;line-height:22px}}
@media (prefers-reduced-motion:reduce){.aag-switch-track,.aag-switch-track::after{transition:none}}
`;
		const CSS = COMPOSER_CSS + SETTINGS_CSS + CARD_SETTINGS_CSS + MENU_NAME_OVERRIDE + `{${EXPERT_MENU_NAME_STYLE}}`;
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
		async function readPrompt(remote, slug, division) {
			const result = await remote.getPrompt(slug, division);
			if (!result.ok) throw new Error(result.error.message);
			return result.value.prompt;
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
		/** GitHub 品牌标识未由宿主图标库提供，内联以保持离线可用和主题适配。 */
		function githubMark16() {
			return react.default.createElement("svg", {
				viewBox: "0 0 16 16",
				width: 16,
				height: 16,
				"aria-hidden": true,
				focusable: false
			}, react.default.createElement("path", {
				fill: "currentColor",
				d: "M8 0a8 8 0 0 0-2.53 15.59c.4.074.547-.173.547-.385 0-.19-.007-.693-.01-1.36-2.226.484-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.726-.496.055-.486.055-.486.803.056 1.225.824 1.225.824.714 1.223 1.872.87 2.328.665.072-.517.28-.87.508-1.07-1.777-.202-3.645-.888-3.645-3.956 0-.874.31-1.588.823-2.148-.083-.202-.357-1.017.078-2.12 0 0 .672-.215 2.2.82A7.65 7.65 0 0 1 8 4.8c.68.003 1.365.092 2.004.27 1.527-1.035 2.197-.82 2.197-.82.437 1.103.162 1.918.08 2.12.513.56.822 1.274.822 2.148 0 3.076-1.872 3.752-3.654 3.95.288.248.544.735.544 1.482 0 1.07-.01 1.932-.01 2.195 0 .214.144.463.55.384A8.001 8.001 0 0 0 8 0Z"
			}));
		}
		/** 与归档插件的 IconListPenOutline16 保持相同的矢量路径，避免引入整包 CSS。 */
		function feedbackMark16() {
			return react.default.createElement("svg", {
				viewBox: "0 0 16 16",
				width: 16,
				height: 16,
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": true,
				focusable: false
			}, react.default.createElement("path", {
				d: "M10.8239 3.54733V4.78443H4.63437V3.54733H10.8239Z",
				fill: "currentColor"
			}), react.default.createElement("path", {
				d: "M10.8239 6.12629V7.36338H4.63437V6.12629H10.8239Z",
				fill: "currentColor"
			}), react.default.createElement("path", {
				d: "M9.073 8.70524V9.94234H4.63437V8.70524H9.073Z",
				fill: "currentColor"
			}), react.default.createElement("path", {
				d: "M9.13321 0.573526C10.0076 0.573525 10.7179 0.572522 11.285 0.63397C11.8645 0.696791 12.3743 0.831648 12.8193 1.1548C13.0776 1.34246 13.3056 1.57047 13.4933 1.82875C13.8164 2.2737 13.9513 2.7836 14.0141 3.36303C14.0755 3.93015 14.0745 4.64049 14.0745 5.51485V6.1757L12.7327 7.5629V5.51485C12.7327 4.61092 12.732 3.9862 12.6803 3.5081C12.6298 3.0427 12.5379 2.79497 12.4083 2.61654C12.3033 2.47211 12.176 2.34472 12.0315 2.23977C11.8531 2.11016 11.6054 2.01823 11.14 1.96777C10.6618 1.91601 10.0372 1.91539 9.13321 1.91539H6.32658C5.42262 1.91539 4.79796 1.91604 4.31983 1.96777C3.85451 2.01819 3.60672 2.11029 3.42827 2.23977C3.28392 2.34465 3.15643 2.47223 3.0515 2.61654C2.9219 2.79496 2.82997 3.04274 2.7795 3.5081C2.72774 3.9862 2.72712 4.61092 2.72712 5.51485V10.023C2.72712 10.9273 2.72773 11.5525 2.7795 12.0307C2.82992 12.4959 2.92205 12.7429 3.0515 12.9213C3.15645 13.0657 3.28384 13.1931 3.42827 13.2981C3.60676 13.4277 3.85408 13.5206 4.31983 13.5711C4.79797 13.6228 5.42259 13.6234 6.32658 13.6234H6.87057L5.57707 14.9593C5.03527 14.9556 4.57031 14.9467 4.17476 14.9039C3.59508 14.841 3.08558 14.7063 2.64048 14.383C2.38215 14.1953 2.15422 13.9684 1.96653 13.7101C1.64319 13.2649 1.50851 12.7546 1.4457 12.1748C1.38432 11.6076 1.38525 10.8974 1.38525 10.023V5.51485C1.38525 4.64049 1.38426 3.93015 1.4457 3.36303C1.50853 2.78363 1.64341 2.27368 1.96653 1.82875C2.15417 1.57059 2.38228 1.34239 2.64048 1.1548C3.08544 0.831805 3.59533 0.696762 4.17476 0.63397C4.74193 0.572552 5.45218 0.573525 6.32658 0.573526H9.13321Z",
				fill: "currentColor"
			}), react.default.createElement("path", {
				d: "M14.2193 14.9553H10.0124L11.3744 13.6134H14.2193V14.9553Z",
				fill: "currentColor"
			}), react.default.createElement("path", {
				d: "M8.24493 13.3711L7.49015 14.8806C7.40148 15.058 7.58961 15.2461 7.76695 15.1574L9.27651 14.4027L14.6147 9.09934L13.5832 8.06775L8.24493 13.3711Z",
				fill: "currentColor"
			}));
		}
		function settingsGithubLinks(t) {
			return react.default.createElement("div", { className: "aag-settings-links" }, SETTINGS_GITHUB_LINKS.map((link) => react.default.createElement("a", {
				key: link.href,
				className: "aag-settings-link",
				href: link.href,
				target: "_blank",
				rel: "noreferrer",
				"aria-label": t(link.labelKey)
			}, link.icon === "github" ? githubMark16() : feedbackMark16(), t(link.labelKey))));
		}
		/** 工具栏菜单不能接管焦点，否则 Lexical 无法按检测坐标插入原子引用。 */
		function keepComposerFocus(event) {
			event.preventDefault();
		}
		function menuItem(e, pick, getActive) {
			return react.default.createElement("button", {
				key: e.slug,
				type: "button",
				className: "aag-menu-item",
				onMouseDown: (ev) => {
					keepComposerFocus(ev);
					pick(e.slug);
				}
			}, react.default.createElement("span", { className: "aag-emoji" }, e.emoji), react.default.createElement("span", null, displayName(e, getActive())));
		}
		function menuGroup(g, pick, t, getActive) {
			return react.default.createElement("div", { key: g.division }, react.default.createElement("div", { className: "aag-menu-title" }, t(`division.${g.division}`)), g.experts.map((e) => menuItem(e, pick, getActive)));
		}
		/** 没有可召唤专家时打开设置页，否则打开本地菜单。 */
		function resolveExpertToolbarClick(enabledCount) {
			return enabledCount === 0 ? "settings" : "menu";
		}
		const SETTINGS_TRIGGER_LABELS = /* @__PURE__ */ new Set(["设置", "Settings"]);
		const COMPOSER_TRIGGER_SCOPE = "[data-composer-card], .aag-btn-wrap";
		function isSettingsTriggerLabel(label) {
			return SETTINGS_TRIGGER_LABELS.has(label.trim());
		}
		/** 只认明确的设置按钮；输入区里的「+」和其他弹窗一律排除。 */
		function pickHostSettingsTrigger(candidates) {
			const labeled = candidates.filter((item) => !item.inComposer && isSettingsTriggerLabel(item.label));
			if (labeled.length === 1) return labeled[0];
			if (labeled.length > 1) return void 0;
			const dialogs = candidates.filter((item) => !item.inComposer && item.hasDialogPopup);
			return dialogs.length === 1 ? dialogs[0] : void 0;
		}
		function buttonAccessibleLabel(button) {
			return (button.getAttribute("aria-label") ?? button.textContent ?? "").trim();
		}
		function collectSettingsTriggerCandidates(root) {
			const result = [];
			for (const node of root.querySelectorAll("button")) {
				if (!(node instanceof HTMLElement)) continue;
				result.push({
					button: node,
					label: buttonAccessibleLabel(node),
					inComposer: node.closest(COMPOSER_TRIGGER_SCOPE) !== null,
					hasDialogPopup: node.getAttribute("aria-haspopup") === "dialog"
				});
			}
			return result;
		}
		function findHostSettingsTrigger(root) {
			return pickHostSettingsTrigger(collectSettingsTriggerCandidates(root))?.button;
		}
		function findExpertSettingsNavButton(root, navLabel) {
			for (const dialog of root.querySelectorAll("[role=\"dialog\"]")) for (const button of dialog.querySelectorAll("nav button")) if (button instanceof HTMLElement && (button.textContent ?? "").trim() === navLabel) return button;
		}
		function queueSettingsNav(work) {
			if (typeof requestAnimationFrame === "function") {
				requestAnimationFrame(() => {
					requestAnimationFrame(work);
				});
				return;
			}
			work();
		}
		/** 打开宿主设置并选中专家分区；找不到唯一设置入口时返回 false，由调用方回退到本地菜单。 */
		function openAgentSettings(navLabel, root = document, schedule = queueSettingsNav) {
			const existing = findExpertSettingsNavButton(root, navLabel);
			if (existing !== void 0) {
				existing.click();
				return true;
			}
			const trigger = findHostSettingsTrigger(root);
			if (trigger === void 0) return false;
			trigger.click();
			schedule(() => {
				findExpertSettingsNavButton(root, navLabel)?.click();
			});
			return true;
		}
		function resolveReferenceInsertionTarget(sessions, sessionId, getConversation) {
			const targetSessionId = sessionId ?? sessions.list?.getSnapshot().current;
			if (targetSessionId === void 0) return void 0;
			const actx = sessions.scope?.(targetSessionId) ?? sessions.binding?.(targetSessionId)?.ctx;
			return actx === void 0 ? void 0 : getConversation?.(actx)?.input.for(actx);
		}
		/** 返回草稿开头原生引用前缀的末端，避免来源字段差异使连续 chip 漏算。 */
		function expertReferencePrefixEnd(snapshot) {
			const expertOffsets = new Set((snapshot.occurrences ?? []).map((occurrence) => occurrence.offset));
			let end = 0;
			while (expertOffsets.has(end)) {
				end += 1;
				if (snapshot.draft[end] === " ") end += 1;
			}
			while (snapshot.draft[end] === "￼") {
				end += 1;
				if (snapshot.draft[end] === " ") end += 1;
			}
			return end;
		}
		/** 通过当前会话的输入机插入 chip；新增专家始终追加在已有专家之后。 */
		function insertExpertReference(target, reference) {
			if (target === void 0) return false;
			const snapshot = target.state.getSnapshot();
			const offset = expertReferencePrefixEnd(snapshot);
			return target.insertReference(reference, {
				start: offset,
				end: offset,
				draftRev: snapshot.draftRev
			});
		}
		/** 工具栏只能写入原生 chip；返回 false 供界面保留菜单并提示失败原因。 */
		function insertSelectedExpert(slug, active, insertReference) {
			const expert = EXPERTS.find((item) => item.slug === slug);
			return expert !== void 0 && insertReference?.(buildExpertReference(expert, active)) === true;
		}
		function AgentsButton(props) {
			const [open, setOpen] = react.default.useState(false);
			const [enabled, setEnabled] = react.default.useState(/* @__PURE__ */ new Set());
			const [insertError, setInsertError] = react.default.useState(null);
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
					props.onEnabledChange?.(current.enabled);
					if (resolveExpertToolbarClick(current.enabled.size) === "settings") {
						if (openAgentSettings(props.t("settings.nav"))) {
							setOpen(false);
							return;
						}
					}
					setInsertError(null);
					setOpen((prev) => !prev);
				}).catch(() => {
					setOpen((prev) => !prev);
				});
			};
			const pick = (slug) => {
				if (!insertSelectedExpert(slug, props.getActive(), props.insertReference)) {
					setInsertError(props.t("error.insertFailed"));
					return;
				}
				setInsertError(null);
				setOpen(false);
			};
			const groups = groupByDivision(EXPERTS.filter((e) => enabled.has(e.slug)), props.getActive());
			const menu = open ? react.default.createElement("div", { className: "aag-menu" }, insertError === null ? null : react.default.createElement("div", {
				className: "aag-error",
				role: "alert"
			}, insertError), groups.length === 0 ? react.default.createElement("div", { className: "aag-menu-empty" }, props.t("menu.empty")) : groups.map((g) => menuGroup(g, pick, props.t, props.getActive))) : null;
			return react.default.createElement("div", { className: "aag-btn-wrap" }, react.default.createElement("button", {
				type: "button",
				className: "aag-btn",
				title: props.t("button.title"),
				onMouseDown: keepComposerFocus,
				onClick
			}, expertIcon(), react.default.createElement("span", null, props.t("settings.nav"))), menu);
		}
		function CategorySelect(props) {
			const [open, setOpen] = react.default.useState(false);
			const selectedIndex = Math.max(0, props.options.findIndex((option) => option.value === props.value));
			const [active, setActive] = react.default.useState(selectedIndex);
			const rootRef = react.default.useRef(null);
			const triggerRef = react.default.useRef(null);
			const listRef = react.default.useRef(null);
			const wasOpen = react.default.useRef(false);
			const selected = props.options[selectedIndex];
			react.default.useEffect(() => {
				if (!open) return;
				setActive(selectedIndex);
				const onPointerDown = (ev) => {
					const target = ev.target;
					if (target instanceof Node && rootRef.current?.contains(target) === true) return;
					setOpen(false);
				};
				document.addEventListener("pointerdown", onPointerDown);
				return () => document.removeEventListener("pointerdown", onPointerDown);
			}, [open, selectedIndex]);
			react.default.useEffect(() => {
				if (open) {
					listRef.current?.focus();
					wasOpen.current = true;
					return;
				}
				if (wasOpen.current) {
					triggerRef.current?.focus();
					wasOpen.current = false;
				}
			}, [open]);
			react.default.useEffect(() => {
				if (!open) return;
				document.getElementById(props.id + "-opt-" + String(active))?.scrollIntoView({ block: "nearest" });
			}, [
				active,
				open,
				props.id
			]);
			const choose = (value) => {
				props.onChange(value);
				setOpen(false);
			};
			const move = (next) => {
				if (props.options.length === 0) return;
				setActive(Math.min(props.options.length - 1, Math.max(0, next)));
			};
			const onTriggerKeyDown = (ev) => {
				if (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter" || ev.key === " ") {
					ev.preventDefault();
					setOpen(true);
				}
			};
			const onListKeyDown = (ev) => {
				if (ev.key === "ArrowDown") {
					ev.preventDefault();
					move(active + 1);
					return;
				}
				if (ev.key === "ArrowUp") {
					ev.preventDefault();
					move(active - 1);
					return;
				}
				if (ev.key === "Home") {
					ev.preventDefault();
					move(0);
					return;
				}
				if (ev.key === "End") {
					ev.preventDefault();
					move(props.options.length - 1);
					return;
				}
				if (ev.key === "Enter" || ev.key === " ") {
					ev.preventDefault();
					const option = props.options[active];
					if (option !== void 0) choose(option.value);
					return;
				}
				if (ev.key === "Escape" || ev.key === "Tab") setOpen(false);
			};
			return react.default.createElement("div", {
				className: "aag-select",
				ref: rootRef
			}, react.default.createElement("button", {
				id: props.id,
				ref: triggerRef,
				type: "button",
				className: "aag-select-trigger",
				"aria-haspopup": "listbox",
				"aria-expanded": open,
				"aria-controls": props.id + "-list",
				onClick: () => setOpen((current) => !current),
				onKeyDown: onTriggerKeyDown
			}, react.default.createElement("span", { className: "aag-select-value" }, selected === void 0 ? "" : selected.label), react.default.createElement("svg", {
				className: "aag-select-caret",
				viewBox: "0 0 12 12",
				"aria-hidden": true,
				focusable: false
			}, react.default.createElement("path", {
				d: "M2.5 4.5L6 8l3.5-3.5",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}))), open ? react.default.createElement("div", {
				id: props.id + "-list",
				ref: listRef,
				className: "aag-select-menu",
				role: "listbox",
				tabIndex: 0,
				"aria-activedescendant": props.id + "-opt-" + String(active),
				onKeyDown: onListKeyDown
			}, props.options.map((option, index) => react.default.createElement("button", {
				key: option.value === "" ? "all" : option.value,
				id: props.id + "-opt-" + String(index),
				type: "button",
				role: "option",
				className: "aag-select-option",
				"aria-selected": option.value === props.value,
				"data-active": index === active,
				onMouseEnter: () => setActive(index),
				onClick: () => choose(option.value)
			}, option.label))) : null);
		}
		function PromptDialog(props) {
			const closeRef = react.default.useRef(null);
			react.default.useEffect(() => {
				closeRef.current?.focus();
				const onKeyDown = (event) => {
					if (event.key === "Escape") props.onClose();
				};
				document.addEventListener("keydown", onKeyDown);
				return () => document.removeEventListener("keydown", onKeyDown);
			}, [props]);
			return react.default.createElement("div", {
				className: "aag-prompt-backdrop",
				onMouseDown: (event) => {
					if (event.currentTarget === event.target) props.onClose();
				}
			}, react.default.createElement("section", {
				className: "aag-prompt-modal",
				role: "dialog",
				"aria-modal": true,
				"aria-label": props.title
			}, react.default.createElement("div", { className: "aag-modal-head" }, react.default.createElement("h3", { className: "aag-modal-title" }, props.title), react.default.createElement("button", {
				ref: closeRef,
				type: "button",
				className: "aag-modal-close",
				onClick: props.onClose
			}, props.closeLabel)), react.default.createElement("pre", { className: "aag-prompt-content" }, props.value.prompt)));
		}
		function ExpertCardsSettings(props) {
			const [state, setState] = react.default.useState(null);
			const [error, setError] = react.default.useState(null);
			const [query, setQuery] = react.default.useState("");
			const [division, setDivision] = react.default.useState("");
			const [openPrompt, setOpenPrompt] = react.default.useState(null);
			const [promptBusySlug, setPromptBusySlug] = react.default.useState(null);
			const [copiedSlug, setCopiedSlug] = react.default.useState(null);
			const copiedResetTimer = react.default.useRef(void 0);
			const saving = react.default.useRef(false);
			const [isSaving, setIsSaving] = react.default.useState(false);
			const load = react.default.useCallback(() => {
				readEnabled(props.remote).then((current) => {
					setState(current);
					setError(null);
					props.onEnabledChange?.(current.enabled);
				}).catch((err) => {
					setError(err instanceof Error ? err.message : String(err));
				});
			}, [props.onEnabledChange, props.remote]);
			react.default.useEffect(() => {
				let alive = true;
				readEnabled(props.remote).then((current) => {
					if (!alive) return;
					setState(current);
					props.onEnabledChange?.(current.enabled);
				}).catch((err) => {
					if (alive) setError(err instanceof Error ? err.message : String(err));
				});
				return () => {
					alive = false;
				};
			}, [props.onEnabledChange, props.remote]);
			react.default.useEffect(() => () => {
				if (copiedResetTimer.current !== void 0) clearTimeout(copiedResetTimer.current);
			}, []);
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
				props.onEnabledChange?.(next);
				writeEnabled(props.remote, next, state.revision).then((current) => {
					setState(current);
					setError(null);
					props.onEnabledChange?.(current.enabled);
				}).catch(async (err) => {
					try {
						const refreshed = await readEnabled(props.remote);
						setState(refreshed);
						props.onEnabledChange?.(refreshed.enabled);
						setError(writeErrorMessage(err, {
							refreshed: true,
							t: props.t
						}));
					} catch {
						setState(previous);
						props.onEnabledChange?.(previous.enabled);
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
			const withPrompt = (expert, action) => {
				if (promptBusySlug !== null) return;
				setPromptBusySlug(expert.slug);
				setError(null);
				readPrompt(props.remote, expert.slug, expert.division).then(action).catch((err) => setError(err instanceof Error ? err.message : String(err))).finally(() => setPromptBusySlug(null));
			};
			const viewPrompt = (expert) => {
				withPrompt(expert, (prompt) => {
					setOpenPrompt({
						name: displayName(expert, props.getActive()),
						prompt
					});
				});
			};
			const copyPrompt = (expert) => {
				withPrompt(expert, async (prompt) => {
					if (navigator.clipboard === void 0) throw new Error(props.t("error.promptCopy"));
					await navigator.clipboard.writeText(prompt);
					if (copiedResetTimer.current !== void 0) clearTimeout(copiedResetTimer.current);
					setCopiedSlug(expert.slug);
					copiedResetTimer.current = setTimeout(() => {
						copiedResetTimer.current = void 0;
						setCopiedSlug(null);
					}, COPY_PROMPT_FEEDBACK_MS);
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
				const filtered = sortExpertsByEnabled(filterExperts(EXPERTS, {
					query,
					division
				}), state.enabled);
				const enabledCount = [...state.enabled].filter((slug) => EXPERTS.some((expert) => expert.slug === slug)).length;
				const total = EXPERTS.length;
				const hasFilter = normalizeExpertQuery(query) !== "" || division !== "";
				const resetFilters = () => {
					setQuery("");
					setDivision("");
				};
				nodes.push(react.default.createElement("div", {
					key: "toolbar",
					className: "aag-toolbar"
				}, react.default.createElement("div", { className: "aag-title-row" }, react.default.createElement("h2", { className: "aag-title" }, props.t("settings.title")), settingsGithubLinks(props.t), react.default.createElement("span", { className: "aag-header-stat" }, react.default.createElement("strong", null, total), props.t(total === 1 ? "summary.total.one" : "summary.total.other", { count: total })), react.default.createElement("span", { className: "aag-header-stat" }, props.t("summary.enabledPrefix"), react.default.createElement("strong", null, enabledCount))), react.default.createElement("div", { className: "aag-actions" }, react.default.createElement("button", {
					type: "button",
					className: "aag-refresh-button",
					disabled: isSaving,
					onClick: load,
					title: props.t("btn.refresh"),
					"aria-label": props.t("btn.refresh")
				}, react.default.createElement(RefreshCw, {
					size: 20,
					strokeWidth: 1.8,
					"aria-hidden": true
				})))));
				nodes.push(react.default.createElement("div", {
					key: "filters",
					className: "aag-filters aag-card-filters"
				}, react.default.createElement("div", { className: "aag-field aag-field-category" }, react.default.createElement("label", {
					className: "aag-label",
					htmlFor: "aag-filter-category"
				}, props.t("settings.filter.category")), react.default.createElement(CategorySelect, {
					id: "aag-filter-category",
					value: division,
					onChange: setDivision,
					options: expertDivisionFilterValues().map((value) => ({
						value,
						label: props.t("settings.filter.option", {
							name: value === "" ? props.t("settings.filter.all") : props.t(`division.${value}`),
							count: value === "" ? total : DIVISION_COUNTS[value] ?? 0
						})
					}))
				})), react.default.createElement("div", { className: "aag-field aag-field-search" }, react.default.createElement("label", {
					className: "aag-label",
					htmlFor: "aag-filter-search"
				}, props.t("settings.search")), react.default.createElement("div", { className: "aag-search-wrap" }, react.default.createElement(Search, {
					className: "aag-search-icon",
					size: 24,
					strokeWidth: 1.7,
					"aria-hidden": true
				}), react.default.createElement("input", {
					id: "aag-filter-search",
					className: "aag-control aag-search",
					type: "search",
					value: query,
					autoComplete: "off",
					spellCheck: false,
					placeholder: props.t("settings.search.placeholder"),
					onChange: (event) => {
						setQuery(event.currentTarget.value);
					}
				}), query !== "" ? react.default.createElement("button", {
					type: "button",
					className: "aag-search-clear",
					"aria-label": props.t("settings.search.clear"),
					onClick: () => setQuery("")
				}, react.default.createElement(X, {
					size: 18,
					strokeWidth: 1.8,
					"aria-hidden": true
				})) : null))));
				if (filtered.length === 0) nodes.push(react.default.createElement("div", {
					key: "empty",
					className: "aag-empty"
				}, react.default.createElement("div", null, props.t("settings.empty", { all: props.t("settings.filter.all") })), hasFilter ? react.default.createElement("button", {
					type: "button",
					className: "aag-action aag-action-secondary",
					onClick: resetFilters
				}, props.t("settings.empty.reset")) : null));
				else nodes.push(react.default.createElement("div", {
					key: "cards",
					className: "aag-expert-grid"
				}, filtered.map((expert) => {
					const enabled = state.enabled.has(expert.slug);
					const busy = promptBusySlug === expert.slug;
					const avatar = EXPERT_AVATAR_URLS[expertAvatarIndexForDivision(expert.slug, expert.division)] ?? EXPERT_AVATAR_URLS[0];
					return react.default.createElement("article", {
						key: expert.slug,
						className: "aag-expert-card"
					}, react.default.createElement("div", { className: "aag-card-body" }, react.default.createElement("img", {
						className: "aag-expert-avatar",
						src: avatar,
						width: 44,
						height: 44,
						loading: "lazy",
						decoding: "async",
						alt: ""
					}), react.default.createElement("div", { className: "aag-card-identity" }, react.default.createElement("div", {
						className: "aag-card-name",
						title: displayName(expert, props.getActive())
					}, displayName(expert, props.getActive())), react.default.createElement("div", { className: "aag-card-division" }, props.t(`division.${expert.division}`))), react.default.createElement("div", {
						className: "aag-card-description",
						title: displayDescription(expert, props.getActive())
					}, displayDescription(expert, props.getActive())), react.default.createElement("label", {
						className: "aag-switch",
						title: props.t(enabled ? "settings.enabled" : "settings.disabled")
					}, react.default.createElement("input", {
						type: "checkbox",
						className: "aag-switch-input",
						checked: enabled,
						disabled: isSaving,
						onChange: () => toggle(expert.slug),
						"aria-label": `${displayName(expert, props.getActive())}：${props.t(enabled ? "settings.enabled" : "settings.disabled")}`
					}), react.default.createElement("span", {
						className: "aag-switch-track",
						"aria-hidden": true
					}), react.default.createElement("span", { className: "aag-switch-state" }, props.t(enabled ? "settings.enabled" : "settings.disabled")))), react.default.createElement("div", { className: "aag-card-actions" }, react.default.createElement("button", {
						type: "button",
						className: "aag-card-action",
						disabled: promptBusySlug !== null,
						"aria-haspopup": "dialog",
						onClick: () => viewPrompt(expert)
					}, react.default.createElement(Eye, {
						size: 18,
						strokeWidth: 1.7,
						"aria-hidden": true
					}), busy ? props.t("settings.promptLoading") : props.t("settings.viewPrompt")), react.default.createElement("button", {
						type: "button",
						className: "aag-card-action aag-card-action-primary",
						disabled: promptBusySlug !== null,
						onClick: () => copyPrompt(expert)
					}, react.default.createElement(Copy, {
						size: 18,
						strokeWidth: 1.7,
						"aria-hidden": true
					}), copiedSlug === expert.slug ? props.t("settings.copySuccess") : props.t("settings.copyPrompt"))));
				})));
			}
			return react.default.createElement("section", { className: "aag-section" }, nodes, openPrompt === null ? null : react.default.createElement(PromptDialog, {
				value: openPrompt,
				title: props.t("settings.promptTitle", { name: openPrompt.name }),
				closeLabel: props.t("settings.promptClose"),
				onClose: () => setOpenPrompt(null)
			}));
		}
		const inject = [
			"slots",
			"inputTriggers",
			"locale",
			"remote",
			"sessions",
			"conversation"
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
			const getActive = () => ctx.locale.getSnapshot().active === "en" ? "en" : "zh";
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			const remote = ctx.get("remote.agencyAgents");
			if (remote === void 0) throw new Error("agency-agents Remote 挂载后不可用");
			let enabledForMentions;
			const lexiconListeners = /* @__PURE__ */ new Set();
			const updateEnabledForMentions = (enabled) => {
				if (enabledForMentions !== void 0 && enabledForMentions.size === enabled.size && [...enabled].every((slug) => enabledForMentions?.has(slug) === true)) return;
				enabledForMentions = new Set(enabled);
				for (const listener of lexiconListeners) listener();
			};
			const refreshEnabledForMentions = () => {
				readEnabled(remote).then((current) => updateEnabledForMentions(current.enabled)).catch(() => void 0);
			};
			const bindExpertInsertion = (sessionId) => {
				const target = () => resolveReferenceInsertionTarget(ctx.sessions, sessionId, (actx) => actx.get("conversation"));
				return { insertReference: (reference) => insertExpertReference(target(), reference) };
			};
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "agency-agents",
				order: 16,
				label: () => t("settings.nav"),
				locale: NS,
				icon: "expert"
			}, (props) => react.default.createElement(ExpertCardsSettings, {
				...props,
				remote,
				getActive,
				onEnabledChange: updateEnabledForMentions
			})));
			ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
				name: "conversation.input.left",
				id: "agency-agents",
				order: 0,
				locale: NS,
				inject: bindExpertInsertion
			}, (props) => react.default.createElement(AgentsButton, {
				...props,
				remote,
				getActive,
				onEnabledChange: updateEnabledForMentions
			})));
			const registerInputTriggerSources = (active) => {
				const disposers = [];
				try {
					for (const [i, div] of DIVISION_ORDER.entries()) {
						const source = {
							trigger: "@",
							name: inputTriggerSourceId(div),
							order: 100 + i,
							showGroupTitle: false,
							candidates: async (_session, req) => {
								const current = await readEnabled(remote).catch(() => void 0);
								if (current === void 0) return [];
								const enabled = current.enabled;
								updateEnabledForMentions(enabled);
								const q = String(req.query ?? "").toLowerCase();
								return EXPERTS.filter((e) => e.division === div && enabled.has(e.slug) && (q === "" || e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q))).map((e) => ({
									name: inputTriggerCandidateName(e, getActive()),
									hint: e.slug,
									section: inputTriggerSourceName(div, getActive())
								}));
							},
							onPick: (pick) => {
								const slug = pick.candidate.hint ?? "";
								const expert = EXPERTS.find((item) => item.slug === slug);
								return expert === void 0 ? void 0 : { insert: buildExpertReference(expert, getActive()) };
							},
							...i === 0 ? { warm: () => refreshEnabledForMentions() } : {},
							lexicon: () => enabledForMentions === void 0 ? void 0 : buildExpertMentionLexicon(EXPERTS.filter((expert) => expert.division === div), enabledForMentions, getActive()),
							subscribeLexicon: (_session, listener) => {
								lexiconListeners.add(listener);
								return () => {
									lexiconListeners.delete(listener);
								};
							},
							codec: {
								clipboardText: (slug) => expertMentionFromReference(slug, getActive()),
								serialize: async (slug) => expertMentionFromReference(slug, getActive())
							}
						};
						disposers.push(ctx.inputTriggers.registerSource(source));
					}
				} catch (error) {
					for (const dispose of disposers.reverse()) dispose();
					throw error;
				}
				return () => {
					for (const dispose of disposers.reverse()) dispose();
				};
			};
			ctx.effect(() => {
				let active = getActive();
				let disposeSources = registerInputTriggerSources(active);
				const unsubscribe = ctx.locale.subscribe(() => {
					const next = getActive();
					if (next === active) return;
					disposeSources();
					try {
						disposeSources = registerInputTriggerSources(next);
						active = next;
					} catch (error) {
						disposeSources = registerInputTriggerSources(active);
						console.error("[agency-agents] @ 菜单分组语言切换失败，已恢复原语言来源：", error);
					}
				});
				return () => {
					unsubscribe();
					disposeSources();
				};
			}, "agency-agents: @ menu sources");
			return () => {
				disposeRemote();
			};
		}
		//#endregion
		exports.CARD_SETTINGS_CSS = CARD_SETTINGS_CSS;
		exports.COPY_PROMPT_FEEDBACK_MS = COPY_PROMPT_FEEDBACK_MS;
		exports.EXPERT_AVATAR_POOL_INDEXES = EXPERT_AVATAR_POOL_INDEXES;
		exports.SETTINGS_GITHUB_LINKS = SETTINGS_GITHUB_LINKS;
		exports.apply = apply;
		exports.buildExpertMentionLexicon = buildExpertMentionLexicon;
		exports.buildExpertReference = buildExpertReference;
		exports.compareExpertName = compareExpertName;
		exports.expertAvatarIndex = expertAvatarIndex;
		exports.expertAvatarIndexForDivision = expertAvatarIndexForDivision;
		exports.expertDivisionFilterValues = expertDivisionFilterValues;
		exports.expertMentionFromReference = expertMentionFromReference;
		exports.filterExperts = filterExperts;
		exports.findExpertSettingsNavButton = findExpertSettingsNavButton;
		exports.findHostSettingsTrigger = findHostSettingsTrigger;
		exports.formatExpertMention = formatExpertMention;
		exports.formatExpertMentionInsertion = formatExpertMentionInsertion;
		exports.inject = inject;
		exports.inputTriggerCandidateName = inputTriggerCandidateName;
		exports.inputTriggerPickName = inputTriggerPickName;
		exports.inputTriggerSourceId = inputTriggerSourceId;
		exports.inputTriggerSourceName = inputTriggerSourceName;
		exports.insertExpertReference = insertExpertReference;
		exports.insertSelectedExpert = insertSelectedExpert;
		exports.isSettingsTriggerLabel = isSettingsTriggerLabel;
		exports.keepComposerFocus = keepComposerFocus;
		exports.matchExpertQuery = matchExpertQuery;
		exports.normalizeExpertQuery = normalizeExpertQuery;
		exports.openAgentSettings = openAgentSettings;
		exports.pickHostSettingsTrigger = pickHostSettingsTrigger;
		exports.resolveExpertToolbarClick = resolveExpertToolbarClick;
		exports.resolveReferenceInsertionTarget = resolveReferenceInsertionTarget;
		exports.sortExpertsByEnabled = sortExpertsByEnabled;
		exports.writeErrorKey = writeErrorKey;
		exports.writeErrorMessage = writeErrorMessage;
		return module.exports;
	}
});
