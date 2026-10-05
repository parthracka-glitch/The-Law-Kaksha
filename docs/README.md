# The Law Kaksha Documentation System (Docs-as-Code)

Welcome to the definitive architectural, operational, and product documentation repository for **The Law Kaksha** — India's premier digital learning platform for CA Foundation (Paper 2: Business Laws) and CSEET.

---

## Documentation Map & Verification Status

| Category / Directory | Document Name | Purpose | Status | Last Verified |
|---|---|---|---|---|
| **00-Overview** | [product-brief.md](00-overview/product-brief.md) | Mission, audience, problem solved, core value. | Verified against code | 2026-10-05 |
| | [personas-and-roles.md](00-overview/personas-and-roles.md) | Personas, jobs-to-be-done, RBAC permissions. | Verified against code | 2026-10-05 |
| | [glossary.md](00-overview/glossary.md) | Legal, pedagogical, and technical terms. | Verified against code | 2026-10-05 |
| | [stakeholders.md](00-overview/stakeholders.md) | Ownership, vendors, contacts. | Verified against code | 2026-10-05 |
| **01-Research** | [domain-research.md](01-research/domain-research.md) | ICAI / ICSI curriculum & pedagogical challenges. | Verified against code | 2026-10-05 |
| | [competitor-and-benchmark.md](01-research/competitor-and-benchmark.md) | Market analysis and product differentiators. | Verified against code | 2026-10-05 |
| | [technology-evaluation.md](01-research/technology-evaluation.md) | Next.js 16 + Express + Dual DB rationale. | Verified against code | 2026-10-05 |
| | [sources.md](01-research/sources.md) | Statutory regulations and SDK documentation. | Verified against code | 2026-10-05 |
| **02-Product** | [prd.md](02-product/prd.md) | Reconstructed product requirements. | Verified against code | 2026-10-05 |
| | [use-cases.md](02-product/use-cases.md) | Detailed actor, flow, and error specifications. | Verified against code | 2026-10-05 |
| | [user-stories-and-acceptance.md](02-product/user-stories-and-acceptance.md) | Gherkin acceptance criteria per user story. | Verified against code | 2026-10-05 |
| | [user-flows.md](02-product/user-flows.md) | Mermaid sequence diagrams for core flows. | Verified against code | 2026-10-05 |
| | [business-rules.md](02-product/business-rules.md) | Pricing, access, device lock, refund policies. | Verified against code | 2026-10-05 |
| | [feature-inventory.md](02-product/feature-inventory.md) | Status of all implemented features. | Verified against code | 2026-10-05 |
| | [roadmap.md](02-product/roadmap.md) | Gaps, prioritized roadmap, and Gantt milestones. | Verified against code | 2026-10-05 |
| **03-Architecture** | [system-overview.md](03-architecture/system-overview.md) | C4 container model and topology. | Verified against code | 2026-10-05 |
| | [components.md](03-architecture/components.md) | Subsystem components and responsibilities. | Verified against code | 2026-10-05 |
| | [data-flow.md](03-architecture/data-flow.md) | Request and payment lifecycles. | Verified against code | 2026-10-05 |
| | [integrations.md](03-architecture/integrations.md) | Third-party APIs (Razorpay, Cloudinary, Mongo). | Verified against code | 2026-10-05 |
| | [deployment.md](03-architecture/deployment.md) | Render web service & Vercel deployment specs. | Verified against code | 2026-10-05 |
| | [nfr-and-capacity.md](03-architecture/nfr-and-capacity.md) | Latency, availability, and capacity scaling. | Verified against code | 2026-10-05 |
| | [adr/0001](03-architecture/adr/0001-multi-agent-shared-memory.md) | Multi-Agent Shared Memory Architecture. | Verified against code | 2026-10-05 |
| | [adr/0002](03-architecture/adr/0002-dual-mode-database-fallback.md) | Dual-Mode Persistence Architecture. | Verified against code | 2026-10-05 |
| | [adr/0003](03-architecture/adr/0003-single-device-drm-binding.md) | Single-Device DRM Binding & Watermarking. | Verified against code | 2026-10-05 |
| **04-Data** | [erd.md](04-data/erd.md) | Mermaid Entity Relationship Diagram. | Verified against code | 2026-10-05 |
| | [schema-reference.md](04-data/schema-reference.md) | Collections, fields, constraints, sample records. | Verified against code | 2026-10-05 |
| | [data-dictionary.md](04-data/data-dictionary.md) | PII classifications and data definitions. | Verified against code | 2026-10-05 |
| | [data-lifecycle.md](04-data/data-lifecycle.md) | Retention horizons, backup, and purge protocols. | Verified against code | 2026-10-05 |
| | [migrations-and-seeding.md](04-data/migrations-and-seeding.md) | Seeders and schema evolution patterns. | Verified against code | 2026-10-05 |
| **05-API** | [api-reference.md](05-api/api-reference.md) | Complete endpoint specifications and payloads. | Verified against code | 2026-10-05 |
| | [authentication.md](05-api/authentication.md) | Token lifecycles and device binding logic. | Verified against code | 2026-10-05 |
| | [errors-and-rate-limits.md](05-api/errors-and-rate-limits.md) | Standard error codes and rate limit policies. | Verified against code | 2026-10-05 |
| | [webhooks.md](05-api/webhooks.md) | Razorpay webhooks and HMAC signatures. | Verified against code | 2026-10-05 |
| | [openapi.yaml](05-api/openapi.yaml) | Machine-readable OpenAPI 3.0 specification. | Verified against code | 2026-10-05 |
| **06-Frontend** | [routes-and-pages.md](06-frontend/routes-and-pages.md) | Next.js routes, access tiers, data sources. | Verified against code | 2026-10-05 |
| | [components.md](06-frontend/components.md) | UI components, props interfaces, conventions. | Verified against code | 2026-10-05 |
| | [state-and-data-fetching.md](06-frontend/state-and-data-fetching.md) | Context providers and API client wrappers. | Verified against code | 2026-10-05 |
| | [design-and-accessibility.md](06-frontend/design-and-accessibility.md) | Color tokens, typography, WCAG AA rules. | Verified against code | 2026-10-05 |
| **07-Security** | [threat-model.md](07-security/threat-model.md) | STRIDE architectural threat modeling. | Verified against code | 2026-10-05 |
| | [security-controls.md](07-security/security-controls.md) | OWASP ASVS Level 2 security controls. | Verified against code | 2026-10-05 |
| | [secrets-and-access.md](07-security/secrets-and-access.md) | Secrets inventory and rotation runbooks. | Verified against code | 2026-10-05 |
| | [incident-response.md](07-security/incident-response.md) | Severity triage, containment, and recovery. | Verified against code | 2026-10-05 |
| **08-Operations**| [setup-and-local-development.md](08-operations/setup-and-local-development.md) | Dev environment setup, run, test runbook. | Verified against code | 2026-10-05 |
| | [environments-and-config.md](08-operations/environments-and-config.md) | Environment variable definitions & placeholders. | Verified against code | 2026-10-05 |
| | [ci-cd-and-release.md](08-operations/ci-cd-and-release.md) | GitHub Actions CI/CD and deployment targets. | Verified against code | 2026-10-05 |
| | [monitoring-and-alerting.md](08-operations/monitoring-and-alerting.md) | Telemetry, health probes, and alert thresholds. | Verified against code | 2026-10-05 |
| | [backup-restore-dr.md](08-operations/backup-restore-dr.md) | Disaster recovery, automated backups, and RTO/RPO. | Verified against code | 2026-10-05 |
| | [runbook.md](08-operations/runbook.md) | Production incident triage and operational fixes. | Verified against code | 2026-10-05 |
| | [rollback.md](08-operations/rollback.md) | Deployment rollback runbook for Vercel and Render. | Verified against code | 2026-10-05 |
| **09-Testing** | [test-strategy.md](09-testing/test-strategy.md) | Ephemeral test architecture and quality pyramid. | Verified against code | 2026-10-05 |
| | [test-plan-and-cases.md](09-testing/test-plan-and-cases.md) | Test matrix of all 35 integration test cases. | Verified against code | 2026-10-05 |
| | [uat-checklist.md](09-testing/uat-checklist.md) | Owner sign-off checklist across key flows. | Ready for Sign-off | 2026-10-05 |
| | [coverage-and-results.md](09-testing/coverage-and-results.md) | 100% pass rate scorecard and execution breakdown. | Verified against code | 2026-10-05 |
| **10-Legal** | [data-inventory.md](10-legal/data-inventory.md) | Personal data inventory and sub-processor audit. | Draft (Legal Review) | 2026-10-05 |
| | [privacy-policy.md](10-legal/privacy-policy.md) | Privacy policy under DPDP Act 2023. | Draft (Legal Review) | 2026-10-05 |
| | [terms-of-service.md](10-legal/terms-of-service.md) | Terms of service and DRM licensing terms. | Draft (Legal Review) | 2026-10-05 |
| | [cookie-policy.md](10-legal/cookie-policy.md) | Minimalist essential storage policy. | Draft (Legal Review) | 2026-10-05 |
| | [refund-policy.md](10-legal/refund-policy.md) | E-commerce refund and instant fulfillment rules. | Draft (Legal Review) | 2026-10-05 |
| | [legal-review-checklist.md](10-legal/legal-review-checklist.md) | Briefing notes and checklist for counsel. | Draft (Legal Review) | 2026-10-05 |
| | [third-party-licenses-and-notices.md](10-legal/third-party-licenses-and-notices.md) | Software Bill of Materials (SBOM) & attribution. | Draft (Legal Review) | 2026-10-05 |
| | [disclaimer.md](10-legal/disclaimer.md) | Academic & examination non-affiliation notice. | Draft (Legal Review) | 2026-10-05 |
| | [acceptable-use-policy.md](10-legal/acceptable-use-policy.md) | Permitted study rules and DRM anti-piracy terms. | Draft (Legal Review) | 2026-10-05 |
| | [data-retention-and-deletion-policy.md](10-legal/data-retention-and-deletion-policy.md) | Storage limitations and candidate erasure rights. | Draft (Legal Review) | 2026-10-05 |
| | [consent-texts.md](10-legal/consent-texts.md) | Mandatory and unbundled consent disclosures. | Draft (Legal Review) | 2026-10-05 |
| **11-Launch** | [launch-readiness.md](11-launch/launch-readiness.md) | Executive readiness scorecard & conditional verdict. | Verified against code | 2026-10-05 |
| | [launch-plan.md](11-launch/launch-plan.md) | Staged rollout (Stages 0–3). | Verified against code | 2026-10-05 |
| | [user-guide-and-faq.md](11-launch/user-guide-and-faq.md) | Student onboarding steps and answers to top queries. | Verified against code | 2026-10-05 |
| | [support-playbook.md](11-launch/support-playbook.md) | Support team incident triage and scripts. | Verified against code | 2026-10-05 |
| | [release-notes-and-changelog.md](11-launch/release-notes-and-changelog.md) | Complete changelog of v1.0.0 release. | Verified against code | 2026-10-05 |
| | [runbook.md](11-launch/runbook.md) | Launch monitoring probes and emergency procedures. | Verified against code | 2026-10-05 |
| | [go-no-go-checklist.md](11-launch/go-no-go-checklist.md) | Production sign-off verification scorecard. | Verified against code | 2026-10-05 |
| **Audit Suite** | [PROJECT_UNDERSTANDING.md](audit/PROJECT_UNDERSTANDING.md) | Core product, contracts, constraints, and scope. | Verified against code | 2026-10-05 |
| | [BASELINE.md](audit/BASELINE.md) | Pre-audit system reconnaissance baseline. | Baseline Tagged | 2026-10-05 |
| | [PRODUCT_AND_FLOWS.md](audit/PRODUCT_AND_FLOWS.md) | End-to-end user journeys, edge cases, and states. | Verified against code | 2026-10-05 |
| | [PREMORTEM.md](audit/PREMORTEM.md) | Top 10 launch failure modes and mitigations. | Verified against code | 2026-10-05 |
| | [SECURITY_FINDINGS.md](audit/SECURITY_FINDINGS.md) | Register of security findings & resolutions. | Verified against code | 2026-10-05 |
| | [DEAD_CODE_LOG.md](audit/DEAD_CODE_LOG.md) | Dead code, clutter & component inventory. | Verified against code | 2026-10-05 |
| | [BUGS_FIXED.md](audit/BUGS_FIXED.md) | Detailed bug causes, fixes, and tests. | Verified against code | 2026-10-05 |
| | [STRUCTURE_MAP.md](audit/STRUCTURE_MAP.md) | Repository organization and boundary rules. | Verified against code | 2026-10-05 |
| | [ROLLBACK.md](audit/ROLLBACK.md) | Reversal commands and recovery runbooks. | Verified against code | 2026-10-05 |
| | [GAPS_AND_ROADMAP.md](audit/GAPS_AND_ROADMAP.md) | Architectural debt and feature roadmap. | Verified against code | 2026-10-05 |
| | [LEGAL_AND_COMPLIANCE_FLAGS.md](audit/LEGAL_AND_COMPLIANCE_FLAGS.md) | Legal flags, SBOM, statutory regimes. | Verified against code | 2026-10-05 |
| | [LAUNCH_READINESS.md](audit/LAUNCH_READINESS.md) | Launch evaluation and verdict decision. | Verified against code | 2026-10-05 |
| | [METRICS_BEFORE_AFTER.md](audit/METRICS_BEFORE_AFTER.md) | Before vs. after comparative scorecard. | Verified against code | 2026-10-05 |
| | [FINAL_REPORT.md](audit/FINAL_REPORT.md) | Final comprehensive audit executive report. | Verified against code | 2026-10-05 |
| | [NEEDS_APPROVAL.md](audit/NEEDS_APPROVAL.md) | Key decisions requiring owner sign-off. | Verified against code | 2026-10-05 |
| | [PROGRESS.md](audit/PROGRESS.md) | Multi-phase audit tracker (Phases 0–10). | Complete (All 10 Done) | 2026-10-05 |
