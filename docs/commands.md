# Commands

CLI subcommands and Cursor slash commands in one place.

## Cursor slash commands

| Intent | Slash | Kind |
|--------|-------|------|
| Install / update skill pack | `/roast-install` | command |
| Roast + fix | `/roast` | command |
| Roast only (verdict) | `/roast-only` | command |
| Roast idea before build | `/roast-idea` | command |
| Plain-English explainer | `/roast-what` | command |
| Learn project patterns | `/roast-learn` | command — `once` (default), `continuous`, optional `transcripts` |
| Full playbook (direct) | `/roast-full` | **skill** |

`/roast-install` **never roasts** — it only installs or updates files.

Prefer **commands**. `/roast-full` is the skill (`skills/roast/SKILL.md`, frontmatter `name: roast-full`) — same product, not a second tool.

### `/roast-learn` modes

| Say in chat | Effect |
|-------------|--------|
| `/roast-learn` (default) | **Once** — upsert patterns from code + conventions (+ this chat’s roast) |
| `/roast-learn continuous` | Upsert **and** set `learningMode: continuous` so later learns / `/roast` keep merging |
| `/roast-learn transcripts` | Also mine Cursor agent transcripts for this workspace (one-shot unless continuous) |
| `/roast-learn continuous transcripts` | Continuous + transcript mining (`includeTranscripts: true`) |

Writes only `.cursor/rules/roast-patterns.mdc`. See skill `references/modes.md`.

**Current version:** see `package.json` / `roast --version` (0.x until 1.0 stability cut).

`/roast` checks for `~/.cursor/skills/roast/SKILL.md` (or project `.cursor/…`). If missing, it directs you to `/roast-install`.

## CLI vs slash

| Intent | Cursor slash | Terminal |
|--------|--------------|----------|
| Install / update | `/roast-install` | `npx @rapchic/roast install` |
| Roast + fix | `/roast` | (agent chat only) |
| Roast only | `/roast-only` | (agent chat only) |
| Plain English | `/roast-what` | (agent chat only) |
| Learn patterns | `/roast-learn` | (agent chat only — once / continuous / transcripts) |
| Repo context JSON | — | `npx @rapchic/roast context --format json` |
| Git diff signals | — | `npx @rapchic/roast diff --base auto` |
| Short AGENTS.md (opt-in) | — | `npx @rapchic/roast init --agents` |
| Check install | — | `npx @rapchic/roast status` |
| Remove install | — | `npx @rapchic/roast uninstall --tools cursor --yes` |

## CLI reference

### `roast install`

Install skill + slash commands: **global** IDE dirs **and** project `.cursor/` (default).

```bash
npx @rapchic/roast install
npx @rapchic/roast install --no-project   # global only
npx @rapchic/roast install --tools cursor,claude,codex
```

| Flag | Description |
|------|-------------|
| `--tools <clients>` | `cursor`, `claude`, `codex` (comma-separated; default: auto-detect, else cursor) |
| `--no-project` | Skip project `.cursor/` |
| `--path <dir>` | Project root for `.cursor/` |

**Cursor installs:**

- `~/.cursor/skills/roast/SKILL.md`
- `~/.cursor/commands/roast.md`, `roast-only.md`, `roast-idea.md`, `roast-what.md`, `roast-learn.md`, `roast-install.md`
- `~/.cursor/rules/roast.mdc`
- Plus the same under `.cursor/` in the current repo (unless `--no-project`)

`roast bootstrap` is a **deprecated alias** for `install` (same flags).

### `roast init`

Detect repo and IDE; write `.roast/config.json`. Or write a short `AGENTS.md` with `--agents`.

```bash
npx @rapchic/roast init
npx @rapchic/roast init --path /path/to/repo --yes
npx @rapchic/roast init --agents          # opt-in short AGENTS.md (never during roast)
npx @rapchic/roast init --agents --yes    # overwrite existing AGENTS.md
```

| Flag | Description |
|------|-------------|
| `--path <dir>` | Repository root (default: cwd) |
| `--yes` | Overwrite existing config / AGENTS.md |
| `--agents` | Write short AGENTS.md template instead of `.roast/config.json` |
| `--install` | Also run `install` after init |

### `roast update`

Fetches latest `@rapchic/roast` from npm (`npx @rapchic/roast@<ver> install …`), then deploys skill files.

```bash
npx @rapchic/roast update
```

Editing this git repo? Don’t use `update` for local changes — run `roast install` (or `npm run sync:project-cursor`). See `CONTRIBUTING.md`.

### `roast status`

Show installed version and update availability.

```bash
npx @rapchic/roast status
```

### `roast uninstall`

Remove skill, commands, and rules.

```bash
npx @rapchic/roast uninstall --tools cursor --yes
```

### `roast context`

Phase 0 INIT data — no LLM.

```bash
npx @rapchic/roast context
npx @rapchic/roast context --path . --format json
npx @rapchic/roast context --target 'src/auth/**'
```

| Flag | Description |
|------|-------------|
| `--path <dir>` | Repository root |
| `--target <glob>` | Blast radius file count |
| `--format markdown\|json` | Output format |

Detects: Node, Python, Go, Rust, Java manifests; scripts; AGENTS.md / rules; CI workflow names.

### `roast diff`

Git diff signals for roast scope — no LLM. **Includes working tree + untracked** by default.

```bash
npx @rapchic/roast diff --base auto
npx @rapchic/roast diff --base auto --format json
npx @rapchic/roast diff --committed-only --format json
npx @rapchic/roast diff --since 1d --format json
```

| Flag | Description |
|------|-------------|
| `--path <dir>` | Repository root |
| `--base <branch>` | Base branch or `auto` |
| `--since <duration>` | e.g. `1d`, `12h`, `30m` |
| `--committed-only` | Ignore dirty/untracked files |
| `--format markdown\|json` | Output format |

Base detection: `origin/HEAD` → `origin/main` → `origin/master`. Scope budget default: **30** files.

## Global install

```bash
npm install -g @rapchic/roast
roast install
```

## Version

```bash
roast --version
```

Matches `package.json` semver. Skill `SKILL.md` frontmatter `version:` should match — see [CONTRIBUTING.md](../CONTRIBUTING.md).
