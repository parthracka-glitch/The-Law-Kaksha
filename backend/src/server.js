/**
 * The Law Kaksha - Express Backend API Server
 * CA Foundation Business Laws + CSEET Business Law & Management
 * Connected to MongoDB Atlas Cluster0 with Local Fault-Tolerant Fallback
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Ensure Database & Mongo Connection
const Database = require("./db/database");
const seedLocal = require("./db/seed");
const { connectMongo, isConnected } = require("./db/mongo");
const seedMongo = require("./db/mongoSeed");

// Run local seeder
seedLocal();

// Connect to MongoDB Atlas in background and seed
connectMongo().then(() => {
  seedMongo();
}).catch((err) => {
  console.warn("[MongoDB] Startup connection error:", err.message);
});

// Import Routers
const authRoutes = require("./routes/authRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const contentRoutes = require("./routes/contentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

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
app.use("/api/student", studentRoutes);

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
      type: "MongoDB Atlas Cluster0",
      mongoConnected: isConnected(),
      localFallbackUsersCount: usersTable.count(),
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
    database: isConnected() ? "Connected to MongoDB Atlas" : "Local Cache",
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
