# 07. QA Tester Audit: Dead UI, Duplicates, Broken Flows & Junk Clean-Up

---

## 1. Summary of QA Audit Findings

As a strict quality assurance tester auditing every route, component, button, and asset across the repository, the following critical inefficiencies were discovered:
- **8 Orphaned Standalone Routes** exist in `frontend/src/app/student/` because the application was migrated to an all-in-one Single Page Application (`frontend/src/app/student/page.tsx`). These standalone sub-routes are completely disconnected from navigation.
- **8 Dead / Unreferenced UI Components** exist in `frontend/src/components/` taking up over **140 KB of dead code**, including heavy three-dimensional book renderers and unmounted evaluation modals.
- **Multiple Redundant / Duplicate Pages:** Both `/signup` and `/register` exist (one redirects to the other); two checkout flows exist (`/checkout` vs `/student/checkout/...`).
- **Bloated Media Assets:** A **48.2 MB raw PDF file** (`frontend/public/assets/CSEET BUSINESS MANAGEMENT FINAL PRINT COPY.pdf`) is committed directly into the client repository alongside 9 duplicate book mockups.

---

## 2. Table A: Unused Pages, Routes & Orphaned Dashboards

| Route / File Path | Page Name / Purpose | Verdict | One-Line Technical Reason |
| :--- | :--- | :---: | :--- |
| `frontend/src/app/student/calendar/page.tsx` | Standalone Calendar Page | **REMOVE** | Orphaned. The student schedule is already rendered inside `activeTab === "calendar"` in `student/page.tsx`. |
| `frontend/src/app/student/case-studies/page.tsx`| Standalone Cases Page | **REMOVE** | Orphaned. Landmark cases are rendered directly inside `activeTab === "cases"` in `student/page.tsx`. |
| `frontend/src/app/student/courses/page.tsx` | Standalone Courses Page | **REMOVE** | Orphaned. Course outlines are embedded in the main student tab `activeTab === "chapters"`. |
| `frontend/src/app/student/explore/page.tsx` | Standalone Explore Page | **REMOVE** | Orphaned. Unreferenced by sidebar or bottom navigation. |
| `frontend/src/app/student/login/page.tsx` | Redundant Student Login | **REMOVE** | Duplicate. All student and admin logins are handled by the unified screen at `frontend/src/app/login/page.tsx`. |
| `frontend/src/app/student/profile/page.tsx` | Standalone Profile Page | **REMOVE** | Redundant. Profile editing is performed via the interactive popup `StudentProfileModal.tsx`. |
| `frontend/src/app/student/refer/page.tsx` | Standalone Refer Page | **REMOVE** | Orphaned. Referral program is already rendered inside `activeTab === "refer"` in `student/page.tsx`. |
| `frontend/src/app/student/resources/page.tsx` | Standalone Resources Page| **REMOVE** | Orphaned. Notes are managed inside the all-in-one SPA `activeTab === "chapters"`. |
| `frontend/src/app/student/checkout/[itemType]/[itemId]/page.tsx`| Secondary Checkout Flow | **REMOVE** | Duplicate. Checkout is executed by the central shopping cart checkout at `frontend/src/app/checkout/page.tsx`. |
| `frontend/src/app/admin/login/page.tsx` | Redundant Admin Login | **REMOVE** | Duplicate. Centralized login at `frontend/src/app/login/page.tsx` handles admin authentication. |
| `frontend/src/app/signup/page.tsx` | Signup Redirect Alias | **FIX** | Keep as lightweight HTTP 301 redirect or remove to eliminate duplicate entry point. |

---

## 3. Table B: Unused Components, Dead Files & Bloated Assets

| File Path | Component / Asset Name | Size | Verdict | One-Line Reason |
| :--- | :--- | :---: | :---: | :--- |
| `frontend/src/components/Book3DViewer.tsx` | 3D Interactive Book | 45.2 KB | **REMOVE** | Explicitly removed per user request; causes high GPU/battery drain on student mobile devices. |
| `frontend/src/components/Interactive3DBooks.tsx`| 3D Book Shelf Wrapper | 8.8 KB | **REMOVE** | Depends on `Book3DViewer.tsx`; unreferenced in active production flow. |
| `frontend/src/components/DigitalBookshelf.tsx` | Digital Bookshelf | 18.1 KB | **REMOVE** | Zero imports in the entire codebase; leftover from initial prototype. |
| `frontend/src/components/SecurePdfReaderModal.tsx`| Legacy PDF Reader Modal | 19.9 KB | **REMOVE** | Duplicate. `frontend/src/components/SecurePdfReader.tsx` is the active canvas reader. |
| `frontend/src/components/EducatorLectures.tsx` | Educator Video Lectures | 7.5 KB | **REMOVE** | Zero imports; video lectures module was replaced by digital study codices. |
| `frontend/src/components/ReviewerFeatures.tsx` | Reviewer Feature Cards | 5.6 KB | **REMOVE** | Unreferenced component from early landing page concept. |
| `frontend/src/components/BareActDecoderTool.tsx`| Standalone Decoder Tool | 16.8 KB | **REMOVE** | Unused; homepage uses `Section16ComparisonBlock.tsx` instead. |
| `frontend/src/components/MainsEvaluationDeskModal.tsx`| Evaluation Desk Modal | 13.7 KB | **REMOVE** | Feature unbuilt; modal is not linked or mounted from any active route. |
| `frontend/src/components/admin/AdminLiveSessionsTab.tsx`| Google Meet Live Classes | 11.7 KB | **REMOVE** | Live session management was explicitly deprecated per user instructions. |
| `frontend/public/assets/CSEET BUSINESS MANAGEMENT FINAL PRINT COPY.pdf`| Full Textbook PDF File | 48.2 MB | **REMOVE** | Critical asset bloat. Source PDFs should reside on Cloudinary CDN, not committed in repo. |
| `frontend/public/assets/ca-cs-hero-books.png` | Duplicate Hero Image | 1.8 MB | **REMOVE** | Superseded by `ca-cs-hero-books-v2.png`. |
| `frontend/public/assets/ca-cs-hero-books-v3.png` | Duplicate Hero Image | 2.1 MB | **REMOVE** | Redundant variation taking up repository storage. |

---

## 4. Table C: Duplicate Buttons, Features & Redundant Pages

| Feature Name | Appearance Location A | Appearance Location B | Which is Active / Wired? | Which is Dead / Redundant? | Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Login** | `frontend/src/app/login/page.tsx` | `frontend/src/app/student/login/` & `admin/login/` | `login/page.tsx` is fully wired with single-device checks. | Subfolder login pages are unlinked duplicates. | **REMOVE** subfolder login pages. |
| **Order Checkout** | `frontend/src/app/checkout/page.tsx` | `frontend/src/app/student/checkout/...` | Main `/checkout` connects to CartContext and Razorpay. | Student checkout is partially hardcoded. | **REMOVE** student checkout route. |
| **DRM Canvas Reader**| `frontend/src/components/SecurePdfReader.tsx` | `frontend/src/components/SecurePdfReaderModal.tsx` | `SecurePdfReader.tsx` has live watermarking and page controls. | `SecurePdfReaderModal.tsx` is an older copy. | **REMOVE** `SecurePdfReaderModal.tsx`. |
| **Create Order API** | `POST /api/orders/create` | `POST /api/create-order` | Both connect to the same handler in `orderRoutes.js`. | `POST /api/create-order` is a legacy alias. | Standardize client on `/api/orders/create`. |
| **Verify Payment API**| `POST /api/orders/verify` | `POST /api/verify-payment` | Both verify HMAC signature in `orderRoutes.js`. | `POST /api/verify-payment` is a legacy alias. | Standardize client on `/api/orders/verify`. |
| **MCQ Practice Tests** | `frontend/src/app/admin/page.tsx` (Google Forms) | `backend/src/routes/quizRoutes.js` (Native Quizzes) | Admin UI creates Google Form test links. | Native quiz engine in backend has no admin UI. | **DECIDE:** Use Google Forms or Native Quizzes. |

---

## 5. Table D: Dead UI Elements (Buttons, Links & Forms that Do Nothing)

| Screen / Component | Element Name / Selector | Visible Label | Current Behavior | Verdict & Recommended Fix |
| :--- | :--- | :--- | :--- | :--- |
| `frontend/src/components/Footer.tsx` | Social Media Anchor Links | Twitter, YouTube, Instagram | Links have `href="#"` and refresh the page. | **FIX:** Replace `#` with real institutional URLs or remove icons. |
| `frontend/src/app/contact/page.tsx` | "Send Message" Button | Submit Inquiry | Runs `setTimeout` and shows alert; doesn't save to DB. | **FIX:** Wire to a backend inquiry collection or redirect to WhatsApp. |
| `frontend/src/components/student/LegalClinicChatModal.tsx`| AI Legal Doubt Chat | "Send Doubt" | Simulates hardcoded bot responses with 800ms timer. | **FIX:** Label as "Demo / Simulated AI" or connect to genuine backend endpoint. |
| `frontend/src/components/Navbar.tsx` | Mobile Menu Category Dropdowns| "Study Tools" | Expandable headers link to `#`. | **FIX:** Link directly to `/courses` or remove empty parent anchor. |
| `frontend/src/app/admin/page.tsx` | "Issue Order Refund" Button | Refund Order | Missing from UI table; API endpoint `/api/admin/orders/:id/refund` has no button. | **FIX:** Add refund button with confirmation modal or document Razorpay dashboard usage. |

---

## 6. Table E: Broken Flows & Missing State Feedback

1. **Contact Inquiry Form Has No Database Sink:**
   - *Issue:* Visitors filling out the form on `/contact` believe their message is transmitted to academic administrators. In reality, no API request is sent, and no database record is created.
   - *Fix:* Create a `contact_inquiries` collection in MongoDB or redirect form submission directly to WhatsApp.
2. **Missing Loading Spinner on Google OAuth:**
   - *Issue:* When a student clicks "Sign in with Google" on `/login`, if the Google popup is delayed or network is slow, there is no loading indicator; the button appears unresponsive.
   - *Fix:* Add an `isGoogleLoading` state that disables the button and displays a spinner while the credential is being verified.
3. **Admin Direct PDF Upload Cloudinary Error Silent Failure:**
   - *Issue:* If `CLOUDINARY_API_KEY` is misconfigured or expired, `POST /api/admin/upload` throws an error. The admin portal toast says *"Saved to local cache"*, masking the fact that the PDF was not uploaded to the CDN.
   - *Fix:* Explicitly report Cloudinary failure with a red alert toast: *"Upload failed: Storage credentials missing"*.

---

## 7. Table F: Inconsistencies & UX Flaws

| Feature / Location | Inconsistency Detected | Why It Causes Confusion | Recommended Fix |
| :--- | :--- | :--- | :--- |
| **Admin Header vs Student Header** | Header branding inconsistencies | Previously, headers showed generic text. | Keep clear distinctions: "Admin Dashboard" vs "Student Dashboard". |
| **Pass Duration Terminology** | "30-Day Pass" vs "Monthly Access" | Subscriptions page says "Monthly", checkout says "30 Days". | Standardize terminology to **"30-Day Study Pass"** across all screens. |
| **Price Strikethrough Formatting** | MRP varies between ₹299 and ₹499 | Homepage card says MRP ₹299; Product page says MRP ₹499. | Align MRP to a uniform ₹299 strikethrough. |
| **Student Roll Number Generator** | Mock prefix vs DB ID | Fallback generates `LRK-2026-004182`, MongoDB generates UUID. | Ensure backend always assigns institutional roll numbers consistently. |

---

## 8. Table G: Hardcoded / Demo Data That Should Be Dynamic

| Component / Screen | Hardcoded Data Item | Why It Should Be Sourced from Database |
| :--- | :--- | :--- |
| `frontend/src/components/FaqSection.tsx` | 8 FAQ questions & answers | Admin cannot update FAQs when exam schemes or policies change. |
| `frontend/src/components/HeroSection.tsx` | Hero statistic badges ("4,800+ Students") | Static number does not reflect live enrollment growth. |
| `frontend/src/components/Section16ComparisonBlock.tsx`| Legal text breakdown | Hardcoded in client; should sync with `backend/src/models/Resource.js`. |
| `frontend/src/app/about/page.tsx` | Faculty names & credentials | Updating teacher details requires a code deployment instead of admin edit. |

---

## 9. Clean-Up Summary & Safe-to-Delete Action List

### Summary Metrics:
- **Total Unused Standalone Pages:** 10 routes.
- **Total Dead / Unreferenced Components:** 8 components (~140 KB).
- **Total Redundant / Bloated Assets:** ~52 MB (including 48.2 MB raw PDF).
- **Total Dead UI Buttons / Form Actions:** 5 instances.

### Tier 1: Safe to Delete Immediately (Zero Risk to Production)
Deleting these files will not cause any broken imports or regressions:
1. `frontend/src/components/Book3DViewer.tsx` (Unused 3D renderer).
2. `frontend/src/components/Interactive3DBooks.tsx` (Unused wrapper).
3. `frontend/src/components/DigitalBookshelf.tsx` (Unreferenced shelf).
4. `frontend/src/components/EducatorLectures.tsx` (Unreferenced lecture list).
5. `frontend/src/components/ReviewerFeatures.tsx` (Unreferenced cards).
6. `frontend/src/components/BareActDecoderTool.tsx` (Unused standalone tool).
7. `frontend/src/components/MainsEvaluationDeskModal.tsx` (Unmounted modal).
8. `frontend/src/components/SecurePdfReaderModal.tsx` (Duplicate of active reader).
9. `frontend/src/components/admin/AdminLiveSessionsTab.tsx` (Deprecated live classes).
10. `frontend/public/assets/CSEET BUSINESS MANAGEMENT FINAL PRINT COPY.pdf` (48 MB repo bloat).
11. `frontend/public/assets/ca-cs-hero-books.png` and `ca-cs-hero-books-v3.png` (Duplicate image files).

### Tier 2: Needs Confirmation / Phased Refactoring
1. **Remove Standalone Student Sub-Routes (`frontend/src/app/student/*`):** Safe to delete once confirming all links in marketing emails point to `/student` tabs rather than sub-URLs.
2. **Standardize Alias Routes:** Consolidate `/api/create-order` into `/api/orders/create` after updating any cached client references.
3. **Decide Quiz Engine Direction:** Either delete native quiz routes in `backend/src/routes/quizRoutes.js` (since Google Forms are currently used) or build an Admin UI to manage native quizzes internally.
