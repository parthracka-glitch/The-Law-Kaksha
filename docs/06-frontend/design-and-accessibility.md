# Design Tokens & Accessibility Guidelines

**Purpose:** Comprehensive guide to design system tokens, typography scales, color palettes, and WCAG accessibility standards.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Design System Color Tokens

The visual design evokes an academic, classical legal sanctuary:

| Token Name | Hex Value | Usage Scope |
|---|---|---|
| **Parchment Background** | `#F7F7F5` | Body background, card insets, secondary button fills. |
| **Academic Ink (Text)** | `#221D1D` | Primary headlines, statutory titles, high-emphasis text. |
| **Muted Slate** | `#77716E` / `#4D433F` | Subtitles, descriptive paragraphs, secondary labels. |
| **Border Tone** | `#E7E4E7` | Card borders, table dividers, accordion rules. |
| **Legal Amber** | `#FEF3C7` / `#B45309` | Notice badges, compliance warnings, case-study highlights. |
| **Terracotta Accent** | `#F4C5C0` / `#991B1B` | Primary CTA pills, active highlights, launch discount badges. |

---

## 2. Typography Hierarchy

- **Statutory Headlines & Brand:** `font-serif` (Playfair Display / Merriweather family) for dignified academic presence.
- **Body & Interactive UI:** `font-sans` (Outfit / Inter family) for crisp legibility across mobile screens.

---

## 3. Web Accessibility (WCAG 2.1 AA) Standards

- **Contrast Ratios:** Primary text `#221D1D` on `#F7F7F5` yields a contrast ratio of >13:1, easily exceeding the WCAG AAA standard of 7:1.
- **Keyboard Navigation:** Modals trap focus; accordion buttons support Space and Enter toggling; interactive elements have visible `:focus-visible` outline rings.
- **Screen Reader Labels:** Form inputs feature explicit `<label>` tags or `aria-label` attributes; icons from `lucide-react` carry `aria-hidden="true"` when paired with descriptive text.
