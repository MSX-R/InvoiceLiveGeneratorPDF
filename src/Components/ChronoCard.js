import React from 'react';
import { FaPlay, FaTrash, FaClock, FaDumbbell } from 'react-icons/fa';

const ChronoCard = ({ chrono, startChrono, deleteChrono }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{chrono.name}</h2>
        <div className="space-y-2 mb-4">
          <p className="text-gray-600 flex items-center">
            <FaClock className="mr-2 text-blue-500" />
            <span className="font-semibold">Rounds:</span> {chrono.rounds}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaDumbbell className="mr-2 text-green-500" />
            <span className="font-semibold">Exercices:</span> {Array.isArray(chrono.exercises) ? chrono.exercises.length : 0}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 space-x-2">
        <button 
          onClick={() => startChrono(chrono)} 
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
        >
          <FaPlay className="mr-2" /> Démarrer
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteChrono(chrono.id);
          }}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
          aria-label="Supprimer"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ChronoCard;


///import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from "../Components/CustomModal";

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const navigate = useNavigate();

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

        <div className="flex justify-between items-center mb-8">
          <input type="text" placeholder="Rechercher par nom, prénom, ID, Téléphone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          <button onClick={() => navigate("/creation-profil-client")} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
            Ajouter un Client
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
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
                  Offre Choisie
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={client.profilePicture || "icon.jpg"} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.nom} {client.prenom}
                        </div>
                        <div className="text-sm text-gray-500">ID: {client.id}</div>
                      </div>
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.offreChoisie || "Aucune offre"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => navigate(`/modifier-profil-client/${client.id}`)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                      Modifier
                    </button>
                    {(localStorage.getItem("userRole") === "1" || localStorage.getItem("userRole") === "2") && (
                      <button onClick={() => openModal(client.id)} className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleDeleteClient} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." />
    </div>
  );
};

export default ListeClients;


// TOP ECRAN 
