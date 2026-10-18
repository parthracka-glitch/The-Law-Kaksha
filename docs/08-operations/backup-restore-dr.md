# Database Backup, Restoration & Disaster Recovery (DR)

> **Document Status:** Verified against script code  
> **Last Verified Date:** 2026-10-05  
> **Commit Hash:** `audit-complete` / `audit/2026-10-05`  
> **Author:** Principal DevOps & Data Engineer  

---

## 1. Backup Strategy & Cadence

The Law Kaksha maintains a dual-database architecture:
1. **Primary Database:** MongoDB Atlas (Cloud)
2. **Fallback Database:** Transactional Local JSON (`backend/data/lawkaksha_db.json`)

### Automated Backup Scripts (`backend/scripts/`)
- **`npm run db:backup` (`backend/scripts/backup-db.js`):** Generates timestamped snapshots of database collections into `backend/backups/`.
- **`npm run db:restore:test` (`backend/scripts/test-restore.js`):** Verifies snapshot integrity by loading backup archives into an ephemeral memory store and confirming record counts.

```
Cadence:
- Continuous: MongoDB Atlas Cloud Snapshots (automated by MongoDB Atlas, 6-hour intervals)
- Daily Pre-Deploy: Local JSON snapshot written before any schema or seeder modification
- Monthly DR Drill: Simulated restoration to test environment
```

---

## 2. Point-in-Time Restoration Procedure

### Scenario A: Local JSON Store Restoration
If `lawkaksha_db.json` becomes corrupted or requires rolling back to a previous state:

1. Stop the active backend instance:
   ```bash
   # Render: Suspend service temporarily
   # Local: Terminate node process
   ```
2. Identify target backup snapshot in `backend/backups/`:
   ```bash
   ls -la backend/backups/
   # Example: snapshot-2026-10-05T07-56-00.json
   ```
3. Copy snapshot to active database path:
   ```bash
   cp backend/backups/snapshot-2026-10-05T07-56-00.json backend/data/lawkaksha_db.json
   ```
4. Run validation test:
   ```bash
   npm run db:restore:test --prefix backend
   ```
5. Restart backend service and verify `/readyz`.

### Scenario B: MongoDB Atlas Cloud Restoration
1. Access MongoDB Atlas Cloud Console $\to$ Cluster `Cluster0` $\to$ **Backup**.
2. Select desired restore snapshot.
3. Select **Restore to a New Cluster** or **Restore in-place**.
4. If restoring to a new cluster, update `MONGODB_URI` environment variable in Render dashboard and trigger deploy.

---

## 3. Disaster Recovery Objectives (RPO & RTO)

| Metric | Target | Rationale |
|---|---|---|
| **Recovery Point Objective (RPO)** | $\le 1$ hour | Maximum permissible student purchase data loss in disaster event. Razorpay payment records serve as authoritative secondary ledger for zero financial data loss. |
| **Recovery Time Objective (RTO)** | $\le 15$ minutes | Time to fail over between Atlas and local JSON database or redeploy backend instance. |

---

## 4. Financial Reconciliation as DR Safeguard

In any catastrophic data event, all student purchases are immutably logged on the **Razorpay Dashboard**:
- Each transaction has a permanent `razorpay_payment_id` and student email.
- The platform includes an administrative reconciliation tool to reconstitute student account passes directly from Razorpay payment export CSVs.
