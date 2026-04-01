import { body, param, validationResult } from "express-validator";

const createPatientValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Phone number length is invalid"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female"])
    .withMessage("Gender must be male or female"),

  body("dateOfBirth")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("address")
    .optional()
    .trim(),

  body("emergencyContactName")
    .optional()
    .trim(),

  body("emergencyContactPhone")
    .optional()
    .trim(),

  body("notes")
    .optional()
    .trim()
];

const updatePatientValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Phone number length is invalid"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender must be male or female"),

  body("dateOfBirth")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),

  body("address")
    .optional()
    .trim(),

  body("emergencyContactName")
    .optional()
    .trim(),

  body("emergencyContactPhone")
    .optional()
    .trim(),

  body("notes")
    .optional()
    .trim()
];

const patientIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid patient ID")
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });
};

export {
  createPatientValidation,
  updatePatientValidation,
  patientIdValidation,
  handleValidationErrors
};
