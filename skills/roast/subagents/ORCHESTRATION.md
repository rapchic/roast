# Subagent orchestration

Parent roast agent loads this when `scopeBudget.overBudget` or user asks for deep/whole-repo roast.

Prompt file to give each explorer: [`explorer.md`](explorer.md)

## When

| Condition | Action |
|-----------|--------|
| ≤ 30 files | **Never auto-spawn** — parent only. User may still opt in explicitly. |
| > 30 files | Ask: narrow **or** expand with explorers |
| User opts in | Spawn explorers (even if ≤30) |

## How

1. Split `roast diff` `byArea` into ≤ **4** buckets
2. For each bucket, spawn a **read-only** Task (`explore` or `generalPurpose`) with:
   - Contents of `subagents/explorer.md`
   - Exact file list for that area
3. Merge findings: dedupe by evidence key (`path:line` / claim), triage, one compact roast
4. Fix modes: **parent only** patches — explorers never edit

## Evidence

Explorers primarily return `path:line`. Parent allows the same evidence types as the skill: `path:line` OR diff hunk OR test/CI output.

## Anti-patterns

- Auto-spawning subagents for ≤30 files (opt-in is fine)
- Explorers re-running INIT / reading full skill pack
- Overlapping file lists
- More than 4 explorers
