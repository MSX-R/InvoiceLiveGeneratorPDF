// Header.js
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import LogoutButton from "./LogoutButton";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate(); // Créez une instance de navigate
  const { isAuthenticated } = useAuth(); // Utilisez le context
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Fonction pour gérer le clic sur le logo
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/menu"); // Redirige vers /menu si authentifié
    } else {
      navigate("/"); // Redirige vers / si non authentifié
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full flex justify-between items-center p-4 text-black shadow-lg">
      <p className="text-sm  font-medium flex flex-col ">
        <span className="text-sm">Date du jour : {currentDateTime.toLocaleDateString("fr-FR")}</span> <span className="text-xs">Heure: {currentDateTime.toLocaleTimeString("fr-FR")}</span>
      </p>
      {isAuthenticated && <LogoutButton />} {/* Affiche le bouton uniquement si authentifié */}
    </header>
  );
};

export default Header;

{
  /* <div className="flex-grow h-full p-8 bg-gray-100">
        //{" "}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          // <h1 className="text-4xl font-bold mb-8">Bienvenue dans votre espace de gestion</h1>
          //{" "}
          <p className="text-xl mb-4">
            // Date et heure actuelles : {currentDateTime.toLocaleDateString("fr-FR")} - {currentDateTime.toLocaleTimeString("fr-FR")}
            //{" "}
          </p>
          // <p className="text-lg">Sélectionnez une option à gauche pour commencer.</p>
          //{" "}
        </div>
        //{" "}
      </div> */
}
