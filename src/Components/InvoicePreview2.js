import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { FaAddressCard, FaPhoneAlt, FaFile } from "react-icons/fa";
import EditModal from "./EditModal";

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
    email: process.env.REACT_APP_ENTREPRISE_EMAIL
};

function InvoiceFormPreview({ clientInfo, items, onEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedClientInfo, setUpdatedClientInfo] = useState(clientInfo);
  const [updatedItems, setUpdatedItems] = useState(items);

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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4 py-8 lg:px-12 lg:py-16">
      <div className="flex justify-center mb-8 lg:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Prévisualisation de la Facture</h2>
      </div>
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Facture | n° {"*num Facture*"}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Encadré Contractant */}
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

          {/* Encadré Client */}
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
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Détails de la Facture</h4>
          {/* Tableau pour écrans larges */}
          <div className="hidden md:block">
            {updatedItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFile className="text-gray-600 mr-2" />
                  <span>Offre n° {index + 1}</span>
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

          {/* Tableau pour petits écrans */}
          <div className="md:hidden">
            {updatedItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFile className="text-gray-600 mr-2" />
                  <span>Offre n° {index + 1}</span>
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

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-300 pt-6 mt-8">
          <button onClick={handleEdit} className="bg-gray-600 text-white font-medium py-2 px-4 rounded-md mb-4 md:mb-0">
            Apporter une correction
          </button>
          <PDFDownloadLink document={<InvoicePDF clientInfo={updatedClientInfo} items={updatedItems} entrepriseInfo={entrepriseInfo} />} fileName="facture.pdf">
            {({ loading }) => (loading ? "Préparation du PDF..." : <button className="bg-green-600 text-white font-medium py-2 px-4 rounded-md">Télécharger PDF</button>)}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Modale d'édition */}
      <EditModal isOpen={isModalOpen} onClose={handleCloseModal} clientInfo={updatedClientInfo} items={updatedItems} onSave={handleSaveChanges} />
    </div>
  );
}

export default InvoiceFormPreview;
