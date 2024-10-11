import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDumbbell, FaUsers, FaClock, FaTimes, FaFilePdf, FaShoppingCart } from "react-icons/fa";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";

const OffreCoaching = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState(null);
  const { offres, programme } = useOffresCoaching();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const addToCart = (item) => {
    console.log("Ajouté au panier:", item);
    setNotification(`${item.title} ajouté au panier`);
    setTimeout(() => setNotification(null), 3000);
  };

  const Notification = ({ message }) => (
    <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
      {message}
    </motion.div>
  );

  const OfferCard = ({ offer, isSelected }) => (
    <motion.div whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} whileTap={{ scale: 0.98 }} className={`bg-gradient-to-br ${offer.color} text-white rounded-2xl shadow-lg p-6 cursor-pointer overflow-hidden relative ${isSelected ? "ring-4 ring-offset-2 ring-blue-300" : ""}`} onClick={() => setSelectedOffer(offer)}>
      <motion.div className="absolute top-0 right-0 text-6xl opacity-10" initial={{ rotate: 0 }} whileHover={{ rotate: 15, scale: 1.2 }}>
        {offer.icon}
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
      <p className="text-lg mb-4">
        {offer.duration} | {offer.type}
      </p>
      <p className="text-3xl font-bold">
        {offer.price.single.amount}€<span className="text-base"> / {offer.price.single.text}</span>
      </p>
    </motion.div>
  );

  const OfferDetails = ({ offer, onClose }) => (
    <motion.div initial={{ opacity: 0, y: isMobile ? "100%" : 0, x: isMobile ? 0 : 50 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: isMobile ? "100%" : 0, x: isMobile ? 0 : 50 }} className={`bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden ${isMobile ? "fixed inset-0 z-50" : "h-full"}`}>
      {isMobile && (
        <button onClick={onClose} className="absolute  top-4 right-4 text-gray-500 hover:text-gray-700 z-50">
          <FaTimes size={24} />
        </button>
      )}
      <motion.div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${offer.color} opacity-10 -mr-32 -mt-32`} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{offer.title}</h2>

      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div>
          {offer.title === "PROGRAMME D'ENTRAINEMENT" ? "" : <h3 className="text-xl font-semibold mb-3 text-gray-700">Séance unique</h3>}
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              {offer.price.single.amount}€ <span className="text-base text-gray-600">/ {offer.price.single.text}</span>
            </p>
            <button onClick={() => addToCart({ title: `${offer.title} - Séance unique`, price: offer.price.single.amount })} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 ">
              <FaShoppingCart className="inline-block mr-2" /> Choisir
            </button>
          </div>
        </div>

        {offer.price.pack && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Packs</h3>
            {offer.price.pack.map((pack, index) => (
              <motion.div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.02 }}>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {pack.sessions} séances : {pack.amount}€
                  </p>
                  <p className="text-sm text-green-600 font-semibold">{pack.perSession}€ / séance</p>

                  {pack.discount > 0 && <p className="text-green-500 font-semibold text-sm">Économisez {pack.discount}€</p>}
                </div>
                <button onClick={() => addToCart({ title: `${offer.title} - Pack ${pack.sessions} séances`, price: pack.amount })} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  <FaShoppingCart className="inline-block mr-2" /> Choisir
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {offer.price.description && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Description</h3>
            <p className="text-base text-gray-700">{offer.price.description}</p>
          </div>
        )}

        {offer.price.features && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Ce que comprend le programme :</h3>
            <ul className="list-disc pl-5 space-y-2">
              {offer.price.features.map((feature, index) => (
                <li key={index} className="text-gray-700">
                  {feature}
                </li>
              ))}
            </ul>
            <button onClick={() => addToCart({ title: offer.title, price: offer.price.single.amount })} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              <FaShoppingCart className="inline-block mr-2" /> Choisir ce programme
            </button>
          </div>
        )}

        {offer.price.followUp && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Suivi (3 mois)</h3>
            {offer.price.followUp.map((followUp, index) => (
              <motion.div key={index} className="mb-4 p-3 bg-gray-100 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.02 }}>
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {followUp.sessions} séances ({followUp.perWeek}/semaine)
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {followUp.amount}€ <span className="text-base text-gray-600">total</span>
                  </p>
                  <p className="text-base text-gray-700">
                    {followUp.monthly}€ <span className="text-gray-600">/ mois</span>
                  </p>
                  <p className="text-sm text-green-600 font-semibold">{followUp.perSession}€ / séance</p>
                </div>
                <button onClick={() => addToCart({ title: `${offer.title} - Suivi ${followUp.sessions} séances`, price: followUp.amount })} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  <FaShoppingCart className="inline-block mr-2" /> Choisir
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50 min-h-screen">
      <motion.h1 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-800" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Offres de Coaching
      </motion.h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-6">
          {offres.map((offer, index) => (
            <OfferCard key={index} offer={offer} isSelected={selectedOffer === offer} />
          ))}
          <OfferCard offer={programme} isSelected={selectedOffer === programme} />
        </div>
        {!isMobile && (
          <div className="lg:w-1/2">
            <AnimatePresence mode="wait">
              {selectedOffer ? (
                <OfferDetails key={selectedOffer.title} offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
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
              <OfferDetails offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AnimatePresence>{notification && <Notification message={notification} />}</AnimatePresence>
    </div>
  );
};

export default OffreCoaching;
