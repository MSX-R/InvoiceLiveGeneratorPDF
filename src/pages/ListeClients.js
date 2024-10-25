import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from "../Components/CustomModal";
import { FaEye, FaEdit, FaTrash, FaChevronDown, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Chip from "../Components/Chip";
import FakePicture from "../assets/coach.jpg";

const ClientCards = ({ clients, offers, navigate, openModal, FakePicture }) => {
  const [visibleCards, setVisibleCards] = useState(5);

  const loadMore = () => {
    setVisibleCards((prev) => prev + 5);
  };

  return (
    <div className="space-y-4">
      {clients.slice(0, visibleCards).map((client) => {
        const clientOffers = offers[client.id] || [];
        const currentOffer = clientOffers.length > 0 ? clientOffers[0] : null;

        return (
          <div key={client.id} className="bg-white rounded-lg shadow-md p-4 space-y-3" onClick={() => navigate(`/dashboard/fiche-client/${client.id}`)}>
            {/* En-tête de la carte avec photo et nom */}
            <div className="flex items-center space-x-3">
              <img src={client.profilePicture || FakePicture} alt={`${client.prenom} ${client.nom}`} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <h3 className="font-medium text-gray-900">
                  {client.nom} {client.prenom}
                </h3>
                <p className="text-sm text-gray-500">ID: {client.id}</p>
              </div>
            </div>

            {/* Informations sur le contrat */}
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm font-medium text-gray-700">{currentOffer ? currentOffer.offre_nom : "Aucune offre souscrite"}</p>
              {currentOffer && (
                <div className="mt-1">
                  <Chip label={currentOffer.statut_paiement || "Non défini"} status={currentOffer.statut_paiement || "En attente"} />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Début: {currentOffer ? new Date(currentOffer.date_creation).toLocaleDateString() : "N/A"}</p>
            </div>

            {/* Informations de contact */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {client.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tél:</span> {client.telephone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Adresse:</span> {client.adresse1}, {client.ville} {client.cp}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Naissance:</span> {new Date(client.naissance).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sexe:</span> {client.sexe}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2 border-t">
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
            </div>
          </div>
        );
      })}

      {/* Bouton "Voir plus" */}
      {visibleCards < clients.length && (
        <button onClick={loadMore} className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200">
          <span>Voir plus</span>
          <FaChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const SortableHeader = ({ label, column, currentSort, onSort }) => {
  const isCurrentSort = currentSort.column === column;

  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100" onClick={() => onSort(column)}>
      <div className="flex items-center space-x-2">
        <span>{label}</span>
        <span className="text-gray-400">
          {!isCurrentSort && <FaSort className="opacity-0 group-hover:opacity-100" />}
          {isCurrentSort && currentSort.direction === "asc" && <FaSortUp />}
          {isCurrentSort && currentSort.direction === "desc" && <FaSortDown />}
        </span>
      </div>
    </th>
  );
};

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [offers, setOffers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortConfig, setSortConfig] = useState({
    column: "nom",
    direction: "asc",
  });
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

        const responseClients = await axios.get("https://msxghost.boardy.fr/api/users/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const filteredClients = responseClients.data.filter((user) => user.role_id === 2 || user.role_id === 3 || user.role_id === 4);
        setClients(filteredClients);

        const offerPromises = filteredClients.map((client) =>
          axios.get(`https://msxghost.boardy.fr/api/user-offres/${client.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        );

        const responsesOffers = await Promise.all(offerPromises);

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

  const filteredClients = clients.filter((client) => client.nom.toLowerCase().includes(searchTerm.toLowerCase()) || client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || client.id.toString().includes(searchTerm) || client.telephone.toString().includes(searchTerm));

  const handleSort = (column) => {
    setSortConfig((prevConfig) => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const direction = sortConfig.direction === "asc" ? 1 : -1;

      switch (sortConfig.column) {
        case "nom":
          return direction * `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`);

        case "contrat":
          const aOffer = offers[a.id]?.[0]?.offre_nom || "ZZZZ";
          const bOffer = offers[b.id]?.[0]?.offre_nom || "ZZZZ";
          return direction * aOffer.localeCompare(bOffer);

        case "debut_contrat":
          const aDate = offers[a.id]?.[0]?.date_creation || "9999-12-31";
          const bDate = offers[b.id]?.[0]?.date_creation || "9999-12-31";
          return direction * (new Date(aDate) - new Date(bDate));

        case "contact":
          return direction * a.email.localeCompare(b.email);

        case "adresse":
          const aAddress = `${a.adresse1} ${a.ville}`;
          const bAddress = `${b.adresse1} ${b.ville}`;
          return direction * aAddress.localeCompare(bAddress);

        case "naissance":
          return direction * (new Date(a.naissance) - new Date(b.naissance));

        case "sexe":
          return direction * a.sexe.localeCompare(b.sexe);

        default:
          return 0;
      }
    });
  };

  const sortedAndFilteredClients = sortData(filteredClients);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div
        className="
       mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Liste des clients</h1>

        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">{errorMessage}</div>}

        <div className="flex flex-col gap-4 md:flex-row md:justify-between items-center mb-12 md:mb-4">
          <input type="text" placeholder="Rechercher par nom, prénom, ID, Téléphone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          <button onClick={() => navigate("/dashboard/creation-profil-client")} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
            Ajouter un client
          </button>
        </div>

        {isMobile ? (
          <ClientCards clients={filteredClients} offers={offers} navigate={navigate} openModal={openModal} FakePicture={FakePicture} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader label="Nom" column="nom" currentSort={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Contrat" column="contrat" currentSort={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Début Contrat" column="debut_contrat" currentSort={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Contact" column="contact" currentSort={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Adresse" column="adresse" currentSort={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Date de Naissance" column="naissance" currentSort={sortConfig} onSort={handleSort} />
                  <SortableHeader label="Sexe" column="sexe" currentSort={sortConfig} onSort={handleSort} />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredClients.map((client) => {
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currentOffer ? new Date(currentOffer.date_creation).toLocaleDateString() : "N/A"}</td>
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
                      <td className="pr-2 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
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
        )}
      </div>

      <CustomModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleDeleteClient} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." />
    </div>
  );
};

export default ListeClients;
