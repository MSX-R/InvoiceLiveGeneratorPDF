import React, { useEffect, useState } from "react"; // Importez useEffect et useState
import { useNavigate } from "react-router-dom";
import soloImage from "./Tarifs/solo.jpg"; // Assurez-vous que l'image est bien dans le même dossier
import duoImage from "./Tarifs/duo.jpg";
import smallImage from "./Tarifs/small.jpg";

const OffresCoachings = () => {
  const navigate = useNavigate();

  // État pour déterminer si l'écran est mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Hook pour mettre à jour isMobile sur les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize); // Ajoutez l'écouteur d'événements

    return () => {
      window.removeEventListener("resize", handleResize); // Nettoyez l'écouteur
    };
  }, []);

  const offerings = [
    {
      title: "Séance SOLO",
      image: soloImage,
      path: "/offres-coachings/solo",
    },
    {
      title: "Séance DUO",
      image: duoImage,
      path: "/offres-coachings/duo",
    },
    {
      title: "Small Group",
      image: smallImage,
      path: "/offres-coachings/small-group",
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col items-center justify-start w-full p-${isMobile ? "4" : "8"}`}>
      <h1 className="text-5xl font-bold text-center text-gray-800">Offres Coachings</h1>

      {/* Affichage pour mobile */}
      {isMobile ? (
        <div className="flex flex-col w-full max-w-screen-xl h-[calc(100vh-8rem)] flex-grow p-2.5">
          {offerings.map((offering) => (
            <div
              key={offering.title}
              className="relative cursor-pointer mb-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex-grow mx-2"
              onClick={() => navigate(offering.path)}
              style={{
                backgroundImage: `url(${offering.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <div className="bg-black bg-opacity-50 p-1 flex items-center justify-center h-full">
                <h2 className="text-white text-lg font-bold text-center">{offering.title}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Affichage pour desktop
        <div className={`hidden md:flex flex-row w-full max-w-screen-xl h-[calc(100vh-8rem)] flex-grow p-2.5`}>
          {offerings.map((offering) => (
            <div
              key={offering.title}
              className="relative cursor-pointer mb-0 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex-grow mx-2"
              onClick={() => navigate(offering.path)}
              style={{
                backgroundImage: `url(${offering.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <div className="bg-black bg-opacity-50 p-1 flex items-center justify-center h-full">
                <h2 className="text-white text-lg font-bold text-center">{offering.title}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffresCoachings;
