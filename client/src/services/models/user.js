const UserRole = {
  ADMIN: "ADMIN",
};

class User {
  constructor(id, email, name, role) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }

  static fromJSON(json) {
    return new User(json.id, json.email, json.name, json.role);
  }
}

export { User as default, UserRole };
