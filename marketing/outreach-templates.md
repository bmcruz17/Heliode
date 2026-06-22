# Heliode outreach templates

Copy-paste starting points. **Personalize the first line every time** — generic
blasts get ignored and can hurt your domain. Keep it short, lead with their
number, make the ask tiny (just their bill).

---

## Outbound email

### A. Cold — founder/eng at an AI company (primary)
**Subject:** your inference bill

> Hi {first name} — saw {company} is shipping {product / model}, so you're
> almost certainly running steady inference.
>
> Most teams your size are paying 2–5× what GPU-hours actually cost on the open
> market for that. We source capacity on the open market and run it for you —
> one endpoint, one bill, real support — usually well under hyperscaler pricing.
>
> Want a real number? Reply with last month's GPU bill (or rough monthly
> spend) and I'll send back what the same workload runs on us. No call needed.
>
> — {your name}, Heliode · heliode.ai

### B. Cold — shorter variant
**Subject:** {company}'s GPU spend

> {first name} — quick one. Send me last month's GPU/inference bill and I'll
> send back what it'd cost on Heliode. If it's not lower, no pitch.
>
> We source GPU capacity on the open market and run it managed — cheaper
> GPU-hours, one bill, someone to call. — {your name}

### C. Warm follow-up to a calculator / quote lead
**Subject:** your Heliode estimate

> Thanks for running the numbers, {first name}. Based on what you entered
> (~${spend}/mo on {provider}), here's a real quote: **{$X}/mo** for the same
> workload — about **{$Y}/mo** saved.
>
> Easiest next step is to move a slice of your traffic over so you see the price
> and uptime for real — we stand up the endpoint, you don't touch a console.
> Want me to set it up?

### D. Re-engage a quiet lead (1–2 weeks later)
**Subject:** still want that quote?

> {first name} — still happy to price your inference workload whenever it's
> useful. Even a screenshot of last month's bill is enough to get you a number.
> No rush. — {your name}

**Email hygiene:** send from a real person's address, ≤30 personalized sends/day
to start, no images/links-only emails, and always give them an easy out.

---

## Community posts & replies

> Rule: **help first, sell second.** Lead with a useful answer; mention Heliode
> only if it's genuinely relevant, and disclose that it's yours.

### 1. Reply in a "how do I cut my inference cost" thread (Reddit/HN/Discord)
> A few things that usually move the needle most → least:
> 1. **Right-size the GPU** — a lot of inference doesn't need an H100; A10G/L4/
>    A100 often serve the same SLA for far less.
> 2. **Batch + use vLLM/TGI** — continuous batching can 2–4× throughput per GPU.
> 3. **Quantize** — fp8/int8/AWQ cuts memory so you fit on cheaper cards.
> 4. **Leave hyperscaler on-demand** — marketplace/neocloud (RunPod, Lambda,
>    Crusoe…) is often 50–80% cheaper for the same card.
>
> (Disclosure: I run Heliode — we do #4 as a managed service — but the first
> three will save you money no matter who you use.)

### 2. "Show / Tell" style post — the cost teardown
> **What inference actually costs in 2026 (and where the money goes)**
> Pulled together real per-GPU-hour numbers across hyperscaler on-demand vs.
> neoclouds vs. marketplace/spot, plus where a typical bill leaks. Sharing the
> breakdown + a quick savings calculator: {link to /inference-cost.html}
> Happy to answer cost questions in the comments.

### 3. Short value post (X / LinkedIn)
> If you're running production inference on AWS/GCP/Azure on-demand, you're
> likely paying 2–5× the open-market rate for the same GPUs.
> Quick check: {link to the savings calculator}. Send me your bill and I'll
> tell you exactly what you'd save.

### 4. Discord / Slack intro (AI/founder communities — only where self-promo is allowed)
> Hey all — I run Heliode, managed GPU compute for inference (we source on the
> open market and run it for you, one bill). Mostly here to help with
> cost/throughput questions — fire away. If anyone wants their current GPU bill
> priced out, DM me.

---

## The one habit that matters
**Reply to every inbound within 24h with an actual dollar number.** Speed + a
concrete "$X → $Y" beats everything else in the funnel.

---

## Pricing — onboarding fee (internal; not on the public site)

A one-time **onboarding fee** covers the migration/setup work we do for each
client (standing up the endpoint, integration, configuration).

- **Amount:** **$500–$3,000** per client — pick within the range by account size and
  integration complexity (smaller/simpler → ~$500; larger/custom → toward $3,000).
- **When to introduce it:** at **contract** — never at the quote stage. The
  quote stays free, no commitment. Bring up the fee only once they're ready to sign.
- **Credit-back:** the onboarding fee is **fully credited against a 6–12 month
  commitment** — i.e. commit to a 6–12 month term and the fee is waived/credited.
  This rewards commitment and reads like a discount while still filtering
  tire-kickers and offsetting acquisition cost.
- **Early cohort:** optionally waive entirely for the first few customers to
  build case studies, then make it standard.

**How to phrase it at contract:**
> Setup is a one-time **$[amount, $500–3,000]** onboarding fee — that covers us doing the full
> migration so your team doesn't. If you commit to a 6–12 month term, we credit
> that back in full, so the onboarding is effectively free.
