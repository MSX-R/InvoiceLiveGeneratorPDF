import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import { IoMdInformationCircleOutline } from "react-icons/io";

const initialServices = (prixFixe) => [
  { id: 1, name: "Séance d'essai", quantity: 1, prix: 0, type: "unit", remise: 0 },
  { id: 2, name: "Séance unique", quantity: 1, prix: prixFixe, type: "unit", remise: 0 },
  { id: 11, name: "Pack-5", quantity: 5, prix: prixFixe * 0.95, type: "pack", remise: 5 },
  { id: 12, name: "Pack-10", quantity: 10, prix: prixFixe * 0.9, type: "pack", remise: 10 },
  { id: 13, name: "Pack-20", quantity: 20, prix: prixFixe * 0.875, type: "pack", remise: 12.5 },
  { id: 21, name: "2 séances/semaine", quantity: 24, prix: prixFixe * 0.875, type: "12weeks", remise: 12.5 },
  { id: 22, name: "3 séances/semaine", quantity: 36, prix: prixFixe * 0.8, type: "12weeks", remise: 20 },
  { id: 23, name: "4 séances/semaine", quantity: 48, prix: prixFixe * 0.75, type: "12weeks", remise: 25 },
  { id: 24, name: "5 séances/semaine", quantity: 60, prix: prixFixe * 0.75, type: "12weeks", remise: 25 },
  { id: 31, name: "1 séance/semaine", quantity: 1, prix: prixFixe, type: "weeklyTraining", remise: 0 },
  { id: 32, name: "2 séances/semaine", quantity: 2, prix: prixFixe - 2.5, type: "weeklyTraining", remise: 0 },
  { id: 33, name: "3 séances/semaine", quantity: 3, prix: prixFixe - 5, type: "weeklyTraining", remise: 0 },
  { id: 34, name: "4 séances/semaine", quantity: 4, prix: prixFixe - 7.5, type: "weeklyTraining", remise: 0 },
  { id: 35, name: "5 séances/semaine", quantity: 5, prix: prixFixe - 10, type: "weeklyTraining", remise: 0 },
];

const offerOptions = [
  { value: "", label: "Sélectionner le type d'offre" },
  { value: "unit", label: "OFFRE UNITAIRE" },
  { value: "pack", label: "OFFRE PACK" },
  { value: "12weeks", label: "OFFRE 12 SEMAINES" },
  { value: "weeklyTraining", label: "ENTRAINEMENT À LA SEMAINE" },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    fontWeight: state.isSelected ? "bold" : "normal",
    backgroundColor: state.isSelected ? "#f7f7f7" : provided.backgroundColor,
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
    cursor: "pointer",
  }),
  control: (provided) => ({ ...provided, borderColor: "#ddd", boxShadow: "none" }),
  singleValue: (provided) => ({ ...provided, color: "#333" }),
};

const InvoiceForm2 = ({ onGenerateInvoice }) => {
  const [prixFixe, setPrixFixe] = useState(60);
  const [nouveauPrixFixe, setNouveauPrixFixe] = useState(prixFixe);
  const [items, setItems] = useState([{ typeOffre: "", service: null }]);
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    telephone: "",
  });
  const [prixInputError, setPrixInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [selectedTypeOffre, setSelectedTypeOffre] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const updatedServices = initialServices(nouveauPrixFixe).map((service) => ({
      ...service,
      prixTotal: service.prix * service.quantity,
    }));

    setItems((prevItems) => {
      return prevItems.map((item) => {
        const updatedService = updatedServices.find((service) => service.id === item.service?.id);
        return { ...item, service: updatedService || null };
      });
    });
  }, [nouveauPrixFixe]);

  useEffect(() => {
    const allFieldsFilled = Object.values(clientInfo).every((value) => value) && items[0].service;
    setIsFormComplete(allFieldsFilled);
  }, [clientInfo, items]);

  const handlePrixFixeChange = (event) => {
    const value = event.target.value;
    setNouveauPrixFixe(value === "" ? "" : Number(value));
  };

  const handlePrixFixeValidation = () => {
    if (nouveauPrixFixe > 0) {
      setPrixFixe(nouveauPrixFixe);
      setPrixInputError(false);
    } else {
      setPrixInputError(true);
    }
  };

  const handleKeyPress = (event) => event.key === "Enter" && handlePrixFixeValidation();

  const handleOfferChange = (selectedOption) => {
    setSelectedTypeOffre(selectedOption?.value || "");
    setItems([{ typeOffre: selectedOption?.value || "", service: null }]);
  };

  const handleItemChange = (index, selectedOption) => {
    const selectedService = initialServices(nouveauPrixFixe).find((service) => service.id === selectedOption.value);
    setItems([{ typeOffre: selectedTypeOffre, service: selectedService }]);
  };

  const handleChangeClientInfo = (key, value) => {
    setClientInfo((prev) => ({ ...prev, [key]: value }));
  };

  const fillDefaultClientInfo = () => {
    setClientInfo({
      nom: "Lanteri",
      prenom: "Yannick",
      adresse: "145 boulevard Fenelon",
      codePostal: "06400",
      ville: "Cannes",
      telephone: "0708090708",
    });
  };

  const clearClientField = (field) => {
    setClientInfo((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormComplete) {
      setFormError("Tous les champs doivent être remplis et un service doit être sélectionné.");
      return;
    }
    setFormError("");
    setShowModal(true);
  };

  const cancelGeneration = () => setShowModal(false);

  const confirmGeneration = async () => {
    setLoading(true);
    try {
      await onGenerateInvoice(clientInfo, items);
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Formulaire de Facturation</h1>
        <form onSubmit={handleSubmit}>
          {/* Informations Client */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Informations Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(clientInfo).map((field) => (
                <div key={field} className="relative">
                  <input type="text" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={clientInfo[field]} onChange={(e) => handleChangeClientInfo(field, e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  {clientInfo[field] && <MdDelete className="absolute top-2 right-2 text-red-500 cursor-pointer" onClick={() => clearClientField(field)} />}
                </div>
              ))}
            </div>
            <button type="button" onClick={fillDefaultClientInfo} className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
              Remplir avec des données de test
            </button>
          </div>

          {/* Sélection des Offres */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sélection des Offres</h2>
            <Select options={offerOptions} value={offerOptions.find((option) => option.value === selectedTypeOffre)} onChange={handleOfferChange} styles={customStyles} />
            {selectedTypeOffre && (
              <Select
                options={initialServices(nouveauPrixFixe)
                  .filter((service) => service.type === selectedTypeOffre)
                  .map((service) => ({ value: service.id, label: service.name }))}
                value={items[0].service ? { value: items[0].service.id, label: items[0].service.name } : null}
                onChange={(selectedOption) => handleItemChange(0, selectedOption)}
                styles={customStyles}
                className="mt-4"
              />
            )}
          </div>

          {/* Détails de l'Offre */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Détails de l'Offre</h2>
            <div className="border p-6 rounded-md shadow-md bg-gray-50">
              {items[0].service ? (
                <>
                  <p>
                    <strong>Nom :</strong> {items[0].service.name}
                  </p>
                  <p>
                    <strong>Quantité :</strong> {items[0].service.quantity}
                  </p>
                  {items[0].service.remise > 0 && (
                    <p>
                      <strong>Remise sur prix initial :</strong> {items[0].service.remise}%
                    </p>
                  )}
                  <p>
                    <strong>Prix Unitaire :</strong> {items[0].service.prix} €
                  </p>
                  <p>
                    <strong>Prix Total :</strong> {items[0].service.prixTotal} €
                  </p>

                  <IoMdInformationCircleOutline className="text-gray-500 mt-2" />
                </>
              ) : (
                <p>Aucune offre n'est sélectionnée. Veuillez choisir une offre pour afficher les détails.</p>
              )}
            </div>
          </div>

          {/* Prix Fixe */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prix Fixe</h2>
            <div className="flex items-center space-x-4">
              <input type="number" value={nouveauPrixFixe === "" ? "" : nouveauPrixFixe} onChange={handlePrixFixeChange} onKeyDown={handleKeyPress} className="w-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={handlePrixFixeValidation} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
                Mettre à jour
              </button>
              {prixInputError && <p className="text-red-500 mt-2">Le prix doit être supérieur à 0.</p>}
            </div>
          </div>

          {/* Bouton de Soumission */}
          <button type="submit" className={`w-full py-3 text-lg font-bold text-white rounded-md ${isFormComplete ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} disabled={!isFormComplete || loading}>
            {loading ? "Génération en cours..." : "Générer la facture"}
          </button>
        </form>

        {/* Modal de Confirmation */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-2xl font-bold mb-4">Confirmer la Génération de la Facture</Dialog.Title>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelGeneration} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600">
                Annuler
              </button>
              <button onClick={confirmGeneration} className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                Confirmer
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default InvoiceForm2;
