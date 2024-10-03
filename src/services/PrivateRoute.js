import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Vérifie si un token est présent

  return token ? children : <Navigate to="/" />; // Redirige vers la page de connexion si non connecté
};

export default PrivateRoute;