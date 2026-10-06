# Legacy Inventory & Classification (Phase 0)

Date: 2026-10-07  
Branch: `refactor/law-kaksha`  
Baseline Tag: `pre-law-kaksha-backup`  
Reference: `LawKaksha_Implementation_Spec.pdf` (§4)

---

## 1. Inventory & Classification Matrix

| Component / File / Route | Type | Current Role | Classification | Target State / Notes |
|---|---|---|:---:|---|
| **Frontend Routes** | | | | |
| `/` | Page | Landing page | **ADAPT** | Update with subscription carousel (A1), subscription overview + Buy Now (A2), animated About Us (A3), footer from settings (A4), offers (A5), case studies (A6) |
| `/about` | Page | About Law Kaksha | **KEEP** | Enhance with animated counters and values |
| `/admin` | Page | Admin panel | **ADAPT** | Convert to modular admin shell with overview (B0) and links to all 12 modules |
| `/cart` | Page | Cart review | **ADAPT** | Connect to new subscription and extra course items |
| `/checkout` | Page | Checkout & payment | **ADAPT** | Collect & snapshot personal details, server coupon validation, Razorpay flow |
| `/contact` | Page | Contact information | **KEEP** | Connect contact details to `site_settings` |
| `/cookies` | Page | Cookie policy | **KEEP** | Statutory policy page |
| `/courses` | Page | Courses listing | **ADAPT** | Align with subscriptions and extra course catalog |
| `/login` | Page | Website login | **ADAPT** | Google login required before add-to-cart/checkout; return-to-intent support |
| `/privacy` | Page | Privacy policy | **KEEP** | Statutory policy page |
| `/product/[id]` | Page | Single product view | **ADAPT** | Support extra course and codex views |
| `/reader` | Page | In-browser DRM reader | **KEEP** | Protected reading for entitled resources |
| `/refund` | Page | Refund policy | **KEEP** | Statutory policy page |
| `/register` | Page | Student registration | **KEEP** | Support email/pass and Google sign-up |
| `/reviews` | Page | Student reviews | **KEEP** | Moderated student feedback |
| `/student` | Page | Student portal | **ADAPT** | Surface C home: streak/XP header, active subscriptions, calendar, quick access |
| `/students` | Page | Directory / legacy | **REMOVE** | Replaced by Admin students and Student dashboard |
| `/terms` | Page | Terms of service | **KEEP** | Statutory policy page |
| `/subscriptions/:slug` | Page | *New* | **ADD** | Subscription detail view with full syllabus, feature list, Buy Now / Add to Cart |
| `/offers` | Page | *New* | **ADD** | Dedicated active offers view with coupon copying |
| `/case-studies` | Page | *New* | **ADD** | Public case study directory with rich previews |
| `/case-studies/:slug` | Page | *New* | **ADD** | Case study detail reader |
| `/checkout/success/:orderNo` | Page | *New* | **ADD** | Booking success confirmation with 'Go to Dashboard' button |
| `/student/login` | Page | *New* | **ADD** | Distinct visual design student login page with entitlement gate check |
| `/student/resources` | Page | *New* | **ADD** | Entitled subscriptions -> courses -> resources with expiry badge |
| `/student/courses/:id` | Page | *New* | **ADD** | Course syllabus and resource player / viewer |
| `/student/explore` | Page | *New* | **ADD** | Standalone extra courses / unowned subscriptions carousel with direct Buy Now |
| `/student/calendar` | Page | *New* | **ADD** | Month/week live sessions view with Meet links, expiries, streaks |
| `/student/case-studies` | Page | *New* | **ADD** | Dashboard case studies repository |
| `/student/refer` | Page | *New* | **ADD** | Referral link, referral statistics, reward unlocks |
| `/student/profile` | Page | *New* | **ADD** | Google profile details (read-only email), editable phone, city, avatar |
| `/student/checkout/:itemType/:itemId` | Page | *New* | **ADD** | Direct 1-click checkout skipping cart |
| `/admin/orders` | Page | *New* | **ADD** | Subscription booking management, filters, detail view, refund/revoke, export |
| `/admin/subscriptions` | Page | *New* | **ADD** | CRUD subscriptions, pricing, MRP, duration, course bundles |
| `/admin/courses` | Page | *New* | **ADD** | CRUD core courses and categorized resources |
| `/admin/extra-courses` | Page | *New* | **ADD** | CRUD standalone extra courses |
| `/admin/carousel` | Page | *New* | **ADD** | Manage website carousel slides, ordering, visibility, preview |
| `/admin/live-sessions` | Page | *New* | **ADD** | Manage Google Meet live class links and scheduled sessions |
| `/admin/offers` | Page | *New* | **ADD** | Manage promotional offers and coupon linkages |
| `/admin/case-studies` | Page | *New* | **ADD** | Rich-text case study publisher with website/dashboard toggles |
| `/admin/coupons` | Page | *New* | **ADD** | Manage coupon codes, discounts, usage limits, redemptions |
| `/admin/payments` | Page | *New* | **ADD** | Payments ledger with CSV & Excel export |
| `/admin/expenses` | Page | *New* | **ADD** | Business expense tracker with category breakdown and P&L math |
| `/admin/settings` | Page | *New* | **ADD** | Site-wide settings (footer, about, contact, socials) |
| **Backend API Endpoints** | | | | |
| `/api/auth/*` | API | Authentication & Google OAuth | **KEEP / ADAPT** | Retain single-device security; add student dashboard gate validation |
| `/api/orders/*` | API | Orders & payments | **ADAPT** | Enforce server-side pricing, coupon validation, entitlement creation |
| `/api/catalog/*` | API | Catalog & public data | **ADAPT** | Serve subscriptions, carousel slides, offers, case studies, site settings |
| `/api/student/*` | API | Student dashboard endpoints | **ADAPT** | Return entitled courses/resources, streak/XP stats, referrals, calendar |
| `/api/admin/*` | API | Admin management | **ADAPT** | Expand to cover all 13 spec modules (B0-B10, settings, live sessions) |
| `/api/content/*` | API | Protected PDF / DRM streaming | **KEEP** | Verify entitlement before streaming content |
| **Data Models (MongoDB + Fallback)** | | | | |
| `User` | Model | User accounts | **ADAPT** | Ensure google_id, referral_code, referred_by_user_id, role fields |
| `Subscription` | Model | Subscription plans | **ADAPT** | Support title, slug, duration_days, features list, courses list |
| `Course` | Model | Courses | **ADAPT** | Add kind (core / extra), price (extra only), show_on_website |
| `Resource` | Model | PDF / video / notes resources | **KEEP / ADAPT** | Linked to course, type, file_or_url, order |
| `CarouselSlide` | Model | Website carousel | **ADD** | placement, title, subtitle, image, cta_label, subscription_id |
| `Offer` | Model | Promotional offers | **ADD** | title, description, banner, coupon_id, valid_from/to |
| `CaseStudy` | Model | Legal case studies | **ADD** | title, slug, summary, content, cover_image, show_on_website/dashboard |
| `Coupon` | Model | Discount coupons | **ADAPT** | discount_type, value, limits, applicable subscriptions |
| `Order` | Model | Bookings / orders | **ADAPT** | order_no, personal details snapshot, items, subtotal, discount, total |
| `Payment` | Model | Payment records | **ADD** | gateway, gateway_order_id, gateway_payment_id, status, payload |
| `Entitlement` | Model | Access rights | **ADD** | user_id, item_type, item_id, order_id, starts_at, expires_at, status |
| `LiveSession` | Model | Live class Meet links | **ADD** | subscription_id, course_id, title, starts_at, ends_at, meet_link |
| `Expense` | Model | Business expenses | **ADD** | category, title, amount, expense_date, notes, receipt_url |
| `UserStats` / XP / Referral | Models | Gamification & growth | **ADD** | user_stats, xp_events, referrals schemas |
| `SiteSetting` | Model | Dynamic configuration | **KEEP / ADAPT** | footer details, contact, socials, about blocks |

---

## 2. Legacy / Removed Items
- `/students` (legacy unstyled directory route) -> **REMOVED**
- Any cafe/restaurant/seat-booking/POS leftovers (none found in core, verified clean)
- Dummy mock payment bypasses in production -> **REMOVED / SECURED**
