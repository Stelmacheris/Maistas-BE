const db = require("../database/connect");

const Image = {
  create: function (image, callback) {
    const { filename, mimetype, size, created_at, food_ad_id } = image;
    db.query(
      "INSERT INTO image (filename, mimetype, size, created_at, food_ad_id) VALUES (?, ?, ?, ?, ?)",
      [filename, mimetype, size, created_at, food_ad_id],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result.insertId);
      }
    );
  },

  findById: function (id, callback) {
    db.query("SELECT * FROM image WHERE id = ?", [id], function (err, results) {
      if (err) return callback(err, null);
      if (results.length > 0) {
        const image = results[0];
        return callback(null, image);
      } else {
        return callback(null, null);
      }
    });
  },

  findByFoodAdId: function (food_ad_id, callback) {
    db.query(
      "SELECT * FROM image WHERE food_ad_id = ?",
      [food_ad_id],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length > 0) {
          return callback(null, results);
        } else {
          return callback(null, null);
        }
      }
    );
  },

  findByFoodAdIdAndId: function ([food_ad_id, id], callback) {
    db.query(
      "SELECT * FROM image WHERE food_ad_id = ? AND id = ?",
      [food_ad_id, id],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length > 0) {
          return callback(null, results);
        } else {
          return callback(null, null);
        }
      }
    );
  },

  deleteByFoodAdId: function (food_ad_id, callback) {
    db.query(
      "DELETE FROM image WHERE food_ad_id = ?",
      [food_ad_id],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result);
      }
    );
  },

  deleteByfilename: function (filename, callback) {
    db.query(
      "DELETE FROM image WHERE filename = ?",
      [filename],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result);
      }
    );
  },
};

module.exports = Image;
