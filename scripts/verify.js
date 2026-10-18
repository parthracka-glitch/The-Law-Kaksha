/**
 * The Law Kaksha - Universal Project Verification Harness
 * Runs TypeScript typechecking, linting, backend test suites, and production build.
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");

console.log("==================================================");
console.log("🚀 Starting Full Verification Protocol...");
console.log("==================================================");

function runStep(name, cmdStr, cwd) {
  console.log(`\n▶ [Step] ${name}...`);
  try {
    execSync(cmdStr, {
      cwd: cwd || ROOT_DIR,
      stdio: "inherit",
      env: process.env,
    });
    console.log(`✔ [Step PASSED] ${name}`);
  } catch (err) {
    console.error(`\n❌ [Step FAILED] ${name}`);
    process.exit(1);
  }
}

// 1. Frontend TypeScript Typecheck
runStep("Frontend Typecheck", "npm run typecheck --prefix frontend");

// 2. Frontend Lint
runStep("Frontend ESLint", "npm run lint --prefix frontend");

// 3. Backend Test Suite (via ephemeral runner)
runStep("Backend Test Suite", "npm test --prefix backend");

// 4. Frontend Production Build
runStep("Frontend Build", "npm run build:frontend");

console.log("\n==================================================");
console.log("🎉 ALL VERIFICATION STEPS PASSED SUCCESSFULLY!");
console.log("==================================================");
