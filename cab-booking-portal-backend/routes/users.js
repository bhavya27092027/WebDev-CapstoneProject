import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, restrictTo("admin"), getUsers);

export default router;
