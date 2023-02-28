const db = require("../database/connect");

const UserRating = {
  create: function (userRating, callback) {
    const { user, rating, rater } = userRating;
    console.log(user);
    db.query(
      "INSERT INTO user_rating (user_id, rating,rater_id) VALUES (?, ?,?)",
      [user, rating, rater],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result.insertId);
      }
    );
  },
  update: function (userRating, callback) {
    // get the user's existing rating
    const { user, rating, rater } = userRating;
    db.query(
      "SELECT * FROM user_rating WHERE user_id = ?",
      [user],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length === 0) {
          db.query(
            "INSERT INTO user_rating (user_id, rating,rater_id) VALUES (?, ?,?)",
            [user, rating, rater],
            function (err, result) {
              if (err) return callback(err, null);
              callback(null, result.insertId);
            }
          );
        } else {
          db.query(
            "UPDATE user_rating SET rating = ? WHERE user_id = ?",
            [rating, user],
            function (err, result) {
              if (err) return callback(err, null);
              callback(null, result);
            }
          );
        }

        // update the user's rating

        // update the database
      }
    );
  },

  delete: function (userId, callback) {
    db.query(
      "DELETE FROM user_rating WHERE rater_id = ?",
      [userId],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result);
      }
    );
  },

  getAverageRatingByUserId: function (userId, callback) {
    db.query(
      "SELECT AVG(rating) as avg_rating FROM user_rating WHERE user_id = ?",
      [userId],
      function (err, results) {
        if (err) return callback(err, null);
        callback(null, results[0].avg_rating);
      }
    );
  },

  getAllByUser: function (userId, callback) {
    db.query(
      "SELECT * FROM user_rating WHERE rater_id=?",
      [userId],
      function (err, results) {
        if (err) return callback(err, null);
        callback(null, results);
      }
    );
  },

  getById: function (id, callback) {
    db.query(
      "SELECT * FROM user_rating WHERE id=?",
      [id],
      function (err, results) {
        if (err) return callback(err, null);
        callback(null, results);
      }
    );
  },
};

module.exports = UserRating;
