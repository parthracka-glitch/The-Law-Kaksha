# Bugs Fixed Register

> **Purpose:** Detailed log of defects, root causes, remediation diffs, and verification tests resolved during the audit.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Lead Auditor  

---

## 1. Summary of Fixed Defects

| ID | Module / File | Severity | Defect Description | Resolution | Verification |
|---|---|:---:|---|---|---|
| **BUG-001** | `backend/src/routes/authRoutes.js` | Medium | CSEET Student Roll ID Prefix Inconsistency | Updated `generateStudentId` to emit `LRK-2026-CS` prefix for CSEET exams | Unit / Integration Test |
| **BUG-002** | `backend/tests/runner.js` | High | Test Server Lifecycle Unmanaged (E2E suites required running server) | Built ephemeral test server harness booting on ephemeral port 0 and closing on test exit | `npm test` passing 35/35 |
| **BUG-003** | `backend/src/db/database.js` | Medium | Windows `EPERM` file-locking race condition during atomic rename | Added copy-and-unlink fallback in `saveToDisk` for Windows environments | Multi-write stress test |
| **BUG-004** | `backend/src/routes/quizRoutes.js` | Low | Undefined middleware import (`authenticateToken`) | Replaced with `requireAuth` and added backward-compatible export alias | Verified in route load |
| **BUG-005** | `scripts/verify.js` | Low | Windows child process argument deprecation warning (DEP0190) | Switched from `spawnSync` shell argument concatenation to `execSync` | Universal harness execution |

---

## 2. Detailed Root Cause Analysis

### BUG-001: CSEET Student Roll ID Prefix Inconsistency
- **Symptom:** Students registering with `targetExam: "CSEET"` received student roll IDs formatted as `LRK-2026-00XXXX` rather than the canonical `LRK-2026-CSXXXX` assigned during checkout fulfillment.
- **Root Cause:** In `authRoutes.js`, the ternary expression `isCSEET ? LRK-2026-00${randomNum} : LRK-2026-00${randomNum}` mistakenly used the identical format in both branches.
- **Fix:** Corrected ternary truth branch to `` `LRK-2026-CS${randomNum}` ``.

### BUG-002: Ephemeral Test Server Lifecycle
- **Symptom:** Running `npm test` in the backend failed because the test suites make HTTP requests to `process.env.API_URL || "http://localhost:5000"`, requiring an active server.
- **Root Cause:** Tests are end-to-end integration tests without an automated in-process server lifecycle harness.
- **Fix:** Created `backend/tests/runner.js` which boots `server.js` in-process on an OS-assigned ephemeral port (port 0), passes `API_URL` to child test worker, and tears down cleanly upon suite exit.

### BUG-003: Windows EPERM File Lock Handling
- **Symptom:** Rapid successive writes to `backend/data/lawkaksha_db.json` on Windows occasionally failed with `EPERM: operation not permitted, rename` due to filesystem indexing locks.
- **Root Cause:** Windows locks files during read/index operations, causing `fs.renameSync` over an existing target to fail intermittently.
- **Fix:** Wrapped `fs.renameSync` in a try/catch block with fallback to `fs.copyFileSync` + `fs.unlinkSync` when error code is `EPERM` or `EBUSY`.
