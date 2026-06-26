// /api/places — Google Places (New) searchText + inference-fit scoring + Roll the Dice.
import { json, bad, preflight, requireTeam, scoreLead, tierOf,
         AI_VERTICALS, DICE_CITIES, pick } from './_util.js';

const FIELDS = [
  'places.id', 'places.displayName', 'places.formattedAddress',
  'places.nationalPhoneNumber', 'places.websiteUri', 'places.rating',
  'places.userRatingCount', 'places.primaryTypeDisplayName', 'places.businessStatus',
].join(',');

async function searchText(env, textQuery, pageToken) {
  const body = { textQuery, pageSize: 20 };
  if (pageToken) body.pageToken = pageToken;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': `${FIELDS},nextPageToken`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `places ${res.status}`);
  return data;
}

function mapPlace(p, industry) {
  const reviews = p.userRatingCount || 0;
  const hasWebsite = !!p.websiteUri;
  const hasPhone = !!p.nationalPhoneNumber;
  const score = scoreLead({ hasWebsite, reviews, industry, hasPhone });
  return {
    place_id: p.id,
    company_name: p.displayName?.text || '',
    address: p.formattedAddress || '',
    phone: p.nationalPhoneNumber || '',
    website: p.websiteUri || '',
    rating: p.rating || null,
    reviews,
    industry: p.primaryTypeDisplayName?.text || industry || '',
    status: p.businessStatus || '',
    opportunity: score,
    tier: tierOf(score),
  };
}

// up to 3 pages (60 results); Google needs a beat before nextPageToken is valid.
async function collect(env, textQuery, industry, maxPages = 3) {
  const out = [];
  let token = null;
  for (let i = 0; i < maxPages; i++) {
    const data = await searchText(env, textQuery, token);
    (data.places || []).forEach((p) => out.push(mapPlace(p, industry)));
    token = data.nextPageToken;
    if (!token) break;
    await new Promise((r) => setTimeout(r, 1600));
  }
  return out;
}

function applyFilters(rows, f) {
  return rows.filter((r) => {
    if (f.minReviews && r.reviews < f.minReviews) return false;
    if (f.hasPhone && !r.phone) return false;
    if (f.hasWebsite && !r.website) return false;
    return true;
  });
}

export async function onRequestOptions() { return preflight(); }

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    await requireTeam(request, env);
  } catch (e) { return bad(e.message, e.status || 401); }
  if (!env.GOOGLE_PLACES_API_KEY) return bad('GOOGLE_PLACES_API_KEY not set', 500);

  let body;
  try { body = await request.json(); } catch { return bad('bad json'); }

  // ---- Roll the Dice: 20 random qualifying businesses across the USA ----
  if (body.dice) {
    const jobs = Array.from({ length: 20 }, () => {
      const industry = pick(AI_VERTICALS);
      const [city, state] = pick(DICE_CITIES);
      return collect(env, `${industry} in ${city}, ${state}`, industry, 1)
        .then((rows) => applyFilters(rows, { minReviews: 10, hasWebsite: true })
          .sort((a, b) => b.opportunity - a.opportunity)[0])
        .catch(() => null);
    });
    const picks = (await Promise.all(jobs)).filter(Boolean);
    // dedupe by place_id
    const seen = new Set();
    const unique = picks.filter((p) => !seen.has(p.place_id) && seen.add(p.place_id));
    return json({ results: unique.sort((a, b) => b.opportunity - a.opportunity) });
  }

  // ---- structured search ----
  const { industry = '', city = '', state = '', keyword = '' } = body;
  const q = [keyword, industry, 'in', [city, state].filter(Boolean).join(', ')]
    .filter(Boolean).join(' ').trim();
  if (!q) return bad('industry or keyword required');

  let rows = await collect(env, q, industry);
  rows = applyFilters(rows, {
    minReviews: body.minReviews || 0,
    hasPhone: !!body.filterHasPhone,
    hasWebsite: !!body.filterHasWebsite,
  });
  rows.sort((a, b) => b.opportunity - a.opportunity);
  return json({ count: rows.length, results: rows });
}
