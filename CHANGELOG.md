# Changelog

## [Unreleased] — Co-op Lab 2.0 Revenue Operator

### Changed
- Day-1 model: ONE live revenue experiment (Demand→Sell→Deliver→Automate→SaaS later)
- Roles: Scout / Seller / Builder / Operator / QA + thin Revenue Coordinator (runtime keys unchanged)
- TYPE_CONFIG: Core (human_qa, data_ops, vertical_automation, paid_discovery) vs Experimental vs Legacy
- Approvals: human + evidence required for customer contact / publish / billing / prod
- Docs: `docs/COOP_LAB_2.md`, AGENTS.md, CLAUDE.md, CONTEXT.md, README.md

## [v0.1.0] - 2026-05-15

### Added
- Full TDD implementation: 149 tests passing across 26 test files
- Security hardening: timing-safe auth compare, budget validation, HTML escaping
- Dashboard pages: budget overview and startup detail views
- Unit tests for auth, cxo, dashboard, heartbeat routes
- PII masker, rate limiting, startup config modules

### Fixed
- Replaced `any` types with eslint-disable in test files
- Removed unused variables
- HTML escaping in notify module
