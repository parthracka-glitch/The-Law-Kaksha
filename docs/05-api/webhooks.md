# Webhook Integration & Asynchronous Events

**Purpose:** Documents inbound webhook handlers, signature verification protocols, and event retry policies.  
**Status:** Verified against code & Razorpay specifications  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Razorpay Payment Webhooks

The platform supports both synchronous client-side callback verification (`POST /api/payment/verify`) and asynchronous payment gateway webhooks:

- **Endpoint Path:** `/api/payment/webhook` (or `/api/webhooks/razorpay`)
- **Transport:** HTTP POST with JSON body and `X-Razorpay-Signature` header.
- **Payload Events Handled:**
  - `payment.captured`: Transaction confirmed by issuing bank.
  - `payment.failed`: Transaction failed or dropped by user.
  - `order.paid`: Full payment captured against the generated order ID.

---

## 2. Webhook Signature Verification Algorithm

To defend against forged webhook events, the backend validates incoming payloads against `RAZORPAY_WEBHOOK_SECRET` before updating subscription entitlements:

```javascript
const crypto = require("crypto");

function verifyRazorpayWebhook(rawBody, signature, secret) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return expectedSignature === signature;
}
```

---

## 3. Idempotency & Failure Handling

- **Idempotent Entitlement:** If multiple `order.paid` webhooks are delivered for the same transaction, the backend checks if `order.status === 'PAID'` and verifies whether `itemId` is already in `user.unlockedItemIds`. If present, the handler returns 200 OK without re-appending duplicate entries.
- **Retry Policy:** Razorpay retries webhook deliveries with exponential backoff over a 24-hour window if the server responds with non-2xx status codes.
