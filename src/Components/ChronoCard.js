import React from 'react';
import { FaPlay, FaTrash, FaClock, FaDumbbell } from 'react-icons/fa';

const ChronoCard = ({ chrono, startChrono, deleteChrono }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{chrono.name}</h2>
        <div className="space-y-2 mb-4">
          <p className="text-gray-600 flex items-center">
            <FaClock className="mr-2 text-blue-500" />
            <span className="font-semibold">Rounds:</span> {chrono.rounds}
          </p>
          <p className="text-gray-600 flex items-center">
            <FaDumbbell className="mr-2 text-green-500" />
            <span className="font-semibold">Exercices:</span> {Array.isArray(chrono.exercises) ? chrono.exercises.length : 0}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 space-x-2">
        <button 
          onClick={() => startChrono(chrono)} 
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
        >
          <FaPlay className="mr-2" /> Démarrer
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteChrono(chrono.id);
          }}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
          aria-label="Supprimer"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ChronoCard;
