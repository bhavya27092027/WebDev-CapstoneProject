import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const payload = { ...req.body, user: req.user._id };
    const booking = await Booking.create(payload);
    await booking.populate("user vendor", "name email company phone");
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "admin") {
      bookings = await Booking.find().populate("user vendor", "name email company phone");
    } else if (req.user.role === "vendor") {
      bookings = await Booking.find({ vendor: req.user._id }).populate("user vendor", "name email company phone");
    } else {
      bookings = await Booking.find({ user: req.user._id }).populate("vendor", "name company phone");
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("user vendor", "name email company phone");
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

