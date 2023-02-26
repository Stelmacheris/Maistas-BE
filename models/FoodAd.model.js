const db = require("../database/connect");
const FoodAd = {
  create: function (foodAd, callback) {
    const {
      title,
      description,
      expiration_date,
      created_at,
      updated_at,
      user_id,
      food_type,
    } = foodAd;
    db.query(
      "INSERT INTO food_ad (title, description, expiration_date, created_at, updated_at, user_id, food_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        expiration_date,
        created_at,
        updated_at,
        user_id,
        food_type,
      ],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result.insertId);
      }
    );
  },

  getAll: function (callback) {
    db.query("SELECT * FROM food_ad", function (err, results) {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getById: function (id, callback) {
    db.query(
      "SELECT * FROM food_ad WHERE id = ?",
      [id],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length > 0) {
          const foodAd = results[0];
          return callback(null, foodAd);
        } else {
          return callback(null, null);
        }
      }
    );
  },

  update: function (id, newInfo, callback) {
    // get the food ad's existing information
    db.query(
      "SELECT * FROM food_ad WHERE id = ?",
      [id],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length === 0) {
          return callback(null, null);
        }
        const foodAd = results[0];

        // update the food ad's information
        const updatedFoodAd = {
          title: newInfo.title || foodAd.title,
          description: newInfo.description || foodAd.description,
          expiration_date: newInfo.expiration_date || foodAd.expiration_date,
          created_at: foodAd.created_at,
          updated_at: newInfo.updated_at || foodAd.updated_at,
          user_id: newInfo.user_id || foodAd.user_id,
          food_type: newInfo.food_type || foodAd.food_type,
        };

        // update the database
        db.query(
          "UPDATE food_ad SET title = ?, description = ?, expiration_date = ?, created_at = ?, updated_at = ?, user_id = ?, food_type = ? WHERE id = ?",
          [
            updatedFoodAd.title,
            updatedFoodAd.description,
            updatedFoodAd.expiration_date,
            updatedFoodAd.created_at,
            updatedFoodAd.updated_at,
            updatedFoodAd.user_id,
            updatedFoodAd.food_type,
            id,
          ],
          function (err, result) {
            if (err) return callback(err, null);
            callback(null, result);
          }
        );
      }
    );
  },

  delete: function (id, callback) {
    db.query("DELETE FROM food_ad WHERE id = ?", [id], function (err, result) {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
};

module.exports = FoodAd;
