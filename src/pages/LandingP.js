import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import { AiOutlineLogin } from "react-icons/ai"; // Importer l'icône de connexion

const LandingP = () => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newSection = Math.round(window.scrollY / window.innerHeight);
      setCurrentSection(newSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-gray-100">
      <Header currentSection={currentSection} />
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
    </div>
  );
};

const Header = ({ currentSection }) => {
    const navigate = useNavigate(); // Initialiser useNavigate
  
    // Fonction pour gérer la navigation vers la page de connexion
    const handleLoginClick = () => {
        navigate("/login");
    };
  
    return (
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            MSXFIT - MARSALEIX ROMAIN
          </motion.h1>
          <ul className="flex space-x-4 items-center">
            {["Accueil", "À propos", "Services", "Contact"].map((item, index) => (
              <motion.li
                key={item}
                className={`text-white ${currentSection === index ? "font-bold" : ""}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item}
              </motion.li>
            ))}
            {/* Icône de connexion */}
            <motion.li
              className="text-white cursor-pointer flex items-center space-x-1"
              onClick={handleLoginClick} // Gérer le clic sur l'icône
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }} // Animation avec délai
            >
              <AiOutlineLogin size={24} /> {/* Icône de connexion */}
              <span>Se connecter</span>
            </motion.li>
          </ul>
        </nav>
      </header>
    );
  };

const Hero = () => (
  <section className="h-screen flex items-center justify-center bg-cover bg-center text-white" style={{ backgroundImage: "url('/api/placeholder/1920/1080')" }}>
    <motion.div className="text-center bg-black bg-opacity-50 p-8 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <h2 className="relative text-6xl font-bold mb-4">
        MSXFIT™ <span class="hidden md:inline  text-base md:absolute bottom-0">par Marsaleix Romain</span>
      </h2>
      <p className="text-xl">Transformez votre corps, transformez votre vie grâce à un entraînement personnalisé et motivant.</p>
    </motion.div>
  </section>
);

const About = () => (
  <section className="min-h-screen flex items-center justify-center bg-white">
    <div className="container mx-auto px-6 py-20">
      <motion.h2 className="text-4xl font-bold mb-8 text-center" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        Bienvenue sur MSXFIT
      </motion.h2>
      <motion.p className="text-xl max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        Où la passion, la force, l'endurance et le progrès se rencontrent et sont conçus pour inspirer la grandeur. Entrez dans un monde où la santé et le bien-être sont au premier plan et où chaque entraînement est une étape vers la libération de votre plein potentiel.
      </motion.p>
    </div>
  </section>
);

const Services = () => {
  const services = [
    { title: "Coaching Individuel", description: "Atteignez vos objectifs de mise en forme grâce à un entraînement personnalisé de haute qualité", image: "/api/placeholder/400/300" },
    { title: "Coaching Duo", description: "Donnez un coup de pouce à votre entreprise avec une formation d'entreprise spécialement conçue", image: "/api/placeholder/400/300" },
    { title: "Coaching SmallGroup", description: "Élevez votre niveau de forme physique avec des entraînements de groupe intenses et motivants", image: "/api/placeholder/400/300" },
    { title: "Programme d'entrainement", description: "Atteignez vos objectifs fitness où que vous soyez avec un programme d'entraînement en ligne personnalisé", image: "/api/placeholder/400/300" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 py-20">
      <div className="container mx-auto px-6">
        <motion.h2 className="text-4xl font-bold mb-12 text-center" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          Mes Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div key={service.title} className="bg-white rounded-lg shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="container mx-auto px-6 text-center">
      <motion.h2 className="text-4xl font-bold mb-8" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Prêt à Commencer Votre Transformation ?
      </motion.h2>
      <motion.p className="text-xl mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        Contactez-moi dès aujourd'hui pour une consultation gratuite et commencez votre voyage vers une meilleure santé et forme physique.
      </motion.p>
      <motion.a href="mailto:romain@marsaleix-training.com" className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        Contactez-moi
      </motion.a>
    </div>
  </section>
);

export default LandingP;
