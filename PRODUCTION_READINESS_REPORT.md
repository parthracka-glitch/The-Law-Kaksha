# The Law कक्षा — Production Readiness Audit Report
**Date:** October 4, 2026  
**Auditor / Lead Reviewer:** Senior Full-Stack Security & QA Lead  
**Branch:** `release/production-hardening`  
**Target Environment:** Vercel (Frontend Next.js 16) + Express/Render (Backend API) + MongoDB Atlas Cluster0  
**Overall Verdict:** **CONDITIONAL GO (Ready for Launch pending Owner Secret Rotation & DNS/KYC)**

---

## 1. Executive Summary & Verification Matrix

Every check was executed under the strict rule: **Evidence over assertion**. All commands, test outputs, and browser subagent visual verifications have been recorded below.

| Category / Check | Severity | Status | Evidence / Test Command | Files / Commits |
|---|---|---|---|---|
| **P0: Atlas Credentials Hardcoded** | P0 | **FIXED** | Leaked Atlas URI removed from code; strictly consumes `process.env.MONGODB_URI` | [backend/src/db/mongo.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/db/mongo.js) (`1234cd9`) |
| **P0: Admin Backdoor Query Bypass** | P0 | **FIXED** | Removed `?admin=true` query param bypass; enforces verified `parsed.role === "admin"` | [frontend/src/app/admin/page.tsx](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/admin/page.tsx) (`1234cd9`) |
| **P0: Student Dashboard & Progress IDOR** | P0 | **FIXED** | Added `requireAuth` + token identity matching; blocks viewing/tampering another student's account | [backend/src/routes/studentRoutes.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/routes/studentRoutes.js) (`1234cd9`) |
| **P0: Unprotected Purchase Backdoor** | P0 | **FIXED** | Deleted `POST /api/student/sync-purchase` entirely; returns 404 Not Found | [backend/src/routes/studentRoutes.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/routes/studentRoutes.js) (`1234cd9`) |
| **P0: Client Price Tampering in Orders** | P0 | **FIXED** | Added `getCanonicalPrice()`; server overrides any client-sent price with ₹99 / ₹180 | [backend/src/routes/orderRoutes.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/routes/orderRoutes.js) (`1234cd9`) |
| **P0: Order IDOR Vulnerability** | P0 | **FIXED** | `GET /api/orders/:id` checks authenticated user email against order owner | [backend/src/routes/orderRoutes.js](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/routes/orderRoutes.js) (`1234cd9`) |
| **P0: Default Admin Auto-Creation in Login** | P0 | **FIXED** | Removed auto-create from `authRoutes.js` & sanitized `mongoSeed.js`; created secure CLI script | [backend/src/scripts/create_admin.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/scripts/create_admin.js), [backend/src/db/mongoSeed.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/db/mongoSeed.js) (`4a87f5c`) |
| **P1: Reader DRM Preview Enforcement** | P1 | **FIXED** | Unpaid visitors are capped at 5 preview pages with "Unlock Full Book for ₹99" CTA | [frontend/src/app/reader/ReaderClient.tsx](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/reader/ReaderClient.tsx) (`812d85b`) |
| **P1: CSEET Shell Coming Soon** | P1 | **FIXED** | Polished coming-soon shell with 8 ICSI units roadmap, sample reader, and pre-order form | [frontend/src/components/student/CseetComingSoonShell.tsx](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/components/student/CseetComingSoonShell.tsx) (`812d85b`) |
| **P1: Missing Standalone Legal Pages** | P1 | **FIXED** | Created `/privacy` (DPDP Act), `/terms`, and `/refund`; linked directly from Footer | [frontend/src/app/privacy/page.tsx](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/privacy/page.tsx), [frontend/src/app/terms/page.tsx](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/terms/page.tsx), [frontend/src/app/refund/page.tsx](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/refund/page.tsx) (`4a87f5c`) |
| **P1: Security Headers & CORS** | P1 | **FIXED** | HSTS (`Strict-Transport-Security`), CSP, X-Frame-Options, strict regex CORS matching | [backend/src/server.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/server.js), [frontend/next.config.ts](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/next.config.ts) (`4a87f5c`) |
| **P1: Serverless Mongo Connection Pooling**| P1 | **FIXED** | Implemented `global.mongoose` connection caching pattern to avoid socket exhaustion | [backend/src/db/mongo.js](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/backend/src/db/mongo.js) (`4a87f5c`) |
| **P2: Devanagari कक्षा Font Rendering** | P2 | **FIXED** | Added "Noto Sans Devanagari", "Mangal" fallbacks in `globals.css` | [frontend/src/app/globals.css](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/globals.css) (`4a87f5c`) |
| **P2: Search Engine Privacy Disallow** | P2 | **FIXED** | `robots.ts` excludes `/admin`, `/api/`, `/student/`, `/reader`, `/checkout` | [frontend/src/app/robots.ts](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/robots.ts) (`4a87f5c`) |
| **P2: Schema.org Pricing Alignment** | P2 | **FIXED** | Changed offer price from ₹399 to canonical ₹99 in root layout JSON-LD | [frontend/src/app/layout.tsx](file:///c:/Users/Parth%20Kaksha/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/frontend/src/app/layout.tsx) (`4a87f5c`) |
| **P2: Dependency Vulnerabilities** | P2 | **PASS** | `npm audit` backend = 0; frontend production runtime (`--omit=dev`) = 0 | `package.json` (`1234cd9`) |
| **P1: Atlas IP Access List** | P1 | **NEEDS HUMAN** | Atlas rejects connections from unwhitelisted IPs (`0.0.0.0/0` must be added in Atlas Console) | [HUMAN_ACTIONS.md](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/HUMAN_ACTIONS.md) |
| **P0: Atlas Credentials in Git History** | P0 | **NEEDS HUMAN** | Leaked user `thelawkaksha_db_user` password must be rotated in Atlas Console | [HUMAN_ACTIONS.md](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/HUMAN_ACTIONS.md) |
| **P1: Live Razorpay Keys & Webhook Secret** | P1 | **NEEDS HUMAN** | Configure live Razorpay Key ID and Secret in Vercel/Render env vars | [HUMAN_ACTIONS.md](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/HUMAN_ACTIONS.md) |
| **P2: Legal Counsel Document Review** | P2 | **NEEDS HUMAN** | Owner/lawyer to review drafted Privacy, Terms, and Refund policies before full commercial launch | [HUMAN_ACTIONS.md](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/HUMAN_ACTIONS.md) |

---

## 2. Phase 0: Discovery & Platform Inventory

- **Frontend:** Next.js 16.3.8 (App Router), React 19.2.4, Tailwind CSS v4, Lucide Icons, PDF.js (`pdfjs-dist 6.3.289`). Deployed on Vercel.
- **Backend API:** Node.js Express 4.21.2, Mongoose 9.10.3, bcryptjs, jsonwebtoken, multer, cloudinary. Deployed on Render/Vercel.
- **Database:** MongoDB Atlas (Cluster0), with synchronous local JSON persistence fallback (`Database` class) for offline resilience.
- **Auth Model:** Stateless JWT (Bearer token, 30-day expiry), single-device hardware lock (`deviceId`), bcrypt password hashing (10 salt rounds).
- **Payment Gateway:** Razorpay (UPI, Netbanking, Cards) with HMAC-SHA256 signature verification.
- **Courses & Pricing:**
  - CA Foundation Business Laws: ₹99/month (Launch offer)
  - CSEET Business Law & Management: ₹99/month (Launch offer / Pre-order)
  - 2-Volume Master Digital Pass: ₹180
- **Public Routes:** `/`, `/courses`, `/about`, `/reviews`, `/contact`, `/privacy`, `/terms`, `/refund`, `/login`, `/register`.
- **Protected Routes:** `/student` (authenticated student), `/reader` (authenticated student with DRM preview limits for unpaid), `/checkout`, `/admin` (strictly administrator role).

---

## 3. Phase 1: Security Audit & Hardening

### Authentication
- Passwords hashed using `bcrypt` (10 rounds).
- Token verification enforces valid JWT signature and active user state (`is_active === true`).
- Uniform error responses on `/api/auth/login` and `/api/auth/forgot-password` prevent account enumeration.
- Sliding-window IP rate limiter protects `/api/auth/*` (60 requests/minute).
- Single device concurrency lock blocks simultaneous multi-device logins.

### Authorization & IDOR
- `GET /api/student/dashboard` checks `req.user.id` and `req.user.email`. Students can only view their own dashboard.
- `POST /api/student/sync-progress` updates progress strictly for the authenticated student (`req.user.id`).
- `GET /api/orders/:id` verifies that `req.user.email === order.customer_email` or `req.user.role === 'admin'`.
- `router.use("/admin", requireAdmin)` protects all `/admin/*` routes.
- Removed query parameter backdoor (`?admin=true` / `?demo=true`).

### Payments & Pricing Integrity
- Prices are strictly determined on the server via `getCanonicalPrice()`. Even if a client sends `{ price: 1 }`, the server enforces ₹99 (course/volume) or ₹180 (combo).
- `POST /api/orders/verify` verifies HMAC-SHA256 payment signature using `RAZORPAY_KEY_SECRET`.
- Order fulfillment is idempotent: multiple verify calls do not generate duplicate credentials.

### Transport & Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- CORS restricted to verified origins (`localhost`, `*.vercel.app`, `thelawkaksha.com`).

---

## 4. Phase 2: Functional QA & Browser Verification

Automated browser and integration tests verified the complete end-to-end journey:
1. **Visitor Navigation:** Home -> Courses -> About -> Reviews -> Contact.
2. **Account Registration:** Register new student -> Unique Student ID issued (e.g., `LRK-2026-008628`) -> JWT token issued.
3. **Login & Session Lock:** Validates roll ID / email and enforces single-device session.
4. **Order Checkout:** Server initiates order (`LK-ORD-XXXXXX`) with ₹99 canonical price.
5. **DRM Reader View:**
   - Unlocked student: Reads complete book with personal watermark (`studentName • rollNumber`).
   - Unpaid student: Limited to 5-page preview with "Unlock Full Book for ₹99" banner.
6. **CSEET Coming Soon Shell:**
   - When switching to CSEET, student dashboard cleanly renders the 8-unit ICSI syllabus roadmap, sample reader, and pre-order form. No unfinished draft data or broken UI is exposed.
7. **Admin Route Protection:**
   - Direct navigation to `/admin` without admin authentication displays unauthorized access blocked screen.
8. **Mobile Viewport (375x667):**
   - Verified zero horizontal overflow, 44px minimum tap targets, smooth drawer navigation.

---

## 5. Phase 3: Database & MongoDB Atlas

- **Serverless Connection Caching:** Implemented `global.mongoose` cached connection pattern in `backend/src/db/mongo.js` to reuse sockets across serverless function invocations and prevent connection exhaustion.
- **Indexes:**
  - `User.email`: `unique: true, index: true`
  - `User.id`: `unique: true, index: true`
  - `User.student_id`: `index: true`
  - `Subscription.email`: `index: true`
  - `Subscription.studentRoll`: `index: true`
  - `Subscription.id`: `unique: true, index: true`
- **Admin Provisioning:** Default admin auto-creation was removed from startup and login handlers. The production administrator is provisioned via the secure CLI tool:
  ```bash
  npm run admin:create
  ```
  or by setting `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` in environment variables.

---

## 6. Phase 4: UX, Performance, SEO & Accessibility

- **Devanagari Font Rendering:** Added `"Noto Sans Devanagari"`, `"Mangal"` font fallbacks in `globals.css` ensuring "कक्षा" displays with crisp rendering across all Android, iOS, Windows, and macOS devices.
- **Page Titles & Meta Descriptions:** Configured on every page including dedicated metadata for `/privacy`, `/terms`, `/refund`, `/courses`, and `/reviews`.
- **Search Engine Directives:**
  - `robots.ts` allows indexation of public pages while disallowing `/admin`, `/api/`, `/student/`, `/reader`, `/checkout`.
  - `sitemap.ts` includes `/`, `/courses`, `/about`, `/reviews`, `/contact`, `/privacy`, `/terms`, `/refund`.
- **Schema.org JSON-LD:** Structured data updated to reflect the canonical ₹99 course offer.

---

## 7. Phase 5: Content & Compliance

- **Privacy Policy:** Standalone page `/privacy` adhering to India's *Digital Personal Data Protection Act, 2023 (DPDP Act)* with purpose limitation, candidate rights, and designated Grievance Redressal Officer.
- **Terms of Service:** Standalone page `/terms` detailing academic IP ownership under the *Indian Copyright Act, 1957*, single-device fair use, and New Delhi jurisdiction.
- **Refund Policy:** Standalone page `/refund` outlining instant digital access fulfillment and 48-hour unresolvable technical failure guarantee.
- **Footer Links:** All footer legal links point to permanent server-rendered URLs ready for Razorpay merchant activation / KYC auditing.

---

## 8. Phase 7: Verification Test Summary

```
=======================================================
   THE LAW KAKSHA — VERIFICATION EVIDENCE LOG
=======================================================

1. Backend Unit & Security Test Suite:
   Command: npm test
   Result:  32 passed, 0 failed (100% PASS)

2. Backend End-to-End Integration Suite:
   Command: node test_e2e.js
   Result:  13 passed, 0 failed (100% PASS)

3. Frontend TypeScript Typecheck:
   Command: npm run typecheck (tsc --noEmit)
   Result:  Exit Code 0 (0 errors)

4. Frontend Production Build:
   Command: npm run build (next build --webpack)
   Result:  19/19 routes compiled successfully, Exit Code 0

5. Frontend ESLint Validation:
   Command: npm run lint
   Result:  0 errors (Exit Code 0)

6. Dependency Security Audit:
   Command: npm audit (backend)
   Result:  0 vulnerabilities
   Command: npm audit --omit=dev (frontend)
   Result:  0 vulnerabilities
```

---

## 9. Final Launch Verdict: CONDITIONAL GO

The codebase on `release/production-hardening` is hardened, tested, and secure.  
**Launch can proceed immediately upon completion of the 4 manual external actions listed in [HUMAN_ACTIONS.md](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/HUMAN_ACTIONS.md).**
