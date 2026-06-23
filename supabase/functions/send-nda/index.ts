// Heliode — send-nda edge function
// Emails a signed NDA PDF (base64) to the signer's personal email via Resend.
//
// SETUP (one time):
//   1. Create a free account at https://resend.com and an API key.
//   2. In Supabase: Project Settings → Edge Functions → Secrets, add:
//        RESEND_API_KEY = re_xxxxxxxx
//        NDA_FROM       = "Heliode <nda@heliodegrid.com>"   (optional)
//      Until you verify heliodegrid.com in Resend, leave NDA_FROM unset and
//      it falls back to Resend's test sender (onboarding@resend.dev).
//   3. Deploy:  supabase functions deploy send-nda
//      (or ask Claude to deploy it via the Supabase MCP.)
//
// The function requires a valid Supabase JWT (default verify_jwt = true),
// so only signed-in users can call it.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // Verify the caller is a signed-in user INSIDE the function, so the
    // gateway's "Verify JWT" can be OFF (which is what lets the browser's
    // CORS preflight through). Prevents the function being an open relay.
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Not signed in." }),
      { status: 401, headers: { ...CORS, "Content-Type": "application/json" } });

    const { to, full_name, pdf_base64, nda_version } = await req.json();
    if (!to || !pdf_base64) {
      return new Response(JSON.stringify({ error: "Missing 'to' or 'pdf_base64'." }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set." }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    const from = Deno.env.get("NDA_FROM") || "Heliode <onboarding@resend.dev>";

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Your signed Heliode confidentiality agreement",
        html:
          `<p>Hi ${full_name || "there"},</p>` +
          `<p>Thank you for signing the Heliode confidentiality agreement (version ${nda_version || "current"}). ` +
          `A signed PDF copy is attached for your records.</p>` +
          `<p>Welcome aboard.<br>— Heliode · ATMX Holdings</p>`,
        attachments: [{ filename: "Heliode-NDA.pdf", content: pdf_base64 }],
      }),
    });

    const body = await resp.text();
    return new Response(JSON.stringify({ ok: resp.ok, detail: body }), {
      status: resp.ok ? 200 : 502, headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
