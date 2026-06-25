# Heliode — To-Do When I Return

_Snapshot saved 2026-06-25. Dell call (Drew) is tomorrow, 2026-06-26._

---

## 🔴 PRIORITY 1 — Add card to Apple Wallet so I can fund the account
Status: blocked — card won't add to Apple Wallet.

Most common fixes (try in this order):
1. **Activate the card first inside the bank's own app** (Atlas banking partner — Mercury or similar).
   New cards usually can't be added to Apple Wallet until they're activated in-app.
2. From **inside the bank app**, look for **"Add to Apple Wallet"** — adding it from the bank app
   succeeds far more often than adding it manually in the Wallet app.
3. If adding manually in Wallet: make sure the **name on card matches** your Apple ID name, and
   complete any **SMS/email verification code** the bank sends.
4. Confirm the issuer **supports Apple Pay** at all (a few business-debit issuers don't yet).

> ⚠️ Tell Claude **which bank/card** issued it (Mercury? Stripe-issued? other) and what error you see —
> then I can give the exact steps instead of the general ones. Also clarify what "deposit money through
> Apple Wallet" means (fund the business account vs. pay for ads/vendors) — the path differs.

---

## 🟠 PRIORITY 2 — Dell homework (before tomorrow's call with Drew)
Drew flagged my address as **residential**; he needs a **commercial Austin, TX ship-to** to build the quote.

- [ ] **Get a commercial Austin address** — virtual office / coworking / colo. Real street address I control,
      **NOT a PO box.** (Bonus: reusable for D-U-N-S / business credit later.)
- [ ] **Send Drew the email** (draft ready below — just drop in the address).
- [ ] Include the **Heliode one-liner** so his internal write-up is easy.

### ✉️ Dell email — ready to send (fill in the address)
```
To: Drew <drew@dell.com>            <-- confirm his real email
Subject: Heliode — commercial Austin ship-to + a few questions

Hi Drew,

Thanks again for flagging the address. Here's a commercial (non-residential)
ship-to in Austin for the quote:

  Heliode, Inc.
  [STREET ADDRESS], Suite [###]
  Austin, TX [ZIP]

A few things I'd love to cover on our call:

1. Lead times on the configs — especially H100/H200 SXM (the long pole).
2. Financing / leasing for a newly incorporated company building credit
   (DFS, lease-to-own, net terms).
3. Volume / ramp pricing as I scale across multiple nodes — can I lock rates as I ramp?
4. Multi-site staggered shipping, plus any rack / integration / deployment support.
5. Support & warranty tiers for production inference hardware
   (ProSupport, on-site, RMA turnaround).

And one line on us, for your internal discovery:

  Heliode is managed GPU compute for AI inference — H100/H200 capacity delivered as a
  single managed endpoint, so AI teams get cheaper, simpler inference than the
  hyperscalers. Near-term we resell and manage capacity; this build-out is our move
  toward owned, self-powered regional nodes — a virtual data center across multiple sites.

Talk tomorrow,
Brandon
Founder, Heliode · heliode.ai
```

### Questions for Drew on the call (same as packet §6)
1. Lead times — especially **H100/H200 SXM**.
2. **Financing/leasing** for a new company building credit.
3. **Volume/ramp pricing** — lock rates as I scale across nodes?
4. **Multi-site staggered shipping** + rack/integration/deployment support.
5. **Support & warranty tiers** (ProSupport, on-site, RMA turnaround).

---

## 🟡 PRIORITY 3 — Review the sales prep packet
- [ ] Open **`sales/monday-prep.html`** (print / save as PDF). ICP tiers, vocab, the 5-question
      discovery script, cold-email/DM templates, and the Monday-with-Zach (RunPod) prep sheet.
- [ ] ⚠️ **Note:** this file currently lives **only on branch `claude/homepage-rate-messaging-bp5rr6`,
      not on `main`.** Ask Claude to bring it onto `main` if you want it with everything else.

---

## 🟢 WEBSITE / MARKETING — wiring left to finish (give Claude these and I'll commit them)
Already live on `main`: AWS-alternative SEO + FAQ/Article schema, GA4 swapped to `G-S0N66S4EK5`,
Google Ads conversion hook in `quote.html`.

- [ ] **Stripe Customer Portal link** (`billing.stripe.com/p/login/…`) → I add a "Pay an invoice" page/footer link.
- [ ] **Meta Pixel ID** (15–16 digits from Events Manager) → I drop it into `quote.html`.
- [ ] **Google Ads:** either link GA4 → import the `generate_lead` conversion (no code),
      OR send me your `AW-…` ID + conversion label to paste into `quote.html`.
- [ ] In Stripe: **turn on ACH bank transfers** (0.8% capped at $5 vs 2.9%+30¢ on cards — huge on GPU-size invoices).
- [ ] Run the **`spot_cost` SQL** (from prior session) in Supabase.

---

## ⚪ ADMIN / FOUNDATION (don't let these slip)
- [ ] Finish **D-U-N-S number**; start building business credit (use EIN, pay vendors early).
- [ ] **Confirm 83(b) election filed by July 8, 2026.** ← hard deadline.

---

## 📅 MONDAY — RunPod call with Zach
- [ ] Bring the filled **§5 pipeline sheet** (real named accounts + dollar figures, not vaporware).
- [ ] Get H100/H200 on-demand rates + where committed-spend tiers start.
- [ ] Propose a **baseline monthly commit** I'm comfortable with.
- [ ] (Feed this week's discovery calls into that sheet first.)
