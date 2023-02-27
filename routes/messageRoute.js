const express = require("express");
const router = express.Router();
const Message = require("../models/Message.model");
const FoodAd = require("../models/FoodAd.model");
const auth = require("../verify/verify");
const getIds = (req) => {
  const foodId = req.originalUrl.split("/")[2];
  const imageId = req.originalUrl.split("/")[4];

  return [foodId, imageId];
};

router.post("/", auth, (req, res) => {
  const [foodId, _] = getIds(req);

  FoodAd.getById(foodId, (err, foodAd) => {
    //"INSERT INTO message (text, created_at, sender_id, receiver_id, food_ad_id) VALUES (?, ?, ?, ?, ?)",
    if (!foodAd) return res.sendStatus(404);
    if (err) return res.json(err);
    const { text } = req.body;
    if (!text) return res.sendStatus(400);
    if (req.user.id === foodAd.user_id) return res.sendStatus(400);
    const message = {
      text,
      created_at: new Date(),
      sender_id: req.user.id,
      receiver_id: foodAd.user_id,
      food_ad_id: foodAd.id,
    };
    Message.create(message, (err, result) => {
      if (err) return res.json(err);
      return res.sendStatus(201);
    });
  });
});

router.get("/", auth, (req, res) => {
  const [foodId, _] = getIds(req);

  FoodAd.getById(foodId, (err, foodAd) => {
    if (!foodAd) return res.sendStatus(404);
    if (err) return res.json(err);
    Message.getByConversation(foodAd.user_id, req.user.id, (err, messages) => {
      if (err) return res.sendStatus(500);
      if (!messages) return res.sendStatus(404);
      return res.json(messages);
    });
  });
});

router.get("/conversations", auth, (req, res) => {
  Message.getUniqueFoodAdIdsForUser(req.user.id, (err, messages) => {
    if (err) return res.sendStatus(500);
    if (!messages) return res.sendStatus(404);
    return res.json(messages);
  });
});

router.delete("/:id", auth, (req, res) => {
  const [foodId, messageId] = getIds(req);

  FoodAd.getById(foodId, (err, foodAd) => {
    if (!foodAd) return res.sendStatus(404);
    if (err) return res.json(err);
    Message.getById(messageId, (err, message) => {
      if (err) return res.sendStatus(500);
      if (!message) return res.sendStatus(400);
      if (req.user.id !== message.receiver_id) return res.sendStatus(403);
      Message.delete(messageId, (err, result) => {
        if (err) return res.sendStatus(500);
        return res.sendStatus(204);
      });
    });
  });
});

module.exports = router;
