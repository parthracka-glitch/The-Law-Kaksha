# Frontend Component Inventory & Conventions

**Purpose:** Comprehensive inventory of UI components, styling conventions, prop patterns, and reusability standards.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Component Hierarchy & Organization

All presentation and interaction components reside under `frontend/src/components/`:

- **Design System Conventions:**
  - Component names use `PascalCase` (e.g. `Navbar.tsx`, `HeroSection.tsx`).
  - Style combinations utilize `clsx` and `tailwind-merge` via `cn()` helper [Verified: `frontend/src/lib/utils.ts`].
  - Icons sourced exclusively from `lucide-react` [Verified: `frontend/package.json:18`].

---

## 2. Component Directory

| Component | Props Interface | Primary Responsibility |
|---|---|---|
| `Navbar.tsx` | None (reads auth context) | Sticky navigation, brand anchor, login/enroll triggers. |
| `Footer.tsx` | None | Legal disclaimers, contact details, copyright notices. |
| `HeroSection.tsx` | None | Headline, value proposition, enrollment CTA buttons. |
| `SyllabusSection.tsx` | None (reads site-data) | Accordion topic list for 6 statutory acts with marks weighting. |
| `Section16ComparisonBlock.tsx` | None | Interactive answer comparison block showcasing Caveat Emptor model answer. |
| `FeaturesSection.tsx` | None | Visual feature cards: 3D Codices, DRM Session Lock, Exam Answer Blueprints. |
| `EnrollModal.tsx` | `isOpen: boolean, onClose: () => void` | Plan selection modal and Razorpay checkout trigger. |
| `AuthModal.tsx` | `isOpen: boolean, onClose: () => void` | Tabbed login and registration modal with Google SSO. |
| `DeviceResetModal.tsx` | `isOpen: boolean, onClose: () => void` | Confirmation modal for device unbinding upon 409 Conflict. |
