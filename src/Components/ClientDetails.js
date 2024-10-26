import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const ClientDetails = ({ client }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => setIsOpen(!isOpen);

  return (
    <div className="mt-6 w-full">
      <button onClick={toggleDetails} className="w-full p-6 bg-sky-800 text-white rounded-lg shadow-md hover:bg-sky-600 transition flex justify-between items-center">
        <span className="font-semibold text-xl">{isOpen ? "Réduire details" : "Afficher détails"}</span>
        {isOpen ? <ChevronUp size={24} className="ml-4" /> : <ChevronDown size={24} className="ml-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Détails du client</h2>
                <div className="text-gray-600">
                  <p>Email: {client.email}</p>
                  <p>Téléphone: {client.telephone}</p>
                  <p>
                    Adresse: {client.adresse1}, {client.ville} {client.cp}
                  </p>
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
