const express = require('express');
const router = express.Router();
const { googleAuth, googleCallback, getMe, signOut } = require('../controllers/auth');

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/getMe', getMe);
router.post('/signout', signOut);

module.exports = router;