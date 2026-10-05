# Component Inventory & Module Architecture

**Purpose:** Detailed decomposition of application components, responsibilities, dependencies, and internal interfaces.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Frontend Subsystem Components (`frontend/src/`)

### Application Shell & Layout
- **`app/layout.tsx`:** Root layout configuring fonts (Outfit, Playfair Display), metadata, OpenGraph tags, and context providers.
- **`app/globals.css`:** Core styling tokens, Tailwind CSS v4 directives, and paper/canvas rendering variables.
- **`components/Navbar.tsx`:** Sticky navigation bar containing curriculum links, auth modals trigger, and active student session indicator.
- **`components/Footer.tsx`:** Comprehensive statutory footer with links to Terms, Privacy, Refund, and Grievance redressal.

### Pedagogical Presentation Components
- **`components/HeroSection.tsx`:** High-impact value proposition header with CTA buttons ("Enroll Now", "View Curriculum").
- **`components/SyllabusSection.tsx`:** Expandable accordion system for the 6 core commercial law acts with marks weighting and topic breakdowns.
- **`components/Section16ComparisonBlock.tsx`:** Interactive before-and-after answer writing comparison block focusing on Section 16 (Caveat Emptor).
- **`components/FeaturesSection.tsx`:** Core capability cards detailing 3D codices, single-device DRM, and structured revisions.

### Modals & Interactive Contexts
- **`components/EnrollModal.tsx`:** Course pass selection modal with Razorpay checkout orchestration.
- **`components/AuthModal.tsx`:** Tabbed Login/Register interface with Email/Password and Google OAuth triggers.
- **`components/DeviceResetModal.tsx`:** Modal prompting student confirmation to reset active hardware binding upon 409 Conflict.
- **`context/DeviceSessionContext.tsx`:** Client-side hardware device ID generator (`getOrCreateDeviceId`) and state synchronization hook.

---

## 2. Backend Subsystem Components (`backend/src/`)

### Controllers & Business Logic
- **`controllers/authController.js`:** User registration, password hashing (`bcryptjs`), login, Google OAuth verification, device resets, JWT signing.
- **`controllers/paymentController.js`:** Razorpay order generation (`create-order`), HMAC SHA-256 signature verification (`verify`), entitlement granting.
- **`controllers/catalogController.js`:** Public catalog querying, course metadata retrieval, preview materials streaming.
- **`controllers/adminController.js`:** File uploads to Cloudinary via Multer, student submission evaluation, order audit logs.
- **`controllers/studentController.js`:** Student study desk dashboard, enrolled courses query, test answers submission.

### Middlewares & Cross-Cutting Concerns
- **`middleware/authMiddleware.js`:** Verifies incoming `Authorization: Bearer <token>` and enforces `token.deviceId === user.activeDeviceId`.
- **`middleware/adminMiddleware.js`:** Guards admin routes by verifying `user.role === 'admin'`.
- **`middleware/uploadMiddleware.js`:** Configures Multer memory storage and file type validation (PDFs and image files only).

### Persistence & Data Access
- **`db/mongo.js`:** Mongoose connection manager with reconnection backoff.
- **`db/database.js` / `models/LocalDb.js`:** Transactional JSON file database engine (`backend/data/lawkaksha_db.json`).
- **`db/seed.js` & `db/mongoSeed.js`:** Idempotent database seeder provisioning initial curriculum modules and demo student/admin users.
