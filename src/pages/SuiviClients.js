import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import Select from "react-select";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";

// Configuration de la modale
Modal.setAppElement("#root");

const SuiviClients = () => {
  const { offres, programme, loading: offresLoading, error: offresError } = useOffresCoaching();
  const [clients, setClients] = useState([]);
  const [clientsWithSessions, setClientsWithSessions] = useState([]);
  const [nouveauClient, setNouveauClient] = useState({
    client: null,
    prenom: "",
    nom: "",
    typeOffre: "",
    offre: "",
    seancesAchetees: 0,
    seancesConsommees: 0,
  });

  const [selectedTypeOffre, setSelectedTypeOffre] = useState("");
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [newSeances, setNewSeances] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Erreur : Aucun token disponible");
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
      }
    };

    fetchClients();
  }, []);

  const handleClientSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedClient = clients.find((client) => client.id === selectedOption.value);
      setNouveauClient({
        ...nouveauClient,
        client: selectedOption,
        prenom: selectedClient.prenom,
        nom: selectedClient.nom,
      });
    } else {
      setNouveauClient({
        ...nouveauClient,
        client: null,
        prenom: "",
        nom: "",
      });
    }
  };

  const handleTypeOffreChange = (selectedOption) => {
    setSelectedTypeOffre(selectedOption.value);
    setSelectedOffre(null);
    setNouveauClient({ ...nouveauClient, typeOffre: selectedOption.value, offre: "", seancesAchetees: 0 });
  };

  const handleOffreChange = (selectedOption) => {
    setSelectedOffre(selectedOption.value);
    const offreDetails = getOffreDetails(selectedOption.value);
    setNouveauClient({
      ...nouveauClient,
      offre: selectedOption.value,
      seancesAchetees: offreDetails.seancesAchetees,
    });
  };

  const getOffreDetails = (offreName) => {
    const selectedOffre = offres.find((offre) => offre.title === selectedTypeOffre);
    if (!selectedOffre) return null;

    if (selectedOffre.price.single && selectedOffre.price.single.name === offreName) {
      return { ...selectedOffre.price.single, seancesAchetees: 1 };
    }

    const packOffre = selectedOffre.price.pack && selectedOffre.price.pack.find((pack) => pack.name === offreName);
    if (packOffre) return { ...packOffre, seancesAchetees: packOffre.sessions };

    const followUpOffre = selectedOffre.price.followUp && selectedOffre.price.followUp.find((followUp) => followUp.name === offreName);
    if (followUpOffre) return { ...followUpOffre, seancesAchetees: followUpOffre.sessions };

    return null;
  };

  const ajouterClient = () => {
    if (nouveauClient.client && nouveauClient.typeOffre && nouveauClient.offre) {
      const offreDetails = getOffreDetails(nouveauClient.offre);

      // Ajouter le client avec les détails de l'offre et des séances
      setClientsWithSessions((prevClients) => [
        ...prevClients,
        {
          id: prevClients.length + 1,
          prenom: nouveauClient.prenom,
          nom: nouveauClient.nom,
          typeOffre: nouveauClient.typeOffre,
          offre: nouveauClient.offre,
          seancesAchetees: offreDetails.seancesAchetees,
          seancesConsommees: 0,
        },
      ]);

      // Réinitialiser les champs après l'ajout du client
      setNouveauClient({
        client: null,
        prenom: "",
        nom: "",
        typeOffre: "",
        offre: "",
        seancesAchetees: 0,
        seancesConsommees: 0,
      });

      // Réinitialiser les listes déroulantes
      setSelectedTypeOffre(""); // Réinitialise le type d'offre
      setSelectedOffre(null); // Réinitialise l'offre sélectionnée
    }
  };

  const mettreAJourClient = (client, newSeancesConsommees, newSeancesAchetees) => {
    const { prenom, nom } = client;

    if (newSeancesConsommees === newSeancesAchetees) {
      setModalMessage(`${prenom} ${nom} a terminé son offre avec succès`);
      setModalIsOpen(true);
    } else if (newSeancesConsommees > newSeancesAchetees) {
      const nombreManquant = newSeancesConsommees - newSeancesAchetees;
      setModalMessage(`${prenom} ${nom} doit ${nombreManquant} séance${nombreManquant > 1 ? "s" : ""} supplémentaire à prix unique`);
      setModalIsOpen(true);
    } else if (newSeancesConsommees === newSeancesAchetees - 1) {
      setModalMessage(`${prenom} ${nom} doit prendre une offre`);
      setModalIsOpen(true);
    }

    return { ...client, seancesConsommees: newSeancesConsommees, seancesAchetees: newSeancesAchetees };
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

  const handleSave = (action) => {
    setClientsWithSessions((prevClients) =>
      prevClients.map((client) => {
        if (client.id === selectedClient.id) {
          let newSeancesConsommees = client.seancesConsommees;
          let newSeancesAchetees = client.seancesAchetees;

          switch (action) {
            case "effectuee":
              newSeancesConsommees += 1;
              break;
            case "corriger":
              newSeancesConsommees = Math.max(0, newSeancesConsommees - 1);
              break;
            case "offrir":
              newSeancesAchetees += 1;
              break;
            default:
              break;
          }

          return mettreAJourClient(client, newSeancesConsommees, newSeancesAchetees);
        }
        return client;
      })
    );
    closeModal();
  };

  const offerOptions = offres.map((offre) => ({
    value: offre.title,
    label: `${offre.title} | ${offre.duration}`,
  }));

  const getServiceOptions = () => {
    if (!selectedTypeOffre) return [];

    const selectedOffreType = offres.find((offre) => offre.title === selectedTypeOffre);
    if (!selectedOffreType) return [];

    const options = [];
    if (selectedOffreType.price.single) {
      options.push({
        value: selectedOffreType.price.single.name,
        label: `${selectedOffreType.price.single.name} - ${selectedOffreType.price.single.amount}€`,
      });
    }
    if (selectedOffreType.price.pack) {
      selectedOffreType.price.pack.forEach((pack) => {
        options.push({
          value: pack.name,
          label: `${pack.name} - ${pack.amount}€`,
        });
      });
    }
    if (selectedOffreType.price.followUp) {
      selectedOffreType.price.followUp.forEach((followUp) => {
        options.push({
          value: followUp.name,
          label: `${followUp.name} - ${followUp.amount}€`,
        });
      });
    }
    return options;
  };

  if (offresLoading) {
    return <div>Chargement des offres...</div>;
  }

  if (offresError) {
    return <div>Erreur : {offresError}</div>;
  }

  const getSeancesConsommeesColor = (client) => {
    if (client.seancesConsommees > client.seancesAchetees) {
      return "bg-red-200";
    } else if (client.seancesConsommees === client.seancesAchetees) {
      return "bg-green-200";
    } else if (client.seancesAchetees - client.seancesConsommees === 1) {
      return "bg-yellow-200";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Suivi des Clients | Compteur de Séances</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Attribution d'une offre au client</h2>
          <div className="mb-4">
            <Select options={clients.map((client) => ({ value: client.id, label: `${client.prenom} ${client.nom}` }))} value={nouveauClient.client} onChange={handleClientSelect} placeholder="Sélectionner un client" className="w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Sélecteur pour le type d'offre */}
            <Select options={offerOptions} value={selectedTypeOffre ? offerOptions.find((option) => option.value === selectedTypeOffre) : null} onChange={handleTypeOffreChange} placeholder="Sélectionner un type d'offre" className="w-full" />

            {/* Sélecteur pour l'offre */}
            <Select options={getServiceOptions()} value={selectedOffre ? getServiceOptions().find((option) => option.value === selectedOffre) : null} onChange={handleOffreChange} placeholder="Sélectionner une offre" className="w-full" isDisabled={!selectedTypeOffre} />
          </div>
          <div className="mb-4 border border-gray-300 rounded-md bg-gray-200 p-4 text-left w-full h-16 flex items-center">
            <div className="text-gray-600 pr-2">{nouveauClient.seancesAchetees}</div>
            <div className="text-gray-600">{nouveauClient.seancesAchetees === 1 ? "séance" : "séances"}</div>
          </div>

          <button onClick={ajouterClient} className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
            Sauvegarder l'Attribution
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                {["ID", "Prénom", "Nom", "Type d'offre", "Offre", "Achat", "Utilisés"].map((header) => (
                  <th key={header} className="py-3 px-4 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {clientsWithSessions.map((client) => (
                <tr key={client.id} className="hover:bg-gray-100 transition duration-200" onClick={() => openModal(client)}>
                  <td className="border px-4 py-2">{client.id}</td>
                  <td className="border px-4 py-2">{client.prenom}</td>
                  <td className="border px-4 py-2">{client.nom}</td>
                  <td className="border px-4 py-2">{client.typeOffre}</td>
                  <td className="border px-4 py-2">{client.offre}</td>
                  <td className="border px-4 py-2">{client.seancesAchetees}</td>
                  <td className={`border px-4 py-2 ${getSeancesConsommeesColor(client)}`}>{client.seancesConsommees}</td>{" "}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform scale-100 w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center tracking-tight">Modifier les séances pour</h2>
            <p className="text-xl text-gray-600 mb-6 text-center">
              {selectedClient?.prenom} {selectedClient?.nom}
            </p>
            <hr className="border-gray-300 mb-6" />

            <div className="flex flex-col items-center mb-6">
              <p className="text-lg mb-4">
                Séances achetées : {selectedClient?.seancesAchetees} | Séances consommées : {selectedClient?.seancesConsommees}
              </p>
              <div className="flex justify-center gap-4 w-full">
                <button onClick={() => handleSave("effectuee")} className="mt-4 bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 w-full">
                  Séance effectuée
                </button>
                <button onClick={() => handleSave("corriger")} className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300 w-full">
                  Corriger x1
                </button>
                <button onClick={() => handleSave("offrir")} className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                  Offrir une séance
                </button>
              </div>
              <button onClick={closeModal} className="mt-4 bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300 w-full">
                Annuler
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal pour les messages */}
        <Modal isOpen={!!modalMessage} onRequestClose={() => setModalMessage("")} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform scale-100 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Message</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">{modalMessage}</p>
            <div className="flex justify-center">
              <button onClick={() => setModalMessage("")} className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300">
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SuiviClients; //Ancien code

// import React, { useState } from "react";
// import Modal from "react-modal";
// import { useOffresServices } from "../contexts/OffresServicesContext";

// // Configuration de la modale
// Modal.setAppElement("#root");

// const SuiviClients = () => {
//   const { offerOptions, services } = useOffresServices();
//   const [clients, setClients] = useState([
//     { id: 1, prenom: "Romain", nom: "Marsaleix", offre: "pack", service: "Pack-5", seancesAchetees: 5, seancesConsommees: 2 },
//     { id: 2, prenom: "Loic", nom: "Mennella", offre: "12weeks", service: "2 séances/semaine", seancesAchetees: 10, seancesConsommees: 8 },
//   ]);

//   const [nouveauClient, setNouveauClient] = useState({
//     prenom: "",
//     nom: "",
//     offre: "",
//     service: "",
//     seancesAchetees: 0,
//     seancesConsommees: 0,
//   });

//   const [filteredServices, setFilteredServices] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const [selectedClient, setSelectedClient] = useState(null);
//   const [newSeances, setNewSeances] = useState(0);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNouveauClient({ ...nouveauClient, [name]: value });

//     if (name === "offre") {
//       const filtered = services.filter((service) => service.type === value);
//       setFilteredServices(filtered);
//       setNouveauClient((prev) => ({ ...prev, service: "", seancesAchetees: 0 }));
//     }

//     if (name === "service") {
//       const selectedService = services.find((service) => service.id === parseInt(value, 10));
//       if (selectedService) {
//         setNouveauClient((prev) => ({ ...prev, service: selectedService.name, seancesAchetees: selectedService.quantity }));
//       }
//     }
//   };

//   const ajouterClient = () => {
//     if (nouveauClient.prenom && nouveauClient.nom && nouveauClient.offre && nouveauClient.service) {
//       setClients((prevClients) => [
//         ...prevClients,
//         {
//           id: prevClients.length + 1,
//           ...nouveauClient,
//           seancesConsommees: 0,
//         },
//       ]);
//       setNouveauClient({ prenom: "", nom: "", offre: "", service: "", seancesAchetees: 0, seancesConsommees: 0 });
//     }
//   };

//   const mettreAJourClient = (client, newSeances) => {
//     const { prenom, nom } = client;

//     if (newSeances === client.seancesAchetees) {
//       setModalMessage(`${prenom} ${nom} a terminé son offre avec succès`);
//       setModalIsOpen(true);
//     } else if (newSeances > client.seancesAchetees) {
//       const nombreManquant = newSeances - client.seancesAchetees;
//       setModalMessage(`${prenom} ${nom} doit ${nombreManquant} séance${nombreManquant > 1 ? "s" : ""} supplémentaire à prix unique`);
//       setModalIsOpen(true);
//     } else if (newSeances === client.seancesAchetees - 1) {
//       setModalMessage(`${prenom} ${nom} doit prendre une offre`);
//       setModalIsOpen(true);
//     }

//     return { ...client, seancesConsommees: newSeances };
//   };

//   const ajouterSeance = (id) => {
//     setClients((prevClients) => prevClients.map((client) => (client.id === id ? mettreAJourClient(client, client.seancesConsommees + 1) : client)));
//   };

//   const retirerSeance = (id) => {
//     setClients((prevClients) => prevClients.map((client) => (client.id === id && client.seancesConsommees > 0 ? mettreAJourClient(client, client.seancesConsommees - 1) : client)));
//   };

//   const openModal = (client) => {
//     setSelectedClient(client);
//     setNewSeances(client.seancesConsommees);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setSelectedClient(null);
//   };

//   const handleSave = () => {
//     setClients((prevClients) => prevClients.map((client) => (client.id === selectedClient.id ? { ...client, seancesConsommees: newSeances } : client)));
//     closeModal();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//         <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Suivi des Clients | Compteur de Séances</h1>

//         <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-md">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">Créer un Profil Client</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//             <input type="text" name="prenom" value={nouveauClient.prenom} onChange={handleChange} placeholder="Prénom" className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//             <input type="text" name="nom" value={nouveauClient.nom} onChange={handleChange} placeholder="Nom" className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//             <select name="offre" value={nouveauClient.offre} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="" disabled>
//                 CHOISIR UN TYPE D'OFFRE
//               </option>
//               {offerOptions.map((offer) => (
//                 <option key={offer.value} value={offer.value}>
//                   {offer.label}
//                 </option>
//               ))}
//             </select>

//             <select name="service" value={filteredServices.find((service) => service.name === nouveauClient.service)?.id || ""} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={!nouveauClient.offre}>
//               <option value="" disabled>
//                 CHOISIR UNE OFFRE
//               </option>
//               {filteredServices.map((service) => (
//                 <option key={service.id} value={service.id}>
//                   {service.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4 border border-gray-300 rounded-md bg-gray-200 p-4 text-left w-full h-16 flex items-center">
//             <div className=" text-gray-600 pr-2">{nouveauClient.seancesAchetees}</div>
//             <div className=" text-gray-600">{nouveauClient.seancesAchetees === 1 ? "séance" : "séances"}</div>
//           </div>

//           <button onClick={ajouterClient} className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
//             Enregistrer le profil
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//               <tr>
//                 {["ID", "Prénom", "Nom", "Offre", "Service", "Achat", "Utilisés"].map((header) => (
//                   <th key={header} className="py-3 px-4 text-left">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="text-gray-600 text-sm font-light">
//               {clients.map((client) => (
//                 <tr key={client.id} className="hover:bg-gray-100 transition duration-200" onClick={() => openModal(client)}>
//                   <td className="border px-4 py-2">{client.id}</td>
//                   <td className="border px-4 py-2">{client.prenom}</td>
//                   <td className="border px-4 py-2">{client.nom}</td>
//                   <td className="border px-4 py-2">{client.offre}</td>
//                   <td className="border px-4 py-2">{client.service}</td>
//                   <td className="border px-4 py-2">{client.seancesAchetees}</td>
//                   <td className="border px-4 py-2">{client.seancesConsommees}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform scale-100 w-full max-w-lg">
//             <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center tracking-tight">Modifier les séances pour</h2>
//             <p className="text-xl text-gray-600 mb-6 text-center">
//               {selectedClient?.prenom} {selectedClient?.nom}
//             </p>
//             <hr className="border-gray-300 mb-6" />

//             <div className="flex flex-col items-center mb-6">
//               <div className="flex items-center mb-4">
//                 <button onClick={() => setNewSeances(newSeances + 1)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </button>
//                 <input type="number" value={newSeances} onChange={(e) => setNewSeances(Number(e.target.value))} className="w-20 p-2 mx-2 border border-gray-300 rounded-md text-center bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300" style={{ minWidth: "60px" }} />
//                 <button onClick={() => setNewSeances(newSeances - 1)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 flex items-center" disabled={newSeances <= 0}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="flex justify-center gap-4 w-full">
//                 <button onClick={handleSave} className="mt-4 bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 w-full">
//                   Sauvegarder
//                 </button>
//                 <button onClick={closeModal} className="mt-4 bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300 w-full">
//                   Annuler
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default SuiviClients;
