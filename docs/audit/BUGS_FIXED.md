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
| **BUG-006** | `frontend/src/lib/api.ts`, `CartDrawer.tsx`, `DeviceSessionContext.tsx`, `next.config.ts` | Critical | Vercel production "Failed to fetch" on mobile/other devices due to hardcoded localhost | Implemented dynamic `getApiBaseUrl()` with automatic Render production fallback for non-localhost hostnames, created `.env.production`, and updated Next.js rewrites | Next.js 16 build + live Render health check |

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

### BUG-006: Production "Failed to fetch" on Remote Devices
- **Symptom:** Creating an account, logging in, or Google Sign-In on Vercel production failed with "Failed to fetch" on smartphones and external devices, while functioning on the developer's laptop.
- **Root Cause:** In `frontend/src/lib/api.ts` and several components, the API endpoint defaulted to `process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"`. Because `NEXT_PUBLIC_API_URL` was unset on Vercel or inlined from `.env.local`, the production client bundle made HTTP requests to `http://localhost:5000`. On the developer's laptop, a local backend was running on port 5000, so it succeeded; on any mobile device or external PC, `localhost:5000` refers to the mobile phone's loopback where no server exists, causing `TypeError: Failed to fetch`.
- **Fix:** 
  1. Created a centralized dynamic `getApiBaseUrl()` helper in `frontend/src/lib/api.ts` that checks `window.location.hostname`. If accessed from any non-localhost host (such as `*.vercel.app` or `thelawkaksha.com`) and `NEXT_PUBLIC_API_URL` points to localhost or is unset, it automatically resolves to the live Render backend (`https://the-law-kaksha.onrender.com`).
  2. Created `frontend/.env.production` pointing to `https://the-law-kaksha.onrender.com`.
  3. Replaced raw localhost defaults in `DeviceSessionContext.tsx`, `CartDrawer.tsx`, `Section16ComparisonBlock.tsx`, `ExamCountdownsAndQOTD.tsx`, `student/page.tsx`, and `admin/page.tsx` with `getApiBaseUrl()`.
  4. Updated `frontend/next.config.ts` rewrites to proxy to Render in production/Vercel.
  5. Enhanced `backend/src/server.js` CORS rules to handle Vercel subdomains smoothly and avoid unhandled exceptions on preflight rejections.
