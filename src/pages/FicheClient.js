import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import axios from "axios";
import { FaTrash, FaEllipsisH, FaArrowLeft, FaPlusCircle, FaMoneyBillAlt, FaCheckCircle, FaListUl } from "react-icons/fa";
import CustomModal from "../Components/CustomModal";
import Chip from "../Components/Chip";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";
import ClientDetails from "../Components/ClientDetails";
import moment from "moment";
import { motion } from "framer-motion";

registerLocale("fr", fr);

const FicheClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [userOffres, setUserOffres] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [seances, setSeances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOfferModalOpen, setIsDeleteOfferModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const { categories, offres } = useOffresCoaching();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddSeanceModalOpen, setIsAddSeanceModalOpen] = useState(false);
  const [isSeanceModalOpen, setIsSeanceModalOpen] = useState(false);
  const [isDeleteSeanceModalOpen, setIsDeleteSeanceModalOpen] = useState(false);
  const [seanceToDelete, setSeanceToDelete] = useState(null);
  const [newSeanceDescription, setNewSeanceDescription] = useState("");
  const [newSeanceDate, setNewSeanceDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [selectedSeanceToEdit, setSelectedSeanceToEdit] = useState(null);
  const [refreshUserOffres, setRefreshUserOffres] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("En attente");
  const [partialAmount, setPartialAmount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate3 = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const calculateEndDate = (startDate, durationInDays) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + durationInDays);
    return start;
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
          setSelectedOffer(response.data[0]);
          fetchSeances(response.data[0].user_offre_id);
        } else {
          setSelectedOffer(null);
          setSeances([]);
        }
      } catch (err) {
        setErrorMessage("Erreur lors de la récupération des offres.");
      }
    };

    fetchClient();
    fetchUserOffres();
  }, [id, refreshUserOffres]);

  useEffect(() => {
    // Met à jour l'état du paiement et le montant partiel quand une offre est sélectionnée
    if (selectedOffer) {
      setPaymentStatus(selectedOffer.statut_paiement || "En attente");
      setPartialAmount(selectedOffer.montant_paiement || 0);
    }
  }, [selectedOffer]);

  useEffect(() => {
    // Met à jour les valeurs de paiement lorsque la modal est ouverte
    if (isPaymentModalOpen && selectedOffer) {
      setPaymentStatus(selectedOffer.statut_paiement || "En attente");
      setPartialAmount(selectedOffer.montant_paiement || 0);
    }
  }, [isPaymentModalOpen, selectedOffer]);

  const fetchSeances = async (userOffreId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }
      const response = await axios.get(`https://msxghost.boardy.fr/api/seances/user-offre/${userOffreId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSeances(response.data);
    } catch (err) {
      setErrorMessage("Erreur lors de la récupération des séances.");
    }
  };

  // Fonction pour supprimer une séance
  const handleDeleteSeance = async (seanceId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }
      await axios.delete(`https://msxghost.boardy.fr/api/seances/${seanceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchSeances(selectedOffer.user_offre_id);
      setIsDeleteSeanceModalOpen(false);
    } catch (err) {
      setErrorMessage("Erreur lors de la suppression de la séance.");
    }
  };

  const handleDeleteSeanceClick = (seanceId) => {
    setSeanceToDelete(seanceId);
    setIsDeleteSeanceModalOpen(true);
  };

  // Fonction pour éditer une séance
  const handleEditSeance = (seance) => {
    setIsSeanceModalOpen(false);
    setNewSeanceDescription(seance.description);
    setNewSeanceDate(new Date(seance.date_seance));
    setSelectedSeanceToEdit(seance);
    setIsAddSeanceModalOpen(true);
  };

  // Mise à jour de la fonction handleAddSeance pour gérer les modifications
  const handleAddSeance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }

      const formattedDate = moment(newSeanceDate).format("YYYY-MM-DD HH:mm");

      // Vérifier si une séance est en cours d'édition
      if (selectedSeanceToEdit) {
        // Modifier la séance existante
        await axios.put(
          `https://msxghost.boardy.fr/api/seances/${selectedSeanceToEdit.id}`,
          {
            description: newSeanceDescription,
            date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSelectedSeanceToEdit(null);
      } else {
        await axios.post(
          `https://msxghost.boardy.fr/api/seances`,
          {
            userOffreId: selectedOffer.user_offre_id,
            description: newSeanceDescription,
            date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      fetchSeances(selectedOffer.user_offre_id);
      setNewSeanceDescription("");
      setNewSeanceDate("");
      setIsAddSeanceModalOpen(false);
    } catch (err) {
      setErrorMessage("Erreur lors de l'ajout ou de la modification de la séance.");
    }
  };

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

      setIsModalOpen(false);
      navigate("/dashboard/liste-clients");
    } catch (err) {
      setErrorMessage("Erreur lors de la suppression du client.");
    }
  };

  // Fonction pour gérer l'ajout d'une séance avec une description par défaut)
  const handleAddSeanceModalOpen = () => {
    setNewSeanceDescription(`Séance #${seances.length + 1}`);
    setNewSeanceDate("");
    setIsAddSeanceModalOpen(true);
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

      setIsDeleteOfferModalOpen(false);
      setRefreshUserOffres((prev) => !prev);
    } catch (err) {
      setErrorMessage("Erreur lors de la suppression de l'offre.");
    }
  };

  const handleUpdatePaymentStatus = () => {
    let amount = 0;
    if (paymentStatus === "Partiel") {
      if (partialAmount <= 0) {
        setErrorMessage("Le montant partiel doit être supérieur à 0");
        return;
      }
      amount = partialAmount;
    } else if (paymentStatus === "Réglé") {
      amount = selectedOffer.prix_total || 0;
    }

    updatePaymentStatusAPI(selectedOffer.user_offre_id, paymentStatus, amount);
    setIsPaymentModalOpen(false);
  };

  const updatePaymentStatusAPI = async (offerId, newStatus, amount) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }

      await axios.put(
        `https://msxghost.boardy.fr/api/user-offres/${offerId}`,
        {
          statut_paiement: newStatus,
          montant_paiement: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRefreshUserOffres((prev) => !prev); // Rafraîchir la liste des offres
    } catch (err) {
      setErrorMessage("Erreur lors de la mise à jour de l'état de paiement.");
    }
  };

  const handleOfferChange = (event) => {
    const offerId = event.target.value;
    const newSelectedOffer = userOffres.find((offer) => offer.user_offre_id === parseInt(offerId, 10));
    if (newSelectedOffer) {
      setSelectedOffer(newSelectedOffer);
      fetchSeances(newSelectedOffer.user_offre_id);
    }
  };

  const handleAddOffer = async () => {
    try {
      if (!selectedCategory || !selectedOffre) {
        setErrorMessage("Veuillez sélectionner une catégorie et une offre.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Erreur : Aucun token disponible");
        return;
      }

      await axios.post(
        `https://msxghost.boardy.fr/api/user-offres`,
        {
          user_id: client.id,
          categorie_offre_id: selectedCategory.value,
          offre_id: selectedOffre.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsAddOfferModalOpen(false);
      setRefreshUserOffres((prev) => !prev); // Rafraîchir la liste des offres
    } catch (err) {
      setErrorMessage("Erreur lors de l'ajout de l'offre.");
    }
  };

  const handleCategoryChange = (option) => {
    setSelectedCategory(option);
    // Réinitialiser l'offre sélectionnée lorsque la catégorie est changée
    setSelectedOffre(null);
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

  if (!client) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {/* ENTETE DE PAGE DYNAMIQUE */}
      <div className="bg-white p-1 md:p-4 rounded-md shadow-md mb-4 md:mb-8">
        <motion.h1 className="text-4xl sm:text-5xl font-bold text-center my-4 text-gray-800 uppercase" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Fiche Client
        </motion.h1>{" "}
      </div>
      <div className=" mx-auto bg-white rounded-md shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          {/* Boutons de navigation en haut du profil client */}
          <button onClick={() => navigate("/dashboard/liste-clients")} className="absolute top-4 left-4 text-white hover:text-gray-200">
            <FaArrowLeft size={24} />
          </button>
          {/* <button onClick={() => navigate(`/dashboard/modifier-profil-client/${id}`)} className="absolute top-4 right-16 text-white hover:text-gray-200">
            <FaEdit size={24} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="absolute top-4 right-4 text-white hover:text-gray-200">
            <FaTrash size={24} />
          </button> */}
        </div>

        <div className="relative px-6 -mt-24 mb-6">
          {/* PLACER LES 3 points ici pour acceder a modifier ou supprimer */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Menu à 3 points */}
            <div className="absolute top-4 right-12">
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700">
                  <FaEllipsisH size={20} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          navigate(`/dashboard/modifier-profil-client/${id}`);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center md:justify-between">
              <div className="flex flex-col items-center sm:flex-row sm:items-start">
                <img className="h-24 w-24 rounded-full border-4 object-cover border-gray-300 mb-4 sm:mb-0 sm:mr-4" src={client.profilePicture || require("../assets/coach.jpg")} alt={`${client.prenom} ${client.nom}'s profile`} />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {client.prenom} {client.nom}
                  </h1>
                  <p className="text-gray-600">{client.role_nom || "Rôle non défini"}</p>
                </div>
              </div>
              <div className="text-xs font-normal mt-8 hidden md:block">
                <i>Profil créé le {formatDate3(client.date_creation)}</i>
              </div>
            </div>

            <hr className="mt-8" />
            {/* Section pour gérer les offres de coaching du client */}
            <div className="flex flex-col  my-8">
              {selectedOffer && (
                <div className="mb-8">
                  <div className="mb-6">
                    <label htmlFor="select-offer" className="block text-sm font-medium text-gray-700 mb-1">
                      Choisissez une offre souscrite :
                    </label>
                    <select id="select-offer" value={selectedOffer ? selectedOffer.user_offre_id : ""} onChange={handleOfferChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {userOffres.map((offer) => (
                        <option key={offer.user_offre_id} value={offer.user_offre_id}>
                          {offer.offre_nom} - {offer.categorie_nom}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      <p className="text-sm text-gray-600">Tarif Total</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.prix_total || 0} €</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Nb. séances de l'offre</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.nb_seances || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date de début du contrat</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.date_creation ? formatDate(selectedOffer.date_creation) : formatDate(new Date())}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">État de paiement</p>
                      <Chip label={selectedOffer.statut_paiement || "Non défini"} status={selectedOffer.statut_paiement || "Non défini"} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Nb. séances effectuées</p>
                      <p className="text-xl font-semibold text-gray-800">
                        {seances.length} / {selectedOffer.nb_seances || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date de fin estimée du contrat</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.date_creation ? formatDate(calculateEndDate(selectedOffer.date_creation, selectedOffer.duree_contrat || 0)) : formatDate(calculateEndDate(new Date(), selectedOffer.duree_contrat || 0))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant payé</p>
                      <p className="text-xl font-semibold text-gray-800">{selectedOffer.montant_paiement || 0} €</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BOUTONS FICHE CLIENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bouton pour afficher les séances */}
                <button onClick={() => setIsSeanceModalOpen(true)} className="p-6 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition">
                  <div className="flex items-center">
                    <FaListUl size={24} className="mr-4" />
                    <span className="font-semibold text-xl">Historique séances</span>
                  </div>
                </button>
                {/* Bouton pour ajouter une offre */}
                <button onClick={() => setIsAddOfferModalOpen(true)} className="p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
                  <div className="flex items-center">
                    <FaPlusCircle size={24} className="mr-4" />
                    <span className="font-semibold text-xl">Ajouter une offre</span>
                  </div>
                </button>

                {/* Bouton pour valider une séance */}
                <button onClick={handleAddSeanceModalOpen} className="p-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition">
                  <div className="flex items-center">
                    <FaCheckCircle size={24} className="mr-4" />
                    <span className="font-semibold text-xl">Valider une séance</span>
                  </div>
                </button>

                {/* Bouton pour modifier l'état de paiement */}
                <button onClick={() => setIsPaymentModalOpen(true)} className="p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                  <div className="flex items-center">
                    <FaMoneyBillAlt size={24} className="mr-4" />
                    <span className="font-semibold text-xl">Modifier paiement</span>
                  </div>
                </button>

                {/* Bouton pour supprimer une offre (conditionnel) */}
                {selectedOffer && (
                  <button onClick={() => setIsDeleteOfferModalOpen(true)} className="p-6 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
                    <div className="flex items-center">
                      <FaTrash size={24} className="mr-4" />
                      <span className="font-semibold text-xl">Supprimer l'offre</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <hr className="mt-8" />
            <ClientDetails client={client} />
          </div>
        </div>
      </div>
      {/* Modal pour la suppression du client */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." confirmButtonColor="red" confirmButtonText="Supprimer" />
      {/* Modal pour la suppression d'une offre */}
      <CustomModal isOpen={isDeleteOfferModalOpen} onClose={() => setIsDeleteOfferModalOpen(false)} onConfirm={handleDeleteOffer} title="Confirmer la Suppression de l'Offre" message="Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible." confirmButtonColor="red" confirmButtonText="Supprimer" />
      {/* Modal pour l'ajout d'une offre */}
      <CustomModal isOpen={isAddOfferModalOpen} onClose={() => setIsAddOfferModalOpen(false)} onConfirm={handleAddOffer} title="Ajouter une Offre" message="Veuillez sélectionner une catégorie et une offre pour l'ajouter au client." confirmButtonColor="blue" confirmButtonText="Ajouter">
        <div className="mb-4">
          <Select options={categoryOptions} value={selectedCategory} onChange={handleCategoryChange} placeholder="Sélectionner une catégorie" className="w-full" />
        </div>
        <div className="mb-4">
          <Select options={getOffreOptions()} value={selectedOffre} onChange={(option) => setSelectedOffre(option)} placeholder="Sélectionner une offre" className="w-full" isDisabled={!selectedCategory} />
        </div>
      </CustomModal>
      {/* Modal pour modifier l'état de paiement */}
      <CustomModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onConfirm={handleUpdatePaymentStatus} title="Modifier l'état de paiement" message="Veuillez modifier l'état de paiement et le montant partiel si nécessaire." confirmButtonColor="blue" confirmButtonText="Modifier">
        <div className="mb-4">
          <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full p-2 border rounded">
            <option value="En attente">En attente</option>
            <option value="Partiel">Partiel</option>
            <option value="Réglé">Réglé</option>
          </select>
        </div>
        {paymentStatus === "Partiel" && (
          <div className="mb-4">
            <input type="number" value={partialAmount} onChange={(e) => setPartialAmount(Number(e.target.value))} placeholder="Montant réglé" className="w-full p-2 border rounded" min={0.01} max={selectedOffer?.prix_total || 0} step="0.01" />
            {partialAmount <= 0 && <p className="text-red-500 text-sm mt-1">Le montant partiel doit être supérieur à 0</p>}
          </div>
        )}
      </CustomModal>
      {/* Modal pour l'ajout/modification d'une séance */}
      <CustomModal
        isOpen={isAddSeanceModalOpen}
        onClose={() => {
          setIsAddSeanceModalOpen(false);
          setSelectedSeanceToEdit(null); // Réinitialiser en cas de fermeture
        }}
        onConfirm={handleAddSeance}
        title={selectedSeanceToEdit ? "Modifier une Séance" : "Valider une Séance"}
        message={selectedSeanceToEdit ? "Veuillez modifier les informations suivantes pour mettre à jour la séance." : "Veuillez remplir les informations suivantes pour valider une séance."}
        confirmButtonColor="blue"
        confirmButtonText={selectedSeanceToEdit ? "Modifier" : "Ajouter"}
      >
        <div className="mb-4">
          <label htmlFor="seance-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description de la séance
          </label>
          <textarea id="seance-description" value={newSeanceDescription} onChange={(e) => setNewSeanceDescription(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" />
        </div>

        <div className="mb-4">
          <label htmlFor="seance-date" className="block text-sm font-medium text-gray-700 mb-1">
            Date et heure de la séance
          </label>
          <DatePicker id="seance-date" selected={newSeanceDate ? new Date(newSeanceDate) : null} onChange={(date) => setNewSeanceDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="dd/MM/yyyy HH:mm" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholderText="Sélectionnez la date et l'heure" locale="fr" wrapperClassName="w-full" />
        </div>
      </CustomModal>
      {/* Modal pour afficher les séances */}
      <CustomModal isOpen={isSeanceModalOpen} onClose={() => setIsSeanceModalOpen(false)} title="Liste des séances réalisées" message="Voici la liste des séances réalisées pour cette offre." hideConfirmButton={true}>
        <div className="overflow-y-auto max-h-60">
          {seances.length > 0 ? (
            seances.map((seance, index) => (
              <div key={index} className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{seance.description}</p>
                  <p className="text-sm text-gray-600">Date: {formatDate3(seance.date_seance)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditSeance(seance)} className="text-blue-500 hover:text-blue-700 transition">
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteSeanceClick(seance.id)} className="text-red-500 hover:text-red-700 transition">
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune séance n'a été enregistrée.</p>
          )}
        </div>
      </CustomModal>
      {/* Modal de confirmation de suppression d'une séance */}
      <CustomModal isOpen={isDeleteSeanceModalOpen} onClose={() => setIsDeleteSeanceModalOpen(false)} onConfirm={() => handleDeleteSeance(seanceToDelete)} title="Confirmer la Suppression de la Séance" message="Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible." confirmButtonColor="red" confirmButtonText="Supprimer" />
    </>
  );
};

export default FicheClient;
