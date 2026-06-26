# Heliode — Daily Status Tracker

> **Source of truth** for where the project stands. The Claude routine reads this each night
> (~1:07am local), rolls tasks forward, updates dates/deadlines, appends to the Daily Log, and
> commits. When you start a day, read **Today's Top 3** + **Deadlines**.

**Last updated:** 2026-06-25 (manual seed) · **Maintained by:** nightly Claude routine + Brandon

Related docs: `sales/return-todo.md` (detailed to-dos + drafts) · `sales/investor-one-pager.html` ·
`sales/monday-prep.html` (on branch `claude/homepage-rate-messaging-bp5rr6`)

---

## 🎯 Today's Top 3
1. **Dell call with Drew (tomorrow) — send the ship-to email first.** Reserve a WorkHub Pflugerville suite to get the exact address/suite, then send the drafted email (`sales/return-todo.md`).
2. **Fix Apple Wallet card** so you can fund the account (activate card in the bank app first).
3. **Fill the `[ ]` traction/bio fields in the investor one-pager** so it's ready for Hinze.

---

## ⏰ Deadlines & key dates
| Date | What | Status |
|---|---|---|
| **2026-06-26 (Fri)** | Dell call with Drew — bring the 5 questions; send ship-to email beforehand | 🔴 imminent |
| **2026-06-29 (Mon)** | RunPod call with Zach — walk in with filled pipeline sheet (real accounts/$$) | 🟠 this week |
| **2026-07-08 (Wed)** | **83(b) election filing deadline — HARD, do not miss** | 🔴 critical |
| ongoing | D-U-N-S number + start building business credit | 🟡 open |

---

## 🔴 Active / In progress (by workstream)

### 💰 Fundraising — SAFE ($2.5M, $10M post cap, 20% discount)
- Board approved up to $10M SAFE authorization in Atlas. ✅
- Path: **Reg D 506(b)** — accredited angels + wealthy friends/family. **No public FB/IG solicitation.**
- Warm lead: **Hinze Capital** (old manager's brother) — target first/lead check.
- [ ] Fill traction/bio brackets in `sales/investor-one-pager.html`.
- [ ] Draft warm-intro message (old manager → Hinze) + follow-up note. ← Claude can do next.
- [ ] Anchor a final cap with the Atlas attorney before sending SAFEs.

### 📞 Sales & customers (the real work)
- ICP: teams spending **$5–50k/mo** on AWS/GCP/Azure GPUs. Script + templates in `monday-prep.html`.
- [ ] Send 10–20 cold emails / LinkedIn DMs to AWS-overspenders this week.
- [ ] Run discovery calls; log each into the §5 pipeline table.
- [ ] Walk into Monday with 2–3 named, qualified accounts.

### 🔌 Supply — RunPod (Monday call w/ Zach, 6/29)
- Intel: RunPod raised **$100M @ $1B (Jun 24)**, ~$240M ARR, 1M+ devs, turned down $500M buyouts, compute crunch → leverage on their side, but they want distribution. Brief: `sales/runpod-research.md`.
- [ ] **Lead with the ramp proposal:** discounted (committed-tier) pricing from day one + on-demand flexibility; **30 days to hit quota** to keep the discount; **true-up if I miss** (back-pay the difference) so they risk nothing.
- [ ] Pin down **reseller vs. affiliate** — can I buy wholesale & resell at my own price/SLA? (decides margin model)
- [ ] Get H100/H200 rates, committed-tier start point, capacity guarantee; mention Startup Program ($50K→$75K).
- [ ] Confirm Zach can authorize terms vs. routing through RevOps/COO.

### 🖥️ Hardware / Dell
- Drew (Dell) flagged address as residential; needs commercial **Austin** ship-to to quote.
- [ ] Reserve WorkHub Pflugerville suite → get exact address/suite + confirm 3-phase amps.
- [ ] Send Drew the ship-to email + 5 questions + Heliode one-liner.
- [ ] On call: capture config, lead times (H100/H200 SXM), financing path.

### 🏢 Office / real estate (prototype node + HQ)
- Target: **WorkHub Pflugerville**, 19241 Wilke Ln, Pflugerville TX 78660 (Austin metro, 3-phase + fiber).
- (Avoid: the Magnolia unit — that's Houston, 5-yr lease.)
- [ ] Call (832) 521-5404 to reserve a suite; ask for month-to-month flex term for the prototype.
- [ ] Confirm electrical service (amps/voltage), cooling allowance, landlord OK on node heat load.

### 💳 Payments / Stripe
- Bank account set up via Atlas. ✅ Model decided: **custom invoices, Stripe-hosted** (no site code).
- [ ] **Fix Apple Wallet card** (priority) — activate in bank app, then Add to Wallet from that app.
- [ ] Turn ON **ACH bank transfers** in Stripe (0.8% capped $5 vs 2.9%+30¢ — huge on GPU invoices).
- [ ] Set up Invoicing branding + Customer Portal → send Claude the portal link to add "Pay" page.

### 📈 Marketing / SEO / site
- LIVE on main: AWS-alternative homepage SEO, FAQ/Article schema, GA4 = `G-S0N66S4EK5`, Ads conversion hook in `quote.html`. ✅
- [ ] Build Google Ads search campaign (keywords/ad copy ready in `sales/return-todo.md`).
- [ ] Send Claude the **Meta Pixel ID** (15–16 digits) → wire into `quote.html`.
- [ ] Link GA4 → Google Ads and import `generate_lead`, OR send `AW-…` id + label.

### 🏛️ Admin / legal / foundation
- [ ] **File 83(b) by July 8** (hard deadline).
- [ ] Finish D-U-N-S; start business credit (use EIN, pay vendors early).
- [ ] Run the `spot_cost` SQL in Supabase.

### 👥 Hiring (post-raise)
- Plan: 5–6 founding crew (eng, ops, sales). Ramp with traction to extend runway.

---

## ⏳ Waiting on / blocked
- Exact WorkHub Pflugerville suite # (need to reserve) → blocks final Dell ship-to.
- Stripe Customer Portal link, Meta Pixel ID, Google Ads AW id+label → blocks Claude wiring them in.
- Hinze intro path via old manager.

---

## ✅ Recently completed
- 2026-06-25: Homepage → "AWS alternative" SEO + schema live; GA4 swapped; Ads hook added.
- 2026-06-25: Investor one-pager created; SAFE terms anchored ($2.5M / $10M cap / 20%).
- 2026-06-25: Return-to-do list + Dell email draft (Austin address) committed.
- Earlier: Atlas incorporation, bank account, board SAFE authorization.

---

## 📝 Daily log
### 2026-06-25
- Seeded this tracker. SEO/marketing shipped to main. Investor one-pager built. Dell email drafted
  with WorkHub Pflugerville (Austin) address after catching the linked unit was in Houston.
- Decisions: SAFE via 506(b) (no public ads); office = WorkHub Pflugerville; payments = Stripe-hosted invoices.
- Open for tomorrow: send Dell email, fix Apple Wallet, fill one-pager brackets.
