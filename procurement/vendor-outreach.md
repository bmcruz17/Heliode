# Heliode — Vendor Outreach (hardware quotes)

Send from **brandon@heliode.ai** once DKIM is green. Targets the **H100/H200 flagship** node
(8-GPU HGX server, ~$250K planning number to ground-truth).

---

## 1. Dell — follow-up (warm; already inquired)

**Subject:** Following up — PowerEdge XE9680 quote (Heliode)

Hi [name / Dell team],

I submitted an inquiry recently and wanted to follow up directly. I'm Brandon Cruz, founder of
**Heliode** (heliode.ai) — we're standing up managed GPU capacity for AI inference and are speccing
our first deployment.

Could you put together a quote for a **PowerEdge XE9680** configured with **8× NVIDIA H100 SXM (80GB)** —
and a parallel option with **8× H200 (141GB)** so I can compare? Rough config: dual CPU, ~2TB RAM,
~15–30TB NVMe, and high-speed networking (400G IB/Ethernet).

Specifically I'd like:
- **Unit pricing** (H100 vs H200), and **volume pricing** — starting with one unit, scaling to multiple nodes.
- **Lead time** to ship.
- **Warranty / ProSupport** options.
- Any **Dell Financial Services** leasing/financing options (we'll finance hardware against contracts).

Best reply address is **brandon@heliode.ai**. Happy to hop on a call.

Brandon Cruz · Founder, Heliode (Heliode, Inc.) · heliode.ai

---

## 2. RFQ — Supermicro / Thinkmate / Exxact (competing quotes)

**Subject:** RFQ — 8×H100/H200 HGX server (Heliode)

Hi [vendor] team,

I'm Brandon Cruz, founder of **Heliode** (heliode.ai) — managed GPU capacity for AI inference.
I'm requesting a quote on an **8-GPU HGX server**:

- **GPUs:** 8× NVIDIA **H100 SXM 80GB** (please also quote an **H200 141GB** option)
- **Platform:** HGX 8-GPU baseboard, NVLink/NVSwitch
- **CPU:** dual current-gen (Xeon or EPYC)
- **Memory:** ~1–2TB
- **Storage:** ~15–30TB NVMe
- **Networking:** high-speed (400G InfiniBand or Ethernet)

Please include: **unit price (H100 & H200), volume/scaling pricing, lead time, warranty & support,
and any financing/leasing options.** Starting with one unit, scaling to multiple.

Reply to **brandon@heliode.ai**. Thanks!

Brandon Cruz · Founder, Heliode · heliode.ai

---

**Notes**
- Send once DKIM is authenticating so it lands in inbox, not spam.
- Hardware vendors (Dell, Supermicro, Thinkmate, Exxact) = quotes to *buy* nodes.
  Compute/marketplace (RunPod, Lambda, CoreWeave, Crusoe) = capacity to *rent* now — different track.
- The returned unit prices are the real-world check on the ~$250K node assumption in the model.
