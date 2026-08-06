---
description: "/roast-install — command (install only). Deploys roast-full skill + slash commands; never roasts"
---

Install the Roast agent workflow. **Install only — do not roast.**

**First time / update?** Run in terminal:

```bash
npx @rapchic/roast install
```

This installs **global** (`~/.cursor/`) **and** **project** (`.cursor/` in this repo) by default.

**Global only:**

```bash
npx @rapchic/roast install --no-project
```

**If npm/network fails**, copy bundled files from the roastit package directory (when cloned or in `node_modules/@rapchic/roast/`):

- `commands/cursor/*.md` → `.cursor/commands/`
- `skills/roast/` → `.cursor/skills/roast/`
- `rules/roast.mdc` → `.cursor/rules/roast.mdc`

Or run locally: `node node_modules/@rapchic/roast/installer/bin/cli.js install`

**Confirm output lists:**

- `~/.cursor/skills/roast/SKILL.md` and/or `.cursor/skills/roast/SKILL.md`
- `.cursor/commands/roast.md`, `roast-only.md`, `roast-idea.md`, `roast-what.md`, `roast-learn.md`, `roast-install.md`
- `~/.cursor/rules/roast.mdc` and/or `.cursor/rules/roast.mdc`

Tell the user: **Restart Cursor**, then type **`/roast`** (command). The full playbook also appears as **`/roast-full`** (skill) — prefer the commands.

For teammates: commit `.cursor/commands/` and `.cursor/skills/roast/` — they get `/roast` without running install.
