# The Law Kaksha — Super-Optimized & Scalable Plan (Vercel + Render + Mongo Atlas)

**Goal:** Zero-lag UX on free tier now, scalable-ready architecture for 10,000 req/sec later with no rewrite.
**Constraint:** Simple hosting — select `backend/` on Render, select `frontend/` on Vercel, add ENV keys only. No manual server setup.
**Stack locked:** Frontend Next.js 16 (React 19, Tailwind v4) on Vercel · Backend Express.js (Node) on Render · DB MongoDB Atlas · Media Cloudinary · Payments Razorpay · Cache Upstash Redis + Cloudflare CDN.

> Reality check: Render free = 1 shared CPU + 512MB RAM + spins down, no autoscale. Vercel Hobby = limited bandwidth/functions. Ping-cron keeps Render awake but does NOT add power. This plan gives you fast 100-500 concurrent users on free, and same code scales to 10k/sec when you switch backend to paid (Fly/Railway/Render Standard) + Atlas M10+.

---

## Phase 0 — One-Click Hosting Baseline (Do First)

### 0.1 Repo layout (do not change)
```
thelawkaksha/
  frontend/      -> Vercel Root Directory
  backend/       -> Render Root Directory
  render.yaml    -> Render infra-as-code
  .env.example   -> single source of env keys
```

### 0.2 Render (backend) — 3 clicks
1. New Web Service → select GitHub repo → Root Directory: `backend`
2. Build: `npm install` · Start: `npm start` · Health check: `/api/health` (already in `render.yaml:10`)
3. Add ENV only (no code change):
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://thelawkaksha.com
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/thelawkaksha?retryWrites=true&w=majority
JWT_SECRET=<64-char-random>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
REDIS_URL=  # Upstash, Phase 4
```
4. Keep existing cron ping (UptimeRobot / GitHub Action every 10 min → `GET /api/health`) until you move to paid always-on. This fixes sleep, not power.

### 0.3 Vercel (frontend) — 3 clicks
1. New Project → same GitHub repo → Root Directory: `frontend`
2. Framework: Next.js (auto-detect) · Build: `npm run build` · Output: `.next`
3. Add ENV only:
```
NEXT_PUBLIC_API_URL=https://the-law-kaksha-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://thelawkaksha.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

### 0.4 Verify one-click works
- [ ] Push to `main` → Render auto-deploys backend, Vercel auto-deploys frontend
- [ ] `GET /api/health` returns 200 in <300ms warm
- [ ] Frontend loads with only ENV set, no manual build steps

---

## Phase 1 — Frontend: No-Lag UX (Vercel)

Do in `frontend/` order:

1. **Rendering:** SSG for marketing + course list, ISR (`revalidate: 3600`) for material/test list, SSR only for dashboard/checkout. Never fetch all courses client-side on first paint.
2. **Images/Video:** `next/image` (AVIF/WebP, `sizes`), lazy-load videos — thumbnail + play on click. Move all uploads to Cloudinary with `f_auto,q_auto`. No video files in repo or on Render disk.
3. **Bundle:** Code-split per route, dynamic `import()` for player/charts/PDF viewer, remove moment/lodash-full, `optimizePackageImports` in `next.config.js`. Target JS <180KB first load.
4. **Fonts/CSS:** `next/font` self-hosted, Tailwind purge (v4 auto), no render-blocking CSS.
5. **Data:** Central `lib/api-client.ts` with `fetch` + `next.revalidate`, SWR for dashboard, prefetch on hover (`<Link prefetch>`), debounce search 300ms, pagination `?page&limit=20`.
6. **Perceived speed:** Skeleton cards, optimistic enroll/test-submit, offline cache for PDFs via service worker, `loading.tsx` + `error.tsx` per segment.
7. **Headers:** In `next.config.js` / `vercel.json`:
```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400  # static
Cache-Control: private, no-store  # /dashboard, /checkout
```
8. **Target:** LCP <2s, INP <200ms, CLS <0.1 on Moto G4 + 4G. Run `npm run build && npx lighthouse` before every release.

---

## Phase 2 — Backend: Lean & Stateless (Render)

Do in `backend/` order — must stay stateless (no local disk, no in-memory sessions):

1. **Runtime:** Keep Express (no rewrite). Add `compression`, `helmet`, `cors({origin: FRONTEND_URL})`, `express-mongo-sanitize`, `hpp`. Set `trust proxy: 1`. `NODE_OPTIONS=--max-old-space-size=460` for free 512MB.
2. **Connection reuse (critical):**
   - Single Mongoose connection, `maxPoolSize: 10` (free) / `20` (paid), `minPoolSize: 2`, `serverSelectionTimeoutMS: 5000`.
   - Never `connect()` per request. Export `db.js` singleton.
3. **Query discipline:** Every list route: `?page&limit` (max 50), `.lean()`, `.select()` only needed fields, `.sort({createdAt:-1})` only on indexed field. No `find()` without limit.
4. **Indexes (Atlas):** Create in code `schema.index()` + verify in Atlas:
```
users: {email:1} unique, {rollId:1} unique
courses: {slug:1} unique, {isPublished:1, createdAt:-1}
enrollments: {userId:1, courseId:1} unique
tests: {courseId:1, isPublished:1}
```
5. **Rate-limit + timeout:** `express-rate-limit` — 100 req/15min per IP for auth, 600/15min for reads. `timeout: 15s`, graceful `503 + Retry-After` when overloaded. This prevents 1 user hanging Render free.
6. **Health + readiness:** Keep `/api/health` (no DB) for cron/Uptime + `/api/ready` (DB ping) for Render health check. Cron pings `/health` only to avoid DB cost.
7. **Logs:** JSON logs, no `console.log` per request, `morgan: combined` only for 4xx/5xx in prod. Never log JWT, passwords, Razorpay secrets.

---

## Phase 3 — Database: Mongo Atlas (Locked Choice)

1. **Tier path:** Start M0 free. When p95 >500ms or connections >80% → M10 (dedicated, 2GB RAM). Same connection string, only ENV change. No code rewrite for 10k/sec — M30+ + sharding later.
2. **Schema rules:** Reference (`userId`, `courseId`) not nested arrays >100 items. Store video as URL/ID, not binary. TTL index for OTPs/logs (`expireAfterSeconds`).
3. **Atlas config checklist:**
   - [ ] Network Access: allow Render + Vercel IPs (0.0.0.0/0 only if no VPC, with strong user + IP allowlist when paid)
   - [ ] DB user least-privilege (readWrite on `thelawkaksha` only)
   - [ ] Automated snapshots on (M10+), export M0 via `npm run db:backup` weekly
   - [ ] Profiler slow query >100ms → add index
4. **Fallback:** Keep existing local JSON fallback ONLY for dev/tests. In prod fail fast with `503 DB unavailable` + alert, never silently use JSON.

---

## Phase 4 — Cache: The 10x Trick (Free-Tier Compatible)

Without cache, every user hits Atlas + Render. With cache, 80% never do.

1. **Add Upstash Redis (free 10k cmds/day, HTTP — works on Render free):** `REDIS_URL` ENV only.
   Cache keys: `courses:list:v1`, `course:{slug}:v1` (TTL 1h), `tests:{courseId}:v1` (TTL 30m), `user:{id}:enrollments` (TTL 5m, invalidate on enroll).
   Pattern: cache-aside + `stale-while-revalidate` — serve stale instantly, refresh in background.
2. **Cloudflare free in front:** DNS → Cloudflare → Vercel + Render. Cache static + `GET /api/courses*`, bypass `/auth/*`, `/payments/*`. This alone absorbs traffic spikes.
3. **Client cache:** `ETag + If-None-Match` on backend, `SWR` dedupe 10s on frontend.
4. **Invalidate checklist:** On admin publish/edit → `DEL courses:list* course:{slug}*`. On enroll/payment → `DEL user:{id}:*`.

---

## Phase 5 — Media, Payments, Jobs (Off-Request)

1. **Media:** All PDFs/images → Cloudinary (`resource_type: auto`, eager `f_auto,q_auto`). Videos → Cloudinary / Mux / YouTube unlisted embed. Never store on Render ephemeral disk.
2. **Payments:** Razorpay checkout on frontend, verify webhook on backend (`/api/payments/webhook` raw body, signature check, idempotency key). Never trust client amount.
3. **Heavy jobs out of request:** PDF gen, emails, SMS, reports → queue. Now: fire-and-forget + cron retry (free). Later (no code change, swap adapter): BullMQ + Upstash or Inngest. Request must return in <500ms, job completes async.
4. **Cron jobs (free):** GitHub Actions schedule every 10 min: `curl $API/api/health` (keep-awake) + nightly `db:backup`. When paid: Render Cron Jobs + Inngest.

---

## Phase 6 — CI/CD: GitHub → Auto-Live (No Manual Steps)

`.github/workflows/ci.yml` must:
1. `npm run typecheck --prefix frontend` + `npm test --prefix backend` + `node scripts/verify.js`
2. On `main` push → Vercel + Render auto-deploy (no CLI needed). Preview deploys for PRs.
3. Required secrets only in GitHub → Vercel/Render ENV sync, never in repo. Keep `.env.example` updated; CI fails if new required key missing from example.

---

## Phase 7 — Security + Abuse Protection (Required Before Scale)

1. Auth: `httpOnly Secure SameSite=Lax` cookies or Bearer short JWT (15m) + refresh (7d rotate). `bcryptjs` 12 rounds. Lockout 5 fails/15m.
2. IDOR: every `/users/:id`, `/enrollments/:id` checks `req.user.id === param OR admin`. Central `requireAuth + requireRole` middleware.
3. Validation: `zod`/`express-validator` on every body/query, file type + 5MB limit, sanitize filename.
4. Headers + CORS + rate-limit as Phase 2. Cloudflare Bot Fight Mode on for `/auth/*`.
5. Secrets: never commit `.env`. Details of unfixed vulns only in `docs/audit/private/SECURITY_NOTES.md` (gitignored).

---

## Phase 8 — Observe & Prove Fast (Free Tools)

1. **Minimal now:** Vercel Analytics + Speed Insights, Render metrics, Atlas slow-query profiler, UptimeRobot 5-min check + Discord/Slack webhook. Log `p50/p95`, 5xx rate, Atlas connections.
2. **Alerts:** 5xx >1% 5m → alert. p95 >1.5s 10m → alert. Atlas CPU >70% → scale reminder.
3. **Load test before claim:** `k6` or `autocannon` from local (never DDoS free tier):
```
npx autocannon -c 50 -d 30 $API/api/courses
npx autocannon -c 200 -d 30 $FRONTEND/
```
Record in `docs/08-operations/loadtest.md`. Expect free: ~50-150 rps reads cached, ~20-50 rps DB writes. If you need 10k rps demo, run same script against paid preview (Fly 4x + Atlas M30 + Redis) — same code passes.

---

## Phase 9 — Path to 10,000 req/sec (No Rewrite, Only Scale-Up)

When ready to go beyond free, change hosting only:

1. Backend: Render Free → Render Standard (2GB, always-on, autoscale 2-10) or Fly.io / AWS ECS. Set `instances: min 3`. Keep `rootDir: backend`, same start command.
2. DB: Atlas M0 → M10/M30, enable auto-scaling, read replica for course/test reads.
3. Cache: Upstash → Upstash Pro + Cloudflare APO full-page cache. 95% reads never hit origin.
4. Split: Move `/uploads`, webhooks, reports to separate worker service so API stays fast.
5. CDN + WAF + DDoS on Cloudflare Pro. Videos on Mux/Cloudflare Stream (infinite scale).

Same GitHub repo, same folders, same ENV keys + 2 new (`REDIS_URL`, `REPLICA_URI`). Just bump plans.

---

## Done Checklist (No Missing Key)

- [ ] Render root `backend`, Vercel root `frontend`, deploy with ENV only
- [ ] Atlas indexes created + verified with `explain()`
- [ ] Pagination + lean + select on all lists
- [ ] Redis cache for hot reads + invalidate on write
- [ ] Cloudflare in front, compression on, images optimized
- [ ] Rate-limit + timeout + health/ready endpoints
- [ ] Backups + rollback (`render.yaml` + Vercel instant rollback tested)
- [ ] Lighthouse LCP<2s, autocannon baseline recorded
- [ ] No secrets in repo, `.env.example` complete

**Next action:** implement Phase 1 + 2 + 4 in that order — biggest lag removal per hour spent.

[muse 2026-10-05 src:render.yaml,.env.example verified]
