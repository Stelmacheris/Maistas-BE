const express = require("express");
const router = express.Router();
const Image = require("../models/image.model");
const FoodAd = require("../models/FoodAd.model");
const auth = require("../verify/verify");

const getIds = (req) => {
  const foodId = req.originalUrl.split("/")[2];
  const imageId = req.originalUrl.split("/")[4];

  return [foodId, imageId];
};

router.get("/", (req, res) => {
  const [foodId, imageId] = getIds(req);

  FoodAd.getById(foodId, (err, foodAd) => {
    if (!foodAd) return res.sendStatus(404);
    if (err) return res.sendStatus(500);
    Image.findByFoodAdId(foodId, (err, image) => {
      if (err) return res.sendStatus(500);
      if (!image) return res.sendStatus(404);
      return res.json(image);
    });
  });
});

router.get("/:id", (req, res) => {
  const [foodId, imageId] = getIds(req);
  FoodAd.getById(foodId, (err, foodAd) => {
    if (!foodAd) return res.sendStatus(404);
    if (err) return res.sendStatus(500);
    Image.findByFoodAdIdAndId([foodId, imageId], (err, image) => {
      if (err) return res.sendStatus(500);
      if (!image) return res.sendStatus(404);
      return res.json(image[0]);
    });
  });
});

router.delete("/:id", auth, (req, res) => {
  const [foodId, imageId] = getIds(req);

  FoodAd.getById(foodId, (err, foodAd) => {
    if (foodAd.user_id !== req.user.id) return res.sendStatus(403);
    if (!foodAd) return res.sendStatus(404);
    if (err) return res.sendStatus(500);
    Image.findByFoodAdIdAndId([foodId, imageId], (err, image) => {
      if (err) return res.sendStatus(500);
      if (!image) return res.sendStatus(404);
      Image.deleteById(imageId, (err, result) => {
        if (err) return res.sendStatus(500);
        return res.sendStatus(204);
      });
    });
  });
});

module.exports = router;
