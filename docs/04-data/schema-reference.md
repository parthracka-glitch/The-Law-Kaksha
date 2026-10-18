# Database Schema Reference

**Purpose:** Definitive reference for all collections, document models, fields, types, constraints, and indexes.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. `User` Schema (`backend/src/models/User.js`)

| Field Name | Type | Required | Default | Indexes / Constraints | Description |
|---|---|---|---|---|---|
| `id` | String | Yes | None | Unique, Index | Primary application UUID (e.g. `usr-1791112785039-663`). |
| `student_id` | String | No | `""` | Index | Optional academic roll or registration number. |
| `name` | String | Yes | None | None | Student or administrator full legal name. |
| `email` | String | Yes | None | Unique, Index, Lowercase, Trim | Registered email address. |
| `phone` | String | No | `""` | Index | Mobile phone number (used for UPI/WhatsApp). |
| `password_hash` | String | No | None | None | Bcrypt password hash (omitted for OAuth users). |
| `role` | String | No | `"student"` | Enum: `["student", "admin"]` | Access tier. |
| `target_exam` | String | No | `"CA Foundation Paper 2"` | None | Target examination specification. |
| `is_active` | Boolean | No | `true` | None | Account operational state flag. |
| `drm_access` | Boolean | No | `true` | None | Flag authorizing access to in-web 3D reader. |
| `unlockedItemIds` | [String] | No | `[]` | None | Array of purchased or granted material/product IDs. |
| `activeDeviceId` | String | No | `""` | None | Client-generated UUID bound to single active hardware device. |
| `activeDeviceName` | String | No | `""` | None | Friendly device string (e.g. "Edge on Windows PC"). |
| `lastActiveAt` | Date | No | `Date.now` | None | Timestamp of most recent authenticated API interaction. |
| `googleId` | String | No | `""` | None | External Google OAuth 2.0 subject ID. |
| `resetPasswordToken` | String | No | `""` | None | Cryptographic password reset token. |
| `resetPasswordExpires`| Date | No | None | None | Expiration timestamp for password reset token. |

---

## 2. `Product` Schema (`backend/src/models/Product.js`)

| Field Name | Type | Required | Default | Indexes / Constraints | Description |
|---|---|---|---|---|---|
| `id` | String | Yes | None | Unique, Index | Product identifier (e.g. `CA-FND-QBANK-1`). |
| `title` | String | Yes | None | None | Display title of course or codex. |
| `subtitle` | String | No | `""` | None | Secondary promotional subtitle. |
| `category` | String | No | `"CA Foundation"` | Enum: `["CA Foundation", "CSEET", "Both"]` | Target curriculum category. |
| `format` | String | No | `"Digital Codex (In-Web DRM)"` | None | Fulfillment description. |
| `price` | Number | Yes | None | None | Effective purchase price (in INR). |
| `originalPrice` | Number | No | `499` | None | Strikethrough anchor price for discounts. |
| `pages` | String | No | `"150+ Pages"` | None | Page volume indicator. |
| `status` | String | No | `"Active"` | Enum: `["Active", "Draft"]` | Visibility status in catalog. |
| `pdfUrl` | String | No | None | None | Streaming endpoint for document payload. |
| `units` | [String] | No | `[]` | None | Statutory acts/chapters included. |
| `isSample` | Boolean | No | `false` | None | Whether free preview pages are readable. |

---

## 3. `Subscription` Schema (`backend/src/models/Subscription.js`)

| Field Name | Type | Required | Default | Indexes / Constraints | Description |
|---|---|---|---|---|---|
| `id` | String | Yes | None | Unique, Index | Subscription record UUID. |
| `studentName` | String | Yes | None | None | Name of the student subscriber. |
| `email` | String | Yes | None | Index, Lowercase | Associated user account email. |
| `item` | String | Yes | None | None | Title/Identifier of purchased pass. |
| `amount` | String | Yes | None | None | Total transaction amount paid. |
| `paymentMode` | String | No | `"UPI / Razorpay"` | None | Payment channel. |
| `accessStatus` | String | No | `"Active"` | Enum: `["Active", "Pending", "Revoked"]` | Entitlement state. |
| `unlockedItemIds` | [String] | No | `[]` | None | List of unlocked materials granted. |
