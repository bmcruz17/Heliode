-- ============================================================
-- HELIODE Operator CRM — schema + RLS
-- Run this in the existing Supabase project (SQL editor).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

-- ---- team gate -------------------------------------------------
-- Allows any @heliode.ai email plus the explicit allowlist below.
-- Edit the allowlist array to add teammates.
create or replace function public.heliode_is_team()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (lower(auth.jwt() ->> 'email') like '%@heliode.ai')
    or (lower(auth.jwt() ->> 'email') = any (array[
         'brandonmcruz@mac.com'
       ])),
  false);
$$;

-- ---- clients (CRM pipeline) -----------------------------------
create table if not exists public.heliode_clients (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  contact_name  text,
  email         text,
  phone         text,
  address       text,
  website       text,
  description   text,
  stage         text not null default 'Lead',     -- Lead|Contacted|Qualified|Pilot|Deployed|Retainer|Archived
  owner         text,                              -- rep display name
  acquired_by   text,
  deal_value    numeric default 0,
  monthly_value numeric default 0,
  industry      text,
  reviews       int default 0,
  rating        numeric,
  opportunity   int default 0,                     -- 0..100 inference-fit score
  services      jsonb default '[]'::jsonb,
  firmographics jsonb default '{}'::jsonb,         -- headcount/category/about from deep scrape
  notes         text,
  follow_up     date,
  activities    jsonb default '[]'::jsonb,         -- [{at, type, text}]
  place_id      text,                              -- google places id (dedupe)
  ga4_property_id      text,
  search_console_site  text,
  created_at    timestamptz default now(),
  sort_order    int default 0
);
create index if not exists heliode_clients_stage_idx on public.heliode_clients(stage);
create index if not exists heliode_clients_owner_idx on public.heliode_clients(owner);
create unique index if not exists heliode_clients_place_uidx
  on public.heliode_clients(place_id) where place_id is not null;

-- ---- scheduled emails (Gmail send queue) ----------------------
create table if not exists public.heliode_scheduled_emails (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid references public.heliode_clients(id) on delete cascade,
  sender_email text not null,
  to_email     text not null,
  subject      text,
  draft_id     text,                 -- Gmail draft id
  send_at      timestamptz not null,
  status       text not null default 'queued',  -- queued|sent|error|canceled
  sent_at      timestamptz,
  error        text,
  created_at   timestamptz default now()
);
create index if not exists heliode_sched_due_idx
  on public.heliode_scheduled_emails(status, send_at);

-- ---- time entries (clock in/out) ------------------------------
create table if not exists public.heliode_time_entries (
  id        uuid primary key default gen_random_uuid(),
  person    text,
  email     text,
  clock_in  timestamptz default now(),
  clock_out timestamptz
);

-- ---- settings (oauth tokens, misc kv) -------------------------
-- Holds Google OAuth refresh tokens per sender_email and any app config.
create table if not exists public.heliode_settings (
  key        text primary key,        -- e.g. 'gtoken:rep@heliode.ai'
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ---- expenses (optional, for scoreboard P&L) ------------------
create table if not exists public.heliode_expenses (
  id         uuid primary key default gen_random_uuid(),
  label      text,
  amount     numeric default 0,
  spent_on   date default current_date,
  owner      text,
  created_at timestamptz default now()
);

-- ============================================================
-- RLS — every table gated to team members
-- ============================================================
alter table public.heliode_clients          enable row level security;
alter table public.heliode_scheduled_emails enable row level security;
alter table public.heliode_time_entries     enable row level security;
alter table public.heliode_settings         enable row level security;
alter table public.heliode_expenses         enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'heliode_clients','heliode_scheduled_emails','heliode_time_entries',
    'heliode_settings','heliode_expenses'
  ] loop
    execute format('drop policy if exists team_all on public.%I;', t);
    execute format(
      'create policy team_all on public.%I
         for all
         using (public.heliode_is_team())
         with check (public.heliode_is_team());', t);
  end loop;
end $$;

-- NOTE: heliode_settings stores OAuth refresh tokens. The client never reads
-- token values directly for sending — the edge functions use the SERVICE ROLE
-- key (which bypasses RLS) server-side. RLS above still protects it from the
-- anon/client key. Keep the service role key in Cloudflare secrets only.
