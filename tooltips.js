// Heliode — shared "circled i" glossary tooltips.
// Usage on any page: include
//   <script type="module" src="tooltips.js?v=1"></script>
// then mark a term with a data-key span placed right after the word:
//   Net contribution<span class="info" data-k="net_contribution"></span>
// The script fills the icon + definition from the dictionary below, so every
// page shows the same plain-English explanation. Hover (desktop), tap (mobile),
// or focus to open; Esc or tap-away to close.

const TERMS = {
  gpu: "Graphics Processing Unit — the specialized chip that runs AI models. The scarce, expensive hardware this whole business depends on.",
  inference: "Running a trained AI model to produce answers — the steady, 24/7 production workload (as opposed to training, which builds the model).",
  gpus_lineup: "NVIDIA data-center GPUs. H200 and H100 are the flagship high-memory chips for the largest models; A100 is the proven prior-generation workhorse; L40S is a cost-efficient inference chip.",
  h100: "NVIDIA's production workhorse GPU (80GB) for high-throughput AI inference.",
  h200: "NVIDIA's flagship GPU (141GB) for the largest models, with extra memory headroom.",
  gpu_hour: "The price to rent one GPU for one hour — the basic unit we buy and sell compute in.",
  utilization: "The share of time a GPU is actually rented and earning, rather than sitting idle.",
  gross_revenue: "Total monthly revenue a node earns from selling its GPU-hours, before any costs.",
  opex: "Direct operating costs — the ongoing monthly costs to run a node: power, site lease, and bandwidth.",
  net_contribution: "What a node earns per month after its direct operating costs — before company overhead and hardware payback.",
  payback: "How long until a node's cumulative earnings repay its upfront cost.",
  amortization: "Spreading a node's ~$250K hardware cost across its useful life (about 5 years).",
  offtake: "A signed commitment from a buyer to purchase a node's compute — the demand we secure before we deploy hardware.",
  neocloud: "A newer GPU-focused cloud (CoreWeave, Lambda, Crusoe and similar) that rents AI compute — distinct from the hyperscalers.",
  hyperscaler: "A giant general cloud provider — AWS, Microsoft Azure, or Google Cloud.",
  brokerage: "Phase 1 of the model: we buy GPU capacity on the open market, wrap it in a managed service, and resell it — asset-light, no hardware.",
  tam: "Total Addressable Market — total possible spend if we served everyone.",
  sam: "Serviceable Addressable Market — the slice of the market our model can actually serve.",
  som: "Serviceable Obtainable Market — what we can realistically capture in the near term.",
  cac: "Customer Acquisition Cost — what it costs to win one customer.",
  itc: "Investment Tax Credit — a credit that reduces tax owed by a percentage of an asset's cost.",
  s48e: "The federal Clean Electricity Investment Tax Credit. A business that owns clean-energy equipment cuts its taxes by 30%+ of the system's cost.",
  s25d: "The residential solar tax credit a homeowner would claim on their own roof — expired at the end of 2025.",
  macrs: "The IRS depreciation schedule; solar and battery equipment use a 5-year class.",
  bonus_depreciation: "Deducting the full cost of a qualifying asset in its first year instead of spreading it out. Currently 100%.",
  adders: "Two +10% bonuses on the §48E credit: one for using U.S.-made equipment (domestic content), one for siting in a qualifying area (energy community).",
  vpp: "Virtual Power Plant — a network of batteries a utility pays to discharge at peak demand, turning storage into a revenue stream.",
  demand_response: "Getting paid to reduce or shift power use (or discharge a battery) when the grid is stressed.",
  service_400a: "A 400-amp electrical upgrade that makes a home a commercial-grade power customer, able to run a dense GPU node.",
  three_phase: "A heavy-duty electrical supply common in commercial buildings — enough power for dense compute without an upgrade.",
  safe: "Simple Agreement for Future Equity — a standard early-stage instrument: investors put in money now for shares later, at the next priced round.",
  valuation_cap: "The maximum company value at which a SAFE converts to shares — it sets the investor's eventual ownership.",
  delaware_ccorp: "The standard U.S. startup legal structure investors expect: incorporated in Delaware and taxed as a C-corporation.",
  election_83b: "A tax filing founders make within 30 days of receiving stock, choosing to be taxed at grant (when value is near zero) instead of as it vests.",
  reg_d: "The SEC exemption that lets a startup raise from accredited investors without a public registration.",
  dilution: "The drop in existing owners' percentage when new shares are issued to investors.",
};

let cssDone = false;
function injectCSS(){
  if(cssDone) return; cssDone = true;
  const s = document.createElement('style');
  s.textContent = `
  .info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;border:1px solid rgba(37,99,235,0.45);color:#2563eb;font-family:'Inter',system-ui,sans-serif;font-size:9px;font-weight:700;font-style:normal;text-transform:none;letter-spacing:0;cursor:pointer;position:relative;vertical-align:middle;margin-left:5px;line-height:1;flex:0 0 auto;}
  .info .tip{position:absolute;bottom:160%;left:50%;transform:translateX(-50%);width:240px;max-width:64vw;background:#0d1320;color:#fff;font-size:0.72rem;font-weight:400;line-height:1.5;letter-spacing:0;text-transform:none;text-align:left;padding:10px 12px;border-radius:9px;opacity:0;visibility:hidden;transition:.15s;z-index:9990;pointer-events:none;box-shadow:0 8px 22px rgba(13,19,32,0.22);}
  .info .tip::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#0d1320;}
  .info:hover .tip,.info:focus .tip,.info.open .tip{opacity:1;visibility:visible;}
  @media print{.info{display:none!important;}}`;
  document.head.appendChild(s);
}

function build(){
  injectCSS();
  document.querySelectorAll('.info[data-k]').forEach(el => {
    const def = TERMS[el.getAttribute('data-k')];
    if(!def || el.dataset.built) return;
    el.dataset.built = '1';
    el.setAttribute('tabindex','0');
    el.setAttribute('role','note');
    el.setAttribute('aria-label', def);
    el.innerHTML = 'i<span class="tip">' + def + '</span>';
  });
}

// tap / click to toggle on touch devices; tap-away or Esc to close
document.addEventListener('click', e => {
  const ic = e.target.closest('.info');
  document.querySelectorAll('.info.open').forEach(x => { if(x !== ic) x.classList.remove('open'); });
  if(ic){ e.preventDefault(); ic.classList.toggle('open'); }
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') document.querySelectorAll('.info.open').forEach(x => x.classList.remove('open'));
});

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
else build();
