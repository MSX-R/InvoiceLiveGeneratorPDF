import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import beepSound from "../assets/preparation.mp3"; // Import du bip sonore

const TestVamevalPiste = () => {
  const [palier, setPalier] = useState(1);
  const [ciblePalier, setCiblePalier] = useState(1);
  const [vitesse, setVitesse] = useState(8);
  const [isWarmUpRunning, setIsWarmUpRunning] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sexe, setSexe] = useState("homme");
  const [audio] = useState(new Audio(beepSound));
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modale

  const totalWarmUpDuration = 300; // 5 minutes en secondes

  // Fonction de remise à zéro du test
  const resetTest = () => {
    setPalier(1);
    setCiblePalier(1);
    setVitesse(8);
    setIsWarmUpRunning(false);
    setIsTestRunning(false);
    setTestResults(null);
    setStartTime(null);
    setElapsedTime(0);
  };

  // Formatage du temps en MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  // Début échauffement
  const startWarmUp = () => {
    resetTest();
    setIsWarmUpRunning(true);
    setStartTime(new Date());
  };

  // Début du test VAMEVAL
  const startTest = () => {
    setIsWarmUpRunning(false);
    setIsTestRunning(true);
    setStartTime(new Date());
    setPalier(1);
    setCiblePalier(1);
    setElapsedTime(0);
    playBeep();
  };

  const endTest = () => {
    const timeElapsed = (new Date() - startTime) / 1000;
    const VMA = vitesse - 0.5;
    setTestResults({
      palier,
      VMA,
      timeElapsed,
      date: new Date(),
      sexe,
      ciblePalier,
    });
    resetTest();
  };

  const endWarmUp = () => {
    setIsWarmUpRunning(false);
    startTest();
  };

  const playBeep = () => {
    audio.play();
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
    let interval;
    if (isTestRunning) {
      interval = setInterval(() => {
        setPalier((prevPalier) => {
          const newPalier = prevPalier + 1;

          // Augmenter la vitesse jusqu'à un maximum de 22 km/h
          setVitesse((prevVitesse) => Math.min(8 + (newPalier - 1) * 0.5, 22));

          // Terminer le test si la vitesse atteint 22 km/h
          if (vitesse >= 22) {
            endTest();
          }

          return newPalier;
        });
      }, 60000); // Bip toutes les 60 secondes
    }
    return () => clearInterval(interval);
  }, [isTestRunning, vitesse]);

  const progressBarWidthWarmUp = Math.min((elapsedTime / totalWarmUpDuration) * 100, 100);
  const progressBarWidthTest = Math.min((elapsedTime / (palier * 60)) * 100, 100);

  // Barème VAMEVAL selon le sexe
  const baremeVAMEVAL = {
    homme: [
      { palier: 1, vitesse: 8 },
      { palier: 2, vitesse: 8.5 },
      { palier: 3, vitesse: 9 },
      { palier: 4, vitesse: 9.5 },
      { palier: 5, vitesse: 10 },
      { palier: 6, vitesse: 10.5 },
      { palier: 7, vitesse: 11 },
      { palier: 8, vitesse: 11.5 },
      { palier: 9, vitesse: 12 },
      { palier: 10, vitesse: 12.5 },
      { palier: 11, vitesse: 13 },
      { palier: 12, vitesse: 13.5 },
      { palier: 13, vitesse: 14 },
      { palier: 14, vitesse: 14.5 },
      { palier: 15, vitesse: 15 },
      { palier: 16, vitesse: 15.5 },
      { palier: 17, vitesse: 16 },
      { palier: 18, vitesse: 16.5 },
      { palier: 19, vitesse: 17 },
      { palier: 20, vitesse: 17.5 },
      { palier: 21, vitesse: 18 },
      { palier: 22, vitesse: 18.5 },
    ],
    femme: [
      { palier: 1, vitesse: 8 },
      { palier: 2, vitesse: 7.5 },
      { palier: 3, vitesse: 8 },
      { palier: 4, vitesse: 8.5 },
      { palier: 5, vitesse: 9 },
      { palier: 6, vitesse: 9.5 },
      { palier: 7, vitesse: 10 },
      { palier: 8, vitesse: 10.5 },
      { palier: 9, vitesse: 11 },
      { palier: 10, vitesse: 11.5 },
      { palier: 11, vitesse: 12 },
      { palier: 12, vitesse: 12.5 },
      { palier: 13, vitesse: 13 },
      { palier: 14, vitesse: 13.5 },
      { palier: 15, vitesse: 14 },
      { palier: 16, vitesse: 14.5 },
      { palier: 17, vitesse: 15 },
      { palier: 18, vitesse: 15.5 },
      { palier: 19, vitesse: 16 },
      { palier: 20, vitesse: 16.5 },
      { palier: 21, vitesse: 17 },
      { palier: 22, vitesse: 17.5 },
    ],
  };

  // Fonction pour fermer la modale
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* ENTETE DE PAGE DYNAMIQUE */}
      <div className="bg-white p-4 rounded-md shadow-md mb-8">
        <motion.h1 className="text-4xl font-bold text-center my-4 text-gray-800 uppercase" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          VAMEVAL SUR PISTE
        </motion.h1>
      </div>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {!isWarmUpRunning && !isTestRunning && !testResults && (
          <>
            <h2 className="text-2xl font-bold mb-4">Protocole</h2>
            <p className="mb-4">Le test VAMEVAL est un test progressif de course à pied pour mesurer la vitesse maximale aérobie (VMA). Ce test est réalisé en extérieur sur une piste d'athlétisme de 400 m. Des plots de signalisation doivent être placés tous les 20 mètres pour indiquer les repères de distance.</p>
            <h3 className="text-xl font-bold mb-2">Marqueurs et Consignes</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Placez un plot tous les 20 mètres autour de la piste.</li>
              <li>Le test commence à une vitesse de 8 km/h et augmente de 0,5 km/h toutes les minutes.</li>
              <li>À chaque bip sonore, le coureur doit se trouver au niveau du plot suivant.</li>
            </ul>

            <div className="mb-8">
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

            <div className="flex flex-col justify-center items-center md:flex-row md:justify-between w-full gap-4 ">
              <button className="bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700" onClick={startWarmUp}>
                Commencer l'échauffement
              </button>

              {/* Bouton pour afficher le barème du test */}
              <button className=" bg-green-600 text-white w-10 h-10 rounded-full font-black hover:bg-green-700" onClick={() => setIsModalOpen(true)}>
                i
              </button>
            </div>

            {/* Modale pour afficher le barème */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 " onClick={closeModal}>
                <div className="bg-white p-6 rounded-md shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Barème VAMEVAL ({sexe})</h2>
                  <table className="table-auto w-full mb-4">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Palier</th>
                        <th className="border px-4 py-2">Vitesse (km/h)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {baremeVAMEVAL[sexe].map((item) => (
                        <tr key={item.palier} className="">
                          <td className="border px-4 py-2 text-center">{item.palier}</td>
                          <td className="border px-4 py-2 text-center">{item.vitesse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="bg-red-600 w-full text-white py-3 px-4 rounded-md hover:bg-red-700" onClick={closeModal}>
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {isWarmUpRunning && (
          <>
            <h2 className="text-2xl font-bold mb-4">Échauffement en cours</h2>
            <p>Temps écoulé : {formatTime(elapsedTime)} / 5 minutes</p>
            <div className="relative h-4 bg-gray-300 rounded-full mb-4">
              <div className="absolute h-full bg-blue-600 rounded-full" style={{ width: `${progressBarWidthWarmUp}%` }} />
            </div>
            <button className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700" onClick={endWarmUp}>
              Passer au test
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
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700" onClick={endTest}>
              Arrêter le test
            </button>
          </>
        )}

        {testResults && (
          <>
            <h2 className="text-2xl font-bold mb-4">Résultats du Test</h2>
            <p>Palier atteint : {testResults.palier}</p>
            <p>VMA : {testResults.VMA.toFixed(1)} km/h</p>
            <p>Temps total : {formatTime(testResults.timeElapsed)}</p>
            <p>Date : {testResults.date.toLocaleString()}</p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" onClick={() => resetTest()}>
              Recommencer
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default TestVamevalPiste;
