import React, { useState, useEffect, useContext } from "react";
import exercicesData from "../config/exercicesRM.json";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Modal from "../Components/Modal";
import { ClientsContext } from "../contexts/ClientsContext";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const TableauDesStats = () => {
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [inputs, setInputs] = useState({});
  const [exercises, setExercises] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");

  const { loggedUser } = useAuth();
  const { clients, findClientById, saveRMTestResults } = useContext(ClientsContext);

  useEffect(() => {
    setExercises(exercicesData.exercises);

    // If user is not admin, set their ID as the selected client ID
    if (loggedUser.role_nom !== "Administrateur" && loggedUser.id) {
      setSelectedClientId(loggedUser.id.toString());
    }
  }, [loggedUser]);

  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setSelectedClientId(clientId);
  };

  // Get the current client based on user role and selection
  const getCurrentClient = () => {
    if (!selectedClientId) return null;

    if (loggedUser.role_nom !== "Administrateur") {
      // For non-admin users, return their own user object with necessary client fields
      return {
        id: loggedUser.id,
        nom: loggedUser.nom,
        prenom: loggedUser.prenom,
        sexe: loggedUser.sexe,
      };
    } else {
      // For admin users, find the selected client from the clients list
      return findClientById(Number(selectedClientId));
    }
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
    const currentClient = getCurrentClient();

    if (!currentClient) {
      alert("Veuillez sélectionner un client avant d'enregistrer.");
      return;
    }

    // Vérifier qu'il y a au moins une valeur à enregistrer
    const hasValues = Object.values(inputs).some((themeInputs) => Object.values(themeInputs).some((value) => value !== ""));

    if (!hasValues) {
      alert("Veuillez entrer au moins une valeur avant d'enregistrer.");
      return;
    }

    const filteredInputs = Object.fromEntries(Object.entries(inputs).map(([theme, exercises]) => [theme, Object.fromEntries(Object.entries(exercises).filter(([, value]) => value !== ""))]));

    try {
      await saveRMTestResults(currentClient.id, {
        clientId: currentClient.id, //! VOIR SI l'envoid e l'id du client (connecté ou selectioné) est iun probleme en plus de la reponse du formulaie mais je pense pas
        name: `Récupération de RM10 ${testDate}`,
        date: testDate,
        exercises: filteredInputs,
      });

      alert("Enregistrement réussi !");
      setModalOpen(true);
    } catch (error) {
      console.error("Save error:", error);
      alert("Erreur lors de l'enregistrement. Veuillez vérifier votre connexion et réessayer.");
    }
  };

  const currentClient = getCurrentClient();

  return (
    <>
      <div className="bg-white p-1 md:p-4 rounded-md shadow-md mb-4 md:mb-8">
        <motion.h1 className="text-4xl sm:text-5xl font-bold text-center my-4 text-gray-800 uppercase" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          REFERENCES RM10
        </motion.h1>
      </div>

      <div className="w-full flex flex-col mx-auto bg-white p-8 rounded-md shadow-2xl transition-transform duration-300">
        <p className="text-center mb-4 text-lg">
          <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} className="border border-gray-300 rounded-md p-2" />
        </p>

        {loggedUser.role_nom === "Administrateur" && (
          <div className="mb-6">
            <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un client
            </label>
            <select id="clientSelect" value={selectedClientId} onChange={handleClientChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Sélectionnez un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom} {client.prenom}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentClient && (
          <p className="mb-4 text-center text-green-600">
            {currentClient.sexe === "Homme" ? "Client rattaché au formulaire" : "Cliente rattachée au formulaire"} :{" "}
            <span className="font-bold">
              {currentClient.nom} {currentClient.prenom}
            </span>
          </p>
        )}

        {Object.keys(exercises).map((theme) => (
          <div key={theme} className="mb-8">
            <h2 className="text-2xl text-center font-semibold mb-8 p-4 bg-gray-200 shadow-md text-gray-800">{theme.replace("_", " ").toUpperCase()}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
              {/* CARD EXERCICES */}
              {Object.entries(exercises[theme]).map(([key, exerciseList]) => (
                <div key={key} className="w-full p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300 ">
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
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col space-y-4">
          <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
            Valider et enregistrer toutes les valeurs du jour
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Récapitulatif des Valeurs">
        <div>
          <p>
            <strong>Client:</strong> {currentClient?.nom} {currentClient?.prenom}
          </p>
          <p>
            <strong>Date du test:</strong> {testDate}
          </p>
          {Object.entries(inputs).map(([theme, exercises]) => (
            <div key={theme} className="mb-4">
              <h3 className="text-xl font-semibold">{theme.replace("_", " ").toUpperCase()}</h3>
              <ul className="list-disc list-inside">
                {Object.entries(exercises).map(
                  ([exercise, value]) =>
                    value && (
                      <li key={exercise}>
                        <strong>{exercise}:</strong> {value}
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default TableauDesStats;
