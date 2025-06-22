import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";

import {
  hotelDummyData1,
  hotelDummyData2,
  hotelDummyData3,
  hotelDummyData4,
  hotelDummyData5,
} from "../data.js";

dotenv.config();

// ✅ Load ABI
const abiPath = path.resolve("./contract/TokenMaster.json");
const TokenMaster = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// ✅ Setup ethers provider and contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, TokenMaster.abi, wallet);

// ✅ Add debug line to verify the contract address
console.log("📄 Using contract address:", contract.target || contract.address);

// ✅ List of dummy matches
const allHotels = [hotelDummyData1, hotelDummyData2, hotelDummyData3, hotelDummyData4, hotelDummyData5];

// ✅ Mint NFT Ticket
export const mintNFTTicket = async (req, res) => {
  const { bookingId, seatLabel, seatPriceINR } = req.body;

  console.log("🎯 Mint request for bookingId:", bookingId);

  if (!bookingId || !seatLabel || !seatPriceINR) {
    return res.status(400).json({ success: false, error: "Missing required fields (bookingId, seatLabel, seatPriceINR)." });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found." });
    }

    const matchIdStr = booking.matchId?.toString();
    const hotel = allHotels.find(h => h.matchId === matchIdStr);

    if (!hotel || !hotel.occasionId) {
      console.log("❌ Mapping failed. Booking.matchId:", matchIdStr);
      return res.status(404).json({ success: false, error: "Occasion not found for booking." });
    }

    const occasionId = hotel.occasionId;

    // ✅ Fetch on-chain totalOccasions for validation
    const totalOccasions = await contract.totalOccasions();
    console.log("📊 On-chain totalOccasions:", totalOccasions.toString());
    console.log(`🎫 Minting NFT: occasionId=${occasionId}, seat="${seatLabel}", priceINR=₹${seatPriceINR}`);

    if (occasionId > totalOccasions) {
      return res.status(400).json({ success: false, error: "Occasion ID exceeds totalOccasions on-chain." });
    }

    const costInETH = await contract.convertINRtoETH(seatPriceINR);
    console.log(`💸 Cost in ETH: ${ethers.formatEther(costInETH)} ETH`);

    const tx = await contract.mint(occasionId, seatLabel, seatPriceINR, {
      value: costInETH,
      gasLimit: 500000,
    });

    const receipt = await tx.wait();
    console.log("✅ NFT minted:", receipt.hash);

    const tokenId = await contract.totalSupply();

    booking.nftTokenId = tokenId.toString();
    booking.nftMinted = true;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "🎉 NFT Minted Successfully",
      txHash: receipt.hash,
      tokenId: tokenId.toString(),
    });

  } catch (err) {
    console.error("❌ NFT Minting failed:", err);
    return res.status(500).json({
      success: false,
      error: err?.reason || err?.message || "Unexpected error during minting",
    });
  }
};