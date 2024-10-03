// NotFound.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Intro animation with delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6 overflow-hidden">
      <div className={`max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl transform transition-all duration-700 ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
        <h1 className="text-6xl font-extrabold text-center mb-4 text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Oops! Page non trouvée</h2>
        <p className="text-center text-gray-600 mb-8">Il semble que la page que vous recherchez n'existe pas ou a été déplacée. Nous vous invitons à retourner sur notre page d'accueil ou à explorer nos autres offres.</p>
        <div className="flex justify-center">
          <Link to="/">
            <button className="bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition duration-300 shadow-md">Retour à l'accueil</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
