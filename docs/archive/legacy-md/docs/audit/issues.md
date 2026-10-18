# Audit Issue Log

| ID | Phase | Area | Description | Severity | Evidence | Fix | Status |
|---|---|---|---|---|---|---|---|
| **ISSUE-001** | Phase 0 | Frontend Prerender | `/login` failed static generation due to `useSearchParams()` lacking `<Suspense>` boundary | P1 | `next build --webpack` exited with code 1 | Wrapped `LoginContent` in `<Suspense fallback={...}>` in `login/page.tsx` | `FIXED` |
| **ISSUE-002** | Phase 0 | Supply Chain | Next.js 16.3.0 had 1 critical RCE vulnerability (GHSA-p293-qw3h-jr36) & 2 high advisories | P0 | `npm audit` in `frontend` | Upgraded to `next@16.3.8` and `eslint-config-next@16.3.8`. `npm audit` now reports 0 vulnerabilities | `FIXED` |
| **ISSUE-003** | Phase 0 | Supply Chain | Moderate vulnerabilities in backend `morgan` (log injection) & `qs` / `body-parser` (DoS) | P2 | `npm audit` in `backend` | Ran `npm audit fix` in backend. `npm audit` now reports 0 vulnerabilities | `FIXED` |
| **ISSUE-004** | Phase 1 | Access Control | All `/api/admin/*` endpoints in `adminRoutes.js` lack `requireAdmin` middleware, leaving administrative CRUD unprotected | P0 | `adminRoutes.js:31,91,104...` | Applied `router.use("/admin", requireAdmin)` in `adminRoutes.js` and updated frontend `adminFetch` with Bearer token injection | `FIXED` |
| **ISSUE-005** | Phase 1 | Auth Middleware | `authMiddleware.js` only checked local `Database.table("users")` instead of checking MongoDB Atlas when connected | P1 | `backend/src/middleware/authMiddleware.js:25-27` | Updated `requireAuth` to query MongoDB Atlas `$or: [{ id }, { email }, { student_id }]` with fallback | `FIXED` |
| **ISSUE-006** | Phase 1 | Dead Code | `AdminDispatchSlipModal.tsx` was an empty 256-byte stub file deprecated after DRM transition | P3 | `frontend/src/components/AdminDispatchSlipModal.tsx` | Removed obsolete component. Build & types verified with zero broken imports | `FIXED` |
| **ISSUE-007** | Phase 1 | Lint / Quality | 1,848 ESLint problems (66 errors, 1,782 warnings), including `no-explicit-any` and React 19 hook warnings | P2 | `npm run lint` in `frontend` | Fix types and hook usage in Phase 4/10 | `OPEN` |
| **ISSUE-008** | Phase 2 | Authentication | Missing self-service Forgot Password and Reset Password recovery flow | P2 | Inventory and Status review gap | Implemented `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` + frontend modal in `login/page.tsx` | `FIXED` |

