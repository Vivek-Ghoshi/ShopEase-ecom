const mongoose = require('mongoose');
 const mongoURI = "mongodb+srv://thakursaabg01:<Vi12ve23>@shopease.s0h7l.mongodb.net/"
 
mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(function(){
    console.log('connected to mongoose')
    
})
.catch(function(err){
console.log(err)
});

const db = mongoose.connection;

module.exports = db;