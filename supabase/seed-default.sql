-- =============================================================
-- Co-op Lab 2.0 — Default Day-1 seed (ONE live revenue experiment)
-- Run in Supabase SQL Editor AFTER creating your account.
-- Replace <<YOUR_USER_ID>> with your auth.users UUID.
-- See docs/COOP_LAB_2.md.
-- =============================================================

-- ① Profile
insert into profiles (id, full_name, country_of_origin, current_country, languages, monthly_budget_usd, onboarding_complete)
values (
  '<<YOUR_USER_ID>>',
  'Operator',
  NULL,
  NULL,
  ARRAY['English'],
  500,
  true
)
on conflict (id) do update
  set onboarding_complete = excluded.onboarding_complete;

-- ② Token Budget
insert into token_budgets (user_id, total_usd, spent_usd)
values ('<<YOUR_USER_ID>>', 500.00, 0)
on conflict (user_id) do nothing;

-- ③ ONE live revenue experiment (Core: Human QA)
insert into startups (id, user_id, name, description, status, business_type, experiment_count, max_experiments)
values (
  'bbbbbbbb-0001-0001-0001-000000000001',
  '<<YOUR_USER_ID>>',
  'Human QA',
  'Sold human review / verification of AI or ops output. Co-op Lab 2.0 Day-1 live experiment. Demand → Sell → Deliver → Automate.',
  'active',
  'human_qa',
  0,
  10
)
on conflict (id) do nothing;

-- ④ Experiments for the live offer
insert into experiments (startup_id, hypothesis, metric, target_value, status)
values
  (
    'bbbbbbbb-0001-0001-0001-000000000001',
    'Book 1 paid discovery ($299) or first QA engagement within 14 days',
    'Time to First $1 (days)',
    '14',
    'running'
  ),
  (
    'bbbbbbbb-0001-0001-0001-000000000001',
    'Deliver 3 identical QA workflows → SOP draft ready',
    'Identical sold workflows completed',
    '3',
    'pending'
  ),
  (
    'bbbbbbbb-0001-0001-0001-000000000001',
    'Second paying customer (prefer external) with retention evidence',
    'Paying customers',
    '2',
    'pending'
  );

update startups set experiment_count = 3
where id = 'bbbbbbbb-0001-0001-0001-000000000001';

-- Parked hypotheses are notes only — do NOT insert additional active startups on Day 1.
