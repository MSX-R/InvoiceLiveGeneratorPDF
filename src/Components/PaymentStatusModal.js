import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const PaymentStatusModal = ({ isOpen, closeModal, currentStatus, currentAmount, totalAmount, onUpdatePaymentStatus }) => {
  const [status, setStatus] = useState(currentStatus || "En attente de paiement");
  const [partialAmount, setPartialAmount] = useState(currentAmount || 0);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(currentStatus || "En attente de paiement");
    setPartialAmount(currentAmount || 0);
  }, [currentStatus, currentAmount]);

  const handleSubmit = () => {
    if (status === "Partiel" && partialAmount <= 0) {
      setError("Le montant partiel doit être supérieur à 0");
      return;
    }

    let amount = 0;
    if (status === "Partiel") {
      amount = partialAmount;
    } else if (status === "Réglé intégralement") {
      amount = totalAmount;
    }
    onUpdatePaymentStatus(status, amount);
    closeModal();
  };

  const handlePartialAmountChange = (e) => {
    const value = Number(e.target.value);
    setPartialAmount(value);
    if (value <= 0) {
      setError("Le montant partiel doit être supérieur à 0");
    } else {
      setError("");
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Modifier l'état de paiement
                </Dialog.Title>
                <div className="mt-4">
                  <div className="mb-4">
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
                      <option value="En attente">En attente</option>
                      <option value="Partiel">Partiel</option>
                      <option value="Réglé">Réglé</option>
                    </select>
                  </div>
                  {status === "Partiel" && (
                    <div className="mb-4">
                      <input type="number" value={partialAmount} onChange={handlePartialAmountChange} placeholder="Montant réglé" className="w-full p-2 border rounded" min={0.01} max={totalAmount} step="0.01" />
                      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                  )}
                  <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleSubmit} disabled={status === "Partiel" && partialAmount <= 0}>
                    Mettre à jour
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentStatusModal;
