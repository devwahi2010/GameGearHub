import React from 'react';
import { useAuth } from '../auth/AuthContext';

function Profile() {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Welcome to your Profile 🎮</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;
