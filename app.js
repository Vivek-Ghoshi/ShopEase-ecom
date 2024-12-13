const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const upload = require("./config/multer-config");

const db = require("./config/mongoose-connection");
const UserModel = require("./models/userSchema");
const productModel = require("./models/productSchema");

const { isLoggedIn, isVendor, isUser } = require("./middlewares/isLoggedIn-middlewere");

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
  try {
    const user = await UserModel.findOne({ email: req.user.email }).populate('orders').populate('products');
    const products = req.user.accountType === 'vendor' ? await productModel.find({ vendor: req.user.userId }) : [];
    res.render("profile", { user, products });
  } catch (err) {
    res.send(err);
  }
});

app.get("/shop", isLoggedIn, async function (req, res) {
  
  const user = await UserModel.findOne({email : req.user.email})
  let products = await productModel.find({});
  res.render("shop", { products,user });
});

app.get("/cart", isLoggedIn,isUser, async function (req, res) {
  try {
    let user = await UserModel.findOne({ email: req.user.email }).populate(
      "cart"
    );
    res.render("cart", { user });
  } catch (err) {
    res.send(err);
  }
});

app.get("/createProduct", isLoggedIn, isVendor, function (req, res) {
  res.render("createProduct");
});

app.get("/order/:productId", isLoggedIn,isUser,async function (req, res) {

  try {
    const productId = req.params.productId;
    const email = req.user.email;
    const user = await UserModel.findOne({email});
    if(!user.orders.includes(productId)){
      user.orders.push(productId)
     await user.save();
  
    }
    res.render("order");
  

  } catch (error) {
    console.log(error.message)
  }
 
});
app.get('/order',function(req,res){
  res.render('order')
})

app.post(
  "/edit/profile",
  isLoggedIn,
  upload.single("profilePicture"),
  
  async function (req, res) {
    try {
      let user = await UserModel.findOneAndUpdate(
        { email: req.user.email },
        {
          username: req.body.username,
          bio: req.body.bio,
          profilePicture: req.file.buffer,
        }
      );
      await user.save();
      res.redirect("/profile");
    } catch (err) {
      console.log(err.message);
    }
  }
);

app.post(
  "/createProduct",
  upload.single("image"),
  isLoggedIn,
  isVendor,
  async function (req, res) {
    let { name, price, description } = req.body;
    const vendorId = req.user.userId;
    const user = await UserModel.findOne({email: req.user.email})
    let products = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      description,
      vendor: vendorId,
    });
    user.products.push(products._id)
    await user.save()
    res.redirect("/shop");
  }
);

app.post("/cart/add/:productId", isLoggedIn,isUser, async function (req, res) {
  try {
    let user = await UserModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productId);
    await user.save();
    res.redirect("/cart");
  } catch (err) {
    res.send(err);
  }
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q; 
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required." });
    }

    
    const products = await productModel.find({
      name: { $regex: query, $options: "i" }, 
    });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
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
          return res.redirect("/shop");
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
        } else return res.redirect("/shop");
      } else {
        res.status(501).send("something went wrong").res.redirect("/login");
      }
    });
  } catch (err) {
    res.send(err);
  }
});

app.get("/about",function(req,res){
  res.render('about')
});

app.get("/contact",function(req,res){
  res.render('contact')
});

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  console.log("user logged out");
  res.redirect("/login");
});

app.listen(process.env.PORT || 3000);
