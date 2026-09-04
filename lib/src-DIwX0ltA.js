import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as dshSettings from "@deepseek-ai/dsh-settings";
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
//#region src/settings-compat.ts
function moduleExport(module, name) {
	return module[name];
}
/**
* DSH 0.1.2-alpha.2 accepts validated plain namespace strings and removed the
* legacy settingsNamespace export. Keep one runtime bridge so the same package
* can still run on the current RC line.
*/
function settingsNamespaceCompat(value, module = dshSettings) {
	const legacy = moduleExport(module, "settingsNamespace");
	return typeof legacy === "function" ? legacy(value) : value;
}
/**
* RC releases expose installSettingsSection as a module helper. Alpha.2 moved
* the same owner-scoped lifecycle wiring onto ctx.settings.installSection.
*/
function installSettingsSectionCompat(ctx, namespace, schema, entry, hooks, module = dshSettings) {
	const legacy = moduleExport(module, "installSettingsSection");
	if (typeof legacy === "function") {
		legacy(ctx, namespace, schema, entry, hooks);
		return;
	}
	const settings = ctx.settings;
	if (settings === void 0 || typeof settings.installSection !== "function") throw new Error("当前 DSH settings 服务不支持 installSection。");
	settings.installSection(ctx, namespace, schema, entry, hooks);
}
//#endregion
//#region src/i18n.ts
const LOCALE_SETTINGS_NAMESPACE = settingsNamespaceCompat("locale");
/** 简体中文宿主文案（key 集真相源）。 */
const zhHost = {
	"error.rootMissing": "智能体目录 root 不存在或无法访问：\"{root}\"。请设置环境变量 {env} 或提供正确路径。",
	"error.rootNotDir": "智能体目录 root \"{root}\" 不是目录",
	"error.catalogEmpty": "在 root \"{root}\" 下未发现任何智能体（*.md 文件）。请确认路径正确。",
	"error.catalogLoad": "agency-agents 花名册加载失败：{detail}",
	"error.catalogDuplicateName": "花名册包含重复专家名称：\"{name}\"",
	"error.expertRequired": "必须提供专家名称",
	"error.expertAmbiguous": "专家 \"{query}\" 有歧义；候选：{candidates}。请用 list_experts 选择唯一名称。",
	"error.expertMissing": "没有匹配 \"{query}\" 的专家。请调用 list_experts 查看花名册。",
	"error.expertDisabled": "专家 \"{name}\" 已停用",
	"error.summonRequiresAgent": "summon_expert 需要由智能体调用",
	"error.summonManyRequiresAgent": "summon_experts 需要由智能体调用",
	"error.expertsEmpty": "experts 必须是非空数组",
	"error.expertsTooMany": "一次最多召唤 {max} 名专家，当前为 {count}",
	"error.expertEmpty": "第 {index} 个专家不能为空",
	"error.taskEmpty": "第 {index} 个专家任务不能为空",
	"error.taskTooLong": "第 {index} 个专家任务过长（{length} 个字符，上限 {max}）",
	"error.taskRequired": "专家任务不能为空",
	"error.taskLimit": "专家任务过长（{length} 个字符，上限 {max}）",
	"error.providerMissing": "子代理 provider \"{provider}\" 未注册",
	"error.providerNoPersona": "子代理 provider \"{provider}\" 不支持专家人格",
	"error.providerNoToolFilter": "子代理 provider \"{provider}\" 无法阻止递归专家委派",
	"error.providerNoMaxDepth": "子代理 provider \"{provider}\" 不支持 maxDepth",
	"error.expertRun": "专家运行以 \"{reason}\" 结束{detail}",
	"error.partialOutput": "\n部分输出：\n{text}",
	"error.maxDepth": "agency-agents 配置 maxDepth 必须是正安全整数",
	"error.settingsMissing": "agency-agents 设置区尚未注册",
	"list.empty": "暂无可用专家。",
	"list.emptyDivision": "没有匹配分区 \"{division}\" 的专家。",
	"list.heading": "{total} 位专家，覆盖 {count} 个分区：",
	"list.group": "## {division}（{count}）",
	"list.expertFailed": "失败：{error}"
};
/** 英文宿主文案，key 完整性由 satisfies 在编译期保证。 */
const enHost = {
	"error.rootMissing": "Agent catalog root is missing or inaccessible: \"{root}\". Set {env} or provide a valid path.",
	"error.rootNotDir": "Agent catalog root \"{root}\" is not a directory",
	"error.catalogEmpty": "No agents (*.md files) found under root \"{root}\". Check the path.",
	"error.catalogLoad": "agency-agents catalog failed to load: {detail}",
	"error.catalogDuplicateName": "Agent catalog contains a duplicate expert name: \"{name}\"",
	"error.expertRequired": "expert name is required",
	"error.expertAmbiguous": "Ambiguous expert \"{query}\"; candidates: {candidates}. Use list_experts to pick a unique name.",
	"error.expertMissing": "No expert matched \"{query}\". Call list_experts to see the roster.",
	"error.expertDisabled": "expert \"{name}\" is disabled",
	"error.summonRequiresAgent": "summon_expert requires a calling agent",
	"error.summonManyRequiresAgent": "summon_experts requires a calling agent",
	"error.expertsEmpty": "experts must be a non-empty array",
	"error.expertsTooMany": "summon at most {max} experts at once, got {count}",
	"error.expertEmpty": "expert #{index} must not be empty",
	"error.taskEmpty": "expert task #{index} must not be empty",
	"error.taskTooLong": "expert task #{index} is too long ({length} characters, limit {max})",
	"error.taskRequired": "The expert task must not be empty",
	"error.taskLimit": "The expert task is too long ({length} characters, limit {max})",
	"error.providerMissing": "subagent provider \"{provider}\" is not registered",
	"error.providerNoPersona": "subagent provider \"{provider}\" does not support expert personas",
	"error.providerNoToolFilter": "subagent provider \"{provider}\" cannot prevent recursive expert delegation",
	"error.providerNoMaxDepth": "subagent provider \"{provider}\" does not support maxDepth",
	"error.expertRun": "expert run ended with \"{reason}\"{detail}",
	"error.partialOutput": "\nPartial output:\n{text}",
	"error.maxDepth": "agency-agents config maxDepth must be a positive safe integer",
	"error.settingsMissing": "agency-agents settings section is not registered",
	"list.empty": "No experts available.",
	"list.emptyDivision": "No experts matched division \"{division}\".",
	"list.heading": "{total} experts across {count} divisions:",
	"list.group": "## {division} ({count})",
	"list.expertFailed": "Failed: {error}"
};
/** 将未知值收成 zh / en；只有显式 en 才走英文。 */
function resolveHostLocale(value) {
	return value === "en" ? "en" : "zh";
}
/** 按当前语言格式化宿主文案。 */
function formatHost(locale, key, params) {
	let text = (locale === "en" ? enHost : zhHost)[key];
	if (params !== void 0) for (const [name, value] of Object.entries(params)) text = text.replaceAll("{" + name + "}", String(value));
	return text;
}
/** 从宿主 settings 的 locale.preference 读取语言，缺失或异常时回退 zh。 */
function readHostLocale(ctx) {
	try {
		const section = ctx.settings?.get?.(LOCALE_SETTINGS_NAMESPACE);
		return resolveHostLocale(section?.preference);
	} catch {
		return "zh";
	}
}
/** 分区查询同时认 key、中文名和英文名。 */
function matchDivision(query, division) {
	const q = query.trim().toLowerCase();
	if (q.length === 0) return false;
	if (division.toLowerCase() === q) return true;
	const zh = ZH_DIVISION[division];
	if (zh !== void 0 && zh.toLowerCase() === q) return true;
	const en = EN_DIVISION[division];
	if (en !== void 0 && en.toLowerCase() === q) return true;
	return false;
}
/** 按当前语言取分区显示名。 */
function localizedDivision(division, locale) {
	if (locale === "en") return EN_DIVISION[division] ?? division;
	return ZH_DIVISION[division] ?? division;
}
/** 按当前语言取专家显示名。 */
function localizedExpertName(expert, locale) {
	return locale === "en" ? expert.nameEn : expert.name;
}
/** 按当前语言取专家简介；英文缺失时回退中文。 */
function localizedExpertDescription(expert, locale) {
	return locale === "en" && expert.descriptionEn !== void 0 && expert.descriptionEn !== "" ? expert.descriptionEn : expert.description;
}
/** 渲染 list_experts 的用户可见文本。 */
function renderExpertList(locale, args, value) {
	if (value.divisions.length === 0) {
		const division = args.division === void 0 ? "" : String(args.division).trim();
		return division === "" ? formatHost(locale, "list.empty") : formatHost(locale, "list.emptyDivision", { division });
	}
	const lines = [];
	for (const group of value.divisions) {
		lines.push(formatHost(locale, "list.group", {
			division: localizedDivision(group.division, locale),
			count: group.count
		}));
		for (const expert of group.experts ?? []) {
			const mark = expert.emoji !== "" ? expert.emoji + " " : "";
			lines.push("- " + mark + expert.name + " — " + expert.description);
		}
	}
	lines.unshift(formatHost(locale, "list.heading", {
		total: value.total,
		count: value.divisions.length
	}));
	return lines.join("\n");
}
/** 渲染批量召唤结果：成功项输出答案，失败项输出本地化失败句。 */
function renderSummonResults(locale, results) {
	return results.map((item) => {
		const body = item.ok ? item.answer : formatHost(locale, "list.expertFailed", { error: item.error ?? "" });
		return "## " + item.expert + "\n" + body;
	}).join("\n\n");
}
//#endregion
//#region src/index.ts
const name = "agency-agents";
const inject = [
	"tools",
	"subagents",
	"systemPrompt",
	"settings"
];
const DEFAULT_DIVISIONS = [
	"academic",
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
	"supply-chain",
	"testing"
];
/** 描述截断上限，避免无过滤列出全量智能体时 token 开销过大。 */
const DESCRIPTION_LIMIT = 120;
/** 一次批量召唤的专家数量上限，避免无界并行拖垮宿主。 */
const SUMMON_EXPERTS_MAX = 8;
/** 批量召唤的并发上限。 */
const SUMMON_EXPERTS_CONCURRENCY = 4;
/** 单条任务的 Unicode 码点上限。 */
const SUMMON_TASK_MAX_CHARS = 8e3;
/**
* 校验并规范化任务文本：非空且不超过码点上限。
* index 存在时使用带序号的批量文案，否则使用单条召唤文案；返回规范化后的字符串。
*/
function normalizeTask(task, locale, index) {
	const text = task === void 0 || task === null ? "" : String(task);
	const length = Array.from(text).length;
	if (text.trim() === "") throw new Error(index === void 0 ? formatHost(locale, "error.taskRequired") : formatHost(locale, "error.taskEmpty", { index }));
	if (length > 8e3) throw new Error(index === void 0 ? formatHost(locale, "error.taskLimit", {
		length,
		max: SUMMON_TASK_MAX_CHARS
	}) : formatHost(locale, "error.taskTooLong", {
		index,
		length,
		max: SUMMON_TASK_MAX_CHARS
	}));
	return text;
}
/** 校验批量召唤入参：非空、数量上限、专家名非空、任务非空且不超过码点上限。 */
function validateSummonSpecs(specs, locale) {
	if (!Array.isArray(specs) || specs.length === 0) throw new Error(formatHost(locale, "error.expertsEmpty"));
	if (specs.length > 8) throw new Error(formatHost(locale, "error.expertsTooMany", {
		max: 8,
		count: specs.length
	}));
	return specs.map((item, index) => {
		const record = item;
		const expert = record === null || record === void 0 ? void 0 : record.expert;
		if (expert === void 0 || expert === null || String(expert).trim() === "") throw new Error(formatHost(locale, "error.expertEmpty", { index: index + 1 }));
		return {
			expert,
			task: normalizeTask(record?.task, locale, index + 1)
		};
	});
}
/** 受限并发地映射异步任务，结果顺序与输入一致。 */
async function mapPool(items, concurrency, mapper) {
	if (items.length === 0) return [];
	const limit = Math.max(1, Math.min(concurrency, items.length));
	const results = new Array(items.length);
	let next = 0;
	const workers = Array.from({ length: limit }, async () => {
		while (true) {
			const index = next;
			next += 1;
			if (index >= items.length) return;
			results[index] = await mapper(items[index], index);
		}
	});
	await Promise.all(workers);
	return results;
}
/** 把单次专家运行结果收成批量条目；失败时保留原始查询作为专家名。 */
function toSummonItemResult(query, result) {
	if (result instanceof Error) {
		const expert = String(query ?? "").trim();
		return {
			expert: expert === "" ? "unknown" : expert,
			ok: false,
			answer: "",
			error: result.message
		};
	}
	return {
		expert: result.expert,
		ok: true,
		answer: result.answer
	};
}
/** 未在配置中显式提供 `root` 时，先读取该环境变量，再使用随包发布的智能体目录。 */
const ROOT_ENV = "AGENCY_AGENTS_ROOT";
const BUNDLED_ROOT = fileURLToPath(new URL("../assets/agency-agents/", import.meta.url));
const Config = z.object({
	root: z.string().default(""),
	provider: z.string().default("spawn"),
	divisions: z.array(z.string()).default(DEFAULT_DIVISIONS),
	maxDepth: z.natural().min(1)
});
/** 解析智能体根目录：显式配置优先，其次读取环境变量，最后使用包内资产。 */
function resolveCatalogRoot(root) {
	if (root.trim() !== "") return root;
	const environmentRoot = process.env[ROOT_ENV]?.trim();
	return environmentRoot === void 0 || environmentRoot === "" ? BUNDLED_ROOT : environmentRoot;
}
/** 规范化可选深度上限：配置表单的空值等同于未设置，其他值必须允许至少一层子代理。 */
function normalizeMaxDepth(value) {
	if (value === void 0 || value === null) return void 0;
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error(formatHost("zh", "error.maxDepth"));
	return value;
}
/** Neutralize strict `{{...}}` template interpolation inside expert prose. */
function sanitize(text) {
	return text.replace(/\{(?=\{)/g, "{​");
}
/** 去除 UTF-8 BOM，避免 `^---` 因文件头部的零宽字符失配。 */
function stripBom(text) {
	return text.charCodeAt(0) === 65279 ? text.slice(1) : text;
}
/** 剥离字段值首尾的成对引号，保留引号内部的 #、冒号等字符。 */
function unquote(value) {
	const first = value.charAt(0);
	if ((first === "\"" || first === "'") && value.length >= 2 && value.endsWith(first)) return value.slice(1, -1);
	return value;
}
/** 将超长文本截断到指定长度并追加省略号。 */
function truncate(text, limit) {
	const codePoints = Array.from(text);
	return codePoints.length <= limit ? text : `${codePoints.slice(0, limit).join("")}…`;
}
/** Parse the `key: value` frontmatter block of one agency agent file. */
function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (match === null) return void 0;
	const fm = match[1];
	const body = match[2].trim();
	const get = (key) => {
		const m = fm.match(new RegExp(`^${key}\\s*:\\s*(.*)$`, "m"));
		return m === null ? void 0 : unquote(m[1].trim());
	};
	return {
		name: get("name"),
		description: get("description"),
		descriptionEn: get("descriptionEn"),
		emoji: get("emoji"),
		body
	};
}
/** Concatenate the text blocks of a subagent output. */
function textBlocks(blocks) {
	return blocks.filter((block) => block.type === "text").map((block) => block.text).join("");
}
/** 校验 root 目录存在且为目录，否则抛出明确错误（避免静默得到空列表）。 */
async function assertDirectory(root, locale) {
	const info = await stat(root).catch(() => void 0);
	if (info === void 0) throw new Error(formatHost(locale, "error.rootMissing", {
		root,
		env: ROOT_ENV
	}));
	if (!info.isDirectory()) throw new Error(formatHost(locale, "error.rootNotDir", { root }));
}
/** 递归遍历目录下的所有 .md 文件，逐个回调其绝对路径与文件名。 */
async function walkMarkdown(dir, onFile) {
	const entries = await readdir(dir, { withFileTypes: true }).catch((error) => {
		console.warn(`[agency-agents] 跳过无法读取的目录 ${dir}: ${error instanceof Error ? error.message : String(error)}`);
	});
	if (entries === void 0) return;
	entries.sort((a, b) => a.name.localeCompare(b.name));
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) await walkMarkdown(full, onFile);
		else if (entry.isFile() && entry.name.endsWith(".md")) await onFile(full, entry.name);
	}
}
/** 加载已配置分区中的所有 persona，按 slug 建立索引；目录无效或为空时抛出明确错误。 */
async function loadCatalog(root, divisions, locale = "zh") {
	await assertDirectory(root, locale);
	const sources = divisions.map((division) => ({
		dir: division,
		division
	}));
	const map = /* @__PURE__ */ new Map();
	for (const source of sources) await walkMarkdown(join(root, source.dir), async (filePath, fileName) => {
		const slug = fileName.slice(0, -3);
		let raw;
		try {
			raw = stripBom(await readFile(filePath, "utf8"));
		} catch (error) {
			console.warn(`[agency-agents] 跳过无法读取的智能体文件 ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
			return;
		}
		const parsed = parseFrontmatter(raw);
		if (parsed === void 0 || parsed.name === void 0 || parsed.description === void 0) return;
		if (map.has(slug)) console.warn(`[agency-agents] 智能体 slug 冲突，后加载者覆盖：${slug}`);
		map.set(slug, {
			slug,
			name: ZH_NAME[slug] ?? parsed.name,
			nameEn: parsed.name,
			description: parsed.description,
			descriptionEn: parsed.descriptionEn ?? "",
			emoji: parsed.emoji ?? "",
			division: source.division,
			divisionZh: ZH_DIVISION[source.division] ?? source.division,
			persona: sanitize(parsed.body)
		});
	});
	if (map.size === 0) throw new Error(formatHost(locale, "error.catalogEmpty", { root }));
	const nameOwners = /* @__PURE__ */ new Map();
	for (const expert of map.values()) for (const name of [expert.name, expert.nameEn]) {
		const normalized = normalizeExpertName(name);
		if (normalized === "") continue;
		const owner = nameOwners.get(normalized);
		if (owner !== void 0 && owner.slug !== expert.slug) throw new Error(formatHost(locale, "error.catalogDuplicateName", { name }));
		nameOwners.set(normalized, expert);
	}
	return map;
}
/** 统一专家名称的比较规则，避免名册校验和运行时查询出现不一致。 */
function normalizeExpertName(value) {
	return String(value ?? "").trim().toLowerCase();
}
/** 仅按本地化名称解析智能体；名称重名时拒绝调用，防止召唤到错误角色。 */
function resolveExpert(experts, query, locale = "zh") {
	const q = normalizeExpertName(query);
	if (q.length === 0) throw new Error(formatHost(locale, "error.expertRequired"));
	const exactNames = experts.filter((expert) => normalizeExpertName(expert.name) === q || normalizeExpertName(expert.nameEn) === q);
	if (exactNames.length === 1) return exactNames[0];
	const matches = exactNames.length > 1 ? exactNames : experts.filter((expert) => normalizeExpertName(expert.name).includes(q) || normalizeExpertName(expert.nameEn).includes(q));
	if (matches.length === 1) return matches[0];
	if (matches.length > 1) {
		const preview = [...new Set(matches.map((expert) => locale === "en" ? expert.nameEn ?? expert.name : expert.name))].slice(0, 12).join(", ");
		throw new Error(formatHost(locale, "error.expertAmbiguous", {
			query: String(query),
			candidates: preview
		}));
	}
	throw new Error(formatHost(locale, "error.expertMissing", { query: String(query) }));
}
function apply(ctx, config) {
	const maxDepth = normalizeMaxDepth(config.maxDepth);
	let enabledSource = () => [];
	installSettingsSectionCompat(ctx, settingsNamespaceCompat("agency-agents"), z.object({ enabled: z.array(z.string()) }), { enabled: [] }, {
		setSource: (current) => {
			enabledSource = () => current().enabled;
		},
		onChange: () => {}
	});
	const enabledSet = () => new Set(enabledSource());
	const activeLocale = () => readHostLocale(ctx);
	let experts = /* @__PURE__ */ new Map();
	let loadError = null;
	const ready = loadCatalog(resolveCatalogRoot(config.root), config.divisions, activeLocale()).then((map) => {
		experts = map;
	}).catch((error) => {
		loadError = String(error);
	});
	async function ensureReady() {
		await ready;
		if (loadError !== null) throw new Error(formatHost(activeLocale(), "error.catalogLoad", { detail: loadError }));
	}
	function groupByDivision(withExperts, locale) {
		const groups = /* @__PURE__ */ new Map();
		const enabled = enabledSet();
		for (const expert of experts.values()) {
			if (!enabled.has(expert.slug)) continue;
			const list = groups.get(expert.division) ?? [];
			list.push(expert);
			groups.set(expert.division, list);
		}
		return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([division, list]) => ({
			division,
			count: list.length,
			...withExperts ? { experts: list.slice().sort((a, b) => a.slug.localeCompare(b.slug)).map((e) => ({
				name: localizedExpertName(e, locale),
				emoji: e.emoji,
				description: truncate(localizedExpertDescription(e, locale), DESCRIPTION_LIMIT)
			})) } : {}
		}));
	}
	ctx.tools.register(defineTool({
		name: "list_experts",
		description: "List the available Agency domain experts grouped by division. Without a division filter it returns only division names and counts (compact); pass a division to expand it with expert names and descriptions. Call this before summon_expert when you need to choose an expert by name.",
		parameters: { division: {
			type: "string",
			description: "Optional division key to filter (e.g. engineering, marketing, security, finance, design)."
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					divisions: {
						type: "array",
						required: true,
						items: { type: "json" }
					},
					total: {
						type: "number",
						required: true
					}
				}
			},
			render: (args, value) => {
				const divisions = value.divisions;
				return [{
					type: "text",
					text: renderExpertList(activeLocale(), args, {
						divisions,
						total: value.total
					})
				}];
			}
		},
		async execute(args) {
			await ensureReady();
			const query = args.division === void 0 ? "" : String(args.division).trim();
			const hasFilter = query !== "";
			const groups = groupByDivision(hasFilter, activeLocale());
			if (hasFilter) {
				const filtered = groups.filter((g) => matchDivision(query, g.division));
				return {
					divisions: filtered,
					total: filtered.reduce((n, g) => n + g.count, 0)
				};
			}
			return {
				divisions: groups,
				total: experts.size
			};
		}
	}));
	async function runExpert(query, task, exec) {
		const locale = activeLocale();
		const taskText = normalizeTask(task, locale);
		if (exec.agent === void 0) throw new Error(formatHost(locale, "error.summonRequiresAgent"));
		const provider = ctx.subagents.getProvider(config.provider);
		if (provider === void 0) throw new Error(formatHost(locale, "error.providerMissing", { provider: config.provider }));
		if (!provider.capabilities.persona) throw new Error(formatHost(locale, "error.providerNoPersona", { provider: config.provider }));
		if (!provider.capabilities.toolFilter) throw new Error(formatHost(locale, "error.providerNoToolFilter", { provider: config.provider }));
		if (maxDepth !== void 0 && !provider.capabilities.depthLimit) throw new Error(formatHost(locale, "error.providerNoMaxDepth", { provider: config.provider }));
		const expert = resolveExpert([...experts.values()], query, locale);
		if (!enabledSet().has(expert.slug)) throw new Error(formatHost(locale, "error.expertDisabled", { name: localizedExpertName(expert, locale) }));
		const run = await ctx.subagents.start(config.provider, {
			label: `expert:${expert.slug}`,
			prompt: [{
				type: "text",
				text: taskText
			}],
			parent: exec.agent,
			persona: expert.persona,
			toolFilter: { deny: [
				"summon_expert",
				"summon_experts",
				"list_experts"
			] },
			...maxDepth === void 0 ? {} : { maxDepth },
			signal: exec.signal
		});
		try {
			const result = await run.result;
			const text = textBlocks(result.output);
			if (result.stopReason !== "completed") {
				const detail = text.length > 0 ? formatHost(locale, "error.partialOutput", { text }) : "";
				throw new Error(formatHost(locale, "error.expertRun", {
					reason: result.stopReason,
					detail
				}));
			}
			return {
				expert: localizedExpertName(expert, locale),
				answer: text
			};
		} finally {
			await run.dispose();
		}
	}
	ctx.tools.register(defineTool({
		name: "summon_expert",
		description: "Summon a domain expert from The Agency roster to complete a task: a specialist subagent runs with that expert's full persona and returns its result. Use for tasks that clearly belong to a specialist domain (frontend work, security review, marketing copy, etc.). This call waits for the expert's result. Call list_experts first if you do not know the expert name.",
		parameters: {
			expert: {
				type: "string",
				required: true,
				description: "Expert name to summon (e.g. \"Frontend Developer\")."
			},
			task: {
				type: "string",
				required: true,
				description: "The complete, self-contained task to give the expert. Include all necessary context; fork providers may additionally inherit completed conversation turns."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					expert: {
						type: "string",
						required: true
					},
					answer: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: value.answer
			}]
		},
		async execute(args, exec) {
			await ensureReady();
			return runExpert(args.expert, args.task, exec);
		}
	}));
	ctx.tools.register(defineTool({
		name: "summon_experts",
		description: "Summon multiple domain experts in parallel to work on one mission. Each expert gets its own task/role and runs as a specialist subagent with its own persona. At most 8 experts run with concurrency 4; if some fail, successful answers are still returned. Use this to assemble a specialist team.",
		parameters: { experts: {
			type: "array",
			required: true,
			description: "The experts to summon, each with an expert name and its own task.",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					expert: {
						type: "string",
						required: true,
						description: "Expert name (e.g. \"Frontend Developer\")."
					},
					task: {
						type: "string",
						required: true,
						description: "The complete, self-contained task/role for this expert."
					}
				}
			}
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: { results: {
					type: "array",
					required: true,
					items: { type: "json" }
				} }
			},
			render: (_args, value) => {
				const results = value.results;
				return [{
					type: "text",
					text: renderSummonResults(activeLocale(), results)
				}];
			}
		},
		async execute(args, exec) {
			await ensureReady();
			const locale = activeLocale();
			if (exec.agent === void 0) throw new Error(formatHost(locale, "error.summonManyRequiresAgent"));
			return { results: (await mapPool(validateSummonSpecs(args.experts, locale), 4, async (spec) => {
				try {
					return toSummonItemResult(spec.expert, await runExpert(spec.expert, spec.task, exec));
				} catch (error) {
					return toSummonItemResult(spec.expert, error instanceof Error ? error : new Error(String(error)));
				}
			})).map((item) => ({
				expert: item.expert,
				ok: item.ok,
				answer: item.answer,
				...item.error === void 0 ? {} : { error: item.error }
			})) };
		}
	}));
	ctx.systemPrompt.section({
		name: "agency:experts",
		order: 117,
		text: (context) => {
			if (context.agent?.session?.header?.parentSession !== void 0) return "";
			return "## Agency expert mode\nThe parent session has a roster of domain experts from The Agency (specialists across 18 divisions, individually enable/disable; ALL are disabled by default, and the user enables some in the Agency settings tab). A composer selection inserts one enabled expert as a native reference chip; all remaining draft text is that expert's task. In the parent session, call `list_experts()` to see enabled division names and counts, then call `list_experts(division)` to browse enabled experts and select a unique name before using `summon_expert(expert, task)` or `summon_experts` for a small parallel team (at most 8; partial results if some fail). A disabled expert cannot be summoned.";
		}
	});
}
//#endregion
export { ZH_NAME as C, settingsNamespaceCompat as S, truncate as _, SUMMON_TASK_MAX_CHARS as a, formatHost as b, loadCatalog as c, parseFrontmatter as d, resolveCatalogRoot as f, toSummonItemResult as g, stripBom as h, SUMMON_EXPERTS_MAX as i, mapPool as l, sanitize as m, DEFAULT_DIVISIONS as n, apply as o, resolveExpert as p, SUMMON_EXPERTS_CONCURRENCY as r, inject as s, Config as t, name as u, unquote as v, readHostLocale as x, validateSummonSpecs as y };
