# The Law Kaksha — DESIGN.md

## 0. Source of truth
- The attached hero section is FINAL. Never redesign it. Extract its exact colors, fonts, spacing, radius, shadows and leaf motif and apply them to every screen. If this file and the hero disagree, the hero wins.
- Use the attached logo and elements as-is. Never redraw or restyle the logo.
- Attached reference images (books section, library, quiz, chat) guide layout only. Colors and type come from this file and the hero.

## 1. Brand & platforms
The Law Kaksha blends classical legal authority with a modern, high-clarity academic learning environment: airy white canvas, soft blue atmospheric washes, hairline borders, editorial serif headings, and a Devanagari calligraphic accent (in the logo only).
CA Law education platform (books, DRM PDFs, video lectures, mains test series) for CA Foundation, Inter and Final students in India. ONE design system for Web (desktop 1440, tablet 768) and Mobile App (390). Same components, colors, type and copy on both; only layout adapts.

## 2. Color tokens (one value per token)
- brand-royal #005A9C: logo blue. Primary buttons, active tabs, active radio, brand anchors. Hover #004F8A.
- brand-navy #0A192F: headings, logo type, high-contrast text.
- brand-sky #4A90E2: focus rings, active indicators, link hover.
- brand-softleaf #8ECAE6: progress bars, subtle background shapes.
- canvas #FFFFFF: cards, modals, main views.
- canvas-soft #F0F7FF: section washes, nav rails, hover states.
- pill-fill #EFF6FF: badges, inactive pills, selected option fill.
- border-subtle #DBEAFE: card borders, dividers.
- border-input #E2E8F0: inputs, option capsules.
- text-secondary #64748B: captions, metadata. Placeholder #94A3B8.
- success #10B981: verified tags, confirmations, correct answers, 100% progress.
- quiz-action #84CC16: quiz Next/Submit buttons ONLY (navy text).
- coral #EF4444: errors, incorrect answers, urgent exam countdown, quiz top progress line ONLY.
- Never use amber, gold, indigo, emerald or orange.

## 3. Typography
- Headings: Playfair Display (fallback Cormorant Garamond / Merriweather, serif). Hero titles, book names, section headings, quotes, score and ranker numbers. Classic, high-contrast, authoritative; select keywords in Royal Blue.
  - Display H1: 36-48px, 700, line-height 1.15
  - Section H2: 26-32px, 600, line-height 1.25
  - Card title H3: 18-22px, 600, line-height 1.3
  - Mobile: H1 30-34, H2 24-26
- UI/body: Inter (fallback Plus Jakarta Sans, system-ui). Nav, forms, tables, buttons, tags, body.
  - Body: 14-16px, 400, line-height 1.6
  - Labels: 13-14px, 500, line-height 1.4
  - Badges/microcopy: 11-12px, 600, tracking +0.04em

## 4. Leaf motif (5-petal, from the logo): controlled, subtle, low opacity
- Anatomy: 5 translucent organic petals radiating up and out, layered opacity: Royal #005A9C 100% > Sky #4A90E2 70% > Pale Azure #8ECAE6 50% > Soft Steel #B0C4DE 30%.
- ALLOWED ONLY: hero backdrop (5-10% opacity behind book covers); section dividers; empty and success states (line-art); Top ranker cards and Mastermind combo card (corner watermark); login/register backdrop; order-success beside the green check; footer near brand statement; error-page accent.
- NEVER: data tables, checkout inputs, PDF reader, video player, quiz modal, chat drawer, admin console. Decorative only; never obstructs text or inputs.

## 5. Shape, spacing & elevation
- Radius: badges/pills/tabs 9999px; buttons and inputs 8-10px; cards and panels 12-14px; modals and hero banners 16-20px.
- Shadows: sm 0 1px 3px rgba(10,25,47,0.04); card 0 4px 16px -2px rgba(10,25,47,0.06); modal 0 20px 40px -10px rgba(10,25,47,0.15).
- Spacing grid: 8px baseline (8, 16, 24, 32, 48, 64, 96). Sections alternate White / #F0F7FF with py-16 to py-24.
- Hairline 1px borders (#DBEAFE) for structure. Soft blurred blue gradient accents allowed in backdrops.

## 6. Buttons & controls
- Primary: fill #005A9C, white text, no border. Hover #004F8A + 2px lift.
- Secondary: white fill, 1.5px #005A9C border, #005A9C text. Hover fill #F0F7FF.
- Ghost: transparent, #64748B text. Hover navy.
- Quiz action: #84CC16 fill, navy text. Hover slight scale + shadow.
- Active tab pill: #005A9C fill, white text, full capsule.
- Inactive tab pill: #EFF6FF fill, 1px #DBEAFE border, #64748B text. Hover royal text.
- Book-card CTA: full pill, #EFF6FF fill, #005A9C text, preview/share icon.
- If the hero uses pill or square primary buttons, match the hero.
- Input: white, #E2E8F0 border, focus #4A90E2 ring (0 0 0 3px rgba(74,144,226,0.15)), navy text, labels on all fields.

## 7. Components
- Book & course card: white, 12px radius, 1px #DBEAFE border, card shadow. 3D-perspective cover with soft drop shadow. Serif title (18px, navy). Category/author subtitle 13px #64748B. Book-card CTA pill.
- Student vault: frosted top bar with tabs. "Continue Reading" banner card (active book, large 3D cover, progress, "👁 Continue Reading"). Library grid with percentage bars under each card: #005A9C in progress, #10B981 at 100%.
- Quiz modal: centered floating white card, 16px radius, blurred backdrop. Top segmented progress (coral line, "QUESTION 01 of 05"). Serif question 20-24px. Microcopy "SELECT ONLY ONE" (uppercase, tracked). Full-width rounded option capsules: default = white, #E2E8F0 border, #64748B text, circle radio; selected = #EFF6FF fill, #005A9C border, checkmark, bold navy text. Footer: ghost "Back" left, pill "Next"/"Submit" (quiz-action) right.
- Chat helpdesk drawer: right slide-over, white/light-grey. Header "Chat Helpdesk", sub "Privacy and Support • Get Immediate Help", close ✕. Student bubbles #005A9C with white text and bottom-right tail; faculty bubbles white with grey border, navy text, avatar. Book thumbnail attachments in stream. Pill input with 📎 attach and circular ➤ send.
- Tables (admin): compact rows, hairline separators, sticky header, inline editing, status pills.
- Include hover, focus, loading skeleton, empty, error and success states.

## 8. Density by area
Marketing = spacious editorial. Store = structured product grid, commercial. Checkout = minimal, distraction-free, logo + secure badge only. Student portal = functional, dense but clean. Admin = compact, systematic, no decoration. Legal = typography-first, single column, line-height 1.75, numbered clauses. Errors = minimal, centered, branded.

## 9. App (mobile) adaptation
- Fixed navbar becomes compact app bar (back, title, cart). Marketing nav becomes hamburger drawer.
- Cart drawer becomes bottom sheet. Modals and quiz become full-screen sheets. Chat drawer becomes full-screen chat.
- Student portal: bottom tab bar (Vault, Store, Doubts, Profile).
- Admin: bottom nav (Orders, Catalog, Subscriptions, Students, Grading); tables become stacked cards.
- Product detail: sticky bottom buy bar. Cart: sticky bottom total bar. Filters: horizontal scroll chips. Checkout: single-column stepper.
- Min touch target 44px, safe-area padding, thumb-reachable primary actions.

## 10. Accessibility
WCAG AA contrast, visible focus rings, never rely on color alone.
