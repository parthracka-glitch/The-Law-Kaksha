# Database Migrations & Seeding Strategy

**Purpose:** Documents database initialization, idempotent seeding scripts, schema evolution patterns, and local-to-cloud synchronization.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Automated Database Seeding

The application implements an idempotent seeding strategy executed on server startup [Verified: `backend/src/server.js:22-26`]:

1. **`seedLocal()` (`backend/src/db/seed.js`):**
   - Synchronously inspects `backend/data/lawkaksha_db.json`.
   - Populates initial catalog items: The Indian Partnership Act (Units 1, 2, 3), Sale of Goods Act (Units 1 & 2), Smart Revision Question Bank Part 1, and September 2026 Paper Analysis.
   - Creates baseline demo student user and admin accounts if not already present.
2. **`seedMongo()` (`backend/src/db/mongoSeed.js`):**
   - Executed once MongoDB Atlas successfully establishes a connection.
   - Synchronizes initial course products, mock test blueprints, and default admin records into Atlas collections.

---

## 2. Schema Evolution & Migration Guidelines

- **Mongoose Schema Flexibility:** Adding optional fields with defaults (e.g. `activeDeviceName`, `streakDays`) does not require manual table alterations.
- **Breaking Schema Changes:** Any proposed schema modification that renames collections, drops fields, or changes types on existing production documents is subject to the **Approval Gate** defined in the audit protocol (`NEEDS_APPROVAL.md`).
- **LocalDb Synchronization:** New model properties must be accompanied by corresponding default properties in `LocalDb.js` to ensure the fallback engine remains backward-compatible.
