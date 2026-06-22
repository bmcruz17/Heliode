-- ════════════════════════════════════════════════════════════════════
-- HELIODE — ONE-SHOT SETUP
-- Run this entire file ONCE in the Heliode Supabase SQL editor
-- (project pyosjuuvbxzyjtokfqfu). It is idempotent — safe to re-run.
-- It builds: lead capture, the admin lead tracker, the rep portal, and the
-- vendor pipeline, and wires up your admin login + security.
--
-- AFTER running this:
--   • You (admin) can sign into /admin.html
--   • Add reps in /admin.html → Reps tab; they activate at /rep.html
--   • Vendors tab is pre-seeded with the suppliers you've contacted
-- ════════════════════════════════════════════════════════════════════


-- ░░ 1. LEADS TABLE (public contact form writes here) ░░░░░░░░░░░░░░░░░
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
alter table public.compute_leads add column if not exists current_spend text;
alter table public.compute_leads enable row level security;

drop policy if exists "anon can insert leads" on public.compute_leads;
create policy "anon can insert leads" on public.compute_leads
  for insert to anon with check (true);


-- ░░ 2. FUNNEL TRACKING + ADMIN GATE ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
alter table public.compute_leads add column if not exists status        text not null default 'new';
alter table public.compute_leads add column if not exists quoted_amount text;
alter table public.compute_leads add column if not exists notes         text;
alter table public.compute_leads add column if not exists contacted_at  timestamptz;
alter table public.compute_leads add column if not exists updated_at    timestamptz not null default now();

create or replace function public.touch_compute_leads_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists trg_touch_compute_leads on public.compute_leads;
create trigger trg_touch_compute_leads before update on public.compute_leads
  for each row execute function public.touch_compute_leads_updated_at();

-- Admin allowlist
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins read leads"   on public.compute_leads;
create policy "admins read leads"   on public.compute_leads for select to authenticated using (public.is_admin());
drop policy if exists "admins update leads" on public.compute_leads;
create policy "admins update leads" on public.compute_leads for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete leads" on public.compute_leads;
create policy "admins delete leads" on public.compute_leads for delete to authenticated using (public.is_admin());

create or replace view public.lead_funnel as
  select status, count(*) as leads, max(created_at) as newest, max(updated_at) as last_touched
  from public.compute_leads group by status;

-- Your admin login (UID for brandonmcruz@mac.com). Create the auth user first
-- in Authentication → Users if it doesn't exist, then this links it.
insert into public.admins (user_id, email)
values ('ada0f047-f5d1-4b38-aae8-919ec22da230', 'brandonmcruz@mac.com')
on conflict (user_id) do nothing;


-- ░░ 3. REP PORTAL (Kanban pipeline + commissions) ░░░░░░░░░░░░░░░░░░░
drop table if exists public.reps cascade;
create table public.reps (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references auth.users(id) on delete set null,
  email        text not null unique,
  name         text,
  phone        text,
  override_pct numeric not null default 17.5,
  created_at   timestamptz not null default now()
);
alter table public.reps enable row level security;
drop policy if exists "rep reads self"     on public.reps;
create policy "rep reads self"     on public.reps for select to authenticated using (user_id = auth.uid());
drop policy if exists "admins manage reps" on public.reps;
create policy "admins manage reps" on public.reps for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.is_rep()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.reps where user_id = auth.uid());
$$;
grant execute on function public.is_rep() to authenticated;

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

alter table public.compute_leads add column if not exists rep_id         uuid references auth.users(id);
alter table public.compute_leads add column if not exists stage          text not null default 'prospect';
alter table public.compute_leads add column if not exists monthly_margin numeric;
alter table public.compute_leads add column if not exists onboarding_fee numeric;
alter table public.compute_leads add column if not exists feedback       text;

drop policy if exists "reps read own"   on public.compute_leads;
create policy "reps read own"   on public.compute_leads for select to authenticated using (rep_id = auth.uid());
drop policy if exists "reps insert own" on public.compute_leads;
create policy "reps insert own" on public.compute_leads for insert to authenticated with check (rep_id = auth.uid());
drop policy if exists "reps update own" on public.compute_leads;
create policy "reps update own" on public.compute_leads for update to authenticated using (rep_id = auth.uid()) with check (rep_id = auth.uid());


-- ░░ 4. VENDOR PIPELINE (supply + hardware sourcing) ░░░░░░░░░░░░░░░░░
create table if not exists public.vendors (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  category   text,
  stage      text not null default 'to_contact',
  contact    text,
  terms      text,
  notes      text
);
alter table public.vendors enable row level security;
drop policy if exists "admins manage vendors" on public.vendors;
create policy "admins manage vendors" on public.vendors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.vendors (name, category, stage)
select v.name, v.category, v.stage from (values
  ('RunPod','marketplace','active'),
  ('Lambda','neocloud','contacted'),
  ('CoreWeave','neocloud','contacted'),
  ('Crusoe','neocloud','contacted'),
  ('Dell','hardware','in_discussion'),
  ('Supermicro','hardware','to_contact'),
  ('Thinkmate','hardware','to_contact'),
  ('Exxact','hardware','to_contact')
) as v(name,category,stage)
where not exists (select 1 from public.vendors w where w.name = v.name);


-- ░░ 4b. INVESTOR ACCESS (allowlist managed from the dashboard) ░░░░░░
create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique, name text, firm text,
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


-- ░░ 5. PROPOSAL TEXT FIXES (safe no-ops if already applied) ░░░░░░░░░
-- Node definition → 8-GPU server
update public.proposal set content = replace(
  replace(content,
    '<p><strong>Node</strong> — One deployed unit of our GPU hardware, running at a commercial / light-industrial site.</p>',
    '<p><strong>Node</strong> — One deployed 8-GPU server (~$250K all-in) running at a commercial / light-industrial site.</p>'),
  'the <strong>node</strong> — one deployed GPU unit running at a commercial site.',
  'the <strong>node</strong> — one deployed 8-GPU server (~$250K capex) running at a commercial site.')
where id = 1;

-- Raise / use-of-funds → onboarding-funded, pilot financed later
update public.proposal set content = replace(content,
  '<p>We''re raising <strong>$2.0M</strong> at the valuation you can model above to stand up our first owned Austin site and reach ~50 deployed nodes, with 12–18 months of runway.</p>
<p>Allocation: <strong>~50%</strong> first owned site (GPU hardware, electrical buildout, lease); <strong>~30%</strong> team &amp; 24/7 operations; <strong>~15%</strong> working capital to carry committed capacity ahead of revenue; <strong>~5%</strong> legal, setup &amp; contingency.</p>',
  '<p>We''re raising <strong>$2.0M</strong> (pre-seed, on a SAFE) to launch the managed brokerage, build the orchestration &amp; billing software, make the first key hires, and stand up a handful of proof nodes — with 12–18 months of runway.</p>
<p>Allocation: <strong>~35%</strong> team &amp; operations; <strong>~25%</strong> software &amp; brokerage launch; <strong>~25%</strong> proof nodes (a small owned cluster + site &amp; electrical); <strong>~15%</strong> working capital, legal &amp; contingency.</p>
<p>The full ~50-node Austin pilot is a larger, later raise sequenced <strong>behind signed customer offtake</strong> and financed mostly against those contracts (equipment/debt), so this round isn''t buying all the hardware up front.</p>')
where id = 1;

-- ░░ 6. FULL-VISIBILITY LOGINS (email-managed admin allowlist) ░░░░░░░░
-- Upgrade the admin allowlist so full-access logins can be created by
-- email from the dashboard (Team tab) and self-activate on first signup —
-- same pattern as reps/investors. In-place migration: no data loss, and
-- it does NOT drop the table or is_admin() (so dependent policies survive).
alter table public.admins add column if not exists id   uuid default gen_random_uuid();
alter table public.admins add column if not exists name text;
update public.admins set id = gen_random_uuid() where id is null;
alter table public.admins alter column id      set not null;
alter table public.admins alter column user_id drop not null;
alter table public.admins alter column email   set not null;

do $$
begin
  -- if the primary key is still on user_id (old schema), move it to id
  if exists (
    select 1 from pg_constraint con
    join pg_attribute a on a.attrelid = con.conrelid and a.attnum = any(con.conkey)
    where con.conrelid = 'public.admins'::regclass and con.contype = 'p' and a.attname = 'user_id'
  ) then
    alter table public.admins drop constraint admins_pkey;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.admins'::regclass and contype = 'p') then
    alter table public.admins add constraint admins_pkey primary key (id);
  end if;
end $$;

alter table public.admins drop constraint if exists admins_email_uniq;
alter table public.admins add  constraint admins_email_uniq unique (email);
alter table public.admins drop constraint if exists admins_user_id_uniq;
alter table public.admins add  constraint admins_user_id_uniq unique (user_id);

-- Admins can read & manage the allowlist (powers the Team tab)
drop policy if exists "admins read admins"   on public.admins;
create policy "admins read admins"   on public.admins for select to authenticated using (public.is_admin());
drop policy if exists "admins manage admins" on public.admins;
create policy "admins manage admins" on public.admins for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Link admins (as well as reps/investors) to their auth user on signup
create or replace function public.link_accounts_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.admins    set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  update public.reps      set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  update public.investors set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  return new;
end; $$;

-- Owner + any standing full-access logins (self-activate by setting a password)
insert into public.admins (email, user_id, name)
values ('brandonmcruz@mac.com', 'ada0f047-f5d1-4b38-aae8-919ec22da230', 'Brandon Cruz')
on conflict (email) do update set user_id = excluded.user_id;
insert into public.admins (email, name)
values ('debbie.nixon@heliodegrid.com', 'Debbie Nixon')
on conflict (email) do nothing;


-- ════════════════════════════════════════════════════════════════════
-- Done. Old per-file scripts (compute_leads.sql, lead_tracker.sql,
-- rep_portal.sql, vendors.sql) are now all captured here.
-- ════════════════════════════════════════════════════════════════════
