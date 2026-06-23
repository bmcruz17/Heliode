// Heliode — admin-create-user edge function
// Lets an authenticated ADMIN create a real, auto-confirmed login (and add it
// to the right allowlist) directly from the dashboard — no Supabase console,
// no invite emails, no rate limits.
//
// Security: uses the service-role key (server-side only, auto-injected by
// Supabase). It first verifies the CALLER is an admin via their own JWT
// before doing anything privileged.
//
// Deploy:  supabase functions deploy admin-create-user   (Verify JWT = ON)
// No extra secrets needed — SUPABASE_URL / SUPABASE_ANON_KEY /
// SUPABASE_SERVICE_ROLE_KEY are provided to every function automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";

    // 1. Verify the caller is a signed-in admin (using THEIR token).
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "Not signed in." }, 401);
    const { data: isAdmin } = await caller.rpc("is_admin");
    if (!isAdmin) return json({ error: "Admins only." }, 403);

    // 2. Inputs.
    const { email, password, role = "admin", name = null, phone = null, firm = null, override_pct = null } =
      await req.json();
    if (!email || !password) return json({ error: "email and password are required." }, 400);
    if (String(password).length < 6) return json({ error: "Password must be at least 6 characters." }, 400);
    const em = String(email).trim().toLowerCase();

    // 3. Create (or find) the auth user — auto-confirmed, no email sent.
    const admin = createClient(url, service);
    let uid: string | null = null;
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email: em, password, email_confirm: true,
    });
    if (created?.user) {
      uid = created.user.id;
    } else if (cErr && /already|exists|registered/i.test(cErr.message)) {
      // User exists — look them up and reset their password so the admin's value works.
      const { data: list } = await admin.auth.admin.listUsers();
      const found = list?.users?.find((u) => (u.email || "").toLowerCase() === em);
      if (found) { uid = found.id; await admin.auth.admin.updateUserById(found.id, { password, email_confirm: true }); }
    } else if (cErr) {
      return json({ error: cErr.message }, 400);
    }

    // 4. Upsert into the correct allowlist so is_admin/is_rep/is_investor pass.
    const tbl = role === "rep" ? "reps" : role === "investor" ? "investors" : "admins";
    const row: Record<string, unknown> = { email: em, user_id: uid };
    if (role === "rep") { row.name = name; row.phone = phone; row.override_pct = override_pct ?? 17.5; }
    else if (role === "investor") { row.name = name; row.firm = firm; }
    else { row.name = name; }
    const { error: uErr } = await admin.from(tbl).upsert(row, { onConflict: "email" });
    if (uErr) return json({ error: `User created, but allowlist update failed: ${uErr.message}` }, 500);

    return json({ ok: true, role, email: em, user_id: uid });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
