# Node cost estimate (working draft — confirm with vendor quotes)

These are **rough 2026 ballparks** to frame the conversation, not quotes. Get
real BOMs Monday and replace these. GPU street prices move fast.

> **Working definition (locked):** a *node* = one **8-GPU server** (8× H100-class),
> ~$250K all-in. All docs (homepage, teaser, opportunity, proposal) use this.

## What your own numbers imply today
Your teaser states ~$7.6K/mo **net** per node, ~year-3 payback, ~+$170K net
over 5 years. Working backward, that implies a node costs roughly:

> 5-yr net contribution (~$456K) − stated 5-yr profit (~$170K) ≈ **~$280K capex**

That's an **8×H100-class server** — the priciest, highest-earning option.

## Node options (illustrative capex)
| Node (8-GPU server) | Rough all-in capex | Notes |
|---|---|---|
| 8× H200 | ~$300–360K | Newest, highest memory, top rental rates |
| **8× H100** | **~$250–300K** | The implied base-case node |
| 8× A100 80GB | ~$120–170K | Mature, cheaper, strong inference value |
| 8× L40S | ~$80–120K | Great $/inference for many models |
| 4× L40S / 4× A100 (half node) | ~$45–85K | Smaller unit, lower capex per box |

All-in = GPUs + server (CPU, RAM, NVMe, NVSwitch/NIC, chassis). Add site +
electrical buildout on top (lease deposit, panels/breakers, PDUs, cooling).

## The thing to remember
A node's **monthly net scales with the GPU's rental rate**, so a cheaper node
also earns less — the more stable metric is **payback period**:

| Capex/node | Payback @ that node's net | 
|---|---|
| ~$280K (8×H100, ~$7.6K/mo net) | ~3.1 years |
| ~$140K (8×A100) | typically ~1.5–2.5 yrs (lower net too) |
| ~$90K (8×L40S) | typically ~1–2 yrs |

## What this means for the raise
At **~$280K/node**, a 50-node owned pilot is **~$14M of hardware** — so a $2M
pre-seed can't buy it outright. $2M realistically funds: brokerage launch +
team + software + **~2–4 proof nodes** + 12–18 mo runway. The full pilot is a
later raise financed largely against **signed offtake** (equipment/debt).

**If you choose a cheaper node type** (A100/L40S), capex per node drops a lot
and $2M stretches to more owned boxes — at the cost of lower net/node. Decide
node type ↔ raise size together.

## To finalize Monday, get quotes for:
1. The GPU server BOM (pick 1–2 node types above).
2. Lease $/sq-ft for commercial/light-industrial space with the amperage you need.
3. Electrical buildout (panel/breaker upgrade, PDUs) + cooling per site.
4. Bandwidth/transit per site.

Send me those and I'll lock the per-node economics, the ramp table, and the
raise across the teaser + proposal.
