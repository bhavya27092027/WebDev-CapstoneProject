import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import vendorRoutes from "./routes/vendors.js";
import bookingRoutes from "./routes/bookings.js";
import statsRoutes from "./routes/stats.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin:  [ "http://localhost:5173"],  
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stats", statsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../corporate-cab-booking-portal/dist")));
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../corporate-cab-booking-portal/dist/index.html")));
}

app.get("/", (req, res) => res.send("Backend running"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
