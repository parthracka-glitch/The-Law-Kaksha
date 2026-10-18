# 10. Phase P0 Verification Report: Security, Storage & Architecture Audit

**Audit Date:** 2026-10-19  
**Execution Phase:** PASS 1 — P0 Quick Verify (Read-Only)  
**Status:** COMPLETE & VERIFIED FROM CODE  

---

## 1. Item (a): Raw Cloudinary & PDF URL Exposure in APIs & SecurePdfReader

### Question:
*Does SecurePdfReader or any API response expose a raw Cloudinary/PDF URL? (Check `/api/site-data`, `/api/resources`, `/api/catalog`, `/api/student/resources`, `Product.pdfUrl`)*

### Code-Verified Findings:
1. **`/api/public/site-data` (`backend/src/routes/catalogRoutes.js:71`):**
   - **EXPOSED.** `Product.find({ status: "Active" }).lean()` is returned directly in JSON.
   - The Mongoose `Product` model (`backend/src/models/Product.js:14`) defines:
     ```javascript
     pdfUrl: { type: String, default: "/api/pdf/cseet-business-law-full.pdf" }
     ```
   - The response directly exposes `pdfUrl`, giving non-authenticated public visitors direct file paths.

2. **`/api/catalog` (`backend/src/routes/catalogRoutes.js:103`):**
   - **EXPOSED.** Returns `Product.find({ status: "Active" }).lean()` including `pdfUrl` and `cover_image`.

3. **`/api/resources` (`backend/src/routes/catalogRoutes.js:243`):**
   - **CRITICAL EXPOSURE.** When queried without `sampleOnly=true`, returns:
     ```javascript
     const resources = await Resource.find(filter).sort({ chapterNumber: 1, order: 1 }).lean();
     return res.status(200).json({ success: true, source: "mongodb_atlas", resources });
     ```
   - Every single `Resource` object in the database is returned with `pdfUrl`, `file_or_url`, and `cloudinaryPublicId` in plaintext JSON to unauthenticated clients.

4. **`/api/student/resources` (`backend/src/routes/studentRoutes.js:321`):**
   - **EXPOSED.** Returns raw resource records:
     ```javascript
     const availableResources = resourcesTable.find((r) => entitledCourseIds.has(r.course_id) || ...);
     res.status(200).json({ success: true, resources: availableResources });
     ```
   - Contains direct Cloudinary/PDF paths without signed URL tokens or content streaming.

5. **`SecurePdfReader.tsx` (`frontend/src/components/SecurePdfReader.tsx:204–207`):**
   - In `SecurePdfReader`, the component extracts `const filename = url.split("?")[0].split("/").pop()` and requests:
     ```typescript
     const pdfEndpoint = token
       ? `/api/pdf/${encodeURIComponent(filename)}?token=${encodeURIComponent(token)}`
       : `/api/pdf/${encodeURIComponent(filename)}`;
     ```
   - It relies on `/api/pdf/[filename]`, but because `pdfUrl` was already sent in API responses, any user inspecting the Network tab or React state can extract raw URLs.

---

## 2. Item (b): Paid PDFs Reachable Publicly or from `frontend/public`

### Question:
*Are any paid PDFs reachable publicly or from `frontend/public`?*

### Code-Verified Findings:
**YES, CRITICAL DATA LEAK IDENTIFIED:**
1. **Direct Public Repository File:**
   - `frontend/public/assets/CSEET BUSINESS MANAGEMENT FINAL PRINT COPY.pdf` (**48,895,448 bytes / 48.8 MB**) is physically stored inside `frontend/public/assets/`.
   - Any unauthenticated user worldwide can download this full 300+ page textbook by simply requesting:
     `https://thelawkaksha.com/assets/CSEET%20BUSINESS%20MANAGEMENT%20FINAL%20PRINT%20COPY.pdf`
     (Completely bypasses auth, payment, DRM, and watermarking).
2. **Duplicated Sample File:**
   - `frontend/public/samples/CSEET_Business_Management_Notes.pdf` (**48,895,448 bytes / 48.8 MB**) is an exact duplicate of the paid textbook inside `frontend/public/samples/`.
   - Reachable publicly without authentication at:
     `https://thelawkaksha.com/samples/CSEET_Business_Management_Notes.pdf`
3. **Unchecked Substring Bypass in Next.js PDF Proxy:**
   - In `frontend/src/app/api/pdf/[filename]/route.ts:61–65`:
     ```typescript
     const isSampleFile =
       lowerName.includes("sample") ||
       lowerName.includes("preview") ||
       lowerName.includes("infographic") ||
       lowerName.includes("infogarphic");
     ```
   - In lines 88–97:
     ```typescript
     if (!rawToken) {
       if (!isSampleFile) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 });
       }
       // If isSampleFile is true, IT BYPASSES ALL AUTHENTICATION!
     }
     ```
   - Any paid document containing the word "sample", "preview", or "infographic" in its filename is served completely unauthenticated to the public.

---

## 3. Item (c): Every Place Payment, Order, and Entitlement Writes Can Fall Back to the JSON DB

### Question:
*Where can payment, order, and entitlement writes silently fall back to the local JSON database?*

### Code-Verified Findings in `backend/src/routes/orderRoutes.js`:

1. **Order Creation (`handleCreateOrder`, lines 198–213):**
   ```javascript
   const ordersTable = Database.table("orders");
   const newOrder = ordersTable.insert({
     id: orderId,
     gateway_order_id: razorpayOrderId,
     ...
     status: "PENDING",
   });
   ```
   - **VULNERABILITY:** MongoDB Atlas is **never written to**. The order is saved **exclusively** to the local JSON database file (`Database.table("orders")`).

2. **Payment Verification & Access Grant (`handleVerifyPayment`, lines 256–320):**
   ```javascript
   const ordersTable = Database.table("orders");
   let order = ordersTable.findOne(...);
   ...
   ordersTable.update(order.id, {
     status: "COMPLETED",
     gateway_payment_id: razorpayPaymentId || `pay_LK_${Date.now()}`,
   });
   ```
   - **VULNERABILITY:** Order status is updated **only in the JSON DB**.
   - No `Payment` document is created in MongoDB Atlas.
   - No `Entitlement` document is created in MongoDB Atlas.

3. **Fire-and-Forget Asynchronous Sync (lines 410–441):**
   ```javascript
   const { isConnected } = require("../db/mongo");
   if (isConnected()) {
     User.findOneAndUpdate(...).catch((e) => console.error("[Orders] Atlas user sync error:", e));
     Subscription.create(subRecord).catch((e) => console.error("[Orders] Atlas sub create error:", e));
   }
   ```
   - **VULNERABILITY:** The MongoDB Atlas write is executed unawaited with a silent `.catch()`. If Atlas is slow or temporarily unreachable, the database write fails silently while the client is sent `HTTP 200 OK`.
   - If Render restarts its container, all orders and student subscriptions stored in the ephemeral JSON DB are wiped, leaving paying students without access.

---

## 4. Item (d): Real List of Admin Endpoints

### Direct Scan from `backend/src/routes/adminRoutes.js` (Mounted under `/api`):

| Line # | Method | Endpoint Path | Functionality |
| :---: | :--- | :--- | :--- |
| 48 | `GET` | `/api/admin/analytics` | High-level analytics and KPIs |
| 108 | `GET` | `/api/admin/products` | List all catalog codices |
| 121 | `POST` | `/api/admin/products` | Create catalog codex |
| 162 | `PUT` | `/api/admin/products/:id` | Update catalog codex |
| 184 | `DELETE`| `/api/admin/products/:id` | Delete catalog codex |
| 202 | `GET` | `/api/admin/cases` | List case studies |
| 215 | `POST` | `/api/admin/cases` | Create case study |
| 246 | `PUT` | `/api/admin/cases/:id` | Update case study |
| 263 | `DELETE`| `/api/admin/cases/:id` | Delete case study |
| 281 | `GET` | `/api/admin/mcq-tests` | List Google Form mock drills |
| 294 | `POST` | `/api/admin/mcq-tests` | Create Google Form mock drill |
| 325 | `PUT` | `/api/admin/mcq-tests/:id`| Update Google Form mock drill |
| 342 | `DELETE`| `/api/admin/mcq-tests/:id`| Delete Google Form mock drill |
| 358 | `GET` | `/api/admin/mcqs` | List single MCQ questions |
| 374 | `GET` | `/api/admin/coupons` | List discount coupons |
| 387 | `POST` | `/api/admin/coupons` | Create discount coupon |
| 416 | `PUT` | `/api/admin/coupons/:id` | Update discount coupon |
| 431 | `DELETE`| `/api/admin/coupons/:id` | Delete discount coupon |
| 449 | `GET` | `/api/admin/students` | List student directory |
| 463 | `POST` | `/api/admin/students` | Manually register student |
| 497 | `PUT` | `/api/admin/students/:id`| Update student details / DRM toggle |
| 533 | `DELETE`| `/api/admin/students/:id`| Delete student record |
| 551 | `GET` | `/api/admin/subscriptions` | List student subscriptions |
| 564 | `POST` | `/api/admin/subscriptions`| Manually create subscription |
| 611 | `PUT` | `/api/admin/subscriptions/:id`| Update subscription |
| 648 | `DELETE`| `/api/admin/subscriptions/:id`| Delete subscription |
| 666 | `GET` | `/api/admin/exam-settings` | Get exam target dates |
| 686 | `POST` | `/api/admin/exam-settings`| Update exam target dates |
| 699 | `GET` | `/api/admin/qotd` | Get Question of the Day |
| 724 | `POST` | `/api/admin/qotd` | Update Question of the Day |
| 738 | `GET` | `/api/admin/mcq-pool` | Get MCQ pool questions |
| 754 | `POST` | `/api/admin/mcq-pool` | Update MCQ pool questions |
| 771 | `POST` | `/api/admin/upload` | Upload file to Cloudinary |
| 806 | `GET` | `/api/admin/resources` | List chapter notes & PDFs |
| 826 | `POST` | `/api/admin/resources` | Add chapter note |
| 863 | `PUT` | `/api/admin/resources/:id`| Update chapter note |
| 916 | `DELETE`| `/api/admin/resources/:id`| Delete chapter note |
| 934 | `GET` | `/api/admin/section16-comparison` | Section 16 comparator data |
| 976 | `GET` | `/api/admin/announcement` | Get top announcement |
| 999 | `POST` | `/api/admin/announcement`| Update top announcement |
| 1013| `GET` | `/api/announcement` | Public announcement getter |
| 1103| `GET` | `/api/admin/promo-banners`| Get student promo passes |
| 1117| `POST` | `/api/admin/promo-banners`| Update student promo passes |
| 1131| `GET` | `/api/promo-banners` | Public promo passes getter |
| 1150| `GET` | `/api/admin/overview` | Admin overview KPI metrics |
| 1212| `GET` | `/api/admin/orders` | List student transactions |
| 1247| `POST` | `/api/admin/orders/:id/refund` | Refund order (no UI button) |
| 1278| `POST` | `/api/admin/entitlements/:id/revoke` | Revoke entitlement |
| 1289| `POST` | `/api/admin/entitlements/:id/extend` | Extend entitlement validity |
| 1345| `GET` | `/api/admin/courses` | List courses |
| 1355| `POST` | `/api/admin/courses` | Create course |
| 1380| `PUT` | `/api/admin/courses/:id` | Update course |
| 1391| `DELETE`| `/api/admin/courses/:id` | Delete course |
| 1402| `GET` | `/api/admin/extra-courses` | List supplementary courses |
| 1412| `POST` | `/api/admin/extra-courses` | Create supplementary course |
| 1482| `GET` | `/api/admin/carousel` | List carousel slides |
| 1523| `POST` | `/api/admin/carousel/sync-defaults` | Restore default slides |
| 1563| `POST` | `/api/admin/carousel` | Add carousel slide |
| 1599| `PUT` | `/api/admin/carousel/:id` | Edit carousel slide |
| 1625| `DELETE`| `/api/admin/carousel/:id` | Delete carousel slide |
| 1644| `GET` | `/api/admin/live-sessions`| List live sessions (deprecated) |
| 1654| `POST` | `/api/admin/live-sessions`| Add live session (deprecated) |
| 1680| `PUT` | `/api/admin/live-sessions/:id` | Edit live session (deprecated) |
| 1691| `DELETE`| `/api/admin/live-sessions/:id`| Delete live session (deprecated) |
| 1702| `GET` | `/api/admin/expenses` | List P&L expenses |
| 1712| `POST` | `/api/admin/expenses` | Record operating expense |
| 1737| `PUT` | `/api/admin/expenses/:id` | Edit operating expense |
| 1748| `DELETE`| `/api/admin/expenses/:id` | Delete operating expense |
| 1758| `GET` | `/api/admin/expenses/summary` | Net revenue & expense P&L |
| 1788| `GET` | `/api/admin/offers` | List promotional offers |
| 1798| `POST` | `/api/admin/offers` | Create promo offer |
| 1823| `PUT` | `/api/admin/offers/:id` | Update promo offer |
| 1834| `DELETE`| `/api/admin/offers/:id` | Delete promo offer |
| 1845| `GET` | `/api/admin/case-studies` | List admin case studies |
| 1855| `POST` | `/api/admin/case-studies` | Create case study |
| 1883| `PUT` | `/api/admin/case-studies/:id` | Update case study |
| 1894| `DELETE`| `/api/admin/case-studies/:id` | Delete case study |
| 1905| `GET` | `/api/admin/payments` | Raw Razorpay payment ledger |
| 1937| `GET` | `/api/admin/export/:entity` | Export students/orders CSV |
| 1976| `GET` | `/api/admin/settings` | Get site settings |
| 1986| `POST` | `/api/admin/settings` | Save site settings |

---

## 5. Summary of P0 Findings & Next Phase Mandates

1. **Phase P1 Mandate:**
   - Delete `frontend/public/assets/CSEET BUSINESS MANAGEMENT FINAL PRINT COPY.pdf` and `frontend/public/samples/CSEET_Business_Management_Notes.pdf`.
   - Remove orphaned standalone student routes, unused components (3D book, live sessions, etc.), and alias routes.
2. **Phase P2 Mandate:**
   - Redefine data model as `Course → Act → Unit → ContentItem`. Wipe old demo user seeds and mock resources.
3. **Phase P3 Mandate:**
   - Enforce Default Deny on Cloudinary storage. Ensure no API response returns raw PDF URLs or public IDs for paid items.
   - Create single gatekeeper `authorizeContentAccess` and streaming endpoint `GET /api/content/:itemId/file`.
4. **Phase P4 Mandate:**
   - Implement `grantEntitlement(orderId)` writing strictly to MongoDB Atlas with webhooks, reconciliation, and zero silent JSON fallback.
