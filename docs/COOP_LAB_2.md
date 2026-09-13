# Co-op Lab 2.0 — Revenue Operator Model

> Source of truth for Day-1 product behavior in StartupRobos.
> English full text + short Japanese summary at the bottom.

## Why this change

Default Day-1 used to be **Idea → Product → Customer** with **3 parallel startups** and a full AI C-suite (CEO/CTO/CMO/COO/CFO). That optimized for building, not for cash.

Co-op Lab 2.0 defaults to a **Revenue Operator** model:

**Demand → Sell → Deliver → Automate → SaaS later**

## Day 1

- **ONE live revenue experiment** (sold work or a paid discovery call).
- Optional **parked hypotheses** (notes only — no parallel build/run).
- Do **not** spawn three autonomous startups on day one.

Primary KPI: **Time to First $1** (external paying customer preferred; Robo Co-op may be first distribution channel but **graduation requires an external paying customer**).

## Roles (default)

C-suite titles are **demoted** as the default mental model. Runtime still uses stable keys (`ceo`/`cto`/`cmo`/`coo`/`cfo`) for DB/API compatibility; display + prompts map as follows:

| Runtime key | Co-op Lab 2.0 role | Job |
|---|---|---|
| `cmo` | **Scout** | Find demand, niches, buyers, inbound signals |
| `cfo` | **Seller** | Offers, pricing, outreach drafts, close path |
| `cto` | **Builder** | Deliver the sold workflow (scripts, SOPs, light tooling) |
| `coo` | **Operator** | Run delivery, scheduling, retention loops, automation candidates |
| *(human + checklist)* | **QA** | Evidence before ship; Human QA is also a Core offer |
| `ceo` | **Revenue Coordinator** (thin) | Gate approvals, prioritize the single live experiment, escalate |

Main session Coordinator (Sonnet) remains the human-facing bridge. Opus is used sparingly for hard gates — not daily C-suite theater.

## Offers

### Core (prioritize)

| Offer | Notes |
|---|---|
| **Human QA** | Review / verification of AI or ops output |
| **Data Ops** | Cleaning, labeling ops, pipeline babysitting |
| **Vertical automation** | Repeatable workflow automation for a niche |

### Pricing guardrail

- **$299 = paid discovery only** (scoped diagnosis / workshop). Not a full build retainer by default.

### Experimental

| Offer | Notes |
|---|---|
| **Content Factory** | Content production at scale — experimental; do not default Day 1 |
| Legacy playbook types (`ai_video`, `ai_localization`, …) | Kept for existing operators; not Day-1 defaults |

## Gates

1. **Sell first.** Do not build a product before a paying (or firmly committed) buyer for the live experiment.
2. **~3 identical sold workflows** → write SOP → automate.
3. **micro-SaaS only after** retained payers (**aim ≥10**) **and** evidence of retention — not before.
4. Parked hypotheses stay parked until the live experiment graduates or is killed.

## Approvals (mandatory)

**No customer contact / publish / finalize billing / production deploy without human approval.** Agents must attach **evidence** (draft, screenshot, quote, log excerpt) when requesting approval.

One-way doors always escalate to the human operator (via thin Revenue Coordinator).

## Graduation

- Robo Co-op can be the **first** distribution or internal buyer.
- **Graduation** to “validated operator” requires at least one **external paying customer** and a recorded Time-to-First-$1.

## Leftover internals (intentionally kept)

Prefer **not** renaming DB tables/columns or API path segments unless a migration is trivial and safe.
User-facing labels/prompts use Co-op Lab 2.0 names; runtime keys stay stable.

| Kind | Legacy identifier | Notes |
|------|-------------------|-------|
| Table | `cxo_sessions` | Stores council round reports; columns `cto_report`, `cmo_report`, `coo_report`, `cfo_report`, `ceo_decision` |
| API | `/api/cxo/run`, `/api/heartbeat/cxo` | Route folders keep `cxo` for URL stability |
| Code | `CXORole`, `CXO_MODELS`, `CXO_SYSTEM_PROMPTS`, `ROLE_DISPLAY` | In `src/lib/agent/cxo.ts`; display map → Scout/Seller/… |
| Task types | `cxo_cto`, `cxo_cmo`, … | Prefixed in `agent_runs.task_type` |
| Seeds | `supabase/seed-suzan.sql` | Historical operator; **1 active + 2 paused**. New operators: `supabase/seed-default.sql` |
| Scripts | `scripts/lib/mission-control.js` | Still accepts legacy business slug aliases for old transcripts |

Do **not** rename these in a drive-by cleanup. Track a dedicated migration if product wants `revenue_sessions` later.

## See also

- `CONTEXT.md` — glossary + architecture
- `AGENTS.md` — role prompts
- `CLAUDE.md` — onboarding + day-to-day coordinator rules
- `src/lib/startup/config.ts` — Core vs Experimental `TYPE_CONFIG`

---

## 日本語サマリー（短）

Co-op Lab 2.0 は **収益オペレーター**模型。Day 1 は **ライブ収益実験を1つ**（仮説の並行3起業はしない）。流れは **需要→販売→納品→自動化→その後SaaS**。役割は Scout / Seller / Builder / Operator / QA + 薄い Revenue Coordinator（従来の CxO 肩書きは既定にしない）。優先オファーは Human QA・Data Ops・垂直オートメーション。$299 は有料ディスカバリーのみ。Content Factory は実験枠。ゲートは「同一ワークフロー約3件で SOP/自動化」「継続課金者めやす10＋リテンション後に micro-SaaS」。KPI は **初の $1 までの時間**。Robo Co-op は初期流通可だが、卒業には外部の有料顧客が必要。顧客連絡・公開・請求確定・本番は **人間承認＋証跡必須**。
