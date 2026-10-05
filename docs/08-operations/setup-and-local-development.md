# Local Development & Setup Runbook

**Purpose:** Step-by-step developer onboarding instructions to clone, configure, build, run, and test the project from scratch.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Prerequisites

- **Node.js:** v20.x or higher (`node -v`).
- **npm:** v10.x or higher (`npm -v`).
- **Git:** v2.40 or higher.
- *(Optional)* MongoDB Community Server or MongoDB Atlas account (the app will fall back to local JSON store if omitted).

---

## 2. Installation & Quickstart

### Step 1: Install Dependencies
```bash
# From the repository root (thelawkaksha/)
npm install
npm install --prefix frontend
npm install --prefix backend
```

### Step 2: Configure Environment Variables
Copy example files:
```bash
# In frontend/
cp .env.example .env.local

# In backend/
cp .env.example .env
```

### Step 3: Run Development Servers
You can run both or run frontend/backend independently:
```bash
# Run Frontend (default: http://localhost:3000)
npm run dev:frontend

# Run Backend in watch mode (default: http://localhost:5000)
npm run dev:backend
```

---

## 3. Verification & Testing

```bash
# Typecheck frontend
npm run typecheck --prefix frontend

# Lint frontend
npm run lint --prefix frontend

# Production build frontend
npm run build:frontend

# Run backend test suites (ensure backend server is active on port 5000)
npm test --prefix backend
```
