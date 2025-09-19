import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Load environment variables from backend root .env regardless of working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
await connectDB();

const run = async () => {
  try {
    console.log("Resetting users...");

    // Clear all existing users
    await User.deleteMany({});

    // Predefined test users
    const users = [
      {
        name: "Admin",
        email: "admin@company.com",
        password: "admin123",
        role: "admin"
      },
      {
        name: "Company",
        email: "company@company.com",
        password: "company123",
        role: "company"
      },
      {
        name: "Vendor",
        email: "vendor@vendor.com",
        password: "vendor123",
        role: "vendor"
      }
    ];

    // Hash and insert users
    for (let u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`User created: ${u.email} (${u.role})`);
    }

    console.log("✅ Users reset successfully.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
