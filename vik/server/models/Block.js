import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  blockName: String,
  pricePerSeat: Number,
  amenities: [String],
  seats: [String], // like ["L1-1", "L1-2"]
  isAvailable: Boolean,
});

export default mongoose.model("Block", blockSchema);
