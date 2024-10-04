import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importez useNavigate
import { useAuth } from "../../contexts/AuthContext"; // Importez le contexte d'authentification

const DropdownUser = ({ user }) => {
  const { userName, userRole, userPicture } = user; // Déstructuration de l'objet user
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth(); // Utilisez le contexte pour obtenir la fonction de déconnexion
  const navigate = useNavigate(); // Créez une instance de navigate

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout(); // Appel de la fonction de déconnexion
    navigate("/"); // Redirection vers la page de connexion
  };

  return (
    <div className="relative">
      <Link onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-4" to="#">
        <span className="hidden text-right lg:block flex flex-col justify-end">
          <span className="block text-sm font-medium text-black dark:text-white">{userName}</span>
          <span className="block text-xs">{userRole}</span>
        </span>

        {/* Affichage de l'image de l'utilisateur */}
        <img src={userPicture} alt={`${userName}'s profile`} className="h-12 w-12 rounded-full object-cover bg-gray-300" />

        <svg className="hidden fill-current sm:block" width="12" height="8" viewBox="0 0 12 8">
          <path d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z" />
        </svg>
      </Link>

      {/* Dropdown Start */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link to="/profile" className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                Mon Profil
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                Changer de Mot de Passe
              </Link>
            </li>
            <li>
              <button // Remplacez le lien par un bouton pour la déconnexion
                onClick={handleLogout}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
