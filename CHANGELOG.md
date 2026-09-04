# Changelog

[简体中文](CHANGELOG.zh-CN.md)

The five most recent published versions are listed below.

## Unreleased

## 0.1.31 — 2026-09-05

- Expanded the bundled roster to 321 experts across 22 divisions, merged localized specialists, and redesigned Expert Settings with compact two-column cards, avatars, category search, and enable switches.
- Unified the persona source used by view, copy, and summon. Chinese sessions now inject the Chinese persona with English fallback, while custom `root` catalogs no longer display unrelated bundled prompts.
- Kept search and division filters active together, made copied feedback expire automatically, and removed duplicate Chinese assets, the obsolete list view, and unused filter labels.
- Replaced five bundled Lucide component imports with equivalent inline paths so the client bundle no longer contains the complete icon library.
- Loaded only frontmatter metadata in bounded chunks when building the roster instead of reading or retaining all 321 persona bodies at startup. Prompt requests now fail explicitly while the shared source is unavailable, preventing custom catalogs from silently falling back to bundled prose, and obsolete list-view locale entries were removed.

## 0.1.30 — 2026-09-03

- When no experts are enabled, the composer Experts button opens Settings → Experts. It only clicks a uniquely labeled Settings trigger and ignores composer dialogs such as the + button.

## 0.1.29 — 2026-09-03

- Updated the DSH development baseline to `0.1.2-rc.1` while retaining the existing `>=0.1.0-rc.5 <0.2.0` peer compatibility range.
- Added the RC.1-required `dsh-session-projection` and `dsh-util-time` development peers, refreshed the pnpm release-age exemptions and lockfile, and updated manifest regression coverage.

## 0.1.28 — 2026-09-03

- Added GitHub and Issues actions beside the plugin settings title, matching the archive manager's labels and icons.
- Added DSH `0.1.2-alpha.5` compatibility, removed obsolete renderer/session injection and the unused Runtime bundling exemption, and isolated RC Runtime types from the alpha slot registry.
- Set DSH peer dependencies to `>=0.1.0-rc.5 <0.2.0`, pinned development DSH packages to `0.1.2-alpha.5`, and added manifest regression coverage.
- Added a narrowly scoped pnpm release-age exemption for the locked DSH alpha.5 packages so trusted publishing can install the newly released compatibility baseline.

## 0.1.26 — 2026-09-02

- Replaced composer text injection with native expert-reference chips. Chips display only the localized expert name and the host icon; internal identifiers remain private.
- Kept the expert picker open and displayed a localized error when chip insertion is rejected.
- Required DSH RC.6 or newer, removed slug-based listing and selection guidance, and made removed-expert chips serializable without exposing their internal identifier.
- Consecutive expert selections append chips after the existing expert prefix; clipboard and serialized chip text use a non-breaking space separator to preserve visible separation in rendered messages.
- Normalized expert-name matching consistently and localized duplicate-name catalog errors to the active interface language.

## 0.1.25 — 2026-09-01

- Fixed expert emoji icons disappearing on DSH `0.1.2-alpha.3`, where candidate `icon` values are restricted to built-in reference icon names.
- Moved each emoji into the visible candidate name and resolved the clean expert name from its slug when picked, so summon instructions remain unchanged.
- Added regression coverage for Chinese and English labels, clean pick names, and unknown-expert fallback behavior.

Published package: [`@michengai/dsh-agency-agents@0.1.25`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.25).

## 0.1.24 — 2026-09-01

- Fixed raw keys such as `division.design` and `division.engineering` appearing as group titles in the Chinese `@` expert menu.
- Fixed expert emoji icons taking up space without rendering on Windows by applying a color-emoji font stack to expert menu items.
- Group titles now follow the active interface language and refresh after locale changes; added coverage for Chinese, English, and unknown-division fallback behavior.

Published package: [`@michengai/dsh-agency-agents@0.1.24`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.24).

## 0.1.23 — 2026-08-31

- Added a compatibility adapter for the DSH settings API so the plugin works with both the legacy RC runtime and `@deepseek-ai/dsh@0.1.2-alpha.2`.
- Added regression coverage for both settings API shapes and rebuilt the published bundles.

Published package: [`@michengai/dsh-agency-agents@0.1.23`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.23).
