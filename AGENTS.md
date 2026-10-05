<!-- SHARED-MEMORY:START -->
# AGENTS.md: all agents read this first

**Project:** The Law Kaksha: Premier CA Foundation & CSEET Business Law learning platform offering structured video lectures, digital study material, tests, and mentorship.
**Stack:** Next.js 16 (React 19, Tailwind CSS v4) frontend on Vercel, Express.js (Node.js, MongoDB/Mongoose, local JSON DB fallback) backend on Render.
**Commands:** install `npm install` · dev `npm run dev` (frontend) / `npm run dev:backend` · build `npm run build:frontend` · test `npm test` · lint `npm run lint` (frontend) (all unverified until Phase 0 confirms them)
**Master plan:** `docs/agent/MASTER_PROMPT.md` (read only the phase you are working on, plus its Sections 2 and 3A)

## The one rule
Chat memory is NOT shared between agents or sessions. Files are. The shared memory is `docs/audit/`. If it is not written there, the next agent does not know it.

## Session start (every session, in this order)
1. Identify yourself: `muse` (Muse Spark in OpenCode), `gemini` (Gemini in Antigravity), or your model name. Use this id in every entry you write.
2. Read `docs/audit/HANDOFF.md`: who holds the baton, the next step, what is off-limits.
3. Read `docs/audit/PROGRESS.md`: phase status.
4. Read `LEARNINGS.md` and `DECISIONS.md` before touching structure, security, data or architecture. Read `PROJECT_UNDERSTANDING.md` when you need project context.
5. Take the baton: set Baton holder to your id with the current time (run `date`) and your task. If another agent holds a baton updated within the last 2 hours, do not edit anything. Work read-only and leave a message in HANDOFF, or ask the owner.
6. If `git status` shows uncommitted changes you did not make, stop and ask the owner.

## While working
- **Verify before trusting.** Anything another agent wrote is a claim. Check it against the code before relying on it, then mark it verified. Code wins over memory: if they disagree, fix the memory file and log it.
- **Targeted edits only.** Never rewrite a whole file for a small change, in code or in memory files. Append to logs. Edit only your own rows and sections.
- **Small, reversible steps:** tests before and after, small commits, never push or deploy. The prime directives are in MASTER_PROMPT.md Section 2.
- **Record as you go:** decisions go in `DECISIONS.md`, gotchas and working commands in `LEARNINGS.md`, anything needing the owner's yes in `NEEDS_APPROVAL.md`.
- **Never put secrets, tokens, personal data or exploit details in committed files.** Details of unfixed vulnerabilities go only in `docs/audit/private/SECURITY_NOTES.md` (gitignored). Committed files use IDs such as SEC-007.
- Tag every memory entry: `[agent YYYY-MM-DD src:path verified|assumed]`.

## Session end (every session, even if unfinished)
1. Run build, lint and tests. Commit your work.
2. Update your rows in `PROGRESS.md` (status, date, commit).
3. Append an entry to `SESSION_LOG.md`.
4. Rewrite `HANDOFF.md`: Next step, Open problems, Messages. Set Baton holder to `none`.

## Roles (the owner can change these)
- `muse`: reading and understanding the code, audits, reviews, second opinions on security and architecture.
- `gemini`: edits, tests, documentation, policy drafts.
- Owner: approves everything in `NEEDS_APPROVAL.md` and every approval gate.

## Owner settings
- Free-tier agents (`muse`) may read private or client code: UNKNOWN. Until the owner answers, `muse` must not open `.env*`, secrets or customer data files. If the answer is NO and you are `muse`, stop and tell the owner.
- Repo is or may become public: UNKNOWN (treat as YES until the owner answers).
- Parallel work (two agents editing at once): NO. If the owner allows it, use separate git worktrees and write shared memory only in the main worktree.

Full details: `docs/agent/PROTOCOL.md`
<!-- SHARED-MEMORY:END -->
