import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { FaAddressCard, FaPhoneAlt, FaFile, FaArrowLeft } from "react-icons/fa"; // Importer l'icône de retour
import EditModal from "./EditModal";
import TermsModal from "../config/TermsModal";

// Informations de l'entreprise
const entrepriseInfo = {
  nom: process.env.REACT_APP_ENTREPRISE_NOM,
  dirigeant: process.env.REACT_APP_ENTREPRISE_DIRIGEANT,
  siret: process.env.REACT_APP_ENTREPRISE_SIRET,
  cartePro: process.env.REACT_APP_ENTREPRISE_CARTE_PRO,
  adresse: process.env.REACT_APP_ENTREPRISE_ADRESSE,
  codePostal: process.env.REACT_APP_ENTREPRISE_CODE_POSTAL,
  ville: process.env.REACT_APP_ENTREPRISE_VILLE,
  telephone: process.env.REACT_APP_ENTREPRISE_TELEPHONE,
  email: process.env.REACT_APP_ENTREPRISE_EMAIL,
};

const calculateDueDate = (items) => {
  const today = new Date();
  const dueDate = new Date(today);

  if (items.some((item) => item.service?.type === "12weeks")) {
    const nextMonth = today.getMonth() + 1;
    const year = today.getFullYear();

    if (nextMonth > 11) {
      dueDate.setMonth(0);
      dueDate.setFullYear(year + 1);
    } else {
      dueDate.setMonth(nextMonth);
    }

    dueDate.setDate(3);
  } else if (items.some((item) => item.service?.type === "unit" || item.service?.type === "pack")) {
    dueDate.setDate(today.getDate());
  }

  return dueDate.toLocaleDateString("fr-FR");
};

function CreationDuDevis({ clientInfo, items, onEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [updatedClientInfo, setUpdatedClientInfo] = useState(clientInfo);
  const [updatedItems, setUpdatedItems] = useState(items);
  const [showFullText, setShowFullText] = useState(false);

  // États pour les numéros de devis et de facture
  const [quoteNumber, setQuoteNumber] = useState("XXX");
  const [invoiceNumber, setInvoiceNumber] = useState("XXX");

  // État pour la préparation du PDF
  const [isPreparingPDF, setIsPreparingPDF] = useState(false);

  const navigate = useNavigate();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (newClientInfo, newItems) => {
    setUpdatedClientInfo(newClientInfo);
    setUpdatedItems(newItems);
  };

  const handleOpenTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const today = new Date();
  const formattedToday = today.toLocaleDateString("fr-FR");

  const formattedDueDate = calculateDueDate(updatedItems);

  const validityDate = new Date(today);
  validityDate.setDate(today.getDate() + 5);
  const formattedValidityDate = validityDate.toLocaleDateString("fr-FR");

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8 lg:px-12 lg:py-16">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        {/* Icône de retour */}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 transition-colors" aria-label="Retour">
          <FaArrowLeft size={24} />
        </button>

        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Création de document</h2>
        </div>
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:space-x-6 mb-8">
            <div className="flex-1 mb-6">
              <div className="text-gray-700 font-medium mb-2 text-lg text-right">
                <span>Devis N°{quoteNumber ? quoteNumber : "XXX"}</span>
              </div>

              <label htmlFor="quoteNumber" className="block text-gray-700 font-medium mb-2">
                Numéro de devis
              </label>

              <input id="quoteNumber" type="text" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} className="border border-gray-300 p-2 rounded-md w-full text-lg" />
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg font-medium text-gray-900 mb-2">Date du jour : {formattedToday}</p>
            <p className="text-lg font-medium text-gray-700 mb-4">Date d'émission : {formattedToday}</p>
            <p className="text-lg font-medium text-gray-700">Durée de validité (+5 jours) : {formattedValidityDate}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaAddressCard className="text-gray-600 mr-2" />
                <span>CONTRACTANT</span>
              </h4>
              <p className="text-gray-800">{entrepriseInfo.nom}</p>
              <p className="text-gray-600">{entrepriseInfo.dirigeant}</p>
              <p className="text-gray-600">
                {entrepriseInfo.adresse}, {entrepriseInfo.codePostal} {entrepriseInfo.ville}
              </p>
              <p className="text-gray-600 flex items-center">
                <FaPhoneAlt className="text-gray-600 mr-2" />
                {entrepriseInfo.telephone}
              </p>
              <p className="text-gray-600">{entrepriseInfo.email}</p>
              <p className="text-gray-600">SIRET : {entrepriseInfo.siret}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaAddressCard className="text-gray-600 mr-2" />
                <span>CLIENT</span>
              </h4>
              <p className="text-gray-800">
                {updatedClientInfo.nom} {updatedClientInfo.prenom}
              </p>
              <p className="text-gray-600">
                {updatedClientInfo.adresse}, {updatedClientInfo.codePostal} {updatedClientInfo.ville}
              </p>
              <p className="text-gray-600 flex items-center">
                <FaPhoneAlt className="text-gray-600 mr-2" />
                {updatedClientInfo.telephone}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
            <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">Détails</h4>
            {updatedItems.map((item, index) => (
              <div key={index} className="mb-4">
                {console.log(item, "ITEMMEEMEMEMEMEMEM")}
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FaFile className="text-gray-600 mr-2" />
                  <span className="uppercase">Votre Offre</span>
                </h4>
                <p className="text-gray-700">
                  <strong>Nom :</strong> {item.service?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Nombre de séance(s) :</strong> {item.service?.quantity}
                </p>
                <p className="text-gray-700">
                  <strong>Prix Unitaire :</strong> {item.service?.prix}€
                </p>
                <p className="text-gray-700">
                  <strong>Prix Total :</strong> {item.service?.prix * item.service?.quantity}€
                </p>
              </div>
            ))}
          </div>

          <div className="text-gray-600 text-xs text-center mt-8">
            <p>
              <strong>Mentions Légales :</strong>
            </p>
            <p>TVA non applicable, article 293 B du CGI</p>
            <p className="mt-4">
              <strong>Pénalités de Retard :</strong>
            </p>
            <p>{showFullText ? "En cas de non-paiement le jour de la signature du contrat ou dans un délai de trois jours pour les offres de type 'Séance Unitaire' ou 'Pack', des frais de retard seront appliqués. Pour les séances mensualisées, un premier versement équivalant à un tiers du montant total doit être effectué à la signature du contrat. Les paiements restants devront être réglés le 3 de chaque mois suivant. Toutefois, il est également possible de régler la totalité du montant à la signature du contrat. Tout retard de paiement au-delà de ces délais entraînera l'application de pénalités." : "En cas de non-paiement, des frais de retard seront appliqués. Pour plus de détails, voir plus..."}</p>
            <button onClick={toggleText} className="text-blue-600 mt-2">
              {showFullText ? "Voir moins" : "Voir plus"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between items-stretch border-t border-gray-300 pt-6 mt-8 space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button onClick={handleOpenTermsModal} className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex-1">
              Conditions Générales de Vente
            </button>

            <button onClick={handleEdit} className="bg-gray-600 text-white font-medium py-2 px-4 rounded-md flex-1">
              Apporter une correction
            </button>

            <PDFDownloadLink
              document={<InvoicePDF clientInfo={updatedClientInfo} items={updatedItems} entrepriseInfo={entrepriseInfo} name="Devis" />}
              fileName="devis.pdf"
              onClick={() => setIsPreparingPDF(true)} // Début de la préparation du PDF
            >
              {({ loading }) =>
                loading ? (
                  <button className="bg-gray-400 text-white font-medium py-2 px-4 rounded-md flex-1" disabled>
                    Devis en préparation...
                  </button>
                ) : (
                  <button
                    className="bg-green-600 text-white font-medium py-2 px-4 rounded-md flex-1"
                    onClick={() => setIsPreparingPDF(false)} // Fin de la préparation du PDF
                  >
                    DEVIS.PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
        <EditModal isOpen={isModalOpen} onClose={handleCloseModal} clientInfo={updatedClientInfo} items={updatedItems} onSave={handleSaveChanges} />
        <TermsModal show={isTermsModalOpen} handleClose={handleCloseTermsModal} />
      </div>
    </div>
  );
}

export default CreationDuDevis;
