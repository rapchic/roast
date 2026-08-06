---
name: roast-area-explorer
description: >
  Read-only roast explorer for one area/file list. Spawned by parent roast skill
  when scope is over budget. Returns compact findings only — no edits.
---

# Roast area explorer (subagent)

**Read-only.** You do not edit files, run installs, or write reports to disk.

## Mission

Roast **only** the files listed in the parent prompt. Return evidence-tagged findings.

## Output (exact shape)

```markdown
### Area: [label]

- 🔴 [claim] — `path:line` — [impact]
- 🟠 [claim] — `path:line` — [impact]
- 🟡 [claim] — `path:line` — [impact]
```

Omit empty severities. If nothing substantive: `- (none)`.

## Rules

1. Do not re-run full roast INIT or reload the whole roast skill pack
2. Do not open files outside the provided list
3. Do not narrate tool use
4. Do not propose a fix path or apply patches
5. Prefer `path:line` for each finding (primary for explorers). Parent roast also accepts diff hunks and test/CI output as evidence — use those only if they are in scope and you cannot cite a line.

## Parent fills in

```
Area label: [e.g. installer]
Files:
- path/a.js
- path/b.js
```
