# Heliode Operator — setup & "paste this here" guide

The operator dashboard (lead-gen + CRM + AI outreach) for Heliode. Reuses the **existing
Supabase project**; runs server logic on **Cloudflare Pages Functions**. Your public marketing
site (GitHub Pages) is untouched.

```
dashboard.html          operator UI (login + pipeline + find leads + scoreboard)
report.html             client-facing AI performance report (editable, tap-to-expand KPIs)
sql/heliode_schema.sql  tables + RLS + heliode_is_team()
functions/api/*.js       Cloudflare Pages Functions (all server logic, keys server-side)
.github/workflows/heliode-scheduled-emails.yml   cron → sends due Gmail drafts every 20 min
```

---

## Step 1 — Supabase (run the SQL)
Open your existing project → **SQL Editor** → paste **all of `sql/heliode_schema.sql`** → Run.
Creates `heliode_clients`, `heliode_scheduled_emails`, `heliode_time_entries`,
`heliode_settings`, `heliode_expenses`, the `heliode_is_team()` gate, and RLS on every table.

**Add teammates:** edit the allowlist in two places — the `heliode_is_team()` array in the SQL,
and `TEAM_ALLOW` in `functions/api/_util.js` (and the inline check in `dashboard.html`'s `boot()`).
Any `@heliode.ai` email is allowed automatically.

> Get your **service role key**: Supabase → Project Settings → API → `service_role` (secret).
> It goes in Cloudflare only (Step 3), never in client code.

## Step 2 — Cloudflare Pages (deploy)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick this repo.
2. Build settings: **Framework preset = None**, **Build command = (blank)**,
   **Build output directory = `/`**. Cloudflare auto-detects `/functions`.
3. Deploy. You'll get `https://<project>.pages.dev` (optionally map `ops.heliode.ai`).
   - The dashboard is at `…/dashboard.html`; the report at `…/report.html`.

## Step 3 — Cloudflare secrets (Settings → Environment variables → **Production**, Encrypted)
Add each as an **encrypted** variable:

| Secret | Where to get it |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |
| `GOOGLE_PLACES_API_KEY` | Google Cloud → Places API (New). App restriction **None or IP**, NOT HTTP referrer |
| `SERPER_API_KEY` | serper.dev |
| `APIFY_TOKEN` | apify.com → Settings → Integrations |
| `GOOGLE_CLIENT_ID` | Step 4 (not secret, but set it here too) |
| `GOOGLE_CLIENT_SECRET` | Step 4 |
| `SCHED_SECRET` | invent a long random string (used by the cron) |

(Optional: `SUPABASE_URL` / `SUPABASE_ANON_KEY` if you ever move projects — defaults are baked in.)

After adding/changing secrets, **redeploy** (Deployments → Retry) so functions pick them up.

**Health check (no cost):** visit `https://<your-pages>/api/enrich?check=1` → JSON of which keys
are detected. All should read `true`.

## Step 4 — Google OAuth (for Gmail send + calendar)
1. Google Cloud Console → **APIs & Services** → enable **Gmail API** and **Calendar API**.
2. **OAuth consent screen**: External, add your team as test users (or publish).
3. **Credentials → Create OAuth client ID → Web application**.
   - **Authorized redirect URI:** `https://<your-pages-domain>/api/google-callback`
   - (Add `https://ops.heliode.ai/api/google-callback` too if you map the domain.)
4. Copy the **Client ID** and **Client secret** into the Cloudflare secrets (Step 3).
5. In the dashboard, each rep clicks **Connect Gmail** once → consents → their refresh token is
   stored (encrypted-at-rest in `heliode_settings`, only read server-side via the service key).

## Step 5 — GitHub Actions cron (auto-send scheduled emails)
Repo → **Settings → Secrets and variables → Actions** → add:
- `HELIODE_OPS_URL` = `https://<your-pages-domain>` (or `https://ops.heliode.ai`)
- `SCHED_SECRET` = the same value you set in Cloudflare

The workflow `heliode-scheduled-emails.yml` runs every 20 min, calls
`/api/run-scheduled`, and sends any drafts whose `send_at` has passed. Test it now:
Actions → **Heliode scheduled emails → Run workflow**.

## Step 6 — Smoke test
1. Open `dashboard.html` on the Cloudflare URL → **create password** with a `@heliode.ai` email → sign in.
2. **Find Leads** → pick an industry + city → **Search** (or **🎲 Roll the Dice**). Results are
   scored 🔥/⭐/•/· by inference-fit. **+ Pipeline** a few.
3. On a card: **📧 Enrich** → **🤖 Schedule AI email** → pick a time → it drafts in Gmail, queues
   the send, moves Lead→Contacted, sets a 48h follow-up.
4. Wait for the cron (or run it manually) → the draft sends at the chosen time.

---

## How the inference targeting differs (vs a web-design shop)
We hunt businesses **with** real volume and digital infrastructure (the opposite of "no website"):
- Prefer **has website** + **high review count** (proxy for support/interaction volume).
- Prefer **AI-amenable verticals** (legal, insurance, e-commerce, medical, logistics, high-call-volume
  home services, etc. — the preset + Roll-the-Dice pool in `_util.js`).
- **Opportunity score (0–100):** `+25 has_website, +reviews/400×35, +22 amenable vertical,
  +10 has_phone, +8 headcount≥20`. Tiers: 🔥85 / ⭐70 / •50 / ·<50.
- **Outreach angle:** never "you need a website" — instead "you're handling real volume; here's how
  AI inference takes the repetitive load off and captures revenue you're leaking," offering a free
  **AI Opportunity Audit**. Rules: no invented facts, no pricing, no ROI promises, signed "The Heliode Team".

## Security (non-negotiable)
- Service role + Anthropic + all provider keys live **only** in Cloudflare secrets. The browser only
  ever holds the Supabase **anon** key (RLS-gated).
- RLS gates every table to team members via `heliode_is_team()`.
- Every `/api/*` call verifies the caller's Supabase session and team membership server-side.
- Never guarantee specific ROI/outcomes in outreach; never publish fabricated testimonials.

## After any schema change
Re-run the relevant SQL in Supabase and tell your team. The SQL file is safe to re-run
(idempotent). Generated types aren't used (vanilla JS), so no codegen step.
