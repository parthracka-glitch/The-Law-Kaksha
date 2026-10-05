# Baseline Audit & Verification Report (Phase 0)

**Date:** 2026-10-05  
**Agent:** gemini  
**Git Branch:** `audit/2026-10-05`  
**Baseline Tag:** `pre-audit-baseline` (`162ff8a`)  
**Commit:** `162ff8a`  

---

## 1. Project Inventory & Technology Stack

| Component | Technology | Target Platform | Details / Entry Point |
|---|---|---|---|
| Monorepo Root | npm workspaces / script orchestrator | Local / CI | `package.json` |
| Frontend | Next.js 16.3.8, React 19.2.4, Tailwind CSS v4 | Vercel | `frontend/src/app/` (`layout.tsx`, `page.tsx`) |
| Backend | Node.js, Express.js 4.21.2 | Render Web Service | `backend/src/server.js` |
| Primary Database | MongoDB Atlas via Mongoose 9.10.3 | Cloud Database | `backend/src/config/db.js` |
| Fallback Database | Local JSON Store (`backend/data/lawkaksha_db.json`) | Local disk | `backend/src/models/LocalDb.js` |
| Payments | Razorpay SDK 2.9.8 | Payment Gateway | `backend/src/controllers/paymentController.js` |
| Media Storage | Cloudinary SDK 2.11.0 | Cloud Media Storage | `backend/src/controllers/materialController.js` |
| Authentication | JWT + bcryptjs + Google Auth Library | Local / OAuth | `backend/src/controllers/authController.js` |

---

## 2. Command Execution & Baseline Results

| Command | Subsystem | Result | Exit Code | Details / Findings |
|---|---|---|---|---|
| `npm run typecheck --prefix frontend` | Frontend | **PASS** | 0 | TypeScript strict check passed with 0 errors (`tsc --noEmit`). |
| `npm run lint --prefix frontend` | Frontend | **PASS** | 0 | ESLint passed with 0 errors and 374 warnings. Dominant warnings: `react-hooks/set-state-in-effect`, `@typescript-eslint/no-unused-vars`, `@typescript-eslint/no-explicit-any`. |
| `npm run build:frontend` | Frontend | **PASS** | 0 | Next.js production build succeeded in 4.6s compilation + 4.8s TypeScript. Generated 20 static/dynamic routes. Noted deprecation: Next.js 16 recommends migrating `middleware.ts` to `proxy`. |
| `npm test --prefix backend` | Backend | **PRE-EXISTING FAIL** | 1 | Failed with `ECONNREFUSED 127.0.0.1:5000`. The 5 test suites (`auth_device`, `catalog`, `orders_drm`, `admin_security`, `security_hardening`) are end-to-end integration tests that expect an active server instance running on port 5000. |
| `npm audit --prefix frontend` | Frontend | **WARNING** | 0 | 5 high severity vulnerabilities detected in transitive dependencies (`braces` via `eslint-config-next@16.3.8` devDependencies). |
| `npm audit --prefix backend` | Backend | **PASS** | 0 | 0 vulnerabilities found in backend production or development dependencies. |

---

## 3. Code Volume & Distribution Metrics

| Subsystem | Directory | Files | Lines of Code (LOC) | Primary Languages / Formats |
|---|---|---|---|---|
| Frontend Source | `frontend/src/` | 82 | 25,967 | TypeScript, TSX, CSS |
| Backend Source | `backend/src/` | 14 | 5,395 | JavaScript (CommonJS) |
| Backend Tests | `backend/tests/` | 5 | 523 | JavaScript (`node:test`) |
| **Total Core Codebase** | | **101** | **31,885** | |

---

## 4. Pre-Existing Issues & Observations

1. **Test Environment Orchestration:** Backend test suites lack an automated ephemeral test server bootstrap. Running `npm test` requires starting the server beforehand or integrating an in-memory/supertest lifecycle hook.
2. **Next.js 16 Proxy Migration:** Next.js 16 emits a deprecation warning: `The "middleware" file convention is deprecated. Please use "proxy" instead.`
3. **ESLint Warning Density:** 374 ESLint warnings exist across frontend components, primarily state initialization effects in client components (`DeviceSessionContext.tsx`, `EnrollModal.tsx`).
4. **Git State:** `backend/data/lawkaksha_db.json` has uncommitted timestamp changes from previous local server execution; kept unstaged and off-limits per Prime Directives.
