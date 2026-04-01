import express from "express";
import {
  overview,
  financeSummary,
  visitSummary,
  recentActivity
} from "./dashboard.controller.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/overview",
  allowRoles("admin", "receptionist"),
  overview
);

router.get(
  "/finance-summary",
  allowRoles("admin", "receptionist"),
  financeSummary
);

router.get(
  "/visit-summary",
  allowRoles("admin", "receptionist", "doctor"),
  visitSummary
);

router.get(
  "/recent-activity",
  allowRoles("admin", "receptionist"),
  recentActivity
);

export default router;