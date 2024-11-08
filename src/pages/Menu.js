import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MdLogout, MdHome } from "react-icons/md";
import "tailwindcss/tailwind.css";
import logoW from "../assets/Blancsolo.png";
import profilPicture from "../assets/coach.jpg";

import Header from "../Components/Header";
import menuButtons from "../config/menu.json"; // Importation du fichier JSON contenant les boutons

// Importation des icônes
import { FaUsers, FaChartLine, FaClipboardList, FaFileInvoice, FaStopwatch } from "react-icons/fa";
import { MdAssignment, MdClose, MdMenu, MdFitnessCenter, MdShowChart, MdTimer } from "react-icons/md";

// Définir iconMapping
const iconMapping = {
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaFileInvoice,
  FaStopwatch,
  MdAssignment,
  MdClose,
  MdMenu,
  MdFitnessCenter,
  MdShowChart,
  MdTimer,
};

const Menu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, refreshUserRole, logout, isAdmin, loggedUser } = useAuth();
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserRole();
      setRole(isAdmin() ? "admin" : "client");
    }
  }, [isAuthenticated, refreshUserRole, isAdmin]);

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

  // Fonction pour regrouper les boutons par type
  const groupByType = (menuButtons) => {
    return menuButtons.reduce((groups, button) => {
      const { type } = button;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(button);
      return groups;
    }, {});
  };

  // Regroupez les boutons par type
  const groupedButtons = groupByType(menuButtons);

  return (
    <div className="flex min-h-screen h-screen md:p-4 gap-4 bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed md:static rounded-md inset-0 md:w-64 md:min-w-[300px] bg-gray-800 text-white flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 h-screen md:h-full`}>
        <div className={`flex flex-col h-full ${windowWidth <= 768 ? "pt-[5rem] " : "py-8 gap-8"}`}>
          {/* Sidebar Header */}
          <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}>
            <img src={logoW} alt="Logo" className="hidden md:block md:h-20" />
            <h2 className="hidden md:block sm:text-2xl md:text-5xl font-bold">MSXFIT</h2>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col space-y-2 md:space-y-4">
              <button
                className="flex items-center text-left py-2 px-8 rounded-md hover:bg-gray-700"
                onClick={() => {
                  navigate("/");
                  setIsSidebarOpen(false);
                }}
              >
                <MdHome className="mr-2" size={24} /> Site Public
              </button>
              <button
                className="flex items-center text-left py-2 px-8 rounded-md hover:bg-gray-700"
                onClick={() => {
                  navigate("/Dashboard/Dashboard2");
                  setIsSidebarOpen(false);
                }}
              >
                <MdHome className="mr-2" size={24} /> Dashboard2
              </button>
              <div className="border-b border-gray-600 my-2"></div> {/* Ligne de séparation après le lien Site Public */}
              {/* Parcourir les types de boutons et les afficher */}
              {Object.entries(groupedButtons).map(([type, buttons]) => {
                const hasVisibleButtons = buttons.some((button) => (role === "admin" && button.onDashboardAdmin) || (role === "client" && button.onDashboardClient));

                return (
                  <React.Fragment key={type}>
                    {hasVisibleButtons && (
                      <>
                        <div className="font-bold text-lg mt-4 ml-4 text-left uppercase">{type.charAt(0).toUpperCase() + type.slice(1)}</div> {/* Afficher le type */}
                        {buttons.map((button, buttonIndex) => {
                          const canView = (role === "admin" && button.onDashboardAdmin) || (role === "client" && button.onDashboardClient);
                          if (canView) {
                            return (
                              <button
                                key={buttonIndex}
                                className="flex items-center text-left py-2 px-8 rounded-md hover:bg-gray-700"
                                onClick={() => {
                                  navigate(button.path);
                                  setIsSidebarOpen(false);
                                }}
                              >
                                {React.createElement(iconMapping[button.icon], { size: 24, className: "mr-2" })} {button.label}
                              </button>
                            );
                          }
                          return null;
                        })}
                        <div className="border-b border-gray-600 my-2"></div> {/* Ligne de séparation après chaque type */}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="py-4">
            <button onClick={handleLogout} className="w-full flex items-center justify-center py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
              <MdLogout className="mr-2" size={24} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Page Area */}
      <div className="flex flex-col w-screen h-full gap-4 overflow-y-auto bg-gray-100">
        {windowWidth > 768 ? <Header /> : null}
        <div className={`w-full mx-auto px-4 pb-4 md:p-0 bg-gray-100 md:top-32 ${windowWidth <= 768 ? "pt-[5rem]" : "pt-0"}`}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      {windowWidth <= 768 && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white shadow-md z-50" style={{ height: "64px" }}>
          <div className="flex items-center space-x-2">
            <button className="bg-gray-800 text-white p-2 rounded-full shadow-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}>
              <h2 className="text-2xl font-bold">MSXFIT</h2>
            </div>
          </div>
          <div className="flex row gap-2 justify-center items-center">
            <p className="text-xs text-right flex flex-col">
              <span className="font-medium">{loggedUser.prenom}</span>{" "}
              <span className="" style={{ fontSize: "10px" }}>
                {loggedUser.role_nom}
              </span>
            </p>
            <img src={profilPicture} alt="userpicture" className="h-10 rounded-full border-2 border-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;

// import React, { useEffect, useState } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { MdLogout, MdHome } from "react-icons/md";
// import "tailwindcss/tailwind.css";
// import logo from "../assets/Blancsolo.png";
// import Header from "../Components/Header";
// import menuButtons from "../config/menu.json"; // Importation du fichier JSON contenant les boutons

// // Importation des icônes
// import { FaUsers, FaChartLine, FaClipboardList, FaFileInvoice, FaStopwatch } from "react-icons/fa";
// import { MdAssignment, MdClose, MdMenu, MdFitnessCenter, MdShowChart, MdTimer } from "react-icons/md"; // Assurez-vous d'importer toutes les icônes utilisées

// // Définir iconMapping
// const iconMapping = {
//   FaUsers,
//   FaChartLine,
//   FaClipboardList,
//   FaFileInvoice,
//   FaStopwatch,
//   MdAssignment,
//   MdClose,
//   MdMenu,
//   MdFitnessCenter,
//   MdShowChart,
//   MdTimer,
// };

// const Menu = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, refreshUserRole, logout, isAdmin } = useAuth();
//   const [role, setRole] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     if (isAuthenticated) {
//       refreshUserRole();
//       setRole(isAdmin() ? "admin" : "client");
//     }
//   }, [isAuthenticated, refreshUserRole, isAdmin]);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
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
//     navigate("/");
//   };

//   return (
//     <div className="flex min-h-screen h-screen md:p-4 gap-4 bg-gray-100">
//       {/* Sidebar */}
//       <div className={`fixed md:static rounded-md inset-0 md:w-64 md:min-w-[300px] bg-gray-800 text-white flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 h-screen md:h-full`}>
//         <div className="flex flex-col h-full">
//           {/* Sidebar Header */}
//           <div className="flex justify-between items-center px-4 mt-8 mb-8">
//             <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}>
//               <img src={logo} alt="Logo" className="h-10" />
//               <h2 className="text-2xl font-bold">MSXFIT</h2>
//             </div>

//             {/* Close Button for Mobile */}
//             <button className="md:hidden text-gray-500 bg-white rounded-full p-2 shadow-lg" onClick={() => setIsSidebarOpen(false)}>
//               <MdClose size={24} />
//             </button>
//           </div>

//           {/* Sidebar Menu */}
//           <div className="flex-grow overflow-y-auto">
//             <div className="flex flex-col space-y-2 md:space-y-4">
//               <button
//                 className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
//                 onClick={() => {
//                   navigate("/");
//                   setIsSidebarOpen(false);
//                 }}
//               >
//                 <MdHome className="mr-2" size={24} /> Site Public
//               </button>
//               {/* Map through the menuButtons */}
//               {menuButtons.map((button, index) => {
//                 const canView = (role === "admin" && button.onDashboardAdmin) || (role === "client" && button.onDashboardClient);
//                 if (canView) {
//                   return (
//                     <React.Fragment key={index}>
//                       {index > 0 && menuButtons[index - 1].type !== button.type && (
//                         <div className="border-b border-gray-600 my-2"></div> // Ligne de séparation
//                       )}
//                       <button
//                         className="flex items-center text-left py-2 px-4 rounded-md hover:bg-gray-700"
//                         onClick={() => {
//                           navigate(button.path);
//                           setIsSidebarOpen(false);
//                         }}
//                       >
//                         {React.createElement(iconMapping[button.icon], { size: 24, className: "mr-2" })} {button.label}
//                       </button>
//                     </React.Fragment>
//                   );
//                 }
//                 return null;
//               })}
//             </div>
//           </div>

//           {/* Sidebar Footer */}
//           <div className="py-4">
//             <button onClick={handleLogout} className="w-full flex items-center justify-center py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
//               <MdLogout className="mr-2" size={24} /> Déconnexion
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Dynamic Page Area */}
//       <div className="flex flex-col w-screen h-full gap-4 overflow-y-auto bg-gray-100">
//         {windowWidth > 768 ? <Header /> : null}
//         <div className="w-full mx-auto px-4 pb-4 md:p-0 h-fit md:h-full bg-gray-100 md:top-32">
//           <Outlet />
//         </div>
//       </div>

//       {/* Mobile Menu Toggle Button */}
//       <button className="md:hidden fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//         <MdMenu size={24} />
//       </button>
//     </div>
//   );
// };

// export default Menu;
