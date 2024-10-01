import React from "react";
import { FaRegClock, FaTags, FaCalendarAlt } from "react-icons/fa";

const SoloTarifs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-2xl transition-transform duration-300 ">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Tarifs Séance SOLO</h1>

        {/* FORMAT MOBILE */}
        {/* Séance Unique */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">Séance Unique</h2>
        <ul className="space-y-6">
          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-start space-x-3">
              <FaRegClock className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">Une Séance</span>
            </div>
            <p className="text-current text-sm mt-1">Idéal pour découvrir l'expérience ou pour une séance à l'improviste.</p>
            <p className="text-current text-xs mt-1 ">Une approche sans engagement pour mieux évaluer vos besoins.</p>
            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">70 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
          </li>
        </ul>
        <hr className="border-neutral-900 my-8 " />

        {/* Pack de 10 Séances */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">Pack de 10 Séances </h2>
        <ul className="space-y-6">
          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-center space-x-3">
              <FaTags className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">Pack de 10 Séances</span>
            </div>
            <p className="text-current text-sm mt-1">Profitez d'un tarif réduit avec un engagement minimal.</p>
            <p className="text-current text-xs mt-1 ">Un bon début pour entamer votre coaching.</p>

            <p className="w-full text-start mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">60 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit un total à régler de 600 €)</span>
          </li>
        </ul>
        <hr className="border-neutral-900 my-8 " />

        {/* Suivi 12 Semaines */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">Suivi 12 Semaines</h2>
        <ul className="space-y-6">
          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">2 séances par semaine (24 séances)</span>
            </div>
            <p className="text-current text-sm mt-1">Progrès avec un plan personnalisé, adapté à vos objectifs.</p>
            <p className="text-current text-xs mt-1 ">Suivi sérieux de 3 mois pour maximiser vos résultats.</p>

            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">47,50 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit une mensualité de 380 €)</span>
          </li>

          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">3 séances par semaine (36 séances)</span>
            </div>
            <p className="text-current text-sm mt-1">Un programme intensif pour un engagement fort.</p>
            <p className="text-current text-xs mt-1 ">Accompagnement constant pour atteindre vos objectifs.</p>
            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">45 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit une mensualité de 540 €)</span>
          </li>

          <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">4 séances par semaine (48 séances)</span>
            </div>
            <p className="text-current text-sm mt-1">Pour ceux qui souhaitent une transformation rapide.</p>
            <p className="text-current text-xs mt-1 ">Suivi renforcé pour une évolution continue.</p>

            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">42,50 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit une mensualité de 680 €)</span>
          </li>

          {/* <li className="flex flex-col justify-between items-start p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-[rgb(31,41,55)] hover:text-white transition-all duration-200 border border-gray-300">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-2xl text-current" />
              <span className="text-lg font-semibold text-current">5 séances par semaine (60 séances)</span>
            </div>
            <p className="text-current text-sm mt-1">Le meilleur rapport qualité/prix pour un engagement total.</p>
            <p className="text-current text-xs mt-1">Accompagnement complet pour des résultats durables.</p>

            <p className="w-full text-center mt-4">
              <span className="font-bold text-current text-3xl text-right w-full ">42,50 €/</span>
              <span className="font-bold text-current text-lg text-right w-full ">séance</span>
            </p>
            <span className="font-light text-current text-xs text-center w-full mr-2">( soit une mensualité de 850 €)</span>
          </li> */}
        </ul>

        <button className="mt-8 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300">Réserver Maintenant</button>
      </div>
    </div>
  );
};

export default SoloTarifs;
