// const mongoose = require('mongoose');

// const cartSchema =  mongoose.Schema({
//     name:{
//         type:String,
//         required: true,
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',  // Referencing the User model
//         required: true,
//     },
//     items: [
//         {
//             productId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',  // Referencing the Product model
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 default: 1,  // Default quantity is 1
//             },
//         }
//     ],
//     totalPrice: {
//         type: Number,
//         default: 0,  // This will be updated when items are added or removed
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Cart', cartSchema);
