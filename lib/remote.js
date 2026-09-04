import { S as settingsNamespaceCompat, b as formatHost, d as parseFrontmatter, f as resolveCatalogRoot, h as stripBom, n as DEFAULT_DIVISIONS, x as readHostLocale } from "./src-DIwX0ltA.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { z } from "zod";
//#region src/remote-contract.ts
const enabledArraySchema = z.array(z.string());
const enabledStateSchema = z.object({
	enabled: enabledArraySchema,
	revision: z.number().int().min(0)
});
const expertPromptSchema = z.object({ prompt: z.string() });
/** Host 与 Client 共用的专家启用状态 Remote 严格契约。 */
const AGENCY_AGENTS_DESCRIPTORS = [
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
				schema: z.number().int().min(0)
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
				schema: z.string().min(1).max(128)
			}
		}, {
			name: "division",
			wire: "division",
			source: "json",
			codec: {
				mode: "strict",
				typeSymbol: "string",
				schema: z.string().min(1).max(64)
			}
		}],
		result: {
			mode: "strict",
			typeSymbol: "AgencyAgentsPrompt",
			schema: expertPromptSchema
		}
	}
];
//#endregion
//#region src/remote.ts
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
const AGENCY_SETTINGS_NAMESPACE = settingsNamespaceCompat("agency-agents");
const EXPERT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIVISIONS = new Set(DEFAULT_DIVISIONS);
const BUNDLED_CHINESE_ROOT = fileURLToPath(new URL("../assets/agency-agents-zh/", import.meta.url));
/**
* 只读取内置名册中的 persona 正文。先限制分区与 slug，避免 Remote 参数参与路径穿越。
* Remote 没有插件 Config 注入，因此与浏览器名册保持一致，使用环境变量或随包目录。
*/
async function readExpertPrompt(root, slug, division) {
	if (!DIVISIONS.has(division) || !EXPERT_SLUG_PATTERN.test(slug)) throw new Error("无效的专家提示词请求。");
	let raw;
	try {
		raw = stripBom(await readFile(join(root, division, `${slug}.md`), "utf8"));
	} catch {
		throw new Error("未找到专家提示词。");
	}
	const parsed = parseFrontmatter(raw);
	if (parsed === void 0 || parsed.name === void 0 || parsed.description === void 0 || parsed.body === "") throw new Error("专家提示词格式无效。");
	return { prompt: parsed.body };
}
/** 按界面语言读取 persona；中文译文缺失时回退英文原文。 */
async function readLocalizedExpertPrompt(englishRoot, chineseRoot, slug, division, locale) {
	if (locale === "en") return readExpertPrompt(englishRoot, slug, division);
	try {
		return await readExpertPrompt(chineseRoot, slug, division);
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "未找到专家提示词。") throw error;
		return readExpertPrompt(englishRoot, slug, division);
	}
}
/**
* Host 严格描述符。Gateway 优先读取它，避免启动期间的 SRC 扫描缓存遗漏
* 后加载的外部插件服务。
*/
const TYPERT = {
	package: "@michengai/dsh-agency-agents",
	face: "host",
	schemas: [],
	model: {
		services: [],
		events: [],
		objects: []
	},
	invocations: AGENCY_AGENTS_DESCRIPTORS
};
let AgencyAgentsRemote = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _getEnabled_decorators;
	let _setEnabled_decorators;
	let _getPrompt_decorators;
	return class AgencyAgentsRemote extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_getEnabled_decorators = [Remote("getEnabled")];
			_setEnabled_decorators = [Remote("setEnabled")];
			_getPrompt_decorators = [Remote("getPrompt")];
			__esDecorate(this, null, _getEnabled_decorators, {
				kind: "method",
				name: "getEnabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "getEnabled" in obj,
					get: (obj) => obj.getEnabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setEnabled_decorators, {
				kind: "method",
				name: "setEnabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "setEnabled" in obj,
					get: (obj) => obj.setEnabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getPrompt_decorators, {
				kind: "method",
				name: "getPrompt",
				static: false,
				private: false,
				access: {
					has: (obj) => "getPrompt" in obj,
					get: (obj) => obj.getPrompt
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["settings", "typert"];
		constructor(ctx) {
			super(ctx, "agencyAgents");
			__runInitializers(this, _instanceExtraInitializers);
			this.ctx.typert.register(TYPERT);
		}
		/** 读取当前启用的专家 slug 列表。 */
		getEnabled() {
			const enabled = this.ctx.settings.get(AGENCY_SETTINGS_NAMESPACE)?.enabled;
			const descriptor = this.ctx.settings.describe().find((candidate) => candidate.ns === AGENCY_SETTINGS_NAMESPACE);
			if (descriptor === void 0) throw new Error(formatHost("zh", "error.settingsMissing"));
			return {
				enabled: Array.isArray(enabled) ? enabled.filter((slug) => typeof slug === "string") : [],
				revision: descriptor.revision
			};
		}
		/** 整体替换启用的专家 slug 列表。 */
		async setEnabled(enabled, expectedRevision) {
			await this.ctx.settings.mutate(AGENCY_SETTINGS_NAMESPACE, [{
				op: "set",
				path: ["enabled"],
				value: enabled
			}], expectedRevision);
			return this.getEnabled();
		}
		/** 按需读取一位专家的 persona 正文，避免将完整提示词随客户端名册预加载。 */
		async getPrompt(slug, division) {
			return readLocalizedExpertPrompt(resolveCatalogRoot(""), BUNDLED_CHINESE_ROOT, slug, division, readHostLocale(this.ctx));
		}
	};
})();
//#endregion
export { AgencyAgentsRemote as default, readExpertPrompt, readLocalizedExpertPrompt };
