const jwt = require("jsonwebtoken");
require("dotenv").config();

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        //console.log(err);
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};
module.exports = verify;
