// Google OAuth + Gmail draft/send + token storage helpers.
// Underscore-prefixed → importable, not routed. Same-folder imports only.
import { sb } from './_util.js';

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.compose',   // create + send drafts
  'https://www.googleapis.com/auth/calendar.events',
  'openid', 'email',
].join(' ');

export function redirectUri(origin) { return `${origin}/api/google-callback`; }

export function authUrl(env, origin, state) {
  const p = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(origin),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    scope: SCOPES,
    state: state || '',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

export async function exchangeCode(env, origin, code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(origin),
      grant_type: 'authorization_code',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`google token ${res.status}: ${JSON.stringify(data)}`);
  return data; // { access_token, refresh_token, ... }
}

export async function accessToken(env, refresh) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: refresh,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`google refresh ${res.status}: ${JSON.stringify(data)}`);
  return data.access_token;
}

export async function gmailProfile(token) {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`gmail profile ${res.status}`);
  return res.json(); // { emailAddress, ... }
}

// token storage in heliode_settings (key = gtoken:<email>)
export async function saveRefresh(env, email, refresh) {
  await sb(env, 'heliode_settings', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=minimal',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      key: `gtoken:${email.toLowerCase()}`,
      value: { refresh_token: refresh },
      updated_at: new Date().toISOString(),
    }),
  });
}
export async function getRefresh(env, email) {
  const rows = await sb(env, `heliode_settings?key=eq.${encodeURIComponent('gtoken:' + email.toLowerCase())}&select=value`);
  return rows?.[0]?.value?.refresh_token || null;
}
export async function connectedSenders(env) {
  const rows = await sb(env, 'heliode_settings?key=like.gtoken:*&select=key');
  return (rows || []).map((r) => r.key.replace(/^gtoken:/, ''));
}

// build a base64url-encoded RFC822 message
function b64url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function mime({ to, from, subject, body }) {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
  ];
  return b64url(`${headers.join('\r\n')}\r\n\r\n${body}`);
}

export async function createDraft(token, raw) {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ message: { raw } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`gmail draft ${res.status}: ${JSON.stringify(data)}`);
  return data.id; // draft id
}
export async function sendDraft(token, draftId) {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ id: draftId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`gmail send ${res.status}: ${JSON.stringify(data)}`);
  return data;
}
