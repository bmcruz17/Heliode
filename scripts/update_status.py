#!/usr/bin/env python3
"""Nightly STATUS.md checkpoint — runs in GitHub Actions.

Deterministic and safe: it never rewrites task content (that needs judgment).
It (1) stamps the current date, and (2) prepends a dated checkpoint to the
Daily Log with live countdowns to the fixed deadlines, so each morning the
nearest hard dates are accurate. Intelligent roll-forward of tasks stays a
session job ("update STATUS").
"""
from datetime import date
from pathlib import Path
from zoneinfo import ZoneInfo
from datetime import datetime

# Fixed, known deadlines. Add/edit here as they change.
DEADLINES = [
    ("2026-06-26", "Dell call with Drew"),
    ("2026-06-29", "RunPod call with Zach"),
    ("2026-07-08", "83(b) election filing (HARD)"),
]

STATUS = Path("STATUS.md")
TODAY = datetime.now(ZoneInfo("America/Chicago")).date()


def countdown_lines():
    out = []
    for iso, label in DEADLINES:
        d = date.fromisoformat(iso)
        days = (d - TODAY).days
        if days < 0:
            continue
        if days == 0:
            tag = "**TODAY**"
        elif days <= 3:
            tag = f"🔴 {days}d"
        elif days <= 7:
            tag = f"🟠 {days}d"
        else:
            tag = f"🟡 {days}d"
        out.append(f"  - {tag} — {label} ({iso})")
    return out or ["  - No fixed deadlines remaining — set the next ones."]


def main():
    text = STATUS.read_text(encoding="utf-8")
    lines = text.splitlines()

    # 1) Stamp "Last updated:"
    for i, ln in enumerate(lines):
        if ln.startswith("**Last updated:**"):
            lines[i] = (
                f"**Last updated:** {TODAY} (auto nightly checkpoint) · "
                f"**Maintained by:** nightly GitHub Action + Brandon"
            )
            break

    # 2) Prepend today's checkpoint under the Daily log header (idempotent per day)
    marker = "## 📝 Daily log"
    todays_header = f"### {TODAY}"
    if marker in lines and todays_header not in lines:
        idx = lines.index(marker)
        entry = [
            "",
            todays_header,
            "- ⏱️ Auto-checkpoint. Nearest deadlines:",
            *countdown_lines(),
            "- Review **Today's Top 3** above and update tasks in-session "
            "(say \"update STATUS\").",
        ]
        lines[idx + 1 : idx + 1] = entry

    STATUS.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"STATUS.md checkpoint written for {TODAY}.")


if __name__ == "__main__":
    main()
