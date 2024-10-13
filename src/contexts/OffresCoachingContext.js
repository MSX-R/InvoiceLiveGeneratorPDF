import React, { createContext, useState, useContext, useEffect } from "react";
import { FaDumbbell, FaUsers, FaClock, FaFilePdf, FaLightbulb } from "react-icons/fa";

const OffresCoachingContext = createContext();

export const useOffresCoaching = () => {
  const context = useContext(OffresCoachingContext);
  if (!context) {
    throw new Error("useOffresCoaching must be used within an OffresCoachingProvider");
  }
  return context;
};

export const OffresCoachingProvider = ({ children }) => {
  const [offres, setOffres] = useState([]);
  const [programme, setProgramme] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setLoading(true);
        // Simulation d'un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const offresData = [
          {
            title: "ESSAI",
            duration: "40 MIN",
            type: "SOLO",
            icon: <FaLightbulb />,
            color: "from-yellow-400 to-yellow-600",
            price: {
              single: {
                sessions: 1,
                name: "Séance découverte",
                amount: 0,
                text: "1 SEANCE",
                perSession: 0,
                discount: 0,
              },
            },
            description: "Séance qui permet de faire un bilan sur l'état de forme du client, refaire un tour sur les objectifs du client, faire passer de légers tests au client (ce qui permettra pour lui d'obtenir des informations intéressantes et comparables dans le temps avec d'autres tests) et si le temps le permet, travailler sur 2-3 exercices classiques d'une séance coaching ou bien sur 2-3 exercices en rapport avec l'objectif client.",
          },
          {
            title: "ESSENTIEL",
            duration: "40 MIN",
            type: "SOLO",
            icon: <FaDumbbell />,
            color: "from-blue-400 to-blue-600",
            price: {
              single: {
                sessions: 1,
                name: "Séance unique",

                amount: 50,
                text: "1 SEANCE",
                perSession: 50,
                discount: 0,
              },
              pack: [
                {
                  sessions: 15,
                  name: "Pack - 15 séances",

                  amount: 560,
                  perSession: (560 / 15).toFixed(2),
                  discount: 0,
                },
              ],
              followUp: [
                { sessions: 24, name: "Suivi 3 mois | 2 séances/semaine", duration: "Suivi 3 mois", perWeek: 2, amount: 799.9, monthly: 267.0, perSession: 33.33, discount: 0 },
                { sessions: 36, name: "Suivi 3 mois | 3 séances/semaine", duration: "Suivi 3 mois", perWeek: 3, amount: 1140.0, monthly: 380.0, perSession: 31.67, discount: 0 },
                { sessions: 48, name: "Suivi 3 mois | 4 séances/semaine", duration: "Suivi 3 mois", perWeek: 4, amount: 1440.0, monthly: 480.0, perSession: 30.0, discount: 0 },
                { sessions: 60, name: "Suivi 3 mois | 5 séances/semaine", duration: "Suivi 3 mois", perWeek: 5, amount: 1800.0, monthly: 600.0, perSession: 30.0, discount: 0 },
              ],
            },
          },
          {
            title: "FULL",
            duration: "60 MIN",
            type: "SOLO",
            icon: <FaClock />,
            color: "from-green-400 to-green-600",
            price: {
              single: {
                sessions: 1,
                name: "Séance unique",

                amount: 70,
                text: "1 SEANCE",
                perSession: 70,
                discount: 0,
              },
              pack: [
                {
                  sessions: 10,
                  name: "Pack - 10 séances",
                  amount: 550,
                  perSession: (550 / 10).toFixed(2),
                  discount: 0,
                },
              ],
              followUp: [
                { sessions: 24, name: "Suivi 3 mois | 2 séances/semaine", duration: "3 mois", perWeek: 2, amount: 1200.0, monthly: 400.0, perSession: 50.0, discount: 0 },
                { sessions: 36, name: "Suivi 3 mois | 3 séances/semaine", duration: "3 mois", perWeek: 3, amount: 1680.0, monthly: 560.0, perSession: 46.67, discount: 0 },
                { sessions: 48, name: "Suivi 3 mois | 4 séances/semaine", duration: "3 mois", perWeek: 4, amount: 2160.0, monthly: 720.0, perSession: 45.0, discount: 0 },
                { sessions: 60, name: "Suivi 3 mois | 5 séances/semaine", duration: "3 mois", perWeek: 5, amount: 2700.0, monthly: 900.0, perSession: 45.0, discount: 0 },
              ],
            },
          },
          {
            title: "DUO",
            duration: "60 MIN",
            type: "DUO",
            icon: <FaUsers />,
            color: "from-purple-400 to-purple-600",
            price: {
              single: {
                sessions: 1,
                name: "Séance unique",

                amount: 100,
                text: "1 SEANCE",
                discount: 0,
                amountByOne: (100 / 2).toFixed(2),
              },
              pack: [
                {
                  sessions: 5,
                  name: "Pack - 5 séances",
                  amount: 450,
                  discount: 0,
                  amountByOne: (450 / 2).toFixed(2),
                  perSession: (450 / 5 / 2).toFixed(2),
                },
                {
                  sessions: 10,
                  name: "Pack - 10 séances",
                  amount: 850,
                  discount: 0,
                  amountByOne: (850 / 2).toFixed(2),
                  perSession: (850 / 10 / 2).toFixed(2),
                },
              ],
              followUp: [
                {
                  sessions: 24,
                  name: "Suivi 3 mois | 2 séances/semaine",
                  duration: "3 mois",
                  perWeek: 2,
                  amount: 1824.0,
                  monthly: 608.0,
                  perSession: 38.0,
                  discount: 0,
                  amountByOne: (1824.0 / 48).toFixed(2),
                  monthlyByOne: (608.0 / 2).toFixed(2),
                },
                {
                  sessions: 36,
                  name: "Suivi 3 mois | 3 séances/semaine",
                  duration: "3 mois",
                  perWeek: 3,
                  amount: 2592.0,
                  monthly: 864.0,
                  perSession: 36.0,
                  discount: 0,
                  amountByOne: (2592.0 / 72).toFixed(2),
                  monthlyByOne: (864.0 / 2).toFixed(2),
                },
                {
                  sessions: 48,
                  name: "Suivi 3 mois | 4 séances/semaine",

                  duration: "3 mois",
                  perWeek: 4,
                  amount: 3264.0,
                  monthly: 1088.0,
                  perSession: 34.0,
                  discount: 0,
                  amountByOne: (3264.0 / 96).toFixed(2),
                  monthlyByOne: (1088.0 / 2).toFixed(2),
                },
                {
                  sessions: 60,
                  name: "Suivi 3 mois | 5 séances/semaine",

                  duration: "3 mois",
                  perWeek: 5,
                  amount: 4080.0,
                  monthly: 1360.0,
                  perSession: 34.0,
                  discount: 0,
                  amountByOne: (4080.0 / 120).toFixed(2),
                  monthlyByOne: (1360.0 / 2).toFixed(2),
                },
              ],
            },
          },
        ];

        const programmeData = {
          title: "PROGRAMME D'ENTRAINEMENT",
          duration: "9 SEMAINES",
          type: "À DISTANCE",
          icon: <FaFilePdf />,
          color: "from-red-400 to-red-600",
          price: {
            single: { amount: 70, text: "PROGRAMME" },
            description: "Programme d'entraînement personnalisable sur 9 semaines, livré en format PDF",
            features: ["Document PDF", "Introduction et guide d'utilisation détaillés", "Outil de calcul des RM (Répétitions Maximales)", "Planification d'entraînement sur 9 semaines", "Séances de rattrapage flexibles", "Conseils nutritionnels adaptés à vos objectifs", "Exercices illustrés avec instructions", "Espaces pour noter vos performances et suivre vos progrès", "Conseils pour adapter les charges de travail à vos RM", "Bonus : Techniques de récupération et de prévention des blessures"],
          },
        };

        setOffres(offresData);
        setProgramme(programmeData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres:", err);
        setError("Une erreur est survenue lors du chargement des offres.");
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  const value = {
    offres,
    programme,
    loading,
    error,
  };

  return <OffresCoachingContext.Provider value={value}>{children}</OffresCoachingContext.Provider>;
};
