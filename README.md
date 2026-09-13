# StartupRobos

AI team that helps you **sell and deliver** revenue work. You talk; agents scout, sell drafts, build deliveries, and operate — with human approvals.

**Co-op Lab 2.0:** Demand → Sell → Deliver → Automate → SaaS later.  
Day 1 = **ONE live revenue experiment** (not 3 parallel startups).  
Details: [`docs/COOP_LAB_2.md`](docs/COOP_LAB_2.md).

## 3 Steps

1. **[Use this template](https://github.com/Robo-Co-op/StartupRobos/generate)** to create your own repo
2. **Open it in [Claude Code](https://claude.ai/download)**
3. **Say:** _"I want to startup. https://github.com/YourUserName/StartupRobos/"_

Done. The AI helps you pick **one** Core offer experiment, set up infra, and start the revenue loop.

> ⚠️ **Don't work directly in the upstream `Robo-Co-op/StartupRobos` repo.**
> That's the framework. Your experiments live in *your* template instance. See [Why?](#why-use-this-template-not-fork-or-clone) below.

📘 Playbooks and operator guides: [Co-op Lab on Notion](https://robocoop.notion.site/cooplab).

---

## What happens next

Claude Code asks what languages you speak. You approve **one live revenue experiment** (optional parked hypotheses). Roles run: **Scout → Seller → Builder → Operator → QA** (+ thin **Revenue Coordinator**). Classic CxO titles are demoted as the default.

### Core offers (Day-1 priority)

| Offer | What | Notes |
|------|------|---------|
| Human QA | Review / verify AI or ops output | Also a QA role gate |
| Data Ops | Cleaning, labeling ops, pipeline care | |
| Vertical automation | Repeatable niche workflow automation | Automate after ~3 identical sold jobs |
| Paid discovery | Scoped diagnosis | **$299 = discovery only** |

### Experimental

| Offer | Notes |
|------|---------|
| Content Factory | Not Day-1 default |
| Prior playbook types (AI video, localization, …) | Kept for existing operators |

**KPI:** Time to First $1. Robo Co-op may be first distribution; **graduation needs an external paying customer**.

**Approvals:** no customer contact / publish / finalize billing / prod without human approval + evidence.

---

## Requirements

- [Claude Desktop](https://claude.ai/download) (or Claude Code CLI: `npm i -g @anthropic-ai/claude-code`)
- Claude Pro subscription ($20/month) — [claude.ai](https://claude.ai)
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com/)) — $5-10 credits to start
- GitHub account
- Free tier works for: Supabase, Vercel, Gumroad

> **First time?** Follow the **[Setup Guide](docs/setup-guide.md)**.

---

## Setup: Supabase & Vercel (guided-manual)

The init script (`bash scripts/init-operator.sh`) walks you through these, or do them by hand:

### Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. **SQL Editor** → paste `supabase/schema.sql` → **Run**
3. **SQL Editor** → paste `supabase/migrations/001_spend_budget_rpc.sql` → **Run**
4. **Settings > API** → copy Project URL, anon key, service role key

### Environment

```bash
cp .env.example .env.local
# Fill in Supabase keys + Anthropic API key
# Generate secrets: openssl rand -hex 32
```

### Vercel

```bash
npx vercel          # Link to your Vercel project
npx vercel env add  # Add each key from .env.local
npx vercel --prod   # Deploy
```

Daily heartbeats (Vercel Cron) keep agents running even when you're offline. Reports go to the operator by email. Mission Control dashboard at `/dashboard` shows everything live.

---

## Budget

| Role | Model | Notes |
|------|-------|-------|
| Coordinator (main) | Sonnet | Always-on, low cost |
| Revenue Coordinator | Opus | Gates only — sparingly |
| Scout / Seller / Builder / Operator | Sonnet | Bulk of token usage |
| Research | Haiku | Cheapest model |

With prompt caching enabled (configured in `.claude/` + `src/lib/agent/`), expect ~40% lower effective cost.

---

## Architecture & Design Decisions

### Why "Use this template" (not fork or clone)?

**StartupRobos is a framework, not a single-business template.**

- One StartupRobos instance = one operator = N experiments over time, **one live** by default.
- Work lives under `businesses/<slug>/` inside *your* instance.
- **Do NOT copy `.claude/agents/`, `AGENTS.md`, or `src/lib/agent/` into a standalone repo.**

```
❌ Wrong:   my-offer-standalone-repo (re-implements role prompts)
✅ Right:   my-startuprobos/businesses/human-qa-niche/  (uses shared roles)
```

| | Template clone | Fork |
--|---------------|------|
| Setup scripts run cleanly | ✅ | ⚠️ references remain |
| History is yours | ✅ | ❌ (carries upstream history) |
| Can pull upstream fixes later | ✅ `git remote add upstream …` | ✅ |

### Staying up to date with upstream

```bash
git remote add upstream https://github.com/Robo-Co-op/StartupRobos.git
git fetch upstream
git merge upstream/main
```

---

## Adding a new experiment (for contributors)

1. Copy `businesses/_template/` to `businesses/<slug>/`
2. Fill in README following the template
3. Use shared `src/lib/agent/` — do **not** duplicate it
4. Prefer Core `TYPE_CONFIG` keys; mark Experimental clearly
5. Update `memory/MEMORY.md` with context

**Do not create a standalone repo for a single offer.**

## Community

- **Discord:** [discord.gg/q8ubqBtCd](https://discord.gg/q8ubqBtCd) — `#startup-robos` channel

---

## License

MIT — template freely. Upstream improvements welcome.
