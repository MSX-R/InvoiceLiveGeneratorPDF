import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Appelle la fonction logout
        navigate("/"); // Redirige l'utilisateur vers la page de connexion après la déconnexion
    }, [logout, navigate]); // Utilisez useEffect pour que cela se déclenche lorsque le composant est monté

    return null; // Ce composant ne rend rien à l'écran
};

export default Logout;