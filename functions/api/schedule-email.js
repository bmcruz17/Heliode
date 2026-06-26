// /api/schedule-email — create the Gmail draft now, queue it for send at send_at,
// move the client Lead→Contacted, and set a 48h follow-up. Bulk mode supported.
import { json, bad, preflight, requireTeam, sb } from './_util.js';
import { getRefresh, accessToken, mime, createDraft } from './_google.js';

export async function onRequestOptions() { return preflight(); }

async function scheduleOne(env, token, { client_id, sender_email, to_email, subject, body, send_at }) {
  const raw = mime({ to: to_email, from: sender_email, subject, body });
  const draftId = await createDraft(token, raw);
  await sb(env, 'heliode_scheduled_emails', {
    method: 'POST', prefer: 'return=minimal',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      client_id, sender_email, to_email, subject,
      draft_id: draftId, send_at, status: 'queued',
    }),
  });
  if (client_id) {
    const followUp = new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 10);
    const rows = await sb(env, `heliode_clients?id=eq.${client_id}&select=activities,stage`);
    const acts = rows?.[0]?.activities || [];
    acts.unshift({ at: new Date().toISOString(), type: 'email', text: `Scheduled: ${subject}` });
    const patch = { activities: acts, follow_up: followUp };
    if ((rows?.[0]?.stage || 'Lead') === 'Lead') patch.stage = 'Contacted';
    await sb(env, `heliode_clients?id=eq.${client_id}`, {
      method: 'PATCH', prefer: 'return=minimal',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    });
  }
  return draftId;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try { await requireTeam(request, env); }
  catch (e) { return bad(e.message, e.status || 401); }

  let body; try { body = await request.json(); } catch { return bad('bad json'); }
  const sender = body.sender_email;
  if (!sender) return bad('sender_email required (connect Gmail first)');
  const refresh = await getRefresh(env, sender);
  if (!refresh) return bad(`${sender} has not connected Gmail — use Connect Gmail first`, 400);
  const token = await accessToken(env, refresh);

  // bulk: array of items share a send_at; single: one item
  const items = Array.isArray(body.items) ? body.items : [body];
  const results = [];
  for (const it of items) {
    try {
      const draftId = await scheduleOne(env, token, {
        client_id: it.client_id,
        sender_email: sender,
        to_email: it.to_email,
        subject: it.subject,
        body: it.body,
        send_at: it.send_at || body.send_at,
      });
      results.push({ client_id: it.client_id, ok: true, draft_id: draftId });
    } catch (e) {
      results.push({ client_id: it.client_id, ok: false, error: String(e.message || e) });
    }
  }
  return json({ scheduled: results.filter((r) => r.ok).length, results });
}
