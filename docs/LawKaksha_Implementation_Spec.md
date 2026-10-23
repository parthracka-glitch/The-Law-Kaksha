# The Law Kaksha — Full Project Implementation Specification

> **Comprehensive Architectural, Engineering & Operational Specification**  
> **Platform:** Next.js 16 (React 19, Tailwind CSS v4) Frontend · Express.js Backend (Node.js) · MongoDB Atlas / Hybrid DB  
> **Domain:** CA Foundation & CSEET Business Laws Preparation, Digital Codex & DRM E-Learning Platform  
> **Repository:** `https://github.com/parthracka-glitch/The-Law-Kaksha.git`

---

## Table of Contents
1. [Product Overview & Architectural Philosophy](#1-product-overview--architectural-philosophy)
2. [Surface Architecture & Target Audiences](#2-surface-architecture--target-audiences)
3. [Identity, Authentication & Zero-Trust Access Control](#3-identity-authentication--zero-trust-access-control)
4. [End-to-End User Journeys & State Machines](#4-end-to-end-user-journeys--state-machines)
5. [Complete Data Architecture & Schemas](#5-complete-data-architecture--schemas)
6. [Comprehensive Route Map & API Endpoints](#6-comprehensive-route-map--api-endpoints)
7. [Surface A: Main Public Website Specifications](#7-surface-a-main-public-website-specifications)
8. [Surface B: Admin Mission-Control Dashboard](#8-surface-b-admin-mission-control-dashboard)
9. [Surface C: Student Learning Dashboard (LMS)](#9-surface-c-student-learning-dashboard-lms)
10. [High-Security DRM In-Browser PDF Reader](#10-high-security-drm-in-browser-pdf-reader)
11. [Business Rules, Pricing & Entitlement Lifecycle](#11-business-rules-pricing--entitlement-lifecycle)
12. [Gamification: Streak, XP & Referral Engine](#12-gamification-streak-xp--referral-engine)
13. [Architectural Decisions & Implementation Log](#13-architectural-decisions--implementation-log)
14. [Engineering Verification & Quality Assurance Suite](#14-engineering-verification--quality-assurance-suite)
15. [Environment Configuration & Deployment Specification](#15-environment-configuration--deployment-specification)

---

## 1. Product Overview & Architectural Philosophy

**The Law Kaksha** is a specialized, subscription-first educational platform and high-security digital codex dedicated to chartered accountancy (CA Foundation) and company secretary (CSEET) legal studies. Founded on elite curriculum design and structured pedagogy by subject-matter authorities (such as Pearl Dsouza Ma'am), the platform merges an interactive storefront, a strict single-device learning management system, and an operational mission-control back-office.

### Core Architectural Principles
1. **Three Distinct Surfaces, Single Identity:** Public Showcase, Admin Operations, and Student LMS operate off a unified database schema and identity provider.
2. **Zero-Trust Content Security (DRM First):** Proprietary legal notes, solved past papers, and charts are never leaked as static downloadable files. Rendering is strictly virtualized inside an encrypted HTML5 canvas with per-student dynamic watermarks.
3. **Server-Authoritative Pricing & Entitlements:** The client is never trusted for totals, coupon discounts, or access privileges. All calculations are executed server-side with strict idempotent webhook verification.
4. **Course Access Isolation & Multi-Course Stacking:** Access is strictly bounded by active entitlements. A purchase of CA Foundation unlocks only CA Foundation materials; subsequent purchases of CSEET or specialty modules stack automatically into the student's unified learning dashboard.
5. **Universal Dashboard Access with Free Teaser Tier:** Any registered student can log in. Non-purchased candidates are greeted with curated free resources, legal case samples, and 1-click cart enrollment rather than an impassable 403 wall.

---

## 2. Surface Architecture & Target Audiences

| Surface | Target Audience | Primary Objectives | Key Technologies |
| :--- | :--- | :--- | :--- |
| **Surface A: Main Website** | Public Visitors, Prospective Candidates, Returning Students | Showcase curriculum, 3D codex previews, sample chapters, interactive Section 16 comparison, subscription tiers, cart, checkout, and payment processing. | Next.js 16 App Router, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas 3D |
| **Surface B: Admin Dashboard** | Platform Owners, Operations Staff, Content Faculty | End-to-end administration: Real-time revenue analytics, orders database, content hierarchy (Course → Act → Unit → ContentItem), Google Meet live classes, carousel banner CMS, coupon generation, expense ledger, and audit log exports. | Next.js 16 Protected Admin Shell, Express API, MongoDB Aggregations, Recharts, File Export (CSV/JSON) |
| **Surface C: Student Dashboard (LMS)** | Active Students, Free-Tier Candidates | Gated digital codex reading, chapter-wise learning progression, live class calendar, exam countdowns, question of the day (QOTD), streak tracking, XP leaderboards, and referral bonuses. | Next.js 16, PDF.js Continuous Virtualized Canvas, WebSockets / Polling, Device Fingerprinting |

---

## 3. Identity, Authentication & Zero-Trust Access Control

### 3.1 Identity Resolution
- **Primary Identity Key:** Canonicalized email address (`user@example.com`).
- **Auth Providers:**
  1. **Google OAuth 2.0 / Google Identity Services:** One-tap sign-in for seamless onboarding and verification.
  2. **Email & Password (Local):** Hardened bcrypt hashing (`saltRounds = 12`) with minimum 8-character complexity.
  3. **One-Click Candidate Demo:** Pre-seeded demo credentials for instant evaluation (`demo@thelawkaksha.com` / `demo`) with automatic read-only entitlement simulation.

### 3.2 Single-Device Enforcement & Session Invalidation
To prevent account sharing and credential leakage across student communities:
- **Device Fingerprinting:** Every login generates and stores a client-generated UUID / hardware fingerprint.
- **Active Device Lock:** The `users` record maintains `activeDeviceId`. Any incoming request from a mismatched device triggers a `401 DEVICE_MISMATCH` response, requiring the user to explicitly revoke the previous session.
- **Token Versioning:** Each user entity contains a `tokenVersion` counter. Password resets, admin security kicks, or explicit logouts increment this version, instantaneously invalidating all outstanding JWTs across all active browsers.
- **JWT Architecture:** Stateless HS256 tokens carrying `{ id, email, role, tokenVersion, deviceId }` with a 7-day expiry and `HttpOnly`, `SameSite=Lax` cookie persistence.

### 3.3 Authorization Roles
- `student`: Standard access tier. Enforces `enrolled_books`, `unlockedItemIds`, and active `entitlements`.
- `admin`: Platform owner tier. Access granted through explicit database seeding or email allow-listing (`ADMIN_EMAILS` environment variable). Bypasses student entitlement gates while enforcing administrative logging.

---

## 4. End-to-End User Journeys & State Machines

### 4.1 First-Time Purchase & Onboarding Flow
```
[Public Visitor] ──► Explores /courses or /subscriptions/:slug
       │
       ▼
[Clicks "Buy Now" or "Add to Cart"]
       │
       ├──► [Not Logged In] ──► Modal / Login (/login) ──► Retains Purchase Intent
       │                                                         │
       ▼                                                         ▼
[Cart Drawer / Page] ◄───────────────────────────────────────────┘
       │
       ▼
[Checkout Form] ──► Prefills Name, Email, Phone, State/City
       │
       ├──► Applies Optional Coupon ──► POST /api/coupons/validate (Server Validation)
       │
       ▼
[Initiate Payment] ──► POST /api/orders/create ──► Generates Razorpay Order (Paise)
       │
       ▼
[Razorpay Modal] ──► Student Completes Payment (UPI / Card / NetBanking)
       │
       ▼
[Client Verification] ──► POST /api/orders/verify
       │
       ├──► [Asynchronous Webhook Backup] ──► POST /api/orders/webhook (HMAC-SHA256)
       │
       ▼
[Entitlement Engine]
       ├── Sets order.status = 'paid'
       ├── Generates Entitlement record (duration_days validity)
       ├── Sets user.drm_access = true
       └── Adds course to user.enrolled_books
       │
       ▼
[Success Page: /checkout/success/:orderNo]
       │
       ▼
[One-Click Entry] ──► Redirects directly to /student with active entitlement
```

### 4.2 Dashboard In-App Upsell Flow
```
[Active Student on /student] ──► Views "Explore Other Legal Codices" Carousel
       │
       ▼
[Clicks "Direct Buy Now"] ──► Skips multi-step cart
       │
       ▼
[Instant Checkout Overlay] ──► Details auto-populated from student profile
       │
       ▼
[Payment Verified] ──► New Course/Codex stacks immediately into My Courses hierarchy
```

---

## 5. Complete Data Architecture & Schemas

The application employs a resilient persistence layer: MongoDB Atlas via Mongoose in production, backed by an autonomous local file-backed JSON database engine (`src/db/database.js`) for zero-dependency offline resilience and CI test runners.

### 5.1 `users`
Represents student and administrative identities.
```javascript
{
  _id: ObjectId,
  google_id: { type: String, sparse: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String },
  name: { type: String, required: true },
  phone: { type: String },
  avatar_url: { type: String },
  city: { type: String },
  state: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  activeDeviceId: { type: String },
  tokenVersion: { type: Number, default: 0 },
  referral_code: { type: String, unique: true },
  referred_by: { type: ObjectId, ref: 'User' },
  drm_access: { type: Boolean, default: false },
  enrolled_books: [{ type: String }], // e.g. ['ca-foundation', 'cseet']
  unlockedItemIds: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

### 5.2 `subscriptions`
Purchasable membership bundles granting broad access for a fixed duration.
```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  short_desc: { type: String },
  description: { type: String },
  price: { type: Number, required: true }, // in INR
  mrp: { type: Number, required: true },
  duration_days: { type: Number, required: true, default: 180 },
  thumbnail: { type: String },
  features: [{ type: String }],
  course_ids: [{ type: ObjectId, ref: 'Course' }],
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}
```

### 5.3 `courses`, `acts`, `units`, and `content_items`
Hierarchical educational content tree providing fine-grained access governance.
```
Course (e.g., CA Foundation - Paper 2: Business Laws)
 └── Act (e.g., The Indian Regulatory Framework, The Companies Act, 2013)
      └── Unit (e.g., Chapter 1: Nature of Companies)
           └── ContentItem (e.g., Digital Codex PDF, Smart Question Bank, LDR Summary Chart)
```
- **Key ContentItem Fields:**
  - `title`: String
  - `type`: `'pdf'` | `'notes'` | `'video'` | `'sample'`
  - `cloudinaryPublicId`: String (Stored private, never exposed to public APIs)
  - `file_path`: String (Local secure fallback)
  - `page_count`: Number
  - `is_free_sample`: Boolean
  - `display_order`: Number

### 5.4 `orders` & `order_items`
Financial transaction audit logs.
```javascript
{
  _id: ObjectId,
  order_no: { type: String, required: true, unique: true }, // e.g. LK-ORD-123456
  user_id: { type: ObjectId, ref: 'User', required: true },
  customer_details: {
    name: String,
    email: String,
    phone: String,
    city: String,
    state: String
  },
  items: [{
    item_type: { type: String, enum: ['subscription', 'course', 'extra_course'] },
    item_id: { type: String, required: true },
    title: String,
    price: Number
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon_code: { type: String },
  total: { type: Number, required: true },
  gateway: { type: String, default: 'razorpay' },
  gateway_order_id: { type: String },
  gateway_payment_id: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  paid_at: { type: Date }
}
```

### 5.5 `entitlements`
Granular DRM authorization records checked by reader middleware.
```javascript
{
  _id: ObjectId,
  user_id: { type: ObjectId, ref: 'User', required: true },
  item_type: { type: String, enum: ['subscription', 'course'] },
  item_id: { type: String, required: true },
  order_id: { type: ObjectId, ref: 'Order' },
  starts_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' }
}
```

### 5.6 `coupons` & `coupon_redemptions`
Promotional engine supporting flat and percentage-based discounts.
- `code`: Uppercase string (e.g. `WELCOME10`, `EARLYBIRD`).
- `discount_type`: `'percent'` | `'flat'`.
- `value`: Number.
- `max_discount`: Cap for percentage discounts.
- `min_order`: Minimum cart amount required.
- `valid_from` / `valid_to`: UTC timestamps.
- `usage_limit` / `per_user_limit`: Integer bounds.

### 5.7 `user_stats`, `xp_events`, & `referrals`
Gamification tracking engine:
- `xp_total`: Cumulative XP score.
- `current_streak`: Current consecutive active days.
- `longest_streak`: Historical streak peak.
- `last_active_date`: String (`YYYY-MM-DD`).

### 5.8 `expenses`
Admin business ledger tracking platform operational overhead:
- `category`: `'hosting'` | `'marketing'` | `'faculty'` | `'software'` | `'other'`.
- `title`: String description.
- `amount`: Number (INR).
- `expense_date`: Date.
- `receipt_url`: String.

---

## 6. Comprehensive Route Map & API Endpoints

### 6.1 Frontend Application Routes (Next.js 16 App Router)

| Path | Purpose | Authorization |
| :--- | :--- | :--- |
| `/` | Main Homepage: Hero, 3D Book Preview, Feature Breakdown, Carousel, FAQs | Public |
| `/about` | Interactive Academy story, faculty background, educational philosophy | Public |
| `/courses` | Complete course directory for CA Foundation & CSEET | Public |
| `/product/[id]` | Deep-dive product specification with curriculum breakdown | Public |
| `/subscriptions/[slug]` | Subscription tier details and bundle inclusions | Public |
| `/case-studies` | Directory of judicial precedent breakdowns & legal analysis | Public |
| `/case-studies/[slug]` | Full rich-text judicial case breakdown | Public |
| `/offers` | Active promotional offers with 1-click coupon copy | Public |
| `/reviews` | Student testimonials and verified score improvements | Public |
| `/cart` | Shopping cart drawer / dedicated page | Public / Student |
| `/checkout` | Order details capture, server-side coupon validation, payment launch | Student Auth |
| `/checkout/success/[orderNo]` | Transaction receipt, invoice view, and instant dashboard redirect | Student Auth |
| `/login` | Public user authentication (Google + Email) | Public |
| `/register` | Public user registration | Public |
| `/student` | Unified Student LMS Dashboard (Courses, Free Resources, QOTD, Streak) | Student Auth |
| `/student/login` | Dedicated student-styled login portal | Public |
| `/reader` | DRM-protected continuous vertical scroll PDF reader | Entitled Student |
| `/admin` | Mission-Control operations center & analytics dashboard | Admin Auth |
| `/admin/login` | Dedicated admin portal login | Public |

### 6.2 Backend REST API Architecture (Express.js)

#### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create student identity with password hashing.
- `POST /api/auth/login` — Authenticate student; issues JWT and locks device.
- `POST /api/auth/google` — Google OAuth credential exchange & student upsert.
- `POST /api/auth/logout` — Invalidate session and release active device lock.
- `POST /api/auth/forgot-password` & `POST /api/auth/reset-password` — Password reset.
- `GET /api/auth/me` — Return authenticated user profile and entitlement state.

#### Catalog & Public Data (`/api/catalog`, `/api/public`)
- `GET /api/catalog` — Returns active courses, codices, and prices (zero leaks).
- `GET /api/public/site-data` — Aggregated site layout settings, counters, announcements.
- `GET /api/public/section16-comparison` — Specialized interactive CA comparison data.
- `GET /api/resources` — Public directory of downloadable/viewable free legal aids.

#### DRM & Content Streaming (`/api/content`, `/api/pdf`)
- `GET /api/content/:itemId/file` — Zero-trust gated PDF stream. Verifies active entitlement, validates DRM flags, and streams chunked binary data with `Cache-Control: private, no-store`.
- `GET /api/content/:itemId/file?sample=true` — Free teaser stream for unauthorized users.

#### Orders & Commerce (`/api/orders`, `/api/coupons`)
- `POST /api/coupons/validate` — Validate promo code against current cart total.
- `POST /api/orders/create` — Calculate server totals and generate Razorpay order.
- `POST /api/orders/verify` — Validate client payment signature and grant entitlements.
- `POST /api/orders/webhook` — Idempotent Razorpay webhook listener for offline capture.
- `GET /api/orders/:id` — Retrieve order receipt (IDOR guarded).

#### Student Learning & LMS (`/api/student`)
- `GET /api/student/dashboard` — Aggregated stats, streak count, XP points, announcements.
- `GET /api/student/my-courses` — Student course hierarchy with completion flags.
- `POST /api/student/toggle-unit-complete` — Mark module finished (+10 XP).
- `GET` / `POST` / `DELETE /api/student/bookmarks` — Digital notebook bookmarks.
- `GET` / `POST /api/student/support-tickets` — Internal candidate help desk.
- `GET /api/student/calendar` — Combined timeline of live lectures and study schedules.

#### Admin Operations (`/api/admin`)
- `GET /api/admin/overview` — High-level metrics: Today/Month revenue, student counts, orders.
- `GET` / `POST` / `PUT /api/admin/subscriptions` — Full subscription CRUD.
- `GET` / `POST` / `PUT /api/admin/courses` — Course and content hierarchy management.
- `GET` / `PUT /api/admin/carousel` — Reorderable homepage carousel slides.
- `GET` / `POST /api/admin/live-sessions` — Google Meet schedules.
- `GET` / `POST` / `DELETE /api/admin/expenses` — Financial ledger.
- `GET` / `POST` / `PUT /api/admin/coupons` — Coupon code management.
- `POST /api/admin/orders/:id/grant-manual` — Manual entitlement override with audit log.
- `POST /api/admin/orders/:id/recheck` — Sync order status directly with Razorpay API.

---

## 7. Surface A: Main Public Website Specifications

### A1. Dynamic Homepage Carousel
- Auto-rotating, swipeable presentation of active subscriptions and featured codices.
- Pause-on-hover / pause-on-touch interaction.
- Direct navigation links to dedicated subscription detail pages (`/subscriptions/:slug`).

### A2. Smart Choice Pricing & Product Overview
- Clear side-by-side pricing matrix comparing standalone codex access vs full master subscriptions.
- Struck-through MRP with highlighted net savings percentage.
- Features bullet list detailing physical delivery options, mock test evaluations, and LDR charts.
- 1-click "Enroll Now" trigger redirecting directly to checkout with preserved intent.

### A3. Interactive 3D Digital Bookshelf & Sample Chapter Modal
- Realistic 3D book spine and cover viewer allowing interactive rotation.
- Free sample chapter inspection: Launches embedded continuous reader for chapter 1 without requiring payment.

### A4. Section 16(1) Interactive Legal Comparison Engine
- Dedicated interactive comparison module illustrating the practical application of CA Law Section 16(1) against real-world ICAI problem statements.

---

## 8. Surface B: Admin Mission-Control Dashboard

### B0. Executive Overview & Real-Time Pulse
- Instant telemetry cards: Gross Revenue (Today / Month / All-time), Total Active Students, Pending Orders, Operating Margin (Revenue minus Expenses).

### B1. Subscription & Booking Management
- Filterable, searchable datatable supporting queries by Date Range, Status (`paid`, `pending`, `failed`, `refunded`), Coupon Code, and Student Email.
- Detailed order inspection drawer displaying payment gateway transaction IDs, customer IP/device snapshot, and purchase history.
- Emergency manual entitlement grant utility with automated audit logging.

### B2. Course & Content Repository Manager
- Drag-and-drop structural editor for Courses, Acts, Units, and ContentItems.
- Cloudinary asset uploader with encrypted private ID assignment.
- Free-sample toggle allowing faculty to preview public teaser chapters.

### B3. Financial Operations & Expense Tracker
- Comprehensive overhead tracker supporting receipt uploads, tax categorization, and net income calculations.
- Instant CSV and JSON export pipelines for platform accounts and tax audits.

---

## 9. Surface C: Student Learning Dashboard (LMS)

### C1. Course Hierarchy & Access Matrix
- Segmented view separating Owned Courses from Curated Free Legal Aids.
- Continuous status tracking displaying percentage of syllabus completed per Act.

### C2. Exam Countdown & Daily Question of the Day (QOTD)
- Live synchronized countdown timers for forthcoming ICAI CA Foundation & CSEET exam cycles.
- Daily interactive MCQ question testing core legal provisions with instant explanation reveals and +5 XP rewards.

### C3. Gamification: Streak, XP Points & Academic Rank
- Daily check-in streak engine tracking continuous daily study activity.
- Visual XP progress bar with rank milestones (*Legal Novice* → *Case Researcher* → *Advocate General*).

### C4. Live Lectures & Interactive Calendar
- Calendar integration showing scheduled live doubt clearing sessions with Google Meet launchers.

---

## 10. High-Security DRM In-Browser PDF Reader

The Law Kaksha implements an uncompromising digital rights management (DRM) architecture designed to eliminate unauthorized content distribution.

### 10.1 Technical Protections
1. **Canvas-Only Rendering:** Documents are transformed into raw HTML5 canvas rasters via PDF.js. No raw PDF binary is ever cached in DOM elements or local storage.
2. **Dynamic Per-Student Forensic Watermarking:** Every rendered page features high-visibility diagonal and border watermarks displaying the student's unique identifier, registration roll number (`LK-2026-STU...`), and current access timestamp.
3. **Anti-Copy & Anti-Print Interceptors:**
   - Universal CSS isolation: `user-select: none`, `-webkit-user-select: none`, `pointer-events: auto`.
   - Keyboard shortcut suppression: Disables `Ctrl+P`, `Ctrl+S`, `Ctrl+C`, `Ctrl+U`, `F12`, and `Alt+PrintScreen`.
   - Clipboard clearing on focus loss.
4. **Fast Continuous Vertical Scroll:** High-performance virtualized vertical scroller using `IntersectionObserver`. Only visible pages and adjacent margins are rendered into memory, ensuring rapid document loading on low-spec mobile devices.

---

## 11. Business Rules, Pricing & Entitlement Lifecycle

1. **Server Authority:** Client-side cart totals are treated purely as visual previews. The backend recalculates item base prices, coupon deductions, and tax compliance upon every order creation call.
2. **Entitlement Duration:**
   - Standard Subscriptions: Active for exact plan duration (`duration_days`, typically 180 or 365 days) from payment verification timestamp.
   - Extra Standalone Codices: Lifetime access or bounded as designated by course metadata.
3. **Renewal & Overlap:** Purchasing an identical active plan extends the expiration date (`expires_at = current_expires_at + duration_days`) rather than overwriting existing valid days.
4. **Webhook Idempotency:** Webhook handlers check existing order state. If client verification has already processed the order, the webhook logs the event safely without duplicate entitlement creation or double XP awarding.

---

## 12. Gamification: Streak, XP & Referral Engine

### 12.1 XP Point Matrix
- Daily Platform Login: `+5 XP`
- Daily Legal Question of the Day (QOTD) Correct Answer: `+15 XP`
- Complete Study Unit / Read Codex Chapter: `+10 XP`
- Attend Scheduled Live Masterclass: `+20 XP`
- Consecutive 7-Day Streak Milestone: `+50 XP`

### 12.2 Referral Program Rules
- Every registered student receives an immutable personal referral code (e.g. `PARTH-LK26`).
- Referees receive an instant flat discount coupon on their initial purchase.
- Referrers receive bonus study materials or subscription extension rewards once the referred student's initial order reaches `paid` status.
- Self-referrals and cyclic referral chains are detected and rejected server-side.

---

## 13. Architectural Decisions & Implementation Log

*Documented from production engineering audit handoffs:*

1. **Universal Student Dashboard Access:** Non-purchased candidates who register or log in are granted access to the `/student` dashboard displaying high-value Free Legal Resources (sample chapters, Bare Act summaries, LDR charts) with 1-click upsell cards, rather than being locked out.
2. **Course Access Isolation:** Entitlements are enforced strictly on a per-course basis. A purchase of CA Foundation does not unlock CSEET materials unless covered by a comprehensive multi-course subscription.
3. **Continuous Scrolling Reader:** Adopted continuous vertical document flow with lazy-loaded page canvases to replace single-page flip viewers, drastically enhancing readability of long bare acts.
4. **Registration DRM Defaults:** User registration initializes `drm_access: false`, `enrolled_books: []`, and `unlockedItemIds: []`. DRM privileges are granted strictly upon verified payment gateway confirmation.
5. **Robust Database Fallback:** Backend incorporates hybrid storage: full MongoDB Atlas Mongoose models with transparent local file-backed JSON persistence fallback (`backend/src/db/database.js`) ensuring complete functional offline and container capability.

---

## 14. Engineering Verification & Quality Assurance Suite

The project includes an automated test runner and verification suite:

### 14.1 Backend Test Coverage (93 Passing Tests)
- **Authentication & Single-Device Gate:** Validates bcrypt hashing, token versioning, device mismatch rejection, and Google credential parsing.
- **Catalog & Public APIs:** Confirms zero data leakage of Cloudinary public IDs, ensures proper Cache-Control headers, and verifies sub-100ms response times.
- **Zero-Trust DRM Gate:** Tests unauthorized (401), missing entitlement (403), expired access (403), and valid student streaming (200).
- **Purchase & Webhook Resilience:** Verifies order creation, signature validation, tamper rejection, idempotent double-calls, and administrative manual grants.
- **Student LMS APIs:** Validates Course → Act → Unit completion toggling, bookmark operations, and support ticket lifecycles.
- **Security Hardening:** Tests NoSQL operator injection sanitization, IDOR boundaries across student orders, and Helmet production security headers.

### 14.2 Frontend Production Verification (22 Static & Dynamic Routes)
- Next.js 16 build compiles 100% cleanly with zero TypeScript errors across all routes:
  `○ /`, `○ /about`, `○ /admin`, `ƒ /api/pdf/[filename]`, `○ /cart`, `○ /case-studies`, `ƒ /case-studies/[slug]`, `○ /checkout`, `ƒ /checkout/success/[orderNo]`, `○ /contact`, `○ /cookies`, `○ /courses`, `○ /login`, `○ /offers`, `○ /privacy`, `ƒ /product/[id]`, `○ /reader`, `○ /refund`, `○ /register`, `○ /reviews`, `○ /student`, `ƒ /subscriptions/[slug]`, `○ /terms`.

---

## 15. Environment Configuration & Deployment Specification

### 15.1 Backend Environment Variables (`backend/.env`)
```bash
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lawkaksha?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_sample_key
RAZORPAY_KEY_SECRET=sample_razorpay_secret
CLOUDINARY_CLOUD_NAME=thelawkaksha
CLOUDINARY_API_KEY=sample_api_key
CLOUDINARY_API_SECRET=sample_api_secret
ADMIN_EMAILS=admin@thelawkaksha.com,parth@thelawkaksha.com
```

### 15.2 Frontend Environment Variables (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_sample_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=sample_google_client_id.apps.googleusercontent.com
```

### 15.3 Deployment Architecture (`render.yaml`)
- **Backend Service:** Node.js Web Service running `npm start` with automatic health checks (`/healthz` and `/readyz`).
- **Frontend Service:** Next.js Web Service running `npm run build && npm start` with edge proxy optimization.
