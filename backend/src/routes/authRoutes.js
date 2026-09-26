/**
 * The Law Kaksha - Authentication Routes
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("../db/database");
const { requireAuth, JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate unique student ID (e.g., LRK-2026-894210)
function generateStudentId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `LRK-${year}-${randomNum}`;
}

// 1. POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, targetExam } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const usersTable = Database.table("users");
    const existing = usersTable.findOne(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const studentId = generateStudentId();

    const newUser = usersTable.insert({
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      student_id: studentId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      password_hash: passwordHash,
      role: "student",
      target_exam: targetExam || "CA Intermediate Paper 2: Corporate & Other Laws",
      is_active: 1,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        student_id: newUser.student_id,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password_hash, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: "Student account created successfully.",
      token,
      user: safeUser,
      enrolledProductIds: [],
    });
  } catch (err) {
    console.error("[Auth] Register error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 2. POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const usersTable = Database.table("users");
    const user = usersTable.findOne(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.is_active === 0) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        student_id: user.student_id,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Fetch user enrollments
    const enrollmentsTable = Database.table("enrollments");
    const activeEnrollments = enrollmentsTable.find(
      (e) => e.user_id === user.id && e.access_status === "ACTIVE"
    );
    const enrolledProductIds = activeEnrollments.map((e) => e.product_id);

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser,
      enrolledProductIds,
    });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 3. GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  try {
    const enrollmentsTable = Database.table("enrollments");
    const activeEnrollments = enrollmentsTable.find(
      (e) => e.user_id === req.user.id && e.access_status === "ACTIVE"
    );
    const enrolledProductIds = activeEnrollments.map((e) => e.product_id);

    return res.status(200).json({
      success: true,
      user: req.user,
      enrolledProductIds,
    });
  } catch (err) {
    console.error("[Auth] Me error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 4. PUT /api/auth/profile
router.put("/profile", requireAuth, (req, res) => {
  try {
    const { name, phone, targetExam } = req.body;
    const usersTable = Database.table("users");

    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (targetExam && targetExam.trim()) updates.target_exam = targetExam.trim();

    const updatedUser = usersTable.update(req.user.id, updates);
    const { password_hash, ...safeUser } = updatedUser;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser,
    });
  } catch (err) {
    console.error("[Auth] Profile update error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
