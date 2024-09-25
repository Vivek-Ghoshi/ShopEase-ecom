const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
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
    password: {
      type: String,
      required: true,
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
        products: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            quantity: {
              type: Number,
            },
          },
        ],
        orderDate: {
          type: Date,
          default: Date.now,
        },
        totalPrice: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
