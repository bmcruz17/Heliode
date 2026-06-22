# Heliode tools

## `lead_finder.py` — public lead-signal finder

Finds recent public discussions about GPU / inference **cost pain** and AI-infra
chatter, so you have a fresh list of threads to help in and people to reach out
to each week. It's the engine behind Channel 1 (outbound) and Channel 2 (be
where they complain) in the lead-gen playbook.

### What it does (and doesn't)
- ✅ Pulls from **Hacker News** (Algolia API) and **Reddit** (public JSON) — both
  free, public, no login.
- ❌ Does **not** scrape LinkedIn, Crunchbase, Apollo, etc. Those ban scraping in
  their terms, block you quickly, and break constantly. Build company lists from
  those by hand or with their official CSV exports.

### Easiest way to run it (no computer needed)
1. On GitHub, open the **Actions** tab.
2. Pick **"Lead signal finder"** → **Run workflow** (optionally change the day
   window) → **Run**.
3. Open the finished run — the report renders right on the **Summary** page.
   It also runs automatically every Monday morning.

### Run it locally (if you have Python 3.8+)
```bash
python tools/lead_finder.py --days 14 > signals.md
```
No dependencies to install — it uses only the Python standard library.

### Note on sources
**Hacker News is the reliable workhorse** — it returns rich results anywhere.
**Reddit often returns `403 Forbidden` from cloud/datacenter IPs** (including
GitHub Actions runners) because Reddit now gates its JSON behind OAuth for those
IPs. That's expected — the script skips it and continues on HN. For Reddit
results, run the script **locally** from a home/office network, or add Reddit
OAuth later. The stderr `[reddit/...] failed` lines are harmless.

### How to use the output
- **Cost & inference-pain discussions:** add a genuinely useful reply in the
  thread, then DM the author with the "send me your bill" offer.
- **Infra chatter:** research the company/person, then reach out.

Tune the keyword lists (`PAIN_QUERIES`, `HIRING_QUERIES`, `SUBREDDITS`) at the
top of `lead_finder.py` as you learn what surfaces good leads.
