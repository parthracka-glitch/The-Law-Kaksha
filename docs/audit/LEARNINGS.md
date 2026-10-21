# Learnings & Working Commands

- `npm test --prefix backend`: Runs 93 backend tests via `tests/runner.js` against ephemeral server on port 50347+.
- `npm run typecheck --prefix frontend`: Strict TypeScript typechecking for Next.js App Router frontend.
- `npm run lint --prefix frontend`: ESLint 9 for frontend.
- `npm run build:frontend`: Next.js production build (`next build`).
- In `backend/src/routes/authRoutes.js`, new users were historically initialized with `enrolled_books: [course]` and `drm_access: true`, which acted as an unintended paywall bypass.
- In `frontend/src/app/reader/ReaderClient.tsx`, `drm_access: true` added `"all-access"` which unlocked every PDF.
- Continuous scroll in PDF.js can be efficiently implemented with an `IntersectionObserver` observing placeholder page divs and rendering page canvases only when within view distance (virtual windowing), avoiding OOM crashes.
