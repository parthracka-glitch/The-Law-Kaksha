/**
 * Phase P6 Automated Test Suite: Student Learning Dashboard Core & Support System
 * Verifies:
 * 1. GET /api/student/my-courses returns Course -> Act -> Unit -> ContentItem hierarchy
 * 2. Coming-soon acts have isComingSoon: true flag
 * 3. Default-deny / 401 unauthorized protection on student endpoints
 * 4. GET /api/student/progress returns completed units, streak, lawXp
 * 5. POST /api/student/toggle-unit-complete toggles unit completion status
 * 6. POST /api/student/bookmarks adds a bookmark item
 * 7. GET /api/student/bookmarks lists student bookmarks
 * 8. DELETE /api/student/bookmarks/:id removes a bookmark item
 * 9. POST /api/student/support-tickets creates a real support ticket
 * 10. GET /api/student/support-tickets returns the student's ticket history
 * 11. GET /api/admin/support-tickets lists all tickets for admin
 * 12. PUT /api/admin/support-tickets/:id/reply allows admin to reply and resolve ticket
 * 13. Non-admin cannot access admin support ticket endpoints (403)
 */

const { test, describe, before } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Phase P6: Student Learning Dashboard Core & Support System Tests", () => {
  let adminToken = "";
  let studentToken = "";
  let studentId = "";
  let createdTicketId = "";
  const testUnitId = "unit-ca-contract-1";
  const testBookmarkId = `bm-test-${Date.now()}`;

  before(async () => {
    // 1. Admin Login
    const adminRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "admin@thelawkaksha.com",
        password: "AdminSecurePassword2026!",
        deviceId: "admin_test_p6_device",
      }),
    });
    const adminData = await adminRes.json();
    adminToken = adminData.token || "";

    // 2. Student Registration
    const studentRes = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "P6 Test Candidate",
        email: `student_p6_${Date.now()}@thelawkaksha.com`,
        password: "CandidatePassword2026!",
        phone: "9820000006",
        target_exam: "CA Foundation Paper 2: Business Laws",
        role: "student",
      }),
    });
    const studentData = await studentRes.json();
    studentToken = studentData.token || "";
    studentId = studentData.user?.id || studentData.userId || "";
  });

  // 1. Course Hierarchy Endpoint
  test("P6-1: GET /api/student/my-courses returns Course -> Act -> Unit -> ContentItem tree", async () => {
    const res = await fetch(`${API_URL}/api/student/my-courses`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.courses));
    assert.ok(data.courses.length > 0, "Should have at least 1 course");

    const caCourse = data.courses.find((c) => c.id === "ca-foundation" || c.title.includes("CA Foundation"));
    assert.ok(caCourse, "CA Foundation course should exist in tree");
    assert.ok(Array.isArray(caCourse.acts), "Course must contain acts");
    assert.ok(caCourse.acts.length > 0, "Course must have acts");

    const act = caCourse.acts[0];
    assert.ok(Array.isArray(act.units), "Act must contain units");
    assert.ok(act.units.length > 0, "Act must have units");

    const unit = act.units[0];
    assert.ok(Array.isArray(unit.contentItems), "Unit must contain contentItems");
  });

  test("P6-2: GET /api/student/my-courses verifies coming soon flag on acts", async () => {
    const res = await fetch(`${API_URL}/api/student/my-courses`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    const allActs = data.courses.flatMap((c) => c.acts || []);
    const comingSoonAct = allActs.find((a) => a.isComingSoon === true);
    assert.ok(comingSoonAct, "At least one statutory act should have isComingSoon: true flag");
  });

  test("P6-3: GET /api/student/my-courses rejects unauthenticated requests (401)", async () => {
    const res = await fetch(`${API_URL}/api/student/my-courses`);
    assert.strictEqual(res.status, 401);
  });

  // 2. Progress & Unit Completion
  test("P6-4: GET /api/student/progress returns streak, lawXp, and completedUnits", async () => {
    const res = await fetch(`${API_URL}/api/student/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(typeof data.streak === "number");
    assert.ok(typeof data.lawXp === "number");
    assert.ok(Array.isArray(data.completedUnits));
  });

  test("P6-5: POST /api/student/toggle-unit-complete toggles unit completion status", async () => {
    // 1. Mark as completed
    const completeRes = await fetch(`${API_URL}/api/student/toggle-unit-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ unitId: testUnitId, completed: true }),
    });
    assert.strictEqual(completeRes.status, 200);
    const completeData = await completeRes.json();
    assert.strictEqual(completeData.success, true);
    assert.ok(completeData.completedUnits.includes(testUnitId));

    // 2. Mark as incomplete (toggle off)
    const toggleOffRes = await fetch(`${API_URL}/api/student/toggle-unit-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ unitId: testUnitId, completed: false }),
    });
    assert.strictEqual(toggleOffRes.status, 200);
    const toggleOffData = await toggleOffRes.json();
    assert.strictEqual(toggleOffData.success, true);
    assert.ok(!toggleOffData.completedUnits.includes(testUnitId));
  });

  // 3. Bookmarks Management
  test("P6-6: POST /api/student/bookmarks adds a new bookmark", async () => {
    const res = await fetch(`${API_URL}/api/student/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        id: testBookmarkId,
        title: "Nature of Contract Test Bookmark",
        type: "notes",
        url: "/notes/sale-of-goods-unit-1.pdf",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  test("P6-7: GET /api/student/bookmarks returns student's bookmarks list", async () => {
    const res = await fetch(`${API_URL}/api/student/bookmarks`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.bookmarks));
    const found = data.bookmarks.find((b) => b.id === testBookmarkId);
    assert.ok(found, "Created bookmark must be present in student's bookmarks");
    assert.strictEqual(found.title, "Nature of Contract Test Bookmark");
  });

  test("P6-8: DELETE /api/student/bookmarks/:id removes bookmark", async () => {
    const res = await fetch(`${API_URL}/api/student/bookmarks/${testBookmarkId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);

    // Verify deletion
    const verifyRes = await fetch(`${API_URL}/api/student/bookmarks`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const verifyData = await verifyRes.json();
    const found = verifyData.bookmarks.find((b) => b.id === testBookmarkId);
    assert.strictEqual(found, undefined, "Deleted bookmark must no longer be present");
  });

  // 4. Support Ticket System (Student)
  test("P6-9: POST /api/student/support-tickets creates a support ticket", async () => {
    const res = await fetch(`${API_URL}/api/student/support-tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        subject: "Doubt in Section 11 Minor's Agreement",
        category: "academic",
        message: "Can a minor be admitted to the benefits of a partnership under Section 30?",
        priority: "medium",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.ticket);
    assert.strictEqual(data.ticket.subject, "Doubt in Section 11 Minor's Agreement");
    assert.strictEqual(data.ticket.status, "open");
    createdTicketId = data.ticket.id;
  });

  test("P6-10: GET /api/student/support-tickets returns student's tickets", async () => {
    const res = await fetch(`${API_URL}/api/student/support-tickets`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.tickets));
    const found = data.tickets.find((t) => t.id === createdTicketId);
    assert.ok(found, "Ticket created by student must appear in their tickets list");
    assert.strictEqual(found.category, "academic");
  });

  // 5. Support Ticket System (Admin)
  test("P6-11: GET /api/admin/support-tickets returns tickets for admin", async () => {
    const res = await fetch(`${API_URL}/api/admin/support-tickets`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.tickets));
    const found = data.tickets.find((t) => t.id === createdTicketId);
    assert.ok(found, "Student ticket must appear in admin ticket queue");
  });

  test("P6-12: PUT /api/admin/support-tickets/:id/reply allows admin to reply and resolve ticket", async () => {
    const replyMessage = "Yes! Under Section 30 of the Indian Partnership Act, 1932, a minor may be admitted to the benefits of partnership with consent of all partners.";
    const res = await fetch(`${API_URL}/api/admin/support-tickets/${createdTicketId}/reply`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        reply: replyMessage,
        status: "resolved",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.ticket.status, "resolved");
    assert.strictEqual(data.ticket.admin_reply, replyMessage);

    // Verify student sees the resolution
    const studentCheckRes = await fetch(`${API_URL}/api/student/support-tickets`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const studentCheckData = await studentCheckRes.json();
    const updatedTicket = studentCheckData.tickets.find((t) => t.id === createdTicketId);
    assert.ok(updatedTicket);
    assert.strictEqual(updatedTicket.status, "resolved");
    assert.strictEqual(updatedTicket.admin_reply, replyMessage);
  });

  test("P6-13: Non-admin candidate cannot access admin support ticket endpoints (403)", async () => {
    const res = await fetch(`${API_URL}/api/admin/support-tickets`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(res.status, 403);
  });
});
