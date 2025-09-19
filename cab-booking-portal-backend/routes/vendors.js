import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";

const router = express.Router();

router.route("/")
  .get(protect, getVendors)
  .post(protect, createVendor);

router.route("/:id")
  .put(protect, updateVendor)
  .delete(protect, deleteVendor);

export default router;

