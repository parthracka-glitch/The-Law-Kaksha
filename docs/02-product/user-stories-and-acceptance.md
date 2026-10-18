# User Stories & Acceptance Criteria

**Purpose:** User stories structured with Gherkin-style acceptance criteria defining expected system behavior.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## Story US-01: Interactive Syllabus Exploration
**As a** prospective CA Foundation student  
**I want to** review the complete Business Laws curriculum modules with sub-topic breakdowns and sample case questions  
**So that** I understand the syllabus coverage before committing to enrollment.

### Acceptance Criteria
- **Given** an unauthenticated visitor on the homepage (`/`)
- **When** the visitor views the Syllabus Section
- **Then** the six core statutory acts must be displayed with accurate chapter titles [Verified: `frontend/src/components/SyllabusSection.tsx:50`].
- **When** the visitor toggles an act accordion
- **Then** the sub-topics, estimated marks weighting, and sample question triggers must expand smoothly without layout shifts.

---

## Story US-02: Low-Friction Razorpay Payment & Digital Fulfillment
**As an** enrolled student  
**I want to** purchase the Smart Revision Question Bank for ₹199 via UPI  
**So that** my paid codices unlock immediately without waiting for manual admin approval.

### Acceptance Criteria
- **Given** an authenticated student on the checkout modal
- **When** the student selects Razorpay and confirms payment
- **Then** the backend must create a Razorpay order with server-verified amount (19900 paise) [Verified: `backend/src/controllers/paymentController.js:40`].
- **When** Razorpay returns the signature and the frontend submits it to `/api/payment/verify`
- **Then** the backend must verify the signature with HMAC SHA-256 and append the purchased item ID to `user.unlockedItemIds`.
- **And** the student's status must update to `PAID` without requiring page reload.

---

## Story US-03: Single-Device DRM Session Protection
**As the** academy platform owner  
**I want** student accounts strictly limited to a single active device ID  
**So that** students cannot share their account login credentials with peers.

### Acceptance Criteria
- **Given** Student A is logged in on Device 1 with `activeDeviceId: "DEV-1"`
- **When** Student A attempts to log in from Device 2 with `activeDeviceId: "DEV-2"`
- **Then** the backend must reject the login with `409 Conflict` and `DEVICE_MISMATCH` [Verified: `backend/src/controllers/authController.js:95`].
- **When** Student A explicitly requests a device reset via `/api/auth/device-reset`
- **Then** Device 1 must be invalidated, and Device 2 becomes the new active device binding.

---

## Story US-04: In-Browser 3D Document Reader with Watermarking
**As a** student with unlocked study materials  
**I want to** read the materials in a fast 3D flipbook interface directly in my browser  
**So that** I can study seamlessly on mobile and desktop while respecting document copyright.

### Acceptance Criteria
- **Given** a student with permission to view Material M
- **When** the student navigates to `/reader?id=M`
- **Then** the document pages must render via HTML5 canvas using PDF.js [Verified: `frontend/src/app/reader/page.tsx:40`].
- **And** every canvas must overlay a dynamic watermark showing the student's registered name, email, and session ID [Verified: `frontend/src/app/privacy/page.tsx:71`].
- **And** standard browser right-click context menus and direct download actions must be suppressed on the reader viewport.
