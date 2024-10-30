import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDumbbell, FaUsers, FaClock, FaTimes, FaFilePdf, FaShoppingCart, FaEdit } from "react-icons/fa";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";
import ModalEditionOffres from "../Components//ModalEditionOffres";
import { useAuth } from "../contexts/AuthContext"; // Utilisation de useAuth pour accéder au contexte d'authentification

const OffreCoaching = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState(null);
  const { categories, offres, loading, error, getOffresByCategory } = useOffresCoaching();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isAdmin } = useAuth(); // Utilisation de useAuth() pour obtenir loggedUser

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const addToCart = (item) => {
    setNotification(`${item.nom} ajouté au panier`);
    setTimeout(() => setNotification(null), 3000);
  };

  const Notification = ({ message }) => (
    <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
      {message}
    </motion.div>
  );

  const getIconForType = (type) => {
    switch (type) {
      case "Solo":
        return <FaDumbbell />;
      case "Duo":
        return <FaUsers />;
      case "SmallGroup":
        return <FaUsers />;
      case "Programme":
        return <FaFilePdf />;
      default:
        return <FaClock />;
    }
  };

  const OfferCard = ({ category, isSelected }) => (
    <motion.div whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} whileTap={{ scale: 0.98 }} className={`bg-gradient-to-br ${category.couleur} text-white rounded-2xl shadow-lg p-6 cursor-pointer overflow-hidden relative ${isSelected ? "ring-4 ring-offset-2 ring-blue-300" : ""}`} onClick={() => setSelectedOffer(category)}>
      <motion.div className="absolute top-0 right-0 text-6xl opacity-10" initial={{ rotate: 0 }} whileHover={{ rotate: 15, scale: 1.2 }}>
        {getIconForType(category.type)}
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">{category.nom}</h2>
      <p className="text-lg mb-4">
        {category.duree} | {category.type}
      </p>
      <p className="text-3xl font-bold">
        {getOffresByCategory(category.id)[0]?.prix_total}€<span className="text-base"> / séance</span>
      </p>
    </motion.div>
  );

  const OfferDetails = ({ category, onClose }) => {
    const categoryOffres = getOffresByCategory(category.id);

    return (
      <motion.div initial={{ opacity: 0, y: isMobile ? "100%" : 0, x: isMobile ? 0 : 50 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: isMobile ? "100%" : 0, x: isMobile ? 0 : 50 }} className={`bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden ${isMobile ? "fixed inset-0 z-50" : "h-full"}`}>
        {isMobile && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50">
            <FaTimes size={24} />
          </button>
        )}
        <motion.div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${category.couleur} opacity-10 -mr-32 -mt-32`} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{category.nom}</h2>

        <div className="space-y-6 h-fit  overflow-hidden ">
          {categoryOffres.map((offre, index) => (
            <motion.div key={index} className="mb-4 p-3 bg-gray-100 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.02 }}>
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {offre.nom} ({offre.type})
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {offre.prix_total}€ <span className="text-base text-gray-600">total</span>
                </p>
                {offre.prix_mensuel && (
                  <p className="text-base text-gray-700">
                    {offre.prix_mensuel}€ <span className="text-gray-600">/ mois</span>
                  </p>
                )}
                <p className="text-sm text-green-600 font-semibold">{offre.prix_seance}€ / séance</p>
              </div>
              {/* <button onClick={() => addToCart({ nom: `${category.nom} - ${offre.nom}`, prix: offre.prix_total })} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                <FaShoppingCart className="inline-block mr-2" /> Choisir
              </button> */}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <>
      {" "}
      {/* ENTETE DE PAGE DYNAMIQUE */}
      <div className="bg-white p-1 md:p-4 rounded-md shadow-md mb-4 md:mb-8">
        <motion.h1 className="text-4xl sm:text-5xl font-bold text-center my-4 text-gray-800 uppercase" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {" "}
          OFFRES COACHING
        </motion.h1>
      </div>
      {isAdmin() && (
        <div className="flex justify-center mb-8">
          <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center w-full md:w-fit ">
            <FaEdit className="mr-2" /> Éditer les offres et catégories
          </button>
        </div>
      )}
      <div className="flex h-full flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col justify-between">
          {categories.map((category, index) => (
            <OfferCard key={index} category={category} isSelected={selectedOffer === category} />
          ))}
        </div>
        {!isMobile && (
          <div className="lg:w-1/2">
            <AnimatePresence mode="wait">
              {selectedOffer ? (
                <OfferDetails key={selectedOffer.id} category={selectedOffer} onClose={() => setSelectedOffer(null)} />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-2xl p-8 h-full flex items-center justify-center">
                  <p className="text-2xl text-gray-400 text-center">Sélectionnez une offre pour voir les détails</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {isMobile && (
        <AnimatePresence>
          {selectedOffer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedOffer(null);
              }}
            >
              <OfferDetails category={selectedOffer} onClose={() => setSelectedOffer(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AnimatePresence>{notification && <Notification message={notification} />}</AnimatePresence>
      <ModalEditionOffres isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  );
};

export default OffreCoaching;
