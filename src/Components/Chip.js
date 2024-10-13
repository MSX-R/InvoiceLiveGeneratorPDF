import React from "react";

const Chip = ({ label, status, offer }, xs) => {
  let bgColor;

  // Définir les couleurs en fonction du statut
  switch (status) {
    case "Réglé intégralement":
      bgColor = "bg-green-500";
      break;
    case "Partiel":
      bgColor = "bg-orange-500";
      break;
    case "En attente de paiement":
      bgColor = "bg-red-500";
      break;
    default:
      bgColor = "bg-gray-500";
  }

  // Changer la couleur si une offre est spécifiée
  switch (offer) {
    case "Essentiel":
      bgColor = "bg-gradient-to-r from-blue-400 to-blue-600";
      break;
    case "Full":
      bgColor = "bg-gradient-to-r from-green-400 to-green-600";
      break;
    case "Duo":
      bgColor = "bg-gradient-to-r from-purple-400 to-purple-600";
      break;
    case "Programme":
      bgColor = "bg-gradient-to-r from-red-400 to-red-600";
      break;
    case "Manuel": // Chip grise avec texte gris foncé pour une offre personnalisée
      bgColor = "bg-gray-300";
      break;
    default:
      break; // Conserver la couleur par défaut selon le statut
  }

  return <span className={`inline-flex items-center px-3 py-1 rounded-full ${xs ? "text-xs " : "text-sm"} font-medium ${bgColor} text-white`}>{label}</span>;
};

export default Chip;
