import express from "express";
import { register, login, me } from "./auth.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authMiddleware, allowRoles("admin"), register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;