<div align="center">
<table>
<tr>
<td valign="middle">

```text
                ####     ##
     ###############     #####  #####
   ###################    ##########
  #######################   ######
 ###       ####################
 ###           #######  #######
  ###            #############
   ####           ##########
    ######   ####   #######
       ######################
            #######
```

</td>
<td valign="middle">

```text
 _____   _____ _    _            _____ ______ _   _  _______     __           _____ ______ _   _ _______ _____
|  __ \ / ____| |  | |     /\   / ____|  ____| \ | |/ ____\ \   / /     /\   / ____|  ____| \ | |__   __/ ____|
| |  | | (___ | |__| |    /  \ | |  __| |__  |  \| | |     \ \_/ /     /  \ | |  __| |__  |  \| |  | | | (___
| |  | |\___ \|  __  |   / /\ \| | |_ |  __| | . ` | |      \   /     / /\ \| | |_ |  __| | . ` |  | |  \___ \
| |__| |____) | |  | |  / ____ \ |__| | |____| |\  | |____   | |     / ____ \ |__| | |____| |\  |  | |  ____) |
|_____/|_____/|_|  |_| /_/    \_\_____|______|_| \_|\_____|  |_|    /_/    \_\_____|______|_| \_|  |_| |_____/

 271 summonable specialists
 DeepSeek Harness plugin
```

</td>
</tr>
</table>
</div>

<div align="center">

  # DSH Agency Agents

  **271 summonable specialist agents for DeepSeek Harness**

  [简体中文](README.zh-CN.md) · [Apache-2.0](LICENSE)

  [![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
  [![Bundled agents](https://img.shields.io/badge/Bundled%20agents-271-0f766e.svg)](#features)
  [![npm package](https://img.shields.io/npm/v/%40michengai%2Fdsh-agency-agents.svg?label=npm%20package)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/MichengAI/dsh-agency-agents)
  [![Node.js 22 or later](https://img.shields.io/badge/Node.js-22%20or%20later-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
</div>

> DSH Agency Agents is a community-maintained DeepSeek Harness (DSH) plugin, not an official DeepSeek AI product.

## Features

- Filter by category or search, then enable or disable bundled experts in **Settings → Experts**.
- Summon enabled experts by name or slug from the composer's **Experts** picker.
- Use `list_experts` to discover experts and `summon_expert` to start a one-shot specialist subagent.
- Use 271 bundled personas immediately, or connect a separately synchronized expert directory.

The parent session keeps task context, judgment, and the final answer. Expert children provide a specialist perspective only and cannot summon further experts.

## Screenshots

Filter by category or search in **Settings → Experts**, then enable the experts you need:

![DSH Experts panel](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/agent-roster-en.png)

Use `@` or the composer's **Experts** picker to choose an enabled expert:

![Experts picker](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/expert-picker.png)

The name and slug are filled in; write the complete task next:

![Summoning an expert from the composer](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/summon-prompt.png)

## Prerequisites

- A working DeepSeek Harness Web installation with `dsh` available in PowerShell.
- Examples use the `web` profile; replace it with the target profile.
- Source installation and development require Node.js 22+ and pnpm. npm installation does not require running `pnpm install` separately.

## Installation

`dsh plugin add` forwards to `pnpm add` in the profile directory. Without a version and official registry, a local mirror or minimum-release-age policy can leave you on an older build.

### Install the latest package from the official npm registry

Run this from any PowerShell directory:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

To pin a release, replace `@latest` with a version such as `@0.1.17`.

The configuration output should contain `agency-agents` and `agency-agents-remote`. Restart DSH Web and hard-refresh the browser. Do not copy client files manually: the Settings page needs the mounted Remote service.

### Install from source

Use this for debugging or unpublished changes. The cloned directory becomes the plugin source path:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location D:\Repository\deepseek-harness-plugin
git clone https://github.com/MichengAI/dsh-agency-agents.git
Set-Location .\dsh-agency-agents
pnpm install --frozen-lockfile
pnpm build
dsh plugin --profile web add .
dsh --profile web --dump-config
```

Restart DSH Web and hard-refresh the browser. `dsh plugin ... add .` reads the package metadata and `cordis.patch.yml`; do not install by copying `lib` directly.

## Usage

1. Open **Settings → Experts** and enable the needed experts.
2. Use `@` or the composer **Experts** picker to choose an enabled expert.
3. Name the expert and slug, then provide the complete task.

```text
Summon the "Code Review Engineer" expert (engineering-code-reviewer) for this task:
Review the changes in the current workspace and list reproducible issues by severity.
```

The parent session can also call `list_experts(division?)`, then delegate with `summon_expert(expert, task)`. Use a slug when a name is ambiguous.
## Configuration and limits

| Key | Default | Purpose |
| --- | --- | --- |
| `root` | Bundled expert assets | External expert root; an explicit value takes priority. |
| `provider` | `spawn` | DSH subagent provider; `fork` also works when it supports persona and tool filtering. |
| `divisions` | 17 standard divisions | Top-level divisions to scan. |
| `maxDepth` | Unset | Positive absolute subagent-depth limit. |

Set `AGENCY_AGENTS_ROOT` to use an external expert directory. Persona bodies from that directory are injected as the child system prompt, so load them only from a trusted source. The provider must support persona and tool filtering. `summon_experts` accepts at most 8 experts with a concurrency of 4 and still returns successful answers when some experts fail.

## Secondary development

- [src\index.ts](src/index.ts): host entry point for catalog loading, tools, and settings.
- [src\remote-contract.ts](src/remote-contract.ts) and [src\remote.ts](src/remote.ts): Remote contract and implementation.
- [src\client\index.ts](src/client/index.ts): Settings page, composer button, and `@` trigger.
- `assets\agency-agents`: bundled personas; retain its MIT license and [NOTICE](NOTICE) attribution.

After changing `src` or `assets`, rebuild, test, and install from the local directory:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
pnpm verify
dsh plugin --profile web add .
```

Handoff and iteration notes stay in the local `docs` directory and are not tracked in Git; a fresh clone will not include that handover entry.

The published package includes `lib`, `assets`, the patch, and the root README/license files. Do not publish `node_modules` or local development files.

## Validation

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
pnpm verify
```

`prepublishOnly` runs these build, test, and package-integrity checks before publishing.

## License and attribution

This project’s TypeScript source, build scripts, and documentation use [Apache License 2.0](LICENSE). Bundled personas originate from [The Agency](https://github.com/msitarzewski/agency-agents) and remain MIT-licensed; see [assets\agency-agents\LICENSE](assets/agency-agents/LICENSE).

