# Feature Inventory & Implementation Status

**Purpose:** Comprehensive inventory of all software features, underlying code files, and current verification status.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Feature Map & Status

| Feature ID | Feature Name | Core Code Files Involved | Implementation Status | Notes / Limitations |
|---|---|---|---|---|
| **FEAT-01** | Landing Page & Hero Desk | `frontend/src/app/page.tsx`, `HeroSection.tsx` | **Working** | Fully responsive, high-contrast typography, CTA triggers. |
| **FEAT-02** | Interactive Syllabus Explorer | `frontend/src/components/SyllabusSection.tsx` | **Working** | Accordion expansion for 6 core acts with weighting indicators. |
| **FEAT-03** | Section 16 Comparison Benchmark | `frontend/src/components/Section16ComparisonBlock.tsx` | **Working** | Compares raw textbook text vs. Law Kaksha structured answer model. |
| **FEAT-04** | User Auth (Email/Pass & JWT) | `backend/src/routes/authRoutes.js`, `authController.js` | **Working** | Bcrypt hashing, 7-day JWT generation, token verification middleware. |
| **FEAT-05** | Google OAuth 2.0 Single Sign-On | `frontend/src/components/AuthModal.tsx`, `authController.js:145` | **Working** | Google Auth Library verification on backend. |
| **FEAT-06** | Single-Device Binding (DRM) | `backend/src/middleware/authMiddleware.js`, `DeviceSessionContext.tsx` | **Working** | Binds token to `deviceId`, rejects second device with 409 Conflict. |
| **FEAT-07** | Student Device Reset Flow | `backend/src/controllers/authController.js:115`, `DeviceResetModal.tsx` | **Working** | Allows student to unbind stale device and re-bind active device. |
| **FEAT-08** | Razorpay Order Creation & Verify | `backend/src/controllers/paymentController.js`, `EnrollModal.tsx` | **Working** | Server-side pricing enforcement, HMAC SHA-256 signature verification. |
| **FEAT-09** | In-Browser 3D Codex Reader | `frontend/src/app/reader/page.tsx` | **Working** | PDF.js canvas rendering with client-side anti-piracy watermark overlay. |
| **FEAT-10** | Dual-Mode DB Persistence | `backend/src/config/db.js`, `LocalDb.js`, `lawkaksha_db.json` | **Working** | Seamless fallback to JSON store when MongoDB Atlas is unreachable. |
| **FEAT-11** | Admin Asset Upload & Catalog | `backend/src/routes/adminRoutes.js`, `adminController.js` | **Working** | Multer memory storage + Cloudinary upload pipeline. |
| **FEAT-12** | Student Test & Evaluation Desk | `frontend/src/app/tests/page.tsx`, `backend/src/routes/studentRoutes.js` | **Partial** | Test questions cataloged; evaluator scoring exists on backend but UI evaluator queue is basic. |
| **FEAT-13** | Transactional Email Delivery | `backend/src/services/emailService.js` | **Missing / Gap** | Welcome email and payment receipts currently logged to console; no SMTP/SendGrid service wired. |
