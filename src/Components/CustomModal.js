// CustomModal.js
import React from 'react';

const CustomModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

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
        <p className="mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-4 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;