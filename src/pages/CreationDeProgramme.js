import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ClientsContext } from "../contexts/ClientsContext";
import { motion } from "framer-motion";
import { Dumbbell, Activity, ChevronDown, Calendar, Weight, Ruler, Target, Users, Clipboard, Zap, Heart, Clock } from "lucide-react";

const experienceLevels = [
  { value: "débutant", label: "Débutant" },
  { value: "intermédiaire", label: "Intermédiaire" },
  { value: "avancé", label: "Avancé" },
];

const availableEquipment = [
  { value: "haltères", label: "Haltères" },
  { value: "barre", label: "Barre" },
  { value: "machines", label: "Machines" },
  { value: "kettlebells", label: "Kettlebells" },
  { value: "corde à sauter", label: "Corde à sauter" },
  { value: "bandes de résistance", label: "Bandes de résistance" },
  { value: "trx", label: "TRX" },
  { value: "medecinball", label: "Medecin ball" },
];

const availableMethods = [
  { value: "pyramide", label: "Pyramide" },
  { value: "drop_set", label: "Drop Set" },
  { value: "low_rep", label: "Low Rep" },
  { value: "superset", label: "Superset" },
  { value: "triset", label: "Triset" },
  { value: "circuit", label: "Circuit" },
];

const injuryZones = [
  { value: "dos", label: "Dos" },
  { value: "genou", label: "Genou" },
  { value: "épaule", label: "Épaule" },
  { value: "poignet", label: "Poignet" },
  { value: "cheville", label: "Cheville" },
  { value: "autre", label: "Autre" },
];

const motivationOptions = [
  { value: "tres_motive", label: "Très motivé" },
  { value: "moyennement_motive", label: "Moyennement motivé" },
  { value: "besoin_aide", label: "J'ai besoin d'aide" },
];

const AutocompleteClientSelect = ({ onClientSelect }) => {
  const { clients } = useContext(ClientsContext);
  const [inputValue, setInputValue] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sorted = [...clients].sort((a, b) => {
      const lastNameComparison = a.nom.localeCompare(b.nom);
      if (lastNameComparison === 0) {
        return a.prenom.localeCompare(b.prenom);
      }
      return lastNameComparison;
    });
    setFilteredClients(sorted);
  }, [clients]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);

    const filtered = clients.filter((client) => client.nom.toLowerCase().startsWith(value.toLowerCase()) || client.prenom.toLowerCase().startsWith(value.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      const lastNameComparison = a.nom.localeCompare(b.nom);
      if (lastNameComparison === 0) {
        return a.prenom.localeCompare(b.prenom);
      }
      return lastNameComparison;
    });
    setFilteredClients(sorted);
  };

  const handleSelectClient = (client) => {
    setInputValue(`${client.nom} ${client.prenom}`);
    setIsOpen(false);
    onClientSelect(client);
  };

  return (
    <div className="relative">
      <input type="text" id="clientSearch" value={inputValue} onChange={handleInputChange} onFocus={() => setIsOpen(true)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="Rechercher un client..." />
      {isOpen && filteredClients.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
          {filteredClients.map((client) => (
            <li key={client.id} onClick={() => handleSelectClient(client)} className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white">
              {client.nom} {client.prenom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CreationDeProgramme = () => {
  const { clients } = useContext(ClientsContext);
  const [selectedClient, setSelectedClient] = useState(null);
  const [goal, setGoal] = useState("prise_de_masse");
  const [sessions, setSessions] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [methods, setMethods] = useState([]);
  const [workoutProgram, setWorkoutProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [programDuration, setProgramDuration] = useState(9);
  const [endDate, setEndDate] = useState("");
  const [includeCardio, setIncludeCardio] = useState(false);
  const [cardioDuration, setCardioDuration] = useState("15");
  const [hasInjury, setHasInjury] = useState(false);
  const [injuryAreas, setInjuryAreas] = useState([]);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasCompletedRehabilitation, setHasCompletedRehabilitation] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [paysAttentionAlimentation, setPaysAttentionAlimentation] = useState(false);
  const [souhaiteProgrammeAlimentaire, setSouhaiteProgrammeAlimentaire] = useState(false);
  const [otherInjuryDescription, setOtherInjuryDescription] = useState("");
  const [alimentAttentionDescription, setAlimentAttentionDescription] = useState("");
  const [hasHealthIssues, setHasHealthIssues] = useState(false);
  const [healthIssueDescription, setHealthIssueDescription] = useState("");
  const [taille, setTaille] = useState("");
  const [poids, setPoids] = useState("");
  const [kcalConseillees, setKcalConseillees] = useState("");
  const [kcalPourObjectif, setKcalPourObjectif] = useState("");
  const [kilosAPerdre, setKilosAPerdre] = useState("");
  const [kilosAPrendre, setKilosAPrendre] = useState(""); // Ajout de l'état pour kilos à prendre
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3); // Nouvel état pour le nombre de séances par semaine

  const [sexe, setSexe] = useState("");
  useEffect(() => {
    if (startDate) {
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + programDuration * 7);
      setEndDate(calculatedEndDate.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  }, [startDate, programDuration]);

  useEffect(() => {
    if (selectedClient && taille && poids) {
      const kcal = calculKcalJournaliere(selectedClient.sexe, taille, poids, calculerAge(selectedClient.naissance));
      setKcalConseillees(kcal);
    }
  }, [selectedClient, taille, poids]);

  useEffect(() => {
    if (goal && kcalConseillees) {
      let kcalObjectif;
      if (goal === "perte_de_poids" && kilosAPerdre) {
        kcalObjectif = calculKcalPourPertePoids(Number(kcalConseillees), Number(kilosAPerdre), programDuration);
      } else if (goal === "prise_de_masse" && kilosAPrendre) {
        kcalObjectif = calculKcalPourPriseMasse(Number(kcalConseillees), Number(kilosAPrendre), programDuration);
      } else {
        // Pour le maintien ou les objectifs non reconnus
        kcalObjectif = kcalConseillees;
      }
      setKcalPourObjectif(kcalObjectif);
    }
  }, [goal, kilosAPerdre, kilosAPrendre, kcalConseillees, programDuration]);

  const calculKcalPourPertePoids = (kcalBase, kilosAPerdre, semaines) => {
    const deficitJournalier = (kilosAPerdre * 7700) / (semaines * 7);
    return Math.round(kcalBase - deficitJournalier);
  };

  const calculKcalPourPriseMasse = (kcalBase, kilosAPrendre, semaines) => {
    const surplusJournalier = (kilosAPrendre * 7700) / (semaines * 7);
    return Math.round(kcalBase + surplusJournalier);
  };

  // Fonction pour gérer le changement de client
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c.id === parseInt(clientId));
    setSelectedClient(client);

    if (client) {
      setTaille(client.taille || "");
      setPoids(client.poids || "");
      setSexe(client.sexe || ""); // Mise à jour du sexe avec la valeur du client sélectionné
      console.log("Sexe du client sélectionné :", client.sexe); // Pour le débogage
    } else {
      setTaille("");
      setPoids("");
      setSexe("");
    }

    console.log("Client sélectionné :", client); // Pour le débogage
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    if (client) {
      setTaille(client.taille || "");
      setPoids(client.poids || "");
      setSexe(client.sexe || "");
      console.log("Client sélectionné :", client);
    } else {
      setTaille("");
      setPoids("");
      setSexe("");
    }
  };

  const calculerAge = (dateNaissance) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculKcalJournaliere = (sexe, taille, poids, age) => {
    const TMB = sexe === "homme" ? 10 * poids + 6.25 * taille - 5 * age + 5 : 10 * poids + 6.25 * taille - 5 * age - 161;
    return Math.round(TMB * 1.55); // Facteur d'activité modéré
  };

  const handleEquipmentChange = (e) => {
    const value = e.target.value;
    setEquipment((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleMethodsChange = (e) => {
    const value = e.target.value;
    setMethods((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleInjuryChange = (e) => {
    const value = e.target.value;
    setInjuryAreas((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const workoutRequest = {
      clientName: selectedClient
        ? `${selectedClient.prenom} 
      `
        : "",
      age: selectedClient ? calculerAge(selectedClient.naissance) : "Non renseigné",
      sexe: selectedClient ? selectedClient.sexe : "Non indiqué",
      goal,
      sessions,
      experienceLevel,
      equipment,
      methods,
      clientDetails: selectedClient,
      creationDate: new Date().toLocaleDateString(),
      startDate,
      endDate,
      includeCardio,
      cardioDuration,
      hasInjury,
      injuryAreas,
      hasChildren,
      hasCompletedRehabilitation,
      motivation,
      paysAttentionAlimentation,
      souhaiteProgrammeAlimentaire,
      otherInjuryDescription,
      hasHealthIssues,
      healthIssueDescription,
      taille,
      poids,
      kcalConseillees,
      kcalPourObjectif,
      kilosAPerdre: goal === "perte_de_poids" ? kilosAPerdre : undefined,
      sessionsPerWeek,
    };

    console.log("Données du programme :", workoutRequest);

    const prompt = `
    PROMPT POUR CONCEPTION D'UN PROGRAMME D'ENTRAÎNEMENT PERSONNALISÉ réalisé par un coach sportif tres experimenté privé qui crée des programmes individualisés et uniques pour sa clientèle.

    Client : ${workoutRequest.clientName}
    Âge du client : ${workoutRequest.age}
    Sexe du client : ${workoutRequest.sexe}
    
    Poids du client : ${workoutRequest.poids} kg
    Taille du client : ${workoutRequest.taille} cm

    Kcal conseillées par jour pour être en forme : ${workoutRequest.kcalConseillees}

    Objectif du client : ${workoutRequest.goal}

    ${workoutRequest.goal === "perte_de_poids" ? `Kilos à perdre : ${workoutRequest.kilosAPerdre}` : ""}
    Nombre de kcal à consommer par jour : ${workoutRequest.kcalPourObjectif}

    Nombre de séances par semaine souhaitées : ${workoutRequest.sessionsPerWeek}
    Durée du programme (semaines) : ${workoutRequest.programDuration}
    
    Niveau d'expérience sportif : ${workoutRequest.experienceLevel || "Non renseigné"}
    
    Équipement disponible : ${workoutRequest.equipment.length > 0 ? workoutRequest.equipment.join(", ") : "Aucun"}
    Méthodes d'exercice intégrées : ${workoutRequest.methods.length > 0 ? workoutRequest.methods.join(", ") : "Aucune"}
    
    Date de création du programme : ${workoutRequest.creationDate}
    Date de commencement du programme : ${workoutRequest.startDate || "Non renseignée"}
    Date de fin du programme : ${workoutRequest.endDate || "Non renseignée"}
    
    Inclure du cardio : ${workoutRequest.includeCardio ? `Oui, durée : ${workoutRequest.cardioDuration} minutes` : "Non"}
    
    Problèmes de santé : ${workoutRequest.hasHealthIssues ? `Oui, description : ${workoutRequest.healthIssueDescription || "Non spécifiée"}` : "Non"}
    
    Blessures : ${workoutRequest.hasInjury ? `Oui, zones touchées : ${workoutRequest.injuryAreas.length > 0 ? workoutRequest.injuryAreas.join(", ") : "Non spécifiées"}${workoutRequest.otherInjuryDescription ? ` (Autre : ${workoutRequest.otherInjuryDescription})` : ""}` : "Non"}
    
    Avez-vous des enfants : ${workoutRequest.hasChildren ? "Oui" : "Non"}
    
    Réhabilitation du périnée : ${workoutRequest.hasCompletedRehabilitation ? "Oui" : "Non"}
    
    Motivation : ${workoutRequest.motivation || "Non renseignée"}
    
    Faites-vous attention à votre alimentation : ${workoutRequest.paysAttentionAlimentation ? "Oui" : "Non"}
    Souhaite un programme alimentaire détaillé : ${workoutRequest.souhaiteProgrammeAlimentaire ? "Oui" : "Non"}
    
    Détails supplémentaires sur l'alimentation : ${workoutRequest.paysAttentionAlimentation ? workoutRequest.alimentAttentionDescription || "Non spécifié" : "N/A"}

    J'aimerais qu'avec toutes ces informations, tu me fasses un programme d'entraînement bien structuré. 
    Reprends mes informations dans un tableau section par section. 
    Explique ce que tu vas mettre en place pour répondre à ma demande, en tenant compte des problèmes de santé et des blessures.
    
    Si des problèmes de santé ou des blessures sont mentionnés, propose des exercices adaptés. Par exemple, si une entorse à la cheville est signalée, inclue des exercices d'équilibre ou des mouvements que des kinés auraient recommandés. 
    De même, adapte le programme pour éviter d'aggraver d'autres blessures ou de causer des douleurs dues à des exercices inappropriés.
    
    Ensuite, propose le programme sous forme de plusieurs tableaux. 
    À chaque semaine son tableau, jour par jour, avec :
    - Le thème de la séance
    - L'exercice (minimum 5 exercices par seance)
    - Le nombre de séries (entre 3 et 7)
    - Le nombre de répétitions (depend de l'objectif du programme et de l'intensité de l'exercie voir tablea de berger)
    - L'intensité (% de travail)
    - Le temps de repos par série
    - La méthode de travail, s'il y a une méthode appliquée

    Espace les tableaux des semaines entre eux. 
    Je ne veux pas des séances identiques chaque jour ou chaque semaine, je veux de la variété. 
    Pour la perte de poids, la remise en forme ou la musculation, assure-toi que chaque séance soit améliorée par rapport à la semaine précédente. 
    Chaque semaine doit montrer une évolution sur les mêmes exercices, uniquement pour les programmes de prise de masse.
  `;

    console.log("Prompt pour ChatGPT :", prompt);

    try {
      //Le prompt devrait etre envoyé ici ! et retourné un fichier en json pour etre adapté dans le programme
      const response = await axios.post("YOUR_API_URL", workoutRequest);
      setWorkoutProgram(response.data);
    } catch (error) {
      setError("Erreur lors de la création du programme.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      {/* ENTETE DE PAGE DYNAMIQUE */}
      <div className="bg-white p-1 md:p-4 rounded-md shadow-md mb-4 md:mb-8">
        <motion.h1 className="text-4xl sm:text-5xl font-bold text-center my-4 text-gray-800 uppercase" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {" "}
          Création de programme{" "}
        </motion.h1>
      </div>
      <motion.form onSubmit={handleSubmit} className="bg-white  border-gray-200  rounded-lg border  shadow-lg backdrop-blur-md p-8 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        {/* Sélection du client */}
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="clientSelect">
            <Users className="inline-block mr-2" /> Rechercher un client
          </label>
          <AutocompleteClientSelect onClientSelect={handleClientSelect} />
        </div>

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="sexe">
              <Users className="inline-block mr-2" /> Sexe
            </label>
            <select id="sexe" value={sexe} onChange={(e) => setSexe(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
              <option value="" disabled>
                Sélectionnez le sexe
              </option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2">
              <Ruler className="inline-block mr-2" /> Taille (cm)
            </label>
            <input type="number" value={taille} onChange={(e) => setTaille(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
          </div>
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2">
              <Weight className="inline-block mr-2" /> Poids (kg)
            </label>
            <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
          </div>
        </div>

        {/* Objectif et kcal */}
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-bold mb-2">
            <Target className="inline-block mr-2" /> Objectif
          </label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
            <option value="prise_de_masse">Prise de masse</option>
            <option value="perte_de_poids">Perte de poids</option>
            <option value="renforcement">Renforcement</option>
          </select>
        </div>

        {goal === "perte_de_poids" && (
          <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <label className="block text-gray-800 text-sm font-bold mb-2">
              <Weight className="inline-block mr-2" /> Kilos à perdre
            </label>
            <input type="number" value={kilosAPerdre} onChange={(e) => setKilosAPerdre(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
          </motion.div>
        )}

        {goal === "prise_de_masse" && (
          <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <label className="block text-gray-800 text-sm font-bold mb-2">
              <Weight className="inline-block mr-2" /> Kilos à prendre
            </label>
            <input type="number" value={kilosAPrendre} onChange={(e) => setKilosAPrendre(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
          </motion.div>
        )}

        {/* Kcal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2">
              <Activity className="inline-block mr-2" /> Kcal conseillées / jour
            </label>
            <input type="number" value={kcalConseillees} readOnly className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-300" />
          </div>
          {goal !== "renforcement" && (
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2">
                <Zap className="inline-block mr-2" /> Kcal pour l'objectif
              </label>
              <input type="number" value={kcalPourObjectif} readOnly className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-300" />
            </div>
          )}
        </div>

        {/* Programme details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="sessionsPerWeek">
              <Calendar className="inline-block mr-2" /> Séances par semaine
            </label>
            <select id="sessionsPerWeek" value={sessionsPerWeek} onChange={(e) => setSessionsPerWeek(parseInt(e.target.value))} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
              {[2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} séances
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="programDuration">
              <Clock className="inline-block mr-2" /> Durée (semaines)
            </label>
            <input type="number" id="programDuration" value={programDuration} onChange={(e) => setProgramDuration(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
          </div>
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="startDate">
              <Calendar className="inline-block mr-2" /> Date de début
            </label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
          </div>
        </div>

        {/* Niveau d'expérience */}
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-bold mb-2">
            <Dumbbell className="inline-block mr-2" /> Niveau d'expérience
          </label>
          <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
            <option value="">Sélectionnez votre niveau</option>
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Équipement et Méthodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2">
              <Dumbbell className="inline-block mr-2" /> Équipement disponible
            </label>
            <div className="space-y-2">
              {availableEquipment.map((equipmentOption) => (
                <div key={equipmentOption.value} className="flex items-center">
                  <input type="checkbox" id={`equipment-${equipmentOption.value}`} value={equipmentOption.value} checked={equipment.includes(equipmentOption.value)} onChange={handleEquipmentChange} className="mr-2 form-checkbox h-5 w-5 text-blue-600" />
                  <label htmlFor={`equipment-${equipmentOption.value}`} className="text-sm text-gray-800">
                    {equipmentOption.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              <Activity className="inline-block mr-2" /> Méthodes d'exercice
            </label>
            <div className="space-y-2">
              {availableMethods.map((method) => (
                <div key={method.value} className="flex items-center">
                  <input type="checkbox" id={`method-${method.value}`} value={method.value} checked={methods.includes(method.value)} onChange={handleMethodsChange} className="mr-2 form-checkbox h-5 w-5 text-green-600" />
                  <label htmlFor={`method-${method.value}`} className="text-sm text-gray-800">
                    {method.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cardio */}
        <div className="mb-6">
          <label className="flex items-center text-gray-800 text-sm font-bold mb-2">
            <Heart className="inline-block mr-2" /> Inclure du cardio
            <input type="checkbox" checked={includeCardio} onChange={(e) => setIncludeCardio(e.target.checked)} className="ml-2 form-checkbox h-5 w-5 text-pink-600" />
          </label>
          {includeCardio && (
            <motion.div className="mt-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="cardioDuration">
                Durée du cardio (minutes)
              </label>
              <input type="number" id="cardioDuration" value={cardioDuration} onChange={(e) => setCardioDuration(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" />
            </motion.div>
          )}
        </div>

        {/* Santé et blessures */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
          <div>
            <label className="flex items-center text-gray-800 text-sm font-bold mb-2">
              <Heart className="inline-block mr-2" /> Problèmes de santé
              <input type="checkbox" checked={hasHealthIssues} onChange={(e) => setHasHealthIssues(e.target.checked)} className="ml-2 form-checkbox h-5 w-5 text-red-600" />
            </label>
            {hasHealthIssues && (
              <motion.div className="mt-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <input type="text" id="healthIssueDescription" value={healthIssueDescription} onChange={(e) => setHealthIssueDescription(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" placeholder="Décrivez vos problèmes de santé" />
              </motion.div>
            )}
          </div>
          <div>
            <label className="flex items-center text-gray-800 text-sm font-bold mb-2">
              <Activity className="inline-block mr-2" /> Blessures
              <input type="checkbox" checked={hasInjury} onChange={(e) => setHasInjury(e.target.checked)} className="ml-2 form-checkbox h-5 w-5 text-yellow-600" />
            </label>
            {hasInjury && (
              <motion.div className="mt-2 space-y-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {injuryZones.map((zone) => (
                  <div key={zone.value} className="flex items-center">
                    <input type="checkbox" id={`injury-${zone.value}`} value={zone.value} checked={injuryAreas.includes(zone.value)} onChange={handleInjuryChange} className="mr-2 form-checkbox h-5 w-5 text-yellow-600" />
                    <label htmlFor={`injury-${zone.value}`} className="text-sm text-gray-800">
                      {zone.label}
                    </label>
                  </div>
                ))}
                {injuryAreas.includes("autre") && <input type="text" id="otherInjuryDescription" value={otherInjuryDescription} onChange={(e) => setOtherInjuryDescription(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" placeholder="Décrivez votre blessure" />}
              </motion.div>
            )}
          </div>
        </div>

        {/* Enfants et réhabilitation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="flex items-center text-gray-800 text-sm font-bold mb-2">
              <Users className="inline-block mr-2" /> Avez-vous des enfants ?
              <input type="checkbox" checked={hasChildren} onChange={(e) => setHasChildren(e.target.checked)} className="ml-2 form-checkbox h-5 w-5 text-purple-600" />
            </label>
          </div>
          {hasChildren && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <label className="flex items-center text-gray-800 text-sm font-bold mb-2">
                <Activity className="inline-block mr-2" /> Réhabilitation du périnée complétée ?
                <input type="checkbox" checked={hasCompletedRehabilitation} onChange={(e) => setHasCompletedRehabilitation(e.target.checked)} className="ml-2 form-checkbox h-5 w-5 text-green-600" />
              </label>
            </motion.div>
          )}
        </div>

        {/* Alimentation */}
        <div className="mb-6">
          <label className="flex items-center text-gray-800 text-sm font-bold mb-2">
            <Clipboard className="inline-block mr-2" /> Attention à l'alimentation ?
            <input type="checkbox" checked={paysAttentionAlimentation} onChange={(e) => setPaysAttentionAlimentation(e.target.checked)} className="ml-2 form-checkbox h-5 w-5 text-blue-600" />
          </label>
          {paysAttentionAlimentation && (
            <motion.div className="mt-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <input type="text" value={alimentAttentionDescription} onChange={(e) => setAlimentAttentionDescription(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white" placeholder="Décrivez vos habitudes alimentaires" />
            </motion.div>
          )}
        </div>

        {/* Motivation */}
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-bold mb-2">
            <Zap className="inline-block mr-2" /> Niveau de motivation
          </label>
          <select value={motivation} onChange={(e) => setMotivation(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
            <option value="">Sélectionnez votre niveau de motivation</option>
            {motivationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton de soumission */}
        <motion.button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:from-blue-600 hover:to-green-600 transition duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Clipboard className="inline-block mr-2" /> Créer le programme
        </motion.button>
      </motion.form>
    </>
  );
};

export default CreationDeProgramme;
