import { Link } from 'react-router-dom';
import Checkout from '../components/Payment/Checkout';

function CheckoutPage() {
  return (
    <div className="page-container checkout-page">
      <div className="back-link">
        <Link to="/">&larr; Back to Home</Link>
      </div>

      <Checkout
        amount={2000} // $20.00
        description="Premium Access - Lifetime License"
      />

      <div className="secure-notice">
        <p>
          <span className="icon">🔒</span>
          Payments are securely processed by Stripe
        </p>
      </div>
    </div>
  );
}

export default CheckoutPage;
