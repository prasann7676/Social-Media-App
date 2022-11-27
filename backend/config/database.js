const mongoose = require("mongoose");

exports.connectDatabase = ()=>{
    // MONGO_URI is the url for mongoDB database stored in the config.env
    mongoose.connect(process.env.MONGO_URI)
    .then(con=>console.log(`Database Connected: ${con.connection.host}`))
    .catch((err)=>console.log(err))
}