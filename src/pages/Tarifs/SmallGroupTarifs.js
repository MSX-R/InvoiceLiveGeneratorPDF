import React from "react";
import { FaRegClock, FaTags, FaUsers } from "react-icons/fa";

const SmallGroupTarifs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-2xl transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Tarifs Séance Small Group</h1>
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-400">3-5 personnes</h1>

        {/* Séance Unique */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">Séance Unique</h2>
        <ul className="space-y-6">
          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-start space-x-3">
              <FaRegClock className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">Une Séance</span>
            </div>
            <p className="text-current text-sm mt-1">Participez à une séance unique en petit groupe de 3 à 5 personnes.</p>
            <p className="text-current text-xs mt-1">Découvrez les bénéfices du coaching de groupe sans engagement.</p>
            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">120 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit 120 € /nombre de souscrivants)</span>
          </li>
        </ul>

        <hr className="border-neutral-900 my-8 " />

        {/* Pack de 10 Séances */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">Pack de 10 Séances</h2>
        <ul className="space-y-6">
          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-start space-x-3">
              <FaTags className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">Pack de 10 Séances</span>
            </div>
            <p className="text-current text-sm mt-1">Profitez d'un tarif réduit en vous engageant sur 10 séances.</p>
            <p className="text-current text-xs mt-1">Idéal pour renforcer la cohésion de votre groupe.</p>
            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">1000 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">pack</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit 1000 € /nombre de souscrivants)</span>
          </li>
        </ul>

        <button className="mt-8 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300">Réserver Maintenant</button>
      </div>
    </div>
  );
};

export default SmallGroupTarifs;
