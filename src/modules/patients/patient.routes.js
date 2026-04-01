import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove
} from "./patient.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";
import {
  createPatientValidation,
  updatePatientValidation,
  patientIdValidation,
  handleValidationErrors
} from "./patient.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  allowRoles("admin", "receptionist"),
  createPatientValidation,
  handleValidationErrors,
  create
);

router.get(
  "/",
  allowRoles("admin", "receptionist", "doctor"),
  getAll
);

router.get(
  "/:id",
  allowRoles("admin", "receptionist", "doctor"),
  patientIdValidation,
  handleValidationErrors,
  getOne
);

router.put(
  "/:id",
  allowRoles("admin", "receptionist", "doctor"),
  patientIdValidation,
  updatePatientValidation,
  handleValidationErrors,
  update
);

router.delete(
  "/:id",
  allowRoles("admin"),
  patientIdValidation,
  handleValidationErrors,
  remove
);

export default router;