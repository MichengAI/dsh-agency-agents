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
/** 额外扫描的源目录：不在标准 division 内、但仍是合法专家的集成（如 mcp-memory）。 */
const EXTRA_SOURCES = [{
	dir: "integrations/mcp-memory",
	division: "engineering"
}];
/** 描述截断上限，避免无过滤列出全量专家时 token 开销过大。 */
const DESCRIPTION_LIMIT = 120;
/** 未在配置中显式提供 `root` 时，先读取该环境变量，再使用随包发布的专家目录。 */
const ROOT_ENV = "AGENCY_AGENTS_ROOT";
const BUNDLED_ROOT = fileURLToPath(new URL("../assets/agency-agents/", import.meta.url));
const Config = z.object({
	root: z.string().default(process.env[ROOT_ENV] ?? ""),
	provider: z.string().default("spawn"),
	divisions: z.array(z.string()).default(DEFAULT_DIVISIONS)
});
/** 解析专家根目录：显式配置优先，其次使用包内资产。 */
function resolveCatalogRoot(root) {
	return root.trim() === "" ? BUNDLED_ROOT : root;
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
	return text.length <= limit ? text : `${text.slice(0, limit)}…`;
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
		vibe: get("vibe"),
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
	if (info === void 0) throw new Error(`专家目录 root 不存在或无法访问："${root}"。请设置环境变量 ${ROOT_ENV} 或提供正确路径。`);
	if (!info.isDirectory()) throw new Error(`专家目录 root "${root}" 不是目录`);
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
	})), ...EXTRA_SOURCES];
	const map = /* @__PURE__ */ new Map();
	for (const source of sources) await walkMarkdown(join(root, source.dir), async (filePath, fileName) => {
		const slug = fileName.slice(0, -3);
		let raw;
		try {
			raw = stripBom(await readFile(filePath, "utf8"));
		} catch (error) {
			console.warn(`[agency-agents] 跳过无法读取的专家文件 ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
			return;
		}
		const parsed = parseFrontmatter(raw);
		if (parsed === void 0 || parsed.name === void 0 || parsed.description === void 0) return;
		if (map.has(slug)) console.warn(`[agency-agents] 专家 slug 冲突，后加载者覆盖：${slug}`);
		map.set(slug, {
			slug,
			name: parsed.name,
			description: parsed.description,
			emoji: parsed.emoji ?? "",
			division: source.division,
			persona: sanitize(parsed.body)
		});
	});
	if (map.size === 0) throw new Error(`在 root "${root}" 下未发现任何专家（*.md 文件）。请确认路径正确。`);
	return map;
}
function apply(ctx, config) {
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
	function resolveExpert(query) {
		const q = String(query).trim().toLowerCase();
		if (q.length === 0) throw new Error("expert is required");
		const values = [...experts.values()];
		const bySlug = values.find((e) => e.slug === q);
		if (bySlug !== void 0) return bySlug;
		const byName = values.find((e) => e.name.toLowerCase() === q);
		if (byName !== void 0) return byName;
		const matches = values.filter((e) => e.slug.includes(q) || e.name.toLowerCase().includes(q));
		if (matches.length === 1) return matches[0];
		if (matches.length > 1) {
			const preview = matches.slice(0, 12).map((e) => e.slug).join(", ");
			throw new Error(`Ambiguous expert "${String(query)}"; candidates: ${preview}. Use list_experts to pick an exact slug.`);
		}
		throw new Error(`No expert matched "${String(query)}". Call list_experts to see the roster.`);
	}
	function groupByDivision(withExperts) {
		const groups = /* @__PURE__ */ new Map();
		for (const expert of experts.values()) {
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
			render: (_args, value) => {
				const divisions = value.divisions;
				if (divisions.length === 0) return [{
					type: "text",
					text: "No experts available."
				}];
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
			const hasFilter = args.division !== void 0 && String(args.division).trim() !== "";
			const groups = groupByDivision(hasFilter);
			if (hasFilter) {
				const q = String(args.division).toLowerCase();
				const filtered = groups.filter((g) => {
					const division = g.division.toLowerCase();
					return division === q || division.includes(q);
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
				description: "The complete, self-contained task to give the expert. The expert does not see this conversation, so include all necessary context."
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
			if (exec.agent === void 0) throw new Error("summon_expert requires a calling agent");
			const provider = ctx.subagents.getProvider(config.provider);
			if (provider === void 0) throw new Error(`subagent provider "${config.provider}" is not registered`);
			if (!provider.capabilities.persona) throw new Error(`subagent provider "${config.provider}" does not support expert personas`);
			if (!provider.capabilities.toolFilter) throw new Error(`subagent provider "${config.provider}" cannot prevent recursive expert delegation`);
			const expert = resolveExpert(args.expert);
			const run = await ctx.subagents.start(config.provider, {
				label: `expert:${expert.slug}`,
				prompt: [{
					type: "text",
					text: String(args.task)
				}],
				parent: exec.agent,
				persona: expert.persona,
				toolFilter: { deny: ["summon_expert"] },
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
				try {
					await run.dispose();
				} catch {}
			}
		}
	}));
	ctx.systemPrompt.section({
		name: "agency:experts",
		order: 117,
		text: "## Agency expert mode\nYou have a roster of domain experts from The Agency (specialists across 17 divisions). Summon one to delegate a whole task by calling `summon_expert(expert, task)` — the expert runs as a specialist subagent with its own persona and returns the result. Call `list_experts(division?)` first to browse experts or find an exact slug. Prefer summoning an expert when a task clearly belongs to a specialist domain. A summoned expert cannot summon another Agency expert, so keep each delegation self-contained."
	});
}
//#endregion
export { Config, apply, inject, loadCatalog, name, parseFrontmatter, resolveCatalogRoot, sanitize, stripBom, truncate, unquote };
