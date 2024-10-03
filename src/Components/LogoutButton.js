// LogoutButton.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth(); // Utilisez le context

  const handleLogout = () => {
    logout(); // Utilisez la fonction de déconnexion
    window.location.reload(); // Rechargez la page pour mettre à jour l'interface (facultatif)
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
    >
      Déconnexion
    </button>
  );
};

export default LogoutButton;