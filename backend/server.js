const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const User = require('./models/User');

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
  return jwt.sign({ id: user.id, email: user.email, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Middleware pour vérifier le token et l'authentification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
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

  try {
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
app.get('/api/users', verifyToken, async (req, res) => {
  const sql = 'SELECT nom, prenom FROM User';
  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

// Route pour la connexion (login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password); // Hachage du mot de passe fourni

  const sql = 'SELECT * FROM User WHERE email = ? AND password = ?';
  try {
    const [results] = await pool.query(sql, [email, hashedPassword]);

    if (Array.isArray(results) && results.length > 0) {
      const user = results[0];
      const token = createToken(user); // Créer un jeton
      res.json({ message: 'Connexion réussie !', token });
    } else {
      res.status(401).json({ message: 'Identifiants incorrects' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
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