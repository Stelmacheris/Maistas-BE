const db = require("../database/connect");
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
      "SELECT * FROM user WHERE email = ? OR username = ?",
      [params.email, params.username],
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

  findById: function (id, callback) {
    db.query("SELECT * FROM user WHERE id = ?", [id], function (err, results) {
      if (err) return callback(err, null);
      if (results.length > 0) {
        const user = results[0];
        return callback(null, user);
      } else {
        return callback(null, null);
      }
    });
  },

  findByEmail: function (email, callback) {
    db.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
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

  update: function (id, newInfo, callback) {
    // get the user's existing information
    db.query("SELECT * FROM user WHERE id = ?", [id], function (err, results) {
      if (err) return callback(err, null);
      if (results.length === 0) {
        return callback(null, null);
      }
      const user = results[0];

      // update the user's information
      const updatedUser = {
        username: newInfo.username || user.username,
        email: newInfo.email || user.email,
        password: newInfo.password
          ? bcrypt.hashSync(newInfo.password, bcrypt.genSaltSync(10))
          : user.password,
        address: newInfo.address || user.address,
        city: newInfo.city || user.city,
      };

      // update the database
      db.query(
        "UPDATE user SET username = ?, email = ?, password = ?, address = ?, city = ? WHERE id = ?",
        [
          updatedUser.username,
          updatedUser.email,
          updatedUser.password,
          updatedUser.address,
          updatedUser.city,
          id,
        ],
        function (err, result) {
          if (err) return callback(err, null);
          callback(null, result);
        }
      );
    });
  },

  delete: function (id, callback) {
    db.query("DELETE FROM user WHERE id = ?", [id], function (err, result) {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
};

module.exports = User;
