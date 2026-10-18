# Legal & Compliance Audit Flags

> **Purpose:** Independent evaluation of legal compliance, licensing risks, applicable statutory regimes, and open items requiring counsel review.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Legal & Compliance Specialist  

---

## 1. Compliance Regime Applicability Matrix

| Regime / Statute | Applicability | Assessment & Current Posture | Action Item |
|---|---|---|---|
| **Digital Personal Data Protection Act, 2023 (India)** | **Mandatory** | The platform collects names, emails, phone numbers, and device telemetry of Indian students. | Privacy policy drafted in `docs/10-legal/privacy-policy.md`. Counsel must verify minor (under 18) consent mechanism for school-leaving CA Foundation candidates. |
| **Information Technology (Intermediary Guidelines) Rules, 2021** | **Mandatory** | User-generated forum or comment content, contact forms, and grievance handling. | Grievance Officer designation with physical postal address and email required on website footer. |
| **Consumer Protection (E-Commerce) Rules, 2020** | **Mandatory** | Digital sale of educational subscriptions and study codices to consumers across India. | Clear disclosure of pricing, GST treatment, duplicate payment refund terms, and customer care contact. |
| **PCI-DSS (Payment Card Industry Data Security Standard)** | **Out of Scope (Delegated)** | No card numbers, expiry dates, or CVVs enter The Law Kaksha servers. Card input occurs strictly within Razorpay's PCI-DSS Level 1 iframe. | Maintain strict avoidance of raw card data collection. |
| **Indian Copyright Act, 1957 (Fair Dealing)** | **Mandatory** | Quotation of statutory Bare Act provisions and references to ICAI / ICSI examination questions. | Clear disclaimers stating independent academic commentary and non-affiliation with ICAI/ICSI. |

---

## 2. Open-Source Software (SBOM) & License Review

| Component / Library | Stated License | Commercial Use Permitted? | Risk Level |
|---|---|:---:|:---:|
| `next`, `react`, `react-dom` | MIT License | Yes | None |
| `express`, `cors`, `morgan` | MIT License | Yes | None |
| `mongoose`, `mongodb` | Apache 2.0 / MIT | Yes | None |
| `bcryptjs`, `jsonwebtoken` | MIT License | Yes | None |
| `razorpay` | MIT License | Yes | None |
| `lucide-react` | ISC License | Yes | None |
| `pdfjs-dist` | Apache 2.0 | Yes | None |
| `canvas-confetti` | MIT License | Yes | None |

> [!NOTE]
> All direct application dependencies utilize permissive MIT, ISC, or Apache 2.0 licenses. Zero GPL, AGPL, or viral copyleft licenses were discovered in the production dependency tree.

---

## 3. High-Priority Items for Owner Decision

1. **Official Legal Entity Registration:** Provide legal name and address in `docs/audit/NEEDS_APPROVAL.md`.
2. **Grievance Officer Appointment:** Appoint designated individual and configure `grievance@thelawkaksha.com` alias.
3. **Minor Student Consent Workflow:** Determine whether CA Foundation registration form should include a parental confirmation checkbox for candidates under age 18.
