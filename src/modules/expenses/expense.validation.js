import { body, param, query, validationResult } from "express-validator";

const createExpenseValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Expense title is required")
    .isLength({ min: 3 })
    .withMessage("Expense title must be at least 3 characters"),

  body("category")
    .optional()
    .isIn([
      "rent",
      "salary",
      "utilities",
      "maintenance",
      "supplies",
      "marketing",
      "transport",
      "other"
    ])
    .withMessage("Expense category is invalid"),

  body("amount")
    .notEmpty()
    .withMessage("Expense amount is required")
    .isFloat({ min: 0 })
    .withMessage("Expense amount must be a number greater than or equal to 0"),

  body("expenseDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Expense date must be a valid date"),

  body("paymentMethod")
    .optional()
    .isIn(["cash", "card", "bank_transfer", "other"])
    .withMessage("Payment method is invalid"),

  body("notes")
    .optional()
    .trim()
];

const updateExpenseValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Expense title must be at least 3 characters"),

  body("category")
    .optional()
    .isIn([
      "rent",
      "salary",
      "utilities",
      "maintenance",
      "supplies",
      "marketing",
      "transport",
      "other"
    ])
    .withMessage("Expense category is invalid"),

  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Expense amount must be a number greater than or equal to 0"),

  body("expenseDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Expense date must be a valid date"),

  body("paymentMethod")
    .optional()
    .isIn(["cash", "card", "bank_transfer", "other"])
    .withMessage("Payment method is invalid"),

  body("notes")
    .optional()
    .trim()
];

const expenseIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid expense ID")
];

const expenseListQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("category")
    .optional()
    .isIn([
      "rent",
      "salary",
      "utilities",
      "maintenance",
      "supplies",
      "marketing",
      "transport",
      "other"
    ])
    .withMessage("Expense category is invalid"),

  query("paymentMethod")
    .optional()
    .isIn(["cash", "card", "bank_transfer", "other"])
    .withMessage("Payment method is invalid")
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
  createExpenseValidation,
  updateExpenseValidation,
  expenseIdValidation,
  expenseListQueryValidation,
  handleValidationErrors
};