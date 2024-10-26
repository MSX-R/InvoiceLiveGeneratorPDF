// PRECEDENT  LOIC :  Header.js
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import LogoutButton from "./LogoutButton";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate(); // Créez une instance de navigate
  const { isAuthenticated } = useAuth(); // Utilisez le context
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full flex justify-between items-center p-6  text-white shadow-lg">
      <div className="flex justify-between p-4 w-full bg-gray-800 shadow-md rounded-md">
        <p className="text-sm  font-medium flex flex-col ">
          <span className="text-sm">Date du jour : {currentDateTime.toLocaleDateString("fr-FR")}</span> <span className="text-xs">Heure: {currentDateTime.toLocaleTimeString("fr-FR")}</span>
        </p>
        {isAuthenticated && <LogoutButton />} {/* Affiche le bouton uniquement si authentifié */}
      </div>
    </header>
  );
};

export default Header;
