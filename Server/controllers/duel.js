const Duel = require("../models/duel");

// Create a new duel
const createDuel = async (req, res) => {
  try {
    const { player1Id, player2Id,player1Score,
        player2Score,
        duelTime } = req.body;
        console.log(req.body);
    if (!player1Id || !player2Id) {
      return res.status(400).json({ message: "Player Id's are required." });
    }

    
    const newDuel = new Duel({
      player1: player1Id,
      player2: player2Id,
      player1Score,
      player2Score,
      duelTime
    });

    await newDuel.save();

    res.status(201).json({
      message: "Duel created successfully",
      duel: newDuel,
    });
  } catch (error) {
    console.error("Error creating duel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createDuel };
