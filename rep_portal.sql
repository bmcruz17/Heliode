-- ════════════════════════════════════════════════════════════════════
-- Heliode — rep portal (Kanban pipeline + commissions for sales reps)
-- Run in the Heliode Supabase project (pyosjuuvbxzyjtokfqfu) AFTER
-- compute_leads.sql and lead_tracker.sql.
--
-- Gives each rep a login that shows ONLY their own accounts, moved through
-- a pre-install → post-install pipeline, with commission tracked per account.
-- Owner (admin) still sees everything in the lead tracker.
--
-- ── ONE-TIME SETUP per rep ──────────────────────────────────────────
--   1. Run this file once.
--   2. Supabase → Authentication → Users → Add user (rep's email + password).
--   3. Copy that user's UID, then run (set their override %):
--        insert into public.reps (user_id, name, email, override_pct)
--        values ('REP-UID', 'Carl', 'carl@email.com', 17.5);
--   4. Assign accounts to a rep by setting rep_id (or the rep self-adds them
--      in the portal). Example:
--        update public.compute_leads set rep_id = 'REP-UID' where id = '...';
--   5. Rep signs in at /rep.html.
-- ════════════════════════════════════════════════════════════════════

-- ── Reps allowlist ──────────────────────────────────────────────────
create table if not exists public.reps (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  name         text,
  email        text,
  override_pct numeric not null default 17.5,   -- % of monthly gross margin
  added_at     timestamptz not null default now()
);
alter table public.reps enable row level security;

drop policy if exists "rep reads self" on public.reps;
create policy "rep reads self" on public.reps
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_rep()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.reps where user_id = auth.uid());
$$;
grant execute on function public.is_rep() to authenticated;

-- ── Rep / pipeline / commission columns on compute_leads ────────────
-- stage drives the Kanban board (pre-install → post-install):
--   prospect → contacted → quoted → signed → onboarding → live   (or → lost)
alter table public.compute_leads add column if not exists rep_id         uuid references auth.users(id);
alter table public.compute_leads add column if not exists stage          text not null default 'prospect';
alter table public.compute_leads add column if not exists monthly_margin numeric;   -- $/mo gross margin on the account
alter table public.compute_leads add column if not exists onboarding_fee numeric;   -- $ collected at signing (rep's upfront)
alter table public.compute_leads add column if not exists feedback       text;      -- post-install customer feedback

-- ── Row-level security: reps see & manage ONLY their own accounts ───
-- (Admins keep full access via the is_admin() policies in lead_tracker.sql.)
drop policy if exists "reps read own" on public.compute_leads;
create policy "reps read own" on public.compute_leads
  for select to authenticated using (rep_id = auth.uid());

drop policy if exists "reps insert own" on public.compute_leads;
create policy "reps insert own" on public.compute_leads
  for insert to authenticated with check (rep_id = auth.uid());

drop policy if exists "reps update own" on public.compute_leads;
create policy "reps update own" on public.compute_leads
  for update to authenticated using (rep_id = auth.uid()) with check (rep_id = auth.uid());

-- Reps need to read their own rate; is_rep() + reps select policy cover it.
