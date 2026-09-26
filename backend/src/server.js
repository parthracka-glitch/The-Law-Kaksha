/**
 * The Law Kaksha - Express Backend API Server
 * Modular Architecture with Relational Persistent Storage, Authentication, and DRM Protection
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Ensure Database & Seeder are initialized
const Database = require("./db/database");
const seed = require("./db/seed");

// Run seeder once on server startup
seed();

// Import Routers
const authRoutes = require("./routes/authRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contentRoutes = require("./routes/contentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
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
      return callback(null, true); // Permissive for local development
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// -----------------------------------------------------------------------------
// Mount Modular API Routes
// -----------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", orderRoutes);
app.use("/api", contentRoutes);
app.use("/api/admin", adminRoutes);

// -----------------------------------------------------------------------------
// Legacy & Health Routes (Ensures Zero Regression for Existing Clients)
// -----------------------------------------------------------------------------

// Health Check for Render & Monitoring
app.get("/api/health", (req, res) => {
  const usersTable = Database.table("users");
  const productsTable = Database.table("products");
  const ordersTable = Database.table("orders");

  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "The Law Kaksha API Server",
    database: {
      usersCount: usersTable.count(),
      productsCount: productsTable.count(),
      ordersCount: ordersTable.count(),
    },
  });
});

// Legacy /api/students endpoint (Backward compatible)
app.get("/api/students", (req, res) => {
  const usersTable = Database.table("users");
  const enrollmentsTable = Database.table("enrollments");
  const students = usersTable.find((u) => u.role === "student").map((s) => {
    const { password_hash, ...safe } = s;
    const activeEnrollments = enrollmentsTable
      .find((e) => e.user_id === s.id && e.access_status === "ACTIVE")
      .map((e) => e.product_id);
    return {
      ...safe,
      rollNo: s.student_id,
      unlockedItemIds: activeEnrollments,
    };
  });
  res.status(200).json({ success: true, count: students.length, students });
});

// Legacy /api/students/profile endpoint
app.get("/api/students/profile", (req, res) => {
  const { name, email } = req.query;
  const usersTable = Database.table("users");
  const enrollmentsTable = Database.table("enrollments");

  let student = null;
  if (email) {
    student = usersTable.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
  } else if (name) {
    student = usersTable.findOne((u) => u.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (!student) {
    student = usersTable.findOne((u) => u.role === "student");
  }

  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  const { password_hash, ...safeStudent } = student;
  const activeEnrollments = enrollmentsTable
    .find((e) => e.user_id === student.id && e.access_status === "ACTIVE")
    .map((e) => e.product_id);

  res.status(200).json({
    success: true,
    student: {
      ...safeStudent,
      rollNo: student.student_id,
      unlockedItemIds: activeEnrollments,
    },
  });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    brand: "THE LAW KAKSHA",
    message: "Welcome to The Law Kaksha API Server",
    healthCheck: "/api/health",
    catalog: "/api/catalog",
    orders: "/api/orders/my-orders",
    students: "/api/students",
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[The Law Kaksha] API Server running on port ${PORT}`);
    console.log(`[The Law Kaksha] Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
