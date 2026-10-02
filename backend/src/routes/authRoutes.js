/**
 * The Law Kaksha - Authentication Routes
 * Supports course selection (CA Foundation & CSEET), Student Roll Numbers & Administrator authentication
 * Fully integrated with MongoDB Atlas and secure bcrypt hashing
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");
const { requireAuth, JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate unique student roll ID
function generateStudentId(exam = "") {
  const isCSEET = String(exam).toLowerCase().includes("cseet");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return isCSEET ? `LRK-2026-00${randomNum}` : `LRK-2026-00${randomNum}`;
}

// 1. POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, selectedCourse, targetExam, target_exam } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : "+91 98765 43210";
    const course = selectedCourse || targetExam || target_exam || "CA Foundation Paper 2: Business Laws";

    // Check existing in MongoDB Atlas or local DB
    if (isConnected()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "An account with this email address already exists. Please sign in.",
        });
      }
    } else {
      const usersTable = Database.table("users");
      const existing = usersTable.findOne((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "An account with this email address already exists. Please sign in.",
        });
      }
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const studentId = generateStudentId(course);
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const userPayload = {
      id: userId,
      student_id: studentId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password_hash: passwordHash,
      role: "student",
      selectedCourse: course,
      target_exam: course,
      is_active: true,
      drm_access: true,
      enrolled_books: [course],
      unlockedItemIds: [],
    };

    let createdUser;
    if (isConnected()) {
      createdUser = await User.create(userPayload);
    }
    // Also save to local database for consistency
    const usersTable = Database.table("users");
    usersTable.insert(userPayload);

    const token = jwt.sign(
      {
        id: userId,
        email: cleanEmail,
        role: "student",
        student_id: studentId,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password_hash, ...safeUser } = userPayload;

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Welcome to The Law Kaksha!",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("[Auth] Register error:", err);
    return res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
});

// 2. POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.phone;
    const password = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Student ID and password are required.",
      });
    }

    const loginQuery = String(identifier).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    let user = null;

    // Search in MongoDB Atlas first
    if (isConnected()) {
      user = await User.findOne({
        $or: [
          { email: loginQuery },
          { student_id: loginQuery.toUpperCase() },
          { student_id: loginQuery },
          { phone: loginQuery },
        ],
      }).lean();
    }

    // Fallback to local table
    if (!user) {
      const usersTable = Database.table("users");
      user = usersTable.findOne(
        (u) =>
          (u.email && u.email.toLowerCase() === loginQuery) ||
          (u.student_id && u.student_id.toLowerCase() === loginQuery) ||
          (u.phone && u.phone.toLowerCase() === loginQuery) ||
          (loginQuery === "admin" && u.role === "admin")
      );
    }

    // Default admin creation if none exists yet
    if (!user && (loginQuery === "admin@thelawkaksha.com" || loginQuery === "admin")) {
      const passwordHash = await bcrypt.hash("AdminSecurePassword2026!", 10);
      const adminPayload = {
        id: "usr-admin-001",
        student_id: "LK-ADM-000001",
        name: "The Law Kaksha Admin",
        email: "admin@thelawkaksha.com",
        phone: "+91 99999 88888",
        password_hash: passwordHash,
        role: "admin",
        is_active: true,
        drm_access: true,
      };
      if (isConnected()) {
        user = await User.create(adminPayload);
      } else {
        const usersTable = Database.table("users");
        user = usersTable.insert(adminPayload);
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your Email/Student ID and password.",
      });
    }

    if (user.is_active === false || user.is_active === 0) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your password.",
      });
    }

    // -------------------------------------------------------------
    // SINGLE DEVICE ENFORCEMENT (1 Login Per Device Policy)
    // -------------------------------------------------------------
    const incomingDeviceId = req.body.deviceId ? String(req.body.deviceId).trim() : "";
    const incomingDeviceName = req.body.deviceName ? String(req.body.deviceName).trim() : "Current Web Browser";
    const forceSwitchDevice = Boolean(req.body.forceSwitchDevice);

    if (user.role === "student" && incomingDeviceId) {
      const activeDevId = user.activeDeviceId || "";
      const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : 0;
      const isRecent = Date.now() - lastActive < 4 * 60 * 60 * 1000; // within 4 hours

      if (activeDevId && activeDevId !== incomingDeviceId && isRecent && !forceSwitchDevice) {
        return res.status(409).json({
          success: false,
          conflict: true,
          code: "DEVICE_CONFLICT",
          activeDeviceName: user.activeDeviceName || "Another Device",
          message: `This account is currently active on another device (${user.activeDeviceName || "Authorized Hardware"}). Simultaneous logins are strictly prohibited to prevent account sharing.`,
        });
      }

      // Update active device binding
      const updatedFields = {
        activeDeviceId: incomingDeviceId,
        activeDeviceName: incomingDeviceName,
        lastActiveAt: new Date().toISOString(),
      };

      if (isConnected()) {
        await User.updateOne({ id: user.id }, { $set: updatedFields });
      }
      const usersTable = Database.table("users");
      usersTable.update(user.id, updatedFields);
      user.activeDeviceId = incomingDeviceId;
      user.activeDeviceName = incomingDeviceName;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        student_id: user.student_id,
        deviceId: incomingDeviceId,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    let activeSub = null;
    if (isConnected()) {
      activeSub = await Subscription.findOne({
        $or: [{ userId: user.id }, { email: user.email }, { studentRoll: user.student_id }],
        accessStatus: "Active",
      }).lean();
    } else {
      const subscriptionsTable = Database.table("subscriptions");
      activeSub = subscriptionsTable.findOne(
        (s) => (s.userId === user.id || s.email === user.email) && s.accessStatus === "Active"
      );
    }

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        student: safeUser,
        user: safeUser,
        role: user.role,
        subscription: activeSub || null,
        activeDeviceId: incomingDeviceId,
      },
    });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error during login." });
  }
});

// 3. POST /api/auth/device-heartbeat (Validates active device session lock)
router.post("/device-heartbeat", async (req, res) => {
  try {
    const { email, studentId, deviceId } = req.body;
    if (!deviceId || (!email && !studentId)) {
      return res.status(200).json({ success: true, active: true });
    }

    let user = null;
    if (isConnected()) {
      user = await User.findOne({
        $or: [
          { email: (email || "").toLowerCase().trim() },
          { student_id: (studentId || "").trim() },
        ],
      }).lean();
    }

    if (!user) {
      const usersTable = Database.table("users");
      user = usersTable.findOne(
        (u) =>
          (email && u.email && u.email.toLowerCase() === email.toLowerCase().trim()) ||
          (studentId && u.student_id === studentId.trim())
      );
    }

    if (!user) {
      return res.status(200).json({ success: true, active: true });
    }

    // Check device match
    const activeDev = user.activeDeviceId || "";
    if (activeDev && activeDev !== deviceId) {
      return res.status(200).json({
        success: false,
        conflict: true,
        activeDeviceName: user.activeDeviceName || "Another Device",
        message: "Your session was terminated because this account logged in on another device.",
      });
    }

    // Refresh heartbeat timestamp
    if (isConnected()) {
      await User.updateOne({ id: user.id }, { $set: { lastActiveAt: new Date() } });
    }

    return res.status(200).json({ success: true, active: true });
  } catch (err) {
    return res.status(200).json({ success: true, active: true });
  }
});

// 4. POST /api/auth/logout (Releases active device session)
router.post("/logout", async (req, res) => {
  try {
    const { email, studentId } = req.body;
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanId = (studentId || "").trim();

    if (isConnected()) {
      await User.updateOne(
        { $or: [{ email: cleanEmail }, { student_id: cleanId }] },
        { $set: { activeDeviceId: "", lastActiveAt: new Date(0) } }
      );
    }
    const usersTable = Database.table("users");
    const localUser = usersTable.findOne(
      (u) => (cleanEmail && u.email?.toLowerCase() === cleanEmail) || (cleanId && u.student_id === cleanId)
    );
    if (localUser) {
      usersTable.update(localUser.id, { activeDeviceId: "", lastActiveAt: new Date(0).toISOString() });
    }

    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    return res.status(200).json({ success: true });
  }
});

// 5. GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    let activeSub = null;
    if (isConnected()) {
      activeSub = await Subscription.findOne({
        $or: [{ userId: req.user.id }, { email: req.user.email }],
        accessStatus: "Active",
      }).lean();
    } else {
      const subscriptionsTable = Database.table("subscriptions");
      activeSub = subscriptionsTable.findOne(
        (s) => (s.userId === req.user.id || s.email === req.user.email) && s.accessStatus === "Active"
      );
    }

    return res.status(200).json({
      success: true,
      user: req.user,
      subscription: activeSub || null,
    });
  } catch (err) {
    console.error("[Auth] Me error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
