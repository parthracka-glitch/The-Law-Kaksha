# Phase 0: Codebase Health Snapshot & Full Inventory

**Audit Date:** 2026-10-18  
**Auditor Identity:** `gemini` (Gemini in Antigravity)  
**Methodology:** GRAVITAS Engineering Reliability Runtime (`planning: deep`, `mode: review/security-review`, verified static analysis, zero code mutation)  
**Project:** The Law Kaksha (Premier CA Foundation & CSEET Business Law Platform)

---

## 1. Executive Summary & Stack Detection

| Component | Detected Technology & Version | Status / Notes |
|---|---|---|
| **Architecture** | Monorepo (Frontend + Backend in distinct directories) | Frontend in `frontend/`, Backend in `backend/` |
| **Frontend Framework** | **Next.js 16.3.8** (App Router) | React 19.2.4, React DOM 19.2.4 |
| **Styling Engine** | **Tailwind CSS v4.0** with `@tailwindcss/postcss` v4 | PostCSS 8, `clsx`, `tailwind-merge`, `tw-animate-css` |
| **Component Library** | `@base-ui/react` v1.3.0, `lucide-react` v1.6.0 | Custom accessible UI primitives |
| **Document Rendering** | `pdfjs-dist` v6.3.289 | In-browser DRM Canvas PDF Reader |
| **Backend Framework** | **Express.js 4.21.2** (Node.js runtime v26.7.0 detected) | ESM / CommonJS hybrid scripts |
| **Primary Database** | **MongoDB Atlas Cluster0** (`mongoose` v9.10.3) | Online cluster configured via `MONGODB_URI` |
| **Fallback Database** | **Local In-Memory Atomic JSON Engine** (`backend/data/lawkaksha_db.json`) | Synchronous disk snapshotting fallback |
| **Authentication** | Dual: Custom JWT (`jsonwebtoken` v9.0.2) + Google OAuth (`google-auth-library` v11.1.0) | Single-device hardware binding enforcement |
| **Payment Gateway** | **Razorpay** (`razorpay` v2.9.8) + Client-side Razorpay Checkout.js | Server-side HMAC-SHA256 signature verification |
| **Cloud Storage** | **Cloudinary** (`cloudinary` v2.11.0) + `multer` v2.4.0 (Memory storage) | Digital notes & dynamic carousel uploads |
| **PDF Processing** | `pdf-parse` v2.4.5 | Server-side text extraction & validation |
| **Hosting Targets** | **Vercel** (Frontend) + **Render** (Backend API, Oregon region, free tier) | Configured in `render.yaml` & `frontend/next.config.ts` |
| **Package Manager** | `npm` (Lockfile v3 format) | Dependencies uninstalled in active workspace |
| **Version Control** | Git | Workspace root lacks `.git` (standalone directory copy) |

---

## 2. Directory Structure & File Map

```
The-Law-Kaksha-main/
├── .agents/
│   └── skills/gravitas/          # GRAVITAS Reliability Runtime & TS rules
├── .env.example                  # Root environment template (31 lines)
├── .github/                      # GitHub Actions CI workflow
├── .gitignore                    # Monorepo ignore configuration (66 lines)
├── AGENTS.md                     # Agent shared memory & protocol rules
├── GEMINI.md                     # Antigravity agent pointer
├── backend/
│   ├── .env.example              # (Missing - template at root only)
│   ├── data/
│   │   ├── backups/              # Automated database snapshots
│   │   └── lawkaksha_db.json     # Local JSON database fallback
│   ├── package.json              # Backend metadata & scripts (10 dependencies)
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js       # In-memory JSON table engine (216 lines)
│   │   │   ├── mongo.js          # Mongoose connection manager (72 lines)
│   │   │   ├── mongoSeed.js      # Atlas cluster seeder (21,385 bytes)
│   │   │   └── seed.js           # Local database seeder (1,311 lines)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT validation & role enforcement (153 lines)
│   │   ├── models/               # 21 Mongoose schema definitions
│   │   ├── routes/               # 7 Express route controllers:
│   │   │   ├── adminRoutes.js    # B0-B10 admin management (2,007 lines, 77.8 KB)
│   │   │   ├── authRoutes.js     # Signup, login, reset, Google auth (859 lines, 28.3 KB)
│   │   │   ├── catalogRoutes.js  # Courses, products, offers, carousel (21.9 KB)
│   │   │   ├── contentRoutes.js  # Protected content access & reviews (205 lines)
│   │   │   ├── orderRoutes.js    # Razorpay order create & verify (529 lines, 18.3 KB)
│   │   │   ├── quizRoutes.js     # MCQs, weekly tests, scoring (16.3 KB)
│   │   │   └── studentRoutes.js  # C0-C5 student dashboard & DRM (783 lines, 27.9 KB)
│   │   ├── scripts/              # Backup/restore, create_admin, load_benchmark
│   │   ├── server.js             # Express application entry point (251 lines)
│   │   └── utils/
│   │       └── cloudinary.js     # Cloudinary media uploader (3,019 bytes)
│   └── tests/                    # 5 Node.js native test suites + runner.js
├── docs/                         # Extensive documentation suite (50+ files)
├── frontend/
│   ├── .env.example              # Frontend environment template (7 lines)
│   ├── next.config.ts            # Next.js 16 build, rewrite & security header config
│   ├── package.json              # Frontend dependencies (10 prod, 7 dev)
│   ├── public/                   # Static assets, covers, logo, and PDF worker
│   └── src/
│       ├── app/                  # Next.js App Router (28 route directories)
│       ├── components/           # 31 shared UI components + admin/ and student/
│       ├── context/              # Cart & UI state providers
│       ├── lib/                  # api.ts (Centralized API client) & utils.ts
│       ├── middleware.ts         # Edge route interceptor for DRM redirects
│       ├── types/                # TypeScript interface definitions
│       └── utils/                # Device fingerprinting & helpers
├── render.yaml                   # Render deployment infrastructure-as-code
├── scripts/
│   └── verify.js                 # Universal verification harness
├── shannon_setup_plan.md         # Shannon AI pentest setup plan
├── skills/                       # 9 specialized agent skills (SKILL (1)-(9).md)
└── skills-lock.json              # Skills manifest lockfile
```

---

## 3. Route & Endpoint Catalog

### 3.1 Frontend App Router Routes (`frontend/src/app`)

| Route Path | Type | Render Target | Description |
|---|---|---|---|
| `/` (`page.tsx`) | Server / Client | Public Storefront | Hero, 3D Book viewer, Bare Act decoder, pricing, reviews |
| `/about` | Client | Static Page | Academy origins, faculty profile, pedagogical mission |
| `/admin` | Client | Protected Portal | Surface B (B0–B10 modules: Orders, Carousel, Meets, Expenses, Settings) |
| `/cart` | Client | Storefront | Cart drawer & item quantity manager |
| `/case-studies` | Client | Storefront | Statutory case law index & 3-step answer drafting guides |
| `/checkout` | Client | Checkout Desk | Razorpay payment desk with coupon verification |
| `/contact` | Client | Support Desk | Student queries, WhatsApp support desk, telegram links |
| `/cookies` | Client | Legal / Statutory | Statutory Cookie Policy (DPDP Act 2023 & IT Act 2000 compliant) |
| `/courses` | Client | Course Catalog | CA Foundation & CSEET paper breakdowns and syllabi |
| `/login` | Client | Auth Portal | Dual student & administrator login with auto-fill toggle |
| `/not-found.tsx` | Client | Custom 404 | Dedicated 404 page with navigation fallbacks |
| `/error.tsx` | Client | Error Boundary | Root React Error Boundary with recovery retry action |
| `/offers` | Client | Storefront | Time-limited discount countdowns & coupon codes |
| `/privacy` | Client | Legal / Statutory | Privacy Policy conforming to DPDP Act 2023 |
| `/product/[id]` | Client | Detail Page | Individual book codex specifications & sample preview |
| `/reader` | Client | DRM Viewer | Canvas-based PDF reader with dynamic user watermarking |
| `/refund` | Client | Legal / Statutory | Cancellation & 7-day refund policy |
| `/register` / `/signup` | Client | Auth Portal | Student registration & Google Sign-In |
| `/reviews` | Client | Social Proof | Student testimonials, exam marks, and verified reviews |
| `/robots.ts` | Server | Metadata Route | Search crawler policy generator |
| `/sitemap.ts` | Server | Metadata Route | XML Sitemap generator |
| `/student` | Client | Protected Surface C | Student Dashboard (C0–C5: DRM shelf, streak, calendar, XP) |
| `/student/login` | Client | Entitlement Gate | Isolated single-tap Google / credential verification |
| `/student/checkout/[itemType]/[itemId]` | Client | In-Portal Checkout | 1-click buy-now for unowned codices |
| `/subscriptions` | Client | Storefront | All-Access vs Semester subscription plans |
| `/terms` | Client | Legal / Statutory | Terms of Service, DRM IP protection, single-device policy |
| `/api/pdf/[filename]` | Server | Next.js API Route | Secure PDF streaming route with token verification |

### 3.2 Backend Express API Endpoints (`backend/src/server.js`)

| Method | Endpoint Path | Auth Guard | Controller File | Purpose |
|---|---|---|---|---|
| `GET` | `/healthz` | None | `server.js` | Liveness probe for Render / K8s |
| `GET` | `/readyz` | None | `server.js` | Readiness probe (MongoDB or local DB) |
| `GET` | `/api/health` | None | `server.js` | Service health & table item counts |
| `POST` | `/api/auth/register` | None (Rate Limited) | `authRoutes.js` | Student signup with bcrypt hashing |
| `POST` | `/api/auth/login` | None (Rate Limited) | `authRoutes.js` | Student / Admin login & device binding |
| `POST` | `/api/auth/google` | None (Rate Limited) | `authRoutes.js` | Google OAuth ID token verification |
| `POST` | `/api/auth/forgot-password` | None (Rate Limited) | `authRoutes.js` | Password reset token generation |
| `POST` | `/api/auth/reset-password` | None (Rate Limited) | `authRoutes.js` | SHA-256 token verification & update |
| `GET` | `/api/auth/me` | `requireAuth` | `authRoutes.js` | Session validation & student profile |
| `GET` | `/api/courses` | None | `catalogRoutes.js` | CA Foundation & CSEET catalog |
| `GET` | `/api/products` | None | `catalogRoutes.js` | Published physical/digital book products |
| `GET` | `/api/carousel-slides` | None | `catalogRoutes.js` | Homepage hero carousel slides |
| `GET` | `/api/offers` | None | `catalogRoutes.js` | Active promotional banner offers |
| `GET` | `/api/case-studies` | None | `catalogRoutes.js` | Weekly legal cases & analyses |
| `GET` | `/api/content/:id/access` | `requireAuth` | `contentRoutes.js` | DRM codex authorization & watermark data |
| `GET` | `/api/reviews` | None | `contentRoutes.js` | Verified student reviews |
| `GET` | `/api/quizzes` | None | `quizRoutes.js` | Unit-wise mock tests & MCQs |
| `POST` | `/api/quizzes/:id/submit` | `requireAuth` | `quizRoutes.js` | Quiz grading & XP calculation |
| `POST` | `/api/orders/create` | Rate Limited | `orderRoutes.js` | Razorpay order creation & coupon check |
| `POST` | `/api/orders/verify` | Rate Limited | `orderRoutes.js` | HMAC signature verify & DRM unlock |
| `GET` | `/api/student/dashboard` | `requireAuth` | `studentRoutes.js` | C0 Student dashboard comprehensive payload |
| `POST` | `/api/student/sync-progress` | `requireAuth` | `studentRoutes.js` | Streak, XP, bookmarks, and read unit sync |
| `GET` | `/api/student/gate` | `requireAuth` | `studentRoutes.js` | Entitlement check (>= 1 active entitlement) |
| `GET` | `/api/student/resources` | `requireAuth` | `studentRoutes.js` | Unlocked codices with expiry badges |
| `GET` | `/api/student/explore` | `requireAuth` | `studentRoutes.js` | Upsell catalog for unowned codices |
| `GET` | `/api/student/calendar` | `requireAuth` | `studentRoutes.js` | Google Meet links & session schedule |
| `ALL` | `/api/admin/*` (20+ routes) | `requireAdmin` | `adminRoutes.js` | B0-B10 admin management endpoints |

---

## 4. Complete Form & Input Field Inventory

| Location (File:Line) | Form / Context | Fields | Types | Placeholders Observed |
|---|---|---|---|---|
| `login/page.tsx:498` | Admin / Student Login | `identifier`, `password` | `text`, `password` | `"admin@thelawkaksha.com"` / `"student@example.com or Roll ID"`, `"••••••••"` |
| `student/login/page.tsx:411` | Student Gate Login | `identifier`, `password` | `text`, `password` | `"student@example.com or LRK-2026-..."`, `"••••••••"` |
| `checkout/page.tsx:408` | Main Storefront Checkout | `name`, `email`, `phone`, `city`, `state`, `couponCode` | `text`, `email`, `tel` | Real-looking fake inputs and varying placeholders |
| `student/checkout/.../page.tsx:280` | In-Portal 1-Click Buy | `name`, `email`, `phone`, `city`, `coupon` | `text`, `email`, `tel` | Instructional placeholders |
| `CartDrawer.tsx:599` | Slide-Over Cart Checkout | `couponCode`, `name`, `email`, `phone` | `text`, `email`, `tel` | `"LAW20"`, `"Exemption Aspirant"`, `"student@example.com"` |
| `StudentProfileModal.tsx:217` | Student Profile Settings | `name`, `email`, `phone`, `city`, `state` | `text`, `email`, `tel` | Student's current values |
| `BareActDecoderTool.tsx:238` | Interactive Bare Act Search | `searchQuery` | `text` | `"Search section number, act, or keyword..."` |
| `AdminSettingsTab.tsx:123` | Platform Settings Editor | 8 configuration fields | `text`, `number` | Platform configuration values |
| `AdminOffersTab.tsx:224` | Coupon & Offer Manager | `code`, `discountPercent`, `title`, `badge` | `text`, `number` | `"EXEMPTION2026"`, `"20"` |
| `AdminLiveSessionsTab.tsx:225` | Google Meet Scheduler | `title`, `meet_link`, `scheduled_at` | `text`, `url`, `datetime-local` | `"https://meet.google.com/..."` |
| `AdminExpensesTab.tsx:271` | P&L Expense Logger | `title`, `amount`, `category`, `date` | `text`, `number`, `date` | `"Server Hosting"`, `"1500"` |
| `LegalClinicChatModal.tsx:284` | Mentor Doubt Desk | `queryText` | `text` | `"Type your legal doubt or section query..."` |

---

## 5. Tooling, Scripts & Environment Audit

- **Linter & Formatter:**
  - `frontend/eslint.config.mjs`: ESLint 9 flat config using `eslint-config-next`.
  - Backend: **No linter configured** (missing ESLint, Prettier, or StandardJS).
- **Type Checking:**
  - `frontend/tsconfig.json`: TypeScript 5 with Next.js plugin enabled.
  - Backend: Pure vanilla JavaScript (Node.js CommonJS), no type checking or JSDoc validation.
- **Testing Framework:**
  - Backend uses Node.js built-in test runner (`node --test`) wrapped by `backend/tests/runner.js`.
  - Frontend: **Zero test harness** (no Vitest, Jest, React Testing Library, or Playwright).
- **Build & CI/CD:**
  - Root `package.json` coordinates monorepo scripts (`npm run check`, `npm run verify`).
  - `.github/workflows/` contains CI automation.
  - `render.yaml` automates Render web service provisioning for the backend.
  - Vercel automatically deploys `frontend/` on push.

---

## 6. Codebase Scale & Health Metrics

- **Total Monorepo Source Files:** ~125 files (excluding `.git` and `node_modules`).
- **Total Lines of Code (LOC):**
  - Frontend (`frontend/src`): ~26,500 LOC
  - Backend (`backend/src`): ~8,200 LOC
  - Documentation (`docs/`): ~15,000 LOC
- **Workspace State:** Active workspace lacks installed `node_modules` in both `frontend/` and `backend/`. Build and test commands cannot be executed directly in this environment until `npm install` is run. All observations in this audit are grounded in verified static source code analysis.
