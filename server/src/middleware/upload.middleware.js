import multer from "multer";

// Configure multer storage in memory to allow streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter to restrict uploads to PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF documents are allowed."), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
}).single("resume");
