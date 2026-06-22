-- ════════════════════════════════════════════════════════════════════
-- Heliode — lead funnel tracking + admin gate (extends compute_leads)
-- Run this in the Heliode (ATMX Holdings) Supabase project, AFTER
-- compute_leads.sql:
--   pyosjuuvbxzyjtokfqfu   ← canonical Heliode project (atmxholdings@gmail.com)
--
-- Adds the columns the admin dashboard (admin.html) uses to move a lead
-- through the funnel, plus an admin allowlist so ONLY you can read leads.
--
-- Idempotent: safe to run repeatedly.
--
-- ── ONE-TIME SETUP after running this file ──────────────────────────
--   1. Supabase dashboard → Authentication → Users → "Add user":
--      create yourself a login (email + password).
--   2. Copy that user's UID (the long id shown in the Users list).
--   3. Run, replacing the placeholders:
--        insert into public.admins (user_id, email)
--        values ('PASTE-YOUR-UID-HERE', 'you@heliodegrid.com');
--   4. Open /admin.html and sign in with that email + password.
-- ════════════════════════════════════════════════════════════════════

-- ── Funnel columns ──────────────────────────────────────────────────
-- status stages used by the dashboard:
--   new → contacted → quoted → trial → won   (or → lost at any point)
alter table public.compute_leads add column if not exists status        text not null default 'new';
alter table public.compute_leads add column if not exists quoted_amount text;
alter table public.compute_leads add column if not exists notes         text;
alter table public.compute_leads add column if not exists contacted_at  timestamptz;
alter table public.compute_leads add column if not exists updated_at    timestamptz not null default now();

-- ── Keep updated_at fresh on every edit ─────────────────────────────
create or replace function public.touch_compute_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_touch_compute_leads on public.compute_leads;
create trigger trg_touch_compute_leads
  before update on public.compute_leads
  for each row execute function public.touch_compute_leads_updated_at();

-- ── Admin allowlist ─────────────────────────────────────────────────
-- Only the user IDs listed here can read or manage leads.
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- (No anon/authenticated policies on admins: it is reachable only via the
--  is_admin() helper below, which runs with elevated rights. Manage rows
--  from the SQL editor / dashboard.)

-- is_admin(): true when the current logged-in user is on the allowlist.
-- SECURITY DEFINER so the check can read public.admins past its own RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

-- ── Row-level security on compute_leads ─────────────────────────────
-- Anonymous visitors keep insert-only access (the public lead form).
-- Logged-in admins — and only admins — can read and update leads.
drop policy if exists "admins read leads"   on public.compute_leads;
create policy "admins read leads"
  on public.compute_leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update leads" on public.compute_leads;
create policy "admins update leads"
  on public.compute_leads
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Funnel summary view (counts + recency per stage) ────────────────
create or replace view public.lead_funnel as
select
  status,
  count(*)        as leads,
  max(created_at) as newest,
  max(updated_at) as last_touched
from public.compute_leads
group by status;

-- NOTE: the admin dashboard now signs in with a normal email/password
-- (Supabase Auth) and reads leads through these policies. It NO LONGER
-- needs the service_role key — never put that key in client-side code.
