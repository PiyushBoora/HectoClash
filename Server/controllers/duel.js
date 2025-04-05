const Duel = require("../models/duel");
const User = require("../models/User"); 

const createDuel = async (req, res) => {
  try {
    const { player1Id, player2Id, player1Score, player2Score, duelTime } = req.body;

    if (!player1Id || !player2Id) {
      return res.status(400).json({ message: "Player Id's are required." });
    }

    // Create the duel entry
    const newDuel = new Duel({
      player1: player1Id,
      player2: player2Id,
      player1Score,
      player2Score,
      duelTime
    });

    await newDuel.save();

    // Fetch both users
    const player1 = await User.findById(player1Id);
    const player2 = await User.findById(player2Id);

    if (!player1 || !player2) {
      return res.status(404).json({ message: "One or both players not found." });
    }

    // Update games played
    player1.stats.gamesPlayed += 1;
    player2.stats.gamesPlayed += 1;

    // Update wins
    if (player1Score > player2Score) {
      player1.stats.wins += 1;
    } else if (player2Score > player1Score) {
      player2.stats.wins += 1;
    }
    // Update totalSolved (assuming this represents total score)
    player1.stats.totalSolved += player1Score;
    player2.stats.totalSolved += player2Score;

    await player1.save();
    await player2.save();

    res.status(201).json({
      message: "Duel created and stats updated successfully",
      duel: newDuel,
    });
  } catch (error) {
    console.error("Error creating duel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { createDuel };
