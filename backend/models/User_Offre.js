const pool = require('../db');

class UserOffre {
  // Créer une nouvelle relation User-Offre-Catégorie
  static async create(user_id, categorie_offre_id, offre_id) {
    try {
      const sql = `
        INSERT INTO User_Offre (user_id, categorie_offre_id, offre_id)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.query(sql, [user_id, categorie_offre_id, offre_id]);
      return result.insertId;
    } catch (err) {
      throw new Error('Erreur lors de la création de la relation User-Offre-Catégorie: ' + err.message);
    }
  }

  // Récupérer toutes les relations User-Offre pour un utilisateur spécifique
  static async getByUserId(user_id) {
    try {
      const sql = `
        SELECT uo.*, co.nom AS categorie_nom, o.nom AS offre_nom
        FROM User_Offre uo
        JOIN Categorie_Offre co ON uo.categorie_offre_id = co.id
        JOIN Offre o ON uo.offre_id = o.id
        WHERE uo.user_id = ?
      `;
      const [results] = await pool.query(sql, [user_id]);
      return results;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des relations User-Offre: ' + err.message);
    }
  }

  // Supprimer une relation User-Offre
  static async deleteById(id) {
    try {
      const sql = 'DELETE FROM User_Offre WHERE id = ?';
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Erreur lors de la suppression de la relation User-Offre: ' + err.message);
    }
  }

  // Mettre à jour une relation User-Offre
  static async updateById(id, updatedData) {
    try {
      const fields = [];
      const values = [];

      // Dynamique : on crée les paires "clé = valeur"
      for (const key in updatedData) {
        if (updatedData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updatedData[key]);
        }
      }

      // Ajouter l'id à la fin des valeurs pour la clause WHERE
      values.push(id);

      if (fields.length === 0) {
        throw new Error("Aucune donnée à mettre à jour.");
      }

      const sql = `
        UPDATE User_Offre
        SET ${fields.join(", ")}
        WHERE id = ?
      `;
      const [result] = await pool.query(sql, values);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de la relation User-Offre: ' + err.message);
    }
  }
}

module.exports = UserOffre;