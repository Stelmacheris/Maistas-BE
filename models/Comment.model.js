const db = require("../database/connect");

const Comment = {
  create: function (comment, callback) {
    const { content, userId, foodAdId } = comment;
    db.query(
      "INSERT INTO comment (content,food_ad_id,user_id) VALUES (?,?,?) ",
      [content, foodAdId, userId],
      (result, err) => {
        if (err) return callback(null, null);
        callback(null, result.insertId);
      }
    );
  },

  getByFoodAd: function (foodId, callback) {
    db.query(
      "SELECT comment.id, comment.user_id, content,user.username, comment.created_at FROM comment INNER JOIN user ON comment.user_id = user.id WHERE food_ad_id=?",
      [foodId],
      (err, comments) => {
        if (err) return callback(null, null);
        callback(null, comments);
      }
    );
  },

  getById: function (commentId, callback) {
    db.query(
      "SELECT * FROM comment WHERE id=?",
      [commentId],
      (err, comment) => {
        console.log(comment);
        if (err) return callback(null, null);
        callback(null, comment[0]);
      }
    );
  },

  update: function (id, content, callback) {
    db.query(
      "UPDATE comment SET content = ? WHERE id = ?",
      [content, id],
      (err, result) => {
        if (err) return callback(null, null);
        callback(null, result);
      }
    );
  },

  delete: function (id, callback) {
    db.query("DELETE FROM comment WHERE id=?", [id], (err, result) => {
      if (err) return callback(null, null);
      callback(null, result);
    });
  },
};

module.exports = Comment;
