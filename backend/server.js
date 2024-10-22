const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const User = require('./models/User');
const Offre = require('./models/Offre');
const CategorieOffre = require('./models/Categorie_Offre');
const UserOffres = require('./models/User_Offre');
const Seance = require('./models/Seance');
const Role = require('./models/Role');

const fs = require('fs');
const logStream = fs.createWriteStream('msxghostlogs.txt', { flags: 'a' });
console.log = function (message) {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour analyser les requêtes en JSON
app.use(express.json());

// Utilisation de CORS
app.use(cors()); // Ajoutez cette ligne pour activer CORS

// Fonction pour hacher le mot de passe
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Fonction pour créer un token
const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

// Middleware pour vérifier le token et l'authentification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  // Récupérer le token à partir du format "Bearer <token>"
  const token = authHeader.split(' ')[1]; // Sépare le mot "Bearer" du token

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les informations utilisateur à la requête
    next(); // Continuer à la prochaine route
  } catch (err) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

// Route pour les administrateurs (role_id = 1)
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 1) {
    return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
  next();
};

// Route pour la racine ("/")
app.get('/', (req, res) => {
  res.send('Backend API en cours d\'exécution');
});

// Route pour la racine ("/api")
app.get('/api', (req, res) => {
  res.send('Backend API en cours d\'exécution');
});

// Route pour ajouter un utilisateur (inscription)
app.post('/api/users', async (req, res) => {
  const {
    nom, prenom, email, password, telephone, adresse1, adresse2,
    cp, ville, pays, naissance, contactUrgence, sexe, nbEnfant
  } = req.body;

  // Valider que tous les champs obligatoires sont remplis
  if (!nom || !prenom || !email || !password || !telephone || !cp || !ville || !pays || !naissance) {
    return res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
  }

  try {
    // Vérifier si l'email existe déjà
    const checkEmailSql = 'SELECT id FROM User WHERE email = ?';
    const [existingUsers] = await pool.query(checkEmailSql, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "L'adresse email est déjà utilisée." }); // Conflit - l'email existe déjà
    }

    // Hachage du mot de passe
    const hashedPassword = hashPassword(password);

    // Créer un nouvel utilisateur
    const user = new User(
      null, nom, prenom, email, hashedPassword, telephone, adresse1, adresse2,
      cp, ville, pays, naissance, contactUrgence, sexe, nbEnfant
    );

    const sql = `INSERT INTO User (
      nom, prenom, email, password, telephone, adresse1, adresse2, cp, ville, pays,
      naissance, contact_urgence, sexe, nb_enfant, role_id, date_creation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [results] = await pool.query(sql, [
      user.getNom(), user.getPrenom(), user.getEmail(), user.getPassword(), user.getTelephone(),
      user.getAdresse1(), user.getAdresse2(), user.getCp(), user.getVille(), user.getPays(),
      user.getNaissance(), user.getContactUrgence(), user.getSexe(), user.getNbEnfant(),
      user.getRoleId(), user.getDateCreation()
    ]);

    user.setId(results.insertId); // Assigner l'ID de l'utilisateur créé
    res.status(201).json(user); // Retourner l'utilisateur créé
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
  }
});

// Route pour récupérer tous les utilisateurs (simplifiée pour l'exemple)
// Protéger cette route pour que seuls les utilisateurs authentifiés puissent y accéder
app.get('/api/users', verifyToken, verifyAdmin, async (req, res) => {
  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.adresse1, u.adresse2, 
           u.cp, u.ville, u.pays, u.naissance, u.contact_urgence, u.sexe, 
           u.nb_enfant, u.role_id, r.nom AS role_nom, u.date_creation
    FROM User u
    JOIN Role r ON u.role_id = r.id
  `;
  
  try {
    const [results] = await pool.query(sql);
    res.json(results); // Retourner la liste des utilisateurs avec le nom du rôle
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});


// Route pour la connexion (login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.adresse1, u.adresse2, 
           u.cp, u.ville, u.pays, u.naissance, u.contact_urgence, u.sexe, 
           u.nb_enfant, u.role_id, r.nom AS role_nom, u.date_creation
    FROM User u
    JOIN Role r ON u.role_id = r.id
    WHERE email = ? AND password = ?
  `;
  
  try {
    const [results] = await pool.query(sql, [email, hashedPassword]);

    if (Array.isArray(results) && results.length > 0) {
      const user = results[0];
      delete user.password; // Supprimer le mot de passe de l'objet utilisateur
      const token = createToken(user); // Créer un jeton

      res.json({ message: 'Connexion réussie !', token, role: user.role_id, user }); // Retourner l'objet utilisateur sans le mot de passe
    } else {
      res.status(401).json({ message: 'Identifiants incorrects' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Route pour récupérer tous les rôles disponibles
app.get('/api/roles', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const roles = await Role.getAll();
    res.status(200).json(roles);
  } catch (err) {
    console.error("Erreur lors de la récupération des rôles :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des rôles." });
  }
});

// Route pour récupérer les utilisateurs ayant un rôle spécifique (Entreprise = 2 ou Client = 3)
// Cette route est protégée par un token pour vérifier l'authentification
app.get('/api/users/roles', verifyToken, verifyAdmin, async (req, res) => {
  // Définir le rôle 2 (Entreprise) et 3 (Client)
  const sql = 'SELECT id, nom, prenom, email, telephone, adresse1, adresse2, cp, ville, pays, naissance, contact_urgence, sexe, nb_enfant, role_id, date_creation FROM User WHERE role_id IN (2, 3, 4)';

  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

// Route pour récupérer un utilisateur spécifique par son ID, accès restreint
app.get('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  // Restreindre l'accès : soit l'utilisateur est admin, soit il récupère ses propres infos
  if (req.user.role !== 1 && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: "Accès refusé." });
  }

  // Requête SQL pour récupérer l'utilisateur avec le nom du rôle via une jointure
  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.adresse1, u.adresse2, 
           u.cp, u.ville, u.pays, u.naissance, u.contact_urgence, u.sexe, 
           u.nb_enfant, u.role_id, r.nom AS role_nom, u.date_creation
    FROM User u
    JOIN Role r ON u.role_id = r.id
    WHERE u.id = ?
  `;

  try {
    const [results] = await pool.query(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(results[0]); // Retourner l'utilisateur trouvé avec le nom du rôle
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur :", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
  }
});

// Route pour supprimer un utilisateur spécifique
app.delete('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    // Suppression de l'utilisateur de la base de données
    const sql = 'DELETE FROM User WHERE id = ?';
    const [results] = await pool.query(sql, [userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
});

// Route pour mettre à jour un utilisateur spécifique
app.put('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  const { nom, prenom, email, telephone, adresse1, adresse2, cp, ville, pays, naissance, contactUrgence, sexe, nbEnfant } = req.body;

  // Construire la requête SQL pour mettre à jour l'utilisateur
  const sql = `
    UPDATE User 
    SET 
      nom = ?, 
      prenom = ?, 
      email = ?, 
      telephone = ?, 
      adresse1 = ?, 
      adresse2 = ?, 
      cp = ?, 
      ville = ?, 
      pays = ?, 
      naissance = ?, 
      contact_urgence = ?, 
      sexe = ?, 
      nb_enfant = ?
    WHERE id = ?
  `;

  try {
    const [results] = await pool.query(sql, [
      nom, prenom, email, telephone, adresse1, adresse2, cp, ville, pays, naissance, contactUrgence, sexe, nbEnfant, userId
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Retourner l'utilisateur mis à jour
    res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
});

// Route pour récupérer toutes les catégories d'offres
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await CategorieOffre.getAll();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Erreur lors de la récupération des catégories d'offres:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des catégories d'offres." });
  }
});

// Route pour récupérer une catégorie spécifique par son ID
app.get('/api/categories/:id', async (req, res) => {
  const categorieId = req.params.id;
  try {
    const categorie = await CategorieOffre.getById(categorieId);
    res.status(200).json(categorie);
  } catch (err) {
    console.error("Erreur lors de la récupération de la catégorie d'offre:", err);
    res.status(500).json({ message: "Erreur lors de la récupération de la catégorie d'offre." });
  }
});

// Route pour mettre à jour une catégorie d'offre
app.put('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
  const categorieId = req.params.id;
  const { nom, type, duree, description, couleur, icone } = req.body;
  try {
    const updated = await CategorieOffre.updateById(categorieId, nom, type, duree, description, couleur, icone);
    if (updated) {
      res.status(200).json({ message: "Catégorie d'offre mise à jour avec succès." });
    } else {
      res.status(404).json({ message: "Catégorie d'offre non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la catégorie d'offre:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la catégorie d'offre." });
  }
});

// Route pour supprimer une catégorie d'offre
app.delete('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
  const categorieId = req.params.id;
  try {
    const deleted = await CategorieOffre.deleteById(categorieId);
    if (deleted) {
      res.status(200).json({ message: "Catégorie d'offre supprimée avec succès." });
    } else {
      res.status(404).json({ message: "Catégorie d'offre non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la suppression de la catégorie d'offre:", err);
    res.status(500).json({ message: "Erreur lors de la suppression de la catégorie d'offre" });
  }
});

// Route pour créer une nouvelle catégorie d'offre
app.post('/api/categories', verifyToken, verifyAdmin, async (req, res) => {
  const { nom, type, duree, description, couleur, icone } = req.body;
  try {
    const insertId = await CategorieOffre.create(nom, type, duree, description, couleur, icone);
    res.status(201).json({ message: 'Catégorie d\'offre créée avec succès', id: insertId });
  } catch (err) {
    console.error("Erreur lors de la création de la catégorie d'offre:", err);
    res.status(500).json({ message: "Erreur lors de la création de la catégorie d'offre." });
  }
});

// Route pour récupérer toutes les offres
app.get('/api/offres', async (req, res) => {
  try {
    const offres = await Offre.getAll();
    res.status(200).json(offres);
  } catch (err) {
    console.error("Erreur lors de la récupération des offres:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des offres." });
  }
});

// Route pour récupérer une offre spécifique par son ID
app.get('/api/offres/:id', async (req, res) => {
  const offreId = req.params.id;
  try {
    const offre = await Offre.getById(offreId);
    res.status(200).json(offre);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'offre:", err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'offre." });
  }
});

// Route pour créer une nouvelle offre
app.post('/api/offres', verifyToken, verifyAdmin, async (req, res) => {
  const { categorie_offre_id, nom, type, duree_contrat, nb_seances, prix_total, prix_mensuel, prix_semaine, prix_seance, offre_promotionnelle } = req.body;
  try {
    const insertId = await Offre.create(categorie_offre_id, nom, type, duree_contrat, nb_seances, prix_total, prix_mensuel, prix_semaine, prix_seance, offre_promotionnelle);
    res.status(201).json({ message: 'Offre créée avec succès', id: insertId });
  } catch (err) {
    console.error("Erreur lors de la création de l'offre:", err);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
});

// Route pour mettre à jour une offre
app.put('/api/offres/:id', verifyToken, verifyAdmin, async (req, res) => {
  const offreId = req.params.id;
  const { categorie_offre_id, nom, type, duree_contrat, nb_seances, prix_total, prix_mensuel, prix_semaine, prix_seance, offre_promotionnelle } = req.body;
  try {
    const updated = await Offre.updateById(offreId, categorie_offre_id, nom, type, duree_contrat, nb_seances, prix_total, prix_mensuel, prix_semaine, prix_seance, offre_promotionnelle);
    if (updated) {
      res.status(200).json({ message: "Offre mise à jour avec succès." });
    } else {
      res.status(404).json({ message: "Offre non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'offre:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'offre." });
  }
});

// Route pour supprimer une offre
app.delete('/api/offres/:id', verifyToken, verifyAdmin, async (req, res) => {
  const offreId = req.params.id;
  try {
    const deleted = await Offre.deleteById(offreId);
    if (deleted) {
      res.status(200).json({ message: "Offre supprimée avec succès." });
    } else {
      res.status(404).json({ message: "Offre non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la suppression de l'offre:", err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'offre : " });
  }
});

// Route pour créer une nouvelle relation entre un utilisateur, une catégorie d'offre et une offre
app.post('/api/user-offres', verifyToken, verifyAdmin, async (req, res) => {
  const { user_id, categorie_offre_id, offre_id } = req.body;

  // Valider que tous les champs requis sont présents
  if (!user_id || !categorie_offre_id || !offre_id) {
    return res.status(400).json({ message: "Tous les champs (user_id, categorie_offre_id, offre_id) sont requis." });
  }

  try {
    const insertId = await UserOffres.create(user_id, categorie_offre_id, offre_id);
    res.status(201).json({ message: "Relation utilisateur-offre créée avec succès", id: insertId });
  } catch (err) {
    console.error("Erreur lors de la création de la relation utilisateur-offre:", err);
    res.status(500).json({ message: "Erreur lors de la création de la relation utilisateur-offre." });
  }
});

// Route pour récupérer toutes les relations entre un utilisateur et ses offres
app.get('/api/user-offres/:user_id', verifyToken, verifyAdmin, async (req, res) => {
  const userId = req.params.user_id;

  // Restreindre l'accès : soit l'utilisateur est admin, soit il récupère ses propres infos
  if (req.user.role !== 1 && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: "Accès refusé." });
  }

  try {
    // Récupérer toutes les offres associées à l'utilisateur spécifié
    const userOffres = await UserOffres.getByUserId(userId); // Récupérer les relations utilisateur-offres

    // Récupérer les détails des offres et des catégories d'offres
    const detailedOffres = await Promise.all(userOffres.map(async (userOffre) => {
      const offre = await Offre.getById(userOffre.offre_id);
      const categorie = await CategorieOffre.getById(offre.categorie_offre_id);

      return {
        user_offre_id: userOffre.id,
        date_creation: userOffre.date_creation,
        statut_paiement: userOffre.statut_paiement,
        montant_paiement: userOffre.montant_paiement,
        offre_id: offre.id,
        offre_nom: offre.nom,
        offre_type: offre.type,
        duree_contrat: offre.duree_contrat,
        nb_seances: offre.nb_seances,
        prix_total: offre.prix_total,
        prix_mensuel: offre.prix_mensuel,
        prix_semaine: offre.prix_semaine,
        prix_seance: offre.prix_seance,
        categorie_id: categorie.id,
        categorie_nom: categorie.nom,
        categorie_description: categorie.description,
        categorie_type: categorie.type,
      };
    }));

    // Retourner les offres détaillées
    res.status(200).json(detailedOffres);
  } catch (err) {
    console.error("Erreur lors de la récupération des offres de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des offres de l'utilisateur" });
  }
});

// Route pour supprimer une relation entre un utilisateur et une offre
app.delete('/api/user-offres/:id', verifyToken, verifyAdmin, async (req, res) => {
  const userOffreId = req.params.id;

  try {
    const deleted = await UserOffres.deleteById(userOffreId);
    if (deleted) {
      res.status(200).json({ message: "Relation utilisateur-offre supprimée avec succès." });
    } else {
      res.status(404).json({ message: "Relation utilisateur-offre non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la suppression de la relation utilisateur-offre:", err);
    res.status(500).json({ message: "Erreur lors de la suppression de la relation utilisateur-offre." });
  }
});

// Route pour mettre à jour une relation entre un utilisateur et une offre
app.put('/api/user-offres/:id', verifyToken, verifyAdmin, async (req, res) => {
  const userOffreId = req.params.id;
  const { statut_paiement, montant_paiement, offre_id, categorie_offre_id } = req.body;

  // Vérifier si les champs nécessaires sont présents (au moins un champ à mettre à jour)
  if (!statut_paiement && montant_paiement === undefined && !offre_id && !categorie_offre_id) {
    return res.status(400).json({ message: "Au moins un champ à mettre à jour doit être fourni." });
  }

  try {
    // Mise à jour de la relation utilisateur-offre dans la base de données
    const updated = await UserOffres.updateById(userOffreId, {
      statut_paiement,
      montant_paiement,
      offre_id,
      categorie_offre_id,
    });

    if (updated) {
      res.status(200).json({ message: "Relation utilisateur-offre mise à jour avec succès." });
    } else {
      res.status(404).json({ message: "Relation utilisateur-offre non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la relation utilisateur-offre:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la relation utilisateur-offre." });
  }
});

// Route pour obtenir toutes les séances
app.get('/api/seances', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const seances = await Seance.getAll();
    res.status(200).json(seances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir une séance par ID
app.get('/api/seances/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const seance = await Seance.getById(id);
    res.status(200).json(seance);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Route pour obtenir les séances par user_offre_id
app.get('/api/seances/user-offre/:userOffreId', verifyToken, verifyAdmin, async (req, res) => {
  const { userOffreId } = req.params;
  try {
    const seances = await Seance.getByUserOffreId(userOffreId);
    res.status(200).json(seances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer une nouvelle séance
app.post('/api/seances', verifyToken, verifyAdmin, async (req, res) => {
  const { userOffreId, description } = req.body;
  try {
    const seanceId = await Seance.create(userOffreId, description);
    res.status(201).json({ message: 'Séance ajoutée avec succès.', seanceId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour mettre à jour une séance
app.put('/api/seances/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const updated = await Seance.updateById(id, description);
    if (updated) {
      res.status(200).json({ message: 'Séance mise à jour avec succès.' });
    } else {
      res.status(404).json({ message: 'Séance non trouvée.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer une séance
app.delete('/api/seances/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Seance.deleteById(id);
    if (deleted) {
      res.status(200).json({ message: 'Séance supprimée avec succès.' });
    } else {
      res.status(404).json({ message: 'Séance non trouvée.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route protégée qui nécessite un utilisateur authentifié
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Bienvenue dans la zone protégée !', user: req.user });
});

// Exemple de route réservée aux administrateurs
app.get('/api/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Bienvenue dans la section administrateur.' });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});