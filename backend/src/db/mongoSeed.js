/**
 * The Law Kaksha - MongoDB Atlas Seeder & Synchronizer
 * Prepopulates MongoDB Atlas with production curriculum, products, sample cases, and admin credentials
 */

const bcrypt = require("bcryptjs");
const Product = require("../models/Product");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const Coupon = require("../models/Coupon");
const SiteSetting = require("../models/SiteSetting");

const INITIAL_PRODUCTS = [
  {
    id: "prod-vol1",
    title: "Volume 1: Business Law (CA Foundation & CSEET)",
    subtitle: "Complete Statutory Codex with In-Web DRM Reader Access",
    category: "Both",
    format: "Digital Codex (In-Web DRM)",
    price: 249,
    originalPrice: 499,
    pages: "180+ Pages",
    status: "Active",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
    description: "Full statutory codex covering Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, Limited Liability Partnership Act 2008, and Companies Act 2013.",
    units: ["Indian Contract Act", "Sale of Goods Act", "Indian Partnership Act", "LLP Act", "Companies Act"],
    highlights: ["In-Web DRM Protected Reading", "Section Flowcharts & Landmark Rulings", "Weekly Case Study Alignment", "Exam Drafting Answer Templates"],
    cover_image: "/assets/ca-cs-hero-books-v2.png",
  },
  {
    id: "prod-vol2",
    title: "Volume 2: Business Law & Management (CSEET)",
    subtitle: "Principles of Management, Ethics & Business Environment",
    category: "CSEET",
    format: "Digital Codex (In-Web DRM)",
    price: 249,
    originalPrice: 499,
    pages: "120+ Pages",
    status: "Active",
    pdfUrl: "/api/pdf/cseet-management-full.pdf",
    description: "In-depth study codex for General Principles of Management (Henri Fayol & FW Taylor) and Business Environment & Corporate Ethics (PESTLE & CSR).",
    units: ["General Principles of Management", "Business Environment & Ethics"],
    highlights: ["Complete Fayol & Taylor Principles", "Corporate Governance Frameworks", "Chapter-Wise Conceptual MCQs", "Memory Maps for Rapid Revision"],
    cover_image: "/assets/ca-cs-hero-books-v2.png",
  },
  {
    id: "prod-combo",
    title: "Complete 2-Volume Master Digital Access Pass",
    subtitle: "Volume 1 & 2 Full Study Codices + In-Web DRM Reader Access",
    category: "Both",
    format: "Complete Access Pass",
    price: 449,
    originalPrice: 899,
    pages: "300+ Pages",
    status: "Active",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
    description: "All 8 statutory law acts + management theories + case studies & MCQ evaluation tests with instant in-web reader access.",
    units: ["All 8 Units • CA Foundation & CSEET"],
    highlights: ["Full DRM Reading Access for Both Volumes", "Weekly Real Case Study Vault Access", "CSEET 30-Question Live MCQ Simulator", "Direct Mentor Answer Evaluation Support"],
    cover_image: "/assets/ca-cs-hero-books-v2.png",
  },
];

const INITIAL_CASES = [
  {
    id: "case-monday",
    day: "Monster Monday",
    badge: "Contract Act 1872",
    subject: "Indian Contract Act",
    title: "Carlill v. Carbolic Smoke Ball Co. — Unilateral Offer & Performance",
    scenario: "Carbolic Smoke Ball Co. advertised that it would pay £100 to anyone who contracted influenza after using its carbolic smoke ball three times daily for two weeks according to printed directions. It deposited £1,000 in the Alliance Bank to show sincerity. Mrs. Carlill used the ball as directed and still caught influenza. The company refused payment claiming no direct notification of acceptance was communicated.",
    modelAnswer: "An offer made to the public at large (General Offer) can be accepted by anyone fulfilling its conditions without notifying acceptance in advance (Section 8 of Indian Contract Act 1872). Depositing money evidenced an intention to create legal relations. Mrs. Carlill performed the conditions, constituting valid acceptance by conduct. The company is bound and liable to pay £100.",
    precedent: "Carlill v. Carbolic Smoke Ball Co. [1893] 1 QB 256; Section 8, ICA 1872",
    marks: "6 Marks",
  },
  {
    id: "case-wednesday",
    day: "Wednesday Workout",
    badge: "Sale of Goods Act 1930",
    subject: "Sale of Goods Act",
    title: "Grant v. Australian Knitting Mills — Implied Condition as to Merchantable Quality",
    scenario: "Buyer purchased woollen underwear from a retailer. The manufacturer left excess bisulphite chemicals in the garments during processing. Buyer wore them without washing and developed severe acute dermatitis. Retailer and manufacturer argue that the buyer failed to inspect the goods prior to wearing.",
    modelAnswer: "Under Section 16(2) of the Sale of Goods Act 1930, goods sold by description carry an implied condition that they are of merchantable quality. Latent chemical defects not discoverable by ordinary visual examination breach merchantability. The manufacturer also owes an independent duty of care in tort under Donoghue v. Stevenson. Both are liable in damages.",
    precedent: "Grant v. Australian Knitting Mills [1936] AC 85; Section 16(2), SOGA 1930",
    marks: "6 Marks",
  },
  {
    id: "case-friday",
    day: "Final Boss Friday",
    badge: "Partnership Act 1932",
    subject: "Indian Partnership Act",
    title: "Implied Authority & Non-Registration Consequences (Section 19 & 69)",
    scenario: "A, B, and C are partners in an unregistered firm 'Alpha Traders' carrying on wholesale cloth business. The partnership deed contains a clause restricting any partner from borrowing over ₹50,000 without unanimous consent. A borrows ₹2,00,000 from D in the firm's name for purchasing silk fabrics, telling D it is for the firm. D was unaware of the restriction. A absconds with the money. D sues B and C. B and C contend: (1) A exceeded authority, and (2) D cannot sue because the firm is unregistered.",
    modelAnswer: "1. Cloth trading is a commercial business where borrowing is an implied authority under Section 19(1). Under Section 20, internal restrictions do not bind innocent third parties without notice. 2. Section 69 bars suits BY an unregistered firm, but DOES NOT bar suits against the unregistered firm by third parties. Hence, B and C are jointly and severally liable to pay ₹2,00,000 to D.",
    precedent: "Cox v. Hickman (1860); Sections 19, 20 & 69, Indian Partnership Act 1932",
    marks: "6 Marks",
  },
];

const INITIAL_MCQS = [
  {
    id: "mcq-1",
    subject: "Indian Contract Act",
    section: "Section 2(h)",
    question: "An agreement enforceable by law is defined as a contract under which section of the Indian Contract Act, 1872?",
    options: ["Section 2(h)", "Section 2(e)", "Section 10", "Section 2(b)"],
    correctOption: 0,
    explanation: "Section 2(h) states: 'An agreement enforceable by law is a contract.'",
  },
  {
    id: "mcq-2",
    subject: "Sale of Goods Act",
    section: "Section 4(3)",
    question: "In a contract of sale of goods, when the transfer of property is to take place at a future time or subject to some condition, it is called:",
    options: ["Sale", "Agreement to sell", "Hire-Purchase", "Bailment"],
    correctOption: 1,
    explanation: "Under Section 4(3) of SOGA 1930, when the property in goods is to be transferred at a future time, the contract is an Agreement to Sell.",
  },
  {
    id: "mcq-3",
    subject: "Indian Partnership Act",
    section: "Section 6",
    question: "The conclusive test of a partnership under the landmark ruling Cox v. Hickman and Section 6 is:",
    options: ["Sharing of profits", "Joint ownership of property", "Mutual agency", "Written partnership deed"],
    correctOption: 2,
    explanation: "Mutual agency (each partner acting as principal and agent for all others) is the cardinal conclusive test of partnership.",
  },
  {
    id: "mcq-4",
    subject: "Management Principles",
    section: "Henri Fayol",
    question: "Who propounded the 14 Principles of Modern Operational Management?",
    options: ["F.W. Taylor", "Henri Fayol", "Max Weber", "Elton Mayo"],
    correctOption: 1,
    explanation: "Henri Fayol is celebrated as the Father of Modern Management Theory and formulated the 14 Administrative Principles.",
  },
  {
    id: "mcq-5",
    subject: "Companies Act 2013",
    section: "Section 2(68)",
    question: "What is the minimum paid-up share capital requirement for incorporating a Private Limited Company under Companies Act 2013?",
    options: ["Rs. 1,00,000", "Rs. 5,00,000", "No minimum paid-up capital prescribed", "Rs. 10,00,000"],
    correctOption: 2,
    explanation: "The Companies (Amendment) Act 2015 removed the minimum paid-up capital requirement of Rs. 1 Lakh for Private Companies.",
  },
];

const INITIAL_COUPONS = [
  { id: "cp-1", code: "EXEMPTION2026", discountPercent: 20, minOrder: 200, maxUses: 500, usedCount: 142, expiryDate: "2026-12-31", status: "Active" },
  { id: "cp-2", code: "FIRST50", discountPercent: 15, minOrder: 150, maxUses: 100, usedCount: 88, expiryDate: "2026-11-30", status: "Active" },
  { id: "cp-3", code: "RANKERS", discountPercent: 25, minOrder: 400, maxUses: 50, usedCount: 47, expiryDate: "2026-10-31", status: "Active" },
];

async function seedMongo() {
  try {
    console.log("[MongoDB Atlas Seeder] Synchronizing collections...");

    // 1. Products
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      console.log("[MongoDB Atlas Seeder] Seeding initial study codices & products...");
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log("[MongoDB Atlas Seeder] Products seeded successfully.");
    }

    // 2. Cases
    const caseCount = await WeeklyCase.countDocuments();
    if (caseCount === 0) {
      console.log("[MongoDB Atlas Seeder] Seeding weekly case studies...");
      await WeeklyCase.insertMany(INITIAL_CASES);
      console.log("[MongoDB Atlas Seeder] Cases seeded successfully.");
    }

    // 3. MCQs
    const mcqCount = await McqQuestion.countDocuments();
    if (mcqCount === 0) {
      console.log("[MongoDB Atlas Seeder] Seeding MCQ question bank...");
      await McqQuestion.insertMany(INITIAL_MCQS);
      console.log("[MongoDB Atlas Seeder] MCQs seeded successfully.");
    }

    // 4. Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log("[MongoDB Atlas Seeder] Seeding promotional coupons...");
      await Coupon.insertMany(INITIAL_COUPONS);
      console.log("[MongoDB Atlas Seeder] Coupons seeded successfully.");
    }

    // 5. Administrator User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("[MongoDB Atlas Seeder] Seeding default administrator account...");
      const adminPasswordHash = await bcrypt.hash("AdminSecurePassword2026!", 10);

      await User.create([
        {
          id: "usr-admin-001",
          student_id: "LK-ADM-000001",
          name: "The Law Kaksha Admin",
          email: "admin@thelawkaksha.com",
          phone: "+91 99999 88888",
          password_hash: adminPasswordHash,
          role: "admin",
          is_active: true,
          drm_access: true,
        },
      ]);

      console.log("[MongoDB Atlas Seeder] Administrator seeded successfully.");
    }

    // 6. Site Settings (Exam countdowns & QOTD)
    const examSetting = await SiteSetting.findOne({ key: "exam_countdown" });
    if (!examSetting) {
      await SiteSetting.create({
        key: "exam_countdown",
        value: [
          { id: "ex-1", exam: "CSEET Paper 2 (Business Law & Management)", date: "2026-11-12", session: "November 2026 Attempt" },
          { id: "ex-2", exam: "CA Foundation Paper 2 (Business Laws)", date: "2026-12-20", session: "December 2026 Attempt" },
        ],
      });
    }

    const qotdSetting = await SiteSetting.findOne({ key: "qotd" });
    if (!qotdSetting) {
      await SiteSetting.create({
        key: "qotd",
        value: {
          id: "qotd-1",
          act: "Indian Partnership Act, 1932",
          section: "Section 28",
          question: "When a retired partner's name is retained on the letterhead without public notice, third parties can sue under:",
          options: ["Doctrine of Subrogation", "Doctrine of Holding Out", "Doctrine of Ultra Vires", "Doctrine of Estoppel in Pais"],
          correctOption: 1,
          explanation: "Under Section 28 of the Indian Partnership Act 1932, anyone who represents or allows himself to be represented as a partner is liable as a partner by Holding Out.",
        },
      });
    }

    console.log("[MongoDB Atlas Seeder] Synchronization completed successfully.");
  } catch (err) {
    console.error("[MongoDB Atlas Seeder] Error during seed:", err);
  }
}

module.exports = seedMongo;
