/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { FaAddressCard, FaPhoneAlt, FaFile, FaArrowLeft } from "react-icons/fa";
import InvoicePDF from "./InvoicePDF";
import EditModal from "./EditModal";
import TermsModal from "../config/TermsModal";
import { DateContext } from "../contexts/DateContext";

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

const calculateDueDate = (items, currentDate) => {
  const today = new Date(currentDate);
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
  const currentDate = useContext(DateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [updatedClientInfo, setUpdatedClientInfo] = useState(clientInfo);
  const [updatedItems, setUpdatedItems] = useState(items);
  const [quoteNumber, setQuoteNumber] = useState("XXX");
  const [newQuoteNumber, setNewQuoteNumber] = useState(quoteNumber);
  const [isPdfPrepared, setIsPdfPrepared] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const downloadLinkRef = useRef(null);
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
    setIsModalOpen(false);
  };

  const handleOpenTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  let formattedValidityDate;
  if (currentDate && !isNaN(Date.parse(currentDate))) {
    formattedValidityDate = new Date(currentDate);
  } else {
    console.warn("currentDate is not a valid date:", currentDate);
    formattedValidityDate = new Date();
  }

  formattedValidityDate.setDate(formattedValidityDate.getDate() + 5);
  const formattedValidityDateStr = formattedValidityDate.toLocaleDateString("fr-FR");

  const handleValidateQuoteNumber = () => {
    setQuoteNumber(newQuoteNumber);
  };

  const handleResetQuoteNumber = () => {
    setNewQuoteNumber(quoteNumber);
  };

  const handlePreparePdf = () => {
    setIsPdfPrepared(true);
    setIsDownloading(true);
  };

  useEffect(() => {
    if (isPdfPrepared && isDownloading && downloadLinkRef.current) {
      downloadLinkRef.current.click();
      setIsDownloading(false);
      setIsDownloaded(true);
    }
  }, [isPdfPrepared, isDownloading]);

  const handleManualDownload = () => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8 lg:px-12 lg:py-16">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 border border-gray-200">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 transition-colors" aria-label="Retour">
          <FaArrowLeft size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">Création de document</h2>
        </div>

        <div className="mb-6 flex flex-col items-start">
          <div className="flex flex-col w-full md:flex-row md:items-start md:space-x-2">
            <div className="flex flex-col w-full md:w-1/2 mb-2">
              <label className="block text-gray-700 mb-1" htmlFor="quoteNumber">
                Numéro de Devis
              </label>
              <input id="quoteNumber" type="text" value={quoteNumber} disabled className="border rounded-md p-2 w-full bg-gray-100" />
            </div>

            <div className="flex flex-col w-full md:w-1/2 mb-2">
              <label className="block text-gray-700 mb-1" htmlFor="newQuoteNumber">
                Modifier Numéro Devis
              </label>
              <input id="newQuoteNumber" type="text" value={newQuoteNumber} onChange={(e) => setNewQuoteNumber(e.target.value)} className="border rounded-md p-2 w-full" placeholder="Nouveau numéro" />
            </div>
          </div>

          <div className="text-center mt-4 flex flex-row justify-end w-full">
            <button onClick={handleResetQuoteNumber} className="bg-red-600 text-white py-2 px-4 text-center rounded-md focus:outline-none mr-2 hover:bg-red-700 transition-colors w-full">
              Effacer
            </button>
            <button onClick={handleValidateQuoteNumber} className="bg-green-600 text-white py-2 px-4 text-center rounded-md focus:outline-none hover:bg-green-700 transition-colors w-full">
              Valider
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-900 mb-1">Date du jour : {currentDate}</p>
          <p className="text-lg font-medium text-gray-700">Date d'émission : {currentDate}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
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

          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaAddressCard className="text-gray-600 mr-2" />
              <span>CLIENT</span>
            </h4>
            <p className="text-gray-800">
              {updatedClientInfo.nom} {updatedClientInfo.prenom}
            </p>
            <p className="text-gray-600">
              {updatedClientInfo.adresse1}, {updatedClientInfo.cp} {updatedClientInfo.ville}
            </p>
            <p className="text-gray-600 flex items-center">
              <FaPhoneAlt className="text-gray-600 mr-2" />
              {updatedClientInfo.telephone}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-8">
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
                <strong>Prix :</strong> {item.service?.prix}€
              </p>
              <p className="text-gray-700">
                <strong>Quantité :</strong> {item.service?.quantity}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>TOTAL :</strong> {item.service?.quantity * item.service?.prix}€
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-4 flex flex-col md:flex-row justify-center">
          <button onClick={handleEdit} className="bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-green-700 transition-colors mr-4 mb-2 md:mb-0 w-full">
            <FaAddressCard className="inline mr-2" /> Modifier
          </button>
          <button onClick={handleOpenTermsModal} className="bg-yellow-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-yellow-600 transition-colors w-full">
            Conditions
          </button>
        </div>

        <div className="text-center mt-8 mb-2">
          <p className="text-lg font-medium text-gray-800 mb-4">Offre valide jusqu'au {formattedValidityDateStr}</p>
          {!isPdfPrepared ? (
            <button onClick={handlePreparePdf} className="bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-700 w-full md:w-auto">
              Préparer le devis
            </button>
          ) : isDownloading ? (
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-700 w-full md:w-auto" disabled>
              Téléchargement du devis...
            </button>
          ) : (
            <button onClick={handleManualDownload} className="bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-green-700 w-full md:w-auto">
              {isDownloaded ? "Télécharger à nouveau" : "Télécharger le devis"}
            </button>
          )}
          <BlobProvider document={<InvoicePDF clientInfo={updatedClientInfo} items={updatedItems} entrepriseInfo={entrepriseInfo} validityDate={formattedValidityDateStr} fileName={`Devis_${quoteNumber}`} />}>
            {({ url }) => (
              <a href={url} download={`Devis_${quoteNumber}.pdf`} ref={downloadLinkRef} style={{ display: "none" }}>
                Download
              </a>
            )}
          </BlobProvider>
        </div>

        <EditModal isOpen={isModalOpen} onClose={handleCloseModal} clientInfo={updatedClientInfo} items={updatedItems} onSave={handleSaveChanges} />

        <TermsModal isOpen={isTermsModalOpen} onClose={handleCloseTermsModal} />
      </div>
    </div>
  );
}

export default CreationDuDevis;
