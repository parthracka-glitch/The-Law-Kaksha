# Agent Memory & Collaboration Protocol

This document defines the rules for multi-agent collaboration across sessions on The Law Kaksha codebase.

## 1. Identity and Tags
- Every agent must use a stable identifier: `muse` (Muse Spark in OpenCode), `gemini` (Gemini in Antigravity), or its model name.
- Every entry in `PROGRESS.md`, `LEARNINGS.md`, `DECISIONS.md`, `NEEDS_APPROVAL.md`, and `SESSION_LOG.md` must be tagged:
  `[agent YYYY-MM-DD src:path verified|assumed]`
  Example: `[gemini 2026-10-05 src:backend/package.json verified]`

## 2. The Baton
- Only the agent currently holding the baton may edit project files or write shared memory files.
- **Session start:** Set `Baton holder` to your ID, `Since` to current ISO date-time (run `date`), and `Current task` in `docs/audit/HANDOFF.md`.
- **Session end:** Update tasks, clear `Baton holder` to `none`.
- **Stale batons:** If a baton is older than 2 hours without updates, verify `git status` and `git log`. If there are uncommitted changes you did not make, stop and ask the owner. Otherwise, you may take over the baton, noting the takeover in `HANDOFF.md` Messages.

## 3. Claims and Verification
- Any entry written by another agent is a claim until verified against the code.
- Mark items `verified` only after verifying against code, configurations, or command outputs.
- **Code wins over memory:** If code and memory files disagree, the code is authoritative. Fix the memory file and log the correction in `SESSION_LOG.md`.

## 4. Disagreements
- If two agents disagree on architecture, security, or implementation:
  1. Record both perspectives in `docs/audit/HANDOFF.md` Messages.
  2. Open an entry in `docs/audit/NEEDS_APPROVAL.md` with the arguments and tradeoffs.
  3. Defer the decision to the project owner.
  4. Do not flip-flop or undo decisions recorded in `docs/audit/DECISIONS.md` without explicit owner approval.

## 5. File Size and Hygiene
- `AGENTS.md`: Must stay at or under 100 lines.
- `docs/audit/HANDOFF.md`: Must stay at or under 60 lines.
- `docs/audit/PROGRESS.md`: Exactly one row per phase.
- `docs/audit/SESSION_LOG.md`: Append-only. When it exceeds 200 lines, archive older entries to `docs/audit/archive/SESSION_LOG_<YYYY-MM>.md` in a single batch.
- `docs/audit/LEARNINGS.md`: Consolidate and merge duplicate entries instead of appending redundant points.

## 6. Prohibited in Memory
- **Never** write secrets, API keys, tokens, passwords, customer data, or personally identifiable information (PII) into committed files.
- Exploit details of unfixed security vulnerabilities must never be placed in committed markdown files. Use vulnerability IDs (e.g. `SEC-001`) in public files and keep detailed proof-of-concept information in `docs/audit/private/SECURITY_NOTES.md` (which is strictly gitignored).

## 7. Parallel Work
- Parallel work (two agents editing code at the same time) is prohibited unless explicitly approved by the owner.
- If approved, agents must operate in separate Git worktrees and branches, synchronizing shared memory files only in the primary worktree.

## 8. Tool-Native Memory
- Antigravity Knowledge Items, OpenCode session history, and `/init` outputs are transient local helpers.
- Any durable insight, decision, convention, or learned command must be recorded in `docs/audit/LEARNINGS.md` or `docs/audit/DECISIONS.md`. Tool-specific internal state is never the project's source of truth.

## 9. Recovery
- If a shared memory file is corrupted, deleted, or incorrect, restore it from Git history (`git checkout` / `git restore`).
- Re-verify recovered statements against the live codebase. Never recreate memory files from imagination or training memory.

## 10. Copy-Paste Prompts

### START Prompt (to start a session)
```text
I am [muse|gemini] starting a session on The Law Kaksha. I will follow ./AGENTS.md and ./docs/agent/PROTOCOL.md.
First, I am checking docs/audit/HANDOFF.md for the baton and blockers, reading docs/audit/PROGRESS.md,
and verifying git status. I will take the baton in HANDOFF.md before performing any work.
```

### END Prompt (to conclude a session)
```text
I am concluding my session. I have verified my work, updated docs/audit/PROGRESS.md, logged
completed actions in docs/audit/SESSION_LOG.md, and updated docs/audit/HANDOFF.md with the next step
and set Baton holder to none.
```

### SWITCH Prompt (to pass baton to another agent)
```text
I have updated docs/audit/HANDOFF.md with the latest context and set Baton holder to none.
The baton is now available for [muse|gemini] to take over following docs/agent/PROTOCOL.md.
```

### PROMPT B (to paste into the other agent)
```text
Read AGENTS.md and start your session according to docs/audit/HANDOFF.md.
```
