# 06. Exhaustive API Inventory & Route Usage Audit

---

## 1. Master API Inventory Table

The backend exposes **68 REST API endpoints** across 7 route modules and root server probes.

| Method | Endpoint URL | Purpose / Action | Access Role | Request Body | Response Payload | Files Involved |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Create student account | Public | `{ name, email, password, phone, target_exam, referral_code }` | `{ success, token, user }` | `authRoutes.js`, `register/page.tsx` |
| **POST** | `/api/auth/login` | Authenticate student/admin | Public | `{ identifier, password, deviceId, deviceName, forceSwitchDevice }` | `{ success, token, user }` or `409 DEVICE_CONFLICT` | `authRoutes.js`, `login/page.tsx` |
| **POST** | `/api/auth/google` | Google OAuth One-Tap sign in | Public | `{ token, credential, clientId }` | `{ success, token, user }` | `authRoutes.js`, `GoogleSignInButton.tsx` |
| **POST** | `/api/auth/device-heartbeat` | Keep active session alive | Authenticated | `{ deviceId }` | `{ success, lastActiveAt }` | `authRoutes.js`, `student/page.tsx` |
| **POST** | `/api/auth/logout` | Terminate session & device lock | Authenticated | None | `{ success: true }` | `authRoutes.js`, `Navbar.tsx` |
| **GET** | `/api/auth/me` | Fetch active user profile | Authenticated | None | `{ success, user }` | `authRoutes.js`, `api.ts` |
| **POST** | `/api/auth/forgot-password` | Issue password reset token | Public | `{ email }` | `{ success, message }` | `authRoutes.js`, `login/page.tsx` |
| **POST** | `/api/auth/reset-password` | Verify token & change pass | Public | `{ token, newPassword }` | `{ success, message }` | `authRoutes.js`, `login/page.tsx` |
| **POST** | `/api/auth/bind-gmail` | Link Gmail account | Authenticated | `{ googleToken }` | `{ success, boundGmail }` | `authRoutes.js` |
| **POST** | `/api/auth/verify-token` | Validate JWT authenticity | Public | `{ token }` | `{ valid: boolean }` | `authRoutes.js` |
| **GET** | `/api/site-data` | Aggregated catalog & banners | Public | None | `{ announcement, promoBanners, products, resources }` | `catalogRoutes.js`, `page.tsx` |
| **GET** | `/api/catalog` | Public catalog items list | Public | None | `{ products, subscriptions }` | `catalogRoutes.js`, `courses/page.tsx` |
| **GET** | `/api/courses` | List of legal courses | Public | None | `{ courses: [...] }` | `catalogRoutes.js` |
| **GET** | `/api/resources` | Public sample PDF notes | Public | None | `{ resources: [...] }` | `catalogRoutes.js`, `courses/page.tsx` |
| **GET** | `/api/resources/:id` | Single note details | Public | None | `{ resource: {...} }` | `catalogRoutes.js` |
| **GET** | `/api/section16-comparison` | ICAI Sec 16 comparison data | Public | None | `{ comparisonData: {...} }` | `catalogRoutes.js`, `Section16...tsx` |
| **GET** | `/api/subscriptions` | Public 30-Day pass plans | Public | None | `{ subscriptions: [...] }` | `catalogRoutes.js`, `subscriptions/` |
| **GET** | `/api/offers` | Active promotional coupons | Public | None | `{ offers: [...] }` | `catalogRoutes.js`, `offers/page.tsx` |
| **GET** | `/api/case-studies` | Public landmark cases list | Public | None | `{ caseStudies: [...] }` | `catalogRoutes.js`, `case-studies/` |
| **GET** | `/api/case-studies/:slug` | Single case study details | Public | None | `{ caseStudy: {...} }` | `catalogRoutes.js`, `case-studies/` |
| **GET** | `/api/announcement` | Top broadcast announcement | Public | None | `{ announcement: {...} }` | `catalogRoutes.js`, `AnnouncementBar.tsx`|
| **GET** | `/api/products` | Public digital codices | Public | None | `{ products: [...] }` | `catalogRoutes.js` |
| **GET** | `/api/target-exams` | Target exam options list | Public | None | `{ exams: [...] }` | `catalogRoutes.js` |
| **GET** | `/api/reviews` | Student ratings & reviews | Public | None | `{ reviews: [...] }` | `contentRoutes.js`, `reviews/page.tsx`|
| **POST** | `/api/reviews` | Submit new student review | Authenticated | `{ rating, comment, courseId }` | `{ success, review }` | `contentRoutes.js`, `reviews/page.tsx`|
| **GET** | `/api/content/access/:id`| Verify DRM access for note | Authenticated | None | `{ allowed: boolean, reason }` | `contentRoutes.js`, `SecurePdfReader.tsx`|
| **POST** | `/api/orders/create` | Generate Razorpay order | Public / Student | `{ items, shippingDetails, couponCode }` | `{ success, orderId, amount, key_id }` | `orderRoutes.js`, `checkout/page.tsx` |
| **POST** | `/api/create-order` | (Alias) Create payment order | Public / Student | `{ items, shippingDetails }` | `{ success, orderId, amount }` | `orderRoutes.js` |
| **POST** | `/api/orders/verify` | Verify HMAC payment signature| Public / Student | `{ orderId, payment_id, signature, deviceId }` | `{ success, student, unlockedItemIds }` | `orderRoutes.js`, `checkout/page.tsx` |
| **POST** | `/api/verify-payment` | (Alias) Verify payment | Public / Student | `{ razorpay_order_id, razorpay_payment_id }` | `{ success: boolean }` | `orderRoutes.js` |
| **GET** | `/api/orders/:id` | Single order status lookup | Authenticated | None | `{ order: {...} }` | `orderRoutes.js` |
| **GET** | `/api/orders/user/:userId`| Student order history | Authenticated | None | `{ orders: [...] }` | `orderRoutes.js` |
| **GET** | `/api/leaderboard` | Public LawXP top rankers | Public | None | `{ leaderboard: [...] }` | `quizRoutes.js`, `PublicLeaderboard...`|
| **GET** | `/api/quizzes` | List available MCQ quizzes | Authenticated | None | `{ quizzes: [...] }` | `quizRoutes.js`, `QuizTakingModal.tsx` |
| **GET** | `/api/quizzes/:id` | Fetch single quiz questions | Authenticated | None | `{ quiz: {...} }` | `quizRoutes.js` |
| **POST** | `/api/quizzes/:id/submit`| Grade quiz & award LawXP | Authenticated | `{ answers: [0, 2, 1] }` | `{ score, lawXpAwarded, totalMarks }` | `quizRoutes.js` |
| **GET** | `/api/student/dashboard` | Student dashboard data bundle | Student | None | `{ stats, streak, enrolled, lastRead }` | `studentRoutes.js`, `student/page.tsx` |
| **POST** | `/api/student/sync-progress`| Record reading minutes & progress| Student | `{ minutesRead, unitId, progress }` | `{ success, todayMinutes, lawXp }` | `studentRoutes.js`, `student/page.tsx` |
| **GET** | `/api/student/gate` | DRM access check for note | Student | `?resourceId=xxx` | `{ allowed: boolean }` | `studentRoutes.js`, `student/page.tsx` |
| **GET** | `/api/student/resources` | Fetch student chapter notes | Student | None | `{ resources: [...] }` | `studentRoutes.js`, `student/page.tsx` |
| **GET** | `/api/student/explore` | Catalog of purchasable passes| Student | None | `{ availableItems: [...] }` | `studentRoutes.js` |
| **GET** | `/api/student/calendar` | Student schedule & countdowns| Student | None | `{ events, milestones }` | `studentRoutes.js`, `StudentSchedule...`|
| **GET** | `/api/student/case-studies` | Student landmark cases | Student | None | `{ cases: [...] }` | `studentRoutes.js`, `student/page.tsx` |
| **GET** | `/api/student/profile` | Student profile info | Student | None | `{ profile: {...} }` | `studentRoutes.js`, `StudentProfile...`|
| **PUT** | `/api/student/profile` | Update profile info | Student | `{ phone, target_exam, city, state }` | `{ success, profile }` | `studentRoutes.js`, `StudentProfile...`|
| **GET** | `/api/student/refer` | Student referral rewards | Student | None | `{ referralCode, referralsList, xpBonus }` | `studentRoutes.js`, `student/page.tsx` |
| **POST** | `/api/student/activity` | Record custom learning action | Student | `{ type, points, ref_type }` | `{ success, lawXp }` | `studentRoutes.js` |
| **GET** | `/api/admin/overview` | Dashboard summary metrics | Admin | None | `{ totalStudents, revenue, activeSubs }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/analytics` | Deep platform analytics | Admin | None | `{ monthlyGrowth, conversionRate }` | `adminRoutes.js` |
| **GET** | `/api/admin/products` | Admin digital codices list | Admin | None | `{ products: [...] }` | `adminRoutes.js`, `admin/page.tsx` |
| **POST** | `/api/admin/products` | Create new digital codex | Admin | `{ title, category, price, units }` | `{ success, product }` | `adminRoutes.js`, `admin/page.tsx` |
| **PUT** | `/api/admin/products/:id`| Update digital codex | Admin | `{ title, price, status }` | `{ success, product }` | `adminRoutes.js`, `admin/page.tsx` |
| **DELETE**| `/api/admin/products/:id`| Delete digital codex | Admin | None | `{ success: true }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/resources` | Admin chapter notes list | Admin | None | `{ resources: [...] }` | `adminRoutes.js`, `admin/page.tsx` |
| **POST** | `/api/admin/resources` | Create chapter note / PDF | Admin | `{ title, actName, chapterNumber, pdfUrl }` | `{ success, resource }` | `adminRoutes.js`, `admin/page.tsx` |
| **PUT** | `/api/admin/resources/:id`| Update chapter note | Admin | `{ title, pdfUrl, status }` | `{ success, resource }` | `adminRoutes.js`, `admin/page.tsx` |
| **DELETE**| `/api/admin/resources/:id`| Delete chapter note | Admin | None | `{ success: true }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/students` | Admin students directory | Admin | None | `{ students: [...] }` | `adminRoutes.js`, `admin/page.tsx` |
| **PUT** | `/api/admin/students/:id`| Toggle DRM / update student | Admin | `{ drm_access, phone, target_exam }` | `{ success, student }` | `adminRoutes.js`, `admin/page.tsx` |
| **DELETE**| `/api/admin/students/:id`| Delete student account | Admin | None | `{ success: true }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/cases` | Admin case studies list | Admin | None | `{ cases: [...] }` | `adminRoutes.js`, `admin/page.tsx` |
| **POST** | `/api/admin/cases` | Add landmark case study | Admin | `{ title, precedent, facts, modelAnswer }` | `{ success, case }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/mcq-tests` | Admin mock tests list | Admin | None | `{ tests: [...] }` | `adminRoutes.js`, `admin/page.tsx` |
| **POST** | `/api/admin/mcq-tests` | Add Google Forms mock drill | Admin | `{ title, course, formUrl, duration }` | `{ success, test }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/coupons` | Admin discount coupons list | Admin | None | `{ coupons: [...] }` | `adminRoutes.js`, `admin/page.tsx` |
| **POST** | `/api/admin/coupons` | Create discount coupon code | Admin | `{ code, value, min_order, usage_limit }` | `{ success, coupon }` | `adminRoutes.js`, `admin/page.tsx` |
| **POST** | `/api/admin/upload` | Upload PDF/image to Cloudinary| Admin | `FormData(file)` | `{ success, url, public_id }` | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/orders` | Admin orders transaction log | Admin | None | `{ orders: [...] }` | `adminRoutes.js`, `AdminOrdersTab.tsx`|
| **GET** | `/api/admin/payments` | Razorpay payment ledger | Admin | None | `{ payments: [...] }` | `adminRoutes.js`, `AdminPaymentsTab.tsx`|
| **GET** | `/api/admin/expenses` | P&L operating expenses list | Admin | None | `{ expenses: [...] }` | `adminRoutes.js`, `AdminExpensesTab.tsx`|
| **POST** | `/api/admin/expenses` | Record operating expense | Admin | `{ category, title, amount }` | `{ success, expense }` | `adminRoutes.js`, `AdminExpensesTab.tsx`|
| **POST** | `/api/admin/announcement`| Update live broadcast bar | Admin | `{ announcement: { enabled, text } }` | `{ success, announcement }`| `adminRoutes.js`, `AdminBroadcastTab.tsx`|
| **GET** | `/api/admin/export/students`| Export students CSV | Admin | None | Raw CSV stream | `adminRoutes.js`, `admin/page.tsx` |
| **GET** | `/api/admin/export/orders` | Export financial orders CSV | Admin | None | Raw CSV stream | `adminRoutes.js`, `AdminOrdersTab.tsx`|
| **GET** | `/healthz` / `/readyz` | Liveness & Readiness checks | Public | None | `{ status: "ok" / "ready" }` | `server.js` |
| **GET** | `/api/health` | Complete diagnostic health | Public | None | `{ status: "healthy", database: {...} }` | `server.js` |

---

## 2. Screen-to-Endpoint Mapping

```
+-------------------------------------------------------------------------------------------------+
|                                SCREEN TO ENDPOINT MAPPING MATRIX                                |
+---------------------------------+---------------------------------------------------------------+
| FRONTEND SCREEN / MODAL         | ENDPOINTS CALLED                                              |
+---------------------------------+---------------------------------------------------------------+
| Public Homepage (`/`)           | GET /api/announcement                                         |
|                                 | GET /api/site-data                                            |
|                                 | GET /api/catalog                                              |
|                                 | GET /api/section16-comparison                                 |
|                                 | GET /api/case-studies                                         |
+---------------------------------+---------------------------------------------------------------+
| Courses Catalog (`/courses`)    | GET /api/catalog                                              |
|                                 | GET /api/resources                                            |
|                                 | GET /api/content/access/:id                                   |
+---------------------------------+---------------------------------------------------------------+
| Checkout Page (`/checkout`)     | POST /api/orders/create                                       |
|                                 | POST /api/orders/verify                                       |
|                                 | GET /api/offers                                               |
+---------------------------------+---------------------------------------------------------------+
| Login Screen (`/login`)         | POST /api/auth/login                                          |
|                                 | POST /api/auth/google                                         |
|                                 | POST /api/auth/forgot-password                                |
|                                 | POST /api/auth/reset-password                                 |
+---------------------------------+---------------------------------------------------------------+
| Student Dashboard (`/student`)  | GET /api/student/dashboard                                    |
|                                 | GET /api/student/resources                                    |
|                                 | GET /api/student/gate                                         |
|                                 | POST /api/student/sync-progress                               |
|                                 | PUT /api/student/profile                                      |
|                                 | GET /api/student/refer                                        |
+---------------------------------+---------------------------------------------------------------+
| Admin Console (`/admin`)        | GET /api/admin/overview                                       |
|                                 | GET / POST / PUT / DELETE /api/admin/products                 |
|                                 | GET / POST / PUT / DELETE /api/admin/resources                |
|                                 | GET / PUT / DELETE /api/admin/students                        |
|                                 | GET / POST /api/admin/announcement                            |
|                                 | GET / POST /api/admin/expenses                                |
|                                 | POST /api/admin/upload                                        |
+---------------------------------+---------------------------------------------------------------+
```

---

## 3. Orphaned / Unused Backend Endpoints

The following endpoints exist in the Express backend code (`backend/src/routes/`), but are **never invoked by any frontend screen or component**:

1. **`POST /api/auth/bind-gmail` (`backend/src/routes/authRoutes.js:780`):**
   - *Reason:* No UI screen in the frontend permits binding a secondary Gmail account after an account has already been registered with email/password.
   - *Verdict:* KEEP if planning secondary OAuth linking, or REMOVE to minimize attack surface.

2. **Native Quiz Admin Endpoints (`backend/src/routes/quizRoutes.js:240–490`):**
   - Endpoints: `GET /api/admin/quizzes`, `POST /api/admin/quizzes`, `PUT /api/admin/quizzes/:id`, `DELETE /api/admin/quizzes/:id`, `GET /api/admin/quizzes/:id/attempts`.
   - *Reason:* The Admin portal manages mock examinations exclusively via Google Forms in `mcq-tests` (`/api/admin/mcq-tests`). The native interactive quiz schema in `quizRoutes.js` has no corresponding admin UI.
   - *Verdict:* REMOVE or rebuild Admin UI to support internal native quiz creation.

3. **`GET /api/admin/live-sessions` and CRUD (`backend/src/routes/adminRoutes.js:1450–1560`):**
   - *Reason:* The Google Meet live classes module was removed from the admin navigation bar. The backend routes remain mounted but uncalled.
   - *Verdict:* REMOVE unreferenced live session routes.

4. **`POST /api/admin/orders/:id/refund` (`backend/src/routes/adminRoutes.js:1220`):**
   - *Reason:* The admin orders table displays payment records but has no "Issue Refund" button; refunds are handled manually via the Razorpay merchant dashboard.
   - *Verdict:* KEEP for future automated refund capability.

5. **Legacy Alias Routes:**
   - `POST /api/create-order` (Duplicate of `POST /api/orders/create`).
   - `POST /api/verify-payment` (Duplicate of `POST /api/orders/verify`).
   - *Reason:* Kept for backwards compatibility with older frontend build caches.
   - *Verdict:* Standardize frontend on `/api/orders/*` and deprecate aliases.
