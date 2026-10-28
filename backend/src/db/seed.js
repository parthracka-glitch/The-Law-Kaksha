/**
 * The Law Kaksha - Core Database Seeder
 * Implements Course → Act → Unit hierarchy per Phase P2
 * CA Foundation Paper 2 (Live) & CSEET Business Laws and Management (Coming Soon)
 */

const bcrypt = require("bcryptjs");
const Database = require("./database");

async function seed() {
  console.log("[Seeder] Synchronizing database state...");

  const usersTable = Database.table("users");
  const coursesTable = Database.table("courses");
  const actsTable = Database.table("acts");
  const unitsTable = Database.table("units");
  const contentItemsTable = Database.table("content_items");
  const resourcesTable = Database.table("resources");
  const contentTable = Database.table("content");
  const weeklyContentTable = Database.table("weekly_content");

  // Wipe old deprecated mock resources & fake content
  if (resourcesTable.count() > 0) {
    resourcesTable.find().forEach((r) => resourcesTable.delete(r.id));
  }
  if (contentTable.count() > 0) {
    contentTable.find().forEach((c) => contentTable.delete(c.id));
  }
  if (weeklyContentTable.count() > 0) {
    weeklyContentTable.find().forEach((w) => weeklyContentTable.delete(w.id));
  }

  // 1. Seed Courses (CA Foundation Paper 2 & CSEET)
  const coursesData = [
    {
      id: "course-ca-foundation",
      title: "CA Foundation Paper 2",
      slug: "ca-foundation-paper-2",
      availability: "live",
      price: 99,
      mrp: 0,
      accessDays: 30,
      description: "Comprehensive Business Laws preparation platform for CA Foundation Paper 2.",
      thumbnail: "/assets/ca-cs-hero-books-sharp.png",
      kind: "core",
      is_active: true,
      order: 1,
      display_order: 1,
      exam_body: "ICAI",
      units_count: 19,
    },
    {
      id: "course-cseet",
      title: "CSEET Business Laws and Management",
      slug: "cseet-business-laws-management",
      availability: "coming_soon",
      price: 99,
      mrp: 0,
      accessDays: 30,
      description: "Comprehensive Business Laws & Management preparation platform for CSEET.",
      thumbnail: "/assets/ca-cs-hero-books-sharp.png",
      kind: "core",
      is_active: true,
      order: 2,
      display_order: 2,
      exam_body: "ICSI",
      units_count: 0,
    },
    {
      id: "course-ca-qbank",
      title: "CA Foundation — Smart Revision Question Bank (Part 1 & 2)",
      slug: "ca-foundation-smart-revision-question-bank",
      availability: "live",
      price: 349,
      mrp: 699,
      accessDays: 180,
      description: "Official CA Foundation Paper 2 Smart Revision Question Bank (Part 1 & Part 2). Comprehensive exam-oriented practice questions, RTPs, MTPs & ICAI model suggested answers.",
      thumbnail: "/assets/ca-cs-hero-books-sharp.png",
      kind: "extra",
      is_active: true,
      order: 3,
      display_order: 3,
      exam_body: "ICAI",
      units_count: 2,
      highlights: [
        "Both Part 1 & Part 2 Complete Final Volumes Included",
        "Official Smart Revision Question Bank Final Copies",
        "Exam-pattern practice sets with RTPs, MTPs & suggested answers",
        "In-Web DRM Secure Watermarked Reader access with zero downloads",
      ],
    },
  ];

  for (const course of coursesData) {
    const existing = coursesTable.findOne((c) => c.id === course.id || c.slug === course.slug);
    if (!existing) {
      coursesTable.insert(course);
    } else {
      coursesTable.update(existing.id, {
        title: existing.title || course.title,
        slug: existing.slug || course.slug,
        kind: course.kind,
        exam_body: course.exam_body,
        units_count: course.units_count,
        price: existing.price !== undefined ? existing.price : course.price,
        mrp: existing.mrp !== undefined ? existing.mrp : course.mrp,
        accessDays: existing.accessDays !== undefined ? existing.accessDays : course.accessDays,
        availability: existing.availability !== undefined ? existing.availability : course.availability,
      });
    }
  }

  // 2. Seed Acts & Units for CA Foundation Paper 2
  const caFoundationActs = [
    {
      id: "act-ca-contract",
      courseId: "course-ca-foundation",
      title: "The Indian Contract Act, 1872",
      availability: "live",
      order: 1,
      units: [
        { id: "unit-ca-contract-1", title: "Nature & Essentials of Valid Contract (Sec 1-10)", order: 1 },
        { id: "unit-ca-contract-2", title: "Consideration & Capacity to Contract (Sec 11-25)", order: 2 },
        { id: "unit-ca-contract-3", title: "Free Consent, Performance & Breach of Contract", order: 3 },
        { id: "unit-ca-contract-4", title: "Unit 4", order: 4 },
        { id: "unit-ca-contract-5", title: "Unit 5", order: 5 },
        { id: "unit-ca-contract-6", title: "Unit 6", order: 6 },
        { id: "unit-ca-contract-7", title: "Unit 7", order: 7 },
        { id: "unit-ca-contract-8", title: "Unit 8", order: 8 },
        { id: "unit-ca-contract-9", title: "Unit 9", order: 9 },
      ],
    },
    {
      id: "act-ca-soga",
      courseId: "course-ca-foundation",
      title: "The Sale of Goods Act, 1930",
      availability: "live",
      order: 2,
      units: [
        { id: "unit-ca-soga-1", title: "Formation of Contract of Sale & Subject Matter", order: 1 },
        { id: "unit-ca-soga-2", title: "Conditions and Warranties (Sec 11-17)", order: 2 },
        { id: "unit-ca-soga-3", title: "Transfer of Property & Rights of Unpaid Seller", order: 3 },
      ],
    },
    {
      id: "act-ca-partnership",
      courseId: "course-ca-foundation",
      title: "The Indian Partnership Act, 1932",
      availability: "live",
      order: 3,
      units: [
        { id: "unit-ca-partnership-1", title: "General Nature of Partnership", order: 1 },
        { id: "unit-ca-partnership-2", title: "Relations of Partners", order: 2 },
        { id: "unit-ca-partnership-3", title: "Registration and Dissolution of Firm", order: 3 },
      ],
    },
    {
      id: "act-ca-llp",
      courseId: "course-ca-foundation",
      title: "The Limited Liability Partnership Act, 2008",
      availability: "live",
      order: 4,
      units: [
        { id: "unit-ca-llp-1", title: "LLP Architecture & Comparison with Traditional Firm", order: 1 },
      ],
    },
    {
      id: "act-ca-companies",
      courseId: "course-ca-foundation",
      title: "The Companies Act, 2013",
      availability: "coming_soon",
      order: 5,
      units: [
        { id: "unit-ca-companies-1", title: "Essential Characteristics & Lifting of Corporate Veil", order: 1 },
        { id: "unit-ca-companies-2", title: "Memorandum & Articles of Association (MOA / AOA)", order: 2 },
      ],
    },
    {
      id: "act-ca-negotiable",
      courseId: "course-ca-foundation",
      title: "The Negotiable Instruments Act, 1881",
      availability: "coming_soon",
      order: 6,
      units: [
        { id: "unit-ca-negotiable-1", title: "Promissory Notes, Bills of Exchange & Cheques", order: 1 },
      ],
    },
  ];

  for (const actData of caFoundationActs) {
    const existingAct = actsTable.findOne((a) => a.id === actData.id);
    if (!existingAct) {
      actsTable.insert({
        id: actData.id,
        courseId: actData.courseId,
        title: actData.title,
        availability: actData.availability,
        order: actData.order,
      });
    } else {
      actsTable.update(existingAct.id, {
        courseId: actData.courseId,
        title: actData.title,
        availability: actData.availability,
        order: actData.order,
      });
    }

    for (const unit of actData.units) {
      const existingUnit = unitsTable.findOne((u) => u.id === unit.id);
      if (!existingUnit) {
        unitsTable.insert({
          id: unit.id,
          actId: actData.id,
          title: unit.title,
          order: unit.order,
          summary: "",
        });
      } else {
        unitsTable.update(existingUnit.id, {
          actId: actData.id,
          title: unit.title,
          order: unit.order,
        });
      }
    }
  }

  // 2.5 Seed ContentItems for Units
  const initialContentItems = [
    {
      id: "item-ca-contract-1",
      unitId: "unit-ca-contract-1",
      type: "notes",
      title: "Unit 1: Nature & Essentials of Valid Contract (Sec 1-10)",
      cloudinaryPublicId: "",
      samplePublicId: "",
      isSample: false,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 1,
      fileName: "sale-of-goods-unit-1.pdf",
    },
    {
      id: "item-ca-soga-1",
      unitId: "unit-ca-soga-1",
      type: "notes",
      title: "Unit 1: Formation of Contract of Sale & Subject Matter",
      cloudinaryPublicId: "",
      samplePublicId: "",
      isSample: false,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 1,
      fileName: "sale-of-goods-unit-1.pdf",
    },
    {
      id: "item-ca-soga-sample",
      unitId: "unit-ca-soga-1",
      type: "notes",
      title: "Unit 1: Formation of Contract of Sale (Free Sample Preview)",
      cloudinaryPublicId: "",
      samplePublicId: "",
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 2,
      fileName: "sale-of-goods-unit-1.pdf",
    },
    {
      id: "item-ca-partnership-1",
      unitId: "unit-ca-partnership-1",
      type: "notes",
      title: "Unit 1: General Nature of Partnership",
      cloudinaryPublicId: "",
      samplePublicId: "",
      isSample: false,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 1,
      fileName: "unit-1-general-nature-of-partnership.pdf",
    },
    {
      id: "item-ca-companies-1",
      unitId: "unit-ca-companies-1",
      type: "notes",
      title: "Unit 1: Essential Characteristics & Lifting of Corporate Veil",
      cloudinaryPublicId: "",
      samplePublicId: "",
      isSample: false,
      isPublished: true,
      order: 1,
    },
  ];

  for (const item of initialContentItems) {
    const existing = contentItemsTable.findOne((c) => c.id === item.id);
    if (!existing) {
      contentItemsTable.insert(item);
    } else {
      contentItemsTable.update(existing.id, item);
    }
  }

  // 3. Admin Account Seeding (Env vars or Test mode only)
  const envAdminEmail = process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL || (process.env.NODE_ENV === "test" ? "admin@thelawkaksha.com" : null);
  const envAdminPass = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "test" ? "AdminSecurePassword2026!" : null);

  if (envAdminEmail && envAdminPass) {
    const cleanEmail = envAdminEmail.toLowerCase().trim();
    const existingAdmin = usersTable.findOne((u) => u.email && u.email.toLowerCase() === cleanEmail);
    const adminHash = await bcrypt.hash(envAdminPass, 10);

    if (!existingAdmin) {
      usersTable.insert({
        id: "usr-admin-primary",
        student_id: "LK-ADM-000001",
        name: "The Law Kaksha Admin",
        email: cleanEmail,
        phone: "",
        password_hash: adminHash,
        role: "admin",
        is_active: true,
        drm_access: true,
      });
    } else {
      usersTable.update(existingAdmin.id, {
        role: "admin",
        is_active: true,
        password_hash: adminHash,
        phone: "",
      });
    }
  }

  // 4. Clean Site Settings (Real contact details, WhatsApp empty by default)
  const settingsTable = Database.table("site_settings");
  if (settingsTable.count() === 0) {
    settingsTable.insert({
      id: "set-site-details",
      key: "site_details",
      value: {
        whatsapp_number: "", // Empty by default; button hidden if empty
        support_email: "support@thelawkaksha.com",
        domain: "https://thelawkaksha.com",
        watermark_text: "THE LAW KAKSHA • PROTECTED STUDY MATERIAL",
      },
    });

    settingsTable.insert({
      id: "set-footer-details",
      key: "footer_details",
      value: {
        brand: "The Law Kaksha",
        tagline: "Premier Visual Learning Space for CA Foundation & CSEET Law Aspirants.",
        contact_email: "support@thelawkaksha.com",
        contact_phone: "",
        address: "Mumbai, Maharashtra, India",
        copyright: "© 2026 The Law Kaksha. All rights reserved.",
      },
    });

    settingsTable.insert({
      id: "set-social-links",
      key: "social_links",
      value: {
        instagram: "https://instagram.com/thelawkaksha",
        youtube: "https://youtube.com/@thelawkaksha",
        telegram: "https://t.me/thelawkaksha",
        linkedin: "https://linkedin.com/company/thelawkaksha",
      },
    });
  }

  // 5. Seed default coupons if missing
  const couponsTable = Database.table("coupons");
  if (couponsTable.count() === 0) {
    couponsTable.insert({
      id: "coup-launch50",
      code: "LAUNCH50",
      discount_type: "percentage",
      discount_value: 50,
      min_order_amount: 99,
      max_discount_amount: 100,
      usage_limit: 500,
      used_count: 0,
      is_active: true,
      valid_from: new Date().toISOString(),
      valid_until: new Date(Date.now() + 180 * 86400000).toISOString(),
    });
  }

  // 6. Seed Carousel Slides if missing
  const carouselTable = Database.table("carousel_slides");
  if (carouselTable.count() === 0) {
    carouselTable.insert({
      id: "slide-1",
      title: "Master CA Foundation Business Laws",
      subtitle: "Visual frameworks and statutory step-by-step model drafting.",
      badge: "ICAI Scheme",
      link_url: "/courses",
      link_text: "View Courses",
      display_order: 1,
      is_active: true,
      image: "/assets/ca-cs-hero-books-sharp.png",
    });
  }

  // 7. Seed Offers if missing
  const offersTable = Database.table("offers");
  if (offersTable.count() === 0) {
    offersTable.insert({
      id: "offer-launch50",
      title: "Launch Celebration Offer — 50% Off",
      description: "Get 50% off on your first monthly pass with code LAUNCH50.",
      banner: "/assets/ca-cs-hero-books-sharp.png",
      coupon_code: "LAUNCH50",
      valid_from: new Date().toISOString(),
      valid_until: new Date(Date.now() + 180 * 86400000).toISOString(),
      is_active: true,
    });
  }

  console.log("[Seeder] Seeding complete.");
}

module.exports = seed;
