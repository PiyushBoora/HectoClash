const Game = require('../models/Game');
const User = require('../models/User');
const { gameQuestions } = require('../data/questions');
const SolutionGenerator = require('../services/solutionGenerator');

const getRandomSequences = (count) => {
  const shuffled = [...gameQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const createGame = async (req, res) => {
  try {
    const { type, players } = req.body;
    const gameSequences = getRandomSequences(5);

    // Generate solutions for each sequence
    const solutions = await Promise.all(
      gameSequences.map(async (sequence) => {
        const digits = sequence.map(Number);
        return SolutionGenerator.generateSolutions(digits);
      })
    );

    const game = new Game({
      type,
      players: players.map(playerId => ({ userId: playerId })),
      sequences: gameSequences,
      solutions,
      startTime: new Date()
    });

    await game.save();
    res.status(201).json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateGameStats = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, score, timeSpent, correctAnswers, totalQuestions } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const playerIndex = game.players.findIndex(p => p.userId.toString() === playerId);
    if (playerIndex === -1) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    game.players[playerIndex].score = score;
    game.players[playerIndex].timeSpent = timeSpent;
    game.players[playerIndex].correctAnswers = correctAnswers;
    game.players[playerIndex].totalQuestions = totalQuestions;

    if (game.type === 'duel' && game.players.every(p => p.totalQuestions > 0)) {
      game.completed = true;
      game.endTime = new Date();

      // Update user stats
      for (const player of game.players) {
        const user = await User.findById(player.userId);
        if (user) {
          user.stats.totalScore += player.score;
          user.stats.gamesPlayed += 1;
          user.stats.accuracy = ((user.stats.accuracy * (user.stats.gamesPlayed - 1) + 
            (player.correctAnswers / player.totalQuestions * 100)) / user.stats.gamesPlayed);
          
          if (game.players.length > 1) {
            const isWinner = player.score === Math.max(...game.players.map(p => p.score));
            if (isWinner) user.stats.wins += 1;
          }

          await user.save();
        }
      }
    }

    await game.save();
    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGameStats = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId).populate('players.userId', 'name profileImage');
    
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ 'stats.totalScore': -1 })
      .limit(10)
      .select('name profileImage stats');

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSolutions = async (req, res) => {
  try {
    const { sequence } = req.body;
    const digits = sequence.map(Number);
    const solutions = await SolutionGenerator.generateSolutions(digits);
    
    res.json({ success: true, solutions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGame,
  updateGameStats,
  getGameStats,
  getLeaderboard,
  getSolutions
};