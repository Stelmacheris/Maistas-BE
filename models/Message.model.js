const db = require("../database/connect");
const Messages = {
  create: function (message, callback) {
    const { text, created_at, sender_id, receiver_id, food_ad_id } = message;
    db.query(
      "INSERT INTO message (text, created_at, sender_id, receiver_id, food_ad_id) VALUES (?, ?, ?, ?, ?)",
      [text, created_at, sender_id, receiver_id, food_ad_id],
      function (err, result) {
        if (err) return callback(err, null);
        callback(null, result.insertId);
      }
    );
  },

  getAll: function (callback) {
    db.query("SELECT * FROM message", function (err, results) {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getById: function (id, callback) {
    db.query(
      "SELECT * FROM message WHERE id = ?",
      [id],
      function (err, results) {
        if (err) return callback(err, null);
        if (results.length > 0) {
          const message = results[0];
          return callback(null, message);
        } else {
          return callback(null, null);
        }
      }
    );
  },

  getByFoodAd: function (foodAdId, callback) {
    db.query(
      "SELECT * FROM message WHERE food_ad_id = ?",
      [foodAdId],
      function (err, results) {
        if (err) return callback(err, null);
        const messages = results.map((message) => {
          return {
            id: message.id,
            text: message.text,
            createdAt: message.created_at,
            senderId: message.sender_id,
            receiverId: message.receiver_id,
            foodAdId: message.food_ad_id,
          };
        });
        callback(null, messages);
      }
    );
  },

  getByConversation: function (userId1, userId2, callback) {
    db.query(
      "SELECT * FROM message WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC",
      [userId1, userId2, userId2, userId1],
      function (err, results) {
        if (err) return callback(err, null);
        const messages = results.map((message) => {
          return {
            id: message.id,
            text: message.text,
            createdAt: message.created_at,
            senderId: message.sender_id,
            receiverId: message.receiver_id,
            foodAdId: message.food_ad_id,
          };
        });
        callback(null, messages);
      }
    );
  },

  delete: function (id, callback) {
    db.query("DELETE FROM message WHERE id = ?", [id], function (err, result) {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
  //   SELECT DISTINCT
  //     food_ad.id, food_ad.title, food_ad.description, food_ad.expiration_date,
  //     food_ad.created_at, food_ad.updated_at, food_ad.user_id, food_ad.food_type
  //   FROM
  //     food_ad
  //     INNER JOIN message ON message.food_ad_id = food_ad.id
  //   WHERE
  //     message.receiver_id = ? OR message.sender_id = ?
  getUniqueFoodAdIdsForUser: function (userId, callback) {
    const query = `
     SELECT DISTINCT
       food_ad.id, food_ad.title, food_ad.description, food_ad.expiration_date,
       food_ad.created_at, food_ad.updated_at, food_ad.user_id, food_ad.food_type
     FROM
       food_ad
       INNER JOIN message ON message.food_ad_id = food_ad.id
     WHERE
       message.receiver_id = ? OR message.sender_id = ?
        `;
    db.query(query, [userId, userId], function (err, results) {
      if (err) return callback(err, null);
      const foodAdIds = results.map((result) => result.food_ad_id);
      callback(null, results);
    });
  },
};

module.exports = Messages;
