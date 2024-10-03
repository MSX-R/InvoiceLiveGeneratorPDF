import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

const Signup = () => {
  const { showNotification } = useNotification();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse1, setAdresse1] = useState("");
  const [adresse2, setAdresse2] = useState("");
  const [cp, setCp] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [naissance, setNaissance] = useState("");
  const [contactUrgence, setContactUrgence] = useState("");
  const [sexe, setSexe] = useState("");
  const [nbEnfant, setNbEnfant] = useState(0);

  // États pour gérer les erreurs
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^[0-9]{10}$/; // Numéro français de 10 chiffres
    return regex.test(phone);
  };

  const validatePostalCode = (code) => {
    const regex = /^[0-9]{5}$/; // Code postal français de 5 chiffres
    return regex.test(code);
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "nom":
        setNom(value);
        setErrors((prev) => ({ ...prev, nom: value ? "" : "Le nom est requis." }));
        break;
      case "prenom":
        setPrenom(value);
        setErrors((prev) => ({ ...prev, prenom: value ? "" : "Le prénom est requis." }));
        break;
      case "email":
        setEmail(value);
        setErrors((prev) => {
          if (!value) return { ...prev, email: "L'email est requis." };
          if (!validateEmail(value)) return { ...prev, email: "Le format de l'email est invalide." };
          return { ...prev, email: "" };
        });
        break;
      case "password":
        setPassword(value);
        setErrors((prev) => {
          if (!value) return { ...prev, password: "Le mot de passe est requis." };
          if (value.length < 6) return { ...prev, password: "Le mot de passe doit contenir au moins 6 caractères." };
          return { ...prev, password: "" };
        });
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        setErrors((prev) => {
          if (!value) return { ...prev, confirmPassword: "Veuillez confirmer votre mot de passe." };
          if (value !== password) return { ...prev, confirmPassword: "Les mots de passe ne correspondent pas." };
          return { ...prev, confirmPassword: "" };
        });
        break;
      case "telephone":
        setTelephone(value);
        setErrors((prev) => {
          if (!value) return { ...prev, telephone: "Le téléphone est requis." };
          if (!validatePhoneNumber(value)) return { ...prev, telephone: "Le format du téléphone est invalide." };
          return { ...prev, telephone: "" };
        });
        break;
      case "cp":
        setCp(value);
        setErrors((prev) => {
          if (!value) return { ...prev, cp: "Le code postal est requis." };
          if (!validatePostalCode(value)) return { ...prev, cp: "Le format du code postal est invalide." };
          return { ...prev, cp: "" };
        });
        break;
      case "ville":
        setVille(value);
        setErrors((prev) => ({ ...prev, ville: value ? "" : "La ville est requise." }));
        break;
      case "pays":
        setPays(value);
        setErrors((prev) => ({ ...prev, pays: value ? "" : "Le pays est requis." }));
        break;
      case "naissance":
        setNaissance(value);
        setErrors((prev) => ({ ...prev, naissance: value ? "" : "La date de naissance est requise." }));
        break;
      case "sexe":
        setSexe(value);
        setErrors((prev) => ({ ...prev, sexe: value ? "" : "Le sexe est requis." }));
        break;
      case "adresse1":
        setAdresse1(value);
        setErrors((prev) => ({ ...prev, adresse1: value ? "" : "L'adresse 1 est requise." }));
      break;
      case "adresse2":
        setAdresse2(value);
        setErrors((prev) => ({ ...prev, adresse2: value ? "" : "L'adresse 2 est requise." }));
      break;
      case "contactUrgence":
        setContactUrgence(value);
        setErrors((prev) => ({ ...prev, contactUrgence: value ? "" : "Le contact d'urgence est requis." }));
      break;
      default:
        break;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation finale avant envoi
    const finalErrors = {};
    if (!nom) finalErrors.nom = "Le nom est requis.";
    if (!prenom) finalErrors.prenom = "Le prénom est requis.";
    if (!email) finalErrors.email = "L'email est requis.";
    if (!validateEmail(email)) finalErrors.email = "Le format de l'email est invalide.";
    if (!password) finalErrors.password = "Le mot de passe est requis.";
    if (password.length < 6) finalErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    if (!confirmPassword) finalErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    if (confirmPassword !== password) finalErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (!telephone) finalErrors.telephone = "Le téléphone est requis.";
    if (!validatePhoneNumber(telephone)) finalErrors.telephone = "Le format du téléphone est invalide.";
    if (!cp) finalErrors.cp = "Le code postal est requis.";
    if (!validatePostalCode(cp)) finalErrors.cp = "Le format du code postal est invalide.";
    if (!ville) finalErrors.ville = "La ville est requise.";
    if (!pays) finalErrors.pays = "Le pays est requis.";
    if (!naissance) finalErrors.naissance = "La date de naissance est requise.";
    if (!sexe) finalErrors.sexe = "Le sexe est requis.";

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return; // Arrêter l'envoi si des erreurs sont présentes
    }

    try {
      const response = await axios.post("https://msxghost.boardy.fr/api/users", {
        nom,
        prenom,
        email,
        password,
        telephone,
        adresse1,
        adresse2,
        cp,
        ville,
        pays,
        naissance,
        contactUrgence: contactUrgence,
        sexe,
        nbEnfant: nbEnfant
      }, 
      {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 201) {
        showNotification("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        navigate("/"); // Redirection vers la page de login après inscription réussie
      }
    } catch (err) {
      setErrors({ general: "Erreur lors de l'inscription." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Inscription</h1>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          
          {/* Nom */}
          <label className="text-gray-700">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => handleInputChange("nom", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.nom && <p className="text-red-600">{errors.nom}</p>}

          {/* Prénom */}
          <label className="text-gray-700">Prénom</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => handleInputChange("prenom", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.prenom && <p className="text-red-600">{errors.prenom}</p>}

          {/* Email */}
          <label className="text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}

          {/* Mot de passe */}
          <label className="text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}

          {/* Confirmation du mot de passe */}
          <label className="text-gray-700">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}

          {/* Téléphone */}
          <label className="text-gray-700">Téléphone</label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => handleInputChange("telephone", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.telephone && <p className="text-red-600">{errors.telephone}</p>}

          {/* Adresse 1 */}
          <label className="text-gray-700">Adresse 1</label>
          <input
            type="text"
            value={adresse1}
            onChange={(e) => handleInputChange("adresse1", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.adresse1 && <p className="text-red-600">{errors.adresse1}</p>}

          {/* Adresse 2 */}
          <label className="text-gray-700">Adresse 2</label>
          <input
            type="text"
            value={adresse2}
            onChange={(e) => handleInputChange("adresse2", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.adresse2 && <p className="text-red-600">{errors.adresse2}</p>}

          {/* Code Postal */}
          <label className="text-gray-700">Code Postal</label>
          <input
            type="text"
            value={cp}
            onChange={(e) => handleInputChange("cp", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.cp && <p className="text-red-600">{errors.cp}</p>}

          {/* Ville */}
          <label className="text-gray-700">Ville</label>
          <input
            type="text"
            value={ville}
            onChange={(e) => handleInputChange("ville", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.ville && <p className="text-red-600">{errors.ville}</p>}

          {/* Pays */}
          <label className="text-gray-700">Pays</label>
          <input
            type="text"
            value={pays}
            onChange={(e) => handleInputChange("pays", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.pays && <p className="text-red-600">{errors.pays}</p>}

          {/* Date de Naissance */}
          <label className="text-gray-700">Date de Naissance</label>
          <input
            type="date"
            value={naissance}
            onChange={(e) => handleInputChange("naissance", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.naissance && <p className="text-red-600">{errors.naissance}</p>}

          {/* Contact d'Urgence */}
          <label className="text-gray-700">Contact d'Urgence</label>
          <input
            type="text"
            value={contactUrgence}
            onChange={(e) => handleInputChange("contactUrgence", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />
          {errors.contactUrgence && <p className="text-red-600">{errors.contactUrgence}</p>}

          {/* Sexe */}
          <label className="text-gray-700">Sexe</label>
          <select
            value={sexe}
            onChange={(e) => handleInputChange("sexe", e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          >
            <option value="">Sélectionnez un sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          {errors.sexe && <p className="text-red-600">{errors.sexe}</p>}

          {/* Nombre d'Enfants */}
          <label className="text-gray-700">Nombre d'Enfants</label>
          <input
            type="number"
            value={nbEnfant}
            onChange={(e) => setNbEnfant(e.target.value)}
            className="border border-gray-300 p-3 rounded-md"
          />

          {/* Bouton de Soumission */}
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-md">S'inscrire</button>
          {errors.general && <p className="text-red-600">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;