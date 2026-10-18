const { test, describe } = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const API_URL = process.env.API_URL || "http://127.0.0.1:5000";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "mock_razorpay_secret_key";

describe("Order Verification & DRM License Pass Tests", () => {
  let createdOrderId = "";
  let createdRazorpayOrderId = "";
  const orderDeviceId = `DEV-ORDER-DEVICE-${Date.now().toString().slice(-4)}`;

  test("POST /api/orders/create calculates total and generates pending order", async () => {
    const res = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "ca-foundation-business-laws",
            title: "CA Foundation Business Laws Codex",
            price: 99,
            originalPrice: 299,
          },
        ],
        shippingDetails: {
          name: "Test Aspirant",
          email: "aspirant@thelawkaksha.com",
          phone: "+91 98765 43210",
          exam: "CA Foundation Paper 2: Business Laws",
        },
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.amount, 99);
    assert.ok(data.orderId);
    assert.ok(data.order_id || data.razorpayOrderId);
    createdOrderId = data.orderId;
    createdRazorpayOrderId = data.order_id || data.razorpayOrderId;
  });

  test("POST /api/orders/verify creates student credentials and locks device", async () => {
    const paymentId = `pay_${Date.now()}`;
    const validSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${createdRazorpayOrderId}|${paymentId}`)
      .digest("hex");

    const res = await fetch(`${API_URL}/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: createdOrderId,
        razorpayOrderId: createdRazorpayOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: validSignature,
        deviceId: orderDeviceId,
        deviceName: "Google Chrome on Windows 11",
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.studentId);
    assert.ok(data.tempPassword);
    assert.ok(data.credentials);
    assert.strictEqual(data.deviceId, orderDeviceId);
    assert.ok(Array.isArray(data.unlockedItemIds));
  });

  test("POST /api/verify-payment rejects tampered payment signature with 400", async () => {
    const res = await fetch(`${API_URL}/api/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: createdOrderId,
        razorpay_order_id: createdRazorpayOrderId,
        razorpay_payment_id: "pay_tampered_123",
        razorpay_signature: "invalid_tampered_signature_hex",
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.match(data.message, /mismatch/i);
  });

  test("POST /api/create-order validates minimum amount >= 100 paise", async () => {
    const res = await fetch(`${API_URL}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 50, // 50 paise is < 100 paise
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });
});

