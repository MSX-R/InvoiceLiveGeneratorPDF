import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import logo from "../assets/Noir.png"; // Importation du logo
import { conditionsGeneralesDeVente } from "../config/conditionsGeneralesDeVente"; // Importation des conditions générales

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
    fontSize: 8,
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
const InvoicePDF = ({ clientInfo, items, entrepriseInfo, fileName, validityDate }) => {
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
          <Text style={styles.title}> {fileName ? fileName.toUpperCase() : "Nom non spécifié"} N°XX</Text>
          <Image src={logo} style={styles.logo} /> {/* Ajout du logo */}
        </View>
        {/* Date d'émission et Validité de l'offre */}
        <View style={styles.dateSection}>
          <Text>Date d'émission: {today}</Text>
          <Text>OFFRE VALIDE JUSQU'AU: {validityDate}</Text>
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
          {Object.entries(conditionsGeneralesDeVente).map(([key, value]) => (
            <View key={key} style={styles.cgvParagraph}>
              <Text style={{ fontWeight: "bold" }}>{key}:</Text>
              {Array.isArray(value) ? (
                value.map((item, index) => (
                  <Text key={index} style={styles.cgvParagraph}>
                    {item}
                  </Text>
                ))
              ) : typeof value === "object" ? (
                Object.entries(value).map(([subKey, subValue]) => (
                  <View key={subKey} style={styles.cgvParagraph}>
                    <Text style={{ fontWeight: "bold" }}>{subKey}:</Text>
                    <Text>{subValue}</Text>
                  </View>
                ))
              ) : (
                <Text>{value}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Merci de votre confiance. Pour toute question ou demande, veuillez envoyer un email à l'adresse suivante : {entrepriseInfo.email}</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
