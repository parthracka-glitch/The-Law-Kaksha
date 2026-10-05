# API Errors & Rate Limiting Strategy

**Purpose:** Defines standard error envelopes, HTTP status codes, security error handlers, and rate limit policies.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Standard JSON Error Envelope

All error responses from the backend adhere to a predictable JSON payload envelope:

```json
{
  "success": false,
  "message": "Human-readable explanation of error.",
  "error": "OPTIONAL_ERROR_CODE",
  "details": {}
}
```

---

## 2. HTTP Status Code Usage

| Code | Meaning | Typical Usage Scenario |
|---|---|---|
| `200 OK` | Success | Successful resource retrieval or mutation. |
| `201 Created` | Resource Created | User registered, material uploaded, order created. |
| `400 Bad Request` | Validation Error | Missing required body fields or tampered payment signature. |
| `401 Unauthorized` | Authentication Failure | Missing, expired, or invalid JWT bearer token. |
| `403 Forbidden` | Access Denied | Authenticated user lacks permission (e.g. non-admin accessing `/api/admin/*`, or locked codex). |
| `404 Not Found` | Resource Absent | Material ID, order ID, or user account not found. |
| `409 Conflict` | State Conflict | User email already registered, or `DEVICE_MISMATCH` detected. |
| `500 Internal Server Error` | Server Exception | Uncaught runtime error; sanitized message returned to prevent stack trace leakage. |

---

## 3. Rate Limiting Strategy

- **Current Implementation:** Reverse-proxy limits configured at Render / Cloudflare boundary.
- **Recommended Hardening (Roadmap):** In-process rate limiting via `express-rate-limit` on sensitive authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`) to restrict brute-force attempts to 5 requests per minute per IP address.
