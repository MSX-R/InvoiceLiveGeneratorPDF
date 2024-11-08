import React from "react";
import { motion } from "framer-motion";
import { Calendar, Package, LineChart, ClipboardCheck, FileText, User, Camera, Dumbbell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import profilPicture from "../assets/coach.jpg";

const DashboardCard = ({ icon: Icon, title, description = "", delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.1, duration: 0.5 }} whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }} className="bg-gray-800 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    <Icon className="w-8 h-8 text-cyan-400 mb-3" />
    <span className="text-gray-200 font-medium text-sm text-center">{title}</span>
    {description && <span className="text-gray-400 text-xs mt-2 text-center">{description}</span>}
  </motion.div>
);

const ProfileHeader = () => {
  const { isAuthenticated, refreshUserRole, logout, isAdmin, loggedUser } = useAuth();
  console.log(loggedUser);
  return (
    <div className="flex justify-between items-center mb-12">
      <motion.div className="flex flex-col" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-bold text-white mb-2 ">{loggedUser.prenom}</h1>
        <h1 className="text-4xl font-bold text-white mb-2 ">{loggedUser.nom}</h1>
        <p className="text-cyan-400 text-sm">{loggedUser.role_nom}</p>
        <p className="text-gray-400 text-sm">Séances: 12/24</p>
        {/* <p className="text-gray-400">
        Gérez votre programme d'entraînement
      </p> */}
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-cyan-400">
          {/* <img src="/api/placeholder/48/48" alt="Profile" className="w-full h-full object-cover" /> */}
          <img src={profilPicture} alt="userpicture" className=" rounded-full  object-cover border-2 border-gray-700" />
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header with Profile */}
      <ProfileHeader />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <DashboardCard icon={Calendar} title="Planning d'entraînement" delay={0} />
        <DashboardCard icon={Package} title="Équipements à disposition" delay={1} />
        <DashboardCard icon={Dumbbell} title="Programme d'entraînement" delay={2} />
        <DashboardCard icon={LineChart} title="Performance" description="Évolution des RM par exercice" delay={3} />
        <DashboardCard icon={ClipboardCheck} title="Bilan" description="Début, milieu et fin de programme" delay={4} />
        <DashboardCard icon={FileText} title="Documents" description="Questionnaires, devis, factures, contrats" delay={5} />
        <DashboardCard icon={User} title="Profil" delay={6} />
        <DashboardCard icon={Camera} title="Suivi photographique" delay={7} />
      </div>

      {/* Call to Action */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center">
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300">COMMENCER L'ESSAI GRATUIT</button>
        <p className="text-gray-500 mt-3 text-sm">Sans engagement, résiliable à tout moment.</p>
      </motion.div>

      {/* Bottom Tagline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 text-center">
        <p className="text-xl text-white">
          Parce qu'il ne suffit <span className="text-gray-400">pas</span> de <span className="text-cyan-400">créer d'excellents programmes</span>.
        </p>
        <p className="text-xl text-white mt-2">
          Votre <span className="text-cyan-400">logiciel de coaching</span> doit aussi vous aider à <span className="text-cyan-400">les vendre</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
