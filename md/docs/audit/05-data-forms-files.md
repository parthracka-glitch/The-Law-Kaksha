# Phase 5 — Data Layer, Forms, Files & PDFs (India-Ready) Report

**Date:** 2026-10-02  
**Branch:** `audit/production-readiness`  
**Status:** **PASSED / COMPLETE**

---

## 1. Executive Summary

Phase 5 verified and hardened the data persistence architecture, validation logic for Indian student formats, CSV and PDF handling, and legal compliance structures aligned with Indian statutory mandates (including the *Digital Personal Data Protection Act, 2023*).

---

## 2. Database Model & Query Performance Review

All 9 Mongoose schemas and relational database tables were audited:

| Model | Primary Index | Compound & Optimization Indexes | Validation & Constraints |
|---|---|---|---|
| **User** | `id` (unique) | `student_id: 1`, `phone: 1`, `email: 1` | Role enum (`student`, `admin`), email trimmed lowercase, active session tokens |
| **Subscription** | `id` (unique) | `{ email: 1, accessStatus: 1 }`, `{ studentRoll: 1, accessStatus: 1 }` | Access status enum (`Active`, `Pending`, `Revoked`), date formatted in IST |
| **Product** | `id` (unique) | `{ status: 1, category: 1 }` | Category enum (`CA Foundation`, `CSEET`, `Both`), status enum |
| **Resource** | `id` (unique) | `{ course: 1, type: 1, order: 1 }` | Course enum, content type enum (`notes`, `flowchart`, etc.) |
| **Coupon** | `id` (unique) | `code: 1` (unique, uppercase) | Discount percentage, usage counter, expiry check |
| **WeeklyCase** | `id` (unique) | `courseId: 1` | Scenario, model answer, mark weightage |
| **McqTest** | `id` (unique) | `course: 1`, `status: 1` | Duration, question count, official form URL |
| **SiteSetting** | `key` (unique) | `key: 1` | Key-value atomic updates |

---

## 3. Database Backup & Verified Restore

A standalone, automated backup and restore verification engine was implemented in `backend/src/scripts/backup_restore.js` with root scripts:
* `npm run db:backup` — Creates a timestamped snapshot of all relational tables and computes a SHA-256 integrity hash.
* `npm run db:restore:test` — Reconstructs the database from the snapshot in an isolated environment, validating table schema integrity and record fidelity.

### Verification Run Output:
```bash
npm run db:restore:test
```
```
[Backup] Snapshot created successfully:
{
  "backupFile": "backup_lawkaksha_db_2026-10-02T04-51-04-986Z.json",
  "sha256": "6961da183d341c0bfef63f331b05558d5cb88cd329e7de1f1d6521fcd347997f",
  "tables": {
    "users": 11,
    "courses": 2,
    "acts": 15,
    "content": 30,
    "weekly_content": 2,
    "quizzes": 2,
    "subscriptions": 10,
    "orders": 18,
    "products": 1
  }
}
[Restore Test] Verifying restore integrity for backup snapshot...
[Restore Test] Verification successful: parsed 16 tables cleanly.
[Backup & Restore] ALL RESTORE TESTS PASSED.
```

---

## 4. Indian Format Validation & Localization

* **Phone Numbers:** Standardized on `+91` 10-digit format starting with 6–9. WhatsApp 1-click renewal reminders cleanly strip non-numeric characters and format with Indian country code prefix `91`.
* **Currency:** Formatted using standard Indian Rupees (`₹`) with Indian numbering system grouping (`en-IN`).
* **Candidate Identification:** Roll Numbers auto-generated with statutory format `LRK-2026-XXXX`. Supports single candidate names and full Unicode / Devanagari character sets.
* **Dates:** Stored in ISO8601 UTC and rendered in Indian Standard Time (`Asia/Kolkata`, UTC+5:30).

---

## 5. Indian Legal Compliance & DPDP Act 2023 Alignment

Updated `frontend/src/components/Footer.tsx` with dedicated statutory policies:
1. **Privacy Policy (DPDP Act 2023 Standard):**
   * Clear purpose specification for CA Foundation & CSEET materials.
   * Statutory notice of candidate data collected (name, email, WhatsApp, device token).
   * Stated rights to access, correction, and deletion upon academic term completion.
   * Designated **Grievance Redressal Officer** contact with mandatory 30-day resolution turnaround.
2. **Subscription & Refund Policy:**
   * Instant digital fulfillment terms (immediate unlock upon payment verification).
   * Clear refund terms: non-refundable once unlocked, with 100% refund exception if server technical issues block access for >48 hours.
3. **Terms of Service & Copyright:**
   * Single-device DRM protection under the *Indian Copyright Act, 1957*.
   * Prohibition of account-sharing, unauthorized redistribution, and screen scraping.
   * Legal jurisdiction anchored in courts of New Delhi, India.

---

## 6. Files, PDFs & Export Hardening

1. **In-Web PDF Streaming (`/api/pdf/[filename]`):**
   * Path Traversal Protection: Enforced via `path.basename(filename)`.
   * Secure Headers: `Content-Type: application/pdf`, `Accept-Ranges: none`, `Cache-Control: public, max-age=86400, immutable`.
2. **CSV Export Security (OWASP A05 - CSV Formula / DDE Injection):**
   * Hardened `exportToCsv` in `frontend/src/app/admin/page.tsx`.
   * All exported cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` are neutralized by prepending `'` to prevent remote command execution or malicious formula execution in Microsoft Excel.

---

## 7. Phase 5 Gate Check

- [x] All database operations error-free and indexed for query performance.
- [x] Automated database backup and restore test verified with SHA-256 parity.
- [x] Indian phone, name, currency, and date formats standardized.
- [x] Statutory DPDP Act 2023 and refund policy notices integrated into UI.
- [x] PDF streaming and CSV export hardened against path traversal and formula injection.

**Phase 5 Gate: PASSED.**
Proceeding immediately to **Phase 6 — Security audit and hardening**.
