const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Stripe webhook endpoint
// Note: This route uses raw body parsing (configured in app.js)
router.post('/stripe', webhookController.handleStripeWebhook);

module.exports = router;
