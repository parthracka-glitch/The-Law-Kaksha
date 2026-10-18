# Phase 9 — Production Readiness and Deployment Runbook

**Date:** 2026-10-02  
**Branch:** `audit/production-readiness`  
**Status:** **PASSED / COMPLETE**

---

## 1. Executive Summary

Phase 9 completed the operational hardening, configuration management, health probe integrations, and deployment runbook for hosting **The Law Kaksha** in production across **Vercel** (Next.js App Router Frontend) and **Render** (Express / Node.js API Backend) with **MongoDB Atlas Cluster0**.

---

## 2. Environment Configuration Matrix

The unified environment specification is recorded in [`.env.example`](file:///c:/Users/Parth%20Racka/OneDrive/Desktop/NIRVANAA%20STUDIOS%20PROJECTS/The%20Law%20Kaksha/thelawkaksha/.env.example):

| Variable Name | Tier | Requirement | Description / Safe Default |
|---|---|---|---|
| `PORT` | Backend | Optional | Express server port (`5000` by default; dynamically assigned by Render) |
| `NODE_ENV` | Backend | **Required** | Must be set to `production` |
| `FRONTEND_URL` | Backend | **Required** | Production web domain (`https://thelawkaksha.com`) for strict CORS validation |
| `MONGODB_URI` | Backend | **Required** | MongoDB Atlas connection string with replica set parameters |
| `JWT_SECRET` | Backend | **Required** | 64+ character cryptographic secret for signing candidate and admin tokens |
| `CLOUDINARY_*` | Backend | Optional | Cloudinary storage credentials for PDF note hosting and media uploads |
| `RAZORPAY_*` | Backend | **Required** | Production Razorpay Key ID and Secret for payment verification |
| `NEXT_PUBLIC_API_URL` | Frontend | **Required** | URL of backend API gateway (`https://api.thelawkaksha.com`) |
| `NEXT_PUBLIC_SITE_URL` | Frontend | **Required** | Canonical site URL for metadata and XML sitemap (`https://thelawkaksha.com`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Frontend | **Required** | Public Razorpay key ID for client-side checkout initiation |

---

## 3. Kubernetes / Docker / Cloud Health Probes

Three standardized monitoring endpoints are mounted in `backend/src/server.js`:

1. **`GET /healthz` (Liveness Probe):**
   * Returns HTTP `200 OK` with `{ status: "ok", timestamp: ... }`.
   * Used by Render/Kubernetes orchestrators to confirm the event loop is active.
2. **`GET /readyz` (Readiness Probe):**
   * Returns HTTP `200 OK` with `{ status: "ready", mongoConnected: ... }` when either MongoDB Atlas or the fault-tolerant local cache is primed to receive student requests.
   * Returns HTTP `503 Service Unavailable` if the data store is initializing.
3. **`GET /api/health` (Diagnostic Health Check):**
   * Detailed system telemetry including server uptime, connection status to MongoDB Atlas Cluster0, and active count of courses and users.

---

## 4. Pre-Flight Go-Live Checklist

- [ ] **DNS & SSL:** Point `thelawkaksha.com` and `www.thelawkaksha.com` to Vercel with automatic Let's Encrypt SSL. Point `api.thelawkaksha.com` to Render.
- [ ] **Database Network Access:** Ensure MongoDB Atlas IP Access List allows Render's outbound IP ranges or `0.0.0.0/0` with strong database user credentials.
- [ ] **Secret Rotation:** Replace temporary local JWT secret with a cryptographically secure 64-character secret in Render environment settings.
- [ ] **Payment Switch:** Switch Razorpay API keys from `rzp_test_...` to live production keys `rzp_live_...`.
- [ ] **Automated Smoke Test:** Execute `npm run check` and `npm run db:restore:test` before deploying each git release tag.

---

## 5. Rollback & Emergency Recovery Protocol

In the event of an unexpected production regression:
1. **Frontend (Vercel):**
   * Go to Vercel Project Dashboard -> **Deployments**.
   * Select previous known-good deployment and click **Instant Rollback**. Rollback takes < 5 seconds.
2. **Backend (Render):**
   * Go to Render Web Service Dashboard -> **Events**.
   * Roll back to previous successful commit or redeploy the `audit-restore-point` tag.
3. **Database Restore:**
   * Run `npm run db:restore:test` on backup snapshot file in `backend/data/backups/`.
   * Re-seed or replay transactions using verified JSON snapshots.

---

## 6. Phase 9 Gate Check

- [x] Liveness (`/healthz`) and Readiness (`/readyz`) probes implemented and verified via automated test suite.
- [x] Complete environment variable specification documented in `.env.example` with zero exposed secrets.
- [x] Production build reproducible via `npm run check` (typecheck + 24 API tests pass).
- [x] Go-live verification checklist and 1-click rollback procedures defined.

**Phase 9 Gate: PASSED.**  
Proceeding immediately to **Phase 10 — Codebase cleanup & dead code removal**.
