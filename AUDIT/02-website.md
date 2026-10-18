# 02. Public Website Audit & User Action Traces

---

## 1. Directory of All Public Pages & Routes

The public website consists of **19 routes** in Next.js 16 App Router (`frontend/src/app/`):

| Route URL | Frontend File Path | Primary Function & Target Audience |
| :--- | :--- | :--- |
| `/` | `frontend/src/app/page.tsx` | Main marketing landing page (Hero, live countdowns, daily QOTD, Bare Act comparator, testimonials). |
| `/about` | `frontend/src/app/about/page.tsx` | Platform mission, CA Foundation & CSEET pedagogy, faculty profiles, and institutional standards. |
| `/courses` | `frontend/src/app/courses/page.tsx` | Searchable study codex catalog, 7-chapter CA Foundation outline, 8-unit CSEET outline, and sample previews. |
| `/subscriptions` | `frontend/src/app/subscriptions/page.tsx` | Pricing table for 30-Day Digital Passes (₹99/mo) and full curriculum bundles. |
| `/case-studies` | `frontend/src/app/case-studies/page.tsx` | Landmark case studies library with facts, statutory issues, and ICAI model answers. |
| `/offers` | `frontend/src/app/offers/page.tsx` | Promotional discount passes, active coupon codes (`LAUNCH99`, `EXEMPTION2026`), and study bundles. |
| `/reviews` | `frontend/src/app/reviews/page.tsx` | Student testimonials, exam ranker scorecards, and interactive review submission form. |
| `/contact` | `frontend/src/app/contact/page.tsx` | Student query submission form, academic email helpdesk, and WhatsApp direct chat link. |
| `/cart` | `frontend/src/app/cart/page.tsx` | Shopping cart review screen, order subtotal calculation, and coupon discount code input. |
| `/checkout` | `frontend/src/app/checkout/page.tsx` | Razorpay payment gateway execution, student shipping details form, and instant access setup. |
| `/login` | `frontend/src/app/login/page.tsx` | Unified login screen for students & admins, Google OAuth, and single-device collision resolver. |
| `/register` | `frontend/src/app/register/page.tsx` | New student account signup screen, target exam selection, and referral code input. |
| `/signup` | `frontend/src/app/signup/page.tsx` | Redirect alias (automatically redirects client to `/register`). |
| `/product/[id]` | `frontend/src/app/product/[id]/page.tsx` | Individual product sales showcase for specific study codices. |
| `/reader` | `frontend/src/app/reader/page.tsx` | Fullscreen DRM canvas PDF viewer for standalone reading outside the student dashboard. |
| `/terms` | `frontend/src/app/terms/page.tsx` | Statutory Terms & Conditions, intellectual property DRM terms, and single-device rules. |
| `/privacy` | `frontend/src/app/privacy/page.tsx` | Student data privacy policy, cookie disclosures, and Razorpay transaction privacy declarations. |
| `/refund` | `frontend/src/app/refund/page.tsx` | Digital product refund, return, and cancellation policy. |
| `/cookies` | `frontend/src/app/cookies/page.tsx` | Disclosures on session cookies and local storage tokens. |

---

## 2. Page-by-Page Audit: Sections, Controls & Trigger Traces

### Trace Format Key:
> **USER ACTION** → **Frontend File / Function** → **API Call (Method + URL)** → **Backend Handler** → **DB Read/Write** → **What the User Sees**

---

### A. Homepage (`/`) — `frontend/src/app/page.tsx`

#### Components Mounted:
1. `AnnouncementBar.tsx`: Top notification strip for flash announcements.
2. `Navbar.tsx`: Sticky navigation header with brand logo, links, cart trigger, and auth profile badge.
3. `HeroSection.tsx`: Headline, call-to-action buttons, 3D interactive book covers, and quick sample modal trigger.
4. `SubscriptionCarousel.tsx`: Auto-sliding cards displaying top study passes.
5. `SubscriptionOverview.tsx`: Course pricing grid with monthly pass highlights.
6. `ExamCountdownsAndQOTD.tsx`: Live ICAI/ICSI exam timers and daily interactive question widget.
7. `Section16ComparisonBlock.tsx`: Interactive bare act legal comparison table.
8. `FaqSection.tsx`: Accordion answering curriculum and DRM questions.
9. `Footer.tsx`: Links, copyright, and legal disclaimers.

#### User Action Traces:

- **Trigger 1: Page Load (Load Live Announcement Bar)**
  - **USER ACTION:** Visitor lands on `https://thelawkaksha.com/`.
  - **Frontend:** `AnnouncementBar.tsx` (`useEffect`, lines 30–55) loads cached announcement from `localStorage` then checks API.
  - **API Call:** `GET /api/announcement`
  - **Backend Handler:** `backend/src/routes/catalogRoutes.js` (`router.get("/announcement")`).
  - **DB Operation:** Read from MongoDB `SiteSetting.findOne({ key: "announcement" })` (or `Database.table("settings")`).
  - **User Sees:** A top-of-page banner (e.g., *"⚡ Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!"*). If disabled by admin, the bar automatically collapses.

- **Trigger 2: Click "Read Free Sample PDF" in Hero**
  - **USER ACTION:** Visitor clicks the "Read Free Sample" button in `HeroSection.tsx`.
  - **Frontend:** `HeroSection.tsx` sets modal state `isSampleModalOpen = true`, mounting `EnhancedSampleChapterModal.tsx`.
  - **API Call:** None (modal uses bundled sample asset `/notes/sale-of-goods-unit-1.pdf`).
  - **Backend Handler:** None.
  - **DB Operation:** None.
  - **User Sees:** An in-browser PDF reader pops up showing pages 1 through 12 of Unit 1 (The Sale of Goods Act, 1930) with watermarking.

- **Trigger 3: Submit Answer to Daily Question of the Day (QOTD)**
  - **USER ACTION:** Visitor clicks option B on the interactive QOTD widget in `ExamCountdownsAndQOTD.tsx`.
  - **Frontend:** `ExamCountdownsAndQOTD.tsx` (`handleOptionSelect(index)`) compares selected index with `qotd.correctOption`.
  - **API Call:** None for public visitor (if logged in as student, calls `POST /api/student/activity` to record 15 LawXP).
  - **Backend Handler:** `backend/src/routes/studentRoutes.js` (`router.post("/activity")`).
  - **DB Operation:** Updates `User.lawXp` and appends an entry to `UserStats.events`.
  - **User Sees:** Option turns emerald green (if correct) or red with an explanation box detailing Section 28 (Holding Out) under the Indian Partnership Act 1932.

- **Trigger 4: Toggle Bare Act vs. Visual Framework Comparison**
  - **USER ACTION:** Visitor clicks "Visual Flowchart View" inside `Section16ComparisonBlock.tsx`.
  - **Frontend:** `Section16ComparisonBlock.tsx` toggles active tab state between `"bare_act"` and `"visual_breakdown"`.
  - **API Call:** `GET /api/section16-comparison` (on initial mount).
  - **Backend Handler:** `backend/src/routes/catalogRoutes.js` (`router.get("/section16-comparison")`).
  - **DB Operation:** Reads cached comparison schema.
  - **User Sees:** Complex statutory text of Section 16(1) converts into a clean visual flowchart detailing the landmark case *Priest v. Last*.

---

### B. Courses Catalog (`/courses`) — `frontend/src/app/courses/page.tsx`

#### Controls & Forms:
- Search input field: Real-time filtering by course name, chapter, or keyword.
- Filter pills: "All Programs", "CA Foundation Paper 2", "CSEET Paper 2".
- Product Card Buttons: "Preview Free Sample" and "Subscribe Now (₹99/mo)".

#### User Action Traces:

- **Trigger 1: Filter Courses by Exam Stream**
  - **USER ACTION:** Visitor clicks "CA Foundation Paper 2" filter pill.
  - **Frontend:** `CoursesCatalogContent()` updates `selectedCourse = "course-ca-foundation"`.
  - **API Call:** In-memory client-side filter over `products` array loaded from `GET /api/catalog`.
  - **Backend Handler:** `backend/src/routes/catalogRoutes.js` (`router.get("/catalog")`).
  - **DB Operation:** Reads `Product.find({ status: "Active" })`.
  - **User Sees:** CSEET cards hide instantly; only the CA Foundation Business Laws Codex and Question Bank cards remain visible.

- **Trigger 2: Click "Subscribe Now"**
  - **USER ACTION:** Visitor clicks "Subscribe Now" on CA Foundation Codex card.
  - **Frontend:** `handleSubscribeNow(product)` calls `addToCart(...)` from `CartContext.tsx`, sets `isCartOpen = true`.
  - **API Call:** None yet.
  - **DB Operation:** Local cart state saved to `localStorage.lawkaksha_cart`.
  - **User Sees:** The cart sidebar slides in from the right edge with the product listed at ₹99, showing a "Proceed to Checkout" button.

---

### C. Shopping Cart & Drawer (`CartDrawer.tsx` / `/cart`)

#### Controls & Forms:
- Coupon Code input box + "Apply" button.
- Item quantity removal buttons.
- "Proceed to Razorpay Checkout" button.

#### User Action Traces:

- **Trigger 1: Apply Coupon Code**
  - **USER ACTION:** Visitor types `LAUNCH99` into coupon box and clicks "Apply".
  - **Frontend:** `CartDrawer.tsx` calls `applyCoupon("LAUNCH99")` in `CartContext.tsx`.
  - **API Call:** `GET /api/offers` or client coupon lookup.
  - **Backend Handler:** `backend/src/routes/catalogRoutes.js` (`router.get("/offers")`).
  - **DB Operation:** Reads `Coupon.findOne({ code: "LAUNCH99", is_active: true })`.
  - **User Sees:** If valid, a green badge displays *"Coupon LAUNCH99 applied: ₹20 saved"*, and the checkout subtotal updates from ₹99 to ₹79.

---

### D. Checkout Page (`/checkout`) — `frontend/src/app/checkout/page.tsx`

#### Controls & Forms:
- Form fields: Full Name, Student Email, Mobile Number, Target Exam dropdown.
- Payment Method Toggle: UPI (Google Pay, PhonePe, Paytm) vs Debit/Credit Card.
- Submit Button: "Pay & Unlock Codex Instantly".

#### User Action Traces:

- **Trigger 1: Submit Enrollment & Payment Initiation**
  - **USER ACTION:** Student fills contact details and clicks "Pay & Unlock Codex Instantly".
  - **Frontend:** `handleProcessPayment()` checks form fields, ensures Razorpay script is loaded (`https://checkout.razorpay.com/v1/checkout.js`), and calls API.
  - **API Call:** `POST /api/orders/create` with body `{ items, shippingDetails, couponCode }`.
  - **Backend Handler:** `backend/src/routes/orderRoutes.js` (`router.post("/orders/create")`).
  - **DB Operation:** Writes new pending record in `Order` collection (`status: "pending"`).
  - **User Sees:** The official Razorpay modal pops up on screen displaying the exact payable amount, QR code, and UPI payment options.

- **Trigger 2: Complete Payment in Razorpay Modal**
  - **USER ACTION:** Student scans UPI QR code and approves payment on their phone.
  - **Frontend:** Razorpay JavaScript callback triggers `options.handler(response)` with `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`.
  - **API Call:** `POST /api/orders/verify` with order ID, payment ID, HMAC signature, and browser hardware `deviceId`.
  - **Backend Handler:** `backend/src/routes/orderRoutes.js` (`router.post("/orders/verify")`).
  - **Cryptographic Verification:** Backend calculates `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(order_id + "|" + payment_id).digest("hex")`.
  - **DB Operation:**
    1. Updates `Order` status from `"pending"` to `"paid"`.
    2. Creates new document in `Payment` collection.
    3. Creates or updates `Entitlement` collection for the student (`status: "active"`, `expires_at: +30 days`).
    4. Appends unlocked book IDs into `User.unlockedItemIds`.
  - **User Sees:** Razorpay modal closes. The checkout page transitions to a green confirmation screen: *"Welcome to The Law Kaksha! Your Codex Pass is Active"*, displaying their new Roll Number (e.g. `LRK-2026-004182`) and a direct button "Open Student Dashboard".

---

### E. Unified Login Screen (`/login`) — `frontend/src/app/login/page.tsx`

#### Controls & Forms:
- Portal Switcher Tabs: "Student Portal" vs "Admin Console".
- Input fields: Email / Roll Number, Password.
- Buttons: "Sign In", "Sign in with Google", "Forgot Password?".
- Device Conflict Modal: "Log Out Other Device & Proceed".

#### User Action Traces:

- **Trigger 1: Regular Student Login**
  - **USER ACTION:** Student enters email & password, clicks "Sign In".
  - **Frontend:** `handleLogin()` calls `POST /api/auth/login` with `identifier`, `password`, and `deviceId`.
  - **Backend Handler:** `backend/src/routes/authRoutes.js` (`router.post("/login")`).
  - **DB Operation:** Reads `User.findOne({ email })`, verifies `bcrypt.compareSync(password, user.password_hash)`.
  - **Single Device Gate:** Compares `user.activeDeviceId` with incoming `deviceId`. If no conflict, updates `User.activeDeviceId` and `User.lastActiveAt = new Date()`.
  - **JWT Generation:** Signs JWT payload `{ id, email, role: "student", student_id }`.
  - **User Sees:** Redirected to `/student` dashboard with all study materials unlocked.

- **Trigger 2: Second Device Conflict**
  - **USER ACTION:** Student attempts login from a second phone while still logged in on their laptop.
  - **Frontend:** Receives HTTP 409 response with body `{ success: false, code: "DEVICE_CONFLICT", activeDeviceName: "Windows Chrome" }`.
  - **User Sees:** A warning modal appears: *"Active Session Detected on Windows Chrome. The Law Kaksha allows 1 registered device per student to prevent unauthorized account sharing. Do you wish to disconnect the other device and transfer your session here?"*.
  - **Sub-Trigger:** Student clicks "Transfer Session".
  - **Frontend:** Re-issues `POST /api/auth/login` with `forceSwitchDevice: true`.
  - **Backend Handler:** Force-updates `User.activeDeviceId = currentDeviceId` and increments `User.tokenVersion = user.tokenVersion + 1` (invalidating the first laptop's JWT immediately).
  - **User Sees:** Login succeeds; the second phone enters `/student`, while any subsequent request from the laptop will receive a `401 Unauthorized` response.

---

### F. Contact & Inquiries (`/contact`) — `frontend/src/app/contact/page.tsx`

#### Controls & Forms:
- Contact form: Name, Email, Phone, Inquiry Type, Message.
- WhatsApp Direct Chat Button: `https://wa.me/919876543210`.

#### User Action Traces:

- **Trigger 1: Submit Contact Inquiry**
  - **USER ACTION:** Visitor fills form and clicks "Send Message".
  - **Frontend:** `ContactPageContent` handles submission via local state.
  - **API Call:** None (currently simulated in frontend with local timeout and success message).
  - **Backend Handler:** NOT FOUND in `backend/src/routes/` (no dedicated inquiry submission endpoint exists; inquiries rely on WhatsApp redirect).
  - **User Sees:** A confirmation banner appears thanking the student and advising them to connect via WhatsApp for instant response.

---

## 3. Dynamic vs. Hardcoded Content Analysis

| Website Feature / Section | Sourced From Database (Admin Controlled) | Hardcoded in Frontend Source Code | Evidence File Reference |
| :--- | :---: | :---: | :--- |
| **Top Announcement Banner** | **YES** | Fallback string | Sourced from `GET /api/announcement` (`AnnouncementBar.tsx:35`). |
| **Hero Headlines & Subtitles** | NO | **YES** | Hardcoded in `HeroSection.tsx:25–45`. |
| **Course Catalog & Products** | **YES** | Initial fallback | Sourced from `GET /api/catalog` (`courses/page.tsx:185`). |
| **Active Pricing & Pass Rates** | **YES** | Initial fallback | Sourced from `Product.price` & `Subscription.price` (`catalogRoutes.js:70`). |
| **Exam Countdown Dates** | **YES** | Initial fallback | Sourced from `GET /api/admin/exam-settings` (`ExamCountdownsAndQOTD.tsx:45`). |
| **Question of the Day (QOTD)** | **YES** | Initial fallback | Sourced from `GET /api/admin/qotd` (`ExamCountdownsAndQOTD.tsx:55`). |
| **Section 16 Bare Act Table** | **YES** | Initial fallback | Sourced from `GET /api/section16-comparison` (`Section16ComparisonBlock.tsx:40`). |
| **Landmark Case Studies** | **YES** | Initial fallback | Sourced from `GET /api/case-studies` (`case-studies/page.tsx:60`). |
| **Student Reviews & Testimonials** | **YES** | Initial fallback | Sourced from `GET /api/reviews` (`reviews/page.tsx:50`). |
| **FAQ Accordions** | NO | **YES** | Hardcoded array in `FaqSection.tsx:12–65`. |
| **Footer Contact Links** | NO | **YES** | Hardcoded social & email links in `Footer.tsx:30–80`. |
