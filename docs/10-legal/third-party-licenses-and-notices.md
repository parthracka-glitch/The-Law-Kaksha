# Third-Party Software Licenses & Attribution Notices

> **Notice:** DRAFT: requires review by a qualified lawyer before publication. Not legal advice.  
> **Last Updated:** 2026-10-05  
> **Version:** 1.0.0-draft  
> **Scope:** Software Bill of Materials (SBOM) and Open Source License Compliance  

---

## 1. Overview & Open Source Commitment

The Law Kaksha utilizes open-source libraries and frameworks licensed under permissive licenses (MIT, Apache 2.0, BSD-3-Clause, ISC). We acknowledge and appreciate the global open-source community for their foundational software contributions.

---

## 2. Software Bill of Materials (SBOM)

### Frontend Dependencies (`thelawkaksha/frontend`)

| Package Name | Version | License | Primary Purpose | Repository / Author |
|---|:---:|:---:|---|---|
| `next` | 16.3.8 | MIT | React Application Framework | Vercel, Inc. |
| `react` | 19.2.4 | MIT | UI Component Library | Meta Platforms, Inc. |
| `react-dom` | 19.2.4 | MIT | React Document Object Model bindings | Meta Platforms, Inc. |
| `tailwindcss` | 4.x | MIT | Utility-first CSS Engine | Tailwind Labs, Inc. |
| `lucide-react` | 0.548.0 | ISC | Feather-based SVG Iconography | Lucide Contributors |
| `pdfjs-dist` | 6.3.289 | Apache 2.0 | In-browser PDF parsing and canvas rendering | Mozilla Foundation |
| `canvas-confetti` | 1.9.4 | ISC | Student celebratory visual effects | Kiril Vatev |
| `clsx` | 2.1.1 | MIT | Dynamic class string concatenation | Luke Edwards |
| `tailwind-merge` | 3.5.0 | MIT | Conflict-free Tailwind class resolution | Dany Castillo |

### Backend Dependencies (`thelawkaksha/backend`)

| Package Name | Version | License | Primary Purpose | Repository / Author |
|---|:---:|:---:|---|---|
| `express` | 4.21.2 | MIT | Fast, unopinionated HTTP REST framework | OpenJS Foundation |
| `mongoose` | 9.10.3 | MIT | MongoDB object modeling and schema validation | Automattic / Valeri Karpov |
| `jsonwebtoken` | 9.0.2 | MIT | RFC 7519 JSON Web Token signing and verification | Auth0 by Okta |
| `bcryptjs` | 3.0.3 | MIT | One-way salted password hashing | Daniel Schmidt |
| `razorpay` | 2.9.8 | MIT | Razorpay Payment Gateway Node.js SDK | Razorpay Software Private Ltd. |
| `google-auth-library` | 11.1.0 | Apache 2.0 | Google Identity / OAuth2 token verification | Google LLC |
| `helmet` | 8.1.0 | MIT | HTTP response security headers middleware | Helmet Contributors |
| `cors` | 2.8.5 | MIT | Cross-Origin Resource Sharing middleware | Troy Goode |
| `express-rate-limit` | 8.3.1 | MIT | IP-based request throttling and brute-force guard | Nathan Friedly |
| `multer` | 2.1.1 | MIT | Multipart/form-data upload handling | Express.js Team |
| `cloudinary` | 2.11.0 | MIT | Cloud image and media management SDK | Cloudinary Ltd. |

---

## 3. Commercial License Disclosures

- **Razorpay SDK:** Used pursuant to merchant service terms between The Law Kaksha and Razorpay Software Private Limited.
- **Font & Graphic Assets:** All academic diagrams, section flowcharts, and logo marks are original intellectual creations owned exclusively by The Law Kaksha, protected under the *Indian Copyright Act, 1957*.
