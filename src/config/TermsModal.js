// TermsModal.js
import React from "react";
import { conditionsGeneralesDeVente } from "./conditionsGeneralesDeVente"; // Assurez-vous du bon chemin d'import

const TermsModal = ({ show, handleClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center" onClick={handleClose}>
      <div
        className="bg-white rounded-lg shadow-lg max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-4 sm:mx-6 md:mx-8 lg:mx-12 my-16 sm:my-20 p-4 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()} // Stop click event from closing modal
      >
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" aria-label="Close modal">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-semibold mb-4">Conditions Générales de Vente</h3>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          {Object.entries(conditionsGeneralesDeVente).map(([sectionKey, sectionValue]) => (
            <div key={sectionKey} className="mb-4">
              <h4 className="text-xl font-semibold mb-2">{sectionKey}</h4>
              {Array.isArray(sectionValue) ? (
                sectionValue.map((item, index) => (
                  <p key={index} className="text-gray-700 mb-2">
                    {item}
                  </p>
                ))
              ) : typeof sectionValue === "object" ? (
                Object.entries(sectionValue).map(([subKey, subValue]) => (
                  <div key={subKey} className="mb-4">
                    <h5 className="text-lg font-semibold mb-1">{subKey}</h5>
                    <p className="text-gray-700">{subValue}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">{sectionValue}</p>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-300 pt-4 mt-4 flex justify-end">
          <button onClick={handleClose} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
