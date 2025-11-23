import { useAuth0 } from '@auth0/auth0-react';

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile">
      <img
        src={user.picture}
        alt={user.name}
        className="profile-picture"
      />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default UserProfile;
