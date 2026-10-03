# The Law कक्षा — Production Launch: Manual Owner Actions
**Status:** Required Before Public Traffic & Live Payments  
**Auditor:** Senior Full-Stack Security & QA Lead  
**Document Version:** 1.0.0 (October 2026)

The codebase on branch `release/production-hardening` is verified and hardened. The following steps require access to external cloud dashboards, banking credentials, domain registrar, and legal authority that only the platform owner possesses. Execute them in the sequence below.

---

### Priority 1: MongoDB Atlas Security & Network Access (Estimated Time: 5 mins)

1. **Rotate Leaked Database Password:**
   - Log into [MongoDB Atlas Console](https://cloud.mongodb.com).
   - Go to **Database Access** -> Find user `thelawkaksha_db_user`.
   - Click **Edit** -> **Edit Password** -> Generate a new strong password (e.g. 24+ alphanumeric characters).
   - Update `MONGODB_URI` in your Vercel (Frontend) and Render (Backend) environment variable dashboards.
2. **Configure IP Access List:**
   - Go to **Network Access** in the MongoDB Atlas Console.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) since serverless hosting (Vercel) and dynamic cloud containers (Render) rotate outbound IP addresses.
   - Click **Confirm**.

---

### Priority 2: Razorpay Live Merchant Keys & KYC (Estimated Time: 10 mins)

1. **Submit URLs for KYC / Merchant Activation:**
   Razorpay requires live, crawlable compliance pages before activating live payments. Provide them with:
   - Privacy Policy: `https://thelawkaksha.com/privacy`
   - Terms of Service: `https://thelawkaksha.com/terms`
   - Refund & Cancellation Policy: `https://thelawkaksha.com/refund`
   - Contact / Support: `https://thelawkaksha.com/contact`
2. **Obtain Live API Credentials:**
   - Log into [Razorpay Dashboard](https://dashboard.razorpay.com).
   - Switch from **Test Mode** to **Live Mode**.
   - Go to **Settings** -> **API Keys** -> **Generate Key**.
   - Note the `Key ID` (starts with `rzp_live_`) and `Key Secret`.
3. **Configure Environment Variables in Vercel & Render:**
   - Backend (Render):
     - `RAZORPAY_KEY_ID`: `rzp_live_xxxxxxxxxxxx`
     - `RAZORPAY_KEY_SECRET`: `your_live_key_secret`
   - Frontend (Vercel):
     - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `rzp_live_xxxxxxxxxxxx`

---

### Priority 3: Provision First Production Administrator (Estimated Time: 3 mins)

Do NOT commit admin credentials to git. Choose one of two methods:

- **Option A (Interactive CLI Script):**
  SSH into your backend server or run locally connected to production database:
  ```bash
  cd backend
  npm run admin:create
  ```
  Follow the prompts to enter the admin name, email, and a secure password.
- **Option B (Environment Variables):**
  Add the following variables in Render before the initial startup:
  ```env
  INITIAL_ADMIN_EMAIL=admin@thelawkaksha.com
  INITIAL_ADMIN_PASSWORD=YourStrongAdminPassword2026!
  ```
  The database seeder will create the administrator account on first boot. Once created, remove the `INITIAL_ADMIN_PASSWORD` variable.

---

### Priority 4: Custom Domain & DNS Records (Estimated Time: 15 mins)

1. **Frontend (Vercel):**
   - In Vercel Project Settings -> **Domains**, add `thelawkaksha.com` and `www.thelawkaksha.com`.
   - In your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap):
     - `A` Record: `@` -> `76.76.21.21` (or Vercel apex IP)
     - `CNAME` Record: `www` -> `cname.vercel-dns.com`
2. **Backend API (Render):**
   - In Render Dashboard -> Web Service -> **Settings** -> **Custom Domains**, add `api.thelawkaksha.com`.
   - In your DNS provider:
     - `CNAME` Record: `api` -> `your-render-service.onrender.com`
3. Verify that SSL certificates auto-issue and `https://thelawkaksha.com` loads without security warnings.

---

### Priority 5: Legal & Academic Compliance Review (Estimated Time: 10 mins)

The legal documents have been generated according to standard Indian compliance regulations (Digital Personal Data Protection Act 2023, Indian Copyright Act 1957, and consumer protection guidelines for digital products):
- Review `/privacy`: Confirm designated Grievance Redressal Officer contact details (`grievance@thelawkaksha.com`).
- Review `/terms`: Confirm jurisdiction (currently set to New Delhi, India).
- Review `/refund`: Confirm the 48-hour technical failure guarantee.
- Note: If your business entity is registered in a specific state (e.g. Maharashtra, Karnataka), update the registered office location in `frontend/src/app/privacy/page.tsx` and `layout.tsx`.

---

### Priority 6: Post-Launch Production Smoke Test Checklist

Execute this 5-minute sanity check immediately after going live on `https://thelawkaksha.com`:

1. [ ] **Homepage & Brand:** Visit `https://thelawkaksha.com`. Verify "The Law कक्षा" logo renders and ₹99 launch offer is displayed.
2. [ ] **Candidate Registration:** Click **Join Now / Register**. Create an account with a real test email (e.g., your personal email).
3. [ ] **Student Dashboard:** Confirm you are redirected to `/student`. Verify your unique student roll ID (`LRK-2026-XXXXXX`) is visible.
4. [ ] **CSEET Shell Check:** Switch course selector from CA Foundation to CSEET. Verify the "Coming Soon" roadmap displays all 8 ICSI units without exposing unfinished content.
5. [ ] **Checkout & Live Payment:** Add "CA Foundation Business Laws" (₹99) to cart. Initiate checkout. Verify Razorpay modal opens with exact ₹99. Complete test transaction or ₹1 test charge if enabled.
6. [ ] **DRM Reader View:** Open an unlocked chapter. Confirm the in-web 3D reader loads and displays your student watermark.
7. [ ] **Admin Console:** Log in at `https://thelawkaksha.com/admin` with your production admin credentials. Verify analytics and student management dashboards load without error.
