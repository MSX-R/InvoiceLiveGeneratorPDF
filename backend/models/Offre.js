const pool = require('../db');

class Offre {
  static async getAll() {
    try {
      const sql = 'SELECT * FROM Offre';
      const [offres] = await pool.query(sql);
      return offres;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des offres: ' + err.message);
    }
  }

  static async getById(id) {
    try {
      const sql = 'SELECT * FROM Offre WHERE id = ?';
      const [results] = await pool.query(sql, [id]);
      if (results.length === 0) {
        throw new Error('Offre non trouvée');
      }
      return results[0];
    } catch (err) {
      throw new Error('Erreur lors de la récupération de l\'offre: ' + err.message);
    }
  }

  static async getByCategorieId(categorieId) {
    try {
      const sql = 'SELECT * FROM Offre WHERE categorie_offre_id = ?';
      const [offres] = await pool.query(sql, [categorieId]);
      return offres;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des offres pour la catégorie: ' + err.message);
    }
  }

  static async create(categorieOffreId, nom, type, dureeContrat, nbSeances, prixTotal, prixMensuel, prixSemaine, prixSeance, offrePromotionnelle) {
    try {
      const sql = `INSERT INTO Offre (categorie_offre_id, nom, type, duree_contrat, nb_seances, prix_total, prix_mensuel, prix_semaine, prix_seance, offre_promotionnelle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.query(sql, [categorieOffreId, nom, type, dureeContrat, nbSeances, prixTotal, prixMensuel, prixSemaine, prixSeance, offrePromotionnelle]);
      return result.insertId;
    } catch (err) {
      throw new Error('Erreur lors de la création de l\'offre: ' + err.message);
    }
  }
}

module.exports = Offre;