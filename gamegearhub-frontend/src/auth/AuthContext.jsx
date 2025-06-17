import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    return access && refresh ? { access, refresh } : null;
  });

  const login = (tokenPair) => {
    localStorage.setItem('access', tokenPair.access);
    localStorage.setItem('refresh', tokenPair.refresh);
    setTokens(tokenPair);
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setTokens(null);
  };

  return (
    <AuthContext.Provider value={{ tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
