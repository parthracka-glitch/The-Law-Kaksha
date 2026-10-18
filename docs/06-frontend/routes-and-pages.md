# Frontend Routes & Page Directory

**Purpose:** Comprehensive map of application routes, page access policies, dynamic parameters, and data sources.  
**Status:** Verified against code & build traces  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Public Pages (Static / Dynamic SSR)

| Path / Route | File Location | Access Tier | Primary Data Sources / API Calls | Key Components Used |
|---|---|---|---|---|
| `/` | `frontend/src/app/page.tsx` | Public | `/api/public/site-data`, `/api/public/section16-comparison` | `HeroSection`, `SyllabusSection`, `Section16ComparisonBlock`, `EnrollModal` |
| `/courses` | `frontend/src/app/courses/page.tsx` | Public | `/api/catalog` | Course cards, filtering tabs, price badges |
| `/about` | `frontend/src/app/about/page.tsx` | Public | Static marketing copy | Academy mission, faculty credentials |
| `/contact` | `frontend/src/app/contact/page.tsx` | Public | Support form | Inquiry form, grievance officer contacts |
| `/login` | `frontend/src/app/login/page.tsx` | Public | `/api/auth/login` | Email/password form, Google OAuth SSO |
| `/register` | `frontend/src/app/register/page.tsx` | Public | `/api/auth/register` | Account registration form |
| `/terms` | `frontend/src/app/terms/page.tsx` | Public | Static statutory draft | Terms of Service, jurisdiction clauses |
| `/privacy` | `frontend/src/app/privacy/page.tsx` | Public | Static statutory draft | Privacy Policy, DPDP Act notices, cookie disclosures |
| `/refund` | `frontend/src/app/refund/page.tsx` | Public | Static statutory draft | Instant digital fulfillment rules, 48-hr exception policy |
| `/reviews` | `frontend/src/app/reviews/page.tsx` | Public | Testimonials list | Verified student feedback cards |

---

## 2. Authenticated Student Pages

| Path / Route | File Location | Access Tier | Guard Mechanism | Description |
|---|---|---|---|---|
| `/student` | `frontend/src/app/student/page.tsx` | Authenticated Student | `requireAuth` + `DeviceSessionContext` | Student dashboard, study streak, unlocked books, recent reading progress. |
| `/reader` | `frontend/src/app/reader/page.tsx` | Authenticated Student | Verified JWT + DRM device check | 3D canvas flipbook reader rendering watermarked vector pages. |
| `/cart` | `frontend/src/app/cart/page.tsx` | Authenticated Student | Session token | Items review before payment gateway redirection. |
| `/checkout` | `frontend/src/app/checkout/page.tsx` | Authenticated Student | Session token | Razorpay payment intent handler. |

---

## 3. Administrative Pages

| Path / Route | File Location | Access Tier | Guard Mechanism | Description |
|---|---|---|---|---|
| `/admin` | `frontend/src/app/admin/page.tsx` | Administrator | `user.role === 'admin'` | Content management desk, Cloudinary PDF uploads, order monitoring. |
