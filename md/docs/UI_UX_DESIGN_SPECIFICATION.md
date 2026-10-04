# The Law Kaksha — Complete UI/UX Design & Copy Specification

> **For UI/UX Designers**: This document defines the exact layout hierarchy, component roles, screen positions, and UI copy text for every screen across **The Law Kaksha** platform. Use this as the single source of truth for creating design mockups, wireframes, and component libraries.

---

## 🎨 Design System Foundations

### Core Color Palette
* **White (`#FFFFFF`)**: Primary canvas, clean card surfaces, and default content backgrounds.
* **Deep Navy (`#0A192F` / `#0F172A`)**: Primary text, brand foundation, and high-contrast editorial headings.
* **Royal Blue (`#1D4ED8` / `#2563EB`)**: Primary actions, key callouts, and interactive highlights.
* **Bright Blue (`#3B82F6` / `#60A5FA`)**: Emphasis, active tabs, focused states, and selected pills.
* **Soft Blue (`#F0F7FF` / `#EFF6FF`)**: Subtle atmospheric background washes, tinted sections, and container fills.
* **Cool Grey (`#64748B` / `#94A3B8`)**: Secondary text, captions, timestamps, and placeholder copy.
* **Thin Blue Border (`#DBEAFE` / `#E2E8F0`)**: Subtle hairline dividers, card borders, and input outlines.
* **Accent Success (`#10B981`)**: Verified ranker tags, dispatch confirmation, and correct MCQ answers.

### Typography System
* **Editorial Headings (Elegant Serif)**: `Playfair Display` / `Cormorant Garamond` / `Merriweather`
  * *Usage*: Major hero titles, section headings, book titles, editorial quotes, and important ranker numbers.
  * *Style*: High-contrast, dignified, academic authority with occasional Royal Blue emphasis spans.
* **Interface & Body (Clean Sans-Serif)**: `Inter` / `Plus Jakarta Sans` / `system-ui`
  * *Usage*: Navigation links, body paragraphs, forms, tables, buttons, tags, and data controls.
  * *Style*: Clear, readable, modern functional UI typography.
* **Heading Scale**: H1 (36–48px Serif Bold), H2 (28–34px Serif Semi-Bold), H3 (20–24px Serif/Sans Medium), Body (14–16px Sans Regular), Captions/Badges (11–13px Sans Medium).

### Visual Language & Styling Rules
* **Clean White Canvas**: Generous whitespace, airy breathing room, and minimalist elegance.
* **Soft Atmospheric Shapes**: Gentle soft blue gradients and subtle blur accents in section backdrops.
* **Subtle Shadows**: Low-elevation, refined shadows (`box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05)`) instead of heavy dark drop-shadows.
* **Restrained Corner Radius**: Rounded UI elements without excessive pill rounding (Standard: `8px` to `12px` / `rounded-lg`).
* **Thin Blue Hairline Borders**: 1px subtle borders (`#DBEAFE`) giving structure without visual noise.

### Signature Decorative System: The Controlled Leaf Motif
* **Design Philosophy**: Used as a deliberate, high-end editorial flourish — *intentional, subtle, never overwhelming*.
* **Approved Placements**:
  1. *Hero Backgrounds*: Faint, low-opacity watermark motif framing the book showcase.
  2. *Section Transitions*: Subtle divider flourish between major editorial zones.
  3. *Empty States*: Stylized leaf line-art in empty carts, no-submission states, or cleared notifications.
  4. *Selective Cards*: Delicate corner watermark on Top Ranker awards and Mastermind combo cards.
  5. *Authentication Screens*: Minimal backdrop accent on Login and Registration containers.
  6. *Success States*: Celebratory botanical flourish alongside the green checkmark on Order Confirmation.
  7. *Footer & Marketing Areas*: Grounding floral insignia near the brand mission statement.
* **Unapproved Placements**: Not used inside dense data tables, checkout inputs, PDF reader canvas, or admin desks.
* **Brand Logo**: Remains completely untouched in its authentic legal iconography.

### Component Personality Guide
* **Primary Button**: Royal Blue fill (`#1D4ED8`) → Pure White text (`#FFFFFF`) → Subtle hover depth / slight brightness shift.
* **Secondary Button**: Crisp White background (`#FFFFFF`) → Thin Royal Blue border (`1.5px #1D4ED8`) → Royal Blue text (`#1D4ED8`).
* **Cards & Panels**: Crisp White surface → Very subtle hairline border (`#DBEAFE`) → Light ambient shadow → Restrained radius (`10px`).
* **Sections**: Alternating Pure White (`#FFFFFF`) and Soft Blue (`#F0F7FF`) with generous vertical padding (`py-16` to `py-24`).
* **Headings**: Dark Navy Serif with select keywords highlighted in Royal Blue.
* **Form Inputs**: White background → `#E2E8F0` border (focus: `#2563EB` with `0 0 0 3px rgba(37,99,235,0.1)`) → Deep Navy text.
* **Badges & Pills**: Soft Blue fill (`#EFF6FF`) → Royal Blue text (`#1D4ED8`) → Subtle rounded pill shape.

### Page Ecosystem Density System
Each area of the platform maintains the shared brand DNA while adopting its purposeful density:
* **1. Marketing Pages (`/`, `/about`, `/reviews`)**: *Editorial / Spacious / Premium* — Large serif headlines, generous whitespace, rich book photography, and subtle leaf motif flourishes.
* **2. Store & Catalog (`/courses`, `/product/[id]`)**: *Product-Focused / Structured / Commercial* — Clear card grids, prominent edition switchers, pricing comparison badges, and trust indicators.
* **3. Checkout Flow (`/cart`, `/checkout`)**: *Trust-Focused / Minimal / Distraction-Free* — Clean white canvas, high-contrast security seals, simple inputs, zero extraneous navigation links.
* **4. Student Vault LMS (`/student`, PDF Reader, Video Player)**: *Functional / Information-Dense but Clean* — Structured library tabs, high-contrast study tools, uncluttered dark/light reader canvas, and crisp status tags.
* **5. Admin Console (`/admin`)**: *Data-Oriented / Compact / Systematic* — High data density, condensed tables, fast status toggles, clear action buttons, and minimal decorative elements.
* **6. Legal & Policy Pages (`/terms`, `/privacy`)**: *Highly Readable / Typography-First* — Clean single-column layout, comfortable line-height (1.75), distinct section anchors, and clear clause numbering.
* **7. System & Error States (`/404`, `/500`, `/403`)**: *Minimal / Branded / Clear* — Centered illustration with botanical accent, empathetic copy, and prominent primary navigation button.

---

## 🧭 Shared Global Components

### 1. Top Navigation Bar (Fixed Header)
* **Position**: Fixed top across all public pages (`z-50`)
* **Left Element**: Logo Brand Mark (`Scale of Justice` icon + text: `"THE LAW KAKSHA"` | Sub-badge: `"CA LAW EXCELLENCE"`)
* **Center Links**:
  * Link 1: `"Courses"` (href: `/courses`)
  * Link 2: `"About Faculty"` (href: `/about`)
  * Link 3: `"Ranker Reviews"` (href: `/reviews`)
  * Link 4: `"Contact Us"` (href: `/contact`)
* **Right Elements**:
  * Shopping Cart Trigger: Cart Icon + Badge `"[Count]"` + Price Preview `"[₹ Total]"`
  * Auth Button (Logged Out): `"Sign In"` (Solid button / Amber border)
  * Auth Button (Student Logged In): `"My Vault"` (Emerald badge with user name)
  * Auth Button (Admin Logged In): `"Admin Console"` (Indigo badge)
* **Mobile Drawer**: Hamburger icon opening slide-out menu with all links and sign-in button.

### 2. Slide-Over Shopping Cart Drawer
* **Position**: Slide-in drawer from right screen edge (`z-50`)
* **Header**: `"Your Learning Basket"` | Item Counter: `"[N] items"` | Close `[✕]`
* **Item Card**:
  * Thumbnail, Product Title, Selected Format pill (`"DRM Protected PDF"` / `"Deluxe Paperback"` / `"Combo"`)
  * Quantity Controller (`[-]` `[Qty]` `[+]`) | Delete Icon
  * Live Item Price (`"₹[Price]"` | Strikethrough `"₹[Orig]"`)
* **Coupon Section**: Input placeholder: `"Enter coupon code"` | Action Button: `"Apply"` | Microcopy: `"Use CALAW20 for 20% off"`
* **Summary Box**:
  * Line 1: `"Subtotal"` -> `"₹[Amount]"`
  * Line 2: `"Coupon Discount"` -> `"- ₹[Amount]"`
  * Line 3: `"Courier Delivery"` -> `"FREE"` / `"₹[Amount]"`
  * Line 4: `"Total Payable"` -> `"₹[Total]"` (Bold Accent)
* **Action CTAs**:
  * Button 1 (Primary Solid): `"Proceed to Checkout →"`
  * Button 2 (Subtle Text): `"Continue Exploring"`

### 3. Global Footer
* **Position**: Page bottom across all public pages
* **Column 1 (Brand)**:
  * Brand Logo + Tagline: `"Pioneering conceptual clarity, bare-act drafting, and exam-oriented precision for CA Foundation, Inter & Final aspirants."`
  * Accreditation Tag: `"Aligned with ICAI New Education & Training Scheme 2026-2027"`
* **Column 2 (Curriculum Links)**:
  * Heading: `"Academic Offerings"`
  * Links: `"CA Foundation Business Laws"`, `"CA Intermediate Corporate Laws"`, `"CA Final Economic Laws"`, `"Mains Evaluation Test Series"`
* **Column 3 (Student Support)**:
  * Heading: `"Student Helpdesk"`
  * Links: `"Track Order Dispatch"`, `"DRM PDF Access Guide"`, `"Faculty Doubts Desk"`, `"Contact Support"`
* **Column 4 (Newsletter & Legal)**:
  * Heading: `"Stay Updated with MCA Amendments"`
  * Input: `"Enter student email"` | Button: `"Subscribe"`
  * Legal Policy Buttons: `"Privacy Policy"`, `"Terms of Service"`, `"Shipping Policy"`, `"Refund Policy"`
* **Bottom Bar**:
  * Left: `"© 2026 The Law Kaksha. All rights reserved."`
  * Right: `"Crafted for Future Chartered Accountants"`

---

## 📄 Section 1: Public Storefront & Marketing Pages

---

### Page 1: Home / Landing Page (`/`)

#### 1.1 Top Announcement Banner
* **Position**: Sticky bar above navbar
* **Text**: `"🔥 ICAI 2026-2027 New Scheme Codices Now Available | Get Instant DRM PDF + Express Pan-India Physical Dispatch"`
* **Action Link**: `"Explore Codices →"`

#### 1.2 Hero Carousel Section
* **Position**: Top viewport fold
* **Layout**: 2-Column Grid (Left: Copy & CTAs | Right: 3D Book Cover & Interactive Sample Preview)
* **Slide 1 (CA Intermediate)**:
  * Category Tag: `"CA Intermediate • Paper 2 Corporate & Other Laws"`
  * Badge: `"2026-2027 Master Edition"` | Edition Badge: `"ICAI New Scheme Aligned"`
  * Heading (H1): `"CA Inter Corporate & Other Laws"`
  * Subheading: `"Complete Chapter-wise Companies Act 2013 (Sec 1-148), General Clauses Act, Interpretation of Statutes & FCRA with 10-Attempt Solved RTPs/MTPs."`
  * Checklist Points (3 Bullets with Checkmarks):
    * `"Companies Act 2013 Management, Administration, Accounts & Audit Sections"`
    * `"30-Mark Mandatory Case-Scenario MCQs + 70-Mark Descriptive Model Answers"`
    * `"Section 135 CSR & MCA 2026-2027 Notifications Fully Integrated"`
  * Pricing Element: `"₹299"` | Strikethrough: `"₹499"` | Discount Tag: `"40% OFF"`
  * CTA Group:
    * Primary CTA: `"Enroll & Access Vault →"` (href: `/courses`)
    * Secondary CTA: `"👁 Read Sample Chapter"` (Opens Sample Reader Modal)
* **Slide 2 (CA Final)**:
  * Category Tag: `"CA Final • Corporate, Securities & Economic Laws"`
  * Heading: `"CA Final Corporate & Economic Laws"`
  * Subheading: `"Exhaustive case-scenario solver covering Companies Act 2013, IBC 2016, SEBI LODR/ICDR Regulations, FEMA 1999 & PMLA with Model Answers."`
* **Slide 3 (CA Foundation)**:
  * Category Tag: `"CA Foundation • Paper 2 Business Laws"`
  * Heading: `"CA Foundation Business Laws Master Codex"`
  * Subheading: `"Step-by-step case study decoding for Indian Contract Act 1872, Sale of Goods 1930, Indian Partnership 1932, LLP 2008 & Companies Act."`
* **Carousel Controls**: Progress bar line indicator, Left `[‹]` / Right `[›]` slide buttons.

#### 1.3 Exam Countdowns & Daily Case Scenario MCQ Challenge
* **Layout**: 2-Card Split Container
* **Card Left (Target Exam Countdowns)**:
  * Heading: `"ICAI Examination Readiness Clock"`
  * Subheading: `"Live countdown to the upcoming attempt"`
  * Timer Grid:
    * Item 1: `"CA Foundation"` -> `"[DD] Days [HH] Hrs [MM] Mins"`
    * Item 2: `"CA Intermediate"` -> `"[DD] Days [HH] Hrs [MM] Mins"`
    * Item 3: `"CA Final"` -> `"[DD] Days [HH] Hrs [MM] Mins"`
* **Card Right (Daily Case-Scenario Challenge)**:
  * Badge: `"Daily Legal Question of the Day"`
  * Section Tag: `"Companies Act 2013 • Sec 135 CSR Compliance"`
  * Case Scenario Question Box: `"X Ltd. has a net worth of ₹450 Cr, turnover of ₹950 Cr, and net profit of ₹4.8 Cr in the preceding financial year. Is the company required to constitute a CSR Committee for FY 2026-27?"`
  * Option Selectors (4 Radio Pills):
    * Option A: `"Yes, because turnover exceeds the threshold."`
    * Option B: `"No, none of the Section 135(1) financial thresholds are triggered."`
    * Option C: `"Yes, CSR applicability applies based on 3-year trailing average."`
    * Option D: `"Exempted under MCA general notification."`
  * Action Button: `"Submit Answer & View Legal Analysis"`
  * Feedback State: Correct/Incorrect status alert with detailed bare-act statutory rationale.

#### 1.4 Smart Choice Pricing (Curriculum Editions)
* **Position**: Mid-page section
* **Section Header**:
  * Tag: `"Affordable Excellence"`
  * Heading (H2): `"Curated Volumes for Every Preparation Need"`
  * Subheading: `"Choose between instant digital access or premium physical printed copies with free pan-India courier delivery."`
* **Card 1 (Digital Codex)**:
  * Title: `"Digital Student Codex"`
  * Price: `"₹299"` | Validity: `"Lifetime Attempt Access"`
  * Features: `"Watermarked DRM PDF"`, `"Searchable Chapter Index"`, `"Mobile & Desktop App Access"`, `"Free Digital Amendment Addendums"`
  * CTA: `"Get Instant PDF Access"`
* **Card 2 (Physical Deluxe Edition - Most Popular)**:
  * Popular Badge: `"⭐ RECOMMENDED FOR RANKERS"`
  * Title: `"Deluxe Paperback (2-Volume Set)"`
  * Price: `"₹649"` | Delivery: `"Free Pan-India Delivery"`
  * Features: `"High-GSM Matte Print"`, `"Color-Coded Section Flowcharts"`, `"Includes Free Digital DRM Access"`, `"Dispatch in 24-48 Hours with Tracking"`
  * CTA: `"Order Paperback Set"`
* **Card 3 (Complete Mastery Mastermind)**:
  * Title: `"All-in-One Mastermind Combo"`
  * Price: `"₹999"` | Validity: `"Both Groups / Complete Scheme"`
  * Features: `"All 3 Subject Codices"`, `"5 Full-Length Evaluated Test Series"`, `"Faculty Doubts Priority Access"`, `"Masterclass Lecture Video Series"`
  * CTA: `"Get Complete Mastermind"`

#### 1.5 Mains Answer Inspector (4-Pillar Model Framework)
* **Section Header**:
  * Tag: `"Examiner-Tested Methodology"`
  * Heading (H2): `"The 4-Pillar Mains Answer Drafting Desk"`
  * Subheading: `"Stop losing marks on presentation. See how our model answers score 80%+ in descriptive law questions."`
* **Interactive 4-Tab Framework**:
  * Tab 1: `"Pillar 1: Statutory Provision & Section Quoting"`
  * Tab 2: `"Pillar 2: Material Facts of the Case"`
  * Tab 3: `"Pillar 3: Legal Analysis & Correlation"`
  * Tab 4: `"Pillar 4: Definite Conclusion & Penalties"`
* **Interactive Sample Display**: Shows side-by-side comparison of an average student draft (3/10) vs. The Law Kaksha 4-Pillar Model Answer (9.5/10).

#### 1.6 Proven CA Ranker Testimonials Marquee
* **Section Header**:
  * Tag: `"Proven Results"`
  * Heading (H2): `"Trusted by Top Rankers Across India"`
* **Testimonial Cards (Infinite Scrolling Stream)**:
  * Student Name, City, Score Badge (`"74/100 in CA Inter Law"`, `"Rank 14 Distinction"`)
  * Review Quote: `"The structured flowchart approach and chapter-wise case laws helped me revise the entire 450 pages of Companies Act in under 1.5 days before the exam."`
  * Verification Stamp: `"Verified Student ID"`

#### 1.7 FAQ Accordion Section
* **Section Header**:
  * Tag: `"Got Questions?"`
  * Heading (H2): `"Frequently Asked Questions"`
* **Questions List**:
  * Q1: `"How do I access my digital PDF book after purchase?"` -> A1: `"Instant access is unlocked in your Student Vault immediately after checkout with DRM watermarking."`
  * Q2: `"Are these books updated for the latest ICAI 2026-2027 syllabus?"` -> A2: `"Yes, 100% updated including all MCA circulars and new syllabus restructuring."`
  * Q3: `"How long does physical book courier delivery take?"` -> A3: `"Orders are dispatched within 24-48 hours via BlueDart/Shiprocket with delivery in 3-5 business days."`
  * Q4: `"How does the Mains Answer Sheet Evaluation work?"` -> A4: `"Upload your handwritten answers in PDF format and receive detailed mark sheets within 48 hours."`

---

### Page 2: About Faculty & Pedagogy (`/about`)

#### 2.1 Hero Banner
* **Badge**: `"Mentorship & Pedagogy"`
* **Heading (H1)**: `"Demystifying Corporate & Economic Laws for Future Chartered Accountants"`
* **Subheading**: `"Bridging the gap between dry bare-act statutes and practical high-scoring examination drafts."`

#### 2.2 3 Core Teaching Pillars
* **Card 1 (Bare Act Synthesis)**:
  * Title: `"Bare Act Precision"`
  * Description: `"We break down complex legislative syntax into intuitive logic gates, conditions, and exceptions."`
* **Card 2 (5-Pillar Drafting Desk)**:
  * Title: `"Examiner-Centric Presentation"`
  * Description: `"Structured answers with unambiguous section citations, analysis, and conclusions that maximize marks."`
* **Card 3 (1.5-Day Retainability)**:
  * Title: `"High-Velocity Revision"`
  * Description: `"Summarized mind maps and keyword anchors designed for rapid recall on the eve of the examination."`

#### 2.3 Faculty Profile Section
* **Layout**: 2-Column (Left: Portrait photo with gold border | Right: Bio and credentials)
* **Faculty Name**: `"Prof. Pearl Dsouza"`
* **Designation**: `"Lead Faculty & CA Law Mentor"`
* **Credentials Badges**: `"10+ Years Teaching Experience"`, `"Mentored 25,000+ CA Aspirants"`, `"50+ All India Rankers Produced"`
* **Bio Copy**: `"With over a decade of dedicated expertise in corporate jurisprudence, Prof. Pearl Dsouza transforms intricate commercial legislation into engaging, easy-to-master frameworks..."`

#### 2.4 Bottom CTA Banner
* **Heading**: `"Ready to Master CA Law with Conceptual Clarity?"`
* **Buttons**:
  * Primary: `"Explore Codices & Books →"` (href: `/courses`)
  * Secondary: `"Join Telegram Study Group"`

---

### Page 3: Courses & Books Catalog (`/courses`)

#### 3.1 Catalog Header
* **Heading (H1)**: `"Complete Academic Catalog"`
* **Subheading**: `"Explore textbooks, case-law codices, MCQ banks, and evaluated test series aligned with the latest ICAI scheme."`
* **Notice Pill**: `"✨ All 2026-2027 Editions include free digital amendment addendums."`

#### 3.2 Live Search & Filter Bar
* **Search Input**: Placeholder: `"Search by subject, chapter, or keyword (e.g. CSR, IBC, Audit)..."`
* **Filter Pills (Horizontal list)**:
  * `[All Offerings]` `[Textbook Codices]` `[MCQ Banks]` `[Video Lectures]` `[Mains Test Series]`
* **Sort Dropdown**: `"Sort by: Featured | Price: Low to High | Price: High to Low | Highest Rated"`

#### 3.3 Product Cards Grid
* **Card Elements**:
  * Cover Image Thumbnail (with 3D perspective effect)
  * Format Tag: `"[DRM PDF]"` / `"[Deluxe Paperback]"` / `"[Combo Available]"`
  * Category Badge: `"CA Inter"` / `"CA Final"` / `"CA Foundation"`
  * Title: Product Name (e.g. `"CA Inter Corporate & Other Laws Master Codex"`)
  * Rating: `★ 4.9 (1,240 reviews)`
  * Key Highlights (2 bullet points)
  * Price: `"₹[Price]"` | Strikethrough `"₹[Orig]"`
  * Action Buttons:
    * Button 1 (Ghost/Border): `"👁 Preview Sample"`
    * Button 2 (Solid Accent): `"Add to Bag"` / `"Buy Now"`

---

### Page 4: Product Detail Page (`/product/[id]`)

#### 4.1 Breadcrumb
* **Text**: `Home > Courses > CA Intermediate > CA Inter Corporate Laws Master Codex`

#### 4.2 Product Showcase (Top Fold)
* **Left Column**: High-resolution 3D book cover, sample preview thumbnail strip, `"👁 Look Inside (20 Free Pages)"` button.
* **Right Column**:
  * Target Level Badge: `"CA Intermediate • Paper 2"`
  * Title (H1): `"CA Inter Corporate and Other Laws Master Codex (2026-2027 Edition)"`
  * Rating Summary: `★ 4.95 / 5.0 (480 verified student ratings)`
  * Format Switcher (Radio Selector Cards):
    * Card 1: `"Digital PDF (DRM Vault Access)"` -> `"₹299"`
    * Card 2: `"Deluxe Paperback (Printed 2-Vol Book)"` -> `"₹649"` (Includes Free Delivery)
    * Card 3: `"Mastermind Combo (Printed Book + DRM PDF + Test Series)"` -> `"₹899"`
  * Availability Status: `"In Stock • Dispatches in 24 Hours"`
  * CTA Buttons:
    * Primary (Solid): `"Buy Now with Instant Access"`
    * Secondary (Border): `"Add to Learning Bag"`
  * Security Guarantee Icons: `"🔒 256-Bit SSL Checkout"`, `"🚚 Free Pan-India Courier"`, `"⚡ Instant Vault Access"`

#### 4.3 Detailed Feature Tabs
* **Tab 1: Table of Contents / Syllabus Coverage**:
  * Accordion listing of all chapters (Companies Act Sec 1-148, General Clauses Act, Interpretation of Statutes, Foreign Contribution Regulation Act).
* **Tab 2: Book Features & Pedagogical Model**:
  * Highlights: Color-coded penalty charts, past 10-attempt trend analysis, 600+ solved caselets.
* **Tab 3: Dispatch & Delivery Details**:
  * Delivery timeline, tracking partner info (BlueDart/Shiprocket), packaging protection details.

---

### Page 5: Ranker Reviews & Testimonials (`/reviews`)

#### 5.1 Header & Authority Metrics
* **Heading (H1)**: `"Hall of Fame: Verified CA Rankers"`
* **Subheading**: `"Hear from students who achieved exemptions and top ranks with The Law Kaksha materials."`
* **Metrics Counters Grid (3 Cards)**:
  * Metric 1: `"850+"` -> `"Exemptions in CA Law (60+ Marks)"`
  * Metric 2: `"42"` -> `"All India Rankers in Top 50"`
  * Metric 3: `"4.9 / 5.0"` -> `"Average Student Satisfaction Score"`

#### 5.2 Filter Tabs
* `[All Reviews]` `[Top Rankers]` `[CA Intermediate]` `[CA Final]` `[CA Foundation]`

#### 5.3 Testimonial Cards
* **Elements**:
  * Student Photo / Avatar
  * Student Name, City/State
  * Exam Level & Score: `"CA Inter Law • 78 Marks (Exemption)"`
  * Rank Badge (if applicable): `"Merit Ranker • Nov 2025 Attempt"`
  * Verified Student ID Pill: `"Student #LRK-2025-0814"`
  * Testimonial Body Text: Detailed student feedback on preparation strategy.

---

### Page 6: Contact & Support Desk (`/contact`)

#### 6.1 Header
* **Heading (H1)**: `"Student Support & Inquiries"`
* **Subheading**: `"Our academic and logistics support teams are here to assist you."`

#### 6.2 Channel Cards (3 Cards)
* **Card 1 (WhatsApp Helpline)**:
  * Icon + Title: `"WhatsApp Student Helpline"`
  * Value: `"+91 98765 43210"` | Microcopy: `"Instant support (Mon-Sat, 9 AM - 8 PM)"`
* **Card 2 (Email Support)**:
  * Icon + Title: `"Email Helpdesk"`
  * Value: `"support@thelawkaksha.com"` | Microcopy: `"Response within 4-6 business hours"`
* **Card 3 (Physical Dispatch Hub)**:
  * Icon + Title: `"Publication & Dispatch Office"`
  * Value: `"The Law Kaksha Academy, Nariman Point, Mumbai, Maharashtra 400021"`

#### 6.3 Interactive Support Ticket Form
* **Form Header**: `"Send Us a Message"`
* **Inputs**:
  * Full Name (Input text)
  * Registered Email Address (Input email)
  * Mobile Phone Number (Input tel)
  * Inquiry Category (Dropdown): `[Order Dispatch & Courier Tracking]`, `[DRM PDF Vault Access]`, `[Mains Test Series Evaluation]`, `[Faculty Doubts]`, `[General Inquiry]`
  * Order ID / Student ID (Optional input)
  * Detailed Message (Textarea)
* **Submit CTA**: `"Submit Support Request →"`
* **Success State**: `"Thank you! Ticket #TK-8491 created. Our team will contact you shortly."`

---

## 🛒 Section 2: E-Commerce & Checkout Flow

---

### Page 7: Shopping Basket (`/cart`)

#### 7.1 Cart Items Table
* **Columns**: `Product Details`, `Format`, `Unit Price`, `Quantity`, `Subtotal`, `Action`
* **Empty State**: `"Your cart is currently empty. Explore our CA Codices to begin."` + `"Browse Catalog"` button.

#### 7.2 Order Summary Box (Right Sticky Card)
* **Heading**: `"Order Summary"`
* **Coupon Field**: Text Input + `"Apply"` Button
* **Calculations**:
  * `"Item Subtotal"` -> `"₹[Amount]"`
  * `"Special Promo Discount"` -> `"- ₹[Amount]"`
  * `"Pan-India Shipping"` -> `"FREE"`
  * `"Estimated Tax (GST 18% Included)"` -> `"₹0.00"`
  * `"Net Amount Payable"` -> `"₹[Amount]"`
* **Checkout Button**: `"Proceed to Secure Checkout 🔒"`

---

### Page 8: Secure Checkout (`/checkout`)

#### 8.1 Step 1: Student Information
* **Section Heading**: `"1. Student & Account Details"`
* **Fields**: Full Name, Email Address (for DRM book assignment), Mobile Number (for courier SMS updates).
* **Helper Text**: `"Your digital books and student ID will be linked to this email address."`

#### 8.2 Step 2: Courier Shipping Address *(Only for Physical Book orders)*
* **Section Heading**: `"2. Physical Book Delivery Address"`
* **Fields**: Street Address / House No., Landmark, Pincode (with auto City & State detection), City, State.

#### 8.3 Step 3: Payment Method Selection
* **Section Heading**: `"3. Choose Payment Method"`
* **Options**:
  * Option 1: `"UPI (Google Pay / PhonePe / Paytm / BHIM)"` (Recommended tag)
  * Option 2: `"Credit / Debit Card (Visa, Mastercard, RuPay)"`
  * Option 3: `"Net Banking (All Indian Banks)"`

#### 8.4 Order Review Sidebar
* **Summary List**: Thumbnail, Title, Format Tag, Net Total.
* **Consent Checkbox**: `"I agree to the Terms of Service, Refund Policy, and Single-Device DRM Access Rules."`
* **Final CTA Button**: `"Pay ₹[Total] & Complete Order"`

---

### Page 9: Order Confirmation & Invoice (`/orders/[id]`)

#### 9.1 Confirmation Banner
* **Icon**: Green Checkmark Badge (`Verified`)
* **Heading (H1)**: `"Order Successfully Placed!"`
* **Subheading**: `"Thank you for choosing The Law Kaksha. Your order details are below."`

#### 9.2 Order Metadata Grid
* **Order ID**: `#LRK-ORD-2026-9482`
* **Auto-Assigned Student ID**: `LRK-2026-0814`
* **Transaction Reference**: `TXN_UPI_994827184`
* **Date & Time**: `Sep 30, 2026 • 02:15 PM`

#### 9.3 Fulfillment Cards
* **Card 1 (Digital Books Unlocked)**:
  * Text: `"Your DRM-protected digital codices have been unlocked in your Student Vault."`
  * Button: `"Open Student Vault Now →"` (href: `/student`)
* **Card 2 (Physical Book Dispatch Info)**:
  * Text: `"Your physical paperback set is being packed at our Mumbai dispatch center."`
  * Tracking ID: `"BLUEDART-8839201948"`
  * Button: `"Download Official Tax Invoice (PDF)"`

---

## 🔐 Section 3: Authentication & Account Security

---

### Page 10: Student & Admin Login (`/login`)

#### 10.1 Login Card
* **Header**:
  * Brand Logo
  * Heading (H1): `"Welcome Back to The Law Kaksha"`
  * Subheading: `"Enter your credentials to access your student vault or administrative console."`
* **Input Form**:
  * Field 1: Email Address (Placeholder: `"student@lawkaksha.com"`)
  * Field 2: Password (Placeholder: `"••••••••"`) | Show/Hide Toggle
  * Row: `"Remember this device"` (Checkbox) | `"Forgot Password?"` (Link)
* **Submit CTA**: `"Sign In to Vault →"`
* **Footer Link**: `"New student? Create an account (30 seconds) →"` (href: `/register`)

#### 10.2 Quick Demo Switcher Cards
* **Student Demo**: Button to auto-fill `student@lawkaksha.com` / `student123`
* **Admin Demo**: Button to auto-fill `admin@lawkaksha.com` / `admin123`

---

### Page 11: Student Registration (`/register`)

#### 11.1 Registration Card
* **Header**:
  * Heading (H1): `"Create Your Student Vault Account"`
  * Subheading: `"Get instant access to free sample chapters, MCQ tests, and enrolled law codices."`
* **Input Form**:
  * Full Name (Input text)
  * Email Address (Input email)
  * WhatsApp Mobile Number (Input tel)
  * Target CA Exam Level (Dropdown): `[CA Foundation]`, `[CA Intermediate]`, `[CA Final]`
  * Password & Confirm Password (Inputs)
  * Checkbox: `"I agree to The Law Kaksha Terms of Use and Privacy Policy."`
* **Submit CTA**: `"Create Account & Generate Student ID →"`
* **Footer Link**: `"Already have an account? Sign in here →"` (href: `/login`)

---

### Page 12: Password Recovery & Reset (`/forgot-password` & `/reset-password`)

#### 12.1 Forgot Password Screen
* **Heading**: `"Reset Your Password"`
* **Subheading**: `"Enter your registered email address and we'll send you a password recovery link."`
* **Field**: Email Address
* **Button**: `"Send Recovery Link"`
* **Back Link**: `"← Back to Login"`

#### 12.2 Set New Password Screen
* **Heading**: `"Create New Password"`
* **Subheading**: `"Choose a strong password with at least 8 characters."`
* **Fields**: New Password, Confirm New Password.
* **Password Strength Meter**: Weak / Medium / Strong visual indicator bar.
* **Button**: `"Update Password & Sign In"`

---

## 🎓 Section 4: Student Learning Portal (LMS Vault)

---

### Page 13: Student Vault Dashboard (`/student`)

#### 13.1 Top Frosted Navigation Bar
* **Left**: Brand Logo + Student ID Badge: `ID: LRK-2026-0814`
* **Center Tab Switcher**:
  * Tab 1: `"📚 My Enrolled Vault (3 Items)"`
  * Tab 2: `"🛍️ Store / Browse Catalog"`
* **Right**:
  * Streak Indicator: `"🔥 7-Day Study Streak"`
  * Button: `"❓ Ask Faculty Doubt"`
  * Profile Avatar Pill with name + Logout button

#### 13.2 Top Stats & Target Exam Countdown
* **Widget 1 (Exam Target)**: Target: `"CA Inter Nov 2026 Attempt"` | Countdown: `"[42] Days Remaining"`
* **Widget 2 (Course Progress)**: Overall Completion: `"68% Chapters Completed"` | Progress bar
* **Widget 3 (Evaluation Status)**: `"2 Test Sheets Evaluated • Avg Score: 68/100"`

#### 13.3 Tab 1: Enrolled Materials Grid
* **Search / Filter**: Input: `"Search your library..."` | Category filters: `[All]`, `[Codices]`, `[Videos]`, `[Tests]`
* **Item Card Structure**:
  * Thumbnail with subject badge
  * Title: `"CA Inter Corporate & Other Laws Master Codex"`
  * Progress Bar: `72% Completed`
  * Dynamic Action Buttons:
    * `"📖 Read Book Now"` (Opens DRM PDF Reader Modal)
    * `"▶️ Watch Masterclass"` (Opens Video Player Modal)
    * `"📝 Open Evaluation Desk"` (Opens Mains Test Modal)

#### 13.4 Tab 2: Store / Buy More Catalog
* **Grid Display**: Shows other available products with `"Sample Preview"` button and `"Buy for ₹[Price]"` button.

---

### Page 14: Secure DRM PDF Reader View (Modal / Full View)

#### 14.1 Reader Header Toolbar
* **Left**: Document Title (e.g. `"CA Inter Companies Act 2013 - Chapter 4 Share Capital"`)
* **Center**: Page Navigation (`[‹]` `Page [Current] of [Total]` `[›]`) | Zoom Controls (`[-]` `100%` `[+]`)
* **Right**: Fullscreen Toggle `[⛶]` | Close Viewer `[✕]`

#### 14.2 Canvas Viewer & DRM Watermark
* **Protected Canvas**: Right-click, text selection, copy-paste, and browser printing disabled.
* **Dynamic Anti-Piracy Watermark**: Diagonal translucent repeated text overlay:
  * `"LICENSED TO: [Student Name] | ID: LRK-2026-0814 | IP: 103.21.24.88 | 30-SEP-2026"`

---

### Page 15: Masterclass Video Player Screen (Modal / Full View)

#### 15.1 Video Player Stage
* **Player Area**: HTML5 video with custom controls, play/pause, seekbar, volume, resolution switcher (720p/1080p).
* **Speed Controller**: `0.75x` | `1.0x` | `1.25x` | `1.5x` | `2.0x`

#### 15.2 Sidebar (Playlists & Chapters)
* **Header**: `"Lecture Chapters (24 Total)"`
* **List Items**:
  * Item 1: `"01. Introduction & Applicability of Companies Act (42 mins)"` (Active indicator)
  * Item 2: `"02. Types of Companies & Key Definitions (58 mins)"`
  * Item 3: `"03. Section 8 Non-Profit Companies (35 mins)"`
* **Download Attachment**: `"📎 Download Lecture Notes (PDF)"`

---

### Page 16: Mains Answer Evaluation Desk

#### 16.1 Test Paper Header
* **Title**: `"CA Inter Law Mock Test 01 • Companies Act (100 Marks)"`
* **Download Question Paper**: `"📥 Download ICAI-Pattern Question Paper (PDF)"`
* **Download Model Solution**: `"📥 Download 4-Pillar Model Answer Key"`

#### 16.2 Submission & Grading Status Box
* **State 1 (Pending Upload)**:
  * Dropzone area: `"Drag and drop your handwritten answer sheet PDF here (Max 25MB)"`
  * Button: `"Upload Answer Copy for Evaluation"`
* **State 2 (Under Review)**:
  * Status Badge: `"⏳ Under Evaluation by Examiner (Expected within 48h)"`
* **State 3 (Evaluated)**:
  * Score Banner: `"Score: 72 / 100 • EXEMPTION GRADE"`
  * Examiner Remarks: `"Excellent section quoting in Question 2. Improve case law referencing in Question 4(b)."`
  * Button: `"📥 Download Annotated Evaluated Copy with Examiner Markings"`

---

## 🛠️ Section 5: Admin & Faculty Back-Office Console

---

### Page 17: Admin Overview & Revenue KPIs (`/admin`)

#### 17.1 Admin Top Header
* **Left**: Brand Logo + `"ADMIN EXECUTIVE CONSOLE"` | System Timestamp
* **Center Navigation**:
  * Tab 1: `"📦 Orders & Dispatch"`
  * Tab 2: `"📚 Store Catalog"`
  * Tab 3: `"💳 Subscriptions"`
  * Tab 4: `"👥 Student Accounts"`
  * Tab 5: `"✍️ Answer Evaluation"`
* **Right**: `"Logout"`

#### 17.2 Top KPI Metrics Bar (4 Cards)
* **Card 1 (Total Revenue)**: Value: `"₹ 4,82,490"` | Sub-label: `"+18.4% this month"`
* **Card 2 (Active Subscriptions)**: Value: `"1,420 Students"` | Sub-label: `"Across Foundation, Inter, Final"`
* **Card 3 (Pending Dispatch Queue)**: Value: `"34 Parcels"` | Sub-label: `"Requires packing slip generation"`
* **Card 4 (Catalog Products)**: Value: `"8 Active Codices"` | Sub-label: `"Store items online"`

---

### Page 18: Orders & Dispatch Management Desk

#### 18.1 Actions & Filter Bar
* **Search Input**: `"Search by Order ID, Student Name, Tracking No..."`
* **Status Filter**: `[All Orders]` `[Processing (34)]` `[Dispatched (112)]` `[Delivered (890)]`
* **Export Action**: Button: `"📥 Export Orders CSV"`

#### 18.2 Orders Data Table
* **Columns**: `Order ID`, `Date`, `Student Name`, `Items / Format`, `Amount`, `Courier Status`, `Actions`
* **Row Actions**:
  * `"🖨️ Print Dispatch Slip"` -> Opens printable shipping label modal
  * `"Mark as Dispatched"` (Status updater dropdown)
  * `"Update Tracking Number"` (Input popup)

---

### Page 19: Printable Shipping Dispatch Slip Modal

#### 19.1 Dispatch Manifest Layout (Standard A4 / Thermal 4x6)
* **Sender Box**:
  * `"FROM: The Law Kaksha Publications, Nariman Point, Mumbai 400021 | GSTIN: 27AAAAA0000A1Z5"`
* **Consignee Box**:
  * `"TO: [Student Name], [Street Address], [City], [State] - [Pincode] | Tel: [Phone Number]"`
* **Parcel Details**:
  * Item: `"CA Inter Corporate Laws (2-Volume Deluxe Set)"`
  * Weight: `1.2 Kg` | Courier: `BlueDart Express Surface`
* **Barcode Graphic**: Standard Code-128 barcode with Waybill Number.
* **Print CTA**: `"Print Label to Thermal Printer 🖨️"`

---

### Page 20: Store Catalog & Pricing Manager

#### 20.1 Header & Add Action
* **Header**: `"Store Product Catalog"`
* **Add Button**: `"+ Create New Store Product"` (Opens Creator Modal)

#### 20.2 Product Inventory Cards / Table
* **Fields per item**:
  * Product Thumbnail & Title
  * Category (`CA Foundation` / `CA Inter` / `CA Final`)
  * Digital Price Input (Editable inline: e.g. `₹299`)
  * Physical Price Input (Editable inline: e.g. `₹649`)
  * DRM PDF Key Mapper (e.g. `law-inter-2026.pdf`)
  * Status: `[Active in Store]` / `[Draft / Hidden]`
  * Delete `[🗑️]` / Edit `[✏️]` Buttons

---

### Page 21: Student Accounts & DRM Device Control

#### 21.1 Students Table
* **Columns**: `Student ID`, `Name & Email`, `Target Exam`, `Enrolled Courses`, `Bound Device Fingerprint`, `Actions`
* **Device Security Column**:
  * Display: `"Device: Windows Chrome (Fingerprint: #dev_9482)"`
* **Support Action Button**:
  * `"🔓 Reset Bound Device"` (Unlocks student account if they change laptops/phones)

---

### Page 22: Examiner Copy Grading Desk

#### 22.1 Submissions Table
* **Columns**: `Submission ID`, `Student Name`, `Test Paper`, `Submitted Date`, `Status`, `Grading Action`
* **Action Button**: `"Grade Answer Copy"`

#### 22.2 Grading Modal Screen
* **Left Pane**: Embedded Student Answer Sheet (PDF Viewer)
* **Right Pane (Grading Rubric)**:
  * Field 1: Total Marks Awarded (Input number: `[  ] / 100`)
  * Field 2: Question-wise breakdown score table (Q1 to Q6)
  * Field 3: Examiner Feedback & Statutory Remarks (Textarea)
  * Button: `"Publish Grade & Notify Student"`

---

## ⚖️ Section 6: Legal & Compliance Pages

---

### Page 23: Terms of Service (`/terms`)
* **Header**: `"Terms & Conditions of Service"` | Last Updated: `September 2026`
* **Key Clauses**:
  * Clause 1: Intellectual Property & Anti-Piracy Protection (Strict prohibition on file sharing).
  * Clause 2: Single-Device DRM Access Rules and Fair Usage.
  * Clause 3: Test Series Submission Timelines & Evaluation SLAs.
  * Clause 4: Jurisdiction & Governing Law (Mumbai Jurisdiction).

### Page 24: Privacy Policy (`/privacy`)
* **Header**: `"Privacy & Data Protection Policy"`
* **Key Clauses**:
  * Clause 1: Collection of Student Details (Name, Phone, Target Exam).
  * Clause 2: Payment Security (Processed via PCI-DSS Compliant Gateways; no card storage).
  * Clause 3: Device Fingerprinting for DRM Access Verification.

### Page 25: Refund & Cancellation Policy (`/refund-policy`)
* **Header**: `"Refund & Cancellation Policy"`
* **Key Clauses**:
  * Clause 1: Digital PDF Codices (Non-refundable once digital key is accessed in vault).
  * Clause 2: Physical Paperback Books (Replacement within 7 days for damaged/misprinted copies).
  * Clause 3: 100% Top Ranker Cash Refund Scheme Terms.

### Page 26: Shipping & Delivery Policy (`/shipping-policy`)
* **Header**: `"Shipping, Logistics & Delivery Policy"`
* **Key Clauses**:
  * Clause 1: Dispatch Timeline (All orders packed and shipped within 24-48 business hours).
  * Clause 2: Courier Partners (BlueDart, Shiprocket, DTDC Express).
  * Clause 3: Estimated Delivery Timelines (Metros: 2-3 days; Rest of India: 4-6 days).

---

## ⚠️ Section 7: System & Error States

---

### Page 27: 404 Page Not Found (`/404` or `not-found.tsx`)
* **Visual**: Illustrated broken gavel / scale icon
* **Heading (H1)**: `"404 - Statutory Clause Not Found"`
* **Subheading**: `"The page you are looking for might have been amended, moved, or does not exist."`
* **CTAs**:
  * Button 1 (Primary): `"Return to Homepage"` (href: `/`)
  * Button 2 (Secondary): `"Explore All Codices"` (href: `/courses`)

### Page 28: 500 Server Error (`/error.tsx`)
* **Visual**: System maintenance badge
* **Heading (H1)**: `"System Encountered an Exception"`
* **Subheading**: `"Our engineers are resolving this issue. Please try refreshing or return to your student vault."`
* **CTAs**:
  * Button 1: `"Try Again 🔄"`
  * Button 2: `"Contact Support Helpdesk"`

### Page 29: 403 DRM Device Limit Reached (`/403`)
* **Visual**: Security lock badge
* **Heading (H1)**: `"DRM Device Limit Reached"`
* **Subheading**: `"Your student account is currently active on another registered device. Under single-device licensing rules, simultaneous multi-device streaming is restricted."`
* **CTAs**:
  * Button 1: `"Request Device Unlock / Reset"`
  * Button 2: `"Contact Student Helpdesk"`

---

*Document compiled for UI/UX Design Team — The Law Kaksha Engineering & Product.*
