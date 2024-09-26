import React, { useState, useEffect } from "react";

const TestVmaTapis = () => {
  const [palier, setPalier] = useState(1);
  const [ciblePalier, setCiblePalier] = useState(1);
  const [vitesse, setVitesse] = useState(5.5);
  const [isWarmUpRunning, setIsWarmUpRunning] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sexe, setSexe] = useState("homme");
  const totalWarmUpDuration = 300; // 5 minutes en secondes

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`; // Format MM:SS
  };

  const startWarmUp = () => {
    setIsWarmUpRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setVitesse(sexe === "homme" ? 5.5 : 5.0);
  };

  const startTest = () => {
    setIsWarmUpRunning(false);
    setIsTestRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setVitesse(sexe === "homme" ? 8 : 6.5);
    setPalier(1);
    setCiblePalier(1);
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
      sexe,
      ciblePalier,
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
          if (prevVitesse < (sexe === "homme" ? 8 : 7)) {
            return Math.min(prevVitesse + 0.5, sexe === "homme" ? 8 : 7);
          }
          return prevVitesse;
        });
      }, 60000);
    }
    return () => clearInterval(warmUpInterval);
  }, [isWarmUpRunning, sexe]);

  useEffect(() => {
    let interval;
    if (isTestRunning) {
      interval = setInterval(() => {
        setPalier((prevPalier) => {
          const newPalier = prevPalier < 20 ? prevPalier + 1 : prevPalier;

          setVitesse((prevVitesse) => {
            return Math.min((sexe === "homme" ? 8 : 6.5) + (newPalier - 1) * 0.5, 20);
          });

          if (newPalier === 20) {
            endTest();
          }

          return newPalier;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isTestRunning, sexe]);

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

  const calculateTotalTestDuration = (palier) => {
    return palier * 60;
  };

  const progressBarWidthWarmUp = Math.min((elapsedTime / totalWarmUpDuration) * 100, 100); // Limiter à 100%
  const progressBarWidthTest = Math.min((elapsedTime / calculateTotalTestDuration(ciblePalier)) * 100, 100); // Limiter à 100%

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Test VMA sur Tapis de Course</h1>

        {!isWarmUpRunning && !isTestRunning && !testResults && (
          <>
            <h2 className="text-2xl font-bold mb-4">Protocole</h2>
            <p className="mb-4">Ce test consiste à commencer à une vitesse de 8 km/h et à augmenter de 0,5 km/h chaque minute. Le but est de courir jusqu'à ce que tu ne puisses plus maintenir la vitesse imposée.</p>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Sélectionnez votre sexe :</label>
              <div className="flex items-center">
                <button className={`border border-gray-300 rounded-md py-2 px-4 ${sexe === "homme" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`} onClick={() => setSexe("homme")}>
                  Homme
                </button>
                <button className={`border border-gray-300 rounded-md py-2 px-4 ml-4 ${sexe === "femme" ? "bg-pink-600 text-white" : "bg-white text-gray-700"}`} onClick={() => setSexe("femme")}>
                  Femme
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4">Échauffement</h3>
            <p className="mb-4">Avant de commencer le test, nous allons faire un échauffement. Il est important de préparer ton corps avant de réaliser un test de VMA.</p>
            <h3 className="text-xl font-bold mb-2">Étapes du Test</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Commence à {sexe === "homme" ? "8" : "6,5"} km/h avec une inclinaison de 1% sur le tapis.</li>
              <li>Chaque minute, la vitesse augmente de 0,5 km/h.</li>
              <li>Continue jusqu'à épuisement ou incapacité à maintenir la vitesse.</li>
              <li>La VMA correspond à la dernière vitesse atteinte complètement.</li>
            </ul>
            <button className="bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700" onClick={startWarmUp}>
              Commencer l'échauffement
            </button>
          </>
        )}

        {isWarmUpRunning && (
          <>
            <h2 className="text-2xl font-bold mb-4">Échauffement en cours</h2>
            <p>Temps écoulé : {formatTime(elapsedTime)} / 5 minutes</p>
            <p>Vitesse actuelle : {vitesse.toFixed(1)} km/h</p>
            <div className="relative h-4 bg-gray-300 rounded-full mb-4">
              <div className="absolute h-full bg-blue-600 rounded-full" style={{ width: `${progressBarWidthWarmUp}%` }} />
            </div>
            <button className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700" onClick={fastForwardWarmUp}>
              Avancer à 4:50
            </button>
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 ml-2" onClick={skipToTest}>
              Passer à la phase de test
            </button>
          </>
        )}

        {isTestRunning && (
          <>
            <h2 className="text-2xl font-bold mb-4">Test VMA en cours</h2>
            <p>Palier actuel : {palier}</p>
            <p>Vitesse actuelle : {vitesse.toFixed(1)} km/h</p>
            <p>Temps écoulé : {formatTime(elapsedTime)}</p>
            <div className="relative h-4 bg-gray-300 rounded-full mb-4">
              <div className="absolute h-full bg-green-600 rounded-full" style={{ width: `${progressBarWidthTest}%` }} />
            </div>
            <p>Temps restant pour le palier : {formatTime(calculateTotalTestDuration(palier) - elapsedTime)}</p>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Sélectionnez le palier cible :</label>
              <select value={ciblePalier} onChange={(e) => setCiblePalier(Number(e.target.value))} className="border border-gray-300 rounded-md py-2 px-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((p) => (
                  <option key={p} value={p}>
                    Palier {p}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700" onClick={endTest}>
              ARRET DU TEST
            </button>
          </>
        )}

        {testResults && (
          <>
            <h2 className="text-2xl font-bold mb-4">Résultats du Test</h2>
            <p>Sélection du sexe : {testResults.sexe === "homme" ? "Homme" : "Femme"}</p>
            <p>Palier cible : {testResults.ciblePalier}</p>
            <p>Palier atteint : {testResults.palier}</p>
            <p>VMA : {testResults.VMA.toFixed(1)} km/h</p>
            <p>Temps total : {formatTime(testResults.timeElapsed)}</p>
            <p>Date : {testResults.date.toLocaleString()}</p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" onClick={() => setTestResults(null)}>
              Recommencer le test
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TestVmaTapis;
