# Authentication & Authorization Architecture

**Purpose:** Comprehensive documentation of token lifecycle, session security, single-device DRM binding, and role-based access control.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Token Lifecycle & JWT Specification

- **Algorithm:** HMAC-SHA256 (`HS256`) via `jsonwebtoken` [Verified: `backend/src/routes/authRoutes.js:9`].
- **Secret Key:** `JWT_SECRET` (configured via environment variable).
- **Token Expiry:** 7 days (`expiresIn: "7d"`).
- **Payload Structure:**
```json
{
  "userId": "usr-1791112785039-663",
  "email": "student@example.com",
  "role": "student",
  "deviceId": "DEV-ef9d9dec-cd77-42ba-bb1b-c1f6520cd572-muqmi7h3",
  "iat": 1759615000,
  "exp": 1760219800
}
```

---

## 2. Single-Device DRM Session Enforcement

To prevent credential sharing and unauthorized distribution of copyrighted study codices, the system enforces a strict single-device policy [Verified: `backend/src/middleware/authMiddleware.js:35`]:

1. **Hardware Identification:** The client generates a pseudo-random persistent UUID stored in `localStorage` under `lawkaksha_device_id`.
2. **Device State Recording:** On successful login or registration, the backend updates `user.activeDeviceId` to match the incoming device ID.
3. **Session Verification:**
   - Every protected API request includes the JWT in the `Authorization: Bearer <token>` header and optionally `X-Device-ID`.
   - `authMiddleware` validates that the token is cryptographically sound, and checks that `token.deviceId === user.activeDeviceId`.
   - If a student signs in from a second browser/device, the database record updates to the new device ID, causing subsequent requests from the original device to fail with `409 Conflict (DEVICE_MISMATCH)`.

---

## 3. Role-Based Access Control (RBAC)

- **`student` Role:** Default role assigned upon registration. Can access public endpoints, view purchased materials in `unlockedItemIds`, reset own device binding, and submit tests.
- **`admin` Role:** Granted manually or via `create_admin.js` script. Required for all `/api/admin/*` mutations (file uploads, user permission updates, evaluative scoring). Guarded by `adminMiddleware.js`.
