const mongoose = require('mongoose');
 const mongoURI = "mongodb://127.0.0.1:27017/shopEase"
mongoose.connect(mongoURI)
.then(function(){
    console.log('connected to mongoose')
})
.catch(function(err){
console.log(err)
});

const db = mongoose.connection;

module.exports = db;