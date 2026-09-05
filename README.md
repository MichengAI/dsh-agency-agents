<div align="center">
  <img src="assets/branding/banner.png" alt="DSH Agency Agents" width="100%">
</div>

<div align="center">

  # DSH Agency Agents

  **321 summonable specialist agents for DeepSeek Harness**

  [简体中文](README.zh-CN.md) · [Expert roster](#expert-roster) · [Installation](#installation) · [Changelog](CHANGELOG.md) · [Apache-2.0](LICENSE)

  [![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
  [![Bundled agents](https://img.shields.io/badge/Bundled%20agents-321-0f766e.svg)](#expert-roster)
  [![npm package](https://img.shields.io/npm/v/%40michengai%2Fdsh-agency-agents.svg?label=npm%20package)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![npm downloads](https://img.shields.io/npm/dt/%40michengai%2Fdsh-agency-agents.svg?label=npm%20downloads)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/MichengAI/dsh-agency-agents)
  [![Node.js 22 or later](https://img.shields.io/badge/Node.js-22%20or%20later-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
</div>

> DSH Agency Agents is a community-maintained DeepSeek Harness (DSH) plugin, not an official DeepSeek AI product.

## Features

- Filter by category or search, then enable or disable bundled experts in **Settings → Experts**.
- Summon enabled experts by their localized name from the composer's **Experts** picker.
- Use `list_experts` to discover experts and `summon_expert` to start a one-shot specialist subagent.
- Use 321 bundled personas immediately, or connect a separately synchronized expert directory.
- Paste one sentence into DSH, Codex, or WorkBuddy and let that agent install the plugin locally.

The parent session keeps task context, judgment, and the final answer. Expert children provide a specialist perspective only and cannot summon further experts.

## Screenshots

Filter by category or search in **Settings → Experts**, then enable the experts you need:

![DSH Experts panel](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/agent-roster.png)

Use `@` or the composer's **Experts** picker to choose an enabled expert:

![Experts picker](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/expert-picker.png)

The localized expert name is inserted as a short tag; write the complete task next:

![Summoning an expert from the composer](https://raw.githubusercontent.com/MichengAI/dsh-agency-agents/main/assets/screenshots/summon-prompt.png)

## DSH product ecosystem

This product can be installed independently or used through the desktop app or Web suite. They share the same DSH core but serve different ways of working:

| Product | Relationship to this product |
| --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | The host runtime that provides models, sessions, tools, and the plugin system |
| [DSH Codex Desktop](https://github.com/MichengAI/dsh-codex-desktop) | A ready-to-install desktop product with this product and the other five feature products built in |
| Six feature products | [Codex UI](https://github.com/MichengAI/dsh-codex-ui) · [IM Connect](https://github.com/MichengAI/dsh-im-connect) · [Automation](https://github.com/MichengAI/dsh-automation) · [Skills Manager](https://github.com/MichengAI/dsh-skills-manager) · [Archive Manager](https://github.com/MichengAI/dsh-archive-manager) · [Agency Agents](https://github.com/MichengAI/dsh-agency-agents) |

## Prerequisites

- A working DeepSeek Harness Web installation with `dsh` available in PowerShell.
- Examples use the `web` profile; replace it with the target profile.
- Source installation and development require Node.js 22+ and pnpm. npm installation does not require running `pnpm install` separately.

## Installation

`dsh plugin add` forwards to `pnpm add` in the profile directory. Without a version and official registry, a local mirror or minimum-release-age policy can leave you on an older build.

### Ask another agent to install it

This plugin runs inside DeepSeek Harness Web. Copy one of the sentences below into DSH, Codex, or WorkBuddy and let that agent install it into your local `web` profile.

From npm:

```text
Install the latest DSH plugin @michengai/dsh-agency-agents into my local web profile using the official npm registry: dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/. Then run dsh --profile web --dump-config, confirm agency-agents is mounted, and remind me to restart DSH Web and hard-refresh the browser.
```

From source:

```text
Install the DSH plugin from source at https://github.com/MichengAI/dsh-agency-agents: clone it, run pnpm install --frozen-lockfile and pnpm build, then run dsh plugin --profile web add . from that directory. Do not copy lib by itself. Then run dsh --profile web --dump-config, confirm agency-agents is mounted, and remind me to restart DSH Web and hard-refresh the browser.
```

| Product | How to use it |
| --- | --- |
| DSH | Send one of the sentences above to the current session. |
| Codex | Send one of the sentences above to Codex and let it install locally. |
| WorkBuddy | Send one of the sentences above to WorkBuddy; for a source install you can also paste `https://github.com/MichengAI/dsh-agency-agents`. |

Codex and WorkBuddy only install the plugin. After that, open DSH Web and use **Settings → Experts**.

You can also run the same npm command yourself:

```powershell
dsh plugin --profile web add @michengai/dsh-agency-agents@latest --registry=https://registry.npmjs.org/
```

If `dsh` is not on PATH, replace the leading `dsh` with `npx --yes @deepseek-ai/dsh`.

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
3. The localized expert name is inserted as a short tag. Continue with the complete task.

```text
Code Reviewer

Review the changes in the current workspace and list reproducible issues by severity.
```

The parent session can also call `list_experts(division?)`, then delegate with `summon_expert(expert, task)` using the expert name. The bundled roster validates localized and upstream names for uniqueness.

<a id="expert-roster"></a>

## 🎨 Expert roster

Browse **321 bundled experts across 22 divisions**. Select an expert name to read its English persona.

### Division index

<table width="100%">
  <tr>
    <td width="33%">💻 <a href="#experts-engineering">Engineering</a> <sub>68</sub></td>
    <td width="33%">🎨 <a href="#experts-design">Design</a> <sub>11</sub></td>
    <td width="33%">📢 <a href="#experts-marketing">Marketing</a> <sub>43</sub></td>
  </tr>
  <tr>
    <td width="33%">💰 <a href="#experts-paid-media">Paid Media</a> <sub>7</sub></td>
    <td width="33%">💼 <a href="#experts-sales">Sales</a> <sub>9</sub></td>
    <td width="33%">🏢 <a href="#experts-company">Company Leadership</a> <sub>6</sub></td>
  </tr>
  <tr>
    <td width="33%">🏦 <a href="#experts-finance">Finance</a> <sub>9</sub></td>
    <td width="33%">👔 <a href="#experts-hr">Human Resources</a> <sub>2</sub></td>
    <td width="33%">⚖️ <a href="#experts-legal">Legal</a> <sub>2</sub></td>
  </tr>
  <tr>
    <td width="33%">🚚 <a href="#experts-supply-chain">Supply Chain</a> <sub>4</sub></td>
    <td width="33%">📦 <a href="#experts-product">Product</a> <sub>5</sub></td>
    <td width="33%">📋 <a href="#experts-project-management">Project Management</a> <sub>7</sub></td>
  </tr>
  <tr>
    <td width="33%">🧪 <a href="#experts-testing">Testing</a> <sub>10</sub></td>
    <td width="33%">🤝 <a href="#experts-support">Support</a> <sub>7</sub></td>
    <td width="33%">🛡️ <a href="#experts-security">Security</a> <sub>12</sub></td>
  </tr>
  <tr>
    <td width="33%">🔬 <a href="#experts-specialized">Specialized</a> <sub>68</sub></td>
    <td width="33%">🥽 <a href="#experts-spatial-computing">Spatial Computing</a> <sub>6</sub></td>
    <td width="33%">🎮 <a href="#experts-game-development">Game Development</a> <sub>21</sub></td>
  </tr>
  <tr>
    <td width="33%">📚 <a href="#experts-academic">Academic</a> <sub>7</sub></td>
    <td width="33%">🗺️ <a href="#experts-gis">GIS</a> <sub>13</sub></td>
    <td width="33%">🏥 <a href="#experts-healthcare">Healthcare</a> <sub>3</sub></td>
  </tr>
  <tr>
    <td width="33%">🔍 <a href="#experts-research">Research</a> <sub>1</sub></td>
    <td width="33%"></td>
    <td width="33%"></td>
  </tr>
</table>

<a id="experts-engineering"></a>

### 💻 Engineering Division

Building the future, one commit at a time.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎨 [Frontend Developer](assets/agency-agents/engineering/engineering-frontend-developer.md) | React/Vue/Angular, UI implementation, performance | Modern web apps, pixel-perfect UIs, Core Web Vitals optimization |
| 🏗️ [Backend Architect](assets/agency-agents/engineering/engineering-backend-architect.md) | API design, database architecture, scalability | Server-side systems, microservices, cloud infrastructure |
| 📱 [Mobile App Builder](assets/agency-agents/engineering/engineering-mobile-app-builder.md) | iOS/Android, React Native, Flutter | Native and cross-platform mobile applications |
| 🤖 [AI Engineer](assets/agency-agents/engineering/engineering-ai-engineer.md) | ML models, deployment, AI integration | Machine learning features, data pipelines, AI-powered apps |
| 🚀 [DevOps Automator](assets/agency-agents/engineering/engineering-devops-automator.md) | CI/CD, infrastructure automation, cloud ops | Pipeline development, deployment automation, monitoring |
| 🌐 [Network Engineer](assets/agency-agents/engineering/engineering-network-engineer.md) | Cisco IOS/IOS-XE, Juniper Junos, Palo Alto PAN-OS | Router/switch/firewall configuration, BGP/OSPF, ACLs, show-output troubleshooting |
| ⚡ [Rapid Prototyper](assets/agency-agents/engineering/engineering-rapid-prototyper.md) | Fast POC development, MVPs | Quick proof-of-concepts, hackathon projects, fast iteration |
| 💎 [Senior Developer](assets/agency-agents/engineering/engineering-senior-developer.md) | Laravel/Livewire, advanced patterns | Complex implementations, architecture decisions |
| 🔧 [Filament Optimization Specialist](assets/agency-agents/engineering/engineering-filament-optimization-specialist.md) | Filament PHP admin UX, structural form redesign, resource optimization | Restructuring Filament resources/forms/tables for faster, cleaner admin workflows |
| ⚡ [Autonomous Optimization Architect](assets/agency-agents/engineering/engineering-autonomous-optimization-architect.md) | LLM routing, cost optimization, shadow testing | Autonomous systems needing intelligent API selection and cost guardrails |
| 🔩 [Embedded Firmware Engineer](assets/agency-agents/engineering/engineering-embedded-firmware-engineer.md) | Bare-metal, RTOS, ESP32/STM32/Nordic firmware | Production-grade embedded systems and IoT devices |
| 🚨 [Incident Response Commander](assets/agency-agents/engineering/engineering-incident-response-commander.md) | Incident management, post-mortems, on-call | Managing production incidents and building incident readiness |
| ⛓️ [Solidity Smart Contract Engineer](assets/agency-agents/engineering/engineering-solidity-smart-contract-engineer.md) | EVM contracts, gas optimization, DeFi | Secure, gas-optimized smart contracts and DeFi protocols |
| 🧭 [Codebase Onboarding Engineer](assets/agency-agents/engineering/engineering-codebase-onboarding-engineer.md) | Fast developer onboarding, read-only codebase exploration, factual explanation | Helping new developers understand unfamiliar repos quickly by reading the code, tracing code paths, and stating facts about structure and behavior |
| 📚 [Technical Writer](assets/agency-agents/engineering/engineering-technical-writer.md) | Developer docs, API reference, tutorials | Clear, accurate technical documentation |
| 💬 [WeChat Mini Program Developer](assets/agency-agents/engineering/engineering-wechat-mini-program-developer.md) | WeChat ecosystem, Mini Programs, payment integration | Building performant apps for the WeChat ecosystem |
| 👁️ [Code Reviewer](assets/agency-agents/engineering/engineering-code-reviewer.md) | Constructive code review, security, maintainability | PR reviews, code quality gates, mentoring through review |
| 🗄️ [Database Optimizer](assets/agency-agents/engineering/engineering-database-optimizer.md) | Schema design, query optimization, indexing strategies | PostgreSQL/MySQL tuning, slow query debugging, migration planning |
| 🌿 [Git Workflow Master](assets/agency-agents/engineering/engineering-git-workflow-master.md) | Branching strategies, conventional commits, advanced Git | Git workflow design, history cleanup, CI-friendly branch management |
| 🏛️ [Software Architect](assets/agency-agents/engineering/engineering-software-architect.md) | System design, DDD, architectural patterns, trade-off analysis | Architecture decisions, domain modeling, system evolution strategy |
| 🛡️ [SRE (Site Reliability Engineer)](assets/agency-agents/engineering/engineering-sre.md) | SLOs, error budgets, observability, chaos engineering | Production reliability, toil reduction, capacity planning |
| 🧬 [AI Data Remediation Engineer](assets/agency-agents/engineering/engineering-ai-data-remediation-engineer.md) | Self-healing pipelines, air-gapped SLMs, semantic clustering | Fixing broken data at scale with zero data loss |
| 🔧 [Data Engineer](assets/agency-agents/engineering/engineering-data-engineer.md) | Data pipelines, lakehouse architecture, ETL/ELT | Building reliable data infrastructure and warehousing |
| 🔗 [Feishu Integration Developer](assets/agency-agents/engineering/engineering-feishu-integration-developer.md) | Feishu/Lark Open Platform, bots, workflows | Building integrations for the Feishu ecosystem |
| 🧱 [CMS Developer](assets/agency-agents/engineering/engineering-cms-developer.md) | WordPress &amp; Drupal themes, plugins/modules, content architecture | Code-first CMS implementation and customization |
| 📧 [Email Intelligence Engineer](assets/agency-agents/engineering/engineering-email-intelligence-engineer.md) | Email parsing, MIME extraction, structured data for AI agents | Turning raw email threads into reasoning-ready context |
| 🎙️ [Voice AI Integration Engineer](assets/agency-agents/engineering/engineering-voice-ai-integration-engineer.md) | Speech-to-text pipelines, Whisper, ASR, speaker diarization | End-to-end transcription pipelines, audio preprocessing, structured transcript delivery |
| 🖧 [IT Service Manager](assets/agency-agents/engineering/engineering-it-service-manager.md) | ITIL 4 service management | Incident/problem/change management, SLAs, CMDB |
| 🪡 [Minimal Change Engineer](assets/agency-agents/engineering/engineering-minimal-change-engineer.md) | Minimum-viable diffs | Fixing only what's asked, no scope creep |
| 📜 [OrgScript Engineer](assets/agency-agents/engineering/engineering-orgscript-engineer.md) | OrgScript grammar &amp; AST validation | Designing/parsing OrgScript business-logic definitions |
| 🧬 [Prompt Engineer](assets/agency-agents/engineering/engineering-prompt-engineer.md) | LLM prompt design &amp; optimization | Turning vague instructions into reliable AI behaviors |
| 🕸️ [Multi-Agent Systems Architect](assets/agency-agents/engineering/engineering-multi-agent-systems-architect.md) | Multi-agent pipeline design &amp; governance | Topology, context, trust, failure recovery for agent systems |
| 🛒 [Drupal Shopping Cart Engineer](assets/agency-agents/engineering/engineering-drupal-shopping-cart.md) | Drupal Commerce storefronts | Catalog, payments, checkout, orders on Drupal 10/11 |
| 🛍️ [WordPress Shopping Cart Engineer](assets/agency-agents/engineering/engineering-wordpress-shopping-cart.md) | WooCommerce storefronts | Catalog, payments, checkout, conversion on WordPress |
| 💳 [Payments &amp; Billing Engineer](assets/agency-agents/engineering/engineering-payments-billing-engineer.md) | PSP integration, idempotent payment flows, subscription billing | Stripe/Adyen/Braintree integrations, webhook processing, dunning, reconciliation |
| 🌍 [Internationalization Engineer](assets/agency-agents/engineering/engineering-i18n-engineer.md) | ICU MessageFormat, RTL/bidi layouts, CLDR formatting, pseudo-localization | Making apps translation-ready, locale-aware formatting, RTL support, i18n audits |
| ⚡ [Drupal Performance Engineer](assets/agency-agents/engineering/engineering-drupal-performance.md) | Drupal performance &amp; Core Web Vitals | Caching, DB/query tuning, render pipeline, profiling high-traffic Drupal |
| ⚡ [WordPress Performance Engineer](assets/agency-agents/engineering/engineering-wordpress-performance.md) | WordPress performance &amp; Core Web Vitals | Caching, query/asset optimization, plugin tuning, profiling high-traffic WP |
| ♿ [Section 508 Accessibility Specialist](assets/agency-agents/engineering/engineering-section-508-specialist.md) | US federal 508 / WCAG accessibility | ARIA, screen-reader testing, VPAT/ACR authoring, remediation |
| 🏛️ [USWDS Developer](assets/agency-agents/engineering/engineering-uswds-developer.md) | US Web Design System (federal) | Accessible gov UI components &amp; design-system patterns |
| 🔎 [Search Relevance Engineer](assets/agency-agents/engineering/engineering-search-relevance-engineer.md) | Search ranking &amp; relevance | Query understanding, embeddings, ranking/eval, relevance tuning |
| 🔐 [Identity &amp; Access Engineer](assets/agency-agents/engineering/engineering-identity-access-engineer.md) | AuthN/AuthZ &amp; IAM | OAuth/OIDC/SAML, SSO, RBAC/ABAC, token &amp; session security |
| 🤝 [Realtime Collaboration Engineer](assets/agency-agents/engineering/engineering-realtime-collaboration-engineer.md) | Realtime sync &amp; presence | CRDTs/OT, conflict resolution, live cursors, offline sync |
| 💻 [Desktop App Engineer](assets/agency-agents/engineering/engineering-desktop-app-engineer.md) | Cross-platform desktop apps | Electron/Tauri, native integration, packaging, auto-update |
| 🚀 [Mobile Release Engineer](assets/agency-agents/engineering/engineering-mobile-release-engineer.md) | Mobile release &amp; CI/CD | App Store/Play submission, signing, staged rollout, crash triage |
| 🎬 [Video Streaming Engineer](assets/agency-agents/engineering/engineering-video-streaming-engineer.md) | Video streaming &amp; transcoding | HLS/DASH, ABR, codecs, CDN delivery, low-latency streaming |
| 💰 [FinOps Engineer](assets/agency-agents/engineering/engineering-finops-engineer.md) | Cloud cost engineering | Cost allocation, rightsizing, unit economics, budget &amp; anomaly control |
| 🧩 [WebAssembly Engineer](assets/agency-agents/engineering/engineering-webassembly-engineer.md) | WebAssembly &amp; WASI | Rust/C++→WASM, sandboxing, host bindings, performance |
| 🔌 [API Platform Engineer](assets/agency-agents/engineering/engineering-api-platform-engineer.md) | API gateways &amp; platforms | Gateway design, versioning, rate limiting, developer portals |
| 🛟 [Database Reliability Engineer](assets/agency-agents/engineering/engineering-database-reliability-engineer.md) | Database reliability (DBRE) | HA/replication, automated failover, PITR backups, zero-downtime ops |
| 🛠️ [Developer Tooling Engineer](assets/agency-agents/engineering/engineering-developer-tooling-engineer.md) | CLI &amp; developer tooling | Command-line tools, internal DX, build/dev workflows |
| 📡 [IoT Fleet Engineer](assets/agency-agents/engineering/engineering-iot-fleet-engineer.md) | IoT &amp; edge fleet | Device provisioning/identity, MQTT telemetry, OTA updates |
| 🔍 [RAG Pipeline Engineer](assets/agency-agents/engineering/engineering-rag-pipeline-engineer.md) | Production RAG pipelines | Chunking, retrieval quality, hybrid search, re-ranking, eval-driven iteration |
| 🗄️ [GaussDB Expert Engineer](assets/agency-agents/engineering/engineering-gaussdb-expert.md) | Huawei GaussDB OLTP | Enterprise OLTP performance, HA, and migration on Huawei's GaussDB |
| 🕵️ [Privacy Engineer](assets/agency-agents/engineering/engineering-privacy-engineer.md) | PII discovery, data minimization, consent enforcement, DSAR/deletion pipelines | Implementing privacy in code, right-to-be-forgotten across services, retention automation |
| 🦀 [Rust Refactoring Specialist](assets/agency-agents/engineering/engineering-rust-refactoring-specialist.md) | Behavior-aware Rust refactoring | Reforming crates/traits/modules with evidence-based, behavior-preserving changes |
| 🧪 [LLM Post-Training Engineer](assets/agency-agents/engineering/engineering-llm-post-training-engineer.md) | Post-training stack (SFT/DPO/GRPO/RLVR) | Evidence-based experiment gating, checkpoint integrity, failure classification |
| 📈 [Data Visualization Engineer](assets/agency-agents/engineering/engineering-data-visualization-engineer.md) | Perceptually honest data viz | Chart-type selection, colorblind-safe palettes, performant D3/Vega rendering |
| 🧠 [Knowledge Graph Engineer](assets/agency-agents/engineering/engineering-knowledge-graph-engineer.md) | Knowledge graphs, entity-relationship extraction, graph-enhanced RAG | Structuring documents into queryable Neo4j graphs with LangGraph; provenance, contradiction tracking, subgraph retrieval |
| 🔗 [DingTalk Integration Developer](assets/agency-agents/engineering/engineering-dingtalk-integration-developer.md) | DingTalk bots, Cool Apps, approvals, connectors | Enterprise collaboration and DingTalk integrations |
| 🔌 [Embedded Linux Driver Engineer](assets/agency-agents/engineering/engineering-embedded-linux-driver-engineer.md) | Kernel modules, device trees, I2C/SPI/USB drivers | Embedded Linux drivers and BSP development |
| 🔬 [FPGA/ASIC Digital Design Engineer](assets/agency-agents/engineering/engineering-fpga-digital-design-engineer.md) | Verilog/SystemVerilog, AXI buses, timing closure | FPGA development, digital logic, SoC verification |
| 📡 [IoT Solution Architect](assets/agency-agents/engineering/engineering-iot-solution-architect.md) | MQTT/CoAP, edge computing, device management, cloud IoT | End-to-end IoT architecture and deployment |
| ⚙️ [Mechanical Design Engineer](assets/agency-agents/engineering/engineering-mechanical-design-engineer.md) | Mechanisms, structural analysis, DFMA, engineering drawings | Industrial equipment, automated production, mechanical products |
| 🌐 [China Enterprise Network Engineer](assets/agency-agents/engineering/engineering-network-engineer-china.md) | Huawei VRP, H3C Comware, Ruijie, VLAN/OSPF/BGP/VXLAN | Campus, data-center, and WAN networks using Chinese vendors |
| 🖥️ [Industrial Desktop Application Engineer](assets/agency-agents/engineering/engineering-pc-host-engineer.md) | Qt/QML, serial/Modbus/CAN, real-time visualization | Industrial desktop software, test equipment, HMIs |
| 🔒 [Security Engineering Consultant](assets/agency-agents/engineering/engineering-security-engineer.md) | Threat modeling, secure code review, security architecture | Application security reviews and vulnerability assessment |
| 🛡️ [Security Operations Detection Engineer](assets/agency-agents/engineering/engineering-threat-detection-engineer.md) | SIEM rules, MITRE ATT&amp;CK, threat hunting | Detection engineering and security monitoring |

<a id="experts-design"></a>

### 🎨 Design Division

Making it beautiful, usable, and delightful.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎯 [UI Designer](assets/agency-agents/design/design-ui-designer.md) | Visual design, component libraries, design systems | Interface creation, brand consistency, component design |
| 🔍 [UX Researcher](assets/agency-agents/design/design-ux-researcher.md) | User testing, behavior analysis, research | Understanding users, usability testing, design insights |
| 🏛️ [UX Architect](assets/agency-agents/design/design-ux-architect.md) | Technical architecture, CSS systems, implementation | Developer-friendly foundations, implementation guidance |
| 🎭 [Brand Guardian](assets/agency-agents/design/design-brand-guardian.md) | Brand identity, consistency, positioning | Brand strategy, identity development, guidelines |
| 📖 [Visual Storyteller](assets/agency-agents/design/design-visual-storyteller.md) | Visual narratives, multimedia content | Compelling visual stories, brand storytelling |
| ✨ [Whimsy Injector](assets/agency-agents/design/design-whimsy-injector.md) | Personality, delight, playful interactions | Adding joy, micro-interactions, Easter eggs, brand personality |
| 📷 [Image Prompt Engineer](assets/agency-agents/design/design-image-prompt-engineer.md) | AI image generation prompts, photography | Photography prompts for Midjourney, DALL-E, Stable Diffusion |
| 🌈 [Inclusive Visuals Specialist](assets/agency-agents/design/design-inclusive-visuals-specialist.md) | Representation, bias mitigation, authentic imagery | Generating culturally accurate AI images and video |
| 🎭 [Persona Walkthrough Specialist](assets/agency-agents/design/design-persona-walkthrough.md) | Persona-driven cognitive walkthroughs | Simulating user reactions and friction at each scroll position |
| 🧱 [UI Finish-Gate Reviewer](assets/agency-agents/design/design-ui-finish-gate-reviewer.md) | Anti-generic UI finish gate | Catching interchangeable UI before ship via evidence + a written design contract |
| 🎬 [AI Video Prompt Engineer](assets/agency-agents/design/design-video-prompt-engineer.md) | AI video prompts, shot design, camera movement, sound | Preparing video prompts for Sora, Kling, Veo, and Seedance |

<a id="experts-marketing"></a>

### 📢 Marketing Division

Connecting content, channels, and audiences to drive growth.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🚀 [Growth Hacker](assets/agency-agents/marketing/marketing-growth-hacker.md) | Rapid user acquisition, viral loops, experiments | Explosive growth, user acquisition, conversion optimization |
| 📝 [Content Creator](assets/agency-agents/marketing/marketing-content-creator.md) | Multi-platform content, editorial calendars | Content strategy, copywriting, brand storytelling |
| 🐦 [Twitter Engager](assets/agency-agents/marketing/marketing-twitter-engager.md) | Real-time engagement, thought leadership | Twitter strategy, LinkedIn campaigns, professional social |
| 🛰️ [X/Twitter Intelligence Analyst](assets/agency-agents/marketing/marketing-x-twitter-intelligence-analyst.md) | Social listening, trend detection, account monitoring | Brand risk, competitor, and audience intelligence on X/Twitter |
| 📱 [TikTok Strategist](assets/agency-agents/marketing/marketing-tiktok-strategist.md) | Viral content, algorithm optimization | TikTok growth, viral content, Gen Z/Millennial audience |
| 📸 [Instagram Curator](assets/agency-agents/marketing/marketing-instagram-curator.md) | Visual storytelling, community building | Instagram strategy, aesthetic development, visual content |
| 🤝 [Reddit Community Builder](assets/agency-agents/marketing/marketing-reddit-community-builder.md) | Authentic engagement, value-driven content | Reddit strategy, community trust, authentic marketing |
| 📱 [App Store Optimizer](assets/agency-agents/marketing/marketing-app-store-optimizer.md) | ASO, conversion optimization, discoverability | App marketing, store optimization, app growth |
| 🌐 [Social Media Strategist](assets/agency-agents/marketing/marketing-social-media-strategist.md) | Cross-platform strategy, campaigns | Overall social strategy, multi-platform campaigns |
| 📕 [Xiaohongshu Specialist](assets/agency-agents/marketing/marketing-xiaohongshu-specialist.md) | Lifestyle content, trend-driven strategy | Xiaohongshu growth, aesthetic storytelling, Gen Z audience |
| 💬 [WeChat Official Account Manager](assets/agency-agents/marketing/marketing-wechat-official-account.md) | Subscriber engagement, content marketing | WeChat OA strategy, community building, conversion optimization |
| 🧠 [Zhihu Strategist](assets/agency-agents/marketing/marketing-zhihu-strategist.md) | Thought leadership, knowledge-driven engagement | Zhihu authority building, Q&amp;A strategy, lead generation |
| 🇨🇳 [Baidu SEO Specialist](assets/agency-agents/marketing/marketing-baidu-seo-specialist.md) | Baidu optimization, China SEO, ICP compliance | Ranking in Baidu and reaching China's search market |
| 🎬 [Bilibili Content Strategist](assets/agency-agents/marketing/marketing-bilibili-content-strategist.md) | Bilibili algorithm, danmaku culture, creator growth | Building audiences on Bilibili with community-first content |
| 🎠 [Carousel Growth Engine](assets/agency-agents/marketing/marketing-carousel-growth-engine.md) | TikTok/Instagram carousels, autonomous publishing | Generating and publishing viral carousel content |
| 💼 [LinkedIn Content Creator](assets/agency-agents/marketing/marketing-linkedin-content-creator.md) | Personal branding, thought leadership, professional content | LinkedIn growth, professional audience building, B2B content |
| 🛒 [China E-Commerce Operator](assets/agency-agents/marketing/marketing-china-ecommerce-operator.md) | Taobao, Tmall, Pinduoduo, live commerce | Running multi-platform e-commerce in China |
| 🎥 [Kuaishou Strategist](assets/agency-agents/marketing/marketing-kuaishou-strategist.md) | Kuaishou, loyal communities, grassroots growth | Building authentic audiences in lower-tier markets |
| 🔍 [SEO Specialist](assets/agency-agents/marketing/marketing-seo-specialist.md) | Technical SEO, content strategy, link building | Driving sustainable organic search growth |
| 📘 [Book Co-Author](assets/agency-agents/marketing/marketing-book-co-author.md) | Thought-leadership books, ghostwriting, publishing | Strategic book collaboration for founders and experts |
| 🌏 [Cross-Border E-Commerce Specialist](assets/agency-agents/marketing/marketing-cross-border-ecommerce.md) | Amazon, Shopee, Lazada, cross-border fulfillment | Full-funnel cross-border e-commerce strategy |
| 🎵 [Douyin Strategist](assets/agency-agents/marketing/marketing-douyin-strategist.md) | Douyin platform, short-video marketing, algorithm | Growing audiences on China's leading short-video platform |
| 🎙️ [Livestream Commerce Coach](assets/agency-agents/marketing/marketing-livestream-commerce-coach.md) | Host training, live room optimization, conversion | Building high-performing livestream e-commerce operations |
| 🎧 [Podcast Strategist](assets/agency-agents/marketing/marketing-podcast-strategist.md) | Podcast content strategy, platform optimization | Chinese podcast market strategy and operations |
| 🔒 [Private Domain Operator](assets/agency-agents/marketing/marketing-private-domain-operator.md) | WeCom, private traffic, community operations | Building enterprise WeChat private domain ecosystems |
| 🎬 [Short-Video Editing Coach](assets/agency-agents/marketing/marketing-short-video-editing-coach.md) | Post-production, editing workflows, platform specs | Hands-on short-video editing training and optimization |
| 🔥 [Weibo Strategist](assets/agency-agents/marketing/marketing-weibo-strategist.md) | Sina Weibo, trending topics, fan engagement | Full-spectrum Weibo operations and growth |
| 🎙️ [Global Podcast Strategist](assets/agency-agents/marketing/marketing-global-podcast-strategist.md) | Show positioning, audience growth, monetisation | Podcast launch, platform algorithms, sponsorship, community building |
| 🔮 [AI Citation Strategist](assets/agency-agents/marketing/marketing-ai-citation-strategist.md) | AEO/GEO, AI recommendation visibility, citation auditing | Improving brand visibility across ChatGPT, Claude, Gemini, Perplexity |
| 🇨🇳 [China Market Localization Strategist](assets/agency-agents/marketing/marketing-china-market-localization-strategist.md) | Full-stack China market localization, Douyin/Xiaohongshu/WeChat GTM | Turning trend signals into executable China go-to-market strategies |
| 🎬 [Video Optimization Specialist](assets/agency-agents/marketing/marketing-video-optimization-specialist.md) | YouTube algorithm strategy, chaptering, thumbnail concepts | YouTube channel growth, video SEO, audience retention optimization |
| 🏗️ [AEO Foundations Architect](assets/agency-agents/marketing/marketing-aeo-foundations.md) | AI Engine Optimization infrastructure | llms.txt, AI-aware robots.txt, agent discovery files |
| 🤖 [Agentic Search Optimizer](assets/agency-agents/marketing/marketing-agentic-search-optimizer.md) | WebMCP &amp; agentic task completion | Making sites usable by AI browsing agents |
| 📧 [Email Marketing Strategist](assets/agency-agents/marketing/marketing-email-strategist.md) | Lifecycle email &amp; deliverability | CRM campaigns, automation, segmentation |
| 📡 [Multi-Platform Publisher](assets/agency-agents/marketing/marketing-multi-platform-publisher.md) | One-click Chinese multi-platform publishing | Adapting articles for Zhihu, Xiaohongshu, CSDN, Bilibili, WeChat, and Juejin |
| 📣 [PR &amp; Communications Manager](assets/agency-agents/marketing/marketing-pr-communications-manager.md) | PR, media relations &amp; crisis comms | Press releases, thought leadership, reputation |
| 📺 [Bilibili Long-Form Video Strategist](assets/agency-agents/marketing/marketing-bilibili-strategist.md) | Long-form video, creator operations, danmaku, monetization | Bilibili content strategy and sustainable audience growth |
| 📰 [News Intelligence Analyst](assets/agency-agents/marketing/marketing-daily-news-briefing.md) | Source verification, news prioritization, structured briefs | Daily news intelligence for content teams |
| 🛒 [China E-commerce Operations Specialist](assets/agency-agents/marketing/marketing-ecommerce-operator.md) | Merchandising, listings, campaigns, livestream commerce | Taobao, Tmall, JD.com, and Pinduoduo store operations |
| 🎓 [Knowledge Commerce Product Strategist](assets/agency-agents/marketing/marketing-knowledge-commerce-strategist.md) | Course packaging, pricing, community operations | Launching and monetizing knowledge products in China |
| 💬 [WeChat Official Account Operator](assets/agency-agents/marketing/marketing-wechat-operator.md) | Official Accounts, editorial planning, private-domain growth | WeChat content operations and customer conversion |
| 📹 [Weixin Channels Growth Strategist](assets/agency-agents/marketing/marketing-weixin-channels-strategist.md) | Social recommendation, short video, livestream commerce | Weixin Channels growth and WeChat ecosystem coordination |
| 📕 [Xiaohongshu Growth Operator](assets/agency-agents/marketing/marketing-xiaohongshu-operator.md) | Discovery-led posts, search visibility, creator partnerships | Xiaohongshu content testing and customer acquisition |

<a id="experts-paid-media"></a>

### 💰 Paid Media Division

Turning advertising budgets into measurable growth.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 💰 [PPC Campaign Strategist](assets/agency-agents/paid-media/paid-media-ppc-strategist.md) | Google/Microsoft/Amazon Ads, account architecture, bidding | Account buildouts, budget allocation, scaling, performance diagnosis |
| 🔍 [Search Query Analyst](assets/agency-agents/paid-media/paid-media-search-query-analyst.md) | Search term analysis, negative keywords, intent mapping | Query audits, wasted spend elimination, keyword discovery |
| 📋 [Paid Media Auditor](assets/agency-agents/paid-media/paid-media-auditor.md) | 200+ point account audits, competitive analysis | Account takeovers, quarterly reviews, competitive pitches |
| 📡 [Tracking &amp; Measurement Specialist](assets/agency-agents/paid-media/paid-media-tracking-specialist.md) | GTM, GA4, conversion tracking, CAPI | New implementations, tracking audits, platform migrations |
| ✍️ [Ad Creative Strategist](assets/agency-agents/paid-media/paid-media-creative-strategist.md) | RSA copy, Meta creative, Performance Max assets | Creative launches, testing programs, ad fatigue refreshes |
| 📺 [Programmatic &amp; Display Buyer](assets/agency-agents/paid-media/paid-media-programmatic-buyer.md) | GDN, DSPs, partner media, ABM display | Display planning, partner outreach, ABM programs |
| 📱 [Paid Social Strategist](assets/agency-agents/paid-media/paid-media-paid-social-strategist.md) | Meta, LinkedIn, TikTok, cross-platform social | Social ad programs, platform selection, audience strategy |

<a id="experts-sales"></a>

### 💼 Sales Division

Moving opportunities from first contact to closed deals.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎯 [Outbound Strategist](assets/agency-agents/sales/sales-outbound-strategist.md) | Signal-based prospecting, multi-channel sequences, ICP targeting | Building pipeline through research-driven outreach, not volume |
| 🔍 [Discovery Coach](assets/agency-agents/sales/sales-discovery-coach.md) | SPIN, Gap Selling, Sandler — question design and call structure | Preparing for discovery calls, qualifying opportunities, coaching reps |
| ♟️ [Deal Strategist](assets/agency-agents/sales/sales-deal-strategist.md) | MEDDPICC qualification, competitive positioning, win planning | Scoring deals, exposing pipeline risk, building win strategies |
| 🛠️ [Sales Engineer](assets/agency-agents/sales/sales-engineer.md) | Technical demos, POC scoping, competitive battlecards | Pre-sales technical wins, demo prep, competitive positioning |
| 🏹 [Proposal Strategist](assets/agency-agents/sales/sales-proposal-strategist.md) | RFP response, win themes, narrative structure | Writing proposals that persuade, not just comply |
| 📊 [Pipeline Analyst](assets/agency-agents/sales/sales-pipeline-analyst.md) | Forecasting, pipeline health, deal velocity, RevOps | Pipeline reviews, forecast accuracy, revenue operations |
| 🗺️ [Account Strategist](assets/agency-agents/sales/sales-account-strategist.md) | Land-and-expand, QBRs, stakeholder mapping | Post-sale expansion, account planning, NRR growth |
| 🏋️ [Sales Coach](assets/agency-agents/sales/sales-coach.md) | Rep development, call coaching, pipeline review facilitation | Making every rep and every deal better through structured coaching |
| 🧲 [Offer &amp; Lead Gen Strategist](assets/agency-agents/sales/sales-offer-lead-gen-strategist.md) | Offers &amp; lead magnets | Top-of-funnel offer construction and lead gen |

<a id="experts-company"></a>

### 🏢 Company Leadership Division

Setting direction, allocating resources, and aligning execution.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 👔 [Chief Executive Officer (CEO)](assets/agency-agents/company/chief-executive-officer.md) | Strategy, resource allocation, executive alignment | Setting company direction and making major trade-offs |
| 📣 [Chief Marketing Officer (CMO)](assets/agency-agents/company/chief-marketing-officer.md) | Positioning, channel mix, marketing budgets, brand equity | Growth strategy, budget allocation, brand building |
| 👔 [Executive Chief of Staff](assets/agency-agents/company/chief-of-staff.md) | Executive coordination, decision routing, OKR tracking | Leadership meetings and cross-functional follow-through |
| ⚙️ [Chief Operating Officer (COO)](assets/agency-agents/company/chief-operating-officer.md) | Processes, operating metrics, accountability | Turning strategy into SOPs and reliable execution |
| 🧭 [Chief Product Officer (CPO)](assets/agency-agents/company/chief-product-officer.md) | Product strategy, roadmap prioritization, product organization | Resolving product priorities and reviewing outcomes |
| 🛠️ [Chief Technology Officer (CTO)](assets/agency-agents/company/chief-technology-officer.md) | Technology strategy, architecture, engineering organization | Technology selection, technical debt, engineering effectiveness |

<a id="experts-finance"></a>

### 🏦 Finance Division

Supporting business and investment decisions with financial insight.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 📒 [Bookkeeper &amp; Controller](assets/agency-agents/finance/finance-bookkeeper-controller.md) | Month-end close, reconciliation, GAAP compliance, internal controls | Day-to-day accounting operations, audit readiness, financial record-keeping |
| 📊 [Financial Analyst](assets/agency-agents/finance/finance-financial-analyst.md) | Financial modeling, forecasting, scenario analysis, decision support | Three-statement models, variance analysis, data-driven business intelligence |
| 📈 [FP&amp;A Analyst](assets/agency-agents/finance/finance-fpa-analyst.md) | Budgeting, rolling forecasts, variance analysis, business reviews | Annual operating plans, monthly business reviews, strategic resource allocation |
| 🔍 [Investment Researcher](assets/agency-agents/finance/finance-investment-researcher.md) | Due diligence, portfolio analysis, asset valuation, equity research | Investment thesis development, risk assessment, market research |
| 🏛️ [Tax Strategist](assets/agency-agents/finance/finance-tax-strategist.md) | Tax optimization, multi-jurisdictional compliance, transfer pricing | Entity structuring, ETR analysis, audit defense, strategic tax planning |
| 🔮 [Financial Forecasting Analyst](assets/agency-agents/finance/finance-financial-forecaster.md) | Revenue forecasts, cash flow, burn rate, scenario models | Runway planning, fundraising, financial uncertainty |
| 🕵️ [Financial Fraud Risk Analyst](assets/agency-agents/finance/finance-fraud-detector.md) | Payment risk, AML, identity signals, case review | Transaction fraud detection and financial crime controls |
| ⚖️ [Hong Kong Stock Market Compliance Reviewer](assets/agency-agents/finance/finance-hk-stock-compliance-reviewer.md) | HKEX Listing Rules, SFC requirements, corporate governance | Listing applications, disclosure, connected transactions |
| 🧾 [Invoice Management Specialist](assets/agency-agents/finance/finance-invoice-manager.md) | VAT invoices, e-invoices, reconciliation, tax workflows | China invoicing, reimbursement, and financial controls |

<a id="experts-hr"></a>

### 👔 Human Resources Division

Bringing structure to recruiting, performance, and talent development.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 📋 [Performance Management Specialist](assets/agency-agents/hr/hr-performance-reviewer.md) | OKRs, KPIs, 360-degree feedback, calibration | Performance reviews, improvement plans, talent development |
| 🎯 [Full-Cycle Recruiter](assets/agency-agents/hr/hr-recruiter.md) | Sourcing, resume screening, interviews, offers | Full-cycle recruiting in the Chinese talent market |

<a id="experts-legal"></a>

### ⚖️ Legal Division

Reviewing contract risk and writing practical policies.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 📑 [Contract Review Specialist](assets/agency-agents/legal/legal-contract-reviewer.md) | Contract clauses, redlines, electronic signatures, disputes | Commercial contract review under Chinese law |
| 📜 [Legal Policy Writer](assets/agency-agents/legal/legal-policy-writer.md) | Internal policies, privacy notices, PIPL/DSL/CSL | Drafting company policies and service terms in China |

<a id="experts-supply-chain"></a>

### 🚚 Supply Chain Division

Coordinating procurement, inventory, production, and delivery.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🏭 [Garment Factory Planning Engineer](assets/agency-agents/supply-chain/supply-chain-garment-factory-planning-engineer.md) | Plant layout, capacity modeling, equipment, lean production | Planning apparel factories across multiple countries and sites |
| 📦 [Inventory Forecasting Specialist](assets/agency-agents/supply-chain/supply-chain-inventory-forecaster.md) | Demand forecasts, safety stock, replenishment | Inventory planning for Chinese e-commerce promotion cycles |
| 🗺️ [Logistics Route Optimizer](assets/agency-agents/supply-chain/supply-chain-route-optimizer.md) | Route planning, delivery networks, cold chain | Reducing logistics costs while meeting delivery deadlines |
| 🔍 [Vendor Evaluation Specialist](assets/agency-agents/supply-chain/supply-chain-vendor-evaluator.md) | Supplier scoring, factory audits, quality systems, negotiation | Supplier selection and procurement lifecycle management |

<a id="experts-product"></a>

### 📦 Product Division

Finding product opportunities and setting priorities around user needs.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎯 [Sprint Prioritizer](assets/agency-agents/product/product-sprint-prioritizer.md) | Agile planning, feature prioritization | Sprint planning, resource allocation, backlog management |
| 🔍 [Trend Researcher](assets/agency-agents/product/product-trend-researcher.md) | Market intelligence, competitive analysis | Market research, opportunity assessment, trend identification |
| 💬 [Feedback Synthesizer](assets/agency-agents/product/product-feedback-synthesizer.md) | User feedback analysis, insights extraction | Feedback analysis, user insights, product priorities |
| 🧠 [Behavioral Nudge Engine](assets/agency-agents/product/product-behavioral-nudge-engine.md) | Behavioral psychology, nudge design, engagement | Maximizing user motivation through behavioral science |
| 🧭 [Product Manager](assets/agency-agents/product/product-manager.md) | Full lifecycle product ownership | Discovery, PRDs, roadmap planning, GTM, outcome measurement |

<a id="experts-project-management"></a>

### 📋 Project Management Division

Keeping people, timelines, and decisions aligned for delivery.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎬 [Studio Producer](assets/agency-agents/project-management/project-management-studio-producer.md) | High-level orchestration, portfolio management | Multi-project oversight, strategic alignment, resource allocation |
| 🐑 [Project Shepherd](assets/agency-agents/project-management/project-management-project-shepherd.md) | Cross-functional coordination, timeline management | End-to-end project coordination, stakeholder management |
| ⚙️ [Studio Operations](assets/agency-agents/project-management/project-management-studio-operations.md) | Day-to-day efficiency, process optimization | Operational excellence, team support, productivity |
| 🧪 [Experiment Tracker](assets/agency-agents/project-management/project-management-experiment-tracker.md) | A/B tests, hypothesis validation | Experiment management, data-driven decisions, testing |
| 👔 [Senior Project Manager](assets/agency-agents/project-management/project-manager-senior.md) | Realistic scoping, task conversion | Converting specs to tasks, scope management |
| 📋 [Jira Workflow Steward](assets/agency-agents/project-management/project-management-jira-workflow-steward.md) | Git workflow, branch strategy, traceability | Enforcing Jira-linked Git discipline and delivery |
| 📋 [Meeting Notes Specialist](assets/agency-agents/project-management/project-management-meeting-notes-specialist.md) | Structured meeting summaries | Extracting decisions, action items, open questions |

<a id="experts-testing"></a>

### 🧪 Testing Division

Validating quality through tests and reproducible evidence.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 📸 [Evidence Collector](assets/agency-agents/testing/testing-evidence-collector.md) | Screenshot-based QA, visual proof | UI testing, visual verification, bug documentation |
| 🔍 [Reality Checker](assets/agency-agents/testing/testing-reality-checker.md) | Evidence-based certification, quality gates | Production readiness, quality approval, release certification |
| 📊 [Test Results Analyzer](assets/agency-agents/testing/testing-test-results-analyzer.md) | Test evaluation, metrics analysis | Test output analysis, quality insights, coverage reporting |
| ⚡ [Performance Benchmarker](assets/agency-agents/testing/testing-performance-benchmarker.md) | Performance testing, optimization | Speed testing, load testing, performance tuning |
| 🔌 [API Tester](assets/agency-agents/testing/testing-api-tester.md) | API validation, integration testing | API testing, endpoint verification, integration QA |
| 🛠️ [Tool Evaluator](assets/agency-agents/testing/testing-tool-evaluator.md) | Technology assessment, tool selection | Evaluating tools, software recommendations, tech decisions |
| 🔄 [Workflow Optimizer](assets/agency-agents/testing/testing-workflow-optimizer.md) | Process analysis, workflow improvement | Process optimization, efficiency gains, automation opportunities |
| ♿ [Accessibility Auditor](assets/agency-agents/testing/testing-accessibility-auditor.md) | WCAG auditing, assistive technology testing | Accessibility compliance, screen reader testing, inclusive design verification |
| 🎭 [Test Automation Engineer](assets/agency-agents/testing/testing-test-automation-engineer.md) | Playwright/Cypress E2E, flake elimination, CI parallelization | Browser test suites, deterministic pipelines, trace-driven failure debugging |
| 🔌 [Embedded QA Engineer](assets/agency-agents/testing/testing-embedded-qa-engineer.md) | HIL, firmware automation, OTA regression, fault injection | Embedded reliability testing and production test planning |

<a id="experts-support"></a>

### 🤝 Support Division

Keeping daily operations running and helping customers and teams.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 💬 [Support Responder](assets/agency-agents/support/support-support-responder.md) | Customer service, issue resolution | Customer support, user experience, support operations |
| 📊 [Analytics Reporter](assets/agency-agents/support/support-analytics-reporter.md) | Data analysis, dashboards, insights | Business intelligence, KPI tracking, data visualization |
| 💰 [Finance Tracker](assets/agency-agents/support/support-finance-tracker.md) | Financial planning, budget management | Financial analysis, cash flow, business performance |
| 🏗️ [Infrastructure Maintainer](assets/agency-agents/support/support-infrastructure-maintainer.md) | System reliability, performance optimization | Infrastructure management, system operations, monitoring |
| ⚖️ [Legal Compliance Checker](assets/agency-agents/support/support-legal-compliance-checker.md) | Compliance, regulations, legal review | Legal compliance, regulatory requirements, risk management |
| 📑 [Executive Summary Generator](assets/agency-agents/support/support-executive-summary-generator.md) | C-suite communication, strategic summaries | Executive reporting, strategic communication, decision support |
| 🎯 [Recruitment Operations Specialist](assets/agency-agents/support/support-recruitment-specialist.md) | Hiring channels, structured assessment, employer branding | Recruitment operations and labor-law compliance in China |

<a id="experts-security"></a>

### 🛡️ Security Division

Managing security risks from architecture through incident response.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🛡️ [Security Architect](assets/agency-agents/security/security-architect.md) | Threat modeling, secure-by-design, trust boundaries | System security models, architecture reviews, defense-in-depth |
| 🔐 [Application Security Engineer](assets/agency-agents/security/security-appsec-engineer.md) | SDLC security, SAST/DAST, secure code review | Securing the dev lifecycle, code-level vulnerabilities |
| 🗡️ [Penetration Tester](assets/agency-agents/security/security-penetration-tester.md) | Authorized pentests, red team ops, exploitation | Finding exploitable weaknesses before attackers do |
| ☁️ [Cloud Security Architect](assets/agency-agents/security/security-cloud-security-architect.md) | Zero trust, cloud-native defense-in-depth | Securing cloud infrastructure and architectures |
| 🚨 [Incident Responder](assets/agency-agents/security/security-incident-responder.md) | DFIR, breach investigation, threat containment | Active breaches, forensics, crisis response |
| 🔍 [Threat Intelligence Analyst](assets/agency-agents/security/security-threat-intelligence-analyst.md) | Adversary tracking, campaign mapping, ATT&amp;CK | Understanding who's attacking and how |
| 🎯 [Threat Detection Engineer](assets/agency-agents/security/security-threat-detection-engineer.md) | SIEM rules, threat hunting, ATT&amp;CK mapping | Building detection layers and threat hunting |
| 🛡️ [Senior SecOps Engineer](assets/agency-agents/security/security-senior-secops.md) | Secrets scanning, secure-by-default submissions | Defensive code-level security on every change |
| 📋 [Compliance Auditor](assets/agency-agents/security/security-compliance-auditor.md) | SOC 2, ISO 27001, HIPAA, PCI-DSS | Guiding organizations through compliance certification |
| 🛡️ [Blockchain Security Auditor](assets/agency-agents/security/security-blockchain-security-auditor.md) | Smart contract audits, exploit analysis | Finding vulnerabilities in contracts before deployment |
| 🔎 [AI-Generated Code Security Auditor](assets/agency-agents/security/security-ai-generated-code-auditor.md) | Security review of AI/vibe-coded apps | Hardcoded secrets, broken RLS, prompt-injection sinks |
| 🔑 [Secrets &amp; Credential Hygiene Engineer](assets/agency-agents/security/security-secrets-credential-engineer.md) | Secrets &amp; credential lifecycle | Detection, vaulting, rotation, leak response |

<a id="experts-specialized"></a>

### 🔬 Specialized Division

Bringing domain expertise to industry-specific and complex work.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎯 [Sales Outreach](assets/agency-agents/specialized/sales-outreach.md) | Cold prospecting, multi-touch cadences, objection handling, proposals | Top-of-funnel B2B outreach — from cold email to booked discovery call |
| 🎭 [Agents Orchestrator](assets/agency-agents/specialized/agents-orchestrator.md) | Multi-agent coordination, workflow management | Complex projects requiring multiple agent coordination |
| 🔍 [LSP/Index Engineer](assets/agency-agents/specialized/lsp-index-engineer.md) | Language Server Protocol, code intelligence | Code intelligence systems, LSP implementation, semantic indexing |
| 📥 [Sales Data Extraction Agent](assets/agency-agents/specialized/sales-data-extraction-agent.md) | Excel monitoring, sales metric extraction | Sales data ingestion, MTD/YTD/Year End metrics |
| 📈 [Data Consolidation Agent](assets/agency-agents/specialized/data-consolidation-agent.md) | Sales data aggregation, dashboard reports | Territory summaries, rep performance, pipeline snapshots |
| 📬 [Report Distribution Agent](assets/agency-agents/specialized/report-distribution-agent.md) | Automated report delivery | Territory-based report distribution, scheduled sends |
| 🔐 [Agentic Identity &amp; Trust Architect](assets/agency-agents/specialized/agentic-identity-trust.md) | Agent identity, authentication, trust verification | Multi-agent identity systems, agent authorization, audit trails |
| 🔗 [Identity Graph Operator](assets/agency-agents/specialized/identity-graph-operator.md) | Shared identity resolution for multi-agent systems | Entity deduplication, merge proposals, cross-agent identity consistency |
| 💸 [Accounts Payable Agent](assets/agency-agents/specialized/accounts-payable-agent.md) | Payment processing, vendor management, audit | Autonomous payment execution across crypto, fiat, stablecoins |
| 🌍 [Cultural Intelligence Strategist](assets/agency-agents/specialized/specialized-cultural-intelligence-strategist.md) | Global UX, representation, cultural exclusion | Ensuring software resonates across cultures |
| 🗣️ [Developer Advocate](assets/agency-agents/specialized/specialized-developer-advocate.md) | Community building, DX, developer content | Bridging product and developer community |
| 🔬 [Model QA Specialist](assets/agency-agents/specialized/specialized-model-qa.md) | ML audits, feature analysis, interpretability | End-to-end QA for machine learning models |
| 🗃️ [ZK Steward](assets/agency-agents/specialized/zk-steward.md) | Knowledge management, Zettelkasten, notes | Building connected, validated knowledge bases |
| 🔌 [MCP Builder](assets/agency-agents/specialized/specialized-mcp-builder.md) | Model Context Protocol servers, AI agent tooling | Building MCP servers that extend AI agent capabilities |
| 📄 [Document Generator](assets/agency-agents/specialized/specialized-document-generator.md) | PDF, PPTX, DOCX, XLSX generation from code | Professional document creation, reports, data visualization |
| ⚙️ [Automation Governance Architect](assets/agency-agents/specialized/automation-governance-architect.md) | Automation governance, n8n, workflow auditing | Evaluating and governing business automations at scale |
| 📚 [Corporate Training Designer](assets/agency-agents/specialized/corporate-training-designer.md) | Enterprise training, curriculum development | Designing training systems and learning programs |
| 🌱 [Personal Growth Mentor](assets/agency-agents/specialized/personal-growth-mentor.md) | Goal clarity, habit systems, accountability, life strategy | Cross-domain personal development without motivational fluff |
| 🏛️ [Government Digital Presales Consultant](assets/agency-agents/specialized/government-digital-presales-consultant.md) | China ToG presales, digital transformation | Government digital transformation proposals and bids |
| ⚕️ [Healthcare Marketing Compliance Specialist](assets/agency-agents/specialized/healthcare-marketing-compliance.md) | China healthcare advertising compliance | Healthcare marketing regulatory compliance |
| 🎯 [Recruitment Specialist](assets/agency-agents/specialized/recruitment-specialist.md) | Talent acquisition, recruiting operations | Recruitment strategy, sourcing, and hiring processes |
| 🎓 [Study Abroad Advisor](assets/agency-agents/specialized/study-abroad-advisor.md) | International education, application planning | Study abroad planning across US, UK, Canada, Australia |
| 🔗 [Supply Chain Strategist](assets/agency-agents/specialized/supply-chain-strategist.md) | Supply chain management, procurement strategy | Supply chain optimization and procurement planning |
| 🗺️ [Workflow Architect](assets/agency-agents/specialized/specialized-workflow-architect.md) | Workflow discovery, mapping, and specification | Mapping every path through a system before code is written |
| ☁️ [Salesforce Architect](assets/agency-agents/specialized/specialized-salesforce-architect.md) | Multi-cloud Salesforce design, governor limits, integrations | Enterprise Salesforce architecture, org strategy, deployment pipelines |
| 🇫🇷 [French Consulting Market Navigator](assets/agency-agents/specialized/specialized-french-consulting-market.md) | ESN/SI ecosystem, portage salarial, rate positioning | Freelance consulting in the French IT market |
| 🇰🇷 [Korean Business Navigator](assets/agency-agents/specialized/specialized-korean-business-navigator.md) | Korean business culture, 품의 process, relationship mechanics | Foreign professionals navigating Korean business relationships |
| 🏗️ [Civil Engineer](assets/agency-agents/specialized/specialized-civil-engineer.md) | Structural analysis, geotechnical design, global building codes | Multi-standard structural engineering across Eurocode, ACI, AISC, and more |
| 🎧 [Customer Service](assets/agency-agents/specialized/customer-service.md) | Omnichannel support, complaint handling, retention, escalation | Any industry customer support — retail, SaaS, hospitality, finance, logistics |
| 🏥 [Healthcare Customer Service](assets/agency-agents/specialized/healthcare-customer-service.md) | HIPAA-aware patient support, billing, insurance, emergency routing | Healthcare organizations needing compliant, empathetic patient support |
| 🏨 [Hospitality Guest Services](assets/agency-agents/specialized/hospitality-guest-services.md) | Reservations, concierge, complaint recovery, loyalty, events | Hotels, resorts, restaurants, and event venues |
| 🤝 [HR Onboarding](assets/agency-agents/specialized/hr-onboarding.md) | Pre-boarding, compliance, benefits enrollment, 30-60-90 day plans | Any company onboarding new hires — from startups to enterprise |
| 🌐 [Language Translator](assets/agency-agents/specialized/language-translator.md) | Spanish ↔ English translation, dialect awareness, cultural context | Travel, business, medical, and legal translation needs |
| ⏱️ [Legal Billing &amp; Time Tracking](assets/agency-agents/specialized/legal-billing-time-tracking.md) | Time capture, billing narratives, IOLTA compliance, collections | Law firms maximizing revenue recovery and billing accuracy |
| 📋 [Legal Client Intake](assets/agency-agents/specialized/legal-client-intake.md) | Prospect qualification, conflict screening, consultation scheduling | Law firms converting inquiries into retained clients |
| ⚖️ [Legal Document Review](assets/agency-agents/specialized/legal-document-review.md) | Contract review, risk flagging, version comparison, compliance | Attorney-ready first-pass review across any practice area |
| 🏦 [Loan Officer Assistant](assets/agency-agents/specialized/loan-officer-assistant.md) | Borrower intake, TRID compliance, pipeline tracking, closing coordination | Mortgage and consumer lending teams |
| 🏠 [Real Estate Buyer &amp; Seller](assets/agency-agents/specialized/real-estate-buyer-seller.md) | Buyer/seller representation, offers, transaction coordination | Residential and investment real estate transactions |
| 🛒 [Retail Customer Returns](assets/agency-agents/specialized/retail-customer-returns.md) | Return processing, fraud prevention, exchanges, vendor returns | Brick-and-mortar, e-commerce, and omnichannel retail |
| ♟️ [Business Strategist](assets/agency-agents/specialized/business-strategist.md) | Management-consulting strategy | Competitive analysis, market entry, growth planning |
| 🔄 [Change Management Consultant](assets/agency-agents/specialized/change-management-consultant.md) | ADKAR/Kotter/Prosci change | Guiding orgs through transformation &amp; adoption |
| 🧭 [Chief of Staff](assets/agency-agents/specialized/specialized-chief-of-staff.md) | Executive coordination | Filtering noise, owning processes, routing decisions |
| 🌟 [Customer Success Manager](assets/agency-agents/specialized/customer-success-manager.md) | Onboarding, health &amp; retention | QBRs, churn prevention, renewals &amp; expansion |
| 📝 [Grant Writer](assets/agency-agents/specialized/grant-writer.md) | Grant proposals &amp; funding | LOIs, proposals, budgets for nonprofits/research |
| 🏥 [Medical Billing &amp; Coding Specialist](assets/agency-agents/specialized/medical-billing-coding-specialist.md) | ICD-10/CPT/HCPCS &amp; revenue cycle | Claims, denial management, RCM optimization |
| 💰 [Pricing Analyst](assets/agency-agents/specialized/specialized-pricing-analyst.md) | Pricing models &amp; margin optimization | Competitor/cost analysis, value-based pricing |
| 💼 [Chief Financial Officer](assets/agency-agents/specialized/chief-financial-officer.md) | Capital allocation &amp; financial strategy | Treasury, FP&amp;A, M&amp;A finance, investor &amp; board reporting |
| 🌱 [ESG &amp; Sustainability Officer](assets/agency-agents/specialized/esg-sustainability-officer.md) | ESG programs &amp; disclosure | Sustainability strategy, decarbonization, reporting |
| 🔐 [Data Privacy Officer](assets/agency-agents/specialized/data-privacy-officer.md) | GDPR/CCPA privacy compliance | Data mapping, DPIAs, consent, breach response |
| ⚙️ [Operations Manager](assets/agency-agents/specialized/operations-manager.md) | Lean/Six Sigma operations | Process mapping, capacity planning, KPI governance |
| 🤝 [M&amp;A Integration Manager](assets/agency-agents/specialized/ma-integration-manager.md) | Post-merger integration | Day 1/100-day plans, synergy tracking, TSA management |
| 🧠 [Organizational Psychologist](assets/agency-agents/specialized/organizational-psychologist.md) | Team dynamics &amp; culture health | Psychological safety, burnout risk, high-performing teams |
| ⚔️ [Strategy Duel Agent](assets/agency-agents/specialized/specialized-strategy-duel-agent.md) | Game theory &amp; the 36 stratagems | Turn-based strategy duels, adversarial scenario simulation |
| 🛡️ [FedRAMP &amp; RMF Compliance Engineer](assets/agency-agents/specialized/specialized-fedramp-rmf-compliance.md) | Federal cloud authorization (ATO) | NIST 800-53, FedRAMP Rev5/20x, SSP/POA&amp;M, ConMon, OSCAL |
| 🏺 [Codebase Archaeologist](assets/agency-agents/specialized/specialized-codebase-archaeologist.md) | Multi-tool codebase drift audits | Detecting silent drift across Claude/Cursor/Copilot/Windsurf edits |
| 🧾 [Resume Tailor](assets/agency-agents/specialized/resume-tailor.md) | Candidate-side resume optimization | JD mapping, ATS keyword alignment, experience-to-requirement matching |
| 🧡 [Aging Parent Care Companion](assets/agency-agents/specialized/healthcare-aging-parent-care-companion.md) | Family caregiver decision-support | Appointment/medication coordination, care-team comms, caregiver wellbeing (HIPAA-aligned) |
| 🏛️ [Master Plan Architect](assets/agency-agents/specialized/specialized-master-plan-architect.md) | Architectural teaching, red-team plan critique | Deep architecture teaching, risk critique, comprehensive Markdown implementation plans (no code execution) |
| 🔍 [Authenticity Appraiser](assets/agency-agents/specialized/authenticity-appraiser.md) | Luxury goods authentication, valuation, transaction risk | Secondhand purchases, collectibles, remote appraisal limits |
| 🎓 [Gaokao College Admissions Advisor](assets/agency-agents/specialized/gaokao-college-advisor.md) | Provincial admission rules, score ranks, major selection | Balanced university application portfolios for Gaokao candidates |
| 🐄 [Livestock Records Auditor](assets/agency-agents/specialized/livestock-archive-auditor.md) | Medication, feed, treatment, immunization, FIFO batch checks | Auditing livestock records and production spreadsheets |
| 🧠 [General Prompt Engineer](assets/agency-agents/specialized/prompt-engineer.md) | System prompts, examples, tool constraints, evaluations | Improving structured outputs and reliable LLM behavior |
| 📜 [AI Governance Policy Specialist](assets/agency-agents/specialized/specialized-ai-policy-writer.md) | Generative-AI regulation, algorithm filing, model governance | AI compliance policies and operating controls in China |
| 📅 [Meeting Productivity Specialist](assets/agency-agents/specialized/specialized-meeting-assistant.md) | Agendas, decisions, action tracking, time-zone coordination | Meetings across Feishu, DingTalk, and Tencent Meeting |
| 💲 [Dynamic Pricing Strategist](assets/agency-agents/specialized/specialized-pricing-optimizer.md) | Promotion mechanics, elasticity, margin guardrails | Optimizing e-commerce prices and campaign profitability |
| ⚖️ [Enterprise Risk Assessor](assets/agency-agents/specialized/specialized-risk-assessor.md) | Risk identification, control design, audit remediation | Enterprise risk reviews and organizational resilience |
| 🌐 [Technical Translator](assets/agency-agents/specialized/technical-translator-agent.md) | Chinese-English translation, software/AI/cloud terminology | Translating developer documentation and technical materials |
| 🧳 [Travel Planner](assets/agency-agents/specialized/travel-planner.md) | Itineraries, transport, lodging, visas, budgets | Practical domestic and international travel plans for Chinese travelers |

<a id="experts-spatial-computing"></a>

### 🥽 Spatial Computing Division

Building spatial interactions, immersive interfaces, and XR experiences.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🏗️ [XR Interface Architect](assets/agency-agents/spatial-computing/xr-interface-architect.md) | Spatial interaction design, immersive UX | AR/VR/XR interface design, spatial computing UX |
| 💻 [macOS Spatial/Metal Engineer](assets/agency-agents/spatial-computing/macos-spatial-metal-engineer.md) | Swift, Metal, high-performance 3D | macOS spatial computing, Vision Pro native apps |
| 🌐 [XR Immersive Developer](assets/agency-agents/spatial-computing/xr-immersive-developer.md) | WebXR, browser-based AR/VR | Browser-based immersive experiences, WebXR apps |
| 🎮 [XR Cockpit Interaction Specialist](assets/agency-agents/spatial-computing/xr-cockpit-interaction-specialist.md) | Cockpit-based controls, immersive systems | Cockpit control systems, immersive control interfaces |
| 🍎 [visionOS Spatial Engineer](assets/agency-agents/spatial-computing/visionos-spatial-engineer.md) | Apple Vision Pro development | Vision Pro apps, spatial computing experiences |
| 🔌 [Terminal Integration Specialist](assets/agency-agents/spatial-computing/terminal-integration-specialist.md) | Terminal integration, command-line tools | CLI tools, terminal workflows, developer tools |

<a id="experts-game-development"></a>

### 🎮 Game Development Division

Creating games through design, engine development, and optimization.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🎯 [Game Designer](assets/agency-agents/game-development/game-designer.md) | Systems design, GDD authorship, economy balancing, gameplay loops | Designing game mechanics, progression systems, writing design documents |
| 🗺️ [Level Designer](assets/agency-agents/game-development/level-designer.md) | Layout theory, pacing, encounter design, environmental storytelling | Building levels, designing encounter flow, spatial narrative |
| 🎨 [Technical Artist](assets/agency-agents/game-development/technical-artist.md) | Shaders, VFX, LOD pipeline, art-to-engine optimization | Bridging art and engineering, shader authoring, performance-safe asset pipelines |
| 🔊 [Game Audio Engineer](assets/agency-agents/game-development/game-audio-engineer.md) | FMOD/Wwise, adaptive music, spatial audio, audio budgets | Interactive audio systems, dynamic music, audio performance |
| 📖 [Narrative Designer](assets/agency-agents/game-development/narrative-designer.md) | Story systems, branching dialogue, lore architecture | Writing branching narratives, implementing dialogue systems, world lore |
| 💰 [Economy Designer](assets/agency-agents/game-development/economy-designer.md) | Virtual currencies, sources/sinks, monetization modeling, inflation control | Designing in-game economies, balancing F2P monetization, live economy tuning |
| 🏗️ [Unity Architect](assets/agency-agents/game-development/unity-architect.md) | ScriptableObjects, data-driven modularity, DOTS/ECS | Large-scale Unity projects, data-driven system design, ECS performance work |
| ✨ [Unity Shader Graph Artist](assets/agency-agents/game-development/unity-shader-graph-artist.md) | Shader Graph, HLSL, URP/HDRP, Renderer Features | Custom Unity materials, VFX shaders, post-processing passes |
| 🌐 [Unity Multiplayer Engineer](assets/agency-agents/game-development/unity-multiplayer-engineer.md) | Netcode for GameObjects, Unity Relay/Lobby, server authority, prediction | Online Unity games, client prediction, Unity Gaming Services integration |
| 🛠️ [Unity Editor Tool Developer](assets/agency-agents/game-development/unity-editor-tool-developer.md) | EditorWindows, AssetPostprocessors, PropertyDrawers, build validation | Custom Unity Editor tooling, pipeline automation, content validation |
| ⚙️ [Unreal Systems Engineer](assets/agency-agents/game-development/unreal-systems-engineer.md) | C++/Blueprint hybrid, GAS, Nanite constraints, memory management | Complex Unreal gameplay systems, Gameplay Ability System, engine-level C++ |
| 🎨 [Unreal Technical Artist](assets/agency-agents/game-development/unreal-technical-artist.md) | Material Editor, Niagara, PCG, Substrate | Unreal materials, Niagara VFX, procedural content generation |
| 🌐 [Unreal Multiplayer Architect](assets/agency-agents/game-development/unreal-multiplayer-architect.md) | Actor replication, GameMode/GameState hierarchy, dedicated server | Unreal online games, replication graphs, server authoritative Unreal |
| 🗺️ [Unreal World Builder](assets/agency-agents/game-development/unreal-world-builder.md) | World Partition, Landscape, HLOD, LWC | Large open-world Unreal levels, streaming systems, terrain at scale |
| 📜 [Godot Gameplay Scripter](assets/agency-agents/game-development/godot-gameplay-scripter.md) | GDScript 2.0, signals, composition, static typing | Godot gameplay systems, scene composition, performance-conscious GDScript |
| 🌐 [Godot Multiplayer Engineer](assets/agency-agents/game-development/godot-multiplayer-engineer.md) | MultiplayerAPI, ENet/WebRTC, RPCs, authority model | Online Godot games, scene replication, server-authoritative Godot |
| ✨ [Godot Shader Developer](assets/agency-agents/game-development/godot-shader-developer.md) | Godot shading language, VisualShader, RenderingDevice | Custom Godot materials, 2D/3D effects, post-processing, compute shaders |
| 🧩 [Blender Add-on Engineer](assets/agency-agents/game-development/blender-addon-engineer.md) | Blender Python (`bpy`), custom operators/panels, asset validators, exporters, pipeline automation | Building Blender add-ons, asset prep tools, export workflows, and DCC pipeline automation |
| ⚙️ [Roblox Systems Scripter](assets/agency-agents/game-development/roblox-systems-scripter.md) | Luau, RemoteEvents/Functions, DataStore, server-authoritative module architecture | Building secure Roblox game systems, client-server communication, data persistence |
| 🎯 [Roblox Experience Designer](assets/agency-agents/game-development/roblox-experience-designer.md) | Engagement loops, monetization, D1/D7 retention, onboarding flow | Designing Roblox game loops, Game Passes, daily rewards, player retention |
| 👗 [Roblox Avatar Creator](assets/agency-agents/game-development/roblox-avatar-creator.md) | UGC pipeline, accessory rigging, Creator Marketplace submission | Roblox UGC items, HumanoidDescription customization, in-experience avatar shops |

<a id="experts-academic"></a>

### 📚 Academic Division

Applying disciplinary methods to research, analysis, and learning.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🌍 [Anthropologist](assets/agency-agents/academic/academic-anthropologist.md) | Cultural systems, kinship, rituals, belief systems | Designing culturally coherent societies with internal logic |
| 🌐 [Geographer](assets/agency-agents/academic/academic-geographer.md) | Physical/human geography, climate, cartography | Building geographically coherent worlds with realistic terrain and settlements |
| 📚 [Historian](assets/agency-agents/academic/academic-historian.md) | Historical analysis, periodization, material culture | Validating historical coherence, enriching settings with authentic period detail |
| 📜 [Narratologist](assets/agency-agents/academic/academic-narratologist.md) | Narrative theory, story structure, character arcs | Analyzing and improving story structure with established theoretical frameworks |
| 🧠 [Psychologist](assets/agency-agents/academic/academic-psychologist.md) | Personality theory, motivation, cognitive patterns | Building psychologically credible characters grounded in research |
| 📊 [Statistician](assets/agency-agents/academic/academic-statistician.md) | Statistical inference &amp; experiment design | Hypothesis testing, causal inference, sampling, rigorous analysis |
| 📚 [Study Planner](assets/agency-agents/academic/academic-study-planner.md) | Exam strategy, active recall, spaced repetition | Exam preparation and personalized learning plans |

<a id="experts-gis"></a>

### 🗺️ GIS Division

Turning geographic data into maps, analysis, and spatial applications.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🧠 [Technical Consultant](assets/agency-agents/gis/gis-technical-consultant.md) | GIS strategy, gap analysis, technology roadmaps, digital transformation | Understanding business needs, selecting the right geospatial stack, planning multi-phase GIS programs |
| 🔧 [Solution Engineer](assets/agency-agents/gis/gis-solution-engineer.md) | Esri + FOSS4G prototype building, PoC delivery, technical feasibility | Building working demos, validating technical approaches, pre-sales support |
| 🖥️ [GIS Analyst](assets/agency-agents/gis/gis-analyst.md) | Map production, data QC, symbology, layouts, spatial queries | Day-to-day GIS operations, creating publication-ready maps, maintaining data integrity |
| 📦 [Spatial Data Engineer](assets/agency-agents/gis/gis-spatial-data-engineer.md) | Geospatial ETL, format conversion, CRS reprojection, automated pipelines | Ingesting messy data from any source, building repeatable data transformation pipelines |
| ⚙️ [Geoprocessing Specialist](assets/agency-agents/gis/gis-geoprocessing-specialist.md) | ArcPy, Python Toolbox (.pyt), Model Builder, batch automation | Automating repetitive GIS workflows, building custom geoprocessing tools |
| ✅ [GIS QA Engineer](assets/agency-agents/gis/gis-qa-engineer.md) | Topology validation, metadata audit, CRS consistency, accuracy assessment | Quality gates before data publication, compliance verification, data integrity audits |
| 🤖 [GeoAI/ML Engineer](assets/agency-agents/gis/gis-geoai-ml-engineer.md) | Feature extraction, object detection, semantic segmentation, land cover classification | Extracting buildings/roads/vehicles from imagery, change detection, environmental monitoring |
| 🏗️ [BIM/GIS Specialist](assets/agency-agents/gis/gis-bim-specialist.md) | Revit/IFC to GIS, indoor mapping, digital twin architecture, facility management | Smart campus, airport digital twins, indoor navigation, building operations |
| 🏔️ [3D &amp; Scene Developer](assets/agency-agents/gis/gis-3d-scene-developer.md) | Cesium, ArcGIS Scene Viewer, 3D Tiles, point clouds, terrain visualization | 3D city scenes, terrain flyovers, point cloud web viewers, OAuth-gated scene sharing |
| 📊 [Spatial Data Scientist](assets/agency-agents/gis/gis-spatial-data-scientist.md) | Spatial statistics, clustering, regression, interpolation, point pattern analysis | Hotspot detection, spatial modeling, predictive analytics, research-grade analysis |
| 🛸 [Drone/Reality Mapping Specialist](assets/agency-agents/gis/gis-drone-reality-mapping.md) | Photogrammetry, orthomosaic, DTM/DSM, point cloud classification, 3D mesh | Drone survey processing, reality capture, construction monitoring, environmental mapping |
| 🌐 [Web GIS Developer](assets/agency-agents/gis/gis-web-gis-developer.md) | MapLibre GL JS, ArcGIS JS API, Leaflet, real-time dashboards, REST APIs | Building interactive web maps, operational dashboards, real-time data visualization |
| 🎨 [Cartography Designer](assets/agency-agents/gis/gis-cartography-designer.md) | Color theory, typography, basemap design, visual hierarchy, print and web aesthetics | Making maps beautiful and readable, colorblind-safe palettes, professional map layouts |

<a id="experts-healthcare"></a>

### 🏥 Healthcare Division

Connecting clinical evidence with healthcare policy and strategy.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🩺 [Clinical Evidence Agent](assets/agency-agents/healthcare/healthcare-clinical-evidence-agent.md) | Evidence standards, validated vs unvalidated claims, diagnostic authority boundaries | Making clinical claims credibly without overstepping into diagnostic authority |
| 🌍 [Sovereign Health Systems Agent](assets/agency-agents/healthcare/healthcare-sovereign-health-systems-agent.md) | Government health mandates, UHC policy, emerging market deployment | Health tech teams operating at the intersection of national health infrastructure and sovereign health policy |
| 🧭 [Healthcare Innovation Strategist](assets/agency-agents/healthcare/healthcare-innovation-strategist.md) | Narrative architecture for healthcare founders across investor, regulatory, sovereign, and clinical audiences | Healthcare founders who need to translate clinical and financial complexity into language that moves capital and builds trust |

<a id="experts-research"></a>

### 🔍 Research Division

Evaluating sources and synthesizing evidence into traceable findings.

| Agent | Specialty | When to Use |
| --- | --- | --- |
| 🔍 [Research Synthesist](assets/agency-agents/research/research-synthesist.md) | Literature review, source evaluation, citation tracing, evidence synthesis | Turning a scattered pile of sources into a structured, honestly-weighted map of what the evidence supports |

## Configuration and limits

| Key | Default | Purpose |
| --- | --- | --- |
| `root` | Bundled expert assets | External expert root; an explicit value takes priority. |
| `provider` | `spawn` | DSH subagent provider; `fork` also works when it supports persona and tool filtering. |
| `divisions` | 22 standard divisions | Top-level divisions to scan. |
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

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the five most recent releases.
