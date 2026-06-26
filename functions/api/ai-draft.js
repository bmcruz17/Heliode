// /api/ai-draft — Claude writes a personalized inference-outreach email + SMS + call script.
// Uses every field we know about the lead. Never invents facts, never quotes pricing,
// never promises specific ROI. Proxies the Anthropic key (server-side only).
import { json, bad, preflight, requireTeam } from './_util.js';

const MODEL = 'claude-opus-4-8';

const SYSTEM = `You write B2B outreach for HELIODE, an AI services company that builds AI INFERENCE
solutions for businesses (customer-support chatbots, document/invoice processing, call
automation, demand forecasting, recommendation engines, computer vision, RAG assistants).

Your job: write a short, specific, non-salesy first-touch that earns a reply.

ANGLE — this is NOT "you need a website." It is: "You're clearly handling real volume —
here's how AI inference could take repetitive load off your team and capture revenue you're
leaking." Use the lead's actual data to be specific:
- High review/interaction volume → "responding to every inquiry/review by hand doesn't scale —
  an AI assistant can draft replies in your voice instantly."
- Many locations or long/after hours → "after-hours and overflow calls a 24/7 AI receptionist
  could capture."
- Document-heavy verticals (legal, insurance, accounting, medical billing) → "AI that reads and
  routes intake docs/claims in seconds."
- E-commerce → "AI product Q&A + support that lifts conversion and deflects tickets."
Offer a free "AI Opportunity Audit": map 2–3 concrete inference use-cases for THEIR specific
business, no cost, no pressure. End with a booking link placeholder: {{BOOKING_LINK}}.

HARD RULES:
- Only use facts present in the lead data. Never invent details, headcount, or names.
- Never quote pricing. Never promise specific ROI/percent numbers.
- No hype, no "revolutionary." Plain, concrete, respectful of their time.
- Email: 90–130 words, 1 clear ask. Subject: under 8 words, specific, no clickbait.
- Sign off exactly: "The Heliode Team".

Return ONLY valid JSON, no prose, no code fence:
{"subject": "...", "email": "...", "sms": "...", "call_script": "..."}
- sms: <=320 chars, friendly, same angle, ends asking if they're open to a quick look.
- call_script: 4–6 short lines a rep can read on a cold call (opener, why-calling, the audit
  offer, one discovery question, soft close).`;

function leadBlock(d) {
  const f = (k, v) => (v ? `${k}: ${v}\n` : '');
  return (
    f('Company', d.company_name) +
    f('Industry', d.industry) +
    f('Address', d.address) +
    f('Website', d.website) +
    f('Phone', d.phone) +
    f('Google rating', d.rating) +
    f('Review count', d.reviews) +
    f('Opportunity score', d.opportunity) +
    f('Description', d.description) +
    f('About (enriched)', d.about) +
    f('Firmographics', d.firmographics ? JSON.stringify(d.firmographics) : '') +
    f('Latest note', d.notes)
  );
}

export async function onRequestOptions() { return preflight(); }

export async function onRequestPost(context) {
  const { request, env } = context;
  try { await requireTeam(request, env); }
  catch (e) { return bad(e.message, e.status || 401); }
  if (!env.ANTHROPIC_API_KEY) return bad('ANTHROPIC_API_KEY not set', 500);

  let lead; try { lead = await request.json(); } catch { return bad('bad json'); }
  if (!lead.company_name) return bad('company_name required');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1200,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Lead data (use only what's present):\n\n${leadBlock(lead)}\n\nWrite the JSON now.`,
      }],
    }),
  });
  if (!res.ok) return bad(`anthropic ${res.status}: ${await res.text()}`, 502);
  const data = await res.json();
  const text = (data.content || []).map((c) => c.text || '').join('').trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return bad('model returned non-JSON', 502);
    try { parsed = JSON.parse(m[0]); } catch { return bad('model returned bad JSON', 502); }
  }
  return json(parsed);
}
