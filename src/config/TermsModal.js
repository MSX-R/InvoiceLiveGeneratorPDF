// TermsModal.js
import React from "react";

const TermsModal = ({ show, handleClose }) => {
  if (!show) return null;

  // Conditions Générales de Vente en dur
  const conditionsGeneralesDeVente = {
    "1. Objet du Contrat": "Les présentes conditions générales régissent la vente de prestations de coaching sportif fournies par [Nom de l'Entreprise] (ci-après dénommé 'le Coach') au client (ci-après dénommé 'le Client'). Les prestations incluent, sans s'y limiter, des séances individuelles ou en groupe de coaching sportif.",
    "2. Réservation et Paiement": {
      "2.1 Réservation": "La réservation des séances peut se faire via les plateformes Train Me, Fitness Park, ou directement auprès du Coach. Une séance est confirmée uniquement après réception de l'acceptation du Coach. Les réservations non acceptées par le Coach ne seront pas prises en compte.",
      "2.2 Paiement": ["Pour les séances unitaires ou packs, le paiement intégral est dû le jour de la séance ou de l'achat du pack.", "Pour les offres de type '12 semaines', un acompte équivalent à un tiers du montant total TTC est dû avant le début des prestations. Les paiements restants seront effectués les 3 de chaque mois suivant."],
      "2.3 Retard de Paiement": "En cas de retard de paiement, des pénalités peuvent être appliquées à hauteur de [X%] par mois de retard, à compter de la date d'échéance.",
    },
    "3. Annulation et Report": {
      "3.1 Annulation par le Client": "Le Client doit notifier toute annulation ou demande de report au moins 24 heures avant la séance prévue. En cas d'annulation dans les 24 heures précédant la séance, des frais d'annulation de 50% du montant de la séance seront appliqués. En cas d'absence non prévenue le jour de la séance, la séance est due en totalité.",
      "3.2 Annulation par le Coach": "En cas d'annulation par le Coach, celui-ci proposera une nouvelle date ou remboursera le montant payé, au choix du Client.",
    },
    "4. Confirmation de Séance": "La réservation des séances peut se faire via Train Me, Fitness Park, ou directement avec le Coach. Une séance est considérée comme confirmée uniquement après acceptation par le Coach. Toute séance non confirmée par le Coach ne sera pas considérée comme valide.",
    "5. Engagement du Client": ["Être en tenue adéquate pour s'entraîner.", "Nettoyer son équipement après utilisation.", "Être en état physique et mental de s'entraîner.", "Suivre les recommandations du Coach et respecter les horaires de rendez-vous fixés."],
    "6. Confidentialité": "Le Coach s'engage à respecter la confidentialité des informations personnelles et médicales du Client. Ces informations ne seront utilisées que dans le cadre de la prestation de services.",
    "7. Responsabilité": "Le Coach a souscrit une assurance couvrant les blessures en lien avec son encadrement et son matériel. Toutefois, le Coach ne pourra être tenu responsable des blessures ou dommages non liés directement à l'encadrement ou au matériel fourni.",
    "8. Modifications des Conditions Générales": "Le Coach se réserve le droit de modifier les présentes conditions générales. Toute modification sera communiquée au Client et prendra effet pour les prestations à venir.",
    "9. Litiges": "En cas de litige, les parties tenteront de résoudre le différend à l'amiable. À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents du lieu du siège social du Coach.",
    "10. Mentions Légales": "Conformément à la législation en vigueur, la TVA n'est pas applicable pour les prestations fournies par le Coach en tant qu'auto-entrepreneur.",
    "11. Contact": "Pour toute question relative aux présentes conditions générales, le Client peut contacter le Coach à l'adresse suivante : [Email de Contact] ou par téléphone au [Numéro de Téléphone].",
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center" onClick={handleClose}>
      <div
    className="bg-white rounded-lg shadow-lg max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-4 sm:mx-6 md:mx-8 lg:mx-12 my-16 sm:my-20 p-4 overflow-hidden relative"
    onClick={(e) => e.stopPropagation()} // Stop click event from closing modal
      >
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" aria-label="Close modal">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-semibold mb-4">Conditions Générales de Vente</h3>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          {Object.entries(conditionsGeneralesDeVente).map(([sectionKey, sectionValue]) => (
            <div key={sectionKey} className="mb-4">
              <h4 className="text-xl font-semibold mb-2">{sectionKey}</h4>
              {Array.isArray(sectionValue) ? (
                sectionValue.map((item, index) => (
                  <p key={index} className="text-gray-700 mb-2">
                    {item}
                  </p>
                ))
              ) : typeof sectionValue === "object" ? (
                Object.entries(sectionValue).map(([subKey, subValue]) => (
                  <div key={subKey} className="mb-4">
                    <h5 className="text-lg font-semibold mb-1">{subKey}</h5>
                    <p className="text-gray-700">{subValue}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">{sectionValue}</p>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-300 pt-4 mt-4 flex justify-end">
          <button onClick={handleClose} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
