# Business Rules & Operational Policies

**Purpose:** Comprehensive inventory of commercial pricing rules, access control policies, DRM boundaries, and fulfillment logic.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Commercial Pricing & Access Passes

- **BR-01 (Server-Authoritative Pricing):** The price of every product or course pass is determined exclusively by the server database. Any price sent by client payloads during order creation is ignored or overridden [Verified: `backend/tests/security_hardening.test.js:60`, `backend/src/controllers/paymentController.js:35`].
- **BR-02 (Launch Promotional Pass):** The Smart Revision Question Bank is currently priced at a promotional tier of **₹199** (inclusive of applicable taxes; represented as `19900` paise in transaction requests) [Verified: `frontend/src/components/EnrollModal.tsx:45`].
- **BR-03 (Transaction Minimum):** Razorpay transactions must have a minimum charge of 100 paise (₹1.00); zero or negative transaction requests are rejected with 400 Bad Request [Verified: `backend/src/controllers/paymentController.js:28`].

---

## 2. Digital Rights & Device Binding Rules

- **BR-04 (Single Active Device Bound):** Each student account may maintain exactly one active hardware device binding (`activeDeviceId`). Simultaneous access across multiple browsers or devices with the same account credentials is prohibited [Verified: `backend/src/middleware/authMiddleware.js:35`].
- **BR-05 (Device Reset Quota):** A student encountering a legitimate device change (e.g. new phone or computer) may invoke the device reset action (`/api/auth/device-reset`). The reset unbinds the previous hardware identifier and binds the new device on subsequent login [Verified: `backend/src/controllers/authController.js:115`].
- **BR-06 (Watermark Non-Repudiation):** All paid digital codices rendered inside the reader must dynamically present the student's legal name, registered email address, and unique session hash. No un-watermarked high-resolution PDF download links may be exposed to the browser [Verified: `frontend/src/app/privacy/page.tsx:71`].

---

## 3. Fulfillment & Refund Policies

- **BR-07 (Instant Digital Fulfillment):** Course materials, codices, and question banks unlock immediately upon successful cryptographic verification of the Razorpay transaction payload [Verified: `frontend/src/app/refund/page.tsx:40`].
- **BR-08 (Non-Refundable Standard):** Because digital materials and question banks are made unencrypted and fully accessible immediately upon payment confirmation, purchases are non-refundable and non-transferable [Verified: `frontend/src/app/refund/page.tsx:47`].
- **BR-09 (Technical Outage Exception):** If an unresolvable server failure prevents an enrolled student from accessing paid materials for more than **48 consecutive hours** from purchase, and technical support cannot resolve it, a 100% full refund is issued within 5–7 business days [Verified: `frontend/src/app/refund/page.tsx:52`].
