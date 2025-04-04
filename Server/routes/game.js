const express = require('express');
const router = express.Router();
const { 
  createGame, 
  updateGameStats, 
  getGameStats,
  getLeaderboard,
  getSolutions
} = require('../controllers/game');

router.post('/create', createGame);
router.put('/:gameId/stats', updateGameStats);
router.get('/:gameId/stats', getGameStats);
router.get('/leaderboard', getLeaderboard);
router.post('/solutions', getSolutions);

module.exports = router;