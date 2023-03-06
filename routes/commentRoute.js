const express = require("express");
const router = express.Router();
const auth = require("../verify/verify");
const FoodAd = require("../models/FoodAd.model");
const Comment = require("../models/Comment.model");
const getIds = (req) => {
  const foodId = req.originalUrl.split("/")[2];
  const commentId = req.originalUrl.split("/")[4];

  return [foodId, commentId];
};
router.post("/", auth, (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.sendStatus(500);
  }
  const [foodAdId, commentId] = getIds(req);
  FoodAd.getById(foodAdId, (err, foodAd) => {
    if (err) return res.sendStatus(500);
    const newComment = {
      content,
      userId: req.user.id,
      foodAdId,
    };
    Comment.create(newComment, (err, result) => {
      if (err) return res.sendStatus(500);
      return res.sendStatus(201);
    });
  });
});

router.get("/", auth, (req, res) => {
  const [foodAdId, commentId] = getIds(req);
  Comment.getByFoodAd(foodAdId, (err, comments) => {
    if (err) return res.sendStatus(500);
    res.json(comments);
  });
});

router.get("/:id", auth, (req, res) => {
  const [foodAdId, commentId] = getIds(req);
  Comment.getById(commentId, (err, comment) => {
    if (err) return res.sendStatus(500);
    res.json(comment);
  });
});

router.put("/:id", auth, (req, res) => {
  const { content } = req.body;
  if (!content) return res.sendStatus(400);
  const [foodAdId, commentId] = getIds(req);
  Comment.getById(commentId, (err, comment) => {
    if (err) return res.sendStatus(500);
    if (req.user.id !== comment.user_id) return res.sendStatus(403);
    Comment.update(commentId, content, (err, result) => {
      if (err) res.sendStatus(500);
      return res.sendStatus(200);
    });
  });
});

router.delete("/:id", auth, (req, res) => {
  const [foodAdId, commentId] = getIds(req);
  Comment.getById(commentId, (err, comment) => {
    if (err) return res.sendStatus(500);
    if (req.user.id !== comment.user_id) return res.sendStatus(403);
    Comment.delete(commentId, (err, result) => {
      if (err) res.sendStatus(500);
      return res.sendStatus(204);
    });
  });
});

module.exports = router;
