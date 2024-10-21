import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MdLogout, MdMenu, MdHome, MdPerson, MdBarChart, MdAssignment, MdFitnessCenter, MdShowChart, MdTimer } from "react-icons/md";
import "tailwindcss/tailwind.css";
import logo from "../assets/Blancsolo.png";
import Header from "../Components/Header";

const Menu = () => {
  const navigate = useNavigate();
  const { userRole, isAuthenticated, refreshUserRole, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // État pour la largeur de la fenêtre

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirige vers /dashboard si authentifié
    } else {
      navigate("/"); // Redirige vers / si non authentifié
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
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mettre à jour la largeur de la fenêtre lors des changements de taille
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Nettoyage de l'écouteur d'événements
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
    // A REMPLACER PAR UN RETOUR SUR LA LANDING PAGE d'arriver en public
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <div className={`fixed md:static inset-0 md:w-64 md:min-w-[300px] bg-gray-800 text-white flex flex-col p-4 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 h-screen`}>
        <div className="flex md:flex-grow flex-col justify-between h-full ">
          <div
            className="flex items-center justify-end gap-2 md:justify-center  md:mt-8 md:mb-16"
            onClick={handleLogoClick} // Ajoutez le gestionnaire de clic
          >
            <img
              src={logo}
              alt="Logo"
              className="h-10 cursor-pointer" // Ajustez la taille selon vos besoins
            />

            <h2 className="text-2xl font-bold text-left cursor-pointer">DASHBOARD</h2>
          </div>
          <div className="flex flex-col space-y-2 md:space-y-4 md:h-full">
            <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/")}>
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
                  <MdShowChart className="mr-2" /> Creation de programme
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
              </>
            )}

            <button
              className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
              onClick={() => {
                navigate("/dashboard/test-de-composant");
                closeSidebar();
              }}
            >
              <MdAssignment className="mr-2" /> Test du composant
            </button>
          </div>{" "}
          <div className="mt-8">
            <button onClick={handleLogout} className="w-full flex items-center md:justify-center justify-end  py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
              <MdLogout className="mr-2" /> Déconnexion
            </button>
          </div>
        </div>
      </div>
      {/* FIN SIDE BAR QUI DOIT ETRE FIXE ET PRENDRE LA HAUTEUR DU SCREEN */}

      {/* Burger Menu Button for Mobile */}
      <button className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-md " onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <MdMenu size={24} />
      </button>

      {/* Overlay for Sidebar on Mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Dynamic Page Area */}
      <div className="flex-grow  w-screen  overflow-y-scroll">
        {/* {windowWidth > 768 ? <Header className="shadow-lg" /> : null} */}
        {windowWidth > 768 ? <Header /> : null} {/* Utilisez le nouveau composant Header ici */}
        <div className="h-fit p-8 md:p-16 bg-gray-100 ">
          {/* PREND LE RESTE DE LA DIV en H-fit*/}
          {/* //! Essaye de creer quelque chose de sympa avec les memes espacements entre tous. */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Menu;

// CODE DU 14 10 2024

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { MdLogout, MdMenu, MdHome, MdPerson, MdBarChart, MdAssignment, MdFitnessCenter, MdShowChart, MdTimer } from "react-icons/md";
// import "tailwindcss/tailwind.css";
// import Header from "../Components/Header";

// const Menu = () => {
//   const navigate = useNavigate();
//   const { userRole, isAuthenticated, refreshUserRole, logout } = useAuth();
//   const [role, setRole] = useState(null);
//   const [currentDateTime, setCurrentDateTime] = useState(new Date());
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (isAuthenticated) {
//       refreshUserRole();
//       setRole(userRole);
//     }
//   }, [userRole, isAuthenticated, refreshUserRole]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
//           <h1 className="text-4xl font-bold mb-8">Chargement du menu...</h1>
//         </div>
//       </div>
//     );
//   }

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className={fixed md:static inset-0 md:w-64 md:min-w-[200px] bg-gray-800 text-white flex flex-col p-4 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 h-full md:h-auto}>
//         <div className="flex-grow">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-2xl font-bold">MSX Fitness App</h2>
//           </div>

//           <div className="flex flex-col space-y-4">
//             <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/home")}>
//               <MdHome className="mr-2" /> Accueil
//             </button>
//             {role === "1" && (
//               <>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/creation-profil-client")}>
//                   <MdAssignment className="mr-2" /> Créer un nouveau client
//                 </button>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/liste-clients")}>
//                   <MdPerson className="mr-2" /> Liste des clients
//                 </button>
//                 <hr className="border-gray-600" />
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/formulaire-devis")}>
//                   <MdAssignment className="mr-2" /> Créer un devis
//                 </button>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/compteur-seances")}>
//                   <MdFitnessCenter className="mr-2" /> Suivi des séances
//                 </button>
//                 <hr className="border-gray-600" />
//               </>
//             )}

//             <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/offres-coachings")}>
//               <MdFitnessCenter className="mr-2" /> Mes offres de coaching
//             </button>

//             {(role === "1" || role === "3") && (
//               <>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/formulaire-donnees-corporelles")}>
//                   <MdShowChart className="mr-2" /> Bilan corporel
//                 </button>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/tableau-des-stats")}>
//                   <MdShowChart className="mr-2" /> Statistiques et performances
//                 </button>
//                 <hr className="border-gray-600" />
//               </>
//             )}

//             {role && (
//               <>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/tableau-berger")}>
//                   <MdShowChart className="mr-2" /> Calculer sa RM
//                 </button>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/vma-tapis")}>
//                   <MdShowChart className="mr-2" /> Calculer sa VMA
//                 </button>
//                 <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/tabata-chrono")}>
//                   <MdTimer className="mr-2" /> Tabata Chronomètre
//                 </button>
//               </>
//             )}

//             <button className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700" onClick={() => navigate("/test-de-composant")}>
//               <MdAssignment className="mr-2" /> Test du composant
//             </button>
//           </div>
//         </div>
//         <div className="mt-8">
//           <button onClick={handleLogout} className="flex items-center text-left py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
//             <MdLogout className="mr-2" /> Déconnexion
//           </button>
//         </div>
//       </div>

//       {/* Burger Menu Button for Mobile */}
//       <button className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-md mt-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//         <MdMenu size={24} />
//       </button>

//       {/* Overlay for Sidebar on Mobile */}
//       {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

//       {/* Dynamic Page Area */}
//       <div className="flex-grow">
//         <Header className="shadow-lg" />

//         <Outlet />

//         <div className="flex-grow h-full p-8 bg-gray-100">
//           <div className="bg-white p-8 rounded-lg shadow-lg">
//             <h1 className="text-4xl font-bold mb-8">Bienvenue dans votre espace de gestion</h1>
//             <p className="text-xl mb-4">
//               Date et heure actuelles : {currentDateTime.toLocaleDateString("fr-FR")} - {currentDateTime.toLocaleTimeString("fr-FR")}
//             </p>
//             <p className="text-lg">Sélectionnez une option à gauche pour commencer.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Menu
