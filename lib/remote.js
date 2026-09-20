import { A as formatHost, D as customExpertInputSchema, E as catalogSnapshotSchema, F as teamInputSchema, I as teamSnapshotSchema, M as settingsNamespaceCompat, O as expertEditSchema, P as AGENCY_TEAM_SERVICE, T as CUSTOM_EXPERT_SLUG, h as readLocalizedExpertPrompt, j as readHostLocale, k as nativeTeamMemberName, m as readExpertPrompt, t as AGENCY_PERSONA_SERVICE, w as AGENCY_LIBRARY_SERVICE } from "./src-DoNvSw95.js";
import { z } from "zod";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region src/remote-contract.ts
const enabledArraySchema = z.array(z.string());
const enabledStateSchema = z.object({
	enabled: enabledArraySchema,
	revision: z.number().int().min(0)
});
const expertPromptSchema = z.object({ prompt: z.string() });
/**
* alpha.1 及更早宿主读 `codec.schema.parse`；alpha.2 只接受 `codec.create()`。
* 两套字段一起带上，才能在同一 peer 范围内挂载 Remote。
*/
function strictCodec(typeSymbol, schema) {
	return {
		mode: "strict",
		typeSymbol,
		create: () => schema,
		schema
	};
}
function jsonParameter(name, typeSymbol, schema) {
	return {
		name,
		wire: name,
		source: "json",
		codec: strictCodec(typeSymbol, schema)
	};
}
/** 新接口仍沿用宿主 Typert 严格参数校验与既有鉴权入口。 */
function catalogMethod(method, parameters) {
	return {
		id: `@michengai/dsh-agency-agents#agencyAgents/${method}`,
		service: "agencyAgents",
		namespace: "agencyAgents",
		method,
		invocation: { kind: "direct" },
		parameters,
		result: strictCodec("AgencyAgentsCatalog", catalogSnapshotSchema)
	};
}
const revisionParameter = jsonParameter("expectedRevision", "number", z.number().int().min(0));
const customSlugParameter = jsonParameter("slug", "string", z.string().regex(CUSTOM_EXPERT_SLUG));
/** Host 与 Client 共用的专家启用状态 Remote 严格契约。 */
const AGENCY_AGENTS_DESCRIPTORS = [
	...[
		{
			method: "getTeams",
			parameters: []
		},
		{
			method: "saveTeam",
			parameters: [
				jsonParameter("team", "ExpertTeamInput", teamInputSchema),
				jsonParameter("enabled", "boolean", z.boolean()),
				revisionParameter
			]
		},
		{
			method: "setTeamEnabled",
			parameters: [
				jsonParameter("id", "string", z.string().min(1).max(128)),
				jsonParameter("enabled", "boolean", z.boolean()),
				revisionParameter
			]
		},
		{
			method: "deleteTeam",
			parameters: [jsonParameter("id", "string", z.string().min(1).max(128)), revisionParameter]
		}
	].map(({ method, parameters }) => ({
		id: `@michengai/dsh-agency-agents#agencyAgents/${method}`,
		service: "agencyAgents",
		namespace: "agencyAgents",
		method,
		invocation: { kind: "direct" },
		parameters,
		result: strictCodec("AgencyTeamsSnapshot", teamSnapshotSchema)
	})),
	catalogMethod("getCatalog", []),
	catalogMethod("saveCustomExpert", [
		jsonParameter("expert", "CustomExpertInput", customExpertInputSchema),
		jsonParameter("enabled", "boolean", z.boolean()),
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
		result: strictCodec("CustomExpertInput", expertEditSchema)
	},
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/getEnabled",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "getEnabled",
		invocation: { kind: "direct" },
		parameters: [],
		result: strictCodec("AgencyAgentsEnabledState", enabledStateSchema)
	},
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/setEnabled",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "setEnabled",
		invocation: { kind: "direct" },
		parameters: [jsonParameter("enabled", "string[]", enabledArraySchema), jsonParameter("expectedRevision", "number", z.number().int().min(0))],
		result: strictCodec("AgencyAgentsEnabledState", enabledStateSchema)
	},
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/getPrompt",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "getPrompt",
		invocation: { kind: "direct" },
		parameters: [jsonParameter("slug", "string", z.string().min(1).max(128)), jsonParameter("division", "string", z.string().min(1).max(64))],
		result: strictCodec("AgencyAgentsPrompt", expertPromptSchema)
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
	let _getTeams_decorators;
	let _saveTeam_decorators;
	let _setTeamEnabled_decorators;
	let _deleteTeam_decorators;
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
			_getTeams_decorators = [Remote("getTeams")];
			_saveTeam_decorators = [Remote("saveTeam")];
			_setTeamEnabled_decorators = [Remote("setTeamEnabled")];
			_deleteTeam_decorators = [Remote("deleteTeam")];
			_getCatalog_decorators = [Remote("getCatalog")];
			_getCustomExpert_decorators = [Remote("getCustomExpert")];
			_saveCustomExpert_decorators = [Remote("saveCustomExpert")];
			_deleteCustomExpert_decorators = [Remote("deleteCustomExpert")];
			_getEnabled_decorators = [Remote("getEnabled")];
			_setEnabled_decorators = [Remote("setEnabled")];
			_getPrompt_decorators = [Remote("getPrompt")];
			__esDecorate(this, null, _getTeams_decorators, {
				kind: "method",
				name: "getTeams",
				static: false,
				private: false,
				access: {
					has: (obj) => "getTeams" in obj,
					get: (obj) => obj.getTeams
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _saveTeam_decorators, {
				kind: "method",
				name: "saveTeam",
				static: false,
				private: false,
				access: {
					has: (obj) => "saveTeam" in obj,
					get: (obj) => obj.saveTeam
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setTeamEnabled_decorators, {
				kind: "method",
				name: "setTeamEnabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "setTeamEnabled" in obj,
					get: (obj) => obj.setTeamEnabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _deleteTeam_decorators, {
				kind: "method",
				name: "deleteTeam",
				static: false,
				private: false,
				access: {
					has: (obj) => "deleteTeam" in obj,
					get: (obj) => obj.deleteTeam
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
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
		teams() {
			const library = this.ctx.get(AGENCY_TEAM_SERVICE);
			if (!library) throw new Error("专家团服务不可用，请重新加载插件。");
			return library;
		}
		async getTeams() {
			const snapshot = await this.teams().snapshot();
			const engine = this.ctx.get("agencyAgentsTeamEngine");
			const nativeMembers = Object.fromEntries(snapshot.teams.flatMap((team) => team.members.map((member) => [nativeTeamMemberName(team.id, member.expertSlug), member.expertSlug])));
			return {
				...snapshot,
				nativeMembers,
				...engine ? { engine: engine() } : {}
			};
		}
		async saveTeam(team, enabled, expectedRevision) {
			return this.teams().save(team, enabled, expectedRevision);
		}
		async setTeamEnabled(id, enabled, expectedRevision) {
			return this.teams().setEnabled(id, enabled, expectedRevision);
		}
		async deleteTeam(id, expectedRevision) {
			return this.teams().remove(id, expectedRevision);
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
