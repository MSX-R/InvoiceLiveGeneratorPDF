import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Menu</h1>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700"
            onClick={() => navigate("/formulaire-devis")}
          >
            DEVIS | Création du document
          </button>
          <button
            className="bg-green-600 text-white py-4 px-6 rounded-md hover:bg-green-700"
            onClick={() => navigate("/tableau-berger")}
          >
            RM | Trouver sa RM (tableau de berger)
          </button>
          <button
            className="bg-purple-600 text-white py-4 px-6 rounded-md hover:bg-purple-700"
            onClick={() => navigate("/formulaire-donnees-corporelles")}
          >
            DONNEES CORPORELLES | Réaliser un bilan
          </button>
          <button
            className="bg-red-600 text-white py-4 px-6 rounded-md hover:bg-red-700"
            onClick={() => navigate("/vma-tapis")}
          >
            VMA | Trouver sa VMA au VAMEVAL (tapis)
          </button>
          {/* Nouveau bouton */}
          <button
            className="bg-yellow-600 text-white py-4 px-6 rounded-md hover:bg-yellow-700"
            onClick={() => navigate("/compteur-seances")}
          >
            Suivi des Clients | Compteur de Séances  
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
