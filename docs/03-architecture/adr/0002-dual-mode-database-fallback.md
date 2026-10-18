# ADR 0002: Dual-Mode Persistence Architecture (MongoDB Atlas + Local JSON Fallback)

**Status:** Accepted (Inferred from codebase)  
**Date:** 2026-10-05  
**Deciders:** Core Engineering Team  

---

## Context
Deploying the backend to free-tier hosting (e.g. Render) or running offline local development frequently introduces database connectivity hurdles (missing cloud network whitelist, DNS resolution timeouts, or unconfigured `MONGODB_URI` environment variables). If the Express server refuses to start upon DB connection failure, development halts, health checks fail, and local testing becomes fragile.

## Decision
The backend implements a dual-mode persistence architecture:
1. Primary Store: Managed MongoDB Atlas accessed via Mongoose schemas (`backend/src/db/mongo.js`).
2. Fallback Store: `LocalDb` (`backend/src/db/database.js`, `backend/src/models/LocalDb.js`), which reads and writes directly to `backend/data/lawkaksha_db.json`.
3. Startup Strategy: The local JSON database seeds synchronously on boot (`seedLocal()`). MongoDB Atlas connection is initiated asynchronously (`connectMongo().catch(...)`). If MongoDB fails or times out, the server remains operational using `LocalDb`.

## Consequences
- **Positive:** Zero startup crashes during local development, reliable offline execution, and high testability without external database dependencies.
- **Negative:** Potential data drift if writes occur locally while Atlas is disconnected; requires synchronization if switching persistence modes.
