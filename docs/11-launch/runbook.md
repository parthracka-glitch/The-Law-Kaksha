# Operations Runbook & Incident Protocols

> **Purpose:** Operational procedures for system startup, health monitoring, common failure modes, backups, and emergency rollbacks.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** DevOps Engineer  

---

## 1. Service Health & Monitoring Endpoints

| Endpoint | Method | Expected Status | Purpose | Diagnostic Threshold |
|---|:---:|:---:|---|---|
| `/healthz` | GET | `200 OK` | Liveness Probe | Must respond in < 100ms |
| `/readyz` | GET | `200 OK` | Readiness Probe | Confirms MongoDB Atlas or Local Cache initialized |
| `/api/health` | GET | `200 OK` | Deep Inspection | Returns user counts, course counts, and uptime stats |

---

## 2. Common Operational Incidents & Triage

### Incident A: MongoDB Atlas Disconnection Spike
- **Symptom:** Logs show `[MongoDB] Startup connection error` or `/api/health` returns `mongoConnected: false`.
- **Mitigation:** The application features an automatic local JSON cache fallback (`backend/data/lawkaksha_db.json`). Student authentication and catalog reading continue operating without hard failure.
- **Recovery:** Check MongoDB Atlas Network Access whitelist; ensure `0.0.0.0/0` or the static Render outbound IPs are whitelisted.

### Incident B: Razorpay Signature Mismatch (HTTP 400)
- **Symptom:** Student completes UPI payment, but frontend shows "Payment verification failed".
- **Root Cause:** Incorrect `RAZORPAY_KEY_SECRET` in backend environment, or tampered payload.
- **Triage:**
  1. Verify backend `RAZORPAY_KEY_SECRET` matches Razorpay Dashboard API keys.
  2. Locate order in database (`backend/data/lawkaksha_db.json` or MongoDB `orders`).
  3. If payment ID verified in Razorpay dashboard, manually activate DRM access via Admin Panel (`/admin`).

---

## 3. Database Backup & Restore Runbook

```bash
# 1. Run local backup script
node backend/src/scripts/backup_restore.js backup

# 2. To restore from a specific snapshot timestamp
node backend/src/scripts/backup_restore.js restore 2026-10-05T06-00-00

# 3. For MongoDB Atlas:
# Automated daily snapshots are configured in MongoDB Atlas Backup tab (retention: 7 days).
```
