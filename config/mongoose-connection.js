const mongoose = require('mongoose');
 const mongoURI = "mongodb+srv: vivek_ghoshi01:<vi12ve23>@deplyment.kulph.mongodb.net/?retryWrites=true&w=majority&appName=deplyment"
mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(function(){
    console.log('connected to mongoose')
})
.catch(function(err){
console.log(err)
});

const db = mongoose.connection;

module.exports = db;