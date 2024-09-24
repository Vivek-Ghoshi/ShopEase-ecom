const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const upload = require("./config/multer-config");

const db = require("./config/mongoose-connection");
const UserModel = require("./models/userSchema");
// const cartModel = require('./models/cartSchema');
const productModel = require("./models/productSchema");

const { isLoggedIn } = require("./middlewares/isLoggedIn-middlewere");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname + "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("register");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/profile", isLoggedIn, async function (req, res) {
  let products = await productModel.find({});

  res.render("profile", { products });
});
app.get("/cart", isLoggedIn, async function (req, res) {
  try {
    let user = await UserModel.findOne({ email: req.user.email }).populate(
      "cart"
    );

    res.render("cart", { user });
  } catch (err) {
    res.send(err);
  }
});
app.get("/createProduct", isLoggedIn, function (req, res) {
  res.render("createProduct");
});

app.get("/order", isLoggedIn, function (req, res) {
  res.render("order");
});

app.post(
  "/createProduct",
  upload.single("image"),
  isLoggedIn,
  async function (req, res) {
    let { name, price, description } = req.body;

    let products = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      description,
    });
    res.redirect("/profile");
  }
);

app.post("/cart/add/:productId", isLoggedIn, async function (req, res) {
  try {
    let user = await UserModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productId);
    await user.save();
    res.redirect("/cart");
  } catch (err) {
    res.send(err);
  }
});

app.post("/register", async function (req, res) {
  try {
    let { username, password, email, isVendor } = req.body;

    const accountType = isVendor === "on" ? "vendor" : "user";

    let user = await UserModel.findOne({ email });
    if (user) return res.send("user already registerd plz login");

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        let createdUser = await UserModel.create({
          username,
          email,
          password: hash,
          accountType: accountType,
        });
        let token = jwt.sign(
          { userId: createdUser._id, email: createdUser.email },
          "hello"
        );
        res.cookie("token", token);
        if (accountType === "vendor") {
          return res.redirect("/createProduct");
        } else {
          return res.redirect("/profile");
        }
      });
    });
  } catch (err) {
    res.send(err);
  }
});

app.post("/login", async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) return res.send(" you don't have any account plz create one");

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ userId: user._id, email: user.email }, "hello");
        res.cookie("token", token);
        if (user.accountType == "vendor") {
          return res.redirect("/createProduct");
        } else return res.redirect("/profile");
      } else {
        res.status(501).send("something went wrong").res.redirect("/login");
      }
    });
  } catch (err) {
    res.send(err);
  }
});

// login route ko handle karna h pehle dono accounts ke liye

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  console.log("user logged out");
  res.redirect("/login");
});

app.listen(process.env.PORT || 3000);
