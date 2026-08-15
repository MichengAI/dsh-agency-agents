# dsh-agency-agents

`dsh-agency-agents` 是 DeepSeek Harness（DSH）插件：主会话保留任务理解、决策和汇总职责；需要专业视角时，通过工具启动带有 The Agency persona 的一次性子代理。

英文说明见 [README_EN.md](README_EN.md)。完整文档入口见 [docs\00-交接入口\00-阅读导航.md](docs/00-交接入口/00-阅读导航.md)。

## 核心能力

| 工具 | 用途 |
| --- | --- |
| `list_experts(division?)` | 不传参数时返回分区和数量；传分区时展开对应专家。 |
| `summon_expert(expert, task)` | 以专家 persona 启动一次性子代理，等待并返回其结果。 |

- 默认内置 271 名专家，安装后无需依赖外部目录。
- 可通过 `root` 配置或 `AGENCY_AGENTS_ROOT` 环境变量覆盖为自行同步的专家目录。
- 子代理无法再次调用 `summon_expert`，避免递归委派和不可控消耗。
- 支持 `spawn` 或 `fork` provider；provider 必须支持 persona 和工具过滤能力。

## 安装

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile default add .
dsh --profile default --dump-config
```

将 `default` 替换为目标 profile。第二条命令应显示 `agency-agents` 组合项。

## 配置

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `root` | 包内专家资产 | 外部专家根目录；显式配置优先于包内资产。 |
| `provider` | `spawn` | DSH 子代理 provider。 |
| `divisions` | 全部 17 个标准分区 | 需要扫描的顶层分区。 |
| `maxDepth` | 不设置 | 可选的绝对子代理深度上限；provider 必须支持深度限制。 |

## 内置专家来源与授权

专家 persona 来源于 [The Agency](https://github.com/msitarzewski/agency-agents)，版权归 AgentLand Contributors。内置快照及其原始许可证位于 [assets\agency-agents](assets/agency-agents)。

**授权边界：**本插件的 TypeScript 源码、构建脚本与项目文档采用 [Apache License 2.0](LICENSE)；随包分发的上游专家 persona 仍采用 MIT，完整文本见 [assets\agency-agents\LICENSE](assets/agency-agents/LICENSE)。更多说明见 [NOTICE](NOTICE)。

全部内置专家按照分区列在 [docs\04-Agent运行体系\01-内置专家清单](docs/04-Agent运行体系/01-内置专家清单/00-清单索引.md)。

## 开发与验证

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm install
pnpm build
pnpm test
pnpm verify
```

`prepublishOnly` 会自动执行构建、测试和发布完整性验证。
