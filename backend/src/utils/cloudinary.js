const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_NAME ||
    (process.env.NODE_ENV === "production" ? "" : "wpt4eabs"),
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

const isCloudinaryConfigured = () => {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME) &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Helper to compress large PDF buffer under 9.5MB for Cloudinary free tier compliance
 */
function optimizePdfBuffer(inputBuffer) {
  try {
    const { execSync } = require("child_process");
    const tmpDir = path.join(__dirname, "../../uploads/temp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const inPath = path.join(tmpDir, `in_${Date.now()}.pdf`);
    const outPath = path.join(tmpDir, `out_${Date.now()}.pdf`);

    fs.writeFileSync(inPath, inputBuffer);
    const pythonScript = `
import pymupdf, io, os
from PIL import Image

doc = pymupdf.open(r'${inPath.replace(/\\/g, "/")}')
for page in doc:
    for img_info in page.get_images():
        xref = img_info[0]
        base = doc.extract_image(xref)
        try:
            pil = Image.open(io.BytesIO(base['image']))
            if pil.width > 1600 or pil.height > 1600:
                ratio = 1600 / max(pil.width, pil.height)
                pil = pil.resize((int(pil.width * ratio), int(pil.height * ratio)), Image.Resampling.LANCZOS)
            if pil.mode in ('RGBA', 'P'): pil = pil.convert('RGB')
            buf = io.BytesIO()
            pil.save(buf, format='JPEG', quality=65, optimize=True)
            doc.update_stream(xref, buf.getvalue())
        except Exception: pass
doc.save(r'${outPath.replace(/\\/g, "/")}', garbage=4, deflate=True)
`;
    execSync(`python -c "${pythonScript.replace(/"/g, '\\"')}"`, { timeout: 30000 });

    if (fs.existsSync(outPath)) {
      const optBuf = fs.readFileSync(outPath);
      try { fs.unlinkSync(inPath); fs.unlinkSync(outPath); } catch (_) {}
      if (optBuf.length < inputBuffer.length) {
        return optBuf;
      }
    }
    try { if (fs.existsSync(inPath)) fs.unlinkSync(inPath); } catch (_) {}
  } catch (optErr) {
    console.warn("[Storage] Automatic PDF optimization skipped:", optErr.message);
  }
  return inputBuffer;
}

/**
 * Upload a file buffer or local file path to Cloudinary (or local fallback)
 * @param {Buffer|string} fileInput - Buffer or file path
 * @param {Object} options - { folder, resource_type, public_id, extension }
 */
const uploadToStorage = async (fileInput, options = {}) => {
  const folder = options.folder || "thelawkaksha/resources";
  const resource_type = options.resource_type || "auto";

  let readyBuffer = fileInput;
  if (Buffer.isBuffer(fileInput) && fileInput.length > 9.5 * 1024 * 1024 && (resource_type === "raw" || options.extension === ".pdf")) {
    console.log(`[Storage] Optimizing large PDF (${(fileInput.length / (1024*1024)).toFixed(2)} MB) before Cloudinary upload...`);
    readyBuffer = optimizePdfBuffer(fileInput);
    console.log(`[Storage] PDF size after optimization: ${(readyBuffer.length / (1024*1024)).toFixed(2)} MB`);
  }

  if (isCloudinaryConfigured()) {
    try {
      if (Buffer.isBuffer(readyBuffer)) {
        return await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type,
              public_id: options.public_id,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                bytes: result.bytes,
              });
            }
          );
          uploadStream.end(readyBuffer);
        });
      } else if (typeof readyBuffer === "string") {
        const result = await cloudinary.uploader.upload(readyBuffer, {
          folder,
          resource_type,
          public_id: options.public_id,
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        };
      }
    } catch (err) {
      console.error("[Storage] Cloudinary upload failed, falling back to local storage:", err.message);
    }
  }

  // Fallback to local uploads directory
  const uploadsDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${options.public_id || "file"}-${Date.now()}${options.extension || ".pdf"}`;
  const targetPath = path.join(uploadsDir, filename);

  if (Buffer.isBuffer(fileInput)) {
    fs.writeFileSync(targetPath, fileInput);
  } else if (typeof fileInput === "string" && fs.existsSync(fileInput)) {
    fs.copyFileSync(fileInput, targetPath);
  }


  return {
    url: `/api/pdf/${filename}`,
    publicId: filename,
    localPath: targetPath,
    isLocal: true,
  };
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToStorage,
};
