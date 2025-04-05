const express = require('express');
const router = express.Router();
const { getUserById,getLeaderboard } = require('../controllers/user');

router.get('/get/:userId',getUserById);
router.get('/getLeaderboard',getLeaderboard);
module.exports = router;
