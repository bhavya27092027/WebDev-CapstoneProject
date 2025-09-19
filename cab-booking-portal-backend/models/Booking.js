import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    passengerName: { type: String, required: true },
    phone: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    carCategory: { type: String, required: true },
    date: { type: String, required: true },  
    time: { type: String, required: true },
    referenceName: { type: String },  
    specialInstructions: { type: String },  

    status: {
      type: String,
      enum: ["pending", "assigned", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

