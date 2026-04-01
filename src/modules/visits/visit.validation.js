import { body, param, validationResult, query } from "express-validator";

const createVisitValidation = [
  body("patient")
    .notEmpty()
    .withMessage("Patient is required")
    .isMongoId()
    .withMessage("Patient must be a valid ID"),

  body("doctor")
    .notEmpty()
    .withMessage("Doctor is required")
    .isMongoId()
    .withMessage("Doctor must be a valid ID"),

  body("visitDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Visit date must be a valid date"),

  body("visitType")
    .optional()
    .isIn(["consultation", "session", "follow_up"])
    .withMessage("Visit type is invalid"),

  body("status")
    .optional()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage("Visit status is invalid"),

  body("chiefComplaint")
    .optional()
    .trim(),

  body("clinicalNotes")
    .optional()
    .trim(),

  body("treatmentPlan")
    .optional()
    .trim(),

  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a number greater than or equal to 0"),

  body("amountPaid")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount paid must be a number greater than or equal to 0")
];

const updateVisitValidation = [
  body("patient")
    .optional()
    .isMongoId()
    .withMessage("Patient must be a valid ID"),

  body("doctor")
    .optional()
    .isMongoId()
    .withMessage("Doctor must be a valid ID"),

  body("visitDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Visit date must be a valid date"),

  body("visitType")
    .optional()
    .isIn(["consultation", "session", "follow_up"])
    .withMessage("Visit type is invalid"),

  body("status")
    .optional()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage("Visit status is invalid"),

  body("chiefComplaint")
    .optional()
    .trim(),

  body("clinicalNotes")
    .optional()
    .trim(),

  body("treatmentPlan")
    .optional()
    .trim(),

  body("totalAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a number greater than or equal to 0"),

  body("amountPaid")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount paid must be a number greater than or equal to 0")
];

const visitIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid visit ID")
];

const visitListQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("patient")
    .optional()
    .isMongoId()
    .withMessage("Patient query must be a valid ID"),

  query("doctor")
    .optional()
    .isMongoId()
    .withMessage("Doctor query must be a valid ID"),

  query("paymentStatus")
    .optional()
    .isIn(["unpaid", "partial", "paid"])
    .withMessage("Payment status is invalid"),

  query("status")
    .optional()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage("Status is invalid")
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
  createVisitValidation,
  updateVisitValidation,
  visitIdValidation,
  visitListQueryValidation,
  handleValidationErrors
};