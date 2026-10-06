# Project Understanding: The Law Kaksha

## 1. Product
- **Name:** The Law Kaksha [Verified: `package.json:2`, `frontend/package.json:5`]
- **Purpose:** An educational platform specifically designed for CA Foundation (Paper 2: Business Laws) and CSEET law aspirants. It provides visual, structured learning through video lectures, 3D digital codices/flipbook study notes, revision question banks, practice tests, and academic guidance [Verified: `frontend/src/app/page.tsx`, `frontend/src/components/HeroSection.tsx`, `frontend/src/components/CurriculumSection.tsx`].
- **Problem it solves:** Business law has historically suffered from low retention due to dense, dry statutory language. The platform transforms the law syllabus (Contract Act, Sale of Goods Act, Partnership Act, LLP Act, Companies Act) into visual frameworks, memory anchors, case study analyses, and active recall tests [Verified: `frontend/src/components/SyllabusSection.tsx`, `frontend/src/components/FeaturesSection.tsx`].
- **User Personas:**
  - **Students/Aspirants (Customers):** Browse courses, purchase monthly subscriptions (Launch Offer ₹99/month) or digital crash codices via Razorpay, access locked notes in a protected in-browser DRM reader with single-device enforcement, attempt chapter quizzes, track learning analytics [Verified: `frontend/src/app/student/page.tsx`, `frontend/src/app/reader/page.tsx`, `frontend/src/app/checkout/page.tsx`].
  - **Admins/Faculty:** Manage course curricula, create and edit digital codex materials (with cover thumbnails, categories, status), review enrolled students, manage subscription lifecycles, inspect device security logs, monitor orders [Verified: `frontend/src/app/admin/page.tsx`, `backend/src/routes/adminRoutes.js`, `backend/src/controllers/adminController.js`].
  - **Staff/Grievance Officers:** Handle academic inquiries, customer support, and DPDP/refund requests [Verified: `frontend/src/app/privacy/page.tsx`, `frontend/src/app/refund/page.tsx`, `frontend/src/app/contact/page.tsx`].

## 2. Business Context
- **Monetization Model:** Direct-to-consumer student enrollment and access passes via Razorpay gateway payments:
  - CA Foundation Business Laws monthly access (Launch Offer ₹99/month, standard ₹299)
  - CSEET Business Law & Management monthly access (Launch Offer ₹99/month, standard ₹299)
  - Individual digital codex purchases (e.g., CA Foundation Contract Act Crash Codex) [Verified: `backend/src/db/seed.js`, `backend/src/routes/catalogRoutes.js`].
- **Value Delivery:** Instant digital unlocking upon payment confirmation with watermarked in-browser reading and hardware device fingerprinting to prevent unauthorized material distribution [Verified: `frontend/src/app/refund/page.tsx`, `frontend/src/app/reader/page.tsx`, `backend/src/controllers/orderController.js`].
- **Success Criteria:** Frictionless student onboarding, seamless UPI/Card transactions, zero leakage of digital study codices, stable uptime, and full legal compliance with Indian digital service norms (DPDP Act 2023) [Verified against platform design and test suites].

## 3. Technical Shape
- **Architecture:** Monorepo architecture with a decoupled Next.js frontend (Vercel target) and an Express.js REST API backend (Render target) [Verified: `package.json`].
- **Frontend:**
  - Next.js 16.3.8 (App Router), React 19.2.4, Tailwind CSS v4, Lucide React, PDF.js (`pdfjs-dist 6.3.289`), Base UI [Verified: `frontend/package.json`].
  - Target: Vercel [Verified: `package.json:4`, `render.yaml:17`].
- **Backend:**
  - Node.js, Express.js 4.21.2, Mongoose 9.10.3 (MongoDB Atlas connection), local JSON database fallback (`backend/data/lawkaksha_db.json`), JWT (`jsonwebtoken 9.0.2`), bcryptjs, Multer, Cloudinary, Razorpay SDK (`razorpay 2.9.8`), Google Auth Library (`google-auth-library 11.1.0`) [Verified: `backend/package.json`, `backend/src/db/database.js`, `backend/src/db/mongo.js`].
  - Target: Render web service (`the-law-kaksha-api`, runtime: `node`) [Verified: `render.yaml`].
- **Data Stores:**
  - MongoDB Atlas (Cluster0 wt67jkf.mongodb.net) [Verified: `backend/.env`, `backend/src/db/mongo.js`].
  - Local JSON database fallback (`backend/data/lawkaksha_db.json`) used seamlessly when offline or when Atlas connectivity is partitioned [Verified: `backend/src/db/database.js`].

## 4. Contracts That Must NOT Change
- **Public Routes (Frontend):**
  - `/`, `/about`, `/admin`, `/cart`, `/checkout`, `/contact`, `/cookies`, `/courses`, `/login`, `/privacy`, `/product/[id]`, `/reader`, `/refund`, `/register`, `/reviews`, `/robots.txt`, `/sitemap.xml`, `/student`, `/students`, `/terms` [Verified: `frontend/src/app/`].
- **Public API Endpoints (Backend):**
  - Health & Probes: `GET /api/health`, `GET /healthz`, `GET /readyz` [Verified: `backend/src/server.js`]
  - Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/google`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `POST /api/auth/device-heartbeat` [Verified: `backend/src/routes/authRoutes.js`]
  - Catalog: `GET /api/catalog`, `GET /api/public/site-data`, `GET /api/public/section16-comparison` [Verified: `backend/src/routes/catalogRoutes.js`]
  - Content & DRM: `GET /api/content/course/:courseId`, `GET /api/content/pdf/:id` [Verified: `backend/src/routes/contentRoutes.js`]
  - Quizzes: `GET /api/quizzes`, `GET /api/quizzes/:id`, `POST /api/quizzes/:id/submit`, `GET /api/quizzes/admin/attempts` [Verified: `backend/src/routes/quizRoutes.js`]
  - Orders & Payments: `POST /api/orders/create`, `POST /api/orders/verify`, `GET /api/orders/:id`, `POST /api/verify-payment`, `POST /api/create-order` [Verified: `backend/src/routes/orderRoutes.js`]
  - Student Portal: `GET /api/student/dashboard`, `POST /api/student/update-profile` [Verified: `backend/src/routes/studentRoutes.js`]
  - Admin: `GET /api/admin/products`, `POST /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`, `GET /api/admin/students`, `PUT /api/admin/students/:id`, `GET /api/admin/subscriptions`, `PUT /api/admin/subscriptions/:id` [Verified: `backend/src/routes/adminRoutes.js`]
- **Database Schema Models & Collections:**
  - `users`: `id`, `student_id`, `name`, `email`, `phone`, `password_hash`, `role`, `selectedCourse`, `target_exam`, `is_active`, `drm_access`, `activeDeviceId`, `activeDeviceName`, `lastActiveAt`, `enrolled_books`, `unlockedItemIds`, `tokenVersion` [Verified: `backend/src/models/User.js`, `backend/data/lawkaksha_db.json`]
  - `courses`: `id`, `title`, `fullTitle`, `description`, `price`, `originalPrice`, `offerLabel`, `examBody`, `status` [Verified: `backend/src/models/Course.js`]
  - `acts`: `id`, `courseId`, `chapterNumber`, `title`, `description`, `order` [Verified: `backend/src/models/Act.js`]
  - `orders`: `id`, `orderId`, `userEmail`, `studentId`, `amount`, `currency`, `status`, `items`, `paymentId`, `created_at` [Verified: `backend/src/models/Order.js`]
  - `subscriptions`: `id`, `userId`, `studentId`, `courseId`, `status`, `validUntil`, `billingCycle` [Verified: `backend/src/models/Subscription.js`]
- **Environment Variable Names:**
  - Backend: `PORT`, `NODE_ENV`, `FRONTEND_URL`, `JWT_SECRET`, `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` [Verified: `backend/.env.example`, `backend/.env`]
  - Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` [Verified: `frontend/.env.example`, `frontend/.env.local`]

## 5. Constraints
- **Session/Device Restriction:** Single active device session enforcement per student to mitigate credential sharing [Verified: `backend/src/middleware/authMiddleware.js`, `backend/src/controllers/authController.js`].
- **Hosting Tier Limits:** Backend is configured for Render Web Service deployment; Frontend for Vercel [Verified: `render.yaml`].
- **Compliance Requirements:** Digital Personal Data Protection Act (DPDP) 2023 readiness, IT Act 2000 compliance for digital content delivery, Razorpay merchant compliance for Indian payment processing [Verified: `frontend/src/app/terms/page.tsx`, `frontend/src/app/privacy/page.tsx`, `docs/10-legal/`].
- **Region/Target Audience:** India (students taking ICAI CA Foundation & CSEET exams; pricing in INR ₹) [Verified: `frontend/src/components/SyllabusSection.tsx`].

## 6. Off-Limits Areas
- Third-party packages and runtime directories: `node_modules/`, `frontend/node_modules/`, `backend/node_modules/` [Verified: `.gitignore`].
- Next.js build caches: `.next/`, `frontend/.next/`, `out/`, `build/` [Verified: `.gitignore`].
- Secrets and local environment files: `.env`, `.env.local`, `frontend/.env.local`, `backend/.env` [Verified: `.gitignore`].
- Proprietary PDF study materials in root: `/*.pdf` [Verified: `.gitignore`].
- Agent private security notes: `docs/audit/private/*` [Verified: `.gitignore`].

## 7. Confidence Summary
- **Verified (High Confidence):** Repository structure, Next.js 16 / Express stack, API route paths, database schemas and local fallback mechanism, Razorpay payment flows, Render deployment spec, test suite of 39 automated integration tests.
- **Assumed (Medium Confidence):** Business launch deadlines, exact marketing campaign launch dates, scale assumptions.
- **Unknown (Needs Owner Confirmation):** Exact legal entity name registration specifics, grievance officer appointed name and physical address for DPDP compliance.
