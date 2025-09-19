import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  available: { type: Boolean, default: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
