import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const { isAuthenticated } = useAuth0();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('processing');

  const paymentIntentId = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    if (redirectStatus === 'succeeded') {
      setPaymentStatus('succeeded');
    } else if (redirectStatus === 'failed') {
      setPaymentStatus('failed');
    } else {
      setPaymentStatus('processing');
    }
  }, [redirectStatus]);

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="message-box">
          <h2>Please log in to view your payment status</h2>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container payment-success-page">
      {paymentStatus === 'succeeded' && (
        <div className="message-box success">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase.</p>

          <div className="payment-details">
            <p>
              <strong>Payment ID:</strong> {paymentIntentId}
            </p>
            <p className="info-text">
              A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="actions">
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {paymentStatus === 'processing' && (
        <div className="message-box processing">
          <div className="loading-spinner"></div>
          <h2>Processing Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="message-box error">
          <div className="error-icon">✗</div>
          <h2>Payment Failed</h2>
          <p>
            We couldn't process your payment. Please try again or contact support
            if the problem persists.
          </p>

          <div className="actions">
            <Link to="/checkout" className="btn btn-primary">
              Try Again
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;
