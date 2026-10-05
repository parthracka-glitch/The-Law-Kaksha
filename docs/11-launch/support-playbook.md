# Customer Success & Student Support Playbook

> **Document Status:** Verified against support workflows  
> **Last Verified Date:** 2026-10-05  
> **Target Audience:** Support Agents, Platform Administrator, Operations Desk  

---

## 1. Support Communication Channels & SLAs

| Channel | Contact Point | Monitored Hours | Target First Response | Target Resolution |
|---|---|:---:|:---:|:---:|
| **Academic & Student Email Desk** | `support@thelawkaksha.com` | Mon–Sat, 09:00–20:00 IST | $\le 2$ hours | $\le 12$ hours |
| **Grievance & Privacy Officer** | `grievance@thelawkaksha.com` | Business Days, 10:00–18:00 IST | $\le 24$ hours | $\le 30$ calendar days (Statutory) |
| **Instant Student Helpline** | Official WhatsApp Business | Mon–Sun, 08:00–22:00 IST | $\le 15$ minutes | $\le 1$ hour |

---

## 2. Standard Triage Scripts & Incident Procedures

### Scenario 1: Payment Deducted but Course Not Unlocked
- **Customer Query:** *"I paid ₹199 via PhonePe. Money is deducted from my bank, but dashboard says Locked."*
- **Triage Steps:**
  1. Request screenshot of payment confirmation showing `UPI Reference ID` or `Razorpay Payment ID` (`pay_...`).
  2. Open Razorpay Dashboard $\to$ Search by student phone or email.
  3. If status is **Captured**:
     - Navigate to `/admin` $\to$ Search student $\to$ Click "Unlock Course" $\to$ Select `course-ca-foundation-sub`.
     - Reply with Script A.
  4. If status is **Failed / Not Found**:
     - Explain that payment was not captured by gateway and will automatically auto-refund to bank in 3–5 working days per RBI guidelines.
- **Support Script A (Resolved):**
  > *"Dear [Student Name], thank you for reaching out. We verified your transaction with Razorpay. Your access to CA Foundation Paper 2 notes has been manually unlocked! Please refresh your Student Dashboard at thelawkaksha.com/student to begin studying. Best wishes for your exam prep!"*

### Scenario 2: Student Locked Out by Device Conflict
- **Customer Query:** *"It says 'Device Conflict - Account active on another device'. I got a new phone, how do I login?"*
- **Triage Steps:**
  1. Advise candidate to check the box "Transfer session to this device" on the login screen (`/login`).
  2. If candidate still faces issues, open `/admin` $\to$ Students $\to$ Click "Reset Hardware Lock" for candidate.
- **Support Script B (Hardware Reset):**
  > *"Dear [Student Name], we have refreshed your hardware binding. You can now log into your student portal from your new device immediately. Note that for your account security, simultaneous logins on multiple devices remain restricted."*

### Scenario 3: Request for Personal Data Erasure (DPDP Act)
- **Customer Query:** *"I finished my exams. Please delete all my records and phone number from your database."*
- **Triage Steps:**
  1. Forward email to `grievance@thelawkaksha.com`.
  2. Verify candidate identity.
  3. Execute account anonymization in database within statutory 30-day window while preserving necessary GST tax audit receipts.
  4. Send formal statutory confirmation email.
