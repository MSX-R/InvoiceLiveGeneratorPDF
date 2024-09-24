import React, { useState } from "react";

// This array will represent RM values from RM1 to RM20, with IDs.
const RM_VALUES = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1, // Assigning IDs starting from 1
  label: `RM${index + 1}`,
}));

const TableauBerger = () => {
  const [selectedRM, setSelectedRM] = useState(RM_VALUES[9].id); // Default to RM10
  const [poids, setPoids] = useState("");
  const [rmValues, setRmValues] = useState([]);

  const calculRM = (newPoids) => {
    const repsForSelectedRM = selectedRM; // Using the selected RM as the number of repetitions

    // Ensure we have a valid poids
    if (newPoids) {
      const selectedRMWeight = newPoids / (1.0278 - 0.0278 * repsForSelectedRM);

      // Calculate the weights for RM1 to RM20 based on the selected RM weight
      const calculatedValues = RM_VALUES.map((rm) => {
        const equivalentWeight = selectedRMWeight * (1.0278 - 0.0278 * rm.id);
        return {
          label: rm.label,
          value: equivalentWeight,
        };
      });

      setRmValues(calculatedValues);
    } else {
      // Reset rmValues if poids is not valid
      setRmValues([]);
    }
  };

  const handleRMChange = (e) => {
    const newSelectedRM = parseInt(e.target.value);
    setSelectedRM(newSelectedRM);
    calculRM(poids); // Recalculate when RM changes

    // Log the selected RM ID
    const selectedRMData = RM_VALUES.find((rm) => rm.id === newSelectedRM);
    console.log("Selected RM ID:", selectedRMData.id); // Access the ID here
  };

  const handlePoidsChange = (e) => {
    const newPoids = e.target.value;
    setPoids(newPoids);
    calculRM(newPoids); // Recalculate when poids changes
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Calcul de RM (Répetition Maximale)</h1>

        <div className="flex mb-4">
          <div className="flex flex-1 mr-2">
            <select
              value={selectedRM}
              onChange={handleRMChange} // Call the new handler
              className="flex-1 p-4 border rounded-md"
            >
              {RM_VALUES.map((rm) => (
                <option key={rm.label} value={rm.id}>
                  {rm.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Charge"
              value={poids}
              onChange={handlePoidsChange} // Call the new handler
              className="flex-1 p-4 border rounded-md pr-10"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
          </div>
        </div>
        <button onClick={calculRM} className="w-full bg-green-600 text-white p-4 rounded-md hover:bg-green-700">
          Calculer
        </button>

        {rmValues.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-center">RM Correspondants:</h2>
            <table className="min-w-full border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Paramètre</th>
                  <th className="border px-4 py-2">Valeur (kg)</th>
                </tr>
              </thead>
              <tbody>
                {rmValues.map((rm) => (
                  <tr key={rm.label} className="text-center">
                    <td className="border px-4 py-2">{rm.label}</td>
                    <td className="border px-4 py-2">{rm.value.toFixed(2)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableauBerger;
