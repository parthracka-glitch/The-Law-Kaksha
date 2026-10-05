# Statutory Consent Texts & UI Disclosure Architecture

> **Notice:** DRAFT: requires review by a qualified lawyer before publication. Not legal advice.  
> **Last Updated:** 2026-10-05  
> **Version:** 1.0.0-draft  
> **Statutory Basis:** Section 6, Digital Personal Data Protection Act, 2023 (DPDP Act)  

---

## 1. Principles of Valid Consent under DPDP Act 2023

Consent collected by The Law Kaksha must be:
1. **Free:** Freely given without coercion; non-essential marketing consent must never be a prerequisite for educational service delivery.
2. **Informed:** Accompanied by a clear, itemized notice in plain, simple English describing the personal data processed and specific purposes.
3. **Specific:** Unbundled from general terms.
4. **Unconditional:** Pre-ticked checkboxes are strictly prohibited.
5. **Clear & Affirmative:** Requires positive action by the candidate.

---

## 2. Standard Registration & Account Creation Consent

### UI Placement: Candidate Registration Modal / Form (`/register`)

```
[ ] I agree to the [Terms of Service] and consent to the processing of my personal data (name, email, phone number, and single-device identifier) by The Law Kaksha in accordance with the [Privacy Policy] to facilitate course delivery, single-device DRM protection, and examination updates. (Mandatory)
```

```
[ ] I agree to receive statutory exam date alerts, revision reminders, and academic case law updates via WhatsApp and SMS. (Optional - Unbundled)
```

---

## 3. Checkout & Payment Authorization Consent

### UI Placement: Enrollment Modal / Checkout Screen (`/checkout`)

```
"By proceeding to payment via Razorpay, you acknowledge that all fee payments are non-refundable once digital course materials and DRM codices are unlocked in your student dashboard, subject to our [Refund & Cancellation Policy]. You agree to study materials on an authorized single device under our [Acceptable Use Policy]."
```

---

## 4. Cookie & Storage Notice (Minimalist Banner)

Because The Law Kaksha employs **strictly essential cookies and local storage only** (zero third-party advertising tracking), a traditional opt-in cookie banner is not legally mandated under global privacy norms, but an informational transparency notice is provided in the footer:

```
"We use strictly essential local storage and session tokens to keep you logged in and secure your study notes. By using our platform, you acknowledge our [Cookie & Storage Policy]."
```
