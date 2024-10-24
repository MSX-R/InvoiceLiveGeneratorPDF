import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { MdMenu, MdClose } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { FaQuoteLeft } from "react-icons/fa";
import logo from "../assets/Blancsolo.png";

const LandingP = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const pageTop = window.pageYOffset;

      // Filter out null refs (elements that are not mounted yet)
      const validRefs = sectionRefs.current.filter((ref) => ref !== null);

      const newSection = validRefs.findIndex((ref, index) => pageTop >= ref.offsetTop - window.innerHeight / 2 && (index === validRefs.length - 1 || pageTop < validRefs[index + 1].offsetTop - window.innerHeight / 2));

      if (newSection !== -1) {
        setCurrentSection(newSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["MSXFIT", "A propos", "Services", "Testimonials", "Contact", `${isAuthenticated ? "Dashboard" : ""}`];

  const handleLoginClick = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleMenuClick = (item) => {
    if (item.toUpperCase() === "DASHBOARD") {
      navigate("/dashboard");
    } else {
      const index = menuItems.indexOf(item);
      if (index !== -1 && sectionRefs.current[index]) {
        sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-100">
      <Header currentSection={currentSection} menuItems={menuItems} isAuthenticated={isAuthenticated} handleLoginClick={handleLoginClick} handleMenuClick={handleMenuClick} setIsSidebarOpen={setIsSidebarOpen} />
      <MobileMenu isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} menuItems={menuItems} isAuthenticated={isAuthenticated} handleLoginClick={handleLoginClick} handleMenuClick={handleMenuClick} />
      <main>
        <Hero ref={(el) => (sectionRefs.current[0] = el)} />
        <About ref={(el) => (sectionRefs.current[1] = el)} />
        <Services ref={(el) => (sectionRefs.current[2] = el)} />
        <Testimonials ref={(el) => (sectionRefs.current[3] = el)} />
        <Contact ref={(el) => (sectionRefs.current[4] = el)} />
      </main>
    </div>
  );
};

const Header = ({ currentSection, menuItems, isAuthenticated, handleLoginClick, handleMenuClick, setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-60">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
          <MdMenu size={36} />
        </button>

        <motion.h1 className="text-2xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-end gap-2 md:justify-center" onClick={handleLogoClick}>
            <img src={logo} alt="Logo" className="h-12 cursor-pointer" />
          </div>
        </motion.h1>

        <ul className="hidden md:flex space-x-4 items-center">
          {menuItems.map((item, index) => (
            <motion.li key={item} className={`text-white cursor-pointer ${currentSection === index ? "font-bold" : ""}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} onClick={() => handleMenuClick(item)}>
              {item}
            </motion.li>
          ))}
          <button onClick={handleLoginClick} className="w-full flex items-center md:justify-center justify-end py-2 px-4 rounded-md text-red-400 hover:bg-gray-700">
            {isAuthenticated ? <AiOutlineLogout className="mr-2" /> : <AiOutlineLogin className="mr-2" />}
            <span>{isAuthenticated ? "Se déconnecter" : "Se connecter"}</span>
          </button>
        </ul>
      </nav>
    </header>
  );
};

const MobileMenu = ({ isOpen, setIsOpen, menuItems, isAuthenticated, handleLoginClick, handleMenuClick }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };
  return (
    <>
      <div className={`fixed inset-0 bg-gray-800 text-white flex flex-col p-4 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-8">
              <button className="text-white transition-transform duration-300 transform hover:scale-110" onClick={() => setIsOpen(false)}>
                <MdClose size={36} />
              </button>
              <div className="flex items-center justify-end gap-2 md:justify-center md:mt-8 md:mb-16" onClick={handleLogoClick}>
                <img src={logo} alt="Logo" className="h-10 cursor-pointer" />
                <h2 className="text-2xl font-bold text-left cursor-pointer">MENU MOBILE</h2>
              </div>
            </div>
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item}
                  className="text-white cursor-pointer"
                  onClick={() => {
                    handleMenuClick(item);
                    setIsOpen(false);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <button
              onClick={() => {
                handleLoginClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center md:justify-center justify-end py-2 px-4 rounded-md text-red-400 hover:bg-gray-700"
            >
              {isAuthenticated ? <AiOutlineLogout className="mr-2" /> : <AiOutlineLogin className="mr-2" />}
              <span>{isAuthenticated ? "Se déconnecter" : "Se connecter"}</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

const Hero = React.forwardRef((props, ref) => (
  <section ref={ref} className="h-screen flex items-center justify-center bg-cover bg-center text-white" style={{ backgroundImage: `url(${require("../assets/wall.jpeg")})` }}>
    <motion.div className="text-center bg-black bg-opacity-50 p-8 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <h2 className="relative text-6xl font-bold mb-4">
        MSXFIT™ <span className="hidden md:inline text-base md:absolute bottom-0">par Marsaleix Romain</span>
      </h2>
      <p className="text-xl">Transformez votre corps, transformez votre vie grâce à un entraînement personnalisé et motivant.</p>
    </motion.div>
  </section>
));

const About = React.forwardRef((props, ref) => (
  <motion.section ref={ref} className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <motion.div className="absolute inset-0 bg-black opacity-50" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1.5 }} />

    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.2 }}
      transition={{ duration: 2 }}
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    <div className="container mx-auto  px-6 py-20 relative z-10">
      <motion.img src={require("../assets/profil.jpg")} alt="Coach" className="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-gray-100 shadow-lg" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />

      <motion.h2 className="text-5xl font-bold mb-8 text-center text-white" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
        Bienvenue sur MSXFIT
      </motion.h2>

      <motion.p className=" text-base md:text-xl max-w-3xl mx-auto text-center text-gray-200" alt="BREVE PRESENTATION DU SITE" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
        "Un espace dédié aux coachs pour simplifier la gestion des inscriptions, suivre la consommation des séances et réaliser des bilans personnalisés. Accédez aux références de performances de vos clients et concevez des programmes d’entraînement optimisés et précis pour les aider à atteindre leurs objectifs"{" "}
      </motion.p>

      <motion.button className="mt-12 px-8 py-3 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-100 transition duration-300 mx-auto block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}>
        Utilisez le site dès maintenant !
      </motion.button>
    </div>

    <motion.div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1.5 }} />
  </motion.section>
));

const Services = React.forwardRef((props, ref) => {
  const services = [
    { title: "Coaching Individuel", description: "Débloquez votre potentiel ! Atteignez vos objectifs de mise en forme avec un entraînement personnalisé de haute qualité, conçu spécialement pour vous. Transformez vos efforts en résultats concrets !", image: require("../assets/indiv.jpeg"), lowTarif: 47.5 },
    { title: "Coaching Duo", description: "Boostez votre motivation à deux ! Partagez votre parcours de fitness avec un ami et profitez d’une formation sur mesure qui dynamisera votre entreprise. Ensemble, franchissez de nouvelles étapes vers le succès !", image: require("../assets/duo.jpeg"), lowTarif: 33 },
    { title: "Coaching SmallGroup", description: "Libérez votre énergie en groupe ! Élevez votre niveau de forme physique avec des entraînements de groupe intenses et motivants. Rejoignez une communauté dynamique et poussez vos limites ensemble !", image: require("../assets/small.webp"), lowTarif: 30 },
    { title: "Programme d'entrainement", description: "Entraînez-vous où que vous soyez ! Atteignez vos objectifs fitness avec un programme d’entraînement en ligne personnalisé. Flexibilité, efficacité et résultats garantis, peu importe votre emploi du temps !", image: require("../assets/programme.webp"), lowTarif: 50 },
  ];

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-gray-100 py-20">
      <div className="container mx-auto px-6">
        <motion.h2 className="text-4xl font-bold mb-12 text-center" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          Mes Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div key={service.title} className="bg-white rounded-lg shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="relative">
                {" "}
                {/* Conteneur pour positionner l'image et le tarif */}
                <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
                {/* Div pour le tarif en position absolue */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-base rounded px-2 py-1">À partir de {service.lowTarif} €</div>
                {/* IL FAUDRA INDIQUER LE TARIF LE PLUS BAS DE LA FORMULE */}
              </div>
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
});

const Testimonials = React.forwardRef((props, ref) => {
  const testimonials = [
    {
      id: 1,
      name: "Sophie Durand",
      date: "15 mars 2024",
      message: "Grâce à Romain, j'ai retrouvé la forme et la confiance en moi. Un coaching adapté et exceptionnel!",
      image: require("../assets/coach.jpg"),
    },
    {
      id: 2,
      name: "Thomas Lefebvre",
      date: "2 avril 2024",
      message: "Les séances sont intenses mais tellement gratifiantes. Je me sens plus fort chaque jour.",
      image: require("../assets/coach.jpg"),
    },
    {
      id: 3,
      name: "Emma Martin",
      date: "20 avril 2024",
      message: "Le coaching en ligne est parfait pour mon emploi du temps chargé. Romain s'adapte à mes besoins.",
      image: require("../assets/coach.jpg"),
    },
    {
      id: 4,
      name: "Lucas Dubois",
      date: "5 mai 2024",
      message: "Romain a transformé ma mon quotidien. Je recommande à 100% !",
      image: require("../assets/coach.jpg"),
    },
    {
      id: 5,
      name: "Chloé Petit",
      date: "18 mai 2024",
      message: "Les séances de small group sont super motivantes. On se dépasse ensemble dans la joie et la sueur !",
      image: require("../assets/coach.jpg"),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const TestimonialCard = ({ testimonial }) => (
    <motion.div className="bg-gray-100 rounded-lg shadow-xl p-6 flex flex-col h-full" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center mb-4">
        <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
        <div>
          <h4 className="font-semibold text-gray-700 text-lg">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.date}</p>
        </div>
      </div>
      <FaQuoteLeft className="text-3xl text-gray-300 mb-4" />
      <p className="text-gray-700 flex-grow">{testimonial.message}</p>
    </motion.div>
  );

  return (
    <section ref={ref} className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 className="text-4xl font-bold mb-12 text-center" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Ce que disent nos clients
        </motion.h2>
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        <div className="md:hidden">
          <TestimonialCard testimonial={testimonials[currentIndex]} />
        </div>
      </div>
    </section>
  );
});

const Contact = React.forwardRef((props, ref) => (
  <section ref={ref} className="min-h-screen flex items-center justify-center bg-white text-gray-900 py-20">
    <div className="container mx-auto px-6 text-center">
      <motion.h2 className="text-4xl font-bold mb-8" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Prêt à Commencer Votre Transformation ?
      </motion.h2>
      <motion.p className=" text-base md:text-xl mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        Êtes-vous prêt à relever le défi ? Contactez-moi aujourd'hui pour un rendez-vous et faites des changements percutants pour atteindre vos objectifs de santé et de performance !
      </motion.p>

      <div className="flex flex-col gap-8 mb-8 md:w-fit md:flex-row md:justify-center md:mx-auto md:mt-16">
        <motion.a href="tel:0789619164" className="bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          Contactez-moi par téléphone
        </motion.a>{" "}
        <motion.a href="mailto:romain@marsaleix-training.com" className="bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          Contactez-moi par email
        </motion.a>
      </div>

      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="w-full max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg text-gray-900">
        <h3 className="text-2xl font-bold mb-6 uppercase">réservez directement votre séance avec moi</h3>
        <iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2Cx4TANfdM0FfpDR9BX5x1S6bAT3kK7bfqqVg52F0sk1kVfDWurnm49CRaPK5P31BOM9a9oG4G?gv=true" style={{ border: "0" }} width="100%" height="600" frameBorder="0" allowFullScreen></iframe>

        {/* //! A CONSERVER ON NE SAIT JAMAIS */}
        {/* <h3 className="text-2xl font-bold mb-6">Ou contactez moi via formulaire :</h3>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nom
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Votre nom" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Votre email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
              Telephone
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="telephone" type="telephone" placeholder="Votre telephone" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Votre message" />
          </div>
          <div className="flex items-center justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="button">
              Envoyer
            </button>
          </div>
        </form> */}
      </motion.div>
    </div>
  </section>
));

export default LandingP;

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
// import { MdMenu } from "react-icons/md";
// import { useAuth } from "../contexts/AuthContext"; // Assurez-vous que ce chemin est correct
// import { FaQuoteLeft } from "react-icons/fa";
// import logo from "../assets/Blancsolo.png";
// import { MdClose } from "react-icons/md"; // Importer l'icône de fermeture

// const LandingP = () => {
//   const [currentSection, setCurrentSection] = useState(0);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       const newSection = Math.round(window.scrollY / window.innerHeight);
//       setCurrentSection(newSection);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const menuItems = ["Accueil", "À propos", "Services", "Contact", "Testimonials", "Dashboard"];

//   const handleLoginClick = () => {
//     if (isAuthenticated) {
//       logout();
//       navigate("/");
//     } else {
//       navigate("/login");
//     }
//   };

//   const handleMenuClick = (item) => {
//     if (item.toUpperCase() === "DASHBOARD") {
//       navigate("/dashboard");
//     }
//   };
//   return (
//     <div className="font-sans text-gray-900 bg-gray-100">
//       <Header currentSection={currentSection} menuItems={menuItems} isAuthenticated={isAuthenticated} handleLoginClick={handleLoginClick} handleMenuClick={handleMenuClick} setIsSidebarOpen={setIsSidebarOpen} />
//       <MobileMenu isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} menuItems={menuItems} isAuthenticated={isAuthenticated} handleLoginClick={handleLoginClick} />
//       <main>
//         <Hero />
//         <About />
//         <Services />
//         <Testimonials />
//         <Contact />
//       </main>
//     </div>
//   );
// };

// const Header = ({ currentSection, menuItems, isAuthenticated, handleLoginClick, setIsSidebarOpen }) => {
//   const navigate = useNavigate();

//   const handleMenuClick = (item) => {
//     if (item.toUpperCase() === "DASHBOARD") {
//       navigate("/dashboard");
//     }
//   };

//   const handleLogoClick = () => {
//     if (isAuthenticated) {
//       navigate("/dashboard"); // Redirige vers /dashboard si authentifié
//     } else {
//       navigate("/"); // Redirige vers / si non authentifié
//     }
//   };

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
//       <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
//         {/* Burger menu pour mobile */}
//         <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
//           <MdMenu size={36} />
//         </button>

//         <motion.h1 className="text-2xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//           <div
//             className="flex items-center justify-end gap-2 md:justify-center  md:mt-8 md:mb-16"
//             onClick={handleLogoClick} // Ajoutez le gestionnaire de clic
//           >
//             <img
//               src={logo}
//               alt="Logo"
//               className="h-12 cursor-pointer" // Ajustez la taille selon vos besoins
//             />
//           </div>{" "}
//         </motion.h1>

//         <ul className="hidden md:flex space-x-4 items-center">
//           {menuItems.map((item, index) => (
//             <motion.li key={item} className={`text-white  cursor-pointer ${currentSection === index ? "font-bold" : ""}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} onClick={() => handleMenuClick(item)}>
//               {item}
//             </motion.li>
//           ))}
//           <button
//             onClick={() => {
//               handleLoginClick();
//             }}
//             className="w-full flex items-center md:justify-center justify-end  py-2 px-4 rounded-md text-red-400 hover:bg-gray-700"
//           >
//             {isAuthenticated ? <AiOutlineLogout className="mr-2" /> : <AiOutlineLogin className="mr-2" />}
//             <span>{isAuthenticated ? "Se déconnecter" : "Se connecter"}</span>
//           </button>
//         </ul>
//       </nav>
//     </header>
//   );
// };
// const MobileMenu = ({ isOpen, setIsOpen, menuItems, isAuthenticated, handleLoginClick }) => {
//   const navigate = useNavigate();
//   const handleLogoClick = () => {
//     if (isAuthenticated) {
//       navigate("/dashboard"); // Redirige vers /dashboard si authentifié
//     } else {
//       navigate("/"); // Redirige vers / si non authentifié
//     }
//   };
//   return (
//     <>
//       {/* Sidebar */}
//       <div className={`fixed inset-0 bg-gray-800 text-white flex flex-col p-4 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
//         <div className="flex flex-col justify-between h-full">
//           <div>
//             <div className="flex items-center justify-between mb-8">
//               <button className="text-white transition-transform duration-300 transform hover:scale-110" onClick={() => setIsOpen(false)}>
//                 <MdClose size={36} /> {/* Utiliser l'icône de fermeture en taille 36 */}
//               </button>
//               <div
//                 className="flex items-center justify-end gap-2 md:justify-center  md:mt-8 md:mb-16"
//                 onClick={handleLogoClick} // Ajoutez le gestionnaire de clic
//               >
//                 <img
//                   src={logo}
//                   alt="Logo"
//                   className="h-10 cursor-pointer" // Ajustez la taille selon vos besoins
//                 />{" "}
//                 <h2 className="text-2xl font-bold text-left cursor-pointer">MENU MOBILE</h2>
//               </div>
//             </div>
//             <ul className="flex flex-col space-y-4">
//               {menuItems.map((item) => (
//                 <li key={item} className="text-white cursor-pointer" onClick={() => setIsOpen(false)}>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="mt-auto">
//             <button
//               onClick={() => {
//                 handleLoginClick();
//                 setIsOpen(false);
//               }}
//               className="w-full flex items-center md:justify-center justify-end  py-2 px-4 rounded-md text-red-400 hover:bg-gray-700"
//             >
//               {isAuthenticated ? <AiOutlineLogout className="mr-2" /> : <AiOutlineLogin className="mr-2" />}
//               <span>{isAuthenticated ? "Se déconnecter" : "Se connecter"}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Overlay */}
//       {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>}
//     </>
//   );
// };

// const Hero = () => (
//   <section
//     className="h-screen flex items-center justify-center bg-cover bg-center text-white"
//     style={{ backgroundImage: `url(${require("../assets/wall.jpeg")})` }} // Ajout de l'image de fond
//   >
//     {" "}
//     <motion.div className="text-center bg-black bg-opacity-50 p-8 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
//       <h2 className="relative text-6xl font-bold mb-4">
//         MSXFIT™ <span className="hidden md:inline text-base md:absolute bottom-0">par Marsaleix Romain</span>
//       </h2>
//       <p className="text-xl">Transformez votre corps, transformez votre vie grâce à un entraînement personnalisé et motivant.</p>
//     </motion.div>
//   </section>
// );

// const About = () => (
//   <motion.section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
//     <motion.div className="absolute inset-0 bg-black opacity-50" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1.5 }} />

//     <motion.div
//       className="absolute inset-0"
//       initial={{ scale: 1.2, opacity: 0 }}
//       animate={{ scale: 1, opacity: 0.2 }}
//       transition={{ duration: 2 }}
//       style={{
//         // backgroundImage: `url(${require("../assets/")})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     />

//     <div className="container mx-auto px-6 py-20 relative z-10">
//       <motion.img src={require("../assets/profil.jpg")} alt="Coach" className="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-gray-100 shadow-lg" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />

//       <motion.h2 className="text-5xl font-bold mb-8 text-center text-white" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
//         Bienvenue sur MSXFIT
//       </motion.h2>

//       <motion.p className="text-xl max-w-3xl mx-auto text-center text-gray-200" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
//         Où la passion, la force, l'endurance et le progrès se rencontrent et sont conçus pour inspirer la grandeur. Entrez dans un monde où la santé et le bien-être sont au premier plan et où chaque entraînement est une étape vers la libération de votre plein potentiel.
//       </motion.p>

//       <motion.button className="mt-12 px-8 py-3 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-100 transition duration-300 mx-auto block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }}>
//         Commencez votre voyage
//       </motion.button>
//     </div>

//     <motion.div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1.5 }} />
//   </motion.section>
// );

// const Services = () => {
//   const services = [
//     { title: "Coaching Individuel", description: "Atteignez vos objectifs de mise en forme grâce à un entraînement personnalisé de haute qualité", image: require("../assets/indiv.jpeg") },
//     { title: "Coaching Duo", description: "Donnez un coup de pouce à votre entreprise avec une formation d'entreprise spécialement conçue", image: require("../assets/duo.jpeg") },
//     { title: "Coaching SmallGroup", description: "Élevez votre niveau de forme physique avec des entraînements de groupe intenses et motivants", image: require("../assets/small.webp") },
//     { title: "Programme d'entrainement", description: "Atteignez vos objectifs fitness où que vous soyez avec un programme d'entraînement en ligne personnalisé", image: require("../assets/programme.webp") },
//   ];

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gray-100 py-20">
//       <div className="container mx-auto px-6">
//         <motion.h2 className="text-4xl font-bold mb-12 text-center" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
//           Mes Services
//         </motion.h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {services.map((service, index) => (
//             <motion.div key={service.title} className="bg-white rounded-lg shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
//               <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
//                 <p>{service.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// const Testimonials = () => {
//   const testimonials = [
//     {
//       id: 1,
//       name: "Sophie Durand",
//       date: "15 mars 2024",
//       message: "Grâce à MSXFIT, j'ai retrouvé la forme et la confiance en moi. Romain est un coach exceptionnel !",
//       image: require("../assets/coach.jpg"),
//     },
//     {
//       id: 2,
//       name: "Thomas Lefebvre",
//       date: "2 avril 2024",
//       message: "Les séances sont intenses mais tellement gratifiantes. Je me sens plus fort chaque jour.",
//       image: require("../assets/coach.jpg"),
//     },
//     {
//       id: 3,
//       name: "Emma Martin",
//       date: "20 avril 2024",
//       message: "Le coaching en ligne est parfait pour mon emploi du temps chargé. Romain s'adapte à mes besoins.",
//       image: require("../assets/coach.jpg"),
//     },
//     {
//       id: 4,
//       name: "Lucas Dubois",
//       date: "5 mai 2024",
//       message: "MSXFIT a transformé ma vie. Je recommande à 100% !",
//       image: require("../assets/coach.jpg"),
//     },
//     {
//       id: 5,
//       name: "Chloé Petit",
//       date: "18 mai 2024",
//       message: "Les séances de small group sont super motivantes. On se dépasse ensemble !",
//       image: require("../assets/coach.jpg"),
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [testimonials.length]);

//   const TestimonialCard = ({ testimonial }) => (
//     <motion.div className="bg-gray-100 rounded-lg shadow-xl p-6 flex flex-col h-full" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//       <div className="flex items-center mb-4">
//         <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
//         <div>
//           <h4 className="font-semibold text-lg">{testimonial.name}</h4>
//           <p className="text-sm text-gray-500">{testimonial.date}</p>
//         </div>
//       </div>
//       <FaQuoteLeft className="text-3xl text-gray-300 mb-4" />
//       <p className="text-gray-700 flex-grow">{testimonial.message}</p>
//     </motion.div>
//   );

//   return (
//     <section className="py-20 bg-white">
//       <div className="container mx-auto px-4">
//         <motion.h2 className="text-4xl font-bold mb-12 text-center" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           Ce que disent nos clients
//         </motion.h2>
//         <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial) => (
//             <TestimonialCard key={testimonial.id} testimonial={testimonial} />
//           ))}
//         </div>
//         <div className="md:hidden">
//           <TestimonialCard testimonial={testimonials[currentIndex]} />
//         </div>
//       </div>
//     </section>
//   );
// };

// const Contact = () => (
//   <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white py-20">
//     <div className="container mx-auto px-6 text-center">
//       <motion.h2 className="text-4xl font-bold mb-8" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         Prêt à Commencer Votre Transformation ?
//       </motion.h2>
//       <motion.p className="text-xl mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
//         Contactez-moi dès aujourd'hui pour une planifier un rendez-vous et commencez votre voyage vers une meilleure santé et forme physique.
//       </motion.p>

//       <div className=" flex flex-col gap-8 mb-8 md:w-fit md:flex-row md:justify-center md:mx-auto md:mt-16">
//         <motion.a href="mailto:romain@marsaleix-training.com" className="bg-white text-gray-900 px-8  py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 " initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
//           Contactez-moi par email{" "}
//         </motion.a>

//         <motion.a href="tel:0789619164" className="bg-white text-gray-900 px-8  py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 " initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
//           Contactez-moi par téléphone{" "}
//         </motion.a>
//       </div>

//       <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="w-full max-w-lg mx-auto bg-white p-8  rounded-lg shadow-lg text-gray-900">
//         <h3 className="text-2xl font-bold mb-6">Ou remplissez le formulaire ci-dessous :</h3>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//               Nom
//             </label>
//             <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Votre nom" />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//               Email
//             </label>
//             <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Votre email" />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
//               Message
//             </label>
//             <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Votre message" />
//           </div>
//           <div className="flex items-center justify-between">
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
//               Envoyer
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   </section>
// );

// export default LandingP;

// // AVANT CHANGEMENT
