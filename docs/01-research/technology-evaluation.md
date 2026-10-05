# Technology Evaluation & Architecture Rationale

**Purpose:** Evaluates technology stack selections, architectural tradeoffs, alternatives considered, and design decisions.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Architectural Stack Evaluation

### Frontend: Next.js 16.3.8 + React 19.2.4 + Tailwind CSS v4
- **Rationale:** Next.js provides App Router SSR/SSG capabilities allowing high-performance initial page loads (SEO-optimized for courses, syllabus, and study notes) coupled with client-side interactivity for the 3D flipbook reader and interactive syllabus accordions [Verified: `frontend/package.json`].
- **Tailwind CSS v4:** Modern CSS engine using `@tailwindcss/postcss`, eliminating legacy `tailwind.config.js` bloat and improving build times [Verified: `frontend/src/app/globals.css`].
- **PDF Rendering via PDF.js (`pdfjs-dist 6.3.289`):** Canvas-based vector rendering of documents in the browser, bypassing browser PDF viewer download/save dialogs [Verified: `frontend/src/app/reader/page.tsx:35`].

### Backend: Express.js 4.21.2 on Node.js
- **Rationale:** Minimalist, transparent request routing. Clean separation of concerns between authentication, catalog querying, payment verification, and admin asset uploads [Verified: `backend/src/server.js`].
- **Lightweight Dependencies:** Uses native Node.js test runner (`node:test`) and native fetch, avoiding Jest/Mocha runner overhead [Verified: `backend/package.json:9`].

### Database: Dual-Mode Persistence (MongoDB Atlas + Local JSON Fallback)
- **Rationale:** Production relies on managed MongoDB Atlas via Mongoose schemas [Verified: `backend/src/config/db.js:15`].
- **Resilient Fallback:** When `MONGODB_URI` is unconfigured, invalid, or during offline development, `LocalDb` seamlessly takes over reads and writes via `backend/data/lawkaksha_db.json`, preventing runtime crashes and ensuring full developer portability [Verified: `backend/src/models/LocalDb.js`].

### Payments: Razorpay SDK 2.9.8
- **Rationale:** Standard payment gateway in India providing UPI Intent, Google Pay, PhonePe, Paytm, RuPay cards, and netbanking [Verified: `backend/src/controllers/paymentController.js`].

---

## 2. Alternatives Considered

| Decision Area | Selected Option | Alternative Considered | Rationale for Selection |
|---|---|---|---|
| Frontend Framework | Next.js 16 (App Router) | Vite SPA | Next.js provides server-side rendering required for SEO discoverability of curriculum pages and dynamic OpenGraph previews. |
| Digital Note Reader | PDF.js canvas viewer | Direct iframe PDF embed | Direct iframe embeds enable native browser download/save buttons; PDF.js renders raw canvas frames with dynamic student watermarking. |
| Test Framework | Node.js native `node:test` | Jest / Vitest | Node 20+ native test runner requires zero extra dependencies and executes fast e2e integration tests. |
| Persistence Engine | Dual MongoDB / Local JSON | PostgreSQL with Prisma | Dual-engine architecture allows rapid deployment and offline resilience on free hosting platforms without mandatory database provisioning. |
