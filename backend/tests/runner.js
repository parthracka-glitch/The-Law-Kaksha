/**
 * The Law Kaksha - Automated Ephemeral Test Server Harness
 * Automatically boots server in-process on an ephemeral port, executes node:test suites, and shuts down cleanly.
 */

process.env.NODE_ENV = "test";
const fs = require("fs");
const path = require("path");
const app = require("../src/server");
const { spawn } = require("child_process");

const server = app.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const testApiUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Runner] Ephemeral test server active on ${testApiUrl}`);

  const testProcess = spawn(
    process.execPath,
    ["--test", "tests/admin_security.test.js", "tests/auth_device.test.js", "tests/catalog.test.js", "tests/orders_drm.test.js", "tests/security_hardening.test.js", "tests/content_auth_p3.test.js", "tests/purchase_p4.test.js", "tests/admin_p5.test.js", "tests/student_p6.test.js", "tests/responsive_p7.test.js", "tests/performance_p8.test.js", "tests/security_p9.test.js"],
    {
      cwd: __dirname + "/..",
      env: { ...process.env, NODE_ENV: "test", API_URL: testApiUrl, PORT: String(port) },
      stdio: "inherit",
    }
  );

  testProcess.on("exit", (code) => {
    console.log(`[Test Runner] Tests exited with code ${code}. Tearing down server...`);
    // Clean up ephemeral test DB file
    const testDbPath = path.resolve(__dirname, "../data/lawkaksha_db.test.json");
    try {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    } catch (_) {}

    server.close(() => {
      process.exit(code || 0);
    });
  });
});
