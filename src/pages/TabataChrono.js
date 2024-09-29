import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"; // Importer l'icône de suppression

const TabataChrono = () => {
  const [chronoName, setChronoName] = useState("");
  const [preparationTime, setPreparationTime] = useState(10);
  const [effortTime, setEffortTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(1);
  const [chronos, setChronos] = useState(() => {
    const savedChronos = localStorage.getItem("chronos");
    return savedChronos ? JSON.parse(savedChronos) : [];
  });

  const navigate = useNavigate();

  // Sauvegarde les chronomètres dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("chronos", JSON.stringify(chronos));
  }, [chronos]);

  const isFormValid = () => {
    return chronoName && preparationTime > 0 && effortTime > 0 && restTime > 0 && rounds > 0;
  };

  const addChrono = () => {
    if (isFormValid()) {
      setChronos([...chronos, { id: chronos.length + 1, name: chronoName, preparationTime, effortTime, restTime, rounds }]);
      setChronoName("");
      setPreparationTime(10);
      setEffortTime(20);
      setRestTime(10);
      setRounds(1);
    } else {
      alert("Veuillez remplir tous les champs correctement.");
    }
  };

  const goToChronoDetail = (chrono) => {
    navigate(`/chrono/${chrono.id}`, { state: chrono });
  };

  const deleteChrono = (id) => {
    setChronos(chronos.filter((chrono) => chrono.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Créer un Chronomètre Tabata</h1>

        {/* Formulaire de création de chronomètre */}
        <div className="mb-4">
          <input type="text" value={chronoName} onChange={(e) => setChronoName(e.target.value)} placeholder="Nom du Chrono" className={`w-full p-4 border ${chronoName ? "border-gray-300" : "border-red-500"} rounded-md`} />
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="preparation-time">
              Préparation
            </label>
            <input id="preparation-time" type="number" value={preparationTime} onChange={(e) => setPreparationTime(Number(e.target.value))} className={`p-4 border ${preparationTime > 0 ? "border-gray-300" : "border-red-500"} rounded-md w-full`} />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="effort-time">
              Effort
            </label>
            <input id="effort-time" type="number" value={effortTime} onChange={(e) => setEffortTime(Number(e.target.value))} className={`p-4 border ${effortTime > 0 ? "border-gray-300" : "border-red-500"} rounded-md w-full`} />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="rest-time">
              Récupération
            </label>
            <input id="rest-time" type="number" value={restTime} onChange={(e) => setRestTime(Number(e.target.value))} className={`p-4 border ${restTime > 0 ? "border-gray-300" : "border-red-500"} rounded-md w-full`} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="rounds">
            Nombre de Rounds
          </label>
          <input id="rounds" type="number" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className={`w-full p-4 border ${rounds > 0 ? "border-gray-300" : "border-red-500"} rounded-md`} />
        </div>

        <button onClick={addChrono} className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 w-full">
          Ajouter Chrono
        </button>
        
        <button onClick={() => navigate(-1)} className="bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 mt-4 w-full">
          Retour
        </button>

        {/* Liste des chronomètres créés */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Chronomètres Créés</h2>
          <div className="grid grid-cols-1 gap-4">
            {chronos.length > 0 ? (
              chronos.map((chrono) => (
                <div key={chrono.id} className="bg-gray-200 p-4 rounded-lg flex items-center justify-between hover:bg-gray-300 transition-colors duration-200">
                  <div className="cursor-pointer flex-grow" onClick={() => goToChronoDetail(chrono)}>
                    <h3 className="text-lg font-semibold">{chrono.name}</h3>
                    <p className="text-sm text-gray-700">
                      Préparation: {chrono.preparationTime}s, Effort: {chrono.effortTime}s, Récupération: {chrono.restTime}s, Rounds: {chrono.rounds}
                    </p>
                  </div>
                  <button onClick={() => deleteChrono(chrono.id)} className="text-red-600 hover:text-red-800 ml-4">
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucun chronomètre créé.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabataChrono;
