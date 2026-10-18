# Repository Structure & Organization Map

> **Purpose:** Comprehensive directory structure audit, target architecture mapping, and organizational conventions for the monorepo.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Lead Architect  

---

## 1. Architectural Layout & Conventions

The Law Kaksha platform is structured as an enterprise Node.js monorepo with strict separation of frontend (Next.js 16 App Router) and backend (Express REST API with dual MongoDB Atlas / JSON Cache engine).

```
thelawkaksha/
├── .github/
│   └── workflows/
│       └── verify.yml               # CI automated verification protocol
├── backend/                         # Express API Server (Node.js)
│   ├── data/
│   │   └── lawkaksha_db.json        # Local fault-tolerant fallback data cache
│   ├── src/
│   │   ├── db/                      # Database adapters (mongo.js, database.js, seed.js)
│   │   ├── middleware/              # Auth & authorization (authMiddleware.js)
│   │   ├── models/                  # Mongoose domain models (User, Product, Order, etc.)
│   │   ├── routes/                  # Modular REST routers (auth, catalog, content, quiz, order, admin, student)
│   │   ├── scripts/                 # Operations & admin tools (create_admin, backup_restore, load_benchmark)
│   │   ├── utils/                   # Helpers (Cloudinary, DRM encryption, token helpers)
│   │   └── server.js                # Express entrypoint, security headers & rate limiters
│   └── tests/                       # Automated test suites & ephemeral test runner
├── frontend/                        # Next.js 16 App Router Web Application
│   ├── public/                      # Static assets, SVG icons, study notes PDFs, and sample chapters
│   │   ├── assets/
│   │   ├── notes/                   # Normalized kebab-case DRM PDF notes
│   │   └── samples/                 # Free preview chapters
│   ├── src/
│   │   ├── app/                     # Route handlers & pages (home, checkout, cart, student, admin, reader)
│   │   ├── components/              # Reusable React UI components (Hero, Navbar, Reader, Bookshelf, Modals)
│   │   ├── context/                 # Client React context providers (CartContext, AuthContext)
│   │   ├── lib/                     # API client utilities (api.ts)
│   │   ├── types/                   # TypeScript interfaces & domain declarations
│   │   └── utils/                   # Client helpers (deviceHelper.ts, formatters)
├── docs/                            # Standardized 12-section technical documentation suite
│   ├── 00-overview/
│   ├── 01-research/
│   ├── 02-product/
│   ├── 03-architecture/
│   ├── 04-data/
│   ├── 05-api/
│   ├── 06-frontend/
│   ├── 07-security/
│   ├── 08-operations/
│   ├── 10-legal/
│   ├── 11-launch/
│   ├── agent/
│   └── audit/                       # Shared agent memory, progress tracking & audit logs
└── scripts/
    └── verify.js                    # Universal cross-platform verification harness
```

---

## 2. Directory Mapping & Boundary Rules

| Directory | Role | Status | Change Policy |
|---|---|:---:|---|
| `backend/` | Microservice API | **Current & Canonical** | Keep all routes, models, and endpoints stable. |
| `frontend/` | Next.js Presentation | **Current & Canonical** | App Router structure preserves all existing public URLs. |
| `frontend/public/notes/` | Static Notes Storage | **Current & Canonical** | Serves statutory notes via `/notes/[filename].pdf`. |
| `docs/` | Comprehensive Documentation | **Current & Canonical** | Reorganized into numbered topic folders (00–11). |
| `Assets/`, `img/` | Historical Design Assets | **Preserved / Archival** | Retained to prevent broken local references. |
| `md/` | Legacy Notes | **Archival / Superseded** | Superseded by `docs/`; retained for historical audit trail. |
| `*.pdf` (root) | Source PDFs | **Source References** | Ignored by git in `.gitignore`; canonical versions live in `frontend/public/notes/`. |
