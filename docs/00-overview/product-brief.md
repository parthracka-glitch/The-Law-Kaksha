# Product Brief: The Law Kaksha

**Purpose:** Comprehensive overview of product identity, mission, target audience, and core value proposition.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Product Summary & Mission
**The Law Kaksha** is a premier digital learning academy built specifically for Indian chartered accountancy and company secretary aspirants targeting **CA Foundation (Paper 2: Business Laws)** and **CSEET (Legal Aptitude & Business Communication)** [Verified: `frontend/src/app/page.tsx:15`, `frontend/src/components/HeroSection.tsx:24`].

Traditional legal pedagogy in India has suffered from dense statutory textbooks, rote memorization, and low exam retention. The Law Kaksha solves this by transforming statutory law into high-retention visual learning frameworks: interactive 3D digital codices (flipbooks), memory anchors, structured case-law breakdowns, and targeted revision question banks [Verified: `frontend/src/components/SyllabusSection.tsx:40`, `frontend/src/components/FeaturesSection.tsx:18`].

## 2. Target Users & Problem Solved
- **Primary Audience:** CA Foundation students preparing for ICAI examinations and CSEET students preparing for ICSI exams across India [Verified: `frontend/src/components/CurriculumSection.tsx:12`].
- **Problem Statement:** Students struggle with:
  1. Remembering complex legal sections, provisos, and exceptions (e.g., Section 16 of The Sale of Goods Act, 1930 — *Caveat Emptor*).
  2. Structuring professional law answers according to ICAI marking schemes (Facts, Provisions, Analysis, Conclusion).
  3. Organizing revision materials across disparate PDFs and physical notes.
- **Solution:** An all-in-one digital desk featuring structured syllabus progression, watermarked reader-protected study materials, instant digital fulfillment, and exam-grade model answers [Verified: `frontend/src/components/Section16ComparisonBlock.tsx:15`, `frontend/src/app/notes/page.tsx:28`].

## 3. Core Offerings & Value Deliverables
1. **The Smart Revision Question Bank:** Curated high-probability exam questions with structured answer frameworks and statutory citations (e.g., ₹199 promotional bundle) [Verified: `frontend/src/components/EnrollModal.tsx:45`].
2. **Interactive 3D Reader / Codices:** High-security digital study books with dynamic session watermarking (student name and roll ID) to deter unauthorized distribution [Verified: `frontend/src/app/reader/page.tsx:32`, `frontend/src/app/privacy/page.tsx:71`].
3. **Comprehensive Subject Modules:**
   - Indian Regulatory Framework
   - The Indian Contract Act, 1872
   - The Sale of Goods Act, 1930
   - The Indian Partnership Act, 1932
   - The Limited Liability Partnership Act, 2008
   - The Companies Act, 2013 [Verified: `frontend/src/components/SyllabusSection.tsx:55`]

## 4. Scope & Non-Goals
- **In Scope:** Digital learning delivery, online purchases via Razorpay, single-device DRM session security, test submissions, and faculty evaluation desks [Verified: `backend/src/server.js:32-38`].
- **Non-Goals:** Physical book printing and dispatch; offline classroom scheduling; non-commerce / non-law coaching.

## 5. Success Metrics
- **Zero Material Leakage:** Single-active-device session enforcement prevents shared account access [Verified: `backend/src/middleware/authMiddleware.js:35`].
- **High Retention & Conversion:** Smooth, low-friction checkout via Razorpay UPI and cards [Verified: `frontend/src/components/EnrollModal.tsx`].
- **Uptime & Accessibility:** Reliable, low-latency API responses even under free-tier deployment constraints.
