// App.js
import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from './services/PrivateRoute';
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider } from './contexts/AuthContext';
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Menu from "./pages/Menu";
import Header from './Components/Header';
import FormulaireDevis from "./Components/FormulaireDevis";
import InvoiceFormPreview from "./Components/CreationDuDevis";
import TableauBerger from "./pages/TableauBerger";
import FormulaireDonneesCorporelles from "./pages/FormulaireDonneesCorporelles";
import TestVmaTapis from "./pages/TestVmaTapis";
import SuiviClients from "./pages/SuiviClients"; // Importation du suivi des clients
import TabataChrono from "./pages/TabataChrono"; // Importation du nouveau composant TabataChrono
import ChronoDetail from "./Components/ChronoDetail"; // Importation du nouveau composant ChronoDetail

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
        <Router>
          <Header />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Route privées */}
            <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
            <Route path="/formulaire-devis" element={<PrivateRoute>{!showPreview ? <FormulaireDevis onGenerateInvoice={handleGenerateInvoice} /> : <InvoiceFormPreview clientInfo={invoice?.clientInfo} items={invoice?.items} entrepriseInfo={invoice?.entrepriseInfo} onEdit={handleEditInvoice} />}</PrivateRoute>} />
            <Route path="/tableau-berger" element={<PrivateRoute><TableauBerger /></PrivateRoute>} />
            <Route path="/formulaire-donnees-corporelles" element={<PrivateRoute><FormulaireDonneesCorporelles /></PrivateRoute>} />
            <Route path="/vma-tapis" element={<PrivateRoute><TestVmaTapis /></PrivateRoute>} />
            <Route path="/invoice-preview" element={<PrivateRoute><InvoiceFormPreview clientInfo={invoice?.clientInfo} items={invoice?.items} entrepriseInfo={invoice?.entrepriseInfo} onEdit={handleEditInvoice} /></PrivateRoute>} />
            <Route path="/compteur-seances" element={<PrivateRoute><SuiviClients /></PrivateRoute>} />
            <Route path="/tabata-chrono" element={<PrivateRoute><TabataChrono /></PrivateRoute>} />
            <Route path="/chrono/:id" element={<PrivateRoute><ChronoDetail /></PrivateRoute>} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
