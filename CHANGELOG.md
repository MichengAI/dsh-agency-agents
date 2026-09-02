# Changelog

[简体中文](CHANGELOG.zh-CN.md)

The five most recent published versions are listed below.

## Unreleased

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

## 0.1.22 — 2026-08-28

- Added the Changelog link to the standard README header navigation, between the language switch and the Apache-2.0 license link.

Published package: [`@michengai/dsh-agency-agents@0.1.22`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.22).

## 0.1.21 — 2026-08-23

- Added bilingual changelogs covering the five most recent releases.
- Linked the release history from both README editions and included it in the npm package.

Published package: [`@michengai/dsh-agency-agents@0.1.21`](https://www.npmjs.com/package/@michengai/dsh-agency-agents/v/0.1.21).
