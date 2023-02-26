const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../verify/verify");
const FoodAd = require("../models/FoodAd.model");
const Image = require("../models/image.model");

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", auth, upload.array("images"), function (req, res, next) {
  const { title, description, expiration_date, food_type } = JSON.parse(
    req.body.body
  );
  const user_id = req.user.id;
  const created_at = new Date();
  const updated_at = new Date();

  if (
    !title ||
    !description ||
    !expiration_date ||
    !created_at ||
    !updated_at ||
    !user_id ||
    !food_type
  ) {
    return res.sendStatus(400);
  }

  // Create a new food ad object
  const newFoodAd = {
    title,
    description,
    expiration_date,
    created_at,
    updated_at,
    user_id,
    food_type,
  };

  // Call the create method with a callback function
  FoodAd.create(newFoodAd, function (err, foodAdId) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message });
    }

    console.log(req.files);
    req.files?.forEach((file) => {
      const { filename, mimetype, size } = file;

      // Create a new image object
      const newImage = {
        filename,
        mimetype,
        size,
        created_at,
        food_ad_id: foodAdId,
      };

      // Call the create method on the image model with a callback function
      Image.create(newImage, function (err, imageId) {
        if (err) {
          console.log(err);
          return res.status(500).json({ success: false, message: err.message });
        }
        console.log(`Image ${imageId} created for food ad ${foodAdId}`);
      });
    });

    return res
      .status(201)
      .json({ success: true, message: "Food ad created successfully" });
  });
});

router.get("/", auth, function (req, res) {
  const foodTypes = req.body.foodTypes || null;
  FoodAd.filterByFoodTypes(function (err, foodAds) {
    if (err) return next(err);
    res.json(foodAds);
  }, foodTypes);
});

router.get("/:id", auth, function (req, res) {
  const id = req.params.id;
  FoodAd.getById(id, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ error: "Food ad not found" });
    res.json(result);
  });
});

router.put("/:id", auth, function (req, res) {
  const id = req.params.id;
  const updatedFoodAd = req.body;

  FoodAd.getById(id, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ error: "Food ad not found" });
    if (result.user_id !== req.user.id) return res.sendStatus(403);
    else {
      FoodAd.update(id, updatedFoodAd, function (err, result) {
        if (err) return res.status(500).json({ error: err.message });
        if (!result.affectedRows)
          return res.status(404).json({ error: "Food ad not found" });
        res.json({ message: "Food ad updated successfully" });
      });
    }
  });
});

router.delete("/:id", auth, function (req, res) {
  const id = req.params.id;

  FoodAd.getById(id, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ error: "Food ad not found" });
    if (result.user_id !== req.user.id) return res.sendStatus(403);
    else {
      FoodAd.delete(id, function (err, result) {
        if (err) return res.status(500).json({ error: err.message });
        if (!result.affectedRows)
          return res.status(404).json({ error: "Food ad not found" });
        else {
          return res.sendStatus(204);
        }
      });
    }
  });
});

module.exports = router;
