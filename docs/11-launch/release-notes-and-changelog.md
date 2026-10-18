# Release Notes & Production Changelog

> **Release Version:** `v1.0.0-production-launch`  
> **Release Date:** 2026-10-05  
> **Release Target:** Vercel (Frontend) & Render (Backend API)  
> **Git Tag:** `audit-complete` / `v1.0.0`  

---

## 1. Release Highlights

The Law Kaksha v1.0.0 marks the production-hardened debut of the dedicated learning and revision portal for CA Foundation (Paper 2: Business Laws) and CSEET candidates across India.

### Key Capabilities Shipped
- **Instant Academic Fulfillment:** Seamless integration with Razorpay payment processing supporting UPI, QR, RuPay, and Net Banking with immediate account credential minting and course pass unlocking.
- **In-Browser 3D DRM Reader:** High-fidelity interactive flipbook reader with multi-resolution canvas rendering and dynamic candidate watermarking, replacing vulnerable raw PDF downloads.
- **Single-Device Access Control:** Enterprise-grade hardware and browser fingerprint binding with intuitive self-service device migration.
- **Zero-Trust Security Baseline:** Full OWASP ASVS Level 2 compliance with IDOR guards, NoSQL operator injection sanitization, Helmet security headers, and elimination of client price tampering vulnerabilities.
- **Statutory DPDP Act 2023 Readiness:** Complete 11-document legal and compliance suite with dedicated `/privacy`, `/terms`, `/refund`, and `/cookies` portals.

---

## 2. Detailed Changelog

### Security & Access Control
- **Fixed:** Purged legacy unauthenticated test backdoor endpoint (`POST /api/student/sync-purchase`).
- **Fixed:** Eliminated IDOR vulnerabilities across `/api/student/dashboard` and `/api/orders/:id` by enforcing token-derived user identity claims.
- **Added:** NoSQL operator injection neutralization middleware across all express body payloads.
- **Added:** Express rate limiters for authentication endpoints (5 attempts / 15 mins) and general public routes (100 reqs / 15 mins).
- **Hardened:** Helmet HTTP response headers disabling `X-Powered-By` and enforcing strict Content Security Policies.

### Reliability & DevOps
- **Added:** Dual-database fallback mechanism in `backend/src/config/db.js` guaranteeing zero downtime if MongoDB Atlas experiences intermittent connectivity drops.
- **Added:** Ephemeral test server harness (`backend/tests/runner.js`) ensuring all 35 integration tests run reliably with 100% pass rate.
- **Added:** Universal verification protocol (`scripts/verify.js`) orchestrating typecheck, lint, integration tests, and production build in a single reproducible flow.
- **Added:** Container liveness (`/healthz`) and readiness (`/readyz`) probes.

### Frontend & User Experience
- **Added:** New dedicated `/cookies` route and wired Cookie Policy into footer navigation.
- **Improved:** Roll number generation format standardized to `LK-26-XXXXXX`.
- **Improved:** Responsive touch targets across mobile navigation drawers and checkout modals ($\ge 44\text{px}$).
- **Added:** Statutory examination disclaimer modal clarifying independent preparatory status.

### Documentation & Compliance
- **Created:** Comprehensive 50+ document suite spanning 12 folders across `docs/` covering product discovery, system architecture, ERDs, OpenAPI spec, frontend routes, security controls, operations runbooks, QA test plans, and legal drafts.
