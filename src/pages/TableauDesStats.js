// pages/TableauDesStats.js
import React, { useState, useEffect } from "react";
import exercicesData from "../config/exercicesRM.json"; // Assurez-vous que le chemin est correct
import { FaCheckCircle, FaTimes } from "react-icons/fa"; // Importer les icônes

const TableauDesStats = () => {
  const [bilanFormValue, setBilanFormValue] = useState({ date: new Date().toISOString().split("T")[0] });
  const [inputs, setInputs] = useState({});
  const [exercises, setExercises] = useState({}); // État pour stocker les exercices

  // Utiliser useEffect pour charger les données JSON
  useEffect(() => {
    // Charger les exercices à partir du fichier JSON
    setExercises(exercicesData.exercises);
  }, []);

  const handleChange = (theme, exercise, value) => {
    // Met à jour l'état avec la nouvelle valeur saisie
    setInputs((prevInputs) => ({
      ...prevInputs,
      [theme]: {
        ...prevInputs[theme],
        [exercise]: value,
      },
    }));
  };

  const handleReset = (theme, exercise) => {
    // Réinitialiser la valeur de l'exercice
    setInputs((prevInputs) => ({
      ...prevInputs,
      [theme]: {
        ...prevInputs[theme],
        [exercise]: "",
      },
    }));
    console.log(`Valeur réinitialisée pour ${exercise} dans ${theme}`);
  };

  const handleValidate = (theme, exercise) => {
    // Validation d'entrée de l'utilisateur
    const value = inputs[theme]?.[exercise] || "";
    if (value) {
      console.log(`Valeur enregistrée pour ${exercise} : ${value}`);
    }
  };

  // Nouvelle fonction pour insérer des valeurs de test
  const insertTestValues = () => {
    const testValues = {
      avec_equipement: {
        "Développé couché (barre ou haltères)": 80, // 80 kg
        "Développé incliné (barre ou haltères)": 70,
        "Pec Fly": 25,
        "Tirage horizontal (machine)": 60,
        "Tirage vertical (poulie haute)": 70,
        "Tirage buste penché (barre)": 80,
        "Soulevé de terre (barre)": 100,
        "Développé militaire (haltères)": 30,
        "Élévations latérales (haltères)": 10,
        "Machine à épaule": 50,
        "Presse à cuisses": 120,
        "Squats (barre)": 80,
        "Leg curl machine": 40,
        "Leg extension machine": 40,
        "Hip thrust (barre)": 90,
        "Fentes (haltères)": 25,
        "Extension de mollets (machine)": 50,
        "Crunch à la poulie": 20,
        "Obliques (haltères)": 15,
      },
      sans_equipement: {
        Pompes: 10, // 10 répétitions
        "Pompes déclinées": 10,
        "Pompes inclinées": 10,
        "Tractions pronation": 5,
        "Traction supination": 5,
        "Mouvement d'Arlaud": 10,
        Squats: 15,
        "Fentes avant": 10,
        "Fentes latérales": 10,
        "Pont fessier": 15,
        "Fentes bulgares": 10,
        Crunchs: 15,
        Planches: 30, // 30 secondes
        "Mountain climber": 30,
        "Gainage latéral oblique": 20, // 20 secondes
      },
      tests_cardio: {
        "Test Vameval au tapis": 1600, // Distance en mètres
        "Test Vameval modifié à l'elliptique": 20, // Durée en minutes
      },
    };

    // Mettre à jour les entrées avec les valeurs de test
    const newInputs = {};
    Object.keys(exercises).forEach((theme) => {
      newInputs[theme] = {};
      Object.entries(exercises[theme]).forEach(([key, exerciseList]) => {
        exerciseList.forEach((exercise) => {
          newInputs[theme][exercise] = testValues[theme]?.[exercise] || 0; // Insère une valeur de test ou 0 si aucune valeur de test n'est définie
        });
      });
    });

    setInputs(newInputs); // Mettez à jour l'état avec les nouvelles valeurs
  };

  const handleSave = () => {
    // Supprime les exercices vides
    const filteredInputs = Object.fromEntries(Object.entries(inputs).map(([theme, exercises]) => [theme, Object.fromEntries(Object.entries(exercises).filter(([exercise, value]) => value !== ""))]));

    // Affichez les entrées avant de les enregistrer
    console.log("Valeurs actuelles des exercices :", filteredInputs);

    // Mettez à jour le bilan
    setBilanFormValue((prev) => ({
      ...prev,
      exercises: { ...filteredInputs },
    }));

    // Affichez l'objet de bilan avec les exercices mis à jour
    console.log("Données enregistrées :", { ...bilanFormValue, exercises: { ...filteredInputs } });
    alert("Valeurs sauvegardées pour la date : " + bilanFormValue.date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="max-w-lg w-full flex flex-col mx-auto bg-white p-8 rounded-3xl shadow-2xl transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">TABLEAU DES STATS RM10</h1>
        <p className="text-center mb-8 text-lg">{bilanFormValue.date}</p>

        {Object.keys(exercises).map((theme) => (
          <div key={theme} className="mb-8">
            <h2 className="text-2xl text-center font-semibold mb-2 text-gray-800">{theme.replace("_", " ").toUpperCase()}</h2>
            {Object.entries(exercises[theme]).map(([key, exerciseList]) => (
              <div key={key} className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300 mb-4">
                <h3 className="font-bold text-center text-gray-700 mb-4">{key.toUpperCase()}</h3>
                <hr className="mb-4" />
                {exerciseList.map((exercise) => (
                  <div key={exercise} className="flex flex-col mb-4">
                    <label className="text-lg">{exercise}</label>
                    <div className="flex flex-row items-center w-full mt-2">
                      <div className="relative flex-1">
                        <input type="text" value={inputs[theme]?.[exercise] || ""} onChange={(e) => handleChange(theme, exercise, e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10" />
                        {inputs[theme]?.[exercise] && (
                          <button onClick={() => handleReset(theme, exercise)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:underline">
                            <FaTimes className="text-lg" />
                          </button>
                        )}
                      </div>
                      <button onClick={() => handleValidate(theme, exercise)} className="flex items-center justify-center bg-green-500 text-white rounded-lg px-3 py-2 hover:bg-green-600 transition duration-300 ml-2">
                        <FaCheckCircle className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-col space-y-4">
          <button onClick={insertTestValues} className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition duration-300 font-semibold">
            Insérer des valeurs de test
          </button>
          <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
            Valider et enregistrer toutes les valeurs du jour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableauDesStats;
