import { describe, it, expect } from 'vitest'
import { CXO_MODELS, CXO_SYSTEM_PROMPTS, ROLE_DISPLAY, type CXORole } from './cxo'

const ALL_ROLES: CXORole[] = ['ceo', 'cto', 'cmo', 'coo', 'cfo']

describe('CXO_MODELS', () => {
  it('defines all 5 runtime roles', () => {
    for (const role of ALL_ROLES) {
      expect(CXO_MODELS[role]).toBeDefined()
    }
  })

  it('Revenue Coordinator (ceo) uses claude-opus-4-6', () => {
    expect(CXO_MODELS.ceo).toBe('claude-opus-4-6')
  })

  it('Scout/Seller/Builder/Operator use claude-sonnet-4-6', () => {
    for (const role of ['cto', 'cmo', 'coo', 'cfo'] as CXORole[]) {
      expect(CXO_MODELS[role]).toBe('claude-sonnet-4-6')
    }
  })
})

describe('ROLE_DISPLAY', () => {
  it('maps runtime keys to Co-op Lab 2.0 names', () => {
    expect(ROLE_DISPLAY.ceo).toBe('Revenue Coordinator')
    expect(ROLE_DISPLAY.cmo).toBe('Scout')
    expect(ROLE_DISPLAY.cfo).toBe('Seller')
    expect(ROLE_DISPLAY.cto).toBe('Builder')
    expect(ROLE_DISPLAY.coo).toBe('Operator')
  })
})

describe('CXO_SYSTEM_PROMPTS', () => {
  it('defines a non-empty string prompt for all 5 roles', () => {
    for (const role of ALL_ROLES) {
      expect(typeof CXO_SYSTEM_PROMPTS[role]).toBe('string')
      expect(CXO_SYSTEM_PROMPTS[role].length).toBeGreaterThan(0)
    }
  })

  it('Revenue Coordinator prompt contains DECISION keyword', () => {
    expect(CXO_SYSTEM_PROMPTS.ceo).toMatch(/DECISION/)
  })

  it('Builder prompt references delivery / sold workflow', () => {
    expect(CXO_SYSTEM_PROMPTS.cto).toMatch(/sold|delivery|Builder/i)
  })
})
