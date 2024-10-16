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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const { categories, offres } = useOffresCoaching();

  // Nouveau état pour stocker les détails de l'offre choisie
  const [offreChoisie, setOffreChoisie] = useState(null);

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
    fetchClient();
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

      // Fermer la modal de confirmation
      setIsModalOpen(false);

      // Rediriger vers la liste des clients après la suppression
      navigate("/dashboard/liste-clients");
    } catch (err) {
      console.error("Erreur lors de la suppression du client :", err);
      setErrorMessage("Erreur lors de la suppression du client.");
    }
  };

  const handleUpdatePaymentStatus = (newStatus, amount) => {
    setClient((prevClient) => ({
      ...prevClient,
      etatPaiement: newStatus,
      montantRegle: amount,
    }));
    // Ici, vous devriez également envoyer ces informations à votre API
    // pour mettre à jour les données du client sur le serveur
  };

  const handleAddOffer = (offerData) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3); // Supposons que le contrat dure 3 mois // VOIR PR DETCTION CMENSUEL 3 , PACK 2 MOIS

    const updatedClient = {
      ...client,
      offreChoisie: offerData.offre,
      typeOffre: offerData.typeOffre,
      dateDebutContrat: startDate,
      dateFinContrat: endDate,
      offreDetails: offerData.offreDetails,
      seancesConsommees: 0, // Réinitialiser à 0 lors de l'ajout d'une nouvelle offre
    };

    console.log("Nouvelle offre ajoutée ou mise à jour pour le client :", updatedClient);

    setClient(updatedClient);
    setIsAddOfferModalOpen(false);

    // Ici, vous devriez également envoyer ces informations à votre API
    // pour mettre à jour les données du client sur le serveur
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
                <i>Profil crée le {formatDate3(client.date_creation)}</i>
              </div>
            </div>

            <hr className="mt-8" />
            <div className="flex flex-col gap-4 my-8">
              {/* LIGNE 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Contrat choisi</p>
                  <p className="text-xl font-semibold text-gray-800">{client.offreChoisie || "Aucune offre choisie"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Début contrat</p>
                  <p className="text-xl font-semibold text-gray-800">{formatDate(client.dateDebutContrat) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fin contrat</p>
                  <p className="text-xl font-semibold text-gray-800">{formatDate(client.dateFinContrat) || "-"}</p>
                </div>
              </div>

              {/* LIGNE 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Nb. Séances de l'offre</p>
                  <p className="text-xl font-semibold text-gray-800">{client.offreDetails ? client.nbseances : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Séances éffectuées</p>
                  <p className="text-xl font-semibold text-gray-800">{client.offreDetails ? `${client.seancesConsommees} / ${client.nbseances}` : "-"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Séances restantes</p>
                  <p className="text-xl font-semibold text-gray-800">{client.offreDetails ? client.seancesConsommees - client.nbseances : "-"}</p>
                </div>
              </div>

              {/* LIGNE 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Tarif</p>
                  <p className="text-xl font-semibold text-gray-800">{client.offreDetails ? `${client.offreDetails.amount} €` : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Réglement effectué</p>
                  <p className="text-xl font-semibold text-gray-800">{client.offreDetails ? (client.etatPaiement === "Partiel" ? `${client.montantRegle} / ${client.offreDetails.amount} €` : client.etatPaiement === "Réglé intégralement" ? `${client.offreDetails.amount} / ${client.offreDetails.amount} €` : `0 / ${client.offreDetails.amount} €`) : "-"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">État de paiement</p>
                  <Chip label={client.etatPaiement || "Non défini"} status={client.etatPaiement || "Non défini"} />
                </div>
              </div>
              <button onClick={() => setIsAddOfferModalOpen(true)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
                {client.offreChoisie ? "Modifier l'offre" : "Ajouter une offre"}
              </button>

              {client.offreChoisie && (
                <button onClick={() => setIsPaymentModalOpen(true)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                  Modifier l'état de paiement
                </button>
              )}
            </div>

            <hr className="mt-8" />

            <ClientDetails client={client} />

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Suivez-moi sur</h2>
              <div className="flex space-x-4">
                <Link to="https://www.facebook.com/" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.441 4.574L2.057 17.689C1.728 16.557 1.9 15.801 2.045 15.374v-.001C3.211 12.105 7.502 10 12 10c4.498 0 8.789 2.105 9.955 5.373.145.427.017 1.183-.312 2.315l-.464-1.126C20.744 18.286 22 15.064 22 12zM7 12a5 5 0 0110 0 5 5 0 01-10 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link to="https://www.instagram.com/" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link to="https://x.com/" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link to="https://github.com/" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} title="Confirmer la Suppression" message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible." />
      <AddOfferModal isOpen={isAddOfferModalOpen} closeModal={() => setIsAddOfferModalOpen(false)} client={client} categories={categories} offres={offres} handleAddOffer={handleAddOffer} /> <PaymentStatusModal isOpen={isPaymentModalOpen} closeModal={() => setIsPaymentModalOpen(false)} currentStatus={client.etatPaiement} currentAmount={client.montantRegle} totalAmount={client.offreDetails?.amount} onUpdatePaymentStatus={handleUpdatePaymentStatus} />
    </div>
  );
};

export default FicheClient;
