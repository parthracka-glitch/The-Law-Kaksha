# The Law Kaksha — Complete UI/UX Screen Content & Copy Specification

This document provides a concise, structured mapping of every screen in the system: hierarchy, element types, exact copy, positions, states, and responsive behavior.

---

## Group A: Public & Marketing

### 1. Home / Landing (`01-home.html`)
* **Header / Navigation**:
  * Logo: `The Law कक्षा` (Navy serif + Devanagari accent + leaf emblem)
  * Nav Links: `Courses`, `Books & PDF`, `Mains Test Series`, `Rankers`, `About Us`
  * Actions: `Student Vault (Login)` [Outline/Secondary], `Get Started` [Primary Blue Pill]
* **Hero Section (FINAL - Source of Truth)**:
  * Badge: `★ ICAI EXCELLENCE • 2026 BATCH` (Pill fill, Royal Blue)
  * H1 Heading: `Master CA Law With India's Leading Doctrine Faculty`
  * Subtitle: `Comprehensive smart question banks, high-definition video masterclasses, and encrypted DRM study materials engineered for AIR aspirants.`
  * CTA Group: `Explore 2026 Batches` [Primary Blue Pill], `Read Free Sample Chapter` [Secondary Outline Pill]
  * Trust Stats Bar:
    * `12,000+` Students Enrolled
    * `98.4%` Clear Rate in Law
    * `AIR 1, 4, 7` in Nov 2024 Exam
  * Visual Asset: 3D perspective book cover (`Smart Question Bank - Corporate & Economic Laws`) with soft leaf watermark in background.
* **Hero Carousel Slides**:
  * Slide 2 (CA Final): `Advanced Economic & Corporate Laws for CA Final` — `Complete coverage of FEMA, SEBI, PMLA & Corporate Restructuring with past 15-year statutory analysis.`
  * Slide 3 (CA Foundation): `Foundational Jurisprudence for CA Foundation` — `Indian Contract Act, Sale of Goods, Partnership & Companies Act simplified with real-case visual breakdowns.`
* **Core Pillars / Value Proposition Grid**:
  * Card 1: `Smart Question Banks` — `Past RTP, MTP, and Suggestive answers categorized section-wise.`
  * Card 2: `Encrypted DRM PDFs` — `Instant access on iOS, Android, and Desktop with offline secure reading.`
  * Card 3: `1-on-1 Mains Answer Evaluation` — `Handwritten answer sheet grading by qualified Chartered Accountants within 48 hours.`
* **Featured Publications & Courses (Carousel/Grid)**:
  * Card Titles: `Corporate & Economic Laws (Deluxe Paperback)`, `Business Laws Smart Question Bank (Digital DRM)`, `Mains Precision Test Series`
  * Action: `View Details` / `Quick Preview`
* **Rankers Wall of Fame**:
  * Heading: `Trusted by All India Rankers`
  * Quotes with verified student badges, rank number, score (e.g., `78/100 in Corporate Law`).
* **Daily Legal Challenge Mini-Widget**:
  * Pill: `DAILY JURISPRUDENCE DRILL`
  * Question text with 4 radio capsules and `Submit Answer` [Quiz Action Lime].
* **Footer**:
  * Brand manifesto, student support email, WhatsApp helpline, links to legal policies, copyright.

---

### 2. About Us (`04-about.html`)
* **Hero Header**: `Democratizing Premier Legal Education for Chartered Accountants`
* **Sub-text**: `Founded on the principles of statutory precision, conceptual clarity, and mentorship.`
* **Faculty Profile**:
  * H2: `Led by Senior Advocate & ICAI Faculty Mentors`
  * Credentials: `15+ Years Teaching Experience`, `Authored 8 Best-Selling Law Treatises`, `Mentored 50,000+ CA Aspirants`.
* **Methodology**: 4-step framework (`Conceptual Immersion`, `Statutory Keywords Memorization`, `Answer Drafting Technique`, `Exam Simulation`).

---

### 3. Contact & Student Helpdesk (`05-contact.html` & `06-contact-success.html`)
* **Header**: `Get in Touch with Academic Support`
* **Form Elements**:
  * Full Name (`input-text`)
  * Student Registration / Roll No (`input-text`, optional)
  * WhatsApp Mobile No (`input-tel`)
  * Query Category (`select-dropdown`: Books Delivery, DRM Activation, Course Mentorship, Test Series)
  * Message Box (`textarea`)
  * CTA: `Transmit Academic Query` [Primary Blue]
* **Success State**:
  * Icon: Green check circle
  * Heading: `Query Logged Successfully`
  * Subtext: `Ticket #LK-84920 has been assigned. Our academic counseling cell will respond within 4 hours.`

---

### 4. Course Catalog & Search (`07-courses.html` & `08-courses-no-results.html`)
* **Header**: `Academic Curriculum & Study Materials`
* **Filter Rail**:
  * Level: `All Levels`, `CA Foundation`, `CA Intermediate`, `CA Final`
  * Format: `Paperback Books`, `Encrypted DRM PDF`, `Video Lectures`, `Test Series`
* **Product Grid Card**:
  * 3D Book / Course Cover Art
  * Badge: `ICAI 2026 SYLLABUS`
  * Title (Serif H3)
  * Author / Batch info
  * Price: `₹1,499` `₹2,200` (Strike-through)
  * CTA: `Add to Cart` or `Unlock Vault`
* **Empty State**:
  * Line art leaf icon
  * H2: `No Statutory Modules Match Your Query`
  * CTA: `Reset Filters` [Secondary Outline]

---

## Group B: Store & E-Commerce

### 5. Product Detail Page — Paperback & Digital (`10-product-detail-paperback.html` & `11-product-detail-digital-pdf.html`)
* **Breadcrumb**: `Store > CA Intermediate > Corporate Law Question Bank`
* **Left Column**: 3D interactive book preview, sample chapter preview trigger (`👁 Sample Pages`).
* **Right Column**:
  * Title: `Corporate & Other Laws — Comprehensive Smart Question Bank (7th Edition)`
  * Badge: `IN STOCK • DISPATCHES IN 24H` / `INSTANT DRM UNLOCK`
  * Price & Discount Pill: `₹1,299` (Save 35%)
  * Selector: `Physical Paperback` vs `Digital DRM Edition`
  * Feature Highlights:
    * `100% ICAI Study Material & RTP Coverage`
    * `Case Study Based Practice Modules`
    * `Author's Mnemonics & Mind-Maps`
  * Sticky Buy Bar: `Add to Cart` + `Buy Now`
* **Tabs**: `Detailed Table of Contents`, `Author Note`, `Dispatch & Courier Logistics`, `Verified Reviews`.

---

### 6. Cart & Checkout Flow (`12-cart-empty.html`, `13-cart-populated.html`, `14-shipping-logistics-checkout.html`, `15-order-confirmation-success.html`)
* **Cart Populated**:
  * List items with quantity selector, unit price, format badge (e.g. `Physical Paperback`).
  * Order Summary sidebar: Subtotal, Shipping (Free for orders > ₹999), Promo Code input, Total Payable.
* **Checkout Stepper**:
  * Step 1: `Student Identification` (Name, Email, WhatsApp Phone)
  * Step 2: `Delivery Logistics` (Address, City, State, PIN code)
  * Step 3: `Secure Payment` (UPI, Cards, Net Banking, EMI)
* **Order Confirmation**:
  * Success Checkmark + Subtle Leaf Accent
  * Order ID: `LK-ORD-98231`
  * Download Invoice button & Instant access link to `Open Student Vault`.

---

## Group C: Authentication Flow

### 7. Login, Register & Password Recovery (`16-login.html` to `21-profile-drm-workstations.html`)
* **Card Container**: Centered white modal card with subtle leaf background glow.
* **Login Form**:
  * Email / Mobile input
  * Password input with show/hide eye toggle
  * Action: `Sign In to Student Vault` [Primary Blue]
  * Secondary: `Login via WhatsApp OTP` [Outline Secondary]
  * Links: `Forgot Password?`, `New student? Create Account`.
* **Registration**:
  * Full Name, Email, Mobile, CA Level (Foundation/Inter/Final), Target Exam Month/Year.
* **DRM Workstations Manager**:
  * H2: `Authorized Learning Workstations (Active 2 of 2 Devices)`
  * Device list cards: `MacBook Pro (Authorized Sep 12)`, `iPad Air (Authorized Oct 04)`.
  * Action: `De-register Device` button with confirmation.

---

## Group D: Student Portal & Learning Systems

### 8. Student Vault (`22-student-vault.html` & `23-student-vault-empty.html`)
* **Top App Bar**: Breadcrumbs, Notification bell, Search bar, Profile avatar.
* **Hero Banner**: `Continue Reading: Corporate Law — Volume 2` (68% Complete, Last read 2 hours ago) + `Resume Reading` CTA.
* **Library Tabs**: `All Modules (6)`, `DRM eBooks (3)`, `Video Masterclasses (2)`, `Test Series (1)`.
* **Grid Card**: Book/course card with visual progress bar (Royal Blue for in-progress, Emerald Green for 100% completed).

---

### 9. Secure DRM PDF Reader (`24-secure-drm-pdf-reader.html`)
* **Reader Chrome**: Minimalist header with book title, chapter title, page stepper (`Page 142 of 380`), zoom controls, single/double page view, bookmark toggle.
* **Canvas Area**: High-definition text layout with dynamic watermark (`Parakram S. • reg_id: CA-2024-892`).
* **Sidebar Drawer**: Search within book, Table of Contents tree, saved highlights/notes.

---

### 10. Masterclass Video Player (`25-masterclass-video-player.html`)
* **Video Screen**: 16:9 player with custom speed selector (1x, 1.25x, 1.5x, 2x), resolution selector, chapter bookmarks.
* **Right Panel**: Lecture Playlist with completion ticks, Faculty notes PDF download, Ask Doubt shortcut.

---

### 11. Chat & Doubt Helpdesk (`26-ask-faculty-doubt.html`)
* **Drawer Panel**:
  * Header: `Faculty Doubt Cell — Corporate Law`
  * Status: `● CA Faculty Online • Avg reply 15 mins`
  * Message thread with student bubbles (Royal Blue) and faculty responses (White with navy border).
  * Input capsule with 📎 PDF/Screenshot attachment and ➤ Send.

---

### 12. Daily Challenge Quiz (`27-daily-challenge-correct.html` & `28-daily-challenge-incorrect.html`)
* **Modal Dialog**:
  * Top Progress: Coral indicator line, `QUESTION 03 OF 05 • TIME REMAINING 01:45`
  * H2 Question: `Under Section 135 of Companies Act 2013, what is the net profit threshold for CSR applicability?`
  * Option Capsules: 4 choices with radio indicator.
  * Correct State: Green pill highlight + Statutory reference citation explanation.
  * Incorrect State: Coral highlight + Correct answer breakdown.
  * Footer: `Back` [Ghost] and `Next Question` [Lime Quiz Action].

---

## Group E: Admin Console

### 13. Admin Dashboard & Operations (`29-admin-dashboard.html` to `33-mains-evaluation-grading.html`)
* **Nav Rail**: `Dashboard`, `Orders & Dispatch`, `Academic Catalog`, `Mains Grading Desk`, `DRM Keys`, `Students`.
* **Metrics Row**: `Daily Revenue`, `New Enrollments`, `Pending Dispatches`, `Pending Mains Answer Sheets`.
* **Orders Table**: Order #, Customer, Book Title, Logistics Tracking, Status Pill, Thermal Packing Slip Print trigger.
* **Mains Answer Grading Desk**: Split view — Student submitted PDF on left, ICAI Model Answer Scheme & Scoring Rubric on right, annotation tools, total marks input, `Submit Evaluated Copy` CTA.

---

## Group F, G, H: Errors, Maintenance & Legal

### 14. Error Pages & System Maintenance (`34-drm-device-keys.html` to `38-system-maintenance.html`)
* **404**: `Statutory Citation Not Found` — `The legal provision or page you requested does not exist in our curriculum index.`
* **500**: `Server Doctrine Interrupted` — `Our academic server encountered a temporary glitch. Engineers are resolving it.`
* **403**: `DRM Device Quota Exceeded` — `You have reached the maximum limit of 2 active devices for this encrypted publication.`

### 15. Legal Policies (`39-terms-of-service.html`, `40-privacy-doctrine.html`, `41-refund-replacement-policy.html`)
* **Format**: Single-column clean legal layout with clause numbering, high-contrast headings, and last updated timestamps.
