const db = require("../database/connect"); // assuming you have a database configuration file
const bcrypt = require("bcryptjs");
const User = {
  create: function (user, callback) {
    const { username, email, password, address, city, created_at } = user;
    db.query(
      "INSERT INTO user (username, email, password, address, city, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, password, address, city, created_at],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result.insertId);
      }
    );
  },

  findOne: function (params, callback) {
    db.query(
      "SELECT * FROM user WHERE email = ?",
      [params.email],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length > 0) {
          const user = results[0];
          return callback(null, user);
        } else {
          return callback(null, null);
        }
      }
    );
  },

  comparePasswords: function (password, hashedPassword, callback) {
    bcrypt.compare(password, hashedPassword, function (err, isMatch) {
      if (err) return callback(err, null);
      callback(null, isMatch);
    });
  },
};

module.exports = User;
