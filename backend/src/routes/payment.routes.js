const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { checkJwt } = require('../config/auth0');
const { paymentLimiter } = require('../middleware/rateLimiter');

// All payment routes require authentication
router.use(checkJwt);

// Create payment intent
router.post('/create-payment-intent', paymentLimiter, paymentController.createPaymentIntent);

// Get payment status
router.get('/:paymentIntentId', paymentController.getPaymentStatus);

module.exports = router;
