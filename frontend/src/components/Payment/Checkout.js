import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { createPaymentIntent } from '../../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Checkout({ amount = 2000, description = 'Product Purchase' }) {
  const { getAccessTokenSilently, user } = useAuth0();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializePayment() {
      try {
        setLoading(true);
        setError(null);

        // Create payment intent
        const data = await createPaymentIntent(
          getAccessTokenSilently,
          amount,
          user.email,
          { description }
        );

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    }

    initializePayment();
  }, [getAccessTokenSilently, amount, user.email, description]);

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading-spinner"></div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="error-message">
          <h3>Payment Initialization Failed</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066cc',
      },
    },
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Complete Your Payment</h2>
        <p className="amount">
          Amount: ${(amount / 100).toFixed(2)} USD
        </p>
        {description && <p className="description">{description}</p>}
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm />
        </Elements>
      )}
    </div>
  );
}

export default Checkout;
