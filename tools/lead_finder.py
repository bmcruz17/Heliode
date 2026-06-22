#!/usr/bin/env python3
"""Heliode lead-signal finder.

Pulls public signals about GPU / inference cost pain and AI-infra chatter from
Hacker News (Algolia API) and Reddit (public JSON) so you can find teams to
reach out to or threads to help in.

Uses ONLY public, no-auth APIs. It deliberately does NOT scrape LinkedIn,
Crunchbase, Apollo, etc. — that violates their terms, breaks constantly, and
gets your IP/account banned. Build your company list from those by hand or with
their official exports.

Usage:
    python tools/lead_finder.py --days 14

Prints a Markdown report to stdout (pipe it to a file or a GitHub step summary).
Stdlib only — no pip install needed. Works on Python 3.8+.
"""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta

UA = "HeliodeLeadFinder/1.0 (+https://heliodegrid.com)"

# Threads where buyers complain about cost — join the thread, then DM the author.
PAIN_QUERIES = [
    "inference cost", "cost of inference", "GPU bill", "GPU pricing",
    "H100 price", "vLLM cost", "cut inference cost", "self-host LLM cost",
]
# Comment chatter that flags teams spending on inference infra.
HIRING_QUERIES = ["inference infrastructure", "LLM infrastructure", "ML platform GPU"]
SUBREDDITS = ["LocalLLaMA", "MachineLearning", "mlops"]


def _get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)


def hn(query, tags, since):
    qs = urllib.parse.urlencode({
        "query": query, "tags": tags,
        "numericFilters": f"created_at_i>{since}", "hitsPerPage": 30,
    })
    url = f"https://hn.algolia.com/api/v1/search_by_date?{qs}"
    out = []
    try:
        data = _get(url)
    except Exception as e:  # noqa: BLE001 - best effort per source
        sys.stderr.write(f"[hn] {query!r} failed: {e}\n")
        return out
    for h in data.get("hits", []):
        title = h.get("title") or h.get("story_title") or (h.get("comment_text") or "")[:90]
        if not title:
            continue
        oid = h.get("objectID")
        link = h.get("url") or f"https://news.ycombinator.com/item?id={oid}"
        out.append({
            "date": datetime.fromtimestamp(h["created_at_i"], timezone.utc).strftime("%Y-%m-%d"),
            "source": "HN",
            "title": " ".join(title.split()),
            "url": link,
            "meta": f'{h.get("points") or 0} pts · {h.get("num_comments") or 0} comments',
            "ts": h["created_at_i"],
        })
    return out


def reddit(sub, query, since):
    qs = urllib.parse.urlencode({
        "q": query, "restrict_sr": 1, "sort": "new", "limit": 25, "t": "month",
    })
    url = f"https://www.reddit.com/r/{sub}/search.json?{qs}"
    out = []
    try:
        data = _get(url)
    except Exception as e:  # noqa: BLE001
        sys.stderr.write(f"[reddit/{sub}] {query!r} failed: {e}\n")
        return out
    for c in data.get("data", {}).get("children", []):
        d = c.get("data", {})
        ts = int(d.get("created_utc", 0))
        if ts < since:
            continue
        out.append({
            "date": datetime.fromtimestamp(ts, timezone.utc).strftime("%Y-%m-%d"),
            "source": f"r/{sub}",
            "title": " ".join((d.get("title") or "").split()),
            "url": "https://www.reddit.com" + d.get("permalink", ""),
            "meta": f'{d.get("score") or 0} pts · {d.get("num_comments") or 0} comments',
            "ts": ts,
        })
    return out


def dedupe(items):
    seen, out = set(), []
    for it in sorted(items, key=lambda x: x["ts"], reverse=True):
        if it["url"] in seen:
            continue
        seen.add(it["url"])
        out.append(it)
    return out


def fmt(items):
    if not items:
        return "_No signals in this window._"
    return "\n".join(
        f'- **{it["date"]}** · {it["source"]} · [{it["title"]}]({it["url"]}) — {it["meta"]}'
        for it in items
    )


def main():
    ap = argparse.ArgumentParser(description="Find public GPU/inference lead signals.")
    ap.add_argument("--days", type=int, default=14, help="look-back window in days")
    args = ap.parse_args()
    since = int((datetime.now(timezone.utc) - timedelta(days=args.days)).timestamp())

    pain, infra = [], []
    for q in PAIN_QUERIES:
        pain += hn(q, "story", since)
        time.sleep(0.3)
    for sub in SUBREDDITS:
        for q in PAIN_QUERIES[:4]:
            pain += reddit(sub, q, since)
            time.sleep(0.5)
    for q in HIRING_QUERIES:
        infra += hn(q, "comment", since)
        time.sleep(0.3)

    pain, infra = dedupe(pain), dedupe(infra)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    print(f"# Heliode lead signals — {today} (last {args.days} days)\n")
    print("## 💬 Cost & inference-pain discussions — add a helpful reply, then DM the author\n")
    print(fmt(pain) + "\n")
    print("## 🏗️ Infra chatter — teams spending on inference (research, then reach out)\n")
    print(fmt(infra) + "\n")
    print(
        f"\n_{len(pain) + len(infra)} signals from public sources only "
        "(Hacker News Algolia API, Reddit public JSON). No LinkedIn/Crunchbase scraping. "
        "Generated by tools/lead_finder.py._"
    )


if __name__ == "__main__":
    main()
