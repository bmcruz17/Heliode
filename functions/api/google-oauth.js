// /api/google-oauth — start Google OAuth (returns consent URL for the dashboard popup).
import { json, bad, preflight, requireTeam } from './_util.js';
import { authUrl } from './_google.js';

export async function onRequestOptions() { return preflight(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  try { await requireTeam(request, env); }
  catch (e) { return bad(e.message, e.status || 401); }
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)
    return bad('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set', 500);
  const origin = new URL(request.url).origin;
  return json({ url: authUrl(env, origin, 'heliode') });
}
