// TermsModal.js
import React from "react";

const TermsModal = ({ show, handleClose }) => {
  if (!show) return null;

  // Conditions Générales de Vente en dur
  const conditionsGeneralesDeVente = {
    "1. Objet du Contrat": "Les présentes conditions générales régissent la vente de prestations de coaching sportif fournies par la société MARSALEIX ROMAIN coach sportif (ci-après dénommé 'le Coach') au client (ci-après dénommé 'le Client'). Les prestations incluent, sans s'y limiter, des séances individuelles ou en groupe de coaching sportif, des conseils nutritionnels, et des programmes d'entraînement personnalisés.",

    "2. Réservation et Paiement": {
      "2.1 Réservation": "La réservation des séances peut se faire via les plateformes Train Me, Fitness Park, ou directement auprès du Coach. Une séance est confirmée uniquement après réception de l'acceptation du Coach par tout moyen écrit. Les réservations non acceptées par le Coach ne seront pas prises en compte.",

      "2.2 Confirmation de Séance": "Une séance est considérée comme confirmée uniquement après acceptation écrite par le Coach. Toute séance non confirmée par le Coach ne sera pas valide et ne pourra donner lieu à une réclamation de la part du Client.",

      "2.3 Paiement": ["Séances unitaires : Le paiement intégral doit être effectué le jour de la séance, avant le début de celle-ci.", "Packs de séances : Le Client dispose de deux options de paiement :", "1. Le paiement intégral à la commande ;", "2. Le paiement en deux échéances : un premier acompte de 50% du montant total est dû le jour de la commande, et les 50% restants seront exigibles le 3ème jour du mois suivant.", "Offres 'À la semaine' : Le paiement intégral du montant total TTC est requis le jour de la commande, avant le début des prestations.", "Offres '12 semaines' : Un acompte correspondant à un tiers du montant total TTC est dû le jour de la commande. Les paiements restants devront être réglés en deux échéances égales, à chaque 3ème jour du mois suivant, conformément au calendrier établi par le Coach."],
      "2.4 Moyens de Paiement": "Les moyens de paiement acceptés sont les espèces et le virement bancaire (instantané de préférence). Tout paiement non reçu à l’échéance convenue entraînera une suspension des prestations jusqu’au règlement total.",

      "2.5 Retard de Paiement": "En cas de retard de paiement, des pénalités seront appliquées à hauteur de 10% du montant dû par semaine de retard, à compter de la date d'échéance. Le Coach se réserve le droit de suspendre les séances jusqu’au complet paiement des sommes dues.",

      "2.6 Politique de Remboursement": "Aucun remboursement ne sera accordé pour des séances déjà réalisées. Pour toute annulation d'un pack ou d'un abonnement non commencé, un remboursement partiel sera envisageable après déduction des frais administratifs de 15%.",
    },

    "3. Annulation, Perte et Report de Séance": {
      "3.1 Annulation par le Client": "Le Client doit notifier toute annulation ou demande de report au moins 24 heures avant la séance prévue, sans quoi celle-ci sera comptabilisée et considérée comme perdue. En cas d'absence non prévenue le jour de la séance, la séance sera due en totalité. Le report d’une séance est possible si le Coach est prévenu au moins 24 heures à l'avance ou pour une raison valable le jour même, avec l'accord exprès du Coach.",

      "3.2 Perte de la Séance": "Si le Client ne prévient pas de son absence dans les 24 heures précédant la séance ou pour une raison valable, la séance sera considérée comme perdue. Toutefois, si un créneau est disponible le jour même entre 08h et 20h, une séance de substitution pourra être proposée en fonction des disponibilités du Coach.",

      "3.3 Annulation par le Coach": "En cas d'annulation par le Coach, celui-ci proposera une nouvelle date pour la séance annulée ou un remboursement du montant payé, au choix du Client. Aucune indemnisation complémentaire ne pourra être réclamée par le Client.",

      "3.4 Cas de Force Majeure": "Aucune des parties ne pourra être tenue responsable en cas d’annulation ou de suspension de séance due à un cas de force majeure tel que défini par la loi (ex : catastrophes naturelles, pandémie, etc.). Dans ce cas, les séances pourront être reportées ou remboursées en accord avec le Client.",
    },

    "4. Engagements du Client": ["Respecter assidûment le planning des séances établi avec le Coach.", "Fournir un certificat médical de non contre-indication à la pratique du sport, valide lors de l'inscription à la salle de sport ou au début des prestations.", "Porter une tenue de sport adéquate, propre, comprenant une paire de chaussures réservée à l'entraînement en salle, ainsi qu'une serviette.", "Nettoyer son équipement après utilisation et respecter les règles d’hygiène imposées par le Coach et la salle de sport.", "Faire preuve de respect envers le Coach, le personnel de la salle et les autres adhérents.", "Suivre les recommandations du Coach concernant l'intensité de l'exercice et le respect des limites physiques du Client."],

    "5. Confidentialité": "Le Coach s'engage à respecter la confidentialité des informations personnelles et médicales du Client. Ces informations seront exclusivement utilisées dans le cadre de la prestation de services. Le Client a le droit de demander à tout moment la rectification ou suppression de ses données personnelles conformément à la réglementation en vigueur (RGPD).",

    "6. Responsabilité": "Le Coach a souscrit une assurance responsabilité civile professionnelle couvrant les dommages corporels résultant d'un encadrement sportif. Toutefois, le Coach ne pourra être tenu responsable des blessures ou dommages résultant d'une utilisation inappropriée du matériel non fourni par lui ou en cas de non-respect des consignes données par le Client. Le Client s’engage à être en bonne condition physique et mentale pour suivre les séances et informer le Coach de tout problème de santé, afin d'adapter les exercices en conséquence.",

    "7. Modifications des Conditions Générales": "Le Coach se réserve le droit de modifier les présentes conditions générales. Toute modification sera communiquée au Client par écrit et prendra effet pour les prestations à venir. Les modifications n’affecteront pas les prestations déjà en cours ou réglées avant la date de modification.",

    "8. Résiliation du Contrat": "Le contrat peut être résilié à tout moment par l’une ou l’autre des parties, sous réserve d’un préavis écrit de 15 jours. Toute résiliation par le Client sans respect de ce préavis entraînera la facturation des séances déjà planifiées dans ce délai, sauf cas de force majeure ou décision conjointe des parties.",

    "9. Litiges": "En cas de litige relatif à l'exécution ou l'interprétation des présentes, les parties s'engagent à rechercher une solution amiable. Si aucun accord n'est trouvé, le litige sera soumis à la juridiction compétente du lieu du siège social du Coach, sauf disposition légale contraire.",

    "10. Mentions Légales": "Conformément à la législation en vigueur, la TVA n'est pas applicable pour les prestations fournies par le Coach en tant qu'auto-entrepreneur.",

    "11. Contact": "Pour toute question relative aux présentes conditions générales ou aux prestations de coaching, le Client peut contacter le Coach à l'adresse suivante : msx.coach@gmail.com ou par téléphone au 07 89 61 91 64.",
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
