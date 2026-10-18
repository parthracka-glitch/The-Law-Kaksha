# Security Findings & Remediation Log

> **Purpose:** Comprehensive register of security audits, OWASP ASVS findings, exploit scenarios, fixes, and regression test proofs.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Security Specialist  

---

## 1. Summary of Findings

| ID | Category | Severity | Title | Status | Test Proof |
|---|---|:---:|---|:---:|---|
| **SEC-001** | OWASP A01: Broken Access Control | **Critical** | Backdoor Unauthenticated Purchase Sync | **Resolved** | `tests/security_hardening.test.js` (Assert 404) |
| **SEC-002** | OWASP A01: Broken Access Control | **High** | IDOR on Student Dashboard via Query Parameter | **Resolved** | `tests/security_hardening.test.js` (Assert 401 unauth) |
| **SEC-003** | OWASP A01: Broken Access Control | **High** | IDOR on Order Retrieval (`/api/orders/:id`) | **Resolved** | `tests/security_hardening.test.js` (Assert 403 non-owner) |
| **SEC-004** | OWASP A04: Insecure Design | **High** | Client-Side Price Tampering during Checkout | **Resolved** | `tests/security_hardening.test.js` (Assert canonical price) |
| **SEC-005** | OWASP A04: Unrestricted Resource Consumption | **Medium** | Missing Rate Limiting on Order Creation & Payment Verification | **Resolved** | `backend/src/server.js` (`orderRateLimiter`) |
| **SEC-006** | OWASP A05: Security Misconfiguration | **Medium** | Missing Content-Security-Policy (CSP) Header | **Resolved** | `backend/src/server.js` (CSP header emitted) |
| **SEC-007** | OWASP A03: Injection | **Medium** | NoSQL MongoDB Operator Injection | **Resolved** | `tests/admin_security.test.js` (Sanitizer active) |
| **SEC-008** | OWASP A06: Vulnerable Components | **Medium** | Transitive DevDependency Vulnerability (`braces` in `eslint-config-next`) | **Flagged** | Logged in `docs/audit/NEEDS_APPROVAL.md` |

---

## 2. Detailed Vulnerability Analyses & Fixes

### SEC-001: Backdoor Unauthenticated Purchase Sync
- **Location:** `backend/src/routes/studentRoutes.js` (`POST /api/student/sync-purchase`)
- **Severity:** Critical (P0)
- **CWE:** CWE-284: Improper Access Control
- **Exploit Scenario:** An unauthenticated user could POST an arbitrary `unlockedItemIds` array with their email to immediately unlock proprietary DRM study materials without payment.
- **Remediation:** Endpoint was completely eradicated from the router.
- **Verification:** `tests/security_hardening.test.js` verifies request returns `404 Not Found`.

### SEC-002: IDOR on Student Dashboard
- **Location:** `backend/src/routes/studentRoutes.js` (`GET /api/student/dashboard`)
- **Severity:** High (P1)
- **CWE:** CWE-639: Authorization Bypass Through User-Controlled Key
- **Exploit Scenario:** A user could pass `?email=victim@thelawkaksha.com` to view another student's enrolled courses, bookmarks, and personal profile without authentication.
- **Remediation:** Middleware `requireAuth` applied. Email and student ID are derived strictly from `req.user` verified token claims. Query parameters are only permitted if `req.user.role === "admin"`.
- **Verification:** `tests/security_hardening.test.js` proves unauthenticated requests receive `401 Unauthorized`.

### SEC-003: IDOR on Order Retrieval
- **Location:** `backend/src/routes/orderRoutes.js` (`GET /api/orders/:id`)
- **Severity:** High (P1)
- **CWE:** CWE-639: Authorization Bypass Through User-Controlled Key
- **Exploit Scenario:** Any visitor could guess order IDs (`LK-ORD-XXXXXX`) to inspect customer names, phone numbers, email addresses, and purchase history.
- **Remediation:** Added `requireAuth` middleware and strict ownership verification matching `req.user.email === order.customer_email` or `req.user.role === "admin"`.
- **Verification:** `tests/security_hardening.test.js` tests that non-owner tokens return `403 Forbidden`.

### SEC-004: Client-Side Price Tampering
- **Location:** `backend/src/routes/orderRoutes.js` (`handleCreateOrder`)
- **Severity:** High (P1)
- **CWE:** CWE-472: External Control of Assumed-Immutable Web Parameter
- **Exploit Scenario:** An attacker modified the cart payload price to `price: 1` before submitting to `/api/orders/create`, generating a Razorpay order for ₹1 instead of ₹99.
- **Remediation:** Replaced trusting client prices with server-side canonical price lookup table (`CANONICAL_CATALOG_PRICES`) based on verified item IDs.
- **Verification:** `tests/security_hardening.test.js` verifies that passing `{ price: 1 }` generates order totaling ₹99.

### SEC-005: Order & Payment Rate Limiting
- **Location:** `backend/src/server.js`
- **Severity:** Medium (P2)
- **CWE:** CWE-799: Improper Control of Interaction Frequency
- **Exploit Scenario:** Attackers could execute card testing / carding scripts against the payment gateway or flood order creation endpoints.
- **Remediation:** Implemented sliding-window in-memory rate limiter `orderRateLimiter` capping requests to 60/min per IP.
- **Verification:** Middleware integrated into Express pipeline; verified in `scripts/verify.js`.

### SEC-006: Content Security Policy & Security Headers
- **Location:** `backend/src/server.js`
- **Severity:** Medium (P2)
- **CWE:** CWE-693: Protection Mechanism Failure
- **Remediation:** Configured comprehensive CSP covering Razorpay SDK frames and fonts, along with HSTS, X-Content-Type-Options: nosniff, and disabled X-Powered-By.
- **Verification:** `tests/admin_security.test.js` verifies headers on responses.
