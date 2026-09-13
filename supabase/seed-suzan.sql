-- =============================================================
-- Suzan (suzan.attallah@roboco-op.org) — Seed Data
-- Co-op Lab 2.0: ONE live experiment active; other two PAUSED (parked
-- compatibility rows for existing UUIDs / Mission Control history).
-- Run AFTER creating your account. Replace <<YOUR_USER_ID>>.
-- For a clean Day-1 operator seed, prefer supabase/seed-default.sql.
-- =============================================================

-- ① Profile
insert into profiles (id, full_name, country_of_origin, current_country, languages, monthly_budget_usd, onboarding_complete)
values (
  '<<YOUR_USER_ID>>',
  'Suzan Attallah',
  'Egypt',
  'Egypt',
  ARRAY['Arabic', 'English'],
  500,
  true
)
on conflict (id) do update
  set full_name = excluded.full_name,
      languages = excluded.languages,
      onboarding_complete = excluded.onboarding_complete;

-- ② Token Budget
insert into token_budgets (user_id, total_usd, spent_usd)
values ('<<YOUR_USER_ID>>', 500.00, 0)
on conflict (user_id) do nothing;

-- ③ Startups — 1 live (active) + 2 parked (paused) for ID compatibility
insert into startups (id, user_id, name, description, status, business_type, experiment_count, max_experiments)
values
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    '<<YOUR_USER_ID>>',
    'Patent Mining Spain',
    'LIVE revenue experiment (legacy physical_product). Find expired USPTO patents → Alibaba → Amazon.es FBA. Prefer migrating Day-1 operators to Core offers via seed-default.sql.',
    'active',
    'physical_product',
    0,
    10
  ),
  (
    'aaaaaaaa-0002-0002-0002-000000000002',
    '<<YOUR_USER_ID>>',
    'DigitalSouq',
    'PARKED hypothesis — digital product storefront. Not run in parallel on Day 1 (Co-op Lab 2.0).',
    'paused',
    'digital_product',
    0,
    10
  ),
  (
    'aaaaaaaa-0003-0003-0003-000000000003',
    '<<YOUR_USER_ID>>',
    'AI Sales Buddy',
    'PARKED hypothesis — SaaS widget. Not run in parallel on Day 1 (Co-op Lab 2.0).',
    'paused',
    'saas',
    0,
    10
  )
on conflict (id) do update
  set status = excluded.status,
      description = excluded.description;

-- ④ Experiments — live experiment only (Patent Mining Spain)
insert into experiments (startup_id, hypothesis, metric, target_value, status)
values
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    'USPTO scraper returns 50+ scoreable patents in kitchen/garden/pet categories within the first run',
    'Patents fetched with complete data',
    '50',
    'running'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    'Claude scoring identifies 3+ products with score ≥ 7 from the first patent batch',
    'Patents with score ≥ 7',
    '3',
    'pending'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    'Alibaba supplier found for top-scored product at < €2/unit with MOQ ≤ 1,000 units',
    'Supplier quotes received',
    '3',
    'pending'
  );

-- Parked startups: no active experiment inserts (hypotheses stay notes-only).

update startups set experiment_count = 3 where id = 'aaaaaaaa-0001-0001-0001-000000000001';
update startups set experiment_count = 0 where id in (
  'aaaaaaaa-0002-0002-0002-000000000002',
  'aaaaaaaa-0003-0003-0003-000000000003'
);
