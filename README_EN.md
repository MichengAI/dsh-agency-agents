# dsh-agency-agents

`dsh-agency-agents` is a DeepSeek Harness (DSH) plugin. The parent session keeps task understanding, decisions, and final synthesis; it can delegate a self-contained task to a one-shot subagent with a persona from The Agency.

For the Chinese guide, see [README.md](README.md). The complete documentation index is [docs\00-交接入口\00-阅读导航.md](docs/00-交接入口/00-阅读导航.md).

## Capabilities

| Tool | Purpose |
| --- | --- |
| `list_experts(division?)` | Returns compact division counts by default, or expands an individual division. |
| `summon_expert(expert, task)` | Runs a one-shot subagent with the selected expert persona and returns its result. |

- 271 expert personas are bundled; no external directory is required after installation.
- Configure `root`, or set `AGENCY_AGENTS_ROOT`, to use a separately synchronized expert checkout.
- Expert children cannot call `summon_expert`, preventing recursive delegation.
- `spawn` and `fork` are supported when the provider supports persona and tool filtering.

## Install

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile default add .
dsh --profile default --dump-config
```

Replace `default` with the target profile. The second command should show the `agency-agents` composition entry.

## Configuration

| Key | Default | Meaning |
| --- | --- | --- |
| `root` | Bundled expert assets | External expert root; an explicit value overrides bundled assets. |
| `provider` | `spawn` | DSH subagent provider. |
| `divisions` | All 17 standard divisions | Top-level divisions to scan. |

## Bundled source and licensing

The bundled expert personas originate from [The Agency](https://github.com/msitarzewski/agency-agents) and are copyrighted by AgentLand Contributors. The snapshot and its original license are in [assets\agency-agents](assets/agency-agents).

**License boundary:** this plugin's TypeScript source, build scripts, and project documentation are licensed under [Apache License 2.0](LICENSE). The bundled upstream expert personas remain under the MIT License; see [assets\agency-agents\LICENSE](assets/agency-agents/LICENSE). See [NOTICE](NOTICE) for attribution.

The complete agent roster is split by division in [docs\04-Agent运行体系\01-内置专家清单](docs/04-Agent运行体系/01-内置专家清单/00-清单索引.md).

## Development and verification

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm install
pnpm build
pnpm test
pnpm verify
```

`prepublishOnly` runs build, test, and package-integrity verification automatically.
