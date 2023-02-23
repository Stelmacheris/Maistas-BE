const User = require("../models/User.model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../verify/verify");
const validator = require("validator");
const passwordValidator = require("password-validator");

router.post("/register", function (req, res) {
  const { username, email, password, address, city } = req.body;
  const created_at = new Date();
  const schema = new passwordValidator();
  schema.is().min(6).is().max(16).has().uppercase().has().lowercase();

  if (!schema.validate(password)) {
    return res.status(400).json({ message: "Invalid password" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ mesage: "Invalid email" });
  }

  User.findOne(
    { $or: [{ username: username }, { email: email }] },
    function (err, user) {
      if (err) return res.status(500).json({ error: err });

      if (user) {
        // Either username or email is already taken
        const takenFields = {};
        if (user.username === username) takenFields.username = true;
        if (user.email === email) takenFields.email = true;
        return res
          .status(409)
          .json({ error: "Username or email already taken", takenFields });
      }

      bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err)
          return res.status(500).json({ error: "Error hashing password" });

        const newUser = {
          username,
          email,
          password: hashedPassword,
          address,
          city,
          created_at,
        };

        User.create(newUser, function (err, userId) {
          if (err) return res.status(500).json({ error: err });

          User.findById(userId, (err, user) => {
            res.status(201).json({ id: user.id });
          });
        });
      });
    }
  );
});

router.post("/login", function (req, res) {
  const { email, password } = req.body;

  User.findOne({ email }, function (err, user) {
    if (err)
      return res.status(500).json({ error: "Error finding user by email" });

    if (!user) return res.status(404).json({ error: "Invalid credentials" });

    User.comparePasswords(password, user.password, function (err, isMatch) {
      if (err)
        return res.status(500).json({ error: "Error comparing passwords" });

      if (!isMatch)
        return res.status(404).json({ error: "Invalid credentials1" });
      const token = jwt.sign(
        { id: user.id, type: user.type },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({ id: user.id, token });
    });
  });
});

router.put("/edit-profile", (req, res) => {
  const newUser = req.body;

  User.findOne(
    { email: newUser.email, username: newUser.username },
    function (err, user) {
      if (err) return res.status(500).json({ error: err });

      if (user) {
        // Either username or email is already taken
        return res
          .status(409)
          .json({ error: "Username or email already taken" });
      } else {
        User.update(newUser.id, newUser, (err, result) => {
          res.status(200).json({ id: newUser.id });
        });
      }
    }
  );
});

module.exports = router;
