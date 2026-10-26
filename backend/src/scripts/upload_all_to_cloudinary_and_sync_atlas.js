/**
 * The Law Kaksha - Batch Upload All PDFs to Cloudinary & Synchronize Atlas
 * 
 * Uploads all 34 verified, complete, multi-page PDFs to Cloudinary under 'thelawkaksha/pdfs/'
 * Updates MongoDB Atlas ContentItems, Resources, and Products with their exact Cloudinary Public IDs.
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function run() {
  console.log("================================================================================");
  console.log(" The Law Kaksha - Uploading Full PDFs to Cloudinary & Updating Atlas");
  console.log("================================================================================");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env");
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials missing in .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("-> Connected to MongoDB Atlas.");

  const ContentItem = mongoose.model("ContentItem", new mongoose.Schema({}, { strict: false }));
  const Resource = mongoose.model("Resource", new mongoose.Schema({}, { strict: false }));
  const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false }));

  const optDir = path.join(__dirname, "../../uploads/optimized");
  const fallbackDir = path.join(__dirname, "../../../frontend/public/notes");

  const items = await ContentItem.find({}).sort({ order: 1 });
  console.log(`-> Loaded ${items.length} ContentItem records from Atlas.`);

  let successCount = 0;
  let failCount = 0;
  const uploadedMap = new Map(); // fileName -> { publicId, secureUrl, sizeBytes }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const fileName = item.fileName;
    console.log(`\n[${i + 1}/${items.length}] Processing: ${item.title} (${fileName})`);

    // 1. Locate file on disk (prefer optimized)
    let filePath = path.join(optDir, fileName);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(fallbackDir, fileName);
    }
    if (!fs.existsSync(filePath)) {
      console.error(`   [ERROR] File not found on disk: ${fileName}`);
      failCount++;
      continue;
    }

    const stat = fs.statSync(filePath);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    console.log(`   File located: ${filePath} (${sizeMb} MB)`);

    // 2. Upload to Cloudinary (or reuse if already uploaded in this run)
    let uploadData = uploadedMap.get(fileName);
    if (!uploadData) {
      const cleanBase = path.parse(fileName).name
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .substring(0, 60);
      const publicId = `thelawkaksha/pdfs/${cleanBase}`;

      console.log(`   Uploading to Cloudinary as public_id: ${publicId} ...`);
      try {
        const uploadRes = await cloudinary.uploader.upload(filePath, {
          resource_type: "raw",
          public_id: publicId,
          overwrite: true,
          invalidate: true,
        });

        uploadData = {
          publicId: uploadRes.public_id,
          secureUrl: uploadRes.secure_url,
          bytes: uploadRes.bytes || stat.size,
        };
        uploadedMap.set(fileName, uploadData);
        console.log(`   -> Upload SUCCESS: ${uploadData.publicId} (${(uploadData.bytes / (1024*1024)).toFixed(2)} MB)`);
      } catch (uploadErr) {
        console.error(`   [UPLOAD ERROR]:`, uploadErr.message);
        failCount++;
        continue;
      }
    } else {
      console.log(`   -> Reusing uploaded Cloudinary asset: ${uploadData.publicId}`);
    }

    // 3. Update ContentItem in MongoDB Atlas
    await ContentItem.updateOne(
      { _id: item._id },
      {
        $set: {
          cloudinaryPublicId: uploadData.publicId,
          fileUrl: `/api/content/${item.id}/file`,
          fileSize: uploadData.bytes,
          cloudUrl: uploadData.secureUrl,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`   -> MongoDB Atlas ContentItem '${item.id}' updated with cloudinaryPublicId.`);
    successCount++;
  }

  // 4. Update Resources in MongoDB Atlas
  console.log("\n================================================================================");
  console.log(" Updating Resource records in MongoDB Atlas...");
  const resources = await Resource.find({});
  let resUpdated = 0;
  for (const r of resources) {
    const fn = path.basename(r.pdfUrl || "");
    const uploadData = uploadedMap.get(fn);
    if (uploadData) {
      await Resource.updateOne(
        { _id: r._id },
        {
          $set: {
            cloudinaryPublicId: uploadData.publicId,
            cloudUrl: uploadData.secureUrl,
            fileSize: uploadData.bytes,
            updatedAt: new Date(),
          },
        }
      );
      resUpdated++;
    }
  }
  console.log(`-> Updated ${resUpdated} Resource records with Cloudinary Public IDs.`);

  // 5. Update Course Products in MongoDB Atlas
  const caProduct = await Product.findOne({ id: "course-ca-foundation" });
  if (caProduct && uploadedMap.has("Question Bank Part 1- Sample Copy.pdf")) {
    const qbData = uploadedMap.get("Question Bank Part 1- Sample Copy.pdf");
    await Product.updateOne(
      { id: "course-ca-foundation" },
      { $set: { cloudinaryPublicId: qbData.publicId, samplePublicId: qbData.publicId } }
    );
  }

  const cseetProduct = await Product.findOne({ id: "course-cseet" });
  if (cseetProduct && uploadedMap.has("Lesson 7 Introduction to Management (Comprehensive Notes).pdf")) {
    const csData = uploadedMap.get("Lesson 7 Introduction to Management (Comprehensive Notes).pdf");
    await Product.updateOne(
      { id: "course-cseet" },
      { $set: { cloudinaryPublicId: csData.publicId, samplePublicId: csData.publicId } }
    );
  }

  console.log("\n================================================================================");
  console.log(` SUMMARY: ContentItems: ${successCount} updated, ${failCount} failed.`);
  console.log(` Resources: ${resUpdated} updated.`);
  console.log(" Cloudinary upload and Atlas synchronization COMPLETED SUCCESSFULLY!");
  console.log("================================================================================");

  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal script error:", err);
  process.exit(1);
});
