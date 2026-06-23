# Strategy note — "AI Home Brain" wedge (captured + pressure-tested)

**Status:** Captured for reference. NOT a product we're building. Pressure-tested below.
**Source:** Framework from a trusted advisor (June 2026).

## Decision — sticking with the original game plan
We are **not** pivoting to the "AI Home Brain" box. Heliode's thesis stands: managed GPU compute now
(asset-light brokerage) → owned, self-powered GPU nodes next. From the advisor's input we keep only the
on-thesis takeaways:
- **Warm channel (the one new, actionable takeaway we're folding in):** prioritize **existing solar +
  battery homeowners — especially the Sunrun installed base** — as node-host targets. They're
  pre-qualified, energy-forward, and faster to convert than a cold home.
- **Validates timing:** the home-as-external-inference-node is 3–5 years out → confirms our 2027+
  owned-node rollout.
- **Validates monetization:** the VPP / demand-response / energy-network layer is real and already in
  our model.
- **Validates the exit:** strategic acquisition by Tesla Energy / Sunrun / a utility.
What we are **not** taking: the box product, the $150–300/mo savings claim, and box-compute-rental.

---

## The proposal, in one line
Don't try to sell the "home GPU node for third-party AI inference" at the door yet (it's 3–5 years
from a clean close). Instead sell solar/Powerwall owners a small local **"AI Home Brain"** box
(~$1.5–2.5K + ~$49/mo) that optimizes their solar/battery, runs a private local AI assistant, adds
security + automation — and quietly builds an installed footprint that later becomes an energy +
compute network (VPP, demand response, distributed inference).

## What's right about it
- **The home-as-node-for-external-inference is genuinely 3–5 years out.** Confirms our realistic-timing
  reframe (owned compute nodes are a 2027+ story).
- **The solar/Powerwall base is the right channel.** Pre-qualified ($30K already spent), energy- and
  tech-forward, plugs into the Sunrun relationship. Warm door, lower CAC.
- **A 90-second, napkin-ROI doorstep product is what a D2D motion needs** — our managed-compute lead
  has no doorstep pitch. This gives the field team something to sell *today*.
- **"Install the box, then layer VPP + demand-response + compute on top" is our existing endgame.**
  The box is the beachhead that gets the footprint first; the exit logic (Tesla Energy / Sunrun /
  utility, 5–7 yrs) matches the stated acquisition thesis.

## What the numbers actually say (pressure-test)

### Savings claim: "$150–300/mo" is overstated. Real range is far lower.
Validated residential solar+battery time-of-use optimization savings:
- **ComEd (IL):** ~$200–300/yr → **~$17–25/mo**.
- **Typical Time-Based Control uplift:** ~$450–700/yr → **~$38–58/mo**.
- **California NEM 3.0, high TOU spread:** ~$730–876/yr → **~$67–73/mo** (the high end).

So a defensible headline range is roughly **$30–80/mo for most homes**, with CA/high-TOU outliers
nearer ~$75–100. The advisor's **$150–300/mo and "14-month payback" are not defensible** as written.

**Bigger catch:** Tesla Powerwall's **Time-Based Control already does TOU dispatch for free**, and
Span / Lunar / Emporia automate load-shifting too. So the *incremental* savings of our box **over the
free app** is smaller than the gross TOU number — for many homes only a slice of the $30–80. We cannot
sell "$180/mo we'll save you" honestly; we can sell a **validated per-home estimate** plus the bundle.

### Competition is real, funded, and crowded
- **Tesla** — free Time-Based Control in the app (the default our box must beat).
- **Lunar Energy** — raised **$232M**; AI-driven optimization + VPP software. Direct.
- **Span** — smart panel, circuit-level control + automated load shedding.
- **Emporia** — AI energy assistant, automatic device load-shifting, low cost.
→ A new $49/mo box needs a crisp answer to *"why pay, when my Powerwall already shifts load?"*
The honest differentiator is the **bundle** (private **local** AI assistant + security + automation),
not energy savings alone.

### Hardware / capability reality
- A Jetson-class box (~$400 BOM is plausible for an Orin Nano-class unit) runs **small** local models —
  fine for automation and a modest private assistant, **not** a ChatGPT replacement and **not** a
  serious inference node. Don't overpromise model capability.
- **"Rent the home boxes to AI inference companies"** is the weakest leg: consumer Jetson boxes on
  residential broadband are poor for paid inference (latency, reliability, upload bandwidth, security).
  Distributed networks (Exo, Petals, io.net) are real but early. **Serious compute belongs on our
  dedicated nodes** — which is exactly Heliode's existing model.

### Where the real money is
Not per-home savings, and not box-compute-rental. It's the **energy layer at scale**: aggregated data,
**demand response**, and **VPP** participation across an installed fleet — utilities pay for that
today. The box is a footprint play; energy-network monetization is the credible billion-dollar path,
and dedicated nodes carry the compute.

## Recommendation
Treat this as a **near-term wedge (Layer 1)** that funds/de-risks the compute thesis (Layer 2) — *if*
we build it. Before anything goes on a public page:
1. **Validate savings per metro/tariff** and publish a **conservative range + a per-home calculator**,
   not a hero number. (Likely public framing: "most solar homes leave **$30–80/mo** on the table.")
2. **Nail the differentiator vs. free incumbents** (Tesla TBC, Span, Lunar, Emporia) — the local-AI +
   automation + security bundle, and ideally a measurable optimization edge we can prove.
3. **Right-size the hardware story** — automation + private assistant, not "your home is a data center."
4. **Lead the long game with energy-network value** (VPP / demand response), not box-compute-rental.

## Open questions to resolve before build
- Real **incremental** savings of our optimizer *over* the free Powerwall app, per target metro.
- BOM + margin at $1.5–2.5K install + $49/mo (vs. ~$400 hardware + ~$15/mo to serve).
- Differentiation/defensibility vs. Lunar ($232M) and Tesla (free, default).
- Whether to build hardware or partner/white-label an existing edge box.

## Sources
- Tesla Powerwall Time-Based Control — https://www.tesla.com/support/energy/powerwall/mobile-app/time-based-control
- Powerwall savings (ComEd hourly) — https://certasun.com/powerwall-comed-hourly-pricing/
- TOU / NEM 3.0 battery savings — https://www.energysage.com/energy-storage/best-home-batteries/
- Lunar Energy $232M raise (AI VPP) — https://www.lunarenergy.com/blog/news/lunar-energy-raises-232-million-to-scale-home-battery-deployments-and-ai-powered-vpp-software-to-meet-surging-demand-for-affordable-electricity
- Emporia AI energy assistant — https://www.emporiaenergy.com/blog/meet-emporia-ai-energy-assistant/
- Span smart panel — https://www.energysage.com/energy-management/best-systems/
