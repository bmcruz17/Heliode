-- ════════════════════════════════════════════════════════════════════
-- Heliode — vendor pipeline (supply + hardware sourcing tracker)
-- Run in the Heliode Supabase project (pyosjuuvbxzyjtokfqfu) AFTER
-- lead_tracker.sql (it uses the is_admin() helper from that file).
--
-- Adds a Vendors tab to the admin dashboard so you can track each supplier
-- through: to_contact → contacted → in_discussion → quote → negotiating →
-- active → passed. Admin-only (same gate as leads).
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.vendors (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  category   text,                          -- neocloud / hardware / marketplace / integrator
  stage      text not null default 'to_contact',
  contact    text,                          -- person / email
  terms      text,                          -- quoted $/GPU-hr, lead time, min commit…
  notes      text
);

alter table public.vendors enable row level security;

drop policy if exists "admins manage vendors" on public.vendors;
create policy "admins manage vendors" on public.vendors
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Seed the vendors you've already engaged (idempotent — only inserts if absent)
insert into public.vendors (name, category, stage)
select v.name, v.category, v.stage from (values
  ('RunPod',     'marketplace', 'active'),        -- account live; can deliver
  ('Lambda',     'neocloud',    'contacted'),     -- partner inquiry sent
  ('CoreWeave',  'neocloud',    'contacted'),     -- contact form sent
  ('Crusoe',     'neocloud',    'contacted'),     -- inquiry sent
  ('Dell',       'hardware',    'in_discussion'), -- AI team following up
  ('Supermicro', 'hardware',    'to_contact'),
  ('Thinkmate',  'hardware',    'to_contact'),
  ('Exxact',     'hardware',    'to_contact')
) as v(name, category, stage)
where not exists (select 1 from public.vendors w where w.name = v.name);
