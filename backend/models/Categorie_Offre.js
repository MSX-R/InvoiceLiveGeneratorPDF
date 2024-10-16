const pool = require('../db');

class CategorieOffre {
  static async getAll() {
    try {
      const sql = 'SELECT * FROM Categorie_Offre';
      const [categories] = await pool.query(sql);
      return categories;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des catégories d\'offres: ' + err.message);
    }
  }

  static async getById(id) {
    try {
      const sql = 'SELECT * FROM Categorie_Offre WHERE id = ?';
      const [results] = await pool.query(sql, [id]);
      if (results.length === 0) {
        throw new Error('Catégorie non trouvée');
      }
      return results[0];
    } catch (err) {
      throw new Error('Erreur lors de la récupération de la catégorie d\'offres: ' + err.message);
    }
  }

  static async create(nom, type, duree, description, couleur, icone) {
    try {
      const sql = `INSERT INTO Categorie_Offre (nom, type, duree, description, couleur, icone) VALUES (?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.query(sql, [nom, type, duree, description, couleur, icone]);
      return result.insertId;
    } catch (err) {
      throw new Error('Erreur lors de la création de la catégorie d\'offres: ' + err.message);
    }
  }

  static async updateById(id, nom, type, duree, description, couleur, icone) {
    try {
      const sql = `UPDATE Categorie_Offre SET nom = ?, type = ?, duree = ?, description = ?, couleur = ?, icone = ? WHERE id = ?`;
      const [result] = await pool.query(sql, [nom, type, duree, description, couleur, icone, id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de la catégorie d\'offres: ' + err.message);
    }
  }

  static async deleteById(id) {
    try {
      const sql = 'DELETE FROM Categorie_Offre WHERE id = ?';
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Erreur lors de la suppression de la catégorie d\'offres: ' + err.message);
    }
  }
}

module.exports = CategorieOffre;