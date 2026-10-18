# 04. Student Dashboard & DRM Learning Engine Audit (`/student`)

---

## 1. Overview & Navigation Architecture

The Student Learning Portal (`frontend/src/app/student/page.tsx`, 2,881 lines) is a single-page application (SPA) containing **8 primary learning tabs**, supported by modular student components in `frontend/src/components/student/`:

```
+---------------------------------------------------------------------------------------------------+
|                                  STUDENT LEARNING CONSOLE TABS                                    |
+-------------------+-------------------+-------------------+-------------------+-------------------+
|  1. DASHBOARD     |  2. CHAPTER       |  3. YOUR          |  4. CASE          |  5. PRACTICE      |
|     HOME          |     NOTES         |     SCHEDULE      |     STUDIES       |     TESTS (MCQ)   |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| • Streak Tracking | • 7 CA Chapters   | • Exam Timelines  | • Landmark Preced.| • Timed Mocks     |
| • LawXP Ledger    | • 8 CSEET Units   | • Daily Goals     | • Statutory Issues| • Peer Attempts   |
| • Daily QOTD      | • In-Web DRM Read | • Weekly Milestones| • Model Answers   | • ICAI Guidelines |
+-------------------+-------------------+-------------------+-------------------+-------------------+
|  6. REVISION      |  7. MY PROGRESS   |  8. REFER & EARN  |                   |                   |
|     FLOWCHARTS    |     (MASTERY)     |     PROGRAM       |                   |                   |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| • LDR Summary Maps| • Unit Checkmarks | • Unique Ref Link |                   |                   |
| • Mind Maps       | • LawXP Level Bar | • XP Rewards      |                   |                   |
| • Section Matrix  | • Streak Calendar | • Peer Table      |                   |                   |
+-------------------+-------------------+-------------------+-------------------+-------------------+
```

---

## 2. Exhaustive Student Features by Tab

### Tab 1: Student Dashboard Home (`activeTab === "home"`)
- **Components:** `StudentDashboardHome.tsx`, `StudentHeroCard.tsx`, `StudentMetricStats.tsx`, `StudentRightSidebar.tsx`.
- **Features Included (7 Features):**
  1. *Personalized Welcome Greeting:* Displays student name, roll number (e.g. `LRK-2026-004182`), and registered exam session.
  2. *Daily Streak Tracker:* Flame badge showing active study streak days with automatic streak freeze protection.
  3. *LawXP Gamification Bar:* Total earned experience points (e.g. `340 LawXP`) and level progression.
  4. *Daily Study Time Meter:* Tracks active reading minutes today against daily target (e.g. `35 / 45 Minutes`).
  5. *Exam Countdown Alert:* Dynamic days-remaining ticker counting down to official ICAI or ICSI exam dates.
  6. *Jump Back In (Last Read Resource):* Instant 1-click button resuming the exact page and chapter last accessed.
  7. *Daily Question of the Day (QOTD):* Interactive question widget granting +15 LawXP upon first correct attempt.

### Tab 2: Chapter Notes & Study Codices (`activeTab === "chapters"`)
- **Features Included (6 Features):**
  1. *Stream Switcher:* Toggle between CA Foundation Paper 2 (7 Chapters) and CSEET Paper 2 (8 Units).
  2. *Curriculum Accordion:* Full chapter breakdown displaying chapter weightage in marks, units count, and estimated study duration.
  3. *Lock / Unlock Access Badges:* Visual indicators showing which chapters are unlocked under active passes versus locked.
  4. *In-Web Secure DRM Reader Trigger:* Clicking "Open Digital Notes" launches the DRM reader without exposing raw PDF URLs.
  5. *Free Sample Reader:* Allows reading designated free sample chapters even if the student has not yet purchased a pass.
  6. *Peer Reader Counter:* Social proof metric showing how many fellow students have completed the chapter this week.

### Tab 3: Your Schedule & Timelines (`activeTab === "calendar"`)
- **Component:** `StudentSchedulePanel.tsx`.
- **Features Included (4 Features):**
  1. *Weekly Study Calendar:* Daily task allocations balancing chapter reading, case analysis, and mock tests.
  2. *Interactive Streak Calendar Modal:* Clicking streak details opens `StreakCalendarModal.tsx` showing active study days in green.
  3. *Exam Milestone Countdown:* Visual milestone timeline for ICAI admit card release, mock test series, and final exams.
  4. *Session Goal Selector:* Set daily study target between 30, 45, or 60 minutes.

### Tab 4: Landmark Case Studies Library (`activeTab === "cases"`)
- **Features Included (5 Features):**
  1. *Precedent Explorer:* Curated directory of essential business law cases (*Mohoribibee v. Dharmodas Ghose*, *Salomon v. Salomon*, *Priest v. Last*, *Carlill v. Carbolic Smoke Ball*).
  2. *Structured 4-Part Analysis:* Facts of the Case, Legal Issue, Statutory Section Precedent, and Judicial Ruling.
  3. *ICAI Model Answer Rubrics:* Teaches students how to structure high-scoring descriptive answers for 6-mark exam questions.
  4. *Search by Legal Act:* Filter cases by Contract Act, Sale of Goods Act, Partnership Act, or Companies Act.
  5. *Mark as Mastered Button:* Awards LawXP points and checks off case in student progress ledger.

### Tab 5: Practice Tests & Mock Drills (`activeTab === "mcqtest"`)
- **Features Included (5 Features):**
  1. *Timed Mock Tests Grid:* Chapter-wise and full-syllabus tests with duration timers and total mark allocations.
  2. *ICAI Negative Marking Guidelines:* Instructions detailing 0.25 mark deduction for incorrect attempts.
  3. *Google Form Launch Integration:* Secure button launching the timed test form in an external verified window or modal.
  4. *Peer Attempts Metric:* Displays number of peer submissions to evaluate comparative ranking.
  5. *Instant Score Feedback:* Explanations provided for each question upon test conclusion.

### Tab 6: Revision Flowcharts & LDR Maps (`activeTab === "ldr"`)
- **Features Included (4 Features):**
  1. *Last Day Revision (LDR) Visual Maps:* High-speed recall flowcharts summarizing complete Acts onto single visual sheets.
  2. *Statutory Section Matrices:* Side-by-side tables comparing tricky provisions (e.g. Sale vs. Agreement to Sell, Condition vs. Warranty).
  3. *Full-Page Flowchart Viewer:* Zoomable DRM viewer optimized for rapid visual revision 24 hours before the exam.
  4. *Key Penalties & Timelines Cheatsheet:* Summary of critical statutory days and limitation periods.

### Tab 7: My Progress & Mastery Ledger (`activeTab === "mastery"`)
- **Features Included (5 Features):**
  1. *Chapter Completion Checkmarks:* Checkboxes allowing students to mark units as revised.
  2. *Subject Mastery Percentage:* Progress ring calculating overall syllabus readiness (e.g. `68% Complete`).
  3. *LawXP History Log:* Detailed breakdown of earned points (Daily Login +10 XP, Completed Unit +50 XP, QOTD +15 XP).
  4. *Certificate of Completion Generator:* Launches `CertificateGeneratorModal.tsx` when course mastery reaches 100%.
  5. *Study Habit Insights:* Average daily reading speed and weekly consistency score.

### Tab 8: Refer & Earn Program (`activeTab === "refer"`)
- **Features Included (4 Features):**
  1. *Unique Student Referral Code:* Auto-generated personal invite code (e.g. `REF-PARAKH-2026`).
  2. *1-Click Referral Link Generator:* Copies `https://thelawkaksha.com/register?ref=REF-xxx` to clipboard.
  3. *Reward Ticker:* Grants +100 LawXP and 10% pass discounts for every enrolled peer.
  4. *Invited Peers Table:* Tracks referral status (`pending`, `qualified`, `rewarded`).

---

## 3. Trigger & Action Traces for All Student Actions

### Trigger 1: Student Login & Single-Device Enforcement
- **STUDENT ACTION:** Student enters credentials on `/login` and clicks "Sign In".
- **Frontend Function:** `frontend/src/app/login/page.tsx` (`handleLogin()`).
- **API Call:** `POST /api/auth/login` with `{ identifier, password, deviceId, deviceName }`.
- **Backend Handler:** `backend/src/routes/authRoutes.js`.
- **DB Read/Write:**
  - Reads `User.findOne({ email })`.
  - Verifies `bcrypt.compareSync()`.
  - Single Device Check: If `user.activeDeviceId && user.activeDeviceId !== deviceId` and `lastActiveAt < 15 mins`, returns HTTP 409 `DEVICE_CONFLICT`.
  - If approved, writes `user.activeDeviceId = deviceId`, `user.lastActiveAt = new Date()`.
  - Signs JWT containing `{ id, email, role: "student", student_id, tokenVersion }`.
- **What User Sees:** Dashboard loads at `/student`; student name and active passes appear in the top header.

### Trigger 2: Access Protected Chapter Notes (In-Web DRM Canvas Reader)
- **STUDENT ACTION:** Student clicks "Open Digital Notes" on Chapter 2 (The Indian Contract Act).
- **Frontend Function:** `frontend/src/app/student/page.tsx` sets `activeReadingModal = { open: true, pdfUrl, title }`, mounting `SecurePdfReader.tsx`.
- **API Call:** `GET /api/student/gate?resourceId=res-ca-ch2` (with Bearer JWT).
- **Backend Handler:** `backend/src/routes/studentRoutes.js` (`router.get("/gate")`).
- **DB Verification:**
  - Reads `Entitlement.findOne({ user_id: req.user.id, status: "active" })` or checks `User.unlockedItemIds`.
  - Checks `User.drm_access`. If `false`, rejects with HTTP 403 `DRM_BLOCKED`.
- **Reader Rendering (DRM Mechanics):**
  - `SecurePdfReader.tsx` fetches raw bytes into an in-memory `ArrayBuffer`.
  - Renders each page into an HTML5 `<canvas>` element using PDF.js.
  - Draws dynamic diagonal watermarks across every page: `STUDENT: [Roll Number] • [Student Phone] • AUTHORIZED COPY`.
  - Attaches browser event listeners blocking `contextmenu` (right click), `keydown` (Ctrl+P, Ctrl+S, Ctrl+C, PrtScn), and CSS `@media print { display: none !important; }`.
- **What User Sees:** The full textbook renders crisply on screen with their roll number watermarked across it. Raw PDF download links are never exposed.

### Trigger 3: Reading Progress Synchronization (Timer & Minutes)
- **STUDENT ACTION:** Student reads for 15 minutes inside the DRM reader and closes the viewer.
- **Frontend Function:** `frontend/src/app/student/page.tsx` (`syncReadingProgress()`).
- **API Call:** `POST /api/student/sync-progress` with `{ minutesRead: 15, unitId: "ca-ch2-unit1", lastReadProgress: 60 }`.
- **Backend Handler:** `backend/src/routes/studentRoutes.js` (`router.post("/sync-progress")`).
- **DB Read/Write:**
  - Increments `User.todayMinutes += 15`.
  - Updates `User.lastRead = { title, url, progress: 60, date: "Just now" }`.
  - Checks if `User.todayMinutes >= User.todayGoalMinutes`: If reached, awards +20 LawXP and appends an entry to `UserStats.events`.
- **What User Sees:** Today's study time meter increments to reflect the 15 minutes read; daily goal circle turns gold.

### Trigger 4: Update Profile Information
- **STUDENT ACTION:** Student clicks profile initials icon in header and selects "Edit Profile".
- **Frontend Function:** Opens `StudentProfileModal.tsx`, student edits phone number or target exam, and clicks "Save Changes".
- **API Call:** `PUT /api/student/profile` with `{ phone, target_exam, city, state }`.
- **Backend Handler:** `backend/src/routes/studentRoutes.js` (`router.put("/profile")`).
- **DB Read/Write:** Updates `User.findOneAndUpdate({ id: req.user.id }, { phone, target_exam, city, state })`.
- **What User Sees:** Modal closes with green checkmark toast *"Profile updated successfully"*; header reflects new target exam.

### Trigger 5: Change Password
- **STUDENT ACTION:** Student submits new password in Profile / Security settings.
- **Frontend Function:** `StudentProfileModal.tsx` calls `POST /api/auth/reset-password`.
- **Backend Handler:** `backend/src/routes/authRoutes.js`.
- **DB Read/Write:**
  - Hashes new password with `bcrypt.hashSync(newPassword, 10)`.
  - Updates `User.password_hash`.
  - Increments `User.tokenVersion += 1`.
- **Side Effect:** Incremented `tokenVersion` instantly invalidates all previously issued JWT tokens across all devices.
- **What User Sees:** Success alert: *"Password updated securely. Please sign in with your new credentials."*. Student is redirected to `/login`.

---

## 4. Student Data Lifecycle & Audit Visibility

```
+-----------------------------------------------------------------------------------------------+
|                                  STUDENT DATA LIFECYCLE                                       |
+--------------------------+----------------------------+---------------------------------------+
|      DATA LIFECYCLE      |       WHERE STORED         |         WHO CAN SEE / AUDIT           |
+--------------------------+----------------------------+---------------------------------------+
| Registration / Auth      | MongoDB `User` Collection  | Student sees self; Admin views in     |
| (Name, Email, Pass Hash) | & `lawkaksha_db.json`      | Admin Hub 2 (Students Directory).     |
+--------------------------+----------------------------+---------------------------------------+
| Hardware Session         | `User.activeDeviceId`,     | Admin views device conflicts;         |
| (Device ID, Device Name) | `User.lastActiveAt`        | Student sees prompt upon conflict.    |
+--------------------------+----------------------------+---------------------------------------+
| Entitlements & Orders    | `Order`, `Payment`,        | Student sees active passes; Admin     |
| (Unlocked Books, Razorpay)| `Entitlement` collections | has full financial ledger access.     |
+--------------------------+----------------------------+---------------------------------------+
| Learning Gamification    | `User.lawXp`, `streakDays`,| Student sees stats & streak calendar;  |
| (XP, Streaks, Minutes)   | `UserStats.events`         | Admin views streak leaderboards.      |
+--------------------------+----------------------------+---------------------------------------+
```

### Can other students see my data?
- **NO.** Student learning progress, order records, and phone numbers are strictly private.
- The only public student data is the top rankers leaderboard (`GET /api/leaderboard`), which displays only the student's first name, avatar initials, and total LawXP points (no email, phone, or billing information is ever exposed).

---

## 5. What in the Student Dashboard is Controlled by Admin

| Dashboard Widget / Feature | Admin Control Center Tab | Exact Mechanism |
| :--- | :--- | :--- |
| **Top Announcement Banner** | Website Hub → Broadcast Bar | Admin enables banner and edits text; shows at top of student dashboard. |
| **DRM Digital Reading Access** | Students Hub → DRM Switch | Admin can toggle DRM permission on or off for any individual student. |
| **Courseware & Chapter Notes**| Materials Hub → Books & Notes | Admin uploads new PDFs or edits chapter titles; instantly reflects in student notes tab. |
| **Exam Countdown Timers** | Materials Hub → Exam Dates | Admin changes exam attempt date; student schedule countdown recalibrates. |
| **Daily QOTD** | Materials Hub → QOTD Editor | Admin posts new question & LawXP reward; updates daily question on student home tab. |
| **Promo Study Passes** | Website Hub → Codex Passes | Admin edits introductory ₹99 pass cards; updates upgrade banners for non-subscribed students. |
| **Mock Tests & Google Forms** | Materials Hub → MCQ Tests | Admin adds or disables mock test links; updates student Practice Tests tab. |
| **Single-Device Reset** | Students Hub → Reset Device | Admin clears student's `activeDeviceId` if student lost or replaced their mobile phone. |
