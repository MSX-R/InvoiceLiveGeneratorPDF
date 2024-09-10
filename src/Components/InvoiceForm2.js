import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import { IoMdInformationCircleOutline } from "react-icons/io";

function InvoiceForm2({ onGenerateInvoice }) {
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

  // Services initialement définis
  const initialServices = [
    { id: 1, name: "Séance d'essai", quantity: 1, prix: 0, prixTotal: 0, type: "unit", percentage: 0 },
    { id: 2, name: "Séance unique", quantity: 1, prix: prixFixe, prixTotal: prixFixe, type: "unit", percentage: 0 },
    { id: 11, name: "Pack-5", quantity: 5, prix: prixFixe * 0.95, prixTotal: prixFixe * 0.95 * 5, type: "pack", percentage: 0.05 },
    { id: 12, name: "Pack-10", quantity: 10, prix: prixFixe * 0.9, prixTotal: prixFixe * 0.9 * 10, type: "pack", percentage: 0.1 },
    { id: 13, name: "Pack-20", quantity: 20, prix: prixFixe * 0.875, prixTotal: prixFixe * 0.875 * 20, type: "pack", percentage: 0.125 },
    { id: 21, name: "2 séances/semaine", quantity: 24, prix: prixFixe * 0.875, prixTotal: prixFixe * 0.875 * 24, type: "12weeks", percentage: 0.125 },
    { id: 22, name: "3 séances/semaine", quantity: 36, prix: prixFixe * 0.8, prixTotal: prixFixe * 0.8 * 36, type: "12weeks", percentage: 0.2 },
    { id: 23, name: "4 séances/semaine", quantity: 48, prix: prixFixe * 0.75, prixTotal: prixFixe * 0.75 * 48, type: "12weeks", percentage: 0.25 },
    { id: 24, name: "5 séances/semaine", quantity: 60, prix: prixFixe * 0.75, prixTotal: prixFixe * 0.75 * 60, type: "12weeks", percentage: 0.25 },
    // Nouveaux tarifs type entraînement à la semaine
    { id: 31, name: "1 séance/semaine", quantity: 1, prix: prixFixe, prixTotal: prixFixe * 1, type: "weeklyTraining", percentage: 0 },
    { id: 32, name: "2 séances/semaine", quantity: 2, prix: prixFixe - 2.5, prixTotal: (prixFixe - 2.5) * 2, type: "weeklyTraining", percentage: 0 },
    { id: 33, name: "3 séances/semaine", quantity: 3, prix: prixFixe - 5, prixTotal: (prixFixe - 5) * 3, type: "weeklyTraining", percentage: 0 },
    { id: 34, name: "4 séances/semaine", quantity: 4, prix: prixFixe - 7.5, prixTotal: (prixFixe - 7.5) * 4, type: "weeklyTraining", percentage: 0 },
    { id: 35, name: "5 séances/semaine", quantity: 5, prix: prixFixe - 10, prixTotal: (prixFixe - 10) * 5, type: "weeklyTraining", percentage: 0 },
  ];

  // Calcule les nouveaux prix et prix totaux des services en fonction de `nouveauPrixFixe`
  // Calcule les nouveaux prix et prix totaux des services en fonction de `nouveauPrixFixe`
  useEffect(() => {
    const updatedServices = initialServices.map((service) => {
      if (service.type === "unit") {
        return {
          ...service,
          prix: nouveauPrixFixe,
          prixTotal: nouveauPrixFixe * service.quantity,
        };
      } else if (service.type === "pack") {
        return {
          ...service,
          prix: nouveauPrixFixe * (1 - service.percentage),
          prixTotal: nouveauPrixFixe * (1 - service.percentage) * service.quantity,
        };
      } else if (service.type === "12weeks") {
        return {
          ...service,
          prix: nouveauPrixFixe * (1 - service.percentage),
          prixTotal: nouveauPrixFixe * (1 - service.percentage) * service.quantity,
        };
      } else if (service.type === "weeklyTraining") {
        return {
          ...service,
          prix: nouveauPrixFixe * (1 - service.percentage), // Ajuste le prix selon `nouveauPrixFixe`
          prixTotal: nouveauPrixFixe * (1 - service.percentage) * service.quantity, // Ajuste le prix total selon `nouveauPrixFixe`
        };
      }
      return service;
    });

    setItems((prevItems) => {
      return prevItems.map((item) => {
        const updatedService = updatedServices.find((service) => service.id === item.service?.id);
        return {
          ...item,
          service: updatedService || null,
        };
      });
    });
  }, [nouveauPrixFixe]);

  const offerOptions = [
    { value: "", label: "Sélectionner le type d'offre" },
    { value: "unit", label: "OFFRE UNITAIRE" },
    { value: "pack", label: "OFFRE PACK" },
    { value: "12weeks", label: "OFFRE 12 SEMAINES" },
    { value: "weeklyTraining", label: "ENTRAINEMENT À LA SEMAINE" }, // Ajout de l'option pour les entraînements à la semaine
  ];

  const getServiceOptions = (type) => initialServices.filter((service) => service.type === type);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.data.isGroupHeader ? "bold" : "normal",
      backgroundColor: state.data.isGroupHeader ? "#f0f0f0" : provided.backgroundColor,
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 12px",
      cursor: state.data.isGroupHeader ? "not-allowed" : "pointer",
    }),
    control: (provided) => ({ ...provided, borderColor: "#d1d5db" }),
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(clientInfo).every((value) => value !== "") && items[0].service;
    setIsFormComplete(allFieldsFilled);
  }, [clientInfo, items]);

  const handlePrixFixeChange = (event) => {
    const value = event.target.value;
    // Si la valeur est vide, mets à jour l'état avec une chaîne vide
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
    setSelectedTypeOffre(selectedOption ? selectedOption.value : "");
    setItems([{ typeOffre: selectedOption ? selectedOption.value : "", service: null }]);
  };

  const handleItemChange = (index, selectedOption) => {
    const selectedService = initialServices.find((service) => service.id === selectedOption.value);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormComplete) {
      setFormError("Tous les champs doivent être remplis et un service doit être sélectionné.");
      return;
    }
    setFormError("");
    setShowModal(true);
  };

  const cancelGeneration = () => {
    setShowModal(false);
  };

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
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Formulaire de Facturation</h1>
        <form onSubmit={handleSubmit}>
          {/* Section Informations Client */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Informations Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["nom", "prenom", "adresse", "codePostal", "ville", "telephone"].map((field) => (
                <div key={field} className="relative">
                  <input type="text" placeholder={field} value={clientInfo[field]} onChange={(e) => handleChangeClientInfo(field, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
                  {clientInfo[field] && <MdDelete className="absolute top-2 right-2 text-red-500 cursor-pointer" onClick={() => clearClientField(field)} />}
                </div>
              ))}
            </div>
            <button type="button" onClick={fillDefaultClientInfo} className="mt-4 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md">
              Remplir avec des données de test
            </button>
          </div>

          {/* Section Sélection des Offres */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Sélection des Offres</h2>
            <Select options={offerOptions} value={offerOptions.find((option) => option.value === selectedTypeOffre)} onChange={handleOfferChange} styles={customStyles} />
            {selectedTypeOffre && <Select options={getServiceOptions(selectedTypeOffre).map((service) => ({ value: service.id, label: service.name }))} value={items[0].service ? { value: items[0].service.id, label: items[0].service.name } : null} onChange={(selectedOption) => handleItemChange(0, selectedOption)} styles={customStyles} />}
          </div>

          {/* Section Détails de l'Offre */}
          {items[0].service ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Détails de l'Offre</h2>
              <div className="border p-4 rounded-md shadow-md bg-gray-50">
                <p>
                  <strong>Nom :</strong> {items[0].service.name}
                </p>
                <p>
                  <strong>Quantité :</strong> {items[0].service.quantity}
                </p>
                <p>
                  <strong>Prix Unitaire :</strong> {items[0].service.prix} €
                </p>
                <p>
                  <strong>Prix Total :</strong> {items[0].service.prixTotal} €
                </p>
                <IoMdInformationCircleOutline className="text-gray-500 mt-2" />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Détails de l'Offre</h2>
              <div className="border p-4 rounded-md shadow-md bg-gray-50">
                <p>Aucune offre n'est sélectionnée. Veuillez choisir une offre pour afficher les détails.</p>
              </div>
            </div>
          )}

          {/* Section Prix Fixe */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Prix Fixe</h2>
            <div className="flex items-center space-x-4">
              <input type="number" value={nouveauPrixFixe === "" ? "" : nouveauPrixFixe} onChange={handlePrixFixeChange} onKeyDown={handleKeyPress} className="w-24 p-2 border border-gray-300 rounded-md" />{" "}
              <button type="button" onClick={handlePrixFixeValidation} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                Mettre à jour
              </button>
              {prixInputError && <p className="text-red-500">Le prix doit être supérieur à 0.</p>}
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
            <Dialog.Title className="text-xl font-bold mb-4">Confirmer la Génération de la Facture</Dialog.Title>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelGeneration} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md">
                Annuler
              </button>
              <button onClick={confirmGeneration} className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md">
                Confirmer
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default InvoiceForm2;
