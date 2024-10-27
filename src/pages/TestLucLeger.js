import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStopwatch, FaRunning, FaFlagCheckered, FaHeart, FaExclamationTriangle, FaTrophy, FaTimes, FaInfoCircle } from "react-icons/fa";
import Confetti from "react-confetti";
import beepSound from "../assets/preparation.mp3";

const getPerformancePredictions = (vma) => {
  return {
    "3000m": Math.round(3000 / ((vma * 0.95) / 3.6)), // Temps en secondes pour 3000m
    "10000m": Math.round(10000 / ((vma * 0.82) / 3.6)), // Temps en secondes pour 10000m
    semi: Math.round(21097 / ((vma * 0.73) / 3.6)), // Temps en secondes pour semi-marathon
    marathon: Math.round(42195 / ((vma * 0.65) / 3.6)), // Temps en secondes pour marathon
  };
};

// Fonction pour obtenir le niveau selon l'âge et le sexe
const getNorme = (age, sexe, palier) => {
  const normes = {
    homme: {
      "20-29": { excellent: 12, bon: 10, moyen: 8, faible: 6 },
      "30-39": { excellent: 11, bon: 9, moyen: 7, faible: 5 },
      "40-49": { excellent: 10, bon: 8, moyen: 6, faible: 4 },
      "50+": { excellent: 9, bon: 7, moyen: 5, faible: 3 },
    },
    femme: {
      "20-29": { excellent: 10, bon: 8, moyen: 6, faible: 4 },
      "30-39": { excellent: 9, bon: 7, moyen: 5, faible: 3 },
      "40-49": { excellent: 8, bon: 6, moyen: 4, faible: 2 },
      "50+": { excellent: 7, bon: 5, moyen: 3, faible: 1 },
    },
  };

  // Détermination de la catégorie d'âge
  let ageCategory = "20-29";
  if (age >= 50) ageCategory = "50+";
  else if (age >= 40) ageCategory = "40-49";
  else if (age >= 30) ageCategory = "30-39";

  const categorie = normes[sexe][ageCategory];

  if (palier >= categorie.excellent) return "Excellent";
  if (palier >= categorie.bon) return "Bon";
  if (palier >= categorie.moyen) return "Moyen";
  if (palier >= categorie.faible) return "Faible";
  return "Insuffisant";
};

const TestLucLeger = () => {
  const [palier, setPalier] = useState(0);
  const [vitesse, setVitesse] = useState(8);
  const [isWarmUpRunning, setIsWarmUpRunning] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedTimeForCurrentPalier, setElapsedTimeForCurrentPalier] = useState(0);
  const [sexe, setSexe] = useState("homme");
  const [audio] = useState(new Audio(beepSound));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nombreAllerRetour, setNombreAllerRetour] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [nextBipTime, setNextBipTime] = useState(0);

  const totalWarmUpDuration = 300; // 5 minutes en secondes
  const PALIER_DURATION = 60; // 1 minute par palier (corrigé)
  const DISTANCE_ENTRE_PLOTS = 20; // en mètres

  // Table officielle des vitesses et temps par palier
  const palierConfig = {
    0: { vitesse: 8.0, duree: 120, tempsEntreBips: 9.0, minRequired: false }, // 2 minutes
    1: { vitesse: 8.5, duree: 60, tempsEntreBips: 8.5, minRequired: false },
    2: { vitesse: 9.0, duree: 60, tempsEntreBips: 8.0, minRequired: false },
    3: { vitesse: 9.5, duree: 60, tempsEntreBips: 7.6, minRequired: false },
    4: { vitesse: 10.0, duree: 60, tempsEntreBips: 7.2, minRequired: false },
    5: { vitesse: 10.5, duree: 60, tempsEntreBips: 6.9, minRequired: false },
    6: { vitesse: 11.0, duree: 60, tempsEntreBips: 6.5, minRequired: false },
    7: { vitesse: 11.5, duree: 60, tempsEntreBips: 6.3, minRequired: "femme" },
    8: { vitesse: 12.0, duree: 60, tempsEntreBips: 6.0, minRequired: "homme" },
    9: { vitesse: 12.5, duree: 60, tempsEntreBips: 5.8, minRequired: false },
    10: { vitesse: 13.0, duree: 60, tempsEntreBips: 5.5, minRequired: false },
    11: { vitesse: 13.5, duree: 60, tempsEntreBips: 5.3, minRequired: false },
    12: { vitesse: 14.0, duree: 60, tempsEntreBips: 5.1, minRequired: false },
    13: { vitesse: 14.5, duree: 60, tempsEntreBips: 5.0, minRequired: false },
    14: { vitesse: 15.0, duree: 60, tempsEntreBips: 4.8, minRequired: false },
    15: { vitesse: 15.5, duree: 60, tempsEntreBips: 4.6, minRequired: false },
    16: { vitesse: 16.0, duree: 60, tempsEntreBips: 4.5, minRequired: false },
    17: { vitesse: 16.5, duree: 60, tempsEntreBips: 4.4, minRequired: false },
    18: { vitesse: 17.0, duree: 60, tempsEntreBips: 4.2, minRequired: false },
    19: { vitesse: 17.5, duree: 60, tempsEntreBips: 4.1, minRequired: false },
    20: { vitesse: 18.0, duree: 60, tempsEntreBips: 4.0, minRequired: false },
    21: { vitesse: 18.5, duree: 60, tempsEntreBips: 3.9, minRequired: false },
    22: { vitesse: 19.0, duree: 60, tempsEntreBips: 3.8, minRequired: false },
  };
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (width) => ({
      width: `${width}%`,
      transition: { duration: 0.5 },
    }),
  };

  const calculateVO2Max = (vitesse) => {
    return Math.round(14.49 - 2.143 * vitesse + 0.00324 * Math.pow(vitesse, 2));
  };

  const calculateDistance = () => {
    return nombreAllerRetour * (DISTANCE_ENTRE_PLOTS * 2);
  };

  // Ajout du calcul de la note
  const calculateScore = (finalPalier, sexe) => {
    const minPalier = sexe === "femme" ? 7 : 8;
    if (finalPalier < minPalier) return 0;
    return 10 + (finalPalier - minPalier);
  };

  const resetTest = () => {
    setPalier(1);
    setVitesse(palierConfig[1].vitesse);
    setIsWarmUpRunning(false);
    setIsTestRunning(false);
    setTestResults(null);
    setStartTime(null);
    setElapsedTime(0);
    setElapsedTimeForCurrentPalier(0);
    setNombreAllerRetour(0);
    setNextBipTime(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const calculateNextBipTime = () => {
    const config = palierConfig[palier];
    return config.tempsEntreBips;
  };

  const startWarmUp = () => {
    if (!nom || !prenom) {
      alert("Veuillez entrer votre nom et prénom avant de commencer");
      return;
    }
    resetTest();
    setIsWarmUpRunning(true);
    setStartTime(new Date());
  };

  const skipWarmUp = () => {
    endWarmUp();
  };

  const startTest = () => {
    setIsWarmUpRunning(false);
    setIsTestRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    playBeep();
    setNextBipTime(calculateNextBipTime());
  };

  const endWarmUp = () => {
    setIsWarmUpRunning(false);
    startTest();
  };

  const playBeep = () => {
    audio.play().catch((error) => console.log("Erreur de lecture audio:", error));
  };

  const stopTest = () => {
    endTest();
  };

  // Modification de endTest pour inclure le score
  const endTest = () => {
    const timeElapsed = (new Date() - startTime) / 1000;
    const VO2Max = calculateVO2Max(vitesse);
    const distance = calculateDistance();
    const score = calculateScore(palier, sexe);

    const results = {
      palier,
      vitesse,
      VO2Max,
      timeElapsed,
      date: new Date(),
      sexe,
      nom,
      prenom,
      distanceParcourue: distance,
      nombreAllerRetour,
      score,
      minRequired: palierConfig[palier]?.minRequired || false,
    };

    setTestResults(results);
    setShowConfetti(true);
    setIsModalOpen(true);
    resetTest();
  };

  // Gestion du chronométrage général
  useEffect(() => {
    let timer;
    if (isWarmUpRunning || isTestRunning) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWarmUpRunning, isTestRunning, startTime]);

  // Modification de l'effet pour les paliers
  useEffect(() => {
    let interval;
    if (isTestRunning) {
      let lastBipTime = 0;
      interval = setInterval(() => {
        setElapsedTimeForCurrentPalier((prev) => {
          const newTime = prev + 0.1;
          const currentConfig = palierConfig[palier];
          const palierDuration = currentConfig.duree;

          if (newTime - lastBipTime >= currentConfig.tempsEntreBips) {
            playBeep();
            setNombreAllerRetour((prev) => prev + 1);
            lastBipTime = newTime;
          }

          if (newTime >= palierDuration) {
            setPalier((prevPalier) => {
              const newPalier = prevPalier + 1;
              if (newPalier > 22) {
                endTest();
                return prevPalier;
              }
              setVitesse(palierConfig[newPalier].vitesse);
              playBeep();
              return newPalier;
            });
            return 0;
          }

          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTestRunning, palier]);

  // Modification du calcul du temps restant
  const getRemainingTime = () => {
    const currentConfig = palierConfig[palier];
    return currentConfig.duree - elapsedTimeForCurrentPalier;
  };
  // Mise à jour du calcul de la progression
  const getPalierProgress = () => {
    const currentConfig = palierConfig[palier];
    return (elapsedTimeForCurrentPalier / currentConfig.duree) * 100;
  };
  const InfoModal = () => (
    <AnimatePresence>
      {showInfoModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowInfoModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Protocole Officiel du Test Luc Léger</h2>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Déroulement du Test</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Chaque palier dure 1 minute exactement</li>
                  <li>La vitesse augmente de 0.5 km/h à chaque palier</li>
                  <li>La distance entre les plots est de 20 mètres</li>
                  <li>Il faut atteindre le plot opposé avant le bip sonore</li>
                  <li>Un retard de plus de 2 mètres au bip = arrêt du test</li>
                  <li>Le test se termine au palier 22 ou à l'épuisement</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Progression des Vitesses</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(palierConfig).map(([palier, config]) => (
                    <div key={palier} className="flex justify-between">
                      <span>Palier {palier}:</span>
                      <span>{config.vitesse} km/h</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Temps entre les Bips</h3>
                <p className="text-sm text-gray-600 mb-2">Le temps entre chaque bip diminue progressivement selon la vitesse du palier :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Palier 1 : 9.0 secondes (8.0 km/h)</li>
                  <li>Palier 11 : 5.5 secondes (13.0 km/h)</li>
                  <li>Palier 22 : 3.9 secondes (18.5 km/h)</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Interprétation des Résultats</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>La VMA est calculée selon le dernier palier atteint</li>
                  <li>Le VO2 Max est estimé selon une formule validée</li>
                  <li>La performance est évaluée selon l'âge et le sexe</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setShowInfoModal(false)} className="w-full mt-6 bg-blue-600 text-white rounded-lg py-3 px-6">
              Compris
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ResultModal = () => {
    const performancePredictions = getPerformancePredictions(testResults?.vitesse || 0);
    const niveau = getNorme(30, testResults?.sexe || "homme", testResults?.palier || 0);

    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {showConfetti && <Confetti />}
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setShowConfetti(false);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>

              <div className="text-center mb-6">
                <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Félicitations!</h2>
                <p className="text-lg text-gray-600">
                  {testResults?.prenom} {testResults?.nom}
                </p>
                <div className="mt-2 text-sm text-gray-500">Niveau : {niveau}</div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Palier atteint</div>
                  <div className="text-2xl font-bold text-blue-600">{testResults?.palier}</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">VMA</div>
                  <div className="text-2xl font-bold text-green-600">{testResults?.vitesse} km/h</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">VO2 Max estimé</div>
                  <div className="text-2xl font-bold text-purple-600">{testResults?.VO2Max} ml/kg/min</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Distance totale</div>
                  <div className="text-2xl font-bold text-orange-600">{testResults?.distanceParcourue} mètres</div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Prédictions de performance</div>
                  <div className="space-y-1 text-yellow-800">
                    <div className="flex justify-between">
                      <span>3000m :</span>
                      <span>{formatTime(performancePredictions["3000m"])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10000m :</span>
                      <span>{formatTime(performancePredictions["10000m"])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Semi-marathon :</span>
                      <span>{formatTime(performancePredictions["semi"])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marathon :</span>
                      <span>{formatTime(performancePredictions["marathon"])}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Temps total du test</div>
                  <div className="text-2xl font-bold text-red-600">{formatTime(testResults?.timeElapsed)}</div>
                </div>
              </div>

              <motion.button
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsModalOpen(false);
                  setShowConfetti(false);
                }}
              >
                Fermer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <motion.div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.h1 className="text-4xl font-bold text-center my-4 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          TEST LUC LÉGER
        </motion.h1>
      </motion.div>

      <motion.div className="max-w-3xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {!isWarmUpRunning && !isTestRunning && !testResults && (
          <div className="bg-white relative rounded-xl shadow-lg p-8 space-y-6">
            <motion.button className="absolute top-6 right-6 text-blue-600 hover:text-blue-700 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowInfoModal(true)}>
              <FaInfoCircle size={24} />
            </motion.button>

            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Prénom</label>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Entrez votre prénom" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Nom</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Entrez votre nom" required />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Sélectionnez votre profil</h3>
              <div className="flex space-x-4">
                {["homme", "femme"].map((genre) => (
                  <button key={genre} onClick={() => setSexe(genre)} className={`flex-1 py-3 px-6 rounded-lg transition-all duration-200 ${sexe === genre ? "bg-blue-600 text-white shadow-lg transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg py-4 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startWarmUp}>
              Commencer l'échauffement
            </motion.button>
          </div>
        )}

        {isWarmUpRunning && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FaHeart className="text-3xl text-red-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-800">Échauffement</h2>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl font-mono text-gray-700">{formatTime(elapsedTime)}</span>
                <span className="text-xl text-gray-500"> / 5:00</span>
              </div>

              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600" initial="hidden" animate="visible" variants={progressVariants} custom={(elapsedTime / totalWarmUpDuration) * 100} />
              </div>

              <motion.button className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={skipWarmUp}>
                Passer l'échauffement
              </motion.button>
            </div>
          </div>
        )}

        {isTestRunning && (
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute top-4 right-4 flex items-center space-x-2 text-gray-600">
              <FaStopwatch className="text-xl" />
              <span className="text-xl font-mono">{formatTime(elapsedTime)}</span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <FaRunning className="text-3xl text-blue-600 animate-bounce" />
              <h2 className="text-2xl font-bold text-gray-800">Test en cours</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-gray-600 mb-1">Palier</div>
                <div className="text-3xl font-bold text-blue-600">{palier}</div>
                <div className="text-sm text-gray-500">Temps restant: {formatTime(PALIER_DURATION - elapsedTimeForCurrentPalier)}</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-gray-600 mb-1">Vitesse</div>
                <div className="text-3xl font-bold text-blue-600">{vitesse} km/h</div>
                <div className="text-sm text-gray-500">{palierConfig[palier].tempsEntreBips.toFixed(1)}s par bip</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 col-span-2">
                <div className="text-gray-600 mb-1">Allers-retours effectués</div>
                <div className="text-3xl font-bold text-green-600">{nombreAllerRetour}</div>
                <div className="text-sm text-gray-500">Distance: {calculateDistance()}m</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 mb-2">Progression du palier actuel</div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600" initial="hidden" animate="visible" variants={progressVariants} custom={(elapsedTimeForCurrentPalier / PALIER_DURATION) * 100} />
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>Début du palier</span>
                <span>Fin du palier</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.button className="w-full bg-red-500 text-white rounded-lg py-3 px-6 font-semibold shadow-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={stopTest}>
                <FaExclamationTriangle />
                <span>Arrêter le test</span>
              </motion.button>
            </div>
          </div>
        )}

        <InfoModal />
        <ResultModal />
      </motion.div>
    </div>
  );
};

export default TestLucLeger;
