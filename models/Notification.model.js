const db = require("../database/connect");

const Notification = {
  create: function (notification, callback) {
    db.query(
      "INSERT INTO notification(user_id,created_at,food_type) VALUES (?,?,?)",
      [notification.userId, notification.createdAt, notification.foodType],
      (err, result) => {
        if (err) return callback(null, null);
        return callback(null, result.insertId);
      }
    );
  },

  findByUserId: function (userId, callback) {
    db.query(
      "SELECT notification.*, user.email FROM notification INNER JOIN user ON user.id = notification.user_id WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return callback(null, null);
        return callback(null, result);
      }
    );
  },

  findAll: function (callback) {
    db.query(
      "SELECT notification.*, user.email FROM notification INNER JOIN user ON user.id = notification.user_id",
      (err, result) => {
        if (err) return callback(null, null);
        return callback(null, result);
      }
    );
  },

  delete: function (id, callback) {
    db.query("DELETE FROM notification WHERE id = ?", [id], (err, result) => {
      if (err) return callback(null, null);
      return callback(null, result);
    });
  },
};

module.exports = Notification;
