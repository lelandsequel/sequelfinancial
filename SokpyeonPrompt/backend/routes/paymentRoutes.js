const express = require('express');
const { createCheckoutSession } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create-checkout-session', auth, createCheckoutSession);

module.exports = router; 