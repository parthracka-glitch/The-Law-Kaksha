const { test, describe } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Order Verification & DRM License Pass Tests", () => {
  const uniqueOrder = `LK-ORD-${Date.now().toString().slice(-6)}`;
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
  });

  test("POST /api/orders/verify creates student credentials and locks device", async () => {
    const res = await fetch(`${API_URL}/api/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: uniqueOrder,
        razorpayOrderId: `order_${Date.now()}`,
        razorpayPaymentId: `pay_${Date.now()}`,
        razorpaySignature: `sig_${Date.now()}`,
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
});
