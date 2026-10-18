# 01. Project Architecture & System Overview

---

## 1. What the Project Does (Simple Summary)

**The Law Kaksha** is an online learning platform built for Indian students preparing for professional corporate law examinations:
- **CA Foundation Paper 2: Business Laws** (under ICAI New Scheme): Covers 7 legal acts, including The Indian Regulatory Framework, The Indian Contract Act 1872, The Sale of Goods Act 1930, The Indian Partnership Act 1932, The Limited Liability Partnership Act 2008, The Companies Act 2013, and The Negotiable Instruments Act 1881.
- **CSEET Paper 2: Business Communication, Legal Aptitude & Business Management** (under ICSI Scheme): Covers commercial laws, business environment, corporate governance, and general management principles.

The platform provides:
1. **Interactive Course Previews & Free Sample Notes:** Public visitors can browse chapter outlines, read sample PDF pages with an in-browser viewer, and inspect landmark case law comparisons.
2. **E-Commerce & Digital Study Passes:** Students can purchase 30-day or full-term study passes via Razorpay (UPI, Cards, NetBanking), apply discount coupons, and get instant access.
3. **Protected Digital Reader (DRM):** Students read study material in a canvas-rendered reader that prevents downloading, right-clicking, and text copying, watermarked with their Student ID and phone number.
4. **Gamified Student Dashboard:** Tracks daily study streaks, awards **LawXP** points for completed units, shows daily Question of the Day (QOTD), and displays countdown clocks to the upcoming ICAI/ICSI exam dates.
5. **Administrative Console:** A control center where platform owners upload new notes, publish case studies, track student orders, toggle DRM access on or off, issue discount coupons, and post live broadcast messages to the website.

---

## 2. Technology Stack

### A. Frontend (Client-Side)
- **Framework:** Next.js 16.1.6 (React 19, TypeScript).
- **Styling:** Tailwind CSS v4 with custom warm paper & navy corporate aesthetic (`#F7F7F5`, `#221D1D`, `#AED7E9`, `#4B8097`).
- **Icons:** `lucide-react` (comprehensive vector icon set).
- **PDF Viewing:** Custom HTML5 Canvas renderer (`frontend/src/components/SecurePdfReader.tsx`) with PDF.js (`pdfjs-dist`) for DRM-safe in-browser rendering.
- **Hosting Target:** Vercel (Production URL: `https://the-law-kaksha.vercel.app` / `https://lawkaksha.in`).

### B. Backend (Server-Side)
- **Framework:** Express.js (Node.js runtime).
- **Architecture:** RESTful API with route-level modular controllers, middleware authentication, and centralized error handling.
- **Security Middleware:** Custom sliding-window rate limiters, NoSQL injection sanitizers (`sanitizePayload`), helmet-style HTTP security headers, and strict CORS whitelists.
- **Hosting Target:** Render (Production URL: `https://the-law-kaksha.onrender.com`).

### C. Database Layer (Dual Fault-Tolerant Engine)
- **Primary Database:** MongoDB Atlas (Cloud Cluster0, Mongoose ODM).
- **Fault-Tolerant Local Fallback:** Self-contained JSON Database (`backend/data/lawkaksha_db.json`) driven by `backend/src/db/database.js`. If MongoDB Atlas is unreachable or the network drops, the backend automatically serves and saves records to the local JSON store without crashing.
- **Automatic Seeding:** `backend/src/db/seed.js` and `backend/src/db/mongoSeed.js` automatically populate initial courses, demo users, sample study resources, and exam settings upon cold startup.

### D. Authentication & Session Security
- **Token Format:** JSON Web Tokens (JWT) signed with HMAC-SHA256 (`JWT_SECRET`).
- **Password Security:** Salted hashing with `bcryptjs` (minimum 10 salt rounds).
- **Single-Device Session Lock:** Student accounts track `activeDeviceId` and `activeSessionToken`. If a student logs in on a second mobile phone or laptop while an active session exists, the backend blocks the second device with a `409 DEVICE_CONFLICT` status code unless the student chooses to force-logout the previous device.
- **Token Revocation:** `tokenVersion` counter on user records. When a user changes their password or an admin revokes access, `tokenVersion` increments, immediately invalidating old tokens across all devices.

### E. Third-Party Integrations & External Services
- **Payment Gateway:** Razorpay API (`razorpay` Node SDK) for order creation and HMAC-SHA256 signature verification upon payment completion.
- **Cloud Media Storage:** Cloudinary (`cloudinary` Node SDK) for storing uploaded PDF codex files, book covers, and banners.
- **Google Sign-In:** Google Identity Services (GSI OAuth 2.0) via `@react-oauth/google` and client ID token verification.
- **Automated Communication:** WhatsApp Direct Chat deep links (`https://wa.me/...`) for instant payment receipts and expiring subscription renewal notices.

---

## 3. Directory Structure & Folder Purpose

```
The-Law-Kaksha-main/
│
├── .agents/                        # AI agent memory, instructions, and workspace protocols
├── .github/workflows/              # Automated CI/CD pipelines (test, lint, build)
├── AUDIT/                          # Exhaustive software audit reports and QA reviews (this folder)
│
├── backend/                        # Node.js + Express.js API Server
│   ├── data/                       # Local offline storage
│   │   └── lawkaksha_db.json       # JSON file used as zero-crash offline database fallback
│   ├── src/
│   │   ├── db/                     # Database connection engines
│   │   │   ├── database.js         # In-memory + JSON file table abstraction
│   │   │   ├── mongo.js            # MongoDB Atlas connection manager & reconnection logic
│   │   │   ├── mongoSeed.js        # Initial data populator for MongoDB Atlas
│   │   │   └── seed.js             # Initial data populator for local JSON database
│   │   ├── middleware/             # Express request interceptors
│   │   │   └── authMiddleware.js   # JWT authentication, student session check, and admin gatekeeper
│   │   ├── models/                 # 21 Mongoose schema definitions (Users, Orders, Products, etc.)
│   │   ├── routes/                 # 7 Modular REST API Route Handlers
│   │   │   ├── adminRoutes.js      # All administrative endpoints (CRUD, analytics, uploads, P&L)
│   │   │   ├── authRoutes.js       # Register, login, single-device lock, logout, Google OAuth
│   │   │   ├── catalogRoutes.js    # Public site data, courses, acts, sample resources
│   │   │   ├── contentRoutes.js    # Protected content DRM gate check and student reviews
│   │   │   ├── orderRoutes.js      # Razorpay order generation & cryptographic payment verification
│   │   │   ├── quizRoutes.js       # MCQ practice tests, answer submission, LawXP calculation
│   │   │   └── studentRoutes.js    # Student dashboard stats, reading progress sync, calendar
│   │   ├── utils/
│   │   │   └── cloudinary.js       # Cloudinary SDK image/PDF upload configuration
│   │   └── server.js               # Main Express application entrypoint, CORS, CSP, rate limits
│   ├── .env                        # Backend environment configuration (MongoDB URI, JWT secret, Razorpay keys)
│   └── package.json                # Backend dependency declarations and start scripts
│
├── frontend/                       # Next.js 16 App Router Frontend
│   ├── public/                     # Static client assets
│   │   ├── assets/                 # Brand images, book covers, transparent logos, badges
│   │   └── notes/                  # Sample chapter PDF documents for free previews
│   ├── src/
│   │   ├── app/                    # 21 Next.js App Router Page Routes
│   │   │   ├── about/              # About The Law Kaksha, founder mission, faculty details
│   │   │   ├── admin/              # Complete Admin Portal (`/admin` SPA console & login)
│   │   │   ├── cart/               # Shopping cart summary and items list
│   │   │   ├── case-studies/       # Public landmark case studies directory
│   │   │   ├── checkout/           # Razorpay checkout execution page
│   │   │   ├── contact/            # Support form, WhatsApp link, inquiry submissions
│   │   │   ├── cookies/            # Cookie policy disclosure page
│   │   │   ├── courses/            # Full courses catalog (CA Foundation & CSEET)
│   │   │   ├── login/              # Unified login screen (Student / Admin toggle, Google OAuth)
│   │   │   ├── offers/             # Active discounts, promo bundles, student study passes
│   │   │   ├── privacy/            # Privacy policy and student data security declaration
│   │   │   ├── product/[id]/       # Dynamic individual product/codex sales page
│   │   │   ├── reader/             # Fullscreen DRM in-browser PDF reader route
│   │   │   ├── refund/             # Refund & cancellation policy page
│   │   │   ├── register/           # New student account registration screen
│   │   │   ├── reviews/            # Student testimonials and rating submission page
│   │   │   ├── signup/             # Redirect alias pointing to `/register`
│   │   │   ├── student/            # Complete Student Dashboard (`/student` SPA & sub-routes)
│   │   │   ├── subscriptions/      # 30-Day and full-course study pass pricing table
│   │   │   ├── terms/              # Terms & conditions of service page
│   │   │   ├── globals.css         # Global CSS styles, Tailwind directives, and CSS animations
│   │   │   ├── layout.tsx          # Master root layout with Navbar, AnnouncementBar, CartProvider
│   │   │   └── page.tsx            # Main public homepage (Hero, countdowns, books, testimonials)
│   │   ├── components/             # Reusable UI component library
│   │   │   ├── admin/              # Specialized admin sub-tabs (Orders, Broadcast, P&L, Settings)
│   │   │   ├── student/            # Specialized student dashboard widgets (Sidebar, Stats, Quizzes)
│   │   │   ├── AnnouncementBar.tsx # Top emergency broadcast strip for flash sales/announcements
│   │   │   ├── CartDrawer.tsx      # Slide-out shopping cart sidebar drawer
│   │   │   ├── Navbar.tsx          # Global navigation header with auth state, cart trigger, and links
│   │   │   ├── Footer.tsx          # Global footer with legal links, contact info, and course links
│   │   │   ├── SecurePdfReader.tsx # Canvas-based DRM PDF reader with watermarking and copy-blocking
│   │   │   └── ...                 # Modals for streak calendars, samples, and video masterclasses
│   │   ├── context/
│   │   │   └── CartContext.tsx     # React Context for cart items, coupon application, and total price
│   │   ├── lib/
│   │   │   └── api.ts              # API base URL resolver (`getApiBaseUrl()`) and fetch helpers
│   │   └── types/
│   │       ├── index.ts            # Core TypeScript interfaces (Courses, Books, Tests, Users)
│   │       └── promo.ts            # Promo banner and codex pass type contracts
│   ├── next.config.ts              # Next.js compiler, image domains, and Webpack settings
│   └── package.json                # Frontend dependency declarations and build scripts
│
└── package.json                    # Workspace root package manifest with unified npm scripts
```

---

## 4. User Roles & Login Flows

The platform recognizes **three distinct categories of users**:

```
+-----------------------------------------------------------------------------------+
|                                  USER ROLES                                       |
+--------------------------+----------------------------+---------------------------+
|      PUBLIC VISITOR      |       ENROLLED STUDENT     |       ADMINISTRATOR       |
+--------------------------+----------------------------+---------------------------+
| - No account needed      | - Role: "student"          | - Role: "admin"           |
| - Can view public site   | - Logs in via email/pass   | - Logs in via email/pass  |
| - Read sample PDFs       |   or Google OAuth          |   (secret credentials)    |
| - Browse courses         | - Bound to 1 Device ID     | - Full access to /admin   |
| - Add items to cart      | - DRM access to paid notes | - Can edit/delete anything|
| - Complete checkout      | - LawXP & streak tracking  | - Can manage students & P&L|
+--------------------------+----------------------------+---------------------------+
```

### A. Public Visitor (Unauthenticated)
- **Permissions:** Read-only access to all public pages (`/`, `/about`, `/courses`, `/subscriptions`, `/case-studies`, `/reviews`, `/contact`, `/terms`).
- **Interactive Capabilities:** Can test the interactive Section 16 comparator, read free sample chapters (pages 1 to 12) via `EnhancedSampleChapterModal.tsx`, add courses or digital books to the slide-out cart drawer, and apply discount coupons.
- **Authentication:** None required. If a visitor clicks "Enroll Now" or proceeds to checkout, they are redirected to `/login?redirect=/checkout` or invited to register at `/register`.

### B. Enrolled Student (`role: "student"`)
- **Permissions:** Full access to `/student` dashboard, personalized learning calendar, landmark case analyses, Google Form practice tests, and full in-web DRM reading of unlocked books.
- **Login Methods:**
  1. **Email + Password Login:** Student submits email and password at `/login`.
     - *Frontend:* `frontend/src/app/login/page.tsx` calls `POST /api/auth/login`.
     - *Backend:* `backend/src/routes/authRoutes.js` verifies password using `bcrypt.compare`.
     - *Hardware Security Check:* The client sends `deviceId` (generated from browser fingerprint and stored in `localStorage.lawkaksha_device_id`). If the student has an existing active session on a different device within the last 15 minutes, the server responds with HTTP 409 `DEVICE_CONFLICT`. The UI presents a prompt: *"You are logged in on another device. Do you want to log out of the other device?"*. If confirmed, the request is resent with `force: true`, which overrides the previous device session.
  2. **Google One-Tap / OAuth Login:** Student clicks "Sign in with Google" at `/login` or `/register`.
     - *Frontend:* `GoogleSignInButton.tsx` opens Google prompt, retrieves Google ID token, and sends it to `POST /api/auth/google`.
     - *Backend:* `backend/src/routes/authRoutes.js` verifies the token with Google servers, extracts name, email, and avatar, finds or creates the student account in MongoDB, and issues a session JWT.
- **Session Persistence:** The returned JWT is saved in `localStorage.lawkaksha_token`. A user profile snapshot is stored in `localStorage.lawkaksha_user`. The frontend includes this token as `Authorization: Bearer <token>` in all subsequent requests.

### C. Administrator (`role: "admin"`)
- **Permissions:** Unrestricted access to `/admin`, allowing full CRUD (Create, Read, Update, Delete) on study products, chapter notes, student accounts, order records, coupon codes, and financial expense ledgers.
- **Login Method:**
  - An administrator logs in using the exact same `/login` screen.
  - Upon successful authentication, the backend identifies `user.role === "admin"`.
  - The frontend saves the admin token in `localStorage.lawkaksha_token` and `localStorage.lawkaksha_admin_session`, then automatically redirects the user to `/admin`.
  - If a student attempts to navigate directly to `/admin`, the page checks authorization in `frontend/src/app/admin/page.tsx` (lines 715–733). Finding `role !== "admin"`, it immediately redirects them back to `/login?redirect=/admin`.

---

## 5. How the 3 Parts Connect to the Same Backend & Database

A central question for understanding the project: *How do the Public Website, the Admin Panel, and the Student Dashboard all work together without conflicting?*

```
                              THE LAW KAKSHA UNIFIED ARCHITECTURE

  +-----------------------+   +-----------------------+   +-----------------------+
  |    PUBLIC WEBSITE     |   |     ADMIN PORTAL      |   |   STUDENT DASHBOARD   |
  | (Home, Courses, Cart) |   | (/admin - 16 Workspaces)|  | (/student - Learning) |
  +-----------+-----------+   +-----------+-----------+   +-----------+-----------+
              |                           |                           |
              | Public API Calls          | Bearer JWT (Admin)        | Bearer JWT (Student)
              | (/api/site-data,          | (/api/admin/*,            | (/api/student/*,
              |  /api/courses, etc.)      |  /api/admin/products)     |  /api/quizzes, etc.)
              \                           |                           /
               \                          |                          /
                v                         v                         v
  +-------------------------------------------------------------------------------+
  |                          EXPRESS.JS BACKEND SERVER                            |
  |                             (Port 5000 / Render)                              |
  |                                                                               |
  |   - Auth Middleware (JWT Verification, Role Enforcement, Single Device Lock)  |
  |   - Sanitizer & Rate Limiters (NoSQL Injection Guard, Brute-Force Stopper)   |
  |   - 7 Route Modules (auth, admin, catalog, content, order, quiz, student)     |
  +---------------------------------------+---------------------------------------+
                                          |
                                          | Mongoose ODM / Database Abstraction
                                          v
  +-------------------------------------------------------------------------------+
  |                           DUAL-TIER DATA LAYER                                |
  |                                                                               |
  |   1. PRIMARY: MongoDB Atlas Cluster0 (Cloud Database)                         |
  |      - 21 Collections (Users, Orders, Subscriptions, Products, etc.)          |
  |                                                                               |
  |   2. FAULT-TOLERANT FALLBACK: Local JSON Database                             |
  |      - `backend/data/lawkaksha_db.json`                                       |
  |      - Active automatically if cloud connection is interrupted                |
  +-------------------------------------------------------------------------------+
```

### The End-to-End Data Pipeline:
1. **Admin Publishes Content:** An administrator enters the Admin Portal (`/admin`), selects the **Study Materials** hub, clicks "Add Chapter Note", and uploads a new PDF. The admin frontend makes an authorized `POST` request to `/api/admin/resources`.
2. **Backend Stores Record:** Express receives the payload, verifies the administrator's JWT, validates the fields against `backend/src/models/Resource.js`, and writes the record into MongoDB Atlas (and syncs the local JSON cache).
3. **Public Website Reflects Changes:** When a public visitor opens `/courses` or the homepage, the client fetches `GET /api/site-data`. The backend queries the `resources` collection and returns the newly added chapter note. The public visitor immediately sees the new note in the curriculum list.
4. **Student Learns with DRM Protection:** When an enrolled student logs into `/student` and navigates to the **Chapter Notes** tab, the student dashboard calls `GET /api/student/resources`. The backend checks the student's active entitlement. If entitled, the student clicks "Open Reader", launching `SecurePdfReader.tsx`, which streams the PDF pages directly onto an HTML5 canvas with personal watermark protection.
5. **Progress & Analytics Flow Back to Admin:** As the student completes chapters, solves Question of the Day (QOTD), or takes tests, the student app posts progress to `/api/student/sync-progress`. The backend updates `User.lawXp` and `User.streakDays`. When the admin checks the **Students** tab or **Admin Dashboard** overview, the admin instantly sees the student's updated streak and engagement metrics.
