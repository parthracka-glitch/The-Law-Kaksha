const { test, describe, before } = require("node:test");
const assert = require("node:assert");
const Database = require("../src/db/database");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Phase P3: Private Cloudinary & Zero-Trust Authorization Gate Tests", () => {
  let adminToken = "";
  let studentTokenNoAccess = "";
  let studentTokenWithAccess = "";
  let studentTokenDrmBlocked = "";
  let studentTokenExpired = "";

  const testContentItemId = "item-ca-soga-1"; // Published item in database

  before(async () => {
    // 1. Admin login
    const adminRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "admin@thelawkaksha.com",
        password: "AdminSecurePassword2026!",
        deviceId: "admin_test_device_p3",
      }),
    });
    const adminData = await adminRes.json();
    assert.strictEqual(adminRes.status, 200, "Admin login must succeed");
    adminToken = adminData.token;

    // 2. Student without access
    const regNoAccess = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "No Access Student",
        email: `no_access_${Date.now()}@thelawkaksha.com`,
        password: "Password123!",
      }),
    });
    const noAccessData = await regNoAccess.json();
    studentTokenNoAccess = noAccessData.token;

    // 3. Student with active entitlement
    const emailWithAccess = `with_access_${Date.now()}@thelawkaksha.com`;
    const regWithAccess = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Entitled Student",
        email: emailWithAccess,
        password: "Password123!",
      }),
    });
    const withAccessData = await regWithAccess.json();
    studentTokenWithAccess = withAccessData.token;

    // Grant active access via admin subscription API
    const grantRes = await fetch(`${API_URL}/api/admin/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        email: emailWithAccess,
        accessStatus: "Active",
        status: "ACTIVE",
        item: "CA Foundation Paper 2",
        unlockedItemIds: ["course-ca-foundation-sub", "ca-foundation", "item-ca-soga-1"],
      }),
    });
    assert.strictEqual(grantRes.status, 201, "Grant access must succeed");

    // 4. Student with DRM blocked
    const regDrm = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "DRM Blocked Student",
        email: `drm_blocked_${Date.now()}@thelawkaksha.com`,
        password: "Password123!",
      }),
    });
    const drmData = await regDrm.json();
    studentTokenDrmBlocked = drmData.token;

    // Admin updates user drm_access to false via API
    const updateDrmRes = await fetch(`${API_URL}/api/admin/students/${drmData.user.id || drmData.user.student_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ drm_access: false }),
    });
    assert.strictEqual(updateDrmRes.status, 200, "DRM block update must succeed");

    // 5. Student with expired entitlement
    const regExpired = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Expired Student",
        email: `expired_${Date.now()}@thelawkaksha.com`,
        password: "Password123!",
      }),
    });
    const expiredData = await regExpired.json();
    studentTokenExpired = expiredData.token;

    // Create expired subscription record via admin API
    const expireRes = await fetch(`${API_URL}/api/admin/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        email: expiredData.user.email,
        accessStatus: "Expired",
        status: "EXPIRED",
        item: "CA Foundation Paper 2",
        unlockedItemIds: ["course-ca-foundation"],
      }),
    });
    assert.strictEqual(expireRes.status, 201, "Expired subscription creation must succeed");
  });

  test("P3 Auth Gate: Unauthenticated request to /api/content/:itemId/file returns 401 NO_LOGIN", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file`);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, "NO_LOGIN");
  });

  test("P3 Auth Gate: Authenticated student without active entitlement returns 403 NO_ACCESS", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file`, {
      headers: { Authorization: `Bearer ${studentTokenNoAccess}` },
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, "NO_ACCESS");
  });

  test("P3 Auth Gate: Student with drm_access === false returns 403 DRM_BLOCKED", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file`, {
      headers: { Authorization: `Bearer ${studentTokenDrmBlocked}` },
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, "DRM_BLOCKED");
  });

  test("P3 Auth Gate: Student with expired entitlement returns 403 EXPIRED", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file`, {
      headers: { Authorization: `Bearer ${studentTokenExpired}` },
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, "EXPIRED");
  });

  test("P3 Free Sample: Unauthenticated request with ?sample=true returns 200 PDF", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file?sample=true`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type"), "application/pdf");
    const cacheControl = res.headers.get("cache-control") || "";
    assert.ok(cacheControl.includes("private") && cacheControl.includes("no-store"), "Must have private, no-store headers");
    const bytes = await res.arrayBuffer();
    assert.ok(bytes.byteLength > 0, "Must return valid PDF bytes");
  });

  test("P3 Entitlement Access: Student with active pass receives 200 PDF with private, no-store header", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file`, {
      headers: { Authorization: `Bearer ${studentTokenWithAccess}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type"), "application/pdf");
    const cacheControl = res.headers.get("cache-control") || "";
    assert.ok(cacheControl.includes("private") && cacheControl.includes("no-store"));
    const bytes = await res.arrayBuffer();
    assert.ok(bytes.byteLength > 0);
  });

  test("P3 Admin Access: Administrator receives 200 PDF stream", async () => {
    const res = await fetch(`${API_URL}/api/content/${testContentItemId}/file`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type"), "application/pdf");
  });

  test("P3 Data Leak Protection: GET /api/catalog never leaks cloudinaryPublicId or raw Cloudinary URLs", async () => {
    const res = await fetch(`${API_URL}/api/catalog`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.products));

    for (const prod of data.products) {
      assert.strictEqual(prod.cloudinaryPublicId, undefined, "cloudinaryPublicId must never be in catalog response");
      assert.ok(!JSON.stringify(prod).includes("res.cloudinary.com"), "No raw Cloudinary URLs in catalog");
    }
  });

  test("P3 Data Leak Protection: GET /api/public/site-data never leaks cloudinaryPublicId", async () => {
    const res = await fetch(`${API_URL}/api/public/site-data`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.products));

    for (const prod of data.products) {
      assert.strictEqual(prod.cloudinaryPublicId, undefined, "cloudinaryPublicId must never be in site-data");
      assert.ok(!JSON.stringify(prod).includes("res.cloudinary.com"));
    }
  });

  test("P3 Data Leak Protection: GET /api/resources never leaks cloudinaryPublicId in public list", async () => {
    const res = await fetch(`${API_URL}/api/resources`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.resources));

    for (const item of data.resources) {
      assert.strictEqual(item.cloudinaryPublicId, undefined, "cloudinaryPublicId must never be in resources");
      assert.ok(!JSON.stringify(item).includes("res.cloudinary.com"));
    }
  });
});
