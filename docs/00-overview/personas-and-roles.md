# Personas, User Types & Permissions Matrix

**Purpose:** Enumerates primary user personas, their interaction workflows, and system access boundaries.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. User Personas

### Persona A: CA Foundation / CSEET Aspirant (The Student)
- **Profile:** Student preparing for ICAI CA Foundation Paper 2 (Business Laws) or ICSI CSEET examinations in India [Verified: `frontend/src/components/CurriculumSection.tsx:12`].
- **Key Goals:**
  - Understand complex statutory provisions and real case laws with visual clarity.
  - Practice structured answer-writing for subjective examination questions.
  - Access study materials on mobile or desktop without friction.
- **Pain Points:** Rote memorization failure, dense institute study modules, confusing exceptions.
- **Actions in Platform:** Browse catalog, register with email/password or Google OAuth, complete Razorpay checkout, read protected 3D codices in web reader, review progress [Verified: `frontend/src/app/`, `backend/src/routes/studentRoutes.js`].

### Persona B: Academy Administrator / Lead Faculty (The Admin)
- **Profile:** Academy instructor or operations manager managing course delivery and digital assets [Verified: `backend/src/routes/adminRoutes.js`].
- **Key Goals:**
  - Upload notes, question banks, and syllabus updates with Cloudinary media storage.
  - Review student answer submissions and assign evaluative scores and feedback.
  - Oversee order verification, transactions, and student device binding exceptions.
- **Actions in Platform:** Access `/admin` route with admin JWT token, upload study materials via Multer/Cloudinary, trigger backup scripts, manage catalog items [Verified: `backend/src/controllers/adminController.js`].

### Persona C: Unauthenticated Visitor / Prospective Student (The Guest)
- **Profile:** Aspirant exploring the platform via direct referral or search discovery.
- **Key Goals:**
  - View syllabus modules, sample Section 16 case-study comparisons, and pricing passes.
  - Inspect sample notes and trust markers before initiating purchase.
- **Actions in Platform:** View landing page, test public API endpoints (`/api/catalog`, `/api/public/*`), initiate sign-up or checkout modal [Verified: `backend/src/routes/catalogRoutes.js`].

---

## 2. Roles & Permissions Matrix

| Resource / Capability | Guest (Public) | Student (Authenticated) | Administrator | Code Verification Reference |
|---|---|---|---|---|
| View landing page & syllabus | Allowed | Allowed | Allowed | `frontend/src/app/page.tsx` |
| View public catalog & sample previews | Allowed | Allowed | Allowed | `backend/src/routes/catalogRoutes.js:10` |
| Register & Login (Email/Password & Google) | Allowed | Allowed | Allowed | `backend/src/routes/authRoutes.js:15-30` |
| Read free study materials | Denied (Prompts login) | Allowed | Allowed | `backend/src/routes/materialRoutes.js:22` |
| Purchase course access pass (Razorpay) | Denied (Prompts login) | Allowed | Allowed | `backend/src/routes/paymentRoutes.js:12` |
| Read locked codices in 3D Reader | Denied | Allowed (if item in `unlockedItemIds`) | Allowed | `backend/src/controllers/materialController.js:45` |
| Single-device DRM binding check | N/A | Enforced on every request | Bypassed / Monitored | `backend/src/middleware/authMiddleware.js:35` |
| Reset active device binding | Denied | Allowed via `/api/auth/device-reset` | Allowed | `backend/src/controllers/authController.js:112` |
| Upload new course material / PDF | Denied | Denied (403 Forbidden) | Allowed | `backend/src/middleware/adminMiddleware.js:10` |
| View student order history across all users | Denied | Denied (Self only) | Allowed | `backend/src/routes/adminRoutes.js:35` |
| Trigger database backup / restore script | Denied | Denied | Allowed | `backend/src/scripts/backup_restore.js` |
