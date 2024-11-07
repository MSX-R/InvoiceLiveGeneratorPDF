import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ScrollingWordsBanner = () => {
  const words = ["Initiation", "Perte de poids", "Remise en forme", "Renforcement musculaire", "Accompagnement sportif"];

  const containerRef = useRef(null); // Référence au conteneur des mots
  const [offset, setOffset] = useState(0); // Position horizontale des mots
  const scrollSpeed = 1; // Vitesse du défilement

  // Créer une répétition des mots pour une boucle infinie
  const repeatedWords = [...words, ...words]; // Répéter les mots pour créer l'effet de défilement sans fin

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth;

        // Appliquer le défilement horizontal
        setOffset((prevOffset) => prevOffset + scrollSpeed);

        // Si le défilement a dépassé la largeur du conteneur, on réinitialise la position
        if (offset >= scrollWidth / 2) {
          setOffset(0); // Réinitialiser le défilement
        }
      }
    };

    // Créer une boucle d'animation de défilement fluide
    const interval = setInterval(handleScroll, 10); // Mise à jour toutes les 10ms pour un défilement fluide

    return () => clearInterval(interval); // Nettoyer l'intervalle lorsque le composant est démonté
  }, [offset]); // Redémarre chaque fois que l'offset change

  return (
    <div className="overflow-hidden bg-gray-100 py-8 flex">
      <motion.div
        ref={containerRef}
        className="flex space-x-12"
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          transform: `translateX(-${offset}px)`, // Appliquer le défilement horizontal
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        {/* Placer les mots répétés dans le conteneur */}
        {repeatedWords.map((word, index) => (
          <React.Fragment key={index}>
            <span
              className="text-9xl font-extrabold text-transparent whitespace-nowrap uppercase"
              style={{
                WebkitTextStroke: "2px black", // Bordure du texte
                textStroke: "2px black", // Support pour d'autres navigateurs
                color: "transparent",
              }}
            >
              {word}
            </span>
            {index < repeatedWords.length - 1 && (
              <span
                className="text-9xl font-extrabold text-transparent whitespace-nowrap uppercase"
                style={{
                  WebkitTextStroke: "2px black", // Bordure du texte
                  textStroke: "2px black", // Support pour d'autres navigateurs
                  color: "black",
                }}
              >
                {" / "}
              </span>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingWordsBanner;
