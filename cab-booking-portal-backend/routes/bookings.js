import express from 'express';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const user = req.user; 
    const bookingData = {
      ...req.body,
      companyId: user.role === 'company' ? user.id : undefined,
      vendorId: user.role === 'vendor' ? user.id : undefined
    };

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const user = req.user;
    let bookings;

    if (user.role === 'company') {
      bookings = await Booking.find({ companyId: user.id });
    } else if (user.role === 'vendor') {
      bookings = await Booking.find({ vendorId: user.id });
    } else {
      bookings = [];
    }

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

export default router;
