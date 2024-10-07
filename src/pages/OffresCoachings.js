import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDumbbell, FaUsers, FaClock } from "react-icons/fa";

const OffreCoaching = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const offres = [
    {
      title: "ESSENTIEL",
      duration: "40 MIN",
      type: "SOLO",
      icon: <FaDumbbell />,
      color: "from-blue-400 to-blue-600",
      price: {
        single: { amount: 50, text: "1 SEANCE" },
        pack: [
          { sessions: 7, amount: 275, discount: "OFFRE SPECIALE" },
          { sessions: 15, amount: 500, discount: "OFFRE SPECIALE" },
        ],
        followUp: [
          { sessions: 24, duration: "3 mois", perWeek: 2, amount: 799.9, monthly: 267.0 },
          { sessions: 36, duration: "3 mois", perWeek: 3, amount: 1140.0, monthly: 380.0 },
          { sessions: 48, duration: "3 mois", perWeek: 4, amount: 1440.0, monthly: 480.0 },
          { sessions: 60, duration: "3 mois", perWeek: 5, amount: 1800.0, monthly: 600.0 },
        ],
      },
    },
    {
      title: "FULL",
      duration: "60 MIN",
      type: "SOLO",
      icon: <FaClock />,
      color: "from-green-400 to-green-600",
      price: {
        single: { amount: 70, text: "1 SEANCE" },
        pack: [
          { sessions: 5, amount: 275, discount: 50 },
          { sessions: 10, amount: 500, discount: 100 },
        ],
        followUp: [
          { sessions: 24, duration: "3 mois", perWeek: 2, amount: 1140.0, monthly: 383.0, perSession: 47.5 },
          { sessions: 36, duration: "3 mois", perWeek: 3, amount: 1620.0, monthly: 540.0, perSession: 45.0 },
          { sessions: 48, duration: "3 mois", perWeek: 4, amount: 2040.0, monthly: 680.0, perSession: 42.5 },
          { sessions: 60, duration: "3 mois", perWeek: 5, amount: 2550.0, monthly: 850.0, perSession: 42.5 },
        ],
      },
    },
    {
      title: "DUO",
      duration: "60 MIN",
      type: "DUO",
      icon: <FaUsers />,
      color: "from-purple-400 to-purple-600",
      price: {
        single: { amount: 100, text: "1 SEANCE" },
        pack: [
          { sessions: 5, amount: 425, discount: 50 },
          { sessions: 10, amount: 850, discount: 50 },
        ],
        followUp: [
          { sessions: 24, duration: "3 mois", perWeek: 2, amount: 1824.0, monthly: 608.0, perSession: 38.0 },
          { sessions: 36, duration: "3 mois", perWeek: 3, amount: 2592.0, monthly: 864.0, perSession: 36.0 },
          { sessions: 48, duration: "3 mois", perWeek: 4, amount: 3264.0, monthly: 1088.0, perSession: 34.0 },
          { sessions: 60, duration: "3 mois", perWeek: 5, amount: 4080.0, monthly: 850.0, perSession: 34.0 },
        ],
      },
    },
  ];

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
        {offer.price.single.amount}€<span className="text-base"> / séance</span>
      </p>
    </motion.div>
  );

  const OfferDetails = ({ offer }) => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className={`bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden h-full`}>
      <motion.div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${offer.color} opacity-10 -mr-32 -mt-32`} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{offer.title}</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Séance unique</h3>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            {offer.price.single.amount}€ <span className="text-base text-gray-600">/ {offer.price.single.text}</span>
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Packs</h3>
          {offer.price.pack.map((pack, index) => (
            <motion.div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg" whileHover={{ scale: 1.02 }}>
              <p className="text-lg font-semibold text-gray-800">
                {pack.sessions} séances : {pack.amount}€
              </p>
              {pack.discount && <p className="text-green-500 font-semibold text-sm">Économisez {pack.discount}€</p>}
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Suivi (3 mois)</h3>
          {offer.price.followUp.map((followUp, index) => (
            <motion.div key={index} className="mb-4 p-3 bg-gray-100 rounded-lg" whileHover={{ scale: 1.02 }}>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                {followUp.sessions} séances ({followUp.perWeek}/semaine)
              </p>
              <p className="text-xl font-bold text-gray-900">
                {followUp.amount}€ <span className="text-base text-gray-600">total</span>
              </p>
              <p className="text-base text-gray-700">
                {followUp.monthly}€ <span className="text-gray-600">/ mois</span>
              </p>
              {followUp.perSession && <p className="text-sm text-green-600 font-semibold">{followUp.perSession}€ / séance</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50 min-h-screen">
      <motion.h1 className="text-5xl font-bold text-center mb-16 text-gray-800" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Offres de Coaching
      </motion.h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-6">
          {offres.map((offer, index) => (
            <OfferCard key={index} offer={offer} isSelected={selectedOffer === offer} />
          ))}
        </div>
        <div className="lg:w-1/2">
          <AnimatePresence mode="wait">
            {selectedOffer ? (
              <OfferDetails key={selectedOffer.title} offer={selectedOffer} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-2xl p-8 h-full flex items-center justify-center">
                <p className="text-2xl text-gray-400 text-center">Sélectionnez une offre pour voir les détails</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OffreCoaching;
