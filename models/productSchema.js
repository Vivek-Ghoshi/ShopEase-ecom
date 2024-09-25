const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
   image:{
    type: Buffer,
    required:true
    },
  name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vendor:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  }, {
    timestamps: true  
  });
  
  module.exports = mongoose.model('Product', ProductSchema);
  