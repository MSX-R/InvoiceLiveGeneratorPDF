import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MdLogout, MdMenu, MdHome, MdPerson, MdAssignment, MdFitnessCenter, MdShowChart, MdTimer } from "react-icons/md";
import "tailwindcss/tailwind.css";
import logo from "../assets/Blancsolo.png";
import Header from "../Components/Header";

const Menu = () => {
  const navigate = useNavigate();
  const { userRole, isAuthenticated, refreshUserRole, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserRole();
      setRole(userRole);
    }
  }, [userRole, isAuthenticated, refreshUserRole]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen h-screen">
      {/* Sidebar */}
      <div className={`fixed md:static inset-0 md:w-64 md:min-w-[300px] bg-gray-800 text-white flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 h-screen md:h-full`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 md:justify-center px-4 mt-8 mb-8 cursor-pointer" onClick={handleLogoClick}>
            <img src={logo} alt="Logo" className="h-10" />
            <h2 className="text-2xl font-bold">MSXFIT</h2>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col space-y-2 md:space-y-4">
              <button
                className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                onClick={() => {
                  navigate("/");
                  closeSidebar();
                }}
              >
                <MdHome className="mr-2" /> Site Public
              </button>
              {role === "1" && (
                <>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/creation-profil-client");
                      closeSidebar();
                    }}
                  >
                    <MdAssignment className="mr-2" /> Créer un nouveau client
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/liste-clients");
                      closeSidebar();
                    }}
                  >
                    <MdPerson className="mr-2" /> Liste des clients
                  </button>
                  <hr className="border-gray-600" />
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/formulaire-devis");
                      closeSidebar();
                    }}
                  >
                    <MdAssignment className="mr-2" /> Créer un devis
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/compteur-seances");
                      closeSidebar();
                    }}
                  >
                    <MdFitnessCenter className="mr-2" /> Suivi des séances
                  </button>
                  <hr className="border-gray-600" />
                </>
              )}
              <button
                className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                onClick={() => {
                  navigate("/dashboard/offres-coachings");
                  closeSidebar();
                }}
              >
                <MdFitnessCenter className="mr-2" /> Mes offres de coaching
              </button>
              {(role === "1" || role === "3") && (
                <>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/formulaire-donnees-corporelles");
                      closeSidebar();
                    }}
                  >
                    <MdShowChart className="mr-2" /> Bilan corporel
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/tableau-des-stats");
                      closeSidebar();
                    }}
                  >
                    <MdShowChart className="mr-2" /> Statistiques et performances
                  </button>
                  <hr className="border-gray-600" />
                </>
              )}
              {role && (
                <>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/creation-programme");
                      closeSidebar();
                    }}
                  >
                    <MdShowChart className="mr-2" /> Création de programme
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/tableau-berger");
                      closeSidebar();
                    }}
                  >
                    <MdShowChart className="mr-2" /> Calculer sa RM
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/vma-tapis");
                      closeSidebar();
                    }}
                  >
                    <MdShowChart className="mr-2" /> Calculer sa VMA
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/tabata-chrono");
                      closeSidebar();
                    }}
                  >
                    <MdTimer className="mr-2" /> Tabata Chronomètre
                  </button>
                  <button
                    className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
                    onClick={() => {
                      navigate("/dashboard/questionnaire-entretien");
                      closeSidebar();
                    }}
                  >
                    <MdShowChart className="mr-2" /> Questionnaire Entretien
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="py-4">
            <button onClick={handleLogout} className="w-full flex items-center justify-center py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
              <MdLogout className="mr-2" /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Burger Menu Button for Mobile */}
      {/* <button className={`md:hidden fixed top-4 ${isSidebarOpen ? "right-4" : "left-4"} z-30 p-2 bg-gray-800 text-white rounded-md`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <MdMenu size={24} />
      </button> */}

      {/* Overlay for Sidebar on Mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Dynamic Page Area */}
      <div className="flex-grow w-screen overflow-y-auto bg-gray-100">
        {windowWidth > 768 ? (
          <Header />
        ) : (
          <div className="h-fit p-4 bg-gray-700">
            {" "}
            <button className={`md:hidden   z-30 p-2 bg-gray-800 text-white rounded-md`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MdMenu size={24} />
            </button>
          </div>
        )}
        <div className=" w-full mx-auto  p-4  md:p-6 min-h-screen h-fit bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Menu;
