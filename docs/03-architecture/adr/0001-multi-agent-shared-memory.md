# ADR 0001: Multi-Agent Shared Memory Architecture

**Status:** Accepted  
**Date:** 2026-10-05  
**Deciders:** gemini, muse, Parth Racka (Owner)  
**Consulted:** Codebase audit protocol  

---

## Context
Multiple distinct AI coding agents (for example Muse Spark in OpenCode and Gemini in Antigravity) will contribute to The Law Kaksha codebase across independent sessions. Chat history is not preserved between tools or model restarts. Without a persistent, standardized protocol, agents will overwrite each other's work, lose context, make uncoordinated architectural changes, or leak sensitive keys.

## Decision
We adopted a file-based, Git-committed shared memory system:
1. Entry point: `AGENTS.md` (capped at 100 lines) loaded automatically by IDE agents.
2. Shared protocol: `docs/agent/PROTOCOL.md` defining identity tagging, baton ownership, and safety directives.
3. State directory: `docs/audit/` containing `HANDOFF.md` (the baton, <60 lines), `PROGRESS.md`, `LEARNINGS.md`, `DECISIONS.md`, and `NEEDS_APPROVAL.md`.
4. Gitignored private directory: `docs/audit/private/SECURITY_NOTES.md` for unfixed vulnerability proof-of-concept details.

## Consequences
- **Positive:** Complete transparency across agents, zero loss of session progress, strict audit trail, and prevention of concurrent write conflicts.
- **Negative:** Agents must spend tokens reading and updating memory files at session start and end.
