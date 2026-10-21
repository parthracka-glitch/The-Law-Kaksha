# Architectural & Engineering Decisions

- [gemini 2026-10-21 src:user verified] Non-purchased students who log in get dashboard access showing Free Resources & sample codices by default, with 'Unlock Course' cards for CA Foundation & CSEET.
- [gemini 2026-10-21 src:user verified] Student who purchases a specific course only gets access to that course's materials. Purchasing a subsequent course stacks into their dashboard alongside previously owned courses.
- [gemini 2026-10-21 src:user verified] Secure PDF Reader must use continuous vertical document scrolling with lazy page rendering for fast loading and smooth navigation.
- [gemini 2026-10-21 src:user verified] DRM Watermarking: Every page canvas prominently displays the student's Roll Number / Student ID (e.g., LK-2026-STU...) across diagonal grid and borders.
- [gemini 2026-10-21 src:backend/src/routes/authRoutes.js verified] Registration must NOT grant default `drm_access: true` or default `enrolled_books: [course]`. Users start with `drm_access: false`, `enrolled_books: []`, and `unlockedItemIds: []`.
