const express = require('express');
const router = express.Router();
const { createDuel } = require('../controllers/duel');


router.post('/create',createDuel);

module.exports = router;
