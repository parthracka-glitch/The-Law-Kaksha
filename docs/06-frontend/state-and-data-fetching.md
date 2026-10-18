# Frontend State Management & Data Fetching

**Purpose:** Documents client-side state lifecycles, context providers, caching strategies, and API client wrappers.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Global Context Providers

The application employs React Context for global client-side state management without the overhead of Redux or Zustand:

1. **`DeviceSessionContext.tsx` (`frontend/src/context/`):**
   - Manages client hardware device identity (`deviceId`, `deviceName`, `deviceType`).
   - Automatically synchronizes device ID to `localStorage` under `lawkaksha_device_id`.
   - Intercepts 409 Conflict responses to trigger the `DeviceResetModal`.
2. **`AuthContext.tsx` (`frontend/src/context/`):**
   - Holds the authenticated student profile (`user`), JWT token, and unlocked item IDs.
   - Provides `login()`, `logout()`, `register()`, and `refreshProfile()` helper methods.

---

## 2. API Client Wrapper (`frontend/src/lib/api.ts`)

- **Base URL Resolution:** Reads `process.env.NEXT_PUBLIC_API_URL` or defaults to `/api`.
- **Automatic Header Injection:** Injects `Authorization: Bearer <token>` and `X-Device-ID: <deviceId>` on all authenticated outgoing HTTP calls.
- **Error Interception:** Catches non-2xx responses and formats them into typed error objects with descriptive user-facing messages.
