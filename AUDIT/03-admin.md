# 03. Administrative Control Center Audit (`/admin`)

---

## 1. Overview & Navigation Architecture

The Administrator Portal (`frontend/src/app/admin/page.tsx`, 4,841 lines) is a single-page management console organized into **5 Navigation Hubs** containing **16 functional tab workspaces**:

```
+---------------------------------------------------------------------------------------------------+
|                                  ADMIN CONSOLE NAVIGATION HUBS                                    |
+-------------------+-------------------+-------------------+-------------------+-------------------+
|  1. DASHBOARD     |  2. STUDENTS      |  3. STUDY         |  4. ORDERS &      |  5. WEBSITE &     |
|     OVERVIEW      |     DIRECTORY     |     MATERIALS     |     SALES         |     BRANDING      |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| • Platform KPIs   | • Search Directory| • Books & Notes   | • Orders & Bookings| • Live Broadcast |
| • Revenue Ledger  | • DRM Permission  | • Case Studies    | • Subscriptions   | • Hero Carousel   |
| • Quick Actions   | • WhatsApp Connect| • MCQ Practice    | • Discount Coupons| • Student Passes  |
| • Quick Metrics   | • CSV Export      | • Exam Dates/QOTD | • Payments Ledger | • Offers & Bundles|
|                   |                   |                   | • Expenses & P&L  | • Platform Config |
+-------------------+-------------------+-------------------+-------------------+-------------------+
```

---

## 2. Exhaustive Tab Directory & Feature Breakdown

### Hub 1: Dashboard Overview (`activeTab === "overview"`)
- **Purpose:** Central intelligence panel giving real-time platform statistics, monthly income summaries, and quick shortcuts.
- **Features Inside (5 Features):**
  1. *Quick Metric Badges:* Total Students Count, Active Subscriptions, Total Digital Notes published, and Estimated Monthly Revenue.
  2. *Connection Status Monitor:* Real-time ping displaying whether the application is connected live to MongoDB Atlas or running on the local fault-tolerant JSON cache.
  3. *Recent Orders Ticker:* Chronological stream of recent transactions with student names and amounts.
  4. *P&L Snapshot:* Net balance calculation (Gross Student Revenue minus Operating Expenses).
  5. *1-Click Action Bar:* Quick modal shortcuts to "Add New Book", "Post Announcement", or "Create Discount Coupon".

### Hub 2: Students Directory (`activeTab === "students"`)
- **Purpose:** Full audit and access control directory for all registered students.
- **Features Inside (6 Features):**
  1. *Instant Search & Status Filter:* Live filtering by student name, roll number, email, or status (`all`, `active`, `blocked`).
  2. *DRM Access Master Switch (1-Click):* Instant toggle button enabling or completely revoking student DRM reading rights (`drm_access: true/false`).
  3. *Single-Device Reset:* Revokes `activeDeviceId` and resets session token to allow students who changed phones to re-register their new device.
  4. *1-Click WhatsApp Direct Chat:* Deep links directly into a pre-filled WhatsApp chat to resolve student doubts or send account credentials.
  5. *Student Detail & Edit Modal:* Allows manually modifying student exam stream (CA Foundation vs CSEET), roll number, or phone.
  6. *Export Students to CSV:* Generates an instant downloadable spreadsheet file of student contact details.

### Hub 3: Study Materials & Courseware (4 Workspaces)

#### Tab 3A: Books & Chapter Notes (`activeTab === "books_and_notes"`)
- **Purpose:** Manage core digital codices (CA Foundation Business Laws Codex, CSEET Codex) and chapter-by-chapter PDF notes.
- **Features Inside (7 Features):**
  1. *Material Filter Pills:* "All", "Digital Books (Codices)", "Chapter Notes", "LDR Visual Maps".
  2. *Add/Edit Product Modal:* Configure book title, category, format, price, original MRP, and unit outline.
  3. *Add/Edit Chapter Resource Modal:* Upload notes, assign Act name (e.g. *The Sale of Goods Act, 1930*), chapter number, and page count.
  4. *Direct Cloudinary Cloud Uploader:* Integrates drag-and-drop file upload to Cloudinary CDN, automatically retrieving a secure HTTPS URL.
  5. *Free Sample Pages Range Limiter:* Designate specific preview page bounds (e.g. pages 1–12) for public non-paying visitors.
  6. *In-App Inspector PDF Preview:* Renders the PDF in a popup canvas reader directly inside the admin console so the owner can verify formatting before publishing.
  7. *Delete Resource Safety Gate:* Deletion confirmation alert preventing accidental removal of live curriculum notes.

#### Tab 3B: Case Studies Library (`activeTab === "cases"`)
- **Purpose:** Manage landmark legal precedents, facts summaries, and ICAI/ICSI model answers.
- **Features Inside (4 Features):**
  1. *Add New Landmark Case Modal:* Input case title, legal Act, precedent citation (e.g. *Priest v. Last*), facts scenario, and marks weightage (e.g. 6 Marks).
  2. *Edit Case Facts & Model Answer:* Rich text editor for drafting examiner marking traps and statutory section references.
  3. *Display Toggles:* "Show on Public Website" vs "Exclusive to Student Dashboard".
  4. *Delete Case Study:* Removes case study from both website and student dashboard.

#### Tab 3C: MCQ Tests & Mock Drills (`activeTab === "mcq"`)
- **Purpose:** Link and configure Google Forms-based timed mock examinations and internal quiz drills.
- **Features Inside (5 Features):**
  1. *Add MCQ Test Modal:* Enter test title, target course (CA, CS, or Both), duration (in minutes), total marks, and embedded Google Form URL.
  2. *In-Admin Form Preview Modal:* Embeds the Google Form in an iframe dialog so the admin can test question formatting and submission responsiveness.
  3. *Question Count & Negative Marking Indicators:* Configures ICAI test parameters (0.25 negative marks disclaimer).
  4. *Status Switch:* Toggle test between "Active" and "Draft".
  5. *Delete Test:* Permanently deletes mock drill from student test schedule.

#### Tab 3D: Exam Dates & Question of the Day (`activeTab === "exam_countdown_qotd"`)
- **Purpose:** Manage upcoming ICAI / ICSI official exam target dates and configure the daily rotating Question of the Day (QOTD).
- **Features Inside (4 Features):**
  1. *Exam Countdown Date Picker:* Update official examination dates for CA Foundation (e.g. December 2026) and CSEET (e.g. November 2026).
  2. *QOTD Editor Form:* Form to set question prompt, statutory section reference, 4 multiple choice options, correct answer index, and explanatory note.
  3. *LawXP Reward Assigner:* Designates bonus LawXP awarded to students who answer correctly (default: 15 XP).
  4. *Sync to Live Platforms:* Pushes the updated question instantly to both the public homepage widget and the student dashboard.

### Hub 4: Orders, Subscriptions & Revenue (5 Workspaces)

#### Tab 4A: Orders & Bookings (`activeTab === "orders"`)
- **Purpose:** Complete transactional record of all student purchases and payment statuses.
- **Features Inside (5 Features):**
  1. *Searchable Order Table:* Filter by Order ID, student name, email, or date.
  2. *Status Badges:* Displays "Paid", "Pending", "Failed", or "Refunded".
  3. *Payment Gateway ID Reference:* Cross-references the Razorpay Payment ID (`pay_xxx`) and Razorpay Order ID (`order_xxx`).
  4. *1-Click WhatsApp Order Receipt Generator:* Creates a deep link with a formatted payment receipt to send to the student.
  5. *Export Orders to CSV:* Downloads full financial order ledger as a spreadsheet.

#### Tab 4B: Subscriptions & Study Passes (`activeTab === "subscriptions"`)
- **Purpose:** Track 30-day active student passes, expiration dates, and renewal notifications.
- **Features Inside (5 Features):**
  1. *Subscription Filter Tabs:* "All", "Active", "Expiring Soon (< 5 Days)", "Revoked".
  2. *Automated WhatsApp Expiry Reminder Generator:* Generates a 1-click personalized WhatsApp message: *"Hello [Name], your 30-Day Study Pass expires in [X] days. Renew for ₹99..."*.
  3. *Manual Access Revocation:* Instantly cancels study pass and removes unlocked books from the student's dashboard.
  4. *Add Manual Subscription:* Admin can manually grant access to a student who paid via offline bank transfer or UPI cash.
  5. *Renewal Link Generator:* Generates pre-filled checkout link for the student.

#### Tab 4C: Discount Coupons (`activeTab === "coupons"`)
- **Purpose:** Create, track, and expire discount promo codes.
- **Features Inside (5 Features):**
  1. *Add Coupon Modal:* Set uppercase code (e.g. `EXEMPTION2026`), discount percentage (e.g. 20%), minimum order amount, and usage limit.
  2. *Expiry Date Picker:* Automatically disables coupon after a set calendar date.
  3. *Usage Counter Tracker:* Displays how many times the coupon has been used versus its limit.
  4. *Status Switch:* Toggle coupon between "Active" and "Disabled".
  5. *Delete Coupon:* Removes coupon from database.

#### Tab 4D: Payments Ledger (`activeTab === "payments"`)
- **Purpose:** Direct reconciliation ledger showing raw Razorpay payments received, gateway payment IDs, and transaction timestamps.
- **Features Inside (3 Features):**
  1. *Gateway Reconciliation Table:* Lists payment ID, order ID, payment method (UPI / NetBanking / Card), and currency amount.
  2. *Status Audit:* Confirms webhook verification integrity.
  3. *Transaction Search:* Instant lookup by Razorpay payment ID.

#### Tab 4E: Expenses & P&L Ledger (`activeTab === "expenses"`)
- **Purpose:** Operational expenditure tracking and profit-and-loss calculation for running the platform.
- **Features Inside (5 Features):**
  1. *Add Expense Modal:* Enter title, category (*Hosting, Cloudinary, Content Drafting, Legal, Marketing*), amount, and date.
  2. *P&L Summary Card:* Live calculation of Total Gross Revenue minus Total Operating Expenses = Net Profit Margin.
  3. *Expense Category Breakdown:* Visual tag distribution showing where operating capital is spent.
  4. *Delete / Edit Expense:* Adjust accounting ledger entries.
  5. *Receipt URL Attachment:* Store Cloudinary link to official vendor invoice.

### Hub 5: Website & Branding (5 Workspaces)

#### Tab 5A: Live Broadcast Bar (`activeTab === "broadcast"`)
- **Purpose:** Emergency top banner controller displayed across the entire public website.
- **Features Inside (4 Features):**
  1. *Master Power Switch:* Turn banner on or off with 1 click.
  2. *Broadcast Message Textbox:* Edit live message text (e.g. *"⚡ ICAI Exam Revision Marathons starting this weekend!"*).
  3. *Badge Tag Selector:* Choose tag text (*OFFER, URGENT, NOTICE, NEW*).
  4. *Destination Link Input:* Make the banner clickable by pointing it to `/courses`, `/offers`, or a WhatsApp group.

#### Tab 5B: Homepage Hero Carousel (`activeTab === "carousel"`)
- **Purpose:** Manage sliding visual cards featured on the public homepage.
- **Features Inside (4 Features):**
  1. *Add Slide Modal:* Configure slide title, subtitle, CTA label (*"Explore Pass"*), CTA link, and rating badge.
  2. *Slide Reordering:* Set numerical `display_order` to control which slide appears first.
  3. *Slide Active Toggle:* Enable or hide specific promotional slides without deleting them.
  4. *Delete Slide:* Permanently removes slide from homepage.

#### Tab 5C: Student Dashboard Codex Passes (`activeTab === "promo_banners"`)
- **Purpose:** Configure promotional banner cards that appear inside the student dashboard when an enrolled student has not yet unlocked secondary modules.
- **Features Inside (4 Features):**
  1. *Card Stream Switcher:* Edit CA Foundation Pass vs CSEET Pass card content.
  2. *Title, Pricing & Features List Editor:* Update introductory pass rates (e.g. ₹99) and feature bullet points.
  3. *Live Stream Preview:* Shows exactly how the promo pass appears inside the student's dashboard view.
  4. *Save & Push Live:* Dispatches a custom window storage event updating all connected student sessions in real time.

#### Tab 5D: Platform Settings (`activeTab === "settings"`)
- **Purpose:** Global academic configuration, contact telephone numbers, and email notification defaults.
- **Features Inside (3 Features):**
  1. *Platform Brand Config:* Support WhatsApp number, academic inquiry email, and default currency symbol.
  2. *DRM Global Watermark Format:* Configure default text appended to canvas watermarks (e.g. *"Property of The Law Kaksha • User Roll Number"*).
  3. *Save Settings Button:* Writes configuration to MongoDB `SiteSetting` collection.

#### Tab 5E: Promotional Offers & Bundles (`activeTab === "offers"`)
- **Purpose:** Manage limited-time combo offers displayed on `/offers` and marketing cards.
- **Features Inside (3 Features):**
  1. *Add Offer Modal:* Set title, promotional description, banner graphic, and linked coupon code.
  2. *Active Date Range:* Configures start and end dates for flash sales.
  3. *Delete Offer:* Removes promo card from website.

---

## 3. Action Traces for Common Admin Workflows

### Workflow 1: Add a New Chapter Note (Upload PDF)
- **ADMIN ACTION:** Admin opens Study Materials → Books & Notes, clicks "Add Chapter Note", fills title, selects PDF file from computer, and clicks "Save Note".
- **Frontend Function:** `frontend/src/app/admin/page.tsx` (`handleFileUpload()` then `handleSaveResource()`).
- **File Upload API:** `POST /api/admin/upload` with `FormData(file)`.
- **Backend Upload Handler:** `backend/src/routes/adminRoutes.js` (`router.post("/upload")`) streams file buffer to Cloudinary CDN via `cloudinary.uploader.upload_stream` and returns secure URL `https://res.cloudinary.com/.../note.pdf`.
- **Resource Save API:** `POST /api/admin/resources` with payload `{ title, actName, chapterNumber, pdfUrl, isSample, pages }`.
- **Backend Resource Handler:** `backend/src/routes/adminRoutes.js` (`router.post("/resources")`).
- **DB Change:** Inserts new document in MongoDB `Resource` collection and appends to `Database.table("resources")`.
- **Side Effects:**
  - Admin view immediately updates table.
  - Public website `/courses` lists the new note under the respective Act.
  - Enrolled students immediately see the new note in `/student` under the Chapter Notes tab.

### Workflow 2: Block / Revoke Student DRM Rights
- **ADMIN ACTION:** Admin navigates to Students Hub, finds a student exhibiting suspicious device switching, and clicks the "DRM: Active" button to toggle it to "DRM: Blocked".
- **Frontend Function:** `frontend/src/app/admin/page.tsx` (`handleToggleStudentDrm(student)`).
- **API Call:** `PUT /api/admin/students/:id` with body `{ drm_access: false }`.
- **Backend Handler:** `backend/src/routes/adminRoutes.js` (`router.put("/students/:id")`).
- **DB Change:** MongoDB executes `User.findOneAndUpdate({ id: req.params.id }, { drm_access: false })`.
- **Side Effects:**
  - When the student next attempts to click "Open Reader" in `/student`, the client calls `GET /api/student/gate`.
  - Backend returns HTTP 403 `DRM_BLOCKED`.
  - Student is presented with an error modal: *"Your in-web digital reading permissions have been temporarily suspended. Please contact academic support."*.

### Workflow 3: Update Top Broadcast Announcement Bar
- **ADMIN ACTION:** Admin switches to Website Hub → Live Broadcast Bar, types *"⚡ ICAI Exam Revision Marathons starting this weekend!"*, toggles status to "Live", and clicks "Save Announcement".
- **Frontend Function:** `frontend/src/app/admin/page.tsx` (`handleSaveAnnouncement()`).
- **API Call:** `POST /api/admin/announcement` with `{ announcement: { enabled: true, text: "...", badge: "NOTICE" } }`.
- **Backend Handler:** `backend/src/routes/adminRoutes.js` (`router.post("/announcement")`).
- **DB Change:** Upserts MongoDB `SiteSetting.findOneAndUpdate({ key: "announcement" }, { value: announcement })`.
- **Side Effects:**
  - Window dispatches custom event `lawkaksha_announcement_updated`.
  - Any user visiting or refreshing any public page (`/`, `/courses`, etc.) instantly receives the new announcement banner at the top of their screen.

---

## 4. Change Impact Map (Admin Action → System Reaction)

This matrix maps every administrative action to the exact database change and every screen across the platform that immediately reflects it:

| Admin Does This | Database Data Changed | Website Reflection | Student Dashboard Reflection | Admin Panel Reflection |
| :--- | :--- | :--- | :--- | :--- |
| **Creates new Study Book / Codex** | Inserts record into `Product` collection. | Shows in `/courses` catalog & `/product/[id]` sales page. | Displays in Student Explore tab as available for purchase. | Appears in Books & Notes table with sales analytics. |
| **Uploads new Chapter PDF Note** | Inserts record into `Resource` collection. | Listed under chapter curriculum in `/courses`. | Unlocked in Student "Chapter Notes" tab for DRM reading. | Shows in Study Materials list with preview & edit buttons. |
| **Toggles Student DRM Access** | Updates `User.drm_access` (`true` or `false`). | None (public unaffected). | If `false`, student reading reader is blocked immediately. | Status badge switches between green (Active) and red (Blocked). |
| **Creates Discount Coupon** | Inserts record into `Coupon` collection. | Usable in Cart Drawer & `/checkout`. | Usable by student when renewing passes. | Appears in Coupons tab with usage count tracker. |
| **Edits Exam Countdown Date** | Updates `SiteSetting` / `examSettings`. | Live countdown clock on homepage ticks to new date. | Countdown badge in Student Schedule Panel updates. | Countdown editor displays new target attempt date. |
| **Updates Daily QOTD** | Updates `SiteSetting` (`key: "qotd"`). | Homepage QOTD widget displays new question & options. | Student Dashboard displays new question for daily 15 LawXP. | Shows updated question in QOTD admin form. |
| **Turns on Broadcast Bar** | Updates `SiteSetting` (`key: "announcement"`). | Top announcement bar appears on every public page. | Appears at the top of the student dashboard header. | Broadcast status strip indicates "● Live / Active". |
| **Logs Operating Expense** | Inserts record into `Expense` collection. | None (internal accounting). | None (confidential to admin). | P&L summary instantly recalculates Net Profit Margin. |
| **Revokes Student Subscription** | Updates `Subscription.accessStatus = "Revoked"`. | None. | Student's active pass expires; book reverts to locked state. | Subscription row highlights red as "Revoked". |

---

## 5. Administrative Roles & Permissions

- **Current Implementation:** Single-tier Super Administrator (`role: "admin"`).
- **Authentication Check:** Enforced by `backend/src/middleware/authMiddleware.js` (`requireAdmin`).
- **Role Verification:** Every `/api/admin/*` route verifies:
  1. Header contains valid signed JWT (`jwt.verify`).
  2. Database user record contains `role === "admin"`.
  3. If a student token is passed to any `/api/admin/*` endpoint, the server returns HTTP 403: *"Access denied. Administrator privileges required."*.
- **Sub-Roles (Editor, Support, Reviewer):** NOT FOUND. The database schema does not currently support granular sub-roles (such as a Content Editor who cannot see financial revenue). All admin users possess universal access to all 16 workspaces.
