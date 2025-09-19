import express from "express";
import { registerUser, loginUser, getVendors } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/vendors", protect, getVendors);

export default router;



