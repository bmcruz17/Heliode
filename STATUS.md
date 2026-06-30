# Heliode — Backlog & Status

**The single board for what's left to build.** Read this first at the start of a session.

**Last updated:** 2026-06-30

**Tags:** 🟢 `code` (doable autonomously) · 🟡 `decision` (needs Brandon's call) · 🔴 `setup` (needs keys/DNS/external config)

**Current state:** Static GitHub Pages site (`CNAME` → `heliode.ai`) backed by one Supabase project. The core funnel works in code: public lead form POSTs to `compute_leads`; rep portal, admin console, investor portal, and academy gate all use Supabase auth + RLS RPCs (`is_admin`/`is_rep`/`is_investor`). NDA gate generates a client-side PDF and best-effort emails a copy via the `send-nda` edge function. Biggest functional gap: the investor portal reads a `proposal` table **no SQL file creates**. Branding (orange `#f97316`) is consistent, but background/mute tokens diverge across pages. SEO/OG/favicon coverage is strong on `index`/`inference-cost`, absent on most other pages.

---

## 🟢 Ship now (code)
- [ ] **Create the `proposal` table — investor portal silently fails without it.** — `investors.html:468` reads `proposal`, and `SETUP.sql:180-189` updates it, but no `create table public.proposal` exists. Add table (id, content), seed row id=1, enable RLS + the investor-read policy `investors_access.sql:46-48` already stubs.
- [ ] **Normalize the `--bg` token site-wide.** — Half the pages use `#ffffff`, half `#f4f7fc`. On a rebrand branch the white/off-white split looks unintentional.
- [ ] **Unify `opportunity.html` CSS variable names** (`--text/--muted/--dim`) with the rest of the site (`--ink/--mute/--faint`).
- [ ] **Reconcile `--mute` shade** (`#525a66` in business-plan/academy vs `#555c66` elsewhere).
- [ ] **Add OG/Twitter cards to `investors`, `opportunity`, `business-plan`, `playbook`, `academy`** (several have zero). They get shared to investors/recruits; bare links look unfinished. `og.png` exists to reuse.
- [ ] **Add `<meta name="description">` to the 7 pages missing it** (esp. public `business-plan`, `teaser`).
- [ ] **Add the favicon link to `rep`, `join`, `opportunity`, `playbook`, `admin`** (`logo.svg`/`logo.png` exist).
- [ ] **Add `robots.txt` + `sitemap.xml`** — index marketing pages; disallow `admin`/`rep`/`academy`/`investors` so portal URLs aren't crawled.
- [ ] **De-duplicate `compute_leads` rep columns / RPCs across SQL files** — designate `SETUP.sql` as the single source of truth.
- [ ] **Link the orphaned marketing pages from `index.html`** (`teaser`, `opportunity`, `playbook`, `join`, `academy` are URL-only today).
- [ ] **Add a branded `404.html`** for GitHub Pages.

## 🟡 Needs a decision
- [ ] **Gate the public-but-sensitive pages?** (`business-plan`, `opportunity`, `playbook`, `teaser`) — they expose financial model + entity structure with no auth gate. Decide public vs NDA-gated vs `noindex` (drives robots.txt + OG decisions).
- [ ] **Confirm `hello@heliode.ai` is a monitored inbox** — it's the lead-form fallback + the join/teaser mailto target.
- [ ] **Define the NDA exemption list** (`nda.js` `opts.exempt`) so you/counsel/signed investors skip the modal.
- [ ] **Confirm rep default `override_pct = 17.5%`** (`rep_portal.sql:19`) before onboarding reps against live data.
- [ ] **Resolve `heliodegrid.com` vs `heliode.ai`** — `send-nda` suggests `nda@heliodegrid.com` but the live domain is `heliode.ai`. Pick one sending domain.
- [ ] **Add rate-limit / captcha to the public lead form** — `compute_leads` has an open anon-insert policy + the anon key is in client JS (spammable).

## 🔴 Needs setup (you, in a browser)
- [ ] **Provision Resend + deploy `send-nda`** — NDA copies don't email until `RESEND_API_KEY` is set (`send-nda/index.ts:38`); signers silently never get their PDF. Add a `supabase/config.toml` to pin function config.
- [ ] **Verify a Resend sending domain + set `NDA_FROM`** — else NDAs send from `onboarding@resend.dev` (spam).
- [ ] **Extend GA (`G-1YHMWE0BG6`) to the pages sent to investors/recruits** (`teaser`, `opportunity`, `business-plan`, `join` have no analytics) — and confirm the property ID is Heliode's.
- [ ] **Verify canonical/OG absolute URLs resolve on live `heliode.ai`.**
- [ ] **Lock RLS on the new `proposal` table at deploy time** — `investors_access.sql:44` warns: confirm no broad read policy, or the confidential proposal is world-readable via the anon key.

## 💡 Backlog / ideas
- [ ] Persist `lead-finder.yml` output to Supabase/an issue (today it's ephemeral step-summary only). · Standardize the `compute_leads.source` taxonomy for clean admin funnel filtering.
