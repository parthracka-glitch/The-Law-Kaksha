# User Acceptance Testing (UAT) Checklist

> **Document Status:** Complete & Ready for Owner Sign-off  
> **Last Verified Date:** 2026-10-05  
> **Target Audience:** Platform Owner, Academic Lead, Legal Sign-off  

---

## Instructions for the Platform Owner

Please perform the following end-to-end user verification checks in your staging/preview environment prior to signing off on public launch.

---

## 1. Candidate Acquisition & Enrollment Flow

| Check # | Verification Item | Steps to Verify | Pass / Fail | Sign-off Notes |
|:---:|---|---|:---:|---|
| **UAT-01** | Landing Page Visual Appeal & Branding | Open `https://thelawkaksha.com` on desktop and mobile. Check hero section, clear logo, typography, and "Simplified Business Law Notes" value proposition. | [ ] Pass | |
| **UAT-02** | Curriculum Outline & Course Details | Navigate to `/courses` and click on CA Foundation Paper 2. Verify syllabus breakdown (Contract Act, Sale of Goods, etc.). | [ ] Pass | |
| **UAT-03** | Course Pricing Transparency | Verify introductory pricing (₹99 / ₹199) is displayed accurately without hidden surcharges. | [ ] Pass | |
| **UAT-04** | Candidate Checkout Initiation | Click "Enroll Now", enter test candidate name, email, and phone number. Verify Razorpay checkout modal opens with correct amount. | [ ] Pass | |
| **UAT-05** | Sandbox Payment Completion | Complete test transaction using Razorpay test card / UPI mock. Verify immediate redirect to Student Portal. | [ ] Pass | |

---

## 2. Student Learning & DRM Reader Experience

| Check # | Verification Item | Steps to Verify | Pass / Fail | Sign-off Notes |
|:---:|---|---|:---:|---|
| **UAT-06** | Instant Digital Codex Unlocking | On Student Dashboard (`/student`), verify that purchased course notes show as "Unlocked" with "Open Codex" action. | [ ] Pass | |
| **UAT-07** | In-Browser 3D Flipbook Reader | Open study codex. Verify page turning animations, zoom controls, and smooth rendering. | [ ] Pass | |
| **UAT-08** | Dynamic Security Watermark | Confirm that reader displays floating watermark showing student name, roll number, and date stamp. | [ ] Pass | |
| **UAT-09** | Direct Download Prevention | Right-click on reader or attempt to navigate directly to `/notes/sample.pdf`. Confirm that browser "Save As" is blocked or redirected. | [ ] Pass | |
| **UAT-10** | Single-Device Enforcement | Log in on laptop. Open phone browser and log in with same email. Confirm clear "Device Conflict" prompt with self-service switch option. | [ ] Pass | |

---

## 3. Administrative Governance & Oversight

| Check # | Verification Item | Steps to Verify | Pass / Fail | Sign-off Notes |
|:---:|---|---|:---:|---|
| **UAT-11** | Admin Authentication Gate | Navigate to `/admin`. Confirm non-admins are redirected or rejected with clear message. | [ ] Pass | |
| **UAT-12** | Student Registry & Active Sessions | In `/admin`, verify student roster displays registered students, active device IDs, and enrollment timestamps. | [ ] Pass | |
| **UAT-13** | Manual Hardware Device Reset | In admin panel, test resetting a student's device lock and verify student can re-bind on a new device. | [ ] Pass | |

---

## 4. Legal Compliance & Footer Navigation

| Check # | Verification Item | Steps to Verify | Pass / Fail | Sign-off Notes |
|:---:|---|---|:---:|---|
| **UAT-14** | Privacy Policy Page | Click "Privacy Policy" in footer (`/privacy`). Verify DPDP Act 2023 disclosures and grievance officer contacts. | [ ] Pass | |
| **UAT-15** | Terms of Service Page | Click "Terms of Service" in footer (`/terms`). Verify digital copyright and single-device DRM terms. | [ ] Pass | |
| **UAT-16** | Refund Policy Page | Click "Refund Policy" in footer (`/refund`). Verify instant fulfillment and refund terms. | [ ] Pass | |
| **UAT-17** | Cookie & Storage Policy Page | Click "Cookie Policy" in footer (`/cookies`). Verify essential storage table. | [ ] Pass | |
| **UAT-18** | Examination Disclaimer Modal | Click "Examination Disclaimer" in footer. Verify ICAI/ICSI non-affiliation disclaimer opens cleanly. | [ ] Pass | |

---

## Sign-off Signature Block

- **Platform Owner Signature:** `___________________________`
- **Date:** `___________________________`
- **Launch Approval Status:** `[ ] APPROVED TO GO LIVE` · `[ ] REVISIONS REQUIRED`
