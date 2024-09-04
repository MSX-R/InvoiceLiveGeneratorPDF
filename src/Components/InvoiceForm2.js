import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Exemple d'informations de l'entreprise (en réalité, ce serait probablement chargé depuis un fichier JSON ou API)

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
  ];

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
  ];

  const getServiceOptions = (type) => {
    return initialServices.filter((service) => service.type === type);
  };

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

  const handlePrixFixeChange = (event) => setNouveauPrixFixe(Number(event.target.value));

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

  const clearClientField = (key) => {
    setClientInfo((prev) => ({ ...prev, [key]: "" }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Simuler une opération de génération de facture
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 1000);
  };

  const confirmGeneration = () => {
    setShowModal(false);
    onGenerateInvoice(clientInfo, items);
  };

  const cancelGeneration = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <button type="button" onClick={fillDefaultClientInfo} className="fixed top-4 right-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-lg">
        Remplir avec Info-TEST
      </button>

      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Création de Facture</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="border-t border-gray-300 pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Paramètres de Prix</h3>
            <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
              <div className="flex-1 mb-4 md:mb-0">
                <label className="text-gray-700 font-medium mb-2 block">Prix initial de la séance unique :</label>
                <input type="text" value={`${prixFixe}€`} disabled className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md p-3 w-full text-right" />
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-medium mb-2 block">Modifier le prix :</label>
                <input type="number" value={nouveauPrixFixe} onChange={handlePrixFixeChange} onKeyPress={handleKeyPress} className="border border-gray-300 rounded-md p-3 w-full text-right" />
                {prixInputError && <p className="text-red-500 text-sm mt-2">Le prix doit être un nombre positif.</p>}
                <button type="button" onClick={handlePrixFixeValidation} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4">
                  Valider le Prix
                </button>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-300 pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Informations Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.keys(clientInfo).map((key) => (
                <div key={key} className="relative">
                  <label className="text-gray-700 font-medium mb-2 block capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()} :</label>
                  <input type="text" value={clientInfo[key]} onChange={(e) => handleChangeClientInfo(key, e.target.value)} className="border border-gray-300 rounded-md p-3 w-full" />
                  {clientInfo[key] && (
                    <button type="button" onClick={() => clearClientField(key)} className="absolute top-1 right-2 text-gray-500">
                      <MdDelete />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-gray-300 pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sélection du Type d'Offre</h3>
            <Select options={offerOptions} onChange={handleOfferChange} value={offerOptions.find((option) => option.value === selectedTypeOffre)} placeholder="Sélectionner le type d'offre" styles={customStyles} />
          </section>

          <section className="border-t border-gray-300 pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sélection du Service</h3>
            <div className="space-y-4">
              <Select options={getServiceOptions(selectedTypeOffre).map((service) => ({ value: service.id, label: service.name }))} value={items[0].service ? { value: items[0].service.id, label: items[0].service.name } : null} onChange={(selectedOption) => handleItemChange(0, selectedOption)} placeholder="Sélectionner un service" isDisabled={!selectedTypeOffre} styles={customStyles} className="mb-4" />
            </div>
          </section>

          <section className="border-t border-gray-300 pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Détails du Service Sélectionné</h3>
            <div className="border border-gray-300 rounded-md p-4">
              <h4 className="text-l text-gray-800 text-center">{items[0].service ? <span className="font-semibold text-xl">{items[0].service.name.toUpperCase()}</span> : "Aucun service sélectionné"}</h4>

              {items[0].service && (
                <>
                  <hr className="border-gray-300 my-4" />

                  <div className="flex justify-between mb-2">
                    <p className="text-gray-700">Type d'offre:</p>
                    <p className="text-gray-700 font-bold">{offerOptions.find((option) => option.value === selectedTypeOffre)?.label}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-700">Votre offre:</p>
                    <p className="text-gray-700 font-bold">{items[0].service.name}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-700">Quantité:</p>
                    <p className="text-gray-700 font-bold">
                      {items[0].service.quantity} séance{items[0].service.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-700">Tarif:</p>
                    <p className="text-gray-700 font-bold">
                      {items[0].service.prix}€<span className="text-sm font-semibold">/séance</span>
                    </p>
                  </div>
                  {/* CETTE PARTIE NE DOIT S'afficher que si le type d'offre selectionné est differente de unit */}
                  {items[0].service.type !== "unit" ? (
                    <div className="flex justify-between mb-2">
                      <p className="text-blue-700 text-xs flex items-center">
                        <IoMdInformationCircleOutline className="mr-1" /> Remise sur tarif initial ( {prixFixe}€ )
                      </p>
                      <p className="text-gray-700 font-semibold text-xs">- {items[0].service.percentage * 100}%</p>
                    </div>
                  ) : null}

                  {/*  */}
                  {items[0].service.type === "12weeks" ? (
                    <>
                      <hr className="border-gray-300 my-4" />
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-700">Mensualité:</p>
                        <p className="text-gray-700 font-bold">
                          {items[0].service.prixTotal / 3}€<span className="text-sm font-semibold">/mois</span>
                        </p>
                      </div>
                    </>
                  ) : null}
                  <hr className="border-gray-300 my-4" />
                  <div className="flex justify-between">
                    <p className="text-gray-700">Prix total TTC :</p>
                    <p className="text-gray-700 text-xl font-bold">{items[0].service.prixTotal}€</p>
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="flex justify-between items-center border-t border-gray-300 pt-6 mt-6">
            {formError && <p className="text-red-500">{formError}</p>}
            <button type="submit" disabled={!isFormComplete} className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-md ${!isFormComplete && "opacity-50 cursor-not-allowed"}`}>
              {loading ? "Génération en cours..." : "Générer une Facture"}
            </button>
          </div>
        </form>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 flex items-center justify-center z-50">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-4">
          <h3 className="text-xl font-semibold mb-4">Confirmation</h3>
          <p>Êtes-vous sûr de vouloir générer la facture avec les informations suivantes ?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button onClick={cancelGeneration} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md">
              Annuler
            </button>
            <button onClick={confirmGeneration} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
              Confirmer
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default InvoiceForm2;
