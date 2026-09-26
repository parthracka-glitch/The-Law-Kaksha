/**
 * The Law Kaksha - Authentication & Authorization Middleware
 */

const jwt = require("jsonwebtoken");
const Database = require("../db/database");

const JWT_SECRET = process.env.JWT_SECRET || "the_law_kaksha_secure_jwt_secret_key_2026";

/**
 * Enforces authenticated student or admin session
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in to access this resource.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const usersTable = Database.table("users");
    const user = usersTable.findById(decoded.id);

    if (!user || user.is_active === 0) {
      return res.status(401).json({
        success: false,
        message: "User session is invalid or has been deactivated.",
      });
    }

    // Attach user without exposing password hash
    const { password_hash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

/**
 * Enforces admin role access
 */
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Access denied. Administrator privileges required.",
    });
  });
}

/**
 * Optional authentication: extracts user if token exists, but proceeds anyway
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const usersTable = Database.table("users");
    const user = usersTable.findById(decoded.id);
    if (user && user.is_active === 1) {
      const { password_hash, ...safeUser } = user;
      req.user = safeUser;
    } else {
      req.user = null;
    }
  } catch (e) {
    req.user = null;
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
  JWT_SECRET,
};
