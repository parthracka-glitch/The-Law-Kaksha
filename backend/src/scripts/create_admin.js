/**
 * The Law Kaksha - Secure Initial Admin Provisioning Script
 * Usage: node src/scripts/create_admin.js --email="admin@thelawkaksha.com" --password="SuperSecurePassword!" --name="Platform Owner"
 * Or via env: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const Database = require("../db/database");
const { connectMongo, isConnected } = require("../db/mongo");
const User = require("../models/User");

async function main() {
  const args = process.argv.slice(2);
  let email = process.env.ADMIN_EMAIL || "";
  let password = process.env.ADMIN_PASSWORD || "";
  let name = process.env.ADMIN_NAME || "The Law Kaksha Administrator";

  for (const arg of args) {
    if (arg.startsWith("--email=")) email = arg.split("=")[1].trim();
    if (arg.startsWith("--password=")) password = arg.split("=")[1].trim();
    if (arg.startsWith("--name=")) name = arg.split("=")[1].trim();
  }

  if (!email || !password) {
    console.error("Error: --email and --password arguments (or ADMIN_EMAIL and ADMIN_PASSWORD env vars) are required.");
    console.error("Usage: node src/scripts/create_admin.js --email=admin@thelawkaksha.com --password=YourStrongPassword --name=\"Admin Name\"");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("Error: Production admin password must be at least 12 characters long.");
    process.exit(1);
  }

  const cleanEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 12);
  const adminPayload = {
    id: `usr-admin-${Date.now()}`,
    student_id: "LK-ADM-000001",
    name: name.trim(),
    email: cleanEmail,
    phone: "+91 99999 88888",
    password_hash: passwordHash,
    role: "admin",
    is_active: true,
    drm_access: true,
  };

  // 1. Sync to local database
  const usersTable = Database.table("users");
  const existingLocal = usersTable.findOne((u) => u.email && u.email.toLowerCase() === cleanEmail);
  if (existingLocal) {
    usersTable.update(existingLocal.id, {
      name: adminPayload.name,
      password_hash: passwordHash,
      role: "admin",
      is_active: 1,
    });
    console.log(`[Local DB] Updated existing admin user: ${cleanEmail}`);
  } else {
    usersTable.insert(adminPayload);
    console.log(`[Local DB] Created new admin user: ${cleanEmail}`);
  }

  // 2. Sync to MongoDB Atlas if configured
  try {
    await connectMongo();
    if (isConnected()) {
      const existingMongo = await User.findOne({ email: cleanEmail });
      if (existingMongo) {
        existingMongo.password_hash = passwordHash;
        existingMongo.name = adminPayload.name;
        existingMongo.role = "admin";
        existingMongo.is_active = true;
        await existingMongo.save();
        console.log(`[MongoDB Atlas] Updated existing admin user: ${cleanEmail}`);
      } else {
        await User.create(adminPayload);
        console.log(`[MongoDB Atlas] Created new admin user: ${cleanEmail}`);
      }
    } else {
      console.log("[MongoDB Atlas] Skipped Atlas sync (cluster not connected).");
    }
  } catch (err) {
    console.error("[MongoDB Atlas] Error syncing admin user:", err.message);
  }

  console.log(`\nAdmin account provisioned successfully for ${cleanEmail}!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Admin creation failed:", err);
  process.exit(1);
});
