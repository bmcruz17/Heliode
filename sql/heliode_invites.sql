-- ============================================================
-- HELIODE invite system — team_members, invites, redemption fn
-- Run in the same Supabase project AFTER sql/heliode_schema.sql.
-- Safe to re-run (idempotent).
-- ============================================================

-- ---- who is on the team (founders/allowlist + redeemed invitees) ----
create table if not exists public.heliode_team_members (
  email      text primary key,
  role       text not null default 'rep',     -- 'rep' | 'admin'
  invited_by text,
  created_at timestamptz default now()
);

-- ---- invite codes ----
create table if not exists public.heliode_invites (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  email_lock  text,                            -- if set, only this email can redeem
  role        text not null default 'rep',
  note        text,
  expires_at  timestamptz,
  single_use  boolean not null default true,
  status      text not null default 'unused',  -- unused | redeemed | revoked
  redeemed_by text,
  redeemed_at timestamptz,
  created_by  text,
  created_at  timestamptz default now()
);
create index if not exists heliode_invites_status_idx on public.heliode_invites(status);

-- ---- team gate now ALSO honors heliode_team_members ----
create or replace function public.heliode_is_team()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (lower(auth.jwt() ->> 'email') like '%@heliode.ai')
    or (lower(auth.jwt() ->> 'email') = any (array['brandonmcruz@mac.com']))
    or exists (
      select 1 from public.heliode_team_members m
      where m.email = lower(auth.jwt() ->> 'email')
    ),
  false);
$$;
grant execute on function public.heliode_is_team() to anon, authenticated;

-- ---- redeem an invite (runs as definer so a brand-new, not-yet-team user can call it) ----
create or replace function public.heliode_redeem_invite(p_code text)
returns json
language plpgsql security definer set search_path = public
as $$
declare v public.heliode_invites; v_email text;
begin
  v_email := lower(auth.jwt() ->> 'email');
  if v_email is null then return json_build_object('ok', false, 'error', 'not signed in'); end if;

  select * into v from public.heliode_invites where code = upper(trim(p_code));
  if not found then return json_build_object('ok', false, 'error', 'invalid code'); end if;
  if v.status <> 'unused' then return json_build_object('ok', false, 'error', 'code already used or revoked'); end if;
  if v.expires_at is not null and v.expires_at < now() then return json_build_object('ok', false, 'error', 'code expired'); end if;
  if v.email_lock is not null and lower(v.email_lock) <> v_email then
    return json_build_object('ok', false, 'error', 'code is locked to a different email'); end if;

  insert into public.heliode_team_members(email, role, invited_by)
    values (v_email, coalesce(v.role, 'rep'), v.created_by)
    on conflict (email) do update set role = excluded.role;

  if v.single_use then
    update public.heliode_invites
      set status = 'redeemed', redeemed_by = v_email, redeemed_at = now()
      where id = v.id;
  else
    update public.heliode_invites set redeemed_by = v_email, redeemed_at = now() where id = v.id;
  end if;

  return json_build_object('ok', true, 'role', coalesce(v.role, 'rep'));
end;
$$;
grant execute on function public.heliode_redeem_invite(text) to anon, authenticated;

-- ============================================================
-- RLS
-- ============================================================
alter table public.heliode_team_members enable row level security;
alter table public.heliode_invites      enable row level security;

drop policy if exists team_read on public.heliode_team_members;
create policy team_read on public.heliode_team_members
  for select using (public.heliode_is_team());
-- (writes to heliode_team_members happen only via heliode_redeem_invite, which is SECURITY DEFINER)

drop policy if exists team_all on public.heliode_invites;
create policy team_all on public.heliode_invites
  for all using (public.heliode_is_team()) with check (public.heliode_is_team());

-- ---- OPTIONAL: seed yourself as an admin (founder is already allowed by email, but this
-- ---- makes the Invites tab + admin role explicit). Edit the email if needed.
insert into public.heliode_team_members(email, role)
  values ('brandonmcruz@mac.com', 'admin')
  on conflict (email) do update set role = 'admin';
