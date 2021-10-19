const UserRole = {
  ADMIN: "ADMIN",
};

class User {
  constructor(id, email, hash, name, role) {
    this.id = id;
    this.email = email;
    this.hash = hash;
    this.name = name;
    this.role = role;
  }

  static fromJSON(json) {
    return new User(json.id, json.email, json.hash, json.name, json.role);
  }
}

module.exports = { UserRole, User };
