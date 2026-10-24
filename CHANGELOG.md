# Changelog

[简体中文](CHANGELOG.zh-CN.md)

This file records features and upgrade boundaries. npm and GitHub Releases remain the publication source of truth.

## 1.2.12 - 2026-10-24

- Support DeepSeek Harness `0.2.1-rc.3` while retaining all existing supported versions.

## 1.2.11 - 2026-10-23

- **Add dedicated primary sidebar entry**: Support enabling a persistent sidebar entry via **Plugins → @michengai/dsh-agency-agents** config card (disabled by default). Clicking the sidebar entry opens the full 331-expert roster and team collaboration editor in a spacious 960px centered workspace view, removing viewport scrolling constraints in narrow settings dialogs. Safely reverts to default views when disabled.
- **Support independent online update toggle and platform locking**: Provide an "Online Updates" switch (enabled by default) to dynamically show or hide update checks and version badges. Supports enterprise environments locking updates via Cordis static configuration (`updater: false`).
- **Support reverse proxy deployment with base URI resolution**: Automatically resolve API and update endpoints against `document.baseURI`, preventing 404 errors when hosted behind prefix-stripping reverse proxies (e.g. `/app/dsh/`).
- **Harden endpoint security and volatile settings configuration**: Register runtime settings as volatile fields for seamless host mutations, enforce client token verification and content-type checks on settings routes, and handle oversized payloads without connection hanging.

## 1.2.10 - 2026-10-22

- Fall back to English when host locale preference is unselected: align host locale resolution with `@deepseek-ai/dsh-client-locale` by resolving `zh` and `zh-*` to Chinese and all other values (including unselected `undefined` or retrieval exceptions) to English, preventing Chinese expert names, tool descriptions, and durable subagent descriptor labels in English browser environments (PR #30).

## 1.2.9 - 2026-10-20

- Support pm2 and process wrapper environments for host module detection: extend host entry discovery to inspect `process.env.pm_exec_path`, `process.mainModule?.filename`, and `process.argv[1]`, fixing an issue where pm2 overwrites `process.argv[1]` with its container script, causing the host's `@deepseek-ai/schemastery` volatile config capability to be misdetected as unsupported and failing plugin activation at startup (Issue #26).

## 1.2.8 - 2026-10-19

- Align the Experts settings tabs and filter dropdowns with the archive plugin: archive-shaped segmented-tab track and slider geometry, 32px select triggers with trailing chevrons, ellipsis labels, and dense 30px menu rows.

## 1.2.7 - 2026-10-19

- Keep the expert-team editor inside the host modal padding box: move its action bar into the host `Modal` footer slot, give the content a flex scroll chain, and drop the hard-coded viewport heights (Issue #25).

## 1.2.6 - 2026-10-19

- Render the Experts settings nav icon as an independent CSS mask so third-party skins cannot hide it, and only decorate buttons with a direct host `svg` so wrapped icons keep the host layout.

## 1.2.5 - 2026-10-19

- Let the settings panel fill the host content column: remove the 760px cap and the now-dead centering declarations, so expert and team grids line up with the rest of the settings page.
- Keep the custom-expert footer outside the scrolling form: render it through the host `Modal` footer slot, cap the dialog with `max-height: 100%` instead of a viewport calc, and add a short-viewport regression test proving the action bar does not scroll away.
- Keep the expert-team detail dialog inside the viewport: give its content a flex scroll chain so long member duties and coordinator prompts remain reachable, with a short-viewport regression test.

## 1.2.3 - 2026-10-19

- Compact expert library tabs: align the top segmented tabs height to 32px with host select triggers and inputs, supply 14px vector stroke icons for Experts and Teams, and remove heavy shadows and excess container height.

## 1.2.2 - 2026-10-18

- Fix search focus loss and double clear icons: adopt host primitive `Input` directly and remove hand-rolled clear buttons with conditional wrapper elements, eliminating DOM reconstruction focus drops on initial keystroke and conflicting native cancel buttons (Issue #20).

## 1.2.1 - 2026-10-17

- Align destructive action buttons with the host warning pattern: expert delete, discard-changes, team-template restore, and expert-team removal confirmations use a red outline instead of the solid primary style, matching the skills plugin.

## 1.2.0 - 2026-10-17

**Breaking upgrade.** This version no longer supports DeepSeek Harness 0.1.x. Installing or enabling 1.2.0 on 0.1.2, 0.1.5, 0.1.7, or any other 0.1.x host is rejected by the version gate, and the plugin will not run. Upgrade the host to a version in the list below before installing this plugin.

Expert and expert-team settings stay in the host `agency-agents` namespace. This upgrade does not wipe them or require re-entry. Back up settings before downgrading to 1.0.x.

Supported hosts only:

- `0.2.0-rc.1`, `0.2.0-rc.2`
- `0.2.1-rc.1`, `0.2.1-rc.2`

`0.1.x` and `0.2.1-alpha.1` through `0.2.1-alpha.5` are rejected by the version gate, and the plugin will not run. Upgrade the host to one of the four release candidates above first.

Other changes:

- Remove Ant Design. Switches, dialogs, single-line inputs, and segmented tabs use host primitives. Member lists are a plain grid.
- Remove the settings install bridge kept only for 0.1.x (`settingsNamespace()`, `installSettingsSection`, `installSection`). 0.2.x uses volatile config fields.
- Drop dialog props the host does not accept (width, stacking, mask, and closable flags). Close buttons have a localized name, search fields can be cleared, and switches pass their name through the host `label`.
- Side editor drawers are now centered modals. Confirmation dialogs keep the host default width. Expert-team editing, member picking, and details are 760px.
- Icon-only buttons are 22px outline controls, matching the skills plugin.
- Confirmation copy uses the host modal description slot. Confirm buttons use the host solid primary style instead of a red outline override.
- Team template and custom prompt sources use the host segmented control instead of a hand-styled selected state.
- Dialogs no longer restyle host input and textarea borders, padding, or focus rings.
- Update and prompt preview dialogs use the host default width instead of a forced 680px.
- Fix search input right-edge overflow in expert discovery popover by applying box-sizing: border-box.
- Align composer discovery dialog surface with host modal card tokens and 8px switcher spacing.
- Member replace is a 22px icon button, and its accessible name uses the expert name.
- Declare `@deepseek-ai/dsh-client-ui-primitives` as a peer and include it in the browser module load order.

## 1.0.20 - 2026-10-16

- Adopt official host `@deepseek-ai/dsh-client-ui-primitives` `Menu` and `Button` primitives, completely eliminating custom select/dropdown logic and Ant Design Select dependencies.
- Cards, dialogs, and controls use the host radius scale and semantic background tokens, so frosted-glass themes are no longer blocked by hardcoded solid fills.
- Elevate dropdown visual fidelity with native frosted glass (`blur(16px)` / `blur(20px)`), prominent shadows, and fine hairline borders.
- Streamline card action footer into compact 32px height with icon-only controls (View, Copy & Customize, Edit, Delete), eliminating visual clutter and redundant prompt copy actions.
- Wrap card division categories in refined pill badges and eliminate vertical empty holes on single-line titles.
- Unify confirmation modal button styling with lightweight hairline outline danger feedback and enhanced dialog copy.
- Keep a visible keyboard focus ring on confirmation dialog buttons, and keep delete or discard buttons red on hover.

## 1.0.19 - 2026-10-15

- Support DSH `0.2.1-alpha.3` while retaining all existing supported versions; pin development `@deepseek-ai/dsh*` dependencies to host `0.2.1-alpha.3` and Cordis to `4.0.5-alpha.2`.
- Drop removed host package `@deepseek-ai/dsh-invariants` from development dependencies (gone since alpha.1).
- Adapt the subagent breaking change: start-time `persona` / `toolFilter` are gone on DSH 0.2.1-alpha.3+; use `startActivation` with `delivery: 'caller'`, and restore expert persona plus delegated-tool denylist on the child's `agent/created` via a scoped persona section and `tools.restrict`. Older hosts that still expose `ctx.subagents.start` keep the previous start-time fields.
- Agent Team continues to use `sendMessage` direct delivery.

## 1.0.18 - 2026-10-13

- Native team member cards show each expert's localized name on both the current and previous host card layouts. Task titles and owner identifiers stay unchanged.
- The lead card shows the expert team name when a task title exactly matches that team. If the match is missing or ambiguous, the card stays `lead`.
- Stopping the parent session now stops subagents started by this plugin instead of waiting for them to finish.
- The plugin supports the host's newer subagent start API and still works with the previous API.

## 1.0.17 - 2026-10-12

- Synchronized the latest experts from upstream `agency-agents` and `agency-agents-zh`, expanding the bundled roster to 331 specialists.
- Added 9 upstream experts with complete Chinese translations: ATS Validator Architect, China Network Engineer, PDF Engine Architect, Platform Engineer, ServiceNow Developer & Mentor, Universal Document Compiler, Developer Community Builder, DX Engineer, and Focus Music Architect.
- Added 1 Chinese edition specialist with complete English persona: Search Growth Orchestrator.

## 1.0.16 - 2026-10-12

- Scrolling the expert list in Settings no longer jumps. Every card keeps the same height, including titles that fit on one line.

## 1.0.15 - 2026-10-12

- Support DSH `0.2.1-alpha.2` while retaining all existing supported versions.

## 1.0.14 - 2026-10-12

- When you name an expert, the assistant calls that expert immediately instead of analyzing the task first.
- Expert and team requests should be a short brief: the goal, constraints, and file paths. Do not paste source code into the request.
- A single expert task can be up to 2,000 characters. A team task can be up to 20,000 characters. Longer text is rejected with a prompt to summarize and retry.
- A running expert is labeled with the expert name.

## 1.0.13 - 2026-10-10

- When building a team, Add member starts with enabled experts so you can pick from the ones you already use.
- Disabled experts can still join a team. If you do not want to use an expert on its own, switch status to All or Disabled.

## 1.0.12 - 2026-10-10

- After saving an expert team, you can keep editing an enabled custom expert. You no longer need to disable it first.
- A save in the same window is no longer mistaken for a change from another window.

## 1.0.11 - 2026-10-07

- Official Desktop can update this plugin in place. It no longer targets the web profile by mistake.
- A new version is marked with a warning color. Version numbers keep their normal color.
- After updating, fully quit and reopen DSH Desktop.

## 1.0.9 - 2026-10-06

- The installed-plugin list shows “Agency Agents” and a localized description instead of the package name. The remote entry shows “Agency Agents remote”. Titles and descriptions come from `meta.title` and `meta.description` in `locale/zh.json`, `locale/en.json`, and `locale/remote/`.
- Installing from GitHub now includes the compiled runtime, so no manual build is required.

## 1.0.8 - 2026-10-05

### Improvements

- Opening and switching sessions stays smoother when the MCP connector is also enabled.
- Expert team tools follow the current language and still update immediately when switching between Chinese and English.

## 1.0.7 - 2026-09-30

### Improvements

- Support DeepSeek Harness 0.2.0-rc.2, and keep the previously supported release candidates.

## 1.0.6 - 2026-09-28

### Improvements

- Support DeepSeek Harness 0.2.0-rc.1, and keep the previously supported release candidates.

## 1.0.5 - 2026-09-25

### Improvements

- Support DeepSeek Harness 0.1.7-rc.2, and keep the previously supported release candidates.

## 1.0.4 - 2026-09-25

### Fixes

- Agency Agents now starts on DSH 0.1.7-rc.1 installed globally on Linux or in Docker, and still reads the current settings.

## 1.0.3 - 2026-09-24

### Improvements

- Support DeepSeek Harness 0.1.7-rc.1, and keep the previously supported release candidates.
- Alpha releases are no longer supported.

### Fixes

- Settings still load correctly on DSH 0.1.7-rc.1.

## 1.0.2 - 2026-09-23

### Improvements

- Support DSH 0.1.7 while keeping previously supported versions.
- Expert and team pickers show avatars. Custom experts no longer ask for a summon emoji.
- Team lists stay in sync between the chat menu and settings.
- Expert and team counts sit on the tabs, including how many are enabled.
- Settings look more consistent and follow the system light or dark appearance.
- Team cards no longer offer “Copy prompt”. View the coordinator prompt in team details when needed.

### Fixes

- Expert menus no longer show text from behind the panel.
- Settings on newer DSH versions read the current configuration correctly.

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
