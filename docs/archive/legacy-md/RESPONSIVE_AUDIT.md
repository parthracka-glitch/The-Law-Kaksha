# RESPONSIVE AUDIT — The Law Kaksha

## Stack Detected
- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, `@theme inline`)
- **UI:** Custom components + shadcn/ui, lucide-react icons
- **Fonts:** DM Sans (sans), Playfair Display (serif)
- **CSS Approach:** Utility-first Tailwind, custom CSS classes in `globals.css`

## Breakpoint Strategy (Mobile-First)
| Token    | Min-Width | Target Devices                    |
|----------|-----------|-----------------------------------|
| base     | 0px       | All mobile phones (320px+)        |
| `sm`     | 480px     | Standard phones                   |
| `md`     | 640px     | Large phones / small tablets      |
| `lg`     | 768px     | iPad portrait                     |
| `xl`     | 1024px    | iPad landscape / small laptops    |
| `2xl`    | 1280px    | Standard desktops                 |

---

## ROUTES / PAGES

| Item | Issues on Mobile | Status |
|------|-----------------|--------|
| **`/` (Home)** | No viewport meta, hero heading oversized at 320px, book image overflow, pricing cards stack issues, bookshelf spines untappable | Done |
| **`/about`** | Card padding too wide, heading oversized | Done |
| **`/contact`** | 2-col form grid doesn't stack below 480px, dropdown clips | Done |
| **`/courses`** | Course cards side-by-side too early, filter tabs not scrollable | Done |
| **`/product/[id]`** | 2-col layout cramped, CTA stacking | Done |
| **`/cart`** | Item cards cramped, quantity controls small | Done |
| **`/checkout`** | Multi-step form, payment options, summary panel | Done |
| **`/login`** | Form inputs not 48px, demo cards cramped | Done |
| **`/register`** | Form inputs not 48px, course selector | Done |
| **`/reviews`** | Review cards grid, star ratings | Done |
| **`/student`** | Dashboard sidebar, chapter cards, very dense | Done |
| **`/admin`** | Sidebar nav, data tables, modals — most complex | Done |

## SHARED COMPONENTS

| Item | Issues on Mobile | Status |
|------|-----------------|--------|
| **Navbar** | Touch targets 36px, dropdown clips | Done |
| **Footer** | Grid stacking, policy link spacing | Done |
| **CartDrawer** | Needs full-screen mobile, items cramped | Done |
| **HeroSection** | Image overflow, heading size, CTA gap | Done |
| **ExamCountdownsAndQOTD** | Timer digits large, MCQ cramped | Done |
| **SmartChoicePricing** | Cards stack spacing, tab sizes | Done |
| **PublicLeaderboardSection** | Table needs card view | Done |
| **DigitalBookshelf** | Spines 28px untappable, scroll hint | Done |
| **FaqSection** | Touch targets ok, text small | Done |
| **Testimonials** | Marquee, card widths | Done |

## MODALS

| Item | Issues on Mobile | Status |
|------|-----------------|--------|
| **EnhancedSampleChapterModal** | Full-screen needed, close reachability | Done |
| **SecurePdfReaderModal** | Viewport sizing, zoom controls | Done |
| **MasterclassVideoModal** | Video aspect ratio | Done |
| **MainsEvaluationDeskModal** | Form fields, bottom sheet | Done |
| **StreakCalendarModal** | Calendar cells small | Done |
| **StudentProfileModal** | Profile form | Done |
| **StudentOnboardingModal** | Multi-step wizard | Done |
| **QuizTakingModal** | Timer, options, full-screen | Done |
| **LegalClinicChatModal** | Chat bubbles, input area | Done |
| **CertificateGeneratorModal** | Certificate preview | Done |
| **Footer Policy Modals** | Close button small | Done |

## FOUNDATION

| Issue | Status |
|-------|--------|
| Missing viewport-fit=cover | Done |
| No fluid type/spacing | Done |
| Body font >=16px not guaranteed | Done |
| No safe-area-inset | Done |
| No prefers-reduced-motion | Done |
| Touch targets < 44px | Done |
| No overflow-wrap for long text | Done |
| Hover-only interactions | Done |
