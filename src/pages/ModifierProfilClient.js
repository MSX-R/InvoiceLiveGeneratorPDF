import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientsContext } from "../contexts/ClientsContext";
import axios from "axios";

const ModifierProfilClient = () => {
  const { id } = useParams();
  const { updateClient } = useContext(ClientsContext);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse1: "",
    adresse2: "",
    cp: "",
    ville: "",
    pays: "",
    naissance: "",
    contactUrgence: "",
    sexe: "",
    nbEnfant: 0,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientData(id);
  }, [id]);

  const fetchClientData = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://msxghost.boardy.fr/api/users/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const clientData = response.data;

        // Exclure le mot de passe, le rôle et la date de création
        const { password, role_id, date_creation, ...dataToUpdate } = clientData;

        setFormData(dataToUpdate);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du client:", error);
      setErrors({ general: "Erreur lors de la récupération des données du client." });
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validatePostalCode = (code) => {
    const regex = /^[0-9]{5}$/;
    return regex.test(code);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "nom":
      case "prenom":
      case "ville":
      case "pays":
      case "adresse1":
      case "contactUrgence":
        error = value ? "" : `Le champ ${field} est requis.`;
        break;
      case "email":
        error = !value ? "L'email est requis." : !validateEmail(value) ? "Le format de l'email est invalide." : "";
        break;
      case "telephone":
        error = !value ? "Le téléphone est requis." : !validatePhoneNumber(value) ? "Le format du téléphone est invalide." : "";
        break;
      case "cp":
        error = !value ? "Le code postal est requis." : !validatePostalCode(value) ? "Le format du code postal est invalide." : "";
        break;
      case "naissance":
        error = value ? "" : "La date de naissance est requise.";
        break;
      case "sexe":
        error = value ? "" : "Le sexe est requis.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) finalErrors[key] = errors[key];
    });

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`https://msxghost.boardy.fr/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        updateClient(id, formData);
        navigate("/liste-clients");
      }
    } catch (err) {
      setErrors({ general: "Erreur lors de la modification du profil." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Modification du Profil Client</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {Object.entries(formData).map(([key, value]) => {
            if (key === "id") return null; // Ne pas afficher l'ID

            if (key === "sexe") {
              return (
                <div key={key}>
                  <label className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <select value={value} onChange={(e) => handleInputChange(key, e.target.value)} className="border border-gray-300 p-3 rounded-md w-full">
                    <option value="">Sélectionnez un sexe</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                  {errors[key] && <p className="text-red-600">{errors[key]}</p>}
                </div>
              );
            }

            return (
              <div key={key}>
                <label className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input type={key === "naissance" ? "date" : key === "nbEnfant" ? "number" : "text"} value={value} onChange={(e) => handleInputChange(key, e.target.value)} className="border border-gray-300 p-3 rounded-md w-full" />
                {errors[key] && <p className="text-red-600">{errors[key]}</p>}
              </div>
            );
          })}

          <button type="submit" className="bg-blue-600 text-white p-3 rounded-md">
            Modifier le Profil
          </button>
          {errors.general && <p className="text-red-600">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
};

export default ModifierProfilClient;
