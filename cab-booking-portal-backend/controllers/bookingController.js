import Booking from "../models/Booking.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const user = req.user;

    // destructure to drop _id and __v if they come from client
    const { _id, __v, ...cleanBody } = req.body;

    let bookingData = {
      passengerName: cleanBody.guestName,
      phone: cleanBody.guestPhone,
      pickupLocation: cleanBody.pickupLocation,
      dropLocation: cleanBody.dropoffLocation,
      date: cleanBody.date,
      time: cleanBody.time,
      carCategory: cleanBody.carCategory,
      referenceName: cleanBody.referenceName,
      specialInstructions: cleanBody.specialInstructions,
    };

    if (user.role === "company") {
      bookingData.companyId = user._id;
    } else if (user.role === "vendor") {
      bookingData.vendorId = user._id;
      bookingData.companyId = cleanBody.companyId || undefined;
    } else if (user.role === "admin") {
      bookingData.companyId = cleanBody.companyId;
      bookingData.vendorId = cleanBody.vendorId;
    }

    const booking = await Booking.create(bookingData);

    await booking.populate("companyId vendorId", "name email");
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking create error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    console.log("getBookings called, req.user =", req.user);

    let bookings = [];
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === "admin") {
      bookings = await Booking.find()
        .populate("companyId", "name email")
        .populate("vendorId", "name email");
    } else if (req.user.role === "vendor") {
      bookings = await Booking.find({ vendorId: req.user._id })
        .populate("companyId", "name email");
    } else if (req.user.role === "company") {
      bookings = await Booking.find({ companyId: req.user._id })
        .populate("vendorId", "name email");
    }

    console.log("Bookings found:", bookings.length);
    res.json(bookings);
  } catch (err) {
    console.error("getBookings error:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};


// Update booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("companyId", "name email")
      .populate("vendorId", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignVendor = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { vendorId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.vendorId = vendorId;
    booking.status = "assigned";
    await booking.save();

    res.json({ message: "Vendor assigned", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVendorBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const vendorId = req.user._id;

    const bookings = await Booking.find({ vendorId }).populate("companyId", "name email");

    res.json(bookings);
  } catch (err) {
    console.error("Get vendor bookings error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Vendor assigns booking to self
export const assignBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.vendorId = req.user._id;
    booking.status = "assigned";
    await booking.save();

    await booking.populate("vendorId", "name email"); // so frontend gets vendor details
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update status
export const updateStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status;
    await booking.save();

    await booking.populate("vendorId", "name email");
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



