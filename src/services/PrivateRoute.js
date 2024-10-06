// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si des rôles sont requis, vérifier que l'utilisateur a un rôle approprié
  if (requiredRoles && !requiredRoles.includes(parseInt(userRole, 10))) {
    return <Navigate to="/menu" />;
  }

  return children;
};

export default PrivateRoute;