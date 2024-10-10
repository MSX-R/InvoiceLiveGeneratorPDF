import React, { createContext, useContext, useState, useEffect } from "react";
import servicesData from "../config/services.json"; // On importe les services depuis le fichier JSON

// 1. Créer un contexte pour les offres et les services
const OffresServicesContext = createContext();

// 2. Créer un provider qui va gérer l'état et fournir les données dans l'application
export const OffresServicesProvider = ({ children }) => {
  // Définir les options d'offres
  const offerOptions = [
    { value: "unit", label: "A LA SEANCE" },
    { value: "pack", label: "AU PACK" },
    { value: "12weeks", label: "SUR 12 SEMAINES" },
  ];

  // Les services provenant du fichier JSON
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Charger les services (ici, nous avons un fichier local)
    setServices(servicesData);
  }, []);

  return <OffresServicesContext.Provider value={{ offerOptions, services }}>{children}</OffresServicesContext.Provider>;
};

// 3. Custom hook pour utiliser facilement le contexte dans l'application
export const useOffresServices = () => {
  return useContext(OffresServicesContext);
};
