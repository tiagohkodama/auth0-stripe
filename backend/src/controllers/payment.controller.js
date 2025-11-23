const stripeService = require('../services/stripe.service');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create a Payment Intent
 * POST /api/payments/create-payment-intent
 */
async function createPaymentIntent(req, res, next) {
  try {
    const { amount, currency = 'usd', description, metadata = {} } = req.body;

    // Get user info from JWT (set by Auth0 middleware)
    const userId = req.auth.sub; // Auth0 user ID
    const email = req.auth.payload.email || req.body.email;

    // Validate inputs
    if (!amount) {
      throw new AppError('Amount is required', 400);
    }

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // Add description to metadata if provided
    if (description) {
      metadata.description = description;
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      userId,
      email,
      amount,
      currency,
      metadata
    );

    // Return client secret to frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Get payment status
 * GET /api/payments/:paymentIntentId
 */
async function getPaymentStatus(req, res, next) {
  try {
    const { paymentIntentId } = req.params;
    const userId = req.auth.sub;

    const stripe = require('../config/stripe');
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verify that this payment belongs to the authenticated user
    if (paymentIntent.metadata.auth0_user_id !== userId) {
      throw new AppError('Unauthorized access to payment', 403);
    }

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPaymentIntent,
  getPaymentStatus
};
