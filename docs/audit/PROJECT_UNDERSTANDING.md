# Project Understanding: The Law Kaksha

## 1. Product
- **Name:** The Law Kaksha [Verified: `package.json:2`, `frontend/package.json:5`]
- **Purpose:** An educational platform specifically designed for CA Foundation (Paper 2: Business Laws) and CSEET law aspirants. It provides visual, structured learning through video lectures, 3D digital codices/flipbook study notes, revision question banks, practice tests, and academic guidance [Verified: `frontend/src/app/page.tsx`, `frontend/src/components/HeroSection.tsx`, `frontend/src/components/CurriculumSection.tsx`].
- **Problem it solves:** Business law has historically suffered from low retention due to dense, dry statutory language. The platform transforms the law syllabus (Contract Act, Sale of Goods Act, Partnership Act, LLP Act, Companies Act) into visual frameworks, memory anchors, case study analyses, and active recall tests [Verified: `frontend/src/components/SyllabusSection.tsx`, `frontend/src/components/FeaturesSection.tsx`].
- **User Personas:**
  - **Students/Aspirants:** Browse courses, purchase access passes (e.g., ₹199 revision offer), access locked notes in a protected in-browser 3D reader, take tests, review evaluation feedback [Verified: `frontend/src/app/notes/page.tsx`, `frontend/src/app/tests/page.tsx`, `frontend/src/components/EnrollModal.tsx`].
  - **Admins/Faculty:** Upload and manage study materials, review student test submissions, view order history, monitor device activity [Verified: `backend/src/routes/adminRoutes.js`, `backend/src/controllers/adminController.js`].
  - **Staff/Grievance Officers:** Handle technical support and DPDP/refund inquiries [Verified: `frontend/src/app/privacy/page.tsx:81`, `frontend/src/app/refund/page.tsx:70`].

## 2. Business Context
- **Monetization Model:** Direct-to-consumer student enrollment and access passes via Razorpay gateway payments (e.g., ₹199 Smart Revision Question Bank, full Foundation passes) [Verified: `frontend/src/components/EnrollModal.tsx`, `backend/src/controllers/paymentController.js`].
- **Value Delivery:** Instant digital unlocking upon payment confirmation with watermarked in-browser reading to prevent unauthorized material distribution [Verified: `frontend/src/app/refund/page.tsx:40`, `frontend/src/app/privacy/page.tsx:71`].
- **Success Criteria:** Frictionless student onboarding, seamless UPI/Card transactions, zero leakage of digital study codices, stable uptime on Render free tier, and full legal compliance with Indian digital service norms [Assumed based on platform goals; TBD: owner input needed].

## 3. Technical Shape
- **Architecture:** Monorepo architecture with a decoupled Next.js frontend and an Express.js REST API backend [Verified: `package.json`].
- **Frontend:**
  - Next.js 16.3.8 (App Router), React 19.2.4, Tailwind CSS v4, Lucide React, PDF.js (`pdfjs-dist 6.3.289`), Base UI [Verified: `frontend/package.json`].
  - Target: Vercel [Verified: `package.json:4`, `render.yaml:17`].
- **Backend:**
  - Node.js, Express.js 4.21.2, Mongoose 9.10.3 (MongoDB Atlas connection), local JSON database fallback (`backend/data/lawkaksha_db.json`), JWT (`jsonwebtoken 9.0.2`), bcryptjs, Multer, Cloudinary, Razorpay SDK (`razorpay 2.9.8`), Google Auth Library (`google-auth-library 11.1.0`) [Verified: `backend/package.json`, `backend/src/config/db.js`].
  - Target: Render web service (`the-law-kaksha-api`, runtime: `node`, free tier) [Verified: `render.yaml`].
- **Data Stores:**
  - MongoDB Atlas (production primary data store) [Verified: `backend/src/config/db.js`, `render.yaml:20`].
  - Local JSON database fallback (`backend/data/lawkaksha_db.json`) used when `MONGODB_URI` is not configured or fails to connect [Verified: `backend/src/config/db.js`, `backend/src/models/LocalDb.js`].

## 4. Contracts That Must NOT Change
- **Public Routes (Frontend):**
  - `/`, `/curriculum`, `/notes`, `/tests`, `/contact`, `/terms`, `/privacy`, `/refund`, `/auth`, `/admin` [Verified: `frontend/src/app/`].
- **Public API Endpoints (Backend):**
  - Base: `/api`
  - Health check: `GET /api/health` [Verified: `render.yaml:10`, `backend/src/server.js:46`]
  - Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `GET /api/auth/me`, `POST /api/auth/device-reset` [Verified: `backend/src/routes/authRoutes.js`]
  - Materials: `GET /api/materials`, `GET /api/materials/:id` [Verified: `backend/src/routes/materialRoutes.js`]
  - Orders & Payments: `POST /api/payment/create-order`, `POST /api/payment/verify`, `GET /api/orders/my-orders` [Verified: `backend/src/routes/paymentRoutes.js`, `backend/src/routes/orderRoutes.js`]
  - Admin: `/api/admin/*` [Verified: `backend/src/routes/adminRoutes.js`]
- **Database Schema Models & Collections:**
  - `User`: `name`, `email`, `passwordHash`, `googleId`, `role`, `activeDeviceId`, `activeDeviceName`, `unlockedItemIds`, `created_at` [Verified: `backend/src/models/User.js`, `backend/data/lawkaksha_db.json`]
  - `Material`: `title`, `description`, `category`, `type`, `fileUrl`, `isFree`, `price`, `coverImage` [Verified: `backend/src/models/Material.js`]
  - `Order`: `userId`, `orderId`, `paymentId`, `amount`, `currency`, `status`, `itemIds` [Verified: `backend/src/models/Order.js`]
  - `TestSubmission`: `userId`, `testId`, `answers`, `score`, `feedback` [Verified: `backend/src/models/TestSubmission.js`]
- **Environment Variable Names:**
  - Backend: `NODE_ENV`, `PORT`, `FRONTEND_URL`, `MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` [Verified: `render.yaml`, `backend/.env.example`]
  - Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` [Verified: `frontend/.env.example`, `frontend/.env.local`]

## 5. Constraints
- **Session/Device Restriction:** Single active device session enforcement per student to mitigate credential sharing [Verified: `backend/src/middleware/authMiddleware.js:35`, `backend/src/controllers/authController.js`].
- **Hosting Tier Limits:** Backend is hosted on Render Free tier which spins down after 15 minutes of inactivity; cold starts can take ~50 seconds [Verified: `render.yaml:5`].
- **Compliance Requirements:** Digital Personal Data Protection Act (DPDP) 2023 readiness, IT Act 2000 compliance for digital content delivery, Razorpay merchant compliance for Indian payment processing [Verified: `frontend/src/app/terms/page.tsx`, `frontend/src/app/privacy/page.tsx`].
- **Region/Target Audience:** India (students taking ICAI CA Foundation & CSEET exams) [Verified: `frontend/src/components/SyllabusSection.tsx`].
- **Deadlines & Budgets:** Unknown [TBD: owner input needed].

## 6. Off-Limits Areas
- Third-party packages and runtime directories: `node_modules/`, `frontend/node_modules/`, `backend/node_modules/` [Verified: `.gitignore`].
- Next.js build caches: `.next/`, `frontend/.next/`, `out/`, `build/` [Verified: `.gitignore`].
- Secrets and local environment files: `.env`, `.env.local`, `frontend/.env.local`, `backend/.env` [Verified: `.gitignore`].
- Proprietary PDF study materials in root: `/*.pdf` [Verified: `.gitignore:50`].
- Agent private security notes: `docs/audit/private/*` [Verified: `.gitignore:53`].

## 7. Confidence Summary
- **Verified (High Confidence):** Repository structure, Next.js 16 / Express stack, API route paths, database schemas and local fallback mechanism, Razorpay payment flows, Render deployment spec.
- **Assumed (Medium Confidence):** Business launch deadlines, exact pricing tiers, intended scale and traffic volume.
- **Unknown (Needs Owner Confirmation):** Production MongoDB Atlas connection URI, exact launch date, policies on free-tier agent training permissions.
