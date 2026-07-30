import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for resumes."), false);
    }
  } else if (file.fieldname === "avatar") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG, WebP) are allowed for avatars."), false);
    }
  } else {
    cb(new Error("Unexpected upload field."), false);
  }
};

export const uploadProfileFiles = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
