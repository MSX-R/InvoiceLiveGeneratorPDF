import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

// Importer les sons pour les alertes
import preparationSound from "../assets/preparation.mp3";
import effortSound from "../assets/effort.mp3";
import restSound from "../assets/rest.mp3";

const ChronoDetail = () => {
  const location = useLocation();
  const { name, preparationTime, effortTime, restTime, rounds } = location.state || {};

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStage, setCurrentStage] = useState("preparation");
  const [timeLeft, setTimeLeft] = useState(preparationTime);
  const [currentRound, setCurrentRound] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Références audio
  const preparationAudio = useRef(new Audio(preparationSound));
  const effortAudio = useRef(new Audio(effortSound));
  const restAudio = useRef(new Audio(restSound));

  // Calculer le temps total du chronomètre
  const totalTime = (preparationTime + effortTime + restTime) * rounds;

  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setElapsedTime((prev) => prev + 1); // Increment elapsed time only if running
      }, 1000);
    } else if (timeLeft === 0) {
      handleStageChange();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStageChange = () => {
    switch (currentStage) {
      case "preparation":
        playSound(preparationAudio);
        setCurrentStage("effort");
        setTimeLeft(effortTime);
        break;
      case "effort":
        playSound(effortAudio);
        if (currentRound < rounds - 1) {
          setCurrentStage("rest");
          setTimeLeft(restTime);
        } else {
          setElapsedTime(totalTime); // Ensure total elapsed time is updated
          setIsRunning(false);
          setCurrentStage("finished");
        }
        break;
      case "rest":
        playSound(restAudio);
        setCurrentStage("effort");
        setTimeLeft(effortTime);
        setCurrentRound((prev) => prev + 1);
        break;
      default:
        break;
    }
  };

  const playSound = (audioRef) => {
    audioRef.current.play().catch((err) => console.error("Erreur de lecture du son:", err));
  };

  const startChrono = () => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStage("preparation");
    setTimeLeft(preparationTime);
    setCurrentRound(0);
    setElapsedTime(0);
  };

  const pauseChrono = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeChrono = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const resetChrono = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStage("preparation");
    setTimeLeft(preparationTime);
    setCurrentRound(0);
    setElapsedTime(0);
  };

  // Styles des cartes
  const cardStyles = {
    preparation: currentStage === "preparation" ? "bg-yellow-400" : "bg-gray-300",
    effort: currentStage === "effort" ? "bg-green-400" : "bg-gray-300",
    rest: currentStage === "rest" ? "bg-red-400" : "bg-gray-300",
    finished: currentStage === "finished" ? "bg-gray-500" : "bg-gray-300",
  };

  // Calculer le pourcentage de progression
  const progressPercentage = ((elapsedTime / totalTime) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <h2 className="text-xl mb-4">
          Round {currentRound + 1} sur {rounds}
        </h2>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="bg-gray-300 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-sm mt-1">{progressPercentage}% complet</p>
        </div>

        {/* Cartes des phases */}
        <div className="grid grid-cols-1 gap-4">
          <div className={`p-4 rounded-lg ${cardStyles.preparation}`}>
            <h2 className="text-xl mb-2">Préparation</h2>
            <h3 className="text-2xl">Temps restant: {currentStage === "preparation" ? timeLeft : preparationTime}s</h3>
          </div>

          <div className={`p-4 rounded-lg ${cardStyles.effort}`}>
            <h2 className="text-xl mb-2">Effort</h2>
            <h3 className="text-2xl">Temps restant: {currentStage === "effort" ? timeLeft : effortTime}s</h3>
          </div>

          <div className={`p-4 rounded-lg ${cardStyles.rest}`}>
            <h2 className="text-xl mb-2">Récupération</h2>
            <h3 className="text-2xl">Temps restant: {currentStage === "rest" ? timeLeft : restTime}s</h3>
          </div>
        </div>

        {/* Afficher un message si terminé */}
        {currentStage === "finished" && <h3 className="text-xl mt-4">Tout est terminé ! Bravo !</h3>}

        {/* Contrôles du chronomètre */}
        {!isRunning ? (
          <button onClick={startChrono} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mt-4">
            Démarrer
          </button>
        ) : isPaused ? (
          <>
            <button onClick={resumeChrono} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-4">
              Reprendre
            </button>
            <button onClick={resetChrono} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4 ml-2">
              Réinitialiser
            </button>
          </>
        ) : (
          <>
            <button onClick={pauseChrono} className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 mt-4">
              Pause
            </button>
            <button onClick={resetChrono} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4 ml-2">
              Réinitialiser
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChronoDetail;
