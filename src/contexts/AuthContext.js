// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setUserRole(localStorage.getItem('userRole'));
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const refreshUserRole = () => {
    setUserRole(localStorage.getItem('userRole'));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userRole, refreshUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};