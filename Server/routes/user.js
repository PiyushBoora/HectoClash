const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/user');

router.get('/get/:userId',getUserById);

module.exports = router;
