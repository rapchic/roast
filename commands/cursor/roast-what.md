---
description: "/roast-what — command (plain English). Explains the diff or a prior roast in layman's terms; no edits"
---

Read the **roast-full** skill (first path that exists): `~/.cursor/skills/roast/SKILL.md` or `.cursor/skills/roast/SKILL.md` (slash name: `/roast-full`)

**Mode:** `roast-what`

If missing: run **`/roast-install`**, or `npx -y roastit@latest bootstrap --yes` then restart Cursor — do not proceed with a vague summary.

**Job:** explain in **plain language** — no jargon wall, no comedy roast tone.

1. If this chat already has a roast/findings → translate **that** into layman's terms (do not re-triage unless asked).
2. Otherwise → Phase 0 INIT (JSON) → summarize **what changed** (diff/target) in plain English.

**Output:** short paragraphs a non-expert teammate could follow. One optional "so what?" line. Cite a file only when it helps orientation — not a full findings list.

**No file edits.** Scope ≤30 files from diff/target (ask if over). Be brief — no tool narration.
