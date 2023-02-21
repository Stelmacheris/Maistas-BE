const User = require("../models/User.model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
router.post("/register", function (req, res) {
  const { username, email, password, address, city } = req.body;
  const created_at = new Date();

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
          res.status(201).json({ message: "User created", userId });
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

      res.json({ message: "Logged in successfully", id: user.id });
    });
  });
});

module.exports = router;
