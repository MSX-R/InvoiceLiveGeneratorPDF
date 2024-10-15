import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import axios from "axios";
import { usePrix } from "../contexts/PrixContext";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";

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

const FormulaireDevis = ({ onGenerateInvoice }) => {
  const { prixFixe, updatePrixFixe } = usePrix();
  const { offres, programme, loading: offresLoading, error: offresError } = useOffresCoaching();
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([{ typeOffre: "", service: null }]);
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    prenom: "",
    adresse1: "",
    cp: "",
    ville: "",
    telephone: "",
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [prixInputError, setPrixInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [selectedTypeOffre, setSelectedTypeOffre] = useState("");
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFormError("Erreur : Aucun token disponible");
          return;
        }

        const response = await axios.get("https://msxghost.boardy.fr/api/users/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const filteredClients = response.data.filter((user) => user.role_id === 2 || user.role_id === 3 || user.role_id === 4);
        setClients(filteredClients);
      } catch (err) {
        console.error("Erreur lors de la récupération des clients :", err);
        setFormError("Erreur lors de la récupération des clients.");
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const allFieldsFilled = Object.values(clientInfo).every((value) => value) && items[0].service;
    setIsFormComplete(allFieldsFilled);
  }, [clientInfo, items]);

  const handlePrixFixeChange = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(Number(value)))) {
      updatePrixFixe(value);
      setPrixInputError(false);
    } else {
      setPrixInputError(true);
    }
  };

  const handleOfferChange = (selectedOption) => {
    const selectedOffreTitle = selectedOption?.value || "";
    setSelectedTypeOffre(selectedOffreTitle);
    setSelectedOffre(offres.find((offre) => offre.title === selectedOffreTitle));
    setItems([{ typeOffre: selectedOffreTitle, service: null }]);
  };

  const handleItemChange = (index, selectedOption) => {
    let updatedService;

    if (selectedOption.type === "single") {
      updatedService = {
        ...selectedOffre.price.single,
        quantity: 1,
        type: "single",
      };
    } else {
      const selectedService = selectedOffre.price[selectedOption.type].find((service) => service.sessions === selectedOption.value);
      updatedService = {
        ...selectedService,
        quantity: selectedService?.sessions || 1,
        type: selectedOption.type,
      };
    }

    setItems([{ typeOffre: selectedTypeOffre, service: updatedService }]);
  };

  const handleChangeClientInfo = (key, value) => {
    setClientInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleClientSelection = (selectedOption) => {
    if (selectedOption) {
      const client = clients.find((c) => c.id === selectedOption.value);
      setClientInfo({
        nom: client.nom,
        prenom: client.prenom,
        adresse1: client.adresse1,
        cp: client.cp,
        ville: client.ville,
        telephone: client.telephone,
      });
      setSelectedClient(selectedOption);
    } else {
      setClientInfo({
        nom: "",
        prenom: "",
        adresse1: "",
        cp: "",
        ville: "",
        telephone: "",
      });
      setSelectedClient(null);
    }
  };

  const fillDefaultClientInfo = () => {
    setClientInfo({
      nom: "Lanteri",
      prenom: "Yannick",
      adresse1: "145 boulevard Fenelon",
      cp: "06400",
      ville: "Cannes",
      telephone: "0708090708",
    });
    setSelectedClient(null);
  };

  const clearClientField = (field) => {
    setClientInfo((prev) => ({ ...prev, [field]: "" }));
  };

  const resetPrixFixe = () => {
    updatePrixFixe(0);
    setPrixInputError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormComplete) {
      setFormError("Tous les champs doivent être remplis et un service doit être sélectionné.");
      return;
    }
    if (prixInputError || prixFixe === "" || Number(prixFixe) < 0) {
      setFormError("Le prix fixe doit être un nombre positif ou zéro.");
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

  const getTotalPrice = () => {
    if (items[0].service) {
      return items[0].service.amount;
    }
    return 0;
  };

  const totalPrice = getTotalPrice();
  const monthlyCost = selectedTypeOffre === "12weeks" ? (totalPrice / 3).toFixed(2) : null;

  if (offresLoading) {
    return <div>Chargement des offres...</div>;
  }

  if (offresError) {
    return <div>Erreur : {offresError}</div>;
  }

  const offerOptions = offres.map((offre) => ({
    value: offre.title,
    label: `${offre.title} | ${offre.duration}`,
  }));
  const getServiceOptions = () => {
    if (!selectedOffre) return [];

    const options = [];
    if (selectedOffre.price.single) {
      options.push({
        value: 1,
        label: `${selectedOffre.price.single.name} - ${selectedOffre.price.single.amount > 0 ? selectedOffre.price.single.amount + "€" : "offerte"}`,
        type: "single",
      });
    }
    if (selectedOffre.price.pack) {
      selectedOffre.price.pack.forEach((pack) => {
        options.push({
          value: pack.sessions,
          label: `${pack.name} - ${pack.amount}€`,
          type: "pack",
        });
      });
    }
    if (selectedOffre.price.followUp) {
      selectedOffre.price.followUp.forEach((followUp) => {
        options.push({
          value: followUp.sessions,
          label: `${followUp.name} - ${followUp.amount}€`,
          type: "followUp",
        });
      });
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Formulaire de Facturation</h1>
        <form onSubmit={handleSubmit}>
          {/* Informations Client */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Informations Client</h2>
            <Select options={clients.map((client) => ({ value: client.id, label: `${client.nom} ${client.prenom}` }))} value={selectedClient} onChange={handleClientSelection} isClearable placeholder="Sélectionner un client existant" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(clientInfo).map((field) => (
                <div key={field} className="relative">
                  <input type="text" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={clientInfo[field]} onChange={(e) => handleChangeClientInfo(field, e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  {clientInfo[field] && <MdDelete className="absolute top-2 right-2 text-red-500 cursor-pointer" onClick={() => clearClientField(field)} />}
                </div>
              ))}
            </div>
            <button type="button" onClick={fillDefaultClientInfo} className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 w-full md:w-auto">
              Remplir avec des données test
            </button>
          </div>

          {/* Sélection des Offres */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sélection des Offres</h2>
            <Select options={offerOptions} value={offerOptions.find((option) => option.value === selectedTypeOffre)} onChange={handleOfferChange} styles={customStyles} placeholder="Sélectionner une offre" /> {selectedTypeOffre && <Select options={getServiceOptions()} value={items[0].service ? { value: items[0].service.name, label: `${items[0].service.name}`, type: items[0].service.type } : null} onChange={(selectedOption) => handleItemChange(0, selectedOption)} styles={customStyles} className="mt-4" />}
          </div>

          {/* Détails de l'Offre */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Détails de l'Offre</h2>
            <div className="border p-6 rounded-md shadow-md bg-gray-50">
              {items[0].service ? (
                <>
                  <p>
                    <strong>Nom :</strong> {selectedOffre.title}
                  </p>
                  <p>
                    <strong>Type :</strong> {items[0].service.type === "single" ? "Séance unique" : items[0].service.type === "pack" ? "Pack" : "Suivi"}
                  </p>
                  <p>
                    <strong>Quantité :</strong> {items[0].service.sessions} séance(s)
                  </p>
                  {items[0].service.discount > 0 && (
                    <p>
                      <strong>Remise sur prix initial :</strong> {items[0].service.discount}%
                    </p>
                  )}
                  <p className="ml-4 mt-2">
                    <strong>Prix Unitaire :</strong> {items[0].service.perSession} €
                  </p>
                  <p className="ml-4">
                    <strong>Prix Total :</strong> {items[0].service.amount} €
                  </p>
                  {items[0].service.monthly && (
                    <p className="flex items-center gap-2 ml-4">
                      <strong>Coût mensuel :</strong> {items[0].service.monthly} €
                    </p>
                  )}
                  {selectedOffre.description && (
                    <p className="mt-4">
                      <strong>Description :</strong> {selectedOffre.description}
                    </p>
                  )}
                </>
              ) : (
                <p>Aucune offre n'est sélectionnée. Veuillez choisir une offre pour afficher les détails.</p>
              )}
            </div>
          </div>

          {/* Prix Fixe */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prix Fixe</h2>
            <input type="number" value={prixFixe} onChange={handlePrixFixeChange} className={`w-full p-3 border ${prixInputError ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Prix Fixe (0€ ou plus)" />
            {prixInputError && <p className="text-red-500 mt-2">Veuillez entrer un prix fixe valide.</p>}
          </div>

          {/* Boutons */}
          <div className="flex justify-between mb-8 w-full md:w-auto">
            <button type="button" onClick={resetPrixFixe} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 w-full md:w-auto mr-2">
              Réinitialiser
            </button>
            <button type="submit" disabled={!isFormComplete || loading || prixInputError || prixFixe === ""} className={`bg-${prixFixe === "" || !isFormComplete ? "gray-400" : prixFixe >= 0 ? "green-600" : "gray-400"} text-white font-semibold py-2 px-4 rounded-md hover:${prixFixe === "" || !isFormComplete ? "bg-gray-500" : prixFixe > 0 ? "bg-green-700" : "bg-gray-500"} w-full md:w-auto`}>
              Générer la Facture
            </button>
          </div>

          {/* Modal de Confirmation */}
          <Dialog open={showModal} onClose={cancelGeneration} className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <div className="fixed inset-0 bg-black opacity-50" onClick={cancelGeneration} />
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
              <Dialog.Title className="text-xl font-bold">Confirmer la génération</Dialog.Title>
              <Dialog.Description className="mt-2">Êtes-vous sûr de vouloir générer cette facture ?</Dialog.Description>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={cancelGeneration} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md w-full md:w-auto">
                  Annuler
                </button>
                <button onClick={confirmGeneration} className="bg-green-600 text-white px-4 py-2 rounded-md w-full md:w-auto">
                  Confirmer
                </button>
              </div>
            </div>
          </Dialog>

          {/* Message d'erreur */}
          {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}
        </form>
      </div>
    </div>
  );
};

export default FormulaireDevis;
