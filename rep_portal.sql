-- ════════════════════════════════════════════════════════════════════
-- Heliode — rep portal (Kanban pipeline + commissions) + dashboard invites
-- Run in the Heliode Supabase project (pyosjuuvbxzyjtokfqfu) AFTER
-- compute_leads.sql and lead_tracker.sql.
--
-- NEW: add reps from the admin dashboard by EMAIL (no UIDs). The rep then
-- signs up at /rep.html with that email and a trigger links their login
-- automatically. You never touch their password.
-- ════════════════════════════════════════════════════════════════════

-- ── Reps (keyed by id; user_id fills in when they sign up) ──────────
drop table if exists public.reps cascade;   -- safe: no rep data yet
create table public.reps (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references auth.users(id) on delete set null,  -- null until signup
  email        text not null unique,
  name         text,
  phone        text,
  override_pct numeric not null default 17.5,   -- % of monthly gross margin
  created_at   timestamptz not null default now()
);
alter table public.reps enable row level security;

-- Reps can read their own row; admins manage all (for the dashboard).
drop policy if exists "rep reads self"    on public.reps;
create policy "rep reads self"    on public.reps for select to authenticated using (user_id = auth.uid());
drop policy if exists "admins manage reps" on public.reps;
create policy "admins manage reps" on public.reps for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- is_rep(): true when the logged-in user is a linked rep.
create or replace function public.is_rep()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.reps where user_id = auth.uid());
$$;
grant execute on function public.is_rep() to authenticated;

-- When someone signs up, link them to their pre-created rep row by email.
create or replace function public.link_rep_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.reps set user_id = new.id
  where lower(email) = lower(new.email) and user_id is null;
  return new;
end; $$;
drop trigger if exists trg_link_rep on auth.users;
create trigger trg_link_rep after insert on auth.users
  for each row execute function public.link_rep_on_signup();

-- ── Rep / pipeline / commission columns on compute_leads ────────────
-- stage drives the Kanban: prospect → contacted → quoted → signed → onboarding → live (or lost)
alter table public.compute_leads add column if not exists rep_id         uuid references auth.users(id);
alter table public.compute_leads add column if not exists stage          text not null default 'prospect';
alter table public.compute_leads add column if not exists monthly_margin numeric;
alter table public.compute_leads add column if not exists onboarding_fee numeric;
alter table public.compute_leads add column if not exists feedback       text;

-- RLS: reps see & manage only their own accounts (admins keep full access).
drop policy if exists "reps read own"   on public.compute_leads;
create policy "reps read own"   on public.compute_leads for select to authenticated using (rep_id = auth.uid());
drop policy if exists "reps insert own" on public.compute_leads;
create policy "reps insert own" on public.compute_leads for insert to authenticated with check (rep_id = auth.uid());
drop policy if exists "reps update own" on public.compute_leads;
create policy "reps update own" on public.compute_leads for update to authenticated using (rep_id = auth.uid()) with check (rep_id = auth.uid());

-- ── HOW TO ADD A REP (the easy way) ─────────────────────────────────
--   1. Run this file once.
--   2. In /admin.html → Reps tab → enter their email, name, phone, override % → Add.
--   3. Send them /rep.html. They sign up with that email + their own password.
--      The trigger links them automatically; they're in. No UIDs, no SQL.
