# User Journey & System Interaction Flows

**Purpose:** Visual interaction diagrams detailing core user journeys, validation boundaries, and subsystem state transitions.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Student Registration, Device Binding & Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as Next.js Client
    participant API as Express API
    participant DB as MongoDB / LocalDb

    Student->>Browser: Enters credentials / Clicks Login
    Browser->>Browser: Reads/Generates deviceId from localStorage
    Browser->>API: POST /api/auth/login {email, password, deviceId}
    API->>DB: Query User by email
    DB-->>API: Return User document
    API->>API: Verify password with bcryptjs.compare()
    alt Password Invalid
        API-->>Browser: 401 Unauthorized
    else Password Valid
        API->>API: Check user.activeDeviceId
        alt Device Mismatch (Already bound to another device)
            API-->>Browser: 409 Conflict (DEVICE_MISMATCH)
            Browser->>Student: Show Device Reset Prompt
        else Device Valid or Unassigned
            API->>DB: Update user.activeDeviceId = deviceId
            API->>API: Generate JWT {userId, role, deviceId}
            API-->>Browser: 200 OK {token, user, unlockedItemIds}
            Browser->>Browser: Store JWT in localStorage
            Browser->>Student: Redirect to Study Desk
        end
    end
```

---

## 2. Course Access Pass Purchase & Fulfillment Flow (Razorpay)

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as Next.js Client
    participant API as Express API
    participant Razorpay as Razorpay Gateway
    participant DB as MongoDB / LocalDb

    Student->>Browser: Clicks "Enroll Now (₹199)"
    Browser->>API: POST /api/payment/create-order {itemId: "QBANK-1"}
    API->>DB: Fetch Material price (19900 paise)
    API->>Razorpay: razorpay.orders.create({amount: 19900, currency: "INR"})
    Razorpay-->>API: Return order {id: "order_xyz", amount: 19900}
    API->>DB: Save pending Order record
    API-->>Browser: 200 OK {orderId: "order_xyz", amount: 19900, key: RAZORPAY_KEY_ID}
    Browser->>Razorpay: Open Razorpay Checkout modal
    Student->>Razorpay: Completes payment (UPI / Card / NetBanking)
    Razorpay-->>Browser: Returns {razorpay_payment_id, razorpay_order_id, razorpay_signature}
    Browser->>API: POST /api/payment/verify {paymentId, orderId, signature}
    API->>API: Verify HMAC SHA-256 (orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)
    alt Invalid Signature
        API-->>Browser: 400 Bad Request (Tampered signature)
    else Signature Verified
        API->>DB: Update order status = "PAID"
        API->>DB: Append itemId to user.unlockedItemIds
        API-->>Browser: 200 OK {success: true, unlockedItemIds}
        Browser->>Student: Show success alert & unlock study materials
    end
```

---

## 3. In-Browser 3D Document Reader & Watermark Projection

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as Next.js Client (PDF.js)
    participant API as Express API
    participant Cloudinary as Cloudinary / Asset Host

    Student->>Browser: Navigates to /reader?id=mat-101
    Browser->>API: GET /api/materials/mat-101 (Header: Bearer Token, X-Device-ID)
    API->>API: authMiddleware verifies JWT & activeDeviceId
    alt Token Invalid or Device Mismatch
        API-->>Browser: 401 / 403 (Session Expired / Device Conflict)
    else Authorized
        API->>API: Check if mat-101 in user.unlockedItemIds or isFree
        alt Not Unlocked
            API-->>Browser: 403 Forbidden (Item Locked)
        else Unlocked
            API-->>Browser: 200 OK {fileUrl, title, watermarkData}
            Browser->>Cloudinary: Fetch document binary stream
            Cloudinary-->>Browser: Return binary PDF
            Browser->>Browser: PDF.js renders vector pages to canvas
            Browser->>Browser: Client draws non-selectable watermark overlay: "{user.name} ({user.email})"
            Browser->>Student: Interactive 3D flipbook available
        end
    end
```
