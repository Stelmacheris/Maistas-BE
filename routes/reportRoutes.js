const express = require("express");
const router = express.Router();
const auth = require("../verify/verify");
const FoodAd = require("../models/FoodAd.model");
const Report = require("../models/Report.model");

const getIds = (req) => {
  const foodId = req.originalUrl.split("/")[2];
  const reportId = req.originalUrl.split("/")[4];

  return [foodId, reportId];
};

router.post("/", auth, (req, res) => {
  const { reportType } = req.body;
  const [foodId, _] = getIds(req);
  if (!reportType) return res.sendStatus(400);
  const newReport = {
    foodAdId: foodId,
    userId: req.user.id,
    createdAt: new Date(),
    reportType,
  };

  Report.create(newReport, (result, err) => {
    if (err) return res.sendStatus(500);
    return res.status(201).json();
  });
});

router.get("/", auth, (req, res) => {
  Report.countOfReportsById((err, result) => {
    if (err) return res.sendStatus(500);
    return res.json(result);
  });
});

module.exports = router;
