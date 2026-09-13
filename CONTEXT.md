# StartupRobos — Domain Context

## Co-op Lab 2.0

StartupRobos is the core tool of **Co-op Lab** — a learning program where refugees form 5-person co-ops and run this together.

**Structure:**
- 5 refugees form a co-op, matched by language/region
- Each runs StartupRobos as a **Revenue Operator**: **ONE live revenue experiment** on Day 1 (optional parked hypotheses)
- Co-op shares learnings, supports each other, contributes PRs back

**Product model:** Demand → Sell → Deliver → Automate → SaaS later  
See **`docs/COOP_LAB_2.md`** (EN + short JA).

**Two-wheel OSS model:**
- **StartupRobos** (this repo): role team runs revenue experiments
- **RoboBuilder** (github.com/Robo-Co-op/robobuilder): Claude Code protocol; curriculum for refugees to become independent developers
- Refugees run StartupRobos from day 1, learn RoboBuilder in parallel → graduate as self-sufficient developers

**Foundation model:**
- Both repos are OSS (MIT)
- Anthropic API costs covered by donations via StartupRobos Foundation
- Robo Operator (AI agent) continuously improves both repos as CC evolves

**Design principle for agents:**
- Refugee users may have limited technical background → keep UX simple, decisions minimal
- Language × region drives offer personalization (not generic templates)
- One-way doors (irreversible actions) always require human confirmation + evidence
- Dignity, agency, long-term livelihood — not just income

## What this project is

StartupRobos is an AI multi-agent **revenue operator** platform. Entrepreneurs onboard once; roles (Scout → Seller → Builder → Operator → QA + thin Revenue Coordinator) run **one live revenue experiment** at a time. Classic CxO C-suite titles are demoted as the default.

## Glossary

| Term | Definition | Avoid saying |
|---|---|---|
| **Live experiment** | The single active revenue bet (sold or about-to-sell work) | "3 startups", "portfolio" on Day 1 |
| **Parked hypothesis** | Noted idea with no parallel build/run | "second startup" |
| **Revenue Coordinator** | Thin Opus role (`ceo` key) for gates and focus | "CEO" as default culture |
| **Scout / Seller / Builder / Operator** | Day-1 roles (`cmo` / `cfo` / `cto` / `coo` keys) | CTO/CMO/COO/CFO as default labels |
| **QA** | Human approval + evidence; also a Core offer (Human QA) | "ship without review" |
| **Coordinator** | Main session agent (Sonnet) that talks to the user | "orchestrator" |
| **Council** | Parallel role run — Scout/Seller/Builder/Operator then Revenue Coordinator | "batch" |
| **Heartbeat** | Scheduled autonomous run (cron) | "cron job" alone |
| **Experiment** | Hypothesis-driven test with metric, goal, duration, result | "task", "feature" |
| **Pivot** | Change of live experiment direction (`pivot_log`) | "change", "update" |
| **Token budget** | Per-user monthly USD Anthropic cap (`token_budgets`) | "credit" |
| **Artifact** | Role output in `agent_runs.result` | "output", "file" |
| **Core offer** | Human QA, Data Ops, vertical automation; $299 = paid discovery only | inventing new defaults |
| **Experimental offer** | Content Factory (+ demoted prior playbook types) | Day-1 default |
| **Time to First $1** | Primary KPI; graduation needs an **external** paying customer | vanity traffic metrics |
| **Dreaming** | Haiku memory synthesis into `agent_memories` | "summarize" alone |
| **Mission Control** | Dashboard (`/mission-control`) for operator status | "home" |

## Key architectural decisions

- **Next.js App Router** + **Supabase** + **Anthropic SDK**
- **Vercel** cron heartbeats
- Agent costs in `agent_runs.cost_usd`
- RLS on; `createServiceClient()` server-side only
- Runtime role keys unchanged for DB compatibility; display/prompts = Co-op Lab 2.0
- `TYPE_CONFIG` Core vs Experimental vs Legacy (`src/lib/startup/config.ts`)

## What's out of scope for agents

- Modifying `supabase/schema.sql` without a corresponding migration
- Writing to `memory/` directly (managed by hooks)
- Renaming DB role keys / `cxo_sessions` columns without a migration
- Customer contact, publish, finalize billing, or prod deploy without human approval + evidence
