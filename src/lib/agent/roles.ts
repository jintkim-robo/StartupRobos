// task_type → agent info (Co-op Lab 2.0 display labels; runtime role keys unchanged)

export interface TaskAgentDef {
  /** Display label (Co-op Lab 2.0 role name) */
  label: string
  /** Agent color (hex) */
  color: string
  /** URL slug / runtime role key (ceo|cto|cmo|coo|cfo) */
  role: string
  /** Task type display name */
  taskLabel: string
}

export const TASK_AGENT: Record<string, TaskAgentDef> = {
  pivot_analysis: { label: 'Revenue Coordinator', color: '#f59e0b', role: 'ceo', taskLabel: 'Pivot Analysis' },
  mvp_spec:       { label: 'Builder', color: '#3b82f6', role: 'cto', taskLabel: 'Delivery Spec' },
  market_research:{ label: 'Scout', color: '#ec4899', role: 'cmo', taskLabel: 'Demand Scout' },
  ops_review:     { label: 'Operator', color: '#f97316', role: 'coo', taskLabel: 'Operations Review' },
  budget_review:  { label: 'Seller', color: '#22c55e', role: 'cfo', taskLabel: 'Offer & Pricing' },
  pivot_decision: { label: 'Revenue Coordinator', color: '#f59e0b', role: 'ceo', taskLabel: 'Pivot Decision' },
  ceo_review:     { label: 'Revenue Coordinator', color: '#f59e0b', role: 'ceo', taskLabel: 'Revenue Review' },
  cto_review:     { label: 'Builder', color: '#3b82f6', role: 'cto', taskLabel: 'Builder Review' },
}
