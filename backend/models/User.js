class User {
  constructor(
    id, nom, prenom, email, password, telephone, adresse1, adresse2,
    cp, ville, pays, naissance, contactUrgence, sexe, nbEnfant, roleId, dateCreation
  ) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.password = password;
    this.telephone = telephone;
    this.adresse1 = adresse1;
    this.adresse2 = adresse2;
    this.cp = cp;
    this.ville = ville;
    this.pays = pays;
    this.naissance = naissance;
    this.contactUrgence = contactUrgence;
    this.sexe = sexe;
    this.nbEnfant = nbEnfant;
    this.roleId = roleId || 4; // Par défaut à 4 si non fourni
    this.dateCreation = dateCreation || new Date();
  }

  // Getter et Setter pour l'ID
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }

  // Getter et Setter pour le nom
  getNom() {
    return this.nom;
  }
  setNom(nom) {
    this.nom = nom;
  }

  // Getter et Setter pour le prénom
  getPrenom() {
    return this.prenom;
  }
  setPrenom(prenom) {
    this.prenom = prenom;
  }

  // Getter et Setter pour l'email
  getEmail() {
    return this.email;
  }
  setEmail(email) {
    this.email = email;
  }

  // Getter et Setter pour le mot de passe
  getPassword() {
    return this.password;
  }
  setPassword(password) {
    this.password = password;
  }

  // Getter et Setter pour le téléphone
  getTelephone() {
    return this.telephone;
  }
  setTelephone(telephone) {
    this.telephone = telephone;
  }

  // Getter et Setter pour l'adresse 1
  getAdresse1() {
    return this.adresse1;
  }
  setAdresse1(adresse1) {
    this.adresse1 = adresse1;
  }

  // Getter et Setter pour l'adresse 2
  getAdresse2() {
    return this.adresse2;
  }
  setAdresse2(adresse2) {
    this.adresse2 = adresse2;
  }

  // Getter et Setter pour le code postal
  getCp() {
    return this.cp;
  }
  setCp(cp) {
    this.cp = cp;
  }

  // Getter et Setter pour la ville
  getVille() {
    return this.ville;
  }
  setVille(ville) {
    this.ville = ville;
  }

  // Getter et Setter pour le pays
  getPays() {
    return this.pays;
  }
  setPays(pays) {
    this.pays = pays;
  }

  // Getter et Setter pour la date de naissance
  getNaissance() {
    return this.naissance;
  }
  setNaissance(naissance) {
    this.naissance = naissance;
  }

  // Getter et Setter pour le contact d'urgence
  getContactUrgence() {
    return this.contactUrgence;
  }
  setContactUrgence(contactUrgence) {
    this.contactUrgence = contactUrgence;
  }

  // Getter et Setter pour le sexe
  getSexe() {
    return this.sexe;
  }
  setSexe(sexe) {
    this.sexe = sexe;
  }

  // Getter et Setter pour le nombre d'enfants
  getNbEnfant() {
    return this.nbEnfant;
  }
  setNbEnfant(nbEnfant) {
    this.nbEnfant = nbEnfant;
  }

  // Getter et Setter pour le rôle (par défaut à 1)
  getRoleId() {
    return this.roleId;
  }
  setRoleId(roleId) {
    this.roleId = roleId;
  }

  // Getter et Setter pour la date de création
  getDateCreation() {
    return this.dateCreation;
  }
  setDateCreation(dateCreation) {
    this.dateCreation = dateCreation;
  }
}

module.exports = User;