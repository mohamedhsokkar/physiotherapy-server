import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove
} from "./expense.controller.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

import {
  createExpenseValidation,
  updateExpenseValidation,
  expenseIdValidation,
  expenseListQueryValidation,
  handleValidationErrors
} from "./expense.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  allowRoles("admin", "receptionist"),
  createExpenseValidation,
  handleValidationErrors,
  create
);

router.get(
  "/",
  allowRoles("admin", "receptionist"),
  expenseListQueryValidation,
  handleValidationErrors,
  getAll
);

router.get(
  "/:id",
  allowRoles("admin", "receptionist"),
  expenseIdValidation,
  handleValidationErrors,
  getOne
);

router.put(
  "/:id",
  allowRoles("admin", "receptionist"),
  expenseIdValidation,
  updateExpenseValidation,
  handleValidationErrors,
  update
);

router.delete(
  "/:id",
  allowRoles("admin"),
  expenseIdValidation,
  handleValidationErrors,
  remove
);

export default router;