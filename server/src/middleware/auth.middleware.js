import jwt from "jsonwebtoken";
import User from "../modules/user/models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "jobview_jwt_secret";

/**
 * Protect middleware: enforces candidate authentication via JWT.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Find user matching decoded id
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found.",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("JWT protect middleware error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid token. Please authenticate again.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please complete your profile and log in.",
    });
  }
};

/**
 * Restricts access to specific user roles.
 * @param  {...string} roles 
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles: [${roles.join(", ")}].`,
      });
    }
    next();
  };
};

/**
 * Optional protect middleware: checks for authorization token but does not block request if missing or invalid.
 */
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.warn("Optional JWT protect warning (ignored):", error.message);
    }
  }
  next();
};
