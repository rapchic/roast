---
description: "/roast-learn — command. Learns this project's patterns & antipatterns; writes .cursor/rules/roast-patterns.mdc"
---

Read the **roast-full** skill (first path that exists): `~/.cursor/skills/roast/SKILL.md` or `.cursor/skills/roast/SKILL.md` (slash name: `/roast-full`)

**Mode:** `roast-learn`

If missing: run **`/roast-install`**, or `npx -y roastit@latest bootstrap --yes` then restart Cursor — do not proceed with a vague “style guide.”

**Job:** learn **this workspace’s** real patterns and antipatterns from code + existing conventions — then persist them for future roasts.

1. Phase 0 INIT (JSON).
2. Read existing convention sources from INIT (AGENTS.md, `.cursor/rules/*`, CONTRIBUTING) — merge, don’t contradict without evidence.
3. Sample ≤30 representative files (layout hubs + a few examples per area + recent diff if any). Ask before expanding past budget.
4. If this chat already has a roast → fold those findings into antipatterns (with evidence).
5. **Write/update** `.cursor/rules/roast-patterns.mdc` (upsert — keep prior learnings that still have evidence; drop stale ones).
6. Chat: compact **Learned** summary (patterns / antipatterns / file written). **No code fixes.**

Be brief — no tool narration. Every learned item needs a `path:line` (or clear convention-file cite).
