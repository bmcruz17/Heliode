-- ════════════════════════════════════════════════════════════════════
-- Heliode — buyer lead capture table (compute_leads)
-- Run this in the Heliode (ATMX Holdings) Supabase project:
--   pyosjuuvbxzyjtokfqfu   ← canonical Heliode project (atmxholdings@gmail.com)
--
-- NOTE: viinhpdufvtjxovdsrra is a DIFFERENT account's project (risenrecruit /
-- the Risen Grid venture). Heliode was deliberately separated from it — do
-- NOT point the lead form at viinhpdufvtjxovdsrra.
--
-- Idempotent: safe to run repeatedly. Adds current_spend if the table
-- already exists from an earlier setup.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.compute_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  company       text,
  email         text not null,
  city          text,
  current_spend text,
  workload      text,
  source        text
);

-- Ensure the "what you're paying now" column exists on pre-existing tables:
alter table public.compute_leads add column if not exists current_spend text;

alter table public.compute_leads enable row level security;

-- Anonymous visitors can submit a lead, but cannot read the table.
drop policy if exists "anon can insert leads" on public.compute_leads;
create policy "anon can insert leads"
  on public.compute_leads
  for insert
  to anon
  with check (true);
