const express = require('express');
const router = express.Router();
const { 
  getChallengeByType, 
  completeChallenge 
} = require('../controllers/challengeController');

// Fetch challenge (daily or weekly)
router.get('/:type', getChallengeByType);

// Mark challenge as completed
router.post('/:type/complete', completeChallenge);

module.exports = router;
