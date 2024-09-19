const mongoose = require('mongoose');



const UserSchema = mongoose.Schema({
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
  mobileNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product",
  }],
  accountType:{
        type: String,
  },
  orders: [
    {
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  
            
          },
          quantity: {
            type: Number,
           
          }
        }
      ],
      orderDate: {
        type: Date,
        default: Date.now,
      },
      totalPrice: {
        type: Number,
      }
    }
  ]
}, {
  timestamps: true  
});

module.exports = mongoose.model('User', UserSchema);
