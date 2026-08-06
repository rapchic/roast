# Roast modes

All modes share Phase 0 INIT and evidence requirements. Mode controls edits and fix aggressiveness.

## Slash → mode

| Slash | Kind | Mode |
|-------|------|------|
| `/roast` | command | roast-and-fix |
| `/roast-only` | command | roast-only |
| `/roast-idea` | command | roast-idea |
| `/roast-what` | command | roast-what |
| `/roast-learn` | command | roast-learn |
| `/roast-install` | command | *(install only — not a roast mode)* |
| `/roast-full` | skill | *(loads playbook; mode from user wording)* |

| Mode | Triggers | Edits |
|------|----------|-------|
| **roast-only** | `/roast-only`, "roast independently", "just roast" | No |
| **roast-and-fix** | `/roast`, "roast and fix" | Yes — minimal diff |
| **roast-idea** | `/roast-idea`, "roast this idea before implementing" | No |
| **roast-what** | `/roast-what`, "eli5", "what changed", "explain the roast" | No |
| **roast-learn** | `/roast-learn`, "learn patterns", "learn this repo" | `.cursor/rules/roast-patterns.mdc` only |
| **roast-then-build** | "roast then build/implement" | After user agrees |
| **roast-then-apply** | "preview, roast fix, apply" | After preview approval |
| **roast-no-patch** | "don't patch", "senior architect", "no band-aids" | Structural only |

## roast-only

Verdict with evidence (`path:line` OR diff OR test/CI). No file edits unless user escalates.

**Scope aliases** (chat intent only — no separate command files): UI-only or API-only roast-only.

## roast-and-fix

Default for `/roast`. INIT → findings → fix path → apply → test/lint/build.

## roast-idea

Critique proposals before code. Plan/INIT evidence OK; `path:line` when citing existing code.

## roast-what

Plain-English summary of the **diff** or a **prior roast** in chat. No edits, no severity findings list.

## roast-learn

Sample this repo (≤30 files), extract patterns & antipatterns with evidence, upsert `.cursor/rules/roast-patterns.mdc` for later roasts. No code fixes.

## roast-then-build / roast-then-apply

Roast first; implement only after explicit agreement.

## roast-no-patch

Reject symptom fixes. Structural path only.

## Algorithm

```
0. INIT → 1. SCOPE → 2. READ → 3. EVIDENCE → 4. TRIAGE → 5. VERDICT → [6. PATH → 7. ACT → 8. VERIFY]
```

Steps 6–8 only in fix modes.

Skill reference: `skills/roast/references/modes.md`.
