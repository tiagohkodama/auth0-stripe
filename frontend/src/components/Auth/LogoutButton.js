import { useAuth0 } from '@auth0/auth0-react';

function LogoutButton() {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="btn btn-secondary"
    >
      Log Out
    </button>
  );
}

export default LogoutButton;
