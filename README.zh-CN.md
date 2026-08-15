<div align="center">
  <img src="https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/branding/dsh-logo.png" width="88" alt="DeepSeek Harness 标识">

  # DSH Agency Agents

  **为 DeepSeek Harness 提供 271 名可召唤的专业智能体**

  [English](README.md) · [完整文档](docs/00-交接入口/00-阅读导航.md) · [Apache-2.0](LICENSE)

  [![许可证：Apache-2.0](https://img.shields.io/badge/许可证-Apache--2.0-blue.svg)](LICENSE)
  [![内置智能体](https://img.shields.io/badge/内置智能体-271-0f766e.svg)](docs/04-Agent运行体系/01-内置智能体清单/00-清单索引.md)
</div>

`dsh-agency-agents` 是 DeepSeek Harness（DSH）插件。主会话负责理解上下文、判断与最终交付；需要专业视角时，可将完整任务交给带有 The Agency persona 的一次性子代理。

## 在 DSH 中使用

在设置的「智能体」面板中浏览并启用所需的智能体。插件按分区提供内置智能体，并在面板中保留名称、简介与启用状态。

![DSH 智能体面板](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/agent-roster.png)

在对话输入框选择「智能体」模式，然后用名称和 slug 明确指定要召唤的智能体。例如：

```text
召唤智能体「代码审查工程师」（engineering-code-reviewer）处理以下任务：
审查当前工作区的改动，按严重程度列出可复现的问题。
```

![召唤智能体的输入方式](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/summon-prompt.png)

## 工作方式

| 阶段 | 主会话与插件的职责 |
| --- | --- |
| 发现 | `list_experts(division?)` 无参返回分区和数量；传入分区后展开对应智能体。 |
| 委派 | `summon_expert(expert, task)` 按 slug 或唯一名称启动一次性子代理。 |
| 交付 | 子代理返回专业结论；主会话结合原始上下文完成判断与汇总。 |

- 默认内置 271 名智能体，安装后无需依赖外部目录。
- 可通过 `root` 配置或 `AGENCY_AGENTS_ROOT` 环境变量覆盖为自行同步的智能体目录。
- 子代理无法再次调用 `summon_expert`，避免递归委派和不可控消耗。
- 支持 `spawn` 或 `fork` provider；provider 必须支持 persona 和工具过滤能力。

## 安装

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile default add @michengai/dsh-agency-agents
dsh --profile default --dump-config
```

将 `default` 替换为目标 profile。第二条命令应显示 `agency-agents` 组合项；本地开发时可将包名替换为 `.`。

## 配置

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `root` | 包内智能体资产 | 外部智能体根目录；显式配置优先于包内资产。 |
| `provider` | `spawn` | DSH 子代理 provider。 |
| `divisions` | 全部 17 个标准分区 | 需要扫描的顶层分区。 |
| `maxDepth` | 不设置 | 可选的绝对子代理深度上限；provider 必须支持深度限制。 |

## 内置智能体来源与授权

智能体 persona 来源于 [The Agency](https://github.com/msitarzewski/agency-agents)，版权归 AgentLand Contributors。内置快照及其原始许可证位于 [assets\agency-agents](assets/agency-agents)。

**授权边界：**本插件的 TypeScript 源码、构建脚本与项目文档采用 [Apache License 2.0](LICENSE)；随包分发的上游智能体 persona 仍采用 MIT，完整文本见 [assets\agency-agents\LICENSE](assets/agency-agents/LICENSE)。更多说明见 [NOTICE](NOTICE)。

全部内置智能体按分区列在 [智能体清单](docs/04-Agent运行体系/01-内置智能体清单/00-清单索引.md)。

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
