"use strict";

const { User } = require("../models/user");

exports.getUserByEmail = (db, email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";

    db.get(query, email, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (!row) {
        resolve(null);
        return;
      }

      resolve(User.fromJSON(row));
    });
  });
};

exports.getUserByID = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE id = ?";

    db.get(query, userId, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(User.fromJSON(row));
    });
  });
};
