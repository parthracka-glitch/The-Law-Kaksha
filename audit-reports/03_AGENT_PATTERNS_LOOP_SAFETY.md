# AI Agent Patterns, Loop Safety & Recursion Verification

**Audit Date:** 2026-10-18  
**Auditor Identity:** `gemini` (Gemini in Antigravity)  
**Methodology:** `SKILL (3) verify-patterns` (Framework Detection, Pattern 3.1 Loop Safety, Pattern 3.2 Retry Limits, Pattern 3.3 Tool Registry, Context Window Limits, Graph Cycles)  
**Status:** Verification Complete

---

## 1. Agent Framework Detection & File Discovery

### 1.1 Framework Detection

| Framework Pattern | Found in Codebase | Notes |
|---|:---:|---|
| `from langgraph` / `import langgraph` | ❌ None | Not used in core application |
| `from crewai` / `import crewai` | ❌ None | Not used in core application |
| `from autogen` / `import autogen` | ❌ None | Not used in core application |
| `from langchain` / `import langchain` | ❌ None | Not used in core application |
| Direct `openai` / `anthropic` SDK | ❌ None | Direct SDK not imported in `package.json` |
| External Pentest Agent (`@keygraph/shannon`) | ⚠️ Configured | `shannon_setup_plan.md` configures Shannon AI pentester via OpenRouter |

**Framework Detected:** **Custom UI-Assisted Assistant / Simulated Mentor Desk** (`frontend/src/components/student/LegalClinicChatModal.tsx`) with external autonomous pentester (`@keygraph/shannon`) documented for security regression testing.

---

## 2. Loop Safety & Recursion Audit (`[P]` Pattern 3.1 & `[H]` Heuristic)

### 2.1 While / For Infinite Loop Scan

Applying mechanical patterns from `SKILL (3) verify-patterns`:
- `while (true)` in TypeScript/JavaScript: **0 occurrences** across all source files.
- `while True:` in Python: **0 occurrences** (no Python files in production runtime).
- Generator functions with unbounded `yield`: **0 occurrences**.

### 2.2 Recursive Function Analysis: High-Risk Finding

An audit of all recursive functions across the codebase identified one critical recursive routine in the core Express middleware:

#### Target: `sanitizePayload(obj)` in `backend/src/server.js:97-118`

```javascript
// server.js:97-112
function sanitizePayload(obj) {
  if (!obj || typeof obj !== "object") return;
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
      sanitizePayload(obj[key]); // RECURSIVE CALL WITHOUT DEPTH BOUND
    }
  }
}
```

#### Evaluation:
- **Pass Condition Required:** Base case with explicit maximum depth counter.
- **Observed Behavior:** Recursion terminates only when `typeof obj[key] !== "object"`. There is **NO** recursion counter or depth check.
- **Vulnerability (DoS Risk):** An attacker transmitting an HTTP payload with deeply nested objects (e.g., `{"a":{"a":{"a":...}}}` at 5,000 depth) will exceed V8's maximum call stack limit (~10,000 frames) and trigger an uncatchable `RangeError: Maximum call stack size exceeded`, crashing the entire Node.js Express server process and terminating active user requests.
- **Verdict:** ❌ **ISSUE — Potential Unbounded Recursion (DoS Vector)**

#### Remediation:
Add an explicit depth guard:
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

## 3. Retry Limit Enforcement (`[P]` Pattern 3.2)

### 3.1 HTTP Client Retries
- `frontend/src/lib/api.ts`: Implements `apiRequest()`. It does **not** execute automatic unbounded retries upon failure; instead, it immediately returns a clean error object (`{ success: false, message: ... }`), deferring retry decisions to the user via UI retry buttons.
- **Verdict:** ✅ **PASS — No runaway HTTP retry loops.**

### 3.2 Database Connection Retries
- In `backend/src/db/mongo.js:19-55`, `connectMongo()` utilizes Mongoose's built-in connection manager with:
  ```javascript
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
  };
  ```
  If connection to MongoDB Atlas fails, `cached.promise` is reset to `null` and the server transparently falls back to `backend/data/lawkaksha_db.json`. It does not enter a blocking, synchronous reconnect loop.
- **Verdict:** ✅ **PASS — Connection retry is bounded and non-blocking.**

---

## 4. Context Window & Memory Bounds Audit

### 4.1 Legal Clinic Chat Assistant (`LegalClinicChatModal.tsx`)
- In `frontend/src/components/student/LegalClinicChatModal.tsx`, student queries are answered via simulated rule-based / keyword heuristics and statutory legal references.
- **Memory Check:** Messages are maintained in React local component state (`messages` array). When a user navigates away or refreshes, the state reinitializes. There is no unbounded accumulation in browser `localStorage` that could cause browser quota exhaustion.
- **Verdict:** ✅ **PASS — Client-side memory bounded.**

### 4.2 In-Memory Rate Limiter Map Growth (`server.js:121, 148`)
- In `backend/src/server.js`, `authRateLimitMap` and `orderRateLimitMap` are implemented as native JavaScript `Map` instances (`new Map()`).
- **Potential Memory Leak / OOM Risk:** Entries are created on demand for each unique client IP. However, there is no automatic periodic garbage collection or TTL eviction of stale keys (`authRateLimitMap.delete(ip)`).
- Over weeks of continuous uptime under millions of unique web crawlers or scrapers, the `Map` size will grow monotonically, consuming heap memory.
- **Verdict:** ⚠️ **WARNING — In-memory rate limiting map lacks automatic garbage collection sweep.**
- **Remediation:** Implement a recurring 10-minute interval sweep that prunes expired entries (`now > entry.resetAt`), or adopt Redis for distributed rate-limiting.

---

## 5. Graph Cycle & Circular Dependency Analysis

- Monorepo package boundaries:
  - `frontend/` does not import any files from `backend/`.
  - `backend/` does not import any files from `frontend/`.
- Frontend internal dependency graph: Clean tree structure (Routes -> Components -> Hooks / Context -> Lib / Utils).
- Backend internal dependency graph: `server.js` -> `routes/*` -> `models/*` & `db/*`. Zero circular imports detected between routers or database modules.
- **Verdict:** ✅ **PASS — Zero circular dependency cycles detected.**
