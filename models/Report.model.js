const db = require("../database/connect");

const Report = {
  create: function (report, callback) {
    console.log(report);
    db.query(
      "INSERT INTO report (food_ad_id,user_id,report_type,created_at) VALUES (?,?,?,?)",
      [report.foodAdId, report.userId, report.reportType, report.createdAt],
      (result, err) => {
        if (err) return callback(null, null);
        callback(null, result.insertId);
      }
    );
  },

  countOfReportsById: function (callback) {
    db.query(
      "SELECT food_ad_id, COUNT(DISTINCT user_id) AS report_count FROM report GROUP BY food_ad_id HAVING COUNT(DISTINCT user_id) > 4",
      (err, result) => {
        if (err) return callback(null, null);
        callback(null, result);
      }
    );
  },
};

module.exports = Report;
