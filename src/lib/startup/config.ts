export const MAX_PIVOTS = 30

export interface BusinessTypeConfig {
  label: string
  color: string
  bg: string
}

/**
 * ビジネスタイプごとの表示設定
 * キー: business_type 値（DB カラム）
 *
 * Active playbook (2026-06) — Notion: Small Digital Business Playbook
 * 上位5件が新規オペレーター向け推奨。Legacy は既存オペレーター互換のため残存。
 */
export const TYPE_CONFIG: Record<string, BusinessTypeConfig> = {
  // Active playbook — 新規オペレーター向け推奨（優先順）
  ai_video:       { label: 'AI Video / Audio',  color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
  ai_localization:{ label: 'AI Localization',   color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  ai_agency:      { label: 'AI Agency / RPA',   color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ai_annotation:  { label: 'AI Annotation',     color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  ai_tutoring:    { label: 'AI Tutoring',       color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  // Legacy — 既存オペレーター互換（新規スタートには非推奨）
  affiliate_seo:    { label: 'Affiliate SEO',     color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  digital_product:  { label: 'Digital Product',   color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  game_ads:         { label: 'Game + Ads',         color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  saas:             { label: 'SaaS',               color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  physical_product: { label: 'Physical Product',   color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
}

/**
 * スタートアップ名 → サイト URL マッピング
 * キー: startup.name 値（DB カラム）
 */
export const SITE_URLS: Record<string, string> = {
  // Robo Co-op (original operator)
  'AI Tool Lab': 'https://robo-co-op.github.io/ai-tool-lab/',
  'Prompt Pack': 'https://robo-co-op.github.io/prompt-pack/',
  'Puzzle Games': 'https://robo-co-op.github.io/puzzle-games/',
  // Suzan — Spain / MENA
  'Patent Mining Spain': 'https://www.amazon.es/s?me=PENDING_SELLER_ID',
  'DigitalSouq': 'https://roboco-op.gumroad.com',
  'AI Sales Buddy': 'https://pronto-ai-sales-buddy.lovable.app/',
}