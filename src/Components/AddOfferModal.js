import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import axios from 'axios';

const AddOfferModal = ({ isOpen, closeModal, client, categories, offres, handleAddOffer }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setSelectedOffre(null);
  };

  const handleOffreChange = (selectedOption) => {
    setSelectedOffre(selectedOption);
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.nom,
  }));

  const getOffreOptions = () => {
    if (!selectedCategory) return [];

    return offres
      .filter((offre) => offre.categorie_offre_id === selectedCategory.value)
      .map((offre) => ({
        value: offre.id,
        label: `${offre.nom} | ${offre.prix_total}€`,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedCategory || !selectedOffre) return;
  
    // Trouver les détails de l'offre sélectionnée
    const selectedOffreDetails = offres.find((offre) => offre.id === selectedOffre.value);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }

      const response = await axios.post(
        'https://msxghost.boardy.fr/api/user-offres',
        {
          user_id: client.id,
          categorie_offre_id: selectedCategory.value,
          offre_id: selectedOffre.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status !== 201) {
        throw new Error('Erreur lors de la création de la relation utilisateur-offre');
      }
  
      // Appeler la fonction handleAddOffer pour mettre à jour le contexte local ou l'état local
      handleAddOffer({
        clientId: client.id,
        categorieId: selectedCategory.value,
        offreId: selectedOffre.value,
        offreDetails: selectedOffreDetails,
      });
  
      // Fermer la modal après la soumission
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'offre:', error);
      // Optionnel : Vous pouvez afficher une notification à l'utilisateur ici
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center mb-4">
                  <span>
                    Ajouter une offre pour {client.prenom} {client.nom}
                  </span>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                    <X size={20} />
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      placeholder="Sélectionner une catégorie"
                      className="w-full"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Select
                      options={getOffreOptions()}
                      value={selectedOffre}
                      onChange={handleOffreChange}
                      placeholder="Sélectionner une offre"
                      className="w-full"
                      isDisabled={!selectedCategory}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" disabled={!selectedCategory || !selectedOffre}>
                      Ajouter l'offre
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddOfferModal;
