const mongoose = require('mongoose');
 const mongoURI = "mongodb+srv://ShopEase:ShopEase@shopease.s0h7l.mongodb.net/ShopEase"
 
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