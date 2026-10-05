# Test Plan & Critical Test Cases

> **Document Status:** Verified against automated test assertions  
> **Last Verified Date:** 2026-10-05  
> **Commit Hash:** `audit-complete` / `audit/2026-10-05`  
> **Author:** Principal QA & Test Engineering Lead  

---

## 1. Test Matrix Overview

| Area | ID | Test Scenario | Preconditions | Input / Action | Expected Result | Automated Test Suite |
|---|---|---|---|---|---|---|
| **Auth** | TC-AUTH-01 | Candidate Registration | Unique email | Valid name, email, phone, password | 201 Created with student payload | `auth_device.test.js` |
| **Auth** | TC-AUTH-02 | Duplicate Email Prevention | Email exists | Submit registration with duplicate email | 409 Conflict with clear error | `auth_device.test.js` |
| **Auth** | TC-AUTH-03 | Single-Device Login (Primary) | Registered student | Valid credentials, device fingerprint A | 200 OK + JWT; binds device A | `auth_device.test.js` |
| **Auth** | TC-AUTH-04 | Concurrent Device Block | Active on device A | Login from device B | 409 DEVICE_CONFLICT | `auth_device.test.js` |
| **Auth** | TC-AUTH-05 | Forced Device Migration | Active on device A | Login from device B + `forceSwitchDevice: true` | 200 OK; binds device B; revokes device A | `auth_device.test.js` |
| **Auth** | TC-AUTH-06 | Device Heartbeat Revocation | Migrated to device B | Heartbeat sent from device A | 401 Unauthorized (DEVICE_REVOKED) | `auth_device.test.js` |
| **Auth** | TC-AUTH-07 | Safe Session Logout | Logged in on device A | `POST /api/auth/logout` | 200 OK; releases active device lock | `auth_device.test.js` |
| **Auth** | TC-AUTH-08 | Password Reset Enumeration Guard | Database populated | Request reset for unregistered email | 200 OK (Generic success message) | `auth_device.test.js` |
| **Catalog**| TC-CAT-01 | Public Site Metadata | Server running | `GET /api/public/site-data` | 200 OK with syllabus titles and metadata | `catalog.test.js` |
| **Catalog**| TC-CAT-02 | Section 16(1) Data | Server running | `GET /api/public/section16-comparison` | 200 OK with statutory comparative analysis | `catalog.test.js` |
| **Orders** | TC-ORD-01 | Server-Side Pricing Integrity | Product ₹199 in DB | Request order with manipulated `amount: 100` | 200 OK with server-calculated ₹19900 paise | `orders_drm.test.js` |
| **Orders** | TC-ORD-02 | Payment Signature Verification | Order created | Valid Razorpay signature | 200 OK; provisions student; binds DRM pass | `orders_drm.test.js` |
| **Orders** | TC-ORD-03 | Tampered Signature Rejection | Order created | Signature tampered with dummy chars | 400 Bad Request; zero access granted | `orders_drm.test.js` |
| **Orders** | TC-ORD-04 | Minimum Amount Enforcement | Order initialization | `amount: 50` (< 100 paise) | 400 Bad Request (Minimum threshold error) | `orders_drm.test.js` |
| **Security**| TC-SEC-01 | Admin Route Unauthenticated | Protected `/api/admin/*`| Request without Bearer token | 401 Unauthorized | `admin_security.test.js` |
| **Security**| TC-SEC-02 | Privilege Escalation Block | Protected `/api/admin/*`| Request with authentic student token | 403 Forbidden | `admin_security.test.js` |
| **Security**| TC-SEC-03 | Security Headers Emission | Express server | Inspect HTTP response headers | Helmet CSP, HSTS, no `x-powered-by` | `security_hardening.test.js` |
| **Security**| TC-SEC-04 | NoSQL Injection Neutralization | Login route | Submit `{"$gt": ""}` in email/password | Neutralized by sanitize middleware; rejected | `security_hardening.test.js` |
| **Security**| TC-SEC-05 | Dashboard IDOR Guard | Student dashboard | Request with query param of another student | Query param ignored; identity drawn from JWT | `security_hardening.test.js` |
| **Security**| TC-SEC-06 | Order IDOR Guard | Order LK-ORD-12345 | Authenticated student B requests student A order | 403 Forbidden | `security_hardening.test.js` |
| **Security**| TC-SEC-07 | Purge of Legacy Backdoor | Route table | `POST /api/student/sync-purchase` | 404 Not Found (Endpoint permanently purged) | `security_hardening.test.js` |

---

## 2. Edge Case Testing Scenarios

1. **Unstable Network / High Packet Drop:**
   - Client-side retry logic handles transient 5xx responses.
   - Idempotency keys prevent duplicate order generation.
2. **Expired JWT Token:**
   - Request returns `401 Unauthorized`.
   - Client redirects smoothly to `/login?redirect=...` preserving intention.
3. **Double Click on Checkout Button:**
   - Button disables on submit, showing spinning state.
   - Prevents double invocation of Razorpay SDK modal.
4. **Mobile Device Rotation / Responsive Viewport:**
   - Reader canvas dynamically recalculates aspect ratios.
   - Navigation collapses into accessible hamburger drawer.
