import React, { useState } from "react";
import { HashRouter as Router } from "react-router-dom"; // Import du HashRouter
import InvoiceForm2 from "./Components/InvoiceForm2";
import InvoiceFormPreview from "./Components/InvoicePreview2";
import generatePDF from "./Functions/generatePDF";

function App() {
  const [invoice, setInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const entrepriseInfo = {
    nom: process.env.REACT_APP_ENTREPRISE_NOM || "",
    directeur: process.env.REACT_APP_ENTREPRISE_DIRECTEUR || "",
    adresse: process.env.REACT_APP_ENTREPRISE_ADRESSE || "",
    siret: process.env.REACT_APP_ENTREPRISE_SIRET || "",
    codePostal: process.env.REACT_APP_ENTREPRISE_CODE_POSTAL || "",
    ville: process.env.REACT_APP_ENTREPRISE_VILLE || "",
    telephone: process.env.REACT_APP_ENTREPRISE_TELEPHONE || "",
    email: process.env.REACT_APP_ENTREPRISE_MAIL || "",
    fonction: process.env.REACT_APP_ENTREPRISE_FONCTION || "",
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

  const handleDownloadInvoice = () => {
    if (invoice) {
      generatePDF(invoice);
    } else {
      console.error("No invoice data available for download.");
    }
  };

  const handleEditInvoice = () => {
    setShowPreview(false);
  };

  return (
    <Router>
      <div>{!showPreview ? <InvoiceForm2 onGenerateInvoice={handleGenerateInvoice} /> : <InvoiceFormPreview clientInfo={invoice.clientInfo} items={invoice.items} entrepriseInfo={invoice.entrepriseInfo} onEdit={handleEditInvoice} />}</div>
    </Router>
  );
}

export default App;
