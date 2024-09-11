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
const InvoicePDF = ({ clientInfo, items, entrepriseInfo, name }) => {
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
          <Text style={styles.title}> {name.toUpperCase()} N°XX</Text>
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
            <Text style={styles.infoText}>SIRET: {entrepriseInfo.siret}</Text>
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
            En cas de retard de paiement, des pénalités peuvent être appliquées à hauteur de [X%] du montant dû par jour de retard, sans préjudice des frais supplémentaires engagés pour recouvrer la créance.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>3. Annulation et Remboursement: </Text>
            <Text style={{ fontWeight: "bold" }}>3.1 Annulation par le Client: </Text>
            Les annulations doivent être faites au moins 24 heures à l'avance. En cas de non-présentation ou d'annulation tardive, le Coach se réserve le droit de facturer la séance. Les prestations prépayées ne seront pas remboursées, sauf dans des cas exceptionnels approuvés par le Coach.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>3.2 Annulation par le Coach: </Text>
            En cas d'annulation par le Coach, une autre séance sera proposée au Client ou un remboursement sera effectué pour la séance annulée.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>4. Responsabilité et Assurance: </Text>
            Le Coach ne pourra être tenu responsable des blessures ou dommages corporels subis par le Client pendant les séances. Le Client est responsable de ses propres assurances et doit informer le Coach de toute condition médicale ou limitation avant le début des séances.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>5. Confidentialité: </Text>
            Les informations personnelles recueillies lors des séances seront traitées de manière confidentielle et ne seront pas divulguées à des tiers sans le consentement préalable du Client.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>6. Loi Applicable: </Text>
            Le présent contrat est régi par la législation en vigueur en [pays]. En cas de litige, les parties conviennent de se soumettre aux tribunaux compétents de [ville/pays].
          </Text>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Pour toute question concernant cette facture, veuillez contacter [Nom du Coach] à [adresse email].</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
