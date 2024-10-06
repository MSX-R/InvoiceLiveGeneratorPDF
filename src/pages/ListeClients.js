import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import du hook useNavigate
import axios from "axios"; // Import de axios pour effectuer la requête API

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialisation du hook useNavigate

  // useEffect pour charger la liste des clients lors du montage du composant
  useEffect(() => {
    // Utilisation d'axios pour récupérer les utilisateurs
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
          if (!token) {
            console.error("Token manquant");
            return;
          }

          const response = await axios.get('https://msxghost.boardy.fr/api/users/roles', {
            headers: {
              'Authorization': `Bearer ${token}`, // Envoyer le token sous le bon format
              'Content-Type': 'application/json'
            }
          });

          // Filtrer les utilisateurs ayant le rôle "Client" (3) ou "Entreprise" (2)
          const filteredClients = response.data.filter(user => user.role_id === 2 || user.role_id === 3 || user.role_id === 4);
          setClients(filteredClients);
        } catch (err) {
          console.error("Erreur lors de la récupération des clients :", err);
        }
      };

    fetchClients();
  }, []);

  // Filtrer les clients par prénom
  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour naviguer vers la page de création de profil client
  const handleCreateClientClick = () => {
    navigate("/creation-profil-client"); // Assurez-vous que ce chemin correspond à votre route
  };

  // Fonction pour gérer la suppression d'un client
  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await axios.delete(`https://msxghost.boardy.fr/api/users/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
      } catch (err) {
        console.error("Erreur lors de la suppression du client :", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Liste de Clients</h1>

      {/* Barre de recherche */}
      <div className="mb-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Bouton pour ajouter un client */}
      <button
        onClick={handleCreateClientClick} // Gérer le clic sur le bouton
        className="mb-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Ajouter un Client
      </button>

      {/* Liste des clients sous forme de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-200"
            >
              {/* Ajout d'une image de profil dynamique */}
              <div className="flex items-center mb-4">
                <img
                  src={client.profilePicture || "icon.jpg"} // Utilisation de l'image de profil ou image par défaut
                  alt="Profil"
                  className="rounded-full mr-4 w-12 h-12" // Ajout d'une taille pour l'image
                />
                <h2 className="text-xl font-bold text-gray-800">
                  {client.nom} {client.prenom}
                </h2>
              </div>
              <p className="text-gray-600">Email: {client.email}</p>
              <p className="text-gray-600">Téléphone: {client.telephone}</p>
              <p className="text-gray-600">
                Adresse: {client.adresse1}, {client.ville} {client.cp}
              </p>
              <p className="text-gray-600">
                Date de Naissance: {new Date(client.naissance).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Sexe: {client.sexe === "Homme" ? "Homme" : "Femme"}</p>

              {/* Boutons d'action */}
              <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)} // Appeler handleDeleteClient avec l'ID du client
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Aucun client trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ListeClients;