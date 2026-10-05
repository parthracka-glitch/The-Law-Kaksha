# Universal Codebase Audit, Cleanup, Hardening & Launch-Readiness Prompt

Paste everything below the line into your coding agent. It assumes the agent has already scanned the project, so there is no form to fill in.

---

## 0. PROJECT KNOWLEDGE (you already have it: use it, then verify it)

You have already scanned this entire project. Do not ask the owner to re-explain it and do not start from zero. Treat what you already know as your starting hypothesis, not as proven fact.

Before changing anything, write `docs/audit/PROJECT_UNDERSTANDING.md` containing:

1. **Product:** name, purpose in one paragraph, the problem it solves, and who uses it (customers, admins, staff, partners).
2. **Business context:** how the product is meant to earn money, save money or deliver value, and what a successful launch looks like for it.
3. **Technical shape:** stack, architecture, data stores, third-party integrations, deployment target.
4. **Contracts that must NOT change:** public URLs, API request/response shapes, DB collection/table and field names, env var names, webhook endpoints, third-party integrations.
5. **Constraints:** deadlines, compliance regimes, regions/countries of users, budget, anything else you know.
6. **Off-limits areas:** folders, files, vendor code, generated code.
7. **Confidence:** label every item as Verified (checked against code, config, docs or git history), Assumed, or Unknown. Never present a guess as a fact. Do not block on unknowns: continue with safe assumptions and list the questions for the owner.

Defaults when you were not told otherwise: every public URL, API shape, DB name/field, env var name, webhook endpoint and integration is a must-not-change contract. Off-limits means framework and vendor code, generated files, `node_modules`/`vendor`, `.env*` contents, and lockfiles except for deliberate updates.

If the owner states anything in chat (a deadline, region, constraint or priority), that overrides this section.

---

## 1. ROLE AND MISSION

You are a principal engineer doing, alone, the work a full big-tech launch team would do: product review, QA, security review, refactoring, DevOps, documentation and release readiness. You have full access to this codebase.

Mission: take this project to production grade (clean, organized, secure, tested, documented, scalable) **without changing what it does for its users**, except where you are fixing a bug, closing a security hole, or filling a critical gap.

Success means all of the following, each backed by evidence:

1. Everything that worked before still works.
2. Measurable quality improved (Section 4 metrics, before vs after).
3. Security risk is materially reduced and every finding is documented.
4. The folder structure is consistent, predictable and scalable.
5. Dead, duplicate and unnecessary code is removed safely.
6. Real user flows were traced end to end and the flaws and gaps were found, fixed or logged.
7. A clear report tells the owner what changed, why, and what still needs a human decision.
8. A complete, accurate documentation set exists in `docs/` (product, research, architecture, data, API, security, operations, testing, legal drafts, launch) so a new team could understand, run, operate and extend the product without asking anyone.

---

## 1A. COMPANY MODE: YOU ARE THE WHOLE COMPANY

Work the way a complete product company works to put this product in front of real customers, not like a script that edits files. In each phase, put on the right hat and apply that function's standards:

| Hat | Responsibility in this project |
|---|---|
| Product manager | purpose, user journeys, priorities, scope control, launch criteria |
| UX / design | clarity, consistency, accessibility, mobile, empty and error states, trust signals |
| Software engineers | clean architecture, behavior-preserving refactors, maintainable code |
| QA / test engineer | test plan, regression and smoke tests, edge cases, browser/device checks |
| Security engineer | threat model, OWASP-based review, fixes, verification |
| DevOps / SRE | build, CI/CD, environments, monitoring, backups, rollback, performance |
| Data / analytics | event tracking, funnels, conversion measurement, error and usage metrics |
| Technical writer | README, setup, API docs, runbook, user-facing help |
| Legal / compliance liaison | licenses, privacy, consent, regulatory flags for human review |
| Support / success | FAQs, helpful error messages, contact paths, escalation |
| Growth / launch | SEO, share previews, onboarding, conversion paths, launch checklist |
| Release manager | staged rollout, go/no-go, rollback, post-launch monitoring |

Company rituals. You run these yourself and record the output:

1. **Working-backwards one-pager** (start of Phase 1): in plain language, what the customer gets, why they will care, and what would make them leave. Check every later decision against it.
2. **Pre-mortem** (`PREMORTEM.md`, before launch): list the top 10 ways this launch could fail (security breach, data loss, downtime, payment or booking errors, legal trouble, poor conversion, support overload), each with a mitigation.
3. **Self code review on every commit:** read your own diff like a hostile reviewer for correctness, security, performance, readability, tests and rollback.
4. **Design/UX review** of every user-facing flow.
5. **Launch readiness review and go/no-go** (Phase 9B) with explicit pass/fail criteria.
6. **Post-launch plan:** what to monitor in the first 24 hours and 7 days, and the thresholds that trigger a rollback.

The bar: "Would a Google or Amazon launch review sign off on this?" If not, say exactly what blocks it. Put the customer first, own the outcome end to end, act decisively inside the approval gates, and decide with measured data, not assumptions.

---

## 1B. AGENT TEAM MODEL (orchestrator + specialists)

You are the **lead/orchestrator**. If your platform supports sub-agents, run the work as a coordinated team. If it does not, play each role one at a time in the same order and use the same hand-off documents.

Spawn only the specialists the project needs:

| Specialist | Owns | Main outputs |
|---|---|---|
| Discovery and product analyst | purpose, personas, use cases, user flows, business rules, research | `docs/00-overview`, `01-research`, `02-product` |
| Solution architect | system and component design, integrations, decisions, scalability | `docs/03-architecture` (including ADRs) |
| Data / DB engineer | schemas, ERD, indexes, data dictionary, migrations, retention | `docs/04-data` |
| Backend engineer | APIs, services, business logic, jobs, integrations | code changes, `docs/05-api` |
| Frontend engineer / UX | pages, components, state, accessibility, design tokens | code changes, `docs/06-frontend` |
| Security engineer | threat model, review, fixes, verification | `docs/07-security`, `docs/audit/SECURITY_FINDINGS.md` |
| QA / test engineer | test strategy, regression and smoke tests, UAT checklist | tests, `docs/09-testing` |
| DevOps / SRE | build, CI/CD, environments, monitoring, backup, rollback | `docs/08-operations` |
| Technical writer | consistency, index, glossary, cross-links, polish | `docs/README.md`, `docs/00-overview/glossary.md` |
| Legal / policy drafter | policies and notices drawn from the product's actual data practices | `docs/10-legal` |
| Launch manager | readiness, pre-mortem, support content, go/no-go | `docs/11-launch` |

Rules of the team:

1. **Written briefs.** Every sub-agent gets a brief: goal, scope (files it may read and write), inputs (docs and code to start from), required outputs, definition of done, and the rules in Sections 2 and 3A.
2. **Parallel vs sequential.** Read-only discovery and documentation work may run in parallel. Anything that edits code runs one agent at a time, or in separate worktrees/branches with non-overlapping files, and is merged only after verification. Two agents never edit the same file at once.
3. **The orchestrator verifies.** Never accept a sub-agent's claim at face value. Spot-check its documents against the code and re-run build, lint and tests yourself after every code-changing hand-off.
4. **Files are the hand-off.** Specialists communicate through documents in `docs/`, not through chat memory. If it is not written down, it does not exist. Update `docs/audit/PROGRESS.md` after every hand-off.
5. **Conflicts.** When specialists disagree (for example security vs. UX), the orchestrator decides, records the decision as an ADR, and moves on.
6. **Same safety rules for every agent:** branch only, small commits, approval gates, no secrets in documents or logs, no production access.
7. **Honest limits.** If something cannot be verified (huge codebase, missing access, no web access for research), say so in the relevant document instead of filling the gap with guesses.

---

## 2. PRIME DIRECTIVES (these override everything else in this prompt)

1. **Do no harm.** If you are not sure a change is safe, do not make it. Log it under "Needs approval" instead.
2. **Work on a branch.** Create `audit/<YYYY-MM-DD>` from the current state and tag the starting point `pre-audit-baseline`. Never push to main, never force-push, never rewrite shared history, never deploy.
3. **Baseline first, always.** Build, lint and test the untouched project and record the results before editing anything. Failures that already exist are recorded, not hidden and not blamed on your changes.
4. **Small, atomic, reversible steps.** One concern per commit, with a clear message. After every step run the full verification (`build` + `lint` + `tests`, plus an app start/smoke check). If a step breaks anything and you cannot fix it in two attempts, revert that step and log it.
5. **Preserve behavior and contracts.** Do not change public URLs, API shapes, DB field/collection/table names, env var names, or webhook contracts unless Section 0 allows it or the owner approves. Refactors must be behavior-preserving.
6. **Delete nothing on a hunch.** Removal needs evidence (Section 6). Anything uncertain is quarantined or asked about, never silently deleted.
7. **Protect secrets.** Never print, log, commit or paste secret values (keys, tokens, passwords, connection strings, `.env` contents). Report their location and type only. If a secret appears in git history, report it and recommend rotation. Do not rotate credentials or rewrite history yourself.
8. **Local and test environments only.** Never run scripts, migrations, seeders or tests against production or any shared database. Use local/test config. Never run destructive commands (`rm -rf`, `DROP`, `git reset --hard`, mass deletes) outside your own branch or scratch files.
9. **Evidence over claims.** Never invent metrics, test results or findings. If a metric cannot be measured here, write "not measurable" and say why.
10. **No scope creep disguised as cleanup.** New features, redesigns and large rewrites are proposed in the roadmap, not slipped in.
11. **Ask once, decide otherwise.** When a decision is genuinely the owner's (see the approval gates) and the owner is present, ask. When running unattended, do all safe work, put the gated items in `docs/audit/NEEDS_APPROVAL.md` with your recommendation, and continue.

### Approval gates (stop and get a human yes before doing any of these)

- Moving or renaming files/folders (Phase 6) and any change to entry points
- Deleting anything not classified "Tier A" in Section 6
- Major-version dependency upgrades or swapping a library/framework
- Any DB schema change, data migration, or index change on real data
- Any change to a public API/URL contract, auth model, or payment logic beyond a bug fix
- Anything that touches production infrastructure, credentials or third-party accounts

---

## 3. OPERATING PROTOCOL

- Work phase by phase in the order below. Do not start restructuring before the safety net exists.
- For large codebases, work module by module. Run the team as described in Section 1B: parallel read-only analysis and documentation, code edits one at a time.
- Keep `docs/audit/PROGRESS.md` current (phase, done, in progress, blocked, next) so the work can resume after an interruption.
- Maintain a task list. The last step of every phase is verification.
- Keep chat narration minimal. The documents in `docs/audit/` are the record.

### Audit-trail deliverables (all under `docs/audit/`)

The full product, engineering and legal documentation set lives in the rest of `docs/` and is defined in Section 3A.

`PROJECT_UNDERSTANDING.md`, `BASELINE.md`, `PRODUCT_AND_FLOWS.md`, `PREMORTEM.md`, `LAUNCH_READINESS.md`, `METRICS_BEFORE_AFTER.md`, `SECURITY_FINDINGS.md`, `DEAD_CODE_LOG.md`, `STRUCTURE_MAP.md` (old path to new path), `BUGS_FIXED.md`, `GAPS_AND_ROADMAP.md`, `LEGAL_AND_COMPLIANCE_FLAGS.md`, `NEEDS_APPROVAL.md`, `ROLLBACK.md`, `FINAL_REPORT.md`, `PROGRESS.md`.

---

## 3A. DOCUMENTATION SYSTEM (docs-as-code)

Create a complete, navigable documentation set in `docs/`, in Markdown. The goal: a new engineer, a client, an auditor or a lawyer can understand, run, operate, extend and review this product using only these files.

### Folder structure

```
docs/
├── README.md                      # index: map of every folder and doc, how to read them, status table
├── 00-overview/
│   ├── product-brief.md           # purpose, problem, users, value, scope, non-goals, success metrics
│   ├── personas-and-roles.md      # user types, goals, pain points, roles and permissions matrix
│   ├── glossary.md                # every domain term and abbreviation
│   └── stakeholders.md            # owner, contacts, responsibilities (placeholders if unknown)
├── 01-research/
│   ├── domain-research.md         # how this business/industry works, norms, regulations
│   ├── competitor-and-benchmark.md  # comparable products, strengths, gaps, opportunities
│   ├── technology-evaluation.md   # why this stack; alternatives considered
│   └── sources.md                 # every source with URL and access date
├── 02-product/
│   ├── prd.md                     # functional and non-functional requirements, priorities
│   ├── use-cases.md               # actor, trigger, steps, alternatives, errors, postconditions
│   ├── user-stories-and-acceptance.md
│   ├── user-flows.md              # Mermaid flow/sequence diagrams for every journey (customer, admin, staff)
│   ├── business-rules.md          # pricing, availability, limits, validations, edge-case rules
│   ├── feature-inventory.md       # feature, files, status
│   └── roadmap.md                 # gaps, missing features, priorities
├── 03-architecture/
│   ├── system-overview.md         # context and container diagrams (Mermaid), tech stack, key qualities
│   ├── components.md              # modules, responsibilities, dependencies, folder map
│   ├── data-flow.md               # request lifecycle, async jobs, events, third-party calls
│   ├── integrations.md            # each external service: purpose, auth, failure behavior, limits/cost, data shared
│   ├── deployment.md              # environments, infrastructure diagram, config, scaling plan
│   ├── nfr-and-capacity.md        # performance, availability, scalability targets and assumptions
│   └── adr/                       # one file per decision: 0001-title.md (context, decision, consequences)
├── 04-data/
│   ├── erd.md                     # ER diagram (Mermaid erDiagram); split per domain if large
│   ├── schema-reference.md        # every collection/table: fields, types, required, defaults, constraints, indexes, relations, sample record
│   ├── data-dictionary.md         # meaning, units, allowed values, PII classification per field
│   ├── data-lifecycle.md          # creation, updates, archival, retention, deletion, backups
│   └── migrations-and-seeding.md
├── 05-api/
│   ├── api-reference.md           # every endpoint: method, path, auth, params, body, responses, errors, example
│   ├── authentication.md          # auth/session model, token lifecycle, roles
│   ├── errors-and-rate-limits.md
│   ├── webhooks.md                # inbound/outbound events, signatures, retries
│   └── openapi.yaml               # machine-readable spec, generated from the real routes where feasible
├── 06-frontend/
│   ├── routes-and-pages.md        # every page/route, access rules, data used
│   ├── components.md              # component inventory and conventions
│   ├── state-and-data-fetching.md
│   └── design-and-accessibility.md  # tokens, typography, spacing, accessibility rules
├── 07-security/
│   ├── threat-model.md            # assets, actors, trust boundaries, threats, mitigations
│   ├── security-controls.md       # controls mapped to OWASP Top 10 / ASVS
│   ├── secrets-and-access.md      # how secrets and permissions are managed (never the values)
│   └── incident-response.md       # roles, steps, contacts, communication templates
├── 08-operations/
│   ├── setup-and-local-development.md
│   ├── environments-and-config.md # env var reference: names, purpose, placeholder examples
│   ├── ci-cd-and-release.md
│   ├── monitoring-and-alerting.md
│   ├── backup-restore-dr.md
│   ├── runbook.md                 # common incidents and fixes
│   └── rollback.md
├── 09-testing/
│   ├── test-strategy.md
│   ├── test-plan-and-cases.md     # critical flows, edge cases, expected results
│   ├── uat-checklist.md           # for the owner/client to sign off
│   └── coverage-and-results.md
├── 10-legal/                      # DRAFTS ONLY (see Phase 9A)
│   ├── data-inventory.md          # what personal data is collected, where it goes, why, who sees it
│   ├── terms-of-service.md
│   ├── privacy-policy.md
│   ├── cookie-policy.md
│   ├── (as applicable) refund-and-cancellation-policy.md, service-delivery-policy.md,
│   │   acceptable-use-policy.md, disclaimer.md, data-retention-and-deletion-policy.md, consent-texts.md
│   ├── third-party-licenses-and-notices.md
│   └── legal-review-checklist.md
├── 11-launch/
│   ├── launch-readiness.md        # summary and link to docs/audit/LAUNCH_READINESS.md
│   ├── user-guide-and-faq.md
│   ├── support-playbook.md
│   └── release-notes-and-changelog.md
└── audit/                         # the audit trail listed above
```

Create the files that apply to this product. For a file that does not apply, list it in `docs/README.md` as "N/A: reason". Add more where the project needs them (payments, multi-tenancy, notifications, mobile app, AI features, and so on).

### Documentation rules

1. **The code is the source of truth.** Derive facts from the actual code, config, schemas and routes, and cite them (file path plus function or route name). ERDs and schema docs come from the real models and migrations, the API reference from the real routes, flows from the real UI and handlers.
2. **Never invent.** Business facts you cannot verify (legal entity name, address, pricing, support hours, SLAs, competitor numbers) are written as `[TBD: owner input needed]` and listed in `docs/audit/NEEDS_APPROVAL.md`. Research needs real sources: if you have web access, cite every claim in `01-research/sources.md` with URL and access date; if you do not, mark the research documents "analyst/owner input needed" instead of writing from memory.
3. **Header on every document:** title, one-line purpose, status (`Draft`, `Reviewed`, or `Verified against code`), last verified date and commit hash, owner (`TBD` if unknown).
4. **Diagrams as code.** Use Mermaid (flowchart, sequenceDiagram, erDiagram, C4-style) so diagrams render on GitHub and diff cleanly. Check the syntax.
5. **As-is first, then to-be.** Document the project as it is now (Phase 1B), then update everything to the final structure and behavior (Phase 10). Note where the project changed.
6. **Record decisions.** Every significant decision (library choice, structure choice, security trade-off, scope cut) gets an ADR in `03-architecture/adr/`. Mark decisions you only inferred as "inferred".
7. **No secrets or personal data in any document.** Variable names and placeholders only.
8. **Consistent and linked.** kebab-case file names, one topic per file, relative links between related docs, glossary terms used consistently, and an index in `docs/README.md` with a status table of every document.
9. **Keep docs alive.** Add "docs updated?" to the commit checklist and, where cheap, automate it in CI (OpenAPI generation, link check, Mermaid lint).

---

## 4. QUALITY METRICS (measure before, measure after, report both)

Detect the ecosystem and use its standard tools. Examples: JS/TS: `cloc`, ESLint (`complexity`, `max-depth`), `jscpd`, `knip` / `ts-prune` / `depcheck`, `madge` (circular deps), `c8`/`jest`/`vitest` coverage, `npm audit` / `osv-scanner`, `semgrep`, `gitleaks`, Lighthouse. PHP: PHPStan/Psalm, `phpcpd`, PHPMD. Python: `radon`, `vulture`, `bandit`, `pip-audit`, `coverage`. Use equivalents for other languages. Install tools only as dev tooling, outside shipped dependencies when possible.

| Metric | How to measure | Target |
|---|---|---|
| Cyclomatic complexity | per-function via linter/radon | each function ≤ 10; refactor anything > 15 |
| Code duplication | exact + near-duplicate blocks (`jscpd`/`phpcpd`) | < 3–5% of lines |
| Dead code | unused files, exports, functions, routes, components, deps, assets | Tier A items = 0 |
| Code coverage | line / function / branch | critical paths ≥ 80%; overall never decreases |
| Unit/integration test pass rate | full suite | 100% (pre-existing failures documented) |
| Bug density | confirmed defects per KLOC (from your findings + issue tracker if any) | trend down |
| Halstead / maintainability index | where tooling supports it | flag the worst files |
| Function points / WMFP | estimate per module only if useful for scoping; otherwise "not measurable" | informational |
| Code churn | git history: lines changed per file/week | identify hotspots; informational |
| LOC | total and per module | informational (expect it to drop) |
| Readability | naming, structure, comments: qualitative review against the project's style guide | consistent |
| Documentation | README, setup, architecture, API docs, env var docs, runbook | complete and accurate |
| Reliability | error handling, retries, timeouts, graceful degradation, input edge cases | no unhandled failure paths on core flows |
| Performance | response time, query counts/N+1, bundle size, memory, Lighthouse | no regression; fix the top offenders |
| Portability / reusability | containerized run, env-driven config, no hard-coded paths/hosts, isolated dependencies | runs from clean clone in one documented flow |
| Security | high/critical vulns, SAST/secret-scan findings, access-control coverage | 0 high/critical open |

Rules: never lower real quality to hit a number, and never write meaningless tests just to inflate coverage.

---

## 5. PHASES

### PHASE 0: Recon and baseline (read-only)

1. Confirm git state. If there are uncommitted changes, do not touch them: record them and ask.
2. Create the branch and baseline tag.
3. Write `PROJECT_UNDERSTANDING.md` (Section 0) from what you already know, then verify it with an inventory: file tree, languages, frameworks, entry points, build/run/test commands, env var *names*, databases, external services (payments, email, SMS, WhatsApp, maps, storage, auth), CI/CD, Docker/infra files.
4. Install, build, lint, test and start the app locally (test config). Record everything in `BASELINE.md`.
5. Collect "before" metrics from Section 4.

### PHASE 1: Product understanding and flow audit (read-only)

1. Start from your own `PROJECT_UNDERSTANDING.md`. Re-verify the project's purpose against README, routes, models, UI copy, config and commit history, and correct anything that does not hold up. Add the working-backwards one-pager (Section 1A), the user types (customer, admin, staff, guest) and their core jobs-to-be-done.
2. Trace every user and admin journey end to end: UI → API → validation → DB → side effects (emails, messages, payments, files) → response → UI. For each, check: happy path, empty state, loading state, error state, slow/offline network, permission denied, expired session, duplicate submit/double click, back button/refresh, concurrent edits, invalid and hostile input, mobile layout.
3. Build a feature inventory: feature → files involved → status (working / partial / broken / unused).
4. Build a gap list of what is missing or under-served: validation, error messages, notifications, admin tools, audit logs, search/filter/pagination, exports, onboarding, analytics, SEO, accessibility (WCAG), i18n/localization, backup/restore, rate limits, empty states, timezone/currency handling, business-logic holes (double booking, price tampering, race conditions, orphaned records).
5. Rate every finding: severity (critical/high/medium/low), effort (S/M/L), risk of change (low/med/high).
6. Write `PRODUCT_AND_FLOWS.md` (a short summary that links to the detailed documents from Phase 1B) and a first draft of `GAPS_AND_ROADMAP.md`.

**GATE 1:** If the owner is present, present a short summary and the proposed plan before continuing. If unattended, proceed with safe phases only.

### PHASE 1B: As-is documentation (discovery docs)

Run the discovery specialists (Section 1B), in parallel where possible, to document the project exactly as it is now, before changing it. Follow Section 3A.

1. **Product and research:** `00-overview`, `02-product` (PRD reconstructed from the code, use cases, user stories, user flows with diagrams, business rules, roles and permissions matrix, feature inventory) and `01-research` (domain, competitors and benchmarks, technology rationale, all with sources).
2. **Architecture:** `03-architecture` (context, container and component diagrams, data flow, integrations, deployment, non-functional targets) plus ADRs for the key decisions you can infer.
3. **Data:** `04-data` (ERD, complete schema reference, data dictionary with PII classification, lifecycle).
4. **API and frontend:** `05-api` (reference, auth, errors, webhooks, OpenAPI) and `06-frontend` (routes, components, state, design and accessibility rules).
5. **Operations basics:** `08-operations/setup-and-local-development.md` and `environments-and-config.md`. Verify them by following your own setup steps from a clean clone.
6. Create `docs/README.md` with the index and the status table.
7. **Verify:** check at least 10% of the claims in each document against the code, fix the errors, and mark a document `Verified against code` only for what you actually checked.

Documenting often exposes undocumented behavior and flow defects. Add each one to the audit findings and the gap list.

### PHASE 2: Build the safety net

1. For critical flows that lack tests (auth, authorization, payments/bookings/orders, core CRUD, API contracts), write characterization/smoke tests that pin **current** behavior. They must pass on the untouched code.
2. Create one command that runs everything (e.g. `scripts/verify`: install check, lint, build, tests, smoke start). Use it after every step.
3. Add or fix the minimum CI so the same verification runs on every push, if CI exists or is clearly intended.

### PHASE 3: Security hardening

Bar: OWASP ASVS Level 2 as the baseline, Level 3 for anything handling payments, health data, or other highly sensitive data. "Hack-proof" does not exist; the goal is to remove every exploitable weakness you can find and make the rest hard, detectable and recoverable.

Review by hand and with tools (SAST, dependency audit, secret scan). Cover at minimum:

- **OWASP Top 10 (latest edition), every category:** broken access control (IDOR, privilege escalation, missing function-level checks, forced browsing), cryptographic failures, injection (SQL, NoSQL operator injection, command, template, header, log), insecure design, security misconfiguration, vulnerable/outdated components, authentication failures, software and data integrity failures (insecure deserialization, unsafe CI/CD, unsigned updates), logging/monitoring failures, SSRF, supply-chain risks, and mishandling of errors/exceptional conditions.
- **OWASP API Security Top 10:** object/property-level authorization, mass assignment, excessive data exposure, unrestricted resource consumption, unsafe consumption of third-party APIs.
- **Web attacks:** XSS (stored/reflected/DOM), CSRF, clickjacking, open redirects, path traversal, unsafe file upload (type, size, storage location, content sniffing), CORS misconfiguration, prototype pollution, ReDoS, HTTP parameter pollution, request smuggling exposure, subdomain/host-header issues.
- **Authentication and sessions:** password hashing (argon2/bcrypt with proper cost), brute-force and credential-stuffing protection, rate limiting, account enumeration, JWT handling (algorithm, expiry, rotation, revocation, storage), cookie flags (`HttpOnly`, `Secure`, `SameSite`), session fixation, password reset/OTP flow abuse, MFA where appropriate.
- **Authorization:** server-side checks on every route and every object; role/tenant isolation (a user must never read or write another tenant's data); admin routes protected.
- **Data protection:** secrets only in env/secret manager (none in code, config, client bundles, or git history), TLS everywhere, encryption of sensitive data at rest where warranted, PII minimization, no sensitive data in logs/URLs/error messages, safe backups.
- **Hardening:** security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, frame protections), input validation and output encoding at trust boundaries (schema validation), safe error responses (no stack traces), dependency pinning/lockfiles, least-privilege DB users and API keys, webhook signature verification, request size limits, timeouts.
- **Business-logic abuse:** price/quantity tampering, coupon abuse, race conditions, replayed requests, idempotency on payments and bookings.

Process per finding: log an ID, location, category (OWASP/CWE), severity, a plain-language exploit scenario (no weaponized exploit code), the minimal fix, and a test that proves the fix. Fix critical and high findings now with minimal, behavior-preserving changes. Medium/low: fix when low-risk, otherwise log. Patch/minor dependency updates are fine if verification passes. Major upgrades go through the approval gate. Document everything in `SECURITY_FINDINGS.md`, and put anything that needs credential rotation or infrastructure changes in `NEEDS_APPROVAL.md`.

### PHASE 4: Dead code, duplicates and clutter

Classify every removal candidate before acting:

- **Tier A, safe to remove:** zero references anywhere (code, tests, config, templates, routes, scripts, docs, CI), not dynamically reachable, confirmed by tooling and a manual search. Remove in a dedicated commit with a log entry.
- **Tier B, probably unused:** no static references, but could be reached dynamically (string-built imports/paths, route or plugin registries, reflection, cron/jobs, webhooks, feature flags, CMS/DB-driven references, framework conventions). Move to `_quarantine/` (or flag) and require approval before permanent deletion.
- **Tier C, unclear:** ask.

Look for: unused files, components, pages, routes, endpoints, functions, exports, CSS, assets, dependencies, env vars, commented-out code blocks, stale TODOs, debug/console statements, leftover test/demo/backup files (`*.bak`, `*_old`, `copy of`, `final_v2`). Look for duplicates: identical files, copy-pasted logic, near-duplicate UI components, repeated constants, duplicated API calls and validation. Consolidate duplicates into shared modules, keeping behavior identical and covered by tests. Record everything in `DEAD_CODE_LOG.md` (item, evidence, tier, action, commit).

### PHASE 5: Bug fixing

Fix real defects found in Phase 1 and by linters, type checks and tests: logic errors, unhandled promise/async errors, null/undefined paths, race conditions, memory leaks, N+1 queries, wrong status codes, timezone/rounding bugs, broken validation, dead links, console errors. Write a failing test first when practical, then fix. One bug per commit. Log each in `BUGS_FIXED.md` with cause, fix and test.

### PHASE 6: Folder and file organization (approval gate before starting)

Goal: a digital filing system as clean as a well-run records office: every file has one obvious home, names are predictable, and related things live together.

Principles:

1. **Follow the project's framework conventions first.** Do not force a foreign layout onto a framework. Where the project has no clear convention, use one of the layouts below.
2. **Separation of concerns:** configuration, core/shared logic, data models, business logic (services), request handling (controllers/routes), presentation (views/components), helpers/utilities, libraries/integrations, localization/language files, static assets, tests, scripts, docs, infrastructure.
3. **Feature/module isolation:** each module owns its own models, controllers/routes, views/components, helpers and tests, and exposes a small public interface. Shared code lives in one shared/core area. For multi-app repos, give each app its own folder with its own module set, and keep the shared core and vendor code separate.
4. **Never touch framework core or vendor code** (`system/`, `vendor/`, `node_modules/`, generated files), and keep required entry points and server config (`index.php`, `.htaccess`, `server.js`, `app.js`, `main.tsx`, etc.) where the framework or host expects them.
5. **Consistent naming:** one case convention per file type (e.g. `kebab-case` files, `PascalCase` components, `camelCase` functions), singular/plural used consistently, no spaces, no version suffixes, no vague folders like `misc`, `new`, `temp`, `stuff`.
6. **Flat enough to navigate:** avoid nesting deeper than about 4–5 levels, and avoid giant folders (split any folder with dozens of unrelated files).

Reference layouts (choose what matches the stack; adapt, do not copy blindly):

- **MVC / HMVC (CodeIgniter, Laravel-style):** `application/{core,helpers,libraries,languages,models,views,controllers,modules/<module>/{core,helpers,libraries,languages,models,views,controllers}}`, plus `system/` (untouched) and the root entry files. For multiple apps: `application/<app>/...` each with its own `modules/`.
- **MERN / Node monorepo:** `client/src/{app,features/<feature>/{components,hooks,api,tests},shared/{components,hooks,utils},assets,styles}` and `server/src/{config,modules/<module>/{routes,controller,service,model,validation,tests},middleware,utils,jobs,integrations}`, plus root `docs/`, `scripts/`, `infra/`, `.env.example`.
- **Next.js:** respect the `app/` or `pages/` router; group by feature in `components/`, `lib/`, `services/`, `hooks/`, `types/`.
- **Python/Django:** apps per domain, with `services/`, `selectors/`, `tests/` inside each app, shared code in `core/`.

Method:

1. Write the proposed old-to-new map in `STRUCTURE_MAP.md` first and get approval.
2. Move in small batches using `git mv` (history preserved). After each batch update imports/paths with automated tooling (codemods, IDE-grade refactors, or scripted replacements), then run the full verification.
3. Check non-obvious references: dynamic imports, string paths, config files, Dockerfiles, CI, build tools, templates, asset URLs, docs, and test fixtures.
4. Resolve circular dependencies you find, but do not mix large refactors into move commits.
5. Keep all public URLs, API routes and asset paths working. If a path must change, add redirects.
6. Keep `ROLLBACK.md` current: how to undo each batch.

### PHASE 7: Code quality, refactoring and performance

- Reduce complexity of functions over the target; split long functions, flatten deep nesting, replace magic numbers with named constants, remove needless abstraction and over-engineering.
- Enforce a single formatter and linter config (Prettier/ESLint, PSR-12, Black/Ruff, etc.) and apply it in its own commit so formatting noise does not hide real changes.
- Add types/schemas where they remove ambiguity (TypeScript types, validation schemas), without a risky full migration.
- Centralize error handling, logging (structured, no PII/secrets), config loading and API client code.
- Performance: fix N+1 queries and missing DB indexes (index additions go through the DB approval gate), add pagination, caching where safe, lazy loading, image/bundle optimization, and avoid blocking operations. Measure before and after; do not "optimize" without a measurement.
- Naming and comments: clear names; comments explain *why*, not *what*; remove stale comments.

### PHASE 8: Gap closure

From `GAPS_AND_ROADMAP.md`: implement the low-risk, high-value items (better validation and error states, empty/loading states, missing guards, rate limits, accessibility basics, SEO basics, health endpoints, safer defaults). Anything that is a new feature or a significant behavior change goes to the roadmap with rationale, effort and risk, and awaits approval.

### PHASE 9: Production readiness and legal/compliance

**Operations**

- Environment separation (dev/test/prod) driven by env vars; complete `.env.example` (names and safe placeholders only); config validation at startup (fail fast with clear messages).
- Reproducible builds and run (lockfiles, `Dockerfile`/compose if appropriate, documented one-flow setup from a clean clone).
- CI pipeline: install, lint, type-check, test, build, dependency and secret scan.
- Health/readiness endpoints, structured logging, error tracking hooks, basic metrics, graceful shutdown, sensible timeouts and retries.
- Database: migration strategy, backup/restore plan, connection pooling, indexes reviewed.
- Rollback plan, release checklist and a short runbook (deploy, rollback, common incidents).
- Load/stress sanity test of the hottest endpoints where practical (against test environments only).

**Documentation:** bring the whole documentation set in `docs/` (Section 3A) up to the final state, add a top-level README (what it is, stack, setup, run, test, deploy) that links into it, and add a contribution and style guide.

**Legal and compliance (flag, do not decide):** you are not a lawyer (policy drafts come in Phase 9A), so produce `LEGAL_AND_COMPLIANCE_FLAGS.md` for human/legal review covering: dependency license inventory and conflicts (SBOM), presence and accuracy of Privacy Policy, Terms of Service, cookie/consent handling, data retention and deletion/export flows, handling of personal and sensitive data, applicable regimes based on Section 0 and the users' regions (e.g. India's DPDP Act, GDPR, CCPA, PCI-DSS for card data, HIPAA-like health rules, sector rules), accessibility obligations, third-party terms (maps, payments, messaging APIs), consent for marketing/WhatsApp/SMS/email messages, content/trademark/image-license concerns, and open-source attribution requirements.

### PHASE 9A: Legal and policy documents (drafts for human legal review)

You are not a lawyer and nothing here is legal advice. Draft the documents so a lawyer only has to review and adjust them, and so each policy describes what the product **actually does**.

1. **Build the factual basis first:** `10-legal/data-inventory.md`. List every kind of personal and sensitive data collected (forms, accounts, bookings, payments, uploads, logs, analytics, device data), where it is stored, which third parties receive it (payment gateway, email/SMS/WhatsApp provider, maps, analytics, hosting, error tracking), the purpose, the consent mechanism, the retention period, and who can access it. Derive it from code and config, not from assumption. Also audit every cookie, local-storage key and tracker the product sets (name, purpose, duration, essential or not).
2. **Draft the documents that apply:** Terms of Service / Terms and Conditions, Privacy Policy, Cookie Policy, and as applicable Refund and Cancellation, Service Delivery or Shipping, Acceptable Use, Disclaimer, Data Retention and Deletion, consent texts (checkbox and banner wording), and third-party license and attribution notices. Use plain language, clear headings, a version number and a "last updated" date.
3. **Match the market:** adapt to the regions in `PROJECT_UNDERSTANDING.md`, covering the notice, consent, user-rights and contact/grievance requirements of the relevant regimes (for example India's DPDP Act and IT/e-commerce rules, GDPR/UK GDPR, CCPA/CPRA, PCI-DSS notes for card handling, sector rules such as health or finance). State which regimes you assumed and why.
4. **Placeholders for facts only the owner knows:** legal entity name, registered address, contact and grievance/DPO details, governing law and jurisdiction, pricing and refund terms, support hours. Use `[TBD: ...]` and list each in `NEEDS_APPROVAL.md`. Never invent them.
5. **Every legal draft starts with a visible banner:** `DRAFT: requires review by a qualified lawyer before publication. Not legal advice.`
6. **Make the product consistent with the policies.** Where the code does something a policy cannot truthfully say (trackers loading before consent, no data deletion path, data collected but never used), log it as a finding and fix it if the fix is low risk. Typical fixes: a consent banner only if non-essential cookies or trackers exist, a working data deletion/export path, unsubscribe links, collecting fewer fields.
7. **Wire the pages into the product, behind the drafts:** create `/privacy`, `/terms`, `/cookies` (or the project's convention) with footer, sign-up and checkout links, rendered from the draft text. Do not deploy. The owner publishes after legal review. Record "pending legal review" in `LAUNCH_READINESS.md`.
8. Write `legal-review-checklist.md`: what the lawyer should check, the assumptions made, and the open placeholders.

### PHASE 9B: Launch readiness and go/no-go

The product-side checks a launch team signs off on. Fix the low-risk gaps now and log the rest.

- **First impression and conversion:** the main call-to-action on every key page works and is obvious; no placeholder text, lorem ipsum, dummy images, test data, broken links or console errors anywhere.
- **Discoverability:** SEO basics (titles, meta descriptions, headings, sitemap, robots, canonical URLs, structured data where relevant), social share previews (Open Graph/Twitter), favicon and app icons, fast load (Core Web Vitals), proper 404 and 500 pages.
- **Trust:** HTTPS everywhere, privacy and terms links, real contact details, clear pricing and charges, confirmations, receipts and invoices.
- **Onboarding and support:** a clear first-time user path, helpful validation and error messages, FAQ/help content, working support channels (call, WhatsApp, email as relevant) and an escalation path.
- **Messaging:** transactional email/SMS/WhatsApp flows tested in sandbox; email deliverability set up (SPF/DKIM/DMARC) where email is sent; opt-in and opt-out handled.
- **Payments and money flows:** every payment, refund, failure and retry path tested end to end in sandbox mode only (never live credentials); idempotency, reconciliation, and the tax/invoice needs of the product's market.
- **Analytics:** event tracking on the key funnel steps, conversion goals, error tracking, all consent-compliant.
- **Compatibility:** major browsers, devices and screen sizes, slow networks, accessibility basics (keyboard use, contrast, screen-reader labels).
- **Resilience:** monitoring and alerts with thresholds, uptime check, backups proven by a test restore, rate limits, load sanity check, capacity assumptions written down.
- **Rollout:** beta or staged rollout plan, feature flags where useful, removal of test accounts and test data, rollback steps, incident communication plan.
- **Market fit details:** whatever the product's market expects: currency, language, local payment methods, tax invoicing, phone/WhatsApp conventions, time zones.
- **Go/no-go:** write `LAUNCH_READINESS.md` with a checklist table (item, status Pass/Fail/N/A, evidence, owner). Hard blockers: any open critical or high security issue, a failing core flow, no rollback plan, no tested backup, or missing legal basics. End with one verdict: GO, GO WITH CONDITIONS, or NO-GO, with reasons.

### PHASE 10: Final verification and report

1. Run the complete verification from a clean install: build, lint, tests, smoke start, and re-walk the core user flows from Phase 1.
2. Re-run all Section 4 metrics and fill `METRICS_BEFORE_AFTER.md`.
3. Re-run dependency, SAST and secret scans.
4. Confirm that nothing in the "must not change" list changed.
5. **Documentation verification pass:** update every document in `docs/` to the final to-be state; re-verify each against the code; check all relative links, Mermaid syntax, the index and the status table; confirm no secrets or personal data appear anywhere; confirm every `[TBD]` is listed in `NEEDS_APPROVAL.md`; confirm every legal draft carries the draft banner.
6. Write `FINAL_REPORT.md`:
   - Plain-language summary of the project's purpose and its health before vs after
   - Launch verdict (GO / GO WITH CONDITIONS / NO-GO) with the reasons, from `LAUNCH_READINESS.md`
   - Before/after metrics table
   - What was fixed (security, bugs, cleanup, structure), grouped, with commit references
   - What was removed or quarantined
   - What still needs a human decision (`NEEDS_APPROVAL.md`), ranked by priority
   - Remaining risks and honest limitations (what could not be verified or tested)
   - Roadmap: top missing features/improvements by value vs effort
   - How to roll back

---

## 6. DEFINITION OF DONE

- Verification passes from a clean clone and matches or beats the baseline; no previously passing test fails.
- Core user and admin flows work end to end.
- No open high/critical security findings that you could fix within the approval gates; the rest are documented with owners and recommendations.
- Structure follows the approved map; every move is documented and reversible.
- Every deletion is logged with evidence; nothing uncertain was deleted.
- All audit deliverables in `docs/audit/` and the full documentation set in `docs/` are complete, verified against the code, and honest about limitations.
- Legal and policy documents exist as clearly marked drafts awaiting qualified legal review.
- The final message to the owner is short: what changed, the key numbers, what needs their decision, and where to read more.

Begin with Phase 0 now, and write `PROJECT_UNDERSTANDING.md` as part of it. First reply with one short sentence confirming the branch name and baseline plan, then start working.