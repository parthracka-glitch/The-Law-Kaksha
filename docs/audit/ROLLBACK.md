# Rollback Procedures & Contingency Runbook

> **Purpose:** Detailed instructions and commands to revert changes at each phase or roll back production deployments safely.  
> **Status:** Verified against code  
> **Last Verified:** 2026-10-05 (`audit/2026-10-05`)  
> **Owner:** Lead Architect / DevOps  

---

## 1. Baseline Recovery (Emergency Reset)

In the event of an unresolvable regression or test failure across phases:

```bash
# 1. Inspect status
git status

# 2. Return to the clean baseline established at Phase 0
git checkout pre-audit-baseline

# 3. Or revert to a specific phase commit:
# Phase 2 (Safety net): 838f7bf
# Phase 3 (Security):   181f232
# Phase 4 (Dead code):  ac1a958
# Phase 5 (Bug fixes):  5646076
```

---

## 2. Phase-by-Phase Reversal Matrix

| Phase | Rollback Action | Command | Verification After Revert |
|---|---|---|---|
| **Phase 2 (Safety Net)** | Revert test runner & verify script | `git revert 838f7bf` | Check `npm test` and `scripts/verify.js` |
| **Phase 3 (Security)** | Revert CSP, rate limiters & security docs | `git revert 181f232` | Re-run `npm run verify` |
| **Phase 4 (Dead Code)** | Restore deleted scratch text files | `git revert ac1a958` | Check `git status` |
| **Phase 5 (Bug Fixing)** | Revert roll number prefix fix | `git revert 5646076` | Re-run backend test suites |

---

## 3. Production Deployment Rollback

If deploying to Vercel (Frontend) or Render (Backend):
1. **Frontend (Vercel):** Go to Vercel Project Dashboard → Deployments → Select the previous stable deployment → Click "Instant Rollback".
2. **Backend (Render):** Go to Render Dashboard → Service Settings → Manual Deploy → Select the previous commit hash → Deploy.
3. **Database (MongoDB Atlas):** Point application to latest hourly automated snapshot if data corruption occurred.
