---
description: "/roast-install — command (install only). Deploys roast-full skill + slash commands; never roasts"
---

Install the Roast agent workflow. **Install only — do not roast.**

**First time (no skill on disk yet)?** Run in terminal:

```bash
npx -y roastit@latest bootstrap --yes
```

This installs **global** (`~/.cursor/`) **and** **project** (`.cursor/` in this repo) in one step.

**Reinstall / update only:**

```bash
npx roastit install --tools cursor --yes
```

**If npm/network fails**, copy bundled files from the roastit package directory (when cloned or in `node_modules/roastit/`):

- `commands/cursor/*.md` → `.cursor/commands/`
- `skills/roast/` → `.cursor/skills/roast/`
- `rules/roast.mdc` → `.cursor/rules/roast.mdc`

Or run locally: `node node_modules/roastit/installer/bin/cli.js bootstrap --yes`

**Confirm output lists:**

- `~/.cursor/skills/roast/SKILL.md` and/or `.cursor/skills/roast/SKILL.md`
- `.cursor/commands/roast.md`, `roast-only.md`, `roast-idea.md`, `roast-what.md`, `roast-learn.md`, `roast-install.md`
- `~/.cursor/rules/roast.mdc` and/or `.cursor/rules/roast.mdc`

Tell the user: **Restart Cursor**, then type **`/roast`** (command). The full playbook also appears as **`/roast-full`** (skill) — prefer the commands.

For teammates: commit `.cursor/commands/` and `.cursor/skills/roast/` — they get `/roast` without running bootstrap.
