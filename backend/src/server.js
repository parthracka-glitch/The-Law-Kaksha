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

// OWASP A02: Disable X-Powered-By
app.disable("x-powered-by");

// OWASP A02: Production Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  next();
});

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

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// OWASP A05: NoSQL / Mongo Operator Injection Sanitizer
function sanitizePayload(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitizePayload(obj[key]);
    }
  }
}
app.use((req, res, next) => {
  if (req.body) sanitizePayload(req.body);
  if (req.query) sanitizePayload(req.query);
  if (req.params) sanitizePayload(req.params);
  next();
});

// OWASP A07: In-Memory Sliding-Window Rate Limiter for Authentication
const authRateLimitMap = new Map();
const AUTH_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_AUTH_REQUESTS = 60; // 60 requests per minute per IP
app.use("/api/auth", (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
  const now = Date.now();
  const entry = authRateLimitMap.get(ip) || { count: 0, resetAt: now + AUTH_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + AUTH_WINDOW_MS;
  } else {
    entry.count += 1;
  }
  authRateLimitMap.set(ip, entry);

  if (entry.count > MAX_AUTH_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Too many authentication attempts. Please slow down and try again in 1 minute.",
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    });
  }
  next();
});

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", contentRoutes);
app.use("/api", quizRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);
app.use("/api/student", studentRoutes);

// Kubernetes / Render Liveness & Readiness Probes
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/readyz", (req, res) => {
  const ready = isConnected() || Database.table("users").count() > 0;
  if (ready) {
    return res.status(200).json({ status: "ready", mongoConnected: isConnected() });
  }
  return res.status(503).json({ status: "not_ready", message: "Database engine not initialized" });
});

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

// Centralized Global Error Handler (OWASP A10 & A02: Prevents stack trace leak)
app.use((err, req, res, next) => {
  console.error("[The Law Kaksha API Error]", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error. Please try again later." : err.message,
    referenceCode: Date.now().toString(36).toUpperCase(),
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[The Law Kaksha] API Server running on port ${PORT}`);
    console.log(`[The Law Kaksha] Health check: http://127.0.0.1:${PORT}/api/health`);
  });
}

module.exports = app;
