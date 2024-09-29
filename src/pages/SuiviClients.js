import React, { useState } from "react";
import Modal from "react-modal";
import { useOffresServices } from "../contexts/OffresServicesContext";

// Configuration de la modale
Modal.setAppElement("#root");

const SuiviClients = () => {
  const { offerOptions, services } = useOffresServices();
  const [clients, setClients] = useState([
    { id: 1, prenom: "Romain", nom: "Marsaleix", offre: "pack", service: "Pack-5", seancesAchetees: 5, seancesConsommees: 2 },
    { id: 2, prenom: "Loic", nom: "Mennella", offre: "12weeks", service: "2 séances/semaine", seancesAchetees: 10, seancesConsommees: 8 },
  ]);

  const [nouveauClient, setNouveauClient] = useState({
    prenom: "",
    nom: "",
    offre: "",
    service: "",
    seancesAchetees: 0,
    seancesConsommees: 0,
  });

  const [filteredServices, setFilteredServices] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);
  const [newSeances, setNewSeances] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNouveauClient({ ...nouveauClient, [name]: value });

    if (name === "offre") {
      const filtered = services.filter((service) => service.type === value);
      setFilteredServices(filtered);
      setNouveauClient((prev) => ({ ...prev, service: "", seancesAchetees: 0 }));
    }

    if (name === "service") {
      const selectedService = services.find((service) => service.id === parseInt(value, 10));
      if (selectedService) {
        setNouveauClient((prev) => ({ ...prev, service: selectedService.name, seancesAchetees: selectedService.quantity }));
      }
    }
  };

  const ajouterClient = () => {
    if (nouveauClient.prenom && nouveauClient.nom && nouveauClient.offre && nouveauClient.service) {
      setClients((prevClients) => [
        ...prevClients,
        {
          id: prevClients.length + 1,
          ...nouveauClient,
          seancesConsommees: 0,
        },
      ]);
      setNouveauClient({ prenom: "", nom: "", offre: "", service: "", seancesAchetees: 0, seancesConsommees: 0 });
    }
  };

  const mettreAJourClient = (client, newSeances) => {
    const { prenom, nom } = client;

    if (newSeances === client.seancesAchetees) {
      setModalMessage(`${prenom} ${nom} a terminé son offre avec succès`);
      setModalIsOpen(true);
    } else if (newSeances > client.seancesAchetees) {
      const nombreManquant = newSeances - client.seancesAchetees;
      setModalMessage(`${prenom} ${nom} doit ${nombreManquant} séance${nombreManquant > 1 ? "s" : ""} supplémentaire à prix unique`);
      setModalIsOpen(true);
    } else if (newSeances === client.seancesAchetees - 1) {
      setModalMessage(`${prenom} ${nom} doit prendre une offre`);
      setModalIsOpen(true);
    }

    return { ...client, seancesConsommees: newSeances };
  };

  const ajouterSeance = (id) => {
    setClients((prevClients) => prevClients.map((client) => (client.id === id ? mettreAJourClient(client, client.seancesConsommees + 1) : client)));
  };

  const retirerSeance = (id) => {
    setClients((prevClients) => prevClients.map((client) => (client.id === id && client.seancesConsommees > 0 ? mettreAJourClient(client, client.seancesConsommees - 1) : client)));
  };

  const openModal = (client) => {
    setSelectedClient(client);
    setNewSeances(client.seancesConsommees);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClient(null);
  };

  const handleSave = () => {
    setClients((prevClients) => prevClients.map((client) => (client.id === selectedClient.id ? { ...client, seancesConsommees: newSeances } : client)));
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Suivi des Clients | Compteur de Séances</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Créer un Profil Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <input type="text" name="prenom" value={nouveauClient.prenom} onChange={handleChange} placeholder="Prénom" className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="nom" value={nouveauClient.nom} onChange={handleChange} placeholder="Nom" className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <select name="offre" value={nouveauClient.offre} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>
                CHOISIR UN TYPE D'OFFRE
              </option>
              {/* Liste des types d'offres */}
              {offerOptions.map((offer) => (
                <option key={offer.value} value={offer.value}>
                  {offer.label}
                </option>
              ))}
            </select>

            <select name="service" value={filteredServices.find((service) => service.name === nouveauClient.service)?.id || ""} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={!nouveauClient.offre}>
              <option value="" disabled>
                CHOISIR UNE OFFRE
              </option>
              {/* Liste des services filtrés */}
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 border border-gray-300 rounded-md bg-gray-200 p-4 text-left w-full h-16 flex items-center">
            <div className=" text-gray-600 pr-2">{nouveauClient.seancesAchetees}</div>
            <div className=" text-gray-600">{nouveauClient.seancesAchetees === 1 ? "séance" : "séances"}</div>
          </div>

          <button onClick={ajouterClient} className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
            Enregistrer le profil
          </button>
        </div>

        {/* Conteneur de défilement pour le tableau */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                {["ID", "Prénom", "Nom", "Offre", "Service", "Achat", "Utilisés"].map((header) => (
                  <th key={header} className="py-3 px-4 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-100 transition duration-200" onClick={() => openModal(client)}>
                  <td className="border px-4 py-2">{client.id}</td>
                  <td className="border px-4 py-2">{client.prenom}</td>
                  <td className="border px-4 py-2">{client.nom}</td>
                  <td className="border px-4 py-2">{client.offre}</td>
                  <td className="border px-4 py-2">{client.service}</td>
                  <td className="border px-4 py-2">{client.seancesAchetees}</td>
                  <td className="border px-4 py-2">{client.seancesConsommees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CE TABLEAU DOIT AU FORMAT MOBILE DEVENIR UNE CARD , AVEC UN SLIDER QUI PERMET DE PASSER D'UNE CARTE A UNE AUTRE */}

        {/* Modale d'édition des séances utilisées */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform scale-100 w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center tracking-tight">Modifier les séances pour</h2>
            <p className="text-xl text-gray-600 mb-6 text-center">
              {selectedClient?.prenom} {selectedClient?.nom}
            </p>
            <hr className="border-gray-300 mb-6" />

            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center mb-4">
                <button onClick={() => setNewSeances(newSeances + 1)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input type="number" value={newSeances} onChange={(e) => setNewSeances(Number(e.target.value))} className="w-20 p-2 mx-2 border border-gray-300 rounded-md text-center bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300" style={{ minWidth: "60px" }} />
                <button onClick={() => setNewSeances(newSeances - 1)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 flex items-center" disabled={newSeances <= 0}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-4 w-full">
                <button onClick={handleSave} className="mt-4 bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 w-full">
                  Sauvegarder
                </button>
                <button onClick={closeModal} className="mt-4 bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300 w-full">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SuiviClients;
