const { test, describe } = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";
const JWT_SECRET = process.env.JWT_SECRET || "the_law_kaksha_secure_jwt_secret_key_2026";

describe("Admin Access Control Security Tests (OWASP A01)", () => {
  test("GET /api/admin/products must reject unauthenticated requests with 401", async () => {
    const res = await fetch(`${API_URL}/api/admin/products`);
    assert.strictEqual(res.status, 401);
  });

  test("GET /api/admin/students must reject non-admin access with 401 or 403", async () => {
    // Generate token for a student
    const studentToken = jwt.sign(
      { id: "test_student", email: "student@thelawkaksha.com", role: "student" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const res = await fetch(`${API_URL}/api/admin/students`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.ok(res.status === 401 || res.status === 403);
  });

  test("GET /api/admin/subscriptions must reject unauthenticated requests with 401", async () => {
    const res = await fetch(`${API_URL}/api/admin/subscriptions`);
    assert.strictEqual(res.status, 401);
  });

  test("GET /api/admin/products allows authorized admin access", async () => {
    // Authenticate as seeded admin via official login endpoint
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "admin@thelawkaksha.com",
        password: "AdminSecurePassword2026!",
        deviceId: "admin_test_device_01",
      }),
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.ok(loginData.token);

    const res = await fetch(`${API_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${loginData.token}` },
    });
    // Should be 200 OK
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.success);
    assert.ok(Array.isArray(body.products));
  });

  test("OWASP A02: Server emits security headers and disables x-powered-by", async () => {
    const res = await fetch(`${API_URL}/api/health`);
    assert.strictEqual(res.headers.get("x-powered-by"), null);
    assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
    assert.strictEqual(res.headers.get("x-frame-options"), "SAMEORIGIN");
  });

  test("OWASP A05: NoSQL operator injection payloads are neutralized", async () => {
    // Attempt login with Mongo operator query injection
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        $gt: "",
        email: { $gt: "" },
        password: { $ne: null },
      }),
    });
    // Should be rejected cleanly as 400/401 because $ operator keys are stripped
    assert.ok(res.status === 400 || res.status === 401);
  });
});


