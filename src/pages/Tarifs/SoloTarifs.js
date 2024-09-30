import React from "react";

const SoloTarifs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Tarifs Séance SOLO</h1>
        <ul className="space-y-4">
          <li>Séance Unique: 70 €</li>
          <li>Pack de 10 Séances: 600 € (60 €/séance)</li>
          <li>Suivi 12 Semaines (24 séances): 1140 € (47,50 €/séance)</li>
          <li>Suivi 12 Semaines (36 séances): 1620 € (45 €/séance)</li>
          <li>Suivi 12 Semaines (48 séances): 2040 € (42,50 €/séance)</li>
          <li>Suivi 12 Semaines (60 séances): 2550 € (42,50 €/séance)</li>
        </ul>
      </div>
    </div>
  );
};

export default SoloTarifs;
