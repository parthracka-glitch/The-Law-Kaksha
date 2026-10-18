# Dead Code, Duplicates & Clutter Log

> **Purpose:** Classification, inventory, and disposition log of dead code, duplicate assets, and unused components.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Lead Auditor  

---

## 1. Classification Framework

Candidates are classified according to the Master Prompt guidelines:
- **Tier A (Safe to remove):** Zero references anywhere across code, tests, config, or docs. Not dynamically reachable. Removed in dedicated commit.
- **Tier B (Probably unused / Staged feature):** No static call-sites in current routes, but contains valid product IP or roadmap features. Flagged for review; not destructively deleted.
- **Tier C (Unclear / Needs owner input):** Ambiguous domain artifacts.

---

## 2. Inventory & Actions

| Candidate Item | Type | Tier | Evidence | Action Taken |
|---|---|:---:|---|---|
| `extracted_basic_plan.txt` | Scratch file | **Tier A** | Text dump of `The Law Kaksha_Basic Plan.docx`. Zero code references. | **Deleted** via `git rm` |
| `extracted_new_doc.txt` | Scratch file | **Tier A** | Text dump of `New Microsoft Word Document.docx`. Zero code references. | **Deleted** via `git rm` |
| `md/` (historical docs) | Directory | **Tier B** | 33 legacy documentation files from prior iterations superseded by official `docs/` hierarchy. | **Flagged / Preserved** as historical record |
| `ReviewerFeatures.tsx` | React Component | **Tier B** | High-value marketing component outlining 6 study pillars (Bare Act Synopsis, ABC Analysis, 1.5-Day LDR). Zero import sites. | **Retained** for future feature integration |
| `BareActDecoderTool.tsx` | React Component | **Tier B** | Interactive bare act dissection tool. Fully implemented with search & breakdown logic. | **Retained** for Study Tools module |
| `EducatorLectures.tsx` | React Component | **Tier B** | Video lecture grid and educator profile component. | **Retained** for Lectures tab |
| `CommunityBanner.tsx` | React Component | **Tier B** | WhatsApp / Telegram community invite banner. | **Retained** for Student Community page |
| `MainsEvaluationDeskModal.tsx` | React Component | **Tier B** | Student answer sheet upload & evaluation desk modal. | **Retained** for Test Series evaluation |
| `MasterclassVideoModal.tsx` | React Component | **Tier B** | Video modal player with playback controls. | **Retained** for Lecture playback |
| `PublicLeaderboardSection.tsx` | React Component | **Tier B** | Gamified XP leaderboard display component. | **Retained** for Leaderboard page |
| `New Microsoft Word Document.docx` | Binary Document | **Tier C** | Reference document provided by project owner. | **Preserved** (Untouched) |
| `The Law Kaksha_Basic Plan.docx` | Binary Document | **Tier C** | Core business specification provided by project owner. | **Preserved** (Untouched) |

---

## 3. Duplicate Logic Analysis

- **Catalog Pricing Dictionary:** Consolidated canonical prices into `CANONICAL_CATALOG_PRICES` within `backend/src/routes/orderRoutes.js`.
- **Database Access Pattern:** Uniform access pattern established through `Database.table(tableName)` local adapter and direct Mongoose model queries when MongoDB Atlas is connected.
