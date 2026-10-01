# The Law कक्षा — Client Requirements & System Architecture Audit

**Project:** The Law कक्षा (Dedicated Learning Space for Law — CA Foundation & CSEET)  
**Audit Date:** 2026-10-01  
**Audit Version:** 1.0.0 (Phase 0 Discovery)  
**Stack Detected:**
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, PDF.js (`pdfjs-dist`)
- **Backend:** Node.js, Express, Mongoose (MongoDB Atlas), JWT, BcryptJS, Razorpay SDK, Multer
- **Database:** MongoDB Atlas (Live connected)
- **Deployment Target:** Vercel (Frontend) + Node/Serverless backend (Render / Vercel API)

---

## Complete Requirements Traceability Matrix

| ID | Requirement Area | Client Specification | Status | Evidence (File / Route) | Work Needed / Action Plan |
|---|---|---|:---:|---|---|
| **1.1** | Landing & Branding | Remove CA Intermediate & CA Final everywhere (UI, data, routes, SEO, seeds) | **Partial** | `frontend/src/components/`, `backend/data/` | Search and purge any remaining legacy references in metadata, badges, and seed files. |
| **1.2** | Landing & Branding | Show only CA Foundation Business Law & CSEET Business Law and Management as launch courses | **Done** | `HeroSection.tsx`, `SmartChoicePricing.tsx`, `Courses/page.tsx` | Ensure all course pickers strictly restrict to CA Foundation & CSEET. |
| **1.3** | Landing & Branding | Hero section headline, subtext, law-theme branding, and clear Business Law focus | **Done** | `HeroSection.tsx`, `design-system/` | Verified: "Law, Made Simple. Learning, Made Smarter." with 3D codices visual and ₹99 launch badge. |
| **1.4** | Landing & Branding | Show ₹99 introductory offer per course exactly as in the brief | **Done** | `HeroSection.tsx`, `SmartChoicePricing.tsx`, `cart/page.tsx` | Verified: ₹99 launch pricing reflected across cards, checkout, and backend order calculation. |
| **1.5** | Landing & Branding | Remove all testimonials, fake ratings ("4.9/5 by 38,000+"), and unsupported claims | **Partial** | `page.tsx`, `Testimonials.tsx` | Remove `PublicLeaderboardSection` from landing page; ensure no fake counters remain in copy. |
| **1.6** | Landing & Branding | Remove hard copies section ("Hardcopies: Both Volumes") and courier/shipping logic | **Done** | `page.tsx`, `checkout/page.tsx` | Store is 100% digital with in-web reading and instant digital fulfillment. |
| **1.7** | Landing & Branding | Replace Mains Answer Architecture with Sale of Goods Act 1930 §16(1) comparison (6-mark question, 2/6 illustrative vs 6/6 Model Answer) | **Partial** | `ExamCountdownsAndQOTD.tsx`, `MainsEvaluationDeskModal.tsx` | Streamline into a dedicated Section 16(1) interactive comparison block on the landing page matching the CHANGES PDF. |
| **1.8** | Landing & Branding | Replace ICAI exam timers/MCQs with Daily CA Foundation Case Study (7 chapters, working reveal, legal basis, LDR bookmark, admin-manageable) | **Partial** | `ExamCountdownsAndQOTD.tsx`, `backend/src/routes/quizRoutes.js` | Connect landing daily case study directly to MongoDB Atlas `McqQuestion` / `WeeklyCase` collections with 7-chapter rotation. |
| **1.9** | Landing & Branding | Add About section using WhatsApp-image copy verbatim ("Learn \| Practice \| Excel") | **Done** | `frontend/src/app/about/page.tsx` | Exact copy implemented with royal blue branding, typography, and signature. |
| **2.1** | Sign-Up & Journey | Sign-up with basic details; student selects CSEET or CA Foundation | **Done** | `register/page.tsx`, `login/page.tsx`, `authRoutes.js` | Course preference saved in profile and synced to session. |
| **2.2** | Sign-Up & Journey | Course gating on backend, API, and storage (CSEET cannot access CA Foundation and vice versa) | **Partial** | `studentRoutes.js`, `middleware/auth.js` | Enforce course-level permission checks in backend route middleware before returning materials. |
| **2.3** | Sign-Up & Journey | ₹99 offer → payment → subscription activation → access expiry logic | **Done** | `orderRoutes.js`, `Subscription.js` | Razorpay order creation, signature verification, and 30-day subscription activation. |
| **3.1** | CA Foundation Dashboard | Title: "CA Foundation Business Law" with all Inter/Final content removed | **Done** | `student/page.tsx` | Verified: Clean Business Laws dashboard. |
| **3.2** | CA Foundation Dashboard | 7 Chapters: Regulatory Framework, Contract Act, Sale of Goods, Partnership, LLP, Companies Act, Negotiable Instruments | **Done** | `student/page.tsx` (`CA_FOUNDATION_CHAPTERS`) | Built with notes, weightages, MCQs, and sample PDF links. |
| **3.3** | CA Foundation Dashboard | Previous-year papers (Last 4 PYPs) with detailed analysis | **Partial** | `student/page.tsx` | Connect May 2026 / Sept 2026 PYP analysis PDFs from `Assets/` into the PYQ section. |
| **3.4** | CA Foundation Dashboard | Last Day Revision (LDR) flowcharts/revision topics | **Done** | `student/page.tsx` (LDR tab) | Verified: LDR decks open in DRM-protected In-Web Reader. |
| **3.5** | CA Foundation Dashboard | Weekly 3 featured case studies: Monster Monday, Midweek Law Madness, Final Boss Friday | **Done** | `student/page.tsx`, `WeeklyCase.js`, `adminRoutes.js` | Live synced from MongoDB Atlas with 6/6 model answers and precedents. |
| **3.6** | CA Foundation Dashboard | Full ICAI Business Laws syllabus structure down to topics/sections with "Coming soon" placeholders | **Partial** | `student/page.tsx` | Add topic breakdown sub-modules for each of the 7 chapters with "Coming soon" state. |
| **4.1** | CSEET Dashboard | Clean "CSEET Business Law — Coming soon" shell with full requirements specification | **Done** | `student/page.tsx` (CSEET mode) | Gated CSEET tab with syllabus units, sample codex preview, and Coming Soon notices. |
| **5.1** | Act-Wise Architecture | Journey: Course → Subject → Unit/Act → Learn → Practice → PYQs → Case Studies → Revision | **Partial** | `student/page.tsx`, `courses/page.tsx` | Organize chapter view with tabbed sub-sections (Notes, Practice, PYQs, LDR). |
| **5.2** | Act-Wise Architecture | Opening an Act displays all categorized resources in one place with "Coming soon" for empty ones | **Partial** | `student/page.tsx` | Refine chapter detail view so opening any of the 7 Acts presents a unified resource hub. |
| **6.1** | Clean Unsupported Features | Remove All-India rank leaderboards, fake rankers/faculty claims, and complex analytics | **Partial** | `PublicLeaderboardSection.tsx`, `Navbar.tsx` | Remove leaderboard component from homepage and audit all navigation links. |
| **7.1** | Browse & Cart | Guests browse products & add to cart (localStorage + auto-sync after login) | **Done** | `CartContext.tsx`, `cart/page.tsx` | LocalStorage cart persists across sessions; applies ₹99 intro pricing automatically. |
| **7.2** | Login at Checkout | Checkout requires login; guest cart preserved and redirected to checkout without loss | **Done** | `checkout/page.tsx`, `CartDrawer.tsx` | Seamless auth redirect preserving cart items and pricing. |
| **7.3** | Payment & Entitlement | Server-verified payment via Razorpay webhook/signature → order created → entitlement granted | **Done** | `orderRoutes.js`, `backend/src/models/` | Idempotent signature validation and automated entitlement creation. |
| **7.4** | Dashboard Entitlements | Dashboard shows ONLY purchased/entitled content; unpurchased courses show Locked/Buy CTA | **Done** | `student/page.tsx`, `studentRoutes.js` | Content strictly unlocks only when item ID or subscription is present in `purchasedBooks`. |
| **7.5** | Course Selection vs Access | Selection sets default primary view; content access is decided strictly by purchased entitlements | **Done** | `student/page.tsx` | Course selector switches view; locked items prompt ₹99 enrollment. |
| **8.1** | Real Database | Connected to MongoDB Atlas with Mongoose models, validation, and unique indexes | **Done** | `backend/src/server.js`, `backend/src/models/` | Live Atlas connection with Models: User, Product, Subscription, WeeklyCase, McqQuestion. |
| **8.2** | No Fake / Demo Data | Zero hardcoded demo credentials ("admin/admin"), fake testimonials, or fake sales stats | **Partial** | `seed.js`, `admin/page.tsx` | Audit all admin mock tables and fallback arrays to ensure 100% real MongoDB queries. |
| **8.3** | Empty States | Show clean empty states or "Coming soon" when no data exists, never filler content | **Done** | `student/page.tsx`, `courses/page.tsx` | Built-in zero-state illustrations and Coming Soon flags. |
| **8.4** | Payments & Config | Real Razorpay keys from environment variables; no mock payment bypass in production | **Done** | `backend/.env`, `orderRoutes.js` | Server validates key secrets and enforces secure signature verification. |
| **8.5** | Environment Config | Clean `.env.example` with variable definitions without leaked secrets | **Done** | `backend/.env.example`, `frontend/.env.example` | Safe template configurations prepared for Vercel and Node. |

---

## Summary of Completed vs Pending Work

### (A) WORK DONE & READY
1. **DRM & Security Engine:** In-Web HTML5 Canvas PDF reader (`SecurePdfReader.tsx`) with zero download links, print-screen blocking, clipboard wiping, anti-copy/cut/select restrictions, 1:1 aspect ratio zoom preservation, and multi-layer dynamic watermark overlays (`student/page.tsx`).
2. **Launch Courses & Branding:** Hero Section featuring the 2 launch courses (CA Foundation Business Laws & CSEET Business Law & Management) with ₹99 introductory launch offer, Royal Blue palette, and WhatsApp About copy verbatim.
3. **MongoDB Atlas Integration:** Live connection with Mongoose models for Users, Products, Subscriptions, Weekly Cases, MCQ Questions, and site settings.
4. **Student Gating & DRM Reading:** Course gating in the student dashboard where study codices, sample units, and LDR quick notes open directly inside the protected reader.
5. **Digital Store & Cart:** Cart drawer and checkout supporting guest cart persistence, ₹99 pricing logic, Razorpay payment flow, and automated digital subscription activation.

---

### (B) WORK REMAINING (Phases 1 — 5)
1. **Landing Page Refinement:**
   - Remove `PublicLeaderboardSection` from `page.tsx`.
   - Implement the exact Sale of Goods Act §16(1) comparison block ("Average Aspirant 2/6" vs "The Law कक्षा Model Answer 6/6") as specified in the CHANGES PDF.
   - Connect the Daily CA Foundation Case Study component to live MongoDB Atlas questions across all 7 chapters.
2. **Act-Wise Resource Architecture:**
   - Expand each of the 7 CA Foundation chapters in `student/page.tsx` to display sub-modules (Notes, Flowcharts, Practice Questions, PYQs, Case Studies, LDR) with "Coming soon" badges for pending modules.
   - Connect actual PDFs from the `Assets/` directory (`Indian Partnership Act_Practice Questions.pdf`, `Partnership Infogarphics.pdf`, `Partnership LDR Charts.pdf`, `September 2026 Paper Analysis.pdf`, etc.) as sample PDFs.
3. **Backend & Admin Panel Hardening:**
   - Ensure all admin CRUD actions (Products, MCQs, Cases, Resources) write to MongoDB Atlas with live instant sync.
   - Implement server-side signed URLs / token-gated streaming for all protected PDF files.
4. **Purge Remaining Demo Fallbacks:**
   - Verify zero fallback arrays with fake metrics or sample users exist in production paths.

---

## Open Business & Technical Questions for Client

1. **Payment Gateway & Keys:** Are we using Razorpay Test Mode for initial staging verification, or do you have Live Razorpay API Keys and Webhook Secret ready?
2. **₹99 Introductory Offer Duration & Renewal:**
   - Is the ₹99 price a 30-day monthly recurring subscription, or a one-time introductory purchase per course?
   - What should the regular renewal price be after the 30-day intro period?
3. **Dual-Course Purchase Rule:** Can a single student account purchase and enroll in both CA Foundation and CSEET simultaneously, and should the ₹99 intro offer apply to both or only the first purchase?
4. **GST & Invoicing:** Does The Law कक्षा require GST calculation (e.g., 18% GST added at checkout or inclusive) and formal automated GST PDF tax invoices emailed upon purchase?
5. **Storage Provider:** For production uploaded PDFs/assets, should files continue to be stored on secure local server disk (`/uploads` with stream proxy) or an S3/Cloudflare R2 bucket?
