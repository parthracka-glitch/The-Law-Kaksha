# Needs Approval

| ID | Item | Why | Recommendation | Risk | Raised by | Date | Status (Pending/Approved/Rejected) | Owner decision |
|---|---|---|---|---|---|---|---|---|
| APP-001 | Free-tier agent code access policy | Clarify whether free-tier models may read proprietary/client code | Restrict free-tier agents from reading `.env*`, database strings, or customer data files | Low | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-002 | Repository visibility status | Clarify if repository is or will become open-source / public | Treat as public-bound; ensure all secrets and internal notes stay gitignored | Medium | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-003 | Agent specialization roles | Confirm default division of labor (`muse`: review, `gemini`: edits/tests/docs) | Maintain default roles unless owner requests specific phase assignment | Low | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-004 | Corporate Legal Entity & Registered Address | Required for legal documents (`/terms`, `/privacy`) under Indian E-Commerce Rules | Provide official entity name, address, and city jurisdiction | Medium | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-005 | Grievance Officer Appointment | Mandated by IT (Intermediary Guidelines) Rules, 2021 | Appoint designated officer name, physical address, and grievance email | Medium | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-006 | Production Razorpay Gateway Activation | Transition from sandbox test signatures to live UPI / card settlement | Configure live `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in hosting dashboards | High | [gemini 2026-10-05] | 2026-10-05 | Pending | |

