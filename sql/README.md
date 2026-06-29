# SQL to run — Heliode (Supabase)

Run these in **Supabase → SQL Editor**, in this order. Each file is **idempotent** (safe to re-run).
This is the single source of truth for what to run — keep it updated with every DB change.

| # | File | What it does | Run? |
|---|------|--------------|------|
| 1 | `sql/heliode_schema.sql` | Operator CRM: `heliode_clients`, `heliode_scheduled_emails`, `heliode_time_entries`, `heliode_settings`, `heliode_expenses`, the `heliode_is_team()` gate, RLS on all. | ⬜ |
| 2 | `sql/heliode_invites.sql` | Invite system: `heliode_team_members`, `heliode_invites`, upgraded `heliode_is_team()`, `heliode_redeem_invite()`, RLS, seeds you as admin. **Run after #1.** | ⬜ |
| 3 | Business-plan section (inline below) | Appends the "Competitive positioning — Sunrun" section to the DB-stored business plan. | ⬜ |

After running each, tick its box (⬜ → ✅) so you know what's done.

---

## #3 — Business-plan "Competitive positioning" section (append-only)
```sql
update public.private_docs
set content = content || '
<h3 style="font-family:''Space Grotesk'',sans-serif;margin-top:26px;">Competitive positioning — Sunrun &amp; the distributed-energy wave</h3>
<p>Sunrun (with Tesla and Renew Home) just announced one of the country&rsquo;s largest distributed-energy resources, aggregating installed home solar + batteries to free grid capacity for AI data centers. This <strong>validates the megatrend</strong> — distributed energy is becoming AI infrastructure.</p>
<p><strong>Heliode attacks a different, higher-value layer.</strong> Sunrun sells energy flexibility (kilowatts, demand response); we sell the <strong>compute itself</strong> (GPU-hours), which is an order of magnitude more valuable per site. Co-locating on-site generation + battery + compute also sidesteps the multi-year grid-interconnection queue — the #1 bottleneck for AI capacity, and the very pain their pitch highlights.</p>
<p><strong>Honest framing:</strong> Sunrun is far ahead on scale, capital, and operational maturity (~1M installed homes, public balance sheet). We do not compete head-on. Phase 1 is asset-light (reselling/managing wholesale GPU capacity); the owned, self-powered regional nodes are Phase 2 — where this comparison applies as validation, not a head-to-head. We could even act as a compute offtaker on third-party distributed-energy resources like theirs.</p>'
where slug = 'business-plan';
```
Undo (#3 only):
```sql
update public.private_docs
set content = regexp_replace(content, '<h3[^>]*>Competitive positioning — Sunrun.*$', '')
where slug = 'business-plan';
```

---

## How to run (every time)
1. Open your Supabase project → left sidebar → **SQL Editor** → **New query**.
2. Paste the file's contents (or the block above) → click **Run**.
3. Green "Success" = done. Then redeploy/refresh the relevant page if it reads from the DB.
