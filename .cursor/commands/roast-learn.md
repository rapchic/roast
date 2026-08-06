---
description: "/roast-learn — learn patterns & antipatterns (once or continuous; optional chat transcripts)"
---

Read the **roast-full** skill (first path that exists): `~/.cursor/skills/roast/SKILL.md` or `.cursor/skills/roast/SKILL.md` (slash name: `/roast-full`)

**Mode:** `roast-learn`

If missing: run **`/roast-install`**, or `npx @rapchic/roast install` then restart Cursor — do not proceed with a vague “style guide.”

## Learning modes (parse from user text)

| Intent | Behavior |
|--------|----------|
| *(default)* / `once` / `one-time` | Single upsert from **code + conventions** (and this chat’s roast if any). Does **not** flip continuous on. |
| `continuous` / `keep learning` / `enable continuous` | Upsert now **and** set `learningMode: continuous` in `.cursor/rules/roast-patterns.mdc`. Later `/roast-learn` (and `/roast` when continuous) keep merging. |
| `stop continuous` / `once only` | Set `learningMode: once` (still upsert this run if asked). |
| `transcripts` / `from chat` / `from transcripts` | **Also** scan Cursor agent transcripts for this workspace (see below). Can combine with `once` or `continuous`. |

If existing `roast-patterns.mdc` has `learningMode: continuous` and user didn’t say `once`, treat this run as continuous merge (keep prior evidenced items; add/refresh).

## Job

1. Phase 0 INIT (JSON).
2. Read existing convention sources + current `.cursor/rules/roast-patterns.mdc` if present.
3. Sample ≤30 representative files (layout hubs + examples per area + recent diff). Ask before expanding.
4. If this chat already has a roast → fold findings into antipatterns (with evidence).
5. **If transcripts requested (or continuous + `includeTranscripts: true`):** scan parent agent transcripts only — see skill `references/modes.md` → roast-learn. Cite as `transcript:<uuid>` (or chat title) + the claimed pattern; still require a repo `path:line` when the transcript points at code.
6. **Write/update** `.cursor/rules/roast-patterns.mdc` (template: skill `assets/templates/roast-patterns.mdc`). Upsert; drop stale; never invent without evidence.
7. Set frontmatter / header fields: `learningMode`, `includeTranscripts`, **Last learned**, optional **Last transcript scan**.
8. Chat: compact **Learned** summary. **No code fixes.**

Be brief — no tool narration.
