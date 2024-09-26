import React, { useState, useEffect } from "react";

const TestVmaTapis = () => {
  const [palier, setPalier] = useState(1);
  const [ciblePalier, setCiblePalier] = useState(null);
  const [vitesse, setVitesse] = useState(5.5);
  const [isWarmUpRunning, setIsWarmUpRunning] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const totalWarmUpDuration = 300;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const startWarmUp = () => {
    setIsWarmUpRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setVitesse(5.5);
  };

  const startTest = () => {
    setIsWarmUpRunning(false);
    setIsTestRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setVitesse(8);
    setPalier(1);
    setCiblePalier(null);
  };

  const endTest = () => {
    setIsTestRunning(false);
    const timeElapsed = (new Date() - startTime) / 1000;
    const VMA = vitesse - 0.5; // Calcul de la VMA
    setTestResults({
      palier,
      VMA,
      timeElapsed,
      date: new Date(),
    });
  };

  const endWarmUp = () => {
    setIsWarmUpRunning(false);
    startTest();
  };

  useEffect(() => {
    let timer;
    if (isWarmUpRunning || isTestRunning) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWarmUpRunning, isTestRunning, startTime]);

  useEffect(() => {
    let warmUpInterval;
    if (isWarmUpRunning) {
      warmUpInterval = setInterval(() => {
        setElapsedTime((prevElapsed) => {
          const newElapsed = prevElapsed + 60;
          if (newElapsed >= totalWarmUpDuration) {
            endWarmUp();
          }
          return newElapsed;
        });

        setVitesse((prevVitesse) => {
          if (prevVitesse < 8) {
            return Math.min(prevVitesse + 0.5, 8);
          }
          return prevVitesse;
        });
      }, 60000);
    }
    return () => clearInterval(warmUpInterval);
  }, [isWarmUpRunning]);

  useEffect(() => {
    if (isWarmUpRunning && elapsedTime >= totalWarmUpDuration) {
      startTest();
    }
  }, [isWarmUpRunning, elapsedTime]);

  useEffect(() => {
    let interval;
    if (isTestRunning) {
      interval = setInterval(() => {
        setPalier((prevPalier) => {
          const newPalier = prevPalier < 20 ? prevPalier + 1 : prevPalier;

          // Update vitesse based on the new palier
          setVitesse((prevVitesse) => {
            return Math.min(8 + (newPalier - 1) * 0.5, 20); // Ensure vitesse does not exceed 20 km/h
          });

          // End test if we've reached the maximum palier
          if (newPalier === 20) {
            endTest();
          }

          return newPalier;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isTestRunning]);

  const fastForwardWarmUp = () => {
    setElapsedTime(290);
    setIsWarmUpRunning(true);
    setStartTime(new Date(Date.now() - 290 * 1000));

    const timer = setInterval(() => {
      setElapsedTime((prevElapsedTime) => {
        if (prevElapsedTime < 299) {
          return prevElapsedTime + 1;
        } else {
          clearInterval(timer);
          endWarmUp();
          return prevElapsedTime;
        }
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      endWarmUp();
    }, 10000);
  };

  const skipToTest = () => {
    endWarmUp();
  };

  const getVitesseCible = (palier) => {
    return 8 + (palier - 1) * 0.5; // 8 km/h de départ et augmente de 0.5 km/h par palier
  };

  // Calculer le temps total pour atteindre le palier cible
  const calculateTotalTestDuration = (palier) => {
    return palier * 60; // 60 secondes par palier
  };

  // Calcul de la largeur de la barre de progression pour le test
  const progressBarWidth = ciblePalier !== null ? Math.min((elapsedTime / calculateTotalTestDuration(ciblePalier)) * 100, 100) : 0;

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

            {/* Barre de progression */}
            <div className="relative w-full h-6 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: `${(elapsedTime / totalWarmUpDuration) * 100}%`,
                  background: "blue",
                }}
              ></div>
            </div>

            <div className="flex justify-between mt-2">
              <button className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 mr-2" onClick={fastForwardWarmUp}>
                Avancer à 04:50
              </button>

              <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" onClick={skipToTest}>
                Passer au test directement
              </button>
            </div>
          </div>
        )}

        {isTestRunning && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Test en Cours</h2>
            <p className="text-xl mb-2">Palier actuel : {palier}</p>
            <p className="text-xl mb-2">Temps écoulé : {formatTime(elapsedTime)}</p>
            <p className="text-xl mb-4">Vitesse actuelle : {vitesse.toFixed(1)} km/h</p>

            {/* Liste déroulante pour sélectionner le palier cible */}
            <div className="mb-4">
              <label htmlFor="ciblePalier" className="block text-lg font-semibold mb-2">
                Sélectionnez un palier cible :
              </label>
              <select id="ciblePalier" value={ciblePalier || ""} onChange={(e) => setCiblePalier(Number(e.target.value))} className="border border-gray-300 rounded-md p-2">
                <option value="" disabled>
                  Sélectionnez un palier
                </option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
                  (
                    p // Ajout des paliers 9 et 10
                  ) => (
                    <option key={p} value={p}>
                      Palier {p}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Barre de progression pour le palier cible */}
            {ciblePalier !== null && (
              <>
                <p className="text-lg font-semibold mb-2">Vitesse cible : {getVitesseCible(ciblePalier).toFixed(1)} km/h</p>
                <div className="relative w-full h-6 bg-gray-200 rounded mb-4">
                  <div
                    className="absolute top-0 left-0 h-full rounded"
                    style={{
                      width: `${progressBarWidth}%`,
                      background: "green",
                    }}
                  ></div>
                </div>
              </>
            )}

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
