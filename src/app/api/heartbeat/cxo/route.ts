import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireCronAuth } from '@/lib/auth'
import { runHeartbeatTask } from '@/lib/agent/heartbeatRunner'
import type { TaskType } from '@/lib/agent/responseSchemas'
import { ROLE_DISPLAY } from '@/lib/agent/cxo'

// Revenue-operator heartbeat: Scout/Seller/Builder/Operator (+ cross) — maxDuration for parallel AI
export const maxDuration = 300

/** Per-offer Day-1 tasks (Core + legacy keys still in seeded DBs). */
const BUSINESS_TASKS: Record<string, { roleKey: 'cto' | 'cmo' | 'coo' | 'cfo'; prompt: string; task_type: TaskType }> = {
  human_qa: {
    roleKey: 'cmo',
    task_type: 'market_research',
    prompt: `You are the Scout for a Human QA live revenue experiment.
Propose 3 actions this week that move toward Time to First $1:
1. One specific buyer niche with budget for human QA of AI/ops output
2. One outreach or inbound channel to test (draft only — human approval before contact)
3. Evidence pack for a $299 paid discovery OR a scoped QA engagement
Keep each proposal to 2-3 lines.`,
  },
  data_ops: {
    roleKey: 'cfo',
    task_type: 'budget_review',
    prompt: `You are the Seller for a Data Ops live revenue experiment.
Propose 3 actions toward first paid work:
1. Offer framing and price band (discovery $299 vs ongoing ops)
2. Close path for one external payer (Robo Co-op may be first distribution only)
3. What NOT to productize yet
Keep each proposal to 2-3 lines.`,
  },
  vertical_automation: {
    roleKey: 'cto',
    task_type: 'mvp_spec',
    prompt: `You are the Builder for a vertical automation live revenue experiment.
Propose 3 delivery actions for work that is sold or about to be sold:
1. Smallest automation/SOP that fulfills the sold workflow
2. Tooling boundary (no premature SaaS)
3. Gate: after ~3 identical sold workflows → SOP/automate
Keep each proposal to 2-3 lines.`,
  },
  paid_discovery: {
    roleKey: 'cfo',
    task_type: 'budget_review',
    prompt: `You are the Seller for a $299 paid discovery offer (discovery only — not a full build).
Propose 3 actions to book and deliver one paid discovery this week.
Human approval required before customer contact and billing finalize.
Keep each proposal to 2-3 lines.`,
  },
  content_factory: {
    roleKey: 'cmo',
    task_type: 'market_research',
    prompt: `You are the Scout. Content Factory is EXPERIMENTAL — do not treat as Day-1 default.
If this is the live experiment, propose 3 demand tests; otherwise recommend parking it.
Keep each proposal to 2-3 lines.`,
  },
  // Legacy seeded types (existing operators)
  physical_product: {
    roleKey: 'cto',
    task_type: 'mvp_spec',
    prompt: `You are the Builder on a legacy physical_product experiment. Prefer revenue ops over new product scope.
Propose 3 actions that unblock sold/near-sold delivery this week. 2-3 lines each.`,
  },
  digital_product: {
    roleKey: 'cmo',
    task_type: 'market_research',
    prompt: `You are the Scout on a legacy digital_product experiment. Propose 3 demand/sell actions toward Time to First $1. 2-3 lines each.`,
  },
  saas: {
    roleKey: 'cto',
    task_type: 'mvp_spec',
    prompt: `You are the Builder on a legacy saas experiment. micro-SaaS only after retained payers (aim ≥10) + retention — otherwise focus on sold services. Propose 3 actions. 2-3 lines each.`,
  },
  affiliate_seo: {
    roleKey: 'cmo',
    task_type: 'market_research',
    prompt: `You are the Scout on a legacy affiliate_seo experiment. Propose 3 demand actions; prefer Core offers if SEO is stalled. 2-3 lines each.`,
  },
  game_ads: {
    roleKey: 'cto',
    task_type: 'mvp_spec',
    prompt: `You are the Builder on a legacy game_ads experiment. Propose 3 actions toward real revenue or recommend parking. 2-3 lines each.`,
  },
}

const CROSS_ROLE_TASKS: Array<{ roleKey: 'coo' | 'cfo'; task_type: TaskType; prompt: string }> = [
  {
    roleKey: 'coo',
    task_type: 'ops_review',
    prompt: `You are the Operator for a Co-op Lab Revenue Operator instance.
Focus on the ONE live revenue experiment (parked hypotheses stay parked).
Report on:
1. Delivery/ops blockers
2. QA checklist before customer contact / publish / billing / prod (human approval + evidence)
3. Whether ~3 identical sold workflows exist yet to justify SOP/automation`,
  },
  {
    roleKey: 'cfo',
    task_type: 'budget_review',
    prompt: `You are the Seller / monetization reviewer for Co-op Lab 2.0.
Report on:
1. Path to Time to First $1 (external payer required for graduation; Robo Co-op may be first distribution)
2. Offer clarity (Human QA, Data Ops, vertical automation; $299 = paid discovery only)
3. Whether micro-SaaS talk is premature (need retained payers — aim ≥10 + retention)`,
  },
]

export async function GET(req: NextRequest) {
  const authError = requireCronAuth(req)
  if (authError) return authError

  const supabase = createServiceClient()

  const { data: startups } = await supabase
    .from('startups')
    .select('id, name, business_type')
    .eq('status', 'active')

  if (!startups?.length) {
    return NextResponse.json({ message: 'No startups found' })
  }

  const businessPromises = startups
    .filter(s => BUSINESS_TASKS[s.business_type])
    .map(async startup => {
      const task = BUSINESS_TASKS[startup.business_type]
      const display = ROLE_DISPLAY[task.roleKey]
      const { content, costUsd } = await runHeartbeatTask(supabase, {
        model: 'claude-sonnet-4-6',
        maxTokens: 800,
        prompt: task.prompt,
        systemPrompt: `You are the ${display} on StartupRobos (Co-op Lab 2.0). Provide actionable recommendations. Never contact customers, publish, finalize billing, or deploy to prod without noting human approval + evidence.`,
        startupId: startup.id,
        taskType: task.task_type,
      })
      return { startup: startup.name, role: display, suggestions: content, costUsd }
    })

  const crossPromises = CROSS_ROLE_TASKS.map(async task => {
    const display = ROLE_DISPLAY[task.roleKey]
    const { content, costUsd } = await runHeartbeatTask(supabase, {
      model: 'claude-sonnet-4-6',
      maxTokens: 800,
      prompt: task.prompt,
      systemPrompt: `You are the ${display} on StartupRobos (Co-op Lab 2.0). Provide actionable recommendations.`,
      startupId: startups[0].id,
      taskType: task.task_type,
    })
    return { role: display, report: content, costUsd }
  })

  const allResults = await Promise.all([...businessPromises, ...crossPromises])
  const totalCost = allResults.reduce((sum, r) => sum + r.costUsd, 0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const results = allResults.map(({ costUsd: _costUsd, ...rest }) => rest)

  return NextResponse.json({ ok: true, total_cost_usd: totalCost, results })
}
