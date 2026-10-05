# Data Inventory & Privacy Audit

> **Notice:** DRAFT: requires review by a qualified lawyer before publication. Not legal advice.  
> **Purpose:** Comprehensive inventory of personal and sensitive data collected, storage location, processing purpose, retention period, and third-party recipients.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Legal & Compliance Specialist  

---

## 1. Personal Data Inventory

| Data Field | Data Category | Source / Collection Point | Storage Location | Processing Purpose | Retention Period | Access Control |
|---|---|---|---|---|---|---|
| **Full Name** | Identity Data | Registration form, Checkout modal | MongoDB Atlas (`users`, `orders`), Local Cache | Account identification, order receipts, DRM reader watermarking | Duration of account + 3 years for tax audits | Student (Self), Admin |
| **Email Address** | Identity / Contact Data | Registration form, Google OAuth, Checkout | MongoDB Atlas (`users`, `orders`, `subscriptions`) | Authentication, password reset, transaction receipts | Duration of account | Student (Self), Admin |
| **Phone Number** | Contact Data | Registration form, Checkout | MongoDB Atlas (`users`, `orders`) | SMS/WhatsApp course updates, order verification | Duration of account | Student (Self), Admin |
| **Password Hash** | Security Credential | Registration form, Reset password | MongoDB Atlas (`users.password_hash`) | Bcrypt hashed (cost factor 10) credential verification | Until account deletion or password change | Internal auth engine only (Never exposed in API) |
| **Device ID & Name** | Technical / Telemetry Data | Browser `localStorage`, User-Agent, DeviceHelper | MongoDB Atlas (`users.activeDeviceId`, `activeDeviceName`) | Enforcing single-device DRM anti-piracy licensing | Overwritten upon authorized device switch | Student (Self), Admin |
| **IP Address** | Technical Data | HTTP request socket, Edge proxy | In-memory rate limiting tables, Server access logs | Brute-force & DDoS protection, security audit logs | Transient (1-minute window in RAM; 30 days in logs) | System automated rate limiter |
| **Payment ID & Transaction Metadata** | Financial Data | Razorpay Checkout SDK | MongoDB Atlas (`orders.gateway_payment_id`, `gateway_order_id`) | Fulfillment of digital study materials, statutory accounting | 7 years (Statutory accounting & tax requirement) | Admin, Authorized Payment Processor |

> [!NOTE]
> **Credit / Debit Card Data:** The Law Kaksha **never** collects, processes, or stores raw credit card numbers, CVVs, or bank net banking credentials. All payment processing occurs inside Razorpay's PCI-DSS Level 1 certified iframe.

---

## 2. Third-Party Data Processors & Sub-processors

| Sub-processor | Country / Region | Processing Role | Data Transferred | Privacy Shield / Security Safeguards |
|---|---|---|---|---|
| **Razorpay Software Private Limited** | India | Payment Gateway & Checkout Processing | Order amount, customer email, customer phone, customer name | PCI-DSS Level 1 Compliant, ISO 27001 |
| **MongoDB Atlas (AWS Mumbai / ap-south-1)** | India | Cloud Database Provider | User accounts, orders, DRM access lists, learning progress | TLS 1.3 in transit, AES-256 at rest, SOC 2 Type II |
| **Vercel Inc. / Render** | Global / US / Frankfurt | Application Hosting & Serverless Edge | IP address, HTTP headers, transient request payloads | SOC 2 Type II, ISO 27001 |
| **Cloudinary** | Global / US | Document & Asset Cloud Storage | PDF notes, study codices, diagram images | SOC 2 Type II compliant |
| **Google LLC** | Global | OAuth 2.0 Single Sign-On | Google profile ID, verified email address, avatar URL | ISO 27001, Google Identity Standards |

---

## 3. Client-Side Storage & Cookie Audit

| Storage Mechanism | Key / Cookie Name | Purpose | Duration | Essential or Non-Essential |
|---|---|---|---|---|
| `localStorage` | `lawkaksha_token` | JWT authentication bearer token | 30 days or until logout | **Essential** (Authentication) |
| `localStorage` | `lawkaksha_active_student` | Cached profile for offline header rendering | Persistent until logout | **Essential** (Session state) |
| `localStorage` | `lawkaksha_cart` | Active cart items & coupon selection | Persistent until clear | **Essential** (E-commerce) |
| `localStorage` | `lawkaksha_device_id` | Client device identifier for single-device DRM | Persistent | **Essential** (Security & DRM) |
| Browser Session | `rzp_checkout_anon_id` | Razorpay checkout session identifier | Session | **Essential** (Payment checkout) |

*The Law Kaksha sets zero third-party behavioral advertising cookies or cross-site tracking pixels.*
