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
import DashboardHome from "./Components/DashboardHome";
import FormulaireDevis from "./Components/FormulaireDevis";
import InvoiceFormPreview from "./Components/CreationDuDevis";
import TableauBerger from "./pages/TableauBerger";
import FormulaireDonneesCorporelles from "./pages/FormulaireDonneesCorporelles";
import TestVamevalTapis from "./pages/TestVamevalTapis";
import SuiviClients from "./pages/SuiviClients";
import Chronometres from "./pages/Chronometres";
import ChronoDetail from "./Components/ChronoDetail";
// import TestDeComposant from "./pages/TestDeComposant";
import OffresCoachings from "./pages/OffresCoachings";
import TableauDesStats from "./pages/TableauDesStats";
import CreationProfilClient from "./pages/CreationProfilClient";
import ListeClients from "./pages/ListeClients";
import ModifierProfilClient from "./pages/ModifierProfilClient";
import NotFound from "./pages/NotFound";
import FicheClient from "./pages/FicheClient";
import LandingP from "./pages/LandingP";
import CreationDeProgramme from "./pages/CreationDeProgramme";
import { ClientsProvider } from "./contexts/ClientsContext";
import QuestionnaireEntretien from "./pages/QuestionnaireEntretien";
import TestVamevalPiste from "./pages/TestVamevalPiste";
import TestLucLeger from "./pages/TestLucLeger";

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
          <ClientsProvider>
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
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Menu />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
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
                        <TestVamevalTapis />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="test-vameval-piste"
                    element={
                      <PrivateRoute>
                        <TestVamevalPiste />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="test-luc-leger"
                    element={
                      <PrivateRoute>
                        <TestLucLeger />
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
                        <Chronometres />
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
                    path="questionnaire-entretien"
                    element={
                      <PrivateRoute>
                        <QuestionnaireEntretien />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="creation-programme"
                    element={
                      <PrivateRoute>
                        <CreationDeProgramme />
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
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ClientsProvider>
        </OffresCoachingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
