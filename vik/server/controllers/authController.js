// server/controllers/authController.js
import User from "../models/User.js";



export const civicLogin = async (req, res) => {
  const { id, email, username, image, walletAddress } = req.body;

  try {
    let user = await User.findOne({ civicId: id });

    if (!user) {
      user = await User.create({
        civicId: id,
        email,
        username,
        image,
        walletAddress, // ✅ Store wallet at signup
      });
    } else if (walletAddress && user.walletAddress !== walletAddress) {
      // ✅ Update wallet if changed or added later
      user.walletAddress = walletAddress;
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to login via Civic", error: err.message });
  }
};


export const updateWalletAddress = async (req, res) => {
  const { civicId, walletAddress } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { civicId },
      { walletAddress },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Wallet address updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update wallet", error: err.message });
  }
};
