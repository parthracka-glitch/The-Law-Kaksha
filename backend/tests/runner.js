/**
 * The Law Kaksha - Automated Ephemeral Test Server Harness
 * Automatically boots server in-process on an ephemeral port, executes node:test suites, and shuts down cleanly.
 */

const app = require("../src/server");
const { spawn } = require("child_process");

const server = app.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const testApiUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Runner] Ephemeral test server active on ${testApiUrl}`);

  const testProcess = spawn(
    process.execPath,
    ["--test", "tests/admin_security.test.js", "tests/auth_device.test.js", "tests/catalog.test.js", "tests/orders_drm.test.js", "tests/security_hardening.test.js"],
    {
      cwd: __dirname + "/..",
      env: { ...process.env, API_URL: testApiUrl, PORT: String(port) },
      stdio: "inherit",
    }
  );

  testProcess.on("exit", (code) => {
    console.log(`[Test Runner] Tests exited with code ${code}. Tearing down server...`);
    server.close(() => {
      process.exit(code || 0);
    });
  });
});
