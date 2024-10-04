import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaDollarSign, FaRunning, FaUser, FaChartLine, FaCog, FaDumbbell, FaRegEye, FaStore, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importer les icônes souhaitées
import MenuBurger from "./MenuBurger";
import Blanc from "../../assets/Blancsolo.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen, logoSrc }) => {
  const [isTrainingOpen, setIsTrainingOpen] = useState(false); // État pour gérer l'ouverture du sous-menu Entraînement

  useEffect(() => {
    const handleKeyDownEvent = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDownEvent);
    return () => window.removeEventListener("keydown", handleKeyDownEvent);
  }, [setSidebarOpen]);

  return (
    <>
      <aside className={`flex h-screen w-auto flex-col bg-slate-800 text-white duration-300 ease-linear`}>
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear w-96">
          <NavLink to="/" className="w-full flex justify-center mt-8">
            <img src={Blanc} alt="Logo" className="w-40 h-40" />
          </NavLink>
          <nav className="mt-5 py-4  w-full">
            <h3 className="mb-6 ml-6 text-base font-semibold text-bodydark2">MENU</h3>
            <ul className="mb-6 flex flex-col px-8 w-full space-y">
              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaRegEye className="text-bodydark1" /> {/* Icône Vue globale */}
                <p>Vue globale</p>
              </NavLink>

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaTachometerAlt className="text-bodydark1" /> {/* Icône Suivi des performances */}
                <p>Performances de l'entreprise</p>
              </NavLink>

              <hr className="my-2 border-gray-500" />

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaUsers className="text-bodydark1" /> {/* Icône Clients */}
                <p>Clients</p>
              </NavLink>

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaChartLine className="text-bodydark1" /> {/* Icône Evolution Clients */}
                <p>Suivi des clients</p>
              </NavLink>

              <hr className="my-2 border-gray-500" />

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaStore className="text-bodydark1" /> {/* Icône Les Offres - Marché */}
                <p>Les Offres</p>
              </NavLink>

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaDollarSign className="text-bodydark1" /> {/* Icône Suivi des Paiements - Dollar */}
                <p>Suivi des paiements</p>
              </NavLink>

              <hr className="my-2 border-gray-500" />

              {/* Bouton Entraînement avec flèche */}
              <div className="flex items-center justify-between cursor-pointer px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-slate-500 hover:bg-opacity-45" onClick={() => setIsTrainingOpen(!isTrainingOpen)}>
                <div className="flex items-center gap-2.5">
                  <FaRunning className="text-bodydark1" /> {/* Icône Entrainement */}
                  <p>Entraînement</p>
                </div>
                {isTrainingOpen ? <FaChevronUp className="text-bodydark1" /> : <FaChevronDown className="text-bodydark1" />}
              </div>

              {/* Sous-menu d'Entraînement */}
              {isTrainingOpen && (
                <div className="px-7">
                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Exercices</p>
                  </NavLink>

                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Programmes</p>
                  </NavLink>
                </div>
              )}
              {/* Fin Sous-menu d'Entrainement */}

              <hr className="my-2 border-gray-500" />

              {/* Bouton Formulaire avec flèche */}
              <div className="flex items-center justify-between cursor-pointer px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-slate-500 hover:bg-opacity-45" onClick={() => setIsTrainingOpen(!isTrainingOpen)}>
                <div className="flex items-center gap-2.5">
                  <FaRunning className="text-bodydark1" /> {/* Icône Entrainement */}
                  <p>Formulaires</p>
                </div>
                {isTrainingOpen ? <FaChevronUp className="text-bodydark1" /> : <FaChevronDown className="text-bodydark1" />}
              </div>

              {/* Sous-menu d'Entraînement */}
              {isTrainingOpen && (
                <div className="px-7">
                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Inscription</p>
                  </NavLink>

                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Entretien Client</p>
                  </NavLink>

                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Bilan Corporelle & Mensurations</p>
                  </NavLink>

                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Bilan Test Effort </p>
                  </NavLink>

                  <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-gray-400 hover:text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                    <p>Repertoire RM - Exercice </p>
                  </NavLink>
                </div>
              )}
              {/* Fin Sous-menu d'Formaulaire */}

              <hr className="my-2 border-gray-500" />

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out">
                <FaUser className="text-bodydark1" /> {/* Icône Mon Profil */}
                <p>Mon Profil</p>
              </NavLink>

              <NavLink to="#" className="flex items-center gap-2.5 rounded-sm hover:bg-slate-500 hover:bg-opacity-45 hover:rounded-sm px-4 py-2 w-full font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <FaCog className="text-bodydark1" /> {/* Icône Paramètres */}
                <p>Paramètres</p>
              </NavLink>
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex lg:hidden">
        <MenuBurger setSidebarOpen={setSidebarOpen} />
      </div>
    </>
  );
};

export default Sidebar;
