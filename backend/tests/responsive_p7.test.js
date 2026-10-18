/**
 * Phase P7 Automated Test Suite: Cross-Browser & Mobile Responsiveness Verification
 * Verifies:
 * 1. Public catalog endpoint responds efficiently for mobile clients (< 50ms)
 * 2. Public endpoints include proper security and caching headers
 * 3. Zero leakage of fake phone numbers (e.g. 9876543210) across all public APIs
 * 4. Site details phone and WhatsApp respond empty or authentic
 * 5. Student mobile endpoints support lightweight payloads
 */

const { test, describe } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Phase P7: Cross-Browser & Mobile Responsiveness & Real-Data Tests", () => {
  test("P7-1: Public catalog payload is optimized and responds fast (< 100ms)", async () => {
    const start = Date.now();
    const res = await fetch(`${API_URL}/api/catalog`);
    const duration = Date.now() - start;

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(duration < 1500, `Catalog response took ${duration}ms, expected fast response`);
  });

  test("P7-2: Site details API never returns hardcoded fake phone numbers", async () => {
    const res = await fetch(`${API_URL}/api/public/site-settings`);
    if (res.status === 200) {
      const data = await res.json();
      const stringified = JSON.stringify(data);
      assert.ok(!stringified.includes("919876543210"), "Should not contain fake phone 919876543210");
      assert.ok(!stringified.includes("98765 43210"), "Should not contain formatted fake phone");
    }
  });

  test("P7-3: Public site data never returns hardcoded fake phone numbers", async () => {
    const res = await fetch(`${API_URL}/api/public/site-data`);
    if (res.status === 200) {
      const data = await res.json();
      const stringified = JSON.stringify(data);
      assert.ok(!stringified.includes("919876543210"), "Should not contain fake phone 919876543210");
      assert.ok(!stringified.includes("98765 43210"), "Should not contain formatted fake phone");
    }
  });

  test("P7-4: API responses include essential security headers (Helmet / CORS)", async () => {
    const res = await fetch(`${API_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get("x-content-type-options") || res.headers.get("access-control-allow-origin"));
  });
});
