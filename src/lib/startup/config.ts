export const MAX_PIVOTS = 30

export interface BusinessTypeConfig {
  label: string
  color: string
  bg: string
  /** Core = Day-1 recommended; Experimental = opt-in; Legacy = existing operators only */
  tier?: 'core' | 'experimental' | 'legacy'
}

/**
 * Business type display config (DB business_type keys).
 *
 * Co-op Lab 2.0 — Core vs Experimental (see docs/COOP_LAB_2.md).
 * Legacy keys retained for existing operators / seeded data.
 */
export const TYPE_CONFIG: Record<string, BusinessTypeConfig> = {
  // Core — Day-1 Revenue Operator defaults
  human_qa:             { label: 'Human QA',            color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', tier: 'core' },
  data_ops:             { label: 'Data Ops',            color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', tier: 'core' },
  vertical_automation:  { label: 'Vertical Automation', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', tier: 'core' },
  paid_discovery:       { label: 'Paid Discovery ($299)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', tier: 'core' },
  // Experimental
  content_factory:      { label: 'Content Factory',     color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', tier: 'experimental' },
  // Prior active playbook — kept, demoted from Day-1 default
  ai_video:       { label: 'AI Video / Audio',  color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', tier: 'experimental' },
  ai_localization:{ label: 'AI Localization',   color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', tier: 'experimental' },
  ai_agency:      { label: 'AI Agency / RPA',   color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', tier: 'experimental' },
  ai_annotation:  { label: 'AI Annotation',     color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', tier: 'experimental' },
  ai_tutoring:    { label: 'AI Tutoring',       color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', tier: 'experimental' },
  // Legacy — existing operators only
  affiliate_seo:    { label: 'Affiliate SEO',     color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', tier: 'legacy' },
  digital_product:  { label: 'Digital Product',   color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', tier: 'legacy' },
  game_ads:         { label: 'Game + Ads',         color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', tier: 'legacy' },
  saas:             { label: 'SaaS',               color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', tier: 'legacy' },
  physical_product: { label: 'Physical Product',   color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', tier: 'legacy' },
}

export const CORE_OFFER_KEYS = ['human_qa', 'data_ops', 'vertical_automation', 'paid_discovery'] as const
export const EXPERIMENTAL_OFFER_KEYS = ['content_factory', 'ai_video', 'ai_localization', 'ai_agency', 'ai_annotation', 'ai_tutoring'] as const

/**
 * Startup name → site URL mapping (existing operator artifacts).
 */
export const SITE_URLS: Record<string, string> = {
  'AI Tool Lab': 'https://robo-co-op.github.io/ai-tool-lab/',
  'Prompt Pack': 'https://robo-co-op.github.io/prompt-pack/',
  'Puzzle Games': 'https://robo-co-op.github.io/puzzle-games/',
  'Patent Mining Spain': 'https://www.amazon.es/s?me=PENDING_SELLER_ID',
  'DigitalSouq': 'https://roboco-op.gumroad.com',
  'AI Sales Buddy': 'https://pronto-ai-sales-buddy.lovable.app/',
}
