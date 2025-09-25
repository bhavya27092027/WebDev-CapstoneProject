import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookings.js";
import userRoutes from "./routes/users.js"; 
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
