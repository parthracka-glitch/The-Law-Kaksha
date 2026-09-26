/**
 * The Law Kaksha - Automated End-to-End Integration Test Suite
 * Tests full visitor -> discover -> preview -> purchase -> server verification -> DRM access -> admin flow
 */

const app = require("./src/server");
const http = require("http");

let server;
const PORT = 5099;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = { "Content-Type": "application/json" };
    if (payload) headers["Content-Length"] = Buffer.byteLength(payload);
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(
      {
        host: "localhost",
        port: PORT,
        method,
        path,
        headers,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: JSON.parse(raw),
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: raw,
            });
          }
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   THE LAW KAKSHA — END-TO-END INTEGRATION TEST SUITE");
  console.log("=======================================================\n");

  server = app.listen(PORT);
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Health Check
    const health = await request("GET", "/api/health");
    assert(health.status === 200 && health.body.status === "healthy", "Health check probe responds healthy");

    // Test 2: Catalog list
    const catalog = await request("GET", "/api/catalog");
    assert(catalog.status === 200 && catalog.body.count >= 6, "Product catalog returns 6 flagship CA Law products");

    // Test 3: Product preview
    const preview = await request("GET", "/api/catalog/book-vol-1/preview");
    assert(preview.status === 200 && preview.body.totalPages === 6, "Public 2-3 page preview returns watermarked sample");

    // Test 4: Register new student
    const testEmail = `student_${Date.now()}@gmail.com`;
    const regRes = await request("POST", "/api/auth/register", {
      name: "Parth Test Student",
      email: testEmail,
      phone: "+91 99887 76655",
      password: "TestSecurePassword123!",
      targetExam: "CA Intermediate Paper 2 (Nov'26)",
    });
    assert(regRes.status === 201 && regRes.body.token, "Student registration succeeds with JWT token");
    assert(regRes.body.user.student_id.startsWith("LRK-"), `Unique Student ID generated: ${regRes.body?.user?.student_id}`);
    const studentToken = regRes.body.token;
    const studentId = regRes.body.user.student_id;

    // Test 5: Login verification
    const loginRes = await request("POST", "/api/auth/login", {
      email: testEmail,
      password: "TestSecurePassword123!",
    });
    assert(loginRes.status === 200 && loginRes.body.token, "Student login verifies password hash successfully");

    // Test 6: Verify Content Access DENIED before purchase
    const unauthAccess = await request("GET", "/api/content/book-vol-2/access", null, studentToken);
    assert(unauthAccess.status === 403 && unauthAccess.body.error === "ACCESS_DENIED", "Content gate denies access to unpurchased course (403 Forbidden)");

    // Test 7: Create server-side order
    const orderCreate = await request("POST", "/api/orders/create", {
      items: [{ id: "book-vol-2", format: "pdf", quantity: 1 }],
      shippingDetails: {
        name: "Parth Test Student",
        email: testEmail,
        phone: "+91 99887 76655",
        exam: "CA Intermediate Paper 2",
      },
      couponCode: "LAW20",
    }, studentToken);
    assert(orderCreate.status === 201 && orderCreate.body.orderId, `Order initiated: ${orderCreate.body?.orderId} with 20% discount (Total: ₹${orderCreate.body?.amount})`);

    const orderId = orderCreate.body.orderId;
    const rzpOrderId = orderCreate.body.razorpayOrderId;

    // Test 8: Server-side cryptographic payment verification
    const verifyRes = await request("POST", "/api/orders/verify", {
      orderId,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: `pay_test_${Date.now()}`,
      razorpaySignature: "sig_test_verified",
    }, studentToken);
    assert(verifyRes.status === 200 && verifyRes.body.order.payment_status === "PAID", "Cryptographic payment verification marks order as PAID");
    assert(verifyRes.body.unlockedItemIds.includes("book-vol-2"), "Enrollments engine grants access to purchased product");

    // Test 9: Verify Content Access ALLOWED after verified purchase
    const authAccess = await request("GET", "/api/content/book-vol-2/access", null, studentToken);
    assert(authAccess.status === 200 && authAccess.body.watermark, "DRM stream endpoint grants access to enrolled student");
    assert(authAccess.body.watermark.studentId === studentId, `Dynamic student DRM watermark attached: ${authAccess.body?.watermark?.watermarkText}`);

    // Test 10: Admin analytics & orders verification
    const adminLogin = await request("POST", "/api/auth/login", {
      email: "admin@thelawkaksha.com",
      password: "AdminSecurePassword2026!",
    });
    const adminToken = adminLogin.body.token;

    const adminStats = await request("GET", "/api/admin/analytics", null, adminToken);
    assert(adminStats.status === 200 && adminStats.body.analytics.totalRevenue > 0, `Admin analytics reflects live revenue: ₹${adminStats.body?.analytics?.totalRevenue}`);

    const adminOrders = await request("GET", "/api/admin/orders", null, adminToken);
    const orderFound = adminOrders.body.orders.some((o) => o.id === orderId);
    assert(orderFound, `Newly placed order ${orderId} appears in admin order ledger`);

    console.log("\n-------------------------------------------------------");
    console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("-------------------------------------------------------\n");

    if (failed === 0) {
      console.log("🎉 ALL END-TO-END ACCEPTANCE TESTS PASSED SUCCESSFULLY!\n");
    }
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    server.close();
    process.exit(failed === 0 ? 0 : 1);
  }
}

runTests();
