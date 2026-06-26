// /api/company-scrape — on-demand deep firmographics via Apify run-sync.
// Uses a Facebook Pages scraper (default) for headcount/category/about.
// GET ?check=1 → health check.
import { json, bad, preflight, requireTeam } from './_util.js';

// Public Apify actors (run-sync-get-dataset-items). Override via env if desired.
const FB_ACTOR = 'apify~facebook-pages-scraper';

export async function onRequestOptions() { return preflight(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  if (new URL(request.url).searchParams.get('check') === '1') {
    return json({ apify: !!env.APIFY_TOKEN, actor: env.APIFY_FB_ACTOR || FB_ACTOR });
  }
  return bad('use POST, or GET ?check=1');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try { await requireTeam(request, env); }
  catch (e) { return bad(e.message, e.status || 401); }
  if (!env.APIFY_TOKEN) return bad('APIFY_TOKEN not set', 500);

  let body; try { body = await request.json(); } catch { return bad('bad json'); }
  const fbUrl = body.facebook || body.socials?.facebook;
  if (!fbUrl) return bad('a facebook page url is required (enrich first)');

  const actor = env.APIFY_FB_ACTOR || FB_ACTOR;
  const res = await fetch(
    `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${env.APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ startUrls: [{ url: fbUrl }], resultsLimit: 1 }),
    },
  );
  if (!res.ok) return bad(`apify ${res.status}: ${await res.text()}`, 502);
  const items = await res.json();
  const it = Array.isArray(items) ? items[0] : items;
  if (!it) return json({ firmographics: {} });

  const firmographics = {
    category: it.categories?.join(', ') || it.category || '',
    about: it.about || it.info?.join(' ') || it.intro || '',
    headcount: it.employees || it.headcount || null,
    likes: it.likes || it.followers || null,
    website: it.website || '',
    email: it.email || '',
    phone: it.phone || '',
    address: it.address || '',
  };
  return json({ firmographics });
}
