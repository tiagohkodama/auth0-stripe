const stripe = require('../config/stripe');
const stripeService = require('../services/stripe.service');

/**
 * Handle Stripe webhooks
 * POST /api/webhooks/stripe
 *
 * IMPORTANT: This endpoint requires raw body parsing
 */
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        await stripeService.handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`PaymentIntent ${failedPayment.id} failed`);
        await stripeService.handlePaymentFailure(failedPayment);
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log(`PaymentIntent ${canceledPayment.id} was canceled`);
        break;

      case 'charge.succeeded':
        const charge = event.data.object;
        console.log(`Charge ${charge.id} succeeded`);
        break;

      case 'charge.failed':
        const failedCharge = event.data.object;
        console.log(`Charge ${failedCharge.id} failed`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to prevent Stripe from retrying
    // Log the error for manual investigation
    res.json({ received: true, error: error.message });
  }
}

module.exports = {
  handleStripeWebhook
};
