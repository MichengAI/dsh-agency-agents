import z from "@deepseek-ai/schemastery";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { Context } from "@deepseek-ai/cordis";
//#region src/index.d.ts
declare const name = "agency-agents";
declare const inject: string[];
/** One resolved expert ready to be summoned. */
interface Expert {
  readonly slug: string;
  readonly name: string;
  readonly nameEn: string;
  readonly description: string;
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
/** Load every `<division>/**\/*.md` persona file (plus extra sources) into a slug-keyed map. Throws when root is invalid or empty. */
declare function loadCatalog(root: string, divisions: readonly string[]): Promise<Map<string, Expert>>;
/** 根据 slug 或名称解析智能体；任意多命中都必须要求调用者提供更精确的 slug。 */
declare function resolveExpert<T extends {
  readonly slug: string;
  readonly name: string;
  readonly nameEn?: string;
}>(experts: readonly T[], query: unknown): T;
/**
 * 插件自有的 Host↔Client 类型化远程通道（Typert Remote）。
 * 启用状态仍由 installSettingsSection 持久化（settings 服务），客户端不再
 * 走 api.settings（那是 Host 自有配置面、白名单对第三方硬编码封死），而是
 * 通过 `ctx.remote.agencyAgents` 读写 —— 第三方安装无需修改或重编 DSH。
 */
declare class AgencyAgentsRemote extends TypertRemoteService {
  static inject: string[];
  constructor(ctx: Context);
  /** 读取当前启用的专家 slug 列表。 */
  getEnabled(): string[];
  /** 整体替换启用的专家 slug 列表。 */
  setEnabled(enabled: string[]): Promise<void>;
}
declare function apply(ctx: Context, config: Config): void;
//#endregion
export { AgencyAgentsRemote, Config, apply, inject, loadCatalog, name, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, truncate, unquote };