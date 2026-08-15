import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { Context } from "@deepseek-ai/cordis";
//#region src/remote.d.ts
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
}
//#endregion
export { AgencyAgentsRemote as default };