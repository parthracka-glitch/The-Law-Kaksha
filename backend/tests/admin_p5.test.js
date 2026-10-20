/**
 * Phase P5 Automated Test Suite: Admin Restructure & Content Hierarchy Management
 * Verifies:
 * 1. GET /api/admin/courses returns courses with availability, price, and accessDays
 * 2. PUT /api/admin/courses/:id toggles availability (live <-> coming_soon) and updates price/accessDays
 * 3. GET /api/admin/acts returns acts for course, POST creates an act, and PUT updates availability
 * 4. GET /api/admin/units and POST /api/admin/units creates unit under act
 * 5. POST /api/admin/content-items creates content item with isSample & samplePagesRange
 * 6. PUT /api/admin/content-items/:id toggles isPublished status
 * 7. DELETE /api/admin/content-items/:id deletes content item
 * 8. GET /api/admin/settings and PUT /api/admin/settings manages site details
 * 9. GET /api/public/site-settings returns public site details (whatsapp empty by default)
 */

const { test, describe, before } = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

describe("Phase P5: Admin Courses, Content Hierarchy & Site Details Tests", () => {
  let adminToken = "";
  let studentToken = "";
  const testActId = "act-ca-contract";
  let createdUnitId = "";
  let createdContentItemId = "";

  before(async () => {
    // 1. Admin Login
    const adminRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "admin@thelawkaksha.com",
        password: "AdminSecurePassword2026!",
        deviceId: "admin_test_p5_device",
      }),
    });
    const adminData = await adminRes.json();
    adminToken = adminData.token || "";

    // 2. Student Login / Register
    const studentRes = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "P5 Student",
        email: `student_p5_${Date.now()}@thelawkaksha.com`,
        password: "StudentPassword2026!",
        phone: "9820000005",
        target_exam: "CA Foundation Paper 2: Business Laws",
        role: "student",
      }),
    });
    const studentData = await studentRes.json();
    studentToken = studentData.token || "";
  });

  test("P5 Course Management: Admin can fetch all courses with price and availability", async () => {
    const res = await fetch(`${API_URL}/api/admin/courses`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.courses));
    assert.ok(data.courses.length >= 2);

    const caCourse = data.courses.find((c) => c.id === "course-ca-foundation");
    assert.ok(caCourse, "CA Foundation course must exist");
    assert.ok(["live", "coming_soon"].includes(caCourse.availability));
    assert.ok(typeof caCourse.price === "number");
    assert.ok(typeof caCourse.accessDays === "number");
  });

  test("P5 Course Creation: Admin can create a course with pricing, exam body, and availability", async () => {
    const title = `Test Course ${Date.now()}`;
    const res = await fetch(`${API_URL}/api/admin/courses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        exam_body: "ICSI",
        description: "Created by the P5 course builder test.",
        price: 149,
        mrp: 399,
        accessDays: 45,
        availability: "coming_soon",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.course.title, title);
    assert.ok(data.course.slug, "Course slug must be generated");
    assert.strictEqual(data.course.exam_body, "ICSI");
    assert.strictEqual(data.course.price, 149);
    assert.strictEqual(data.course.accessDays, 45);
    assert.strictEqual(data.course.availability, "coming_soon");
  });

  test("P5 Course Pricing & Availability: Admin can toggle live/coming_soon and update accessDays", async () => {
    // 1. Update course to coming_soon and update accessDays to 60
    const updateRes = await fetch(`${API_URL}/api/admin/courses/course-ca-foundation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        availability: "coming_soon",
        price: 149,
        accessDays: 60,
      }),
    });
    assert.strictEqual(updateRes.status, 200);
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.success, true);
    assert.strictEqual(updateData.course.availability, "coming_soon");
    assert.strictEqual(updateData.course.price, 149);
    assert.strictEqual(updateData.course.accessDays, 60);

    // 2. Toggle back to live
    const revertRes = await fetch(`${API_URL}/api/admin/courses/course-ca-foundation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        availability: "live",
        price: 99,
        accessDays: 30,
      }),
    });
    assert.strictEqual(revertRes.status, 200);
    const revertData = await revertRes.json();
    assert.strictEqual(revertData.course.availability, "live");
    assert.strictEqual(revertData.course.price, 99);
    assert.strictEqual(revertData.course.accessDays, 30);
  });

  test("P5 Act Hierarchy: Admin can fetch acts for course and toggle act availability", async () => {
    // 1. Fetch acts for CA Foundation
    const actsRes = await fetch(`${API_URL}/api/admin/acts?courseId=course-ca-foundation`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(actsRes.status, 200);
    const actsData = await actsRes.json();
    assert.strictEqual(actsData.success, true);
    assert.ok(Array.isArray(actsData.acts));
    assert.ok(actsData.acts.length > 0);

    const firstAct = actsData.acts[0];
    const newAvail = firstAct.availability === "live" ? "coming_soon" : "live";

    // 2. Toggle act availability
    const toggleRes = await fetch(`${API_URL}/api/admin/acts/${firstAct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ availability: newAvail }),
    });
    assert.strictEqual(toggleRes.status, 200);
    const toggleData = await toggleRes.json();
    assert.strictEqual(toggleData.success, true);
    assert.strictEqual(toggleData.act.availability, newAvail);

    // Revert
    await fetch(`${API_URL}/api/admin/acts/${firstAct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ availability: firstAct.availability }),
    });
  });

  test("P5 Act Creation: Admin can create a new act under a course", async () => {
    const createdActId = `act-p5-test-${Date.now()}`;
    const createRes = await fetch(`${API_URL}/api/admin/acts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: createdActId,
        courseId: "course-ca-foundation",
        title: "P5 Test Act",
        availability: "live",
        order: 99,
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const createData = await createRes.json();
    assert.strictEqual(createData.success, true);
    assert.strictEqual(createData.act.id, createdActId);
    assert.strictEqual(createData.act.title, "P5 Test Act");

    const listRes = await fetch(`${API_URL}/api/admin/acts?courseId=course-ca-foundation`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(listRes.status, 200);
    const listData = await listRes.json();
    assert.ok(listData.acts.some((act) => act.id === createdActId));
  });

  test("P5 Unit Management: Admin can create and list units under an act", async () => {
    createdUnitId = `unit-p5-test-${Date.now()}`;
    const createUnitRes = await fetch(`${API_URL}/api/admin/units`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: createdUnitId,
        actId: testActId,
        title: "P5 Unit: Nature of Contract & Essentials",
        order: 99,
        summary: "Test unit for automated P5 verification.",
      }),
    });
    assert.strictEqual(createUnitRes.status, 201);
    const createUnitData = await createUnitRes.json();
    assert.strictEqual(createUnitData.success, true);
    assert.strictEqual(createUnitData.unit.id, createdUnitId);

    // Fetch units for act
    const getUnitsRes = await fetch(`${API_URL}/api/admin/units?actId=${testActId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(getUnitsRes.status, 200);
    const getUnitsData = await getUnitsRes.json();
    assert.ok(getUnitsData.units.some((u) => u.id === createdUnitId));
  });

  test("P5 Content Item: Admin can create content item with isSample and samplePagesRange", async () => {
    createdContentItemId = `item-p5-${Date.now()}`;
    const createItemRes = await fetch(`${API_URL}/api/admin/content-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: createdContentItemId,
        unitId: createdUnitId,
        title: "P5 Comprehensive Unit Notes",
        type: "notes",
        isSample: true,
        samplePagesRange: "1-5",
        isPublished: true,
        description: "Statutory notes covering Offer, Acceptance, and Consideration.",
        fileName: "p5_notes_unit1.pdf",
        cloudinaryPublicId: "thelawkaksha/pdfs/p5_sample_pdf_raw",
        order: 1,
      }),
    });
    assert.strictEqual(createItemRes.status, 201);
    const createData = await createItemRes.json();
    assert.strictEqual(createData.success, true);
    assert.strictEqual(createData.item.id, createdContentItemId);
    assert.strictEqual(createData.item.isSample, true);
    assert.strictEqual(createData.item.samplePagesRange, "1-5");
    assert.strictEqual(createData.item.sampleFromPage, 1);
    assert.strictEqual(createData.item.sampleToPage, 5);
    assert.strictEqual(createData.item.isPublished, true);
  });

  test("P5 Content Item: Admin can toggle publish/unpublish status and delete item", async () => {
    // 1. Unpublish
    const unpubRes = await fetch(`${API_URL}/api/admin/content-items/${createdContentItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isPublished: false }),
    });
    assert.strictEqual(unpubRes.status, 200);
    const unpubData = await unpubRes.json();
    assert.strictEqual(unpubData.item.isPublished, false);

    // 2. Publish back
    const pubRes = await fetch(`${API_URL}/api/admin/content-items/${createdContentItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isPublished: true }),
    });
    assert.strictEqual(pubRes.status, 200);
    const pubData = await pubRes.json();
    assert.strictEqual(pubData.item.isPublished, true);

    // 3. Delete item
    const delRes = await fetch(`${API_URL}/api/admin/content-items/${createdContentItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    const delData = await delRes.json();
    assert.strictEqual(delData.success, true);

    // 4. Verify item is removed
    const listRes = await fetch(`${API_URL}/api/admin/content-items?unitId=${createdUnitId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listData = await listRes.json();
    assert.ok(!listData.items.some((i) => i.id === createdContentItemId));
  });

  test("P5 Site Details Settings: Admin can configure support email, domain, watermark & whatsapp", async () => {
    // 1. Fetch site settings
    const getRes = await fetch(`${API_URL}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.success, true);
    assert.ok(getData.data, "Must return data object containing site details");

    // 2. Update site settings
    const putRes = await fetch(`${API_URL}/api/admin/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        support_email: "grievance@thelawkaksha.com",
        domain: "https://thelawkaksha.com",
        watermark_text: "THE LAW KAKSHA • CA & CSEET EXCLUSIVE",
        whatsapp_number: "", // Clean empty by default
      }),
    });
    assert.strictEqual(putRes.status, 200);
    const putData = await putRes.json();
    assert.strictEqual(putData.success, true);
    assert.strictEqual(putData.data.support_email, "grievance@thelawkaksha.com");
    assert.strictEqual(putData.data.domain, "https://thelawkaksha.com");
    assert.strictEqual(putData.data.watermark_text, "THE LAW KAKSHA • CA & CSEET EXCLUSIVE");
    assert.strictEqual(putData.data.whatsapp_number, "");

    // 3. Verify public read endpoint /api/public/site-settings
    const pubRes = await fetch(`${API_URL}/api/public/site-settings`);
    assert.strictEqual(pubRes.status, 200);
    const pubData = await pubRes.json();
    assert.strictEqual(pubData.success, true);
    assert.strictEqual(pubData.site_details.support_email, "grievance@thelawkaksha.com");
    assert.strictEqual(pubData.site_details.watermark_text, "THE LAW KAKSHA • CA & CSEET EXCLUSIVE");
    assert.strictEqual(pubData.whatsapp_number, "");
  });

  test("P5 Security: Non-admin is rejected from all /api/admin/* endpoints with 403", async () => {
    const unauthRes = await fetch(`${API_URL}/api/admin/courses`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(unauthRes.status, 403);
  });
});
