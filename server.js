const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const request = require("supertest");
app.use(express.json());
app.use(
  cors({
    origin: ["*"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoutes);
app.get("/", (req, res) => {
  req.json({ message: "Hello world" });
});

const newUser = {
  username: "testuegergser",
  email: "testergerguser@test.com",
  password: "testpasswWord",
  address: "123 Main St",
  city: "Anytown",
  created_at: new Date(),
};

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;
