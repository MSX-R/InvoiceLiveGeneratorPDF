// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import LogoutButton from './LogoutButton';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate(); // Créez une instance de navigate
  const { isAuthenticated } = useAuth(); // Utilisez le context

  // Fonction pour gérer le clic sur le logo
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/menu'); // Redirige vers /menu si authentifié
    } else {
      navigate('/'); // Redirige vers / si non authentifié
    }
  };

  return (
    <header className="flex justify-between items-center p-4 text-black">
      <h1 
        className="text-xl font-bold cursor-pointer" // Ajoutez le curseur pointer
        onClick={handleLogoClick} // Ajoutez le gestionnaire de clic
      >
        MSX Fitnessapp
      </h1>
      {isAuthenticated && <LogoutButton />} {/* Affiche le bouton uniquement si authentifié */}
    </header>
  );
};

export default Header;