require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { Readable } = require("stream");
const { cloudinary, isCloudinaryConfigured } = require("../utils/cloudinary");

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function backupAllToGridFS() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to Atlas MongoDB!");
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "codex_files" });
  const ContentItem = mongoose.model("ContentItem", new mongoose.Schema({}, { strict: false }));

  const items = await ContentItem.find({}).lean();
  console.log(`Found ${items.length} content items to inspect.`);

  const diskSearchDirs = [
    path.join(__dirname, "../../../frontend/public/samples"),
    path.join(__dirname, "../../../frontend/public/notes"),
    path.join(__dirname, "../../../../CA Foundation"),
    path.join(__dirname, "../../../../CA Foundation/Indian Contact Act"),
    path.join(__dirname, "../../../../CA Foundation/Indian Partnership Act"),
    path.join(__dirname, "../../../../CA Foundation/SOGA"),
    path.join(__dirname, "../../../../CA Foundation/LLP"),
    path.join(__dirname, "../../../../CSEET"),
    path.join(__dirname, "../../../../Question Bank/Question Bank FINAL pdf"),
    path.join(__dirname, "../../../../Question Bank/Ouestion Bank Sample Pdf"),
    path.join(__dirname, "../../uploads"),
  ];

  for (const item of items) {
    console.log(`\nEvaluating: ${item.id} - ${item.title}`);
    
    // Check if already in GridFS
    let existingGridDoc = null;
    if (item.gridfsId && mongoose.isValidObjectId(item.gridfsId)) {
      existingGridDoc = await mongoose.connection.db.collection("codex_files.files").findOne({ _id: new mongoose.Types.ObjectId(item.gridfsId) });
    }
    if (!existingGridDoc && item.fileName) {
      existingGridDoc = await mongoose.connection.db.collection("codex_files.files").findOne({ filename: item.fileName });
    }

    if (existingGridDoc) {
      console.log(`✓ Already in GridFS (ID: ${existingGridDoc._id}, ${existingGridDoc.length} bytes)`);
      if (!item.gridfsId || item.gridfsId !== existingGridDoc._id.toString()) {
        await ContentItem.updateOne({ id: item.id }, { $set: { gridfsId: existingGridDoc._id.toString() } });
      }
      continue;
    }

    // Try finding on disk
    let fileBuffer = null;
    const targetName = (item.fileName || "").trim();
    if (targetName) {
      for (const d of diskSearchDirs) {
        const p = path.join(d, targetName);
        if (fs.existsSync(p)) {
          fileBuffer = fs.readFileSync(p);
          console.log(`Found on local disk: ${p} (${fileBuffer.length} bytes)`);
          break;
        }
      }
    }

    // Try downloading from Cloudinary if not found on disk
    if (!fileBuffer && item.cloudinaryPublicId && isCloudinaryConfigured()) {
      try {
        const hasExt = String(item.cloudinaryPublicId).toLowerCase().endsWith(".pdf");
        const format = hasExt ? "" : "pdf";
        const signedUrl = cloudinary.utils.private_download_url(item.cloudinaryPublicId, format, {
          expires_at: Math.floor(Date.now() / 1000) + 300,
          resource_type: "raw",
          type: "upload",
        });
        console.log(`Fetching from Cloudinary: ${item.cloudinaryPublicId}...`);
        fileBuffer = await fetchBuffer(signedUrl);
        console.log(`Successfully fetched from Cloudinary (${fileBuffer.length} bytes)`);
      } catch (cErr) {
        console.warn(`Cloudinary download failed for ${item.cloudinaryPublicId}:`, cErr.message);
      }
    }

    if (fileBuffer) {
      const filename = item.fileName || `${item.id}.pdf`;
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          originalName: filename,
          publicId: item.cloudinaryPublicId || "",
          itemId: item.id,
          contentType: "application/pdf",
          uploadedAt: new Date(),
        },
      });

      const readable = new Readable();
      readable.push(fileBuffer);
      readable.push(null);

      await new Promise((resolve, reject) => {
        readable.pipe(uploadStream).on("finish", resolve).on("error", reject);
      });

      console.log(`✓ Stored in Atlas GridFS with ID: ${uploadStream.id}`);

      await ContentItem.updateOne(
        { id: item.id },
        {
          $set: {
            gridfsId: uploadStream.id.toString(),
            fileSize: fileBuffer.length,
            isPublished: true,
          },
        }
      );
    } else {
      console.warn(`⚠ Could not obtain file buffer for ${item.id} (${item.title})`);
    }
  }

  await mongoose.disconnect();
  console.log("\nFinished GridFS backup synchronization!");
}

backupAllToGridFS().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
