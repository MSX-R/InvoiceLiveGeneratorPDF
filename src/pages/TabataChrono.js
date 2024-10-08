import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlay, FaPause, FaStop, FaRedo, FaPlus, FaTrash, FaClock, FaDumbbell, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import effortSound from "../assets/preparation.mp3";
import restSound from "../assets/rest.mp3";

const CircularProgressTimer = ({ time, totalTime, size = 200, strokeWidth = 15 }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#4299e1"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - time / totalTime),
          }}
          transition={{
            duration: 1,
            ease: "linear",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-8xl font-bold" style={{ color: "#2b6cb0" }}>
        {time}
      </div>
    </div>
  );
};

const ChronoCard = React.memo(({ chrono, startChrono, deleteChrono, startEditingChrono }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">{chrono.name}</h2>
        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
          <p className="text-sm sm:text-base text-gray-600 flex items-center">
            <FaClock className="mr-2 text-blue-500" />
            <span className="font-semibold">Rounds:</span> {chrono.rounds}
          </p>
          <p className="text-sm sm:text-base text-gray-600 flex items-center">
            <FaDumbbell className="mr-2 text-green-500" />
            <span className="font-semibold">Exercices:</span> {Array.isArray(chrono.exercises) ? chrono.exercises.length : 0}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 sm:mt-4 space-x-2">
        <button onClick={() => startChrono(chrono)} className="flex-1 px-2 sm:px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 flex items-center justify-center text-sm sm:text-base">
          <FaPlay className="mr-1 sm:mr-2" /> Démarrer
        </button>
        <button onClick={() => startEditingChrono(chrono)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300" aria-label="Modifier">
          <FaEdit />
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
});

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

  const [editingChrono, setEditingChrono] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const effortAudio = useMemo(() => new Audio(effortSound), []);
  const restAudio = useMemo(() => new Audio(restSound), []);

  useEffect(() => {
    localStorage.setItem("chronos", JSON.stringify(chronos));
  }, [chronos]);

  const playSound = useCallback((audio) => {
    audio.currentTime = 0;
    audio.play().catch((error) => console.error("Error playing sound:", error));
  }, []);

  const getNextExercise = useCallback(() => {
    if (!currentChrono) return null;
    const exercises = currentChrono.exercises;
    if (currentExercise === "prep") {
      playSound(effortAudio);
      return { index: 0, time: exercises[0].effort, name: exercises[0].name };
    } else {
      const currentIndex = Math.floor(currentExercise / 2);
      const isEffortPhase = currentExercise % 2 === 0;

      if (isEffortPhase) {
        playSound(restAudio);
        return { index: currentExercise + 1, time: exercises[currentIndex].rest, name: "Repos" };
      } else if (currentIndex < exercises.length - 1) {
        playSound(effortAudio);
        return { index: currentExercise + 1, time: exercises[currentIndex + 1].effort, name: exercises[currentIndex + 1].name };
      } else if (currentRound < currentChrono.rounds) {
        setCurrentRound((prev) => prev + 1);
        playSound(effortAudio);
        return { index: 0, time: exercises[0].effort, name: exercises[0].name };
      }
    }
    playSound(restAudio);
    return null;
  }, [currentChrono, currentExercise, currentRound, effortAudio, restAudio, playSound]);

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
  }, [isRunning, currentChrono, getNextExercise]);

  const startChrono = useCallback((chrono) => {
    setCurrentChrono(chrono);
    setCurrentExercise("prep");
    setCurrentRound(1);
    setTime(chrono.prepTime);
    setIsRunning(true);
    setShowModal(true);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentChrono(null);
    setShowModal(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (currentChrono) {
      setTime(currentChrono.prepTime);
      setCurrentExercise("prep");
      setCurrentRound(1);
      setIsRunning(false);
    }
  }, [currentChrono]);

  const addExercise = useCallback(() => {
    setNewChrono((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", effort: 20, rest: 10 }],
    }));
  }, []);

  const updateExercise = useCallback((index, field, value) => {
    setNewChrono((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => {
        if (i === index) {
          const updatedExercise = { ...exercise, [field]: field === "name" ? value : parseInt(value) };
          if (field === "effort" && !exercise.name) {
            updatedExercise.name = `Exercise ${value}s`;
          }
          return updatedExercise;
        }
        return exercise;
      }),
    }));
  }, []);

  const removeExercise = useCallback((index) => {
    setNewChrono((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  }, []);

  const saveChrono = useCallback(() => {
    if (newChrono.name && newChrono.exercises.length > 0) {
      setChronos((prev) => [...prev, { ...newChrono, id: Date.now() }]);
      setNewChrono({
        name: "",
        prepTime: 10,
        exercises: [{ name: "", effort: 20, rest: 10 }],
        rounds: 1,
      });
      setShowSettings(false);
    }
  }, [newChrono]);

  const deleteChrono = useCallback((id) => {
    setChronos((prev) => prev.filter((chrono) => chrono.id !== id));
  }, []);

  const startEditingChrono = useCallback((chrono) => {
    setEditingChrono({ ...chrono });
    setShowEditModal(true);
    setHasChanges(false);
  }, []);

  const updateEditingChrono = useCallback((field, value) => {
    setEditingChrono((prev) => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      return updated;
    });
  }, []);

  const updateEditingExercise = useCallback((index, field, value) => {
    setEditingChrono((prev) => {
      const updatedExercises = prev.exercises.map((exercise, i) => {
        if (i === index) {
          return { ...exercise, [field]: field === "name" ? value : parseInt(value) };
        }
        return exercise;
      });
      setHasChanges(true);
      return { ...prev, exercises: updatedExercises };
    });
  }, []);

  const saveEditedChrono = useCallback(() => {
    setChronos((prev) => prev.map((chrono) => (chrono.id === editingChrono.id ? editingChrono : chrono)));
    setShowEditModal(false);
    setEditingChrono(null);
    setHasChanges(false);
  }, [editingChrono]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Advanced Tabata Timer</h1>

      <button onClick={() => setShowSettings(true)} className="mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base">
        <FaPlus className="inline-block mr-2" /> Créer un Nouveau Chrono
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl">{chronos.length > 0 ? chronos.map((chrono) => <ChronoCard key={chrono.id} chrono={chrono} startChrono={startChrono} deleteChrono={deleteChrono} startEditingChrono={startEditingChrono} />) : <p className="text-gray-600 col-span-full text-center">Aucun chrono trouvé.</p>}</div>

      {showModal && currentChrono && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 15 }} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
            <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-4">
              {currentChrono.name}
            </motion.h2>
            <motion.p key={currentExercise} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} transition={{ type: "spring", stiffness: 100 }} className="text-xl sm:text-2xl mb-12 sm:mb-12">
              {currentExercise === "prep" ? "Préparation" : currentExercise % 2 === 0 ? currentChrono.exercises[Math.floor(currentExercise / 2)].name : "Repos"}
            </motion.p>
            <div className="flex justify-center mb-12 ">
              <CircularProgressTimer time={time} totalTime={currentExercise === "prep" ? currentChrono.prepTime : currentExercise % 2 === 0 ? currentChrono.exercises[Math.floor(currentExercise / 2)].effort : currentChrono.exercises[Math.floor(currentExercise / 2)].rest} size={250} strokeWidth={20} />
            </div>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className=" flex flex-col text-base sm:text-lg mt-6 mb-12">
              Round{" "}
              <span className="font-bold text-4xl">
                {currentRound} / {currentChrono.rounds}
              </span>
            </motion.p>

            <div className="flex justify-around">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={toggleTimer} className={`p-3 sm:p-4 rounded-full ${isRunning ? "bg-yellow-500" : "bg-green-500"} text-white`}>
                {isRunning ? <FaPause /> : <FaPlay />}
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={resetTimer} className="p-3 sm:p-4 rounded-full bg-blue-500 text-white">
                <FaRedo />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={stopTimer} className="p-3 sm:p-4 rounded-full bg-red-500 text-white">
                <FaStop />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Créer un Nouveau Chrono</h2>

            <div className="mb-8 bg-gray-100 p-4 rounded-lg">
              <input type="text" placeholder="Nom du Chrono" value={newChrono.name} onChange={(e) => setNewChrono({ ...newChrono, name: e.target.value })} className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg" />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/2">
                  <label className="block mb-2 text-gray-700 text-base">Temps de Préparation (sec)</label>
                  <input type="number" value={newChrono.prepTime} onChange={(e) => setNewChrono({ ...newChrono, prepTime: parseInt(e.target.value) })} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block mb-2 text-gray-700 text-base">Nombre de Rounds</label>
                  <input type="number" value={newChrono.rounds} onChange={(e) => setNewChrono({ ...newChrono, rounds: parseInt(e.target.value) })} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Exercices</h3>
              {newChrono.exercises.map((exercise, index) => (
                <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 text-base">Nom de l'exercice</label>
                    <input type="text" value={exercise.name} onChange={(e) => updateExercise(index, "name", e.target.value)} placeholder={`Exercise ${exercise.effort}s`} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-1-2">
                      <label className="block mb-2 text-gray-700 text-base">Temps d'effort (sec)</label>
                      <input type="number" value={exercise.effort} onChange={(e) => updateExercise(index, "effort", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block mb-2 text-gray-700 text-base">Temps de repos (sec)</label>
                      <input type="number" value={exercise.rest} onChange={(e) => updateExercise(index, "rest", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => removeExercise(index)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button onClick={addExercise} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 text-base">
                <FaPlus className="inline-block mr-2" /> Ajouter un Exercice
              </button>
              <div className="flex space-x-4">
                <button onClick={saveChrono} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 text-base">
                  Enregistrer
                </button>
                <button onClick={() => setShowSettings(false)} className="px-6 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 transition-colors duration-300 text-base">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingChrono && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Modifier le Chrono</h2>

            <div className="mb-8 bg-gray-100 p-4 rounded-lg">
              <input type="text" placeholder="Nom du Chrono" value={editingChrono.name} onChange={(e) => updateEditingChrono("name", e.target.value)} className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg" />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/2">
                  <label className="block mb-2 text-gray-700 text-base">Temps de Préparation (sec)</label>
                  <input type="number" value={editingChrono.prepTime} onChange={(e) => updateEditingChrono("prepTime", parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block mb-2 text-gray-700 text-base">Nombre de Rounds</label>
                  <input type="number" value={editingChrono.rounds} onChange={(e) => updateEditingChrono("rounds", parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Exercices</h3>
              {editingChrono.exercises.map((exercise, index) => (
                <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 text-base">Nom de l'exercice</label>
                    <input type="text" value={exercise.name} onChange={(e) => updateEditingExercise(index, "name", e.target.value)} placeholder={`Exercise ${exercise.effort}s`} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-1/2">
                      <label className="block mb-2 text-gray-700 text-base">Temps d'effort (sec)</label>
                      <input type="number" value={exercise.effort} onChange={(e) => updateEditingExercise(index, "effort", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block mb-2 text-gray-700 text-base">Temps de repos (sec)</label>
                      <input type="number" value={exercise.rest} onChange={(e) => updateEditingExercise(index, "rest", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button onClick={saveEditedChrono} className={`px-6 py-3 font-bold rounded-lg shadow-lg transition-colors duration-300 text-base ${hasChanges ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`} disabled={!hasChanges}>
                Enregistrer
              </button>
              <button onClick={() => setShowEditModal(false)} className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300 text-base">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdvancedTabataTimer);
