// contexts/DateContext.js
import React, { createContext, useState, useEffect } from "react";

// Création du contexte
export const DateContext = createContext();

// Création du provider
export const DateProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(null);

  // Utilisation d'un effet pour définir la date du jour
  useEffect(() => {
    const updateDate = () => {
      const today = new Date(); //DATE DU JOUR
      const formattedDate = today.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Europe/Paris", // Spécifiez le fuseau horaire
      });
      setCurrentDate(formattedDate);
    };

    updateDate(); // Appel initial
    const intervalId = setInterval(updateDate, 86400000); // Met à jour la date tous les jours (86400000 ms)

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);

  return (
    <DateContext.Provider value={currentDate}>
      {currentDate ? children : <div>Chargement...</div>} {/* Ajoutez un état de chargement si la date n'est pas encore définie */}
    </DateContext.Provider>
  );
};
