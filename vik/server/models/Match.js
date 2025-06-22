import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  name: String,
  stadium: String,
  date: String, // or Date if preferred
  time: String,
  city: String,
  duration: String,
  occasionId: {
    type: Number,
    required: true,
    unique: true // must be unique per occasion on smart contract
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Match", matchSchema);
