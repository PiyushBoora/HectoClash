const express = require('express');
const router = express.Router();
const { googleAuth, googleCallback, getMe } = require('../controllers/auth');

// Start OAuth
router.get('/google', googleAuth);

// Handle callback
router.get('/google/callback', googleCallback);
router.get('/getMe',getMe);

module.exports = router;
