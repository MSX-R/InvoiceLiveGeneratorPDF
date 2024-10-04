// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [loggedUser, setloggedUser] = useState(localStorage.getItem('loggedUser') || null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setUserRole(localStorage.getItem('userRole'));
      setloggedUser(localStorage.getItem('loggedUser'));
    }
  }, []);

  const login = (token, role, loggedUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('loggedUser', loggedUser);
    setIsAuthenticated(true);
    setUserRole(role);
    setloggedUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedUser');
    setIsAuthenticated(false);
    setUserRole(null);
    setloggedUser(null);
  };

  const refreshUserRole = () => {
    setUserRole(localStorage.getItem('userRole'));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loggedUser, userRole, refreshUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};