import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { Context } from "@deepseek-ai/cordis";
//#region src/remote.d.ts
/**
 * 只读取内置名册中的 persona 正文。先限制分区与 slug，避免 Remote 参数参与路径穿越。
 * Remote 没有插件 Config 注入，因此与浏览器名册保持一致，使用环境变量或随包目录。
 */
declare function readExpertPrompt(root: string, slug: string, division: string): Promise<{
  prompt: string;
}>;
/** 按界面语言读取 persona；中文译文缺失时回退英文原文。 */
declare function readLocalizedExpertPrompt(englishRoot: string, chineseRoot: string, slug: string, division: string, locale: 'zh' | 'en'): Promise<{
  prompt: string;
}>;
/** 供客户端读取和保存已启用专家的顶层 Host Remote 服务。 */
declare class AgencyAgentsRemote extends TypertRemoteService {
  static inject: string[];
  constructor(ctx: Context);
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