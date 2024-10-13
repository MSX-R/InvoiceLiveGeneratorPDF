import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ClientDetails = ({ client }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => setIsOpen(!isOpen);

  return (
    <div className="mt-6 w-full">
      <button
        onClick={toggleDetails}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex justify-between items-center"
      >
        <span>{isOpen ? "Réduire les détails du client" : "Afficher les détails du client"}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Détails du client</h2>
                <div className="text-gray-600">
                  <p>Email: {client.email}</p>
                  <p>Téléphone: {client.telephone}</p>
                  <p>Adresse: {client.adresse1}, {client.ville} {client.cp}</p>
                  <p>Date de Naissance: {new Date(client.naissance).toLocaleDateString()}</p>
                  <p>Sexe: {client.sexe}</p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">À propos de moi</h2>
                <p className="text-gray-600">{client.aPropos || "Aucune information disponible."}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientDetails;