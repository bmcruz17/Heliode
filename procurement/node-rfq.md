# Node hardware — RFQ (request for quote) pack

Send the same spec to every vendor so bids are comparable. Ask each to quote
**both** configs and fill in the BOM table. Goal: a real per-node cost to plug
into the economics (replaces the ~$250K estimate).

> Tell vendors you're sourcing for an AI-inference deployment and will buy in
> volume (50+ units over time) — it gets you better pricing and attention.

---

## Cover email (copy/paste)

**Subject:** RFQ — GPU inference servers (volume)

> Hi {name} — we're sourcing GPU servers for an AI-inference deployment and
> lining up vendors for an initial pilot (target ~50 units, phased), with more
> to follow. Could you quote the two configurations below?
>
> Please include: all-in price per unit, per-GPU pricing, lead time/availability,
> warranty & support, power draw and input requirements, rack height/weight, and
> volume pricing at 1 / 5 / 10 / 50 units. Financing or lease-to-own options
> welcome. Spec sheet attached/below. Thanks!
>
> — Brandon Cruz, Heliode · hello@heliodegrid.com

---

## Config A — flagship inference node (8× H100/H200)
| Component | Spec to quote |
|---|---|
| GPUs | 8× NVIDIA H100 80GB **SXM5** (also quote H200 141GB; note if PCIe vs SXM) |
| GPU baseboard | HGX H100/H200 8-GPU board w/ NVLink/NVSwitch |
| CPU | 2× current-gen server CPU (AMD EPYC / Intel Xeon) |
| RAM | 1–2 TB DDR5 ECC |
| Boot | 2× 1.92 TB NVMe (RAID1) |
| Data storage | 4–8× 3.84 TB NVMe U.2 |
| Networking | 2× 25/100GbE (note InfiniBand option for multi-node) |
| Power | Redundant PSUs (N+1) sized for full load |
| Chassis | Rackmount, note U height |

## Config B — cost-efficient inference node (8× L40S, alt: 8× A100)
| Component | Spec to quote |
|---|---|
| GPUs | 8× NVIDIA **L40S 48GB** (PCIe) — also quote 8× A100 80GB |
| CPU | 1–2× current-gen server CPU |
| RAM | 512 GB – 1 TB DDR5 ECC |
| Boot | 2× 1.92 TB NVMe (RAID1) |
| Data storage | 2–4× 3.84 TB NVMe |
| Networking | 2× 25/100GbE |
| Power | Redundant PSUs (N+1) |
| Chassis | Rackmount, note U height |

---

## Make every vendor answer these (this is the real decision data)
1. **All-in price per unit** + **per-GPU price** (GPUs are most of the cost).
2. **Exact GPU SKU** — H100 SXM5 vs PCIe vs H200; confirm VRAM. (They are not the same price or performance.)
3. **Lead time / availability** — weeks to ship? GPUs are supply-constrained; this can be the gating factor.
4. **Power:** max draw (watts), input voltage (208/240V? **three-phase?**), PSU count/redundancy, plug type.
5. **Heat & physical:** BTU/hr, airflow direction, **rack U height**, **weight**.
6. **Warranty & support:** length, next-business-day onsite? spares?
7. **Volume pricing:** unit price at **1 / 5 / 10 / 50** units.
8. **Financing / lease-to-own** options (we plan to finance hardware against contracts).
9. **Extras:** rack integration, burn-in/testing, shipping/install, lead time on reorders.

> Power answers feed directly into site selection — a node at ~10 kW means a
> 400A/3-phase service supports ~7 of them. Get the exact watts.

---

## Who to send it to
Send to **3–5** so you can compare. Mix of OEMs and integrators (integrators
often quote fastest):

- **OEMs:** Dell (PowerEdge XE9680 = 8×H100/H200), Supermicro, HPE, Lenovo, GIGABYTE, ASUS/ASRock Rack
- **Integrators (fast quotes):** Thinkmate, Exxact, Silicon Mechanics, Colfax, Penguin Solutions, Lambda
- **Resellers / VARs (quote multiple OEMs at once):** CDW, SHI, Insight

---

## Bid comparison — fill in as quotes arrive
| Vendor | Config | GPU SKU | Price / unit | Price @ 50 | Lead time | Power (kW) | U / weight | Warranty | Financing? |
|---|---|---|---|---|---|---|---|---|---|
| | A | | | | | | | | |
| | B | | | | | | | | |
| | | | | | | | | | |

Once two or three come back, send them to me and I'll drop the real number into
the per-node economics, the scale ramp, and the raise across the teaser,
proposal, and opportunity page.

---

## How to talk to vendors (sound like you've done this)

**Opener (phone or email):**
> "Hi — I'm sourcing **8-GPU HGX H100 servers** for an **AI inference** deployment.
> HGX-class, **8× H100 SXM5 80GB**, similar to a Dell XE9680, but I want to compare
> integrators. We're an **operator standing up regional GPU capacity** — looking at
> **~50 units, phased**, more to follow. I'd like a quote on a flagship **H100** build
> and a cost-efficient **L40S** build."

**Terms to drop (and what they mean):**
- **HGX H100 (8-GPU baseboard)** — the standard 8-GPU platform = the "node."
- **SXM5 vs PCIe** — SXM = GPUs on a high-bandwidth board with NVLink between them
  (best for big models); PCIe = cards in slots (cheaper). "SXM5 unless PCIe pencils out."
- **NVLink / NVSwitch** — the fast interconnect tying the 8 GPUs together.
- **Inference, not training** — "steady 24/7, latency-sensitive."
- **Independent nodes, no fabric** — "independent inference nodes, so no InfiniBand
  fabric needed — dual 100GbE per node is fine." (signals expertise + saves money)
- **L40S / A100** — cost-efficient inference alternatives to H100.

**What they'll ask you (have answers ready):**
- *Workload?* "LLM inference, mixed model sizes, steady production traffic."
- *Single node or cluster?* "Independent inference nodes — no training fabric."
- *Power-ready site?* "Leased commercial/light-industrial, high-amp 3-phase; confirming sites now."
- *Timeline?* "Pilot ~50 nodes, phased; gathering quotes to lock the build."
- *Reselling?* "No — we own and operate, and sell managed compute."

Don't commit on the call: **"Send the written quote and I'll review with the team."**
