# Data Lifecycle & Retention Policy

**Purpose:** Defines data retention horizons, archival strategies, deletion protocols, and backup mechanisms.  
**Status:** Verified against code & DPDP Act compliance  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Data Creation, Modification & Archival Lifecycle

| Data Type | Ingestion Trigger | Modification Rules | Retention Horizon | Disposal / Purge Protocol |
|---|---|---|---|---|
| **Student Profiles (`User`)** | Student registers via email or Google SSO | Mutable: name, target exam, active device resets | Active account lifetime + 3 years post-exam | Hard delete upon verified DPDP erasure request via grievance email. |
| **Orders & Subscriptions** | Generated via Razorpay checkout confirmation | Immutable once marked `PAID` | 7 years (Statutory requirement for Indian taxation and GST records) | Read-only archival storage; financial records cannot be deleted prematurely. |
| **Study Codices (`Product`/`Resource`)** | Uploaded by Admin via Cloudinary pipeline | Versioned / Published / Draft updates | Maintained until curriculum deprecation by ICAI/ICSI | Unlinked from catalog; old files archived in Cloudinary storage tier. |
| **Active Session Telemetry** | Updated on every authenticated request (`lastActiveAt`) | Overwritten on each login or device reset | Real-time state only | Inactive device tokens expire after 7 days via JWT validity window. |

---

## 2. Backup & Disaster Recovery Architecture

- **Automated Backup Script:** `backend/src/scripts/backup_restore.js` provides snapshot utilities (`npm run db:backup` / `npm run db:restore:test`) [Verified: `backend/package.json:10-11`].
- **Local Fallback DB:** `backend/data/lawkaksha_db.json` provides continuous localized snapshots during execution.
- **MongoDB Atlas Snapshots:** Cloud backups configured via Atlas automated continuous backup snapshots.
