import z from "@deepseek-ai/schemastery";
import "@deepseek-ai/dsh-settings";
import { Context } from "@deepseek-ai/cordis";
//#region src/names.d.ts
/** 智能体 slug（文件名去 .md）→ 中文名（现实岗位）。缺省时回退英文 frontmatter name。 */
declare const ZH_NAME: Readonly<Record<string, string>>;
//#endregion
//#region src/i18n.d.ts
/** 与 DSH locale 插件一致的语言标识。 */
type LocaleId = 'zh' | 'en';
//#endregion
//#region src/index.d.ts
declare const name = "agency-agents";
declare const inject: string[];
/** 一次批量召唤的专家数量上限，避免无界并行拖垮宿主。 */
declare const SUMMON_EXPERTS_MAX = 8;
/** 批量召唤的并发上限。 */
declare const SUMMON_EXPERTS_CONCURRENCY = 4;
/** 单条任务的 Unicode 码点上限。 */
declare const SUMMON_TASK_MAX_CHARS = 8000;
/** 已校验的批量召唤条目。 */
interface SummonExpertSpec {
  readonly expert: unknown;
  readonly task: string;
}
/** 批量召唤中单个专家的结果。 */
interface SummonExpertItemResult {
  readonly expert: string;
  readonly ok: boolean;
  readonly answer: string;
  readonly error?: string;
}
/** 校验批量召唤入参：非空、数量上限、专家名非空、任务非空且不超过码点上限。 */
declare function validateSummonSpecs(specs: unknown, locale: LocaleId): SummonExpertSpec[];
/** 受限并发地映射异步任务，结果顺序与输入一致。 */
declare function mapPool<T, R>(items: readonly T[], concurrency: number, mapper: (item: T, index: number) => Promise<R>): Promise<R[]>;
/** 把单次专家运行结果收成批量条目；失败时保留原始查询作为专家名。 */
declare function toSummonItemResult(query: unknown, result: {
  expert: string;
  answer: string;
} | Error): SummonExpertItemResult;
/** One resolved expert ready to be summoned. */
interface Expert {
  readonly slug: string;
  readonly name: string;
  readonly nameEn: string;
  readonly description: string;
  readonly descriptionEn: string;
  readonly emoji: string;
  readonly division: string;
  readonly divisionZh: string;
  readonly persona: string;
}
/** Plugin config: the persona root, the subagent provider, and the divisions to scan. */
interface Config {
  /** Directory holding the `division/*.md` persona files. */
  root: string;
  /** `ctx.subagents` provider name (default `spawn`; `fork` also supports `persona`). */
  provider: string;
  /** Division directory names to scan under `root`. */
  divisions: string[];
  /** 可选的正整数绝对子代理深度上限；未设置时沿用 provider 的默认行为。 */
  maxDepth?: number;
}
declare const Config: z<Config>;
/** 解析智能体根目录：显式配置优先，其次读取环境变量，最后使用包内资产。 */
declare function resolveCatalogRoot(root: string): string;
interface Frontmatter {
  name?: string;
  description?: string;
  descriptionEn?: string;
  emoji?: string;
  body: string;
}
/** Neutralize strict `{{...}}` template interpolation inside expert prose. */
declare function sanitize(text: string): string;
/** 去除 UTF-8 BOM，避免 `^---` 因文件头部的零宽字符失配。 */
declare function stripBom(text: string): string;
/** 剥离字段值首尾的成对引号，保留引号内部的 #、冒号等字符。 */
declare function unquote(value: string): string;
/** 将超长文本截断到指定长度并追加省略号。 */
declare function truncate(text: string, limit: number): string;
/** Parse the `key: value` frontmatter block of one agency agent file. */
declare function parseFrontmatter(raw: string): Frontmatter | undefined;
/** 加载已配置分区中的所有 persona，按 slug 建立索引；目录无效或为空时抛出明确错误。 */
declare function loadCatalog(root: string, divisions: readonly string[]): Promise<Map<string, Expert>>;
/** 仅按本地化名称解析智能体；名称重名时拒绝调用，防止召唤到错误角色。 */
declare function resolveExpert<T extends {
  readonly slug: string;
  readonly name: string;
  readonly nameEn?: string;
}>(experts: readonly T[], query: unknown, locale?: LocaleId): T;
declare function apply(ctx: Context, config: Config): void;
//#endregion
export { Config, SUMMON_EXPERTS_CONCURRENCY, SUMMON_EXPERTS_MAX, SUMMON_TASK_MAX_CHARS, SummonExpertItemResult, SummonExpertSpec, ZH_NAME, apply, inject, loadCatalog, mapPool, name, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, toSummonItemResult, truncate, unquote, validateSummonSpecs };