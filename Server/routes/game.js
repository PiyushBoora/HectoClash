const express = require('express');
const router = express.Router();
const { 
  createGame, 
  updateGameStats, 
  getGameStats,
  getLeaderboard 
} = require('../controllers/game');

router.post('/create', createGame);
router.put('/:gameId/stats', updateGameStats);
router.get('/:gameId/stats', getGameStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;