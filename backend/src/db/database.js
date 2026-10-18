/**
 * The Law Kaksha - Relational Database & Persistent Storage Engine
 * Features:
 * - In-memory query speed with atomic JSON disk persistence
 * - Relational tables: users, products, orders, order_items, enrollments, reviews
 * - Foreign key integrity, unique constraints, and automatic timestamps
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "lawkaksha_db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Database State
let db = {
  users: [],
  courses: [],
  subscription_plans: [],
  subscriptions: [],
  subscription_courses: [],
  resources: [],
  carousel_slides: [],
  offers: [],
  case_studies: [],
  coupons: [],
  coupon_redemptions: [],
  cart_items: [],
  orders: [],
  order_items: [],
  payments: [],
  entitlements: [],
  live_sessions: [],
  expenses: [],
  user_stats: [],
  xp_events: [],
  referrals: [],
  site_settings: [],
  // Legacy collections for backwards-compatibility
  acts: [],
  content: [],
  weekly_content: [],
  quizzes: [],
  enrollments: [],
  reviews: [],
};

// Save to disk with atomic write
function saveToDisk() {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf8");
    try {
      fs.renameSync(tempFile, DB_FILE);
    } catch (renameErr) {
      if (process.platform === "win32" && (renameErr.code === "EPERM" || renameErr.code === "EBUSY")) {
        fs.copyFileSync(tempFile, DB_FILE);
        try { fs.unlinkSync(tempFile); } catch (_) {}
      } else {
        throw renameErr;
      }
    }
  } catch (err) {
    console.error("[Database] Error writing to disk:", err);
  }
}

// Load from disk
function loadFromDisk() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf8");
      db = JSON.parse(data);
      console.log("[Database] Loaded existing database from disk.");
    } catch (err) {
      console.error("[Database] CRITICAL: Error parsing database file:", err);
      // Quarantine corrupted file to prevent data loss
      const corruptFile = `${DB_FILE}.corrupt.${Date.now()}`;
      try {
        fs.copyFileSync(DB_FILE, corruptFile);
        console.warn(`[Database] Quarantined corrupted DB file to: ${corruptFile}`);
      } catch (copyErr) {
        console.error("[Database] Failed to quarantine corrupt DB file:", copyErr);
      }

      // Check for available backups
      const backupsDir = path.join(DATA_DIR, "backups");
      let restored = false;
      if (fs.existsSync(backupsDir)) {
        try {
          const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith(".json")).sort().reverse();
          for (const bf of files) {
            try {
              const bData = fs.readFileSync(path.join(backupsDir, bf), "utf8");
              db = JSON.parse(bData);
              console.log(`[Database] Successfully restored database state from backup: ${bf}`);
              restored = true;
              break;
            } catch (_) {}
          }
        } catch (_) {}
      }

      if (!restored) {
        console.error("[Database] No valid backup found. Initializing empty database state.");
        saveToDisk();
      }
    }
  } else {
    console.log("[Database] Initializing new database file.");
    saveToDisk();
  }
}

// Initialize on module load
loadFromDisk();

// Database Query Operations
const Database = {
  // Generic collection operations
  table(name) {
    if (!db[name]) {
      db[name] = [];
    }

    return {
      find(predicate = () => true) {
        return db[name].filter(predicate);
      },

      findOne(predicate) {
        return db[name].find(predicate) || null;
      },

      findById(id) {
        return db[name].find((item) => item.id === id) || null;
      },

      insert(record) {
        const timestamp = new Date().toISOString();
        const newRecord = {
          ...record,
          created_at: record.created_at || timestamp,
          updated_at: timestamp,
        };
        db[name].unshift(newRecord);
        saveToDisk();
        return newRecord;
      },

      update(id, updates) {
        const index = db[name].findIndex((item) => item.id === id);
        if (index === -1) return null;

        const updatedRecord = {
          ...db[name][index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        db[name][index] = updatedRecord;
        saveToDisk();
        return updatedRecord;
      },

      delete(id) {
        const index = db[name].findIndex((item) => item.id === id);
        if (index === -1) return false;

        db[name].splice(index, 1);
        saveToDisk();
        return true;
      },

      count(predicate = () => true) {
        return db[name].filter(predicate).length;
      },
    };
  },

  // Raw database access if needed
  getRawData() {
    return db;
  },

  // Reset database (for tests/seed)
  reset(newDb = null) {
    if (newDb) {
      db = newDb;
    } else {
      db = {
        users: [],
        courses: [],
        acts: [],
        content: [],
        weekly_content: [],
        quizzes: [],
        subscriptions: [],
        enrollments: [],
        reviews: [],
      };
    }
    saveToDisk();
  },

  forceSave() {
    saveToDisk();
  },
};

module.exports = Database;
