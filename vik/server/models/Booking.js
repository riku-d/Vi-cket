import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  matchTitle: { type: String, required: true },
  stadium: { type: String, required: true },
  blockName: { type: String, required: true },
  seats: { type: [String], required: true },
  pricePerSeat: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: String, required: true },
  nftTokenId: { type: String, default: null },
  nftMinted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);