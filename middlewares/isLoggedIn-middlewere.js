const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
  try {
    let jwtKey = "hello";
    let token = req.cookies.token;
    

    if (!token) {
      return res.redirect("/");
    } else {
      const decoded = jwt.verify(token, jwtKey);
      req.user = decoded;
      next();
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};
