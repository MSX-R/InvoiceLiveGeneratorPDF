import React from "react";
import { useAuth } from "../contexts/AuthContext"; // Utilisation de useAuth pour accéder au contexte d'authentification
import { Link } from "react-router-dom";
import { FaUsers, FaChartLine, FaClipboardList, FaFileInvoice, FaStopwatch } from "react-icons/fa";

const DashboardHome = () => {
  const { loggedUser } = useAuth(); // Utilisation de useAuth() pour obtenir loggedUser

  return (
    <>
      {" "}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Bonjour, {loggedUser ? loggedUser.prenom : "Coach"} !</h1>
        <p className="text-lg text-gray-700 mb-8">Bienvenue sur votre tableau de bord de coaching. Vous trouverez ici tous les outils nécessaires pour gérer vos clients, suivre leur progression, et faciliter votre travail quotidien.</p>

{/* BOUTONS DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Raccourci vers la Liste des Clients */}
          <Link to="/dashboard/liste-clients" className="p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
            <div className="flex items-center">
              <FaUsers size={24} className="mr-4" />
              <span className="font-semibold text-xl">Gérer les Clients</span>
            </div>
          </Link>

          {/* Raccourci vers Tableau des Statistiques */}
          <Link to="/dashboard/tableau-des-stats" className="p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
            <div className="flex items-center">
              <FaChartLine size={24} className="mr-4" />
              <span className="font-semibold text-xl">Tableau des Statistiques</span>
            </div>
          </Link>

          {/* Raccourci vers Formulaire de Devis */}
          <Link to="/dashboard/formulaire-devis" className="p-6 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition">
            <div className="flex items-center">
              <FaFileInvoice size={24} className="mr-4" />
              <span className="font-semibold text-xl">Créer un Devis</span>
            </div>
          </Link>

          {/* Raccourci vers Chronomètres Tabata */}
          <Link to="/dashboard/tabata-chrono" className="p-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition">
            <div className="flex items-center">
              <FaStopwatch size={24} className="mr-4" />
              <span className="font-semibold text-xl">Tabata Chrono</span>
            </div>
          </Link>

          {/* Raccourci vers Offres de Coaching */}
          <Link to="/dashboard/offres-coachings" className="p-6 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition">
            <div className="flex items-center">
              <FaClipboardList size={24} className="mr-4" />
              <span className="font-semibold text-xl">Offres de Coaching</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
