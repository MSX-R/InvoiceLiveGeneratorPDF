import React, { useState, useEffect, useContext } from "react";
import exercicesData from "../config/exercicesRM.json";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Modal from "../Components/Modal";
import { ClientsContext } from "../contexts/ClientsContext";

const TableauDesStats = () => {
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [inputs, setInputs] = useState({});
  const [exercises, setExercises] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");

  const { clients, findClientById, saveRMTestResults } = useContext(ClientsContext);

  useEffect(() => {
    setExercises(exercicesData.exercises);
  }, []);

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
  };

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

  const handleSave = async () => {
    if (!selectedClientId) {
      alert("Veuillez sélectionner un client avant d'enregistrer.");
      return;
    }

    const filteredInputs = Object.fromEntries(
      Object.entries(inputs).map(([theme, exercises]) => [
        theme,
        Object.fromEntries(Object.entries(exercises).filter(([, value]) => value !== ""))
      ])
    );

    const testData = {
      name: `Récupération de RM10 ${testDate}`,
      date: testDate,
      exercises: filteredInputs,
    };

    try {
      await saveRMTestResults(selectedClientId, testData);
      alert("Les résultats du test ont été enregistrés avec succès !");
      setModalOpen(true);
    } catch (error) {
      alert("Erreur lors de l'enregistrement des résultats du test.");
    }
  };

  const selectedClient = selectedClientId ? findClientById(selectedClientId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="max-w-lg w-full flex flex-col mx-auto bg-white p-8 rounded-3xl shadow-2xl transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">TABLEAU DES STATS RM10</h1>
        <p className="text-center mb-4 text-lg">
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </p>

        <div className="mb-6">
          <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un client
          </label>
          <select
            id="clientSelect"
            value={selectedClientId}
            onChange={handleClientChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sélectionnez un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nom} {client.prenom}
              </option>
            ))}
          </select>
        </div>

        {selectedClient && (
          <p className="mb-4 text-center text-green-600">
            Client sélectionné: {selectedClient.nom} {selectedClient.prenom}
          </p>
        )}

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
                        <input
                          type="text"
                          value={inputs[theme]?.[exercise] || ""}
                          onChange={(e) => handleChange(theme, exercise, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10"
                        />
                        {inputs[theme]?.[exercise] && (
                          <button
                            onClick={() => handleReset(theme, exercise)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:underline"
                          >
                            <FaTimes className="text-lg" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Valider et enregistrer toutes les valeurs du jour
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Récapitulatif des Valeurs">
        <div>
          <p>
            <strong>Client:</strong> {selectedClient?.nom} {selectedClient?.prenom}
          </p>
          <p>
            <strong>Date du test:</strong> {testDate}
          </p>
          {Object.entries(inputs).map(([theme, exercises]) => (
            <div key={theme} className="mb-4">
              <h3 className="text-xl font-semibold">{theme.replace("_", " ").toUpperCase()}</h3>
              <ul className="list-disc list-inside">
                {Object.entries(exercises).map(([exercise, value]) => (
                  value && (
                    <li key={exercise}>
                      <strong>{exercise}:</strong> {value}
                    </li>
                  )
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