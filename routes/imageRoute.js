const express = require("express");
const router = express.Router();
const Image = require("../models/image.model");
const FoodAd = require("../models/FoodAd.model");
const auth = require("../verify/verify");

router.get("/:id", (req, res) => {
  Image.findById(req.params.id, (err, image) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving image from database.");
    } else {
      if (image) {
        res.send(image);
      } else {
        res.status(404).send("Image not found.");
      }
    }
  });
});

router.get("/food_ad/:id", (req, res) => {
  Image.findByFoodAdId(req.params.id, (err, images) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving images from database.");
    } else {
      if (images) {
        res.send(images);
      } else {
        res.status(404).send("Images not found.");
      }
    }
  });
});

// Delete images by food ad ID
router.delete("/food_ad/:id", auth, (req, res) => {
  FoodAd.getById(req.params.id, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ error: "Food ad not found" });
    if (result.user_id !== req.user.id) return res.sendStatus(403);
    else {
      Image.deleteByFoodAdId(req.params.id, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error deleting images from database.");
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

// Delete image by ID
router.delete("/:foodAdId/:id", auth, (req, res) => {
  FoodAd.getById(req.params.foodAdId, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ error: "Food ad not found" });
    if (result.user_id !== req.user.id) return res.sendStatus(403);
    else {
    }
    Image.findById(req.params.id, (err, image) => {
      if (image.food_ad_id !== result.id) {
        return res.sendStatus(404);
      }
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving image from database.");
      } else {
        if (image) {
          Image.deleteById(req.params.id, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error deleting image from database.");
            } else {
              if (result.affectedRows === 0) {
                res.status(404).send("Image not found.");
              } else {
                res.sendStatus(204);
              }
            }
          });
        } else {
          res.status(404).send("Image not found.");
        }
      }
    });
  });
});

module.exports = router;
// Update image by ID
// router.put("/:id", (req, res) => {
//   const { filename, mimetype, size, created_at, food_ad_id } = req.body;
//   const image = {
//     id: req.params.id,
//     filename,
//     mimetype,
//     size,
//     created_at,
//     food_ad_id,
//   };
//   Image.update(image, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Error updating image in database.");
//     } else {
//       if (result.affectedRows === 0) {
//         res.status(404).send("Image not found.");
//       } else {
//         res.send(result);
//       }
//     }
//   });
// });
