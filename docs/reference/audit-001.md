# 🔍 COMPLETE PRODUCT, CODEBASE & PRODUCTION-READINESS AUDIT — The Law Kaksha

**Date:** 2026-10-05
**Auditor:** muse (Muse Spark in OpenCode) — senior Product Architect / Full-Stack / QA / UI-UX / Security / DevOps / PM
**Scope:** `thelawkaksha/` monorepo — Next.js 16 (React 19, Tailwind v4) frontend on Vercel, Express.js (MongoDB/Mongoose + local JSON fallback) backend on Render
**Method:** Traced `frontend → API → backend → database` for every major flow. No `.env` values read. No secret values reproduced. Code wins over memory.
**Standard:** FAANG pre-production bar. Brutally honest. UI existing ≠ working.

---

## 1. PRODUCT UNDERSTANDING SUMMARY

### 1. What this product does
D2C learning platform for CA Foundation Paper-2 Business Laws + CSEET. Sells digital passes / notes via Razorpay, unlocks in-browser PDF reader with watermark / DRM, plus quizzes, leaderboard, student dashboard, admin console for materials / orders / students.

### 2. Who it is for
- **Students/Aspirants:** browse courses, buy passes (e.g. ₹199 revision offer), read locked notes in 3D reader, take tests, review feedback. Verified: `frontend/src/app/notes/page.tsx`, `tests/page.tsx`, `EnrollModal.tsx`, `student/page.tsx`.
- **Admins/Faculty:** upload materials, review submissions, orders, device activity. Verified: `backend/src/routes/adminRoutes.js`, `adminController.js`.
- **Staff/Grievance:** DPDP / refund support. Verified: `frontend/src/app/privacy/page.tsx:81`, `refund/page.tsx:70`.

### 3. Primary user journey
`Landing → Browse courses → Product detail → Cart → Checkout (Razorpay) → Verify → Student dashboard → Reader / Quiz → Orders / Progress → Support / Refund`

### 4. Most important features
Auth + single-device lock, catalog, cart / checkout / verify, DRM reader, student dashboard / progress sync, quizzes / leaderboard, admin CRUD / upload, coupons, reviews, health probes.

### 5. Current implementation appears to support
Real register / login / Google / forgot-reset endpoints, real catalog / orders verify HMAC, real admin CRUD for 7+ resources, real quiz submit / leaderboard, range-serving PDF route, health / readyz probes, 36 backend integration tests.

### 6. What appears to be missing
Email delivery for reset, Razorpay webhook / refund / reconciliation, account deletion / export, change-password, logout-all-devices, server coupon enforcement, server entitlement check in reader, pagination / audit logs, frontend tests, monitoring / Sentry, root README.

---

## 2. COMPLETE FEATURE INVENTORY

| Feature | UI Present | Backend Present | Database Present | Fully Functional | Status | Problems |
|---|---|---|---|---|---|---|
| Landing / marketing | YES | YES site-data | YES | Partial | 🟡 PARTIAL | Silent fallback to stale dates/MCQs on fetch fail `ExamCountdownsAndQOTD.tsx:320-366` |
| Register | YES | YES `/api/auth/register` | YES | Yes but weak | 🟡 PARTIAL | No minLength, no email verify, fake default phone |
| Login + device lock | YES | YES `/login` + heartbeat | YES | Yes but bypassable | 🟡 PARTIAL | Skipped if deviceId omitted, forceSwitch no re-auth |
| Google login | YES | YES verifyIdToken | YES | Borderline | 🟡 PARTIAL | Hardcoded client-ID fallback, empty password_hash → 500, email-collision takeover |
| Forgot / reset | YES | YES but no mailer | YES | Broken in prod | 🔴 BROKEN | Non-prod leaks token in JSON; prod never delivers |
| Profile edit | YES | NO endpoint | NO | No | ⚠️ MOCKED | `StudentProfileModal.tsx:72-121` localStorage-only |
| Account deletion / export | NO | NO | NO | No | ❌ MISSING | Only admin hard-delete; DPDP/GDPR fail |
| Catalog / courses | YES | YES `/api/catalog` | YES | Yes with fallback | 🟡 PARTIAL | FALLBACK_PRODUCTS masks outage; includes("ca") fragile |
| Product detail | YES | YES `/catalog/:id` | YES | Partial | 🟡 PARTIAL | 5x duplicated fallback; unknown ID Not Found even if backend has it |
| Cart | YES | NO local-only | NO | Partial | 🟡 PARTIAL | Quantity stepper for PDF licenses allows 5x same pass |
| Checkout Razorpay | YES | YES `/orders/create+verify` | YES | Real but bypassable | 🔴 BROKEN | Test-key fallback + mock pay_LK path in CartDrawer |
| Coupons | YES | Model but unenforced | YES | No | ⚠️ MOCKED | Client-only codes; usedCount never incremented |
| Reader / DRM PDF | YES | YES `/api/pdf/[filename]` | YES | Theater | 🔴 BROKEN | No auth/entitlement; localStorage check + sample heuristic; static /notes/*.pdf directly served |
| Student dashboard | YES | YES `/student/dashboard+sync` | YES | Half-mocked | 🟡 PARTIAL | 2549-line monolith; chapters/books/QOTD hardcoded; includes("foundation") unlocks all |
| Quizzes / submit | YES | YES `/quizzes/:id+submit` | YES | Real but open | 🟡 PARTIAL | Submit unauth trusts user_id; unlimited → poisoning |
| Leaderboard | YES | YES `/leaderboard` | YES | Yes | ✅ COMPLETE | In-memory slice, no pagination |
| Reviews list/post | YES | YES GET/POST | NO memory-only | Partial | 🟡 PARTIAL | POST unauth no rate-limit, is_verified:true hardcoded, restart loss |
| Admin auth | YES | YES requireAdmin | YES | UI bypassable | 🟡 PARTIAL | UI = localStorage role; API blocks except quiz routes |
| Admin products/resources/subs/students/cases/mcq/coupons/settings | YES | YES CRUD | YES | Real but rough | 🟡 PARTIAL | POST-is-upsert, 200-null PUTs, unbounded lists, no audit, mass-assignment |
| Admin upload | YES | YES multer+Cloudinary | YES | Risky | 🟡 PARTIAL | 50MB memory buffer, no whitelist, local mirror to public/notes/ |
| Health / ready | — | YES /healthz /readyz /api/health | YES | Yes | ✅ COMPLETE | Public counts leak; readyz 503 on cold boot |
| Change-password, logout-all, order-cancel/refund, webhook, invoice, notifications, search/sort/pagination, audit logs | NO | NO | NO | No | ❌ MISSING | All missing |

---

## 3. COMPLETE USER JOURNEY AUDIT

### Authentication
- Sign up / Login / Logout exist. Google exists with verifyIdToken.
- Missing: email/phone verification, OTP, lockout, change-password, logout-all, deletion.
- Reset dead in prod (no mailer). 30d JWT never revoked on reset/logout/device-switch.
- Heartbeat/logout unauth (email/studentId only) → enumeration + kick-DoS.
- Device check skipped if deviceId omitted. forceSwitchDevice:true with no OTP = hijack flag.
- Protected routes: middleware.ts only handles /notes/* /samples/*. /student /admin /reader /checkout are client-only localStorage gates. Disable JS or set JSON → render.

### User Account
- Profile edit UI-only, lost on relogin. Email change forks identity. No validation.
- No privacy/notification settings, no device management, no deletion confirmation/cleanup. Orphan subs/attempts/orders on admin delete. GDPR/DPDP non-compliant.

### Main Product Flow (traced)
`/` loads but hides backend failure → `/courses` real catalog else fallback → `/product/[id]` real else 5x duplicate → `/cart` local-only → `/checkout` real HMAC else mock-bypass if secret missing → `/verify` COMPLETED short-circuit good but no webhook → close tab before verify = paid no enrollment → `/student` localStorage gate → `/reader?file=` no server entitlement → full bytes in browser, watermark overlay only.

Every step verified frontend → API → DB. Fallbacks mask outages with fake data presented as real.

---

## 4. EDGE CASE & FAILURE-FLOW TESTING

| Scenario | Behavior | Verdict |
|---|---|---|
| Backend down on home/courses/product | Silent seed render, zero banner | 🔴 masks outage |
| Invalid IDs | 404 correct for catalog/courses/content/orders/quizzes | Good |
| Missing record admin PUT | 200-null → destructure crash 500 | 🔴 |
| Concurrent / double-submit / double-verify | Non-atomic check-then-update, duplicate subs; quiz N attempts; coupons infinite | 🔴 |
| Refresh during payment | No idempotency; pay then close = money no enrollment, no retry | 🔴 |
| Expired session | 401 correct, but 30d + no revocation = never expires server-side | 🔴 |
| Unauthorized /admin/quizzes | 200 allowed — critical | 🔴 |
| Large input / 50MB upload | RAM buffer, 10mb JSON, no per-route limit | 🔴 |
| Corrupt JSON DB | catch re-inits empty = silent wipe | 🔴 |
| Reviews array | Unbounded unshift, restart loss, leak | 🟠 HIGH |
| Empty / loading / error states | Top-level spinner only; per-tab skeletons missing; errors swallowed catch(){}; toasts 3.5s | 🟡 MEDIUM |

No global loading.tsx. Zero role=alert live regions.

---

## 5. UI/UX AUDIT

### Visual Design (6/10)
Cohesive pastel + Tailwind discipline, good min-h-[44px] mostly, sticky summaries. Betrayed by 3974-line admin / 2549-line student, emoji badges no text alt, duplicated auth headers, text-[10px] badges, watermark opacity-20 over text, modal h1 misuse.

### UX (4/10)
Happy paths polished (empty cart, preview limits, success screens). Trust-breaking: quantity-on-PDF, mock-pay path, fake rolls/streak/phone as real, fuzzy includes() entitlements, copy/print/right-click blocking + prompt() page-jump, silent fake fallbacks.

### Responsive
grid-cols-1 lg:grid-cols-12, flex-col sm:flex-row, hamburger aria-label, table→cards CSS good. Reader dock w-7/h-7 <44px fails coarse pointers. 3D viewer 2.4x 4-canvas + unbounded pageCache + preload 4 → mobile OOM. Hero unoptimized LCP.

### Accessibility (3/10)
- Labels without htmlFor/id everywhere (login/register/checkout/cart/courses/admin).
- Steppers/filters/payment toggles no aria-label/aria-pressed. Reader icon buttons title-only (title not announced).
- Zero live regions for errorMsg/coupon/forgot/XP/toast. Suspense fallbacks no role=status.
- Canvas-only PDF no text layer — screen readers get zero content. select-none + preventDefault(Ctrl+P/C) + F12 blocking hostile to AT. Watermark reduces contrast.

---

## 6. FRONTEND CODE QUALITY (3/10)

- God files: admin 3974, student 2549, SecurePdfReader 1148, Book3DViewer 1135, CartDrawer ~1000. No file should exceed ~300 lines.
- Duplication: Uint8Array polyfill x2, CA chapters student vs admin, WEEKLY_CASES x2, FALLBACK_CATALOG 5x, FALLBACK_PRODUCTS repeat, prices 99/299 in 20+ spots.
- lib/api.ts frozen base, hostname sniff breaks proxies/previews; forces JSON (breaks FormData), no timeout/retry/abort, hides parse errors; 10+ direct fetch bypass it; response shape drift token vs data.token.
- Error swallowing catch(e){} in Cart/Device/student/ExamCountdowns/CartDrawer/Google → stale seed.
- State: Cart localStorage-only no server coupon verify; changeFormat no-op; setCheckoutStep shipping→details hack; DeviceSession fake defaults Verified Network/Today, local-only transfer, heartbeat revokes locally without server confirm.
- Bad hooks: refetch on tab click, reload+render per keystroke scale, 11x fan-out no AbortController, stale closure, possible loop on profile write.
- Unused: BookFormat/FORMAT_PRICING/Truck/ShieldCheck etc in cart/page.tsx; Sparkles in product/[id]; Masterclass Mock HD Video, Mains mockPrompts demo-only.
- Hardcoded: coupon codes client-only, test Razorpay key fallback in checkout, Google Client ID in button, prod URL + localhost in lib/api.ts, fake rolls/token/phone/streak.

---

## 7. BACKEND CODE QUALITY (4/10)

- Presence-only validation, no joi/zod. NoSQL strip deletes $/. keys but ignores __proto__ pollution and stored XSS.
- CORS !origin→allow + patterns .*vercel.app / .*the-law-kaksha.* / .*thelawkaksha.com with credentials:true — any lookalike origin passes. Deny is callback(null,false) no 403.
- Manual headers good effort (nosniff/SAMEORIGIN/Referrer/Permissions/HSTS/CSP) but no helmet, CSP keeps unsafe-inline+unsafe-eval, missing frame-ancestors/object-src/base-uri/form-action.
- Hand-rolled in-memory Maps with no eviction (unbounded growth), 60/min auth generous no per-account lockout; quiz/content/student unlimited → spam/brute-force.
- express.json 10mb + 50MB multer memory = RAM exhaustion on free Render.
- morgan dev + console.error everywhere logs PII; global 500 mask with referenceCode Date.now().toString(36) predictable unlogged.
- dotenv.config() twice; critical fallbacks (JWT/Google/Cloudinary/Razorpay-mock) allow boot degraded.
- Inconsistent: register {token,user} vs login/google/verify nested data; order_id/orderId/razorpayOrderId triple-aliased; student_id vs studentId; DELETE {success} vs objects. Reviews auto is_verified:true on user input.
- Duplication: device-conflict login↔google, price tables x3, unlock heuristics x3, findOneAndUpdate+local x20.
- Dangerous: bcrypt.hashSync in-request blocks loop; memory buffering; reviews unshift unbounded; sync-progress $inc shape-only.

---

## 8. DATABASE AUDIT (3/10)

- Dual-write split-brain: register writes Mongo then local unconditionally; verify Atlas sync fire-and-forget no await; reads prefer Mongo else local. Flaky net = divergence, no reconciler.
- Models sane (unique id/email/code/key, indexes on User.email/student_id, Subscription email+accessStatus) but JSON engine enforces nothing: insert() never checks uniqueness/FK; reset() wipes.
- JSON hazards: saveToDisk sync write+rename per mutation blocks loop (Win32 copy fallback); no lock/queue concurrent interleave; multi-instance each own ephemeral file → loss on restart. Corrupt JSON → catch re-inits empty = silent wipe. reviews in-memory only.
- Schema smells: Subscription.amount String "₹449" forces parseInt(replace) revenue math; User.password_hash not required (Google ""); resetPasswordToken/Expires no TTL; type drift is_active:1 vs Boolean, ISO-string vs Date lastActiveAt.
- No pagination/sorting/filtering except in-memory quiz limit slice and catalog filters; dashboard Promise.all fine but unlock triple-duplicated string heuristics.
- N+1 low today, but analytics/dashboard full-collection scans won't survive growth; requireAuth 3-way $or per request no cache.
- No migrations, no audit, hard deletes no cascade (delete student → orphan subs; delete sub → stale unlockedItemIds).

---

## 9. SECURITY AUDIT — Location → Problem → Risk → Fix (no secret values shown)

### CRITICAL

**SEC-01 Open admin in quizRoutes.js**
Location: backend/src/routes/quizRoutes.js:9,295,329,394,426,449. Problem: imports requireAuth/requireAdmin never used. GET/POST/PUT/DELETE /api/admin/quizzes + GET /api/admin/attempts zero auth, separately mounted via server.js:174. Risk: unauth list/create/overwrite/delete exams, dump attempts names+ids+scores. Fix: router.use("/admin",requireAdmin) + 401/403 regression test.

**SEC-02 Secrets + PII + paid PDFs tracked in git**
Location: frontend/.env.production tracked (not ignored), backend/data/lawkaksha_db.json tracked, backend/data/backups/*.json tracked, frontend/public/notes/*.pdf 20+ tracked, root PDFs tracked. .gitignore covers .env/.env.local/backend/.env but NOT .env.production, NOT data/*.json/backups/, /*.pdf only root and defeated once tracked. Risk: rotation impossible without history rewrite; DB JSON has password_hash/email/phone/reset tokens; public clone leaks paid codices + PII. Treat as active breach. Fix: git rm --cached all four classes, rotate JWT/MONGO/RAZORPAY/CLOUDINARY/GOOGLE, gitignore + purge history (BFG) + push-scan.

**SEC-03 Razorpay verification bypass when secret missing**
Location: backend/src/routes/orderRoutes.js:16-27,152-175,248-268 + proof backend/test_e2e.js:132-139. Problem: getRazorpayClient null if keys absent → fake order_timestamp + PENDING; handleVerifyPayment only HMAC if(razorpaySecret) else skips and marks COMPLETED unlocks DRM. test_e2e passes dummy sig proving bypass is tested path. Risk: any deployment without secret = free full-access. Single typo = $0 revenue. Fix: fail-closed 500 if !secret, never mock order_* in production, require signature always, test asserts 400 when unset.

**SEC-04 Hardcoded fallback secrets/IDs**
Location: authMiddleware.js:11 JWT fallback, seed.js:681 admin password literal, mongoSeed.js:197 admin fallback, cloudinary.js:7 cloud_name fallback, authRoutes.js:538-540 Google Client ID fallback + frontend GoogleSignInButton, checkout test Razorpay key fallback, lib/api.ts prod URL. Problem: all function without env, committed. Risk: JWT forgery with public string, guessable admin, payments to test key, foreign-project tokens. Fix: remove fallbacks except PORT/FRONTEND_URL localhost; throw on boot if missing; separate seed:dev never auto-run prod.

### HIGH
- **SEC-05 JWT 30d localStorage no rotation:** 30d Bearer in localStorage lawkaksha_token/active_student/admin_session, Authorization Bearer, no httpOnly/Secure/SameSite, no refresh/revocation, deviceId in JWT never verified in requireAuth. Single XSS = 30d full + admin takeover. Fix: 15-min access + rotating httpOnly refresh + version check, max 1h-24h interim.
- **SEC-06 DRM theater:** pdf route basename good vs traversal but no auth/entitlement, sec-fetch redirect bypassable via fetch, fallback serves default PDF masking 404, ReaderClient isUnlocked = localStorage + sample heuristic, maxAllowedPage UI-only full bytes already in browser, public/notes/*.pdf static. Paid codex downloadable free, watermark overlay div not burned. Fix: gate with JWT+sub, short-lived signed URLs (Cloudinary authenticated), burn watermark server-side, remove static PDFs.
- **SEC-07 Mass assignment:** PUT /admin/products/cases/mcq-tests/coupons/students/subs/resources spread ...req.body / findOneAndUpdate req.body. Stolen admin token can set role/password_hash/is_active/unlockedItemIds. Fix: allow-lists + strip id/role/hash/tokens/device.
- **SEC-08 Upload 50MB no whitelist:** multer.memoryStorage 50MB no fileFilter/magic/AV, only PDF-vs-image sniff chooses folder doesn't reject, ext unsanitised concatenated, local fallback writes backend/uploads/ + mirrors frontend/public/notes/. Malicious SVG/HTML polyglot + DoS. Fix: fileFilter pdf/png/jpeg/webp, 10MB, magic verify, randomUUID + fixed ext, Cloudinary secure_url only, delete mirror, admin limiter.
- **SEC-09 CORS over-permissive + credentials:true:** allowedPatterns substring match — evil lookalike passes. Fix: exact allow-list [thelawkaksha.com, www, FRONTEND_URL] + anchored Vercel team, Vary:Origin, deny 403.
- **SEC-10 Auth hardening:** register any non-empty pw no complexity no verify fake phone; login device skip if omitted, forceSwitch no OTP; heartbeat/logout unauth oracles; forgot returns resetToken when not production (frontend uses directly); reset length<8 only no complexity no limit plaintext token. Fix: strong pw 10+, email OTP, require deviceId, re-auth for switch, auth heartbeat/logout, never return token (email only, dev log), hash sha256, 5/hr limit.

### MEDIUM
- SEC-11 NoSQL sanitiser incomplete + mutates query — replace with express-mongo-sanitize + helmet, test __proto__/$where.
- SEC-12 Stored-review XSS + single dangerouslySetInnerHTML (layout JSON-LD static safe) — rate-limit + captcha /reviews, escape/sanitizeHtml, is_verified:false + approve, tighten CSP remove unsafe-eval + nonces, audit renderers.
- SEC-13 CSRF/cookies/rate-limit — Bearer localStorage no classic CSRF but unauth JSON POSTs no Origin check + CORS wildcard can drive them; limiters in-memory no TTL/share/reset on restart; only auth/orders limited. Fix: global 100/15min + 60/hr auth + 10/hr upload, Redis store, Helmet, combined logs redacted, Origin check.
- SEC-14 Admin UI trusts localStorage; health leaks counts/routes; console.error full err. Fix: server-verify role per load (GET /me), strip counts public, internal detailed port.

---

## 10. API AUDIT

Mounting server.js:169-175 /api/auth→authRoutes, /api→catalog/content/quiz/order/admin, /api/student→studentRoutes + /healthz /readyz /api/health /.

| Endpoint | Method | Auth | AuthZ | Validation | Error | Frontend Used | Status |
|---|---|---|---|---|---|---|---|
| /api/auth/register | POST | No | — | presence only | 400/409/500 | YES register | Weak but real |
| /api/auth/login | POST | No | — | presence only trims pw | 400/401/403/409/500 | YES login | Bypassable device |
| /api/auth/device-heartbeat | POST | No | — | presence, fail-open | always 200 | YES DeviceSession | Oracle |
| /api/auth/logout | POST | No raw email/id | — | none | always 200 | YES | Kick-DoS |
| /api/auth/me | GET | requireAuth | self | — | 500 | NO dead | Unused |
| /api/auth/forgot-password | POST | No | — | presence | uniform 200 good +500 | YES login | No delivery |
| /api/auth/reset-password | POST | No token | — | min 8 only | 400/500 | YES login | Weak |
| /api/auth/google | POST | No | — | credential + verifyIdToken | 400/401/403/500 | YES GoogleBtn | Borderline |
| /api/orders/create + /create-order | POST | No | — | canonical price, raw amount path weak | 400/500 | YES checkout/CartDrawer | Skippable verify |
| /api/orders/verify + /verify-payment | POST | No | — | HMAC iff secret | 400/404/500 idempotent COMPLETED | YES | Bypass if no secret |
| /api/orders/:id | GET | requireAuth | owner email-match OR admin | — | 404/403/500 | NO | Breaks on email change |
| /api/public/site-data | GET | No | — | — | 500 | YES ExamCountdowns | Real |
| /api/catalog | GET | No | — | in-memory filter | 500 | YES courses | Real |
| /api/catalog/:id | GET | No | — | — | 404/500 | YES product/[id] | Real |
| /api/courses*, /:courseId/acts/content/weekly | GET | No | — | query only | 404/[] | NO legacy | Dead |
| /api/resources | GET | No | — | course/act/type/sampleOnly | 500 | NO | Unused |
| /api/public/section16-comparison | GET | No | — | — | hardcoded 200 | NO | Fallback |
| /api/content/:contentId/access | GET | requireAuth | sample-open else sub ACTIVE or admin + watermark | — | 404/403/500 | NO never called by reader | Correct but unused |
| /api/reviews | GET/POST | No/No | POST name/title/comment required slices | 400/201 | GET YES reviews POST NO | Spam vector |
| /api/quizzes, /quizzes/:id | GET | No | level/is_free, answers stripped good | 404/500 | List NO detail YES QuizModal | Real |
| /api/quizzes/:id/submit | POST | No | none trusts user_id/name | 404/500 | YES QuizModal | Open |
| /api/leaderboard | GET | No | quiz_id/limit slice | 500 | YES PublicLeaderboard | Real |
| /api/admin/quizzes*, /admin/attempts | GET/POST/PUT/DELETE | NONE CRITICAL | title+questions create only | 400/404/500 | NO but reachable | PUBLIC HOLE |
| /api/admin/analytics | GET | requireAdmin | — | 500 | NO admin fetches others | Unused |
| /api/admin/products* | GET/POST/PUT/DELETE | requireAdmin | defaults-fill | 201/404 inc/500 | YES admin | Upsert/inconsistent |
| /api/admin/cases/mcq/coupons/students/subs/resources* | mixed | requireAdmin | defaults-fill | 200/201/500 200-null | YES admin | Mass-assign/no page |
| /api/admin/exam/qotd/section16/announce/promo | GET/POST | requireAdmin except public mirrors | none | 500/200-fallback | YES admin | Real |
| /api/announcement, /promo-banners | GET | No public | — | 200+fallback | indirect | Intentional public |
| /api/admin/upload | POST | requireAdmin | file presence only | 400/500 | YES admin | DoS vector |
| /api/student/dashboard | GET | requireAuth admin ?email&studentId override | — | 500 | YES student | Real + fake defaults |
| /api/student/sync-progress | POST | requireAuth strictly req.user | type-checks | 500 | YES student | Good gate |
| /healthz /readyz /api/health / | GET | No | — | — | — | Infra | Counts leak; readyz 503 if empty |

Issues: missing auth (quiz admin, heartbeat/logout/submit/reviews), missing authZ (mass-assign), wrong methods none major, wrong codes (200-null vs 404, always-200), inconsistent responses (token vs data, order_id aliases, student_id variants), missing validation/pagination, over-exposure (attempts PII, health counts), unused 8+ vs missing webhook/refund/delete.

---

## 11. THIRD-PARTY SERVICES & INTEGRATIONS

| Integration | Connected | Prod-ready | Creds correct | Fail handled | Retry | Webhook verified | Fallback | Mocked |
|---|---|---|---|---|---|---|---|---|
| Razorpay checkout/create/verify | YES SDK | NO | sync:false missing can boot degraded + test-key frontend | No webhook/retry, mock order_* dangerous | No | NO — no webhook endpoint (doc phantom) | Mock (dangerous) | Partial mock |
| Google Auth verifyIdToken | YES | Borderline | Fallback wrong project if env missing | No retry/nonce/HD restrict, email-collision takeover | No | N/A | — | Invalid-token test only |
| Cloudinary upload_stream | YES | NO | Hardcoded cloud_name fallback leaks acct | try/catch → local uploads + mirror to public (defeats cloud) | No | N/A | Local always | Local fallback always |
| MongoDB Atlas Mongoose pool 10/8s | YES | NO | MONGODB_URI sync:false | Graceful local fallback masks outage → divergence | No | N/A | JSON (divergent) | Local in tests |
| Email/SMS/OTP/Maps/Analytics/AI/CDN/Monitoring | NO | NO | — | — | — | — | — | Missing |

Doc webhooks.md promises payment.captured/failed/order.paid + RAZORPAY_WEBHOOK_SECRET — code has none. Either implement or delete doc before sign-off.

---

## 12. PAYMENT / TRANSACTION AUDIT (strict)

- Initiation real: POST /orders/create canonicalizes items→price ignores client price, min-100-paise guard good, owner-or-admin read good.
- Verification real HMAC-SHA256 correct code yet skippable if secret unset → free enroll. Mock order_timestamp when keys missing still creates PENDING.
- No webhook, no reconciliation cron, no refunds/partial/cancel endpoints. Client-callback only. Pay → close before /verify = money taken no enrollment no retry.
- Duplicate: idempotent COMPLETED short-circuit good, but check-then-update non-atomic on JSON + Mongo fire-and-forget → concurrent double-verify dupes subs. No idempotency keys.
- Failed/cancelled: passthrough Razorpay err, ondismiss resets loading good, but no status sync, no failure page data.
- Order/payment consistency: amount String vs paise drift, CANONICAL 99/180 contradicts seeded 249/449, unknown IDs 99, admin price edits ignored. Client amount trusted if items empty → ₹1 Active row.
- Coupons never enforced: DB or hardcoded EXEMPTION2026/LAW20/CALAW20/FIRST50/RANKERS/RANKER10 no expiry/usage/min, usedCount never inc. Coupon model fields decorative.
- Records: subscriptions created, unlockedItemIds granted, tempPassword Law@NNNN 4-digit weak stored plaintext + returned in verify payload + bcrypt.hashSync blocks loop.
- Confirmation: success screen with fake roll/token/phone/streak + mock pay IDs in drawer. Real success + demo numbers mixed = trust break.
- Never complete on checkout UI alone — fails.

---

## 13. ADMIN PANEL AUDIT

- Auth: router.use("/admin",requireAdmin) 401/403 proven except quizRoutes hole. UI gate localStorage role forgeable to unlock console (API still blocks except hole).
- Dashboard/analytics exists but frontend never fetches analytics; loads all subs+students regex-parses "₹449" strings — won't scale.
- User/content/product/order management real CRUD against Mongo + local. Search/filters in-memory only, no pagination, no bulk, no audit logs, deletes hard no cascade.
- Payments/reports: analytics counts only, no refund/reconcile, exportToCsv sanitizes =+-@ good spot.
- Modals mark * but no pattern/min/max; file any-type no size/type client check; toast-only errors auto-dismiss; no per-tab loading; isUploading toast only.
- Verify: actions do modify DB, but unsafely (upsert overwrites, 200-null, mass-assign, unbounded, RAM upload).

---

## 14. PERFORMANCE AUDIT

### Frontend
Good: zero <img>, 12 next/image, dynamic pdfjs import, range 206 + private max-age 3600.
Bad: hero fill priority unoptimized bypasses sharp for LCP; priority on 5 logos competes LCP; pdfjs ~1MB+ + Book3DViewer 2.4x DPI 4 canvases + unbounded Map + preload 4 → OOM 250-page codex; route buffers entire range via for-await Buffer.concat defeats streaming spikes Vercel RAM; duplicate 11x admin fan-out, sequential dashboard+resources, refetch on tab; global GSI+Razorpay on static; /api/* rewrite to Render cold-start no SWR/React-Query; AudioContext per flip never close leak.

### Backend
Slow: analytics full scans, 3-way $or per auth no cache, sync saveToDisk per mutation blocks loop, hashSync in-request, unbounded find().lean() lists, regex revenue parse.
No indexes missing major (User email/student_id, Sub email+status exist) but JSON enforces none; no pagination; large 10mb + 50MB payloads.

### Scale estimate
- 10 users: OK (single instance, local fallback works).
- 100 users: strained (cold 50s Render free sleep, JSON lock contention, 50MB uploads OOM, 11x fan-out latency).
- 1,000 users: fails (ephemeral loss on restart, unbounded lists timeout, leaderboard/quiz spam, divergence multi-instance).
- 10,000 users: impossible without Atlas-only + Redis + CDN + pagination + workers + APM.

---

## 15. SEO AUDIT

Wins: layout metadataBase/title/desc/keywords/OG/Twitter/JSON-LD EducationalOrganization+Course, viewport maximumScale:5 userScalable:true (doesn't disable zoom), sitemap 9 static, robots disallow admin/api/student/reader/checkout.
Fails: no canonical/alternates anywhere → duplicate student/students, product/courses split rank; all interactive pages use client → inherit generic homepage title, no per-product OG → share shows homepage card; OG image /images/logo.png vs actual /assets/logo-transparent.png likely 404; sitemap omits /product/* /courses?course=, lastModified now every build wastes crawl budget; robots "/student/" trailing slash doesn't block "/student", /cart indexable thin soft-404 risk; headings one h1 good but reader h1 in modal should h2, student h1 dynamic Dashboard weak keyword; no structured data per product.

---

## 16. TESTING AUDIT

Backend node --test ephemeral harness runner.js random port:
- auth_device 12: register/dup/login/conflict/force/heartbeat/logout/forgot/reset/google-reject — no complexity/lockout/expiry/Google happy (mock invalid only).
- admin_security 6: 401/403 admin, headers, NoSQL $gt neutralised — does NOT test quiz /admin/* (would fail SEC-01).
- security_hardening 8: IDOR dashboard/orders, pricing override ₹1→₹99, backdoor 404 — only items[] path not raw amount.
- orders_drm 4: create/verify/tampered/min-100 — mock secret never real/webhook.
- catalog 6: site-data/catalog/health — snapshot only no schema.
- test_e2e.js 11 asserts NOT run by npm test: register→login→order→verify→analytics sends dummy sig expects success — encodes bypass as pass.
- load_benchmark + backup_restore no CI assertions, no k6 thresholds.

Frontend: zero tests. No *.test.*, no __tests__/, no test script (dev/build/start/lint/typecheck/check only). No unit/integration/e2e/auth/payment/security.

Config/harness ≠ testing. Real value for IDOR/pricing/device/NoSQL; not meaningful for money/upload/XSS/CORS/race/Atlas divergence/frontend DRM.

---

## 17. DEVOPS & DEPLOYMENT AUDIT

- Env: .env.example root/backend/frontend exist, but GOOGLE/CLOUDINARY absent from render.yaml, FRONTEND_URL hardcoded thelawkaksha.com, JWT generateValue good but others sync:false can boot degraded, tracked .env.production overrides Vercel, no vault/validation on boot.
- Build: npm install non-deterministic (use npm ci), next build --webpack no standalone/Dockerfile, rewrite fallback hostname mismatch vs render name, allowedDevOrigins localhost only.
- CI/CD .github/workflows/verify.yml exists: checkout+Node20+npm ci x3+verify on push main/audit/* — no audit/scan/SAST/preview/cache, full build every push slow.
- Health: /api/health counts + /healthz liveness + /readyz DB check good, but public counts leak, readyz 503 if both empty cold flap, no /metrics/SLO.
- Logging/monitoring/error-tracking: morgan dev verbose prod + PII, console everywhere, no JSON/levels/APM/Sentry (referenceCode storeless), no alerts/PagerDuty.
- Backups/recovery: backup_restore.js timestamp+sha256+testRestore JSON parse only — local ephemeral lost on restart, tracked in git leak, no Atlas PITR/scheduled/S3/encryption/RTO/RPO, testRestore doesn't restore.
- Deps: express 4.21/cors 2.8/mongoose 9.10/bcryptjs 3/cloudinary 2/razorpay 2.9/google-auth 11/multer 2 + next 16.3/react 19/pdfjs 6 — no helmet/rate-limit/sanitize, multer bleeding edge pin + audit in CI, no Dependabot, dead pdf-parse.
- Single free Oregon service sleeps + far from India users p95 latency, no frontend service/workers/scheduler/disk.

---

## 18. DOCUMENTATION AUDIT

No root README.md (only AGENTS.md/GEMINI.md). New hire starts docs/README.md with absolute file:///c:/Users/Parth... links broken on GitHub/Vercel.
Decent: 08-operations/setup-and-local-development (Node20, install x3, cp .env.example, dev ports), 05-api reference/auth/errors/openapi.yaml, 03-architecture system/integrations/deployment, 07-security, 11-launch/runbook.
Not clone-and-run because: setup says ensure backend :5000 before npm test false (runner boots ephemeral; test:raw needs API_URL); cp paths ambiguous root vs frontend vs backend; tracked .env.production silently wins; no Windows rename EPERM workaround (database.js:41) documented, no .nvmrc, no MONGO optional note masks prod parity; webhooks.md documents /payment/webhook + secret endpoint doesn't exist; integrations.md cites controllers/paymentController.js / config/db.js paths don't exist (real routes/orderRoutes.js, db/mongo.js) stale Verified claims; no curl Bearer examples, no Postman/Bruno, no sleep-mitigation decision.

---

## 19. PRODUCT COMPLETENESS AUDIT (PM view)

### Missing Features (need but absent)
Deletion/export, change-password, email verification, logout-all, order-cancel/refund/invoice, webhook/reconcile, server coupons/entitlements, pagination/search/sort/filter, audit logs, notifications, nested student routes, device management, monitoring.

### Partially Implemented (UI exists backend incomplete)
Auth/device, catalog, checkout/verify, reader, dashboard, quizzes, reviews, admin CRUD/upload — all real endpoints but bypassable/weak/fallback-masked.

### Fake Features (hardcoded/mocked/placeholder/demo-only)
Client coupons, gamification streak/XP/peer counts, preview PDF mapping all CA→same SOGA, success-screen rolls/token/phone/countdowns, Verified Network/Today defaults, Mock HD Video Stage, mockPrompts, demoModal, announcement/promo fallbacks, dashboard fake lawXp/streak/lastRead hiding emptiness.

### Broken Features (exist but fail)
Reset delivery, mock-pay path, quiz admin authZ, PDF authZ, raw amount path, 200-null PUTs, Google "" hash 500, corrupt-JSON wipe.

### Weak Features (work but poor UX)
4000-line admin / 2500-line student unreviewable, silent fallbacks, toast-only errors, quantity-on-PDF, canvas no text, copy-blocking DRM, sub-44px controls.

---

## 20. REAL-WORLD PRODUCTION READINESS

> If submitted to Google/Microsoft/Apple/Amazon/Meta/Airbnb/Uber for prod today, approve?

**❌ Not production ready — 🟠 Early prototype (demoable, not chargeable).**

Why: money bypassable, PII/secrets/paid PDFs in history, open admin PII dump, DRM free download, 30d forgeable tokens, no webhook/refund, no deletion/DPDP, ephemeral loss, free sleep + Oregon latency. Demo impresses; real users/money/data would fail.

---

## 21. SCORING SYSTEM (0-10, strict, 9-10 only if prod-grade)

| Category | Score /10 |
|---|---|
| Product Concept | 7 |
| Feature Completeness | 4 |
| User Experience | 4 |
| UI Design | 6 |
| Accessibility | 3 |
| Frontend Architecture | 3 |
| Backend Architecture | 4 |
| Database | 3 |
| API Design | 5 |
| Authentication | 4 |
| Authorization | 3 |
| Security | 3 |
| Payment System | 3 |
| Admin System | 5 |
| Error Handling | 5 |
| Performance | 4 |
| Scalability | 3 |
| Testing | 4 |
| SEO | 5 |
| DevOps | 3 |
| Documentation | 5 |
| Code Quality | 5 |
| Maintainability | 5 |
| Production Readiness | 3 |

### OVERALL PRODUCT SCORE: 4.1/10
Sum 99/24=4.125. Concept + static UI lift; authZ/payments/DRM/secrets/scale drag below MVP bar. Nothing 9/10 — nothing prod-grade yet.

---

## 22. PRIORITY-BASED ISSUE LIST

### 🔴 P0 — CRITICAL (must fix before prod)

| Priority | Issue | Location | Impact | Recommended Fix |
|---|---|---|---|---|
| P0 | Open quiz admin CRUD+PII | backend/src/routes/quizRoutes.js:295,329,394,426,449 | Anyone edits exams/dumps attempts | router.use("/admin",requireAdmin) + 401/403 test |
| P0 | Secrets/PII/PDFs in git | frontend/.env.production, backend/data/*.json+backups/, public/notes/*.pdf | Breach, no rotation | git rm --cached, rotate, gitignore, BFG purge, scan |
| P0 | Payment bypass no secret | backend/src/routes/orderRoutes.js:16-27,248-268 | Free enrollments | Fail-closed 500, no mock prod, require sig |
| P0 | Hardcoded fallbacks | authMiddleware.js:11, seed.js, mongoSeed.js, cloudinary.js:7, authRoutes Google, checkout test key | Forgery/hijack | Throw on boot, separate seed:dev |
| P0 | Unauth PDF download | frontend/src/app/api/pdf/[filename]/route.ts:17-77, middleware.ts | Paid free | JWT+sub check, signed URLs, burn watermark, remove static |
| P0 | 30d localStorage no revoke | authRoutes/orderRoutes expiresIn 30d, lib/api.ts | 30d takeover via XSS | 15m access + httpOnly refresh + version |
| P0 | Mass-assignment admin | adminRoutes.js:149-794 spread req.body | Priv escalation | Allow-lists strip role/hash/ids |
| P0 | Reset dead + leak | authRoutes.js:376-524 | No reset / leak | Real mailer, hash tokens, never return |
| P0 | JSON split-brain + wipe | db/database.js:34-63,94-158 | Loss/divergence | Atlas single truth, dev-only local, txns |
| P0 | 50MB upload no whitelist | adminRoutes.js:8-12,681-711 | RCE/XSS/DoS | 10MB MIME+magic UUID Cloudinary private |

### 🟠 P1 — HIGH
Heartbeat/logout oracles, device skip + forceSwitch no re-auth, raw amount ₹1 path, no webhook/refund, coupons unenforced, unbounded lists/no audit, CORS substring, client-only student/admin gates, fuzzy includes() unlock, mock-pay + fake success, quantity-on-PDF, canvas no text, labels unassociated, hero unoptimized, 11x fan-out, corrupt wipe, Google empty-hash 500.

### 🟡 P2 — MEDIUM
No lockout/change-pw/logout-all/deletion, weak IDs/phones, analytics regex revenue, type drift, inconsistent shapes/aliases, swallowed errors, bad hooks, prompt() jump, OG/robots/canonical/sitemap gaps, dev logs PII, no Sentry/metrics, phantom webhook docs, zero frontend tests.

### 🔵 P3 — LOW
Emoji badges, 10px text, duplicate headers, unused imports, AudioContext leak, priority spam, global GSI/Razorpay, readyz flap, testRestore no restore, file:// docs links, touch dock sizing.

---

## 23. FILE-BY-FILE REVIEW (material files only)

**File:** `backend/src/routes/quizRoutes.js`
Problem: No auth on /admin/* despite import. Why matters: exam integrity + PII dump. Severity: P0. Change: add guard + test.

**File:** `backend/src/routes/orderRoutes.js:16-443`
Problem: Skippable HMAC, mock orders, raw amount, weak temp pw, blocking hash, price contradiction. Why: money. Severity P0. Change: fail-closed + webhook + atomic + async hash + single price source.

**File:** `backend/src/middleware/authMiddleware.js:11-64`
Problem: Public JWT fallback, no device/version check. Why: all authZ forgeable. Severity P0. Change: remove fallback, short expiry, version check.

**File:** `backend/src/routes/authRoutes.js:20-727`
Problem: Weak IDs, trim pw, fake phone, unauth heartbeat/logout, dead reset, Google edge. Why: identity. Severity P0/P1. Change: strong pw, OTP verify, require deviceId, re-auth switch, mailer + hashed tokens.

**File:** `frontend/src/app/api/pdf/[filename]/route.ts:5-151`
Problem: Auth-less + oracle fallback + Range free. Why: revenue leakage. Severity P0. Change: gate + signed URLs + server watermark.

**File:** `frontend/src/app/admin/page.tsx (~3974 lines)`
Problem: Forgeable gate, seed masks DB, 11x fetch no abort, a11y, mass-assign caller. Why: unreviewable + spoofable. Severity P1. Change: split <300 lines, server-verify, abort, allow-list.

**File:** `frontend/src/app/student/page.tsx (~2549 lines)`
Problem: Client gate, hardcoded content, fuzzy unlock, swallowing. Why: entitlement bypass. Severity P1. Change: split, server entitlements.

**File:** `frontend/src/components/CartDrawer.tsx:116-307` + `frontend/src/app/checkout/page.tsx:38-604`
Problem: Mock pay IDs + test key + fake creds + qty bug. Why: trust + money bypass. Severity P0/P1. Change: delete mock, remove fallback, qty=1 digital.

**File:** `backend/src/routes/adminRoutes.js:8-1006`
Problem: Upsert POST, 200-null PUTs, unbounded, mass-assign, 50MB upload. Why: data integrity + DoS. Severity P0/P1. Change: allow-list + pagination + audit + limits.

**File:** `backend/src/db/database.js:34-158` + `db/mongo.js`
Problem: Sync block, race, wipe, divergence. Why: loss. Severity P0. Change: Atlas truth, queue, TTL, migrator.

**File:** `backend/src/server.js:48-166`
Problem: CORS substring, custom sanitiser, in-memory limits, 10mb. Why: bypass + DoS. Severity P1. Change: exact allow-list + helmet + sanitize + Redis limits.

**File:** `frontend/src/lib/api.ts:1-149` + `context/DeviceSessionContext.tsx:33-279`
Problem: Frozen base, bypassed, fake defaults, local revoke. Why: fragile + misleading. Severity P1. Change: timeout/retry/abort + server confirm.

**File:** `frontend/src/components/SecurePdfReader.tsx` + `Book3DViewer.tsx`
Problem: Theater DRM, canvas no text, unbounded cache, dupe polyfill, AudioContext leak. Why: a11y + OOM + bypass. Severity P1. Change: server watermark + text layer + bound cache.

---

## 24. FEATURE STATUS MATRIX

| Feature | Complete | Partial | Broken | Missing | Mocked | Notes |
|---|---|---|---|---|---|---|
| Landing | | ● | | | | Silent fallback |
| Register/Login/Google | | ● | | | | Weak no verify |
| Forgot/reset | | | ● | | | No delivery |
| Profile edit | | | | | ● | Local only |
| Deletion/export | | | | ● | | DPDP fail |
| Catalog/product | | ● | | | | Fallback hides outage |
| Cart | | ● | | | | Qty bug local |
| Checkout/verify | | ● | ● | | ● | Mock + test key |
| Coupons | | | | | ● | Client-only |
| Reader DRM | | | ● | | ● | Free download |
| Dashboard | | ● | | | ● | Half hardcoded |
| Quiz/leaderboard | | ● | | | | Open submit |
| Reviews | | ● | | | | Memory + spam |
| Admin CRUD/upload | | ● | | | | Unsafe real |
| Webhook/refund | | | | ● | | Phantom doc |
| Health | ● | | | | | Leaks counts |
| Tests | | ● | | | | 36 backend 0 frontend |

---

## 25. FINAL EXECUTIVE REPORT

### PRODUCT SUMMARY
Sharp niche visual law for CA/CSEET with real auth/catalog/pay/admin/quiz bones and polished marketing shell. Not chargeable: money/content/PII bypassable; secrets+DB+PDFs in git; reset/deletion/webhook absent; scale capped by JSON + free tier.

### BIGGEST STRENGTHS (Top 5)
1. Clear monetizable niche + structured syllabus transformation.
2. Broad endpoint coverage + HMAC/NoSQL/headers basics.
3. Range PDFs + next/image + health probes right instincts.
4. 36 real backend asserts (IDOR/pricing/device).
5. Extensive docs/OpenAPI/runbooks breadth.

### BIGGEST WEAKNESSES (Top 10)
1. Open quiz admin PII dump.
2. Tracked secrets/PII/paid PDFs.
3. Pay bypass without secret.
4. Hardcoded fallbacks.
5. Free PDF download DRM theater.
6. 30d localStorage irrevocable tokens.
7. Mass-assignment admin.
8. Dead reset + token leak.
9. Split-brain JSON + wipe.
10. Zero frontend tests + no webhook/refund/deletion.

### CRITICAL BUGS (P0 x10)
See §22 P0 table — all ship-blockers.

### MISSING FEATURES
Deletion/export, change-pw/logout-all, email verify, order-cancel/refund/invoice, webhook/reconcile, server coupons/entitlements, pagination/search/sort, audit logs, notifications, nested routes, monitoring.

### PARTIALLY IMPLEMENTED
Auth/device, catalog, checkout, reader, dashboard, quizzes, reviews, admin — UI exists server incomplete/bypassable.

### SECURITY RISKS
SEC-01→04 + DRM + JWT + upload + CORS + heartbeat/logout oracles + reset leak. Details §9.

### UX PROBLEMS
Fake data as real, silent failures, labels/live/canvas a11y, sub-44px dock, DRM blocks AT, quantity-on-PDF, prompt() jump.

### ARCHITECTURE PROBLEMS
God components, bypassed API layer, dual-write divergence, in-memory limits, inconsistent shapes/aliases, unbounded lists, sync disk + hashSync.

### PERFORMANCE PROBLEMS
LCP unoptimized, 4-canvas OOM, buffered ranges, 11x fan-out, full scans, cold starts, Oregon far from India, free sleep.

### TESTING GAPS
Frontend 0; pay real-secret, upload/XSS/CORS/race/Atlas-divergence, e2e encodes bypass, no thresholds.

### PRODUCTION BLOCKERS
P0 x10 + DPDP + ephemeral loss + free sleep/Oregon + no Sentry/PITR.

### TOP 10 ACTION ITEMS (exact order)
1. Guard quiz admin + regression test.
2. Purge secrets/DB/PDFs from git + rotate + ignore + scan.
3. Fail-closed payments, delete mock + test key.
4. Remove hardcoded fallbacks, require env on boot.
5. Gate PDFs JWT+sub, signed URLs, server watermark, drop static.
6. Short JWT + httpOnly refresh + revocation.
7. Real mailer + hashed reset + lockout + require deviceId.
8. Allow-list admin + pagination + audit + fix upsert/200-null.
9. Atlas single truth + webhook/refund/reconcile + coupon usedCount.
10. Split god files + labels/live/text-layer + canonical/OG/robots + frontend tests + Sentry + npm ci + PITR.

---

## 26. REVIEW RULES COMPLIANCE
1-20 followed: traced frontend→API→DB, mocked≠real, TODO≠done, placeholder≠complete, no code modified, no high scores without evidence, edge/mobile/deletion/error/empty/authZ all checked, UNVERIFIED marked (OG image 404, scale estimates), implemented vs functional vs production-ready differentiated, inconsistencies flagged, real money/data assumed.

---

# FINAL VERDICT

**Overall Score: 4.1/10**

**Product Stage: 🟠 Early prototype (demoable, not chargeable)**

**Production Ready: NO**

**Estimated Completion: 45%**

**Critical Issues: 10**

**Major Issues: 16**

**Medium Issues: 18**

**Minor Issues: 12**

**Top 10 Fixes:**
1. Auth-guard quiz admin routes
2. Remove secrets/PII/PDFs from history + rotate
3. Fail-closed Razorpay + remove mock/test-key
4. Remove hardcoded JWT/Google/Cloudinary fallbacks
5. Server-gated PDFs + signed URLs + watermark
6. Short-lived httpOnly sessions + revocation
7. Working reset delivery + hashed tokens + lockout
8. Allow-listed admin writes + pagination + audit logs
9. Single-source Atlas + webhook/refund/coupon enforcement
10. Split god files + a11y + SEO + frontend tests + monitoring/backups

*End of audit 001 — evidence-based, convertible to roadmap. Verify each fix with build + lint + tests before close.*
