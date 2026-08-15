import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
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
//#region src/index.ts
const name = "agency-agents";
const inject = [
	"tools",
	"subagents",
	"systemPrompt"
];
const DEFAULT_DIVISIONS = [
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
/** 额外扫描的源目录：不在标准 division 内、但仍是合法智能体的集成（如 mcp-memory）。 */
const EXTRA_SOURCES = [{
	dir: "integrations/mcp-memory",
	division: "engineering"
}];
/** 描述截断上限，避免无过滤列出全量智能体时 token 开销过大。 */
const DESCRIPTION_LIMIT = 120;
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
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("agency-agents config maxDepth must be a positive safe integer");
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
		emoji: get("emoji"),
		body
	};
}
/** Concatenate the text blocks of a subagent output. */
function textBlocks(blocks) {
	return blocks.filter((block) => block.type === "text").map((block) => block.text).join("");
}
/** 校验 root 目录存在且为目录，否则抛出明确错误（避免静默得到空列表）。 */
async function assertDirectory(root) {
	const info = await stat(root).catch(() => void 0);
	if (info === void 0) throw new Error(`智能体目录 root 不存在或无法访问："${root}"。请设置环境变量 ${ROOT_ENV} 或提供正确路径。`);
	if (!info.isDirectory()) throw new Error(`智能体目录 root "${root}" 不是目录`);
}
/** 递归遍历目录下的所有 .md 文件，逐个回调其绝对路径与文件名。 */
async function walkMarkdown(dir, onFile) {
	const entries = await readdir(dir, { withFileTypes: true }).catch((error) => {
		console.warn(`[agency-agents] 跳过无法读取的目录 ${dir}: ${error instanceof Error ? error.message : String(error)}`);
	});
	if (entries === void 0) return;
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) await walkMarkdown(full, onFile);
		else if (entry.isFile() && entry.name.endsWith(".md")) await onFile(full, entry.name);
	}
}
/** Load every `<division>/**\/*.md` persona file (plus extra sources) into a slug-keyed map. Throws when root is invalid or empty. */
async function loadCatalog(root, divisions) {
	await assertDirectory(root);
	const sources = [...divisions.map((division) => ({
		dir: division,
		division
	})), ...EXTRA_SOURCES.filter((source) => divisions.includes(source.division))];
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
			emoji: parsed.emoji ?? "",
			division: source.division,
			divisionZh: ZH_DIVISION[source.division] ?? source.division,
			persona: sanitize(parsed.body)
		});
	});
	if (map.size === 0) throw new Error(`在 root "${root}" 下未发现任何智能体（*.md 文件）。请确认路径正确。`);
	return map;
}
/** 根据 slug 或名称解析智能体；任意多命中都必须要求调用者提供更精确的 slug。 */
function resolveExpert(experts, query) {
	const q = String(query).trim().toLowerCase();
	if (q.length === 0) throw new Error("expert is required");
	const bySlug = experts.find((expert) => expert.slug.toLowerCase() === q);
	if (bySlug !== void 0) return bySlug;
	const exactNames = experts.filter((expert) => expert.name.toLowerCase() === q || expert.nameEn?.toLowerCase() === q);
	if (exactNames.length === 1) return exactNames[0];
	const matches = exactNames.length > 1 ? exactNames : experts.filter((expert) => expert.slug.toLowerCase().includes(q) || expert.name.toLowerCase().includes(q) || expert.nameEn?.toLowerCase().includes(q));
	if (matches.length === 1) return matches[0];
	if (matches.length > 1) {
		const preview = matches.slice(0, 12).map((expert) => expert.slug).join(", ");
		throw new Error(`Ambiguous expert "${String(query)}"; candidates: ${preview}. Use list_experts to pick an exact slug.`);
	}
	throw new Error(`No expert matched "${String(query)}". Call list_experts to see the roster.`);
}
function apply(ctx, config) {
	const maxDepth = normalizeMaxDepth(config.maxDepth);
	let enabledSource = () => [];
	installSettingsSection(ctx, settingsNamespace("agency-agents"), z.object({ enabled: z.array(z.string()) }), { enabled: [] }, {
		setSource: (current) => {
			enabledSource = () => current().enabled;
		},
		onChange: () => {}
	});
	const enabledSet = () => new Set(enabledSource());
	let experts = /* @__PURE__ */ new Map();
	let loadError = null;
	const ready = loadCatalog(resolveCatalogRoot(config.root), config.divisions).then((map) => {
		experts = map;
	}).catch((error) => {
		loadError = String(error);
	});
	async function ensureReady() {
		await ready;
		if (loadError !== null) throw new Error(`agency-agents catalog failed to load: ${loadError}`);
	}
	function groupByDivision(withExperts) {
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
				slug: e.slug,
				name: e.name,
				emoji: e.emoji,
				description: truncate(e.description, DESCRIPTION_LIMIT)
			})) } : {}
		}));
	}
	ctx.tools.register(defineTool({
		name: "list_experts",
		description: "List the available Agency domain experts grouped by division. Without a division filter it returns only division names and counts (compact); pass a division to expand it with expert names, slugs, and descriptions. Call this before summon_expert when you need an exact expert slug.",
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
				if (divisions.length === 0) {
					const division = args.division === void 0 ? "" : String(args.division).trim();
					return [{
						type: "text",
						text: division === "" ? "No experts available." : `No experts matched division "${division}".`
					}];
				}
				const lines = [];
				for (const group of divisions) {
					lines.push(`## ${group.division} (${group.count})`);
					for (const expert of group.experts ?? []) lines.push(`- ${expert.emoji ? `${expert.emoji} ` : ""}${expert.name} — \`${expert.slug}\` — ${expert.description}`);
				}
				lines.unshift(`${value.total} experts across ${divisions.length} divisions:`);
				return [{
					type: "text",
					text: lines.join("\n")
				}];
			}
		},
		async execute(args) {
			await ensureReady();
			const query = args.division === void 0 ? "" : String(args.division).trim().toLowerCase();
			const hasFilter = query !== "";
			const groups = groupByDivision(hasFilter);
			if (hasFilter) {
				const filtered = groups.filter((g) => {
					return g.division.toLowerCase() === query;
				});
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
		if (exec.agent === void 0) throw new Error("summon_expert requires a calling agent");
		const provider = ctx.subagents.getProvider(config.provider);
		if (provider === void 0) throw new Error(`subagent provider "${config.provider}" is not registered`);
		if (!provider.capabilities.persona) throw new Error(`subagent provider "${config.provider}" does not support expert personas`);
		if (!provider.capabilities.toolFilter) throw new Error(`subagent provider "${config.provider}" cannot prevent recursive expert delegation`);
		if (maxDepth !== void 0 && !provider.capabilities.depthLimit) throw new Error(`subagent provider "${config.provider}" does not support maxDepth`);
		const expert = resolveExpert([...experts.values()], query);
		if (!enabledSet().has(expert.slug)) throw new Error(`expert "${expert.name}" is disabled`);
		const run = await ctx.subagents.start(config.provider, {
			label: `expert:${expert.slug}`,
			prompt: [{
				type: "text",
				text: String(task)
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
				const detail = text.length > 0 ? `\nPartial output:\n${text}` : "";
				throw new Error(`expert run ended with "${result.stopReason}"${detail}`);
			}
			return {
				expert: expert.slug,
				answer: text
			};
		} finally {
			await run.dispose();
		}
	}
	ctx.tools.register(defineTool({
		name: "summon_expert",
		description: "Summon a domain expert from The Agency roster to complete a task: a specialist subagent runs with that expert's full persona and returns its result. Use for tasks that clearly belong to a specialist domain (frontend work, security review, marketing copy, etc.). This call waits for the expert's result. Call list_experts first if you do not know the exact expert slug.",
		parameters: {
			expert: {
				type: "string",
				required: true,
				description: "Expert slug or name to summon (e.g. engineering-frontend-developer, or \"Frontend Developer\")."
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
		description: "Summon multiple domain experts in parallel to work on one mission. Each expert gets its own task/role and runs as a specialist subagent with its own persona; results are returned per expert. Use this to assemble a specialist team. This call waits for all experts.",
		parameters: { experts: {
			type: "array",
			required: true,
			description: "The experts to summon, each with an expert slug/name and its own task.",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					expert: {
						type: "string",
						required: true,
						description: "Expert slug or name (e.g. engineering-frontend-developer, or \"Frontend Developer\")."
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
				return [{
					type: "text",
					text: value.results.map((r) => `## ${r.expert}\n${r.answer}`).join("\n\n")
				}];
			}
		},
		async execute(args, exec) {
			await ensureReady();
			if (exec.agent === void 0) throw new Error("summon_experts requires a calling agent");
			const specs = args.experts;
			if (!Array.isArray(specs) || specs.length === 0) throw new Error("experts must be a non-empty array");
			return { results: await Promise.all(specs.map((spec) => runExpert(spec.expert, spec.task, exec))) };
		}
	}));
	ctx.systemPrompt.section({
		name: "agency:experts",
		order: 117,
		text: (context) => {
			if (context.agent?.session?.header?.parentSession !== void 0) return "";
			return "## Agency expert mode\nThe parent session has a roster of domain experts from The Agency (specialists across 17 divisions, individually enable/disable; ALL are disabled by default, and the user enables some in the Agency settings tab). In the parent session, call `list_experts()` to see enabled division names and counts, then call `list_experts(division)` to browse enabled experts and find an exact slug before using `summon_expert(expert, task)`. A disabled expert cannot be summoned.";
		}
	});
}
//#endregion
export { Config, apply, inject, loadCatalog, name, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, truncate, unquote };
