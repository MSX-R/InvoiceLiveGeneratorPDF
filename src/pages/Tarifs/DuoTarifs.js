import React from "react";

const DuoTarifs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Tarifs Séance DUO</h1>
        <ul className="space-y-4">
          <li>Séance Unique: 90 € (45 €/personne)</li>
          <li>Pack de 10 Séances: 750 € (75 €/séance)</li>
          <li>Suivi 12 Semaines (24 séances): 1368 € (57 €/séance)</li>
          <li>Suivi 12 Semaines (36 séances): 1944 € (54 €/séance)</li>
          <li>Suivi 12 Semaines (48 séances): 2448 € (51 €/séance)</li>
          <li>Suivi 12 Semaines (60 séances): 3060 € (51 €/séance)</li>
        </ul>
      </div>
    </div>
  );
};

export default DuoTarifs;
