/**
 * The Law Kaksha - Express Backend API Server
 * CA Foundation Business Laws + CSEET Business Law & Management
 * Subscription-based platform at Rs. 99/month
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
const contentRoutes = require("./routes/contentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const orderRoutes = require("./routes/orderRoutes");
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
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", contentRoutes);
app.use("/api", quizRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  const usersTable = Database.table("users");
  const coursesTable = Database.table("courses");
  const actsTable = Database.table("acts");

  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "The Law Kaksha API Server",
    database: {
      usersCount: usersTable.count(),
      coursesCount: coursesTable.count(),
      actsCount: actsTable.count(),
    },
  });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    brand: "THE LAW KAKSHA",
    message: "Welcome to The Law Kaksha API Server — CA Foundation & CSEET Platform",
    healthCheck: "/api/health",
    courses: "/api/courses",
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
