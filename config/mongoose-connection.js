const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/codeAlphaEcom")
.then(function(){
    console.log('connected to mongoose')
})
.catch(function(err){
console.log(err)
});

const db = mongoose.connection;

module.exports = db;