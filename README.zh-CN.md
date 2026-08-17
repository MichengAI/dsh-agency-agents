<div align="center">
  <img src="assets/branding/banner.png" alt="DSH Agency Agents" width="100%">
</div>

<div align="center">

  # DSH Agency Agents

  **为 DeepSeek Harness 提供 271 名可召唤的专业智能体**

  [English](README.md) · [Apache-2.0](LICENSE)

  [![许可证：Apache-2.0](https://img.shields.io/badge/许可证-Apache--2.0-blue.svg)](LICENSE)
  [![内置智能体](https://img.shields.io/badge/内置智能体-271-0f766e.svg)](#功能概览)
  [![npm package](https://img.shields.io/npm/v/%40michengai%2Fdsh-agency-agents.svg?label=npm%20package)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/MichengAI/dsh-agency-agents)
  [![Node.js 22 or later](https://img.shields.io/badge/Node.js-22%20or%20later-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
</div>

> DSH Agency Agents 是社区维护的 DeepSeek Harness（DSH）插件，并非 DeepSeek AI 官方产品。

## 功能概览

- 在「设置 → 专家」中按分类筛选或搜索，再启用或停用内置专家。
- 在输入框的「专家」中按名称或 slug 召唤已启用的专家处理完整任务。
- 提供 `list_experts` 与 `summon_expert` 工具，分别用于发现专家和启动一次性子代理。
- 内置 271 份 persona，无需额外下载；也可接入自行同步的专家目录。
- 可把一句话复制到 DSH、Codex 或 WorkBuddy，让对方代装到本机 DSH。

主会话保留任务上下文、判断和最终交付；专家子代理只提供专业视角，不能继续召唤专家，避免递归委派。

## 界面预览

在「设置 → 专家」中按分类筛选或搜索，再启用需要的专家：

![DSH 专家面板](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/agent-roster.png)

在输入框用 `@` 或「专家」选择已启用的专家：

![专家选择器](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/expert-picker.png)

回填名称和 slug 后，写出完整任务：

![召唤专家的输入方式](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/summon-prompt.png)

## 前置条件

- 已可正常运行 DeepSeek Harness Web，且可在 PowerShell 中使用 `dsh`。
- 以下示例使用 `web` profile；请替换为实际目标 profile。
- 从源码安装或二次开发需要 Node.js 22+ 与 pnpm；仅从 npm 安装无需单独执行 `pnpm install`。

## 安装

`dsh plugin add` 会转发到 profile 目录里的 `pnpm add`。不写版本、不指定官方源时，本机镜像和最短发布间隔可能让你停在旧版。

### 交给其他 Agent 一句话安装

本插件运行在 DeepSeek Harness Web 里。把下面其中一句复制到 DSH、Codex 或 WorkBuddy，让它代你安装到本机 `web` profile。

从 npm 安装：

```text
请把 DSH 插件 @michengai/dsh-agency-agents 最新版装进本机 web profile，使用官方 npm 源执行：dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/。装完执行 dsh --profile web --dump-config，确认已挂载 agency-agents，并提醒我重启 DSH Web 后硬刷新浏览器。
```

从源码安装：

```text
请从源码安装 DSH 插件 https://github.com/MichengAI/dsh-agency-agents：克隆到本机后执行 pnpm install --frozen-lockfile 和 pnpm build，再用 dsh plugin --profile web add . 把当前目录装进 web profile。不要只复制 lib。装完执行 dsh --profile web --dump-config，确认已挂载 agency-agents，并提醒我重启 DSH Web 后硬刷新浏览器。
```

| 产品 | 怎么用 |
| --- | --- |
| DSH | 把上面其中一句发给当前会话。 |
| Codex | 把上面其中一句发给 Codex，让它在本机执行安装。 |
| WorkBuddy | 把上面其中一句发给 WorkBuddy；源码安装也可同时粘贴仓库地址 `https://github.com/MichengAI/dsh-agency-agents`。 |

Codex 和 WorkBuddy 只负责代装；装好后仍要打开 DSH Web 使用「设置 → 专家」。

也可以自己执行同一条 npm 命令：

```powershell
dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/
```

未把 `dsh` 装进 PATH 时，把开头的 `dsh` 换成 `npx --yes @deepseek-ai/dsh`。

### 从官方 npm 安装最新版

在任意 PowerShell 目录执行：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

需要钉死某一版时，把 `@latest` 换成具体版本，例如 `@0.1.17`。

配置输出中应包含 `agency-agents` 与 `agency-agents-remote`。安装后重启 DSH Web 并在浏览器硬刷新；请勿手工复制客户端文件，否则设置页所需的 Remote 服务不会被挂载。

### 从源码安装

适用于调试或使用未发布改动。克隆后的本地路径就是插件安装路径：

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

完成后重启 DSH Web 并硬刷新浏览器。`dsh plugin ... add .` 会读取当前目录的包信息和 `cordis.patch.yml`；不要改为直接复制 `lib` 目录。

## 使用

1. 打开「设置 → 专家」，启用需要的专家。
2. 在对话输入框用 `@` 或点击「专家」，选择已启用的专家。
3. 用名称和 slug 明确指定专家，并给出完整任务。例如：

```text
召唤专家「代码审查工程师」（engineering-code-reviewer）处理以下任务：
审查当前工作区的改动，按严重程度列出可复现的问题。
```

也可由主会话先调用 `list_experts(division?)` 查找专家，再使用 `summon_expert(expert, task)` 委派任务。名称不唯一时，请使用 slug。
## 配置与边界

| 配置项 | 默认值 | 作用 |
| --- | --- | --- |
| `root` | 包内专家资产 | 外部专家根目录；显式配置优先。 |
| `provider` | `spawn` | DSH 子代理 provider，可使用支持 persona 与工具过滤的 `fork`。 |
| `divisions` | 17 个标准分区 | 需要扫描的顶层分区。 |
| `maxDepth` | 未设置 | 正整数形式的绝对子代理深度上限。 |

也可设置 `AGENCY_AGENTS_ROOT` 环境变量指定外部专家目录。外部目录里的 persona 正文会注入为子代理系统提示，只应从可信来源加载。子代理 provider 必须支持 persona 和工具过滤能力。`summon_experts` 一次最多 8 名专家，并发 4，部分失败仍返回成功结果。

## 二次开发

- Host 端入口：[src\index.ts](src/index.ts)，负责加载专家目录、注册工具和设置项。
- Remote 契约与实现：[src\remote-contract.ts](src/remote-contract.ts)、[src\remote.ts](src/remote.ts)。
- 客户端入口：[src\client\index.ts](src/client/index.ts)，负责设置页、输入框按钮与 `@` 触发器。
- 内置 persona 位于 `assets\agency-agents`；保留其中的 MIT 许可证和 [NOTICE](NOTICE) 归属说明。

修改 `src` 或 `assets` 后，重新构建并以本地目录安装验证：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
pnpm verify
dsh plugin --profile web add .
```

交接与迭代文档只保留在本机 `docs` 目录，不纳入 Git；克隆仓库后不会得到交接入口。

发布包只包含 `lib`、`assets`、补丁和根目录说明/许可证；不要将 `node_modules` 或本地开发文件加入发布内容。

## 验证

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
pnpm verify
```

`prepublishOnly` 会在发布前依次执行上述构建、测试和包完整性检查。

## 许可证与归属

本项目 TypeScript 源码、构建脚本和文档采用 [Apache License 2.0](LICENSE)。内置专家 persona 源自 [The Agency](https://github.com/msitarzewski/agency-agents)，仍采用 MIT，许可证位于 [assets\agency-agents\LICENSE](assets/agency-agents/LICENSE)。

