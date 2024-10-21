import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Activity, ChevronDown } from "lucide-react";
// This array will represent RM values from RM1 to RM20, with IDs.
const RM_VALUES = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1, // Assigning IDs starting from 1
  label: `RM${index + 1}`,
}));

const TableauBerger = () => {
  const [selectedRM, setSelectedRM] = useState(RM_VALUES[9].id); // Default to RM10
  const [poids, setPoids] = useState("");
  const [rmValues, setRmValues] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
  };
  const openMethodModal = () => setIsMethodModalOpen(true);
  const closeMethodModal = () => {
    setIsMethodModalOpen(false);
    setSelectedMethod("");
  };
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };
  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const preparationPhysiqueData = {
    "Force Maximale": {
      "Méthode d'effort maximal": {
        intensite: "85-100% de la charge maximale (1RM)",
        series: "3-5 séries de 1-6 répétitions",
        repos: "3-5 minutes entre les séries",
        objectif: "Stimuler le système nerveux central et améliorer la capacité à soulever des charges lourdes.",
      },
      "Méthode de force lente": {
        intensite: "70-85% de la charge maximale",
        series: "3-5 séries de 5-8 répétitions",
        repos: "2-4 minutes",
        objectif: "Développer la capacité à maintenir un effort soutenu sous lourde charge.",
      },
    },
    "Force Endurance": {
      "Méthode des répétitions longues": {
        intensite: "40-60% de la charge maximale",
        series: "3-6 séries de 15-20 répétitions (ou plus)",
        repos: "1-2 minutes",
        objectif: "Renforcer la capacité des muscles à résister à la fatigue.",
      },
      "Méthode circuit training": {
        intensite: "40-60% de la charge maximale",
        series: "Circuit de 6-10 exercices, 12-20 répétitions par exercice",
        repos: "Très court (15-30 secondes entre les exercices)",
        objectif: "Améliorer l'endurance musculaire et cardiorespiratoire simultanément.",
      },
    },
    Hypertrophie: {
      "Méthode hypertrophie classique": {
        intensite: "60-80% de la charge maximale",
        series: "4-6 séries de 8-12 répétitions",
        repos: "60-90 secondes entre les séries",
        objectif: "Maximiser la croissance musculaire par une stimulation prolongée des fibres musculaires.",
      },
      "Méthode drop-set": {
        intensite: "70-85% de la charge maximale au départ, puis on diminue la charge à chaque série",
        series: "Série jusqu'à échec musculaire, on baisse la charge et continue jusqu'à échec (3-4 décharges)",
        repos: "Pas de repos entre les baisses de charge",
        objectif: "Pousser les muscles à l'échec, stimulant ainsi une hypertrophie maximale.",
      },
    },
    Puissance: {
      "Méthode pliométrique": {
        intensite: "80-100% de l'effort explosif",
        series: "3-6 séries de 5-8 répétitions",
        repos: "2-3 minutes",
        objectif: "Développer la capacité à générer de la force dans un temps très court (sauts, lancés explosifs).",
      },
      "Méthode contrastée": {
        intensite: "Alternance de charges lourdes (80-90%) et légères (30-40%) sur un même exercice",
        series: "3-5 séries de 3-6 répétitions",
        repos: "2-3 minutes",
        objectif: "Améliorer la synchronisation neuromusculaire et la capacité à exploser rapidement après un effort lourd.",
      },
    },
    Explosivité: {
      "Méthode de force-vitesse": {
        intensite: "30-60% de la charge maximale",
        series: "4-6 séries de 3-5 répétitions",
        repos: "2-3 minutes",
        objectif: "Améliorer la capacité à appliquer de la force rapidement.",
      },
      "Méthode balistique": {
        intensite: "Charge faible (30-50%)",
        series: "4-6 séries de 8-12 répétitions",
        repos: "2-3 minutes",
        objectif: "Mobiliser le maximum de fibres musculaires en un temps très court.",
      },
    },
    Vitesse: {
      "Méthode répétition": {
        intensite: "Effort maximal (100%)",
        series: "5-10 répétitions de 10-60 mètres",
        repos: "3-5 minutes",
        objectif: "Améliorer la vitesse pure et l'efficacité neuromusculaire.",
      },
      "Méthode intervalle court": {
        intensite: "90-100% de la vitesse maximale",
        series: "5-10 séries de 20-60 secondes d'effort intense",
        repos: "2-4 minutes",
        objectif: "Améliorer la tolérance à la fatigue lors des efforts de vitesse.",
      },
    },
    "Endurance Aérobie": {
      "Méthode continue": {
        intensite: "60-70% de la fréquence cardiaque maximale (FCM)",
        series: "30-90 minutes",
        repos: "N/A",
        objectif: "Améliorer l'endurance cardiovasculaire.",
      },
      "Méthode fractionnée longue": {
        intensite: "80-90% de la FCM",
        series: "3-6 séries de 4-10 minutes",
        repos: "2-3 minutes",
        objectif: "Développer la puissance aérobie et la capacité à maintenir des efforts intenses prolongés.",
      },
    },
    "Endurance Anaérobie": {
      "Méthode intervalle court": {
        intensite: "90-100% de la capacité maximale",
        series: "6-10 séries de 30 secondes à 2 minutes",
        repos: "1-3 minutes",
        objectif: "Améliorer la capacité à maintenir des efforts intenses en environnement anaérobie.",
      },
      "Méthode Tabata": {
        intensite: "170% de la VO2max",
        series: "8 répétitions de 20 secondes d'effort intense, suivies de 10 secondes de repos",
        repos: "10 secondes entre chaque répétition",
        objectif: "Améliorer à la fois l'endurance aérobie et anaérobie.",
      },
    },
    Souplesse: {
      "Méthode stretching statique": {
        intensite: "Étirements passifs maintenus à 60-80% de l'amplitude maximale",
        series: "3-5 séries de 30 secondes par étirement",
        repos: "N/A",
        objectif: "Améliorer la flexibilité et la récupération musculaire.",
      },
      "Méthode stretching balistique": {
        intensite: "Étirements dynamiques rapides",
        series: "2-3 séries de 10-15 mouvements par membre",
        repos: "N/A",
        objectif: "Développer la souplesse dynamique, utile dans les activités nécessitant de grands mouvements rapides.",
      },
    },
    "Travail Fonctionnel": {
      "Méthode kettlebell": {
        intensite: "Charge modérée (50-70%)",
        series: "3-5 séries de 10-20 répétitions",
        repos: "1-2 minutes",
        objectif: "Améliorer la force fonctionnelle, l'endurance musculaire et la coordination.",
      },
    },
  };

  // Function to calculate RM values
  const calculRM = (currentPoids) => {
    const repsForSelectedRM = selectedRM; // Using the selected RM as the number of repetitions

    // Ensure we have a valid poids and it's a positive number
    if (currentPoids > 0) {
      const selectedRMWeight = currentPoids / (1.0278 - 0.0278 * repsForSelectedRM);

      // Calculate the weights for RM1 to RM20 based on the selected RM weight
      const calculatedValues = RM_VALUES.map((rm) => {
        const equivalentWeight = selectedRMWeight * (1.0278 - 0.0278 * rm.id);
        return {
          id: rm.id, // Adding ID for easier comparison
          label: rm.label,
          value: equivalentWeight,
        };
      });

      setRmValues(calculatedValues);
    } else {
      // Reset rmValues if poids is not valid or empty
      setRmValues([]);
    }
  };

  // Trigger recalculation when poids or RM changes
  useEffect(() => {
    calculRM(poids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRM, poids]);

  const handleRMChange = (e) => {
    const newSelectedRM = parseInt(e.target.value);
    setSelectedRM(newSelectedRM);
  };

  const handlePoidsChange = (e) => {
    const newPoids = e.target.value;
    setPoids(newPoids);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto p-8">
        <motion.h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Calculateur de RM <Dumbbell className="inline-block ml-2" />
        </motion.h1>

        <motion.div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-stretch mb-6">
            <div className="relative flex-1">
              <select value={selectedRM} onChange={handleRMChange} className="w-full p-4 bg-gray-800 border border-gray-700 rounded-md text-white appearance-none">
                {RM_VALUES.map((rm) => (
                  <option key={rm.label} value={rm.id}>
                    {rm.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1">
              <input type="number" placeholder="Charge (kg)" value={poids} onChange={handlePoidsChange} className="w-full p-4 bg-gray-800 border border-gray-700 rounded-md text-white" />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">kg</span>
            </div>
          </div>

          <motion.button onClick={openMethodModal} className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:from-blue-600 hover:to-green-600 transition duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Méthodes de préparation physique <Activity className="inline-block ml-2" />
          </motion.button>

          {rmValues.length > 0 && (
            <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold text-center mb-4">RM Correspondants</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-4 py-2">Paramètre</th>
                      <th className="border border-gray-700 px-4 py-2">Valeur (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rmValues.map((rm) => (
                      <motion.tr key={rm.label} className={`text-center ${rm.id === selectedRM ? "bg-blue-900" : "bg-gray-900"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <td className="border border-gray-700 px-4 py-2">{rm.label}</td>
                        <td className="border border-gray-700 px-4 py-2">{rm.value.toFixed(2)} kg</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Modale RM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Méthodes de Préparation Physique</h2>
              <button onClick={closeModal} className="text-2xl">
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex">
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                {Object.keys(preparationPhysiqueData).map((section) => (
                  <button key={section} onClick={() => handleSectionClick(section)} className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedSection === section ? "bg-blue-100" : ""}`}>
                    {section}
                  </button>
                ))}
              </div>
              <div className="w-2/3 p-4 overflow-y-auto">
                {selectedSection && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">{selectedSection}</h3>
                    {Object.entries(preparationPhysiqueData[selectedSection]).map(([method, details]) => (
                      <div key={method} className="mb-4">
                        <h4 className="font-semibold">{method}</h4>
                        <ul className="list-disc list-inside">
                          <li>Intensité: {details.intensite}</li>
                          <li>Séries/Répétitions: {details.series}</li>
                          <li>Temps de repos: {details.repos}</li>
                          <li>Objectif: {details.objectif}</li>
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE METHODE */}
      {isMethodModalOpen && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-600 to-green-600">
              <h2 className="text-3xl font-bold text-white">METHODE DE TRAVAIL & INTENSITE</h2>
              <button onClick={closeMethodModal} className="text-4xl text-white hover:text-gray-300 transition duration-300">
                &times;
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto bg-gray-800">
              <select value={selectedMethod} onChange={handleMethodChange} className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded-md text-white text-lg">
                <option value="">Sélectionnez une méthode</option>
                {Object.keys(preparationPhysiqueData).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>

              {selectedMethod && (
                <motion.div className="bg-gray-700 rounded-lg  p-6  shadow-inner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">{selectedMethod}</h3>
                  {Object.entries(preparationPhysiqueData[selectedMethod]).map(([subMethod, details]) => (
                    <motion.div key={subMethod} className="mb-6 bg-gray-800 p-4 rounded-md shadow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                      <h4 className="text-xl font-semibold mb-2 text-green-400">{subMethod}</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>
                          <span className="font-semibold text-white">Intensité:</span> {details.intensite}
                        </li>
                        <li>
                          <span className="font-semibold text-white">Séries/Répétitions:</span> {details.series}
                        </li>
                        <li>
                          <span className="font-semibold text-white">Temps de repos:</span> {details.repos}
                        </li>
                        <li>
                          <span className="font-semibold text-white">Objectif:</span> {details.objectif}
                        </li>
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TableauBerger;
