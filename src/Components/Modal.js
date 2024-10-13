// components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
