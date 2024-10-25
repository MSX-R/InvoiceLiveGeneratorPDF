const pool = require('../db'); // Pool de connexion à la base de données

class Seance {
  // Récupérer toutes les séances
  static async getAll() {
    try {
      const sql = 'SELECT * FROM Seance';
      const [seances] = await pool.query(sql);
      return seances;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des séances: ' + err.message);
    }
  }

  // Récupérer une séance par son ID
  static async getById(id) {
    try {
      const sql = 'SELECT * FROM Seance WHERE id = ?';
      const [results] = await pool.query(sql, [id]);
      if (results.length === 0) {
        throw new Error('Séance non trouvée');
      }
      return results[0];
    } catch (err) {
      throw new Error('Erreur lors de la récupération de la séance: ' + err.message);
    }
  }

  // Récupérer les séances par l'ID de l'offre de l'utilisateur (user_offre_id)
  static async getByUserOffreId(userOffreId) {
    try {
      const sql = 'SELECT * FROM Seance WHERE user_offre_id = ?';
      const [seances] = await pool.query(sql, [userOffreId]);
      return seances;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des séances pour l\'offre utilisateur: ' + err.message);
    }
  }

  // Créer une nouvelle séance
  static async create(userOffreId, date, description) {
    try {
      const sql = `INSERT INTO Seance (user_offre_id, date_seance, description) VALUES (?, ?, ?)`;
      const [result] = await pool.query(sql, [userOffreId, date, description]);
      return result.insertId;
    } catch (err) {
      throw new Error('Erreur lors de la création de la séance: ' + err.message);
    }
  }

  // Mettre à jour une séance par son ID
  static async updateById(id, date, description) {
    try {
      const sql = `UPDATE Seance SET description = ?, date_seance = ? WHERE id = ?`;
      const [result] = await pool.query(sql, [description, date, id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de la séance: ' + err.message);
    }
  }

  // Supprimer une séance par son ID
  static async deleteById(id) {
    try {
      const sql = 'DELETE FROM Seance WHERE id = ?';
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Erreur lors de la suppression de la séance: ' + err.message);
    }
  }
}

module.exports = Seance;