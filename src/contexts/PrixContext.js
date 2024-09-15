import React, { createContext, useState, useContext, useEffect } from "react";

// Création du contexte
const PrixContext = createContext();

const initialServices = (prixFixe) => [
  { id: 1, name: "Essai", quantity: 1, prix: 0, type: "unit", remise: 0 },
  { id: 2, name: "Coaching 1h", quantity: 1, prix: prixFixe, type: "unit", remise: 0 },
  { id: 11, name: "Pack-5séances", quantity: 5, prix: 60, type: "pack", remise: 0 },
  { id: 12, name: "Pack-10séances", quantity: 10, prix: 55, type: "pack", remise: 0 },
  { id: 13, name: "Pack-20séances", quantity: 20, prix: 50, type: "pack", remise: 0 },
  { id: 21, name: "1 séance/semaine", quantity: 1, prix: prixFixe, type: "weekly", remise: 0 },
  { id: 22, name: "2 séances/semaine", quantity: 2, prix: prixFixe * 0.95, type: "weekly", remise: 2.5 },
  { id: 23, name: "3 séances/semaine", quantity: 3, prix: prixFixe * 0.9, type: "weekly", remise: 5 },
  { id: 24, name: "4 séances/semaine", quantity: 4, prix: prixFixe * 0.85, type: "weekly", remise: 7.5 },
  { id: 25, name: "5 séances/semaine", quantity: 5, prix: prixFixe * 0.85, type: "weekly", remise: 10 },
  { id: 31, name: "1 séance/semaine", quantity: 12, prix: prixFixe * 0.9, type: "12weeks", remise: 10 },
  { id: 32, name: "2 séances/semaine", quantity: 24, prix: prixFixe * 0.875, type: "12weeks", remise: 12.5 },
  { id: 33, name: "3 séances/semaine", quantity: 36, prix: prixFixe * 0.8, type: "12weeks", remise: 20 },
  { id: 34, name: "4 séances/semaine", quantity: 48, prix: prixFixe * 0.75, type: "12weeks", remise: 25 },
  { id: 35, name: "5 séances/semaine", quantity: 60, prix: prixFixe * 0.75, type: "12weeks", remise: 25 },
];

// Fournisseur du contexte
export const PrixProvider = ({ children }) => {
  const [prixFixe, setPrixFixe] = useState(70); // Prix fixe par défaut
  const [services, setServices] = useState(initialServices(prixFixe)); // Services initiaux

  // Effet pour mettre à jour les services lorsque le prix fixe change
  useEffect(() => {
    const updatedServices = initialServices(prixFixe);
    setServices(updatedServices);
  }, [prixFixe]);

  // Fonction pour mettre à jour le prix fixe
  // Fonction pour mettre à jour le prix fixe
  const updatePrixFixe = (nouveauPrix) => {
    if (nouveauPrix === "" || nouveauPrix === null) {
      setPrixFixe("");
    } else if (Number(nouveauPrix) >= 0) {
      setPrixFixe(Number(nouveauPrix));
    }
  };

  return <PrixContext.Provider value={{ prixFixe, services, updatePrixFixe }}>{children}</PrixContext.Provider>;
};

// Hook personnalisé pour accéder au contexte
export const usePrix = () => useContext(PrixContext);
