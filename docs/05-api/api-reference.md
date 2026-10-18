# API Reference: The Law Kaksha REST API

**Purpose:** Comprehensive endpoint reference covering HTTP verbs, paths, authentication requirements, parameters, request bodies, and responses.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. System & Health Endpoints

### `GET /api/health`
- **Auth:** None (Public)
- **Description:** Basic service health status and database connectivity indicator [Verified: `backend/src/server.js:46`].
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "mode": "mongodb-atlas",
  "timestamp": "2026-10-05T05:30:00.000Z"
}
```

### `GET /healthz` & `GET /readyz`
- **Auth:** None (Public)
- **Description:** Standard container liveness and readiness probe endpoints returning 200 OK.

---

## 2. Authentication Endpoints (`/api/auth/*`)

### `POST /api/auth/register`
- **Auth:** None
- **Body:**
```json
{
  "name": "Jane Student",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "phone": "+919876543210",
  "targetExam": "CA Foundation Paper 2",
  "deviceId": "DEV-uuid-1234"
}
```
- **Responses:**
  - `201 Created`: Returns `{ success: true, token: "jwt...", user: { id, email, name, role, unlockedItemIds } }`.
  - `400 Bad Request`: Missing mandatory fields (`name`, `email`, `password`).
  - `409 Conflict`: Account with this email already exists.

### `POST /api/auth/login`
- **Auth:** None
- **Body:** `{ "email": "jane@example.com", "password": "...", "deviceId": "DEV-uuid-1234", "deviceName": "Chrome on Windows" }`
- **Responses:**
  - `200 OK`: `{ success: true, token: "...", user: { ... } }`.
  - `401 Unauthorized`: Invalid password.
  - `404 Not Found`: Account does not exist.
  - `409 Conflict`: `DEVICE_MISMATCH` — account active on another device.

### `GET /api/auth/me`
- **Auth:** Required (`Bearer <token>`)
- **Headers:** `Authorization: Bearer <token>`, `X-Device-ID: <deviceId>`
- **Response (200 OK):** Current student profile, study streak, unlocked items, and active device details.

### `POST /api/auth/device-reset`
- **Auth:** None (or authenticated)
- **Body:** `{ "email": "jane@example.com", "password": "...", "newDeviceId": "DEV-uuid-5678", "newDeviceName": "iPhone 15" }`
- **Response (200 OK):** Invalids prior device binding and binds account to `newDeviceId`.

---

## 3. Catalog & Course Endpoints (`/api/catalog/*` & `/api/public/*`)

### `GET /api/catalog`
- **Auth:** None
- **Description:** Returns list of active courses, study codices, and preview metadata [Verified: `backend/src/routes/catalogRoutes.js`].

### `GET /api/public/site-data`
- **Auth:** None
- **Description:** Consolidated frontend bootstrap data containing products, chapters, and announcement banners.

### `GET /api/public/section16-comparison`
- **Auth:** None
- **Description:** Returns Section 16 (Caveat Emptor) comparative analysis payload and model ICAI answers.

---

## 4. Orders & Payments Endpoints (`/api/payment/*` & `/api/orders/*`)

### `POST /api/payment/create-order` (and `/api/orders/create`)
- **Auth:** Required (or email-backed)
- **Body:** `{ "itemId": "course-ca-foundation-sub" }`
- **Response (200 OK):**
```json
{
  "success": true,
  "orderId": "order_Rz1234567890",
  "amount": 9900,
  "currency": "INR",
  "key": "rzp_test_..."
}
```

### `POST /api/payment/verify` (and `/api/orders/verify`)
- **Auth:** Required
- **Body:**
```json
{
  "razorpay_order_id": "order_Rz1234567890",
  "razorpay_payment_id": "pay_Rz9876543210",
  "razorpay_signature": "hmac_sha256_hex_digest..."
}
```
- **Responses:**
  - `200 OK`: `{ success: true, message: "Payment verified", unlockedItemIds: [...] }`.
  - `400 Bad Request`: Signature verification failed / payment tampered.

---

## 5. Admin & Management Endpoints (`/api/admin/*`)

### `POST /api/admin/materials`
- **Auth:** Admin Token (`user.role === 'admin'`)
- **Body:** `multipart/form-data` containing `file` (PDF), `title`, `actName`, `type`, `course`.
- **Response (201 Created):** Uploads to Cloudinary, creates `Resource` document.
