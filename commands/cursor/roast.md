---
description: "/roast — command (roast-and-fix). Loads roast-full skill; not the same slash entry as /roast-full"
---

Read and follow the **roast-full** skill **immediately** (first path that exists):

1. `~/.cursor/skills/roast/SKILL.md` (global install) — slash name: **`/roast-full`**
2. `.cursor/skills/roast/SKILL.md` (project install — no global needed)

**Mode:** `roast-and-fix`

If **neither file exists**, tell the user to run **`/roast-install`**, or in the terminal:

```bash
npx -y roastit@latest bootstrap --yes
```

Or project-only:

```bash
npx -y roastit@latest install --tools cursor --project --yes
```

After install: restart Cursor. Do not proceed with a vague review.

Then: Phase 0 INIT (JSON) → scope budget ≤30 files → **compact** roast → minimal fixes → verify.

Be brief — no tool narration. No unsolicited roast `.md` files. Evidence: `path:line` OR diff OR test/CI. Do not create `AGENTS.md` during roast.
