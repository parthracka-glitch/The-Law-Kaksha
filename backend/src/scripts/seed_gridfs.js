require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

async function seedGridFS() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to Atlas MongoDB!");
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "codex_files" });
  const ContentItem = mongoose.model("ContentItem", new mongoose.Schema({}, { strict: false }));
  const Act = mongoose.model("Act", new mongoose.Schema({}, { strict: false }));

  const filesToUpload = [
    {
      diskPath: path.join(__dirname, "../../../frontend/public/samples/Companies Act 2013 - Part 1 Notes-compressed.pdf"),
      filename: "Companies Act 2013 - Part 1 Notes-compressed.pdf",
      itemId: "item-1794465632962",
      title: "Companies Act Part 1",
    },
    {
      diskPath: path.join(__dirname, "../../../frontend/public/samples/Companies Act 2013 - Part 2 Notes.pdf"),
      filename: "Companies Act 2013 - Part 2 Notes.pdf",
      itemId: "item-1794465845881",
      title: "Companies Act 2013 Part 2 Notes",
    },
    {
      diskPath: path.join(__dirname, "../../../../Question Bank/Question Bank FINAL pdf/Question Bank_Part1 Final Copy.pdf"),
      filename: "Question Bank_Part1 Final Copy.pdf",
      itemId: "ci-ca-qbank-part1-final",
      title: "Question Bank Part 1 (Final Copy)",
    },
    {
      diskPath: path.join(__dirname, "../../../../Question Bank/Question Bank FINAL pdf/Question Bank Part 2_Final Copy.pdf"),
      filename: "Question Bank Part 2_Final Copy.pdf",
      itemId: "ci-ca-qbank-part2-final",
      title: "Question Bank Part 2 (Final Copy)",
    },
  ];

  for (const item of filesToUpload) {
    if (!fs.existsSync(item.diskPath)) {
      console.warn("File not found on disk:", item.diskPath);
      continue;
    }
    const buf = fs.readFileSync(item.diskPath);
    console.log(`Processing: ${item.filename} (${buf.length} bytes)...`);

    // Check if already in GridFS
    const existing = await mongoose.connection.db.collection("codex_files.files").findOne({ filename: item.filename });
    let gridfsId = null;
    if (existing) {
      gridfsId = existing._id;
      console.log(`Already in GridFS with ID: ${existing._id}`);
    } else {
      const uploadStream = bucket.openUploadStream(item.filename, {
        metadata: {
          originalName: item.filename,
          contentType: "application/pdf",
          uploadedAt: new Date(),
        },
      });
      const readable = new Readable();
      readable.push(buf);
      readable.push(null);
      await new Promise((resolve, reject) => {
        readable.pipe(uploadStream).on("finish", resolve).on("error", reject);
      });
      gridfsId = uploadStream.id;
      console.log(`Uploaded fresh to GridFS with ID: ${gridfsId}`);
    }

    const updateRes = await ContentItem.updateOne(
      { $or: [{ id: item.itemId }, { fileName: item.filename }] },
      {
        $set: {
          gridfsId: gridfsId.toString(),
          fileName: item.filename,
          isPublished: true,
        },
      }
    );
    console.log(`Updated ContentItem ${item.itemId}: matched ${updateRes.matchedCount}, modified ${updateRes.modifiedCount}`);
  }

  // Also make sure Companies Act and Question Bank acts are Live
  const actUpdate = await Act.updateMany(
    {
      $or: [
        { id: /companies/i },
        { title: /companies/i },
        { id: /qbank/i },
        { title: /question bank/i },
      ],
    },
    {
      $set: {
        availability: "live",
        status: "Live",
        isComingSoon: false,
      },
    }
  );
  console.log(`Updated Acts to Live: matched ${actUpdate.matchedCount}, modified ${actUpdate.modifiedCount}`);

  await mongoose.disconnect();
  console.log("Done!");
}

seedGridFS().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
