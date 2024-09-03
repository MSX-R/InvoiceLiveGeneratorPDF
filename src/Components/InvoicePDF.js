import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { margin: 10, padding: 10, border: "1px solid #ddd" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { borderBottom: "1px solid #ddd", fontWeight: "bold" },
  tableCell: { borderBottom: "1px solid #ddd", padding: 8 },
  total: { fontWeight: "bold", marginTop: 20 },
});

const InvoicePDF = ({ clientInfo, items, entrepriseInfo }) => {
  const totalAmount = items.reduce((total, item) => total + item.prixTotal, 0);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Facture</Text>
          <Text>Entreprise: {entrepriseInfo.nom}</Text>
          <Text>Directeur: {entrepriseInfo.directeur}</Text>
          <Text>
            Adresse: {entrepriseInfo.adresse}, {entrepriseInfo.codePostal} {entrepriseInfo.ville}
          </Text>
          <Text>Téléphone: {entrepriseInfo.telephone}</Text>
          <Text>Email: {entrepriseInfo.email}</Text>
        </View>
        <View style={styles.section}>
          <Text>Informations Client:</Text>
          <Text>
            Nom: {clientInfo.nom} {clientInfo.prenom}
          </Text>
          <Text>
            Adresse: {clientInfo.adresse}, {clientInfo.codePostal} {clientInfo.ville}
          </Text>
          <Text>Téléphone: {clientInfo.telephone}</Text>
        </View>
        <View style={styles.section}>
          <Text>Détails de la Facture:</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Service</Text>
              <Text style={styles.tableCell}>Quantité</Text>
              <Text style={styles.tableCell}>Prix Unitaire</Text>
              <Text style={styles.tableCell}>Prix Total</Text>
            </View>
            {items.map((item) => (
              <View key={item.service} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{(item.prix ? item.prix : 0).toFixed(2)}€</Text>
                <Text style={styles.tableCell}>{(item.prixTotal ? item.prixTotal : 0).toFixed(2)}€</Text>
              </View>
            ))}
          </View>

          <Text style={styles.total}>Total: {totalAmount.toFixed(2)}€</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
