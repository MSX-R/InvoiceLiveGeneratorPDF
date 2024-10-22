import React from 'react';

const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmButtonColor = "red", // Par défaut, le bouton est rouge
  hideConfirmButton = false,  // Par défaut, le bouton "Confirmer" est affiché
  confirmButtonText = "Confirmer", // Texte par défaut pour le bouton de confirmation
}) => {
  if (!isOpen) return null;

  // Déterminer la couleur du bouton "Confirmer" en fonction de la prop confirmButtonColor
  let confirmButtonClasses;
  switch (confirmButtonColor) {
    case "blue":
      confirmButtonClasses = "bg-blue-600 hover:bg-blue-700";
      break;
    case "green":
      confirmButtonClasses = "bg-green-600 hover:bg-green-700";
      break;
    case "red":
    default:
      confirmButtonClasses = "bg-red-600 hover:bg-red-700";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-800 opacity-50 z-40"
        onClick={onClose} // Fermer la modal en cliquant sur l'overlay
      ></div>

      {/* Contenu de la modal */}
      <div className="bg-white p-6 rounded-lg shadow-lg z-50 max-w-md w-full relative">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        
        {/* Contenu personnalisé */}
        {children && (
          <div className="mb-6">
            {children}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-4 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            {hideConfirmButton ? "Fermer" : "Annuler"}
          </button>
          {!hideConfirmButton && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md ${confirmButtonClasses}`}
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;