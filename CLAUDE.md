# Heliode — working conventions for Claude

## Database changes — ALWAYS, by default
Whenever a change touches the database (new table/column, function, RLS, seed data, or
editing DB-stored content like the business plan):
1. **Lead with the exact SQL to run** — paste-ready, in a code block, safe to re-run (idempotent).
2. Give **explicit, simple, step-by-step instructions** a non-engineer can follow (where to paste,
   what to click, how to verify).
3. Keep **`sql/README.md`** updated as the single ordered "run these in Supabase" index.
4. Never silently rely on a schema change — if SQL is needed, surface it.

Do this without being asked. The user has set this as a standing default.

## Other standing notes
- Live site deploys from `main` (GitHub Pages). Operator dashboard + `/functions` deploy via
  Cloudflare Pages from the same repo. Don't break the marketing site.
- Reuse the existing Supabase project (`pyosjuuvbxzyjtokfqfu`); operator tables are `heliode_*`.
- Secrets (service role, Anthropic, provider keys) live in Cloudflare only — never client-side.
- Commit + push to `main` when work is complete.
