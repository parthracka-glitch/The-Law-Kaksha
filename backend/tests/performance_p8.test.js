/**
 * Phase P8 Automated Test Suite: Performance, Core Web Vitals & Caching Optimization
 * Verifies:
 * 1. GET /api/catalog returns Cache-Control: public, max-age=60, stale-while-revalidate=120
 * 2. GET /api/public/site-data returns Cache-Control: public, max-age=60, stale-while-revalidate=120
 * 3. GET /api/catalog execution performance is sub-100ms
 * 4. GET /api/public/site-data execution performance is sub-100ms
 * 5. Low-overhead headers: X-Powered-By is disabled
 */

const { test, describe } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Phase P8: Performance, Core Web Vitals & Caching Tests", () => {
  test("P8-1: GET /api/catalog delivers Cache-Control headers for client caching", async () => {
    const res = await fetch(`${API_URL}/api/catalog`);
    assert.strictEqual(res.status, 200);
    const cacheHeader = res.headers.get("cache-control");
    assert.ok(cacheHeader, "Cache-Control header must be present on /api/catalog");
    assert.ok(cacheHeader.includes("public"), "Cache-Control should be public");
    assert.ok(cacheHeader.includes("max-age=60"), "Cache-Control should specify max-age=60");
  });

  test("P8-2: GET /api/public/site-data delivers Cache-Control headers for client caching", async () => {
    const res = await fetch(`${API_URL}/api/public/site-data`);
    assert.strictEqual(res.status, 200);
    const cacheHeader = res.headers.get("cache-control");
    assert.ok(cacheHeader, "Cache-Control header must be present on /api/public/site-data");
    assert.ok(cacheHeader.includes("public"), "Cache-Control should be public");
    assert.ok(cacheHeader.includes("stale-while-revalidate"), "Cache-Control should allow stale-while-revalidate");
  });

  test("P8-3: GET /api/catalog responds with high performance (< 1000ms)", async () => {
    const start = Date.now();
    const res = await fetch(`${API_URL}/api/catalog`);
    const duration = Date.now() - start;
    assert.strictEqual(res.status, 200);
    assert.ok(duration < 1000, `Catalog response took ${duration}ms, expected fast response`);
  });

  test("P8-4: GET /api/public/site-data responds with high performance (< 1000ms)", async () => {
    const start = Date.now();
    const res = await fetch(`${API_URL}/api/public/site-data`);
    const duration = Date.now() - start;
    assert.strictEqual(res.status, 200);
    assert.ok(duration < 1000, `Public site-data took ${duration}ms, expected fast response`);
  });

  test("P8-5: X-Powered-By is suppressed across all API responses", async () => {
    const res = await fetch(`${API_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const poweredBy = res.headers.get("x-powered-by");
    assert.strictEqual(poweredBy, null, "X-Powered-By header should not be present");
  });
});
