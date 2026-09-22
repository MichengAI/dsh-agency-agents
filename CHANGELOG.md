# Changelog

[简体中文](CHANGELOG.zh-CN.md)

This file records features and upgrade boundaries. npm and GitHub Releases remain the publication source of truth.

## 1.0.2 - 2026-09-22

### Improvements

- Support DSH 0.1.7-alpha.1 while keeping previously supported versions. Expert and team settings follow the host's live configuration, and a one-time import recovers data left in `settings.yaml.imported`.
- Expert and team pickers show avatars. Custom experts no longer ask for a summon emoji.
- Team lists stay cached and update across the composer and settings when a team changes.
- Settings controls now use Ant Design bundled with the plugin. Light and dark follow the host. Buttons keep Ant Design's default blue. Expert and team counts sit on the tabs. The chat entry stays the original toolbar button. The client bundle is therefore larger than 1 MB; the published file is minified, and the check allows up to 1.5 MB.

### Fixes

- Menus use the host's translucent surface together with its backdrop blur, so text behind them is not readable through the panel.
- Detect the legacy settings API from the running host, not from this package's own older dependency.

## 1.0.1 - 2026-09-21

### Improvements

- Significantly reduced plugin size to improve loading of expert and team pages.
- Improved Chinese and English messages and consistency when switching languages.
- Updated feature screenshots and usage guidance.

### Fixes

- Fixed separators disappearing when entering multiple tags.
- Fixed some experts unexpectedly losing their enabled state when enabling a team.
- Made validation messages clearer so fields needing attention are easier to find.
- Fixed issues with collaboration status display and compatibility with older DSH versions.

## 1.0.0 - 2026-09-21

The first 1.0 release expands individual specialists into configurable expert-team collaboration. It retains the package name, 321 bundled specialists, 22 divisions, and existing individual-expert workflows. The following covers the changes since 0.1.44.

### Retained individual-expert capabilities and tools

- Retain 321 bundled experts across 22 divisions, prompt viewing/copying, category/status/localized keyword filters, enablement, and selection through the composer or @.
- Retain up to 200 custom experts with creation, copying, avatars and summon emoji, editing, save-and-enable, disabling, and permanent deletion; preserve name-conflict and concurrent-revision checks.
- Keep list_experts, summon_expert, and summon_experts; add list_expert_teams, get_expert_team, and summon_expert_team for reading team rules before delegation and final synthesis.
- Preserve the settings version display, update checking/feedback, and trusted external root, provider, divisions, and maxDepth configuration. Do not add an External source tab.
### Five built-in teams and custom teams

- Add Product Review Team, Technical Review Team, Content Planning Team, Data Analysis Team, and Research Team. Each includes three independent expert roles, a shared goal, delivery requirements, task examples, and a dedicated coordinator template.
- Create custom teams, copy built-in teams, inspect details, edit, enable, disable, and delete. Each team contains 2–8 distinct experts; up to 100 custom teams are supported.
- Configure a name, description, up to three tags, member duties and instructions, shared goal, constraints, delivery requirements, and 1–3 examples. Custom coordinator prompts allow up to 12,000 characters.
- Use the team coordinator template, customize it, or restore it. Rules cover preparation, delegation, evidence checks, disagreements, failures, and final delivery. The existing main conversation coordinates; no extra leader subagent is created.
- Confirm and enable required experts when enabling a team. Disabling or deleting a team does not disable its members or delete historical conversations.

### Unified expert and team management

- Add an underlined Expert teams tab inside Settings → Experts, sharing the title, version, and links. Preserve individual experts' All/Built-in/Custom source filters, categories, status, and search.
- Preserve expert filters across tab switches. Place counts at the right of the tabs, with source filters and create/refresh actions on one row. Teams gain equivalent source/status filters, search, empty states, refresh, and more menus.
- Share cards, editor drawers, save footers, prompt previews, and confirmation dialogs. Confirm deletion and discarding unsaved changes. Retain drafts on revision conflicts, review current settings before saving, and allow deleted experts to continue as new experts.
- Remove redundant source badges and expand all five team descriptions. Team descriptions grow with their content to avoid truncating English, while card actions remain compact.
- Align buttons, inputs, dropdowns, and focus states with Archive Manager using compact sizing and official theme backgrounds/borders. Enabled switches are green, disabled switches gray, with text labels; support dark/light themes and narrow layouts.

### Chat selection, examples, and draft protection

- Switch to teams in the Experts composer picker, search, inspect details, enable, and select. The @ picker supports native team references with short localized names.
- Selecting a team or example updates the draft without sending it. Protect existing text, attachments, and references; confirm team replacement or example insertion in a themed dialog.
- Recheck the draft revision after asynchronous confirmation. If the draft changed meanwhile, stop insertion and ask the user to select again rather than overwriting new input.
- Preserve full-roster individual-expert search, enable-and-select, bilingual examples for eight representative specialists, conflict feedback, and retry behavior.

### Ordinary subagents and native Agent Team

- Check host capability separately from service enablement and tool availability in the current Agent scope, without modifying host settings.
- Use ordinary subagents when unsupported. Recommend enabling Team when supported but disabled, while allowing ordinary execution. Use native Agent Team when services and tools are ready. Explicit maxDepth continues through ordinary mode to enforce depth limits.
- Ordinary mode performs one parallel analysis with up to four concurrent experts. Freeze team, member, and task settings before execution so later edits cannot change the running assignment.
- Native mode integrates members, shared tasks, task claiming, result messages, and asynchronous waiting. Reuse idle or offline members for the same team/expert; do not redispatch busy or failed members.
- Accepted native dispatch means started, not completed. The main conversation waits for actual results for the current tasks before verifying and summarizing. Mid-dispatch failures do not automatically switch to ordinary mode and duplicate work.
- Localize new child-session expert names in both modes. Adapt native roster display names while retaining stable identities, message routing, and reuse. Do not rewrite old ordinary-session titles or host model labels.

### Collaboration quality and failure handling

- Provide team-specific briefs, role boundaries, structured member reports, coordinator checklists, and handoff rules. Consolidate duplicate findings while preserving evidence, disagreements, and open questions.
- Ordinary mode reports responsibility coverage and member success/failure, preserving completed results when others fail. Isolate persona-read failures, reject empty results, and do not automatically add model rounds or retries.
- Cancellation prevents queued work from starting, settles in-flight launches, and interrupts native members started by this invocation. Report cleanup failures explicitly.
- Preserve child-tool isolation and recursion guards; experts cannot summon more experts or start another team round.

### Complete localization, documentation, and release assets

- Complete Chinese/English UI, details, editors, confirmations, errors, tool descriptions, and runtime feedback, plus all five teams' names, descriptions, tags, duties, examples, and coordinator rules.
- Language changes preserve custom content and unsaved drafts. Only system presets are localized; both built-in Chinese and English names participate in collision checks, and stable IDs remain unchanged.
- Regenerate separate Chinese and English 3:1 WebP banners without version numbers. Replace the Node README badge with supported DSH versions, and refresh bilingual feature and upgrade documentation.
- Set the version baseline to 1.0.0. Generate bilingual release notes from the matching changelog entries to keep feature lists aligned.

- Stop tracking compiled `lib` in Git. The release gate builds and transfers verified artifacts to npm publishing; npm packages retain the runtime `lib` files.

### Upgrade, compatibility, and validation limits

- Retain support for DSH 0.1.0-rc.8, 0.1.1-rc.2, 0.1.2-rc.1, 0.1.5-rc.1, 0.1.5-rc.2, 0.1.6-alpha.1, and 0.1.6-alpha.2. This does not claim coverage of every intervening or future version. Native Team also depends on installation and enablement.
- Existing expert enablement and custom experts remain in the host agency-agents settings namespace; team settings use that namespace too. No expert-file migration is required. Back up settings before downgrading: old versions lack teams and may not preserve team fields on writes.
- The engineering regression baseline passes 199 unit/host-integration tests and 40 browser tests, including opt-in visual validation. Fix the old visual fixture that passed despite missing theme variables. Type checks, builds, and package validation pass.
- Browser tests use real components with mocked Remote services, and model providers are test doubles. These results do not validate real-model summary quality or every supported host end to end. Native model labels remain host-owned and may show creation-time models.

## 0.1.44 - 2026-09-18

- Add compatibility with DSH `0.1.6-alpha.2` while retaining support for previously supported versions.
- Keep Remote mounting on both alpha.1 and alpha.2 hosts, and resolve the current chat session after `sessions.list.current` was removed.
- Stop flashing the loading state under the expert search box when the roster is already cached.

## 0.1.43 - 2026-09-16

- Add compatibility with DSH `0.1.6-alpha.1` while retaining support for previously supported RC versions.

## 0.1.42 - 2026-09-13

- Choose experts from a compact category and emoji list, retaining the original category and localized-name order, with English prefix search to find and enable disabled experts. The `@` shortcut continues to show enabled experts.
- Automatically insert bilingual task examples for eight representative experts when the task body is empty. Existing requests are preserved, with no copying required.

## 0.1.41 - 2026-09-12

- Fix navigation from the chat Experts button to Settings → Experts when all experts are disabled, supporting both native DSH dialogs and Codex UI settings pages.

## 0.1.40 - 2026-09-11

- Fix the Experts plugin moving the attachment button to the end of the toolbar, preserving the original host button order.

## 0.1.39 - 2026-09-11

- Add compatibility with DSH `0.1.5-rc.2` while retaining support for previously supported RC versions.

## 0.1.38 - 2026-09-10

- Support DSH `0.1.5-rc.1` while retaining compatibility with validated older versions.
- Restore focus after closing prompt previews for smoother keyboard navigation.
- Fix startup warnings and cleanup of previously deleted experts on older DSH versions.

## 0.1.37 - 2026-09-10

This version was not published to npm. Please use `0.1.38` instead.

## 0.1.36 - 2026-09-09

- Create custom experts with your own instructions or adapt built-in experts, then select them using @ or the Experts button.
- Filter, edit, enable, disable, and permanently delete experts. Drafts are preserved when edits from multiple windows conflict.
- Improve expert menus and keyboard navigation, and fix prompt viewing, copying, and expert invocation issues.

## 0.1.35 - 2026-09-09

- Improve Expert Settings layout so buttons no longer crowd the title and version, with support for the native DSH interface.

## 0.1.34 - 2026-09-08

- Fix clipped expert menus when many experts are enabled, with scrolling within the available space.
- Keep expert cards in place when toggling them for smoother consecutive actions.

## 0.1.33 - 2026-09-07

- Added independent in-product update checks with automatic updates when a verified DSH update service is available and a profile-specific manual fallback otherwise.
- Removed the update-button dependency on `react-dom/client` so the client can load on Hosts that do not register that module id.

## 0.1.32 — 2026-09-05

- Completed bilingual coverage for all 321 experts: English names, descriptions, and personas now render in English, while every expert has a Chinese display name and Chinese persona.
- Added 48 missing or corrected Chinese personas and localized 32 China-focused experts for English sessions; cleaned residual Chinese fragments from otherwise English personas.
- Flattened 15 game-development personas to the catalog's supported directory layout and added their Chinese counterparts so view, copy, and summon resolve the same prompt.
- Added catalog-wide regression tests for bilingual name uniqueness, persona availability, and locale integrity.

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
