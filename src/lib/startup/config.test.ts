import { describe, it, expect } from 'vitest'
import { MAX_PIVOTS, TYPE_CONFIG, SITE_URLS, CORE_OFFER_KEYS, EXPERIMENTAL_OFFER_KEYS } from './config'

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

  it.each([...CORE_OFFER_KEYS])('core offer key "%s" exists', (key) => {
    expect(TYPE_CONFIG).toHaveProperty(key)
    expect(TYPE_CONFIG[key].tier).toBe('core')
  })

  it.each([...EXPERIMENTAL_OFFER_KEYS])('experimental key "%s" exists', (key) => {
    expect(TYPE_CONFIG).toHaveProperty(key)
    expect(TYPE_CONFIG[key].tier).toBe('experimental')
  })

  const LEGACY_KEYS = ['affiliate_seo', 'digital_product', 'game_ads', 'saas', 'physical_product']
  it.each(LEGACY_KEYS)('legacy key "%s" retained', (key) => {
    expect(TYPE_CONFIG).toHaveProperty(key)
    expect(TYPE_CONFIG[key].tier).toBe('legacy')
  })

  it('TYPE_CONFIG has core + experimental + legacy keys', () => {
    expect(Object.keys(TYPE_CONFIG).length).toBe(
      CORE_OFFER_KEYS.length + EXPERIMENTAL_OFFER_KEYS.length + LEGACY_KEYS.length
    )
  })
})

describe('SITE_URLS', () => {
  it.each(Object.entries(SITE_URLS))('%s starts with https', (_name, url) => {
    expect(url).toMatch(/^https:\/\//)
  })
})
