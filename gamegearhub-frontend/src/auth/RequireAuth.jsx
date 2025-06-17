import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function RequireAuth({ children }) {
  const { tokens } = useAuth();

  // Check if token exists in memory OR fallback to localStorage
  const access = tokens?.access || localStorage.getItem('access');

  return access ? children : <Navigate to="/login" />;
}

export default RequireAuth;
