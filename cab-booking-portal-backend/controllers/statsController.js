import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

export const getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "Pending" });
    const users = await User.countDocuments();
    const vendors = await Vendor.countDocuments();
    res.json({ totalBookings, pending, users, vendors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

