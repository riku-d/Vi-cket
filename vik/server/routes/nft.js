import express from "express";
import { mintNFTTicket } from "../controllers/nftController.js";

const router = express.Router();

// Optional debug log + controller together
router.post("/mint", [
  (req, res, next) => {
    console.log("🔥 NFT mint endpoint hit");
    next();
  },
  mintNFTTicket
]);

export default router;
