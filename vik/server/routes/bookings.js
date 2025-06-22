import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";

const router = express.Router();

/**
 * Save a new booking
 * POST /api/bookings
 */
router.post("/", async (req, res) => {
  try {
    const {
      userAddress,
      matchId,       // use matchId instead of matchTitle
      matchTitle,    // optional, for reference/display
      stadium,
      blockName,
      seats,
      pricePerSeat,
      totalPrice,
      bookingDate,
      nftTokenId,
      nftMinted
    } = req.body;

    // Basic validation
    if (!userAddress || !matchId || !stadium || !blockName || !seats?.length) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    // Validate matchId format
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({ message: "Invalid matchId format" });
    }

    // Check if any requested seats are already booked for this match, stadium, block
    const existing = await Booking.find({
      matchId: new mongoose.Types.ObjectId(matchId),
      stadium,
      blockName,
      seats: { $in: seats }
    });

    if (existing.length > 0) {
      const alreadyBooked = existing.flatMap(b =>
        b.seats.filter(seat => seats.includes(seat))
      );
      return res.status(409).json({
        message: "Some seats are already booked",
        alreadyBooked
      });
    }

    // Save new booking
    const newBooking = new Booking({
      userAddress,
      matchId: new mongoose.Types.ObjectId(matchId),
      matchTitle: matchTitle || "",
      stadium,
      blockName,
      seats,
      pricePerSeat,
      totalPrice,
      bookingDate,
      nftTokenId: nftTokenId || null,
      nftMinted: nftMinted || false
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking successful", booking: newBooking });

  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Failed to save booking", error: error.message });
  }
});

/**
 * Get booked seats for a match & stadium
 * GET /api/bookings/seats?matchId=...&stadium=...
 */
router.get("/seats", async (req, res) => {
  try {
    const { matchId, stadium } = req.query;

    if (!matchId || !stadium) {
      return res.status(400).json({ message: "matchId and stadium are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({ message: "Invalid matchId format" });
    }

    const bookings = await Booking.find({
      matchId: new mongoose.Types.ObjectId(matchId),
      stadium
    });

    const seatMap = {}; // { blockName: [seat1, seat2] }
    bookings.forEach(booking => {
      if (!seatMap[booking.blockName]) seatMap[booking.blockName] = [];
      seatMap[booking.blockName].push(...booking.seats);
    });

    res.json(seatMap);
  } catch (err) {
    console.error("Error fetching booked seats:", err);
    res.status(500).json({ message: "Error fetching booked seats", error: err.message });
  }
});

/**
 * Get bookings for a user (by wallet address)
 * Changed route to avoid conflict with /seats
 * GET /api/bookings/user/:walletAddress
 */
router.get("/user/:walletAddress", async (req, res) => {
  try {
    const bookings = await Booking.find({ userAddress: req.params.walletAddress }).populate("matchId");
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

/**
 * Validate seat availability before payment
 * POST /api/bookings/validate
 */
router.post("/validate", async (req, res) => {
  try {
    const { matchId, stadium, blockName, seats } = req.body;

    if (!matchId || !stadium || !blockName || !seats?.length) {
      return res.status(400).json({ message: "Missing fields for validation." });
    }

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({ message: "Invalid matchId format" });
    }

    const existing = await Booking.find({
      matchId: new mongoose.Types.ObjectId(matchId),
      stadium,
      blockName,
      seats: { $in: seats }
    });

    if (existing.length > 0) {
      const alreadyBooked = existing.flatMap(b =>
        b.seats.filter(seat => seats.includes(seat))
      );
      return res.status(200).json({
        valid: false,
        alreadyBooked
      });
    }

    res.status(200).json({ valid: true });
  } catch (err) {
    console.error("Error during validation:", err);
    res.status(500).json({ message: "Validation failed", error: err.message });
  }
});

export default router;
