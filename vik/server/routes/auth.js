import express from "express";
import { civicLogin, updateWalletAddress } from "../controllers/authController.js";

const router = express.Router();

router.post("/civic-login", civicLogin);
router.post("/update-wallet", updateWalletAddress); // ✅ Add this

export default router;
