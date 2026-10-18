# Non-Functional Requirements & Capacity Planning

**Purpose:** Benchmarks performance, capacity limits, availability assumptions, and scalability targets.  
**Status:** Verified against code & infrastructure constraints  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Performance & Latency Targets

| Target Metric | Baseline / Constraint | Production Target | Verification Method |
|---|---|---|---|
| **Frontend Initial Render** | 20 static pages generated in 4.6s compile time [Verified: `task-283`] | < 500ms First Contentful Paint (FCP) | Lighthouse / Vercel Analytics |
| **Backend Warm API Latency** | Express route handlers execute in 2–15ms locally | < 200ms p95 response time | Load benchmark (`load_benchmark.js`) |
| **Render Cold Start** | Free tier spins down after 15 min idle; cold start takes ~45–55s | < 5s (requires paid Render instance upgrade) | Health check ping (`/api/health`) |
| **Document Streaming** | PDF.js canvas vector rendering | < 1.5s per codex page | Browser memory & canvas profiling |

---

## 2. Capacity & Concurrency Assumptions

- **Current Tier (Render Free):**
  - RAM: 512 MB
  - CPU: 0.1 vCPU (shared)
  - Safe Concurrency: ~30–50 concurrent student reading sessions without degradation.
- **Scaling Thresholds:**
  - When active concurrent users exceed 100, upgrade Render service to `starter` or `standard` ($7–$25/mo) to eliminate cold starts and scale CPU/RAM.
  - When monthly student accounts exceed 5,000, enable MongoDB Atlas connection pooling and dedicate Redis cache for session device token verification.

---

## 3. Availability & Fault Tolerance

- **Dual-Database Resilience:** If MongoDB Atlas encounters network partition or credential rotation issues, `LocalDb` takes over read/write duties automatically, preserving basic catalog browsing and local logins [Verified: `backend/src/models/LocalDb.js`].
- **Graceful Error Recovery:** Express uncaught exceptions are trapped with structured JSON responses (`500 Internal Server Error`), preventing process exits on individual client malformed payloads [Verified: `backend/src/server.js:180`].
