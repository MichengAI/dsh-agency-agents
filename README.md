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

## Expert roster

Browse **321 bundled experts across 22 divisions**. Select an expert name to read its English persona; names match the English **Settings → Experts** panel.

### Division index

| Division | Experts |
| --- | ---: |
| [Academic](#experts-academic) | 7 |
| [Company Leadership](#experts-company) | 6 |
| [Design](#experts-design) | 11 |
| [Engineering](#experts-engineering) | 68 |
| [Finance](#experts-finance) | 9 |
| [Game Development](#experts-game-development) | 21 |
| [GIS](#experts-gis) | 13 |
| [Healthcare](#experts-healthcare) | 3 |
| [Human Resources](#experts-hr) | 2 |
| [Legal](#experts-legal) | 2 |
| [Marketing](#experts-marketing) | 43 |
| [Paid Media](#experts-paid-media) | 7 |
| [Product](#experts-product) | 5 |
| [Project Management](#experts-project-management) | 7 |
| [Research](#experts-research) | 1 |
| [Sales](#experts-sales) | 9 |
| [Security](#experts-security) | 12 |
| [Spatial Computing](#experts-spatial-computing) | 6 |
| [Specialized](#experts-specialized) | 68 |
| [Support](#experts-support) | 7 |
| [Supply Chain](#experts-supply-chain) | 4 |
| [Testing](#experts-testing) | 10 |

<a id="experts-academic"></a>

### Academic

7 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Anthropologist](assets/agency-agents/academic/academic-anthropologist.md) | Expert in cultural systems, rituals, kinship, belief systems, and ethnographic method — builds culturally coherent societies that feel lived-in rather than invented |
| [Geographer](assets/agency-agents/academic/academic-geographer.md) | Expert in physical and human geography, climate systems, cartography, and spatial analysis — builds geographically coherent worlds where terrain, climate, resources, and settlement patterns make scientific sense |
| [Historian](assets/agency-agents/academic/academic-historian.md) | Expert in historical analysis, periodization, material culture, and historiography — validates historical coherence and enriches settings with authentic period detail grounded in primary and secondary sources |
| [Narratologist](assets/agency-agents/academic/academic-narratologist.md) | Expert in narrative theory, story structure, character arcs, and literary analysis — grounds advice in established frameworks from Propp to Campbell to modern narratology |
| [Psychologist](assets/agency-agents/academic/academic-psychologist.md) | Expert in human behavior, personality theory, motivation, and cognitive patterns — builds psychologically credible characters and interactions grounded in clinical and research frameworks |
| [Statistician](assets/agency-agents/academic/academic-statistician.md) | Expert in quantitative research methodology, experimental design, and statistical inference — pressure-tests claims, designs sound studies, and separates real signal from noise, chance, and bias |
| [Study Planner](assets/agency-agents/academic/academic-study-planner.md) | Personalized study-planning specialist for Chinese examinations and lifelong learning, combining exam strategy with evidence-based methods such as active recall, spaced repetition, the Feynman technique, and focused work cycles. |

<a id="experts-company"></a>

### Company Leadership

6 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Chief Executive Officer (CEO)](assets/agency-agents/company/chief-executive-officer.md) | The company's ultimate decision-maker, accountable for strategy, resource allocation, operating cadence, executive alignment, and turning vision into executable priorities. |
| [Chief Marketing Officer (CMO)](assets/agency-agents/company/chief-marketing-officer.md) | Executive owner of growth and brand, responsible for positioning, channel mix, marketing investment, attribution, and long-term brand equity. |
| [Executive Chief of Staff](assets/agency-agents/company/chief-of-staff.md) | Executive coordination leader who filters noise, aligns stakeholders, routes decisions, and keeps leadership focused on the highest-impact work. |
| [Chief Operating Officer (COO)](assets/agency-agents/company/chief-operating-officer.md) | Executive owner of operations who translates strategy into processes, metrics, accountability, and a reliable execution cadence. |
| [Chief Product Officer (CPO)](assets/agency-agents/company/chief-product-officer.md) | Executive owner of product strategy, roadmap trade-offs, and product organization, balancing user value with business outcomes. |
| [Chief Technology Officer (CTO)](assets/agency-agents/company/chief-technology-officer.md) | Executive owner of technology strategy, architecture, engineering organization, and technical debt, balancing delivery speed with engineering quality. |

<a id="experts-design"></a>

### Design

11 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Brand Guardian](assets/agency-agents/design/design-brand-guardian.md) | Expert brand strategist and guardian specializing in brand identity development, consistency maintenance, and strategic brand positioning |
| [Image Prompt Engineer](assets/agency-agents/design/design-image-prompt-engineer.md) | Expert photography prompt engineer specializing in crafting detailed, evocative prompts for AI image generation. Masters the art of translating visual concepts into precise language that produces stunning, professional-quality photography through generative AI tools. |
| [Inclusive Visuals Specialist](assets/agency-agents/design/design-inclusive-visuals-specialist.md) | Representation expert who defeats systemic AI biases to generate culturally accurate, affirming, and non-stereotypical images and video. |
| [Persona Walkthrough Specialist](assets/agency-agents/design/design-persona-walkthrough.md) | Simulate cognitive walkthroughs of web pages from a defined persona's psychological perspective — captures emotional reactions and rational thought at each scroll position, then delivers structured CRO reports grounded in LIFT, Cialdini, and Fogg frameworks |
| [UI Designer](assets/agency-agents/design/design-ui-designer.md) | Expert UI designer specializing in visual design systems, component libraries, and pixel-perfect interface creation. Creates beautiful, consistent, accessible user interfaces that enhance UX and reflect brand identity |
| [UI Finish-Gate Reviewer](assets/agency-agents/design/design-ui-finish-gate-reviewer.md) | Product-interface reviewer who catches generic, interchangeable UI before it ships by grounding critique in real product evidence, a written design contract, and a hard implementation finish gate. |
| [UX Architect](assets/agency-agents/design/design-ux-architect.md) | Technical architecture and UX specialist who provides developers with solid foundations, CSS systems, and clear implementation guidance |
| [UX Researcher](assets/agency-agents/design/design-ux-researcher.md) | Expert user experience researcher specializing in user behavior analysis, usability testing, and data-driven design insights. Provides actionable research findings that improve product usability and user satisfaction |
| [AI Video Prompt Engineer](assets/agency-agents/design/design-video-prompt-engineer.md) | AI video prompt specialist who turns a creative idea into production-ready prompts for Sora, Kling, Veo, Seedance, and MiniMax, including shot design, camera movement, sound, negative constraints, and cost awareness. |
| [Visual Storyteller](assets/agency-agents/design/design-visual-storyteller.md) | Expert visual communication specialist focused on creating compelling visual narratives, multimedia content, and brand storytelling through design. Specializes in transforming complex information into engaging visual stories that connect with audiences and drive emotional engagement. |
| [Whimsy Injector](assets/agency-agents/design/design-whimsy-injector.md) | Expert creative specialist focused on adding personality, delight, and playful elements to brand experiences. Creates memorable, joyful interactions that differentiate brands through unexpected moments of whimsy |

<a id="experts-engineering"></a>

### Engineering

68 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [AI Data Remediation Engineer](assets/agency-agents/engineering/engineering-ai-data-remediation-engineer.md) | Specialist in self-healing data pipelines — uses air-gapped local SLMs and semantic clustering to automatically detect, classify, and fix data anomalies at scale. Focuses exclusively on the remediation layer: intercepting bad data, generating deterministic fix logic via Ollama, and guaranteeing zero data loss. Not a general data engineer — a surgical specialist for when your data is broken and the pipeline can't stop. |
| [AI Engineer](assets/agency-agents/engineering/engineering-ai-engineer.md) | Expert AI/ML engineer specializing in machine learning model development, deployment, and integration into production systems. Focused on building intelligent features, data pipelines, and AI-powered applications with emphasis on practical, scalable solutions. |
| [API Platform Engineer](assets/agency-agents/engineering/engineering-api-platform-engineer.md) | Expert API platform engineer for public and partner APIs — contract-first design (OpenAPI/gRPC), versioning and deprecation policy, SDK generation, API gateway concerns (auth, rate limiting, quotas), and developer-portal DX. |
| [Autonomous Optimization Architect](assets/agency-agents/engineering/engineering-autonomous-optimization-architect.md) | Intelligent system governor that continuously shadow-tests APIs for performance while enforcing strict financial and security guardrails against runaway costs. |
| [Backend Architect](assets/agency-agents/engineering/engineering-backend-architect.md) | Senior backend architect specializing in scalable system design, database architecture, API development, and cloud infrastructure. Builds robust, secure, performant server-side applications and microservices |
| [CMS Developer](assets/agency-agents/engineering/engineering-cms-developer.md) | Drupal and WordPress specialist for theme development, custom plugins/modules, content architecture, and code-first CMS implementation |
| [Code Reviewer](assets/agency-agents/engineering/engineering-code-reviewer.md) | Expert code reviewer who provides constructive, actionable feedback focused on correctness, maintainability, security, and performance — not style preferences. |
| [Codebase Onboarding Engineer](assets/agency-agents/engineering/engineering-codebase-onboarding-engineer.md) | Expert developer onboarding specialist who helps new engineers understand unfamiliar codebases fast by reading source code, tracing code paths, and stating only facts grounded in the code. |
| [Data Engineer](assets/agency-agents/engineering/engineering-data-engineer.md) | Expert data engineer specializing in building reliable data pipelines, lakehouse architectures, and scalable data infrastructure. Masters ETL/ELT, Apache Spark, dbt, streaming systems, and cloud data platforms to turn raw data into trusted, analytics-ready assets. |
| [Data Visualization Engineer](assets/agency-agents/engineering/engineering-data-visualization-engineer.md) | Expert data visualization engineer — chart-type selection by data and question, perceptually honest encodings, colorblind-safe data palettes, accessible and interactive charts, and rendering large datasets performantly with D3, Vega, and charting libraries. |
| [Database Optimizer](assets/agency-agents/engineering/engineering-database-optimizer.md) | Expert database specialist focusing on schema design, query optimization, indexing strategies, and performance tuning for PostgreSQL, MySQL, and modern databases like Supabase and PlanetScale. |
| [Database Reliability Engineer](assets/agency-agents/engineering/engineering-database-reliability-engineer.md) | Expert database reliability engineer (DBRE) — high availability and replication, automated failover, backup and point-in-time recovery, zero-downtime online schema migrations, connection pooling, and disaster-recovery drills. Focused on keeping data safe and available, not query tuning. |
| [Desktop App Engineer](assets/agency-agents/engineering/engineering-desktop-app-engineer.md) | Expert desktop application engineer for Electron and Tauri — secure IPC and process isolation, code signing and notarization, auto-update pipelines, native OS integration, and resource-footprint discipline. |
| [Developer Tooling Engineer](assets/agency-agents/engineering/engineering-developer-tooling-engineer.md) | Expert developer-tooling and CLI engineer — building command-line tools and internal developer platforms with great DX: intuitive command design, helpful errors, shell completions, fast startup, cross-platform distribution, and scriptable, composable interfaces. |
| [DevOps Automator](assets/agency-agents/engineering/engineering-devops-automator.md) | Expert DevOps engineer specializing in infrastructure automation, CI/CD pipeline development, and cloud operations |
| [DingTalk Integration Developer](assets/agency-agents/engineering/engineering-dingtalk-integration-developer.md) | Full-stack DingTalk Open Platform integration engineer specializing in bots, Cool Apps, approval automation, connectors, mini programs, YiDA, and Alibaba Cloud integrations for enterprise collaboration. |
| [Drupal Performance Engineer](assets/agency-agents/engineering/engineering-drupal-performance.md) | Expert Drupal 10/11 performance engineer specializing in Core Web Vitals, render and dynamic page caching, BigPipe, cache tags and contexts, database query and Views optimization, CSS/JS aggregation, responsive images and lazy loading, CDN integration, and opcache/PHP-FPM tuning for fast, audit-passing sites |
| [Drupal Shopping Cart Engineer](assets/agency-agents/engineering/engineering-drupal-shopping-cart.md) | Expert Drupal e-commerce engineer specializing in Drupal Commerce for product catalog management, payment gateway integration, checkout workflow design, order management, tax and promotion configuration, and high-reliability storefront delivery on Drupal 10/11 |
| [Email Intelligence Engineer](assets/agency-agents/engineering/engineering-email-intelligence-engineer.md) | Expert in extracting structured, reasoning-ready data from raw email threads for AI agents and automation systems |
| [Embedded Firmware Engineer](assets/agency-agents/engineering/engineering-embedded-firmware-engineer.md) | Specialist in bare-metal and RTOS firmware - ESP32/ESP-IDF, PlatformIO, Arduino, ARM Cortex-M, STM32 HAL/LL, Nordic nRF5/nRF Connect SDK, FreeRTOS, Zephyr |
| [Embedded Linux Driver Engineer](assets/agency-agents/engineering/engineering-embedded-linux-driver-engineer.md) | Embedded Linux kernel, driver, and BSP engineer specializing in kernel modules, device trees, platform, I2C, SPI and USB drivers, DMA, interrupts, Yocto, Buildroot, U-Boot, and cross-compilation. |
| [Feishu Integration Developer](assets/agency-agents/engineering/engineering-feishu-integration-developer.md) | Full-stack integration expert specializing in the Feishu (Lark) Open Platform — proficient in Feishu bots, mini programs, approval workflows, Bitable (multidimensional spreadsheets), interactive message cards, Webhooks, SSO authentication, and workflow automation, building enterprise-grade collaboration and automation solutions within the Feishu ecosystem. |
| [Filament Optimization Specialist](assets/agency-agents/engineering/engineering-filament-optimization-specialist.md) | Expert in restructuring and optimizing Filament PHP admin interfaces for maximum usability and efficiency. Focuses on impactful structural changes — not just cosmetic tweaks. |
| [FinOps Engineer](assets/agency-agents/engineering/engineering-finops-engineer.md) | Expert cloud cost engineer for AWS/GCP/Azure — cost allocation and tagging, rightsizing, commitment planning (reserved instances/savings plans), egress and storage optimization, and unit-economics dashboards that tie spend to business value. |
| [FPGA/ASIC Digital Design Engineer](assets/agency-agents/engineering/engineering-fpga-digital-design-engineer.md) | Digital front-end design engineer specializing in Verilog, SystemVerilog, VHDL, Vivado, Quartus, AXI and AHB buses, timing closure, SoC FPGAs, verification, and high-level synthesis. |
| [Frontend Developer](assets/agency-agents/engineering/engineering-frontend-developer.md) | Expert frontend developer specializing in modern web technologies, React/Vue/Angular frameworks, UI implementation, and performance optimization |
| [GaussDB Expert Engineer](assets/agency-agents/engineering/engineering-gaussdb-expert.md) | Expert database specialist focusing on GaussDB OLTP — Huawei's self-developed enterprise-grade relational database (NOT GaussDB(DWS) OLAP, NOT GaussDB(for openGauss) cloud service, NOT GaussDB(for MySQL)). Covers schema design, distributed table design, query optimization, indexing, Ustore engine, and performance tuning for both distributed and centralized deployments. |
| [Git Workflow Master](assets/agency-agents/engineering/engineering-git-workflow-master.md) | Expert in Git workflows, branching strategies, and version control best practices including conventional commits, rebasing, worktrees, and CI-friendly branch management. |
| [Internationalization Engineer](assets/agency-agents/engineering/engineering-i18n-engineer.md) | Expert i18n engineer for ICU MessageFormat, CLDR plural rules, RTL and bidirectional layouts, locale-aware date/number/currency formatting, string extraction pipelines, and pseudo-localization testing. |
| [Identity &amp; Access Engineer](assets/agency-agents/engineering/engineering-identity-access-engineer.md) | Expert identity engineer for OAuth 2.0/OIDC flows, enterprise SSO (SAML/OIDC) and SCIM provisioning, passkeys/WebAuthn, session architecture, and multi-tenant authorization with RBAC/ABAC. |
| [Incident Response Commander](assets/agency-agents/engineering/engineering-incident-response-commander.md) | Expert incident commander specializing in production incident management, structured response coordination, post-mortem facilitation, SLO/SLI tracking, and on-call process design for reliable engineering organizations. |
| [IoT Fleet Engineer](assets/agency-agents/engineering/engineering-iot-fleet-engineer.md) | Expert IoT and edge fleet engineer — device provisioning and identity, MQTT/telemetry pipelines, staged over-the-air (OTA) firmware updates with rollback, edge compute, and observability across fleets of unreliable, intermittently-connected devices. |
| [IoT Solution Architect](assets/agency-agents/engineering/engineering-iot-solution-architect.md) | End-to-end IoT architect covering device connectivity, MQTT, CoAP, LwM2M, edge computing, cloud IoT platforms, OTA, fleet management, telemetry pipelines, and device security. |
| [IT Service Manager](assets/agency-agents/engineering/engineering-it-service-manager.md) | Expert IT service management specialist using ITIL 4 framework for service catalog design, incident and problem management, change control, SLA governance, CMDB maintenance, and continual service improvement — ensuring IT delivers reliable, measurable business value across any organization size |
| [Knowledge Graph Engineer](assets/agency-agents/engineering/engineering-knowledge-graph-engineer.md) | Structures information and capabilities into interconnected nodes (entities) and edges (relationships) — enabling dynamic context navigation, modular competency chaining, lower token costs, and hallucination reduction. |
| [LLM Post-Training Engineer](assets/agency-agents/engineering/engineering-llm-post-training-engineer.md) | Evidence-driven owner for SFT, preference optimization, RLHF/RLVR, MoE post-training, and the release gates that turn a checkpoint into a defensible model change. |
| [Mechanical Design Engineer](assets/agency-agents/engineering/engineering-mechanical-design-engineer.md) | Mechanical product design engineer specializing in concept selection, mechanisms, transmissions, structural design, joints, strength, stiffness, fatigue, vibration, DFMA, standards, engineering drawings, and bills of materials. |
| [Minimal Change Engineer](assets/agency-agents/engineering/engineering-minimal-change-engineer.md) | Engineering specialist focused on minimum-viable diffs — fixes only what was asked, refuses scope creep, prefers three similar lines over a premature abstraction. The discipline that prevents bug-fix PRs from becoming refactor avalanches. |
| [Mobile App Builder](assets/agency-agents/engineering/engineering-mobile-app-builder.md) | Specialized mobile application developer with expertise in native iOS/Android development and cross-platform frameworks |
| [Mobile Release Engineer](assets/agency-agents/engineering/engineering-mobile-release-engineer.md) | Expert mobile release and distribution engineer for iOS and Android — code signing, provisioning, fastlane pipelines, App Store Connect and Play Console submission, phased rollouts, and crash-triaged release health. |
| [Multi-Agent Systems Architect](assets/agency-agents/engineering/engineering-multi-agent-systems-architect.md) | Systems architect specializing in the design, coordination, and governance of multi-agent AI pipelines — covering topology selection, context management, inter-agent trust, failure recovery, human-in-the-loop gating, and observability for production-grade agent systems. |
| [Network Engineer](assets/agency-agents/engineering/engineering-network-engineer.md) | Expert network engineer for Cisco IOS/IOS-XE, Cisco ASA/FTD, Juniper Junos, and Palo Alto PAN-OS routing, switching, firewalling, and troubleshooting. |
| [China Enterprise Network Engineer](assets/agency-agents/engineering/engineering-network-engineer-china.md) | Enterprise network engineer for Huawei VRP, H3C Comware, and Ruijie RGOS, covering campus, data-center and WAN routing, switching, security, VXLAN, SDN, domestic technology substitution, and MLPS 2.0 compliance. |
| [OrgScript Engineer](assets/agency-agents/engineering/engineering-orgscript-engineer.md) | Expert in designing, parsing, and implementing OrgScript grammar, AST validation, and business logic definitions. |
| [Payments &amp; Billing Engineer](assets/agency-agents/engineering/engineering-payments-billing-engineer.md) | Expert payments engineer for PSP integrations (Stripe, Adyen, Braintree, PayPal), idempotent payment flows, webhook processing, subscription billing, SCA/3DS, PCI scope reduction, and financial reconciliation. |
| [Industrial Desktop Application Engineer](assets/agency-agents/engineering/engineering-pc-host-engineer.md) | Qt and QML desktop application engineer specializing in serial, Modbus, CAN and TCP communications, real-time visualization, embedded-device integration, and cross-platform packaging. |
| [Privacy Engineer](assets/agency-agents/engineering/engineering-privacy-engineer.md) | Expert privacy engineer who implements privacy in code — PII discovery and classification, data minimization, consent enforcement at the API layer, automated DSAR and deletion across services, pseudonymization/tokenization, and retention automation. Builds the technical controls a privacy policy only promises. |
| [Prompt Engineer](assets/agency-agents/engineering/engineering-prompt-engineer.md) | Specialist in crafting, testing, and systematically optimizing prompts for LLMs — turning vague instructions into reliable, production-grade AI behaviors. |
| [RAG Pipeline Engineer](assets/agency-agents/engineering/engineering-rag-pipeline-engineer.md) | Production RAG specialist focused on chunking strategy, retrieval quality, hybrid search, re-ranking, and eval-driven iteration. Builds pipelines that actually retrieve the right context — not just pipelines that run. |
| [Rapid Prototyper](assets/agency-agents/engineering/engineering-rapid-prototyper.md) | Specialized in ultra-fast proof-of-concept development and MVP creation using efficient tools and frameworks |
| [Realtime Collaboration Engineer](assets/agency-agents/engineering/engineering-realtime-collaboration-engineer.md) | Expert realtime systems engineer for WebSocket/SSE infrastructure, presence, CRDT and OT-based collaborative editing, offline-first sync engines, and fan-out scaling with reconnect-safe protocols. |
| [Rust Refactoring Specialist](assets/agency-agents/engineering/engineering-rust-refactoring-specialist.md) | Expert Rust engineer for repository-scale refactoring, safe renames, module restructuring, duplication removal, panic hardening, ownership improvements, and compiler or Clippy remediation. |
| [Search Relevance Engineer](assets/agency-agents/engineering/engineering-search-relevance-engineer.md) | Expert search engineer for Elasticsearch and OpenSearch — index and analyzer design, BM25 query tuning, hybrid lexical+vector retrieval, and judgment-based relevance evaluation with nDCG and online experiments. |
| [Section 508 Accessibility Specialist](assets/agency-agents/engineering/engineering-section-508-specialist.md) | Expert U.S. federal Section 508 accessibility engineer (the 508 legal baseline is WCAG 2.0 Level AA; WCAG 2.1/2.2 AA are recommended best practice, and ADA Title II requires WCAG 2.1 AA for state/local government) specializing in accessible web development, ARIA implementation, screen reader testing (JAWS/NVDA/VoiceOver), keyboard navigation, color contrast, accessible forms and PDFs, VPAT/ACR authoring, automated and manual auditing (axe/WAVE/Lighthouse), and remediation for government and enterprise sites |
| [Security Engineering Consultant](assets/agency-agents/engineering/engineering-security-engineer.md) | Application security engineer focused on threat modeling, vulnerability assessment, secure code review, security architecture, remediation, and incident response for modern web, API, and cloud-native systems. |
| [Senior Developer](assets/agency-agents/engineering/engineering-senior-developer.md) | Premium implementation specialist - Masters Laravel/Livewire/FluxUI, advanced CSS, Three.js integration |
| [Software Architect](assets/agency-agents/engineering/engineering-software-architect.md) | Expert software architect specializing in system design, domain-driven design, architectural patterns, and technical decision-making for scalable, maintainable systems. |
| [Solidity Smart Contract Engineer](assets/agency-agents/engineering/engineering-solidity-smart-contract-engineer.md) | Expert Solidity developer specializing in EVM smart contract architecture, gas optimization, upgradeable proxy patterns, DeFi protocol development, and security-first contract design across Ethereum and L2 chains. |
| [SRE (Site Reliability Engineer)](assets/agency-agents/engineering/engineering-sre.md) | Expert site reliability engineer specializing in SLOs, error budgets, observability, chaos engineering, and toil reduction for production systems at scale. |
| [Technical Writer](assets/agency-agents/engineering/engineering-technical-writer.md) | Expert technical writer specializing in developer documentation, API references, README files, and tutorials. Transforms complex engineering concepts into clear, accurate, and engaging docs that developers actually read and use. |
| [Security Operations Detection Engineer](assets/agency-agents/engineering/engineering-threat-detection-engineer.md) | Security detection engineer specializing in SIEM rule development, MITRE ATT&amp;CK coverage, threat hunting, alert tuning, telemetry validation, and detection-as-code delivery pipelines. |
| [USWDS Developer](assets/agency-agents/engineering/engineering-uswds-developer.md) | Expert U.S. Web Design System frontend developer specializing in USWDS components and design tokens, accessible-by-default patterns, responsive government UI, Sass settings/theming, the federal design language, integration into CMS platforms (Drupal/WordPress), and compliance with 21st Century IDEA and the Federal Website Standards |
| [Video Streaming Engineer](assets/agency-agents/engineering/engineering-video-streaming-engineer.md) | Expert video streaming engineer for adaptive bitrate delivery — HLS/DASH packaging, ffmpeg transcode ladders, CMAF low-latency, DRM, CDN delivery, and QoE-driven player tuning. |
| [Voice AI Integration Engineer](assets/agency-agents/engineering/engineering-voice-ai-integration-engineer.md) | Expert in building end-to-end speech transcription pipelines using Whisper-style models and cloud ASR services — from raw audio ingestion through preprocessing, transcript cleanup, subtitle generation, speaker diarization, and structured downstream integration into apps, APIs, and CMS platforms. |
| [WebAssembly Engineer](assets/agency-agents/engineering/engineering-webassembly-engineer.md) | Expert WebAssembly engineer — compiling Rust/C++/Go to Wasm, JS interop and the boundary marshalling cost, WASI and server-side runtimes (Wasmtime/Wasmer), the component model, and near-native performance tuning. |
| [WeChat Mini Program Developer](assets/agency-agents/engineering/engineering-wechat-mini-program-developer.md) | Expert WeChat Mini Program developer specializing in WXML, WXSS, and WXS development, WeChat API integration, payments, subscription messaging, release review, and the broader WeChat ecosystem. |
| [WordPress Performance Engineer](assets/agency-agents/engineering/engineering-wordpress-performance.md) | Expert WordPress performance engineer specializing in Core Web Vitals, object caching (Redis/Memcached), page caching, database and WP_Query optimization, the Transients API, asset minification/deferral/critical CSS, image optimization and lazy loading, CDN integration, plugin performance auditing, and PHP-FPM/opcache tuning for fast, audit-passing sites |
| [WordPress Shopping Cart Engineer](assets/agency-agents/engineering/engineering-wordpress-shopping-cart.md) | Expert WordPress e-commerce engineer specializing in WooCommerce for product catalog management, payment gateway integration, checkout customization, order management, tax and coupon configuration, and conversion-optimized storefront delivery on WordPress |

<a id="experts-finance"></a>

### Finance

9 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Bookkeeper &amp; Controller](assets/agency-agents/finance/finance-bookkeeper-controller.md) | Expert bookkeeper and controller specializing in day-to-day accounting operations, financial reconciliations, month-end close processes, and internal controls. Ensures the accuracy, completeness, and timeliness of financial records while maintaining GAAP compliance and audit readiness at all times. |
| [Financial Analyst](assets/agency-agents/finance/finance-financial-analyst.md) | Expert financial analyst specializing in financial modeling, forecasting, scenario analysis, and data-driven decision support. Transforms raw financial data into actionable business intelligence that drives strategic planning, investment decisions, and operational optimization. |
| [Financial Forecasting Analyst](assets/agency-agents/finance/finance-financial-forecaster.md) | Financial planning and scenario-modeling specialist for revenue forecasts, cash-flow management, burn-rate analysis, runway planning, and fundraising decisions in uncertain environments. |
| [FP&amp;A Analyst](assets/agency-agents/finance/finance-fpa-analyst.md) | Expert Financial Planning &amp; Analysis (FP&amp;A) analyst specializing in budgeting, variance analysis, financial planning, rolling forecasts, and strategic decision support. Bridges the gap between the numbers and the business narrative to drive operational performance and strategic resource allocation. |
| [Financial Fraud Risk Analyst](assets/agency-agents/finance/finance-fraud-detector.md) | Transaction fraud and financial crime risk specialist covering payment risk controls, anti-money-laundering obligations, scam detection, identity signals, case review, and measurable control effectiveness. |
| [Hong Kong Stock Market Compliance Reviewer](assets/agency-agents/finance/finance-hk-stock-compliance-reviewer.md) | Hong Kong capital-markets compliance specialist covering HKEX Listing Rules, SFC requirements, listing applications, continuing obligations, connected transactions, disclosure, and corporate governance. |
| [Investment Researcher](assets/agency-agents/finance/finance-investment-researcher.md) | Expert investment researcher specializing in market research, due diligence, portfolio analysis, and asset valuation. Conducts rigorous fundamental and quantitative analysis to identify investment opportunities, assess risks, and support data-driven portfolio decisions across public equities, private markets, and alternative assets. |
| [Invoice Management Specialist](assets/agency-agents/finance/finance-invoice-manager.md) | China invoice lifecycle and tax-operations specialist covering VAT invoices, e-invoices, three-way matching, reimbursement approval, reconciliation, Golden Tax workflows, and compliant digital controls. |
| [Tax Strategist](assets/agency-agents/finance/finance-tax-strategist.md) | Expert tax strategist specializing in tax optimization, multi-jurisdictional compliance, transfer pricing, and strategic tax planning. Navigates complex tax codes to minimize liability while ensuring full regulatory compliance across local, state, federal, and international tax regimes. |

<a id="experts-game-development"></a>

### Game Development

21 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Blender Add-on Engineer](assets/agency-agents/game-development/blender-addon-engineer.md) | Blender tooling specialist - Builds Python add-ons, asset validators, exporters, and pipeline automations that turn repetitive DCC work into reliable one-click workflows |
| [Economy Designer](assets/agency-agents/game-development/economy-designer.md) | Virtual economy architect - Masters currency systems, sources and sinks, monetization modeling, inflation control, and data-driven economic balancing for live games |
| [Game Audio Engineer](assets/agency-agents/game-development/game-audio-engineer.md) | Interactive audio specialist - Masters FMOD/Wwise integration, adaptive music systems, spatial audio, and audio performance budgeting across all game engines |
| [Game Designer](assets/agency-agents/game-development/game-designer.md) | Systems and mechanics architect - Masters GDD authorship, player psychology, economy balancing, and gameplay loop design across all engines and genres |
| [Godot Gameplay Scripter](assets/agency-agents/game-development/godot-gameplay-scripter.md) | Composition and signal integrity specialist - Masters GDScript 2.0, C# integration, node-based architecture, and type-safe signal design for Godot 4 projects |
| [Godot Multiplayer Engineer](assets/agency-agents/game-development/godot-multiplayer-engineer.md) | Godot 4 networking specialist - Masters the MultiplayerAPI, scene replication, ENet/WebRTC transport, RPCs, and authority models for real-time multiplayer games |
| [Godot Shader Developer](assets/agency-agents/game-development/godot-shader-developer.md) | Godot 4 visual effects specialist - Masters the Godot Shading Language (GLSL-like), VisualShader editor, CanvasItem and Spatial shaders, post-processing, and performance optimization for 2D/3D effects |
| [Level Designer](assets/agency-agents/game-development/level-designer.md) | Spatial storytelling and flow specialist - Masters layout theory, pacing architecture, encounter design, and environmental narrative across all game engines |
| [Narrative Designer](assets/agency-agents/game-development/narrative-designer.md) | Story systems and dialogue architect - Masters GDD-aligned narrative design, branching dialogue, lore architecture, and environmental storytelling across all game engines |
| [Roblox Avatar Creator](assets/agency-agents/game-development/roblox-avatar-creator.md) | Roblox UGC and avatar pipeline specialist - Masters Roblox's avatar system, UGC item creation, accessory rigging, texture standards, and the Creator Marketplace submission pipeline |
| [Roblox Experience Designer](assets/agency-agents/game-development/roblox-experience-designer.md) | Roblox platform UX and monetization specialist - Masters engagement loop design, DataStore-driven progression, Roblox monetization systems (Passes, Developer Products, UGC), and player retention for Roblox experiences |
| [Roblox Systems Scripter](assets/agency-agents/game-development/roblox-systems-scripter.md) | Roblox platform engineering specialist - Masters Luau, the client-server security model, RemoteEvents/RemoteFunctions, DataStore, and module architecture for scalable Roblox experiences |
| [Technical Artist](assets/agency-agents/game-development/technical-artist.md) | Art-to-engine pipeline specialist - Masters shaders, VFX systems, LOD pipelines, performance budgeting, and cross-engine asset optimization |
| [Unity Architect](assets/agency-agents/game-development/unity-architect.md) | Data-driven modularity specialist - Masters ScriptableObjects, decoupled systems, and single-responsibility component design for scalable Unity projects |
| [Unity Editor Tool Developer](assets/agency-agents/game-development/unity-editor-tool-developer.md) | Unity editor automation specialist - Masters custom EditorWindows, PropertyDrawers, AssetPostprocessors, ScriptedImporters, and pipeline automation that saves teams hours per week |
| [Unity Multiplayer Engineer](assets/agency-agents/game-development/unity-multiplayer-engineer.md) | Networked gameplay specialist - Masters Netcode for GameObjects, Unity Gaming Services (Relay/Lobby), client-server authority, lag compensation, and state synchronization |
| [Unity Shader Graph Artist](assets/agency-agents/game-development/unity-shader-graph-artist.md) | Visual effects and material specialist - Masters Unity Shader Graph, HLSL, URP/HDRP rendering pipelines, and custom pass authoring for real-time visual effects |
| [Unreal Multiplayer Architect](assets/agency-agents/game-development/unreal-multiplayer-architect.md) | Unreal Engine networking specialist - Masters Actor replication, GameMode/GameState architecture, server-authoritative gameplay, network prediction, and dedicated server setup for UE5 |
| [Unreal Systems Engineer](assets/agency-agents/game-development/unreal-systems-engineer.md) | Performance and hybrid architecture specialist - Masters C++/Blueprint continuum, Nanite geometry, Lumen GI, and Gameplay Ability System for AAA-grade Unreal Engine projects |
| [Unreal Technical Artist](assets/agency-agents/game-development/unreal-technical-artist.md) | Unreal Engine visual pipeline specialist - Masters the Material Editor, Niagara VFX, Procedural Content Generation, and the art-to-engine pipeline for UE5 projects |
| [Unreal World Builder](assets/agency-agents/game-development/unreal-world-builder.md) | Open-world and environment specialist - Masters UE5 World Partition, Landscape, procedural foliage, HLOD, and large-scale level streaming for seamless open-world experiences |

<a id="experts-gis"></a>

### GIS

13 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [3D &amp; Scene Developer](assets/agency-agents/gis/gis-3d-scene-developer.md) | Web 3D visualization specialist who creates immersive 3D scenes, terrain models, point cloud visualizations, and interactive web experiences using Cesium, ArcGIS Scene Viewer, and modern 3D web frameworks. |
| [GIS Analyst](assets/agency-agents/gis/gis-analyst.md) | Day-to-day GIS operator who creates maps, manages layers, performs spatial queries, and maintains geospatial data integrity across desktop and web environments. |
| [BIM/GIS Specialist](assets/agency-agents/gis/gis-bim-specialist.md) | Integration specialist who bridges Building Information Modeling and Geographic Information Systems — Revit/IFC data conversion, indoor mapping, digital twin architecture, and facility management data models. |
| [Cartography Designer](assets/agency-agents/gis/gis-cartography-designer.md) | Map aesthetics specialist who designs beautiful, readable, and effective maps — color theory, typography, label placement, basemap selection, and visual hierarchy for both print and web. |
| [Drone/Reality Mapping Specialist](assets/agency-agents/gis/gis-drone-reality-mapping.md) | Photogrammetry and reality capture expert who processes drone imagery into orthomosaics, digital terrain models, point clouds, and 3D meshes — bridging field capture and GIS-ready products. |
| [GeoAI/ML Engineer](assets/agency-agents/gis/gis-geoai-ml-engineer.md) | Geospatial machine learning specialist who builds models for feature extraction, object detection, image segmentation, and land cover classification from satellite and aerial imagery. |
| [Geoprocessing Specialist](assets/agency-agents/gis/gis-geoprocessing-specialist.md) | ArcPy and Python toolbox expert who automates spatial workflows — builds .pyt toolboxes, Model Builder processes, batch geoprocessing automation, and custom analysis scripts for ArcGIS Pro. |
| [GIS QA Engineer](assets/agency-agents/gis/gis-qa-engineer.md) | Quality assurance specialist who validates geospatial data integrity — topology checks, metadata audits, CRS consistency, accuracy assessment, and compliance verification. |
| [Solution Engineer](assets/agency-agents/gis/gis-solution-engineer.md) | Hands-on GIS prototype builder who takes strategy from Technical Consultant and turns it into working demos, proof-of-concepts, and technical validations across the full Esri and open-source stack. |
| [Spatial Data Engineer](assets/agency-agents/gis/gis-spatial-data-engineer.md) | ETL specialist who transforms messy geospatial data from any source into clean, standardized, production-ready datasets — format conversion, CRS reprojection, attribute normalization, and automated pipelines. |
| [Spatial Data Scientist](assets/agency-agents/gis/gis-spatial-data-scientist.md) | Advanced spatial analytics specialist who applies statistical modeling, spatial econometrics, clustering, and predictive analytics to geospatial data — finding patterns that aren't visible on a map. |
| [Technical Consultant](assets/agency-agents/gis/gis-technical-consultant.md) | Strategic GIS advisor who translates business problems into geospatial solutions — gap analysis, technology roadmaps, RFP responses, and digital transformation strategy across Esri and open-source ecosystems. |
| [Web GIS Developer](assets/agency-agents/gis/gis-web-gis-developer.md) | Full-stack web GIS engineer who builds interactive mapping applications — MapLibre GL JS, ArcGIS JS API, Leaflet, real-time dashboards, REST API integration, and geospatial web services. |

<a id="experts-healthcare"></a>

### Healthcare

3 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Clinical Evidence Agent](assets/agency-agents/healthcare/healthcare-clinical-evidence-agent.md) | Evidence standards and clinical credibility framework for AI agents |
| [Healthcare Innovation Strategist](assets/agency-agents/healthcare/healthcare-innovation-strategist.md) | Strategic narrative architect for healthcare founders operating at |
| [Sovereign Health Systems Agent](assets/agency-agents/healthcare/healthcare-sovereign-health-systems-agent.md) | Government health mandate engagement framework for AI agents |

<a id="experts-hr"></a>

### Human Resources

2 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Performance Management Specialist](assets/agency-agents/hr/hr-performance-reviewer.md) | China-focused performance management specialist covering OKRs, KPIs, 360-degree feedback, calibration sessions, performance improvement plans, and talent development. |
| [Full-Cycle Recruiter](assets/agency-agents/hr/hr-recruiter.md) | Full-cycle recruiting specialist for the Chinese talent market, covering sourcing channels, resume screening, interview coordination, pipeline management, offers, and onboarding. |

<a id="experts-legal"></a>

### Legal

2 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Contract Review Specialist](assets/agency-agents/legal/legal-contract-reviewer.md) | China-focused commercial contract specialist covering risk identification, clause review, redlines, electronic signatures, dispute resolution, and liquidated damages. |
| [Legal Policy Writer](assets/agency-agents/legal/legal-policy-writer.md) | China-focused legal policy writer for internal policies, privacy notices, terms of service, and compliance under PIPL, the Data Security Law, and the Cybersecurity Law. |

<a id="experts-marketing"></a>

### Marketing

43 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [AEO Foundations Architect](assets/agency-agents/marketing/marketing-aeo-foundations.md) | Expert in AI Engine Optimization infrastructure — implements llms.txt, AI-aware robots.txt, token-budgeted content, structured Markdown availability, and agent discovery files so AI crawlers, citation engines, and browsing agents can find, parse, and act on your site |
| [Agentic Search Optimizer](assets/agency-agents/marketing/marketing-agentic-search-optimizer.md) | Expert in WebMCP readiness and agentic task completion — audits whether AI agents can actually accomplish tasks on your site (book, buy, register, subscribe), implements WebMCP declarative and imperative patterns, and measures task completion rates across AI browsing agents |
| [AI Citation Strategist](assets/agency-agents/marketing/marketing-ai-citation-strategist.md) | Expert in AI recommendation engine optimization (AEO/GEO) — audits brand visibility across ChatGPT, Claude, Gemini, and Perplexity, identifies why competitors get cited instead, and delivers content fixes that improve AI citations |
| [App Store Optimizer](assets/agency-agents/marketing/marketing-app-store-optimizer.md) | Expert app store marketing specialist focused on App Store Optimization (ASO), conversion rate optimization, and app discoverability |
| [Baidu SEO Specialist](assets/agency-agents/marketing/marketing-baidu-seo-specialist.md) | Expert Baidu search optimization specialist focused on Chinese search engine ranking, Baidu ecosystem integration, ICP compliance, Chinese keyword research, and mobile-first indexing for the China market. |
| [Bilibili Content Strategist](assets/agency-agents/marketing/marketing-bilibili-content-strategist.md) | Expert Bilibili marketing specialist focused on creator growth, danmaku culture, recommendation optimization, community building, and branded content strategy for China's leading video community platform. |
| [Bilibili Long-Form Video Strategist](assets/agency-agents/marketing/marketing-bilibili-strategist.md) | Bilibili content strategist specializing in long-form video, creator operations, danmaku culture, community trust, recommendation dynamics, brand partnerships, sustainable audience growth, and monetization. |
| [Book Co-Author](assets/agency-agents/marketing/marketing-book-co-author.md) | Strategic thought-leadership book collaborator for founders, experts, and operators turning voice notes, fragments, and positioning into structured first-person chapters. |
| [Carousel Growth Engine](assets/agency-agents/marketing/marketing-carousel-growth-engine.md) | Autonomous TikTok and Instagram carousel generation specialist. Analyzes any website URL with Playwright, generates viral 6-slide carousels via Gemini image generation, publishes directly to feed via Upload-Post API with auto trending music, fetches analytics, and iteratively improves through a data-driven learning loop. |
| [China E-Commerce Operator](assets/agency-agents/marketing/marketing-china-ecommerce-operator.md) | Expert China e-commerce operations specialist covering Taobao, Tmall, Pinduoduo, and JD ecosystems with deep expertise in product listing optimization, live commerce, store operations, 618/Double 11 campaigns, and cross-platform strategy. |
| [China Market Localization Strategist](assets/agency-agents/marketing/marketing-china-market-localization-strategist.md) | Full-stack China market localization expert who transforms real-time trend signals into executable go-to-market strategies across Douyin, Xiaohongshu, WeChat, Bilibili, and beyond |
| [Content Creator](assets/agency-agents/marketing/marketing-content-creator.md) | Expert content strategist and creator for multi-platform campaigns. Develops editorial calendars, creates compelling copy, manages brand storytelling, and optimizes content for engagement across all digital channels. |
| [Cross-Border E-Commerce Specialist](assets/agency-agents/marketing/marketing-cross-border-ecommerce.md) | Full-funnel cross-border e-commerce strategist covering Amazon, Shopee, Lazada, AliExpress, Temu, and TikTok Shop operations, international logistics and overseas warehousing, compliance and taxation, multilingual listing optimization, brand globalization, and DTC independent site development. |
| [News Intelligence Analyst](assets/agency-agents/marketing/marketing-daily-news-briefing.md) | Multi-source news intelligence specialist who gathers, verifies, prioritizes, and structures domestic and international developments into concise, traceable briefs for downstream content teams. |
| [Douyin Strategist](assets/agency-agents/marketing/marketing-douyin-strategist.md) | Short-video marketing expert specializing in the Douyin platform, with deep expertise in recommendation algorithm mechanics, viral video planning, livestream commerce workflows, and full-funnel brand growth through content matrix strategies. |
| [China E-commerce Operations Specialist](assets/agency-agents/marketing/marketing-ecommerce-operator.md) | Full-funnel e-commerce operator for Taobao, Tmall, JD.com, and Pinduoduo, covering merchandising, listing optimization, campaign planning, livestream commerce, conversion, retention, and platform-specific execution. |
| [Email Marketing Strategist](assets/agency-agents/marketing/marketing-email-strategist.md) | Expert email marketing strategist for CRM-driven campaigns, lifecycle automation, segmentation architecture, and deliverability. Designs sequences (welcome, nurture, reactivation, win-back, review, referral) grounded in 2025-2026 benchmarks, AI-driven personalization, and post-Apple MPP measurement. |
| [Global Podcast Strategist](assets/agency-agents/marketing/marketing-global-podcast-strategist.md) | Expert podcast growth specialist focused on show positioning, audience development, content strategy, and monetisation. Transforms raw ideas into authoritative audio brands that compound listeners and revenue over time on Spotify, Apple Podcasts, and YouTube. |
| [Growth Hacker](assets/agency-agents/marketing/marketing-growth-hacker.md) | Expert growth strategist specializing in rapid user acquisition through data-driven experimentation. Develops viral loops, optimizes conversion funnels, and finds scalable growth channels for exponential business growth. |
| [Instagram Curator](assets/agency-agents/marketing/marketing-instagram-curator.md) | Expert Instagram marketing specialist focused on visual storytelling, community building, and multi-format content optimization. Masters aesthetic development and drives meaningful engagement. |
| [Knowledge Commerce Product Strategist](assets/agency-agents/marketing/marketing-knowledge-commerce-strategist.md) | Knowledge-product and monetization strategist for Chinese platforms, covering product definition, pricing, curriculum packaging, creator positioning, community operations, distribution, retention, and unit economics. |
| [Kuaishou Strategist](assets/agency-agents/marketing/marketing-kuaishou-strategist.md) | Expert Kuaishou marketing strategist specializing in short-form video, livestream commerce, community trust, regional audience behavior, and grassroots creator growth. |
| [LinkedIn Content Creator](assets/agency-agents/marketing/marketing-linkedin-content-creator.md) | Expert LinkedIn content strategist focused on thought leadership, personal brand building, and high-engagement professional content. Masters LinkedIn's algorithm and culture to drive inbound opportunities for founders, job seekers, developers, and anyone building a professional presence. |
| [Livestream Commerce Coach](assets/agency-agents/marketing/marketing-livestream-commerce-coach.md) | Veteran livestream e-commerce coach specializing in host training and live room operations across Douyin, Kuaishou, Taobao Live, and Channels, covering script design, product sequencing, paid-vs-organic traffic balancing, conversion closing techniques, and real-time data-driven optimization. |
| [Multi-Platform Publisher](assets/agency-agents/marketing/marketing-multi-platform-publisher.md) | Chinese multi-platform publishing specialist who adapts one article for Zhihu, Xiaohongshu, CSDN, Bilibili, WeChat Official Accounts, and Juejin, uses draft-first workflows, controls publishing rate, and requires human review before publication. |
| [Podcast Strategist](assets/agency-agents/marketing/marketing-podcast-strategist.md) | Content strategy and operations expert for the Chinese podcast market, with deep expertise in Xiaoyuzhou, Ximalaya, and other major audio platforms, covering show positioning, audio production, audience growth, multi-platform distribution, and monetization to help podcast creators build sticky audio content brands. |
| [PR &amp; Communications Manager](assets/agency-agents/marketing/marketing-pr-communications-manager.md) | Strategic public relations and communications specialist for media relations, press releases, crisis communications, executive thought leadership, brand reputation management, and integrated communications planning — building and protecting reputations through earned media, storytelling, and proactive narrative control |
| [Private Domain Operator](assets/agency-agents/marketing/marketing-private-domain-operator.md) | Expert in building enterprise WeChat (WeCom) private domain ecosystems, with deep expertise in SCRM systems, segmented community operations, Mini Program commerce integration, user lifecycle management, and full-funnel conversion optimization. |
| [Reddit Community Builder](assets/agency-agents/marketing/marketing-reddit-community-builder.md) | Expert Reddit marketing specialist focused on authentic community engagement, value-driven content creation, and long-term relationship building. Masters Reddit culture navigation. |
| [SEO Specialist](assets/agency-agents/marketing/marketing-seo-specialist.md) | Expert search engine optimization strategist specializing in technical SEO, content optimization, link authority building, and organic search growth. Drives sustainable traffic through data-driven search strategies. |
| [Short-Video Editing Coach](assets/agency-agents/marketing/marketing-short-video-editing-coach.md) | Hands-on short-video editing coach covering the full post-production pipeline, with mastery of CapCut Pro, Premiere Pro, DaVinci Resolve, and Final Cut Pro across composition and camera language, color grading, audio engineering, motion graphics and VFX, subtitle design, multi-platform export optimization, editing workflow efficiency, and AI-assisted editing. |
| [Social Media Strategist](assets/agency-agents/marketing/marketing-social-media-strategist.md) | Expert social media strategist for LinkedIn, Twitter, and professional platforms. Creates cross-platform campaigns, builds communities, manages real-time engagement, and develops thought leadership strategies. |
| [TikTok Strategist](assets/agency-agents/marketing/marketing-tiktok-strategist.md) | Expert TikTok marketing specialist focused on viral content creation, algorithm optimization, and community building. Masters TikTok's unique culture and features for brand growth. |
| [Twitter Engager](assets/agency-agents/marketing/marketing-twitter-engager.md) | Expert Twitter marketing specialist focused on real-time engagement, thought leadership building, and community-driven growth. Builds brand authority through authentic conversation participation and viral thread creation. |
| [Video Optimization Specialist](assets/agency-agents/marketing/marketing-video-optimization-specialist.md) | Video marketing strategist specializing in YouTube algorithm optimization, audience retention, chaptering, thumbnail concepts, and cross-platform video syndication. |
| [WeChat Official Account Manager](assets/agency-agents/marketing/marketing-wechat-official-account.md) | Expert WeChat Official Account (OA) strategist specializing in content marketing, subscriber engagement, and conversion optimization. Masters multi-format content and builds loyal communities through consistent value delivery. |
| [WeChat Official Account Operator](assets/agency-agents/marketing/marketing-wechat-operator.md) | WeChat ecosystem content operator specializing in Official Account strategy, editorial planning, community operations, referral growth, private-domain conversion, and mini-program coordination. |
| [Weibo Strategist](assets/agency-agents/marketing/marketing-weibo-strategist.md) | Full-spectrum operations expert for Sina Weibo, with deep expertise in trending topic mechanics, Super Topic community management, public sentiment monitoring, fan economy strategies, and Weibo advertising, helping brands achieve viral reach and sustained growth on China's leading public discourse platform. |
| [Weixin Channels Growth Strategist](assets/agency-agents/marketing/marketing-weixin-channels-strategist.md) | Weixin Channels strategist specializing in social recommendation, short video, livestream commerce, creator analytics, private-domain conversion, and coordinated use of Official Accounts, Moments, mini programs, and WeCom. |
| [X/Twitter Intelligence Analyst](assets/agency-agents/marketing/marketing-x-twitter-intelligence-analyst.md) | Social intelligence specialist for X/Twitter research, trend detection, account monitoring, and evidence-backed audience insights using public signals and structured data workflows. |
| [Xiaohongshu Growth Operator](assets/agency-agents/marketing/marketing-xiaohongshu-operator.md) | Xiaohongshu content and growth specialist covering discovery-led posts, creator partnerships, search visibility, content testing, audience trust, customer acquisition, and reputation management. |
| [Xiaohongshu Specialist](assets/agency-agents/marketing/marketing-xiaohongshu-specialist.md) | Expert Xiaohongshu marketing specialist focused on lifestyle content, trend-driven strategies, and authentic community engagement. Masters micro-content creation and drives viral growth through aesthetic storytelling. |
| [Zhihu Strategist](assets/agency-agents/marketing/marketing-zhihu-strategist.md) | Expert Zhihu marketing specialist focused on thought leadership, community credibility, and knowledge-driven engagement. Masters question-answering strategy and builds brand authority through authentic expertise sharing. |

<a id="experts-paid-media"></a>

### Paid Media

7 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Paid Media Auditor](assets/agency-agents/paid-media/paid-media-auditor.md) | Comprehensive paid media auditor who systematically evaluates Google Ads, Microsoft Ads, and Meta accounts across 200+ checkpoints spanning account structure, tracking, bidding, creative, audiences, and competitive positioning. Produces actionable audit reports with prioritized recommendations and projected impact. |
| [Ad Creative Strategist](assets/agency-agents/paid-media/paid-media-creative-strategist.md) | Paid media creative specialist focused on ad copywriting, RSA optimization, asset group design, and creative testing frameworks across Google, Meta, Microsoft, and programmatic platforms. Bridges the gap between performance data and persuasive messaging. |
| [Paid Social Strategist](assets/agency-agents/paid-media/paid-media-paid-social-strategist.md) | Cross-platform paid social advertising specialist covering Meta (Facebook/Instagram), LinkedIn, TikTok, Pinterest, X, and Snapchat. Designs full-funnel social ad programs from prospecting through retargeting with platform-specific creative and audience strategies. |
| [PPC Campaign Strategist](assets/agency-agents/paid-media/paid-media-ppc-strategist.md) | Senior paid media strategist specializing in large-scale search, shopping, and performance max campaign architecture across Google, Microsoft, and Amazon ad platforms. Designs account structures, budget allocation frameworks, and bidding strategies that scale from $10K to $10M+ monthly spend. |
| [Programmatic &amp; Display Buyer](assets/agency-agents/paid-media/paid-media-programmatic-buyer.md) | Display advertising and programmatic media buying specialist covering managed placements, Google Display Network, DV360, trade desk platforms, partner media (newsletters, sponsored content), and ABM display strategies via platforms like Demandbase and 6Sense. |
| [Search Query Analyst](assets/agency-agents/paid-media/paid-media-search-query-analyst.md) | Specialist in search term analysis, negative keyword architecture, and query-to-intent mapping. Turns raw search query data into actionable optimizations that eliminate waste and amplify high-intent traffic across paid search accounts. |
| [Tracking &amp; Measurement Specialist](assets/agency-agents/paid-media/paid-media-tracking-specialist.md) | Expert in conversion tracking architecture, tag management, and attribution modeling across Google Tag Manager, GA4, Google Ads, Meta CAPI, LinkedIn Insight Tag, and server-side implementations. Ensures every conversion is counted correctly and every dollar of ad spend is measurable. |

<a id="experts-product"></a>

### Product

5 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Behavioral Nudge Engine](assets/agency-agents/product/product-behavioral-nudge-engine.md) | Behavioral psychology specialist that adapts software interaction cadences and styles to maximize user motivation and success. |
| [Feedback Synthesizer](assets/agency-agents/product/product-feedback-synthesizer.md) | Expert in collecting, analyzing, and synthesizing user feedback from multiple channels to extract actionable product insights. Transforms qualitative feedback into quantitative priorities and strategic recommendations. |
| [Product Manager](assets/agency-agents/product/product-manager.md) | Holistic product leader who owns the full product lifecycle — from discovery and strategy through roadmap, stakeholder alignment, go-to-market, and outcome measurement. Bridges business goals, user needs, and technical reality to ship the right thing at the right time. |
| [Sprint Prioritizer](assets/agency-agents/product/product-sprint-prioritizer.md) | Expert product manager specializing in agile sprint planning, feature prioritization, and resource allocation. Focused on maximizing team velocity and business value delivery through data-driven prioritization frameworks. |
| [Trend Researcher](assets/agency-agents/product/product-trend-researcher.md) | Expert market intelligence analyst specializing in identifying emerging trends, competitive analysis, and opportunity assessment. Focused on providing actionable insights that drive product strategy and innovation decisions. |

<a id="experts-project-management"></a>

### Project Management

7 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Experiment Tracker](assets/agency-agents/project-management/project-management-experiment-tracker.md) | Expert project manager specializing in experiment design, execution tracking, and data-driven decision making. Focused on managing A/B tests, feature experiments, and hypothesis validation through systematic experimentation and rigorous analysis. |
| [Jira Workflow Steward](assets/agency-agents/project-management/project-management-jira-workflow-steward.md) | Expert delivery operations specialist who enforces Jira-linked Git workflows, traceable commits, structured pull requests, and release-safe branch strategy across software teams. |
| [Meeting Notes Specialist](assets/agency-agents/project-management/project-management-meeting-notes-specialist.md) | Extract structured decisions, action items, and open questions from meeting transcripts or rough notes into a clean 4-section summary. |
| [Project Shepherd](assets/agency-agents/project-management/project-management-project-shepherd.md) | Expert project manager specializing in cross-functional project coordination, timeline management, and stakeholder alignment. Focused on shepherding projects from conception to completion while managing resources, risks, and communications across multiple teams and departments. |
| [Studio Operations](assets/agency-agents/project-management/project-management-studio-operations.md) | Expert operations manager specializing in day-to-day studio efficiency, process optimization, and resource coordination. Focused on ensuring smooth operations, maintaining productivity standards, and supporting all teams with the tools and processes needed for success. |
| [Studio Producer](assets/agency-agents/project-management/project-management-studio-producer.md) | Senior strategic leader specializing in high-level creative and technical project orchestration, resource allocation, and multi-project portfolio management. Focused on aligning creative vision with business objectives while managing complex cross-functional initiatives and ensuring optimal studio operations. |
| [Senior Project Manager](assets/agency-agents/project-management/project-manager-senior.md) | Converts specs to tasks and remembers previous projects. Focused on realistic scope, no background processes, exact spec requirements |

<a id="experts-research"></a>

### Research

1 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Research Synthesist](assets/agency-agents/research/research-synthesist.md) | Expert in literature review, source evaluation, and evidence synthesis — turns a scattered pile of sources into a structured, honestly-weighted map of what the evidence actually supports |

<a id="experts-sales"></a>

### Sales

9 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Account Strategist](assets/agency-agents/sales/sales-account-strategist.md) | Expert post-sale account strategist specializing in land-and-expand execution, stakeholder mapping, QBR facilitation, and net revenue retention. Turns closed deals into long-term platform relationships through systematic expansion planning and multi-threaded account development. |
| [Sales Coach](assets/agency-agents/sales/sales-coach.md) | Expert sales coaching specialist focused on rep development, pipeline review facilitation, call coaching, deal strategy, and forecast accuracy. Makes every rep and every deal better through structured coaching methodology and behavioral feedback. |
| [Deal Strategist](assets/agency-agents/sales/sales-deal-strategist.md) | Senior deal strategist specializing in MEDDPICC qualification, competitive positioning, and win planning for complex B2B sales cycles. Scores opportunities, exposes pipeline risk, and builds deal strategies that survive forecast review. |
| [Discovery Coach](assets/agency-agents/sales/sales-discovery-coach.md) | Coaches sales teams on elite discovery methodology — question design, current-state mapping, gap quantification, and call structure that surfaces real buying motivation. |
| [Sales Engineer](assets/agency-agents/sales/sales-engineer.md) | Senior pre-sales engineer specializing in technical discovery, demo engineering, POC scoping, competitive battlecards, and bridging product capabilities to business outcomes. Wins the technical decision so the deal can close. |
| [Offer &amp; Lead Gen Strategist](assets/agency-agents/sales/sales-offer-lead-gen-strategist.md) | Top-of-funnel architect who designs irresistible offers and lead magnets that attract qualified buyers at scale. Specializes in value-equation offer construction, lead magnet typology, multi-channel lead generation, and compounding reach through customers, employees, agencies, and affiliates. |
| [Outbound Strategist](assets/agency-agents/sales/sales-outbound-strategist.md) | Signal-based outbound specialist who designs multi-channel prospecting sequences, defines ICPs, and builds pipeline through research-driven personalization — not volume. |
| [Pipeline Analyst](assets/agency-agents/sales/sales-pipeline-analyst.md) | Revenue operations analyst specializing in pipeline health diagnostics, deal velocity analysis, forecast accuracy, and data-driven sales coaching. Turns CRM data into actionable pipeline intelligence that surfaces risks before they become missed quarters. |
| [Proposal Strategist](assets/agency-agents/sales/sales-proposal-strategist.md) | Strategic proposal architect who transforms RFPs and sales opportunities into compelling win narratives. Specializes in win theme development, competitive positioning, executive summary craft, and building proposals that persuade rather than merely comply. |

<a id="experts-security"></a>

### Security

12 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [AI-Generated Code Security Auditor](assets/agency-agents/security/security-ai-generated-code-auditor.md) | Security reviewer for AI-generated and vibe-coded apps — hunts the hardcoded secrets, broken row-level security, and prompt-injection sinks that coding assistants ship by default, then drives a scan, fix, and rescan loop with honest, CWE-mapped findings. |
| [Application Security Engineer](assets/agency-agents/security/security-appsec-engineer.md) | AppSec specialist who secures the software development lifecycle through threat modeling, secure code review, SAST/DAST integration, and developer security education that makes secure code the default. |
| [Security Architect](assets/agency-agents/security/security-architect.md) | Expert security architect specializing in threat modeling, secure-by-design architecture, trust-boundary analysis, defense-in-depth, and risk-based security reviews across web, API, cloud-native, and distributed systems. Designs the security model; hands code-level SAST/DAST and SDLC work to the AppSec Engineer. |
| [Blockchain Security Auditor](assets/agency-agents/security/security-blockchain-security-auditor.md) | Expert smart contract security auditor specializing in vulnerability detection, formal verification, exploit analysis, and comprehensive audit report writing for DeFi protocols and blockchain applications. |
| [Cloud Security Architect](assets/agency-agents/security/security-cloud-security-architect.md) | Cloud-native security specialist designing zero trust architectures, implementing defense-in-depth across AWS, Azure, and GCP, and securing infrastructure-as-code pipelines from day one. |
| [Compliance Auditor](assets/agency-agents/security/security-compliance-auditor.md) | Expert technical compliance auditor specializing in SOC 2, ISO 27001, HIPAA, and PCI-DSS audits — from readiness assessment through evidence collection to certification. |
| [Incident Responder](assets/agency-agents/security/security-incident-responder.md) | Digital forensics and incident response specialist who leads breach investigations, contains active threats, coordinates crisis response, and writes post-mortems that prevent recurrence. |
| [Penetration Tester](assets/agency-agents/security/security-penetration-tester.md) | Offensive security specialist conducting authorized penetration tests, red team operations, and vulnerability assessments across networks, web applications, and cloud infrastructure. |
| [Secrets &amp; Credential Hygiene Engineer](assets/agency-agents/security/security-secrets-credential-engineer.md) | Owns the full lifecycle of secrets and credentials — detection, prevention, vaulting, rotation, and leak response — so an application runs on short-lived, least-privilege credentials that are never in the code and are already rotated by the time a leak is found. |
| [Senior SecOps Engineer](assets/agency-agents/security/security-senior-secops.md) | Defensive application security specialist who scans every code submission for secrets and sensitive data exposure before anything else, then implements or audits security controls following the organization's security standard — covering authentication, authorization, tokens, cookies, HTTP headers, CORS, rate limiting, CSP, secrets management, input validation, and secure logging. |
| [Threat Detection Engineer](assets/agency-agents/security/security-threat-detection-engineer.md) | Expert detection engineer specializing in SIEM rule development, MITRE ATT&amp;CK coverage mapping, threat hunting, alert tuning, and detection-as-code pipelines for security operations teams. |
| [Threat Intelligence Analyst](assets/agency-agents/security/security-threat-intelligence-analyst.md) | Cyber threat intelligence specialist who tracks adversary groups, maps attack campaigns to MITRE ATT&amp;CK, produces actionable intelligence reports, and builds detection rules that catch real threats. |

<a id="experts-spatial-computing"></a>

### Spatial Computing

6 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [macOS Spatial/Metal Engineer](assets/agency-agents/spatial-computing/macos-spatial-metal-engineer.md) | Native Swift and Metal specialist building high-performance 3D rendering systems and spatial computing experiences for macOS and Vision Pro |
| [Terminal Integration Specialist](assets/agency-agents/spatial-computing/terminal-integration-specialist.md) | Terminal emulation, text rendering optimization, and SwiftTerm integration for modern Swift applications |
| [visionOS Spatial Engineer](assets/agency-agents/spatial-computing/visionos-spatial-engineer.md) | Native visionOS spatial computing, SwiftUI volumetric interfaces, and Liquid Glass design implementation |
| [XR Cockpit Interaction Specialist](assets/agency-agents/spatial-computing/xr-cockpit-interaction-specialist.md) | Specialist in designing and developing immersive cockpit-based control systems for XR environments |
| [XR Immersive Developer](assets/agency-agents/spatial-computing/xr-immersive-developer.md) | Expert WebXR and immersive technology developer with specialization in browser-based AR/VR/XR applications |
| [XR Interface Architect](assets/agency-agents/spatial-computing/xr-interface-architect.md) | Spatial interaction designer and interface strategist for immersive AR/VR/XR environments |

<a id="experts-specialized"></a>

### Specialized

68 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Accounts Payable Agent](assets/agency-agents/specialized/accounts-payable-agent.md) | Autonomous payment processing specialist that executes vendor payments, contractor invoices, and recurring bills across any payment rail — crypto, fiat, stablecoins. Integrates with AI agent workflows via tool calls. |
| [Agentic Identity &amp; Trust Architect](assets/agency-agents/specialized/agentic-identity-trust.md) | Designs identity, authentication, and trust verification systems for autonomous AI agents operating in multi-agent environments. Ensures agents can prove who they are, what they're authorized to do, and what they actually did. |
| [Agents Orchestrator](assets/agency-agents/specialized/agents-orchestrator.md) | Autonomous pipeline manager that orchestrates the entire development workflow. You are the leader of this process. |
| [Authenticity Appraiser](assets/agency-agents/specialized/authenticity-appraiser.md) | Authentication and valuation specialist for luxury goods, watches, sneakers, collectibles, market pricing, transaction risk, and the limits of remote appraisal. |
| [Automation Governance Architect](assets/agency-agents/specialized/automation-governance-architect.md) | Governance-first architect for business automations (n8n-first) who audits value, risk, and maintainability before implementation. |
| [Business Strategist](assets/agency-agents/specialized/business-strategist.md) | Senior management consulting specialist for competitive analysis, market entry strategy, business model design, growth planning, organizational strategy, and strategic decision-making — translating complex market dynamics into clear, actionable strategies that create sustainable competitive advantage |
| [Change Management Consultant](assets/agency-agents/specialized/change-management-consultant.md) | Expert change management specialist using ADKAR, Kotter, and Prosci frameworks to guide organizations through technology implementations, restructuring, culture transformation, and M&amp;A integration — managing resistance, building adoption, and ensuring changes stick long after go-live |
| [Chief Financial Officer](assets/agency-agents/specialized/chief-financial-officer.md) | Strategic finance executive who governs capital allocation, treasury operations, financial planning, M&amp;A finance, investor relations, and board reporting — translating financial complexity into clear decisions that drive business performance and stakeholder confidence. |
| [Corporate Training Designer](assets/agency-agents/specialized/corporate-training-designer.md) | Expert in enterprise training system design and curriculum development — proficient in training needs analysis, instructional design methodology, blended learning program design, internal trainer development, leadership programs, and training effectiveness evaluation and continuous optimization. |
| [Customer Service](assets/agency-agents/specialized/customer-service.md) | Friendly, professional customer service specialist for any industry — handling inquiries, complaints, account support, FAQs, and seamless escalation with warmth, efficiency, and a genuine commitment to customer satisfaction |
| [Customer Success Manager](assets/agency-agents/specialized/customer-success-manager.md) | Strategic customer success specialist for onboarding, health scoring, QBR facilitation, churn prevention, expansion identification, and renewal management — driving net revenue retention by turning customers into long-term partners who achieve measurable outcomes |
| [Data Consolidation Agent](assets/agency-agents/specialized/data-consolidation-agent.md) | AI agent that consolidates extracted sales data into live reporting dashboards with territory, rep, and pipeline summaries |
| [Data Privacy Officer](assets/agency-agents/specialized/data-privacy-officer.md) | Corporate data privacy specialist and DPO who builds GDPR, CCPA, and global privacy compliance programs — covering data mapping, privacy impact assessments, consent management, breach response, vendor due diligence, and regulatory engagement. |
| [ESG &amp; Sustainability Officer](assets/agency-agents/specialized/esg-sustainability-officer.md) | Corporate sustainability strategist and ESG reporting specialist who builds environmental, social, and governance programs, manages disclosures, drives decarbonization initiatives, and aligns business strategy with stakeholder and regulatory expectations. |
| [Gaokao College Admissions Advisor](assets/agency-agents/specialized/gaokao-college-advisor.md) | China Gaokao application advisor specializing in provincial rules, parallel preferences, score-rank analysis, subject restrictions, special admission programs, major selection, and balanced reach, match, and safety portfolios. |
| [Government Digital Presales Consultant](assets/agency-agents/specialized/government-digital-presales-consultant.md) | Presales expert for China's government digital transformation market (ToG), proficient in policy interpretation, solution design, bid document preparation, POC validation, compliance requirements (classified protection/cryptographic assessment/Xinchuang domestic IT), and stakeholder management — helping technical teams efficiently win government IT projects. |
| [Grant Writer](assets/agency-agents/specialized/grant-writer.md) | Expert grant writing specialist for nonprofits, research institutions, and social enterprises — covering prospect research, letter of inquiry writing, full proposal development, budget narratives, federal and foundation grants, and post-award reporting to maximize funding success |
| [Aging Parent Care Companion](assets/agency-agents/specialized/healthcare-aging-parent-care-companion.md) | Compassionate, HIPAA-aligned care coordination and decision-support agent for family caregivers managing an aging parent's appointments, medications, care team communication, and their own caregiver wellbeing |
| [Healthcare Customer Service](assets/agency-agents/specialized/healthcare-customer-service.md) | Empathetic healthcare customer service specialist for patient support, billing inquiries, appointment management, insurance questions, complaint resolution, and seamless escalation to clinical or administrative staff |
| [Healthcare Marketing Compliance Specialist](assets/agency-agents/specialized/healthcare-marketing-compliance.md) | Expert in healthcare marketing compliance in China, proficient in the Advertising Law, Medical Advertisement Management Measures, Drug Administration Law, and related regulations — covering pharmaceuticals, medical devices, medical aesthetics, health supplements, and internet healthcare across content review, risk control, platform rule interpretation, and patient privacy protection, helping enterprises conduct effective health marketing within legal boundaries. |
| [Hospitality Guest Services](assets/agency-agents/specialized/hospitality-guest-services.md) | Comprehensive hospitality guest services specialist for hotels, resorts, restaurants, and event venues — covering reservations, check-in/check-out, concierge services, guest complaint resolution, loyalty program management, and post-stay follow-up to deliver exceptional guest experiences that drive loyalty and revenue |
| [HR Onboarding](assets/agency-agents/specialized/hr-onboarding.md) | Comprehensive HR onboarding specialist for employee orientation, documentation management, compliance tracking, benefits enrollment, culture integration, and new hire support — delivering a seamless first-day-to-first-year experience that drives retention and productivity |
| [Identity Graph Operator](assets/agency-agents/specialized/identity-graph-operator.md) | Operates a shared identity graph that multiple AI agents resolve against. Ensures every agent in a multi-agent system gets the same canonical answer for "who is this entity?" - deterministically, even under concurrent writes. |
| [Language Translator](assets/agency-agents/specialized/language-translator.md) | Real-time Spanish ↔ English translation specialist with cultural context, regional dialect awareness, travel phrase guidance, and tone-appropriate communication for everyday, business, and emergency situations |
| [Legal Billing &amp; Time Tracking](assets/agency-agents/specialized/legal-billing-time-tracking.md) | Comprehensive legal billing and time tracking specialist for accurate time capture, invoice generation, billing narrative writing, collections management, trust account compliance, and billing analysis — maximizing revenue recovery while maintaining client relationships and ethical compliance across any firm size or billing model |
| [Legal Client Intake](assets/agency-agents/specialized/legal-client-intake.md) | Comprehensive legal client intake specialist for qualifying prospects, collecting case information, scheduling consultations, managing conflict checks, and delivering attorney-ready intake summaries across any practice area and firm size |
| [Legal Document Review](assets/agency-agents/specialized/legal-document-review.md) | Comprehensive legal document review specialist for contracts, litigation documents, and real estate agreements — summarizing documents, flagging risk clauses, comparing contract versions, and checking compliance across any law firm size or practice area |
| [Livestock Records Auditor](assets/agency-agents/specialized/livestock-archive-auditor.md) | Audits livestock records and production reports for omissions and inconsistencies across medication, feed, treatment, immunization, production, and FIFO batch tracking. |
| [Loan Officer Assistant](assets/agency-agents/specialized/loan-officer-assistant.md) | Comprehensive loan officer assistant for mortgage and lending professionals — covering borrower intake, pre-qualification, document collection, pipeline management, compliance tracking, rate quoting, and closing coordination across residential, commercial, and consumer lending |
| [LSP/Index Engineer](assets/agency-agents/specialized/lsp-index-engineer.md) | Language Server Protocol specialist building unified code intelligence systems through LSP client orchestration and semantic indexing |
| [M&amp;A Integration Manager](assets/agency-agents/specialized/ma-integration-manager.md) | Mergers and acquisitions integration specialist who designs and executes post-merger integration programs — covering Day 1 readiness, 100-day planning, synergy tracking, cultural integration, functional workstream coordination, and transition service agreement management. |
| [Medical Billing &amp; Coding Specialist](assets/agency-agents/specialized/medical-billing-coding-specialist.md) | Expert medical billing and coding specialist for ICD-10-CM/PCS, CPT, and HCPCS coding, claim submission, denial management, revenue cycle optimization, compliance auditing, and payer contract analysis — maximizing clean claim rates and revenue recovery for healthcare providers of all sizes |
| [Operations Manager](assets/agency-agents/specialized/operations-manager.md) | Business operations specialist who applies Lean, Six Sigma, and systems thinking to process mapping, capacity planning, KPI governance, vendor management, and organizational efficiency — turning operational complexity into repeatable, measurable performance. |
| [Organizational Psychologist](assets/agency-agents/specialized/organizational-psychologist.md) | Applied organizational psychologist who diagnoses team dynamics, psychological safety, burnout risk, and culture health — using evidence-based frameworks to help leaders build high-performing, resilient, and psychologically safe organizations. |
| [Personal Growth Mentor](assets/agency-agents/specialized/personal-growth-mentor.md) | Cross-domain personal development mentor for goal clarity, habit design, strategic decisions, and accountability without motivational fluff. |
| [General Prompt Engineer](assets/agency-agents/specialized/prompt-engineer.md) | Large-language-model prompt engineer specializing in system instruction architecture, examples, tool-use constraints, structured outputs, evaluation, failure analysis, and iterative optimization. |
| [Real Estate Buyer &amp; Seller](assets/agency-agents/specialized/real-estate-buyer-seller.md) | Comprehensive real estate agent assistant for buyer representation, seller representation, listing management, offer negotiation, transaction coordination, and closing support — delivering a world-class client experience from first showing to final closing across residential and investment real estate |
| [Recruitment Specialist](assets/agency-agents/specialized/recruitment-specialist.md) | Expert recruitment operations and talent acquisition specialist — skilled in China's major hiring platforms, talent assessment frameworks, and labor law compliance. Helps companies efficiently attract, screen, and retain top talent while building a competitive employer brand. |
| [Report Distribution Agent](assets/agency-agents/specialized/report-distribution-agent.md) | AI agent that automates distribution of consolidated sales reports to representatives based on territorial parameters |
| [Resume Tailor](assets/agency-agents/specialized/resume-tailor.md) | Candidate-side resume optimization specialist who analyzes job descriptions, maps real experience to role requirements, improves ATS keyword alignment, and rewrites bullets without fabricating qualifications. |
| [Retail Customer Returns](assets/agency-agents/specialized/retail-customer-returns.md) | Comprehensive retail customer returns specialist for processing returns, exchanges, and refunds across in-store, online, and omnichannel retail — handling policy enforcement, fraud prevention, customer retention, vendor returns, and returns analytics to maximize recovery while preserving customer loyalty |
| [Sales Data Extraction Agent](assets/agency-agents/specialized/sales-data-extraction-agent.md) | AI agent specialized in monitoring Excel files and extracting key sales metrics (MTD, YTD, Year End) for internal live reporting |
| [Sales Outreach](assets/agency-agents/specialized/sales-outreach.md) | Consultative B2B sales outreach specialist for cold prospecting, lead follow-up, objection handling, proposal writing, and pipeline management — combining data-driven targeting with genuine relationship-building to open doors and close deals |
| [AI Governance Policy Specialist](assets/agency-agents/specialized/specialized-ai-policy-writer.md) | China-focused AI governance and compliance specialist covering generative-AI regulation, algorithm filing, deep-synthesis rules, security assessment, model governance, and operational policy controls. |
| [Chief of Staff](assets/agency-agents/specialized/specialized-chief-of-staff.md) | Master coordinator for founders and executives — filters noise, owns processes, enforces consistency, routes decisions, and positions outputs for impact so the boss can think clearly. |
| [Civil Engineer](assets/agency-agents/specialized/specialized-civil-engineer.md) | Expert civil and structural engineer with global standards coverage — Eurocode, DIN, ACI, AISC, ASCE, AS/NZS, CSA, GB, IS, AIJ, and more. Specializes in structural analysis, geotechnical design, construction documentation, building code compliance, and multi-standard international projects. |
| [Codebase Archaeologist](assets/agency-agents/specialized/specialized-codebase-archaeologist.md) | Multi-session, multi-tool drift detection specialist who audits codebases touched by several AI coding tools (Claude, Cursor, Copilot, Windsurf, etc.) over time, finding silent logic mismatches, dead code, and doc-vs-code divergence that no single session would ever notice on its own. |
| [Cultural Intelligence Strategist](assets/agency-agents/specialized/specialized-cultural-intelligence-strategist.md) | CQ specialist that detects invisible exclusion, researches global context, and ensures software resonates authentically across intersectional identities. |
| [Developer Advocate](assets/agency-agents/specialized/specialized-developer-advocate.md) | Expert developer advocate specializing in building developer communities, creating compelling technical content, optimizing developer experience (DX), and driving platform adoption through authentic engineering engagement. Bridges product and engineering teams with external developers. |
| [Document Generator](assets/agency-agents/specialized/specialized-document-generator.md) | Expert document creation specialist who generates professional PDF, PPTX, DOCX, and XLSX files using code-based approaches with proper formatting, charts, and data visualization. |
| [FedRAMP &amp; RMF Compliance Engineer](assets/agency-agents/specialized/specialized-fedramp-rmf-compliance.md) | Expert FedRAMP and NIST Risk Management Framework compliance engineer specializing in both FedRAMP authorization pathways — the traditional Rev5 path (NIST 800-53 Rev 5 control implementation, System Security Plans, 3PAO assessment, agency authorization) and the modernized FedRAMP 20x path (Key Security Indicators, automated machine-readable validation, compliance-as-code) — plus the ATO process, continuous monitoring (ConMon), POA&amp;M management, FIPS 199 categorization, authorization boundary diagrams, OSCAL machine-readable packages, and cloud security compliance for government and regulated industries |
| [French Consulting Market Navigator](assets/agency-agents/specialized/specialized-french-consulting-market.md) | Navigate the French ESN/SI freelance ecosystem — margin models, platform mechanics (Malt, collective.work), portage salarial, rate positioning, and payment cycle realities |
| [Korean Business Navigator](assets/agency-agents/specialized/specialized-korean-business-navigator.md) | Korean business culture for foreign professionals — 품의 decision process, nunchi reading, KakaoTalk business etiquette, hierarchy navigation, and relationship-first deal mechanics |
| [Master Plan Architect](assets/agency-agents/specialized/specialized-master-plan-architect.md) | Master planning architect, technical educator, and ruthless plan critic who specializes in deep architectural teaching, Red Teaming / risk critique, and crafting comprehensive Implementation Plans in Markdown with ZERO code execution. |
| [MCP Builder](assets/agency-agents/specialized/specialized-mcp-builder.md) | Expert Model Context Protocol developer who designs, builds, and tests MCP servers that extend AI agent capabilities with custom tools, resources, and prompts. |
| [Meeting Productivity Specialist](assets/agency-agents/specialized/specialized-meeting-assistant.md) | Enterprise meeting specialist who designs agendas, captures decisions, tracks accountable action items, coordinates across time zones, and integrates workflows across Feishu, DingTalk, and Tencent Meeting. |
| [Model QA Specialist](assets/agency-agents/specialized/specialized-model-qa.md) | Independent model QA expert who audits ML and statistical models end-to-end - from documentation review and data reconstruction to replication, calibration testing, interpretability analysis, performance monitoring, and audit-grade reporting. |
| [Pricing Analyst](assets/agency-agents/specialized/specialized-pricing-analyst.md) | Specialized pricing analyst who develops optimal pricing models through market research, competitor analysis, cost structure evaluation, and margin optimization — turning pricing from guesswork into a data-driven competitive advantage. |
| [Dynamic Pricing Strategist](assets/agency-agents/specialized/specialized-pricing-optimizer.md) | E-commerce pricing strategist for Chinese marketplaces, combining price architecture, promotion mechanics, competitor monitoring, elasticity, margin guardrails, and experiment design to balance volume and profit. |
| [Enterprise Risk Assessor](assets/agency-agents/specialized/specialized-risk-assessor.md) | Enterprise risk-management specialist covering risk identification, control design, audit remediation, localized COSO practices, state-owned-enterprise governance, ESG risk, supply-chain exposure, and organizational resilience. |
| [Salesforce Architect](assets/agency-agents/specialized/specialized-salesforce-architect.md) | Solution architecture for Salesforce platform — multi-cloud design, integration patterns, governor limits, deployment strategy, and data model governance for enterprise-scale orgs |
| [Strategy Duel Agent](assets/agency-agents/specialized/specialized-strategy-duel-agent.md) | Conducts live strategy duels using game theory and the 36 Chinese stratagems |
| [Workflow Architect](assets/agency-agents/specialized/specialized-workflow-architect.md) | Workflow design specialist who maps complete workflow trees for every system, user journey, and agent interaction — covering happy paths, all branch conditions, failure modes, recovery paths, handoff contracts, and observable states to produce build-ready specs that agents can implement against and QA can test against. |
| [Study Abroad Advisor](assets/agency-agents/specialized/study-abroad-advisor.md) | Full-spectrum study abroad planning expert covering the US, UK, Canada, Australia, Europe, Hong Kong, and Singapore — proficient in undergraduate, master's, and PhD application strategy, school selection, essay coaching, profile enhancement, standardized test planning, visa preparation, and overseas life adaptation, helping Chinese students craft personalized end-to-end study abroad plans. |
| [Supply Chain Strategist](assets/agency-agents/specialized/supply-chain-strategist.md) | Expert supply chain management and procurement strategy specialist — skilled in supplier development, strategic sourcing, quality control, and supply chain digitalization. Grounded in China's manufacturing ecosystem, helps companies build efficient, resilient, and sustainable supply chains. |
| [Technical Translator](assets/agency-agents/specialized/technical-translator-agent.md) | Chinese-English technical translator specializing in software engineering, AI, cloud computing, APIs, and developer documentation, with strict terminology control and preservation of technical meaning. |
| [Travel Planner](assets/agency-agents/specialized/travel-planner.md) | Travel-planning specialist for Chinese travelers, covering practical route design, transport and lodging, visas and documents, budgets, seasonal constraints, and executable day-by-day itineraries. |
| [ZK Steward](assets/agency-agents/specialized/zk-steward.md) | Knowledge-base steward in the spirit of Niklas Luhmann's Zettelkasten. Default perspective: Luhmann; switches to domain experts (Feynman, Munger, Ogilvy, etc.) by task. Enforces atomic notes, connectivity, and validation loops. Use for knowledge-base building, note linking, complex task breakdown, and cross-domain decision support. |

<a id="experts-support"></a>

### Support

7 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Analytics Reporter](assets/agency-agents/support/support-analytics-reporter.md) | Expert data analyst transforming raw data into actionable business insights. Creates dashboards, performs statistical analysis, tracks KPIs, and provides strategic decision support through data visualization and reporting. |
| [Executive Summary Generator](assets/agency-agents/support/support-executive-summary-generator.md) | Consultant-grade AI specialist trained to think and communicate like a senior strategy consultant. Transforms complex business inputs into concise, actionable executive summaries using McKinsey SCQA, BCG Pyramid Principle, and Bain frameworks for C-suite decision-makers. |
| [Finance Tracker](assets/agency-agents/support/support-finance-tracker.md) | Expert financial analyst and controller specializing in financial planning, budget management, and business performance analysis. Maintains financial health, optimizes cash flow, and provides strategic financial insights for business growth. |
| [Infrastructure Maintainer](assets/agency-agents/support/support-infrastructure-maintainer.md) | Expert infrastructure specialist focused on system reliability, performance optimization, and technical operations management. Maintains robust, scalable infrastructure supporting business operations with security, performance, and cost efficiency. |
| [Legal Compliance Checker](assets/agency-agents/support/support-legal-compliance-checker.md) | Expert legal and compliance specialist ensuring business operations, data handling, and content creation comply with relevant laws, regulations, and industry standards across multiple jurisdictions. |
| [Recruitment Operations Specialist](assets/agency-agents/support/support-recruitment-specialist.md) | Recruitment operations and talent-acquisition specialist for Chinese hiring channels, structured assessment, candidate experience, employer branding, process analytics, and labor-law compliance. |
| [Support Responder](assets/agency-agents/support/support-support-responder.md) | Expert customer support specialist delivering exceptional customer service, issue resolution, and user experience optimization. Specializes in multi-channel support, proactive customer care, and turning support interactions into positive brand experiences. |

<a id="experts-supply-chain"></a>

### Supply Chain

4 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Garment Factory Planning Engineer](assets/agency-agents/supply-chain/supply-chain-garment-factory-planning-engineer.md) | Multi-site garment factory planning specialist covering plant layout, capacity modeling, equipment selection, lean optimization, and multinational compliance across major apparel production lines. |
| [Inventory Forecasting Specialist](assets/agency-agents/supply-chain/supply-chain-inventory-forecaster.md) | Supply chain specialist for demand forecasting, safety stock, replenishment optimization, and inventory balance under Chinese e-commerce promotion cycles. |
| [Logistics Route Optimizer](assets/agency-agents/supply-chain/supply-chain-route-optimizer.md) | Supply chain specialist for route planning and logistics cost optimization across Chinese parcel networks, local delivery, cold chain, and cross-border shipping. |
| [Vendor Evaluation Specialist](assets/agency-agents/supply-chain/supply-chain-vendor-evaluator.md) | Procurement specialist for supplier screening, scoring, factory audits, quality systems, payment terms, cost negotiation, and lifecycle management. |

<a id="experts-testing"></a>

### Testing

10 experts.

| Expert | Specialty and use cases |
| --- | --- |
| [Accessibility Auditor](assets/agency-agents/testing/testing-accessibility-auditor.md) | Expert accessibility specialist who audits interfaces against WCAG standards, tests with assistive technologies, and ensures inclusive design. Defaults to finding barriers — if it's not tested with a screen reader, it's not accessible. |
| [API Tester](assets/agency-agents/testing/testing-api-tester.md) | Expert API testing specialist focused on comprehensive API validation, performance testing, and quality assurance across all systems and third-party integrations |
| [Embedded QA Engineer](assets/agency-agents/testing/testing-embedded-qa-engineer.md) | Embedded-systems quality engineer specializing in hardware-in-the-loop testing, firmware automation, OTA regression, EMC and ESD planning, production fixtures, fault injection, and reliability verification. |
| [Evidence Collector](assets/agency-agents/testing/testing-evidence-collector.md) | Screenshot-obsessed, fantasy-allergic QA specialist - Default to finding 3-5 issues, requires visual proof for everything |
| [Performance Benchmarker](assets/agency-agents/testing/testing-performance-benchmarker.md) | Expert performance testing and optimization specialist focused on measuring, analyzing, and improving system performance across all applications and infrastructure |
| [Reality Checker](assets/agency-agents/testing/testing-reality-checker.md) | Stops fantasy approvals, evidence-based certification - Default to "NEEDS WORK", requires overwhelming proof for production readiness |
| [Test Automation Engineer](assets/agency-agents/testing/testing-test-automation-engineer.md) | Expert end-to-end test automation engineer for Playwright and Cypress — resilient selectors, flake elimination, isolated test data, CI parallelization, and trace-driven failure debugging. |
| [Test Results Analyzer](assets/agency-agents/testing/testing-test-results-analyzer.md) | Expert test analysis specialist focused on comprehensive test result evaluation, quality metrics analysis, and actionable insight generation from testing activities |
| [Tool Evaluator](assets/agency-agents/testing/testing-tool-evaluator.md) | Expert technology assessment specialist focused on evaluating, testing, and recommending tools, software, and platforms for business use and productivity optimization |
| [Workflow Optimizer](assets/agency-agents/testing/testing-workflow-optimizer.md) | Expert process improvement specialist focused on analyzing, optimizing, and automating workflows across all business functions for maximum productivity and efficiency |

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
