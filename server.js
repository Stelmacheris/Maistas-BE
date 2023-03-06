const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const foodAdRoute = require("./routes/foodAdRoute");
const imageRoute = require("./routes/imageRoute");
const messageRoute = require("./routes/messageRoute");
const ratingRoute = require("./routes/userRatingRouter");
const commentRoute = require("./routes/commentRoute");

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));

app.use("/", authRoutes);
app.use("/food-ad", foodAdRoute);
app.use("/food-ad/:foodId/image", imageRoute);
app.use("/food-ad/:foodId/message", messageRoute);
app.use("/food-ad/:foodId/rating", ratingRoute);
app.use("/food-ad/:foodId/comment", commentRoute);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;
