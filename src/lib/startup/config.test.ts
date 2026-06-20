import { describe, it, expect } from 'vitest'
import { MAX_PIVOTS, TYPE_CONFIG, SITE_URLS } from './config'

describe('MAX_PIVOTS', () => {
  it('equals 30', () => {
    expect(MAX_PIVOTS).toBe(30)
  })
})

describe('TYPE_CONFIG', () => {
  it.each(Object.entries(TYPE_CONFIG))('%s has label, color, and bg', (_key, cfg) => {
    expect(cfg.label).toEqual(expect.any(String))
    expect(cfg.color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(cfg.bg).toMatch(/^rgba\(/)
  })

  // Active playbook (2026-06) 追加キーの回帰確認
  // it.each が動的走査するため構造テストは自動適用済みだが、
  // 「意図したキーが存在するか」は明示的に確認する必要がある。
  const ACTIVE_KEYS = ['ai_video', 'ai_localization', 'ai_agency', 'ai_annotation', 'ai_tutoring']
  it.each(ACTIVE_KEYS)('active playbook キー "%s" が TYPE_CONFIG に存在する', (key) => {
    expect(TYPE_CONFIG).toHaveProperty(key)
  })

  // Legacy キーが削除されていないことの回帰確認
  const LEGACY_KEYS = ['affiliate_seo', 'digital_product', 'game_ads', 'saas', 'physical_product']
  it.each(LEGACY_KEYS)('legacy キー "%s" が後方互換のため維持されている', (key) => {
    expect(TYPE_CONFIG).toHaveProperty(key)
  })

  it('TYPE_CONFIG のキー総数は 10 件（active 5 + legacy 5）', () => {
    expect(Object.keys(TYPE_CONFIG)).toHaveLength(10)
  })
})

describe('SITE_URLS', () => {
  it.each(Object.entries(SITE_URLS))('%s starts with https', (_name, url) => {
    expect(url).toMatch(/^https:\/\//)
  })
})
