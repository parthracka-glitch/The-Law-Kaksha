# Third-Party Service Integrations

**Purpose:** Comprehensive inventory of external service integrations, authentication models, limits, and failure behaviors.  
**Status:** Verified against code & configuration files  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Razorpay Payment Gateway

- **Purpose:** Native payment processing for course enrollments, question banks, and codex access passes [Verified: `backend/src/controllers/paymentController.js:15`].
- **Authentication:** HTTP Basic Authentication using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` [Verified: `backend/src/config/db.js`, `render.yaml:22-25`].
- **Cryptographic Verification:** HMAC SHA-256 calculation over `order_id|payment_id` against `RAZORPAY_KEY_SECRET`.
- **Failure Behavior:** If signature check fails, transaction is rejected with 400 Bad Request, order remains in `FAILED` or `PENDING` status, and content remains locked.
- **Data Shared:** Order amount (in paise), order ID, student email, and mobile number.

---

## 2. MongoDB Atlas (Cloud Database)

- **Purpose:** Production cloud document store for persistent users, materials, orders, and test submissions [Verified: `backend/src/config/db.js`].
- **Authentication:** Standard MongoDB Connection String (`mongodb+srv://...`) injected via `MONGODB_URI` [Verified: `render.yaml:20`].
- **Failure Behavior:** If connection fails or times out, the backend gracefully falls back to `LocalDb` (`backend/data/lawkaksha_db.json`), logging a console warning without crashing the Express process [Verified: `backend/src/db/mongo.js:28`].

---

## 3. Cloudinary Media Storage

- **Purpose:** Secure cloud hosting of course PDF codices, chapter cover images, and model answer diagrams [Verified: `backend/src/controllers/materialController.js:20`].
- **Authentication:** API Key and Secret via `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- **Failure Behavior:** Upload errors return 500 to the admin with descriptive error messages; previous assets remain unaffected.

---

## 4. Google OAuth 2.0 (Identity Provider)

- **Purpose:** One-click student registration and login via verified Google identity [Verified: `backend/src/controllers/authController.js:145`].
- **Authentication:** Frontend obtains Google ID Token and submits it to backend; backend verifies token authenticity using `google-auth-library` (`OAuth2Client.verifyIdToken`) matching `GOOGLE_CLIENT_ID` [Verified: `backend/src/controllers/authController.js:150`].
- **Failure Behavior:** Invalid tokens return 401 Unauthorized; user is prompted to use email/password fallback.
