import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import logo from "../assets/Noir.png"; // Importation du logo

// Définir les styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logo: {
    width: 100,
    height: "auto",
  },
  dateSection: {
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
  },
  clientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBox: {
    width: "48%",
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "2px solid #ddd",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
    padding: 5,
  },
  total: {
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  cgvTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  cgvSection: {
    marginTop: 10,
    fontSize: 10,
    color: "#444",
  },
  cgvParagraph: {
    marginBottom: 5,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
});

// Composant pour le document PDF
const InvoicePDF = ({ clientInfo, items, entrepriseInfo }) => {
  const totalAmount = items.reduce((total, item) => total + (item.service?.prixTotal || 0), 0);
  const today = new Date().toLocaleDateString("fr-FR");

  const calculateDueDate = () => {
    const today = new Date();
    const dueDate = new Date(today);

    if (items.some((item) => item.service?.type === "12weeks")) {
      const nextMonth = today.getMonth() + 1;
      const year = today.getFullYear();
      if (nextMonth > 11) {
        dueDate.setMonth(0);
        dueDate.setFullYear(year + 1);
      } else {
        dueDate.setMonth(nextMonth);
      }
      dueDate.setDate(3);
    } else if (items.some((item) => item.service?.type === "unit" || item.service?.type === "pack")) {
      dueDate.setDate(today.getDate());
    }

    return dueDate.toLocaleDateString("fr-FR");
  };

  const formattedDueDate = calculateDueDate();

  return (
    <Document>
      <Page style={styles.page}>
        {/* En-tête avec Logo */}
        <View style={styles.header}>
          <Text style={styles.title}>FACTURE N° XX</Text>
          <Image src={logo} style={styles.logo} /> {/* Ajout du logo */}
        </View>
        {/* Date d'émission et Date d'échéance */}
        <View style={styles.dateSection}>
          <Text>Date d'émission: {today}</Text>
          <Text>Date d'échéance: {formattedDueDate}</Text>
        </View>
        {/* Informations Client et Contractant */}
        <View style={styles.clientInfo}>
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>CONTRACTANT</Text>
            <Text style={styles.infoText}>{entrepriseInfo.nom}</Text>
            <Text style={styles.infoText}>{entrepriseInfo.dirigeant}</Text>
            <Text style={styles.infoText}>
              {entrepriseInfo.adresse}, {entrepriseInfo.codePostal} {entrepriseInfo.ville}
            </Text>
            <Text style={styles.infoText}>
              {entrepriseInfo.telephone} | {entrepriseInfo.email}
            </Text>
            {/* <Text style={styles.infoText}>{entrepriseInfo.email}</Text> */}
            <Text style={styles.infoText}>SIRET: {entrepriseInfo.siret}</Text>
            {/* <Text style={styles.infoText}>Carte Professionnelle: {entrepriseInfo.cartePro}</Text> */}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>CLIENT</Text>
            <Text style={styles.infoText}>
              {clientInfo.nom} {clientInfo.prenom}
            </Text>
            <Text style={styles.infoText}>
              {clientInfo.adresse}, {clientInfo.codePostal} {clientInfo.ville}
            </Text>
            <Text style={styles.infoText}>{clientInfo.telephone}</Text>
          </View>
        </View>
        {/* Détails de la Facture */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 16, marginTop: 32 }}>Détails de la Facture:</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Service</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Quantité</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Prix Unitaire</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Prix Total</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.service?.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.service?.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{(item.service?.prix || 0).toFixed(2)}€</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{(item.service?.prixTotal || 0).toFixed(2)}€</Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>Total TTC à régler: {totalAmount.toFixed(2)}€</Text>
        </View>
        {/* CGV */}
        <Text style={styles.cgvTitle}>Conditions Générales de Vente</Text>
        <View style={styles.cgvSection}>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>1. Objet du Contrat: </Text>
            Les présentes conditions générales régissent la vente de prestations de coaching sportif fournies par [Nom de l'Entreprise] (ci-après dénommé 'le Coach') au client (ci-après dénommé 'le Client'). Les prestations incluent, sans s'y limiter, des séances individuelles ou en groupe de coaching sportif.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>2. Réservation et Paiement: </Text>
            <Text style={{ fontWeight: "bold" }}>2.1 Réservation: </Text>
            La réservation des séances peut se faire via les plateformes Train Me, Fitness Park, ou directement auprès du Coach. Une séance est confirmée uniquement après réception de l'acceptation du Coach. Les réservations non acceptées par le Coach ne seront pas prises en compte.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>2.2 Paiement: </Text>
            Pour les séances unitaires ou packs, le paiement intégral est dû le jour de la séance ou de l'achat du pack. Pour les offres de type '12 semaines', un acompte équivalent à un tiers du montant total TTC est dû avant le début des prestations. Les paiements restants seront effectués les 3 de chaque mois suivant.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>2.3 Retard de Paiement: </Text>
            En cas de retard de paiement, des pénalités peuvent être appliquées à hauteur de [X%] par mois de retard, à compter de la date d'échéance.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>3. Annulation et Report: </Text>
            <Text style={{ fontWeight: "bold" }}>3.1 Annulation par le Client: </Text>
            Le Client doit notifier toute annulation ou demande de report au moins 24 heures avant la séance prévue. En cas d'annulation dans les 24 heures précédant la séance, des frais d'annulation de 50% du montant de la séance seront appliqués. En cas d'absence non prévenue le jour de la séance, la séance est due en totalité.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>3.2 Annulation par le Coach: </Text>
            En cas d'annulation par le Coach, celui-ci proposera une nouvelle date ou remboursera le montant payé, au choix du Client.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>4. Confirmation de Séance: </Text>
            La réservation des séances peut se faire via Train Me, Fitness Park, ou directement avec le Coach. Une séance est considérée comme confirmée uniquement après acceptation par le Coach. Toute séance non confirmée par le Coach ne sera pas considérée comme valide.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>5. Engagement du Client: </Text>
            Être en tenue adéquate pour s'entraîner. Nettoyer son équipement après utilisation. Être en état physique et mental de s'entraîner. Suivre les recommandations du Coach et respecter les horaires de rendez-vous fixés.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>6. Confidentialité: </Text>
            Le Coach s'engage à respecter la confidentialité des informations personnelles et médicales du Client. Ces informations ne seront utilisées que dans le cadre de la prestation de services.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>7. Responsabilité: </Text>
            Le Coach a souscrit une assurance couvrant les blessures en lien avec son encadrement et son matériel. Toutefois, le Coach ne pourra être tenu responsable des blessures ou dommages non liés directement à l'encadrement ou au matériel fourni.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>8. Modifications des Conditions Générales: </Text>
            Le Coach se réserve le droit de modifier les présentes conditions générales. Toute modification sera communiquée au Client et prendra effet pour les prestations à venir.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>9. Litiges: </Text>
            En cas de litige, les parties tenteront de résoudre le différend à l'amiable. À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents du lieu du siège social du Coach.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>10. Mentions Légales: </Text>
            Conformément à la législation en vigueur, la TVA n'est pas applicable pour les prestations fournies par le Coach en tant qu'auto-entrepreneur.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>11. Contact: </Text>
            Pour toute question relative aux présentes conditions générales, le Client peut contacter le Coach à l'adresse suivante : [Email de Contact] ou par téléphone au [Numéro de Téléphone].
          </Text>
        </View>
        {/* Mentions Légales */}
        <View style={styles.footer}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Mentions Légales:</Text> TVA non applicable, article 293 B du CGI
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Pénalités de Retard:</Text> En cas de non-paiement, des frais de retard seront appliqués. Pour plus de détails, veuillez consulter les conditions générales.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
