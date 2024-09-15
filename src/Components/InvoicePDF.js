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
  // Calculer le montant total pour chaque item
  const totalAmount = items.reduce((total, item) => {
    const quantity = item.service?.quantity || 0;
    const price = item.service?.prix || 0;
    return total + price * quantity;
  }, 0);

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
            {items.map((item, index) => {
              const quantity = item.service?.quantity || 0;
              const price = item.service?.prix || 0;
              const totalPrice = (price * quantity).toFixed(2);
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.service?.name}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{quantity}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{price.toFixed(2)}€</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{totalPrice}€</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.total}>Total TTC à régler: {totalAmount.toFixed(2)}€</Text>
        </View>
        {/* CGV */}
        <Text style={styles.cgvTitle}>Conditions Générales de Vente</Text>
        <View style={styles.cgvSection}>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>1. Objet du Contrat: </Text>
            Les présentes conditions générales régissent la vente de prestations de coaching sportif fournies par Marsaleix Romain Coach sportif (ci-après dénommé 'le Coach') au client (ci-après dénommé 'le Client'). Les prestations incluent, sans s'y limiter, des séances individuelles ou en groupe de coaching sportif et des programmes d'entraînement personnalisés, si "mentionnés" dans le details de la facture établie.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>2. Réservation et Paiement: </Text>
            <Text style={{ fontWeight: "bold" }}>2.1 Réservation: </Text>
            La réservation des séances peut se faire via les plateformes Train Me, Fitness Park, ou directement auprès du Coach. Une séance est confirmée uniquement après réception de l'acceptation du Coach. Les réservations non acceptées par le Coach ne seront pas prises en compte.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>2.2 Confirmation de Séance: </Text>
            Une séance est considérée comme confirmée uniquement après acceptation écrite par le Coach. Toute séance non confirmée par le Coach ne sera pas valide et ne pourra donner lieu à une réclamation de la part du Client.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>2.3 Paiement: </Text>
            <Text style={{ fontWeight: "bold" }}>Séances unitaires: </Text>
            Le paiement intégral doit être effectué le jour de la séance ou au plus tard 48 heures avant. Le non-paiement dans ce délai peut entraîner l'annulation de la séance.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>Pack de 12 semaines: </Text>
            Le paiement total doit être effectué à l'avance, au plus tard 7 jours avant le début du programme. Aucun remboursement ne sera accordé après le début du programme, sauf en cas de force majeure.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>3. Annulation et Report: </Text>
            <Text style={{ fontWeight: "bold" }}>3.1 Annulation: </Text>
            Toute annulation de séance doit être effectuée au moins 24 heures avant la séance prévue. Les annulations effectuées dans un délai inférieur à 24 heures seront facturées et ne seront pas remboursées.
            {"\n"}
            <Text style={{ fontWeight: "bold" }}>3.2 Report: </Text>
            Les séances peuvent être reportées une seule fois, avec un préavis minimum de 24 heures. Le report doit être accepté par le Coach et sera soumis à la disponibilité de ce dernier.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>4. Responsabilité: </Text>
            Le Coach ne pourra être tenu responsable des blessures ou accidents pouvant survenir lors des séances de coaching. Le Client est responsable de sa condition physique et doit consulter un médecin avant de commencer tout programme d'entraînement.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>5. Confidentialité: </Text>
            Les informations personnelles collectées auprès du Client seront traitées conformément aux lois en vigueur sur la protection des données personnelles. Ces informations ne seront pas divulguées à des tiers sans le consentement explicite du Client.
          </Text>
          <Text style={styles.cgvParagraph}>
            <Text style={{ fontWeight: "bold" }}>6. Litiges: </Text>
            Tout litige relatif à l'application ou à l'interprétation des présentes conditions générales sera soumis à la juridiction compétente du lieu de résidence du Coach.
          </Text>
        </View>
        {/* Footer */}
        <Text style={styles.footer}>Merci de votre confiance. Pour toute question ou demande, veuillez nous contacter à l'adresse suivante : {entrepriseInfo.email}</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
