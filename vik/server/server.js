// server.js

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

// Route Imports
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js"; // ✅ Make sure file is named `bookings.js` (plural)
import matchRoutes from "./routes/match.js";
import paymentRoutes from "./routes/payment.js"; // ✅ Razorpay route
import nftRoutes from "./routes/nft.js"; // ✅ Add this

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/nft", nftRoutes); // ✅ Register the route


// Health check route
app.get("/", (req, res) => res.send("✅ API is working fine"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
