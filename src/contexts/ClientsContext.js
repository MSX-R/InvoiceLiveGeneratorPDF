import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  // Fonction pour récupérer les clients depuis l'API
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

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchClients();
  }, []);

  // Fonction pour ajouter un client
  const addClient = async (clientData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Erreur : Aucun token disponible");
        return;
      }

      const response = await axios.post("https://msxghost.boardy.fr/api/users", clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const newClient = response.data;
      setClients((prevClients) => [...prevClients, newClient]);
      console.log("Client ajouté avec succès :", newClient);
    } catch (err) {
      console.error("Erreur lors de l'ajout du client :", err);
    }
  };

  // Fonction pour supprimer un client
  const deleteClient = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Erreur : Aucun token disponible");
        return;
      }

      await axios.delete(`https://msxghost.boardy.fr/api/users/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
      console.log("Client supprimé avec succès :", clientId);
    } catch (err) {
      console.error("Erreur lors de la suppression du client :", err);
    }
  };

  // Fonction pour mettre à jour un client
  const updateClient = async (clientId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Erreur : Aucun token disponible");
        return;
      }

      const response = await axios.put(`https://msxghost.boardy.fr/api/users/${clientId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedClient = response.data;
      setClients((prevClients) => prevClients.map((client) => (client.id === clientId ? updatedClient : client)));
      console.log("Client mis à jour avec succès :", updatedClient);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du client :", err);
    }
  };

  // Fonction pour trouver un client par ID
  const findClientById = (clientId) => {
    return clients.find((client) => client.id === clientId);
  };

  // Nouvelle fonction pour sauvegarder les résultats des tests RM
  const saveRMTestResults = async (clientId, testData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Erreur : Aucun token disponible");
        return;
      }

      const response = await axios.post(`https://msxghost.boardy.fr/api/rm-tests`, {
        clientId,
        ...testData
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Résultats du test RM enregistrés avec succès :", response.data);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des résultats du test RM :", err);
      throw err;
    }
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        addClient,
        deleteClient,
        updateClient,
        fetchClients,
        findClientById,
        saveRMTestResults,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export default ClientsProvider;