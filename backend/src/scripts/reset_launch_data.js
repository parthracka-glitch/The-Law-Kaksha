/**
 * Launch data reset.
 *
 * Default is a read-only dry run. Pass --apply to mutate data.
 *
 * Usage:
 *   node src/scripts/reset_launch_data.js
 *   node src/scripts/reset_launch_data.js --apply
 *   node src/scripts/reset_launch_data.js --apply --delete-students --reset-curriculum
 *   node src/scripts/reset_launch_data.js --apply --delete-cloudinary --delete-local-uploads
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const Database = require("../db/database");
const { connectMongo, isConnected, mongoose } = require("../db/mongo");
const { cloudinary, isCloudinaryConfigured } = require("../utils/cloudinary");

const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const Resource = require("../models/Resource");
const ContentItem = require("../models/ContentItem");
const Product = require("../models/Product");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const McqTest = require("../models/McqTest");
const CarouselSlide = require("../models/CarouselSlide");
const CaseStudy = require("../models/CaseStudy");
const Coupon = require("../models/Coupon");
const Offer = require("../models/Offer");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Entitlement = require("../models/Entitlement");
const Referral = require("../models/Referral");
const UserStats = require("../models/UserStats");
const SupportTicket = require("../models/SupportTicket");
const Expense = require("../models/Expense");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const DELETE_STUDENTS = args.has("--delete-students");
const RESET_CURRICULUM = args.has("--reset-curriculum");
const DELETE_CLOUDINARY = args.has("--delete-cloudinary");
const DELETE_LOCAL_UPLOADS = args.has("--delete-local-uploads");

const CLEAR_MODELS = [
  ["resources", Resource],
  ["content_items", ContentItem],
  ["products", Product],
  ["weekly_cases", WeeklyCase],
  ["mcq_questions", McqQuestion],
  ["mcq_tests", McqTest],
  ["carousel_slides", CarouselSlide],
  ["case_studies", CaseStudy],
  ["coupons", Coupon],
  ["offers", Offer],
  ["orders", Order],
  ["payments", Payment],
  ["subscriptions", Subscription],
  ["entitlements", Entitlement],
  ["referrals", Referral],
  ["user_stats", UserStats],
  ["support_tickets", SupportTicket],
  ["expenses", Expense],
  ["audit_logs", AuditLog],
];

const CLEAR_LOCAL_TABLES = [
  "resources",
  "content",
  "content_items",
  "products",
  "weekly_content",
  "quizzes",
  "enrollments",
  "reviews",
  "carousel_slides",
  "offers",
  "case_studies",
  "coupons",
  "coupon_redemptions",
  "cart_items",
  "orders",
  "order_items",
  "payments",
  "subscriptions",
  "subscription_courses",
  "entitlements",
  "live_sessions",
  "expenses",
  "user_stats",
  "xp_events",
  "referrals",
  "audit_logs",
  "support_tickets",
];

function log(message) {
  console.log(`${APPLY ? "[apply]" : "[dry-run]"} ${message}`);
}

async function clearMongo() {
  if (!isConnected()) {
    console.log("[mongo] not connected; skipping Atlas collections.");
    return;
  }

  for (const [label, Model] of CLEAR_MODELS) {
    const count = await Model.countDocuments();
    if (APPLY) await Model.deleteMany({});
    log(`mongo ${label}: ${count}`);
  }

  if (RESET_CURRICULUM) {
    for (const [label, Model] of [
      ["courses", Course],
      ["acts", Act],
      ["units", Unit],
    ]) {
      const count = await Model.countDocuments();
      if (APPLY) await Model.deleteMany({});
      log(`mongo ${label}: ${count}`);
    }
  }

  if (DELETE_STUDENTS) {
    const count = await User.countDocuments({ role: { $ne: "admin" } });
    if (APPLY) await User.deleteMany({ role: { $ne: "admin" } });
    log(`mongo non-admin users: ${count}`);
  }
}

function clearLocal() {
  const dbFile = path.join(__dirname, "../../data/lawkaksha_db.json");
  const data = Database.getRawData();
  let changes = 0;

  for (const table of CLEAR_LOCAL_TABLES) {
    if (!Array.isArray(data[table])) continue;
    if (data[table].length > 0) changes += data[table].length;
    log(`local ${table}: ${data[table].length}`);
    data[table] = [];
  }

  if (RESET_CURRICULUM) {
    for (const table of ["courses", "acts", "units"]) {
      const count = data[table]?.length || 0;
      log(`local ${table}: ${count}`);
      data[table] = [];
    }
  }

  if (DELETE_STUDENTS) {
    const students = data.users.filter((user) => user.role !== "admin");
    log(`local non-admin users: ${students.length}`);
    data.users = data.users.filter((user) => user.role === "admin");
  }

  if (!APPLY) return;

  if (fs.existsSync(dbFile)) {
    const backup = `${dbFile}.backup-${new Date().toISOString().replace(/[:.]/g, "-")}`;
    fs.copyFileSync(dbFile, backup);
    log(`local backup: ${path.basename(backup)}`);
  }

  Database.reset(data);
  log(`local database saved (${changes} rows cleared).`);
}

async function clearCloudinary() {
  if (!DELETE_CLOUDINARY) return;
  if (!isCloudinaryConfigured()) {
    console.warn("[cloudinary] not configured; skipping asset deletion.");
    return;
  }

  for (const [prefix, resourceType] of [
    ["thelawkaksha/pdfs", "raw"],
    ["thelawkaksha/covers", "image"],
    ["thelawkaksha/resources", "auto"],
  ]) {
    try {
      if (!APPLY) {
        const listed = await cloudinary.api.resources({
          prefix,
          resource_type: resourceType,
          max_results: 100,
        });
        log(`cloudinary ${prefix} (${resourceType}): ${listed.resources?.length || 0} asset(s) found`);
        continue;
      }
      const result = await cloudinary.api.delete_resources_by_prefix(prefix, {
        resource_type: resourceType,
        invalidate: true,
      });
      const count = Object.keys(result.deleted || {}).length;
      log(`cloudinary ${prefix} (${resourceType}): ${count}`);
      await cloudinary.api.delete_folder(prefix).catch(() => null);
    } catch (err) {
      console.warn(`[cloudinary] ${prefix}: ${err.message || err.error?.message || "request failed"}`);
    }
  }
}

function clearLocalUploads() {
  if (!DELETE_LOCAL_UPLOADS) return;
  const uploadsDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsDir)) {
    log("local uploads: 0");
    return;
  }
  const files = fs.readdirSync(uploadsDir).filter((file) => fs.statSync(path.join(uploadsDir, file)).isFile());
  log(`local uploads: ${files.length}`);
  if (APPLY) {
    for (const file of files) fs.unlinkSync(path.join(uploadsDir, file));
  }
}

async function main() {
  console.log("The Law Kaksha - launch data reset");
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (no data will be changed)"}`);
  console.log(`Preserve admins: yes | Delete students: ${DELETE_STUDENTS}`);
  console.log(`Reset curriculum: ${RESET_CURRICULUM} | Cloudinary: ${DELETE_CLOUDINARY} | Local uploads: ${DELETE_LOCAL_UPLOADS}`);

  await connectMongo();
  await clearMongo();
  clearLocal();
  await clearCloudinary();
  clearLocalUploads();

  if (!APPLY) {
    console.log("\nDry run complete. Re-run with --apply to perform these changes.");
  } else {
    console.log("\nReset complete. Set DISABLE_AUTO_SEED=true before restarting the backend.");
  }

  await mongoose.disconnect().catch(() => null);
}

main().catch((err) => {
  console.error("Reset failed:", err.message);
  process.exitCode = 1;
});
