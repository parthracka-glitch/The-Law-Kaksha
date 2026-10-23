/**
 * The Law Kaksha — Catalog Routes
 * Serves courses, acts/units, study codices from MongoDB Atlas for CA Foundation & CSEET
 */

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Resource = require("../models/Resource");
const SiteSetting = require("../models/SiteSetting");
const Course = require("../models/Course");
const Act = require("../models/Act");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");
const { serializeProduct, serializeCourse, serializeResource } = require("../utils/responseSerializer");

const DEFAULT_COURSES = [];

async function getActiveCourses() {
  if (isConnected()) {
    return Course.find({ is_active: { $ne: false } }).sort({ order: 1, display_order: 1 }).lean();
  }
  return Database.table("courses")
    .find((c) => c.is_active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

function courseToCatalogItem(course, syllabus = []) {
  const price = Number(course.price ?? 99);
  const mrp = Number(course.mrp ?? 0);
  const examBody = course.exam_body || "ICAI";
  const category = examBody === "ICSI" ? "CSEET" : "CA Foundation";
  const comingSoon = course.availability === "coming_soon";

  return {
    id: course.id,
    slug: course.slug,
    type: "course",
    courseId: course.id,
    title: course.title,
    subtitle: course.description || `${category} Business Laws curriculum`,
    description: course.description || "",
    price,
    original_price: mrp > price ? mrp : 0,
    badge: comingSoon ? "Coming Soon" : `₹${price} / ${course.accessDays || 30} Days`,
    category,
    examBody,
    pages_or_duration: course.units_count
      ? `${course.units_count} Units`
      : comingSoon
      ? "Launching Soon"
      : "Self-paced",
    cover_image: course.thumbnail || "/assets/ca-cs-hero-books-sharp.png",
    highlights: course.highlights || [],
    paymentType: "monthly",
    comingSoon,
    ...(syllabus.length > 0 ? { syllabus } : {}),
  };
}

// Discontinued course IDs permanently purged from public catalog
const REMOVED_PRODUCT_IDS = new Set(["prod-vol1", "prod-vol2"]);

function isRemovedProduct(item) {
  if (!item) return false;
  if (REMOVED_PRODUCT_IDS.has(item.id)) return true;
  const title = (item.title || "").toLowerCase();
  if (title.includes("volume 1: business law") || title.includes("volume 2: cseet")) return true;
  return false;
}

function resolveCourseAlias(rawId) {
  const clean = String(rawId || "").toLowerCase().trim();
  if (
    clean === "course-ca-foundation" ||
    clean === "course-ca-foundation-sub" ||
    clean === "ca-foundation" ||
    clean === "ca-foundation-paper-2" ||
    clean === "ca-foundation-business-laws" ||
    clean === "ca-foundation-business-laws-monthly-access" ||
    clean === "ca-foundation-monthly" ||
    clean === "sub-ca-foundation-monthly"
  ) {
    return "course-ca-foundation";
  }
  if (
    clean === "course-cseet" ||
    clean === "course-cseet-sub" ||
    clean === "cseet" ||
    clean === "cseet-business-laws-management" ||
    clean === "cseet-business-law-management-monthly-access" ||
    clean === "cseet-monthly" ||
    clean === "sub-cseet-monthly"
  ) {
    return "course-cseet";
  }
  return rawId;
}

// GET /api/public/site-data — Public site sync data (products, countdowns, QOTD)
router.get("/public/site-data", async (req, res) => {
  try {
    let products = [];
    let examSettings = [];
    let qotd = null;
    let mcqPool = null;

    if (isConnected()) {
      products = await Product.find({ status: "Active" }).sort({ createdAt: -1 }).lean();
      const examDoc = await SiteSetting.findOne({ key: "exam_countdown" }).lean();
      if (examDoc) examSettings = examDoc.value;
      const qotdDoc = await SiteSetting.findOne({ key: "qotd" }).lean();
      if (qotdDoc) qotd = qotdDoc.value;
      const mcqDoc = await SiteSetting.findOne({ key: "mcq_pool" }).lean();
      if (mcqDoc) mcqPool = mcqDoc.value;
    } else {
      products = Database.table("products").find((p) => p.status === "Active");
      if (!products || products.length === 0) {
        products = DEFAULT_COURSES;
      }
    }

    const filteredProducts = products.filter((p) => !isRemovedProduct(p));

    res.status(200).json({
      success: true,
      source: isConnected() ? "mongodb_atlas" : "local_cache",
      products: filteredProducts.map(serializeProduct),
      examSettings,
      qotd,
      mcqPool,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching site data." });
  }
});

// GET /api/catalog — List all catalog products (DB + Courses)
router.get("/catalog", async (req, res) => {
  try {
    let dbProducts = [];
    if (isConnected()) {
      dbProducts = await Product.find({ status: "Active" }).lean();
    } else {
      dbProducts = Database.table("products").find((p) => p.status === "Active");
    }

    // Adapt DB products into catalog format and filter removed courses
    const formattedDbProducts = dbProducts
      .filter((p) => !isRemovedProduct(p))
      .map((p) => ({
        ...p,
        original_price: p.originalPrice || 499,
        badge: `₹${p.price}`,
      }));

    const courses = await getActiveCourses();
    const courseItems = courses.map((course) => courseToCatalogItem(course));

    let allProducts = [...DEFAULT_COURSES, ...courseItems, ...formattedDbProducts].filter(
      (p) => !isRemovedProduct(p)
    );

    if (req.query.type && req.query.type !== "all") {
      allProducts = allProducts.filter((p) => p.type === req.query.type);
    }
    if (req.query.category && req.query.category !== "all") {
      allProducts = allProducts.filter(
        (p) => p.category === req.query.category || p.category === "Both"
      );
    }
    if (req.query.search) {
      const q = req.query.search.toLowerCase().trim();
      allProducts = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    const serializedProducts = allProducts.map((p) =>
      p.type === "course" ? p : serializeProduct(p)
    );

    res.status(200).json({
      success: true,
      source: isConnected() ? "mongodb_atlas" : "local_cache",
      count: serializedProducts.length,
      products: serializedProducts,
      items: serializedProducts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching catalog." });
  }
});

// GET /api/catalog/:id — Get a single course/product's complete details
router.get("/catalog/:id", async (req, res) => {
  const id = req.params.id;
  if (REMOVED_PRODUCT_IDS.has(id)) {
    return res.status(404).json({ success: false, message: "Course discontinued and removed from catalog." });
  }
  try {
    const resolvedId = resolveCourseAlias(id);
    // Check in default courses
    let product = DEFAULT_COURSES.find((p) => p.id === id || p.slug === id || p.id === resolvedId || p.slug === resolvedId);

    let course = null;
    if (!product) {
      if (isConnected()) {
        course = await Course.findOne({
          $or: [{ id }, { slug: id }, { id: resolvedId }, { slug: resolvedId }],
        }).lean();
      }
      if (!course) {
        course = Database.table("courses").findOne(
          (c) => c.id === id || c.slug === id || c.id === resolvedId || c.slug === resolvedId
        );
      }
    }

    if (course) {
      let acts = [];
      if (isConnected()) {
        acts = await Act.find({ courseId: course.id }).sort({ order: 1 }).lean();
      } else {
        acts = Database.table("acts")
          .find((a) => a.courseId === course.id)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      const syllabus = acts.map((act, index) => ({
        chapter: `Chapter ${index + 1}`,
        title: act.title,
      }));
      const cleanCourse = courseToCatalogItem(course, syllabus);
      return res.status(200).json({
        success: true,
        product: cleanCourse,
        item: cleanCourse,
      });
    }

    if (!product) {
      if (isConnected()) {
        product = await Product.findOne({ id }).lean();
      } else {
        product = Database.table("products").findOne((p) => p.id === id);
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found in catalog." });
    }

    const cleanProduct = serializeProduct(product);

    res.status(200).json({
      success: true,
      product: cleanProduct,
      item: cleanProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching product details." });
  }
});

// GET /api/courses — List all courses
router.get("/courses", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    const courses = await getActiveCourses();
    res.status(200).json({ success: true, courses: courses.map(serializeCourse) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching courses." });
  }
});

// GET /api/courses/:courseId — Get a specific course
router.get("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const resolvedId = resolveCourseAlias(courseId);
    let course = null;
    if (isConnected()) {
      course = await Course.findOne({
        $or: [{ id: courseId }, { slug: courseId }, { id: resolvedId }, { slug: resolvedId }],
      }).lean();
    }
    if (!course) {
      course = Database.table("courses").findOne(
        (c) => c.id === courseId || c.slug === courseId || c.id === resolvedId || c.slug === resolvedId
      );
    }
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course: serializeCourse(course) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching course." });
  }
});

// GET /api/courses/:courseId/acts — Get acts/units for a course
router.get("/courses/:courseId/acts", async (req, res) => {
  try {
    const { courseId } = req.params;
    let acts = [];
    if (isConnected()) {
      acts = await Act.find({ courseId }).sort({ order: 1 }).lean();
    } else {
      acts = Database.table("acts")
        .find((a) => a.courseId === courseId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    res.status(200).json({ success: true, acts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching course acts." });
  }
});

// GET /api/courses/:courseId/content — Get all content for a course
router.get("/courses/:courseId/content", (req, res) => {
  const contentTable = Database.table("content");
  let content = contentTable.find((c) => c.courseId === req.params.courseId);

  if (req.query.type) {
    content = content.filter((c) => c.type === req.query.type);
  }
  if (req.query.actId) {
    content = content.filter((c) => c.actId === req.query.actId);
  }
  if (req.query.sampleOnly === "true") {
    content = content.filter((c) => c.isSample === true);
  }

  res.status(200).json({ success: true, content });
});

// GET /api/courses/:courseId/weekly — Get weekly content
router.get("/courses/:courseId/weekly", (req, res) => {
  const weeklyContentTable = Database.table("weekly_content");
  const weekly = weeklyContentTable.find(
    (w) => w.courseId === req.params.courseId && w.status === "active"
  );
  res.status(200).json({ success: true, weekly });
});

// GET /api/resources — Act-wise resources query
router.get("/resources", async (req, res) => {
  try {
    const { course, actName, type, sampleOnly } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (actName) filter.actName = actName;
    if (type) filter.type = type;
    if (sampleOnly === "true") filter.isSample = true;

    if (isConnected()) {
      const resources = await Resource.find(filter).sort({ chapterNumber: 1, order: 1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", resources: resources.map((r) => serializeResource(r)) });
    }

    const resourcesTable = Database.table("resources");
    let resources = resourcesTable.find();
    if (course) resources = resources.filter((r) => r.course === course);
    if (actName) resources = resources.filter((r) => r.actName === actName);
    if (type) resources = resources.filter((r) => r.type === type);
    if (sampleOnly === "true") resources = resources.filter((r) => r.isSample === true);

    res.status(200).json({ success: true, source: "local_cache", resources: resources.map((r) => serializeResource(r)) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching resources: " + err.message });
  }
});

// GET /api/public/section16-comparison — Section 16(1) Sale of Goods Model Answer Block
router.get("/public/section16-comparison", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "section16_comparison" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, source: "mongodb_atlas", comparison: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      source: "default",
      comparison: {
        act: "The Sale of Goods Act, 1930",
        section: "Section 16(1)",
        marks: 6,
        topic: "Doctrine of Caveat Emptor & Implied Condition as to Quality or Fitness",
        question: "Under Section 16(1) of the Sale of Goods Act, 1930, explain the conditions under which an implied condition as to quality or fitness applies even when not expressly stated.",
        aspirantScore: "2 / 6 Marks",
        aspirantAnswer: "Caveat Emptor means let the buyer beware. The buyer should inspect goods himself before buying. However, if the buyer told the seller why he is buying and seller is in business, seller is responsible. (Priest v. Last)",
        aspirantIssues: [
          "Fails to cite exact statutory 3-element test of Section 16(1)",
          "Missing explanation of 'communication of purpose by implication'",
          "No mention of patent or trade name proviso exception",
        ],
        modelScore: "6 / 6 Marks",
        modelAnswer: "Under Section 16(1) of the Sale of Goods Act, 1930, the general rule of Caveat Emptor is displaced and an implied condition arises if: (1) Buyer makes known to seller the particular purpose (expressly or by implication), (2) Buyer relies on seller's skill or judgment, (3) Goods are of a description which seller supplies in the course of business. Exception: Proviso to Sec 16(1) provides no implied condition for specified articles sold under patent or trade name.",
        modelKeyTakeaways: [
          "Exact 3-prong statutory rule citation from ICAI Suggested Answers",
          "Sub-clause proviso regarding patent/trade names clearly demarcated",
          "Structured in Point-Wise Legal Architecture for maximum evaluator marks",
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching comparison block." });
  }
});

// ==========================================
// SURFACE A & C PUBLIC CONTENT ENDPOINTS (§6)
// ==========================================

// GET /api/subscriptions — List active subscriptions
// GET /api/subscriptions — List active subscriptions (Always synchronized with live courses)
router.get("/subscriptions", async (req, res) => {
  try {
    const courses = await getActiveCourses();
    const caCourse = courses.find((c) => {
      const id = String(c.id || "").toLowerCase();
      const title = String(c.title || "").toLowerCase();
      return id.includes("ca-foundation") || id === "ca-foundation" || title.includes("foundation");
    });
    const cseetCourse = courses.find((c) => {
      const id = String(c.id || "").toLowerCase();
      const title = String(c.title || "").toLowerCase();
      return id.includes("cseet") || title.includes("cseet");
    });

    let plans = [];
    const plansTable = Database.table("subscription_plans");
    plans = plansTable.find((p) => p.is_active !== false).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    if (isConnected()) {
      try {
        const Subscription = require("../models/Subscription");
        const mongoPlans = await Subscription.find({
          is_active: { $ne: false },
          $or: [
            { id: { $in: ["sub-ca-foundation-monthly", "sub-cseet-monthly"] } },
            { slug: { $in: ["ca-foundation-monthly", "cseet-monthly"] } },
            { course_ids: { $exists: true, $not: { $size: 0 } } },
          ],
        }).sort({ display_order: 1 }).lean();
        if (mongoPlans && mongoPlans.length > 0) plans = mongoPlans;
      } catch (_) {}
    }

    // Dynamic course pricing
    const caPrice = caCourse && typeof caCourse.price === "number" ? caCourse.price : 99;
    const caMrp = caCourse && typeof caCourse.mrp === "number" && caCourse.mrp > 0 ? caCourse.mrp : 299;
    const caDuration = caCourse && typeof caCourse.accessDays === "number" && caCourse.accessDays > 0 ? caCourse.accessDays : 30;

    const csPrice = cseetCourse && typeof cseetCourse.price === "number" ? cseetCourse.price : 99;
    const csMrp = cseetCourse && typeof cseetCourse.mrp === "number" && cseetCourse.mrp > 0 ? cseetCourse.mrp : 299;
    const csDuration = cseetCourse && typeof cseetCourse.accessDays === "number" && cseetCourse.accessDays > 0 ? cseetCourse.accessDays : 30;
    const csComingSoon = cseetCourse?.availability === "coming_soon";

    const defaultCaPlan = {
      id: "sub-ca-foundation-monthly",
      title: caCourse?.title || "CA Foundation Business Laws",
      slug: "ca-foundation-monthly",
      description: caCourse?.description || "Complete 7 Acts coverage under ICAI New Scheme with chapter codices, case notes & live doubt support.",
      price: caPrice,
      mrp: caMrp,
      duration_days: caDuration,
      badge: "MOST POPULAR",
      is_popular: true,
      is_active: true,
      course_ids: [caCourse?.id || "course-ca-foundation"],
    };

    const defaultCsPlan = {
      id: "sub-cseet-monthly",
      title: cseetCourse?.title || "CSEET Business Law and Management",
      slug: "cseet-monthly",
      description: cseetCourse?.description || "Master all 8 Units under ICSI Syllabus with timed MCQ drills, conceptual mindmaps & live mentoring.",
      price: csPrice,
      mrp: csMrp,
      duration_days: csDuration,
      badge: csComingSoon ? "COMING SOON" : "ICSI SYLLABUS",
      is_popular: false,
      is_active: true,
      course_ids: [cseetCourse?.id || "course-cseet"],
    };

    if (!plans || plans.length === 0) {
      plans = [defaultCaPlan, defaultCsPlan];
    } else {
      plans = plans.map((p) => {
        const key = `${p.id || ""} ${p.slug || ""} ${p.title || ""}`.toLowerCase();
        if (key.includes("ca") || key.includes("foundation")) {
          return {
            ...p,
            price: caPrice,
            mrp: caMrp,
            duration_days: caDuration,
          };
        }
        if (key.includes("cs") || key.includes("cseet")) {
          return {
            ...p,
            price: csPrice,
            mrp: csMrp,
            duration_days: csDuration,
          };
        }
        return p;
      });

      const hasCa = plans.some((p) => `${p.id} ${p.slug}`.toLowerCase().includes("ca"));
      const hasCs = plans.some((p) => `${p.id} ${p.slug}`.toLowerCase().includes("cseet"));
      if (!hasCa) plans.unshift(defaultCaPlan);
      if (!hasCs) plans.push(defaultCsPlan);
    }

    res.status(200).json({ success: true, count: plans.length, subscriptions: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscriptions: " + err.message });
  }
});

// GET /api/subscriptions/:slug — Single subscription detail
router.get("/subscriptions/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const resolvedCourseId = resolveCourseAlias(slug);
    const resolvedSubSlug =
      resolvedCourseId === "course-ca-foundation"
        ? "ca-foundation-monthly"
        : resolvedCourseId === "course-cseet"
        ? "cseet-monthly"
        : slug;

    const courses = await getActiveCourses();
    const matchedCourse = courses.find((c) => {
      const id = String(c.id || "").toLowerCase();
      const s = String(c.slug || "").toLowerCase();
      const resId = String(resolvedCourseId || "").toLowerCase();
      return id === resId || s === resId || id === slug || s === slug;
    });

    let plan = null;
    const plansTable = Database.table("subscription_plans");
    plan = plansTable.findOne(
      (p) =>
        p.slug === slug ||
        p.id === slug ||
        p.slug === resolvedSubSlug ||
        p.id === `sub-${resolvedSubSlug}` ||
        (p.course_ids && p.course_ids.includes(resolvedCourseId))
    );

    if (!plan && isConnected()) {
      try {
        const Subscription = require("../models/Subscription");
        plan = await Subscription.findOne({
          $or: [
            { slug },
            { id: slug },
            { slug: resolvedSubSlug },
            { id: `sub-${resolvedSubSlug}` },
            { course_ids: resolvedCourseId },
          ],
        }).lean();
      } catch (_) {}
    }

    if (!plan) {
      const isCa = resolvedCourseId === "course-ca-foundation" || slug.includes("ca");
      const course = matchedCourse || courses.find((c) => (isCa ? c.id.includes("ca") : c.id.includes("cseet")));
      const pPrice = course && typeof course.price === "number" ? course.price : 99;
      const pMrp = course && typeof course.mrp === "number" && course.mrp > 0 ? course.mrp : 299;
      const pDays = course && typeof course.accessDays === "number" && course.accessDays > 0 ? course.accessDays : 30;

      plan = {
        id: isCa ? "sub-ca-foundation-monthly" : "sub-cseet-monthly",
        title: course?.title || (isCa ? "CA Foundation Business Laws" : "CSEET Business Law and Management"),
        slug: isCa ? "ca-foundation-monthly" : "cseet-monthly",
        description: course?.description || "",
        price: pPrice,
        mrp: pMrp,
        duration_days: pDays,
        badge: isCa ? "MOST POPULAR" : "COMING SOON",
        is_popular: isCa,
        is_active: true,
        course_ids: [course?.id || resolvedCourseId],
      };
    }

    const dynamicPrice = matchedCourse && typeof matchedCourse.price === "number" ? matchedCourse.price : plan.price;
    const dynamicMrp = matchedCourse && typeof matchedCourse.mrp === "number" && matchedCourse.mrp > 0 ? matchedCourse.mrp : (plan.mrp || dynamicPrice * 2);
    const dynamicDuration = matchedCourse && typeof matchedCourse.accessDays === "number" && matchedCourse.accessDays > 0 ? matchedCourse.accessDays : (plan.duration_days || 30);

    res.status(200).json({
      success: true,
      subscription: {
        ...plan,
        price: dynamicPrice,
        mrp: dynamicMrp,
        duration_days: dynamicDuration,
        courses: matchedCourse ? [matchedCourse] : [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscription detail: " + err.message });
  }
});

// GET /api/extra-courses — Standalone purchasable courses (kind = extra)
router.get("/extra-courses", async (req, res) => {
  try {
    const coursesTable = Database.table("courses");
    let extras = coursesTable.find((c) => c.kind === "extra" && c.is_active !== false);

    if (isConnected()) {
      try {
        const Course = require("../models/Course");
        const mongoExtras = await Course.find({ kind: "extra", is_active: true }).lean();
        if (mongoExtras && mongoExtras.length > 0) extras = mongoExtras;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: extras.length, extraCourses: extras });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching extra courses: " + err.message });
  }
});

// GET /api/carousel-slides — Website banner & subscription slides (A1, B4)
router.get("/carousel-slides", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    const carouselTable = Database.table("carousel_slides");
    let slides = carouselTable.find((s) => (s.placement === "website" || s.placement === "homepage_top") && s.is_active !== false).sort((a, b) => (a.display_order || a.order || 0) - (b.display_order || b.order || 0));

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        const mongoSlides = await CarouselSlide.find({ is_active: true }).sort({ display_order: 1 }).lean();
        if (mongoSlides && mongoSlides.length > 0) slides = mongoSlides;
      } catch (_) {}
    }

    if (!slides || slides.length === 0) {
      slides = [
        {
          id: "slide-1",
          placement: "website",
          title: "Master CA Foundation Business Laws",
          subtitle: "Complete codified ICAI syllabus notes, high-yield visual flowcharts & daily exam-calibrated case studies.",
          image: "/assets/crop_ca_foundation_book.png",
          cta_label: "Explore CA Foundation Pass",
          cta_link: "/courses",
          badge: "MOST POPULAR • PAPER 2",
          rating: "4.9/5 Rating (1,200+ Candidates)",
          subscription_id: "sub-ca-foundation-monthly",
          display_order: 1,
          order: 1,
          is_active: true,
        },
        {
          id: "slide-2",
          placement: "website",
          title: "CSEET Business Law and Management",
          subtitle: "Interactive 3D digital codices, ICSI unit MCQs, and weekly live Google Meet doubt clearing sessions.",
          image: "/assets/ca-cs-hero-books-sharp.png",
          cta_label: "Explore CSEET Pass",
          cta_link: "/courses",
          badge: "ICSI SYLLABUS • 8 UNITS",
          rating: "100% ICSI Exam Aligned",
          subscription_id: "sub-cseet-monthly",
          display_order: 2,
          order: 2,
          is_active: true,
        },
      ];
    }

    const normalized = slides.map((s) => ({
      ...s,
      order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      display_order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      cta_link: s.cta_link || "/courses",
      image: s.image || (s.id === "slide-2" ? "/assets/ca-cs-hero-books-sharp.png" : "/assets/crop_ca_foundation_book.png"),
    }));

    res.status(200).json({ success: true, count: normalized.length, slides: normalized, data: normalized });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching carousel slides: " + err.message });
  }
});

// GET /api/offers — Active promotional offers (A5, B7)
router.get("/offers", async (req, res) => {
  try {
    const offersTable = Database.table("offers");
    const now = new Date();
    let offers = offersTable.find((o) => {
      if (o.is_active === false) return false;
      if (o.valid_to && new Date(o.valid_to) < now) return false;
      return true;
    }).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    if (isConnected()) {
      try {
        const Offer = require("../models/Offer");
        const mongoOffers = await Offer.find({ is_active: true, $or: [{ valid_to: { $gte: now } }, { valid_to: null }] }).sort({ display_order: 1 }).lean();
        if (mongoOffers && mongoOffers.length > 0) offers = mongoOffers;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching offers: " + err.message });
  }
});

// GET /api/case-studies — Published legal case studies (A6, B8)
router.get("/case-studies", async (req, res) => {
  try {
    const forDashboard = req.query.dashboard === "true";
    const caseStudiesTable = Database.table("case_studies");
    let caseStudies = caseStudiesTable.find((c) => {
      if (c.is_published === false) return false;
      if (forDashboard) return c.show_on_dashboard !== false;
      return c.show_on_website !== false;
    });

    if (isConnected()) {
      try {
        const CaseStudy = require("../models/CaseStudy");
        const filter = { is_published: true };
        if (forDashboard) filter.show_on_dashboard = true;
        else filter.show_on_website = true;
        const mongoCases = await CaseStudy.find(filter).lean();
        if (mongoCases && mongoCases.length > 0) caseStudies = mongoCases;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: caseStudies.length, caseStudies });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching case studies: " + err.message });
  }
});

// GET /api/case-studies/:slug — Single case study detail
router.get("/case-studies/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const caseStudiesTable = Database.table("case_studies");
    let caseStudy = caseStudiesTable.findOne((c) => (c.slug === slug || c.id === slug) && c.is_published !== false);

    if (!caseStudy && isConnected()) {
      try {
        const CaseStudy = require("../models/CaseStudy");
        caseStudy = await CaseStudy.findOne({ $or: [{ slug }, { id: slug }], is_published: true }).lean();
      } catch (_) {}
    }

    if (!caseStudy) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }

    res.status(200).json({ success: true, caseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching case study: " + err.message });
  }
});

// GET /api/settings/public — Public site settings (footer, about, contact) (A4)
router.get("/settings/public", async (req, res) => {
  try {
    const settingsTable = Database.table("site_settings");
    const footerSetting = settingsTable.findOne((s) => s.key === "footer_details");
    const socialsSetting = settingsTable.findOne((s) => s.key === "social_links");
    const aboutSetting = settingsTable.findOne((s) => s.key === "about_us");

    res.status(200).json({
      success: true,
      footer: footerSetting ? footerSetting.value : null,
      socials: socialsSetting ? socialsSetting.value : null,
      about: aboutSetting ? aboutSetting.value : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching public settings: " + err.message });
  }
});

// Rate Limiter: Coupon Brute-Force Protection (Max 30 attempts per minute per IP)
const couponRateLimitMap = new Map();
const COUPON_WINDOW_MS = 60 * 1000;
const MAX_COUPON_ATTEMPTS = process.env.NODE_ENV === "test" ? 500 : 30;

function couponRateLimiter(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
  const now = Date.now();
  const entry = couponRateLimitMap.get(ip) || { count: 0, resetAt: now + COUPON_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + COUPON_WINDOW_MS;
  } else {
    entry.count += 1;
  }
  couponRateLimitMap.set(ip, entry);

  if (entry.count > MAX_COUPON_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many coupon validation attempts. Please slow down and try again in 1 minute.",
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    });
  }
  next();
}

// POST /api/coupons/validate — Server-side coupon validator (§10.1)
router.post("/coupons/validate", couponRateLimiter, async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const orderSubtotal = Number(subtotal) || 0;
    const couponsTable = Database.table("coupons");
    let coupon = couponsTable.findOne((c) => c.code === cleanCode && c.is_active !== false);

    if (!coupon && isConnected()) {
      try {
        const Coupon = require("../models/Coupon");
        coupon = await Coupon.findOne({ code: cleanCode, is_active: true }).lean();
      } catch (_) {}
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code." });
    }

    // Date range check
    const now = new Date();
    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return res.status(400).json({ success: false, message: "This coupon has expired." });
    }

    // Min order check
    if (coupon.min_order && orderSubtotal < coupon.min_order) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order} required to use this coupon.`,
      });
    }

    // Usage limit check
    if (coupon.usage_limit && (coupon.used_count || coupon.usedCount || 0) >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached." });
    }

    // Calculate discount on server
    let discount = 0;
    const discountType = coupon.discount_type || "percent";
    const discountVal = Number(coupon.value || coupon.discountPercent || 0);

    if (discountType === "percent") {
      discount = Math.round((orderSubtotal * discountVal) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = Math.min(discountVal, orderSubtotal);
    }

    res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      discount_type: discountType,
      value: discountVal,
      discount,
      final_total: Math.max(0, orderSubtotal - discount),
      coupon_id: coupon.id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error validating coupon: " + err.message,
    });
  }
});

// GET /api/public/site-settings — Read-only public site details (support email, watermark, whatsapp)
router.get("/public/site-settings", async (req, res) => {
  try {
    let siteDetails = {
      support_email: "support@thelawkaksha.com",
      domain: "https://thelawkaksha.com",
      watermark_text: "THE LAW KAKSHA • PROTECTED STUDY MATERIAL",
      whatsapp_number: "", // Hidden if empty
      site_title: "The Law Kaksha",
    };

    if (isConnected()) {
      const doc = await SiteSetting.findOne({ key: "site_details" }).lean();
      if (doc && doc.value) siteDetails = { ...siteDetails, ...doc.value };
    } else {
      const settingsTable = Database.table("site_settings");
      const record = settingsTable.findOne((s) => s.key === "site_details");
      if (record && record.value) siteDetails = { ...siteDetails, ...record.value };
    }

    res.status(200).json({
      success: true,
      source: isConnected() ? "mongodb_atlas" : "local_cache",
      site_details: siteDetails,
      whatsapp_number: siteDetails.whatsapp_number || "",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching site settings: " + err.message });
  }
});

module.exports = router;
