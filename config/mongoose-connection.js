const mongoose = require('mongoose');
 const mongoURI = "mongodb+srv://ShopEase:ShopEase@shopease.s0h7l.mongodb.net/ShopEase"
//  mongodb://127.0.0.1:27017/ShopEaseMajorProject
//  
mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(function(){
    console.log('connected to mongoose')
    
})
.catch(function(err){
console.log(err.message)
});

const db = mongoose.connection;

module.exports = db;