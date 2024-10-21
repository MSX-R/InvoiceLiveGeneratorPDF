import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Contenu de la modale */}
          <motion.div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full md:w-3/4 lg:w-1/2 h-4/5 overflow-auto" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
            {/* Bouton de fermeture (croix) */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-300">
              <FaTimes size={24} />
            </button>

            {/* Titre de la modale */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>

            {/* Contenu dynamique de la modale */}
            <div className="text-gray-700">{children}</div>

            {/* Bouton de fermeture au bas de la modale */}
            <div className="flex justify-center mt-6">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg">
                Fermer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

// // components/Modal.js
// import React from "react";

// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex  items-center justify-center z-50 bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full h-4/5 overflow-auto">

//         <h2 className="text-2xl font-semibold mb-4">{title}</h2>
//         <div>{children}</div>
//         <div className="flex justify-end mt-4">
//           <button onClick={onClose} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
//             Fermer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
