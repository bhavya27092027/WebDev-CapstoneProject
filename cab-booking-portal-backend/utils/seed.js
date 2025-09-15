import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
await connectDB();

const run = async () => {
  try {
    const email = "admin@company.com";
    let admin = await User.findOne({ email });
    if (!admin) {
      const hashed = await bcrypt.hash("admin123", 10);
      admin = await User.create({ name: "Admin", email, password: hashed, role: "admin" });
      console.log("Admin user created:", admin.email);
    } else {
      console.log("Admin already exists:", email);
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
