import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import FormulaireDevis from "./Components/FormulaireDevis";
import InvoiceFormPreview from "./Components/CreationDuDevis";
import TableauBerger from "./pages/TableauBerger"; // Nouveau composant pour le tableau de RM
import FormulaireDonneesCorporelles from "./pages/FormulaireDonneesCorporelles"; // Nouveau composant pour les mensurations
import generatePDF from "./Functions/generatePDF";

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
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/formulaire-devis" element={!showPreview ? <FormulaireDevis onGenerateInvoice={handleGenerateInvoice} /> : <InvoiceFormPreview clientInfo={invoice.clientInfo} items={invoice.items} entrepriseInfo={invoice.entrepriseInfo} onEdit={handleEditInvoice} />} />
        <Route path="/tableau-berger" element={<TableauBerger />} />
        <Route path="/formulaire-donnees-corporelles" element={<FormulaireDonneesCorporelles />} />
        <Route path="/invoice-preview" element={<InvoiceFormPreview clientInfo={invoice?.clientInfo} items={invoice?.items} entrepriseInfo={entrepriseInfo} onEdit={handleEditInvoice} />} />
      </Routes>
    </Router>
  );
}

export default App;
