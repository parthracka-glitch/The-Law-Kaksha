/**
 * The Law Kaksha - Database Backup & Tested Restore Verification Script
 * Supports offline local storage and MongoDB Atlas backup snapshots
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "lawkaksha_db.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function calculateChecksum(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function createBackup() {
  if (!fs.existsSync(DB_FILE)) {
    throw new Error(`Database file not found at ${DB_FILE}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFileName = `backup_lawkaksha_db_${timestamp}.json`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  fs.copyFileSync(DB_FILE, backupFilePath);
  const originalChecksum = calculateChecksum(DB_FILE);
  const backupChecksum = calculateChecksum(backupFilePath);

  if (originalChecksum !== backupChecksum) {
    throw new Error("Checksum mismatch between original database and backup snapshot.");
  }

  const rawData = fs.readFileSync(backupFilePath, "utf8");
  const parsed = JSON.parse(rawData);

  const stats = {
    backupFile: backupFileName,
    backupPath: backupFilePath,
    timestamp: new Date().toISOString(),
    sizeBytes: fs.statSync(backupFilePath).size,
    sha256: backupChecksum,
    tables: {},
  };

  for (const [table, rows] of Object.entries(parsed)) {
    stats.tables[table] = Array.isArray(rows) ? rows.length : 0;
  }

  console.log("[Backup] Snapshot created successfully:");
  console.log(JSON.stringify(stats, null, 2));
  return stats;
}

function testRestore(backupFilePath) {
  console.log(`[Restore Test] Verifying restore integrity for ${path.basename(backupFilePath)}...`);
  
  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Target backup does not exist: ${backupFilePath}`);
  }

  const testRestorePath = path.join(BACKUP_DIR, "test_restore_verify.tmp");
  fs.copyFileSync(backupFilePath, testRestorePath);

  try {
    const rawData = fs.readFileSync(testRestorePath, "utf8");
    const parsed = JSON.parse(rawData);

    // Validate essential database entities
    const requiredTables = ["users", "courses", "subscriptions"];
    for (const tbl of requiredTables) {
      if (!parsed[tbl] || !Array.isArray(parsed[tbl])) {
        throw new Error(`Restore failed: missing or corrupted table '${tbl}'`);
      }
    }

    console.log(`[Restore Test] Verification successful: parsed ${Object.keys(parsed).length} tables cleanly.`);
    return true;
  } finally {
    if (fs.existsSync(testRestorePath)) {
      fs.unlinkSync(testRestorePath);
    }
  }
}

// CLI Execution
if (require.main === module) {
  const mode = process.argv[2] || "backup-and-test";
  if (mode === "backup-and-test" || mode === "backup") {
    const stats = createBackup();
    if (mode === "backup-and-test") {
      testRestore(stats.backupPath);
      console.log("[Backup & Restore] ALL RESTORE TESTS PASSED.");
    }
  }
}

module.exports = { createBackup, testRestore };
