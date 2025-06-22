import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    civicId: { type: String, required: true, unique: true },
    email: String,
    username: String,
    image: String,
    walletAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
