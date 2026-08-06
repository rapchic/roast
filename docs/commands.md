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
| Learn project patterns | `/roast-learn` | command |
| Full playbook (direct) | `/roast-full` | **skill** |

`/roast-install` **never roasts** — it only installs or updates files.

Prefer **commands**. `/roast-full` is the skill (`skills/roast/SKILL.md`, frontmatter `name: roast-full`) — same product, not a second tool.

**Current version:** see `package.json` / `roastit --version` (0.x until 1.0 stability cut).

`/roast` checks for `~/.cursor/skills/roast/SKILL.md` (or project `.cursor/…`). If missing, it directs you to `/roast-install`.

## CLI vs slash

| Intent | Cursor slash | Terminal |
|--------|--------------|----------|
| Install / update | `/roast-install` | `npx roastit@latest install` |
| Roast + fix | `/roast` | (agent chat only) |
| Roast only | `/roast-only` | (agent chat only) |
| Plain English | `/roast-what` | (agent chat only) |
| Learn patterns | `/roast-learn` | (agent chat only) |
| Repo context JSON | — | `npx roastit context --format json` |
| Git diff signals | — | `npx roastit diff --base auto` |
| Short AGENTS.md (opt-in) | — | `npx roastit init --agents` |
| Check install | — | `npx roastit status` |
| Remove install | — | `npx roastit uninstall --tools cursor --yes` |

## CLI reference

### `roast install`

Install skill + slash commands: **global** IDE dirs **and** project `.cursor/` (default).

```bash
npx roastit@latest install
npx roastit install --no-project   # global only
npx roastit install --tools cursor,claude,codex
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
npx roastit init
npx roastit init --path /path/to/repo --yes
npx roastit init --agents          # opt-in short AGENTS.md (never during roast)
npx roastit init --agents --yes    # overwrite existing AGENTS.md
```

| Flag | Description |
|------|-------------|
| `--path <dir>` | Repository root (default: cwd) |
| `--yes` | Overwrite existing config / AGENTS.md |
| `--agents` | Write short AGENTS.md template instead of `.roast/config.json` |
| `--install` | Also run `install` after init |

### `roast update`

Fetches latest `roastit` from npm (`npx roastit@<ver> install …`), then deploys skill files.

```bash
npx roastit update
```

Editing this git repo? Don’t use `update` for local changes — run `roastit install` (or `npm run sync:project-cursor`). See `CONTRIBUTING.md`.

### `roast status`

Show installed version and update availability.

```bash
npx roastit status
```

### `roast uninstall`

Remove skill, commands, and rules.

```bash
npx roastit uninstall --tools cursor --yes
```

### `roast context`

Phase 0 INIT data — no LLM.

```bash
npx roastit context
npx roastit context --path . --format json
npx roastit context --target 'src/auth/**'
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
npx roastit diff --base auto
npx roastit diff --base auto --format json
npx roastit diff --committed-only --format json
npx roastit diff --since 1d --format json
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
npm install -g roastit
roast install
```

## Version

```bash
roast --version
```

Matches `package.json` semver. Skill `SKILL.md` frontmatter `version:` should match — see [CONTRIBUTING.md](../CONTRIBUTING.md).
