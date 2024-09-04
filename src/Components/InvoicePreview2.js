import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { FaAddressCard, FaPhoneAlt, FaFile } from "react-icons/fa";
import EditModal from "./EditModal";
import TermsModal from "../config/TermsModal"; // Importez le composant de la modale

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

function InvoiceFormPreview({ clientInfo, items, onEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false); // État pour la modale des CGV
  const [updatedClientInfo, setUpdatedClientInfo] = useState(clientInfo);
  const [updatedItems, setUpdatedItems] = useState(items);
  const [showFullText, setShowFullText] = useState(false);

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

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4 py-8 lg:px-12 lg:py-16">
      <div className="flex flex-col items-center justify-center mb-8 lg:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Prévisualisation de la Facture</h2>
      </div>
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Facture | n° {"XXX"}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-2 text-center text-sm">Date : {formattedToday}</p>
        <p className="text-2xl font-semibold text-gray-900 mb-12 text-center text-xs">Paiement le : {formattedToday}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaAddressCard className="text-gray-600 mr-2" />
              <span>CONTRACTANT</span>
            </h4>
            <p className="text-gray-800 font-medium">{entrepriseInfo.nom}</p>
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
            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaAddressCard className="text-gray-600 mr-2" />
              <span>CLIENT</span>
            </h4>
            <p className="text-gray-800 font-medium">
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
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-gray-800 text-center mb-4">Détails</h4>
          <div className="hidden md:block">
            {updatedItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
                  <strong>Prix Total :</strong> {item.service?.prixTotal}€
                </p>
              </div>
            ))}
          </div>
          <div className="md:hidden">
            {updatedItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFile className="text-gray-600 mr-2" />
                  <span className="uppercase">Votre Offre</span>
                </h4>{" "}
                <p className="text-gray-700">
                  <strong>Nom :</strong> {item.service?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Nombre de {item.service?.quantity > 1 ? "séances" : "séance"} :</strong> {item.service?.quantity}
                </p>
                <p className="text-gray-700">
                  <strong>Prix Unitaire :</strong> {item.service?.prix}€
                </p>
                <p className="text-gray-700">
                  <strong>Prix Total :</strong> {item.service?.prixTotal}€
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-gray-600 text-xs mt-6">
          <p>
            <strong>Mentions Légales :</strong>
          </p>
          <p className="text-xs">TVA non applicable, article 293 B du CGI</p>
        </div>
        <div className="text-gray-600 text-xs mt-4">
          <p>
            <strong>Pénalités de Retard :</strong>
          </p>
          <p className="text-xs">{showFullText ? "En cas de non-paiement le jour de la signature du contrat ou dans un délai de trois jours pour les offres de type 'Séance Unitaire' ou 'Pack', des frais de retard seront appliqués. Pour les séances mensualisées, un premier versement équivalant à un tiers du montant total doit être effectué à la signature du contrat. Les paiements restants devront être réglés le 3 de chaque mois suivant. Toutefois, il est également possible de régler la totalité du montant à la signature du contrat. Tout retard de paiement au-delà de ces délais entraînera l'application de pénalités." : "En cas de non-paiement, des frais de retard seront appliqués. Pour plus de détails, voir plus..."}</p>
          <button onClick={toggleText} className="text-blue-600 text-xs mt-2">
            {showFullText ? "Voir moins" : "Voir plus"}
          </button>
        </div>
        <button onClick={handleOpenTermsModal} className="bg-blue-600 text-white font-medium w-full md:w-auto py-2 px-4 rounded-md mt-4">
          Voir les Conditions Générales de Vente
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-300 pt-6 mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <button onClick={handleEdit} className="bg-gray-600 text-white font-medium w-full md:w-auto py-2 px-4 rounded-md">
            Apporter une correction
          </button>

          <PDFDownloadLink document={<InvoicePDF clientInfo={updatedClientInfo} items={updatedItems} entrepriseInfo={entrepriseInfo} />} fileName="facture.pdf">
            {({ loading }) => (loading ? <button className="bg-gray-400 text-white font-medium w-full py-2 px-4 rounded-md">Préparation du PDF...</button> : <button className="bg-green-600 text-white font-medium w-full py-2 px-4 rounded-md">Télécharger PDF</button>)}
          </PDFDownloadLink>
        </div>
      </div>
      <EditModal isOpen={isModalOpen} onClose={handleCloseModal} clientInfo={updatedClientInfo} items={updatedItems} onSave={handleSaveChanges} />
      <TermsModal show={isTermsModalOpen} handleClose={handleCloseTermsModal} /> {/* Ajoutez la modale des CGV ici */}
    </div>
  );
}

export default InvoiceFormPreview;
