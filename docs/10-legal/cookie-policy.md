# Cookie & Local Storage Policy

> **Notice:** DRAFT: requires review by a qualified lawyer before publication. Not legal advice.  
> **Last Updated:** 2026-10-05  
> **Version:** 1.0.0-draft  

---

## 1. What Are Cookies & Local Storage

Cookies and local storage are small text files and key-value records placed on your computing device when visiting websites. They facilitate essential functions such as maintaining authenticated login sessions and retaining shopping cart contents.

---

## 2. Our Cookie & Storage Practices

The Law Kaksha adheres to a **Privacy-First Minimalist Storage Architecture**:
- **Zero Third-Party Advertising Cookies:** We do not partner with third-party ad networks, tracking pixels, or cross-site tracking companies.
- **Strictly Essential Cookies Only:** All storage mechanisms utilized by the platform are strictly necessary for core functionality.

---

## 3. Storage Mechanisms in Use

| Key / Cookie Name | Provider | Nature | Purpose | Lifespan |
|---|---|---|---|---|
| `lawkaksha_token` | First-Party (`localStorage`) | Strictly Necessary | JWT authorization token for student portal access | 30 days or user logout |
| `lawkaksha_active_student` | First-Party (`localStorage`) | Strictly Necessary | Student name and exam level for client rendering | Until user logout |
| `lawkaksha_cart` | First-Party (`localStorage`) | Strictly Necessary | Preserves selected study volumes in cart across pages | Until cart cleared |
| `lawkaksha_device_id` | First-Party (`localStorage`) | Strictly Necessary | Unique browser device identifier for single-device DRM | Persistent |
| `rzp_checkout_anon_id` | Razorpay Gateway (Cookie) | Strictly Necessary | Payment gateway transaction state tracking | Checkout session |

---

## 4. Managing Your Preferences

Because our cookies and storage keys are strictly required to operate the learning management system, disabling local storage in your browser settings will prevent login and access to purchased study codices.
