import type { SupabaseClient } from '@supabase/supabase-js'
import { checkBudgetPreFlight, deductBudget, BudgetExhaustedError } from '@/lib/agent/budgetDeduction'
import { calcCost, type ModelName } from '@/lib/agent/costs'
import {
  extractText,
  parseAgentResponse,
  RESPONSE_SCHEMAS,
  type TaskType,
} from './responseSchemas'
import { anthropic } from './anthropicClient'


export interface AgentConfig {
  userId: string
  startupId: string
  taskType: TaskType
  model?: ModelName
  maxTokens?: number
}

export interface AgentResult {
  content: string
  structured: Record<string, unknown> | null
  tokensUsed: { input: number; output: number }
  costUsd: number
  budgetRemaining: number
}

export async function runAgent(
  config: AgentConfig,
  prompt: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseServiceClient: SupabaseClient<any, any, any>
): Promise<AgentResult> {
  // Use sonnet for pivot_decision, haiku for others
  const model: ModelName = config.model ?? (
    config.taskType === 'pivot_decision' ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
  )
  const maxTokens = config.maxTokens ?? 1000

  // Atomic budget check via RPC (avoids read-modify-write race)
  // minUsd=0 (default): allow execution until budget is fully exhausted.
  // council.ts uses MIN_BUDGET_USD=0.10 to reserve a buffer for the full CXO round.
  await checkBudgetPreFlight(supabaseServiceClient, config.userId)

  // Execute agent
  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
    system: getSystemPrompt(config.taskType),
  })

  const tokensIn = response.usage.input_tokens
  const tokensOut = response.usage.output_tokens
  const costUsd = calcCost(model, tokensIn, tokensOut)

  // Parse and validate structured response
  const rawContent = extractText(response)
  const schema = RESPONSE_SCHEMAS[config.taskType]
  const { parsed, error: parseError } = parseAgentResponse(rawContent, schema)

  if (parseError) {
    console.warn(`[harness] Structured parse failed for ${config.taskType}: ${parseError}`)
  }

  // Save execution record (store validated JSON in result if available)
  await supabaseServiceClient.from('agent_runs').insert({
    user_id: config.userId,
    startup_id: config.startupId,
    model,
    tokens_input: tokensIn,
    tokens_output: tokensOut,
    cost_usd: costUsd,
    task_type: config.taskType,
    result: parsed ? JSON.stringify(parsed) : rawContent,
  })

  // アトミックに予算控除（TOCTOU 競合を排除）
  const deduction = await deductBudget(supabaseServiceClient, config.userId, costUsd)
  if (!deduction.ok) throw new BudgetExhaustedError('Token budget exhausted (concurrent deduction failed)')

  return {
    content: rawContent,
    structured: parsed as Record<string, unknown> | null,
    tokensUsed: { input: tokensIn, output: tokensOut },
    costUsd,
    budgetRemaining: deduction.remaining ?? 0,
  }
}

function getSystemPrompt(taskType: TaskType): string {
  const prompts: Record<TaskType, string> = {
    pivot_analysis: `You are the Revenue Coordinator for a Co-op Lab operator. Analyze the live revenue experiment and suggest concrete pivot options. Prefer Demand→Sell→Deliver over Idea→Product. Output valid JSON with fields: pivot_options (string array), reasoning (string), risk_level ("low"|"medium"|"high").`,
    market_research: `You are the Scout. Identify a specific paying buyer segment, demand channel, and Core offer fit (Human QA, Data Ops, vertical automation; $299 = paid discovery only) in under 500 words. Park non-live hypotheses.`,
    mvp_spec: `You are the Builder. Define the smallest delivery that fulfills a sold (or about-to-be-sold) workflow — not a premature product. Output valid JSON with fields: core_feature (string), validation_metric (string), build_time_estimate (string), tech_stack_suggestion (string).`,
    pivot_decision: `You are the Revenue Coordinator. Given metrics, decide go vs pivot for the ONE live revenue experiment. Output valid JSON with fields: decision ("go"|"pivot"), confidence (number 0-100), rationale (string).`,
    ops_review: `You are the Operator. Review delivery ops, retention, and QA/approval gates. Flag anything needing human approval before customer contact, publish, billing, or prod.`,
    budget_review: `You are the Seller. Review offer, pricing, path to Time to First $1, and whether micro-SaaS is premature (need retained payers — aim ≥10 + retention).`,
    ceo_review: `You are the thin Revenue Coordinator. Review the live revenue experiment (not 3 parallel startups), prioritize Time to First $1, and list required human approvals with evidence.`,
    cto_review: `You are the Builder. Propose the smallest technical improvements that unblock delivery of sold work — not engagement vanity features.`,
  }
  return prompts[taskType]
}
