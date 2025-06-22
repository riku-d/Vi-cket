import express from "express";
import {
  getAllMatches,
  getMatchById,
  createMatch,
} from "../controllers/matchController.js";

const router = express.Router();

router.get("/", getAllMatches);
router.get("/:id", getMatchById);
router.post("/", createMatch); // for admin use

export default router;
