import type { CatalogSnapshot, CustomExpertInput } from "../expert-contract.js";
import { customError } from "../expert-contract.js";
import type { AgencyCatalogRemote } from "./remote.js";

/** 冲突核对使用同一修订号的名册与正文，避免给旧正文配上新修订号。 */
export interface EditorReview {
  catalog: CatalogSnapshot;
  expert?: CustomExpertInput;
}
export async function loadEditorReview(
  remote: AgencyCatalogRemote,
  slug: string | undefined,
  locale: "zh" | "en",
): Promise<EditorReview> {
  const before = await remote.getCatalog();
  if (!before.ok) throw new Error(before.error.message);
  if (slug === undefined || !before.value.experts.some(item => item.slug === slug && item.custom))
    return { catalog: before.value };
  const expert = await remote.getCustomExpert(slug);
  if (!expert.ok) throw new Error(expert.error.message);
  const after = await remote.getCatalog();
  if (!after.ok) throw new Error(after.error.message);
  if (before.value.revision !== after.value.revision) throw customError("conflict", locale);
  return { catalog: after.value, expert: expert.value };
}

/** 用户核对后选择内容；这里只准备下一次保存，不自动写入或恢复已删除记录。 */
export function continueEditorReview(review: EditorReview, draft: CustomExpertInput, useLatest: boolean) {
  if (useLatest && review.expert === undefined) throw new Error("No current expert to load");
  const { slug, ...content } = draft;
  return {
    expert: useLatest ? review.expert! : review.expert === undefined ? content : draft,
    enabled: review.expert?.slug !== undefined && review.catalog.enabled.includes(review.expert.slug),
    revision: review.catalog.revision,
  };
}
