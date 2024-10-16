import React, { useState, useEffect } from "react";
import exercicesData from "../config/exercicesRM.json";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Modal from "../Components/Modal"; // Importer le composant Modal

const TableauDesStats = () => {
  const [bilanFormValue, setBilanFormValue] = useState({ date: new Date().toISOString().split("T")[0] });
  const [inputs, setInputs] = useState({});
  const [exercises, setExercises] = useState({});
  const [isModalOpen, setModalOpen] = useState(false); // État pour gérer l'ouverture de la modale
  const [summaryData, setSummaryData] = useState({}); // État pour stocker les données à résumer

  useEffect(() => {
    setExercises(exercicesData.exercises);
  }, []);

  const handleChange = (theme, exercise, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [theme]: {
        ...prevInputs[theme],
        [exercise]: value,
      },
    }));
  };

  const handleReset = (theme, exercise) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [theme]: {
        ...prevInputs[theme],
        [exercise]: "",
      },
    }));
  };

  const handleValidate = (theme, exercise) => {
    const value = inputs[theme]?.[exercise] || "";
    if (value) {
      console.log(`Valeur enregistrée pour ${exercise} : ${value}`);
    }
  };

  const insertTestValues = () => {
    const testValues = {
      avec_equipement: {
        "Développé couché (barre ou haltères)": 80,
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
        Pompes: 10,
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
        Planches: 30,
        "Mountain climber": 30,
        "Gainage latéral oblique": 20,
      },
      tests_cardio: {
        "Test sur tapis": 1600,
        "Test modifié à l'elliptique": 20,
      },
    };

    const newInputs = Object.keys(exercises).reduce((acc, theme) => {
      acc[theme] = {};
      Object.entries(exercises[theme]).forEach(([key, exerciseList]) => {
        exerciseList.forEach((exercise) => {
          acc[theme][exercise] = testValues[theme]?.[exercise] || 0;
        });
      });
      return acc;
    }, {});

    setInputs(newInputs);
  };

  const handleSave = () => {
    const filteredInputs = Object.fromEntries(Object.entries(inputs).map(([theme, exercises]) => [theme, Object.fromEntries(Object.entries(exercises).filter(([exercise, value]) => value !== ""))]));

    console.log("Valeurs actuelles des exercices :", filteredInputs);

    setBilanFormValue((prev) => ({
      ...prev,
      exercises: { ...filteredInputs },
    }));

    setSummaryData(filteredInputs); // Enregistrer les données à résumer
    setModalOpen(true); // Ouvrir la modale
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center ">
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

      {/* Modale récapitulative */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Récapitulatif des Valeurs">
        <div>
          {Object.entries(summaryData).map(([theme, exercises]) => (
            <div key={theme} className="mb-4">
              <h3 className="text-xl font-semibold">{theme.replace("_", " ").toUpperCase()}</h3>
              <ul className="list-disc list-inside">
                {Object.entries(exercises).map(([exercise, value]) => (
                  <li key={exercise}>
                    <strong>{exercise}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default TableauDesStats;
