// /api/google-callback — OAuth redirect target. Exchanges code, stores the
// refresh token keyed by the Gmail address that authorized, then closes the popup.
import { exchangeCode, accessToken, gmailProfile, saveRefresh } from './_google.js';

function closePage(msg, ok) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;padding:40px;text-align:center">
     <h2>${ok ? '✓ Connected' : '⚠ Error'}</h2><p>${msg}</p>
     <script>try{window.opener&&window.opener.postMessage({heliodeGoogle:${ok}},'*')}catch(e){};setTimeout(()=>window.close(),1500)</script>
     </body>`,
    { headers: { 'content-type': 'text/html' } },
  );
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const err = url.searchParams.get('error');
  if (err) return closePage(`Google said: ${err}`, false);
  if (!code) return closePage('No code returned.', false);
  try {
    const tok = await exchangeCode(env, url.origin, code);
    if (!tok.refresh_token)
      return closePage('No refresh token (revoke prior access at myaccount.google.com → re-try).', false);
    const at = await accessToken(env, tok.refresh_token);
    const prof = await gmailProfile(at);
    await saveRefresh(env, prof.emailAddress, tok.refresh_token);
    return closePage(`Gmail connected for ${prof.emailAddress}. You can close this window.`, true);
  } catch (e) {
    return closePage(String(e.message || e), false);
  }
}
