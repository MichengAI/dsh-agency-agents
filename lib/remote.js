import { A as latestProposalSchema, B as ZH_DIVISION, D as creationResponseSchema, E as creationRequestSchema, F as AGENCY_LIBRARY_SERVICE, G as teamText, H as AGENCY_TEAM_SERVICE, I as CUSTOM_EXPERT_SLUG, L as catalogSnapshotSchema, M as formatHost, N as readHostLocale, O as validateExpertProposal, P as settingsNamespaceCompat, R as customExpertInputSchema, T as nativeTeamMemberName, U as teamInputSchema, W as teamSnapshotSchema, g as readLocalizedExpertPrompt, h as readExpertPrompt, j as storedProposalSchema, k as validateTeamProposal, t as AGENCY_PERSONA_SERVICE, z as expertEditSchema } from "./src-DhKdnfsF.js";
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
	},
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/generateDraft",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "generateDraft",
		invocation: { kind: "direct" },
		parameters: [jsonParameter("request", "CreationRequest", creationRequestSchema)],
		result: strictCodec("CreationResponse", creationResponseSchema)
	},
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/getPendingProposal",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "getPendingProposal",
		invocation: { kind: "direct" },
		parameters: [jsonParameter("id", "string", z.string().min(1).max(128))],
		result: strictCodec("PendingProposalResult", storedProposalSchema)
	},
	{
		id: "@michengai/dsh-agency-agents#agencyAgents/getLatestProposal",
		service: "agencyAgents",
		namespace: "agencyAgents",
		method: "getLatestProposal",
		invocation: { kind: "direct" },
		parameters: [jsonParameter("afterTimestamp", "number", z.number())],
		result: strictCodec("LatestProposalResult", latestProposalSchema)
	}
];
//#endregion
//#region src/creation-service.ts
function extractJsonBlock(text) {
	const match = /```(?:json)?\s*([\s\S]*?)\s*```/u.exec(text);
	if (match?.[1]) return match[1].trim();
	const firstBrace = text.indexOf("{");
	const lastBrace = text.lastIndexOf("}");
	if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) return text.slice(firstBrace, lastBrace + 1).trim();
	return text.trim();
}
function createCreationService(options) {
	return { async generateDraft(request) {
		const llm = options.getLlmRuntime();
		if (!llm) return {
			ok: false,
			error: "宿主大模型服务不可用，请在设置中配置模型或改用人工创建。"
		};
		const catalog = await options.getCatalog();
		const availableSlugs = new Set(catalog.experts.map((e) => e.slug));
		let targetProvider;
		let targetModel;
		try {
			const providers = typeof llm.listProviders === "function" ? llm.listProviders() : [];
			for (const p of providers) {
				const models = typeof llm.listModels === "function" ? await llm.listModels(p.id) : [];
				if (models.length > 0) {
					targetProvider = p.id;
					targetModel = models[0].id;
					break;
				}
			}
		} catch (cause) {
			return {
				ok: false,
				error: `获取模型列表失败: ${cause instanceof Error ? cause.message : String(cause)}`
			};
		}
		if (!targetProvider || !targetModel) return {
			ok: false,
			error: "未检测到可用的 LLM 模型路线，请先在宿主设置中启用大模型提供方。"
		};
		let systemPrompt = "";
		if (request.kind === "expert") systemPrompt = [
			"你是一名专业智能体角色架构师。请根据用户的任务或岗位需求，设计一个专业智能体专家设定。",
			"你必须严格返回一个 JSON 对象（不要输出任何额外问候或 Markdown 以外的废话），字段如下：",
			"- name: 专家名称（1~40字，不要包含@或特殊控制字符）",
			"- description: 一句话定位与核心职责（1~160字）",
			`- division: 所在分类，必须从以下键名中选择一个：[${Object.entries(ZH_DIVISION).map(([key, name]) => `${key}（${name}）`).join(", ")}]`,
			"- emoji: 一个符合角色特性的单一原生 Emoji（如 💻, 🛡️, 📊）",
			"- prompt: 专家系统提示词正文（详细定义角色定位、专业技能、执行规范、边界约束，100~4000字）"
		].join("\n");
		else systemPrompt = [
			"你是一名团队协作架构师。请根据用户的任务需求，从已有的真实专家名册中挑选 2~5 位最合适的专家组成专家团，并设计分工。",
			"【非常重要】：团队成员的 expertSlug 必须严格从下列提供的真实专家名单中挑选，绝对禁止虚构不存在的 slug！",
			"候选专家名单：",
			catalog.experts.map((e) => `- [${e.slug}] ${e.name}（${e.divisionZh || e.division}）：${e.description}`).join("\n"),
			"",
			"你必须严格返回一个 JSON 对象，字段如下：",
			"- name: 专家团名称（1~40字）",
			"- description: 一句话简介（1~160字）",
			"- tags: 场景标签数组（最多3个，每个标签不超过16字）",
			"- goal: 团队总目标（1~2000字）",
			"- constraints: 通用约束（选填，如不擅自修改代码等，不超过2000字）",
			"- deliveryRequirements: 最终交付要求（如结论报告、清单、分析等，1~2000字）",
			"- members: 成员数组（2~8人），每个成员包含：",
			"  - expertSlug: 必须是上述名单里的真实 slug",
			"  - duty: 职责摘要（不超过100字）",
			"  - instructions: 详细分工与指引（不超过2000字）",
			"  - reason: 入选理由（简要说明为什么选他，不超过100字）",
			"- examples: 任务示例数组（1~3条）",
			"- coordinatorMode: \"template\"",
			"- coordinatorTemplateId: 可选 \"general\" | \"product\" | \"technical\" | \"content\" | \"data\" | \"research\"",
			"- coordinatorTemplateVersion: 1",
			"- coordinatorPrompt: \"\""
		].join("\n");
		const messages = [{
			role: "system",
			content: systemPrompt
		}];
		if (request.messages && request.messages.length > 0) for (const m of request.messages) messages.push({
			role: m.role,
			content: m.content
		});
		messages.push({
			role: "user",
			content: request.prompt
		});
		let fullContent = "";
		try {
			const stream = (await llm.prepareCall(targetProvider, targetModel)).stream({
				provider: targetProvider,
				model: targetModel,
				messages
			});
			for await (const chunk of stream) if (chunk.type === "content" && typeof chunk.delta === "string") fullContent += chunk.delta;
			else if (chunk.type === "text" && typeof chunk.text === "string") fullContent += chunk.text;
		} catch (cause) {
			return {
				ok: false,
				error: `模型生成调用失败: ${cause instanceof Error ? cause.message : String(cause)}`
			};
		}
		let parsedJson;
		try {
			const jsonStr = extractJsonBlock(fullContent);
			parsedJson = JSON.parse(jsonStr);
		} catch {
			return {
				ok: false,
				error: "模型返回的内容不是有效的 JSON 结构，请重试或补充更明确的描述。"
			};
		}
		if (request.kind === "expert") {
			const validation = validateExpertProposal(parsedJson);
			if (!validation.ok) return {
				ok: false,
				error: validation.error
			};
			return {
				ok: true,
				expertDraft: validation.value
			};
		} else {
			const validation = validateTeamProposal(parsedJson, availableSlugs);
			if (!validation.ok) return {
				ok: false,
				error: validation.error
			};
			return {
				ok: true,
				teamDraft: validation.value,
				memberReasons: validation.memberReasons
			};
		}
	} };
}
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
	let _generateDraft_decorators;
	let _getPendingProposal_decorators;
	let _getLatestProposal_decorators;
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
			_generateDraft_decorators = [Remote("generateDraft")];
			_getPendingProposal_decorators = [Remote("getPendingProposal")];
			_getLatestProposal_decorators = [Remote("getLatestProposal")];
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
			__esDecorate(this, null, _generateDraft_decorators, {
				kind: "method",
				name: "generateDraft",
				static: false,
				private: false,
				access: {
					has: (obj) => "generateDraft" in obj,
					get: (obj) => obj.generateDraft
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getPendingProposal_decorators, {
				kind: "method",
				name: "getPendingProposal",
				static: false,
				private: false,
				access: {
					has: (obj) => "getPendingProposal" in obj,
					get: (obj) => obj.getPendingProposal
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getLatestProposal_decorators, {
				kind: "method",
				name: "getLatestProposal",
				static: false,
				private: false,
				access: {
					has: (obj) => "getLatestProposal" in obj,
					get: (obj) => obj.getLatestProposal
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
			if (!library) throw new Error(teamText(readHostLocale(this.ctx), "专家团服务不可用，请重新加载插件。"));
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
			const settings = this.ctx.settings;
			const descriptor = settings.describe().find((candidate) => candidate.ns === AGENCY_SETTINGS_NAMESPACE);
			if (descriptor === void 0) throw new Error(formatHost("zh", "error.settingsMissing"));
			const enabled = (typeof settings.get === "function" ? settings.get(AGENCY_SETTINGS_NAMESPACE) : descriptor.value)?.enabled;
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
		/** 通过自然语言对话生成专家或专家团配置草案。 */
		async generateDraft(request) {
			return createCreationService({
				getCatalog: () => this.library().catalog(),
				getLlmRuntime: () => this.ctx.get("llm"),
				locale: () => readHostLocale(this.ctx)
			}).generateDraft(request);
		}
		/** 获取暂存的专家或专家团提案，用于前端弹窗回显。 */
		async getPendingProposal(id) {
			return this.ctx.get("agencyProposalRegistry")?.get(id) ?? null;
		}
		/** 获取自某时间戳之后产生的最新已确认专家或专家团草案，支持前端自动呼出弹窗。草案打磨期不返回。 */
		async getLatestProposal(afterTimestamp) {
			return this.ctx.get("agencyProposalRegistry")?.getLatestConfirmed(afterTimestamp) ?? null;
		}
	};
})();
//#endregion
export { AgencyAgentsRemote as default, readExpertPrompt, readLocalizedExpertPrompt };
