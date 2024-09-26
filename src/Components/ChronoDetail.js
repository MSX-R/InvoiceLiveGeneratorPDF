import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; // Importer useNavigate

// Importer les sons pour les alertes
import preparationSound from "../assets/preparation.mp3";
import effortSound from "../assets/effort.mp3";
import restSound from "../assets/rest.mp3";

const ChronoDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate(); // Utilisation de useNavigate
  const [chrono, setChrono] = useState(location.state || null);

  // State for the timer
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStage, setCurrentStage] = useState("preparation");
  const [timeLeft, setTimeLeft] = useState(chrono ? chrono.preparationTime : 0);
  const [currentRound, setCurrentRound] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  // Références audio
  const preparationAudio = useRef(new Audio(preparationSound));
  const effortAudio = useRef(new Audio(effortSound));
  const restAudio = useRef(new Audio(restSound));
  const timerRef = useRef(null);

  // Calculer le temps total du chronomètre
  const totalTime = chrono ? (chrono.preparationTime + chrono.effortTime + chrono.restTime) * chrono.rounds : 0;

  // Récupérer le chrono depuis localStorage si non disponible via state
  useEffect(() => {
    if (!chrono && id) {
      const savedChronos = JSON.parse(localStorage.getItem("chronos")) || [];
      const foundChrono = savedChronos.find((c) => c.id === Number(id));
      if (foundChrono) {
        setChrono(foundChrono);
        setTimeLeft(foundChrono.preparationTime);
      }
    }
  }, [chrono, id]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleStageChange();
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleStageChange = () => {
    switch (currentStage) {
      case "preparation":
        playSound(preparationAudio);
        setCurrentStage("effort");
        setTimeLeft(chrono.effortTime);
        break;
      case "effort":
        playSound(effortAudio);
        setElapsedTime((prev) => prev + chrono.effortTime);
        if (currentRound < chrono.rounds) {
          setCurrentStage("rest");
          setTimeLeft(chrono.restTime);
        } else {
          finishChrono();
        }
        break;
      case "rest":
        playSound(restAudio);
        if (currentRound < chrono.rounds) {
          setCurrentStage("effort");
          setTimeLeft(chrono.effortTime);
          setCurrentRound((prev) => {
            const newRound = prev + 1;
            setProgressMessage(`Vous avez complété ${(newRound / chrono.rounds) * 100}% du programme !`);
            return newRound;
          });
        } else {
          finishChrono();
        }
        break;
      default:
        break;
    }
  };

  const finishChrono = () => {
    setElapsedTime(totalTime); // Mettez à jour si tous les rounds sont terminés
    setIsRunning(false);
    setCurrentStage("finished");
    setProgressMessage("Bravo ! Vous avez terminé tous les rounds !");
  };

  const playSound = (audioRef) => {
    audioRef.current.play().catch((err) => console.error("Erreur de lecture du son:", err));
  };

  const startChrono = () => {
    if (!chrono) return;
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStage("preparation");
    setTimeLeft(chrono.preparationTime);
    setCurrentRound(1);
    setElapsedTime(0);
    setProgressMessage("");
  };

  const pauseChrono = () => {
    setIsRunning(false);
    setIsPaused(true);
    clearInterval(timerRef.current);
  };

  const resumeChrono = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const resetChrono = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStage("preparation");
    setTimeLeft(chrono.preparationTime);
    setCurrentRound(1);
    setElapsedTime(0);
    setProgressMessage("");
  };

  // Styles des cartes
  const cardStyles = {
    preparation: currentStage === "preparation" ? "bg-yellow-400" : "bg-gray-300",
    effort: currentStage === "effort" ? "bg-green-400" : "bg-gray-300",
    rest: currentStage === "rest" ? "bg-red-400" : "bg-gray-300",
    finished: currentStage === "finished" ? "bg-gray-500" : "bg-gray-300",
  };

  // Calculer le pourcentage de progression
  const progressPercentage = chrono ? ((elapsedTime / totalTime) * 100).toFixed(2) : "0.00";

  if (!chrono) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-500">Chronomètre introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-2">{chrono.name}</h1>
        <h2 className="text-xl mb-4">
          Round {currentRound} sur {chrono.rounds}
        </h2>

        {/* Message de progression */}
        {progressMessage && <p className="text-lg font-semibold mb-4">{progressMessage}</p>}

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
            <h3 className="text-2xl">Temps restant: {currentStage === "preparation" ? timeLeft : chrono.preparationTime}s</h3>
          </div>

          <div className={`p-4 rounded-lg ${cardStyles.effort}`}>
            <h2 className="text-xl mb-2">Effort</h2>
            <h3 className="text-2xl">Temps restant: {currentStage === "effort" ? timeLeft : chrono.effortTime}s</h3>
          </div>

          <div className={`p-4 rounded-lg ${cardStyles.rest}`}>
            <h2 className="text-xl mb-2">Récupération</h2>
            <h3 className="text-2xl">Temps restant: {currentStage === "rest" ? timeLeft : chrono.restTime}s</h3>
          </div>
        </div>

        {/* Afficher un message si terminé */}
        {currentStage === "finished" && <h3 className="text-xl mt-4">Tout est terminé ! Bravo !</h3>}

        {/* Contrôles du chronomètre */}
        {!isRunning ? (
          <>
            <button onClick={startChrono} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mt-4">
              Démarrer
            </button>

            <button onClick={() => navigate(-1)} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 mt-4 ml-2">
              Retour
            </button>
          </>
        ) : (
          <>
            <button onClick={isPaused ? resumeChrono : pauseChrono} className={`text-white py-2 px-4 rounded-md mt-4 ${isPaused ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700"}`}>
              {isPaused ? "Reprendre" : "Pause"}
            </button>
            <button onClick={resetChrono} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4 ml-2">
              Réinitialiser
            </button>
            {isRunning && (
              <button onClick={() => navigate(-1)} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 mt-4 ml-2">
                Retour
              </button>
            )}

            <h3 className="bg-red-600">J'ai TOURJOURS CE PROBLEME niveau timing.. le chrono s'arraite, risque fatigue, Le chrono s'arret etjr avant la p^hase de recuperation je ne sais pas pk...</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ChronoDetail;
