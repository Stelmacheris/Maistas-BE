const express = require("express");
const router = express.Router();
const auth = require("../verify/verify");
const Notification = require("../models/Notification.model");

router.post("/", auth, (req, res) => {
  const newNotification = {
    userId: req.user.id,
    createdAt: new Date(),
    foodType: req.body.foodType,
  };
  Notification.findByUserId(req.user.id, (err, result) => {
    if (err) return res.status(500).send("Error getting notifications");

    // Check if there is already a notification with the same foodType for the current user
    const existingNotification = result.find((notification) => {
      return notification.food_type === newNotification.foodType;
    });

    if (existingNotification) {
      return res.status(400).send("Notification already exists");
    } else {
      Notification.create(newNotification, (err, result) => {
        if (err) return res.status(500).json("Error creating notification");
        return res.json(`Notification created with ID: ${result}`);
      });
    }
  });
});

router.get("/", auth, (req, res) => {
  const userId = req.user.id;
  Notification.findByUserId(userId, (err, result) => {
    if (err) return res.status(500).json("Error getting notifications");
    return res.json(result);
  });
});

router.get("/all", auth, (req, res) => {
  const userId = req.user.id;
  Notification.findAll((err, result) => {
    if (err) return res.status(500).json("Error getting notifications");
    return res.json(result);
  });
});

router.delete("/:id", auth, (req, res) => {
  const notificationId = req.params.id;
  Notification.delete(notificationId, (err, result) => {
    if (err) return res.status(500).send("Error deleting notification");
    return res.send("Notification deleted successfully");
  });
});

module.exports = router;
