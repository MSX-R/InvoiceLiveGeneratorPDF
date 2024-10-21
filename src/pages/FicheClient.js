import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import CustomModal from "../Components/CustomModal";
import Chip from "../Components/Chip";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";
import ClientDetails from "../Components/ClientDetails";
import AddOfferModal from "../Components/AddOfferModal";
import PaymentStatusModal from "../Components/PaymentStatusModal";

const FicheClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [userOffres, setUserOffres] = useState([]); // Stocke les offres souscrites par l'utilisateur
  const [selectedOffer, setSelectedOffer] = useState(null); // Stocke l'offre choisie
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOfferModalOpen, setIsDeleteOfferModalOpen] = useState(false); // Nouveau état pour la modal de suppression d'offre
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const { categories, offres } = useOffresCoaching();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const formatDate3 = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Erreur : Aucun token disponible");
          return;
        }
        const response = await axios.get(`https://msxghost.boardy.fr/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setClient(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du client :", err);
        setErrorMessage("Erreur lors de la récupération du client.");
      }
    };

    const fetchUserOffres = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Erreur : Aucun token disponible");
          return;
        }
        const response = await axios.get(`https://msxghost.boardy.fr/api/user-offres/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUserOffres(response.data);
        if (response.data.length > 0) {
          setSelectedOffer(response.data[0]); // Sélectionner par défaut la première offre disponible
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des offres de l'utilisateur :", err);
        setErrorMessage("Erreur lors de la récupération des offres.");
      }
    };

    fetchClient();
    fetchUserOffres();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }

      await axios.delete(`https://msxghost.boardy.fr/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsModalOpen(false); // Fermer la modal de confirmation
      navigate("/dashboard/liste-clients"); // Rediriger vers la liste des clients après la suppression
    } catch (err) {
      console.error("Erreur lors de la suppression du client :", err);
      setErrorMessage("Erreur lors de la suppression du client.");
    }
  };

  const handleDeleteOffer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }

      await axios.delete(`https://msxghost.boardy.fr/api/user-offres/${selectedOffer.user_offre_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUserOffres((prevOffers) => prevOffers.filter((offer) => offer.user_offre_id !== selectedOffer.user_offre_id));
      setSelectedOffer(null);
      setIsDeleteOfferModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre :", err);
      setErrorMessage("Erreur lors de la suppression de l'offre.");
    }
  };

  const handleUpdatePaymentStatus = (newStatus, amount) => {
    if (selectedOffer) {
      const updatedOffer = {
        ...selectedOffer,
        etatPaiement: newStatus,
        montantRegle: amount,
      };
      setSelectedOffer(updatedOffer);
      // Ici, vous devriez également envoyer ces informations à votre API pour mettre à jour les données sur le serveur
    }
  };

  const handleOfferChange = (event) => {
    const offerId = event.target.value;
    const newSelectedOffer = userOffres.find((offer) => offer.user_offre_id === parseInt(offerId, 10));
    if (newSelectedOffer) {
      setSelectedOffer(newSelectedOffer);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (!client) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <button onClick={() => navigate("/dashboard/liste-clients")} className="absolute top-4 left-4 text-white hover:text-gray-200">
            <FaArrowLeft size={24} />
          </button>
          <button onClick={() => navigate(`/dashboard/modifier-profil-client/${id}`)} className="absolute top-4 right-16 text-white hover:text-gray-200">
            <FaEdit size={24} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="absolute top-4 right-4 text-white hover:text-gray-200">
            <FaTrash size={24} />
          </button>
        </div>

        <div className="relative px-6 -mt-24 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-center md:justify-between">
              <div className="flex flex-col items-center sm:flex-row sm:items-start">
                <img className="h-24 w-24 rounded-full border-4 object-cover border-gray-300 mb-4 sm:mb-0 sm:mr-4" src={client.profilePicture || require("../assets/coach.jpg")} alt={`${client.prenom} ${client.nom}'s profile`} />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {client.prenom} {client.nom}
                  </h1>
                  <p className="text-gray-600">{client.role || "coach sportif" || "Rôle non défini"}</p>
                </div>
              </div>
              <div className="text-xs font-normal hidden md:block">
                <i>Profil créé le {formatDate3(client.date_creation)}</i>
              </div>
            </div>

            <hr className="mt-8" />
            <div className="flex flex-col gap-4 my-8">
              {/* Liste déroulante pour changer l'offre sélectionnée */}
              <div className="mb-6">
                <label htmlFor="select-offer" className="block text-sm font-medium text-gray-700 mb-1">
                  Choisissez une offre souscrite :
                </label>
                <select
                  id="select-offer"
                  value={selectedOffer ? selectedOffer.user_offre_id : ""}
                  onChange={handleOfferChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {userOffres.map((offer) => (
                    <option key={offer.user_offre_id} value={offer.user_offre_id}>
                      {offer.offre_nom} - {offer.categorie_nom}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOffer && (
                <>
                  {/* Affichage des détails de l'offre */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Contrat choisi</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.offre_nom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Durée du contrat</p>
                      <p className="text-xl font-semibold text-gray-800">
                        {selectedOffer.duree_contrat || 0} {selectedOffer.duree_contrat === 1 ? "jour" : "jours"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nb. Séances de l'offre</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.nb_seances || 0}</p>
                    </div>
                  </div>

                  {/* LIGNE 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Tarif Total</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.prix_total || 0} €</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tarif Mensuel</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.prix_mensuel || 0} €</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">État de paiement</p>
                      <Chip label={selectedOffer.etatPaiement || "Non défini"} status={selectedOffer.etatPaiement || "Non défini"} />
                    </div>
                  </div>

                  {/* Bouton pour supprimer l'offre */}
                  <button onClick={() => setIsDeleteOfferModalOpen(true)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 mt-4">
                    Supprimer l'offre
                  </button>
                </>
              )}

              <button onClick={() => setIsAddOfferModalOpen(true)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 mt-4">
                Ajouter une offre
              </button>

              {selectedOffer && (
                <button onClick={() => setIsPaymentModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-4">
                  Modifier l'état de paiement
                </button>
              )}
            </div>

            <hr className="mt-8" />
            <ClientDetails client={client} />
          </div>
        </div>
      </div>
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." />
      <CustomModal isOpen={isDeleteOfferModalOpen} onClose={() => setIsDeleteOfferModalOpen(false)} onConfirm={handleDeleteOffer} title="Confirmer la Suppression de l'Offre" message="Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible." />
      <AddOfferModal isOpen={isAddOfferModalOpen} closeModal={() => setIsAddOfferModalOpen(false)} client={client} categories={categories} offres={offres} handleAddOffer={() => {}} />
      <PaymentStatusModal isOpen={isPaymentModalOpen} closeModal={() => setIsPaymentModalOpen(false)} currentStatus={selectedOffer?.etatPaiement} currentAmount={selectedOffer?.montantRegle} totalAmount={selectedOffer?.prix_total} onUpdatePaymentStatus={handleUpdatePaymentStatus} />
    </div>
  );
};

export default FicheClient;