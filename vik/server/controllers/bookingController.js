import mongoose from "mongoose";
import Booking from "../models/Booking.js";

// Create booking with proper ObjectId validation for matchId
export const createBooking = async (req, res) => {
  try {
    const { matchId, ...rest } = req.body;

    // Check if matchId is provided
    if (!matchId) {
      return res.status(400).json({ message: "matchId is required" });
    }

    // Validate matchId format
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({ message: "Invalid matchId format" });
    }

    // Create booking with matchId as ObjectId
    const booking = await Booking.create({
      matchId: new mongoose.Types.ObjectId(matchId),
      ...rest,
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

// Fetch bookings based on userAddress
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userAddress: req.params.userAddress }).populate("matchId");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings", error: err.message });
  }
};