const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME || "",
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
 * Upload a file buffer or local file path to Cloudinary (or local fallback)
 * @param {Buffer|string} fileInput - Buffer or file path
 * @param {Object} options - { folder, resource_type, public_id }
 */
const uploadToStorage = async (fileInput, options = {}) => {
  const folder = options.folder || "thelawkaksha/resources";
  const resource_type = options.resource_type || "auto";

  if (isCloudinaryConfigured()) {
    try {
      if (Buffer.isBuffer(fileInput)) {
        return new Promise((resolve, reject) => {
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
          uploadStream.end(fileInput);
        });
      } else if (typeof fileInput === "string") {
        const result = await cloudinary.uploader.upload(fileInput, {
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
