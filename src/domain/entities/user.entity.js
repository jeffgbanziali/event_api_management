// Entité métier User (sans dépendance à Mongoose)

class User {
  constructor({ id, email, passwordHash, firstName, lastName, avatarUrl, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatarUrl = avatarUrl || null;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = User;

