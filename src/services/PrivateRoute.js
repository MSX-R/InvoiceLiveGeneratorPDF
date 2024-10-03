import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  // Vérifiez si l'utilisateur est authentifié
  if (!isAuthenticated) {
    return <Navigate to="/" />; // Rediriger vers la page de connexion si non connecté
  }

  // Si des rôles sont requis, vérifiez que l'utilisateur a le bon rôle
  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/menu" />; // Rediriger vers une page appropriée si le rôle ne correspond pas
  }

  return children;
};

export default PrivateRoute;