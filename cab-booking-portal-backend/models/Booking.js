import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  guestPhone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  carCategory: { type: String, required: true },
  referenceName: { type: String },
  specialInstructions: { type: String },
  status: { type: String, default: 'pending' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverName: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);

