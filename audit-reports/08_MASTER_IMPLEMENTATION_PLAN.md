# Master Implementation Plan: Production-Readiness Remediation

**Plan ID:** `PLAN-TLK-2026-PRODUCTION-READY`  
**Author:** `gemini` (Antigravity Principal Software Engineer & Security Architect)  
**Target Codebase:** The Law Kaksha Monorepo  
**Governing Standard:** GRAVITAS Engineering Reliability Runtime (`invariant: ground-before-mutating`, `allowed_write_scope: scoped`, `verification: evidence-backed`)  
**Scope:** Actionable, step-by-step implementation plan to resolve 100% of issues discovered across Phases 0 through 6 and all 9 specialized audit skills.

---

## 1. Overview & Phased Execution Roadmap

To eliminate all security vulnerabilities, eliminate runtime failure modes, standardize forms, optimize performance, and achieve search/AI discoverability **without breaking any existing user functionality**, execution is structured into **5 sequential phases**.

```
┌────────────────────────────────────────────────────────┐
│ PHASE 1: CRITICAL SECURITY & CREDENTIAL HARDENING     │ ➔ Day 1
│ - Remove admin auth bypass backdoor                    │
│ - Remove plaintext admin auto-fill in public UI        │
│ - Rotate OpenRouter key & gitignore setup plan         │
│ - Synchronize JWT secrets & depth-limit sanitizer      │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ PHASE 2: RUNTIME STABILITY & ERROR ELIMINATION        │ ➔ Day 2
│ - Integrate transactional email for password reset     │
│ - Await Atlas entitlement writes in checkout           │
│ - Sanitize error messages in student API responses     │
│ - Sub-tree Error Boundaries & custom 500 page          │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ PHASE 3: FORM STANDARDIZATION & CODE CLEANUP          │ ➔ Day 3
│ - Standardize all form inputs (Phase 1.1 Matrix)       │
│ - Accessible <label> tags and id/htmlFor wiring        │
│ - Consolidate duplicate Razorpay script loaders        │
│ - Modularize monolithic routes & seeders               │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ PHASE 4: PERFORMANCE & MOBILE RESPONSIVENESS (CWV)     │ ➔ Day 4
│ - Next.js image optimizer configuration & WebP/AVIF    │
│ - Dynamic imports for heavy 3D/PDF modals              │
│ - iOS dvh / safe-area insets & Android soft keyboard   │
│ - Touch target expansion to 44x44px                    │
│ - Color contrast fix for Slate-400 on white            │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ PHASE 5: SEO, AEO, GEO & LLM DISCOVERABILITY          │ ➔ Day 5
│ - Canonical domain unification (thelawkaksha.com)      │
│ - Complete sitemap.xml with missing routes             │
│ - Modern AI bot directives in robots.ts                │
│ - Generate /public/llms.txt & 30-word AEO capsules     │
│ - Programmatic statutory section generator foundation  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Critical Security & Credential Hardening

### Step 1.1: Remove Administrative Backdoor Bypass
- **Target File:** `backend/src/routes/authRoutes.js:224-228`
- **Action:** Delete the bypass conditional.
- **Code Change:**
  ```diff
      // Verify password with bcrypt
      let isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
  -   if (!isMatch && user.role === "admin" && (cleanPassword === "AdminSecurePassword2026!" || cleanPassword === "Admin@LawKaksha2026!")) {
  -     isMatch = true;
  -   }
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials. Please verify your password.",
        });
      }
  ```
- **Verification:** Run `node tests/runner.js` and verify admin authentication fails when supplying unauthorized passwords.

---

### Step 1.2: Remove Plaintext Admin Auto-Fill from Public Frontend
- **Target File:** `frontend/src/app/login/page.tsx`
- **Action:** Remove `handleAutoFillAdmin` function and remove the "Quick Helper Assistant" UI block.
- **Code Change:**
  ```diff
  - const handleAutoFillAdmin = () => {
  -   setIdentifier("admin@thelawkaksha.com");
  -   setPassword("Admin@LawKaksha2026!");
  -   setAutoFilled(true);
  -   setErrorMsg("");
  -   setTimeout(() => setAutoFilled(false), 2500);
  - };
  ...
  - {/* In Admin Mode: Quick Helper Assistant */}
  - {portalMode === "admin" && (
  -   <div className="p-3 rounded-xl bg-slate-50 border ...">
  -     ...
  -     <button type="button" onClick={handleAutoFillAdmin}>Auto-fill</button>
  -   </div>
  - )}
  ```
- **Verification:** Inspect `/login?portal=admin` in browser; confirm no auto-fill button or hardcoded credentials appear.

---

### Step 1.3: Rotate OpenRouter Key & Protect `shannon_setup_plan.md`
- **Target Files:** `shannon_setup_plan.md`, `.gitignore`
- **Action:**
  1. Add `shannon_setup_plan.md` to `.gitignore`.
  2. Replace plaintext API keys in `shannon_setup_plan.md` with environment variable syntax:
     `SHANNON_AI_API_KEY=${OPENROUTER_API_KEY}`
  3. Platform owner must rotate the live key `sk-or-v1-82f5...` on openrouter.ai.

---

### Step 1.4: Synchronize JWT Secrets & Prevent Unset Production Boot
- **Target Files:**
  - `backend/src/middleware/authMiddleware.js:11-19`
  - `frontend/src/app/api/pdf/[filename]/route.ts:77-86`
- **Action:** Unify fallback secrets and enforce fail-closed boot in production.
- **Backend Code:**
  ```javascript
  const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? null : "the_law_kaksha_unified_dev_jwt_secret_2026");
  if (!JWT_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("[FATAL] JWT_SECRET is mandatory in production.");
  }
  ```
- **Frontend Code:**
  ```typescript
  const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "the_law_kaksha_unified_dev_jwt_secret_2026" : null);
  if (!jwtSecret && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Server authentication misconfigured (JWT_SECRET missing)." }, { status: 500 });
  }
  ```

---

### Step 1.5: Fix Recursive Sanitizer Stack Exhaustion (DoS Vector)
- **Target File:** `backend/src/server.js:97-118`
- **Action:** Add a maximum depth limit (`depth > 10`) to `sanitizePayload`.
- **Code Change:**
  ```javascript
  function sanitizePayload(obj, depth = 0) {
    if (!obj || typeof obj !== "object" || depth > 10) return;
    for (const key of Object.keys(obj)) {
      if (
        key.startsWith("$") ||
        key.includes(".") ||
        key === "__proto__" ||
        key === "constructor" ||
        key === "prototype"
      ) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitizePayload(obj[key], depth + 1);
      }
    }
  }
  ```

---

## 3. Phase 2: Runtime Stability & Error Elimination

### Step 2.1: Transactional Email Integration for Password Resets
- **Target File:** `backend/src/routes/authRoutes.js:520-556`
- **Action:** Connect Resend, Nodemailer, or AWS SES to deliver reset links.
- **Implementation:**
  ```javascript
  const resetUrl = `${process.env.FRONTEND_URL || "https://thelawkaksha.com"}/login?token=${rawResetToken}&step=2`;
  await sendTransactionalEmail({
    to: user.email,
    subject: "Reset your The Law Kaksha account password",
    html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>. Valid for 30 minutes.</p>`,
  });
  ```

---

### Step 2.2: Await MongoDB Atlas Entitlement Writes in Checkout
- **Target File:** `backend/src/routes/orderRoutes.js:415-441`
- **Action:** Convert un-awaited `.catch()` background promises to synchronous `await Promise.all()`:
  ```javascript
  if (isConnected()) {
    const User = require("../models/User");
    const Subscription = require("../models/Subscription");

    await Promise.all([
      User.findOneAndUpdate(
        { email: cleanEmail },
        { ...updatePayload },
        { upsert: true }
      ),
      Subscription.create(subRecord),
    ]);
  }
  ```

---

### Step 2.3: Sanitize Student API Error Messages
- **Target File:** `backend/src/routes/studentRoutes.js:272, 330, 368`
- **Action:** Replace `+ err.message` with structured server-side logging and neutral client messages:
  ```diff
  - res.status(500).json({ success: false, message: "Error checking student gate: " + err.message });
  + console.error("[Student API Gate Error]", err);
  + res.status(500).json({ success: false, message: "Unable to verify student entitlement status. Please try again." });
  ```

---

### Step 2.4: Implement Sub-Tree Error Boundaries
- **Target File:** `frontend/src/app/student/layout.tsx`
- **Action:** Wrap the student DRM canvas and metric widgets in an isolated React `<ErrorBoundary>` so that unexpected rendering bugs do not crash the parent navigation shell.

---

## 4. Phase 3: Form Standardization & Code Cleanup

### Step 3.1: Standardize All Input Fields (Phase 1.1 Requirement)
- Replace all placeholder text using fabricated identities (`student@example.com`, `admin@thelawkaksha.com`, `••••••••`) with standardized instructional placeholders:
  - `placeholder="Enter your student email or Roll ID"`
  - `placeholder="Enter your password"`
  - `placeholder="Enter your full name"`
  - `placeholder="Enter your 10-digit mobile number"`
- Associate all inputs with explicit `<label htmlFor="...">` elements.
- Add `inputMode` and `autoComplete` attributes to drive correct mobile keyboards.

### Step 3.2: Consolidate Duplicated Razorpay Script Loader
- **Action:** Create `frontend/src/utils/razorpay.ts` exporting `loadRazorpayCheckoutScript()`.
- Remove duplicate definitions from:
  1. `frontend/src/components/CartDrawer.tsx`
  2. `frontend/src/app/checkout/page.tsx`
  3. `frontend/src/app/student/checkout/[itemType]/[itemId]/page.tsx`

---

## 5. Phase 4: Performance & Mobile Responsiveness (CWV)

### Step 4.1: Next.js Image Optimization & Asset Compression
- **File:** `frontend/next.config.ts`
- Add modern image support:
  ```typescript
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
  },
  ```
- Compress raw hero images in `frontend/public/images/` (`hero_cseet_law.jpg`, `hero_ca_foundation.jpg`, `hero_dual_combo.jpg`) into WebP format (<95 KB each).

### Step 4.2: Dynamic Imports for Heavy Interactive Modals
- In `frontend/src/app/page.tsx`, dynamically import:
  - `Book3DViewer`
  - `EnhancedSampleChapterModal`
  - `MainsEvaluationDeskModal`
  - `BareActDecoderTool`

### Step 4.3: iOS Safe-Area Insets & dvh Units
- Replace `min-h-screen` with `min-h-[100dvh]` on root containers.
- Add `padding-bottom: env(safe-area-inset-bottom)` to `StudentMobileBottomNav.tsx`.

### Step 4.4: Expand Touch Targets & Fix Contrast
- Expand password visibility toggle hit area to minimum 44×44px (`w-11 h-11`).
- Replace `text-slate-400` with `text-slate-600` on input helper and placeholder text to guarantee WCAG 2.1 AA 4.5:1 contrast.

---

## 6. Phase 5: SEO, AEO, GEO & LLM Discoverability

### Step 5.1: Unify Canonical Domain
- Replace `https://lawkaksha.in` in `frontend/src/app/layout.tsx:29, 60, 86` with `https://thelawkaksha.com` (or vice versa, based on the platform owner's primary registered domain).
- Ensure `metadataBase`, OpenGraph, Twitter, and JSON-LD match byte-for-byte.

### Step 5.2: Complete `sitemap.ts`
- Append all newly implemented routes to `frontend/src/app/sitemap.ts`:
  - `"/cookies"`, `"/subscriptions"`, `"/offers"`, `"/case-studies"`, `"/courses/ca-foundation"`, `"/courses/cseet"`.

### Step 5.3: Modern AI Crawler Rules in `robots.ts`
- Update `frontend/src/app/robots.ts` with explicit rules for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, and `Applebot-Extended`.

### Step 5.4: Deploy `/public/llms.txt`
- Create `frontend/public/llms.txt` containing the authoritative markdown summary, syllabus breakdowns, and link registry.

---

## 7. Verification Commands & Regression Suite

After executing code changes, run the following verification pipeline in order:

```powershell
# 1. Install dependencies
npm install --prefix backend
npm install --prefix frontend

# 2. Frontend TypeScript Typecheck
npm run typecheck --prefix frontend

# 3. Frontend ESLint
npm run lint --prefix frontend

# 4. Backend Unit & Security Test Suite
npm test --prefix backend

# 5. Frontend Production Bundle Compilation
npm run build:frontend

# 6. Universal End-to-End Verification Harness
node scripts/verify.js
```

**Completion Criteria:**
- `VERDICT: PASS` across all 6 verification steps.
- 0 TypeScript compiler errors.
- 0 ESLint warnings.
- 100% pass rate across backend test runners.
