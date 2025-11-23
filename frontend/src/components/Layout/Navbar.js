import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import LoginButton from '../Auth/LoginButton';
import LogoutButton from '../Auth/LogoutButton';

function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="logo">Auth0 × Stripe</span>
        </Link>

        <div className="nav-links">
          {!isLoading && (
            <>
              {isAuthenticated && (
                <div className="user-info-small">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="avatar-small"
                  />
                  <span className="user-name">{user.name}</span>
                </div>
              )}

              <div className="auth-buttons">
                <LoginButton />
                <LogoutButton />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
