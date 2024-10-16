// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import { MdLogout, MdMenu, MdHome, MdPerson, MdBarChart, MdAssignment, MdFitnessCenter, MdShowChart, MdTimer } from "react-icons/md";
import "tailwindcss/tailwind.css";

const Layout = ({ handleLogout, isSidebarOpen, setIsSidebarOpen, role, navigate, currentDateTime }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`fixed md:static inset-0 md:w-64 md:min-w-[200px] bg-gray-800 text-white flex flex-col p-4 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 h-full md:h-auto`}>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">MSX Fitness App</h2>
          </div>

          <div className="flex flex-col space-y-4">
            <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/home")}>
              <MdHome className="mr-2" /> Accueil
            </button>
            {role === "1" && (
              <>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/creation-profil-client")}>
                  <MdAssignment className="mr-2" /> Créer un nouveau client
                </button>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/liste-clients")}>
                  <MdPerson className="mr-2" /> Liste des clients
                </button>
                <hr className="border-gray-600" />
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/formulaire-devis")}>
                  <MdAssignment className="mr-2" /> Créer un devis
                </button>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/compteur-seances")}>
                  <MdFitnessCenter className="mr-2" /> Suivi des séances
                </button>
                <hr className="border-gray-600" />
              </>
            )}
            <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/offres-coachings")}>
              <MdFitnessCenter className="mr-2" /> Mes offres de coaching
            </button>

            {(role === "1" || role === "3") && (
              <>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/formulaire-donnees-corporelles")}>
                  <MdShowChart className="mr-2" /> Bilan corporel
                </button>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/tableau-des-stats")}>
                  <MdShowChart className="mr-2" /> Statistiques et performances
                </button>
                <hr className="border-gray-600" />
              </>
            )}

            {role && (
              <>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/tableau-berger")}>
                  <MdShowChart className="mr-2" /> Calculer sa RM
                </button>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/vma-tapis")}>
                  <MdShowChart className="mr-2" /> Calculer sa VMA
                </button>
                <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/tabata-chrono")}>
                  <MdTimer className="mr-2" /> Tabata Chronomètre
                </button>
              </>
            )}

            <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/test-de-composant")}>
              <MdAssignment className="mr-2" /> Test du composant
            </button>
          </div>
        </div>
        <div className="mt-8">
          <button onClick={handleLogout} className="flex items-center text-left py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
            <MdLogout className="mr-2" /> Déconnexion
          </button>
        </div>
      </div>

      {/* Burger Menu Button for Mobile */}
      <button className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-md mt-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <MdMenu size={24} />
      </button>

      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main content */}
      <div className="flex-grow p-8 bg-gray-100">
        {/* This will render the content for each route */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;