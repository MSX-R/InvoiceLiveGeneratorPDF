import React, { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Pour générer des IDs uniques

export const ClientsContext = createContext(); // Renommé au pluriel

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  const addClient = (clientData) => {
    // Ajouter un ID unique au client avant de l'ajouter à la liste
    const newClient = { ...clientData, id: uuidv4() };
    setClients((prevClients) => {
      const updatedClients = [...prevClients, newClient];
      console.log("Etat de la liste CLIENTS après ajout :", updatedClients); // Affichez l'état mis à jour des clients
      return updatedClients; // Retourner la nouvelle liste de clients
    });
  };

  // Fonction pour supprimer un client
  const deleteClient = (clientId) => {
    setClients((prevClients) => {
      const updatedClients = prevClients.filter((client) => client.id !== clientId);
      console.log("Etat de la liste CLIENTS après suppression :", updatedClients); // Affichez l'état mis à jour des clients
      return updatedClients; // Retourner la nouvelle liste de clients
    });
  };

  // Fonction pour mettre à jour un client
  const updateClient = (clientId, updatedData) => {
    setClients((prevClients) => {
      const updatedClients = prevClients.map((client) =>
        client.id === clientId ? { ...client, ...updatedData } : client
      );
      console.log("Etat de la liste CLIENTS après mise à jour :", updatedClients); // Affichez l'état mis à jour des clients
      return updatedClients; // Retourner la nouvelle liste de clients
    });
  };

  return (
    <ClientsContext.Provider value={{ clients, addClient, deleteClient, updateClient }}>
      {children}
    </ClientsContext.Provider>
  );
};
