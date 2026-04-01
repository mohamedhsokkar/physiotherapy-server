import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove
} from "./visit.controller.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

import {
  createVisitValidation,
  updateVisitValidation,
  visitIdValidation,
  visitListQueryValidation,
  handleValidationErrors
} from "./visit.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  allowRoles("admin", "receptionist"),
  createVisitValidation,
  handleValidationErrors,
  create
);

router.get(
  "/",
  allowRoles("admin", "receptionist", "doctor"),
  visitListQueryValidation,
  handleValidationErrors,
  getAll
);

router.get(
  "/:id",
  allowRoles("admin", "receptionist", "doctor"),
  visitIdValidation,
  handleValidationErrors,
  getOne
);

router.put(
  "/:id",
  allowRoles("admin", "receptionist", "doctor"),
  visitIdValidation,
  updateVisitValidation,
  handleValidationErrors,
  update
);

router.delete(
  "/:id",
  allowRoles("admin"),
  visitIdValidation,
  handleValidationErrors,
  remove
);

export default router;