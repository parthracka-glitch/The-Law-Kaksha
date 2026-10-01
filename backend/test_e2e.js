/**
 * The Law Kaksha - Automated End-to-End Integration Test Suite
 * Tests full visitor -> discover -> register -> login -> purchase -> server verification -> DRM access -> admin flow
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

    // Test 2: Courses & Catalog list
    const catalog = await request("GET", "/api/catalog");
    assert(catalog.status === 200 && catalog.body.products.length >= 2, "Product catalog returns subscription courses");

    // Test 3: Quizzes list
    const quizzes = await request("GET", "/api/quizzes");
    assert(quizzes.status === 200 && Array.isArray(quizzes.body.quizzes), "Quizzes API returns active tests");

    // Test 4: Register new student
    const testEmail = `student_${Date.now()}@gmail.com`;
    const regRes = await request("POST", "/api/auth/register", {
      name: "Test Student",
      email: testEmail,
      phone: "+91 98765 43210",
      password: "TestPassword123!",
      targetExam: "CA Foundation Paper 2: Business Laws",
    });
    assert(regRes.status === 201 && regRes.body.token, "Student registration succeeds with JWT token");
    const studentToken = regRes.body?.token;
    const studentId = regRes.body?.user?.student_id;
    assert(studentId && studentId.startsWith("LRK-"), `Unique Student Roll ID generated: ${studentId}`);

    // Test 5: Login verification with Roll ID
    const loginRes = await request("POST", "/api/auth/login", {
      email: studentId,
      password: "TestPassword123!",
    });
    assert(loginRes.status === 200 && loginRes.body.token, "Student login with Roll ID succeeds");

    // Test 6: Admin Login
    const adminLogin = await request("POST", "/api/auth/login", {
      email: "admin@thelawkaksha.com",
      password: "AdminSecurePassword2026!",
    });
    assert(adminLogin.status === 200 && adminLogin.body?.data?.user?.role === "admin", "Admin authentication succeeds");
    const adminToken = adminLogin.body?.token;

    // Test 7: Digital Order creation
    const orderCreate = await request("POST", "/api/orders/create", {
      items: [
        { id: "book-vol-1", title: "Business Law Volume 1", price: 249, quantity: 1, format: "pdf" },
      ],
      shippingDetails: {
        name: "Test Student",
        email: testEmail,
        phone: "+91 98765 43210",
        exam: "CA Foundation Paper 2: Business Laws",
      },
      couponCode: "EXEMPTION2026",
    });
    assert(orderCreate.status === 200 && orderCreate.body.orderId, `Order initiated: ${orderCreate.body?.orderId}`);
    const orderId = orderCreate.body?.orderId;
    const razorpayOrderId = orderCreate.body?.razorpayOrderId;

    // Test 8: Server-Side Payment Verification & In-Web DRM Access Grant
    const verifyRes = await request("POST", "/api/orders/verify", {
      orderId,
      razorpayOrderId,
      razorpayPaymentId: `pay_LK_${Date.now()}`,
      razorpaySignature: `sig_test_${Date.now()}`,
    });
    assert(verifyRes.status === 200 && verifyRes.body.success, "Payment verified on server with instant DRM unlock");
    assert(Array.isArray(verifyRes.body?.unlockedItemIds) && verifyRes.body.unlockedItemIds.includes("book-vol-1"), "DRM codex 'book-vol-1' unlocked for candidate");

    // Test 9: Admin Analytics
    const analytics = await request("GET", "/api/admin/analytics", null, adminToken);
    assert(analytics.status === 200 && analytics.body.data.totalStudentsCount >= 1, "Admin analytics returns student metrics");

    // Test 10: Admin Subscriptions list
    const adminSubs = await request("GET", "/api/admin/subscriptions", null, adminToken);
    assert(adminSubs.status === 200 && Array.isArray(adminSubs.body.subscriptions), "Admin subscriptions endpoint operational");

    // Test 11: Admin Students list
    const adminStudents = await request("GET", "/api/admin/students", null, adminToken);
    assert(adminStudents.status === 200 && Array.isArray(adminStudents.body.students), "Admin students directory operational");

    console.log(`\n-------------------------------------------------------`);
    console.log(`Test Execution Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`-------------------------------------------------------\n`);

    if (failed === 0) {
      console.log("All E2E Integration tests passed cleanly!");
    }
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    if (server) server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
