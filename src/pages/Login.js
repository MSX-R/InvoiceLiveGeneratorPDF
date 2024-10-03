// Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Vérifiez si l'utilisateur est déjà connecté au chargement du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/menu"); // Redirige vers le menu si connecté
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    if (!email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    try {
      const response = await axios.post("https://msxghost.boardy.fr/api/login", 
        { email, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.token) {
        // Inclure le rôle dans la fonction de connexion
        login(response.data.token, response.data.role); // Passer le token et le rôle
        navigate("/menu"); // Redirection vers le menu
      } else {
        setError("Identifiants incorrects.");
      }
    } catch (err) {
      setError("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Connexion</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-600"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-600"
          />
          {error && <p className="text-red-600 text-center">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;