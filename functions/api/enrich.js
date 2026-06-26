// /api/enrich — Serper.dev: pull email/phone/socials + an "about" blurb from
// Google's snippet of a business's site/Facebook/LinkedIn (no direct scraping).
// GET ?check=1 → no-cost health check of which API keys are configured.
import { json, bad, preflight, requireTeam } from './_util.js';

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

export async function onRequestOptions() { return preflight(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (url.searchParams.get('check') === '1') {
    return json({
      keys: {
        GOOGLE_PLACES_API_KEY: !!env.GOOGLE_PLACES_API_KEY,
        SERPER_API_KEY: !!env.SERPER_API_KEY,
        APIFY_TOKEN: !!env.APIFY_TOKEN,
        ANTHROPIC_API_KEY: !!env.ANTHROPIC_API_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!env.SUPABASE_SERVICE_ROLE_KEY,
        GOOGLE_CLIENT_SECRET: !!env.GOOGLE_CLIENT_SECRET,
        SCHED_SECRET: !!env.SCHED_SECRET,
      },
    });
  }
  return bad('use POST, or GET ?check=1');
}

async function serper(env, q) {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'X-API-KEY': env.SERPER_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ q, num: 10 }),
  });
  if (!res.ok) throw new Error(`serper ${res.status}`);
  return res.json();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try { await requireTeam(request, env); }
  catch (e) { return bad(e.message, e.status || 401); }
  if (!env.SERPER_API_KEY) return bad('SERPER_API_KEY not set', 500);

  let body; try { body = await request.json(); } catch { return bad('bad json'); }
  const { company_name = '', address = '', website = '' } = body;
  if (!company_name) return bad('company_name required');

  const loc = address.split(',').slice(-3, -1).join(',').trim();
  const queries = [
    `${company_name} ${loc} email contact`,
    website ? `site:${website.replace(/^https?:\/\//, '').replace(/\/.*$/, '')} email`
            : `${company_name} ${loc} facebook OR linkedin`,
  ];

  let email = '', phone = '', about = '';
  const socials = {};
  for (const q of queries) {
    let data; try { data = await serper(env, q); } catch { continue; }
    const blobs = [];
    if (data.knowledgeGraph) {
      about = about || data.knowledgeGraph.description || '';
      if (data.knowledgeGraph.email) email = email || data.knowledgeGraph.email;
      if (data.knowledgeGraph.phone) phone = phone || data.knowledgeGraph.phone;
    }
    (data.organic || []).forEach((o) => {
      blobs.push(`${o.title} ${o.snippet} ${o.link}`);
      if (/facebook\.com/.test(o.link)) socials.facebook = socials.facebook || o.link;
      if (/linkedin\.com/.test(o.link)) socials.linkedin = socials.linkedin || o.link;
      if (/instagram\.com/.test(o.link)) socials.instagram = socials.instagram || o.link;
      if (!about && o.snippet && /about|provides|offers|serving|specializ/i.test(o.snippet))
        about = o.snippet;
    });
    const hay = blobs.join('  ');
    if (!email) { const m = hay.match(EMAIL_RE); if (m) email = m[0]; }
    if (!phone) { const m = hay.match(PHONE_RE); if (m) phone = m[0]; }
    if (email && phone && about) break;
  }
  return json({ email, phone, about: about.slice(0, 400), socials });
}
