const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: function() {
        return !this.googleId;
    },
      unique: true,
  },
  password: {
      type: String,
      required: function() {
          return !this.googleId;
      },
  },
  googleId: {
      type: String, 
      required: false,
  },
    name: {
      type: String,
    },
    username: {
      type: String,
     
    },
    profilePicture: {
      type: Buffer,
    },
    mobileNumber: {
      type: String,
    },
    bio:{
      type: String,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    accountType: {
      type: String,
      enum:['user','vendor'],
      default: 'user'
    },
    products:[{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Product'
    }],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        Date: Date.now()
     }
      
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
