// Heliode — shared first-login NDA gate.
// Used by rep.html, investors.html, admin.html. Captures a typed signature,
// personal email + phone, records to public.nda_acceptances, generates a PDF
// copy (downloaded immediately) and emails it via the send-nda edge function.
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm';

export const NDA_VERSION = 'v1-2026-06';

// Plain-text NDA clauses (used for both on-screen display and the PDF).
export const NDA_CLAUSES = [
  ['1. Confidential Information',
   'In connection with your relationship with Heliode (a brand of ATMX Holdings) you may receive non-public information — including business plans, financial models, pricing, customer and vendor lists, supplier terms, technology, deployment methods, and strategy ("Confidential Information").'],
  ['2. Your obligations',
   'You agree to keep all Confidential Information strictly confidential, to use it only to evaluate or carry out your relationship with Heliode, and not to disclose, copy, publish, or share it with any third party without Heliode\'s prior written consent.'],
  ['3. No license',
   'Nothing here grants you any ownership, license, or right in Heliode\'s Confidential Information or intellectual property. All materials remain the property of Heliode / ATMX Holdings.'],
  ['4. Term',
   'These obligations continue for three (3) years from the date below, and indefinitely for any information that constitutes a trade secret under applicable law.'],
  ['5. Return / deletion',
   'On request, you will promptly return or destroy all Confidential Information in your possession.'],
  ['6. Acknowledgement',
   'You are signing on behalf of yourself and any entity you represent. You agree that a typed signature below is a valid electronic signature, and that breach may cause irreparable harm for which Heliode may seek injunctive relief.'],
];

function ndaInnerHtml(){
  return NDA_CLAUSES.map(([h,b]) => `<h4>${h}</h4><p>${b}</p>`).join('');
}

let stylesInjected = false;
function injectStyles(){
  if(stylesInjected) return; stylesInjected = true;
  const s = document.createElement('style');
  s.textContent = `
  .nda-ov{position:fixed;inset:0;z-index:9999;background:rgba(13,19,32,0.72);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:5vh 16px;font-family:'Inter',system-ui,sans-serif;}
  .nda-modal{background:#fff;max-width:640px;width:100%;border-radius:18px;padding:30px 30px 26px;box-shadow:0 24px 70px rgba(0,0,0,0.4);color:#0d1320;}
  .nda-modal .eye{font-family:'JetBrains Mono',monospace;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:#ea580c;margin-bottom:10px;}
  .nda-modal h2{font-family:'Space Grotesk',system-ui,sans-serif;font-size:1.35rem;margin:0 0 6px;letter-spacing:-0.02em;}
  .nda-modal .sub{font-size:0.9rem;color:#555c66;margin-bottom:14px;}
  .nda-scroll{max-height:38vh;overflow-y:auto;border:1px solid rgba(13,19,32,0.12);border-radius:12px;padding:18px 20px;background:#f4f7fc;font-size:0.84rem;color:#39414d;margin-bottom:16px;}
  .nda-scroll h4{font-family:'Space Grotesk',system-ui,sans-serif;color:#0d1320;font-size:0.9rem;margin:14px 0 5px;}
  .nda-scroll h4:first-child{margin-top:0;}
  .nda-scroll p{margin:0 0 9px;line-height:1.55;}
  .nda-fld{display:block;font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.05em;text-transform:uppercase;color:#8a909a;margin:12px 0 5px;}
  .nda-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  @media(max-width:520px){.nda-grid{grid-template-columns:1fr;}}
  .nda-in{width:100%;border:1px solid rgba(13,19,32,0.16);border-radius:10px;padding:10px 12px;font-family:'Inter',system-ui,sans-serif;font-size:0.92rem;outline:none;}
  .nda-in:focus{border-color:rgba(37,99,235,0.45);box-shadow:0 0 0 3px rgba(37,99,235,0.10);}
  .nda-agree-row{display:flex;gap:9px;align-items:flex-start;margin-top:14px;font-size:0.82rem;color:#39414d;line-height:1.5;}
  .nda-agree-row input{margin-top:3px;}
  .nda-go{margin-top:18px;width:100%;border:none;border-radius:11px;background:#f97316;color:#fff;font-family:'Space Grotesk',system-ui,sans-serif;font-weight:600;font-size:0.95rem;padding:13px;cursor:pointer;}
  .nda-go:hover{background:#ea580c;} .nda-go:disabled{opacity:.5;cursor:not-allowed;}
  .nda-msg{font-size:0.82rem;color:#dc2626;margin-top:10px;min-height:1em;}
  .nda-foot{font-size:0.72rem;color:#8a909a;margin-top:12px;}`;
  document.head.appendChild(s);
}

// Build + auto-download the signed PDF; returns base64 (no data: prefix).
export function generateNdaPdf({ full_name, personal_email, phone, signed_at }){
  const doc = new jsPDF({ unit:'pt', format:'letter' });
  const M = 56, W = 612 - M*2; let y = 64;
  doc.setFont('helvetica','bold'); doc.setFontSize(18);
  doc.text('Heliode — Confidentiality Agreement', M, y); y += 10;
  doc.setDrawColor(249,115,22); doc.setLineWidth(2); doc.line(M, y, M+60, y); y += 24;
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(90,90,90);
  doc.text('ATMX Holdings · Confidential · Version '+NDA_VERSION, M, y); y += 22;
  doc.setTextColor(40,40,40);
  for(const [h,b] of NDA_CLAUSES){
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5);
    if(y > 700){ doc.addPage(); y = 64; }
    doc.text(h, M, y); y += 14;
    doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(b, W);
    for(const ln of lines){ if(y > 740){ doc.addPage(); y = 64; } doc.text(ln, M, y); y += 13; }
    y += 8;
  }
  if(y > 640){ doc.addPage(); y = 64; }
  y += 10; doc.setDrawColor(210,210,210); doc.setLineWidth(1); doc.line(M, y, M+W, y); y += 22;
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.text('Signed', M, y); y += 18;
  doc.setFont('helvetica','normal'); doc.setFontSize(10);
  const rows = [
    ['Signature (typed)', full_name||''],
    ['Personal email', personal_email||''],
    ['Phone', phone||''],
    ['Date', new Date(signed_at||Date.now()).toLocaleString('en-US')],
  ];
  for(const [k,v] of rows){ doc.setTextColor(120,120,120); doc.text(k+':', M, y); doc.setTextColor(20,20,20); doc.text(String(v), M+130, y); y += 16; }
  const safe = (full_name||'signed').replace(/[^a-z0-9]+/gi,'-');
  doc.save('Heliode-NDA-'+safe+'.pdf');
  return doc.output('datauristring').split(',')[1];
}

// Best-effort: email the signed PDF to the personal address via the edge fn.
export async function emailNda(sb, { to, full_name, pdf_base64 }){
  try {
    const { data, error } = await sb.functions.invoke('send-nda', {
      body: { to, full_name, pdf_base64, nda_version: NDA_VERSION }
    });
    if(error){
      let m = error.message || 'request failed';
      try { const j = await error.context.json(); if(j && j.error) m = j.error; } catch(_){}
      console.error('[NDA email]', m); return { ok:false, msg:m };
    }
    return { ok:true, data };
  } catch(e){ console.error('[NDA email]', e); return { ok:false, msg:String(e) }; }
}

// Main gate. Resolves once the user has a recorded NDA (or is exempt).
export async function requireNda(sb, session, opts = {}){
  const exempt = (opts.exempt || []).map(e => e.toLowerCase());
  const email = session?.user?.email?.toLowerCase();
  if(email && exempt.includes(email)) return;
  const { data: existing } = await sb.from('nda_acceptances')
    .select('user_id').eq('user_id', session.user.id).maybeSingle();
  if(existing) return;

  injectStyles();
  return new Promise((resolve) => {
    const ov = document.createElement('div');
    ov.className = 'nda-ov';
    ov.innerHTML = `
      <div class="nda-modal">
        <div class="eye">Confidential · sign to continue</div>
        <h2>Confidentiality agreement</h2>
        <p class="sub">First time here — please read and sign. We'll email a PDF copy to your personal email for your records.</p>
        <div class="nda-scroll">${ndaInnerHtml()}</div>
        <label class="nda-fld">Type your full legal name to sign</label>
        <input class="nda-in nda-name" type="text" placeholder="Full legal name">
        <div class="nda-grid">
          <div><label class="nda-fld">Personal email (for your copy)</label><input class="nda-in nda-email" type="email" placeholder="you@personal.com"></div>
          <div><label class="nda-fld">Phone</label><input class="nda-in nda-phone" type="tel" placeholder="(555) 555-5555"></div>
        </div>
        <label class="nda-agree-row"><input type="checkbox" class="nda-agree"><span>I have read, understood, and agree to be bound by the Confidentiality Agreement above, on behalf of myself and any entity I represent.</span></label>
        <button class="nda-go" disabled>Agree, sign &amp; continue</button>
        <div class="nda-msg"></div>
        <div class="nda-foot">Version ${NDA_VERSION} · a signed PDF copy will be emailed to you.</div>
      </div>`;
    document.body.appendChild(ov);
    const q = s => ov.querySelector(s);
    const btn = q('.nda-go');
    const ready = () => {
      btn.disabled = !(q('.nda-agree').checked &&
        q('.nda-name').value.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(q('.nda-email').value.trim()) &&
        q('.nda-phone').value.trim().length >= 7);
    };
    ['input','change'].forEach(ev => ov.addEventListener(ev, ready));
    btn.addEventListener('click', async () => {
      btn.disabled = true; btn.textContent = 'Signing…'; q('.nda-msg').textContent = '';
      const data = {
        user_id: session.user.id,
        full_name: q('.nda-name').value.trim(),
        personal_email: q('.nda-email').value.trim(),
        phone: q('.nda-phone').value.trim(),
        nda_version: NDA_VERSION,
        user_agent: navigator.userAgent,
      };
      const { error } = await sb.from('nda_acceptances').insert(data);
      if(error){ q('.nda-msg').textContent = 'Could not record signature: ' + error.message; btn.disabled = false; btn.textContent = 'Agree, sign & continue'; return; }
      const signed_at = new Date().toISOString();
      let b64 = null;
      try { b64 = generateNdaPdf({ ...data, signed_at }); } catch(_){}
      if(b64){
        const r = await emailNda(sb, { to: data.personal_email, full_name: data.full_name, pdf_base64: b64 });
        if(!r.ok) alert('Signed ✓ and your PDF downloaded — but the email copy didn’t send:\n\n' + r.msg + '\n\n(This doesn’t block you.)');
      }
      ov.remove();
      resolve();
    });
  });
}
