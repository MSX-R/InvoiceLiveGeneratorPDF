import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ClientsContext } from "../contexts/ClientsContext";

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
      <input type="text" value={inputValue} onChange={handleInputChange} onFocus={() => setIsOpen(true)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Rechercher un client..." />
      {isOpen && filteredClients.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
          {filteredClients.map((client) => (
            <li key={client.id} onClick={() => handleSelectClient(client)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
      clientName: selectedClient ? `${selectedClient.prenom} ${selectedClient.nom}` : "",
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
    };

    console.log("Données du programme :", workoutRequest);

    const prompt = `
    PROMPT POUR CONCEPTION D'UN PROGRAMME D'ENTRAÎNEMENT PERSONNALISÉ réalisé par un coach sportif privé qui crée des programmes individualisés et uniques à sa clientèle.

    Client : ${workoutRequest.clientName}
    Âge du client : ${workoutRequest.age}
    Sexe du client : ${workoutRequest.sexe}
    
    Poids du client : ${workoutRequest.poids} kg
    Taille du client : ${workoutRequest.taille} cm

    Kcal conseillées par jour pour être en forme : ${workoutRequest.kcalConseillees}

    Objectif du client : ${workoutRequest.goal}

    ${workoutRequest.goal === "perte_de_poids" ? `Kilos à perdre : ${workoutRequest.kilosAPerdre}` : ""}
    Nombre de kcal à consommer par jour : ${workoutRequest.kcalPourObjectif}

    Nombre de séances par semaine souhaitées : ${workoutRequest.sessions}
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
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Création de Programme d'Entraînement</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSelect">
            Sélectionner un client :
          </label>
          <AutocompleteClientSelect onClientSelect={handleClientSelect} />
        </div>

        {/* Sexe Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sexe">
            Sexe :
          </label>
          <select
            id="sexe"
            value={sexe} // L'état sexe est lié au select
            onChange={(e) => setSexe(e.target.value)} // Mettez à jour l'état sexe en cas de changement
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              Sélectionnez le sexe
            </option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Taille (cm) :</label>
            <input type="number" value={taille} onChange={(e) => setTaille(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Poids (kg) :</label>
            <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Objectif :</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="prise_de_masse">Prise de masse</option>
            <option value="perte_de_poids">Perte de poids</option>
            <option value="renforcement">Renforcement</option>
          </select>
        </div>

        {goal === "perte_de_poids" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Kilos à perdre (en {programDuration ? programDuration : "XX"} semaines) :</label>
            <input type="number" value={kilosAPerdre} onChange={(e) => setKilosAPerdre(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        )}

        {goal === "prise_de_masse" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Kilos à prendre :</label>
            <input type="number" value={kilosAPrendre} onChange={(e) => setKilosAPrendre(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        )}

        <div className={`grid grid-cols-${goal !== "renforcement" ? "2" : "1"} gap-4 mb-4`}>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Kcal conseillées / jour :</label>
            <input type="number" value={kcalConseillees} readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight bg-gray-100" />
          </div>
          {/* Affichage conditionnel pour Kcal pour l'objectif */}
          {goal !== "renforcement" && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Kcal pour l'objectif :</label>
              <input type="number" value={kcalPourObjectif} readOnly className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight bg-gray-100" />
            </div>
          )}
        </div>

        {/* Durée du programme */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="programDuration">
            Durée du programme (semaines) :
          </label>
          <input type="number" id="programDuration" value={programDuration} onChange={(e) => setProgramDuration(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700" />
        </div>

        {/* Date de commencement */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
            Date de commencement :
          </label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700" />
        </div>

        {/* Date de fin estimée */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date de fin estimée :</label>
          <input
            type="date"
            value={endDate} // Utilisez l'état pour obtenir la date de fin
            readOnly // Rend l'input non modifiable
            className="border rounded w-full py-2 px-3 text-gray-400 bg-gray-200" // Couleur gris pour indiquer que c'est non modifiable
          />
        </div>

        {/* Niveau d'expérience */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Niveau d'expérience :</label>
          <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700">
            <option value="">Sélectionnez votre niveau</option>
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Équipement */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Équipement disponible :</label>
          {availableEquipment.map((equipmentOption) => (
            <div key={equipmentOption.value}>
              <input type="checkbox" value={equipmentOption.value} checked={equipment.includes(equipmentOption.value)} onChange={handleEquipmentChange} className="mr-2 leading-tight" />
              <span className="text-sm">{equipmentOption.label}</span>
            </div>
          ))}
        </div>

        {/* Méthodes d'exercice */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Méthodes d'exercice :</label>
          {availableMethods.map((method) => (
            <div key={method.value}>
              <input type="checkbox" value={method.value} checked={methods.includes(method.value)} onChange={handleMethodsChange} className="mr-2 leading-tight" />
              <span className="text-sm">{method.label}</span>
            </div>
          ))}
        </div>

        {/* Cardio */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Inclure du cardio en fin de séance :</label>
          <input type="checkbox" checked={includeCardio} onChange={(e) => setIncludeCardio(e.target.checked)} className="mr-2 leading-tight" />
          <span className="text-sm">Oui</span>
          {includeCardio && (
            <div className="mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardioDuration">
                Durée du cardio (minutes) :
              </label>
              <input type="number" id="cardioDuration" value={cardioDuration} onChange={(e) => setCardioDuration(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700" />
            </div>
          )}
        </div>

        {/* Santé */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Avez-vous des problèmes de santé ?</label>
          <input type="checkbox" checked={hasHealthIssues} onChange={(e) => setHasHealthIssues(e.target.checked)} className="mr-2 leading-tight" />
          <span className="text-sm">Oui</span>
          {hasHealthIssues && (
            <div className="mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Spécifiez :</label>
              <input type="text" id="healthIssueDescription" value={healthIssueDescription} onChange={(e) => setHealthIssueDescription(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700" placeholder="Zone texte" />
            </div>
          )}
        </div>

        {/* Blessures */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Avez-vous des blessures ?</label>
          <input type="checkbox" checked={hasInjury} onChange={(e) => setHasInjury(e.target.checked)} className="mr-2 leading-tight" />
          <span className="text-sm">Oui</span>
          {hasInjury && (
            <div className="mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Zones touchées :</label>
              {injuryZones.map((zone) => (
                <div key={zone.value}>
                  <input type="checkbox" value={zone.value} checked={injuryAreas.includes(zone.value)} onChange={handleInjuryChange} className="mr-2 leading-tight" />
                  <span className="text-sm">{zone.label}</span>
                </div>
              ))}
              {injuryAreas.includes("autre") && (
                <div className="mt-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherInjuryDescription">
                    Autre blessure :
                  </label>
                  <input type="text" id="otherInjuryDescription" value={otherInjuryDescription} onChange={(e) => setOtherInjuryDescription(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enfants */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Avez-vous des enfants ?</label>
          <input type="checkbox" checked={hasChildren} onChange={(e) => setHasChildren(e.target.checked)} className="mr-2 leading-tight" />
          <span className="text-sm">Oui</span>
        </div>

        {/* Réhabilitation */}
        {hasChildren && ( // Vérifiez si l'utilisateur a des enfants
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Avez-vous complété la réhabilitation du périnée ?</label>
            <input type="checkbox" checked={hasCompletedRehabilitation} onChange={(e) => setHasCompletedRehabilitation(e.target.checked)} className="mr-2 leading-tight" />
            <span className="text-sm">Oui</span>
          </div>
        )}

        {/* Alimentation */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Faites-vous attention à votre alimentation ?</label>
          <input type="checkbox" checked={paysAttentionAlimentation} onChange={(e) => setPaysAttentionAlimentation(e.target.checked)} className="mr-2 leading-tight" />
          <span className="text-sm">Oui</span>
          {paysAttentionAlimentation && (
            <div className="mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Comment ?</label>
              <input type="text" value={alimentAttentionDescription} onChange={(e) => setAlimentAttentionDescription(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700" />
            </div>
          )}
        </div>

        {/* Motivation */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Motivation :</label>
          <select value={motivation} onChange={(e) => setMotivation(e.target.value)} className="border rounded w-full py-2 px-3 text-gray-700">
            <option value="">Sélectionnez votre motivation</option>
            {motivationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Soumission du formulaire */}
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreationDeProgramme;
