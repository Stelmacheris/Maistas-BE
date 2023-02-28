const express = require("express");
const router = express.Router();
const auth = require("../verify/verify");
const UserRating = require("../models/UserRating.model");
const FoodAd = require("../models/FoodAd.model");
const getIds = (req) => {
  const foodId = req.originalUrl.split("/")[2];
  const ratingId = req.originalUrl.split("/")[4];

  return [foodId, ratingId];
};

router.post("/", auth, (req, res) => {
  const [foodId, ratingId] = getIds(req);

  FoodAd.getById(foodId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    if (!foodAd) return res.sendStatus(404);
    const rating = {
      user: foodAd.user_id,
      rating: req.body.rating,
      rater: req.user.id,
    };
    console.log(rating);
    UserRating.update(rating, (err, result) => {
      if (err) return res.json(err);
      if (foodAd.user_id === req.user.id) return res.sendStatus(400);
      return res.sendStatus(201);
    });
  });
});

router.get("/", auth, (req, res) => {
  const [foodId, ratingId] = getIds(req);
  FoodAd.getById(foodId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    if (!foodAd) return res.sendStatus(404);
    UserRating.getAverageRatingByUserId(req.user.id, (err, rating) => {
      if (err) return res.sendStatus(500);
      return res.json({ rating });
    });
  });
});

router.put("/", auth, (req, res) => {
  const [foodId, ratingId] = getIds(req);
  FoodAd.getById(foodId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    if (!foodAd) return res.sendStatus(404);
    UserRating.update(foodId.user_id, req.body.rating, (err, result) => {
      if (err) return res.sendStatus(500);
      return res.sendStatus(200);
    });
  });
});

router.get("/allUser", auth, (req, res) => {
  const [foodId, ratingId] = getIds(req);
  FoodAd.getById(foodId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    if (!foodAd) return res.sendStatus(404);
    UserRating.getAllByUser(req.user.id, (err, result) => {
      if (err) return res.sendStatus(500);
      return res.json(result);
    });
  });
});
router.get("/allUser/:ratingId", auth, (req, res) => {
  const [foodId, ratingId] = getIds(req);
  FoodAd.getById(foodId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    if (!foodAd) return res.sendStatus(404);
    console.log(ratingId);
    UserRating.getById(req.params.ratingId, (err, result) => {
      if (err) return res.sendStatus(500);
      return res.json(result[0]);
    });
  });
});
router.delete("/:ratingId", auth, (req, res) => {
  const [foodId, ratingId] = getIds(req);
  FoodAd.getById(foodId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    if (!foodAd) return res.sendStatus(404);
    console.log(ratingId);
    UserRating.getById(req.params.ratingId, (err, result) => {
      if (err) return res.sendStatus(500);
      console.log(req.user.id, result);
      if (req.user.id !== result[0].rater_id) return res.sendStatus(403);
      UserRating.delete(req.user.id, (err, result) => {
        if (err) return res.sendStatus(500);
        return res.sendStatus(204);
      });
    });
  });
});
module.exports = router;
