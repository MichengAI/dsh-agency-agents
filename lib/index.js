import { a as readHostLocale, c as installSettingsSectionCompat, d as ZH_NAME, i as matchDivision, l as settingsNamespaceCompat, n as localizedExpertDescription, o as renderExpertList, r as localizedExpertName, s as renderSummonResults, t as formatHost, u as ZH_DIVISION } from "./i18n-ocqQwsUA.js";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
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
	"research",
	"sales",
	"security",
	"spatial-computing",
	"specialized",
	"support",
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
export { Config, SUMMON_EXPERTS_CONCURRENCY, SUMMON_EXPERTS_MAX, SUMMON_TASK_MAX_CHARS, ZH_NAME, apply, inject, loadCatalog, mapPool, name, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, toSummonItemResult, truncate, unquote, validateSummonSpecs };
