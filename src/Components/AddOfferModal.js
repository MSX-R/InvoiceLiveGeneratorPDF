import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Select from "react-select";
import { X } from "lucide-react";

const AddOfferModal = ({ isOpen, closeModal, client, offres, handleAddOffer }) => {
  const [selectedTypeOffre, setSelectedTypeOffre] = useState("");
  const [selectedOffre, setSelectedOffre] = useState(null);

  const handleTypeOffreChange = (selectedOption) => {
    setSelectedTypeOffre(selectedOption.value);
    setSelectedOffre(null);
  };

  const handleOffreChange = (selectedOption) => {
    setSelectedOffre(selectedOption.value);
  };

  const offerOptions = offres.map((offre) => ({
    value: offre.title,
    label: `${offre.title} | ${offre.duration}`,
  }));

  const getServiceOptions = () => {
    if (!selectedTypeOffre) return [];

    const selectedOffreType = offres.find((offre) => offre.title === selectedTypeOffre);
    if (!selectedOffreType) return [];

    const options = [];
    if (selectedOffreType.price.single) {
      options.push({
        value: selectedOffreType.price.single.name,
        label: `${selectedOffreType.price.single.name} - ${selectedOffreType.price.single.amount}€`,
      });
    }
    if (selectedOffreType.price.pack) {
      selectedOffreType.price.pack.forEach((pack) => {
        options.push({
          value: pack.name,
          label: `${pack.name} - ${pack.amount}€`,
        });
      });
    }
    if (selectedOffreType.price.followUp) {
      selectedOffreType.price.followUp.forEach((followUp) => {
        options.push({
          value: followUp.name,
          label: `${followUp.name} - ${followUp.amount}€`,
        });
      });
    }
    return options;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOffreType = offres.find((offre) => offre.title === selectedTypeOffre);
    let selectedOffreDetails;
  
    if (selectedOffreType.price.single && selectedOffreType.price.single.name === selectedOffre) {
      selectedOffreDetails = selectedOffreType.price.single;
    } else if (selectedOffreType.price.pack) {
      selectedOffreDetails = selectedOffreType.price.pack.find(pack => pack.name === selectedOffre);
    } else if (selectedOffreType.price.followUp) {
      selectedOffreDetails = selectedOffreType.price.followUp.find(followUp => followUp.name === selectedOffre);
    }
  
    handleAddOffer({
      clientId: client.id,
      typeOffre: selectedTypeOffre,
      offre: selectedOffre,
      offreDetails: selectedOffreDetails,
    });
    closeModal();
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
                      options={offerOptions}
                      value={selectedTypeOffre ? offerOptions.find((option) => option.value === selectedTypeOffre) : null}
                      onChange={handleTypeOffreChange}
                      placeholder="Sélectionner un type d'offre"
                      className="w-full"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Select
                      options={getServiceOptions()}
                      value={selectedOffre ? getServiceOptions().find((option) => option.value === selectedOffre) : null}
                      onChange={handleOffreChange}
                      placeholder="Sélectionner une offre"
                      className="w-full"
                      isDisabled={!selectedTypeOffre}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
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
