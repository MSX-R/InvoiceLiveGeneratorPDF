import React, { useState, useEffect } from "react";
import { Switch } from "@mui/material";

// Composant pour les mensurations physiques
const FormulaireMensurations = ({ mensurations, handleChangeMensurations, isSaveMensurationsEnabled }) => {
  const formatCamelCase = (text) => {
    return text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^[a-z]/, (char) => char.toUpperCase());
  };

  return (
    <form className="space-y-4">
      {Object.keys(mensurations).map((key) => (
        <div key={key}>
          <label className="block font-semibold mb-2">{formatCamelCase(key)} (cm)</label>
          <input type="number" name={key} value={mensurations[key]} onChange={handleChangeMensurations} className="w-full p-4 border rounded-md" />
        </div>
      ))}
      <button type="submit" className={`w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 ${!isSaveMensurationsEnabled ? "bg-gray-400 cursor-not-allowed" : ""}`} disabled={!isSaveMensurationsEnabled}>
        Enregistrer les mensurations
      </button>
    </form>
  );
};

// Composant pour les données corporelles
const FormulaireCorporelles = ({ corporelles, handleChangeCorporelles, isSaveCorporellesEnabled }) => {
  const formatCamelCase = (text) => {
    return text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^[a-z]/, (char) => char.toUpperCase());
  };

  const getUnit = (key) => {
    if (key.includes("taille")) return "(cm)";
    if (key.includes("poids")) return "(kg)";
    if (key.includes("tauxMasseGrassePourcentage") || key.includes("tauxMasseMusculairePourcentage")) return "(%)";
    if (key.includes("tauxMasseGrasseKg") || key.includes("tauxMasseMusculaireKg")) return "(kg)";
    if (key.includes("fcRepos")) return "(puls/min)";
    return "";
  };

  return (
    <form className="space-y-4">
      {Object.keys(corporelles).map((key) => (
        <div key={key}>
          <label className="block font-semibold mb-2">
            {formatCamelCase(key)} {getUnit(key)}
          </label>
          <input type="number" name={key} value={corporelles[key]} onChange={handleChangeCorporelles} className="w-full p-4 border rounded-md" />
        </div>
      ))}
      <button type="submit" className={`w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 ${!isSaveCorporellesEnabled ? "bg-gray-400 cursor-not-allowed" : ""}`} disabled={!isSaveCorporellesEnabled}>
        Enregistrer les données corporelles
      </button>
    </form>
  );
};

// Composant principal pour l'analyse des données corporelles et mensurations physiques
const FormulaireDonneesCorporelles = () => {
  // État pour les mensurations corporelles
  const [mensurations, setMensurations] = useState({
    cou: "",
    epaules: "",
    biceps: "",
    avantBras: "",
    poitrine: "",
    ventre: "",
    hanches: "",
    fesses: "",
    cuisse: "",
    mollet: "",
  });

  // État pour les autres données corporelles
  const [corporelles, setCorporelles] = useState({
    tailleHauteur: "",
    poids: "",
    tauxMasseGrassePourcentage: "",
    tauxMasseGrasseKg: "",
    tauxMasseMusculairePourcentage: "",
    tauxMasseMusculaireKg: "",
    imc: "",
    fcRepos: "",
  });

  // État pour basculer entre le formulaire des données corporelles et celui des mensurations
  const [showCorporelles, setShowCorporelles] = useState(true);

  // État pour le bouton d'enregistrement global
  const [isGlobalSaveEnabled, setIsGlobalSaveEnabled] = useState(false);
  const [isSaveMensurationsEnabled, setIsSaveMensurationsEnabled] = useState(false);
  const [isSaveCorporellesEnabled, setIsSaveCorporellesEnabled] = useState(false);

  // Fonction pour gérer les changements dans le formulaire de mensurations
  const handleChangeMensurations = (e) => {
    setMensurations({ ...mensurations, [e.target.name]: e.target.value });
  };

  // Fonction pour gérer les changements dans le formulaire des données corporelles
  const handleChangeCorporelles = (e) => {
    setCorporelles({ ...corporelles, [e.target.name]: e.target.value });
  };

  // Fonction pour vérifier si tous les champs sont remplis
  const areAllFieldsFilled = (form) => {
    return Object.values(form).every((value) => value !== "");
  };

  // Effet pour activer/désactiver le bouton d'enregistrement global et les boutons individuels
  useEffect(() => {
    const isMensurationsComplete = areAllFieldsFilled(mensurations);
    const isCorporellesComplete = areAllFieldsFilled(corporelles);

    setIsGlobalSaveEnabled(isMensurationsComplete && isCorporellesComplete);
    setIsSaveMensurationsEnabled(isMensurationsComplete);
    setIsSaveCorporellesEnabled(isCorporellesComplete);
  }, [mensurations, corporelles]);

  // Fonction pour gérer l'enregistrement global des données
  const handleGlobalSave = () => {
    const globalData = {
      ...mensurations,
      ...corporelles,
    };
    console.log("Données enregistrées :", globalData);
    alert("Les deux formulaires ont été enregistrés !");
  };

  // Fonction de test pour remplir des données corporelles
  const handleTestCorporelles = () => {
    setCorporelles({
      tailleHauteur: "180",
      poids: "75",
      tauxMasseGrassePourcentage: "18",
      tauxMasseGrasseKg: "13.5",
      tauxMasseMusculairePourcentage: "42",
      tauxMasseMusculaireKg: "31.5",
      imc: "23.1",
      fcRepos: "65",
    });
  };

  // Fonction de test pour remplir des mensurations
  const handleTestMensurations = () => {
    setMensurations({
      cou: "40",
      epaules: "110",
      biceps: "35",
      avantBras: "30",
      poitrine: "100",
      ventre: "85",
      hanches: "95",
      fesses: "100",
      cuisse: "60",
      mollet: "40",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">ANALYSE DES DONNEES CORPORELLES</h1>

        {/* Boutons de test */}
        <div className="flex justify-between my-4">
          <button onClick={handleTestCorporelles} className="w-1/2 mr-2 bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-md">
            Test DC
          </button>
          <button onClick={handleTestMensurations} className="w-1/2 ml-2 bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-md">
            Test M
          </button>
        </div>

        {/* Switch pour basculer entre les formulaires */}
        <div className="flex justify-center items-center mb-6">
          <span className={`mr-2 text-lg font-semibold transition-all duration-300 ${showCorporelles ? "text-gray-900 font-bold" : "text-gray-400 font-light"}`}>Données corporelles</span>
          <Switch checked={!showCorporelles} onChange={() => setShowCorporelles(!showCorporelles)} inputProps={{ "aria-label": "toggle between corporelles and mensurations" }} />
          <span className={`ml-2 text-lg font-semibold transition-all duration-300 ${!showCorporelles ? "text-gray-900 font-bold" : "text-gray-400 font-light"}`}>Mensurations physiques</span>
        </div>

        {/* Affichage conditionnel basé sur l'état */}
        {showCorporelles ? <FormulaireCorporelles corporelles={corporelles} handleChangeCorporelles={handleChangeCorporelles} isSaveCorporellesEnabled={isSaveCorporellesEnabled} /> : <FormulaireMensurations mensurations={mensurations} handleChangeMensurations={handleChangeMensurations} isSaveMensurationsEnabled={isSaveMensurationsEnabled} />}

        {/* Bouton pour enregistrer les deux formulaires */}
        <button className={`w-full mt-6 p-4 rounded-md text-white ${isGlobalSaveEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`} disabled={!isGlobalSaveEnabled} onClick={handleGlobalSave}>
          Enregistrer tous les formulaires
        </button>
      </div>
    </div>
  );
};

export default FormulaireDonneesCorporelles;
