const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/connect");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
