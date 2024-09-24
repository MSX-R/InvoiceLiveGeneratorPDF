// Components/TableauBerger.js
import React, { useState } from 'react';

const TableauBerger = () => {
  const [repMax, setRepMax] = useState(0);
  const [poids, setPoids] = useState(0);
  const [reps, setReps] = useState(0);

  const calculRM = () => {
    const result = poids / (1.0278 - 0.0278 * reps);
    setRepMax(result.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Calcul de RM (Répetition Maximale)</h1>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Poids soulevé (kg)"
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
            className="w-full p-4 border rounded-md"
          />
          <input
            type="number"
            placeholder="Nombre de répétitions"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full p-4 border rounded-md"
          />
          <button onClick={calculRM} className="w-full bg-green-600 text-white p-4 rounded-md hover:bg-green-700">
            Calculer
          </button>
          {repMax > 0 && <p className="text-xl font-bold text-center mt-4">1RM : {repMax} kg</p>}
        </div>
      </div>
    </div>
  );
};

export default TableauBerger;
