import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaRedo, FaPlus, FaTrash, FaClock, FaDumbbell } from "react-icons/fa";

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
        <button onClick={() => startChrono(chrono)} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 flex items-center justify-center">
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

const AdvancedTabataTimer = () => {
  const [chronos, setChronos] = useState(() => {
    const savedChronos = localStorage.getItem("chronos");
    return savedChronos ? JSON.parse(savedChronos) : [];
  });
  const [currentChrono, setCurrentChrono] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [newChrono, setNewChrono] = useState({
    name: "",
    prepTime: 10,
    exercises: [{ name: "", effort: 20, rest: 10 }],
    rounds: 1,
  });

  useEffect(() => {
    localStorage.setItem("chronos", JSON.stringify(chronos));
  }, [chronos]);

  useEffect(() => {
    let interval;
    if (isRunning && currentChrono) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            const nextExercise = getNextExercise();
            if (nextExercise) {
              setCurrentExercise(nextExercise.index);
              return nextExercise.time;
            } else {
              setIsRunning(false);
              return 0;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentChrono, currentExercise, currentRound]);

  const getNextExercise = () => {
    const exercises = currentChrono.exercises;
    if (currentExercise === "prep") {
      return { index: 0, time: exercises[0].effort, name: exercises[0].name };
    } else {
      const currentIndex = Math.floor(currentExercise / 2);
      const isEffortPhase = currentExercise % 2 === 0;

      if (isEffortPhase) {
        return { index: currentExercise + 1, time: exercises[currentIndex].rest, name: "Repos" };
      } else if (currentIndex < exercises.length - 1) {
        return { index: currentExercise + 1, time: exercises[currentIndex + 1].effort, name: exercises[currentIndex + 1].name };
      } else if (currentRound < currentChrono.rounds) {
        setCurrentRound(currentRound + 1);
        return { index: 0, time: exercises[0].effort, name: exercises[0].name };
      }
    }
    return null;
  };

  const startChrono = (chrono) => {
    setCurrentChrono(chrono);
    setCurrentExercise("prep");
    setCurrentRound(1);
    setTime(chrono.prepTime);
    setIsRunning(true);
    setShowModal(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setCurrentChrono(null);
    setShowModal(false);
  };

  const resetTimer = () => {
    if (currentChrono) {
      setTime(currentChrono.prepTime);
      setCurrentExercise("prep");
      setCurrentRound(1);
      setIsRunning(false);
    }
  };

  const addExercise = () => {
    setNewChrono({
      ...newChrono,
      exercises: [...newChrono.exercises, { name: "", effort: 20, rest: 10 }],
    });
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = newChrono.exercises.map((exercise, i) => (i === index ? { ...exercise, [field]: field === "name" ? value : parseInt(value) } : exercise));
    setNewChrono({ ...newChrono, exercises: updatedExercises });
  };

  const removeExercise = (index) => {
    setNewChrono({
      ...newChrono,
      exercises: newChrono.exercises.filter((_, i) => i !== index),
    });
  };

  const saveChrono = () => {
    if (newChrono.name && newChrono.exercises.length > 0) {
      setChronos([...chronos, { ...newChrono, id: Date.now() }]);
      setNewChrono({
        name: "",
        prepTime: 10,
        exercises: [{ name: "", effort: 20, rest: 10 }],
        rounds: 1,
      });
      setShowSettings(false);
    }
  };

  const deleteChrono = (id) => {
    setChronos(chronos.filter((chrono) => chrono.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Advanced Tabata Timer</h1>

      <button onClick={() => setShowSettings(true)} className="mb-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
        <FaPlus className="inline-block mr-2" /> Créer un Nouveau Chrono
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">{chronos.length > 0 ? chronos.map((chrono) => <ChronoCard key={chrono.id} chrono={chrono} startChrono={startChrono} deleteChrono={deleteChrono} />) : <p className="text-gray-600">Aucun chrono trouvé.</p>}</div>

      {showModal && currentChrono && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-5xl font-bold mb-4">{currentChrono.name}</h2>
            <p className="text-2xl mb-12">{currentExercise === "prep" ? "Préparation" : currentExercise % 2 === 0 ? currentChrono.exercises[Math.floor(currentExercise / 2)].name : "Repos"}</p>
            <div className="text-9xl font-bold mb-12">{time}</div>
            <p className="text-lg mb-8">
              Round {currentRound} / {currentChrono.rounds}
            </p>

            <div className="flex justify-around">
              <button onClick={toggleTimer} className={`p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-green-500"} text-white`}>
                {isRunning ? <FaPause /> : <FaPlay />}
              </button>

              <button onClick={resetTimer} className="p-4 rounded-full bg-blue-500 text-white">
                <FaRedo />
              </button>

              <button onClick={stopTimer} className="p-4 rounded-full bg-red-500 text-white">
                <FaStop />
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Créer un Nouveau Chrono</h2>
            <input type="text" placeholder="Nom du Chrono" value={newChrono.name} onChange={(e) => setNewChrono({ ...newChrono, name: e.target.value })} className="w-full p-3 mb-4 border border-gray-300 rounded-lg" />

            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
                <label className="block mb-2 text-gray-700">Temps de Préparation</label>
                <input type="number" value={newChrono.prepTime} onChange={(e) => setNewChrono({ ...newChrono, prepTime: parseInt(e.target.value) })} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div className="w-1/3">
                <label className="block mb-2 text-gray-700">Rounds</label>
                <input type="number" value={newChrono.rounds} onChange={(e) => setNewChrono({ ...newChrono, rounds: parseInt(e.target.value) })} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
            </div>

            {newChrono.exercises.map((exercise, index) => (
              <div key={index} className="mb-4 flex space-x-4">
                <div className="w-1/3">
                  <label className="block mb-2 text-gray-700">Nom de l'exercice</label>
                  <input type="text" value={exercise.name} onChange={(e) => updateExercise(index, "name", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="w-1/4">
                  <label className="block mb-2 text-gray-700">Effort (sec)</label>
                  <input type="number" value={exercise.effort} onChange={(e) => updateExercise(index, "effort", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="w-1/4">
                  <label className="block mb-2 text-gray-700">Repos (sec)</label>
                  <input type="number" value={exercise.rest} onChange={(e) => updateExercise(index, "rest", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="w-1/6 flex items-end">
                  <button onClick={() => removeExercise(index)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <button onClick={addExercise} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 mb-4">
              Ajouter un Exercice
            </button>

            <div className="flex justify-end">
              <button onClick={saveChrono} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300">
                Enregistrer
              </button>
              <button onClick={() => setShowSettings(false)} className="ml-4 px-6 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 transition-colors duration-300">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTabataTimer;
