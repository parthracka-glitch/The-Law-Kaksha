const { test, describe } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Production Security Hardening & Zero-Trust Access Control Tests", () => {
  let studentToken = "";
  let studentEmail = `sec_test_${Date.now()}@thelawkaksha.com`;
  let studentId = "";
  let createdOrderId = "";

  test("Setup: Register a student to obtain authentic student JWT", async () => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Security Audit Candidate",
        email: studentEmail,
        password: "TestPassword2026!",
        selectedCourse: "CA Foundation Business Laws",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    studentToken = data.token;
    studentId = data.user.student_id;
  });

  test("P0 IDOR Guard: GET /api/student/dashboard rejects unauthenticated requests with 401", async () => {
    const res = await fetch(`${API_URL}/api/student/dashboard?email=${studentEmail}`);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test("P0 IDOR Guard: GET /api/student/dashboard succeeds with authenticated student JWT", async () => {
    const res = await fetch(`${API_URL}/api/student/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.student.email, studentEmail);
  });

  test("P0 Backdoor Purged: POST /api/student/sync-purchase returns 404 (backdoor completely removed)", async () => {
    const res = await fetch(`${API_URL}/api/student/sync-purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentData: { email: "attacker@exploit.com", name: "Attacker" },
        items: [{ id: "all-access" }],
      }),
    });
    assert.strictEqual(res.status, 404);
  });

  test("P0 Pricing Integrity: POST /api/orders/create enforces server-side pricing regardless of client payload", async () => {
    const res = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "course-ca-foundation-sub",
            title: "Tampered Price Item",
            price: 1, // Client tries to buy for ₹1
            quantity: 1,
          },
        ],
        shippingDetails: {
          name: "Security Aspirant",
          email: studentEmail,
        },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    // Server MUST override client's ₹1 with canonical ₹99
    assert.strictEqual(data.amount, 99);
    createdOrderId = data.orderId;
  });

  test("P0 Order IDOR Guard: GET /api/orders/:id rejects unauthenticated request with 401", async () => {
    const res = await fetch(`${API_URL}/api/orders/${createdOrderId}`);
    assert.strictEqual(res.status, 401);
  });

  test("P0 Order IDOR Guard: GET /api/orders/:id permits authentic order owner", async () => {
    const res = await fetch(`${API_URL}/api/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.id, createdOrderId);
  });

  test("P0 Order IDOR Guard: GET /api/orders/:id blocks another student with 403 Forbidden", async () => {
    // Register second student
    const reg2 = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Victim Aspirant",
        email: `victim_${Date.now()}@thelawkaksha.com`,
        password: "VictimPassword123!",
      }),
    });
    const reg2Data = await reg2.json();
    const attackerToken = reg2Data.token;

    // Attacker tries to view student 1's order
    const res = await fetch(`${API_URL}/api/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${attackerToken}` },
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test("SEC-01 Quiz Admin Guard: GET /api/quizzes/admin/attempts rejects student token with 403", async () => {
    const res = await fetch(`${API_URL}/api/quizzes/admin/attempts`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.ok(res.status === 401 || res.status === 403);
  });

  test("SEC-07 Admin 404 Guard: PUT /api/admin/subscriptions/:id returns 404 on missing ID", async () => {
    // Admin login
    const adminLogin = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "admin@thelawkaksha.com",
        password: "AdminSecurePassword2026!",
        deviceId: "admin_test_device_sec",
      }),
    });
    const adminData = await adminLogin.json();
    assert.strictEqual(adminLogin.status, 200);

    const res = await fetch(`${API_URL}/api/admin/subscriptions/non_existent_sub_999`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminData.token}`,
      },
      body: JSON.stringify({ studentName: "Hacked" }),
    });
    assert.strictEqual(res.status, 404);
  });

  test("SEC-10 Auth Hardening: POST /api/auth/logout rejects unauthenticated logout kick with 401", async () => {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: studentEmail, deviceId: "victim_device" }),
    });
    assert.strictEqual(res.status, 401);
  });

  test("SEC-12 Content Moderation: POST /api/reviews defaults is_verified to false", async () => {
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_name: "Anonymous Submitter",
        title: "Test Review Title",
        comment: "This is a legitimate student review submitted via frontend.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.review.is_verified, false);
  });
});
