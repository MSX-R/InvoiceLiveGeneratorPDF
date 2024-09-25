import React, { useState, useEffect } from "react";

const TestVmaTapis = () => {
  const [palier, setPalier] = useState(1);
  const [vitesse, setVitesse] = useState(5.5); // Vitesse initiale de l'échauffement à 5.5 km/h
  const [isWarmUpRunning, setIsWarmUpRunning] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // État pour stocker le temps écoulé en secondes
  const totalWarmUpDuration = 300; // Durée totale de l'échauffement en secondes (5 minutes)

  // Fonction pour formater le temps au format min:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  // Démarrer l'échauffement
  const startWarmUp = () => {
    setIsWarmUpRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setVitesse(5.5); // Commencer à 5.5 km/h pour l'échauffement
  };

  // Démarrer le test
  const startTest = () => {
    setIsWarmUpRunning(false); // Assurez-vous que l'échauffement est arrêté
    setIsTestRunning(true);
    setStartTime(new Date());
    setElapsedTime(0); // Réinitialiser le temps écoulé au début du test
    setVitesse(8); // Commencer le test à 8 km/h
    setPalier(1); // Initialiser le palier à 1 au début du test
  };

  // Terminer le test
  const endTest = () => {
    setIsTestRunning(false);
    const timeElapsed = (new Date() - startTime) / 1000; // En secondes
    const VMA = vitesse - 0.5; // Dernière vitesse atteinte
    setTestResults({
      palier,
      VMA,
      timeElapsed,
      date: new Date(),
    });
  };

  // Terminer l'échauffement
  const endWarmUp = () => {
    setIsWarmUpRunning(false); // Arrêter l'échauffement
    startTest(); // Démarrer le test automatiquement
  };

  // Mettre à jour le temps écoulé toutes les secondes
  useEffect(() => {
    let timer;
    if (isWarmUpRunning || isTestRunning) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer); // Nettoyer l'intervalle lorsque le test ou l'échauffement se termine
  }, [isWarmUpRunning, isTestRunning, startTime]);

  // Augmenter la vitesse toutes les minutes pendant l'échauffement
  useEffect(() => {
    let warmUpInterval;
    if (isWarmUpRunning) {
      warmUpInterval = setInterval(() => {
        setElapsedTime((prevElapsed) => {
          const newElapsed = prevElapsed + 60; // Chaque intervalle est de 60 secondes
          if (newElapsed >= totalWarmUpDuration) {
            endWarmUp(); // Finir l'échauffement automatiquement après 5 minutes
          }
          return newElapsed;
        });

        setVitesse((prevVitesse) => {
          if (prevVitesse < 8) {
            return Math.min(prevVitesse + 0.5, 8); // Augmenter jusqu'à 8 km/h
          }
          return prevVitesse; // Garder la vitesse à 8 km/h si elle est déjà atteinte
        });
      }, 60000); // Augmente la vitesse toutes les 60 secondes
    }
    return () => clearInterval(warmUpInterval);
  }, [isWarmUpRunning]);

  // Mettre à jour le test
  useEffect(() => {
    if (isWarmUpRunning && elapsedTime >= totalWarmUpDuration) {
      startTest(); // Démarrer le test automatiquement après 5 minutes d'échauffement
    }
  }, [isWarmUpRunning, elapsedTime]);

  // Augmenter la vitesse toutes les minutes pendant le test
  useEffect(() => {
    let interval;
    if (isTestRunning) {
      interval = setInterval(() => {
        setPalier((prevPalier) => prevPalier + 1);
        setVitesse((prevVitesse) => prevVitesse + 0.5);
      }, 60000); // Augmentation toutes les 60 secondes
    }
    return () => clearInterval(interval);
  }, [isTestRunning]);

  // Avancer le chrono à 04:50
  const fastForwardWarmUp = () => {
    // Fixer l'écoulement à 290 secondes
    setElapsedTime(290);
    setIsWarmUpRunning(true); // Garder l'échauffement en cours

    // Démarrer un compte à rebours pour les 10 secondes restantes
    setTimeout(() => {
      endWarmUp(); // Démarrer le test automatiquement après 10 secondes
    }, 10000); // Attendre 10 secondes avant de démarrer le test
  };

  // Passer directement au test
  const skipToTest = () => {
    endWarmUp(); // Terminer l'échauffement pour démarrer le test
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Test VMA sur Tapis de Course</h1>

        {!isWarmUpRunning && !isTestRunning && !testResults && (
          <>
            <h2 className="text-2xl font-bold mb-4">Protocole</h2>
            <p className="mb-4">Ce test consiste à commencer à une vitesse de 8 km/h et à augmenter de 0,5 km/h chaque minute. Le but est de courir jusqu'à ce que tu ne puisses plus maintenir la vitesse imposée.</p>
            <h3 className="text-2xl font-bold mb-4">Échauffement</h3>

            <p className="mb-4">Avant de commencer le test, nous allons faire un échauffement. Il est important de préparer ton corps avant de réaliser un test de VMA.</p>
            <h3 className="text-xl font-bold mb-2">Étapes du Test</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Commence à 8 km/h avec une inclinaison de 1% sur le tapis.</li>
              <li>Chaque minute, la vitesse augmente de 0,5 km/h.</li>
              <li>Continue jusqu'à épuisement ou incapacité à maintenir la vitesse.</li>
              <li>La VMA correspond à la dernière vitesse atteinte complètement.</li>
            </ul>
            <button className="bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 w-full" onClick={startWarmUp}>
              Lancer l'échauffement
            </button>
          </>
        )}

        {isWarmUpRunning && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Échauffement en cours</h2>
            <p className="text-xl mb-2">
              Temps écoulé : {formatTime(elapsedTime)} / {formatTime(totalWarmUpDuration)}
            </p>
            <p className="text-xl mb-4">Vitesse actuelle : {vitesse.toFixed(1)} km/h</p>
            <p className="text-xl mb-4">Prépare-toi pour le test de VMA.</p>

            {/* Bouton pour avancer le chronomètre à 04:50 */}
            <button className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 mr-2" onClick={fastForwardWarmUp}>
              Avancer à 04:50
            </button>

            {/* Bouton pour passer directement au test */}
            <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" onClick={skipToTest}>
              Passer au test directement
            </button>
          </div>
        )}

        {isTestRunning && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Test en Cours</h2>
            <p className="text-xl mb-2">Palier actuel : {palier}</p>
            <p className="text-xl mb-2">Temps écoulé : {formatTime(elapsedTime)}</p>
            <p className="text-xl mb-4">Vitesse actuelle : {vitesse.toFixed(1)} km/h</p>
            <button className="bg-red-600 text-white py-4 px-6 rounded-md hover:bg-red-700 w-full" onClick={endTest}>
              Terminer le Test
            </button>
          </div>
        )}

        {testResults && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Résultats du Test</h2>
            <p className="text-xl mb-2">Palier atteint : {testResults.palier}</p>
            <p className="text-xl mb-2">VMA estimée : {testResults.VMA.toFixed(2)} km/h</p>
            <p className="text-xl mb-2">Durée totale : {testResults.timeElapsed.toFixed(2)} secondes</p>
            <p className="text-xl mb-4">Date : {testResults.date.toLocaleDateString()}</p>
            <button className="bg-green-600 text-white py-4 px-6 rounded-md hover:bg-green-700 w-full" onClick={() => setTestResults(null)}>
              Recommencer le Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestVmaTapis;
