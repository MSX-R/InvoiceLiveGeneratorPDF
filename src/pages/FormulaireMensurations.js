// Components/FormulaireMensurations.js
import React, { useState } from "react";

const FormulaireMensurations = () => {
  const [mensurations, setMensurations] = useState({
    cou: "",
    poitrine: "",
    taille: "",
    cuisse: "",
  });

  const handleChange = (e) => {
    setMensurations({ ...mensurations, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Formulaire de Mensurations</h1>
        <form className="space-y-4">
          {Object.keys(mensurations).map((key) => (
            <div key={key}>
              <label className="block font-semibold mb-2">{key.charAt(0).toUpperCase() + key.slice(1)} (cm)</label>
              <input type="number" name={key} value={mensurations[key]} onChange={handleChange} className="w-full p-4 border rounded-md" />
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700">
            Enregistrer les mensurations
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormulaireMensurations;
