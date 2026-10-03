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
});
