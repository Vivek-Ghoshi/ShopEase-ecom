const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("../models/userSchema");

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

module.exports.isVendor = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({email: req.user.email});
    if(user.accountType === 'vendor') return next();
    else return res.send('you are not a vendor')
  } catch (error) {
   console.log('error.message')
  }
};
