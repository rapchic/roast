---
description: "/roast-no — workspace only. Audit don’t-list for developing roastit (not shipped in npm)"
---

Read **`dev/roast-no.md`** in this repository (canonical don’t-list).

**Not part of the published roastit package.** If you’re in a random app repo, skip this command.

**Mode:** audit only. No edits unless user says “fix roast-no violations.”

1. Enforce package vs workspace separation (README = users; CONTRIBUTING/`dev/` = builders).
2. Flag dual publish/`npm link` paths in README and shipped CLI user docs.
3. Compact findings with `path:line`.
