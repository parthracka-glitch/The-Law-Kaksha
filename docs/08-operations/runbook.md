# Operations Incident Runbook

> **Document Status:** Verified against server & deployment specifications  
> **Last Verified Date:** 2026-10-05  
> **Commit Hash:** `audit-complete` / `audit/2026-10-05`  
> **Author:** Principal DevOps & SRE Lead  

---

## 1. Quick Reference: Service Health Checks

| Check Type | Target URL | Expected Response | Remediation if Failing |
|---|---|---|---|
| **Liveness** | `https://api.thelawkaksha.com/healthz` | `200 OK` (`{"status":"ok"}`) | Restart Render service; check Node process crash logs |
| **Readiness** | `https://api.thelawkaksha.com/readyz` | `200 OK` (`{"ready":true}`) | Verify DB connection string and fallback state |
| **Deep Telemetry** | `https://api.thelawkaksha.com/api/health` | `200 OK` (JSON diagnostics) | Review database status and heap memory usage |
| **Frontend CDN** | `https://thelawkaksha.com` | `200 OK` (HTML with SSR) | Inspect Vercel deployment status page |

---

## 2. Severity Level Definitions & Incident Cadence

- **P0 - Catastrophic Incident:** Complete outage of payment verification or portal login; data corruption. Response time: **< 15 minutes**.
- **P1 - Critical Incident:** Degradation of 3D reader for a subset of students, single-device conflict self-transfer issues. Response time: **< 1 hour**.
- **P2 - Minor Incident:** Visual artifact, non-critical typography error, slow analytics event dispatch. Response time: **< 24 hours**.

---

## 3. High-Priority Operational Runbooks

### Runbook 1: Production Database Failover (Atlas to Local Store)
1. **Diagnosis:** `GET /readyz` indicates Mongo disconnected; logs show `MongooseServerSelectionError`.
2. **Behavior:** The server automatically engages local transactional JSON fallback (`backend/data/lawkaksha_db.json`).
3. **Action:**
   - Log into MongoDB Atlas Console.
   - Verify cluster status, disk storage quota, and Network Access IP whitelist (`0.0.0.0/0`).
   - If cluster is degraded, maintain local JSON fallback. Transactions are durable on Render persistent disk.
   - Once Atlas recovers, restart backend service to re-establish primary Mongoose connection.

### Runbook 2: Student Payment Succeeded but Access Not Unlocked
1. **Diagnosis:** Candidate paid ₹199 via UPI, but portal did not unlock notes automatically.
2. **Action:**
   - Open Razorpay Dashboard $\to$ Transactions $\to$ Locate payment by candidate email or phone.
   - Verify payment status is `Captured`. Note `payment_id` (e.g., `pay_QWE123456`).
   - Log into The Law Kaksha Admin Portal (`/admin`).
   - Search for student by email.
   - Click "Manually Grant Access" and select target course (`course-ca-foundation-sub`).
   - System will generate roll number, unlock materials, and send confirmation.

### Runbook 3: Cold Start Performance Latency on Render Free Tier
1. **Diagnosis:** First visit after 15 minutes of inactivity takes 45–50s to load dynamic API content.
2. **Mitigation:**
   - Uptime monitor (UptimeRobot / Better Stack) configured to ping `https://api.thelawkaksha.com/healthz` every 5 minutes to keep worker process warm.
   - Alternatively, upgrade Render Web Service to **Starter tier ($7/mo)** to permanently eliminate spin-down.

### Runbook 4: Single-Device Concurrency Reset
1. **Diagnosis:** Candidate replaced broken smartphone and is unable to log in on new hardware.
2. **Action:**
   - Candidate can self-resolve by checking "Transfer session to this device" on `/login`.
   - If unable, Admin navigates to `/admin` $\to$ Students $\to$ Select Candidate $\to$ Click "Reset Hardware Lock".
   - Next login on student device will bind as new primary hardware.
