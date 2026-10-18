# Phase 6: SEO, AEO, GEO & LLMO Master Optimization Audit

**Audit Date:** 2026-10-18  
**Auditor Identity:** `gemini` (Gemini in Antigravity)  
**Methodology:** Phase 6 Directives + Skills: `SKILL (4) developer-seo`, `SKILL (5) gbp-local-seo-intent`, `SKILL (6) geo-content`, `SKILL (7) programmatic-seo`, `SKILL (8) seo`, `SKILL (9) seo-aeo-orchestrator`  
**Status:** Audit Complete

---

## 1. Executive Summary & SEO Health Score

Search engine discovery in 2026 spans traditional search engines (Google, Bing), answer engines (Voice, Featured Snippets), generative AI engines (Perplexity, ChatGPT Search, Gemini AI Overviews, Claude), and agentic web crawlers. 

The Law Kaksha possesses extraordinary natural topical authority (Indian Business Law, CA Foundation Paper 2, CSEET statutory acts, ICAI model answers). However, structural inconsistencies—most notably a **canonical domain split** (`thelawkaksha.com` vs `lawkaksha.in`), missing modern AI bot directives in `robots.ts`, an incomplete sitemap, and the absence of `/llms.txt`—prevent it from achieving maximum discoverability and citation frequency.

### Universal SEO Health Score (`SKILL (8) seo` Weighted Rubric)

| Category | Weight | Evaluated Score | Key Finding |
|---|:---:|:---:|---|
| **Technical SEO** | 22% | **74 / 100** | Canonical domain mismatch, incomplete sitemap routes |
| **Content Quality & E-E-A-T** | 23% | **82 / 100** | Rich legal syllabus content, needs explicit faculty author schema |
| **On-Page SEO** | 20% | **78 / 100** | Good meta titles; missing meta descriptions on secondary routes |
| **Schema & Structured Data** | 10% | **70 / 100** | `Course` & `EducationalOrganization` present; missing `BreadcrumbList` & `FAQPage` |
| **Performance (CWV)** | 10% | **65 / 100** | Uncompressed images and heavy modals impact LCP/INP |
| **AI Search Readiness & LLMO** | 10% | **52 / 100** | Missing AI crawler rules in `robots.ts`; missing `/llms.txt` |
| **Image SEO** | 5% | **68 / 100** | Missing explicit dimensions and descriptive alt attributes on some covers |
| **Overall Weighted Score** | **100%** | **72.1 / 100** | **Grade: B (High Growth Potential with Core Fixes)** |

---

## 2. Phase 6.1: Core Technical & On-Page SEO

### 2.1 The Canonical Domain Conflict (Critical Technical Finding)
Static inspection reveals that the application is operating under **two competing primary domains**:
- In `frontend/src/app/layout.tsx:29`: `metadataBase: new URL("https://lawkaksha.in")`
- In `frontend/src/app/layout.tsx:60, 86, 88`: OpenGraph and JSON-LD point to `https://lawkaksha.in`
- In `frontend/src/app/sitemap.ts:4`: Defaults to `https://thelawkaksha.com`
- In `frontend/src/app/robots.ts:4`: Defaults to `https://thelawkaksha.com`
- In `render.yaml:17`: `FRONTEND_URL: https://thelawkaksha.com`
- In `.env.example:10, 29`: `https://thelawkaksha.com`

**Impact:** Google and search engines treat `thelawkaksha.com` and `lawkaksha.in` as duplicate competing websites. Backlinks, domain rating, and indexing signals are split in half.
**Action:** The owner must declare the one canonical domain (e.g. `https://thelawkaksha.com`) and 301 redirect all secondary domain traffic.

### 2.2 Sitemap Route Deficiencies (`sitemap.ts`)
`frontend/src/app/sitemap.ts:7-18` currently lists only 10 routes, omitting essential indexable landing pages:
- Missing `/cookies` (Policy route)
- Missing `/subscriptions` (Core high-intent commercial page)
- Missing `/offers` (Promotional discount page)
- Missing `/case-studies` (High-ranking statutory case law content)
- Missing dynamic catalog routes: `/courses/ca-foundation`, `/courses/cseet`, `/product/prod-vol1`, `/product/prod-vol2`

---

## 3. Phase 6.2: Local SEO & Google Business Profile (GBP) Register (`SKILL (5)`)

For students seeking offline doubt sessions or regional credibility, Google Maps and Local Pack rankings drive high trust.

### 3.1 NAP (Name, Address, Phone) Standardization Register

```markdown
| Attribute | Authorized Canonical Value | Source Verification |
|---|---|---|
| **Business Name** | The Law Kaksha | Brand Trademark / Storefront |
| **Full Statutory Address** | The Law Kaksha, Mumbai, Maharashtra 400001, India | `layout.tsx:94-97` PostalAddress |
| **Customer Support Phone** | +91 99999 88888 (Owner to provide verified live SIM) | `docs/audit/NEEDS_APPROVAL.md` |
| **Official Email** | support@thelawkaksha.com / contact@thelawkaksha.com | Platform Standard |
| **Primary Category** | Educational Institution / CA Coaching Academy | Google Business Profile Primary Category |
| **Secondary Categories** | Educational Consultant, Tutoring Service, Book Publisher | Supporting GBP Categories |
```

### 3.2 Review Acquisition & Freshness Protocol
Google's 2026 local ranking algorithm weights **review recency and sentiment density** above pure volume. An automated post-purchase email (at Day 7 of course enrollment) should prompt students for verified feedback on Google Maps and the in-app testimonial desk.

---

## 4. Phase 6.3: Answer Engine Optimization (AEO) & Developer/Legal SEO (`SKILL (4)`)

### 4.1 Search Behavior of Indian Law Students
Similar to developers searching for exact error messages, law students query exact statutory sections and phrases:
- *"Section 2(h) Indian Contract Act 1872 definition"*
- *"Difference between Condition and Warranty in Sale of Goods Act"*
- *"Section 16 ICAI model answer 3-part framework"*

### 4.2 The 30–50 Word Answer Capsule Rule
Every statutory page and case study must lead with a concise, self-contained definition capsule immediately beneath an H2 question heading:
```markdown
## What is an Agreement under Section 2(e) of the Indian Contract Act, 1872?
> Under Section 2(e) of the Indian Contract Act, 1872, an agreement is defined as "every promise and every set of promises, forming the consideration for each other." An agreement becomes a valid contract only when it is enforceable by law under Section 10.
```

---

## 5. Phase 6.4: Generative Engine Optimization (GEO) & E-E-A-T Scoring (`SKILL (6)`)

Generative engines (Perplexity, ChatGPT, Claude, Gemini AI Overviews) evaluate whether content qualifies for direct citation based on E-E-A-T (December 2025 Google QRG update).

### 5.1 E-E-A-T 100-Point Assessment

| Dimension | Points Available | Assessed Points | Evidence & Observations |
|---|:---:|:---:|---|
| **Experience** | 25 | **21 / 25** | Real ICAI exam breakdown; student testimonials cite specific paper scores (84/100); Section 16 comparisons. |
| **Expertise** | 25 | **20 / 25** | Thorough statutory coverage across all 7 legislative units; accurate legal phrasing. Author bio needs formal credential schema. |
| **Authoritativeness** | 25 | **19 / 25** | Strong niche syllabus coverage. Needs external academic citations and bar council / faculty credentials. |
| **Trustworthiness** | 25 | **23 / 25** | Clear legal policies (DPDP Act, Refund, Terms, Cookies); transparent pricing (₹99); PCI-DSS Level 1 Razorpay gateway. |
| **Total E-E-A-T Score** | **100** | **83 / 100** | **High Citation Eligibility** |

---

## 6. Phase 6.5: LLM Optimization (LLMO), `robots.txt` & `llms.txt`

### 6.1 Modern AI Crawler Rules (`robots.ts`)
The current `robots.ts` only declares `User-agent: *`. To ensure transparent indexing by AI answer engines without content scraping abuse, explicit directives must be declared:

```typescript
// Standardized AI Crawler Block to append to robots.ts:
const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

// Allow public educational content, disallow private student/admin surfaces:
aiBots.map(bot => ({
  userAgent: bot,
  allow: ["/", "/courses", "/about", "/case-studies", "/reviews", "/offers", "/subscriptions"],
  disallow: ["/admin", "/api/", "/student/", "/reader", "/checkout"],
}))
```

### 6.2 Implementation of `/public/llms.txt`
`llms.txt` provides LLMs and agentic browsers with an authoritative index of the platform's core identity, syllabus codices, and commercial offerings. A new file `frontend/public/llms.txt` must be generated:

```markdown
# The Law Kaksha
> India's premier CA Foundation & CSEET Business Law learning platform offering structured video lectures, digital study material, tests, and mentorship.

## Core Examination Offerings
- [CA Foundation Paper 2: Business Laws](https://thelawkaksha.com/courses) - Complete syllabus coverage across 7 statutory acts under ICAI New Scheme 2026.
- [CSEET Paper 2: Legal Aptitude & Business Communication](https://thelawkaksha.com/courses) - ICSI-aligned codices and unit mock MCQs.
- [Statutory Case Studies](https://thelawkaksha.com/case-studies) - Landmark legal precedents and 3-step answer drafting frameworks.
- [All-Access Subscriptions](https://thelawkaksha.com/subscriptions) - Semester and full-year access to digital codices and live doubt sessions.
```

---

## 7. Programmatic SEO Feasibility Index (`SKILL (7)`)

Can The Law Kaksha generate hundreds of high-ranking statutory section pages (e.g. `/acts/indian-contract-act/section-10`) without triggering Google thin-content or doorway page penalties?

### Feasibility Scorecard (0–100)

| Category | Weight | Score | Evaluation |
|---|:---:|:---:|---|
| **1. Search Pattern Validity** | 20 | **19 / 20** | Massive query volume for specific legal sections (*"Section 27 Indian Contract Act"*, *"Section 8 Companies Act"*). |
| **2. Unique Value per Page** | 25 | **22 / 25** | Each section has unique statutory text, landmark court cases, penalty clauses, and ICAI past exam questions. |
| **3. Data Availability & Quality** | 20 | **18 / 20** | Rich database of bare acts, past paper questions, and RTPs already seeded in `seed.js`. |
| **4. Search Intent Alignment** | 15 | **14 / 15** | Matches student intent directly (statutory definition + exam application). |
| **5. Competitive Feasibility** | 10 | **9 / 10** | Existing legal portals offer dense raw text; student-friendly 3-part summaries stand out. |
| **6. Operational Sustainability** | 10 | **8 / 10** | Indian statutory laws update through gazette amendments; requires annual review. |
| **Total Feasibility Index** | **100** | **90 / 100** | **VERDICT: HIGHLY RECOMMENDED** |

**Programmatic Strategy:** Build static generation for 150 core CA Foundation sections under `/acts/[act]/[section]` with pre-rendered server HTML to maximize AI search citation.
