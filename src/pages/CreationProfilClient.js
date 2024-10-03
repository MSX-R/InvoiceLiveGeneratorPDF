import React, { useState, useEffect } from "react";

const CreationProfilClient = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    birthDate: "",
    isMale: true, // True pour homme, False pour femme
  });
  const [errors, setErrors] = useState({});

  // Animation d'apparition au montage du composant
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fonction de validation des champs du formulaire
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.includes("@")) newErrors.email = "Un email valide est requis";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.address.trim()) newErrors.address = "L’adresse est requise";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Le code postal est requis";
    if (!formData.city.trim()) newErrors.city = "La ville est requise";
    if (!formData.birthDate) newErrors.birthDate = "La date de naissance est requise";
    return newErrors;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Création de l'objet "Nouveau Client"
      console.log("Nouveau client créé :", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        birthDate: "",
        isMale: true,
      });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  // Gestion du changement des champs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Fonction pour remplir le formulaire avec des données fictives
  const fillDummyData = () => {
    setFormData({
      firstName: "Romain",
      lastName: "Marsaleix",
      email: "echappe@gmail.com",
      phone: "0709010202",
      address: "360 rue alphonse",
      postalCode: "06400",
      city: "Cannes",
      birthDate: "1992-03-11",
      isMale: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className={`max-w-lg w-full bg-white p-8 rounded-3xl shadow-2xl transform transition-all duration-700 ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Créer un Profil Client</h1>

        {/* Bouton pour remplir les données fictives */}
        <button type="button" onClick={fillDummyData} className="w-full py-3 mb-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all focus:outline-none focus:ring-4 focus:ring-green-300 shadow-md mt-4">
          Remplir avec des données fictives
        </button>

        <form onSubmit={handleSubmit}>
          {/* Prénom */}
          <div className="relative mb-6">
            <label htmlFor="firstName" className="block text-gray-700 mb-2">
              Prénom
            </label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Nom */}
          <div className="relative mb-6">
            <label htmlFor="lastName" className="block text-gray-700 mb-2">
              Nom
            </label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div className="relative mb-6">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Téléphone
            </label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Adresse */}
          <div className="relative mb-6">
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Adresse
            </label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Code Postal */}
          <div className="relative mb-6">
            <label htmlFor="postalCode" className="block text-gray-700 mb-2">
              Code Postal
            </label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.postalCode ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
          </div>

          {/* Ville */}
          <div className="relative mb-6">
            <label htmlFor="city" className="block text-gray-700 mb-2">
              Ville
            </label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          {/* Date de Naissance */}
          <div className="relative mb-6">
            <label htmlFor="birthDate" className="block text-gray-700 mb-2">
              Date de Naissance
            </label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 border ${errors.birthDate ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-500 transition-all`} />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
          </div>

          {/* Sexe */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Sexe :</label>
            <label className="inline-flex items-center mr-6">
              <input type="radio" name="isMale" value="true" checked={formData.isMale} onChange={() => setFormData({ ...formData, isMale: true })} className="mr-1" />
              Homme
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="isMale" value="false" checked={!formData.isMale} onChange={() => setFormData({ ...formData, isMale: false })} className="mr-1" />
              Femme
            </label>
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md">
            Créer le profil
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreationProfilClient;
