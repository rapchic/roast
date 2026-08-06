# Security Policy

## Reporting a vulnerability

If you discover a security issue, please **do not** open a public issue with exploit details.

Email or open a private security advisory on GitHub (when available) with:

- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

We aim to acknowledge reports within 5 business days.

## Scope

### In scope

- The `roast` CLI (`installer/`, `scripts/`)
- Install/copy behavior (path traversal, arbitrary file write)
- Supply-chain concerns in published npm package contents

### Out of scope

- Code reviewed **by** the roast skill in user repositories (user-controlled)
- Third-party IDEs (Cursor, Claude Code, Codex) and their security models
- npm registry account compromise (report to npm)

## Design assumptions

- **Local-only CLI** — no network calls except optional npm registry version check on `roast status` / `roast update`
- **No secrets collection** — the CLI does not read, store, or transmit API keys, tokens, or repository credentials
- **User home writes** — `roast install` copies bundled skill/commands to `~/.cursor/`, `~/.claude/`, or `~/.codex/` as documented
- **No LLM** — agents run roasts; this package only installs files and gathers git/context metadata

## Safe usage

- Review bundled skill and command files before installing in sensitive environments
- Use `npm view roastit` / verify package checksum when installing from npm
- Prefer pinned versions in CI: `npx roastit@0.1.0 install --yes`

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |
| < 1.0   | No        |
