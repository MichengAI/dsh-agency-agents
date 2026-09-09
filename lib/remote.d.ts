import { _ as readExpertPrompt, v as readLocalizedExpertPrompt } from "./index-BXQQzToz.js";
import { z } from "zod";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { Context } from "@deepseek-ai/cordis";
//#region src/expert-contract.d.ts
declare const customExpertInputSchema: z.ZodObject<{
  slug: z.ZodOptional<z.ZodString>;
  name: z.ZodString;
  description: z.ZodString;
  division: z.ZodString;
  emoji: z.ZodPipe<z.ZodDefault<z.ZodString>, z.ZodTransform<string, string>>;
  avatar: z.ZodDefault<z.ZodNumber>;
  prompt: z.ZodString;
}, z.core.$strict>;
type CustomExpertInput = z.input<typeof customExpertInputSchema>;
declare const catalogSnapshotSchema: z.ZodObject<{
  experts: z.ZodArray<z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    nameEn: z.ZodString;
    description: z.ZodString;
    descriptionEn: z.ZodString;
    emoji: z.ZodString;
    division: z.ZodString;
    divisionZh: z.ZodString;
    conflict: z.ZodOptional<z.ZodBoolean>;
    custom: z.ZodDefault<z.ZodBoolean>;
    avatar: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  enabled: z.ZodArray<z.ZodString>;
  revision: z.ZodNumber;
}, z.core.$strip>;
type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>;
//#endregion
//#region src/remote.d.ts
/** 供客户端读取和保存已启用专家的顶层 Host Remote 服务。 */
declare class AgencyAgentsRemote extends TypertRemoteService {
  static inject: string[];
  constructor(ctx: Context);
  private library;
  /** 返回动态名册，不预加载任何专家提示词正文。 */
  getCatalog(): Promise<CatalogSnapshot>;
  getCustomExpert(slug: string): Promise<CustomExpertInput>;
  /** 新建或更新自定义专家，同时提交启用状态；过期修订号拒绝写入。 */
  saveCustomExpert(expert: CustomExpertInput, enabled: boolean, expectedRevision: number): Promise<CatalogSnapshot>;
  deleteCustomExpert(slug: string, expectedRevision: number): Promise<CatalogSnapshot>;
  /** 读取当前启用的专家 slug 列表。 */
  getEnabled(): {
    enabled: string[];
    revision: number;
  };
  /** 整体替换启用的专家 slug 列表。 */
  setEnabled(enabled: string[], expectedRevision: number): Promise<{
    enabled: string[];
    revision: number;
  }>;
  /** 按需读取一位专家的 persona 正文，避免将完整提示词随客户端名册预加载。 */
  getPrompt(slug: string, division: string): Promise<{
    prompt: string;
  }>;
}
//#endregion
export { AgencyAgentsRemote as default, readExpertPrompt, readLocalizedExpertPrompt };