const { test, describe } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Authentication & Single-Device Enforcement API Tests", () => {
  const uniqueSuffix = Date.now().toString().slice(-6);
  const testStudent = {
    name: "Audit Test Student",
    email: `audit_student_${uniqueSuffix}@thelawkaksha.com`,
    password: `TestPass@${uniqueSuffix}`,
    selectedCourse: "CA Foundation Paper 2: Business Laws",
  };

  test("POST /api/auth/register registers a new candidate", async () => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testStudent),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    const user = data.user || data.student;
    assert.ok(user.student_id);
    testStudent.student_id = user.student_id;
  });

  test("POST /api/auth/register blocks duplicate registration with 409", async () => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testStudent),
    });
    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test("POST /api/auth/login succeeds on primary device", async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testStudent.email,
        password: testStudent.password,
        deviceId: `DEV-PRIMARY-${uniqueSuffix}`,
        deviceName: "Google Chrome on Windows 11",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    testStudent.token = data.token;
  });

  test("POST /api/auth/login on secondary device is blocked with 409 DEVICE_CONFLICT", async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testStudent.student_id,
        password: testStudent.password,
        deviceId: `DEV-SECONDARY-${uniqueSuffix}`,
        deviceName: "Safari on iPhone 15",
      }),
    });
    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.code, "DEVICE_CONFLICT");
    assert.ok(data.activeDeviceName);
  });

  test("POST /api/auth/login with forceSwitchDevice transfers access to secondary device", async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testStudent.student_id,
        password: testStudent.password,
        deviceId: `DEV-SECONDARY-${uniqueSuffix}`,
        deviceName: "Safari on iPhone 15",
        forceSwitchDevice: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.activeDeviceId, `DEV-SECONDARY-${uniqueSuffix}`);
  });

  test("POST /api/auth/device-heartbeat revokes session of old primary device", async () => {
    const res = await fetch(`${API_URL}/api/auth/device-heartbeat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testStudent.token}`,
      },
      body: JSON.stringify({
        deviceId: `DEV-PRIMARY-${uniqueSuffix}`,
        studentId: testStudent.student_id,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.conflict, true);
  });

  test("POST /api/auth/logout releases active device lock", async () => {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: `DEV-SECONDARY-${uniqueSuffix}`,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  test("POST /api/auth/forgot-password generates reset token", async () => {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: testStudent.email }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.resetToken);
    testStudent.resetToken = data.resetToken;
  });

  test("POST /api/auth/forgot-password prevents user enumeration on unknown email", async () => {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "nonexistent_student_9999@thelawkaksha.com" }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.resetToken, undefined);
  });

  test("POST /api/auth/reset-password enforces password length and updates password", async () => {
    // Attempt with short password
    const shortRes = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: testStudent.resetToken,
        newPassword: "short",
      }),
    });
    assert.strictEqual(shortRes.status, 400);

    // Valid reset
    const newPass = "NewSecurePassword2026!";
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: testStudent.resetToken,
        newPassword: newPass,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);

    // Verify login with new password
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testStudent.email,
        password: newPass,
        deviceId: `DEV-NEW-${uniqueSuffix}`,
      }),
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert.ok(loginData.token);
  });
});

