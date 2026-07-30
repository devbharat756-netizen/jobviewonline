import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mock_cloud",
  api_key: process.env.CLOUDINARY_API_KEY || "mock_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mock_secret",
});

/**
 * Uploads a file buffer to Cloudinary.
 * Falls back to a mock simulation if credentials are not configured.
 * @param {Buffer} fileBuffer 
 * @param {string} fileName 
 * @param {string} folder
 * @param {string} resourceType
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadToCloudinary = (fileBuffer, fileName, folder = "jobviewonline/resumes", resourceType = "raw") => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "mock_cloud" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured) {
    console.warn("⚠️ Cloudinary is not configured. Simulating mock upload...");
    const isImage = resourceType === "image" || fileName?.match(/\.(jpg|jpeg|png|webp)$/i);
    const simulatedFolder = isImage ? "mock_avatars" : "mock_resumes";
    const simulatedPublicId = `${simulatedFolder}/${Date.now()}_${fileName ? fileName.replace(/\s+/g, "_") : "file"}`;
    const simulatedUrl = `https://res.cloudinary.com/demo/image/upload/v1234567890/${simulatedPublicId}`;
    return Promise.resolve({
      secure_url: simulatedUrl,
      public_id: simulatedPublicId,
    });
  }

  return new Promise((resolve, reject) => {
    const cleanName = fileName
      ? fileName
          .replace(/\.[^/.]+$/, "") // Remove extension
          .replace(/[^a-zA-Z0-9-_]/g, "_") // Replace special chars with underscores
      : "file";
    // We do NOT append the extension to public_id for raw uploads to prevent Cloudinary from detecting it as a PDF and blocking it
    const uniquePublicId = `${cleanName}_${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: uniquePublicId,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Generates a signed Cloudinary delivery URL for restricted assets.
 * @param {string} publicId 
 * @param {string} resourceType 
 * @returns {string}
 */
export const getSignedCloudinaryUrl = (publicId, resourceType = "raw") => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "mock_cloud" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured) {
    return `https://res.cloudinary.com/demo/image/upload/v1234567890/${publicId}`;
  }

  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    resource_type: resourceType,
    type: "upload",
  });
};
