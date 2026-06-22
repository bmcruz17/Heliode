-- ════════════════════════════════════════════════════════════════════
-- Heliode — lead funnel tracking (extends compute_leads)
-- Run this in the Heliode (ATMX Holdings) Supabase project, AFTER
-- compute_leads.sql:
--   pyosjuuvbxzyjtokfqfu   ← canonical Heliode project (atmxholdings@gmail.com)
--
-- Adds the columns the admin dashboard (admin.html) uses to move a lead
-- through the funnel: status, quoted_amount, notes, contacted_at, updated_at.
--
-- Idempotent: safe to run repeatedly.
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

-- ── Funnel summary view (counts + pipeline value per stage) ─────────
create or replace view public.lead_funnel as
select
  status,
  count(*)            as leads,
  max(created_at)     as newest,
  max(updated_at)     as last_touched
from public.compute_leads
group by status;

-- ── Security ────────────────────────────────────────────────────────
-- RLS is unchanged: anonymous visitors may still ONLY insert a lead
-- (see compute_leads.sql) and cannot read the table. The admin dashboard
-- reads and updates with the project's service_role key, which bypasses
-- RLS. Do NOT grant the anon role SELECT/UPDATE on this table, and never
-- commit the service_role key — admin.html asks for it at runtime.
