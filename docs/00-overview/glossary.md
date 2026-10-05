# Domain & Technical Glossary

**Purpose:** Comprehensive index of business, pedagogical, legal, and engineering terminology used across the system.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Academic & Legal Domain Terminology

- **ICAI:** The Institute of Chartered Accountants of India — the statutory professional accountancy body regulating the CA profession in India [Verified: `frontend/src/components/SyllabusSection.tsx:18`].
- **CA Foundation (Paper 2):** Entry-level nationwide examination paper covering Indian Business Laws [Verified: `frontend/src/app/page.tsx:20`].
- **ICSI / CSEET:** The Institute of Company Secretaries of India / CS Executive Entrance Test — competitive entrance test covering Legal Aptitude and Company Law fundamentals [Verified: `frontend/src/components/CurriculumSection.tsx:22`].
- **Statutory Provisions:** Indian commercial law statutes forming the core curriculum:
  - *The Indian Regulatory Framework* (Constitutional and statutory governance).
  - *The Indian Contract Act, 1872* (Offer, acceptance, consideration, breach).
  - *The Sale of Goods Act, 1930 (SOGA)* (Conditions, warranties, transfer of ownership).
  - *The Indian Partnership Act, 1932* (Mutual agency, dissolution, registration).
  - *The Limited Liability Partnership Act, 2008 (LLP)* (Hybrid corporate partnership structure).
  - *The Companies Act, 2013* (Incorporation, corporate veil, share capital) [Verified: `frontend/src/components/SyllabusSection.tsx:50-80`].
- **Section 16 (SOGA) - Caveat Emptor:** "Let the buyer beware" statutory rule and its exceptions (fitness for purpose, merchantable quality, trade usage, fraud) highlighted as the benchmark legal comparison component [Verified: `frontend/src/components/Section16ComparisonBlock.tsx:20`].

---

## 2. Technical & Architecture Terminology

- **Codex / Codices:** High-resolution digital study notes, revision question banks, and infographics presented in the in-browser 3D reader [Verified: `frontend/src/app/reader/page.tsx:14`].
- **Device Binding (DRM):** Anti-piracy security protocol that ties each student account to a single device ID (`activeDeviceId`). Logging into a new device requires explicit device reset or invalidates prior tokens [Verified: `backend/src/middleware/authMiddleware.js:35`, `backend/src/controllers/authController.js:120`].
- **LocalDb:** Dual-mode persistence engine (`backend/src/models/LocalDb.js`). Functions as a resilient file-backed JSON database fallback whenever MongoDB Atlas connection is unreachable or unconfigured.
- **Razorpay Orders & Verification:** Secure 2-step payment transaction pattern involving server-side order generation (`razorpay_order_id`) and HMAC SHA-256 signature verification (`razorpay_signature`) [Verified: `backend/src/controllers/paymentController.js:30-80`].
- **Watermarking:** Real-time client-rendered dynamic overlay in the 3D document viewer displaying the student's authenticated email and ID to prevent unauthorized screenshot sharing [Verified: `frontend/src/app/privacy/page.tsx:71`].
