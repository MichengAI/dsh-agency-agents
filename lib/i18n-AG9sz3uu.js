import * as dshSettings from "@deepseek-ai/dsh-settings";
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
	research: "研究",
	sales: "销售",
	security: "安全",
	"spatial-computing": "空间计算",
	specialized: "专业",
	support: "支持",
	testing: "测试"
};
/** 分区目录名 → 英文分区名。 */
const EN_DIVISION = {
	academic: "Academic",
	design: "Design",
	engineering: "Engineering",
	finance: "Finance",
	"game-development": "Game Development",
	gis: "GIS",
	healthcare: "Healthcare",
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
	testing: "Testing"
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
	"unreal-world-builder": "Unreal 世界构建师"
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
	"error.expertRequired": "必须提供专家 slug 或名称",
	"error.expertAmbiguous": "专家 \"{query}\" 有歧义；候选：{candidates}。请用 list_experts 选择精确 slug。",
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
	"error.expertRequired": "expert is required",
	"error.expertAmbiguous": "Ambiguous expert \"{query}\"; candidates: {candidates}. Use list_experts to pick an exact slug.",
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
			lines.push("- " + mark + expert.name + " — `" + expert.slug + "` — " + expert.description);
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
export { readHostLocale as a, installSettingsSectionCompat as c, ZH_NAME as d, matchDivision as i, settingsNamespaceCompat as l, localizedExpertDescription as n, renderExpertList as o, localizedExpertName as r, renderSummonResults as s, formatHost as t, ZH_DIVISION as u };
