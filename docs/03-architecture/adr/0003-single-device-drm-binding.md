# ADR 0003: Single-Device DRM Binding & In-Browser Watermarking

**Status:** Accepted (Inferred from codebase)  
**Date:** 2026-10-05  
**Deciders:** Core Engineering Team & Platform Founder  

---

## Context
Educational study materials for competitive Indian examinations (CA Foundation and CSEET) are subject to widespread unauthorized sharing and redistribution. Traditional approaches in EdTech either rely on cumbersome native desktop encryption executables (which alienate mobile web users) or unsecured PDF downloads (which leak immediately).

## Decision
We implemented a two-tier web-native DRM architecture:
1. Single-Device Session Lock: Every student client generates or retrieves a unique hardware client UUID (`deviceId`). On authentication, the backend records `user.activeDeviceId`. Subsequent API requests require matching token device ID with the stored active device ID. Conflicting logins from another device return `409 Conflict (DEVICE_MISMATCH)`.
2. In-Browser Vector Rendering with Dynamic Watermark: Paid codices are rendered using PDF.js onto HTML5 canvas elements. Overlaid directly on the canvas is a dynamic, non-selectable watermark presenting the student's legal name, email, and session hash.

## Consequences
- **Positive:** Protects academy copyright without forcing students to install intrusive native desktop executables.
- **Negative:** Legitimate students switching devices must go through a device reset flow; browser print/screenshot tools cannot be 100% blocked, though watermarking enables source tracing.
