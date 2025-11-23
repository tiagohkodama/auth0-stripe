const stripe = require('../config/stripe');

// Simple in-memory storage for demo purposes
// In production, use a real database
const userCustomerMap = new Map();

/**
 * Get or create a Stripe customer for a user
 * @param {string} auth0UserId - Auth0 user ID (from req.auth.sub)
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Stripe customer object
 */
async function getOrCreateCustomer(auth0UserId, email) {
  // Check if we already have a customer ID for this user
  if (userCustomerMap.has(auth0UserId)) {
    const customerId = userCustomerMap.get(auth0UserId);
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return customer;
    } catch (error) {
      // Customer might have been deleted, create a new one
      console.error('Error retrieving customer:', error.message);
    }
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      auth0_user_id: auth0UserId
    }
  });

  // Store the mapping
  userCustomerMap.set(auth0UserId, customer.id);

  console.log(`Created new Stripe customer ${customer.id} for user ${auth0UserId}`);

  return customer;
}

/**
 * Create a Payment Intent for one-time payment
 * @param {string} auth0UserId - Auth0 user ID
 * @param {string} email - User's email
 * @param {number} amount - Amount in cents (e.g., 2000 = $20.00)
 * @param {string} currency - Currency code (default: 'usd')
 * @param {Object} metadata - Additional metadata to attach to payment
 * @returns {Promise<Object>} Payment Intent object
 */
async function createPaymentIntent(auth0UserId, email, amount, currency = 'usd', metadata = {}) {
  // Validate amount
  if (!amount || amount < 50) {
    throw new Error('Amount must be at least 50 cents');
  }

  // Get or create customer
  const customer = await getOrCreateCustomer(auth0UserId, email);

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    customer: customer.id,
    metadata: {
      auth0_user_id: auth0UserId,
      ...metadata
    },
    automatic_payment_methods: {
      enabled: true, // Supports cards, wallets, etc.
    },
  });

  return paymentIntent;
}

/**
 * Handle successful payment
 * @param {Object} paymentIntent - Stripe Payment Intent object
 */
async function handlePaymentSuccess(paymentIntent) {
  const userId = paymentIntent.metadata.auth0_user_id;
  const amount = paymentIntent.amount;
  const currency = paymentIntent.currency;

  console.log(`Payment successful for user ${userId}: ${amount/100} ${currency.toUpperCase()}`);

  // TODO: Implement your business logic here:
  // - Update database with order information
  // - Send confirmation email
  // - Grant access to purchased content
  // - Create invoice record
  // - Update user's account balance

  // Example: Store order information
  // await db.orders.create({
  //   userId: userId,
  //   paymentIntentId: paymentIntent.id,
  //   amount: amount,
  //   currency: currency,
  //   status: 'completed',
  //   createdAt: new Date()
  // });
}

/**
 * Handle failed payment
 * @param {Object} paymentIntent - Stripe Payment Intent object
 */
async function handlePaymentFailure(paymentIntent) {
  const userId = paymentIntent.metadata.auth0_user_id;
  const amount = paymentIntent.amount;

  console.log(`Payment failed for user ${userId}: ${amount/100}`);

  // TODO: Implement your business logic here:
  // - Send notification to user
  // - Log failed payment attempt
  // - Update order status
}

module.exports = {
  getOrCreateCustomer,
  createPaymentIntent,
  handlePaymentSuccess,
  handlePaymentFailure
};
