import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from "../Components/CustomModal";
import { FaEye, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import Chip from "../Components/Chip";
import FakePicture from "../assets/coach.jpg";

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [offers, setOffers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchClientsAndOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Erreur : Aucun token disponible");
          return;
        }

        // Récupérer la liste des clients
        const responseClients = await axios.get("https://msxghost.boardy.fr/api/users/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const filteredClients = responseClients.data.filter((user) => user.role_id === 2 || user.role_id === 3 || user.role_id === 4);
        setClients(filteredClients);

        // Récupérer les offres pour chaque client
        const offerPromises = filteredClients.map((client) =>
          axios.get(`https://msxghost.boardy.fr/api/user-offres/${client.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        );

        const responsesOffers = await Promise.all(offerPromises);

        // Créer un dictionnaire d'offres par client
        const offersByClient = {};
        responsesOffers.forEach((response, index) => {
          const clientId = filteredClients[index].id;
          offersByClient[clientId] = response.data;
        });

        setOffers(offersByClient);
      } catch (err) {
        console.error("Erreur lors de la récupération des clients et des offres :", err);
        setErrorMessage("Erreur lors de la récupération des clients.");
      }
    };

    fetchClientsAndOffers();
  }, []);

  const handleDeleteClient = async () => {
    if (selectedClientId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Erreur : Aucun token disponible");
          return;
        }

        const response = await axios.delete(`https://msxghost.boardy.fr/api/users/${selectedClientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setClients((prevClients) => prevClients.filter((client) => client.id !== selectedClientId));
          setErrorMessage("");
          setIsModalOpen(false);
        } else {
          setErrorMessage("Erreur lors de la suppression du client.");
        }
      } catch (err) {
        console.error("Erreur lors de la suppression du client :", err);
        setErrorMessage("Erreur lors de la suppression du client.");
      }
    }
  };

  const openModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toString().includes(searchTerm) ||
      client.telephone.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Liste de Clients</h1>

        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">{errorMessage}</div>}

        <div className="flex flex-col gap-4 md:flex-row md:justify-between items-center mb-12 md:mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, ID, Téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={() => navigate("/dashboard/creation-profil-client")}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Ajouter un Client
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début Contrat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Naissance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => {
                const clientOffers = offers[client.id] || [];
                const currentOffer = clientOffers.length > 0 ? clientOffers[0] : null;

                return (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest("button")) {
                        navigate(`/dashboard/fiche-client/${client.id}`);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover" src={client.profilePicture || FakePicture} alt={`${client.prenom} ${client.nom}`} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.nom} {client.prenom}
                          </div>
                          <div className="text-sm text-gray-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col justify-center">
                        <span className="text-sm text-gray-900">{currentOffer ? currentOffer.offre_nom : "Aucune offre souscrite"}</span>
                        {currentOffer && <Chip label={currentOffer.statut_paiement || "Non défini"} status={currentOffer.statut_paiement || "En attente"} />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentOffer ? new Date(currentOffer.date_creation).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.telephone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.adresse1}</div>
                      <div className="text-sm text-gray-500">
                        {client.ville}, {client.cp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(client.naissance).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.sexe}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/fiche-client/${client.id}`);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/modifier-profil-client/${client.id}`);
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                      >
                        <FaEdit />
                      </button>
                      {(localStorage.getItem("userRole") === "1" || localStorage.getItem("userRole") === "2") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(client.id);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleDeleteClient} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." />
    </div>
  );
};

export default ListeClients;
