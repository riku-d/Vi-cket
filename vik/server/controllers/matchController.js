import Match from "../models/Match.js";

export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch matches", error: err.message });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    res.status(200).json(match);
  } catch (err) {
    res.status(404).json({ message: "Match not found", error: err.message });
  }
};

export const createMatch = async (req, res) => {
  try {
    const newMatch = await Match.create(req.body);
    res.status(201).json(newMatch);
  } catch (err) {
    res.status(500).json({ message: "Match creation failed", error: err.message });
  }
};