import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from "../Components/CustomModal";
import { FaEye, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import Chip from "../Components/Chip";
import FakePicture from "../assets/coach.jpg";

const ClientCard = ({ client, onViewDetails, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-8">
    <div className="flex items-start gap-4">
      <img className="h-16 w-16 rounded-full object-cover" src={client.profilePicture || FakePicture} alt={`${client.prenom} ${client.nom}`} />{" "}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {client.prenom} {client.nom}
        </h3>
        <p className="text-sm text-gray-600 ">
          {" "}
          <span className="font-medium">ID:</span> {client.id}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Offre :</span> {client.offreChoisie || "Offre test 2 séances"}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Etat :</span> <Chip xs label="En attente de paiement" status="En attente de paiement" />
        </p>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-600">
        <span className="font-medium">Email:</span> {client.email}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Telephone:</span> {client.telephone}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Adresse:</span> {client.adresse1}, {client.ville} {client.cp}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Date de naissance:</span> {new Date(client.naissance).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Sexe:</span> {client.sexe}
      </p>
    </div>

    <div className="mt-2 flex justify-end gap-2">
      <button onClick={() => onViewDetails(client.id)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
        <FaEye />
      </button>
      <button onClick={() => onEdit(client.id)} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
        <FaEdit />
      </button>
      <button onClick={() => onDelete(client.id)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
        <FaTrash />
      </button>
    </div>
  </div>
);

const MobileClientCards = ({ clients, onViewDetails, onEdit, onDelete }) => {
  const [visibleCards, setVisibleCards] = useState(5);

  const extendedClients = [...clients];
  while (extendedClients.length < 7) {
    extendedClients.push({
      id: `fake-${extendedClients.length + 1}`,
      nom: "Doe",
      prenom: "John",
      email: "john.doe@example.com",
      telephone: "0123456789",
      adresse1: "123 Rue Factice",
      ville: "Ville Factice",
      cp: "12345",
      naissance: "1990-01-01",
      sexe: "Homme",
      offreChoisie: "Offre Factice",
    });
  }

  const loadMore = () => {
    setVisibleCards((prevVisible) => prevVisible + 5);
  };

  return (
    <div>
      {extendedClients.slice(0, visibleCards).map((client) => (
        <ClientCard key={client.id} client={client} onViewDetails={onViewDetails} onEdit={onEdit} onDelete={onDelete} />
      ))}
      {visibleCards < extendedClients.length && (
        <div className="flex justify-center mt-4">
          <button onClick={loadMore} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300">
            Voir plus <FaChevronDown className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

const ListeClients = () => {
  const [clients, setClients] = useState([]);
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
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Erreur : Aucun token disponible");
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
        setErrorMessage("Erreur lors de la récupération des clients.");
      }
    };

    fetchClients();
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Liste de Clients</h1>

        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">{errorMessage}</div>}

        <div className="flex flex-col gap-4 md:flex-row md:justify-between items-center mb-12 md:mb-4">
          <input type="text" placeholder="Rechercher par nom, prénom, ID, Téléphone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          <button onClick={() => navigate("/dashboard/creation-profil-client")} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
            Ajouter un Client
          </button>
        </div>

        {isMobile ? (
          <MobileClientCards clients={filteredClients} onViewDetails={(id) => navigate(`/dashboard/fiche-client/${id}`)} onEdit={(id) => navigate(`/dashboard/modifier-profil-client/${id}`)} onDelete={openModal} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contrat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                    DEBUT CONTRAT{" "}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Naissance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sexe
                  </th>

                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
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
                        {/* Je n'arrive pas a recuperer la photo */}
                        <img className="h-10 w-10 rounded-full object-cover" src={client.profilePicture || FakePicture} alt={`${client.prenom} ${client.nom}`} />{" "}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.nom} {client.prenom}
                          </div>
                          <div className="text-sm text-gray-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                      <div className="flex flex-col  justify-center">
                        <span className=" text-sm text-gray-900">{client.offreChoisie || "Offre test 2 séances"}</span>
                        <Chip label="En attente de paiement" status="En attente de paiement" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="text-sm text-gray-900">01/10/2024</div>
                      {/* <div className="text-sm text-gray-500">01/11/2024</div> */}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">{new Date(client.naissance).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">{client.sexe}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 ">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/fiche-client/${client.id}`);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 "
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/modifier-profil-client/${client.id}`);
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 "
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
                ))}
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
