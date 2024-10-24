// models/Role.js
const pool = require('../db');

class Role {
  // Méthode pour obtenir tous les rôles
  static async getAll() {
    try {
      const sql = 'SELECT id, nom FROM Role';
      const [roles] = await pool.query(sql);
      return roles; // Retourner la liste des rôles
    } catch (err) {
      console.error("Erreur lors de la récupération des rôles :", err);
      throw new Error("Erreur lors de la récupération des rôles");
    }
  }

  // Méthode pour obtenir un rôle spécifique par son ID
  static async getById(roleId) {
    try {
      const sql = 'SELECT id, nom FROM Role WHERE id = ?';
      const [roles] = await pool.query(sql, [roleId]);
      if (roles.length === 0) {
        throw new Error("Rôle non trouvé");
      }
      return roles[0]; // Retourner le rôle trouvé
    } catch (err) {
      console.error("Erreur lors de la récupération du rôle :", err);
      throw new Error("Erreur lors de la récupération du rôle");
    }
  }

  // Méthode pour créer un nouveau rôle (facultatif, dépend des besoins de votre application)
  static async create(nom) {
    try {
      const sql = 'INSERT INTO Role (nom) VALUES (?)';
      const [result] = await pool.query(sql, [nom]);
      return result.insertId; // Retourner l'ID du rôle créé
    } catch (err) {
      console.error("Erreur lors de la création du rôle :", err);
      throw new Error("Erreur lors de la création du rôle");
    }
  }

  // Méthode pour mettre à jour un rôle (facultatif, dépend des besoins)
  static async updateById(roleId, nom) {
    try {
      const sql = 'UPDATE Role SET nom = ? WHERE id = ?';
      const [result] = await pool.query(sql, [nom, roleId]);
      return result.affectedRows > 0; // Retourner un booléen si la mise à jour a réussi
    } catch (err) {
      console.error("Erreur lors de la mise à jour du rôle :", err);
      throw new Error("Erreur lors de la mise à jour du rôle");
    }
  }

  // Méthode pour supprimer un rôle par son ID (facultatif, dépend des besoins)
  static async deleteById(roleId) {
    try {
      const sql = 'DELETE FROM Role WHERE id = ?';
      const [result] = await pool.query(sql, [roleId]);
      return result.affectedRows > 0; // Retourner un booléen si la suppression a réussi
    } catch (err) {
      console.error("Erreur lors de la suppression du rôle :", err);
      throw new Error("Erreur lors de la suppression du rôle");
    }
  }
}

module.exports = Role;