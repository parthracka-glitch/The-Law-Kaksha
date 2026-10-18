# System Use Cases

**Purpose:** Detailed behavioral specifications of core user journeys, preconditions, alternatives, and error scenarios.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## UC-01: Student Registration & Single-Device Login
- **Actor:** Student (Aspirant)
- **Preconditions:** Student possesses a valid email address and internet access.
- **Trigger:** Student clicks "Login / Register" or "Enroll Now" on the landing page [Verified: `frontend/src/components/Navbar.tsx:40`].
- **Main Flow:**
  1. Student enters name, email, password, and submits the form (or chooses Google Sign-In).
  2. Frontend generates or retrieves `deviceId` from `localStorage` [Verified: `frontend/src/context/DeviceSessionContext.tsx:63`].
  3. Frontend sends `POST /api/auth/register` or `/login` with credentials and `deviceId`.
  4. Backend validates credentials, checks for existing active device binding, and assigns device ID to `user.activeDeviceId`.
  5. Backend generates signed JWT and returns user object with unlocked items.
  6. Frontend stores JWT in localStorage/cookies and redirects to study desk.
- **Alternative Flow (Device Mismatch):**
  - If `user.activeDeviceId` is set and does not match incoming `deviceId`, backend returns 409 Conflict with `DEVICE_MISMATCH` [Verified: `backend/src/controllers/authController.js:95`].
  - Student is presented with a device reset prompt (`POST /api/auth/device-reset`).
- **Postconditions:** Student is logged in; session is bound to the current hardware client.

---

## UC-02: Course Access Pass Purchase (Razorpay)
- **Actor:** Authenticated Student
- **Preconditions:** Student is logged in; selected material/pass is not yet in `unlockedItemIds`.
- **Trigger:** Student clicks "Unlock Pass (₹199)" inside Enroll Modal [Verified: `frontend/src/components/EnrollModal.tsx:85`].
- **Main Flow:**
  1. Frontend calls `POST /api/payment/create-order` passing `materialId` or `bundleId`.
  2. Backend looks up authoritative server-side price, creates a Razorpay order via Razorpay SDK, and returns `orderId`, `amount`, and `currency` [Verified: `backend/src/controllers/paymentController.js:35`].
  3. Frontend initializes Razorpay modal with `order_id` and student contact details.
  4. Student completes payment via UPI / NetBanking / Card.
  5. Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
  6. Frontend submits payment payload to `POST /api/payment/verify`.
  7. Backend verifies HMAC SHA-256 signature against `RAZORPAY_KEY_SECRET`.
  8. Upon valid signature, backend updates `order.status = 'PAID'` and appends purchased item IDs into `user.unlockedItemIds`.
  9. Frontend displays success confirmation and immediately unlocks study materials.
- **Error Scenarios:**
  - Signature verification failure: Returns 400 Bad Request, logs security alert, does not unlock content [Verified: `backend/src/controllers/paymentController.js:68`].

---

## UC-03: Reading Protected Study Codices in 3D Reader
- **Actor:** Authenticated Student
- **Preconditions:** Material is marked `isFree: true` or exists in `user.unlockedItemIds`.
- **Trigger:** Student clicks "Open Codex" on notes library page [Verified: `frontend/src/app/notes/page.tsx:65`].
- **Main Flow:**
  1. Student navigates to `/reader?id={materialId}`.
  2. Reader queries backend `GET /api/materials/{id}` sending authenticated JWT and `deviceId`.
  3. Auth middleware validates JWT and confirms `deviceId === user.activeDeviceId`.
  4. Controller confirms item ID is in `user.unlockedItemIds`.
  5. Client streams document stream via PDF.js and renders pages onto HTML5 canvas elements.
  6. An un-selectable overlay projects dynamic watermarks: `Authenticated to {user.name} ({user.email}) - Session {sessionHash}` across every page.
- **Alternative Flow (Unauthorized / Unpaid):**
  - If item is locked, backend responds with 403 Forbidden; frontend displays enrollment modal.
