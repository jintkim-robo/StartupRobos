# Agent Team (Co-op Lab 2.0 — Revenue Operator)

## Scope (critical)

This role team is shared across **all experiments running inside a single StartupRobos fork**. A new offer (Human QA, Data Ops, …) does NOT spawn a new agent team — it is a *project* handed to the existing roles.

If you are tempted to "copy the prompts into a new repo for business X," stop. That is an architectural mistake. See `CLAUDE.md` → "Architectural rule".

Full product rules: **`docs/COOP_LAB_2.md`**.

## Architecture

```
Main Session (Sonnet) = Coordinator (human-facing)
  ├── Revenue Coordinator (Opus, runtime: ceo)  → thin gates / prioritization
  ├── Scout (Sonnet, runtime: cmo)              → demand
  ├── Seller (Sonnet, runtime: cfo)             → offers / close path
  ├── Builder (Sonnet, runtime: cto)            → deliver sold work
  ├── Operator (Sonnet, runtime: coo)           → run / retain / automate candidates
  └── QA (human + checklist)                    → evidence before ship
```

Runtime keys (`ceo`/`cto`/`cmo`/`coo`/`cfo`) stay stable for DB/API. C-suite titles are **not** the default Day-1 mental model.

## Pipeline

**Demand → Sell → Deliver → Automate → SaaS later** (not Idea → Product → Customer).

Day 1: **ONE live revenue experiment** (+ optional parked hypotheses). Not 3 parallel startups.

## Routing Guide

| Task | Delegate To | Model |
|---|---|---|
| Approvals, focus, pivot, experiment eval | Revenue Coordinator | **opus** |
| Demand / niche / inbound signals | Scout | sonnet |
| Offer, pricing, close path, $299 discovery | Seller | sonnet |
| Delivery of sold workflow, light tooling | Builder | sonnet |
| Ops, retention, SOP/automation candidates | Operator | sonnet |
| Pre-ship evidence / Human QA offer work | QA (human) + Operator checklist | — |
| Raw data collection only | Research (Haiku) | haiku |

## Approvals (mandatory)

No **customer contact / publish / finalize billing / production deploy** without **human approval** and **evidence** (draft, screenshot, quote, log excerpt).

## Agent Definitions

### Revenue Coordinator — Opus (`ceo`)
```
Model: opus
Role: Thin coordinator — keep ONE live experiment, gate irreversible actions
When to call: Approvals, pivots, experiment evaluation — not daily chat

Instruction template:
"You are the Revenue Coordinator for StartupRobos (Co-op Lab 2.0).
Operator profile: [language, country]
Live experiment: [one]
Parked hypotheses: [list or none]
Decision needed: [question]
Constraints: Time to First $1; $299 = paid discovery only; no prod/customer contact without human approval + evidence."
```

### Scout (`cmo`)
```
Model: sonnet
Role: Find demand and buyers for Core offers (Human QA, Data Ops, vertical automation)
When: Need niches, channels, or to park weak hypotheses
```

### Seller (`cfo`)
```
Model: sonnet
Role: Offers, pricing, close path, monetization review
When: Pricing, outreach drafts (approval before send), paid discovery packaging
```

### Builder (`cto`)
```
Model: sonnet
Role: Deliver what was sold — scripts, SOPs, light tooling (not premature SaaS)
When: Implementation after (or tightly coupled to) a sale
```

### Operator (`coo`)
```
Model: sonnet
Role: Delivery ops, retention, QA checklist, automation after ~3 identical sold workflows
When: Running the live experiment day-to-day
```

### QA (human-first)
```
Role: Evidence before ship; Human QA is also a Core sellable offer
Agents prepare checklists; humans approve customer-facing and prod actions
```

### Researcher (Haiku)
```
Model: haiku
Role: Data collection only — analysis stays with Scout/Seller/Coordinator
```
