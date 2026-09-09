import { A as readHostLocale, D as customExpertInputSchema, E as catalogSnapshotSchema, O as expertEditSchema, T as CUSTOM_EXPERT_SLUG, h as readLocalizedExpertPrompt, j as settingsNamespaceCompat, k as formatHost, m as readExpertPrompt, t as AGENCY_PERSONA_SERVICE, w as AGENCY_LIBRARY_SERVICE } from "./src-Di6THeMW.js";
import { z } from "zod";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region src/remote-contract.ts
const enabledArraySchema = z.array(z.string());
const enabledStateSchema = z.object({
	enabled: enabledArraySchema,
	revision: z.number().int().min(0)
});
const expertPromptSchema = z.object({ prompt: z.string() });
/** 新接口仍沿用宿主 Typert 严格参数校验与既有鉴权入口。 */
function catalogMethod(method, parameters) {
	return {
		id: `@michengai/dsh-agency-agents#agencyAgents/${method}`,
		service: "agencyAgents",
		namespace: "agencyAgents",
		method,
		invocation: { kind: "direct" },
		parameters,
		result: {
			mode: "strict",
			typeSymbol: "AgencyAgentsCatalog",
			schema: catalogSnapshotSchema
		}
	};
}
const revisionParameter = {
	name: "expectedRevision",
	wire: "expectedRevision",
	source: "json",
	codec: {
		mode: "strict",
		typeSymbol: "number",
		schema: z.number().int().min(0)
	}
};
const customSlugParameter = {
	name: "slug",
	wire: "slug",
	source: "json",
	codec: {
		mode: "strict",
		typeSymbol: "string",
		schema: z.string().regex(CUSTOM_EXPERT_SLUG)
	}
};
/** Host 与 Client 共用的专家启用状态 Remote 严格契约。 */
const AGENCY_AGENTS_DESCRIPTORS = [
	catalogMethod("getCatalog", []),
	catalogMethod("saveCustomExpert", [
		{
			name: "expert",
			wire: "expert",
			source: "json",
			codec: {
				mode: "strict",
				typeSymbol: "CustomExpertInput",
				schema: customExpertInputSchema
			}
		},
		{
			name: "enabled",
			wire: "enabled",
			source: "json",
			codec: {
				mode: "strict",
				typeSymbol: "boolean",
				schema: z.boolean()
			}
		},
		revisionParameter
	]),
	catalogMethod("deleteCustomExpert", [customSlugParameter, revisionParameter]),
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/getCustomExpert",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "getCustomExpert",
		invocation: { kind: "direct" },
		parameters: [customSlugParameter],
		result: {
			mode: "strict",
			typeSymbol: "CustomExpertInput",
			schema: expertEditSchema
		}
	},
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
function personaSource(ctx) {
	try {
		const source = ctx.get(AGENCY_PERSONA_SERVICE);
		if (source !== void 0) return source;
	} catch (cause) {
		throw new Error(formatHost(readHostLocale(ctx), "error.personaSourceUnavailable"), { cause });
	}
	throw new Error(formatHost(readHostLocale(ctx), "error.personaSourceUnavailable"));
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
	let _getCatalog_decorators;
	let _getCustomExpert_decorators;
	let _saveCustomExpert_decorators;
	let _deleteCustomExpert_decorators;
	let _getEnabled_decorators;
	let _setEnabled_decorators;
	let _getPrompt_decorators;
	return class AgencyAgentsRemote extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_getCatalog_decorators = [Remote("getCatalog")];
			_getCustomExpert_decorators = [Remote("getCustomExpert")];
			_saveCustomExpert_decorators = [Remote("saveCustomExpert")];
			_deleteCustomExpert_decorators = [Remote("deleteCustomExpert")];
			_getEnabled_decorators = [Remote("getEnabled")];
			_setEnabled_decorators = [Remote("setEnabled")];
			_getPrompt_decorators = [Remote("getPrompt")];
			__esDecorate(this, null, _getCatalog_decorators, {
				kind: "method",
				name: "getCatalog",
				static: false,
				private: false,
				access: {
					has: (obj) => "getCatalog" in obj,
					get: (obj) => obj.getCatalog
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getCustomExpert_decorators, {
				kind: "method",
				name: "getCustomExpert",
				static: false,
				private: false,
				access: {
					has: (obj) => "getCustomExpert" in obj,
					get: (obj) => obj.getCustomExpert
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _saveCustomExpert_decorators, {
				kind: "method",
				name: "saveCustomExpert",
				static: false,
				private: false,
				access: {
					has: (obj) => "saveCustomExpert" in obj,
					get: (obj) => obj.saveCustomExpert
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _deleteCustomExpert_decorators, {
				kind: "method",
				name: "deleteCustomExpert",
				static: false,
				private: false,
				access: {
					has: (obj) => "deleteCustomExpert" in obj,
					get: (obj) => obj.deleteCustomExpert
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
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
		library() {
			const library = this.ctx.get(AGENCY_LIBRARY_SERVICE);
			if (library === void 0) throw new Error(formatHost(readHostLocale(this.ctx), "error.personaSourceUnavailable"));
			return library;
		}
		/** 返回动态名册，不预加载任何专家提示词正文。 */
		async getCatalog() {
			return this.library().catalog();
		}
		async getCustomExpert(slug) {
			const { deleted: _deleted, wasEnabled: _wasEnabled, ...expert } = await this.library().getCustom(slug);
			return expert;
		}
		/** 新建或更新自定义专家，同时提交启用状态；过期修订号拒绝写入。 */
		async saveCustomExpert(expert, enabled, expectedRevision) {
			return this.library().saveCustom(expert, enabled, expectedRevision);
		}
		async deleteCustomExpert(slug, expectedRevision) {
			return this.library().deleteCustom(slug, expectedRevision);
		}
		/** 返回配置中记录的启用项以兼容旧调用方；实际可召唤项请读取 getCatalog().enabled。 */
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
			return this.library().setEnabled(enabled, expectedRevision);
		}
		/** 按需读取一位专家的 persona 正文，避免将完整提示词随客户端名册预加载。 */
		async getPrompt(slug, division) {
			return personaSource(this.ctx).getPrompt(slug, division, readHostLocale(this.ctx));
		}
	};
})();
//#endregion
export { AgencyAgentsRemote as default, readExpertPrompt, readLocalizedExpertPrompt };
