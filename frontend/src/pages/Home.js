import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import LoginButton from '../components/Auth/LoginButton';
import UserProfile from '../components/Auth/UserProfile';

function Home() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container home-page">
      <header className="hero">
        <h1>Auth0 + Stripe Integration</h1>
        <p className="subtitle">
          Secure authentication and payment processing made simple
        </p>
      </header>

      {!isAuthenticated ? (
        <div className="auth-section">
          <h2>Get Started</h2>
          <p>Sign in to make a purchase</p>
          <LoginButton />
        </div>
      ) : (
        <div className="authenticated-section">
          <UserProfile />

          <div className="product-showcase">
            <h2>Sample Product</h2>
            <div className="product-card">
              <h3>Premium Access</h3>
              <p className="price">$20.00</p>
              <p className="description">
                One-time payment for lifetime access to premium features
              </p>
              <Link to="/checkout" className="btn btn-primary btn-large">
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="features">
        <h3>Features</h3>
        <div className="feature-grid">
          <div className="feature">
            <h4>Secure Auth</h4>
            <p>Auth0 powered authentication with social login support</p>
          </div>
          <div className="feature">
            <h4>Easy Payments</h4>
            <p>Stripe payment processing with multiple payment methods</p>
          </div>
          <div className="feature">
            <h4>Production Ready</h4>
            <p>Built with best practices and security in mind</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
