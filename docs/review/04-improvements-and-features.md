# 04 — Improvements & Features Roadmap

## A. Production Hardening (Launch-Grade Requirements)

### P0 — Week 1 (Blockers — Must Fix)

| # | What | Why | Expected Value | Difficulty |
|---|---|---|---|---|
| 1 | **Integrate Razorpay SDK** — Server-side order creation via `razorpay.orders.create()`, load `checkout.js` on frontend, HMAC signature verification on `/api/orders/verify` | Currently zero real payments are processed. The entire e-commerce flow is a simulation. | Revenue collection becomes real. Eliminates SEC-001, SEC-005 | L (3-5d) |
| 2 | **Replace JSON DB with PostgreSQL** — Use Render's free PostgreSQL add-on or Supabase. Migrate schema to SQL tables with proper PK/FK/UNIQUE constraints and indexes | JSON file has no ACID, no concurrency, no backups, no scalability. Data loss is guaranteed. | Data durability, ACID transactions, concurrent-safe, backups, query performance. Eliminates DATA-001, DATA-002, DATA-003, PERF-001, PERF-002 | L (5-7d) |
| 3 | **Remove all hardcoded secrets** — JWT secret, Razorpay keys, admin passwords must come from environment variables only. Crash on missing required vars at startup. | Source code is the equivalent of a public password file. | Eliminates SEC-002, SEC-003. Prevents auth bypass. | S (<1d) |
| 4 | **Fix CORS** — Remove line 46 catch-all in `server.js`. Only allow configured origins. | Currently any website can make authenticated requests. | Eliminates SEC-004. | S (<1d) |
| 5 | **Remove demo credentials from login page** — Delete the "Quick Login Credentials" block from `login/page.tsx` | Any visitor can access admin dashboard. | Eliminates SEC-006. | S (<1d) |
| 6 | **Add authentication to legacy endpoints** — Add `requireAdmin` to `/api/students` and `/api/students/profile` | All student PII is publicly accessible. | Eliminates SEC-007, COMP-001. | S (<1d) |
| 7 | **Add `helmet` middleware** — `npm install helmet` + `app.use(helmet())` | No security headers against XSS, clickjacking, MIME sniffing. | Eliminates SEC-009. | S (<1d) |

### P1 — Month 1 (High Priority)

| # | What | Why | Expected Value | Difficulty |
|---|---|---|---|---|
| 8 | **Add rate limiting** — `express-rate-limit` on auth endpoints (5/min login, 3/min register), global 100/min | Unlimited brute-force and spam possible. | Eliminates SEC-008. | S |
| 9 | **Input validation & sanitization** — Use `express-validator` or `zod` for all request bodies. Enforce field lengths, types, patterns. | Mass assignment, XSS, oversized payloads possible. | Eliminates SEC-010, SEC-013. | M |
| 10 | **Fix IDOR in order verification** — Remove user-rebinding logic at `orderRoutes.js:297-299` | Any user can steal another user's order/entitlements. | Eliminates SEC-011. | S |
| 11 | **JWT token security** — Reduce expiry to 1 hour, implement refresh tokens, add token revocation | 30-day tokens with no revocation. | Eliminates SEC-012. | M |
| 12 | **Move tokens to httpOnly cookies** — Replace localStorage token storage with secure cookies | Token theft via XSS. | Eliminates SEC-015. | M |
| 13 | **Add CI/CD pipeline** — GitHub Actions with lint → typecheck → test → build gates | No automated quality checks before production. | Eliminates DEVOPS-001. | M |
| 14 | **Add graceful shutdown** — Handle SIGTERM, drain connections, save state | Data corruption on deploy. | Eliminates REL-002. | S |
| 15 | **Add unit & integration tests** — Jest for backend routes/middleware, Vitest + React Testing Library for frontend | 1 test file, zero unit tests. | Eliminates TEST-001. | L |
| 16 | **Implement pagination** — All list endpoints should accept `page` + `limit` query params | Admin dashboard will timeout at 1K+ orders. | Eliminates PERF-001. | M |
| 17 | **Add structured logging** — Use `pino` with JSON output, request IDs, log levels | Cannot debug, monitor, or trace issues. | Eliminates REL-003. | M |
| 18 | **Fix fake structured data** — Generate aggregate rating from actual reviews, not hardcoded `4.9 / 3840` | SEO penalty risk, consumer protection violation. | Eliminates COMP-002. | S |

---

## B. Advanced Upgrades (Post-Launch Enhancements)

| # | What | Why | Expected Value | Difficulty | Priority |
|---|---|---|---|---|---|
| 19 | **Email transactional system** — SendGrid/Resend for order confirmations, password reset, welcome emails | No password reset path. No order confirmations. Users are locked out if they forget passwords. | User retention, trust, compliance | M | P1 |
| 20 | **Real DRM system** — Server-side device fingerprinting, signed PDF URLs with expiry, streaming video with signed tokens | Current "DRM" is entirely client-side fake data. PDFs are not actually served. | Content protection, revenue protection | L | P1 |
| 21 | **Webhook-based payment confirmation** — Razorpay webhook handler for reliable payment status updates | Client-side verify can fail silently. Webhooks ensure eventual consistency. | Payment reliability | M | P1 |
| 22 | **Admin authentication hardening** — MFA for admin, IP allowlist, audit logging for admin actions | Single-factor admin access with no audit trail. | Security posture | M | P1 |
| 23 | **Docker + docker-compose** — Multi-stage Dockerfile, compose for local dev with PostgreSQL | No reproducible dev environment. | DX, env parity | M | P2 |
| 24 | **Redis caching layer** — Cache catalog queries, session data, rate limit counters | Every request reads from DB. No caching. | Performance at scale | M | P2 |
| 25 | **Object storage (S3/R2)** — Store actual PDF and video files with pre-signed URLs | No actual content delivery mechanism exists. | Core product delivery | L | P1 |
| 26 | **Search engine** — Full-text search with Meilisearch or PostgreSQL FTS for product catalog | Current search is `Array.filter` with `includes()`. | Search quality, performance | M | P2 |
| 27 | **Analytics dashboard** — Real metrics with Plausible/PostHog for user behavior, conversion tracking | No analytics instrumentation. | Business insights | M | P2 |
| 28 | **Feature flags** — LaunchDarkly or environment-based flags for gradual rollouts | No deployment safety mechanism. | Deploy safety, A/B testing | M | P2 |
| 29 | **Error tracking** — Sentry for both frontend and backend error monitoring | Errors are logged to `console.error` and lost. | Incident detection | S | P1 |
| 30 | **PWA / Offline access** — Service worker for offline PDF reading, push notifications for exam reminders | Students need offline access to study materials. | User retention, mobile UX | L | P2 |

---

## Phased Roadmap

### 🔴 Week 1: Blockers (Items 1-7)
**Goal**: Make the application minimally safe to deploy.
- Day 1-2: Remove hardcoded secrets (#3), fix CORS (#4), remove demo creds (#5), auth legacy endpoints (#6), add helmet (#7)
- Day 3-5: Integrate Razorpay SDK (#1)
- Day 3-7: Replace JSON DB with PostgreSQL (#2)

### 🟡 Month 1: High Priority (Items 8-18)
**Goal**: Reach "production-acceptable" security and reliability.
- Week 2: Rate limiting (#8), input validation (#9), fix IDOR (#10)
- Week 2-3: JWT security (#11-12), CI/CD (#13), graceful shutdown (#14)
- Week 3-4: Tests (#15), pagination (#16), logging (#17), fix structured data (#18)

### 🟢 Quarter 1: Advanced (Items 19-30)
**Goal**: Build a genuinely competitive product.
- Month 2: Email system (#19), error tracking (#29), real DRM (#20), webhooks (#21)
- Month 2-3: Admin MFA (#22), object storage (#25), Docker (#23)
- Month 3: Redis (#24), search (#26), analytics (#27), feature flags (#28), PWA (#30)

---

## Go/No-Go Launch Checklist (PRR Style)

| # | Requirement | Status | Owner | Notes |
|---|---|---|---|---|
| 1 | Real payment integration with signature verification | ❌ Not started | Backend | SEC-001, SEC-005 |
| 2 | Production database with ACID guarantees | ❌ Not started | Backend | DATA-001 |
| 3 | No hardcoded secrets in source | ❌ Not started | Backend | SEC-002, SEC-003 |
| 4 | CORS restricted to known origins | ❌ Not started | Backend | SEC-004 |
| 5 | Authentication on all PII endpoints | ❌ Not started | Backend | SEC-007 |
| 6 | Security headers (helmet) | ❌ Not started | Backend | SEC-009 |
| 7 | Rate limiting on auth endpoints | ❌ Not started | Backend | SEC-008 |
| 8 | Input validation on all endpoints | ❌ Not started | Backend | SEC-010 |
| 9 | CI/CD with test gating | ❌ Not started | DevOps | DEVOPS-001 |
| 10 | Automated database backups | ❌ Not started | DevOps | DATA-002 |
| 11 | Graceful shutdown handling | ❌ Not started | Backend | REL-002 |
| 12 | Error tracking (Sentry or equivalent) | ❌ Not started | Full stack | — |
| 13 | Privacy policy page | ❌ Not started | Legal/Frontend | COMP-001 |
| 14 | Rollback plan documented and tested | ❌ Not started | DevOps | — |
| 15 | Load test passing at 10x expected traffic | ❌ Not started | SRE | — |
