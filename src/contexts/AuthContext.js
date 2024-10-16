import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Initialisation des états à partir du localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [loggedUser, setloggedUser] = useState(() => {
    const storedUser = localStorage.getItem("loggedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Fonction pour vérifier la validité du token
    const checkTokenValidity = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token manquant");
        }

        // Appel à une API pour vérifier la validité du token
        await axios.get("https://msxghost.boardy.fr/api/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Si la requête réussit, nous considérons que le token est valide
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Token invalide ou expiré :", err);
        logout(); // Déconnecter l'utilisateur si le token est invalide
      }
    };

    // Vérification initiale lors du chargement de la page
    checkTokenValidity();

    // Définir un intervalle pour vérifier la validité du token toutes les 5 minutes
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 300000); // Vérification toutes les 5 minutes (300000 ms)

    // Nettoyer l'intervalle lors du démontage
    return () => clearInterval(interval);
  }, []);

  const login = (token, role, loggedUser) => {
    // Stocker les informations de l'utilisateur dans le localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    // Mettre à jour les états
    setIsAuthenticated(true);
    setUserRole(role);
    setloggedUser(loggedUser);
  };

  const logout = () => {
    // Supprimer toutes les informations du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedUser");
    // Réinitialiser les états
    setIsAuthenticated(false);
    setUserRole(null);
    setloggedUser(null);
  };

  const refreshUserRole = () => {
    setUserRole(localStorage.getItem("userRole"));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loggedUser, userRole, refreshUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};