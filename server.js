const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const request = require("supertest");
const foodAdRoute = require("./routes/foodAdRoute");
const imageRoute = require("./routes/imageRoute");
const messageRoute = require("./routes/messageRoute");
const ratingRoute = require("./routes/userRatingRouter");
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoutes);
app.use("/food-ad", foodAdRoute);
app.use("/food-ad/:foodId/image", imageRoute);
app.use("/food-ad/:foodId/message", messageRoute);
app.use("/food-ad/:foodId/rating", ratingRoute);

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
