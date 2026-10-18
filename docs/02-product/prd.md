# Product Requirements Document (PRD): The Law Kaksha

**Purpose:** Reconstructed functional and non-functional specifications based on codebase implementation.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Product Vision & Goals
The Law Kaksha provides an all-in-one digital academic experience for students preparing for the CA Foundation and CSEET examinations. The platform delivers structured syllabus modules, visual case study comparisons, high-security 3D digital codices, question banks, and simulated tests with evaluator feedback [Verified: `frontend/src/app/page.tsx`, `backend/src/server.js`].

---

## 2. Functional Requirements

### FR-01: User Authentication & Profile Management
- Students must be able to register with name, email, password, and optional phone number [Verified: `backend/src/controllers/authController.js:25`].
- Passwords must be hashed using `bcryptjs` with minimum salt rounds of 10 [Verified: `backend/src/controllers/authController.js:32`].
- Support for Google OAuth 2.0 Single Sign-On via Google Client ID verification [Verified: `backend/src/controllers/authController.js:145`].
- Issue signed JSON Web Tokens (JWT) containing `userId`, `role`, and `deviceId` with 7-day expiration [Verified: `backend/src/controllers/authController.js:80`].

### FR-02: Device Binding & Digital Rights Management (DRM)
- Every authenticated student account is bound to a single active device ID (`activeDeviceId`) [Verified: `backend/src/middleware/authMiddleware.js:35`].
- If a student logs in from a second device, the previous session is invalidated or blocked until an explicit device reset is performed [Verified: `backend/src/controllers/authController.js:115`].
- The digital reader must project a visible, semi-transparent watermark containing the authenticated student's name, email, and session ID across all rendered pages [Verified: `frontend/src/app/privacy/page.tsx:71`].

### FR-03: Catalog & Content Delivery
- Public visitors can browse syllabus modules and sample preview cards [Verified: `frontend/src/components/SyllabusSection.tsx`].
- Course passes, question banks, and individual act modules are cataloged with price (INR), thumbnail, description, and list of included items [Verified: `backend/src/models/Material.js`].
- Paid materials remain locked until payment confirmation or admin grant adds the material ID to `user.unlockedItemIds` [Verified: `backend/src/controllers/materialController.js:42`].

### FR-04: Checkout & Payment Processing
- Integration with Razorpay API to generate transaction orders [Verified: `backend/src/controllers/paymentController.js:25`].
- Client handles payment completion through Razorpay Checkout script [Verified: `frontend/src/components/EnrollModal.tsx:90`].
- Backend cryptographically validates HMAC SHA-256 signature (`razorpay_order_id|razorpay_payment_id` against `RAZORPAY_KEY_SECRET`) before granting access [Verified: `backend/src/controllers/paymentController.js:65`].
- On success, the purchased item IDs are appended to the student's `unlockedItemIds` and an Order record is created [Verified: `backend/src/controllers/paymentController.js:85`].

### FR-05: Administrative Controls
- Admins can upload PDFs and image assets via Multer with storage in Cloudinary [Verified: `backend/src/controllers/adminController.js:25`].
- Admins can review student test submissions, assign numerical marks, and enter evaluative feedback [Verified: `backend/src/controllers/adminController.js:80`].
- Admins can query transaction orders, device resets, and trigger database backups [Verified: `backend/src/scripts/backup_restore.js`].

---

## 3. Non-Functional Requirements (NFR)

- **Security:** Strict CORS origin enforcement (`FRONTEND_URL`), OWASP security headers (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`), parameter validation on all mutation endpoints [Verified: `backend/src/server.js:47-65`].
- **Reliability:** Dual-mode database fallback ensures continuous uptime even when external database cluster is unreachable [Verified: `backend/src/config/db.js`].
- **Performance:** Frontend SSG pages render in under 500ms; Core Web Vitals optimized with next/image and deferred scripts [Verified: `frontend/src/app/layout.tsx`].
- **Accessibility:** Semantic HTML elements, ARIA labeling on modal dialogs and syllabus accordions, high-contrast text color palettes [Verified: `frontend/src/components/Navbar.tsx`].
