import express from "express";
import Booking from "../models/Booking.js";
import { assignVendor, getVendorBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create booking
router.post("/", protect, async (req, res) => {
  try {
    const user = req.user;

    const bookingData = {
      passengerName: req.body.passengerName,
      phone: req.body.phone,
      pickupLocation: req.body.pickupLocation,
      dropLocation: req.body.dropLocation,
      carCategory: req.body.carCategory,
      date: req.body.date,
      time: req.body.time,
      referenceName: req.body.referenceName || "",
      specialInstructions: req.body.specialInstructions || "",
      status: "pending",
    };

    if (user.role === "company") bookingData.companyId = user._id;
    else if (user.role === "vendor") bookingData.vendorId = user._id;

    const booking = await Booking.create(bookingData);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get bookings
router.get("/", protect, async (req, res) => {
  try {
    const user = req.user;
    let bookings;

    if (user.role === "company") {
      bookings = await Booking.find({ companyId: user._id })
        .populate("vendorId", "name email");
    } else if (user.role === "vendor") {
      bookings = await Booking.find({
        $or: [
          { status: "pending" },       // available for assignment
          { vendorId: user._id }       // already assigned to this vendor
        ]
      }).populate("companyId", "name email");
    } else {
      bookings = await Booking.find()
        .populate("companyId", "name email")
        .populate("vendorId", "name email");
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Admin/company assigns vendor to booking
router.put("/assign-vendor/:id", protect, assignVendor);

// ✅ Vendor fetches assigned bookings
router.get("/vendor-bookings", protect, getVendorBookings);

// ✅ Update booking status
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("vendorId", "email");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Vendor self-assigns booking
router.put("/:id/assign", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can assign bookings" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "assigned", vendorId: user._id },
      { new: true }
    ).populate("vendorId", "email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete booking
router.delete("/:id", protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
