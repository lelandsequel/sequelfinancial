const express = require('express');
const { getProfile, optimizePrompt } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.post('/optimize', auth, optimizePrompt);

module.exports = router; 