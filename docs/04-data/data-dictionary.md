# Data Dictionary & PII Classification

**Purpose:** Categorizes application data fields, business semantics, validation constraints, and privacy/PII classifications.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Personally Identifiable Information (PII) Classification Matrix

Under India's Digital Personal Data Protection (DPDP) Act, 2023, data fields are categorized according to sensitivity and privacy impact:

| Field Name | Entity | Data Category | PII Level | Storage Location | Protection Measures |
|---|---|---|---|---|---|
| `name` | User / Sub | Identity | Level 2 (Standard PII) | DB, JWT, Watermark | Accessible to self, admin, and displayed on student watermark. |
| `email` | User / Sub | Contact / Auth | Level 2 (Standard PII) | DB, JWT, Watermark | Lowercased, indexed, used for account lookup and payment receipts. |
| `phone` | User / Sub | Contact | Level 2 (Standard PII) | DB (Optional) | Collected for Razorpay UPI reconciliation; not publicly exposed. |
| `password_hash` | User | Security Credential | Level 3 (Sensitive) | DB only | Salted and hashed via `bcryptjs` (cost 10); never returned in API responses. |
| `activeDeviceId` | User | Telemetry / DRM | Level 1 (Internal) | DB, LocalStorage, JWT | Random UUID; prevents account sharing. |
| `activeDeviceName` | User | Telemetry / Device | Level 1 (Internal) | DB, LocalStorage | Client-reported OS/Browser family. |
| `googleId` | User | Federated Identity | Level 2 (Standard PII) | DB only | External subject ID from Google OAuth 2.0. |
| `amount` | Order / Sub | Financial Record | Level 2 (Financial) | DB, Razorpay | Stored in paise; audit logged for reconciliation. |

---

## 2. Field Definitions & Allowed Values

- `role`: Enum `["student", "admin"]`. Defaults to `"student"`. Grants access to `/api/admin/*` when equal to `"admin"`.
- `accessStatus`: Enum `["Active", "Pending", "Revoked"]`. Controls whether materials linked to a subscription remain readable in the 3D viewer.
- `status` (Product): Enum `["Active", "Draft"]`. Only `"Active"` products appear on the public catalog and checkout modal.
- `type` (Resource): Enum `["notes", "flowchart", "practice", "pyq", "case_study", "ldr", "infographic"]`. Represents the pedagogical classification of academic assets.
