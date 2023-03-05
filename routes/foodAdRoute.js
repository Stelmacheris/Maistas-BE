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
    return res.json("bad credentials");
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

router.get("/", function (req, res, next) {
  const foodTypes = req.query.foodTypes ? req.query.foodTypes.split(",") : null;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  FoodAd.filterByFoodTypes(
    function (err, foodAds) {
      if (err) return next(err);

      // Count the total number of rows
      const totalCount = foodAds.length;

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalCount / limit);

      // Create a pagination object
      const pagination = {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      };

      // Get the current page's rows
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentRows = foodAds.slice(startIndex, endIndex);

      // Send the response
      res.json({
        pagination: pagination,
        data: currentRows,
      });
    },
    foodTypes,
    page,
    limit
  );
});

router.get("/mine", auth, (req, res) => {
  FoodAd.filterByUser(req.user.id, (err, results) => {
    if (err) return res.sendStatus(500);
    return res.json(results);
  });
});

router.get("/:id", auth, function (req, res) {
  const id = req.params.id;
  FoodAd.getById(id, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ error: "Food ad not found" });
    res.json(result);
  });
});

router.put("/:id", auth, upload.single("images"), function (req, res, next) {
  const foodAdId = req.params.id;
  const { title, description, expiration_date, food_type } = JSON.parse(
    req.body.body
  );
  const updated_at = new Date();

  if (!title || !description || !expiration_date || !updated_at || !food_type) {
    return res.json("bad credentials");
  }

  const updatedFoodAd = {
    title,
    description,
    expiration_date,
    updated_at,
    food_type,
  };

  // Call the update method on the food ad model with a callback function
  FoodAd.update({ id: foodAdId }, updatedFoodAd, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message });
    }

    console.log(`Food ad ${foodAdId} updated`);
    Image.deleteByFoodAdId(foodAdId, (err, result) => {
      if (err) return res.sendStatus(500);
      console.log(result);
    });
    if (req.file) {
      const { filename, mimetype, size } = req.file;

      // Create a new image object
      const newImage = {
        filename,
        mimetype,
        size,
        created_at: updated_at,
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
    }

    return res
      .status(200)
      .json({ success: true, message: "Food ad updated successfully" });
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
