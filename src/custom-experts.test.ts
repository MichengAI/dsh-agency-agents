import { describe, expect, it } from "vitest";
import { buildExpertReference } from "./client/index.js";
import { Context } from "@deepseek-ai/cordis";
import {
  SettingsProvider,
  type SettingsNamespace,
} from "@deepseek-ai/dsh-settings";
import {
  agencySettingsSchema,
  createExpertLibrary,
  validateAgencySettings,
  type AgencySettings,
} from "./expert-library.js";
import {
  customExpertInputSchema,
  isExpertEmoji,
  type ExpertSummary,
} from "./expert-contract.js";
import { settingsNamespaceCompat } from "./settings-compat.js";
import { apply } from "./index.js";
import AgencyAgentsRemote from "./remote.js";
import { acceptCatalog, refreshCatalog } from "./client/catalog.js";
import type { AgencyCatalogRemote } from "./client/remote.js";
import type { CatalogSnapshot } from "./expert-contract.js";
import type { RemoteResult } from "@deepseek-ai/dsh-typert-protocol";

class TestSettings extends SettingsProvider {
  readonly writable = true;
  disk: Record<string, unknown> = {};
  fail = false;
  protected async load(): Promise<Record<string, unknown>> {
    return this.disk;
  }
  protected async persist(
    ns: SettingsNamespace,
    section: Record<string, unknown>,
  ): Promise<void> {
    if (this.fail) throw new Error("disk full");
    this.disk[ns] = structuredClone(section);
  }
  restore(document: Record<string, unknown>): void {
    this.publish(document);
  }
}
const builtin: ExpertSummary = {
  slug: "builtin-reviewer",
  name: "审查员",
  nameEn: "Reviewer",
  description: "代码审查",
  descriptionEn: "",
  division: "engineering",
  divisionZh: "工程",
  emoji: "🔎",
  custom: false,
};
const input = {
  name: "租赁业务顾问",
  description: "订单与运营建议",
  division: "specialized",
  emoji: "📦",
  avatar: 0,
  prompt: "请按租赁业务规则分析，不编造事实。",
};
function setup(
  document: Record<string, unknown> = {
    "agency-agents": { enabled: ["builtin-reviewer"] },
  },
) {
  const settings = new TestSettings(new Context());
  settings.restore(document);
  const ns = settingsNamespaceCompat("agency-agents");
  settings.register(ns, agencySettingsSchema, {
    validate: validateAgencySettings,
  });
  const library = createExpertLibrary(
    async () => [builtin],
    {
      read: () => settings.get(ns) as AgencySettings,
      revision: () =>
        settings.describe().find((item) => item.ns === ns)!.revision,
      mutate: (ops, revision) => settings.mutate(ns, ops, revision),
    },
    ["engineering", "specialized"],
    () => "zh",
  );
  return { settings, library };
}

describe("自定义专家 Host 存储", () => {
  it("兼容旧 enabled 配置；新建、启用及重启恢复来自同一持久化文档", async () => {
    const { library, settings } = setup();
    const before = await library.catalog();
    expect(before.enabled).toEqual(["builtin-reviewer"]);
    const created = await library.saveCustom(input, true, before.revision);
    const expert = created.experts.find((item) => item.custom)!;
    expect(expert.emoji).toBe("📦");
    expect(created.enabled).toEqual(["builtin-reviewer", expert.slug]);
    expect(expert).not.toHaveProperty("prompt");
    expect(await library.getCustom(expert.slug)).toMatchObject({
      prompt: input.prompt,
    });
    const restored = setup(settings.disk);
    expect((await restored.library.catalog()).experts).toEqual(created.experts);
    expect((await restored.library.catalog()).enabled).toEqual(created.enabled);
  });

  it("并发保存只接受一个修订号，不丢失另一窗口已提交的修改", async () => {
    const { library } = setup();
    const { revision } = await library.catalog();
    const result = await Promise.allSettled([
      library.saveCustom(input, true, revision),
      library.saveCustom({ ...input, name: "另一位顾问" }, true, revision),
    ]);
    expect(result.filter((item) => item.status === "fulfilled")).toHaveLength(
      1,
    );
    expect(
      (await library.catalog()).experts.filter((item) => item.custom),
    ).toHaveLength(1);
  });

  it("持久化失败时专家和启用状态均不变化，后续写入仍可恢复", async () => {
    const { library, settings } = setup();
    const before = await library.catalog();
    settings.fail = true;
    await expect(
      library.saveCustom(input, true, before.revision),
    ).rejects.toThrow("disk full");
    expect(await library.catalog()).toEqual(before);
    settings.fail = false;
    await expect(
      library.saveCustom(input, false, before.revision),
    ).resolves.toMatchObject({ enabled: ["builtin-reviewer"] });
  });

  it("拒绝内置重名、无效分类与伪造编辑标识", async () => {
    const { library } = setup();
    const { revision } = await library.catalog();
    await expect(
      library.saveCustom({ ...input, name: " reviewer " }, true, revision),
    ).rejects.toThrow("名称");
    await expect(
      library.saveCustom({ ...input, division: "unknown" }, true, revision),
    ).rejects.toThrow("分类");
    await expect(
      library.saveCustom(
        { ...input, slug: "custom-00000000-0000-0000-0000-000000000000" },
        true,
        revision,
      ),
    ).rejects.toThrow("不存在");
    await expect(library.deleteCustom(builtin.slug, revision)).rejects.toThrow(
      "不可直接编辑",
    );
  });

  it("改名保留 ID；删除阻止读取和启用，撤销恢复原 Emoji 与启用状态", async () => {
    const { library } = setup();
    const created = await library.saveCustom(
      input,
      true,
      (await library.catalog()).revision,
    );
    const slug = created.experts.find((item) => item.custom)!.slug;
    const renamed = await library.saveCustom(
      { ...input, slug, name: "租后服务顾问", emoji: "👩🏽‍💻" },
      true,
      created.revision,
    );
    expect(renamed.experts.find((item) => item.custom)?.slug).toBe(slug);
    const deleted = await library.deleteCustom(slug, renamed.revision);
    expect(deleted.enabled).not.toContain(slug);
    await expect(library.getCustom(slug)).rejects.toThrow("已删除");
    const restored = await library.restoreCustom(slug, deleted.revision);
    expect(restored.enabled).toContain(slug);
    expect(restored.experts.find((item) => item.slug === slug)).toMatchObject({
      name: "租后服务顾问",
      emoji: "👩🏽‍💻",
    });
  });
});

describe("召唤 Emoji 校验", () => {
  it.each(["📦", "👩🏽‍💻", "🇨🇳", "1️⃣", "❤️"])(
    "接受完整单个 Emoji %s",
    (value) => {
      expect(isExpertEmoji(value)).toBe(true);
    },
  );
  it.each(["hello", "📦📦", "<script>", "a📦", "\n📦"])(
    "拒绝多字符或非 Emoji %s",
    (value) => {
      expect(isExpertEmoji(value)).toBe(false);
    },
  );
  it("空 Emoji 回退；名字不允许注入新的 @ 引用或换行", () => {
    expect(customExpertInputSchema.parse({ ...input, emoji: "" }).emoji).toBe(
      "🧩",
    );
    expect(
      customExpertInputSchema.safeParse({ ...input, name: "顾问\n@工程师" })
        .success,
    ).toBe(false);
  });
});

describe("自定义专家召唤标签", () => {
  it("标签与内置专家一致，使用统一图标和纯名称", () => {
    const expert = {
      slug: "custom-example",
      name: "租赁业务顾问",
      nameEn: "租赁业务顾问",
      division: "specialized",
      emoji: "📦",
      custom: true,
    };
    const reference = buildExpertReference(expert, "zh");
    expect(reference.label).toBe("租赁业务顾问");
    expect(reference.appearance).toBe("session");
    expect(reference.clipboardText).toBe("@租赁业务顾问\u00a0");
  });

  it("空 Emoji 也不在召唤标签中添加默认图标", () => {
    const expert = {
      slug: "custom-example",
      name: "顾问",
      nameEn: "顾问",
      division: "specialized",
      emoji: "",
      custom: true,
    };
    expect(buildExpertReference(expert, "en").label).toBe("顾问");
  });
});

describe("真实 Host 与 Remote 集成", () => {
  it("通过 Remote 新建后立即被 list 与 summon 识别，停用和删除后拒绝委派", async () => {
    const settings = new TestSettings(new Context());
    settings.restore({ "agency-agents": { enabled: [] } });
    const services = new Map<string, unknown>();
    const tools = new Map<
      string,
      { execute(args: unknown, exec?: unknown): Promise<unknown> }
    >();
    const starts: Record<string, unknown>[] = [];
    const ctx = {
      settings,
      effect: () => () => {},
      inject: (_deps: unknown, callback: (ctx: unknown) => void) =>
        callback(ctx),
      reflect: {
        provide: (key: string, value: unknown) => services.set(key, value),
      },
      get: (key: string) => services.get(key),
      typert: { register: () => {} },
      tools: {
        register: (tool: {
          name: string;
          execute(args: unknown, exec?: unknown): Promise<unknown>;
        }) => tools.set(tool.name, tool),
      },
      systemPrompt: { section: () => {} },
      subagents: {
        getProvider: () => ({
          capabilities: { persona: true, toolFilter: true },
        }),
        start: async (_provider: string, options: Record<string, unknown>) => {
          starts.push(options);
          return {
            result: Promise.resolve({
              output: [{ type: "text", text: "租赁建议" }],
              stopReason: "completed",
            }),
            dispose: async () => {},
          };
        },
      },
    } as unknown as Context;
    apply(ctx, { root: "", provider: "spawn", divisions: ["engineering"] });
    const remote = new AgencyAgentsRemote(ctx);
    const initial = await remote.getCatalog();
    const saved = await remote.saveCustomExpert(input, true, initial.revision);
    const slug = saved.experts.find((expert) => expert.custom)!.slug;
    expect(await remote.getPrompt(slug, input.division)).toEqual({
      prompt: input.prompt,
    });
    expect(
      await tools.get("list_experts")!.execute({ division: input.division }),
    ).toMatchObject({ total: 1 });
    expect(
      await tools
        .get("summon_expert")!
        .execute({ expert: input.name, task: "分析租赁业务" }, { agent: {} }),
    ).toEqual({ expert: input.name, answer: "租赁建议" });
    expect(starts).toHaveLength(1);
    expect(starts[0]).toMatchObject({
      persona: input.prompt,
      label: `expert:${slug}`,
      toolFilter: { deny: ["summon_expert", "summon_experts", "list_experts"] },
    });
    const disabled = await remote.setEnabled([], saved.revision);
    await expect(
      tools
        .get("summon_expert")!
        .execute({ expert: input.name, task: "分析" }, { agent: {} }),
    ).rejects.toThrow();
    await remote.deleteCustomExpert(slug, disabled.revision);
    await expect(
      tools
        .get("summon_expert")!
        .execute({ expert: input.name, task: "分析" }, { agent: {} }),
    ).rejects.toThrow();
    expect(starts).toHaveLength(1);
  });
});

describe("动态名册异步一致性", () => {
  it("旧查询不覆盖保存结果，重启后的低修订号仍可刷新", async () => {
    let resolve!: (result: RemoteResult<CatalogSnapshot>) => void;
    const remote = {
      getCatalog: () =>
        new Promise<RemoteResult<CatalogSnapshot>>((done) => {
          resolve = done;
        }),
    } as AgencyCatalogRemote;
    const pending = refreshCatalog(remote);
    expect(refreshCatalog(remote)).toBe(pending);
    acceptCatalog(remote, {
      experts: [builtin],
      enabled: [builtin.slug],
      revision: 8,
    });
    resolve({ ok: true, value: { experts: [], enabled: [], revision: 7 } });
    expect((await pending).revision).toBe(8);
    const restarted = refreshCatalog(remote);
    resolve({ ok: true, value: { experts: [], enabled: [], revision: 0 } });
    expect((await restarted).experts).toEqual([]);
    expect((await restarted).revision).toBe(0);
  });
});
