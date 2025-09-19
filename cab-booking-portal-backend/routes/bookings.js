import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all bookings
router.get("/", protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "vendor") {
      // Vendor sees only bookings assigned to them or pending
      bookings = await Booking.find({
        $or: [{ vendorId: req.user._id }, { status: "pending" }]
      }).populate("vendorId", "name email");
    } else {
      // Company/admin sees all bookings
      bookings = await Booking.find().populate("vendorId", "name email");
    }
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Vendor self-assign booking
router.put("/:id/assign", protect, async (req, res) => {
  try {
    if (req.user.role !== "vendor")
      return res.status(403).json({ message: "Only vendors can assign bookings" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending")
      return res.status(400).json({ message: "Booking already assigned" });

    booking.vendorId = req.user._id;
    booking.status = "assigned";
    await booking.save();

    res.json({ message: "Booking assigned successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Vendor update booking status: complete / reject
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only assigned vendor can update
    if (req.user.role === "vendor" && booking.vendorId?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not assigned to this booking" });

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

