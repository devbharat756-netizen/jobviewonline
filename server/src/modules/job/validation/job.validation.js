import { body, param, query, validationResult } from "express-validator";

/**
 * Common middleware to handle validation results and return errors.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for creating or updating a Job / Project.
 */
export const validateJobPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required.")
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters."),
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required.")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters."),
  body("salaryMin")
    .optional()
    .isNumeric()
    .withMessage("Minimum salary/budget must be a number.")
    .custom((val, { req }) => {
      if (val < 0) throw new Error("Minimum salary/budget cannot be negative.");
      return true;
    }),
  body("salaryMax")
    .optional()
    .isNumeric()
    .withMessage("Maximum salary/budget must be a number.")
    .custom((val, { req }) => {
      if (val < 0) throw new Error("Maximum salary/budget cannot be negative.");
      if (req.body.salaryMin && Number(val) < Number(req.body.salaryMin)) {
        throw new Error("Maximum salary/budget must be greater than or equal to minimum.");
      }
      return true;
    }),
  body("mode")
    .optional()
    .isIn(["Onsite", "Remote", "Hybrid"])
    .withMessage("Work mode must be Onsite, Remote, or Hybrid."),
  body("type")
    .optional()
    .isIn(["Full-time", "Part-time", "Contract", "Internship"])
    .withMessage("Employment type must be Full-time, Part-time, Contract, or Internship."),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array of strings."),
  body("skills.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty."),
  handleValidationErrors,
];

/**
 * Validation rules for submitting a Job Application.
 */
export const validateApplication = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit phone number."),
  body("yearsOfExperience")
    .trim()
    .notEmpty()
    .withMessage("Years of experience is required."),
  body("expectedSalary")
    .trim()
    .notEmpty()
    .withMessage("Expected salary is required."),
  body("noticePeriod")
    .trim()
    .notEmpty()
    .withMessage("Notice period is required."),
  body("availability")
    .trim()
    .notEmpty()
    .withMessage("Availability is required."),
  handleValidationErrors,
];

/**
 * Validation rules for updating job/application status.
 */
export const validateStatus = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required."),
  handleValidationErrors,
];
