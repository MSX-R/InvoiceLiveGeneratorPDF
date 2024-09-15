import React, { useState, useEffect } from "react";
import Select from "react-select";
import { usePrix } from "../contexts/PrixContext"; // Importation du hook usePrix

// Exemple de types d'offres
const offerOptions = [
  { value: "", label: "Choisir un type d'offre" },
  { value: "unit", label: "OFFRE UNE SEANCE" },
  { value: "pack", label: "OFFRE PACK" },
  { value: "weekly", label: "OFFRE 1 SEMAINE" },
  { value: "12weeks", label: "OFFRE 12 SEMAINES" },
];

const EditModal = ({ isOpen, onClose, clientInfo, items, onSave }) => {
  const { prixFixe, services, updatePrixFixe } = usePrix(); // Utilisation de usePrix

  // Extraire les services à partir des items
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
    clientEmail: clientInfo.email || "", // Ajout de l'email du client
    selectedOfferType: items[0]?.service?.type || "",
    selectedServices: extractServices(items)[0] || null,
    prixFixeLocal: prixFixe, // Initialisation du prix fixe localement
  });

  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    // Filtrer les services en fonction du type d'offre sélectionné et du contexte
    const filteredServices = services
      .filter((service) => service.type === formData.selectedOfferType)
      .map((service) => ({
        value: service.id,
        label: service.name,
      }));

    setAvailableServices(filteredServices);

    // Vérifier si le service sélectionné est encore valide
    const isSelectedServiceValid = formData.selectedServices ? filteredServices.some((filtered) => filtered.value === formData.selectedServices.value) : true;

    // Mettre à jour les données du formulaire si nécessaire
    if (!isSelectedServiceValid) {
      setFormData((prevData) => ({
        ...prevData,
        selectedServices: null,
      }));
    }
  }, [formData.selectedOfferType, services]); // Dépendance sur selectedOfferType et services

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

  const handlePrixFixeChange = (e) => {
    setFormData((prevData) => ({ ...prevData, prixFixeLocal: e.target.value }));
  };

  const handleSavePrixFixe = () => {
    // Mettre à jour le prix fixe dans le contexte
    updatePrixFixe(Number(formData.prixFixeLocal));
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
      email: formData.clientEmail, // Ajout de l'email du client
    };

    const updatedItems = formData.selectedServices
      ? [
          {
            service: {
              id: formData.selectedServices.value,
              name: formData.selectedServices.label,
              quantity: 1,
              prix: services.find((s) => s.id === formData.selectedServices.value)?.prix || 0,
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

        {/* Section pour modifier le prix fixe */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Prix Fixe</h4>
          <input type="number" name="prixFixeLocal" value={formData.prixFixeLocal} onChange={handlePrixFixeChange} placeholder="Entrez le prix fixe" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <button onClick={handleSavePrixFixe} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
            Mettre à jour le Prix Fixe
          </button>
        </div>

        {/* Champ pour sélectionner le type d'offre */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Type d'offre</h4>
          <Select options={offerOptions} onChange={handleOfferTypeChange} value={offerOptions.find((option) => option.value === formData.selectedOfferType)} placeholder="Sélectionner le type d'offre" />
        </div>

        {/* Champ pour sélectionner les services */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Services</h4>
          <Select options={availableServices} onChange={handleServiceChange} value={formData.selectedServices} isDisabled={!formData.selectedOfferType} placeholder="Sélectionner des services" />
        </div>

        {/* Formulaire pour les informations client */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Client</h4>
          <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Nom" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientPrenom" value={formData.clientPrenom} onChange={handleChange} placeholder="Prénom" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientAdresse" value={formData.clientAdresse} onChange={handleChange} placeholder="Adresse" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientCodePostal" value={formData.clientCodePostal} onChange={handleChange} placeholder="Code Postal" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientVille" value={formData.clientVille} onChange={handleChange} placeholder="Ville" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="text" name="clientTelephone" value={formData.clientTelephone} onChange={handleChange} placeholder="Téléphone" className="block w-full mb-2 border border-gray-300 rounded p-2" />
          <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="Email" className="block w-full mb-2 border border-gray-300 rounded p-2" />
        </div>

        <div className="flex justify-end">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2" onClick={onClose}>
            Annuler
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditModal;
