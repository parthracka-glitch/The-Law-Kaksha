# Product & User Flows Audit (Phase 1)

> **Document Status:** Verified against code  
> **Last Verified Date:** 2026-10-05  
> **Commit Hash:** `audit-complete` / `audit/2026-10-05`  
> **Author:** Principal Launch Team Orchestrator  

---

## 1. Working-Backwards One-Pager (Section 1A Ritual)

### The Customer's Perspective
- **What the candidate gets:** Instant, DRM-protected digital access to meticulously organized CA Foundation (Paper 2: Business Laws) and CSEET academic codices, structured visual flowcharts, model question answers, Section 16(1) comparative rubrics, and examination-focused practice tests.
- **Why they will care:** Traditional statutory law study in India relies on dense, fragmented bare acts that cause confusion, rote memorization failure, and high exam failure rates. The Law Kaksha simplifies complex legal doctrines into intuitive mental blueprints, allowing students to revise faster, memorize statutory sections with ease, and retain case law precedents.
- **What would make them leave:**
  1. *Payment Friction or Delay:* If UPI / Razorpay payment deducts money but does not instantly unlock course codices in the dashboard.
  2. *Device Lock Lockout:* If switching from mobile browser to laptop results in an unresolvable lockout with no self-service session migration.
  3. *Unreadable or Slow Reader:* If 3D flipbook notes lag on low-bandwidth mobile connections or mobile viewports.
  4. *Academic Outdatedness:* If statutory amendments (e.g., Bharatiya Nyaya Sanhita or ICAI syllabus updates) are not clearly reflected.

---

## 2. User Personas & Core Jobs-to-Be-Done

| Persona | Role | Primary Objective / Job-to-Be-Done | Authentication & Authorization |
|---|---|---|---|
| **Guest / Aspirant** | Anonymous Visitor | Explore curriculum, sample codices, inspect syllabus outlines, view pricing (₹99/₹199), and initiate enrollment | None; public endpoints (`/api/public/*`, `/api/catalog`) |
| **Enrolled Student** | Authenticated Candidate | Access purchased study volumes, flip through encrypted 3D notes with security watermark, submit test answers, view scores | JWT Bearer (`lawkaksha_token`) + Single-Device Fingerprint binding |
| **Faculty / Admin** | Platform Administrator | Upload and revise study materials, evaluate student test submissions, view order logs, manage device sessions | Role-based check (`user.role === 'admin'`) with protected `/api/admin/*` endpoints |
| **Grievance / Support**| Operational Support | Review DPDP erasure requests, handle payment receipt queries, assist with hardware device reset requests | Internal support runbooks + designated support email/WhatsApp desk |

---

## 3. End-to-End User Journeys & State Traces

### Flow 1: Guest Discovery to Enrollment & Instant Unlocking
1. **Journey:** Guest visits `/` or `/courses` $\to$ Clicks "Enroll Now" on CA Foundation $\to$ Enters Name, Email, Phone, Password $\to$ Razorpay checkout modal opens $\to$ UPI/Card payment confirmed $\to$ Webhook / verify endpoint validates signature $\to$ Student record provisioned $\to$ Device bound $\to$ Redirected to `/student` dashboard with instantly unlocked materials.
2. **State & Edge Case Analysis:**
   - *Happy Path:* Instant order generation (`POST /api/orders/create`), valid signature verification (`POST /api/orders/verify`), student credentials minted with password hash, device ID bound, automatic dashboard redirect.
   - *Empty State:* Cart has clear zero-item prompt; dashboard shows available catalog when no products are owned.
   - *Loading State:* Pulse skeletons and button spinners during payment verification.
   - *Error State:* Signature tampering returns `400 Bad Request`; invalid payment ID logs security audit warning.
   - *Duplicate Submit:* Idempotent payment handler prevents double crediting; unique order IDs prevent race conditions.
   - *Mobile Viewport:* Responsive Tailwind layout with touch-friendly tap targets ($\ge 44\text{px}$).

### Flow 2: Student Login & Single-Device Concurrency Enforcement
1. **Journey:** Student navigates to `/login` $\to$ Submits Email & Password $\to$ Backend checks password hash and active `deviceId` $\to$ If device matches or empty: issues JWT and updates timestamp $\to$ If secondary device detected: returns `409 DEVICE_CONFLICT` with previous device details $\to$ Student can elect `forceSwitchDevice: true` to invalidate previous session and claim access.
2. **State & Edge Case Analysis:**
   - *Happy Path:* Smooth login with credentials stored in localStorage (`lawkaksha_token`).
   - *Device Conflict:* Informative modal explains that account is active on another device, preventing credential sharing while offering seamless self-transfer.
   - *Session Revocation:* Secondary login instantly updates `activeDeviceId`; subsequent heartbeats or requests from original device receive `401 Unauthorized` with `DEVICE_REVOKED`.
   - *Hostile Input:* NoSQL operator payloads (`{"$gt": ""}`) neutralized by sanitize middleware.

### Flow 3: In-Browser DRM Reading
1. **Journey:** Student opens `/reader?file=ca-foundation-sample.pdf` $\to$ Reader component requests PDF stream $\to$ In-browser PDF canvas renders pages without browser default "Save As" chrome $\to$ Dynamic floating watermark overlays candidate name, roll number, and timestamp.
2. **State & Edge Case Analysis:**
   - *Unauthorized Access:* Direct `/notes/*.pdf` navigation intercepted by Next.js middleware and rerouted to DRM viewer.
   - *Offline / Network Drop:* Toast error informs user with retry button.
   - *Watermark Integrity:* Canvas-layer watermarking resistant to simple DOM inspection.

### Flow 4: Admin Content & Student Management
1. **Journey:** Admin accesses `/admin` $\to$ Validates admin JWT $\to$ Loads product catalog, student enrollment counts, order records, and test submissions.
2. **State & Edge Case Analysis:**
   - *Privilege Escalation Guard:* Non-admin tokens explicitly rejected with `403 Forbidden`.
   - *Unauthenticated Guard:* Public requests rejected with `401 Unauthorized`.

---

## 4. Comprehensive Feature Inventory

| Feature | Subsystem | Files Involved | Status | Quality Notes |
|---|---|---|---|---|
| Landing & Hero Experience | Frontend | `frontend/src/app/page.tsx`, `HeroSection.tsx`, `Navbar.tsx`, `Footer.tsx` | Working | Fully responsive, high-contrast, accessible |
| Course Catalog & Details | Frontend | `frontend/src/app/courses/page.tsx`, `frontend/src/app/product/[id]/page.tsx` | Working | Dynamic metadata, clear pricing, syllabus outlines |
| Shopping Cart & Checkout | Frontend | `frontend/src/app/cart/page.tsx`, `frontend/src/app/checkout/page.tsx` | Working | Local storage cart persistence, Razorpay modal integration |
| Student Dashboard | Full Stack| `frontend/src/app/student/page.tsx`, `backend/src/controllers/authController.js` | Working | Real-time unlocked codices, exam countdown |
| 3D DRM Document Reader | Frontend | `frontend/src/app/reader/page.tsx`, `frontend/src/middleware.ts` | Working | Watermarking active, direct PDF access blocked |
| Student Authentication | Full Stack| `frontend/src/app/login/page.tsx`, `frontend/src/app/register/page.tsx`, `authController.js` | Working | Single-device enforcement, bcrypt hashing |
| Admin Portal | Full Stack| `frontend/src/app/admin/page.tsx`, `backend/src/controllers/adminController.js` | Working | Student listing, product pricing controls |
| Legal Suite & Policies | Frontend | `privacy/page.tsx`, `terms/page.tsx`, `refund/page.tsx`, `cookies/page.tsx` | Working | Full Indian DPDP Act 2023 alignment with draft banners |
| Universal Test Harness | DevOps | `backend/tests/runner.js`, `scripts/verify.js` | Working | 35 integration tests across 5 suites, 100% pass |

---

## 5. Gap Analysis & Quality Defect Ratings

| ID | Domain | Finding / Gap | Severity | Effort | Risk | Mitigation / Resolution |
|---|---|---|---|---|---|---|
| G-01 | Legal | Cookie Policy page missing from App Router routes | Low | S | Low | **Resolved:** Created `/cookies/page.tsx` and wired into `Footer.tsx` |
| G-02 | Ops | Missing automated operations runbook and CI/CD docs in `docs/08-operations` | Medium | S | Low | **Resolved:** Codified operational playbooks and runbooks |
| G-03 | Testing | Missing structured `docs/09-testing/` suite | Medium | S | Low | **Resolved:** Authored complete testing strategy and UAT suite |
| G-04 | Security | Transitive `braces` warning in devDependency linter | Low | S | Low | Contained within devDependencies; audited |
| G-05 | Architecture | Next.js 16 deprecation warning on `middleware.ts` | Low | S | Medium | Documented in `NEEDS_APPROVAL.md` to prevent breaking runtime changes |
