// /api/run-scheduled — cron target (every 20 min via GitHub Actions).
// Secured by SCHED_SECRET (header x-sched-secret OR ?secret=). Sends due drafts.
import { json, bad, preflight, sb } from './_util.js';
import { getRefresh, accessToken, sendDraft } from './_google.js';

export async function onRequestOptions() { return preflight(); }

async function run(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const provided = request.headers.get('x-sched-secret') || url.searchParams.get('secret');
  if (!env.SCHED_SECRET || provided !== env.SCHED_SECRET) return bad('forbidden', 403);

  const now = new Date().toISOString();
  const due = await sb(env,
    `heliode_scheduled_emails?status=eq.queued&send_at=lte.${now}&select=*&order=send_at.asc&limit=50`);

  const tokenCache = {};
  const results = [];
  for (const row of due || []) {
    try {
      if (!tokenCache[row.sender_email]) {
        const refresh = await getRefresh(env, row.sender_email);
        if (!refresh) throw new Error('sender not connected');
        tokenCache[row.sender_email] = await accessToken(env, refresh);
      }
      await sendDraft(tokenCache[row.sender_email], row.draft_id);
      await sb(env, `heliode_scheduled_emails?id=eq.${row.id}`, {
        method: 'PATCH', prefer: 'return=minimal', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString(), error: null }),
      });
      results.push({ id: row.id, ok: true });
    } catch (e) {
      await sb(env, `heliode_scheduled_emails?id=eq.${row.id}`, {
        method: 'PATCH', prefer: 'return=minimal', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'error', error: String(e.message || e) }),
      });
      results.push({ id: row.id, ok: false, error: String(e.message || e) });
    }
  }
  return json({ checked: (due || []).length, sent: results.filter((r) => r.ok).length, results });
}

export async function onRequestPost(context) { return run(context); }
export async function onRequestGet(context) { return run(context); }
