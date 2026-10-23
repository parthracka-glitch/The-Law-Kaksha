/**
 * The Law Kaksha - MongoDB Atlas Seeder & Synchronizer
 * Prepopulates MongoDB Atlas with Course -> Act -> Unit curriculum hierarchy,
 * settings, coupons, and secure admin provisioning.
 */

const bcrypt = require("bcryptjs");
const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const ContentItem = require("../models/ContentItem");
const Product = require("../models/Product");
const Resource = require("../models/Resource");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const Coupon = require("../models/Coupon");
const SiteSetting = require("../models/SiteSetting");

const CA_FOUNDATION_ACTS = [
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

const INITIAL_COURSES = [
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
];

// Discontinued Volume 1 & Volume 2 products removed from platform catalog
const INITIAL_PRODUCTS = [];

const INITIAL_COUPONS = [
  { id: "cp-1", code: "LAUNCH50", discountPercent: 50, minOrder: 99, maxUses: 500, usedCount: 0, expiryDate: "2026-12-31", status: "Active" },
  { id: "cp-2", code: "EXEMPTION2026", discountPercent: 20, minOrder: 200, maxUses: 500, usedCount: 0, expiryDate: "2026-12-31", status: "Active" },
];

const { isConnected } = require("./mongo");

async function seedMongo() {
  try {
    if (!isConnected()) {
      console.log("[MongoDB Atlas Seeder] MongoDB not connected (local mode). Skipping Atlas collection sync.");
      return;
    }
    console.log("[MongoDB Atlas Seeder] Synchronizing collections...");

    // 1. Courses (Never overwrite admin-configured price, mrp, accessDays, or availability on re-seed)
    for (const c of INITIAL_COURSES) {
      const existing = await Course.findOne({ $or: [{ id: c.id }, { slug: c.slug }] });
      if (!existing) {
        await Course.create(c);
      } else {
        await Course.updateOne(
          { _id: existing._id },
          {
            $set: {
              title: existing.title || c.title,
              slug: existing.slug || c.slug,
              kind: c.kind,
              exam_body: c.exam_body,
              units_count: c.units_count,
            },
          }
        );
      }
    }
    console.log("[MongoDB Atlas Seeder] Courses synchronized (admin pricing preserved).");

    // 2. Acts & Units for CA Foundation Paper 2
    for (const act of CA_FOUNDATION_ACTS) {
      await Act.findOneAndUpdate(
        { id: act.id },
        {
          $set: {
            id: act.id,
            courseId: act.courseId,
            title: act.title,
            availability: act.availability,
            order: act.order,
          },
        },
        { upsert: true, new: true }
      );

      for (const unit of act.units) {
        await Unit.findOneAndUpdate(
          { id: unit.id },
          {
            $set: {
              id: unit.id,
              actId: act.id,
              title: unit.title,
              order: unit.order,
              summary: "",
            },
          },
          { upsert: true, new: true }
        );
      }
    }
    console.log("[MongoDB Atlas Seeder] Acts and Units synchronized.");

    // 3. Products (Purge discontinued Volume 1 & Volume 2 courses)
    await Product.deleteMany({ id: { $in: ["prod-vol1", "prod-vol2"] } });
    const prodCount = await Product.countDocuments();
    if (prodCount === 0 && INITIAL_PRODUCTS.length > 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log("[MongoDB Atlas Seeder] Products seeded successfully.");
    }

    // 4. Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany(INITIAL_COUPONS);
      console.log("[MongoDB Atlas Seeder] Coupons seeded successfully.");
    }

    // 5. Site Settings (Real contact details, WhatsApp empty by default)
    const siteDetailsSetting = await SiteSetting.findOne({ key: "site_details" });
    if (!siteDetailsSetting) {
      await SiteSetting.create({
        key: "site_details",
        value: {
          whatsapp_number: "", // Empty by default; button hidden if empty
          support_email: "support@thelawkaksha.com",
          domain: "https://thelawkaksha.com",
          watermark_text: "THE LAW KAKSHA • PROTECTED STUDY MATERIAL",
        },
      });
    }

    const footerSetting = await SiteSetting.findOne({ key: "footer_details" });
    if (!footerSetting) {
      await SiteSetting.create({
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
    }

    // 6. Administrator User (Strictly via Environment Variables or Test mode)
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL || (process.env.NODE_ENV === "test" ? "admin@thelawkaksha.com" : null);
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "test" ? "AdminSecurePassword2026!" : null);

    if (adminEmail && adminPassword) {
      const cleanEmail = adminEmail.toLowerCase().trim();
      const existingAdmin = await User.findOne({ email: cleanEmail });
      const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

      if (!existingAdmin) {
        console.log(`[MongoDB Atlas Seeder] Initializing administrator account for ${cleanEmail}...`);
        await User.create({
          id: "usr-admin-001",
          student_id: "LK-ADM-000001",
          name: "The Law Kaksha Admin",
          email: cleanEmail,
          phone: "",
          password_hash: adminPasswordHash,
          role: "admin",
          is_active: true,
          drm_access: true,
        });
        console.log("[MongoDB Atlas Seeder] Administrator seeded successfully.");
      } else {
        await User.updateOne(
          { _id: existingAdmin._id },
          {
            $set: {
              role: "admin",
              is_active: true,
              password_hash: adminPasswordHash,
              phone: "",
            },
          }
        );
      }
    }

    console.log("[MongoDB Atlas Seeder] Synchronization completed successfully.");
  } catch (err) {
    console.error("[MongoDB Atlas Seeder] Error during seed:", err);
  }
}

module.exports = seedMongo;
