const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { checkJwt } = require('../config/auth0');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.use(checkJwt);

router.post('/create-payment-intent', paymentLimiter, paymentController.createPaymentIntent);

router.get('/:paymentIntentId', paymentController.getPaymentStatus);

module.exports = router;
