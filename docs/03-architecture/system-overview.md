# System Architecture Overview

**Purpose:** High-level architectural specification, C4 container model, and technology topology.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. High-Level C4 Container Diagram

```mermaid
C4Container
    title Container Diagram for The Law Kaksha Platform

    Person(student, "CA / CSEET Student", "Enrolls, studies 3D codices, takes tests.")
    Person(admin, "Academy Admin / Faculty", "Uploads notes, reviews submissions, manages catalog.")

    System_Boundary(c1, "The Law Kaksha Platform") {
        Container(frontend, "Frontend Web App", "Next.js 16, React 19, Tailwind v4", "Delivers responsive UI, landing page, and in-browser 3D PDF canvas reader.")
        Container(backend, "API Backend Server", "Express.js 4, Node.js", "Handles authentication, device session locking, order creation, and payment verification.")
        ContainerDb(mongo, "Primary Database", "MongoDB Atlas Cluster0", "Stores users, course materials, orders, and test submissions.")
        ContainerDb(localdb, "Fallback Store", "LocalDb (JSON file)", "Provides offline/resilient storage fallback when Atlas is disconnected.")
    }

    System_Ext(razorpay, "Razorpay Gateway", "Processes UPI, card, and netbanking payments.")
    System_Ext(cloudinary, "Cloudinary Media", "Hosts encrypted PDF codices and course cover art.")
    System_Ext(google_auth, "Google Identity", "Verifies OAuth2 ID tokens for student sign-on.")

    Rel(student, frontend, "Interacts via HTTPS", "Web Browser")
    Rel(admin, frontend, "Manages via HTTPS", "Web Browser")
    Rel(frontend, backend, "Dispatches REST API calls", "HTTPS / JSON")
    Rel(backend, mongo, "Reads/Writes collections", "Mongoose Driver")
    Rel(backend, localdb, "Fallback file operations", "Node fs")
    Rel(frontend, razorpay, "Initiates checkout modal", "Razorpay JS")
    Rel(backend, razorpay, "Creates orders & verifies HMAC", "HTTPS REST API")
    Rel(backend, cloudinary, "Streams uploaded PDFs/images", "Cloudinary SDK")
    Rel(backend, google_auth, "Validates OAuth tokens", "Google Auth Library")
```

---

## 2. Core Architectural Patterns

1. **Decoupled Client-Server Monorepo:** Frontend and Backend reside in distinct root directories (`frontend/` and `backend/`) within the same Git repository, facilitating shared types and coordinated version control [Verified: `package.json`].
2. **Dual-Persistence Failover:** The backend boots with local JSON database fallback ready immediately (`backend/src/db/database.js`). If MongoDB Atlas connects successfully, the connection switches over seamlessly without interrupting HTTP endpoints [Verified: `backend/src/db/mongo.js`, `backend/src/config/db.js`].
3. **Stateless JWT with State-Checked Device Binding:** Authentication tokens are stateless JSON Web Tokens, but every incoming request checks the token's embedded `deviceId` against the user's active device record in database storage [Verified: `backend/src/middleware/authMiddleware.js:35`].
4. **Zero-Trust Digital Asset Delivery:** Study materials are served through authenticated streaming proxy endpoints. High-resolution source URLs are not exposed to the public web [Verified: `backend/src/routes/materialRoutes.js`].
