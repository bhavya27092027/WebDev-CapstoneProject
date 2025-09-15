import express from "express";
import { getUsers, loginUser } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/login", loginUser);

router.get("/", protect, restrictTo("admin"), getUsers);

export default router;

