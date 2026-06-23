# Heliode — Outreach (copy-ready)

Two motions every day: **supply** (cheap capacity to resell) and **demand** (teams to onboard).
Send from **brandon@heliode.ai** once DKIM is green; log replies in **Quotes** / **Leads** in the dashboard.
The live, copy-button version of this is at **/outreach.html** (linked from the dashboard).

---

# 1 · Hardware quotes — buy nodes (later)

For owned-node economics. The returned unit price is the real-world check on the ~$250K node assumption.
**Config:** 8× NVIDIA H100 SXM 80GB (also quote H200 141GB) · HGX 8-GPU baseboard, NVLink/NVSwitch ·
dual CPU · ~1–2TB RAM · ~15–30TB NVMe · 400G IB/Ethernet. Dell platform = PowerEdge XE9680.

## 1a. Dell — follow-up (warm; already inquired)

**Subject:** Following up — PowerEdge XE9680 quote (Heliode)

Hi [name / Dell team],

I submitted an inquiry recently and wanted to follow up directly. I'm Brandon Cruz, founder of
Heliode (heliode.ai) — we're standing up managed GPU capacity for AI inference and are speccing
our first deployment.

Could you put together a quote for a PowerEdge XE9680 with 8× NVIDIA H100 SXM (80GB) — and a parallel
option with 8× H200 (141GB)? Rough config: dual CPU, ~2TB RAM, ~15–30TB NVMe, 400G IB/Ethernet.

Specifically: unit pricing (H100 vs H200), volume pricing (one unit now, scaling), lead time,
warranty/ProSupport, and any Dell Financial Services leasing options.

Best reply address is brandon@heliode.ai. Happy to hop on a call.

Brandon Cruz · Founder, Heliode, Inc. · heliode.ai

## 1b. RFQ — Supermicro / Thinkmate / Exxact (competing quotes)

**Subject:** RFQ — 8×H100/H200 HGX server (Heliode)

Hi [vendor] team,

I'm Brandon Cruz, founder of Heliode (heliode.ai) — managed GPU capacity for AI inference.
Requesting a quote on an 8-GPU HGX server:

- GPUs: 8× NVIDIA H100 SXM 80GB (please also quote an H200 141GB option)
- Platform: HGX 8-GPU baseboard, NVLink/NVSwitch
- CPU: dual current-gen (Xeon or EPYC)
- Memory: ~1–2TB · Storage: ~15–30TB NVMe · Networking: 400G IB/Ethernet

Please include unit price (H100 & H200), volume/scaling pricing, lead time, warranty & support, and
financing options. Starting with one unit, scaling to multiple.

Reply to brandon@heliode.ai. Thanks!

Brandon Cruz · Founder, Heliode, Inc. · heliode.ai

---

# 2 · Supply / reseller — rent capacity to resell (now)

Lock in cheap, reliable capacity you mark up with management. This is what lets you onboard a customer
this month — no hardware needed.

## 2a. RunPod — volume / partner (start here)

**Subject:** Volume / reseller pricing — Heliode (managed GPU)

Hi RunPod team,

I'm Brandon Cruz, founder of Heliode (heliode.ai). We run managed GPU compute for AI inference teams
and source capacity on RunPod. We're scaling and want to talk volume / committed-use pricing and
whether you have a partner or reseller program.

Who's the right person for that? Reply to brandon@heliode.ai — thanks!

Brandon Cruz · Founder, Heliode, Inc.

## 2b. Neocloud reseller inquiry (Lambda · CoreWeave · Crusoe · Voltage Park · Hyperstack)

**Subject:** Reseller / partner pricing — Heliode

Hi [provider] partnerships team,

I'm Brandon Cruz, founder of Heliode (heliode.ai) — we deliver managed GPU compute to AI inference
teams and resell capacity from providers like you. I'm looking to lock in a reliable primary supply
partner.

Could you share:
- Reseller / partner pricing or committed-use discounts on H100 / H200 / L40S / A100
- Whether you support managed resellers (we wrap capacity in our own service + support)
- Minimums and lead time

We're signing customers now and want to route volume to the right partner. Best person to talk to?
brandon@heliode.ai.

Brandon Cruz · Founder, Heliode, Inc. · heliode.ai

---

# 3 · Customer outreach — demand

Inference-heavy seed–Series A teams already paying a GPU bill. The offer: "send me your current bill,
I'll quote it cheaper, managed." Quote-first, low friction.

## 3a. Cold — touch 1

**Subject:** Cutting your GPU bill (managed)

Hi [name],

Saw you're [running X in production / hiring ML engineers] — usually means a real GPU bill. We get AI
teams managed H100/H200 capacity under what they're paying now: one endpoint, one bill, we handle
uptime and support.

Worth a 15-minute look? If you tell me your rough monthly GPU spend and what you're running, I'll come
back with a real number — no commitment.

Brandon Cruz · Founder, Heliode · heliode.ai

## 3b. Follow-up — touch 2 (3–4 days later)

**Subject:** re: Cutting your GPU bill

Hi [name],

Following up — quick example of what this looks like: teams paying ~$8k/mo on hyperscaler on-demand
we've been able to quote closer to ~$5k managed for the same workload.

Share your current setup + monthly spend and I'll send you an apples-to-apples number this week. If
it's not clearly better, no hard feelings.

Brandon Cruz · Founder, Heliode · heliode.ai

## 3c. LinkedIn / X DM (short form)

Hey [name] — saw you're running [model/product]. We do managed GPU compute for inference teams,
usually under what you're paying now, fully run for you. Open to a quick look at what you'd save?
I'll bring a number.

---

**Where to find customers (and qualify)**
- Warm network first — fastest close. Anyone you know building with AI.
- Hiring signals — companies posting ML/inference/GPU roles (CUDA, vLLM, H100 in the JD) = real spend.
- Communities — r/LocalLLaMA, MLOps/LLM Discords & Slacks, Latent Space, indie hackers, YC networks.
- Metros — Austin, SF Bay, Seattle, Boston.
- Qualifier: "What are you spending on GPU compute a month, and where?" Fast answer = real prospect.

**Notes**
- Send once DKIM is authenticating so it lands in inbox, not spam.
- Hardware vendors (Dell, Supermicro, Thinkmate, Exxact) = quotes to *buy* nodes.
  Compute/marketplace (RunPod, Lambda, CoreWeave, Crusoe) = capacity to *rent / resell* now.

---

# 4 · Paid ads — Meta (QUEUED) — target: AI inference teams

**Reality check:** Meta can't target "ML engineer" / "AI founder" by job title (LinkedIn can).
For this niche B2B buyer Meta is the harder channel — run it, but lean on what Meta is good at
(retargeting, lookalikes, conversion optimization) and pair it with LinkedIn/X prospecting (§3),
which will likely beat Meta on cost-per-qualified-lead for this audience.

## Targeting (priority order)
1. **Retargeting** — install the Meta Pixel on heliode.ai; show ads to site / savings-calculator
   visitors who didn't request a quote. Highest intent.
2. **Lookalike** — upload your lead + customer list (even 50–100 emails) → 1% Lookalike.
3. **Interest stack** (cold) — PyTorch, TensorFlow, Hugging Face, NVIDIA, CUDA, AWS, Google Cloud,
   MLOps, AI, Y Combinator + behaviors (small-biz owners, tech early adopters). Keep broad.

## Setup
- Objective: Leads / Sales (conversion), optimize for a **Quote Request** event. Not "Boost".
- Funnel: ad → savings calculator / quote LP → form → lead in dashboard.
- Budget: ~$20–40/day × 7–10 days per audience; cut losers, scale winners.
- Creative: 3–4 variations; measure cost per quote request, then cost per closed customer.

## Ad copy — primary (pain-led)
**Headline:** Cut your GPU bill — managed
Paying too much for GPU compute? Heliode gets AI teams managed H100/H200 capacity under what
they're paying on hyperscalers — one endpoint, one bill, we handle uptime and support.
Send your current monthly spend and we'll quote the same workload for less. No commitment.
→ Get a quote at heliode.ai

## Ad copy — short / story
**Headline:** Your inference bill, cut
Running AI in production? Your GPU bill is probably your second-biggest cost. We manage H100/H200
capacity for teams at open-market rates — usually well under hyperscaler on-demand. One bill,
fully run for you. See what you'd save → heliode.ai

## Pre-launch checklist
- Install the Meta Pixel before launching (no pixel = no retargeting / no conversion optimization).
- Seed the lookalike from your dashboard lead export.
- One landing page, one action (quote/calculator).
- Run LinkedIn/X in parallel.
