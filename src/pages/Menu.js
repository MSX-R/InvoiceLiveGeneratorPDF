import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'; // Importez le contexte d'authentification

const Menu = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth(); // Utilisez le contexte pour obtenir le rôle de l'utilisateur

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Menu</h1>
        <div className="flex flex-col space-y-4">
          
          {/* Affichage des boutons en fonction du rôle */}
          {/* Administrateur (1) */}
          {userRole === "1" && (
            <>
              <button
                className="bg-gray-600 text-white py-4 px-6 rounded-md hover:bg-gray-700"
                onClick={() => navigate("/creation-profil-client")}
              >
                Création Profils Client
              </button>
              <button
                className="bg-black text-white py-4 px-6 rounded-md hover:bg-black/90"
                onClick={() => navigate("/liste-clients")}
              >
                Liste de clients
              </button>
              <hr />
              <button
                className="bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700"
                onClick={() => navigate("/formulaire-devis")}
              >
                DEVIS | Création du document
              </button>
              <button
                className="bg-yellow-600 text-white py-4 px-6 rounded-md hover:bg-yellow-700"
                onClick={() => navigate("/compteur-seances")}
              >
                SUIVI CONSO | Compteur de Séances
              </button>
              <hr />
            </>
          )}

          {/* Offres Coachings - Accès à tous les utilisateurs */}
          <button
            className="bg-orange-600 text-white py-4 px-6 rounded-md hover:bg-orange-700"
            onClick={() => navigate("/offres-coachings")}
          >
            MES OFFRES COACHINGS
          </button>

          {/* Données Corporelles et Stats - Rôle Admin (1) et Client (3) */}
          {(userRole === "1" || userRole === "3") && (
            <>
              <button
                className="bg-purple-600 text-white py-4 px-6 rounded-md hover:bg-purple-700"
                onClick={() => navigate("/formulaire-donnees-corporelles")}
              >
                DONNEES CORPORELLES | Réaliser un bilan
              </button>
              <button
                className="bg-indigo-600 text-white py-4 px-6 rounded-md hover:bg-indigo-700"
                onClick={() => navigate("/tableau-des-stats")}
              >
                TABLEAU DES STATS | Consulter et éditer ses perf'
              </button>
              <hr />
            </>
          )}

          {/* Tableau de Berger, VMA et Tabata Chrono - Pour les utilisateurs connectés */}
          {userRole && (
            <>
              <button
                className="bg-green-600 text-white py-4 px-6 rounded-md hover:bg-green-700"
                onClick={() => navigate("/tableau-berger")}
              >
                RM | Trouver sa RM (tableau de berger)
              </button>
              <button
                className="bg-red-600 text-white py-4 px-6 rounded-md hover:bg-red-700"
                onClick={() => navigate("/vma-tapis")}
              >
                VMA | Trouver sa VMA au VAMEVAL (tapis)
              </button>
              <button
                className="bg-teal-600 text-white py-4 px-6 rounded-md hover:bg-teal-700"
                onClick={() => navigate("/tabata-chrono")}
              >
                TABATA-CHRONO | Chronomètre Personnalisable
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;