import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { FaAddressCard, FaPhoneAlt, FaFile, FaArrowLeft } from "react-icons/fa";
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
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FaFile className="text-gray-600 mr-2" />
                  <span className="uppercase">Votre Offre</span>
                </h4>
                <p className="text-gray-700">
                  <strong>Nom :</strong> {item.service?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Prix :</strong> {item.service?.price}€
                </p>
                <p className="text-gray-700">
                  <strong>Quantité :</strong> {item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 mb-4">Date limite d'acceptation : {formattedDueDate}</p>
            <PDFDownloadLink document={<InvoicePDF clientInfo={updatedClientInfo} items={updatedItems} quoteNumber={quoteNumber} />} fileName={`Devis_${quoteNumber}.pdf`}>
              {({ loading }) =>
                loading ? (
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600" disabled>
                    Préparation du PDF...
                  </button>
                ) : (
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600">Télécharger le devis</button>
                )
              }
            </PDFDownloadLink>
          </div>

          <div className="text-center mt-8">
            <button onClick={handleEdit} className="bg-green-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-green-600 mr-4">
              <FaAddressCard className="inline mr-2" /> Modifier
            </button>
            <button onClick={handleOpenTermsModal} className="bg-yellow-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-yellow-600">
              Conditions générales
            </button>
          </div>
        </div>

        {isModalOpen && <EditModal isOpen={isModalOpen} onClose={handleCloseModal} clientInfo={updatedClientInfo} items={updatedItems} onSave={handleSaveChanges} />}

        {isTermsModalOpen && <TermsModal isOpen={isTermsModalOpen} onClose={handleCloseTermsModal} />}
      </div>
    </div>
  );
}

export default CreationDuDevis;
