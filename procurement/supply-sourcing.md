# Wholesale GPU supply — sourcing pack (Phase 1 brokerage)

This is the **revenue-now** engine: get cheap GPU capacity wholesale, resell it
managed. Separate from the hardware RFQ (that's Phase-2 *owned* nodes). Goal:
committed/reseller pricing you can mark up and still beat hyperscalers.

> The spread between what you source here and what you sell to clients **is the
> Phase-1 business.** Lock supply rates and demand in parallel.

---

## Outreach email (copy/paste)

**Subject:** Committed / reseller GPU pricing — aggregating inference demand

> Hi {name} — we run a managed GPU service for AI-inference teams and are
> aggregating demand across multiple customers. We want to place **committed
> capacity** with a few strong providers and resell it managed.
>
> Could you share: your **reserved/committed $/GPU-hr** for **H100, A100, and
> L40S**; **minimum commitment** (term + quantity); whether you have a
> **partner / reseller program**; and how fast we can **scale up/down**? Looking
> to start now. Thanks!
>
> — Brandon Cruz, Heliode · hello@heliodegrid.com

---

## Who to contact

**Marketplace / spot (cheapest, variable — good for burst/batch)**
- **Vast.ai**, **RunPod**, **TensorDock**

**Neoclouds (committed/reserved — your reliable base; ask for reseller terms)**
- **Lambda**, **CoreWeave**, **Crusoe**, **Together AI**, **Fluidstack**,
  **Nebius**, **Voltage Park**, **Hyperstack / NexGen Cloud**

**Hyperscaler savings plans (fallback / trust layer, worst margin)**
- AWS / GCP / Azure committed-use / savings plans

Start with **3–4 neoclouds** (they have sales teams and reseller programs) +
**RunPod/Vast** for cheap burst.

## What to lock from each
1. **$/GPU-hr** committed vs on-demand — H100, A100, L40S.
2. **Minimum commitment** — term length + min GPUs/hours.
3. **Reseller / partner program?** (margin + co-sell support)
4. **Scale flexibility** — ramp up/down terms, overage pricing.
5. **Reliability** — uptime SLA, region availability, pre-emption rules (spot).
6. **Onboarding speed** — how fast can we have capacity live for a customer?

## Supply bid table — fill in
| Provider | Type | H100 $/GPU-hr | Min commit | Reseller? | Scale terms | Uptime/SLA |
|---|---|---|---|---|---|---|
| | neocloud | | | | | |
| | marketplace | | | | | |
| | | | | | | |

## The margin check (why this matters)
Your sell price must beat the client's current bill **and** clear:
`source cost + ops + reliability buffer + your margin`.
- Easy win: clients overpaying hyperscaler on-demand (~$8–13/GPU-hr).
- Thin/no margin: clients already on raw marketplace (~$2–3/GPU-hr) — qualify those out.

Send me the committed rates as they come in and I'll sanity-check the spread
against the homepage savings calculator and the brokerage economics.
