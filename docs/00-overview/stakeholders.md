# Project Stakeholders & Operational Contacts

**Purpose:** Identifies project ownership, operational liaisons, vendor services, and escalation contacts.  
**Status:** Verified against code & git history  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Primary Project Stakeholders

| Role | Entity / Name | Contact Details | Responsibilities |
|---|---|---|---|
| Platform Owner / Founder | Parth Racka (Nirvanaa Studios) | `parthracka@gmail.com` [Verified: git config / commit history] | Overall vision, architectural sign-off, commercial pricing, approval gates |
| Academic / Faculty Lead | The Law Kaksha Academic Team | `support@thelawkaksha.com` [Verified: `frontend/src/app/refund/page.tsx:70`] | Curriculum design, question bank authorship, model answers |
| Grievance & Compliance Officer | Data Protection Officer | `grievance@thelawkaksha.com` [Verified: `frontend/src/app/privacy/page.tsx:82`] | Statutory student grievance handling, DPDP Act compliance |

---

## 2. Infrastructure & External Vendor Services

| Vendor / Provider | Service Provided | Account / Target Scope | Verification Reference |
|---|---|---|---|
| **Vercel** | Next.js Frontend Edge Hosting & CDN | `thelawkaksha.com` / production web app | `package.json:4`, `render.yaml:17` |
| **Render** | Node.js Backend API Web Service | `the-law-kaksha-api` (Oregon Region, Free Tier) | `render.yaml:3-6` |
| **MongoDB Atlas** | Managed Cloud Document Database | `Cluster0` (Primary datastore) | `backend/src/server.js:4`, `render.yaml:20` |
| **Razorpay** | Indian Payment Gateway (UPI, Cards, NetBanking) | Merchant Payment Processing | `backend/src/controllers/paymentController.js:15` |
| **Cloudinary** | Cloud Image & PDF Media Hosting | Note covers and study codices | `backend/src/controllers/materialController.js:20` |
| **Google Cloud Identity** | OAuth 2.0 Single Sign-On | Student authentication | `frontend/.env.local`, `backend/src/controllers/authController.js:150` |
