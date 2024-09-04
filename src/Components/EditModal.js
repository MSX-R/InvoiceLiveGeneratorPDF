import React, { useState, useEffect } from "react";
import Select from "react-select";

// Exemple de types d'offres
const offerOptions = [
  { value: "", label: "Sélectionner le type d'offre" },
  { value: "unit", label: "OFFRE UNITAIRE" },
  { value: "pack", label: "OFFRE PACK" },
  { value: "12weeks", label: "OFFRE 12 SEMAINES" },
];

const initialServices = [
  { id: 1, name: "Séance d'essai", quantity: 1, prix: 0, prixTotal: 0, type: "unit" },
  { id: 2, name: "Séance unique", quantity: 1, prix: 60, prixTotal: 60, type: "unit" },
  { id: 11, name: "Pack-5", quantity: 5, prix: 57, prixTotal: 285, type: "pack" },
  { id: 12, name: "Pack-10", quantity: 10, prix: 54, prixTotal: 540, type: "pack" },
  { id: 13, name: "Pack-20", quantity: 20, prix: 52, prixTotal: 1040, type: "pack" },
  { id: 21, name: "2 séances/semaine", quantity: 24, prix: 52.5, prixTotal: 1260, type: "12weeks" },
  { id: 22, name: "3 séances/semaine", quantity: 36, prix: 48, prixTotal: 1728, type: "12weeks" },
  { id: 23, name: "4 séances/semaine", quantity: 48, prix: 45, prixTotal: 2160, type: "12weeks" },
  { id: 24, name: "5 séances/semaine", quantity: 60, prix: 45, prixTotal: 2700, type: "12weeks" },
];

const EditModal = ({ isOpen, onClose, clientInfo, items, onSave }) => {
  const extractServices = (items) => {
    return items.map((item) => ({
      value: item.service.id,
      label: item.service.name,
    }));
  };

  const [formData, setFormData] = useState({
    clientName: clientInfo.nom || "",
    clientPrenom: clientInfo.prenom || "",
    clientAdresse: clientInfo.adresse || "",
    clientCodePostal: clientInfo.codePostal || "",
    clientVille: clientInfo.ville || "",
    clientTelephone: clientInfo.telephone || "",
    selectedOfferType: items[0]?.service?.type || "",
    selectedServices: extractServices(items)[0] || null,
  });

  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    // Effectuer les calculs et mises à jour
    const filteredServices = initialServices
      .filter((service) => service.type === formData.selectedOfferType)
      .map((service) => ({
        value: service.id,
        label: service.name,
      }));

    setAvailableServices(filteredServices);

    // Vérifier si le service sélectionné est encore valide
    const isSelectedServiceValid = formData.selectedServices ? filteredServices.some((filtered) => filtered.value === formData.selectedServices.value) : true;

    // Mettre à jour les données du formulaire uniquement si nécessaire
    if (!isSelectedServiceValid) {
      setFormData((prevData) => ({
        ...prevData,
        selectedServices: null,
      }));
    }
  }, [formData.selectedOfferType]); // Dépendance uniquement sur selectedOfferType

  const handleOfferTypeChange = (selectedOption) => {
    const offerType = selectedOption?.value || "";
    setFormData((prevData) => ({
      ...prevData,
      selectedOfferType: offerType,
    }));
  };

  const handleServiceChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedServices: selectedOption || null,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (formData.selectedServices && typeof formData.selectedServices !== "object") {
      console.error("selectedServices n'est pas un objet");
      return;
    }

    const updatedClientInfo = {
      nom: formData.clientName,
      prenom: formData.clientPrenom,
      adresse: formData.clientAdresse,
      codePostal: formData.clientCodePostal,
      ville: formData.clientVille,
      telephone: formData.clientTelephone,
    };

    const updatedItems = formData.selectedServices
      ? [
          {
            service: {
              id: formData.selectedServices.value,
              name: formData.selectedServices.label,
              quantity: 1,
              prix: initialServices.find((s) => s.id === formData.selectedServices.value)?.prix || 0,
              prixTotal: initialServices.find((s) => s.id === formData.selectedServices.value)?.prixTotal || 0,
            },
          },
        ]
      : [];

    onSave(updatedClientInfo, updatedItems);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Modifier les informations</h3>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Client</h4>
          <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Nom" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientPrenom" value={formData.clientPrenom} onChange={handleChange} placeholder="Prénom" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientAdresse" value={formData.clientAdresse} onChange={handleChange} placeholder="Adresse" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientCodePostal" value={formData.clientCodePostal} onChange={handleChange} placeholder="Code Postal" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientVille" value={formData.clientVille} onChange={handleChange} placeholder="Ville" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientTelephone" value={formData.clientTelephone} onChange={handleChange} placeholder="Téléphone" className="block w-full mb-2 border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Type d'offre</h4>
          <Select options={offerOptions} onChange={handleOfferTypeChange} value={offerOptions.find((option) => option.value === formData.selectedOfferType)} placeholder="Sélectionner le type d'offre" />
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Services</h4>
          <Select options={availableServices} onChange={handleServiceChange} value={formData.selectedServices} isDisabled={!formData.selectedOfferType} placeholder="Sélectionner des services" />
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Enregistrer
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditModal;
