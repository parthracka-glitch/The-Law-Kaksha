/**
 * The Law Kaksha - Express Backend API Server
 * Designed for direct deployment on Render.com & local development
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl) or matching origins
      if (!origin) return callback(null, true);
      const allowedPatterns = [
        /^http:\/\/localhost:\d+$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/the-law-kaksha.*$/,
      ];
      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin)) || origin === FRONTEND_URL;
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for initial setup
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// -----------------------------------------------------------------------------
// In-Memory Data Store (Can be easily hooked to MongoDB / PostgreSQL)
// -----------------------------------------------------------------------------

const CATALOG_ITEMS = [
  {
    id: "book-vol-1",
    type: "book",
    title: "Volume 1: CA Corporate Law Master Codex (2026-2027)",
    subtitle: "Companies Act 2013 (Sections 1 to 148) with full Bare Act synthesis.",
    pagesOrDuration: "540 Pages",
    price: 399,
    originalPrice: 699,
    badge: "Primary Textbook",
    category: "CA Intermediate & Final",
    description: "Complete line-by-line coverage of Companies Act 2013 with 45+ ROC circulars and past 10 attempts solved questions.",
    highlights: ["Complete Sections 1 to 148", "ROC Circulars & Notifications", "ICAI Model Solved Questions"],
  },
  {
    id: "book-vol-2",
    type: "book",
    title: "Volume 2: Economic & Other Business Laws Codex",
    subtitle: "General Clauses Act, Interpretation of Statutes & Foreign Contribution (FCRA).",
    pagesOrDuration: "480 Pages",
    price: 349,
    originalPrice: 599,
    badge: "High-Yield Notes",
    category: "CA Intermediate Paper 2",
    description: "Master statutory interpretation rules, General Clauses Act presumption principles, and FCRA regulations.",
    highlights: ["General Clauses Act deep-dive", "Interpretation of Statutes rules", "Past exam descriptive answers"],
  },
  {
    id: "book-mcq",
    type: "mcq",
    title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
    subtitle: "Mandatory 30-mark section with detailed reasoning for each option.",
    pagesOrDuration: "260 Pages",
    price: 249,
    originalPrice: 449,
    badge: "Practice Drill",
    category: "Practice Question Bank",
    description: "Practice chapter-wise ICAI case scenarios, negative marking prevention drills, and MCA amendment MCQs.",
    highlights: ["1,200+ ICAI curated MCQs", "Reasoning for all 4 options", "30-Mark Integrated Case Studies"],
  },
  {
    id: "book-ldr",
    type: "book",
    title: "1.5-Day Last Day Revision (LDR) Section Maps",
    subtitle: "Summary Flowcharts, Limit Tables & Penalty Code Tables for the last 36 hours.",
    pagesOrDuration: "180 Pages",
    price: 199,
    originalPrice: 349,
    badge: "Quick Revision",
    category: "CA Exam Eve Maps",
    description: "Ultra-condensed visual flowcharts and penalty summary tables designed specifically for the final 36 hours.",
    highlights: ["Penalty code tables", "Time limit summary charts", "1.5-day exam eve checklist"],
  },
  {
    id: "video-classes",
    type: "video",
    title: "HD Video Masterclasses: Full Law Lecture Series",
    subtitle: "32 in-depth chapter masterclasses with timestamped notes and faculty drafting rubrics.",
    pagesOrDuration: "45+ Hours",
    price: 999,
    originalPrice: 1899,
    badge: "Video Course",
    category: "CA Foundation & Inter",
    description: "Detailed video breakdown of tricky corporate law sections with practical boardroom case studies.",
    highlights: ["32 chapter masterclasses", "Timestamped digital notes", "Faculty drafting rubrics & 1.25x/1.5x player"],
  },
  {
    id: "mains-evaluation",
    type: "evaluation",
    title: "1-on-1 Descriptive Test Series & Copy Checking Desk",
    subtitle: "Submit your handwritten answer sheets for 5-pillar faculty grading and audio feedback.",
    pagesOrDuration: "8 Full Papers",
    price: 699,
    originalPrice: 1299,
    badge: "Copy Checking",
    category: "CA Mains Evaluation",
    description: "Get detailed line-by-line checking of your law descriptive papers within 48 hours to boost scores to 70+.",
    highlights: ["8 full ICAI model test papers", "5-pillar rubric grading", "Detailed audio feedback from CA faculty"],
  },
];

let ORDERS = [
  {
    id: "LK-ORD-9821",
    customer: "Rohan Deshmukh",
    phone: "+91 98765 43210",
    item: "Volume 1: CA Corporate Law Master Codex (2026-2027) (PDF)",
    state: "Maharashtra",
    address: "Flat 402, ICAI Bhawan Road, Nariman Point, Mumbai - 400021",
    pincode: "400021",
    amount: "₹399",
    date: "Today, 10:30 AM",
    status: "Processing",
    tracking: "INSTANT-DRM-VAULT",
    courier: "Instant Student Vault",
  },
  {
    id: "LK-ORD-9820",
    customer: "Ayushi Singhania",
    phone: "+91 98111 22334",
    item: "CA Business Law Main Notes Subscription",
    state: "Delhi NCR",
    address: "Plot 12, Vikas Marg, Laxmi Nagar, East Delhi - 110092",
    pincode: "110092",
    amount: "₹1,999",
    date: "Today, 09:15 AM",
    status: "Delivered",
    tracking: "INSTANT-DRM-VAULT",
    courier: "CA Student Portal Stream",
  },
];

let STUDENTS = [
  {
    id: "LK-STU-101",
    rollNo: "CRO-0689421",
    name: "Rohan Deshmukh",
    email: "rohan.deshmukh@gmail.com",
    phone: "+91 98765 43210",
    plan: "Volume 1 Codex + MCQ Bank",
    exam: "CA Intermediate Paper 2 (Nov'26)",
    enrolledOn: "Today",
    device: "Windows 11 Laptop (Chrome)",
    deviceStatus: "Active on Device",
    unlockedItemIds: ["book-vol-1", "book-mcq"],
    streakDays: 14,
  },
];

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

// 1. Health Check for Render Probes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "The Law Kaksha API Server (Render)",
  });
});

// 2. Catalog Routes
app.get("/api/catalog", (req, res) => {
  res.status(200).json({ success: true, count: CATALOG_ITEMS.length, items: CATALOG_ITEMS });
});

app.get("/api/catalog/:id", (req, res) => {
  const item = CATALOG_ITEMS.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }
  res.status(200).json({ success: true, item });
});

// 3. Orders Routes
app.get("/api/orders", (req, res) => {
  res.status(200).json({ success: true, count: ORDERS.length, orders: ORDERS });
});

app.post("/api/orders", (req, res) => {
  const { items, studentName, email, phone, totalAmount, state, address, pincode } = req.body;

  if (!items || !studentName) {
    return res.status(400).json({ success: false, message: "Missing required order data" });
  }

  const orderId = `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    id: orderId,
    customer: studentName,
    phone: phone || "+91 98765 43210",
    item: items.map((i) => `${i.title} (${(i.format || "pdf").toUpperCase()})`).join(", "),
    state: state || "Maharashtra",
    address: address || "Instant Student DRM Vault Delivery",
    pincode: pincode || "400001",
    amount: `₹${totalAmount}`,
    date: "Just now",
    status: "Processing",
    tracking: "INSTANT-DRM-VAULT",
    courier: "Instant Student Vault",
  };

  ORDERS.unshift(newOrder);

  // Update or insert student
  const existingStudent = STUDENTS.find((s) => s.name.toLowerCase() === studentName.toLowerCase());
  const unlockedIds = items.map((i) => i.id);

  if (existingStudent) {
    existingStudent.unlockedItemIds = Array.from(
      new Set([...existingStudent.unlockedItemIds, ...unlockedIds])
    );
  } else {
    STUDENTS.unshift({
      id: `LK-STU-${Math.floor(100 + Math.random() * 900)}`,
      rollNo: `CRO-${Math.floor(100000 + Math.random() * 900000)}`,
      name: studentName,
      email: email || "student@gmail.com",
      phone: phone || "+91 98765 43210",
      plan: newOrder.item,
      exam: "CA Intermediate Paper 2",
      enrolledOn: "Just now",
      device: "Browser Session",
      deviceStatus: "Active on Device",
      unlockedItemIds: unlockedIds,
      streakDays: 1,
    });
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: newOrder,
    unlockedItemIds: unlockedIds,
  });
});

// 4. Students & Subscriptions Routes
app.get("/api/students", (req, res) => {
  res.status(200).json({ success: true, count: STUDENTS.length, students: STUDENTS });
});

app.get("/api/students/profile", (req, res) => {
  const { name } = req.query;
  const student = STUDENTS.find((s) => s.name.toLowerCase() === (name || "rohan deshmukh").toLowerCase()) || STUDENTS[0];
  res.status(200).json({ success: true, student });
});

// 5. Payment Simulation & Verification
app.post("/api/payments/create-order", (req, res) => {
  const { amount } = req.body;
  const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 15)}`;
  res.status(200).json({
    success: true,
    orderId: razorpayOrderId,
    amount: amount || 399,
    currency: "INR",
  });
});

app.post("/api/payments/verify", (req, res) => {
  const { paymentId, orderId } = req.body;
  res.status(200).json({
    success: true,
    status: "captured",
    transactionId: paymentId || `pay_${Date.now()}`,
    orderId: orderId,
  });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to The Law Kaksha API Server",
    healthCheck: "/api/health",
    catalog: "/api/catalog",
    orders: "/api/orders",
    students: "/api/students",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[The Law Kaksha] API Server running on port ${PORT}`);
  console.log(`[The Law Kaksha] Health check: http://localhost:${PORT}/api/health`);
});
