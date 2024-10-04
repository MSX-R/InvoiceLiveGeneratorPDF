// Menu2.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Importez le contexte d'authentification
import { MdLogout } from "react-icons/md"; // Importez l'icône de déconnexion

const Menu2 = () => {
  const { isAuthenticated, userRole, refreshUserRole, logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [role, setRole] = useState(null);

  // Utilisez useEffect pour mettre à jour l'état local 'role' quand 'userRole' change
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserRole(); // Actualiser les informations de rôle
      setRole(userRole);
    }
  }, [userRole, isAuthenticated, refreshUserRole]);

  // Utilisez useEffect pour mettre à jour la date et l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Met à jour chaque seconde

    return () => clearInterval(timer); // Nettoyage de l'intervalle à la désinitialisation du composant
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout(); // Appelez la fonction de déconnexion du contexte
    // Optionnel : Redirection ou autres actions après la déconnexion
  };

  // Fonction pour formater la date
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  // Fonction pour formater l'heure
  const formatTime = (date) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Utilise le format 24 heures
    };
    return date.toLocaleTimeString("fr-FR", options);
  };

  return (
    <div className="flex justify-between items-start">
      {/* Carte pour afficher la date et l'heure */}
      <div className="flex justify-start space-x-5">
        <div className="bg-transparent border border-2 border-slate-700 text-slate-700 p-4 rounded-lg shadow-md w-fit">
          <p className="text-center bold text-3xl">{formatDate(currentDateTime)}</p>
          <p className="text-center">{formatTime(currentDateTime)}</p>
        </div>

        {/* Carte pour Profil connecté */}
        <div className="bg-transparent flex flex-row space-x-3 border border-2 border-slate-700 text-slate-700 p-4 rounded-lg shadow-md w-fit">
          {/* Ajout d'une photo de profil */}
          <img
            src="url_de_votre_photo_de_profil" // Remplacez par l'URL de votre image
            alt="Profil"
            className="h-12 w-12 rounded-full mb-2" // Classe pour la taille et l'arrondi
          />
          <div className="flex flex-col items-start">
            <p className="text-center bold">NOM Prénom</p>
            <p className="text-center">Role - #id_User</p>
            <p className="text-xs text-center">Inscris depuis le 00/00/00</p>
          </div>
        </div>
      </div>

      {/* Icône de déconnexion */}
      <button onClick={handleLogout} className="flex items-center text-slate-700 hover:text-red-500">
        <MdLogout size={24} />
        <span className="ml-2">Déconnexion</span>
      </button>
    </div>
  );
};

export default Menu2;
