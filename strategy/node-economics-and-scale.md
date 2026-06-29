# Node economics, scale & the home-host model

**Captured:** 2026-06-29 · Working analysis — **not tax/financial advice; confirm specifics with a CPA + energy attorney.** Rules changed materially in mid-2025 (OBBBA).

## 1. Dual market (hot pizza + frozen pizza) — yes, run both
- **Real-time tier** (near demand / the red hot spots): voice agents, live chat, agentic loops, live vision. Latency- and data-residency-sensitive → premium pricing.
- **Batch tier** (cheap-power / green zones): document processing, embeddings, overnight jobs. Location-flexible → price-driven.
- The same node serves both via **scheduling**: batch fills the idle troughs, real-time gets priority. Higher utilization = better unit economics. This is a real operational edge, and a clean story.

## 2. Tax credits — the honest picture
- **§48E commercial ITC = 30% base.** Systems **under 1 MW auto-qualify for the full 30%** with NO prevailing-wage/apprenticeship rules. A 25 kW home system is far under 1 MW, so **size is an advantage, not a limit** — exactly the answer to "are there size limitations."
- Stack **+10% domestic content** and **+10% energy community** → up to **~50%**. BUT: domestic-content thresholds are rising (45% → 55% for later construction), and energy-community status is **location-specific** (not every home qualifies). Plan **~30–40% base case, 50% best case.**
- Because **Heliode (the company) owns the system**, it claims the **commercial** credit — not the homeowner. The residential §25D credit **ended Dec 31, 2025**, which actually makes company/third-party ownership the *only* way to monetize the credit now. Good for our model.
- ⚠️ **Timing flag — the solar ITC is sunsetting fast.** Under OBBBA (signed Jul 4, 2025), solar must **begin construction by July 4, 2026** (or be placed in service by Dec 31, 2027) to get the ITC. Our owned nodes are a **2027+** phase, so the **full solar ITC is likely out of reach** for the build timeline. **Battery storage keeps the §48E credit through ~2034** (then phases down), and **bonus depreciation** still applies.
- **Net:** model the economics on **battery ITC + depreciation**, treat the **solar ITC as upside** only if we can start very early. Do NOT bank the headline 50% solar credit for a 2027 build.

## 3. Power economics — the core thesis + the caveat
- Power is the #1 operating cost of a GPU node; on-site solar offsets it → higher margin. **Thesis holds.**
- Reality check: a **25 kW array ≈ ~5 kW average continuous** (~125 kWh/day at ~5 sun-hours). One **8-GPU node draws ~10 kW** when running. So **25 kW solar offsets roughly half of one node's 24/7 power** (or fully powers it during daylight, with battery/grid covering nights). "Self-powered" = **"largely solar-offset," not "100% off-grid."** Size array/battery/node honestly.
- Self-generation pays back **fastest where grid power is most expensive** (Hawaii = priciest US power) — the highest-value markets for the solar model.

## 4. Scale math — what it takes to rival the giants
*Assume a home node = one 8-GPU server ≈ ~10 kW IT load.*
- **xAI Colossus 1** ≈ **250 MW / ~230k GPUs**. **Colossus 2** → **~1.2 GW**, heading toward **~1M GPUs / ~1.6 GW** (the first ~1 GW AI data center).
- **1 GW ≈ ~500k GPUs ≈ ~100,000 home-nodes.**
- **1 million homes ≈ ~10 GW** of nameplate capacity — roughly **10× a flagship 1 GW campus**, and in the league of an entire hyperscaler AI fleet.
- ⚠️ Caveat: solar intermittency means **nameplate ≠ 24/7 utilization** — effective always-on compute is lower unless grid-backed. "Bigger than AWS" is fuzzy (AWS is global, general-purpose); the defensible claim is **"hyperscaler-scale AI capacity / multiples of the largest single AI campus."**

## 5. Valuation at 1M homes — the number, with a giant asterisk
- Our model (~$7,600 net/node/mo × 8× annual net): 1M nodes → **~$91B/yr net → ~$730B implied value.**
- ⚠️ That's **top-10-company-on-earth** territory. Per-node economics will **not** hold linearly to 1M (compute deflates ~6%/yr; utilization, competition, power, and capital all bite). Treat **$730B as "the TAM is enormous," not a forecast.**

## 6. Capital — the binding constraint
- ~$250k node + ~$50–75k solar+battery ≈ **~$300k per home × 1M = ~$300 BILLION of capex.**
- This is the real limiter. It's **financed against 15-yr contracted revenue, built node-by-node** — a decade-plus buildout, not a Series-A line item. Frame it to investors exactly that way: prove Phase-1 brokerage → finance the first owned nodes behind signed contracts → scale the home network over years.

## 7. The home-host customer offer — strong hook, real ops
**Offer:** Heliode installs a 25 kW solar + battery system (company-owned); homeowner gets **backup power + a ~1% profit share of their node**; **12–15 yr** term; at end they **buy out at residual or renew** with new equipment.
- **Why it's good:** free solar + battery backup + income share is a compelling consumer pitch; company ownership captures the credits + depreciation; the long term locks the site.
- **Risks to design around (don't ignore):**
  - **Home sale / churn:** a 12–15 yr system + UCC lien complicates selling the house — a known Sunrun friction. Need a clean **transfer-to-new-owner** clause.
  - **Per-home interconnection, permitting, HOA, roof/structural** — friction that multiplies across a million homes.
  - **Residential ISP upload/bandwidth** — the recurring constraint for serving compute from a house.
  - **Heat / noise / fire-insurance** of a ~10 kW GPU node in a garage.
  - **Data security/residency** in a residential setting.
  - **Ops at scale:** a million relationships ≈ a Sunrun-sized workforce.
- **Optionality:** the 1% share is a smart alignment hook; future monetization (energy arbitrage, VPP/demand-response like Sunrun, equipment-refresh cycles) is real upside as the market evolves.

## Bottom line
The vision is genuinely huge and the instincts are right — **dual market, self-power, home-host.** Two things decide whether it's real: **capital** (~$300B for 1M homes, so it's incremental + debt-financed) and **the closing solar-ITC window** (lean on **battery ITC + depreciation**, not the headline 50% solar). Everything ladders from Phase-1 brokerage economics.

### Sources
- [IRS — Clean Electricity Investment Credit (§48E)](https://www.irs.gov/credits-deductions/clean-electricity-investment-credit)
- [Grant Thornton — Energy incentives under OBBBA](https://www.grantthornton.com/insights/alerts/tax/2025/insights/energy-incentives-under-obbba-what-you-need-to-know)
- [Kirkland & Ellis — OBBBA green-energy credit changes](https://www.kirkland.com/publications/kirkland-alert/2025/08/one-big-beautiful-bill-act-brings-big-changes-to-green-energy-tax-credits)
- [SemiAnalysis — xAI Colossus 2, first gigawatt datacenter](https://newsletter.semianalysis.com/p/xais-colossus-2-first-gigawatt-datacenter)
