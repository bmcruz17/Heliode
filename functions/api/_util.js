// Shared helpers for Heliode operator API (Cloudflare Pages Functions).
// Same-folder imports only — every /functions/api/*.js imports from here.

export const SUPABASE_URL =
  // overridable via env; defaults to the existing Heliode project
  (globalThis.HELIODE_SUPABASE_URL) || 'https://pyosjuuvbxzyjtokfqfu.supabase.co';

export const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5b3NqdXV2Ynh6eWp0b2tmcWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNjk4MTcsImV4cCI6MjA5NzY0NTgxN30.7bH19ZZJHxchfRVt3t-I20gJ44WvbR3al516QhwQpmw';

// ---- HTTP helpers ----
export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
export const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', ...CORS, ...extra },
  });
export const bad = (msg, status = 400) => json({ error: msg }, status);
export const preflight = () => new Response(null, { status: 204, headers: CORS });

// ---- Supabase (service role) REST ----
// env.SUPABASE_SERVICE_ROLE_KEY must be a Cloudflare secret.
export function sbUrl(env) {
  return env.SUPABASE_URL || SUPABASE_URL;
}
export async function sb(env, path, opts = {}) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${sbUrl(env)}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      Prefer: opts.prefer || 'return=representation',
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(`supabase ${res.status}: ${text}`);
  return data;
}

// ---- team auth ----
// Verifies the caller's Supabase access token (sent as Bearer) and confirms
// the email is on the Heliode team. Returns { email } or throws.
const TEAM_ALLOW = ['brandonmcruz@mac.com'];
export function isTeamEmail(email) {
  const e = (email || '').toLowerCase();
  return e.endsWith('@heliode.ai') || TEAM_ALLOW.includes(e);
}
export async function requireTeam(request, env) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) throw httpError('missing token', 401);
  const res = await fetch(`${sbUrl(env)}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_ANON_KEY || ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw httpError('invalid session', 401);
  const user = await res.json();
  if (isTeamEmail(user.email)) return { email: user.email, id: user.id };
  // invited members: confirm team membership via the heliode_is_team() RPC (respects heliode_team_members)
  try {
    const r = await fetch(`${sbUrl(env)}/rest/v1/rpc/heliode_is_team`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_ANON_KEY || ANON_KEY,
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: '{}',
    });
    if (r.ok && (await r.json()) === true) return { email: user.email, id: user.id };
  } catch (_) { /* fall through */ }
  throw httpError('not a team member', 403);
}
export function httpError(msg, status) {
  const e = new Error(msg);
  e.status = status;
  return e;
}

// ---- inference-fit targeting ----
// AI-amenable verticals (presets + Roll-the-Dice pool).
export const AI_VERTICALS = [
  'e-commerce', 'online store', 'law firm', 'insurance agency',
  'real estate brokerage', 'property management', 'medical clinic',
  'dental practice', 'veterinary hospital', 'accounting firm', 'cpa firm',
  'recruiting agency', 'staffing agency', 'logistics company', 'freight broker',
  'call center', 'answering service', 'marketing agency', 'saas company',
  'manufacturer', 'auto dealership', 'mortgage broker', 'medical billing',
  'hvac company', 'plumbing company', 'roofing company', 'hotel',
  'fitness franchise', 'pharmacy', 'debt collection agency', 'title company',
];
export const DICE_CITIES = [
  ['Austin', 'TX'], ['Dallas', 'TX'], ['Houston', 'TX'], ['Phoenix', 'AZ'],
  ['Miami', 'FL'], ['Tampa', 'FL'], ['Atlanta', 'GA'], ['Charlotte', 'NC'],
  ['Nashville', 'TN'], ['Denver', 'CO'], ['Chicago', 'IL'], ['Columbus', 'OH'],
  ['Seattle', 'WA'], ['Portland', 'OR'], ['Las Vegas', 'NV'], ['San Diego', 'CA'],
  ['Sacramento', 'CA'], ['Kansas City', 'MO'], ['Indianapolis', 'IN'],
  ['Boston', 'MA'], ['Philadelphia', 'PA'], ['Raleigh', 'NC'], ['Orlando', 'FL'],
];
export function isAmenable(industry) {
  const s = (industry || '').toLowerCase();
  return AI_VERTICALS.some((v) => s.includes(v.split(' ')[0]) || v.includes(s));
}
// Opportunity score (0-100), tuned for AI-inference fit (NOT web design).
export function scoreLead({ hasWebsite, reviews, industry, hasPhone, headcount }) {
  let s = 0;
  s += hasWebsite ? 25 : 5;                       // digital maturity to integrate AI
  s += (Math.min(reviews || 0, 400) / 400) * 35;  // interaction/support VOLUME
  s += isAmenable(industry) ? 22 : 8;             // vertical fit
  s += hasPhone ? 10 : 0;                          // reachable decision-maker
  s += headcount && headcount >= 20 ? 8 : 0;      // bigger ops = more to automate
  return Math.max(0, Math.min(100, Math.round(s)));
}
export function tierOf(score) {
  if (score >= 85) return '🔥 Hot';
  if (score >= 70) return '⭐ Strong';
  if (score >= 50) return '• Warm';
  return '· Cool';
}
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
