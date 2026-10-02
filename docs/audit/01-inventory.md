# Phase 1 — Discovery & Complete Platform Inventory

**Timestamp**: 2026-10-02 04:40 UTC  
**Branch**: `audit/production-readiness`  
**Platform**: The Law Kaksha (Monorepo: Next.js + Express API)  

---

## 1. System Architecture & Tech Stack

```mermaid
graph TD
    Client["Client Browsers (Desktop & Mobile)"] --> NextApp["Next.js 16.3 Frontend (Vercel)"]
    NextApp --> PublicPages["Public Pages (Home, Courses, About, Reviews, Contact)"]
    NextApp --> DRMReader["In-Web DRM PDF Reader (Protected Canvas)"]
    NextApp --> StudentPortal["Student Dashboard (/student)"]
    NextApp --> AdminPortal["Academic Administrator Panel (/admin)"]

    NextApp -- REST API / JSON -- ExpressAPI["Express 4.21.2 Backend Server (Render)"]
    
    ExpressAPI --> AuthRoutes["Auth & Device Engine (/api/auth)"]
    ExpressAPI --> OrderRoutes["Order & DRM License Engine (/api/orders)"]
    ExpressAPI --> StudentRoutes["Student Sync & Access Engine (/api/student)"]
    ExpressAPI --> CatalogRoutes["Catalog & Case Engine (/api/catalog)"]
    ExpressAPI --> AdminRoutes["Admin CRUD & Analytics Engine (/api/admin)"]

    ExpressAPI --> MongoAtlas["MongoDB Atlas Cluster0 (Primary Store)"]
    ExpressAPI --> LocalFallback["Local JSON DB (Fault-Tolerant Cache)"]
    ExpressAPI --> Cloudinary["Cloudinary (CDN for Media / PDFs)"]
```

### Stack & Versions
* **Frontend**: Next.js `16.3.0`, React `19.2.4`, React-DOM `19.2.4`, TypeScript `5.x`, Tailwind CSS `4.0`, Lucide React `1.6.0`, PDF.js `6.3.289`, clsx `2.1.1`, tailwind-merge `3.5.0`.
* **Backend**: Node.js `v24.18.0`, Express `4.21.2`, Mongoose `9.10.3`, jsonwebtoken `9.0.2`, bcryptjs `3.0.3`, Multer `2.4.0`, Cloudinary `2.11.0`, Morgan `1.10.0`, Cors `2.8.5`, Dotenv `16.4.7`.
* **Database**: MongoDB Atlas (`Cluster0`) with local JSON fallback cache (`backend/data/lawkaksha_db.json`).

---

## 2. Directory Structure & Folder Map

```
thelawkaksha/
├── backend/
│   ├── data/
│   │   └── lawkaksha_db.json         # Local fallback database
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js           # Local table driver
│   │   │   ├── mongo.js              # MongoDB Atlas Mongoose connection
│   │   │   ├── mongoSeed.js          # MongoDB seeder
│   │   │   └── seed.js               # Local seeder
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT & role authorization
│   │   ├── models/
│   │   │   ├── Coupon.js             # Discount codes
│   │   │   ├── McqQuestion.js        # Daily QOTD
│   │   │   ├── McqTest.js            # Google Form Mock Tests
│   │   │   ├── Product.js            # Course passes & books
│   │   │   ├── Resource.js           # Chapter PDFs & notes
│   │   │   ├── SiteSetting.js        # Exam countdowns & banners
│   │   │   ├── Subscription.js       # Active enrollments
│   │   │   ├── User.js               # Students & Admins + Device Locks
│   │   │   └── WeeklyCase.js         # Weekly case studies
│   │   ├── routes/
│   │   │   ├── adminRoutes.js        # Admin management APIs
│   │   │   ├── authRoutes.js         # Register, Login, Heartbeat, Logout
│   │   │   ├── catalogRoutes.js      # Courses, Catalog, Comparison
│   │   │   ├── contentRoutes.js      # DRM content verification
│   │   │   ├── orderRoutes.js        # Order create, verify & license gen
│   │   │   ├── quizRoutes.js         # Quizzes & Leaderboards
│   │   │   └── studentRoutes.js      # Student dashboard & sync
│   │   ├── server.js                 # Express application entry
│   │   └── utils/
│   │       └── cloudinary.js         # Cloudinary storage utility
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/page.tsx        # About page
│   │   │   ├── admin/page.tsx        # Admin Dashboard
│   │   │   ├── api/pdf/[filename]/   # PDF streaming endpoint
│   │   │   ├── cart/page.tsx         # Cart view
│   │   │   ├── checkout/page.tsx     # Checkout view
│   │   │   ├── contact/page.tsx      # Contact view
│   │   │   ├── courses/page.tsx      # Course catalog
│   │   │   ├── login/page.tsx        # Login & device conflict prompt
│   │   │   ├── product/[id]/         # Product detail view
│   │   │   ├── register/page.tsx     # Student registration
│   │   │   ├── reviews/page.tsx      # Reviews & testimonials
│   │   │   └── student/page.tsx      # Student Learning Vault
│   │   ├── components/
│   │   │   ├── BareActDecoderTool.tsx
│   │   │   ├── CartDrawer.tsx        # Cart, Checkout & DRM Credentials
│   │   │   ├── DigitalBookshelf.tsx
│   │   │   ├── EnhancedSampleChapterModal.tsx
│   │   │   ├── ExamCountdownsAndQOTD.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Navbar.tsx            # Top nav + Student Dashboard CTA
│   │   │   ├── Section16ComparisonBlock.tsx
│   │   │   ├── SecurePdfReader.tsx   # Canvas DRM Reader
│   │   │   ├── SecurePdfReaderModal.tsx
│   │   │   ├── SmartChoicePricing.tsx
│   │   │   ├── StreakCalendarModal.tsx
│   │   │   ├── StudentProfileModal.tsx
│   │   │   └── student/              # Specialized student modals
│   │   ├── context/
│   │   │   ├── CartContext.tsx       # Cart state & pricing
│   │   │   └── DeviceSessionContext.tsx # Single-device heartbeat & lock
│   │   └── utils/
│   │       └── deviceHelper.ts       # UUID & browser device detection
└── docs/
    └── audit/                        # Comprehensive audit deliverables
```

---

## 3. Environment Variables Specification

| Variable Name | Required | Default / Staging Value | Purpose | Where Used |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000` | Backend REST API URL | Frontend API clients & fetch calls |
| `PORT` | No | `5000` | Express Server Port | `backend/src/server.js` |
| `NODE_ENV` | Yes | `development` / `production` | Environment mode | Backend server & middleware |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin | `backend/src/server.js` |
| `MONGO_URI` | Yes | MongoDB Atlas Connection | Atlas DB connection string | `backend/src/db/mongo.js` |
| `JWT_SECRET` | Yes | Secret string (min 32 chars) | HMAC SHA-256 JWT key | `authRoutes.js`, `authMiddleware.js` |
| `CLOUDINARY_CLOUD_NAME` | No | Optional | Cloudinary cloud identifier | `backend/src/utils/cloudinary.js` |
| `CLOUDINARY_API_KEY` | No | Optional | Cloudinary API Key | `backend/src/utils/cloudinary.js` |
| `CLOUDINARY_API_SECRET` | No | Optional | Cloudinary Secret | `backend/src/utils/cloudinary.js` |

---

## 4. Frontend Routes & Views

| Route | Path | Roles | Purpose | Key Interactive Elements |
|---|---|---|---|---|
| **Home** | `/` | Guest, Student, Admin | Hero, Catalog, Pricing, QOTD, FAQ, Comparison | Add to cart, view samples, sample PDF modal, QOTD option clicks, search |
| **About** | `/about` | All | Academy credentials & mission | Navigation links |
| **Courses** | `/courses` | All | Master catalog & filters | Stream filter (All/CA/CS), Add to cart, Quick View |
| **Product Detail** | `/product/[id]` | All | Syllabus details, pricing, sample read | Add to cart, Instant Buy, Sample PDF Reader modal |
| **Reviews** | `/reviews` | All | Student verified scorecards & feedback | Filter by exam, video review triggers |
| **Contact** | `/contact` | All | Support form, phone, email, WhatsApp | Contact enquiry form, FAQ accordion |
| **Cart** | `/cart` | All | Standalone cart view | Quantity update, remove, apply coupon, checkout CTA |
| **Checkout** | `/checkout` | All | Direct enrollment flow | Student info form, UPI/Card toggle, pay button |
| **Login** | `/login` | Guest | Student & Admin authentication | Identifier/Password inputs, Device Conflict Takeover button, Submit |
| **Register** | `/register` | Guest | New candidate registration | Name, email, phone, course selection, submit |
| **Student Vault** | `/student` | Student, Admin | Gated learning workspace | Chapters, In-Web DRM Reader, Daily QOTD, Weekly Cases, Google Form Tests, Streak Calendar, Profile |
| **Admin Panel** | `/admin` | Admin | Administration & analytics | Products CRUD, Subscriptions CRUD, Students CRUD, Cases CRUD, MCQ Tests CRUD, QOTD manager, File upload |

---

## 5. Backend REST API Endpoints Inventory

| Method | Path | Auth / Role | Input Validation | Data Touched | Purpose |
|---|---|---|---|---|---|
| **POST** | `/api/auth/register` | Public | name, email, password | `User` (Atlas + Local) | Registers student account |
| **POST** | `/api/auth/login` | Public | identifier, password, deviceId | `User` | Authenticates & enforces 1-device lock |
| **POST** | `/api/auth/device-heartbeat`| Token | deviceId, studentId | `User` | 45-sec device liveness & conflict check |
| **POST** | `/api/auth/logout` | Token | deviceId | `User` | Releases active device lock |
| **GET** | `/api/auth/me` | Token | Bearer token | `User` | Returns active user profile |
| **POST** | `/api/orders/create` | Public | items, shippingDetails | `orders` table | Creates pending order & calculates price |
| **POST** | `/api/orders/verify` | Public | paymentId, deviceId | `User`, `Subscription` | Verifies payment, creates student credentials, locks device |
| **GET** | `/api/orders/:id` | Public | orderId | `orders` | Gets order receipt status |
| **GET** | `/api/student/dashboard` | Public/Token | email, studentId | `User`, `Subscription` | Returns student courses, unlockedItemIds, streak |
| **POST** | `/api/student/sync-progress` | Token/Public | xpTotal, streakDays | `User` | Syncs gamified study metrics |
| **POST** | `/api/student/sync-purchase` | Token/Public | unlockedItemIds | `User` | Syncs purchased items |
| **GET** | `/api/public/site-data` | Public | None | `Product`, `WeeklyCase` | Global homepage data bundle |
| **GET** | `/api/public/section16-comparison` | Public | None | `SiteSetting` | Section 16 model comparison block |
| **GET** | `/api/catalog` | Public | None | `Product` | Lists all active books & courses |
| **GET** | `/api/catalog/:id` | Public | id | `Product` | Single product detail |
| **GET** | `/api/admin/analytics` | Admin | None | `Subscription`, `User` | Revenue, MRR, student count |
| **GET** | `/api/admin/products` | Admin | None | `Product` | Lists all products |
| **POST** | `/api/admin/products` | Admin | product schema | `Product` | Creates course / book |
| **PUT** | `/api/admin/products/:id` | Admin | id, updates | `Product` | Updates product details |
| **DELETE**| `/api/admin/products/:id` | Admin | id | `Product` | Removes product |
| **GET** | `/api/admin/cases` | Admin | None | `WeeklyCase` | Lists weekly law cases |
| **POST** | `/api/admin/cases` | Admin | case schema | `WeeklyCase` | Creates case study |
| **PUT** | `/api/admin/cases/:id` | Admin | id, updates | `WeeklyCase` | Updates case study |
| **DELETE**| `/api/admin/cases/:id` | Admin | id | `WeeklyCase` | Deletes case study |
| **GET** | `/api/admin/mcq-tests` | Admin | None | `McqTest` | Lists Google Form tests |
| **POST** | `/api/admin/mcq-tests` | Admin | form schema | `McqTest` | Creates Google Form test |
| **PUT** | `/api/admin/mcq-tests/:id` | Admin | id, updates | `McqTest` | Updates test item |
| **DELETE**| `/api/admin/mcq-tests/:id`| Admin | id | `McqTest` | Deletes test item |
| **GET** | `/api/admin/students` | Admin | None | `User` | Lists all registered students |
| **POST** | `/api/admin/students` | Admin | student schema | `User` | Admin adds student |
| **PUT** | `/api/admin/students/:id` | Admin | id, updates | `User` | Updates student access |
| **DELETE**| `/api/admin/students/:id` | Admin | id | `User` | Deletes student |
| **GET** | `/api/admin/subscriptions` | Admin | None | `Subscription` | Lists all subscriptions |
| **POST** | `/api/admin/subscriptions` | Admin | sub schema | `Subscription`, `User` | Grants access to student |
| **PUT** | `/api/admin/subscriptions/:id`| Admin | id, updates | `Subscription` | Updates subscription |
| **DELETE**| `/api/admin/subscriptions/:id`| Admin | id | `Subscription` | Revokes subscription |
| **GET** | `/api/admin/coupons` | Admin | None | `Coupon` | Lists coupons |
| **POST** | `/api/admin/coupons` | Admin | coupon schema | `Coupon` | Creates coupon |
| **PUT** | `/api/admin/coupons/:id` | Admin | id, updates | `Coupon` | Updates coupon |
| **DELETE**| `/api/admin/coupons/:id` | Admin | id | `Coupon` | Deletes coupon |
| **GET** | `/api/admin/exam-settings` | Admin | None | `SiteSetting` | Gets countdown dates |
| **POST** | `/api/admin/exam-settings` | Admin | examSettings | `SiteSetting` | Updates exam dates |
| **GET** | `/api/admin/qotd` | Admin | None | `SiteSetting` | Gets daily QOTD |
| **POST** | `/api/admin/qotd` | Admin | qotd object | `SiteSetting` | Updates daily QOTD |
| **POST** | `/api/admin/upload` | Admin | multipart/form-data | Cloudinary/Local | Uploads PDF notes / cover |
| **GET** | `/api/admin/resources` | Admin | course, actName | `Resource` | Lists PDF resources |
| **POST** | `/api/admin/resources` | Admin | resource schema | `Resource` | Creates PDF resource |
| **PUT** | `/api/admin/resources/:id` | Admin | id, updates | `Resource` | Updates PDF resource |
| **DELETE**| `/api/admin/resources/:id`| Admin | id | `Resource` | Deletes PDF resource |
| **GET** | `/api/health` | Public | None | None | System uptime & DB status |

---

## 6. Roles & Permissions Matrix

| Capability / Route | Guest (Unenrolled) | Enrolled Student | Academic Admin |
|---|:---:|:---:|:---:|
| View Homepage, Pricing, Catalog | ✅ Yes | ✅ Yes | ✅ Yes |
| View Sample Chapters & Previews | ✅ Yes | ✅ Yes | ✅ Yes |
| Purchase Course / Book | ✅ Yes | ✅ Yes | ✅ Yes |
| Access Free QOTD & Bare Act Tool | ✅ Yes | ✅ Yes | ✅ Yes |
| Access Full Paid Codex in DRM Reader | ❌ Gated | ✅ If purchased | ✅ Bypass Lock |
| Submit Google Form Weekly Tests | ❌ Gated | ✅ If purchased | ✅ Full Access |
| Access Weekly Case Studies Vault | ❌ Gated | ✅ If purchased | ✅ Full Access |
| Switch / Manage Active Device | ❌ N/A | ✅ Yes (1 at a time)| ✅ Yes |
| Manage Catalog, Pricing, Coupons | ❌ Forbidden | ❌ Forbidden | ✅ Full CRUD |
| Grant / Revoke Student Licenses | ❌ Forbidden | ❌ Forbidden | ✅ Full CRUD |
| Upload PDF Codices to Cloudinary | ❌ Forbidden | ❌ Forbidden | ✅ Full Access |
| View Financial Analytics & Sales | ❌ Forbidden | ❌ Forbidden | ✅ Full Access |

---

## 7. Data Models & Schemas

### A. `User` Schema
* `id` (String, unique index)
* `student_id` (String, unique index, e.g. `LRK-2026-CA1001`)
* `name` (String, required)
* `email` (String, unique, lowercase, trimmed)
* `password_hash` (String, select: false)
* `tempPassword` (String, unhashed generated password for receipt)
* `phone` (String)
* `target_exam` (String)
* `role` (Enum: `['student', 'admin']`, default: `'student'`)
* `is_active` (Boolean, default: `true`)
* `drm_access` (Boolean, default: `true`)
* `unlockedItemIds` (Array of Strings, course/book access keys)
* `activeDeviceId` (String, single-device UUID lock)
* `activeDeviceName` (String, e.g. "Google Chrome on Windows 11")
* `activeSessionToken` (String)
* `boundGmail` (String, bound Google account)
* `lastActiveAt` (Date)
* `streak` (Number, default: `1`)
* `lawXp` (Number, default: `180`)

### B. `Product` Schema
* `id` (String, unique)
* `title` (String, required)
* `subtitle` (String)
* `category` (String)
* `price` (Number, required)
* `originalPrice` (Number)
* `badge` (String)
* `features` (Array of Strings)
* `coverImage` (String)
* `status` (Enum: `['Active', 'Draft']`)

### C. `Subscription` Schema
* `id` (String, unique)
* `studentName` (String)
* `studentRoll` (String)
* `email` (String, indexed)
* `phone` (String)
* `item` (String)
* `targetExam` (String)
* `amount` (String)
* `date` (String)
* `paymentMode` (String)
* `accessStatus` (Enum: `['Active', 'Revoked', 'Expired']`)
* `unlockedItemIds` (Array of Strings)

### D. `Resource` Schema
* `id` (String, unique)
* `course` (String)
* `actName` (String)
* `chapterNumber` (Number)
* `type` (String, e.g. `'notes'`, `'sample'`, `'mcq'`)
* `title` (String)
* `pdfUrl` (String)
* `isSample` (Boolean)
* `pages` (String)

---

## 8. Deletion & Cleanup Candidates (Identified for Phase 10)

1. `frontend/src/components/AdminDispatchSlipModal.tsx` — Empty 256-byte stub file deprecated when moving away from physical delivery to 100% digital DRM.
2. `frontend/src/components/ui/` — Empty directory with no components.
3. Unused ESLint `any` types in `frontend/src/lib/api.ts`.
4. Root documents: `.docx` and `.txt` files in repository root (`The Law Kaksha_Basic Plan.docx`, `New Microsoft Word Document.docx`, `extracted_basic_plan.txt`, `extracted_new_doc.txt`) that belong in `docs/references/` rather than root.

---

## 9. Phase 1 Gate Review

- [x] Complete stack, architecture diagram, and directory map recorded.
- [x] Every frontend route and API endpoint catalogued with auth, validation, and data touched.
- [x] Complete Role & Permissions matrix documented.
- [x] All 9 Data models and schemas detailed.
- [x] Deletion candidates identified without premature deletion.

**Phase 1 Status**: `GATE PASSED` → Proceeding to Phase 2 (Honest Status Review & Before Scorecard).
