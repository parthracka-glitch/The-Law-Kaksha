# Needs Approval

| ID | Item | Why | Recommendation | Risk | Raised by | Date | Status (Pending/Approved/Rejected) | Owner decision |
|---|---|---|---|---|---|---|---|---|
| APP-001 | Free-tier agent code access policy | Clarify whether free-tier models (e.g. Muse Spark Free) may read proprietary/client code | Restrict free-tier agents from reading `.env*`, database connection strings, or customer data files | Potential exposure of proprietary logic or credentials if sent to external training endpoints | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-002 | Repository visibility status | Clarify if repository is or will become open-source / public | Treat as public-bound; ensure all secrets and internal notes stay gitignored | Leakage of API secrets or proprietary documents if repo becomes public | [gemini 2026-10-05] | 2026-10-05 | Pending | |
| APP-003 | Agent specialization roles | Confirm default division of labor (`muse`: review/read/audit, `gemini`: edits/tests/docs) | Maintain default roles unless owner requests specific phase assignment | Workflow confusion or overlapping edits | [gemini 2026-10-05] | 2026-10-05 | Pending | |
