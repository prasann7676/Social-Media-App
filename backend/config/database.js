const mongoose = require("mongoose");

exports.connectDatabase = async ()=>{
    try{
        // MONGO_URI is the url for mongoDB database stored in the config.env
        await mongoose.connect(process.env.MONGO_URI)
        .then(con=>console.log(`Database Connected: ${con.connection.host}`))
        .catch((err)=>console.log(err))
    }
    catch(err){
        console.log(err)
    }
}
