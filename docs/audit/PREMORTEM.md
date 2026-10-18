# Pre-Mortem Launch Analysis (Ritual 2)

> **Document Status:** Verified against architecture & risk models  
> **Last Verified Date:** 2026-10-05  
> **Commit Hash:** `audit-complete` / `audit/2026-10-05`  
> **Author:** Principal Launch Team Orchestrator  

---

## Executive Summary

A pre-mortem assumes the system has already launched and catastrophically failed. By investigating the failure post-hoc, we identify hidden dependencies, structural fragilities, and operational oversights before the first paying student touches the portal.

Below are the **Top 10 Failure Modes** identified for The Law Kaksha launch, together with their root causes, triggers, and active engineering/operational mitigations.

---

## Top 10 Launch Failure Modes & Mitigation Matrix

### 1. Payment Verification & Double-Crediting Glitch
- **Failure Scenario:** High-volume UPI transactions succeed on the student's mobile UPI app (Google Pay/PhonePe), but intermittent webhook dropouts or signature mismatch prevent the student from receiving course unlock credentials. Students panic, bombard support, and initiate chargebacks.
- **Root Cause:** Fragile payment verification logic or unhandled network timeouts between Razorpay and the backend.
- **Mitigation:**
  - Strict HMAC SHA256 cryptographic signature validation in `backend/src/controllers/paymentController.js`.
  - Idempotent order processing preventing double crediting.
  - Automated client polling with fallback receipt lookup endpoint (`/api/orders/:id`).
  - Pre-launch sandbox validation with Razorpay test keys before flipping to live keys.

### 2. Render Free-Tier Cold Start Abandonment
- **Failure Scenario:** Candidates click "Enroll Now" from a paid social media ad. Because the Render web service spun down after 15 minutes of inactivity, the API cold start takes 45–60 seconds. Students assume the website is broken and abandon checkout.
- **Root Cause:** Free-tier infrastructure spin-down behavior on `the-law-kaksha-api`.
- **Mitigation:**
  - Render health ping scheduled or upgrade to Render Starter ($7/mo) prior to public campaign launch.
  - Frontend loading skeletons with reassuring copy ("Connecting to secure exam server...") so students know the app is active.
  - Documented in `NEEDS_APPROVAL.md` for owner infrastructure decision.

### 3. Study Material Redistribution & DRM Bypass
- **Failure Scenario:** A pirated PDF copy of The Law Kaksha CA Foundation Smart Revision Question Bank is uploaded to Telegram channels and shared across student groups within 48 hours of launch.
- **Root Cause:** Unprotected PDF downloads or accessible static file links.
- **Mitigation:**
  - Next.js edge middleware intercepts all direct requests to `/notes/*.pdf` and redirects to DRM viewer.
  - Dynamic in-canvas PDF rendering with non-removable floating watermarks displaying candidate name, roll number, and IP timestamp.
  - Right-click, print, and context menu shortcuts disabled on the reader viewport.

### 4. Student Device Lock Lockout & Support Overload
- **Failure Scenario:** An enrolled candidate registers on their mobile phone, then tries to study on their laptop library computer. The system locks them out with `DEVICE_CONFLICT`, triggering urgent support tickets during exam week.
- **Root Cause:** Rigid single-device enforcement with no self-service migration path.
- **Mitigation:**
  - Self-service `forceSwitchDevice: true` option in `/login` allows students to transition their session to a new device while securely invalidating the old session.
  - Clear, empathetic UI messages explaining the security rationale.

### 5. Database Connection Loss / Mongoose Crash
- **Failure Scenario:** MongoDB Atlas connection drops due to IP whitelist restrictions or quota exhaustion, causing unhandled promise rejections and crashing the Express process.
- **Root Cause:** Hard dependency on remote database without resilient fallback.
- **Mitigation:**
  - Dual-mode database architecture (`backend/src/config/db.js`): automatically falls back to transactional local JSON database (`backend/data/lawkaksha_db.json`) if Atlas is unreachable.
  - Automatic reconnection retry with exponential backoff.
  - Uncaught exception handlers prevent Node process crashes.

### 6. Statutory Compliance / Legal Challenge (DPDP Act 2023)
- **Failure Scenario:** A dissatisfied candidate files a regulatory complaint alleging unauthorized phone number collection, unsolicited WhatsApp messages, or failure to offer a data erasure mechanism.
- **Root Cause:** Missing privacy documentation and lack of data rights workflows.
- **Mitigation:**
  - Full suite of statutory documents in `docs/10-legal/` (Privacy Policy, Terms of Service, Cookie Policy, Refund Policy).
  - Explicit consent checkboxes during registration and checkout.
  - Documented Data Protection Officer contact and 30-day erasure turnaround workflow.
  - Cookie Policy page published at `/cookies` with zero third-party advertising trackers.

### 7. Price Tampering / Client-Side Payload Manipulation
- **Failure Scenario:** A malicious user intercepts the `/api/orders/create` network request, alters the amount from ₹199 to ₹1, and obtains a valid course pass for pennies.
- **Root Cause:** Trusting client-supplied price or amount fields.
- **Mitigation:**
  - Zero-trust server-side pricing: backend ignores client `amount` fields and queries catalog database prices strictly by product ID.
  - Verified by automated unit test `P0 Pricing Integrity: POST /api/orders/create enforces server-side pricing`.

### 8. Direct Object Reference (IDOR) on Student Dashboards
- **Failure Scenario:** Student A alters the URL query parameter `?email=studentB@example.com` or order ID `LK-ORD-12345` and views Student B's notes, test submissions, and personal phone number.
- **Root Cause:** Insecure query parameter authorization instead of JWT identity verification.
- **Mitigation:**
  - Server-side authorization derives student identity strictly from verified JWT claims (`req.user.id`).
  - Order lookup routes enforce strict owner matching (`order.userId === req.user.id`).
  - Tested and verified in backend test suite (`P0 IDOR Guard`).

### 9. Broken Exam Countdown / Timezone Desynchronization
- **Failure Scenario:** Mobile devices set to non-IST time zones display incorrect exam countdowns, causing candidates to miss mock test deadlines.
- **Root Cause:** Client-side `new Date()` evaluation without Indian Standard Time (IST, UTC+5:30) normalization.
- **Mitigation:**
  - Server-synchronized timestamps via `/api/health` providing authoritative server time.
  - Exam countdown utility explicitly pins target dates to Asia/Kolkata timezone.

### 10. Unprepared Support Desk & Escalation Deadlock
- **Failure Scenario:** Surge of 500+ enrollments generates 40 payment queries on launch day; emails to `support@thelawkaksha.com` bounce because MX records were not configured.
- **Root Cause:** Operations and domain DNS misconfiguration.
- **Mitigation:**
  - Detailed Support Playbook created in `docs/11-launch/support-playbook.md`.
  - Dual support channels (Email + designated WhatsApp Business number).
  - Pre-configured email forwarding and escalation matrix defined in `docs/08-operations/`.
