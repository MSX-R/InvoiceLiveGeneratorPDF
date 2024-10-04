import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MdLogout } from "react-icons/md";
import Menu2 from "./Menu2";

const Menu = () => {
  const navigate = useNavigate();
  const { userRole, isAuthenticated, refreshUserRole, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserRole();
      setRole(userRole);
    }
  }, [userRole, isAuthenticated, refreshUserRole]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-8">Chargement du menu...</h1>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  const formatTime = (date) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleTimeString("fr-FR", options);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Menu2 />

      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Menu</h1>
        <div className="flex flex-col space-y-4">
          {role === "1" && (
            <>
              <button className="bg-gray-600 text-white py-4 px-6 rounded-md hover:bg-gray-700" onClick={() => navigate("/creation-profil-client")}>
                Création Profils Client
              </button>
              <button className="bg-black text-white py-4 px-6 rounded-md hover:bg-black/90" onClick={() => navigate("/liste-clients")}>
                Liste de clients
              </button>
              <hr />
              <button className="bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700" onClick={() => navigate("/formulaire-devis")}>
                DEVIS | Création du document
              </button>
              <button className="bg-yellow-600 text-white py-4 px-6 rounded-md hover:bg-yellow-700" onClick={() => navigate("/compteur-seances")}>
                SUIVI CONSO | Compteur de Séances
              </button>
              <hr />
            </>
          )}

          <button className="bg-orange-600 text-white py-4 px-6 rounded-md hover:bg-orange-700" onClick={() => navigate("/offres-coachings")}>
            MES OFFRES COACHINGS
          </button>

          {(role === "1" || role === "3") && (
            <>
              <button className="bg-purple-600 text-white py-4 px-6 rounded-md hover:bg-purple-700" onClick={() => navigate("/formulaire-donnees-corporelles")}>
                DONNEES CORPORELLES | Réaliser un bilan
              </button>
              <button className="bg-indigo-600 text-white py-4 px-6 rounded-md hover:bg-indigo-700" onClick={() => navigate("/tableau-des-stats")}>
                TABLEAU DES STATS | Consulter et éditer ses perf'
              </button>
              <hr />
            </>
          )}

          {role && (
            <>
              <button className="bg-green-600 text-white py-4 px-6 rounded-md hover:bg-green-700" onClick={() => navigate("/tableau-berger")}>
                RM | Trouver sa RM (tableau de berger)
              </button>
              <button className="bg-red-600 text-white py-4 px-6 rounded-md hover:bg-red-700" onClick={() => navigate("/vma-tapis")}>
                VMA | Trouver sa VMA au VAMEVAL (tapis)
              </button>
              <button className="bg-teal-600 text-white py-4 px-6 rounded-md hover:bg-teal-700" onClick={() => navigate("/tabata-chrono")}>
                TABATA-CHRONO | Chronomètre Personnalisable
              </button>
            </>
          )}

          {/* Ajout du bouton pour la page TEST DE COMPOSANT */}
          <button className="bg-pink-600 text-white py-4 px-6 rounded-md hover:bg-pink-700" onClick={() => navigate("/test-de-composant")}>
            TEST DE COMPOSANT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
