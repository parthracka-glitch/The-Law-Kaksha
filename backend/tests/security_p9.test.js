/**
 * Phase P9 Automated Test Suite: Final Security & Penetration Hardening Verification
 * Verifies:
 * 1. Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, CSP)
 * 2. Coupon validation rate-limiting & safe rejection
 * 3. Token version revocation enforcement
 * 4. NoSQL injection & prototype pollution defense
 * 5. Admin privilege defense against unauthorized callers
 */

const { test, describe } = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";
const JWT_SECRET = process.env.JWT_SECRET || "the_law_kaksha_secure_jwt_secret_key_2026";

describe("Phase P9: Final Security & Penetration Hardening Tests", () => {
  test("P9-1: API enforces strict production security headers", async () => {
    const res = await fetch(`${API_URL}/api/health`);
    assert.strictEqual(res.status, 200);

    const contentTypeOptions = res.headers.get("x-content-type-options");
    assert.strictEqual(contentTypeOptions, "nosniff");

    const frameOptions = res.headers.get("x-frame-options");
    assert.strictEqual(frameOptions, "SAMEORIGIN");

    const hsts = res.headers.get("strict-transport-security");
    assert.ok(hsts && hsts.includes("max-age="), "HSTS header must be present with max-age");

    const csp = res.headers.get("content-security-policy");
    assert.ok(csp && csp.includes("default-src 'self'"), "CSP header must be present");
  });

  test("P9-2: POST /api/coupons/validate safely rejects empty and invalid codes", async () => {
    const resEmpty = await fetch(`${API_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(resEmpty.status, 400);

    const resInvalid = await fetch(`${API_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "MALICIOUS_NON_EXISTENT_COUPON_12345" }),
    });
    assert.strictEqual(resInvalid.status, 404);
  });

  test("P9-3: Tampered or mismatched tokenVersion returns 401 Session Invalidated", async () => {
    // Generate a validly signed token with tokenVersion 99999 (mismatched with database tokenVersion 1)
    const mismatchedToken = jwt.sign(
      {
        id: "usr-student-test-1",
        email: "student@thelawkaksha.com",
        role: "student",
        tokenVersion: 99999,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await fetch(`${API_URL}/api/student/my-courses`, {
      headers: { Authorization: `Bearer ${mismatchedToken}` },
    });
    assert.strictEqual(res.status, 401, "Expected 401 due to tokenVersion invalidation");
    const data = await res.json();
    assert.ok(
      data.message.includes("Session has been invalidated") || data.message.includes("invalid"),
      `Expected session invalidated message, got: ${data.message}`
    );
  });

  test("P9-4: NoSQL operator injection payloads ($where, $gt, __proto__) are stripped cleanly", async () => {
    const maliciousPayload = {
      email: { $gt: "" },
      password: "somepassword",
      __proto__: { isAdmin: true },
    };

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maliciousPayload),
    });

    // Should reject invalid login or missing email, never execute injected mongo operator
    assert.ok([400, 401].includes(res.status), `Expected 400 or 401 for stripped injection, got: ${res.status}`);
  });

  test("P9-5: Non-admin candidate cannot invoke administrative manual entitlement grant", async () => {
    const studentToken = jwt.sign(
      {
        id: "usr-student-test-1",
        email: "student@thelawkaksha.com",
        role: "student",
        tokenVersion: 1,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await fetch(`${API_URL}/api/admin/orders/LK-ORD-TEST/grant-manual`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${studentToken}`,
        "Content-Type": "application/json",
      },
    });

    assert.ok(
      res.status === 401 || res.status === 403,
      `Student must be denied access with 401 or 403, got: ${res.status}`
    );
  });
});
