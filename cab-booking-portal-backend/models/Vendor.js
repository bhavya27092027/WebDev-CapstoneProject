import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
