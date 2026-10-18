# Phase 1: Codebase Cleanup, Standardization & Quality Verification

**Audit Date:** 2026-10-18  
**Auditor Identity:** `gemini` (Gemini in Antigravity)  
**Methodology:** Phase 1 Master Directives + Phase 1.1 Form Standardization + `SKILL (2) verify-quality` Heuristics  
**Status:** Audit Complete

---

## 1. Executive Quality Summary

The Law Kaksha codebase features a rich, responsive Next.js 16 / React 19 frontend and an Express.js backend. However, because it was rapidly built through AI-assisted development ("vibe-coded"), it exhibits several quality anti-patterns typical of rapid development:
1. **Monolithic Files ("God Modules"):** Several files exceed 500 to 2,000 lines (e.g., `adminRoutes.js` at 2,007 lines, `seed.js` at 1,311 lines, `login/page.tsx` at 831 lines, `CartDrawer.tsx` at 700+ lines).
2. **Duplicated Utility Logic:** Key routines such as `loadRazorpayCheckoutScript` are copy-pasted verbatim across three separate components instead of being imported from a shared utility.
3. **Phase 1.1 Form & Input Non-Standardization:** Input fields across the application use realistic-looking fake identities (e.g., `student@example.com`, `admin@thelawkaksha.com`, `LRK-2026-...`), lack accessible label associations (`htmlFor`/`id`), and omit mobile keyboard drivers (`inputmode`, `autocomplete`).
4. **Magic Numbers and Strings:** Hardcoded prices (`99`, `180`), discount percentages (`20`, `25`), timeouts, and status strings (`"ACTIVE"`, `"PENDING"`) are scattered across route files.

---

## 2. Code Organization & Monolithic Files Audit (`[H]` Heuristic 2.2)

### 2.1 Files Exceeding the 500-Line Threshold

Modules exceeding 500 lines violate single-responsibility principles and create maintainability bottlenecks:

| File Path | Total LOC | Primary Concern | Recommended Refactoring Strategy |
|---|:---:|---|---|
| `backend/src/routes/adminRoutes.js` | **2,007** | B0–B10 admin endpoints crammed into a single file | Split into dedicated domain routers: `adminOrdersRouter.js`, `adminExpensesRouter.js`, `adminCarouselRouter.js`, `adminMeetsRouter.js`, `adminAnalyticsRouter.js`. |
| `backend/src/db/seed.js` | **1,311** | Massive synchronous database seeder containing mock data, case studies, and act codices | Split into modular seeder fixtures: `seed/courses.json`, `seed/acts.json`, `seed/cases.json`, `seed/quizzes.json`. |
| `frontend/src/app/login/page.tsx` | **831** | Combines portal toggle, credential login, forgot password modal, and device conflict resolution | Extract `ForgotPasswordModal.tsx` and `DeviceConflictBanner.tsx` into standalone components. |
| `backend/src/routes/authRoutes.js` | **859** | Registration, login, Google OAuth, password reset, and device management in one file | Modularize into `authController.js` and `deviceController.js`. |
| `backend/src/routes/studentRoutes.js` | **783** | Student dashboard, calendar, explore, resources, and progress sync in one controller | Extract dashboard aggregator logic into a service layer. |
| `frontend/src/app/checkout/page.tsx` | **654** | Order creation, Razorpay modal interaction, coupon verification, and form validation in one page | Move checkout logic and Razorpay SDK runner into `useCheckout.ts` custom hook. |
| `frontend/src/components/CartDrawer.tsx` | **650+** | Slide-out drawer, cart calculation, Razorpay SDK loader, and address collection | Move Razorpay loader to `@/utils/razorpay.ts`. |
| `frontend/src/components/SecurePdfReader.tsx` | **1,200+** | PDF canvas rendering, DRM watermarking, toolbar controls, and search index | Extract watermarking overlay and keyboard shortcuts into sub-components. |

---

## 3. Code Duplication & DRY Audit (`[H]` Heuristic 2.6)

### 3.1 Razorpay Script Loader Duplication
The exact script injection routine is duplicated across three files:
1. `frontend/src/components/CartDrawer.tsx:35-47`
2. `frontend/src/app/checkout/page.tsx:23-35`
3. `frontend/src/app/student/checkout/[itemType]/[itemId]/page.tsx:21-33`

```typescript
// Duplicated in 3 separate files:
const loadRazorpayCheckoutScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
```
**Fix:** Consolidate into `frontend/src/utils/razorpay.ts` and import everywhere.

### 3.2 Canonical Price Calculation Duplication
In `backend/src/routes/orderRoutes.js:29-66`, `CANONICAL_CATALOG_PRICES` is defined as a static dictionary alongside fallback lookups across products, courses, and subscription plans. Identical logic is partially duplicated in `catalogRoutes.js`.
**Fix:** Centralize catalog pricing in a unified `pricingService.js`.

---

## 4. Phase 1.1: Form & Input Field Standardization Audit

The prompt and Master Prompt explicitly mandate standardizing **every single input field** in the application.

### 4.1 Input Field Issues Identified

1. **Fabricated Example Identities as Placeholders:**
   - `login/page.tsx:520`: `placeholder="student@example.com or Roll ID"`
   - `login/page.tsx:519`: `placeholder="admin@thelawkaksha.com"`
   - `student/login/page.tsx:422`: `placeholder="student@example.com or LRK-2026-..."`
   - `student/login/page.tsx:447`: `placeholder="••••••••"`
   - `CartDrawer.tsx:645`: `placeholder="Exemption Aspirant"`
   - `CartDrawer.tsx:656`: `placeholder="student@example.com"`
2. **Missing Input Labels / Placeholder-as-Label:**
   - In `BareActDecoderTool.tsx:238`: Search input relies entirely on `placeholder` without an accessible `<label>` element or `aria-label`.
   - In `CartDrawer.tsx:632`: Coupon input lacks a visually hidden or associated label.
3. **Missing or Incomplete Mobile Input Attributes (`type`, `inputmode`, `autocomplete`):**
   - Phone fields in `CartDrawer.tsx` and `checkout/page.tsx` use `type="tel"`, but omit `inputMode="tel"` and `autoComplete="tel"`.
   - Email fields omit `autoComplete="email"` and `inputMode="email"`.
   - Password fields in `student/login/page.tsx` and `login/page.tsx` omit `autoComplete="current-password"`.
   - Search inputs lack `type="search"`.

### 4.2 Standardized Form Specification Matrix

To satisfy Phase 1.1, all input fields must be refactored to adhere to this uniform specification:

| Field Purpose | Standardized Label Text | Standardized `placeholder` | Required Attributes |
|---|---|---|---|
| **Student Email / ID** | `<label htmlFor="student-identifier">Student Email or Roll ID</label>` | `placeholder="Enter your student email or Roll ID"` | `id="student-identifier" type="text" inputMode="email" autoComplete="username"` |
| **User Full Name** | `<label htmlFor="full-name">Full Name</label>` | `placeholder="Enter your full name"` | `id="full-name" type="text" inputMode="text" autoComplete="name"` |
| **Email Address** | `<label htmlFor="email-address">Email Address</label>` | `placeholder="Enter your email address"` | `id="email-address" type="email" inputMode="email" autoComplete="email"` |
| **Mobile Number** | `<label htmlFor="phone-number">Mobile Phone Number</label>` | `placeholder="Enter your 10-digit mobile number"` | `id="phone-number" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9]{10}"` |
| **Password** | `<label htmlFor="account-password">Password</label>` | `placeholder="Enter your password"` | `id="account-password" type="password" autoComplete="current-password"` |
| **New Password** | `<label htmlFor="new-password">New Password</label>` | `placeholder="Enter your new password (minimum 8 characters)"` | `id="new-password" type="password" autoComplete="new-password"` |
| **Coupon / Promo Code** | `<label htmlFor="coupon-code">Discount Coupon Code</label>` | `placeholder="Enter coupon code"` | `id="coupon-code" type="text" inputMode="text" autoComplete="off" autoCapitalize="characters"` |
| **City** | `<label htmlFor="billing-city">City</label>` | `placeholder="Enter your city"` | `id="billing-city" type="text" autoComplete="address-level2"` |
| **State** | `<label htmlFor="billing-state">State / Province</label>` | `placeholder="Enter your state"` | `id="billing-state" type="text" autoComplete="address-level1"` |
| **Search / Filter** | `<label htmlFor="search-input" className="sr-only">Search</label>` | `placeholder="Search sections, acts, or keywords"` | `id="search-input" type="search" aria-label="Search sections and acts"` |

---

## 5. Naming Conventions & Consistency (`[H]` Heuristic 2.1)

- **Database Fields:** Mixed naming conventions:
  - In `User.js`: `student_id` (snake_case), `password_hash` (snake_case), alongside `target_exam` (snake_case), but `unlockedItemIds` (camelCase), `streakDays` (camelCase), `lastRead` (camelCase), `activeDeviceId` (camelCase).
  - In `Subscription.js`: `studentRoll` (camelCase), `studentName` (camelCase), alongside `paymentMode` (camelCase) and `accessStatus` (camelCase).
  - In `Order.js`: `total_amount` (snake_case), `customer_email` (snake_case), alongside `orderId` (camelCase).
- **Files & Components:**
  - Frontend components correctly follow `PascalCase.tsx`.
  - Frontend routes follow `kebab-case` directories with standard Next.js conventions (`page.tsx`, `layout.tsx`).
  - Backend controllers use `camelCase.js` (`adminRoutes.js`, `orderRoutes.js`).
  - Backend models use `PascalCase.js` (`User.js`, `Order.js`).

---

## 6. Magic Numbers & Strings (`[H]` Heuristic 2.3)

| File Location | Magic Literal | Meaning | Remediation |
|---|---|---|---|
| `orderRoutes.js:30-45` | `99`, `180` | Course & bundle prices in INR | Extract to `constants/pricing.js`: `PRICE_SINGLE_CODEX = 99`, `PRICE_COMBO_CODEX = 180` |
| `authRoutes.js:529` | `30 * 60 * 1000` | Password reset expiry window (30 mins) | Extract to `constants/auth.js`: `PASSWORD_RESET_EXPIRY_MS` |
| `authRoutes.js:252` | `4 * 60 * 60 * 1000` | Device active heartbeat window (4 hours) | Extract to `constants/auth.js`: `DEVICE_HEARTBEAT_WINDOW_MS` |
| `server.js:122, 149` | `60 * 1000` | Rate limiter sliding window (1 min) | Extract to `constants/security.js`: `RATE_LIMIT_WINDOW_MS` |
| `server.js:123` | `60` | Max auth requests per window | Extract to `constants/security.js`: `MAX_AUTH_ATTEMPTS_PER_MINUTE` |
| `adminRoutes.js:11` | `10 * 1024 * 1024` | 10MB file upload memory buffer limit | Extract to `constants/upload.js`: `MAX_UPLOAD_SIZE_BYTES` |

---

## 7. TODO / FIXME / HACK Audit (`[H]` Heuristic 2.7)

Grep scanning across the repository for `TODO`, `FIXME`, and `HACK` reveals:
- Zero unaddressed `TODO` or `HACK` comments remaining in `frontend/src`.
- In `docs/audit/NEEDS_APPROVAL.md`: 5 platform owner approval gates marked `[TBD]` regarding live Razorpay merchant IDs, production MongoDB connection string, and DPDP grievance officer contacts.
- In `backend/src/routes/authRoutes.js:544`: Leftover developer simulation code (`[Dev Mailer Simulator]`) that must be converted to production email dispatcher calls.
