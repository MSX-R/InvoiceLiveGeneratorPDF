import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { ClientsContext } from "../contexts/ClientsContext";
import { useAuth } from "../contexts/AuthContext";

// Composant InputField
const InputField = ({ label, name, type = "text", value, onChange, required, error, placeholder }) => (
  <label className="block space-y-2">
    <span className="text-gray-700">
      {label} {required && "*"}
    </span>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-blue-500 focus:ring-blue-500  p-4
        ${error ? "border-red-500" : ""}`}
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </label>
);

// Composant Alert
const Alert = ({ children, variant = "default" }) => {
  const bgColor = variant === "destructive" ? "bg-red-50" : "bg-blue-50";
  const textColor = variant === "destructive" ? "text-red-700" : "text-blue-700";
  const borderColor = variant === "destructive" ? "border-red-400" : "border-blue-400";

  return <div className={`${bgColor} ${textColor} p-4 rounded-lg border ${borderColor} flex items-center gap-2`}>{children}</div>;
};

// Composant AlertDescription
const AlertDescription = ({ children }) => {
  return <div className="ml-2">{children}</div>;
};
const RadioGroup = ({ label, name, options, value, onChange, required, error, inline = false }) => (
  <div className="space-y-2">
    <span className="text-gray-700 font-semibold">
      {label} {required && "*"}
    </span>
    <div className={`${inline ? "space-x-4" : "space-y-2"}`}>
      {options.map((option) => (
        <label key={option} className={`${inline ? "inline-flex" : "flex"} items-center`}>
          <input type="radio" name={name} value={option} checked={value === option} onChange={onChange} required={required} className="text-blue-600" />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const QuestionnaireEntretien = () => {
  const { clients } = useContext(ClientsContext); // Charger les clients depuis le contexte
  const { userRole, loggedUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorFields, setErrorFields] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Configuration des étapes
  const steps = [
    { id: "infos-base", title: "Base 1/2", required: true },
    { id: "infos-complementaires", title: "Base 2/2", required: true },
    { id: "prise-contact", title: "Contact", required: true },
    { id: "vie-pro", title: "Vie Pro", required: true },
    { id: "sante", title: "Santé", required: true },
    { id: "douleur", title: "Douleurs", required: false },
    { id: "hygiene", title: "Hygiène", required: true },
    { id: "sport", title: "Sport", required: true },
    { id: "coaching", title: "Coaching", required: true },
    { id: "disponibilites", title: "Dispos", required: true },
    { id: "urgence", title: "Contact", required: true },
  ];

  // Constantes globales
  const villes = ["Antibes", "Biot", "Cagnes-sur-Mer", "Cannes", "Cannes-la-Bocca", "Juan-les-Pins", "Le Cannet", "Monaco", "Mougins", "Nice", "Saint-Laurent du Var", "Valbonne Sophia-Antipolis", "Vallauris - Golfe Juan", "VIlleneuve-Loubet"];
  const villesTravail = ["Je travaille depuis mon domicile", "Je travaille en déplacement", ...villes];

  const objectifs = ["Intégrer une activité physique à mon quotidien", "Evacuer le stress et reprendre confiance en moi", "Retrouver la forme", "Perte de poids (quelques petits kilos en trop)", "Renforcement musculaire"];

  const sources = ['Rencontre physique au club de Fitness Park "Antibes Olympie"', "Appel commercial du coach", "Via l'application Fitness Park", "Via l'application/site TrainMe", "On m'a parlé de toi : Membre du staff", "On m'a parlé de toi : Un adhérent du club", "On m'a parlé de toi : Un ami", "Par une recherche internet : Google", "Par les réseaux sociaux : Instagram", "Par les réseaux sociaux : Facebook", "Par un support de com' : Flyer / Affiche", "Par un support de com' : Carte Profesionnelle", "Par un organisme : Mon CE", "Par un annuaire de coach sur internet", "On se connait personnellement"];

  const statuts = ["as une profession", "es étudiant(e)", "es retraité", "es sans emploi"];

  const sensations = ["Très bien | Plein(e) d'énergie !", "Ca va, je suis encore en forme !", "Fatigué(e) !"];

  const etatsFormes = ["En forme olympique !", "Je me sens bien.", "Je me sens peu en forme.", "Je ne me sens pas bien."];

  const zonesOs = ["COLONNE VERTEBRALE", "EPAULE", "COUDE", "POIGNET", "BASSIN", "GENOU", "CHEVILLE"];

  const zonesMuscles = ["Cervicales", "Trapèze", "Epaule", "Bras : Biceps", "Bras : Triceps", "Avant Bras", "Main", "Poitrine", "Dos", "Abdominaux", "Obliques", "Lombaires", "Fessiers", "Quadriceps", "Ischios jambiers", "Mollets", "Pied"];

  const heuresSommeil = ["5h", "6h", "7h", "8h", "9h", "10h et +"];

  const sensationsReveil = ["Très bien reposé(e)", "Plutôt en forme", "Un peu fatigué(e)", "Très fatigué(e)"];

  const complementsAlimentaires = ["Vitamines", "Protèine en poudre", "Créatine", "BCAA (acides aminés)", "Bruleur de graisse", "Glutamine", "ZMA", "Collagène", "Zinc, Magnésium, Fer etc..", "Autres"];

  const sports = [
    "Cardio | Athlétisme : Course à pied (sprint, marathon), Saut (hauteur, longueur, triple saut), Lancer (javelot, poids, disque, marteau), Décathlon/Heptathlon",
    "Cardio | Exercices en salle : tapis de course, elliptique, rameur, escalier motorisé, vélos ",
    "Sports mécaniques : Course auto, Moto, Karting, Rallye, Formule 1, Motocross, Speedway",
    "Danse : Danse classique, Hip-Hop, Jazz, Danse contemporaine, Salsa, Danse de salon, Danse africaine",
    "Equitation : Saut d’obstacles, Dressage, Endurance, Voltige, Polo, Courses hippiques",
    "Gymnastique : Gymnastique artistique, Gymnastique rythmique, Trampoline, Acrobatie, Parkour",
    "Musculation et Fitness : Haltérophilie, Powerlifting, Crossfit, Bodybuilding, Fitness en salle",
    "Sports collectifs : Football, Handball, Rugby (à XV, à VII), Basketball, Volleyball, Football américain, Water-polo",
    "Sports d’eau : Natation, Apnée, Pêche sportive, Voile, Canoë-kayak, Surf, Paddle, Kitesurf, Wakeboard",
    "Sports de glisse : Ski alpin, Snowboard, Snowscoot, Ski de fond, Biathlon, Patinage artistique, Patinage de vitesse, Hockey sur glace",
    "Sports de combat : Boxe anglaise, Boxe thaïlandaise, Kickboxing, Judo, Karaté, Taekwondo, Aïkido, Jiu-jitsu brésilien, Lutte, MMA",
    "Sports de raquette : Tennis, Hockey sur gazon, Lacrosse, Baseball, Golf, Paddle, Squash, Badminton, Tennis de table",
    "Sports de précision : Tir à l’arc, Tir sportif, Fléchettes, Pétanque, Billard, Bowling",
    "Sports de plein air : Randonnée, Escalade, Alpinisme, Parapente, Spéléologie, Course d’orientation",
    "Sports extrêmes : Skateboard, BMX, Parkour, Wingsuit, Base jump, Parachutisme, Slackline, Highline",
    "Sports de bien-être : Yoga, Pilates, Tai Chi, Qi Gong, Méditation en mouvement",
    "Sports équestres : Polo, Reining, Barrel racing, Cutting, Rodéo",
    "Jeux d’équipe sans balle : Ultimate frisbee, Dodgeball, Capture the flag",
    "Jeux et activités traditionnelles : Kubb, Pétanque, Molkky, Boules lyonnaises, Jeux d’adresse",
    "Aucun sport : Je n’ai jamais fait de sport.",
  ];

  const frequences = ["1 fois", "2 fois", "3 fois", "4 fois", "5 fois", "+ de 5 fois", "Jamais"];

  const durees = ["moins de 60 min", "1 h", "1 h 30", "2 h", "+ de 2 h"];

  const joursDisponibilites = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];

  const creneauxDisponibilites = ["aucune dispo", "08h00-09h30", "09h30-11h00", "11h00-12h30", "13h00-14h30", "14h30-16h00", "16h00-17h30", "17h30-19h00"];

  // Gestionnaires d'événements
  useEffect(() => {
    if (selectedClientId) {
      // Remplir automatiquement les informations si un client existant est sélectionné
      const selectedClient = clients.find((client) => client.id === selectedClientId);
      if (selectedClient) {
        setFormData((prev) => ({
          ...prev,
          nom: selectedClient.nom,
          prenom: selectedClient.prenom,
          email: selectedClient.email,
          telephone: selectedClient.telephone,
        }));
      }
    } else {
      // Réinitialiser les champs si aucune sélection
      setFormData((prev) => ({
        ...prev,
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
      }));
    }
  }, [selectedClientId, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setShowError(false);
  };

  const handleUpdateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setShowError(false);
  };

  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData.required) return true;

    const missingFields = [];
    switch (currentStepData.id) {
      case "infos-base":
        ["nom", "prenom", "email", "telephone"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        break;

      case "infos-complementaires":
        ["age", "sexe", "ville"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        if (formData.ville === "autre" && !formData.autreVille) {
          missingFields.push("autreVille");
        }
        break;

      case "prise-contact":
        ["objectif", "source"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        break;

      case "vie-pro":
        ["statutPro"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        if (formData.statutPro === "as une profession") {
          ["secteurMetier", "heuresTravail", "sensationFinJournee"].forEach((field) => {
            if (!formData[field]) missingFields.push(field);
          });
        }
        break;

      case "sante":
        ["etatForme", "problemeSante"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        if (formData.problemeSante !== "Non") {
          if (!formData.descriptionProblemeSante) {
            missingFields.push("descriptionProblemeSante");
          }
        }
        break;

      case "hygiene":
        ["heuresSommeil", "sensationReveil", "attentionAlimentation"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        break;

      case "sport":
        ["faitDuSport"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        if (formData.faitDuSport === "Oui") {
          ["frequenceSport", "dureeSport"].forEach((field) => {
            if (!formData[field]) missingFields.push(field);
          });
        }
        break;

      case "coaching":
        ["dejaEuCoach"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        if (formData.dejaEuCoach === "Oui") {
          if (!formData.objectifPrecedent) {
            missingFields.push("objectifPrecedent");
          }
        }
        break;

      case "disponibilites":
        let hasAtLeastOneDisponibilite = false;
        const disponibilites = formData.disponibilites || {};
        Object.keys(disponibilites).forEach((key) => {
          if (disponibilites[key] && !key.includes("aucune dispo")) {
            hasAtLeastOneDisponibilite = true;
          }
        });
        if (!hasAtLeastOneDisponibilite) {
          missingFields.push("disponibilites");
        }
        break;

      case "urgence":
        ["contactUrgenceNom", "contactUrgencePrenom", "contactUrgenceTelephone"].forEach((field) => {
          if (!formData[field]) missingFields.push(field);
        });
        break;

      default:
        break;
    }

    setErrorFields(missingFields);
    return missingFields.length === 0;
  };

  const handleClientSelect = (e) => {
    const selectedId = e.target.value;
    // if (loggedUser.role_nom === "Administrateur") {
    setSelectedClientId(selectedId ? parseInt(selectedId) : null);
    // } else {
    //   setSelectedClientId(loggedUser.id ? parseInt(loggedUser.id) : null);
    // }

    // Si je suis admin et que je fais le process de choix dans les clients = setSelectedClientID
    //! Sinon, si je suis le user connécté et que je ne suis pas admin, je peux transferer mes infos perso direct
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowError(false);
      } else {
        handleSubmit();
      }
    } else {
      setShowError(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowError(false);
    }
  };

  const handleSubmit = async () => {
    console.log("Formulaire soumis:", formData);
    try {
      // Logique d'envoi à implémenter
      alert("Formulaire envoyé avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Une erreur est survenue lors de l'envoi du formulaire.");
    }
  };

  // Rendu du contenu de chaque étape
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // FIXME : LOIC : INFO TRANSMISE AUTOMATIQUEMENT CAR LE PROFIL DE LUSER EST DEJA SUR LE SITE pas besoin des infos de bas een saisie */}
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Informations de Base</h2>

            {/* Option A : Sélectionner un client existant //! ROMAIN :  VISIBLE SEULEMENT PAR LE ROLE ADMIN*/}
            <div className="space-y-2">
              <label htmlFor="client-select" className="text-gray-700">
                Sélectionner un client existant
              </label>
              <select id="client-select" value={selectedClientId || ""} onChange={handleClientSelect} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4">
                <option value="">-- Aucun client sélectionné --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </option>
                ))}
              </select>
            </div>

            {/* Option B : Saisie manuelle pour un nouveau client //! LOIC : INFO TRANSMISE AUTOMATIQUEMENT CAR LE PROFIL DE LUSER EST DEJA SUR LE SITE pas besoin des infos de bas een saisie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nom" name="nom" value={formData.nom} onChange={handleChange} required error={errorFields.includes("nom") && "Ce champ est requis"} />
              <InputField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required error={errorFields.includes("prenom") && "Ce champ est requis"} />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required error={errorFields.includes("email") && "Email invalide"} />
              <InputField label="Téléphone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} required error={errorFields.includes("telephone") && "Ce champ est requis"} />
            </div>
          </div>
        );

      case 1: // Infos Complémentaires
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Informations Complémentaires</h2> {/* //! LOIC : INFO TRANSMISE AUTOMATIQUEMENT CAR LE PROFIL DE LUSER EST DEJA SUR LE SITE pas besoin des infos de bas een saisie  */}
            <div className="grid grid-cols-1 gap-6">
              <InputField label="Âge" name="age" type="number" value={formData.age} onChange={handleChange} required error={errorFields.includes("age") && "Ce champ est requis"} />

              <RadioGroup label="Sexe" name="sexe" options={["Homme", "Femme"]} value={formData.sexe} onChange={handleChange} required error={errorFields.includes("sexe") && "Ce champ est requis"} inline />

              <div className="space-y-2">
                <label className="block">
                  <span className="text-gray-700 font-medium">Ville *</span>
                  <select name="ville" value={formData.ville || ""} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4">
                    <option value="">Sélectionnez une ville</option>
                    {villes.map((ville) => (
                      <option key={ville} value={ville}>
                        {ville}
                      </option>
                    ))}
                    <option value="autre">Autre ville</option>
                  </select>
                </label>

                {formData.ville === "autre" && <InputField name="autreVille" value={formData.autreVille} onChange={handleChange} placeholder="Précisez votre ville" required />}
              </div>

              <RadioGroup label="As-tu des enfants ?" name="enfants" options={["Oui", "Non"]} value={formData.enfants} onChange={handleChange} required inline />
            </div>
          </div>
        );

      case 2: // Prise de Contact
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Prise de Contact</h2>
            <div className="space-y-8">
              <RadioGroup label="Objectif cible" name="objectif" options={objectifs} value={formData.objectif} onChange={handleChange} required error={errorFields.includes("objectif") && "Ce champ est requis"} />

              <RadioGroup label="Comment m'avez-vous connu ?" name="source" options={sources} value={formData.source} onChange={handleChange} required error={errorFields.includes("source") && "Ce champ est requis"} />
            </div>
          </div>
        );

      case 3: // Vie Professionnelle
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Vie Professionnelle</h2>

            <RadioGroup label="Côté pro, tu.." name="statutPro" options={statuts} value={formData.statutPro} onChange={handleChange} required error={errorFields.includes("statutPro")} />

            {formData.statutPro === "as une profession" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <InputField label="Secteur du métier" name="secteurMetier" value={formData.secteurMetier} onChange={handleChange} required />

                <div className="space-y-2">
                  <label className="block">
                    <span className="text-gray-700  font-medium">Localisation de votre travail</span>
                    <select name="lieuTravail" value={formData.lieuTravail || ""} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4">
                      <option value="">Sélectionnez une localisation</option>
                      {villesTravail.map((ville) => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                      <option value="autre">Autre ville</option>
                    </select>
                  </label>

                  {formData.lieuTravail === "autre" && <InputField name="autreLieuTravail" value={formData.autreLieuTravail} onChange={handleChange} placeholder="Précisez la ville" required />}
                </div>

                <div className="space-y-4">
                  <InputField label="Nombre d'heures travaillées par semaine" name="heuresTravail" type="number" value={formData.heuresTravail} onChange={handleChange} required />

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="plusDe50h"
                      checked={formData.plusDe50h}
                      onChange={(e) =>
                        handleChange({
                          target: { name: "plusDe50h", value: e.target.checked },
                        })
                      }
                      className="text-blue-600 rounded"
                    />
                    <span className="text-gray-700 ">+ de 50h</span>
                  </label>
                </div>

                <RadioGroup label="FORME | Sensation en fin de journée de travail ?" name="sensationFinJournee" options={sensations} value={formData.sensationFinJournee} onChange={handleChange} required />
              </motion.div>
            )}
          </div>
        );

      case 4: // État de Santé
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">État de Santé</h2>

            <RadioGroup label="Dans la vie de tous les jours, tu te sens comment ?" name="etatForme" options={etatsFormes} value={formData.etatForme} onChange={handleChange} required error={errorFields.includes("etatForme")} />

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Problèmes de santé ? (Cardiaque, Physiques)</h3>
              <p className="text-gray-600 text-sm mb-4">Réponds le plus honnêtement possible</p>

              <RadioGroup name="problemeSante" options={["Non", "Oui", "Plusieurs"]} value={formData.problemeSante} onChange={handleChange} required inline />

              {formData.problemeSante !== "Non" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <label className="block">
                    <span className="text-gray-700  font-medium">De quoi s'agit-il ?</span>
                    <textarea name="descriptionProblemeSante" value={formData.descriptionProblemeSante} onChange={handleChange} placeholder="Décrivez de manière précise votre ou vos problèmes" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4" rows={4} required />
                  </label>
                </motion.div>
              )}
            </div>

            <div className="border-t pt-6">
              <RadioGroup label="Sensation de douleur ou gêne ?" name="sensationDouleur" options={["Non", "Oui"]} value={formData.sensationDouleur} onChange={handleChange} required inline />

              {formData.sensationDouleur === "Oui" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <RadioGroup label="Quel type de douleur ?" name="typeDouleur" options={["Musculaire", "Articulaire", "Osseuse", "Pas de douleur"]} value={formData.typeDouleur} onChange={handleChange} required />
                </motion.div>
              )}
            </div>
          </div>
        );

      case 5: // Localisation Douleur
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Localisation de la Douleur</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Zones osseuses</h3>
                <div className="space-y-2">
                  {zonesOs.map((zone) => (
                    <label key={zone} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        name={`zone_${zone}`}
                        checked={formData[`zone_${zone}`] || false}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: `zone_${zone}`,
                              value: e.target.checked,
                            },
                          })
                        }
                        className="text-blue-600 rounded"
                      />
                      <span className="ml-2">{zone}</span>
                    </label>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Zones musculaires</h3>
                <div className="space-y-2">
                  {zonesMuscles.map((zone) => (
                    <label key={zone} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        name={`zone_${zone}`}
                        checked={formData[`zone_${zone}`] || false}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: `zone_${zone}`,
                              value: e.target.checked,
                            },
                          })
                        }
                        className="text-blue-600 rounded"
                      />
                      <span className="ml-2">{zone}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center">
                {/* // Suite du case 5 (Localisation Douleur) */}
                <input
                  type="checkbox"
                  name="aucuneDouleur"
                  checked={formData.aucuneDouleur || false}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    const updatedData = { aucuneDouleur: newValue };
                    if (newValue) {
                      [...zonesOs, ...zonesMuscles].forEach((zone) => {
                        updatedData[`zone_${zone}`] = false;
                      });
                    }
                    handleUpdateFormData(updatedData);
                  }}
                  className="text-blue-600 rounded"
                />
                <span className="ml-2 font-medium">Aucune douleur</span>
              </label>
            </div>
          </div>
        );

      case 6: // Hygiène de Vie
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-4">Hygiène de Vie</h2>
            <p className="text-gray-600 mb-6">Heure de sommeil, Alimentation, Addiction, Sport & Fréquence d'entrainement.. Tout est lié !</p>

            {/* Sommeil */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-medium text-lg">Sommeil</h3>

              <RadioGroup label="Nombre d'heures par nuit ?" name="heuresSommeil" options={heuresSommeil} value={formData.heuresSommeil} onChange={handleChange} required error={errorFields.includes("heuresSommeil")} inline />

              <div className="space-y-2">
                <label className="block">
                  <span className="text-gray-700  font-medium">Sensation au réveil ? *</span>
                  <select name="sensationReveil" value={formData.sensationReveil || ""} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4">
                    <option value="">Sélectionner</option>
                    {sensationsReveil.map((sensation) => (
                      <option key={sensation} value={sensation}>
                        {sensation}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Alimentation */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-medium text-lg">Alimentation</h3>

              <RadioGroup label="Tu fais attention à ce que tu manges ?" name="attentionAlimentation" options={["Oui", "Bof", "Non"]} value={formData.attentionAlimentation} onChange={handleChange} required inline />

              {/* Exemples de repas */}
              {["Petit déjeuner", "Déjeuner", "Collation", "Diner"].map((repas) => (
                <div key={repas}>
                  <label className="block">
                    <span className="text-gray-700  font-medium">Exemple de {repas}</span>
                    <textarea name={`exemple${repas.replace(" ", "")}`} value={formData[`exemple${repas.replace(" ", "")}`] || ""} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4" rows={2} />
                  </label>
                </div>
              ))}
            </div>

            {/* Compléments alimentaires */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-medium text-lg">Compléments Alimentaires</h3>

              <RadioGroup label="Est-ce que tu en prends ?" name="prendComplements" options={["Oui", "Non"]} value={formData.prendComplements} onChange={handleChange} inline />

              {formData.prendComplements === "Oui" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {complementsAlimentaires.map((complement) => (
                      <label key={complement} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          name={`complement_${complement}`}
                          checked={formData[`complement_${complement}`] || false}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: `complement_${complement}`,
                                value: e.target.checked,
                              },
                            })
                          }
                          className="text-blue-600 rounded"
                        />
                        <span className="ml-2">{complement}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block">
                      <span className="text-gray-700  font-medium">Dans quel but ?</span>
                      <textarea name="butComplements" value={formData.butComplements || ""} onChange={handleChange} placeholder="Explique-moi brièvement" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4" rows={3} />
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 7: // Vie Sportive
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-4">Vie Sportive</h2>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <RadioGroup label="Fais-tu du sport ?" name="faitDuSport" options={["Oui", "Non"]} value={formData.faitDuSport} onChange={handleChange} required error={errorFields.includes("faitDuSport")} inline />

              {formData.faitDuSport === "Oui" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Sports pratiqués</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {sports.map((sport) => (
                        <label key={sport} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            name={`sport_${sport}`}
                            checked={formData[`sport_${sport}`] || false}
                            onChange={(e) =>
                              handleChange({
                                target: {
                                  name: `sport_${sport}`,
                                  value: e.target.checked,
                                },
                              })
                            }
                            className="text-blue-600 rounded"
                          />
                          <span className="ml-3">{sport}</span>
                        </label>
                      ))}
                      <div className="mt-4">
                        <InputField label="Autre sport" name="autreSport" value={formData.autreSport} onChange={handleChange} placeholder="Précisez votre sport" />
                      </div>
                    </div>
                  </div>

                  <RadioGroup label="Fréquence d'entraînement" name="frequenceSport" options={frequences} value={formData.frequenceSport} onChange={handleChange} required />

                  <RadioGroup label="Durée moyenne des entraînements" name="dureeSport" options={durees} value={formData.dureeSport} onChange={handleChange} required />
                </motion.div>
              )}
            </div>
          </div>
        );

      case 8: // Coaching Privé
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Les Coachings Privés & Toi</h2>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <RadioGroup label="As-tu déjà fait appel à un coach ?" name="dejaEuCoach" options={["Oui", "Non"]} value={formData.dejaEuCoach} onChange={handleChange} required error={errorFields.includes("dejaEuCoach")} inline />

              {formData.dejaEuCoach === "Oui" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <RadioGroup label="Quel était ton objectif ?" name="objectifPrecedent" options={objectifs} value={formData.objectifPrecedent} onChange={handleChange} required />

                  <InputField label="Prénom du coach (facultatif)" name="prenomCoachPrecedent" value={formData.prenomCoachPrecedent} onChange={handleChange} placeholder="Prénom du coach" />
                </motion.div>
              )}
            </div>
          </div>
        );

      case 9: // Disponibilités
        const handleDisponibilite = (jour, creneau) => {
          const key = `${jour}_${creneau}`;
          const currentDispos = formData.disponibilites || {};

          if (creneau === "aucune dispo") {
            const newDispos = { ...currentDispos };
            joursDisponibilites.forEach((j) => {
              if (j === jour) {
                creneauxDisponibilites.forEach((c) => {
                  delete newDispos[`${j}_${c}`];
                });
                newDispos[key] = !currentDispos[key];
              }
            });
            handleUpdateFormData({ disponibilites: newDispos });
          } else {
            const newDispos = { ...currentDispos };
            delete newDispos[`${jour}_aucune dispo`];
            newDispos[key] = !currentDispos[key];
            handleUpdateFormData({ disponibilites: newDispos });
          }
        };

        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Vos Disponibilités</h2>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr>
                      <th className="w-32 p-3 bg-gray-50 border text-left">Créneaux</th>
                      {joursDisponibilites.map((jour) => (
                        <th key={jour} className="w-24 p-3 bg-gray-50 border text-center">
                          {jour}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {creneauxDisponibilites.map((creneau, idx) => (
                      <tr key={creneau} className={creneau === "aucune dispo" ? "bg-gray-50" : idx % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="p-3 border font-medium">{creneau}</td>
                        {joursDisponibilites.map((jour) => (
                          <td key={`${jour}_${creneau}`} className="p-3 border text-center">
                            <input type="checkbox" checked={formData.disponibilites?.[`${jour}_${creneau}`] || false} onChange={() => handleDisponibilite(jour, creneau)} className="w-5 h-5 text-blue-600 rounded transition-all hover:scale-110" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 10: // Contact Urgence
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Contact à Avertir en Cas de Problème</h2>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Nom" name="contactUrgenceNom" value={formData.contactUrgenceNom} onChange={handleChange} required error={errorFields.includes("contactUrgenceNom")} />
                <InputField label="Prénom" name="contactUrgencePrenom" value={formData.contactUrgencePrenom} onChange={handleChange} required error={errorFields.includes("contactUrgencePrenom")} />
                <InputField label="Téléphone" name="contactUrgenceTelephone" type="tel" value={formData.contactUrgenceTelephone} onChange={handleChange} required error={errorFields.includes("contactUrgenceTelephone")} />
              </div>

              <div className="mt-6 text-gray-600 text-sm">Une copie de vos réponses sera envoyée par e-mail à l'adresse indiquée.</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {" "}
      {/* ENTETE DE PAGE DYNAMIQUE */}
      <div className="bg-white p-1 md:p-4 rounded-md shadow-md mb-4 md:mb-8">
        <motion.h1 className="text-4xl sm:text-5xl font-bold text-center my-4 text-gray-800 uppercase" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {" "}
          Questionnaire entretien{" "}
        </motion.h1>
      </div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mb-8 md:mb-0 md:p-6 lg:p-8  ">
        <p className="text-gray-600 w-full ">
          <span className="font-bold">Durée : </span>10 minutes
        </p>
        <p className="text-gray-600 w-full">Vos réponses nous permettront de personnaliser votre expérience de coaching.</p>
      </motion.div>
      <div className="max-w-4xl mx-auto md:p-6 lg:p-8">
        {/* Progress Stepper */}
        <div className="relative mb-8 overflow-x-auto ">
          <div className="flex justify-between items-center min-w-max px-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="relative">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${index < currentStep ? "bg-green-500 text-white" : index === currentStep ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: index === currentStep ? [1, 1.1, 1] : 1 }}
                  >
                    {index < currentStep ? <Check size={16} /> : index + 1}
                  </motion.div>
                  {/* <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">{step.title}</span> */}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors
                      ${index < currentStep ? "bg-green-500" : index === currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {showError && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Veuillez remplir tous les champs obligatoires avant de continuer.</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors
              ${currentStep === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Retour
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Envoyer" : "Suivant"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default QuestionnaireEntretien;
