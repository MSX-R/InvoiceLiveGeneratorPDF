import React from "react";

const SmallGroupTarifs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Tarifs Small Group</h1>
        <ul className="space-y-4">
          <li>Séance Unique: 120 € (pour 3 à 5 personnes)</li>
          <li>Pack de 10 Séances: 1000 €</li>
          <li>Coût par personne pour 10 séances (3 pers.): 333,33 €</li>
          <li>Coût par personne pour 10 séances (4 pers.): 250 €</li>
          <li>Coût par personne pour 10 séances (5 pers.): 200 €</li>
        </ul>
      </div>
    </div>
  );
};

export default SmallGroupTarifs;
