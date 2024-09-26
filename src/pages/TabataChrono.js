import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TabataChrono = () => {
  const [chronoName, setChronoName] = useState("");
  const [preparationTime, setPreparationTime] = useState(10);
  const [effortTime, setEffortTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(1);
  const [chronos, setChronos] = useState([]);

  const navigate = useNavigate();

  const addChrono = () => {
    if (chronoName) {
      setChronos([...chronos, { id: chronos.length + 1, name: chronoName, preparationTime, effortTime, restTime, rounds }]);
      setChronoName("");
      setPreparationTime(10);
      setEffortTime(20);
      setRestTime(10);
      setRounds(1);
    }
  };

  const goToChronoDetail = (chrono) => {
    navigate(`/chrono/${chrono.id}`, { state: chrono });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Créer un Chronomètre Tabata</h1>

        <div className="mb-4">
          <input type="text" value={chronoName} onChange={(e) => setChronoName(e.target.value)} placeholder="Nom du Chrono" className="w-full p-4 border border-gray-300 rounded-md" />
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="preparation-time">
              Préparation
            </label>
            <input id="preparation-time" type="number" value={preparationTime} onChange={(e) => setPreparationTime(Number(e.target.value))} placeholder="0" className="p-4 border border-gray-300 rounded-md w-full" />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="effort-time">
              Effort
            </label>
            <input id="effort-time" type="number" value={effortTime} onChange={(e) => setEffortTime(Number(e.target.value))} placeholder="0" className="p-4 border border-gray-300 rounded-md w-full" />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="rest-time">
              Récupération
            </label>
            <input id="rest-time" type="number" value={restTime} onChange={(e) => setRestTime(Number(e.target.value))} placeholder="0" className="p-4 border border-gray-300 rounded-md w-full" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="rounds">
            Nombre de Rounds
          </label>
          <input id="rounds" type="number" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} placeholder="0" className="w-full p-4 border border-gray-300 rounded-md" />
        </div>

        <button onClick={addChrono} className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700">
          Ajouter Chrono
        </button>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Chronomètres Créés</h2>
          <ul>
            {chronos.map((chrono) => (
              <li
                key={chrono.id}
                className="border-b py-2 cursor-pointer"
                onClick={() => goToChronoDetail(chrono)} // Naviguer vers le détail du chrono
              >
                {chrono.name} - Préparation: {chrono.preparationTime}s, Effort: {chrono.effortTime}s, Récupération: {chrono.restTime}s, Rounds: {chrono.rounds}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabataChrono;
