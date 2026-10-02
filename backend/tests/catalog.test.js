const { test, describe } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://localhost:5000";

describe("Catalog & Public Content API Tests", () => {
  test("GET /api/public/site-data returns 200 and required fields", async () => {
    const res = await fetch(`${API_URL}/api/public/site-data`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.products));
    assert.ok(data.products.length > 0);
  });

  test("GET /api/public/section16-comparison returns Section 16(1) data", async () => {
    const res = await fetch(`${API_URL}/api/public/section16-comparison`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.comparison);
    assert.ok(data.comparison.topic.includes("Caveat Emptor"));
    assert.ok(data.comparison.modelAnswer.includes("Section 16(1)"));
  });

  test("GET /api/catalog returns active courses and codices", async () => {
    const res = await fetch(`${API_URL}/api/catalog`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.products));
  });

  test("GET /api/health returns healthy status and database indicators", async () => {
    const res = await fetch(`${API_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "healthy");
    assert.ok(data.database);
  });

  test("GET /healthz returns 200 OK liveness status", async () => {
    const res = await fetch(`${API_URL}/healthz`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "ok");
  });

  test("GET /readyz returns 200 OK readiness status", async () => {
    const res = await fetch(`${API_URL}/readyz`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "ready");
  });
});
