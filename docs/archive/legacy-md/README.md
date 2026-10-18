<div align="center">

<img src="frontend/public/assets/hero%20section..svg" alt="The Law Kaksha Banner" width="100%" />

<br />
<br />

# The Law Kaksha (The Law कक्षा)
### Enterprise Chartered Accountancy Law Education & Assessment Infrastructure

[![Production Status](https://img.shields.io/badge/Production_Audit-PASSED_(9.14/10)-059669?style=for-the-badge&logo=checkmarx)](PROJECT_REVIEW_AND_GUIDE.md)
[![Security Status](https://img.shields.io/badge/Security-OWASP_Hardened_|_0_Vulns-0A192F?style=for-the-badge&logo=shield)](PROJECT_REVIEW_AND_GUIDE.md#6-security-audit--owasp-top-102025-hardening)
[![Architecture](https://img.shields.io/badge/Architecture-Next.js_16_%7C_Node_Express-005A9C?style=for-the-badge)](https://lawkaksha.edu)
[![Compliance](https://img.shields.io/badge/DPDP_Act_2023-Aligned-7C2D12?style=for-the-badge)](PROJECT_REVIEW_AND_GUIDE.md#8-data-architecture-integrity--disaster-recovery)
[![ICAI Standard](https://img.shields.io/badge/ICAI_Standard-Compliant-059669?style=for-the-badge)](https://lawkaksha.edu)

<p align="center">
  <b>The Law Kaksha</b> is a dedicated digital learning and statutory assessment platform engineered exclusively for Chartered Accountancy aspirants across India (CA Foundation, CA Intermediate Paper 2: Corporate & Other Laws, and CA Final).
</p>

> [!NOTE]
> **Production Audit Complete**: For full audit scorecards, test verification logs, OWASP security remediations, and 100% feature coverage matrices, consult [PROJECT_REVIEW_AND_GUIDE.md](PROJECT_REVIEW_AND_GUIDE.md).

</div>

---

## 🏛️ System Overview & Platform Modules

The platform is architected as an institutional-grade educational ecosystem featuring segregated student and administrative portals, hardware-bound digital rights management (DRM), real-time statutory drill engines, and live national rankings.

```
                                  ┌────────────────────────┐
                                  │    The Law Kaksha      │
                                  │   Central Controller   │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
        ┌───────────▼───────────┐                           ┌───────────▼───────────┐
        │   Student Portal      │                           │   Admin Command       │
        │   (/student)          │                           │   (/admin)            │
        ├───────────────────────┤                           ├───────────────────────┤
        │ • Real-Time Streak    │                           │ • Command Center      │
        │ • DRM Vault & PDF     │                           │ • Quiz CRUD Builder   │
        │ • ICAI Mock Quizzes   │                           │ • Waybill Dispatch    │
        │ • All-India Leaderboard│                          │ • HWID Registry       │
        │ • Module Progress     │                           │ • Catalog & Courses   │
        │ • Live Masterclasses  │                           │ • Live Batches Desk   │
        │ • 60-Day Timetable    │                           │ • Mains Copy Checking │
        │ • GST Tax Invoices    │                           │ • Doubt Opinion Desk  │
        │ • Doubt Desk          │                           │ • Promo Engine        │
        │ • Hardware ID Guard   │                           │ • System Diagnostics  │
        └───────────────────────┘                           └───────────────────────┘
```

---

## 🌟 Core Functional Capabilities

### 1. 📖 Curated Editorial & Master Series Showcase
* **ICAI Syllabus Alignment**: Comprehensive chapter-wise coverage including Companies Act 2013 (Sections 1 to 148), General Clauses Act 1897, Interpretation of Statutes, and Foreign Exchange Management Act (FEMA 1999).
* **Interactive Sample Reader**: Modal document viewer featuring dynamic canvas security watermarking and Section-by-Section Bare Act annotations.
* **National Hall of Fame**: Real-time all-India leaderboard showcasing rankers based on mock test precision, speed, and statutory accuracy.
* **5-Pillar ICAI Evaluator**: Comparative answer evaluation framework demonstrating keyword precision, statutory citations, and examiner rubrics.

### 2. 🎓 Student Executive Portal (`/student`)
Built on a distraction-free, low-fatigue matte design system (Deep Navy, Slate Gray, Royal Blue, and Emerald Green):
1. **Academic Overview**: Real-time study streak monitor, curriculum completion velocity, and national percentile standing.
2. **Knowledge Vault**: DRM-protected digital codices, downloadable summary notes, and physical book parcel live logistics tracking.
3. **Examination & Quiz Engine**: Timed ICAI test drills featuring standardized positive/negative marking rules (+2 / -0.5), question palette navigation, and instant Bare Act rationales.
4. **All-India Leaderboard**: Comparative benchmarking by accuracy percentage, raw score, and test duration.
5. **Curriculum Navigator**: Section-wise mastery tracking across Corporate Law and Other Laws.
6. **Live Masterclasses**: Interactive lecture terminal simulator with schedule planner and archived classroom library.
7. **Study Timetable**: 60-day structured ICAI exam roadmap with daily checklist verification.
8. **Orders & Billing**: GST-compliant tax invoices with verifiable digital receipts.
9. **Academic Doubt Clearance**: Statutory query submission desk with formal opinions issued by the Academic Board.
10. **Device Security Monitor**: Single-device hardware ID (HWID) active binding verification.

### 3. 🛡️ Institutional Admin Management Console (`/admin`)
An enterprise control center with unified layout architecture:
1. **Command Dashboard**: Live operational metrics, order dispatch queues, active academic doubts, and recent quiz attempt logs.
2. **Assessment Builder**: Complete CRUD quiz engine enabling question authoring (Options A–D, statutory citation, rationales), weight configuration, and real-time audit logging.
3. **Logistics & Order Fulfillment**: Automated order tracking workflow with AWB tracking integration and printable Delhivery/BlueDart shipping waybills.
4. **Candidate & HWID Registry**: Searchable student directory with one-click hardware DRM unbinding and device reset authorization.
5. **Course & Publication Catalog**: Dynamic inventory management for textbooks, question banks, and video lecture modules.
6. **Academic Batches**: Cohort scheduling and live lecture streaming link distribution.
7. **Descriptive Answer Evaluation Desk**: ICAI 100-mark rubric evaluation workspace for student test copies.
8. **Doubt Adjudication Desk**: Query review queue for publishing statutory legal opinions.
9. **Promotions & Concessions**: Enterprise promo code generator with usage caps and expiry parameters.
10. **System Health & Logs**: Database integrity audits, DRM token validation logs, and system snapshot monitoring.

---

## 🔒 Security & Intellectual Property Protection

* **Hardware DRM Token Binding**: Each student account is cryptographically bound to a single verified machine hardware ID (HWID) to prevent unauthorized distribution of proprietary course material.
* **Dynamic Canvas Watermarking**: High-resolution digital PDF assets and sample chapters are rendered with dynamic candidate identity watermarks during active sessions.
* **GST & Regulatory Compliance**: Commercial transactions generate standard-compliant tax invoices with unique institutional identification.
* **Matte Contrast Interface**: Thoughtfully engineered dark/matte user interfaces to minimize ocular fatigue during extended legal research and study sessions.

---

## 🚀 Quick Start & Operations Runbook

### Prerequisites
* Node.js `>= 20.x` (Tested and certified on Node.js 24)
* MongoDB connection string (or local fallback)

### Environment Configuration
Copy `.env.example` to `.env` in the root and fill in required secrets:
```bash
cp .env.example .env
```

### Essential NPM Scripts
| Command | Action |
|---|---|
| `npm run dev` | Launch both Next.js frontend and Express backend concurrently |
| `npm run check` | Execute full verification: TypeScript compilation + 24 Automated Node.js Tests |
| `npm run test` | Run backend automated regression test suite (`node --test`) |
| `npm run typecheck` | Run strict TypeScript compiler verification without emitting files |
| `npm run db:backup` | Execute zero-downtime database snapshot with SHA-256 integrity check |
| `npm run db:restore:test` | Test restoration of all 16 collections in isolated sandbox |
| `npm run loadtest` | Run high-concurrency 5,000-request benchmark (3,700+ req/sec certified) |

For comprehensive deployment instructions, API endpoints, and user/admin walkthroughs, refer to **[PROJECT_REVIEW_AND_GUIDE.md](PROJECT_REVIEW_AND_GUIDE.md)**.

---

## ⚖️ Confidentiality & Legal Notice

> [!IMPORTANT]
> **CONFIDENTIAL & PROPRIETARY PROPERTY**  
> All intellectual property, pedagogical structures, mock test frameworks, software source code, digital book codices, and UI design assets are the exclusive proprietary property of **The Law Kaksha**. Unauthorized copying, distribution, decompilation, or reverse engineering is strictly prohibited under applicable intellectual property laws.

---

<div align="center">
  <sub>© The Law Kaksha. All Rights Reserved. Institutional Legal Education Platform.</sub>
</div>
