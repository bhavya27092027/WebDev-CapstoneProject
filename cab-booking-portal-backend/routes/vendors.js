import express from "express";
import { createVendor, getVendors, updateVendor } from "../controllers/vendorController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, restrictTo("admin"), createVendor); 
router.get("/", protect, getVendors); 
router.put("/:id", protect, restrictTo("admin"), updateVendor);

export default router;
