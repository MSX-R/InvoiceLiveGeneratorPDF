import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from "../Components/CustomModal"; // Assurez-vous d'importer le composant Modal

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
          setErrorMessage(""); // Réinitialiser le message d'erreur si la suppression réussit
          setIsModalOpen(false); // Fermer la modal après suppression
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

  // Filtrer les clients par nom, prénom ou ID
  const filteredClients = clients.filter((client) => client.nom.toLowerCase().includes(searchTerm.toLowerCase()) || client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || client.id.toString().includes(searchTerm) || client.telephone.toString().includes(searchTerm));

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Liste de Clients</h1>

      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8 w-full max-w-md">{errorMessage}</div>}

      <div className="mb-8 w-full max-w-md">
        <input type="text" placeholder="Rechercher par nom, prénom, ID, Téléphone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>

      <button onClick={() => navigate("/creation-profil-client")} className="mb-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
        Ajouter un Client
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img src={client.profilePicture || "icon.jpg"} alt="Profil" className="rounded-full mr-4 w-12 h-12" />
                <h2 className="text-xl font-bold text-gray-800">
                  {client.nom} {client.prenom}
                </h2>
              </div>
              <p className="text-gray-600">ID: {client.id}</p>
              <p className="text-gray-600">Email: {client.email}</p>
              <p className="text-gray-600">Téléphone: {client.telephone}</p>
              <p className="text-gray-600">
                Adresse: {client.adresse1}, {client.ville} {client.cp}
              </p>
              <p className="text-gray-600">Date de Naissance: {new Date(client.naissance).toLocaleDateString()}</p>
              <p className="text-gray-600">Sexe: {client.sexe === "Homme" ? "Homme" : "Femme"}</p>

              <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">Modifier</button>
                {(localStorage.getItem("userRole") === "1" || localStorage.getItem("userRole") === "2") && (
                  <button onClick={() => openModal(client.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Aucun client trouvé.</p>
        )}
      </div>

      {/* Utilisation du composant CustomModal pour confirmation de suppression */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleDeleteClient} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." />
    </div>
  );
};

export default ListeClients;
