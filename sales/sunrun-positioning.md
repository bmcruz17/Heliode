# Competitive positioning — Sunrun (and the distributed-energy + AI wave)

**Captured:** 2026-06-28 · For investor Q&A and the business-plan competitive section.

## The 10-second live answer (say this when asked "what about Sunrun?")
> "Sunrun just validated that distributed energy + AI is *the* megatrend — they announced one of
> the country's largest distributed-energy resources with Tesla and Renew Home. But they sell the
> **energy** layer (kilowatts, demand response). We sell the **compute** layer — the GPU-hours —
> which is an order of magnitude more valuable per site. Same tailwind, richer slice, and we start
> asset-light. We're not competing with them head-on; we'd happily run compute *on* resources like
> theirs."

## What Sunrun is actually doing
Sunrun + Renew Home + Tesla are building a **virtual power plant (VPP)** — aggregating already-installed
home solar + batteries to **free up grid capacity** so utilities can serve ~17 large data centers at peak.
They monetize **grid flexibility** (kW / demand response). The compute still runs in someone else's data center.

## How Heliode is positioned (the honest read)

### Where our model is genuinely better-positioned
- **Margin capture.** We earn $/GPU-hour, not $/kW of flexibility — an order of magnitude more revenue per site.
- **Interconnection dodge.** Co-locating on-site generation + battery + compute sidesteps the multi-year
  grid-interconnection queue — the #1 bottleneck for AI capacity. Sunrun's own "no interconnection" pitch
  proves this is the pain point.
- **Vertical integration.** Owning generation *and* compute at one site is a cleaner story than stitching
  three companies together.

### Where Sunrun is genuinely ahead (don't pretend otherwise)
- **Scale & balance sheet.** ~1M+ installed homes, public-company capital, install crews, utility
  relationships. Our distributed node network is, today, a concept.
- **Capital intensity.** They monetize assets they already installed; we'd build each node (~$250K hardware +
  400A upgrade + ~20kW solar + battery) from scratch. Far more capital per site.
- **Operational simplicity.** Their compute stays in hardened data centers; the homes only flex the grid —
  so they avoid the thermal / residential-ISP / data-residency / SLA problems that owned home-nodes create
  (the same risks we flag in our own objections section).

### Verdict
Our *positioning instinct* is better — compute is the richer slice of the same wave. But "better positioned
than Sunrun" is **not** true today on the metrics that matter (assets, capital, ops maturity). The credible,
winning framing is: **"Sunrun proves the megatrend; we attack the higher-margin compute layer, started lean."**

## How this maps to our plan
- **Phase 1 (now):** asset-light — resell + manage wholesale GPU capacity (RunPod). Low capital, proves
  pricing power and demand. Sunrun is irrelevant to this phase.
- **Phase 2 (later, capital-dependent):** owned, self-powered regional nodes (solar + battery + GPU) — the
  moat narrative. This is where the Sunrun comparison lives, as *validation*, not a head-to-head we win today.

## Partner angle (optional upside)
The same ITC §48E + bonus-depreciation tax stack we already model could apply to our owned nodes, and we
could position as a **compute offtaker** sitting on third-party DERs (including ones like Sunrun's) — turning
a "competitor" into a supply channel.

> Caution: do **not** claim "we beat Sunrun" in investor materials. Sophisticated investors will counter with
> the scale/capital gap and you'll lose credibility. Use them as proof of the trend; differentiate on the
> compute-margin + interconnection-dodge angle; be honest that owned nodes are a later phase.
