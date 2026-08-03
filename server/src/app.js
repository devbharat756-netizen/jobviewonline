import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import jobRoutes from "./modules/job/index.js";
import freelanceRoutes from "./modules/job/routes/freelance.routes.js";
import userRoutes from "./modules/user/index.js";

const app = express();

// Apply Helmet for basic security headers
app.use(helmet());

// Strict CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalhost = /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);
      if (isLocalhost || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Unauthorized origin."), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Rate limiter — disabled in development to avoid blocking local testing
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 500 : 0, // 0 = unlimited in dev
  skip: () => process.env.NODE_ENV !== "production",
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use("/api", limiter);
// Basic XSS sanitizer to strip HTML scripts and tags in-place (handles Express 5 read-only query/params)
const sanitizeObjectInPlace = (obj) => {
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/<[^>]*>/g, "");
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitizeObjectInPlace(obj[key]);
        }
      }
    }
  }
};

// NoSQL Injection sanitizer to strip keys starting with "$" or containing "." in-place
const sanitizeMongoInPlace = (obj) => {
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitizeMongoInPlace(obj[key]);
        }
      }
    }
  }
};

const securitySanitizers = (req, res, next) => {
  if (req.body) {
    sanitizeMongoInPlace(req.body);
    sanitizeObjectInPlace(req.body);
  }
  if (req.query) {
    sanitizeMongoInPlace(req.query);
    sanitizeObjectInPlace(req.query);
  }
  if (req.params) {
    sanitizeMongoInPlace(req.params);
    sanitizeObjectInPlace(req.params);
  }
  next();
};
app.use(securitySanitizers);



app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "viewjob Backend Running 🚀",
  });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/freelance", freelanceRoutes);
app.use("/api/auth", userRoutes);

export default app;