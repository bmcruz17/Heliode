-- ════════════════════════════════════════════════════════════════════
-- Heliode — investor access (allowlist managed from the admin dashboard)
-- Run AFTER SETUP.sql. Adds an investors allowlist + is_investor(), and a
-- signup trigger that links reps AND investors by email.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.investors (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users(id) on delete set null,  -- null until signup
  email      text not null unique,
  name       text,
  firm       text,
  created_at timestamptz not null default now()
);
alter table public.investors enable row level security;

drop policy if exists "investor reads self"     on public.investors;
create policy "investor reads self"     on public.investors for select to authenticated using (user_id = auth.uid());
drop policy if exists "admins manage investors" on public.investors;
create policy "admins manage investors" on public.investors for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.is_investor()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.investors where user_id = auth.uid());
$$;
grant execute on function public.is_investor() to authenticated;

-- One signup trigger links BOTH reps and investors by email.
create or replace function public.link_accounts_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.reps      set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  update public.investors set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  return new;
end; $$;
drop trigger if exists trg_link_rep      on auth.users;
drop trigger if exists trg_link_accounts on auth.users;
create trigger trg_link_accounts after insert on auth.users
  for each row execute function public.link_accounts_on_signup();

-- ── OPTIONAL hardening (run once you've added your current investors) ──
-- Locks the proposal so only allowlisted investors + admins can read it.
-- Only run this AFTER existing investors are in public.investors, or they'll
-- lose access. Confirm there's no broad read policy on public.proposal first.
--
--   alter table public.proposal enable row level security;
--   drop policy if exists "investors read proposal" on public.proposal;
--   create policy "investors read proposal" on public.proposal
--     for select to authenticated using (public.is_investor() or public.is_admin());
