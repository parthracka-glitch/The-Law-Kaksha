# 08. Code Quality, Security & Performance Static Analysis

---

## 1. Static Analysis Overview & Health Scorecard

This audit evaluates the codebase across six foundational dimensions of software engineering excellence:
1. **Performance & Low-End Device Optimization**
2. **Security & OWASP Top 10 Vulnerabilities**
3. **Error Handling, Fault Tolerance & Logging**
4. **Code Structure, Modularity & Maintainability**
5. **SEO, Web Accessibility (WCAG) & Responsiveness**
6. **Testing, Deployment & Environment Configuration**

---

## 2. Performance Risks & Bottlenecks

### Issue PERF-01: Missing Database Pagination on Admin Queries
- **Severity:** **HIGH**
- **File Reference:** `backend/src/routes/adminRoutes.js` (`GET /api/admin/students`, `GET /api/admin/orders`, `GET /api/admin/resources`).
- **Technical Mechanism:** Queries execute unbounded lookups (e.g. `User.find({ role: "student" }).lean()`). When the platform scales to 5,000+ registered students and 10,000+ orders, returning massive unpaginated JSON payloads will:
  1. Trigger Out-Of-Memory (OOM) fatal crashes on Render free/starter instances (capped at 512MB RAM).
  2. Cause network timeouts and severe browser lag on student and admin devices.
- **Recommended Remediation:** Implement query pagination with `page` and `limit` query parameters (e.g., `User.find().skip((page - 1) * limit).limit(limit)`).

### Issue PERF-02: Massive Single-File Component Re-Renders
- **Severity:** **MEDIUM**
- **File Reference:** `frontend/src/app/admin/page.tsx` (4,841 lines) and `frontend/src/app/student/page.tsx` (2,881 lines).
- **Technical Mechanism:** Housing all 16 admin workspaces and modals within a single monolithic React component causes React's virtual DOM reconciliation tree to evaluate thousands of lines on minor state changes. While `useTransition` and `useCallback` mitigate tab-switching lag, true UI responsiveness requires extracting sub-tabs into standalone sub-components.
- **Recommended Remediation:** Split each admin hub into modular sub-tab components under `frontend/src/components/admin/` (similar to `AdminOrdersTab.tsx` and `AdminCarouselTab.tsx`).

### Issue PERF-03: Committed 48.2 MB Static PDF Bloat
- **Severity:** **HIGH**
- **File Reference:** `frontend/public/assets/CSEET BUSINESS MANAGEMENT FINAL PRINT COPY.pdf`.
- **Technical Mechanism:** Committing raw, full-length print-quality PDF files into the Next.js `public/` directory balloons repository download times, exhausts Vercel's 250 MB serverless deployment bundle limit, and permits unauthenticated public visitors to download full paid courseware directly via static URL without payment or DRM.
- **Recommended Remediation:** Delete the raw file from `frontend/public/assets/` and host all digital study codices exclusively on Cloudinary or private cloud storage with signed URLs.

### Issue PERF-04: Missing Compound Database Indexes
- **Severity:** **MEDIUM**
- **File Reference:** `backend/src/models/Resource.js` and `backend/src/models/Order.js`.
- **Technical Mechanism:** Chapter note queries frequently execute filtering on `{ course: 1, chapterNumber: 1, status: 1 }`, yet `Resource.js` only indexes `id`, `course_id`, and `is_active`. Without compound indexes, MongoDB performs full document collection scans (`COLLSCAN`).
- **Recommended Remediation:** Add compound schema index: `ResourceSchema.index({ course: 1, chapterNumber: 1, status: 1 });`.

---

## 3. Security & OWASP Top 10 (2025 Standard) Evaluation

### Issue SEC-01: Strict Production JWT_SECRET Enforcement
- **Severity:** **LOW (WELL PROTECTED)**
- **File Reference:** `backend/src/middleware/authMiddleware.js:17–19`.
- **Technical Finding:** The backend implements a fatal safeguard:
  ```javascript
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("[FATAL SECURITY CONFIGURATION] JWT_SECRET environment variable is mandatory in production.");
  }
  ```
  This completely prevents accidental deployment with default development cryptographic secrets.

### Issue SEC-02: Recursive NoSQL Injection & Prototype Pollution Sanitizer
- **Severity:** **LOW (WELL PROTECTED)**
- **File Reference:** `backend/src/server.js:96–118` (`sanitizePayload`).
- **Technical Finding:** The server recursively scans all incoming `req.body`, `req.query`, and `req.params`, stripping dangerous MongoDB query operator keys starting with `$` (such as `{"$gt": ""}`) and JavaScript object prototype keys (`__proto__`, `constructor`, `prototype`). This provides robust defense against OWASP A03 / A05 injection attacks.

### Issue SEC-03: In-Memory Sliding-Window Rate Limiters
- **Severity:** **LOW / MEDIUM**
- **File Reference:** `backend/src/server.js:120–175`.
- **Technical Finding:**
  - `/api/auth` is restricted to 60 requests/minute per IP (prevents password brute-forcing).
  - `/api/orders` and `/api/verify-payment` are restricted to 60 requests/minute per IP (prevents credit card testing).
- **Limitation:** The rate limiter uses an in-memory `Map()`. If the server restarts or runs across multiple cluster worker processes on Render, counters reset.
- **Recommended Remediation:** For multi-instance horizontal scaling, back rate limiters with Redis (Upstash Redis).

### Issue SEC-04: Single-Device Session Lock & Instant Token Revocation
- **Severity:** **LOW (WELL ARCHITECTED)**
- **File Reference:** `backend/src/routes/authRoutes.js` and `backend/src/models/User.js`.
- **Technical Finding:** Students cannot share accounts with friends. The server compares the browser hardware fingerprint `deviceId`. Attempting concurrent logins triggers a `409 DEVICE_CONFLICT` challenge. Password resets increment `User.tokenVersion`, instantly invalidating active JWT sessions across all hardware without waiting for token expiration.

### Issue SEC-05: Missing Strict File MIME Type Verification on Admin Upload
- **Severity:** **MEDIUM**
- **File Reference:** `backend/src/routes/adminRoutes.js:960–990` (`POST /api/admin/upload`).
- **Technical Mechanism:** The route uses `multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })`, but lacks a `fileFilter` validating MIME magic bytes. An attacker with compromised admin credentials could potentially upload executable HTML/SVG files with malicious JavaScript.
- **Recommended Remediation:** Add strict MIME whitelist:
  ```javascript
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only PDF and image files are allowed."));
  }
  ```

---

## 4. Error Handling, Logging & Fault Tolerance

### Architecture Assessment:
- **Centralized Error Handler (`backend/src/server.js:239–248`):** All uncaught exceptions route through a single middleware. In production, stack traces are withheld from clients; instead, clients receive a generic message and a unique tracking reference code (`Date.now().toString(36).toUpperCase()`).
- **Dual-Database Fault Tolerance:** If MongoDB Atlas experiences a network outage, `backend/src/db/database.js` transparently executes queries against `lawkaksha_db.json`. The user experiences zero downtime.
- **Client-Side Graceful Degradation:** Public pages (`/courses`, `/subscriptions`) contain bundled offline fallback arrays (`FALLBACK_PRODUCTS`). If the backend API is unreachable, the website still displays study outlines and sample notes.

---

## 5. SEO, Accessibility (a11y) & Mobile Responsiveness

| Audit Category | Current Implementation Status | Assessment |
| :--- | :--- | :---: |
| **Meta Title & Descriptions** | Declared in `frontend/src/app/layout.tsx` with dynamic OpenGraph and Twitter card tags. | **PASS** |
| **Structured Data (Schema.org)** | Includes `EducationalOrganization` and `Course` JSON-LD schemas. | **PASS** |
| **Mobile Tap Targets** | All major navigation buttons adhere to WCAG 44x44px touch targets. | **PASS** |
| **Color Contrast Ratios** | Dark Charcoal (`#221D1D`) on Off-White Paper (`#F7F7F5`) yields > 12:1 contrast ratio (exceeds WCAG AAA). | **PASS** |
| **Canvas Screen Reader Access**| Canvas-rendered PDF reader provides visually crisp output, but screen readers cannot read text inside canvas. | **NEEDS FIX** |

---

## 6. Testing, Deployment & Environment Configuration

### Testing Suite Status:
- **Absence of End-to-End Tests:** No Cypress, Playwright, or automated integration test suite currently exists in `frontend/`.
- **Backend API Tests:** Basic route assertions exist under `backend/src/` but lack continuous testing coverage.
- **Recommendation:** Add Playwright end-to-end tests for the critical checkout and login flows to prevent regression bugs during feature updates.

### Mandatory Production Environment Variables:

#### Backend (`backend/.env`):
- `PORT`: Server port (default: 5000).
- `MONGODB_URI`: MongoDB Atlas connection string (`mongodb+srv://...`).
- `JWT_SECRET`: Minimum 32-character high-entropy secret string.
- `RAZORPAY_KEY_ID`: Razorpay public merchant key (`rzp_live_...`).
- `RAZORPAY_KEY_SECRET`: Razorpay secret cryptographic key.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account cloud identifier.
- `CLOUDINARY_API_KEY`: Cloudinary API credential.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.
- `FRONTEND_URL`: Allowed CORS origin (e.g. `https://thelawkaksha.com`).

#### Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL`: Backend API base URL (`https://the-law-kaksha.onrender.com`).
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Client-side Razorpay key.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Web Client ID.
