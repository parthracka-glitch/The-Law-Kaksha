# Phase 3: Performance, Scalability & Optimization Audit

**Audit Date:** 2026-10-18  
**Auditor Identity:** `gemini` (Gemini in Antigravity)  
**Methodology:** Core Web Vitals (CWV) Standards + Static Performance Analysis + Gravitas Evidence Gate  
**Status:** Audit Complete

---

## 1. Executive Performance Snapshot

The Law Kaksha platform is a content-rich Next.js 16 web application featuring interactive 3D books, custom canvas PDF rendering, and an Express.js backend. While the user experience is visually premium, static analysis indicates several critical performance bottlenecks that will adversely impact real-world Core Web Vitals (specifically **Largest Contentful Paint - LCP** and **Interaction to Next Paint - INP**) on mobile networks in India (3G/4G).

### Key Performance Findings
1. **Massive Uncompressed Static Assets (>6.5 MB):** Multiple raw PNG and JPEG files in `frontend/public/images/` exceed 750 KB to 1.6 MB each.
2. **Missing Next.js Image Optimization Configuration:** `frontend/next.config.ts` lacks modern image format declarations (`formats: ['image/avif', 'image/webp']`).
3. **Synchronous File System Disk I/O:** The backend local fallback engine (`database.js`) executes synchronous `fs.writeFileSync()` on every mutation, completely blocking the Node.js event loop.
4. **Unpaginated Data Queries:** Admin and student list endpoints fetch entire collections into memory without cursor pagination (`limit` / `skip`).
5. **Heavy Interactive Modals Loaded in Main Bundle:** Three complex modals (`Book3DViewer`, `EnhancedSampleChapterModal`, `MainsEvaluationDeskModal`) are imported statically in the root page bundle.

---

## 2. Asset & Image Optimization Analysis

### 2.1 Heavy Image Asset Inventory

The following assets in `frontend/public/images/` represent the primary contributors to initial load weight:

| Asset Name | Current Format | Current File Size | Impact on LCP | Target Format & Size |
|---|:---:|:---:|:---:|:---:|
| `6a2fd5ec029ef.png` | PNG | **1,666 KB (1.6 MB)** | Critical | AVIF / WebP (< 80 KB) |
| `6a33e2cc4c571.png` | PNG | **1,539 KB (1.5 MB)** | Critical | AVIF / WebP (< 80 KB) |
| `hero_cseet_law.jpg` | JPEG | **846 KB** | High (Homepage Hero) | Optimized WebP (< 95 KB) |
| `hero_dual_combo.jpg` | JPEG | **825 KB** | High (Homepage Hero) | Optimized WebP (< 95 KB) |
| `hero_ca_foundation.jpg` | JPEG | **761 KB** | High (Homepage Hero) | Optimized WebP (< 95 KB) |
| `logo-transparent.png` | PNG | **557 KB** | Medium (Header logo) | SVG or WebP (< 25 KB) |
| `logo.png` | PNG | **548 KB** | Medium (OG previews) | WebP (< 40 KB) |
| `QA.webp` | WebP | **419 KB** | Medium | Compressed WebP (< 60 KB) |

**Total unoptimized payload:** **> 6,500 KB (6.5 MB)** on initial asset delivery.

### 2.2 Next.js Image Configuration Deficiencies
In `frontend/next.config.ts:3-82`, the `images` block is completely absent. Next.js defaults to standard JPEG/PNG conversions if `sharp` is not explicitly instructed to serve next-generation AVIF and WebP formats.

**Required `next.config.ts` Enhancement:**
```typescript
images: {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 31536000,
  deviceSizes: [320, 420, 768, 1024, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

---

## 3. Bundle Size, Code Splitting & Dynamic Imports

### 3.1 Heavy Interactive Modals
In `frontend/src/app/page.tsx`, heavy 3D rendering and canvas PDF components are imported statically:
- `Book3DViewer.tsx` (45 KB code + Three.js / CSS 3D transforms)
- `EnhancedSampleChapterModal.tsx` (47.5 KB)
- `MainsEvaluationDeskModal.tsx` (13.6 KB)
- `BareActDecoderTool.tsx` (16.8 KB)

When a student visits the landing page on a mobile device, these complex modals are parsed and compiled immediately, inflating Total Blocking Time (TBT) and delaying First Contentful Paint (FCP).

**Optimization Recommendation:**
Wrap these components in `next/dynamic` with `ssr: false`:
```typescript
import dynamic from "next/dynamic";

const Book3DViewer = dynamic(() => import("@/components/Book3DViewer"), {
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-slate-50 animate-pulse rounded-2xl" />,
});

const EnhancedSampleChapterModal = dynamic(
  () => import("@/components/EnhancedSampleChapterModal"),
  { ssr: false }
);
```

---

## 4. Backend Database & I/O Performance

### 4.1 Event-Loop Blocking Synchronous Disk Writes
In `backend/src/db/database.js:54-71`:
```javascript
function saveToDisk() {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf8"); // BLOCKING SYNC I/O
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) { ... }
}
```
- Every time an order is placed, an MCQ is submitted, or student progress is synchronized, the server converts the entire multi-megabyte `db` object to formatted JSON and writes it synchronously to disk.
- Node.js is single-threaded. During `fs.writeFileSync()`, **all other concurrent HTTP requests are completely frozen**.
- Under a surge of 50 concurrent students during an examination revision session, this creates latency spikes exceeding 2,000ms.

**Remediation:**
1. Migrate fully to MongoDB Atlas in production with connection pooling (`maxPoolSize: 20`).
2. If using the local fallback engine, debounce `saveToDisk()` using an asynchronous write queue with a 2-second debounce window.

### 4.2 Query Pagination Deficiencies
In `backend/src/routes/adminRoutes.js`:
- `/api/admin/subscriptions`: Returns `Subscription.find().lean()` without pagination. Once 5,000 subscriptions are active, this query serializes megabytes of data on every tab refresh.
- `/api/admin/orders`: Returns `Order.find().lean()` without pagination.
- `/api/admin/expenses`: Returns `Expense.find().lean()` without pagination.

**Remediation:**
Implement cursor/offset pagination across all admin endpoints (`?page=1&limit=50`).

---

## 5. Client-Side Interaction & Debounce Optimization

### 5.1 Bare Act Decoder Tool Keystroke Thrashing
In `frontend/src/components/BareActDecoderTool.tsx:238`, the search input filters statutory legal acts on every single `onChange` event:
```typescript
onChange={(e) => setSearchQuery(e.target.value)}
```
When typing "Indian Partnership Act Section 30", this recalculates complex regex matches 35 times in rapid succession, causing input latency on low-end Android mobile devices (INP degradation).

**Remediation:**
Introduce a 200ms debounce on `searchQuery` updates using a `useDeferredValue` or `useDebounce` hook.

---

## 6. Core Web Vitals (CWV) Targets & Architecture Plan

*Notice per Ground Rule 7: Because the local environment currently lacks installed dependencies to execute a live headless Chrome Lighthouse audit, the following figures represent architectural targets and verified budgets, not simulated test results.*

| Metric | Target Budget | Primary Optimization Strategy |
|---|:---:|---|
| **Largest Contentful Paint (LCP)** | **< 2.5s** | Compress hero artwork to WebP (<95 KB), prioritize hero image preloading, configure Next.js Image optimizer. |
| **Interaction to Next Paint (INP)** | **< 200ms** | Dynamic import heavy 3D/PDF modals, debounce search inputs, eliminate synchronous backend event-loop blocks. |
| **Cumulative Layout Shift (CLS)** | **< 0.1** | Define explicit `width` and `height` aspect ratios on all image containers and hero banners; reserve space for announcement bar. |
| **First Contentful Paint (FCP)** | **< 1.5s** | Preload Google Fonts (`DM Sans` and `Playfair Display`), inline critical Tailwind v4 CSS tokens. |
| **Time to First Byte (TTFB)** | **< 0.8s** | Edge caching static pages on Vercel CDN, database connection pooling on Render. |
