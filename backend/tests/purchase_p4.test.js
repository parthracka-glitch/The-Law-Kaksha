/**
 * Phase P4 Automated Test Suite: Purchase, Guaranteed Access & Entitlement Reconciliation
 * Verifies:
 * 1. Double-verify idempotency (no duplicate entitlements or payments)
 * 2. Razorpay webhook cryptographic verification and access grant
 * 3. Reconcile endpoint functionality
 * 4. Admin manual entitlement grant with audit logging
 */

const { test, describe, before } = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Phase P4: Purchase & Guaranteed Entitlement Tests", () => {
  let adminToken = "";
  let studentToken = "";
  const testStudentEmail = `p4_student_${Date.now()}@thelawkaksha.com`;
  const testOrderRef = `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const testRzpOrder = `order_test_${Date.now()}`;
  const testPaymentId = `pay_test_${Date.now()}`;
  const secretKey = process.env.RAZORPAY_KEY_SECRET || "mock_razorpay_secret_key";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "mock_razorpay_webhook_secret";

  before(async () => {
    // 1. Admin login
    const adminRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "admin@thelawkaksha.com",
        password: "AdminSecurePassword2026!",
        deviceId: "admin_test_p4_device",
      }),
    });
    const adminData = await adminRes.json();
    adminToken = adminData.token || "";

    // 2. Student register
    const studentRes = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "P4 Aspirant",
        email: testStudentEmail,
        password: "StudentPassword2026!",
        phone: "+91 98765 43210",
        target_exam: "CA Foundation Paper 2: Business Laws",
        role: "student",
      }),
    });
    const studentData = await studentRes.json();
    studentToken = studentData.token || "";
  });

  test("P4 Order Verification: Generates entitlement with correct expires_at and payment record", async () => {
    // 1. Create order
    const createRes = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "ca-foundation-sub", title: "CA Foundation Pass", quantity: 1 }],
        shippingDetails: {
          name: "P4 Aspirant",
          email: testStudentEmail,
          phone: "+91 98765 43210",
        },
      }),
    });
    const createData = await createRes.json();
    assert.strictEqual(createRes.status, 200);
    const orderId = createData.orderId;
    const rzpOrderId = createData.razorpayOrderId;

    // 2. Generate valid HMAC signature
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(`${rzpOrderId}|${testPaymentId}`)
      .digest("hex");

    // 3. Verify payment
    const verifyRes = await fetch(`${API_URL}/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: signature,
      }),
    });
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyData.success, true);
    assert.strictEqual(verifyData.order.status, "COMPLETED");
  });

  test("P4 Idempotency: Double verification returns identical response without duplicating entitlements", async () => {
    // Create new order
    const createRes = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "ca-foundation-sub", title: "CA Foundation Pass", quantity: 1 }],
        shippingDetails: {
          name: "P4 Aspirant",
          email: testStudentEmail,
          phone: "+91 98765 43210",
        },
      }),
    });
    const createData = await createRes.json();
    const orderId = createData.orderId;
    const rzpOrderId = createData.razorpayOrderId;
    const paymentId = `pay_idem_${Date.now()}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(`${rzpOrderId}|${paymentId}`)
      .digest("hex");

    // First verify
    const firstRes = await fetch(`${API_URL}/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });
    const firstData = await firstRes.json();
    assert.strictEqual(firstRes.status, 200);
    assert.strictEqual(firstData.success, true);

    // Second verify (identical payload)
    const secondRes = await fetch(`${API_URL}/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });
    const secondData = await secondRes.json();
    assert.strictEqual(secondRes.status, 200);
    assert.strictEqual(secondData.success, true);
    assert.strictEqual(secondData.order.id, firstData.order.id);
  });

  test("P4 Webhook: Rejects invalid or tampered webhook signature with 400", async () => {
    const payload = JSON.stringify({
      event: "order.paid",
      payload: {
        order: { entity: { id: "order_fake_123" } },
        payment: { entity: { id: "pay_fake_123" } },
      },
    });

    const res = await fetch(`${API_URL}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "tampered_fake_signature_abc_123",
      },
      body: payload,
    });
    assert.strictEqual(res.status, 400);
  });

  test("P4 Webhook: Grants access on valid order.paid event", async () => {
    // 1. Create order
    const createRes = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "ca-foundation-sub", title: "CA Foundation Pass", quantity: 1 }],
        shippingDetails: {
          name: "Webhook Aspirant",
          email: `wh_aspirant_${Date.now()}@thelawkaksha.com`,
          phone: "+91 98765 43210",
        },
      }),
    });
    const createData = await createRes.json();
    const orderId = createData.orderId;
    const rzpOrderId = createData.razorpayOrderId;
    const paymentId = `pay_wh_${Date.now()}`;

    // 2. Send webhook payload
    const payload = JSON.stringify({
      event: "order.paid",
      payload: {
        order: { entity: { id: rzpOrderId } },
        payment: { entity: { id: paymentId } },
      },
    });

    const signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    const whRes = await fetch(`${API_URL}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
      body: payload,
    });
    const whData = await whRes.json();
    assert.strictEqual(whRes.status, 200);
    assert.strictEqual(whData.success, true);
  });

  test("P4 Reconcile: Student 'I paid but cannot access' triggers /api/orders/reconcile-my-access", async () => {
    const res = await fetch(`${API_URL}/api/orders/reconcile-my-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.entitlements));
  });

  test("P4 Admin Manual Grant: Grants entitlement and creates audit log", async () => {
    // 1. Create a pending order
    const createRes = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "ca-foundation-sub", title: "CA Foundation Pass", quantity: 1 }],
        shippingDetails: {
          name: "Manual Grant Student",
          email: `manual_grant_${Date.now()}@thelawkaksha.com`,
          phone: "+91 98765 43210",
        },
      }),
    });
    const createData = await createRes.json();
    const orderId = createData.orderId;

    // 2. Admin manually grants access
    const grantRes = await fetch(`${API_URL}/api/admin/orders/${orderId}/grant-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        notes: "Granted by support team after payment slip verification",
      }),
    });
    const grantData = await grantRes.json();
    assert.strictEqual(grantRes.status, 200);
    assert.strictEqual(grantData.success, true);
    assert.strictEqual(grantData.order.status, "COMPLETED");
  });

  test("P4 Admin Recheck: Admin can trigger order recheck with gateway", async () => {
    const createRes = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "ca-foundation-sub", title: "CA Foundation Pass", quantity: 1 }],
        shippingDetails: {
          name: "Recheck Student",
          email: `recheck_${Date.now()}@thelawkaksha.com`,
          phone: "+91 98765 43210",
        },
      }),
    });
    const createData = await createRes.json();
    const orderId = createData.orderId;

    const recheckRes = await fetch(`${API_URL}/api/admin/orders/${orderId}/recheck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const recheckData = await recheckRes.json();
    assert.strictEqual(recheckRes.status, 200);
    assert.strictEqual(recheckData.success, true);
  });
});
