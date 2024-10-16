import React, { useState } from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./services/PrivateRoute";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { OffresCoachingProvider } from "./contexts/OffresCoachingContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Menu from "./pages/Menu";
import FormulaireDevis from "./Components/FormulaireDevis";
import InvoiceFormPreview from "./Components/CreationDuDevis";
import TableauBerger from "./pages/TableauBerger";
import FormulaireDonneesCorporelles from "./pages/FormulaireDonneesCorporelles";
import TestVmaTapis from "./pages/TestVmaTapis";
import SuiviClients from "./pages/SuiviClients";
import TabataChrono from "./pages/TabataChrono";
import ChronoDetail from "./Components/ChronoDetail";
import TestDeComposant from "./pages/TestDeComposant";
import OffresCoachings from "./pages/OffresCoachings";
import TableauDesStats from "./pages/TableauDesStats";
import CreationProfilClient from "./pages/CreationProfilClient";
import ListeClients from "./pages/ListeClients";
import ModifierProfilClient from "./pages/ModifierProfilClient";
import NotFound from "./pages/NotFound";
import FicheClient from "./pages/FicheClient";
import LandingP from "./pages/LandingP";

function App() {
  const [invoice, setInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const entrepriseInfo = {
    nom: process.env.REACT_APP_ENTREPRISE_NOM || "Nom de l'entreprise non défini",
    directeur: process.env.REACT_APP_ENTREPRISE_DIRECTEUR || "Directeur non défini",
    adresse: process.env.REACT_APP_ENTREPRISE_ADRESSE || "Adresse non définie",
    siret: process.env.REACT_APP_ENTREPRISE_SIRET || "SIRET non défini",
    codePostal: process.env.REACT_APP_ENTREPRISE_CODE_POSTAL || "Code postal non défini",
    ville: process.env.REACT_APP_ENTREPRISE_VILLE || "Ville non définie",
    telephone: process.env.REACT_APP_ENTREPRISE_TELEPHONE || "Téléphone non défini",
    email: process.env.REACT_APP_ENTREPRISE_MAIL || "Email non défini",
    fonction: process.env.REACT_APP_ENTREPRISE_FONCTION || "Fonction non définie",
  };

  const handleGenerateInvoice = (clientInfo, items) => {
    if (!clientInfo || !items) {
      console.error("Client info or items are missing.");
      return;
    }

    const enrichedInvoice = {
      clientInfo,
      items,
      entrepriseInfo,
    };
    setInvoice(enrichedInvoice);
    setShowPreview(true);
  };

  const handleEditInvoice = () => {
    setShowPreview(false);
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <OffresCoachingProvider>
          <Router>
            <Routes>
              {/* Route publique pour la Landing Page */}
              <Route path="/" element={<LandingP />} />

              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<Signup />} />

              {/* Routes privées avec Menu comme dashboard principal */}
              <Route
                path="/menu"
                element={
                  <PrivateRoute>
                    <Menu />
                  </PrivateRoute>
                }
              >
                <Route index element={<div>Contenu par défaut du dashboard</div>} />
                <Route path="formulaire-devis" element={<PrivateRoute>{!showPreview ? <FormulaireDevis onGenerateInvoice={handleGenerateInvoice} /> : <InvoiceFormPreview clientInfo={invoice?.clientInfo} items={invoice?.items} entrepriseInfo={invoice?.entrepriseInfo} onEdit={handleEditInvoice} />}</PrivateRoute>} />
                <Route
                  path="tableau-berger"
                  element={
                    <PrivateRoute>
                      <TableauBerger />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="formulaire-donnees-corporelles"
                  element={
                    <PrivateRoute>
                      <FormulaireDonneesCorporelles />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="vma-tapis"
                  element={
                    <PrivateRoute>
                      <TestVmaTapis />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="compteur-seances"
                  element={
                    <PrivateRoute>
                      <SuiviClients />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="tabata-chrono"
                  element={
                    <PrivateRoute>
                      <TabataChrono />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="chrono/:id"
                  element={
                    <PrivateRoute>
                      <ChronoDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="tableau-des-stats"
                  element={
                    <PrivateRoute>
                      <TableauDesStats />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="offres-coachings"
                  element={
                    <PrivateRoute>
                      <OffresCoachings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="creation-profil-client/:id?"
                  element={
                    <PrivateRoute requiredRoles={[1]}>
                      <CreationProfilClient />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="fiche-client/:id?"
                  element={
                    <PrivateRoute requiredRoles={[1]}>
                      <FicheClient />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="modifier-profil-client/:id"
                  element={
                    <PrivateRoute requiredRoles={[1]}>
                      <ModifierProfilClient />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="liste-clients"
                  element={
                    <PrivateRoute requiredRoles={[1]}>
                      <ListeClients />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="test-de-composant"
                  element={
                    <PrivateRoute>
                      <TestDeComposant />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </OffresCoachingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

// import React, { useState } from "react";
// import { HashRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./services/PrivateRoute";
// import { NotificationProvider } from "./contexts/NotificationContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import { OffresCoachingProvider } from "./contexts/OffresCoachingContext";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Logout from "./pages/Logout";
// import Menu from "./pages/Menu";
// import FormulaireDevis from "./Components/FormulaireDevis";
// import InvoiceFormPreview from "./Components/CreationDuDevis";
// import TableauBerger from "./pages/TableauBerger";
// import FormulaireDonneesCorporelles from "./pages/FormulaireDonneesCorporelles";
// import TestVmaTapis from "./pages/TestVmaTapis";
// import SuiviClients from "./pages/SuiviClients";
// import TabataChrono from "./pages/TabataChrono";
// import ChronoDetail from "./Components/ChronoDetail";
// import TestDeComposant from "./pages/TestDeComposant";
// import OffresCoachings from "./pages/OffresCoachings";
// import TableauDesStats from "./pages/TableauDesStats";
// import CreationProfilClient from "./pages/CreationProfilClient";
// import ListeClients from "./pages/ListeClients";
// import ModifierProfilClient from "./pages/ModifierProfilClient";
// import NotFound from "./pages/NotFound";
// import FicheClient from "./pages/FicheClient";
// import LandingP from "./pages/LandingP";

// function App() {
//   const [invoice, setInvoice] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   const entrepriseInfo = {
//     nom: process.env.REACT_APP_ENTREPRISE_NOM || "Nom de l'entreprise non défini",
//     directeur: process.env.REACT_APP_ENTREPRISE_DIRECTEUR || "Directeur non défini",
//     adresse: process.env.REACT_APP_ENTREPRISE_ADRESSE || "Adresse non définie",
//     siret: process.env.REACT_APP_ENTREPRISE_SIRET || "SIRET non défini",
//     codePostal: process.env.REACT_APP_ENTREPRISE_CODE_POSTAL || "Code postal non défini",
//     ville: process.env.REACT_APP_ENTREPRISE_VILLE || "Ville non définie",
//     telephone: process.env.REACT_APP_ENTREPRISE_TELEPHONE || "Téléphone non défini",
//     email: process.env.REACT_APP_ENTREPRISE_MAIL || "Email non défini",
//     fonction: process.env.REACT_APP_ENTREPRISE_FONCTION || "Fonction non définie",
//   };

//   const handleGenerateInvoice = (clientInfo, items) => {
//     if (!clientInfo || !items) {
//       console.error("Client info or items are missing.");
//       return;
//     }

//     const enrichedInvoice = {
//       clientInfo,
//       items,
//       entrepriseInfo,
//     };
//     setInvoice(enrichedInvoice);
//     setShowPreview(true);
//   };

//   const handleEditInvoice = () => {
//     setShowPreview(false);
//   };

//   return (
//     <AuthProvider>
//       <NotificationProvider>
//         <OffresCoachingProvider>
//           <Router>
//             <Routes>
//               {/* Routes publiques */}
//               <Route path="/" element={<Login />} />
//               <Route path="/logout" element={<Logout />} />
//               <Route path="/signup" element={<Signup />} />

//               {/* Routes privées avec Menu comme dashboard principal */}
//               <Route
//                 path="/menu"
//                 element={
//                   <PrivateRoute>
//                     <Menu />
//                   </PrivateRoute>
//                 }
//               >
//                 <Route index element={<div>Contenu par défaut du dashboard</div>} />
//                 <Route path="formulaire-devis" element={<PrivateRoute>{!showPreview ? <FormulaireDevis onGenerateInvoice={handleGenerateInvoice} /> : <InvoiceFormPreview clientInfo={invoice?.clientInfo} items={invoice?.items} entrepriseInfo={invoice?.entrepriseInfo} onEdit={handleEditInvoice} />}</PrivateRoute>} />

//                 {/* //! NE PAS METTRE LA LANDING PAGE EN PRIVATE, la mettre direct accesible sur le site ! */}
//                 <Route
//                   path="landing-page"
//                   element={
//                     <PrivateRoute>
//                       <LandingP />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="tableau-berger"
//                   element={
//                     <PrivateRoute>
//                       <TableauBerger />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="formulaire-donnees-corporelles"
//                   element={
//                     <PrivateRoute>
//                       <FormulaireDonneesCorporelles />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="vma-tapis"
//                   element={
//                     <PrivateRoute>
//                       <TestVmaTapis />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="compteur-seances"
//                   element={
//                     <PrivateRoute>
//                       <SuiviClients />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="tabata-chrono"
//                   element={
//                     <PrivateRoute>
//                       <TabataChrono />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="chrono/:id"
//                   element={
//                     <PrivateRoute>
//                       <ChronoDetail />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="tableau-des-stats"
//                   element={
//                     <PrivateRoute>
//                       <TableauDesStats />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="offres-coachings"
//                   element={
//                     <PrivateRoute>
//                       <OffresCoachings />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="creation-profil-client/:id?"
//                   element={
//                     <PrivateRoute requiredRoles={[1]}>
//                       <CreationProfilClient />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="fiche-client/:id?"
//                   element={
//                     <PrivateRoute requiredRoles={[1]}>
//                       <FicheClient />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="modifier-profil-client/:id"
//                   element={
//                     <PrivateRoute requiredRoles={[1]}>
//                       <ModifierProfilClient />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="liste-clients"
//                   element={
//                     <PrivateRoute requiredRoles={[1]}>
//                       <ListeClients />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="test-de-composant"
//                   element={
//                     <PrivateRoute>
//                       <TestDeComposant />
//                     </PrivateRoute>
//                   }
//                 />
//               </Route>

//               {/* Catch-all route for 404 */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Router>
//         </OffresCoachingProvider>
//       </NotificationProvider>
//     </AuthProvider>
//   );
// }

// export default App;
